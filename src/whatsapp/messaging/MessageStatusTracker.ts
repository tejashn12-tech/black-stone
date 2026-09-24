import { EventEmitter } from 'events';
import { proto } from '@whiskeysockets/baileys';
import { getAdminDb, isQuotaExhaustedError } from '../../config/firebase';

export type MessageDeliveryStatus =
  | 'QUEUED'
  | 'SENDING'
  | 'SENT'
  | 'SERVER_ACK'
  | 'DELIVERED'
  | 'READ'
  | 'PLAYED'
  | 'FAILED';

export interface StatusTransitionRecord {
  status: MessageDeliveryStatus;
  timestamp: string;
  reason: string;
  rawStatus?: string | number;
}

export interface TrackedMessage {
  id: string; // Internal tracking ID (e.g. msg-track-...)
  messageId: string | null; // Baileys key ID (e.g. 3EB0...)
  recipientPhone: string;
  recipientJid: string;
  recipientName: string;
  content: string;
  type: string;
  status: MessageDeliveryStatus;
  statusDisplay: string;
  sentAt: string | null;
  serverAckAt: string | null;
  deliveredAt: string | null;
  readAt: string | null;
  failedAt: string | null;
  errorMessage: string | null;
  transitions: StatusTransitionRecord[];
  memberId?: string | null;
  receiptNo?: string | null;
  createdAt: string;
  updatedAt: string;
}

const STATUS_RANKS: Record<MessageDeliveryStatus, number> = {
  QUEUED: 10,
  SENDING: 20,
  SENT: 30,
  SERVER_ACK: 40,
  DELIVERED: 50,
  READ: 60,
  PLAYED: 70,
  FAILED: 99
};

const STATUS_DISPLAY_LABELS: Record<MessageDeliveryStatus, string> = {
  QUEUED: 'Queued for Transmission',
  SENDING: 'Sending to WhatsApp...',
  SENT: 'Accepted by WhatsApp Connection',
  SERVER_ACK: 'Acknowledged by WhatsApp Server',
  DELIVERED: 'Delivered to Recipient',
  READ: 'Read by Recipient',
  PLAYED: 'Played by Recipient',
  FAILED: 'Transmission Failed'
};

/**
 * Sanitizes errors to prevent exposing internal stack traces, tokens, or system paths.
 */
export function sanitizeWhatsAppError(error: any): string {
  if (!error) return 'An unknown transmission error occurred.';
  const raw = typeof error === 'string' ? error : error?.message || String(error);
  const lower = raw.toLowerCase();

  if (lower.includes('not connected') || lower.includes('connection closed') || lower.includes('socket disconnected') || lower.includes('no socket')) {
    return 'WhatsApp connection is currently disconnected. Please connect or scan QR.';
  }
  if (lower.includes('invalid recipient') || lower.includes('invalid phone') || lower.includes('not on whatsapp') || lower.includes('jid')) {
    return 'Recipient phone number is invalid or not registered on WhatsApp.';
  }
  if (lower.includes('timeout') || lower.includes('timed out') || lower.includes('econnreset') || lower.includes('etimedout')) {
    return 'Network timeout communicating with WhatsApp servers. Please retry.';
  }
  if (lower.includes('rate-overlimit') || lower.includes('rate limit') || lower.includes('too many requests') || lower.includes('429')) {
    return 'WhatsApp message rate limit reached. Please wait a moment before sending.';
  }
  if (lower.includes('empty') || lower.includes('cannot be empty')) {
    return 'Message content cannot be empty.';
  }
  if (lower.includes('bad decrypt') || lower.includes('prekey')) {
    return 'End-to-end encryption key renegotiation in progress. Please retry.';
  }
  if (lower.includes('permission') || lower.includes('unauthorized') || lower.includes('forbidden') || lower.includes('403')) {
    return 'WhatsApp gateway rejected the message dispatch request.';
  }

  // Strip file paths, node stack frames, tokens, and database credentials
  const cleaned = raw
    .replace(/(?:\/[a-zA-Z0-9_\-\.]+)+/g, '')
    .replace(/at\s+[a-zA-Z0-9_\.\s\(\):]+/g, '')
    .replace(/[a-zA-Z0-9_\.\-]+@[a-zA-Z0-9_\.\-]+/g, '')
    .replace(/(apiKey|password|token|secret|cert|cred|key)[a-zA-Z0-9_\-=\+:]+/gi, '[REDACTED]')
    .trim();

  if (!cleaned || cleaned.length > 200 || cleaned.includes('node:')) {
    return 'Unable to deliver message due to a connection or network issue.';
  }

  return cleaned;
}

export class MessageStatusTracker extends EventEmitter {
  private static instance: MessageStatusTracker | null = null;

