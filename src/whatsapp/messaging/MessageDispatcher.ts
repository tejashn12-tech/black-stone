import { WASocket } from '@whiskeysockets/baileys';
import {
  WhatsAppNotConnectedError,
  WhatsAppInvalidRecipientError,
  WhatsAppSendFailedError,
  WhatsAppSendInProgressError,
  WhatsAppRateLimitError
} from '../errors/WhatsAppErrors';
import { SendMessageOptions, SendMessageResult } from '../status/types';
import { MessageStatusTracker, sanitizeWhatsAppError } from './MessageStatusTracker';
import { IdempotencyManager } from '../idempotency/IdempotencyManager';
import { MessageRateLimiter } from '../ratelimit/MessageRateLimiter';

/**
 * MessageDispatcher handles formatting phone numbers into WhatsApp JIDs,
 * idempotency checks and locks via Firestore transactions, server-side rate limits & cooldowns,
 * truthful multi-state lifecycle management, and reliable message transmission over the Baileys socket.
 */
export class MessageDispatcher {
  private statusTracker: MessageStatusTracker;
  private idempotencyManager: IdempotencyManager;
  private rateLimiter: MessageRateLimiter;

  constructor(statusTracker?: MessageStatusTracker) {
    this.statusTracker = statusTracker || MessageStatusTracker.getInstance();
    this.idempotencyManager = IdempotencyManager.getInstance();
    this.rateLimiter = MessageRateLimiter.getInstance();
  }

  /**
   * Sanitizes a recipient phone string into a valid WhatsApp JID
   * e.g. "+91 81972 99039" -> "918197299039@s.whatsapp.net"
   */
  public static formatJid(phone: string): string {
    if (!phone) {
      throw new WhatsAppInvalidRecipientError(phone);
    }

    // Strip non-digits
    let clean = phone.replace(/\D/g, '');

    // If 10 digits (standard Indian mobile without country code), prepend 91
    if (clean.length === 10) {
      clean = `91${clean}`;
    }

    // If starts with 0 and has 11 digits, replace leading 0 with 91
    if (clean.length === 11 && clean.startsWith('0')) {
      clean = `91${clean.slice(1)}`;
    }

    if (clean.length < 10) {
      throw new WhatsAppInvalidRecipientError(phone);
    }

    return `${clean}@s.whatsapp.net`;
  }

  /**
   * Dispatches a message through an active Baileys socket with:
   * 1. Idempotency verification and Firestore transaction lock
   * 2. Server-side rate limit and recipient cooldown enforcement
   * 3. Truthful monotonic state progression: QUEUED -> SENDING -> SENT
   * 4. Idempotency success or failure recording (allowing controlled retry)
   */
  public async dispatch(
    socket: WASocket | null,
    options: SendMessageOptions
  ): Promise<SendMessageResult> {
    const { to, text, type, recipientName, memberId, receiptNo, idempotencyKey } = options;

    if (!text || !text.trim()) {
      throw new WhatsAppSendFailedError('Message content cannot be empty.');
    }

    const jid = MessageDispatcher.formatJid(to);
    const recipientDigits = jid.split('@')[0];
    const formattedRecipientPhone = `+${recipientDigits}`;

    // Step 1: Server-side rate limit & per-recipient cooldown check
    const rateCheck = this.rateLimiter.checkRateLimit(formattedRecipientPhone);
    if (!rateCheck.allowed) {
      throw new WhatsAppRateLimitError(
        rateCheck.reason || 'Server rate limit exceeded. Please wait before sending another message.',
        rateCheck.retryAfterSeconds || 5
      );
    }

    // Step 2: Idempotency check via Firestore transaction
    if (idempotencyKey && idempotencyKey.trim()) {
      const lockResult = await this.idempotencyManager.acquireLock(idempotencyKey.trim(), {
        recipientPhone: formattedRecipientPhone,
        recipientName,
        type
      });

      // 1. Check whether this idempotency key already has a successful message
      if (!lockResult.canSend && lockResult.reason === 'ALREADY_SENT') {
        const existing = lockResult.record;
        return {
          success: true,
          isDuplicate: true,
          messageId: existing?.messageId || undefined,
          trackingId: existing?.trackingId || undefined,
          idempotencyKey: idempotencyKey.trim(),
          status: 'SENT',
          statusDisplay: 'Already Sent (Duplicate Prevented)',
          recipientPhone: formattedRecipientPhone,
          timestamp: existing?.completedAt || new Date().toISOString()
        };
      }

      // 2. Check if currently sending -> do not send another copy
      if (!lockResult.canSend && lockResult.reason === 'IN_FLIGHT') {
        throw new WhatsAppSendInProgressError(
          lockResult.message || `Message with key "${idempotencyKey}" is currently being dispatched. Duplicate blocked.`,
          lockResult.record
        );
      }

      // 3. Retry cooldown active
      if (!lockResult.canSend && lockResult.reason === 'RETRY_COOLDOWN') {
        throw new WhatsAppRateLimitError(
          lockResult.message || 'Retry cooldown active. Please wait a moment before retrying.',
          3
        );
      }
    }

    // Step 3: Create message record in QUEUED state
    const trackedMessage = await this.statusTracker.createQueuedMessage({
      recipientPhone: formattedRecipientPhone,
      recipientJid: jid,
      recipientName: recipientName || formattedRecipientPhone,
      content: text.trim(),
      type: type || 'custom',
      memberId,
      receiptNo
    });

    // Step 4: Verify socket connection
    if (!socket) {
      const notConnErr = new WhatsAppNotConnectedError();
      await this.statusTracker.recordFailed(trackedMessage.id, notConnErr);
      if (idempotencyKey) {
        await this.idempotencyManager.markFailed(idempotencyKey.trim(), notConnErr);
      }
      throw notConnErr;
    }

    // Record rate limit reservation
    this.rateLimiter.recordDispatch(formattedRecipientPhone);

    // Step 5: Transition to SENDING
    await this.statusTracker.recordSending(trackedMessage.id);

    try {
      // Dispatch payload frame over WebSocket connection
      const result = await socket.sendMessage(jid, {
        text: text.trim()
      });

      const baileysMessageId = result?.key?.id || `msg-${Date.now()}`;

      // Step 6: Transition to SENT
      const updatedMessage = await this.statusTracker.recordSent(trackedMessage.id, baileysMessageId);

      // Step 7: Finalize idempotency as SUCCESS
      if (idempotencyKey) {
        await this.idempotencyManager.markSuccess(idempotencyKey.trim(), {
          messageId: baileysMessageId,
          trackingId: trackedMessage.id
        });
      }

      return {
        success: true,
        isDuplicate: false,
        messageId: baileysMessageId,
        trackingId: trackedMessage.id,
        idempotencyKey: idempotencyKey ? idempotencyKey.trim() : undefined,
        status: 'SENT',
        statusDisplay: updatedMessage?.statusDisplay || 'Accepted by WhatsApp Connection',
        recipientPhone: formattedRecipientPhone,
        timestamp: updatedMessage?.sentAt || new Date().toISOString(),
        transitions: updatedMessage?.transitions || []
      };
    } catch (err: any) {
      console.error('[MessageDispatcher] Error transmitting WhatsApp message:', err?.message);
      await this.statusTracker.recordFailed(trackedMessage.id, err);

      // Step 8: Finalize idempotency as FAILED (allowing controlled retry)
      if (idempotencyKey) {
        await this.idempotencyManager.markFailed(idempotencyKey.trim(), err);
      }

      const sanitizedMessage = sanitizeWhatsAppError(err);
      throw new WhatsAppSendFailedError(sanitizedMessage);
    }
  }
}
