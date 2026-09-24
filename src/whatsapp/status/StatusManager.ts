import EventEmitter from 'events';
import {
  WhatsAppState,
  WhatsAppConnectionStatus,
  WhatsAppStatusInfo,
  StateTransitionEvent
} from './types';

/**
 * StatusManager maintains the formal connection state machine for the
 * Baileys WhatsApp integration.
 *
 * States:
 *   DISCONNECTED
 *   CONNECTING
 *   WAITING_FOR_QR
 *   QR_SCANNED
 *   AUTHENTICATING
 *   CONNECTED
 *   RECONNECTING
 *   LOGGED_OUT
 *   ERROR
 *
 * It logs EVERY transition and enforces state validation.
 */
export class StatusManager extends EventEmitter {
  private currentState: WhatsAppState = 'DISCONNECTED';
  private phoneNumber: string | null = null;
  private connectedAt: string | null = null;
  private deviceInfo: string | null = null;
  private hasQr = false;
  private qrExpiresAt: string | null = null;
  private batteryLevel: number | null = null;
  private lastError: string | null = null;
  private reconnectAttempt = 0;
  private lastSuccessfulConnection: string | null = null;
  private lastDisconnect: string | null = null;
  private lastDisconnectReason: string | null = null;
  private transitions: StateTransitionEvent[] = [];
  private updatedAt: string = new Date().toISOString();

  constructor() {
    super();
  }

  /**
   * Translates internal state to standard UI status for frontend backwards compatibility
   */
  public getLegacyStatus(): WhatsAppConnectionStatus {
    switch (this.currentState) {
      case 'CONNECTED':
        return 'connected';
      case 'RECONNECTING':
        return 'reconnecting';
      case 'LOGGED_OUT':
        return 'logged_out';
      case 'CONNECTING':
      case 'QR_SCANNED':
      case 'AUTHENTICATING':
        return 'connecting';
      case 'WAITING_FOR_QR':
        return 'qr_ready';
      case 'ERROR':
        return 'error';
      case 'DISCONNECTED':
      default:
        return 'disconnected';
    }
  }

  public getState(): WhatsAppState {
    return this.currentState;
  }

  public isConnected(): boolean {
    return this.currentState === 'CONNECTED';
  }

  /**
   * Returns true if connection is already in progress, active, or reconnecting
   */
  public isBusyOrActive(): boolean {
    return (
      this.currentState === 'CONNECTING' ||
      this.currentState === 'WAITING_FOR_QR' ||
      this.currentState === 'QR_SCANNED' ||
      this.currentState === 'AUTHENTICATING' ||
      this.currentState === 'CONNECTED' ||
      this.currentState === 'RECONNECTING'
    );
  }

  /**
   * Returns true if a new connection attempt is allowed
   */
  public canConnect(): boolean {
    return (
      this.currentState === 'DISCONNECTED' ||
      this.currentState === 'LOGGED_OUT' ||
      this.currentState === 'ERROR' ||
      this.currentState === 'RECONNECTING'
    );
  }

  /**
   * Formally transitions to a new state and logs the transition.
   */
  public transition(
    to: WhatsAppState,
    reason?: string,
    details?: {
      phoneNumber?: string | null;
      connectedAt?: string | null;
      deviceInfo?: string | null;
      hasQr?: boolean;
      qrExpiresAt?: string | null;
      lastError?: string | null;
      reconnectAttempt?: number;
    }
  ): void {
    const from = this.currentState;

    if (from === to && !details) {
      return; // No-op if identical state and no updated details
    }

    this.currentState = to;

    // Apply metadata updates
    if (details) {
      if (details.phoneNumber !== undefined) this.phoneNumber = details.phoneNumber;
      if (details.connectedAt !== undefined) this.connectedAt = details.connectedAt;
      if (details.deviceInfo !== undefined) this.deviceInfo = details.deviceInfo;
      if (details.hasQr !== undefined) this.hasQr = details.hasQr;
      if (details.qrExpiresAt !== undefined) this.qrExpiresAt = details.qrExpiresAt;
      if (details.lastError !== undefined) this.lastError = details.lastError;
      if (details.reconnectAttempt !== undefined) this.reconnectAttempt = details.reconnectAttempt;
    }

    // State-specific hygiene
    if (to === 'CONNECTED') {
      this.hasQr = false;
      this.qrExpiresAt = null;
      this.lastError = null;
      this.reconnectAttempt = 0;
      this.lastSuccessfulConnection = new Date().toISOString();
      if (!this.connectedAt) {
        this.connectedAt = this.lastSuccessfulConnection;
      }
    } else if (to === 'DISCONNECTED' || to === 'LOGGED_OUT' || to === 'RECONNECTING' || to === 'ERROR') {
      if (from === 'CONNECTED' && !this.lastDisconnect) {
        this.lastDisconnect = new Date().toISOString();
        this.lastDisconnectReason = reason || 'Connection disconnected';
      }
      this.hasQr = false;
      this.qrExpiresAt = null;
      this.connectedAt = null;
      if (to === 'DISCONNECTED' || to === 'LOGGED_OUT') {
        this.reconnectAttempt = 0;
      }
      if (to === 'LOGGED_OUT') {
        this.phoneNumber = null;
      }
    } else if (to === 'QR_SCANNED' || to === 'AUTHENTICATING') {
      // Immediately stop displaying QR when scan is detected
      this.hasQr = false;
      this.qrExpiresAt = null;
    }

    this.updatedAt = new Date().toISOString();

    const transitionRecord: StateTransitionEvent = {
      from,
      to,
      reason: reason || undefined,
      timestamp: this.updatedAt
    };

    this.transitions.unshift(transitionRecord);
    if (this.transitions.length > 20) {
      this.transitions.pop();
    }

    // Rule 20: Log every connection-state transition
    const reasonText = reason ? ` (${reason})` : '';
    console.log(`[WhatsApp State Transition] ${from} → ${to}${reasonText}`);

    this.emit('transition', transitionRecord);
    this.emit('change', this.getStatusInfo());
  }

  public setQrAvailable(expiresAt: string | null): void {
    this.hasQr = true;
    this.qrExpiresAt = expiresAt;
    this.transition('WAITING_FOR_QR', 'Baileys provided a new QR code', {
      hasQr: true,
      qrExpiresAt: expiresAt
    });
  }

  public clearQr(): void {
    this.hasQr = false;
    this.qrExpiresAt = null;
  }

  public setReconnectAttempt(attempt: number): void {
    this.reconnectAttempt = attempt;
  }

  public setLastDisconnect(timestamp: string, reason: string): void {
    this.lastDisconnect = timestamp;
    this.lastDisconnectReason = reason;
  }

  public getLastSuccessfulConnection(): string | null {
    return this.lastSuccessfulConnection || this.connectedAt;
  }

  public getLastDisconnect(): { timestamp: string | null; reason: string | null } {
    return {
      timestamp: this.lastDisconnect,
      reason: this.lastDisconnectReason
    };
  }

  public getStatusInfo(): WhatsAppStatusInfo {
    return {
      state: this.currentState,
      status: this.getLegacyStatus(),
      phoneNumber: this.phoneNumber,
      connectedAt: this.connectedAt,
      deviceInfo: this.deviceInfo,
      hasQr: this.hasQr,
      qrExpiresAt: this.qrExpiresAt,
      batteryLevel: this.batteryLevel,
      lastError: this.lastError,
      reconnectAttempt: this.reconnectAttempt,
      recentTransitions: [...this.transitions],
      updatedAt: this.updatedAt
    };
  }
}