  // In-memory cache of tracked messages
  private messagesByInternalId: Map<string, TrackedMessage> = new Map();
  private messagesByBaileysId: Map<string, string> = new Map(); // BaileysId -> InternalId
  private messageList: TrackedMessage[] = [];
  private readonly MAX_IN_MEMORY = 300;
  private lastMessageAttempt: string | null = null;
  private lastSuccessfulMessage: string | null = null;

  private constructor() {
    super();
    this.hydrateFromFirestore().catch(() => {});
  }

  public static getInstance(): MessageStatusTracker {
    if (!MessageStatusTracker.instance) {
      MessageStatusTracker.instance = new MessageStatusTracker();
    }
    return MessageStatusTracker.instance;
  }

  /**
   * Hydrates recent messages from Firestore upon startup
   */
  private async hydrateFromFirestore(): Promise<void> {
    try {
      const db = getAdminDb();
      if (!db) return;

      const snapshot = await db.collection('whatsappLogs').limit(50).get();
      if (snapshot && snapshot.docs && snapshot.docs.length > 0) {
        for (const doc of snapshot.docs) {
          const data = doc.data() as TrackedMessage;
          if (data && data.id) {
            this.messagesByInternalId.set(data.id, data);
            if (data.messageId) {
              this.messagesByBaileysId.set(data.messageId, data.id);
            }
          }
        }
        this.rebuildMessageList();
      }
    } catch (err) {
      console.warn('[MessageStatusTracker] Hydration from Firestore notice:', (err as any)?.message);
    }
  }

