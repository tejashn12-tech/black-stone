import type { WASocket } from '@whiskeysockets/baileys';

export type WhatsAppConnectionStatus =
  | 'disconnected'
  | 'initializing'
  | 'qr_ready'
  | 'waiting_for_scan'
  | 'authenticating'
  | 'connected'
  | 'error';

export interface WhatsAppSession {
  gymId: string;
  socket: WASocket | null;
  status: WhatsAppConnectionStatus;
  latestQR: string | null;
  phoneNumber: string | null;
  connectedAt: string | null;
  createdAt: string;
  lastActivityAt: string;
  reconnectAttempts: number;
  qrTimer?: NodeJS.Timeout;
}

export interface WhatsAppGymFirestoreDoc {
  status: WhatsAppConnectionStatus;
  phoneNumber: string | null;
  connectedAt: string | null;
  lastActivityAt: string | null;
}

export interface SendMessagePayload {
  phoneNumber: string;
  message: string;
  memberId?: string;
  memberName?: string;
  receiptNumber?: string;
}

export interface SendMessageResult {
  success: boolean;
  messageId?: string;
  recipient?: string;
  timestamp?: string;
  error?: string;
}
