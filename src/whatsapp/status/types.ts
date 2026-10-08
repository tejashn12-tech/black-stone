/**
 * Status and data types for the Baileys WhatsApp integration
 * Implements strict state machine definitions and QR lifecycle types.
 */

export type WhatsAppState =
  | 'DISCONNECTED'
  | 'CONNECTING'
  | 'WAITING_FOR_QR'
  | 'QR_SCANNED'
  | 'AUTHENTICATING'
  | 'CONNECTED'
  | 'RECONNECTING'
  | 'LOGGED_OUT'
  | 'ERROR';

export type WhatsAppConnectionStatus =
  | 'disconnected'
  | 'connecting'
  | 'qr_ready'
  | 'connected'
  | 'reconnecting'
  | 'logged_out'
  | 'error';

export interface StateTransitionEvent {
  from: WhatsAppState;
  to: WhatsAppState;
  reason?: string;
  timestamp: string;
}

export interface WhatsAppStatusInfo {
  state: WhatsAppState;
  status: WhatsAppConnectionStatus;
  phoneNumber: string | null;
  connectedAt: string | null;
  deviceInfo: string | null;
  hasQr: boolean;
  qrExpiresAt: string | null;
  batteryLevel?: number | null;
  lastError: string | null;
  reconnectAttempt: number;
  recentTransitions?: StateTransitionEvent[];
  updatedAt: string;
  environment?: 'development' | 'production';
  sessionVault?: 'dev' | 'prod';
}

export interface SendMessageOptions {
  to: string;
  text?: string;
  type?: 'receipt' | 'payment_receipt' | 'expiry_reminder' | 'birthday' | 'announcement' | 'custom' | string;
  recipientName?: string;
  memberId?: string;
  receiptNo?: string;
  idempotencyKey?: string;
  // Document and attachment support
  document?: Buffer | Uint8Array;
  fileName?: string;
  mimetype?: string;
  caption?: string;
}

export type MessageDeliveryStatus =
  | 'QUEUED'
  | 'SENDING'
  | 'SENT'
  | 'SERVER_ACK'
  | 'DELIVERED'
  | 'READ'
  | 'PLAYED'
  | 'FAILED';

export interface MessageTransitionRecord {
  status: MessageDeliveryStatus;
  timestamp: string;
  reason: string;
  rawStatus?: string | number;
}

export interface SendMessageResult {
  success: boolean;
  messageId?: string;
  trackingId?: string;
  status: MessageDeliveryStatus;
  statusDisplay: string;
  recipientPhone: string;
  timestamp: string;
  error?: string;
  transitions?: MessageTransitionRecord[];
  isDuplicate?: boolean;
  idempotencyKey?: string;
}

export interface QrData {
  qrDataUrl: string | null;
  expiresAt: string | null;
  state: WhatsAppState;
}