  private rebuildMessageList(): void {
    this.messageList = Array.from(this.messagesByInternalId.values()).sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  /**
   * Persists message state to Firestore asynchronously
   */
  private async persistToFirestore(msg: TrackedMessage): Promise<void> {
    try {
      const db = getAdminDb();
      if (!db) return;

      const firestorePayload = {
        id: msg.id,
        messageId: msg.messageId || null,
        recipientPhone: msg.recipientPhone,
        recipientName: msg.recipientName,
        recipientJid: msg.recipientJid,
        content: msg.content,
        type: msg.type,
        status: msg.status,
        statusDisplay: msg.statusDisplay,
        sentAt: msg.sentAt || null,
        serverAckAt: msg.serverAckAt || null,
        deliveredAt: msg.deliveredAt || null,
        readAt: msg.readAt || null,
        failedAt: msg.failedAt || null,
        errorMessage: msg.errorMessage || null,
        transitions: msg.transitions,
        memberId: msg.memberId || null,
        receiptNo: msg.receiptNo || null,
        createdAt: msg.createdAt,
        updatedAt: msg.updatedAt
      };

      await db.collection('whatsappLogs').doc(msg.id).set(firestorePayload, { merge: true });
    } catch (err: any) {
      if (!isQuotaExhaustedError(err)) {
        console.warn(`[MessageStatusTracker] Firestore persist warning for ${msg.id}:`, err?.message);
      }
    }
  }

  /**
   * Step 1: Creates an initial tracked message in QUEUED status.
   * State = QUEUED
   */
  public async createQueuedMessage(params: {
    recipientPhone: string;
    recipientJid: string;
    recipientName?: string;
    content: string;
    type?: string;
    memberId?: string;
    receiptNo?: string;
  }): Promise<TrackedMessage> {
    const internalId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const initialTransition: StatusTransitionRecord = {
      status: 'QUEUED',
      timestamp: now,
      reason: 'Message queued and accepted by local transmission pipeline'
    };

    const newMsg: TrackedMessage = {
      id: internalId,
      messageId: null,
      recipientPhone: params.recipientPhone,
      recipientJid: params.recipientJid,
      recipientName: params.recipientName || params.recipientPhone,
      content: params.content,
      type: params.type || 'custom',
      status: 'QUEUED',
      statusDisplay: STATUS_DISPLAY_LABELS.QUEUED,
      sentAt: null,
      serverAckAt: null,
      deliveredAt: null,
      readAt: null,
      failedAt: null,
      errorMessage: null,
      transitions: [initialTransition],
      memberId: params.memberId || null,
      receiptNo: params.receiptNo || null,
      createdAt: now,
      updatedAt: now
    };

    this.lastMessageAttempt = now;
    this.messagesByInternalId.set(internalId, newMsg);
    this.rebuildMessageList();

    // Persist QUEUED state
    this.persistToFirestore(newMsg).catch(() => {});
    this.emit('messageStatusChange', newMsg);

    return newMsg;
  }

  /**
   * Step 2: Transitions status to SENDING (socket is actively processing payload).
   * State: QUEUED -> SENDING
   */
  public async recordSending(internalId: string): Promise<TrackedMessage | null> {
    const msg = this.messagesByInternalId.get(internalId);
    if (!msg) return null;

    const now = new Date().toISOString();
    msg.status = 'SENDING';
    msg.statusDisplay = STATUS_DISPLAY_LABELS.SENDING;
    msg.updatedAt = now;
    msg.transitions.push({
      status: 'SENDING',
      timestamp: now,
      reason: 'Transmitting payload through active WhatsApp multi-device connection stream'
    });

    this.persistToFirestore(msg).catch(() => {});
    this.emit('messageStatusChange', msg);
    return msg;
  }

  /**
   * Step 3: Transitions status to SENT when socket.sendMessage() returns successfully.
   * State: SENDING -> SENT
   * IMPORTANT: In WhatsApp protocol semantics, sendMessage returning means the message
   * frame was accepted by the connection stream. It does NOT mean delivered to recipient!
   */
  public async recordSent(internalId: string, baileysMessageId: string): Promise<TrackedMessage | null> {
    const msg = this.messagesByInternalId.get(internalId);
    if (!msg) return null;

    const now = new Date().toISOString();
    msg.status = 'SENT';
    msg.statusDisplay = STATUS_DISPLAY_LABELS.SENT;
    msg.messageId = baileysMessageId;
    msg.sentAt = now;
    msg.updatedAt = now;
    msg.transitions.push({
      status: 'SENT',
      timestamp: now,
      reason: 'Message accepted by WhatsApp connection stream (awaiting network server acknowledgment)'
    });

    this.lastSuccessfulMessage = now;
    if (baileysMessageId) {
      this.messagesByBaileysId.set(baileysMessageId, internalId);
    }

    this.persistToFirestore(msg).catch(() => {});
    this.emit('messageStatusChange', msg);
    return msg;
  }

  /**
   * Transitions status to FAILED with sanitized error message.
   * State: * -> FAILED
   */
  public async recordFailed(internalId: string, error: any): Promise<TrackedMessage | null> {
    const msg = this.messagesByInternalId.get(internalId);
    if (!msg) return null;

    const now = new Date().toISOString();
    const sanitizedError = sanitizeWhatsAppError(error);

    msg.status = 'FAILED';
    msg.statusDisplay = STATUS_DISPLAY_LABELS.FAILED;
    msg.failedAt = now;
    msg.errorMessage = sanitizedError;
    msg.updatedAt = now;
    msg.transitions.push({
      status: 'FAILED',
      timestamp: now,
      reason: `Transmission failed: ${sanitizedError}`
    });

    this.persistToFirestore(msg).catch(() => {});
    this.emit('messageStatusChange', msg);
    return msg;
  }

  /**
   * Handles incoming Baileys messages.update events
   */
  public async handleMessagesUpdate(updates: any[]): Promise<void> {
    if (!Array.isArray(updates) || updates.length === 0) return;

    for (const item of updates) {
      const keyId = item?.key?.id;
      const rawStatus = item?.update?.status;

      if (!keyId || rawStatus === undefined || rawStatus === null) continue;

      const internalId = this.messagesByBaileysId.get(keyId);
      if (!internalId) continue;

      const msg = this.messagesByInternalId.get(internalId);
      if (!msg) continue;

      const targetStatus = this.mapBaileysStatus(rawStatus);
      if (!targetStatus) continue;

      await this.advanceStatus(msg, targetStatus, `Baileys status update: ${proto.WebMessageInfo.Status[rawStatus] || rawStatus}`, rawStatus);
    }
  }

  /**
   * Handles incoming Baileys message-receipt.update events
   */
  public async handleReceiptUpdate(receipts: any[]): Promise<void> {
    if (!Array.isArray(receipts) || receipts.length === 0) return;

    for (const r of receipts) {
      const keyId = r?.key?.id;
      if (!keyId) continue;

      const internalId = this.messagesByBaileysId.get(keyId);
      if (!internalId) continue;

      const msg = this.messagesByInternalId.get(internalId);
      if (!msg) continue;

      const receipt = r?.receipt;
      if (!receipt) continue;

      // Check read timestamp
      if (receipt.readTimestamp) {
        await this.advanceStatus(msg, 'READ', 'Read receipt confirmed by recipient device (blue ticks)');
      } else if (receipt.playedTimestamp) {
        await this.advanceStatus(msg, 'PLAYED', 'Audio/media played by recipient');
      } else if (receipt.receiptTimestamp) {
        await this.advanceStatus(msg, 'DELIVERED', 'Delivery receipt confirmed by recipient device (double ticks)');
      }
    }
  }

  /**
   * Evaluates and applies status progression strictly forward
   */
  private async advanceStatus(
    msg: TrackedMessage,
    nextStatus: MessageDeliveryStatus,
    reason: string,
    rawStatus?: any
  ): Promise<void> {
    const currentRank = STATUS_RANKS[msg.status] || 0;
    const nextRank = STATUS_RANKS[nextStatus] || 0;

    // Rule: Status can never downgrade
    if (nextStatus !== 'FAILED' && nextRank <= currentRank) {
      return;
    }

    // Rule: Once a message is verified DELIVERED or READ, it cannot be reverted to FAILED
    if (nextStatus === 'FAILED' && (msg.status === 'DELIVERED' || msg.status === 'READ' || msg.status === 'PLAYED')) {
      return;
    }

    const now = new Date().toISOString();
    msg.status = nextStatus;
    msg.statusDisplay = STATUS_DISPLAY_LABELS[nextStatus];
    msg.updatedAt = now;

    if (nextStatus === 'SERVER_ACK' && !msg.serverAckAt) {
      msg.serverAckAt = now;
    } else if (nextStatus === 'DELIVERED' && !msg.deliveredAt) {
      msg.deliveredAt = now;
      if (!msg.serverAckAt) msg.serverAckAt = now;
    } else if (nextStatus === 'READ' && !msg.readAt) {
      msg.readAt = now;
      if (!msg.deliveredAt) msg.deliveredAt = now;
      if (!msg.serverAckAt) msg.serverAckAt = now;
    }

    if (['SENT', 'SERVER_ACK', 'DELIVERED', 'READ', 'PLAYED'].includes(nextStatus)) {
      this.lastSuccessfulMessage = now;
    }

    msg.transitions.push({
      status: nextStatus,
      timestamp: now,
      reason,
      rawStatus
    });

    this.persistToFirestore(msg).catch(() => {});
    this.emit('messageStatusChange', msg);
  }

  private mapBaileysStatus(status: number | string): MessageDeliveryStatus | null {
    switch (status) {
      case proto.WebMessageInfo.Status.ERROR:
      case 0:
        return 'FAILED';
      case proto.WebMessageInfo.Status.PENDING:
      case 1:
        return 'SENDING';
      case proto.WebMessageInfo.Status.SERVER_ACK:
      case 2:
        return 'SERVER_ACK';
      case proto.WebMessageInfo.Status.DELIVERY_ACK:
      case 3:
        return 'DELIVERED';
      case proto.WebMessageInfo.Status.READ:
      case 4:
        return 'READ';
      case proto.WebMessageInfo.Status.PLAYED:
      case 5:
        return 'PLAYED';
      default:
        return null;
    }
  }

  public getRecentMessages(limit = 50): TrackedMessage[] {
    return this.messageList.slice(0, limit);
  }

  public getMessage(idOrKeyId: string): TrackedMessage | null {
    if (this.messagesByInternalId.has(idOrKeyId)) {
      return this.messagesByInternalId.get(idOrKeyId)!;
    }
    const internalId = this.messagesByBaileysId.get(idOrKeyId);
    if (internalId && this.messagesByInternalId.has(internalId)) {
      return this.messagesByInternalId.get(internalId)!;
    }
    return null;
  }

  /**
   * Returns calculated diagnostic message metrics
   */
  public getDiagnosticMetrics(): {
    lastMessageAttempt: string | null;
    lastSuccessfulMessage: string | null;
    messagesQueued: number;
    messagesSending: number;
    messagesSent: number;
    messagesFailed: number;
  } {
    let queued = 0;
    let sending = 0;
    let sent = 0;
    let failed = 0;

    let latestAttempt = this.lastMessageAttempt;
    let latestSuccess = this.lastSuccessfulMessage;

    for (const msg of this.messageList) {
      if (msg.createdAt) {
        if (!latestAttempt || new Date(msg.createdAt).getTime() > new Date(latestAttempt).getTime()) {
          latestAttempt = msg.createdAt;
        }
      }

      if (msg.status === 'QUEUED') {
        queued++;
      } else if (msg.status === 'SENDING') {
        sending++;
      } else if (msg.status === 'FAILED') {
        failed++;
      } else if (['SENT', 'SERVER_ACK', 'DELIVERED', 'READ', 'PLAYED'].includes(msg.status)) {
        sent++;
        const successTime = msg.readAt || msg.deliveredAt || msg.serverAckAt || msg.sentAt;
        if (successTime && (!latestSuccess || new Date(successTime).getTime() > new Date(latestSuccess).getTime())) {
          latestSuccess = successTime;
        }
      }
    }

    return {
      lastMessageAttempt: latestAttempt,
      lastSuccessfulMessage: latestSuccess,
      messagesQueued: queued,
      messagesSending: sending,
      messagesSent: sent,
      messagesFailed: failed
    };
  }
}
