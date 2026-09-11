import type { Request } from 'express';
import type { DecodedIdToken } from 'firebase-admin/auth';
import type { WASocket } from '@whiskeysockets/baileys';

export type WhatsAppStatus =
  | 'disconnected'
  | 'initializing'
  | 'qr_ready'
  | 'authenticating'
  | 'connected'
  | 'error';

export interface WhatsAppSession {
  gymId: string;
  socket: WASocket | null;
  status: WhatsAppStatus;
  latestQR: string | null;
  phoneNumber: string | null;
  createdAt: Date;
  lastActivityAt: Date;
  reconnectAttempts: number;
  isConnecting: boolean;
  reconnectTimer?: NodeJS.Timeout | null;
  lastDisconnectReason?: string | null;
}

export interface GymWhatsAppMetadata {
  status: WhatsAppStatus;
  phoneNumber: string | null;
  connectedAt: string | null;
  lastActivityAt: string | null;
}

export interface AuthenticatedRequest extends Request {
  user?: DecodedIdToken;
  gymId?: string;
}

export interface ConnectResponse {
  success: boolean;
  status: WhatsAppStatus;
  sessionId: string;
  qr?: string | null;
  error?: string;
}

export interface StatusResponse {
  success: boolean;
  status: WhatsAppStatus;
  qr: string | null;
  phoneNumber: string | null;
  updatedAt: string;
  error?: string;
}

export interface DisconnectResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface SendMessageRequest {
  phoneNumber: string;
  message: string;
}

export interface SendMessageResponse {
  success: boolean;
  messageId?: string;
  status?: string;
  error?: string;
}
