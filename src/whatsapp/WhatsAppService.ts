import { AuthStateManager } from './auth/AuthStateManager';
import { StatusManager } from './status/StatusManager';
import { QrManager } from './qr/QrManager';
import { SocketConnectionManager } from './connection/SocketConnectionManager';
import { MessageDispatcher } from './messaging/MessageDispatcher';
import { MessageStatusTracker } from './messaging/MessageStatusTracker';
import { WhatsAppNotConnectedError } from './errors/WhatsAppErrors';
import {
  WhatsAppStatusInfo,
  QrData,
  SendMessageOptions,
  SendMessageResult
} from './status/types';

/**
 * WhatsAppService is the primary singleton facade that owns and coordinates
 * all Baileys operations for the Blackstone Fitness system.
 *
 * It enforces:
 * - Exactly ONE active Baileys socket.
 * - Server-side authentication and credential isolation.
 * - Server-side QR rendering.
 * - Clean status events and error handling.
 */
export class WhatsAppService {
  private static instance: WhatsAppService | null = null;

  private authManager: AuthStateManager;
  private statusManager: StatusManager;
  private qrManager: QrManager;
  private connectionManager: SocketConnectionManager;
  private messageDispatcher: MessageDispatcher;

  private constructor() {
    this.authManager = new AuthStateManager();
    this.statusManager = new StatusManager();
    this.qrManager = new QrManager();
    this.connectionManager = new SocketConnectionManager(
      this.authManager,
      this.statusManager,
      this.qrManager
    );
    this.messageDispatcher = new MessageDispatcher();
  }

  /**
   * Access the centralized singleton instance
   */
  public static getInstance(): WhatsAppService {
    if (!WhatsAppService.instance) {
      WhatsAppService.instance = new WhatsAppService();
    }
    return WhatsAppService.instance;
  }

  /**
   * Initializes the WhatsApp service on server boot.
   *
   * Startup behavior:
   * 1. Start WhatsApp service.
   * 2. Check whether valid authentication state exists (local storage or private vault).
   * 3. If valid authentication exists: attempt to restore the WhatsApp session.
   * 4. If restoration succeeds: status = CONNECTED.
   * 5. If authentication is genuinely invalid/logged out: status = LOGGED_OUT.
   * 6. Only then require a new QR scan.
   */
  public async initialize(): Promise<void> {
    console.log('[WhatsAppService] Step 1: Starting WhatsApp service...');

    // Step 2: Check whether valid authentication state exists
    const hasValidAuth = this.authManager.hasExistingSession();

    if (hasValidAuth) {
      console.log('[WhatsAppService] Step 2 & 3: Valid authentication state detected. Restoring WhatsApp session...');
      try {
        await this.connectionManager.connect();
        // Handled via event listeners:
        // - If restoration succeeds -> status = CONNECTED
        // - If genuinely invalid/logged out -> status = LOGGED_OUT (Step 5)
      } catch (err: any) {
        console.warn('[WhatsAppService] Session restoration encountered error:', err?.message);
      }
    } else {
      console.log('[WhatsAppService] Step 2: No saved authentication state found. System in DISCONNECTED state. QR scan required upon connect request.');
    }
  }

  /**
   * Initiates socket connection and QR generation if not paired
   */
  public async connect(): Promise<WhatsAppStatusInfo> {
    await this.connectionManager.connect();
    return this.statusManager.getStatusInfo();
  }

  /**
   * Disconnects the socket or performs complete device logout
   */
  public async disconnect(logout = false): Promise<WhatsAppStatusInfo> {
    await this.connectionManager.disconnect(logout);
    return this.statusManager.getStatusInfo();
  }

  /**
   * Returns current connection status and device metadata
   */
  public getStatus(): WhatsAppStatusInfo {
    return this.statusManager.getStatusInfo();
  }

  /**
   * Returns the server-generated Base64 PNG QR Data URL strictly from in-memory cache.
   * Rule 4: QR polling NEVER triggers socket creation or Baileys calls.
   */
  public getQr(): QrData {
    return this.qrManager.getCachedQr(this.statusManager.getState());
  }

  /**
   * Dispatches a message to a recipient phone number
   */
  public async sendMessage(options: SendMessageOptions): Promise<SendMessageResult> {
    if (!this.connectionManager.isConnected()) {
      const currentState = this.statusManager.getState();
      const stateDesc = currentState === 'RECONNECTING'
        ? 'WhatsApp connection is currently reconnecting. Please wait a moment for the connection to re-establish.'
        : `WhatsApp is not connected (current status: ${currentState}). Please connect or scan the QR code to pair.`;
      throw new WhatsAppNotConnectedError(stateDesc);
    }
    const socket = this.connectionManager.getSocket();
    return await this.messageDispatcher.dispatch(socket, options);
  }

