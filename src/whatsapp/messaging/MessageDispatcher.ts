import type { WASocket } from '@whiskeysockets/baileys';
import {
  WhatsAppNotConnectedError,
  WhatsAppInvalidRecipientError,
  WhatsAppSendFailedError,
  WhatsAppSendInProgressError,
  WhatsAppRateLimitError,
  WhatsAppConnectionTimeoutError
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

    // Handle leading 0s or extra prefixes (e.g. 091..., 0...)
    if (clean.length === 11 && clean.startsWith('0')) {
      clean = `91${clean.slice(1)}`;
    } else if (clean.length === 13 && clean.startsWith('910')) {
      clean = `91${clean.slice(3)}`;
    } else if (clean.length === 10) {
      // If 10 digits (standard Indian mobile without country code), prepend 91
      clean = `91${clean}`;
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
    const { to, text, type, recipientName, memberId, receiptNo, idempotencyKey, document, fileName, mimetype, caption } = options;

    if ((!text || !text.trim()) && !document) {
      throw new WhatsAppSendFailedError('Message content or document cannot be empty.');
    }

    const jid = MessageDispatcher.formatJid(to);
    const recipientDigits = jid.split('@')[0];
    const formattedRecipientPhone = `+${recipientDigits}`;

    // Step 1: Server-side rate limit & per-recipient cooldown check
    const isAttachment = Boolean(document || type === 'payment_receipt');
    const rateCheck = this.rateLimiter.checkRateLimit(formattedRecipientPhone, isAttachment);
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
    const displayContent = document
      ? `[Document: ${fileName || 'file.pdf'}] ${(caption || text || '').trim()}`.trim()
      : (text || '').trim();

    const trackedMessage = await this.statusTracker.createQueuedMessage({
      recipientPhone: formattedRecipientPhone,
      recipientJid: jid,
      recipientName: recipientName || formattedRecipientPhone,
      content: displayContent,
      type: type || (document ? 'payment_receipt' : 'custom'),
      memberId,
      receiptNo
    });

    // Step 4: Verify socket connection and WebSocket state
    if (!socket) {
      const notConnErr = new WhatsAppNotConnectedError();
      await this.statusTracker.recordFailed(trackedMessage.id, notConnErr);
      if (idempotencyKey) {
        await this.idempotencyManager.markFailed(idempotencyKey.trim(), notConnErr);
      }
      throw notConnErr;
    }

    const ws = (socket as any)?.ws;
    if (ws && typeof ws.readyState === 'number' && ws.readyState !== 1) {
      const notConnErr = new WhatsAppNotConnectedError(
        'WhatsApp socket is currently reconnecting or offline. Message queued.'
      );
      await this.statusTracker.recordFailed(trackedMessage.id, notConnErr);
      if (idempotencyKey) {
        await this.idempotencyManager.markFailed(idempotencyKey.trim(), notConnErr);
      }
      throw notConnErr;
    }

    // Record rate limit reservation
    this.rateLimiter.recordDispatch(formattedRecipientPhone);

    // Verify recipient existence and obtain canonical WhatsApp JID
    let targetJid = jid;
    try {
      const onWaPromise = socket.onWhatsApp(jid).catch((lookupErr) => {
        // Silently catch orphaned lookup rejection if race timeout won
        return [] as any[];
      });

      const onWa = await Promise.race([
        onWaPromise,
        new Promise<any[]>((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000))
      ]);
      if (Array.isArray(onWa)) {
        if (onWa.length === 0 || onWa[0]?.exists === false) {
          throw new WhatsAppInvalidRecipientError(
            `Recipient (${formattedRecipientPhone}) is not registered on WhatsApp.`
          );
        }
        if (onWa[0]?.jid) {
          targetJid = onWa[0].jid;
        }
      }
    } catch (verErr: any) {
      if (verErr instanceof WhatsAppInvalidRecipientError) {
        await this.statusTracker.recordFailed(trackedMessage.id, verErr);
        if (idempotencyKey) {
          await this.idempotencyManager.markFailed(idempotencyKey.trim(), verErr);
        }
        throw verErr;
      }
      // Non-fatal / timeout: proceed with targetJid
    }

    // Step 5: Transition to SENDING
    await this.statusTracker.recordSending(trackedMessage.id);

    try {
      // Dispatch payload frame over WebSocket connection to verified recipient
      let messagePayload: any;
      if (document) {
        messagePayload = {
          document: Buffer.isBuffer(document) ? document : Buffer.from(document),
          mimetype: mimetype || 'application/pdf',
          fileName: fileName || 'document.pdf',
          caption: (caption || text || '').trim() || undefined
        };
      } else {
        messagePayload = {
          text: (text || '').trim()
        };
      }

      // Robust transmission: Wrap with a timeout race and retry once on transient network timeout
      let result: any;
      let lastDispatchErr: any;
      const MAX_DISPATCH_ATTEMPTS = 2;

      for (let attempt = 1; attempt <= MAX_DISPATCH_ATTEMPTS; attempt++) {
        try {
          const sendPromise = socket.sendMessage(targetJid, messagePayload);
          result = await Promise.race([
            sendPromise,
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Timed Out')), 15000)
            )
          ]);
          lastDispatchErr = null;
          break;
        } catch (sendErr: any) {
          lastDispatchErr = sendErr;
          const isTimeout =
            sendErr?.message?.includes('Timed Out') ||
            sendErr?.message?.toLowerCase()?.includes('timeout') ||
            sendErr?.output?.statusCode === 408;

          if (isTimeout && attempt < MAX_DISPATCH_ATTEMPTS) {
            console.warn(
              `[MessageDispatcher] WhatsApp message transmission attempt ${attempt} timed out. Retrying transmission once...`
            );
            await new Promise((resolve) => setTimeout(resolve, 1000));
            continue;
          }
          break;
        }
      }

      if (lastDispatchErr) {
        throw lastDispatchErr;
      }

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
      const isNetworkTimeout =
        err?.message?.includes('Timed Out') ||
        err?.message?.toLowerCase()?.includes('timeout') ||
        err?.output?.statusCode === 408;

      if (isNetworkTimeout) {
        console.warn('[MessageDispatcher] WhatsApp message transmission timed out (network latency):', err?.message);
      } else {
        console.error('[MessageDispatcher] Error transmitting WhatsApp message:', err?.message);
      }

      await this.statusTracker.recordFailed(trackedMessage.id, err);

      // Step 8: Finalize idempotency as FAILED (allowing controlled retry)
      if (idempotencyKey) {
        await this.idempotencyManager.markFailed(idempotencyKey.trim(), err);
      }

      const sanitizedMessage = sanitizeWhatsAppError(err);
      if (isNetworkTimeout) {
        throw new WhatsAppConnectionTimeoutError(sanitizedMessage);
      }
      throw new WhatsAppSendFailedError(sanitizedMessage);
    }
  }
}