  /**
   * Retrieves tracked message history with truthful delivery states
   */
  public getRecentMessages(limit = 50) {
    return MessageStatusTracker.getInstance().getRecentMessages(limit);
  }

  /**
   * Retrieves single tracked message by internal ID or Baileys key ID
   */
  public getMessage(idOrKeyId: string) {
    return MessageStatusTracker.getInstance().getMessage(idOrKeyId);
  }

  /**
   * Subscribes to status changes
   */
  public onStatusChange(listener: (status: WhatsAppStatusInfo) => void): () => void {
    this.statusManager.on('change', listener);
    return () => {
      this.statusManager.off('change', listener);
    };
  }

  /**
   * Rule 17: Graceful shutdown
   */
  public async shutdown(): Promise<void> {
    await this.connectionManager.shutdown();
  }

  public hasSavedSession(): boolean {
    return this.authManager.hasExistingSession();
  }

  /**
   * Evaluates comprehensive, real-time diagnostics for the WhatsApp subsystem.
   * Strictly adheres to security rules: never exposes auth keys, tokens, session paths, or secrets.
   */
  public getDiagnostics() {
    const status = this.statusManager.getStatusInfo();
    const currentState = this.statusManager.getState();
    const qrData = this.qrManager.getCachedQr(currentState);
    const messageMetrics = MessageStatusTracker.getInstance().getDiagnosticMetrics();
    const disconnectInfo = this.statusManager.getLastDisconnect();
    const lastSuccessfulConn = this.statusManager.getLastSuccessfulConnection();

    // Map Baileys connection strictly to: CONNECTED | CONNECTING | RECONNECTING | DISCONNECTED | LOGGED_OUT
    let baileysConnection: 'CONNECTED' | 'CONNECTING' | 'RECONNECTING' | 'DISCONNECTED' | 'LOGGED_OUT';
    switch (currentState) {
      case 'CONNECTED':
        baileysConnection = 'CONNECTED';
        break;
      case 'RECONNECTING':
        baileysConnection = 'RECONNECTING';
        break;
      case 'LOGGED_OUT':
        baileysConnection = 'LOGGED_OUT';
        break;
      case 'CONNECTING':
      case 'WAITING_FOR_QR':
      case 'QR_SCANNED':
      case 'AUTHENTICATING':
        baileysConnection = 'CONNECTING';
        break;
      case 'DISCONNECTED':
      case 'ERROR':
      default:
        baileysConnection = 'DISCONNECTED';
        break;
    }

    // Determine authentication state: VALID | NOT_AUTHENTICATED | UNKNOWN
    let authentication: 'VALID' | 'NOT_AUTHENTICATED' | 'UNKNOWN';
    if (currentState === 'CONNECTED') {
      authentication = 'VALID';
    } else if (currentState === 'LOGGED_OUT') {
      authentication = 'NOT_AUTHENTICATED';
    } else if (currentState === 'WAITING_FOR_QR' || currentState === 'QR_SCANNED') {
      authentication = 'NOT_AUTHENTICATED';
    } else {
      try {
        const hasSession = this.authManager.hasExistingSession();
        authentication = hasSession ? 'VALID' : 'NOT_AUTHENTICATED';
      } catch {
        authentication = 'UNKNOWN';
      }
    }

    const qrCurrentlyAvailable = qrData.qrDataUrl !== null && status.hasQr === true;

    return {
      whatsAppService: 'ONLINE' as const,
      baileysConnection,
      authentication,
      lastSuccessfulConnection: lastSuccessfulConn,
      lastDisconnect: disconnectInfo.timestamp,
      lastDisconnectReason: disconnectInfo.reason,
      lastMessageAttempt: messageMetrics.lastMessageAttempt,
      lastSuccessfulMessage: messageMetrics.lastSuccessfulMessage,
      messagesQueued: messageMetrics.messagesQueued,
      messagesSending: messageMetrics.messagesSending,
      messagesSent: messageMetrics.messagesSent,
      messagesFailed: messageMetrics.messagesFailed,
      reconnectAttempts: status.reconnectAttempt,
      qrCurrentlyAvailable,
      diagnosticsTimestamp: new Date().toISOString()
    };
  }
}
