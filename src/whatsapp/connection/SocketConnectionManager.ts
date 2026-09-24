import makeWASocket, {
  WASocket,
  ConnectionState
} from '@whiskeysockets/baileys';
import pino from 'pino';
import { AuthStateManager } from '../auth/AuthStateManager';
import { StatusManager } from '../status/StatusManager';
import { QrManager } from '../qr/QrManager';
import { logWhatsAppEvent, WhatsAppLogEvent } from '../utils/whatsappLogger';
import {
  classifyDisconnect,
  calculateBackoffWithJitter,
  DisconnectCategory
} from './DisconnectClassifier';
import { MessageStatusTracker } from '../messaging/MessageStatusTracker';

/**
 * SocketConnectionManager enforces:
 * - Exactly ONE active Baileys socket.
 * - Single reconnect loop at any time (no duplicate reconnect timers or sockets).
 * - Distinguishes temporary network failure, service interruption, restart, and permanent logout.
 * - Exponential backoff with jitter (1s, 2s, 4s, 8s, 16s, max 30s).
 * - Preserves credentials on socket close / network drop. Only clears auth when definitively invalid.
 * - Resets reconnect counter after 10 seconds of verified stable connection.
 * - Mutex connection lock to prevent race conditions across tabs/requests.
 * - Full telemetry logging of every reconnect attempt and reason.
 */
export class SocketConnectionManager {
  private socket: WASocket | null = null;
  private connectionLock: Promise<WASocket> | null = null;

  private isManualDisconnect = false;
  private isExplicitLogout = false;
  private isServerShutdown = false;

  private reconnectAttempts = 0;
  private isReconnecting = false;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private stableConnectionTimer: NodeJS.Timeout | null = null;

  private readonly MAX_RECONNECT_ATTEMPTS = 6;
  private readonly STABLE_THRESHOLD_MS = 10000;

  constructor(
    private authStateManager: AuthStateManager,
    private statusManager: StatusManager,
    private qrManager: QrManager
  ) {}

  public getSocket(): WASocket | null {
    return this.socket;
  }

  public isConnected(): boolean {
    return this.statusManager.isConnected() && this.socket !== null;
  }

  /**
   * Connect method with strict mutex lock.
   * If a connection already exists or is connecting, returns existing promise / socket.
   */
  public async connect(): Promise<WASocket> {
    // If connected, do NOT create another Baileys socket
    if (this.socket && this.statusManager.isConnected()) {
      return this.socket;
    }

    // Concurrency lock / mutex
    if (this.connectionLock) {
      console.log('[SocketConnectionManager] Connection attempt in progress, reusing existing lock.');
      return this.connectionLock;
    }

    // Connect only if no active connection or transition is valid
    if (!this.statusManager.canConnect() && this.socket) {
      console.log(`[SocketConnectionManager] Connection requested while in state: ${this.statusManager.getState()}. Reusing existing socket.`);
      return this.socket;
    }

    this.connectionLock = this.executeConnect().finally(() => {
      this.connectionLock = null;
    });

    return this.connectionLock;
  }

  private async executeConnect(): Promise<WASocket> {
    this.isManualDisconnect = false;
    this.isExplicitLogout = false;
    this.isServerShutdown = false;
    this.clearReconnectTimer();

    const hasSavedSession = this.authStateManager.hasExistingSession();

    // Log CONNECTION_STARTED
    logWhatsAppEvent(WhatsAppLogEvent.CONNECTION_STARTED, {
      isRestoration: hasSavedSession,
      previousState: this.statusManager.getState(),
      reconnectAttempt: this.reconnectAttempts
    });

    // State Machine: DISCONNECTED / ERROR / LOGGED_OUT → CONNECTING
    this.statusManager.transition(
      'CONNECTING',
      hasSavedSession
        ? 'Restoring saved session credentials from server storage'
        : 'Initial connection started, awaiting Baileys socket initialization'
    );

    try {
      this.destroyCurrentSocket();

      const { state, saveCreds } = await this.authStateManager.loadAuthState();

      const loggerLevel = (process.env.WHATSAPP_LOG_LEVEL || 'silent') as pino.Level;
      const baileysLogger = pino({ level: loggerLevel });

      const newSocket = makeWASocket({
        auth: state,
        logger: baileysLogger,
        printQRInTerminal: false,
        browser: ['Blackstone Fitness Mysuru', 'Chrome', '1.0.0'],
        connectTimeoutMs: 60000,
        defaultQueryTimeoutMs: 60000,
        keepAliveIntervalMs: 25000,
        syncFullHistory: false
      });

      this.socket = newSocket;

      // Handle credential updates
      newSocket.ev.on('creds.update', saveCreds);

      // Handle connection updates
      newSocket.ev.on('connection.update', (update: Partial<ConnectionState>) => {
        this.handleConnectionUpdate(update);
      });

      // Handle message delivery status updates from WhatsApp network stream
      newSocket.ev.on('messages.update', (updates: any) => {
        MessageStatusTracker.getInstance().handleMessagesUpdate(updates).catch((err) => {
          console.warn('[SocketConnectionManager] messages.update handler warning:', err?.message);
        });
      });

      // Handle message read/delivery receipts from recipient devices
      newSocket.ev.on('message-receipt.update', (receipts: any) => {
        MessageStatusTracker.getInstance().handleReceiptUpdate(receipts).catch((err) => {
          console.warn('[SocketConnectionManager] message-receipt.update handler warning:', err?.message);
        });
      });

      return newSocket;
    } catch (err: any) {
      this.destroyCurrentSocket();
      logWhatsAppEvent(WhatsAppLogEvent.AUTH_ERROR, `Socket initialization failed: ${err?.message}`);
      this.statusManager.transition('ERROR', `Socket initialization failed: ${err?.message}`, {
        lastError: err?.message
      });
      throw err;
    }
  }

  private async handleConnectionUpdate(update: Partial<ConnectionState>): Promise<void> {
    const { connection, lastDisconnect, qr, isNewLogin, receivedPendingNotifications } = update;
    const currentState = this.statusManager.getState();

    // Once CONNECTED, never process or generate QR codes
    if (currentState === 'CONNECTED' && qr) {
      console.warn('[SocketConnectionManager] Ignored unexpected QR while in CONNECTED state.');
      return;
    }

    // Baileys provided a new QR
    if (qr) {
      try {
        await this.qrManager.handleBaileysQr(qr);
        const qrData = this.qrManager.getCachedQr('WAITING_FOR_QR');
        // State Machine: CONNECTING → WAITING_FOR_QR
        this.statusManager.transition(
          'WAITING_FOR_QR',
          'Baileys emitted a new QR code for device pairing',
          {
            hasQr: true,
            qrExpiresAt: qrData.expiresAt
          }
        );
      } catch (qrErr) {
        console.error('[SocketConnectionManager] Failed to render Baileys QR code:', qrErr);
      }
    }

    // QR Scanned detection
    if (
      (currentState === 'WAITING_FOR_QR') &&
      (isNewLogin || receivedPendingNotifications || connection === 'connecting')
    ) {
      this.qrManager.clear();
      // State Machine: WAITING_FOR_QR → QR_SCANNED → AUTHENTICATING
      this.statusManager.transition('QR_SCANNED', 'QR scan detected from mobile device', {
        hasQr: false,
        qrExpiresAt: null
      });

      this.statusManager.transition('AUTHENTICATING', 'Validating multi-device security handshake', {
        hasQr: false,
        qrExpiresAt: null
      });
    }

    // State Machine: AUTHENTICATING / CONNECTING / RECONNECTING → CONNECTED
    if (connection === 'open') {
      this.qrManager.clear();
      this.clearReconnectTimer();
      this.isReconnecting = false;

      const wasReconnecting = currentState === 'RECONNECTING' || this.reconnectAttempts > 0;

      let formattedPhone: string | null = null;
      if (this.socket?.user?.id) {
        const rawDigits = this.socket.user.id.split(':')[0].split('@')[0];
        formattedPhone = rawDigits.startsWith('91') && rawDigits.length === 12
          ? `+91 ${rawDigits.slice(2, 7)} ${rawDigits.slice(7)}`
          : `+${rawDigits}`;
      }

      // If we jumped straight from CONNECTING or WAITING_FOR_QR, advance to AUTHENTICATING then CONNECTED
      if (currentState === 'WAITING_FOR_QR' || currentState === 'QR_SCANNED') {
        this.statusManager.transition('AUTHENTICATING', 'Finalizing authentication session');
      }

      this.statusManager.transition(
        'CONNECTED',
        `WhatsApp connection established successfully for ${formattedPhone || 'BSF Admin'}`,
        {
          phoneNumber: formattedPhone,
          deviceInfo: 'Blackstone Fitness WhatsApp Gateway (Active Multi-Device)',
          hasQr: false,
          qrExpiresAt: null,
          lastError: null,
          reconnectAttempt: this.reconnectAttempts
        }
      );

      // Log CONNECTION_OPEN
      logWhatsAppEvent(WhatsAppLogEvent.CONNECTION_OPEN, {
        phoneNumber: formattedPhone,
        wasReconnecting,
        reconnectAttempts: this.reconnectAttempts
      });

      // Log RECONNECT_SUCCESS if recovered from a drop
      if (wasReconnecting) {
        logWhatsAppEvent(WhatsAppLogEvent.RECONNECT_SUCCESS, {
          phoneNumber: formattedPhone,
          recoveredAfterAttempts: this.reconnectAttempts
        });
      }

      // Stability timer: Reset reconnect counter after connection remains stable for STABLE_THRESHOLD_MS
      this.clearStableConnectionTimer();
      this.stableConnectionTimer = setTimeout(() => {
        if (this.statusManager.isConnected()) {
          if (this.reconnectAttempts > 0) {
            console.log(`[SocketConnectionManager] Connection verified stable for ${this.STABLE_THRESHOLD_MS / 1000}s. Resetting reconnect counter from ${this.reconnectAttempts} to 0.`);
          }
          this.reconnectAttempts = 0;
          this.statusManager.setReconnectAttempt(0);
        }
      }, this.STABLE_THRESHOLD_MS);
    }

    // Connection Close
    if (connection === 'close') {
      this.qrManager.clear();
      this.clearStableConnectionTimer();

      // Classify the disconnect reason definitively
      const analysis = classifyDisconnect(
        lastDisconnect,
        this.isManualDisconnect,
        this.isExplicitLogout,
        this.isServerShutdown
      );

      // Log CONNECTION_CLOSED with classification
      const closeLogPayload: Record<string, any> = {
        category: analysis.category,
        reason: analysis.humanReason
      };
      if (analysis.statusCode !== undefined) {
        closeLogPayload.statusCode = analysis.statusCode;
      }
      if (analysis.isImmediateRestart) {
        closeLogPayload.isImmediateRestart = true;
      }
      if (
        analysis.errorMessage &&
        !analysis.isImmediateRestart &&
        analysis.category !== DisconnectCategory.MANUAL_DISCONNECT &&
        analysis.category !== DisconnectCategory.SERVER_RESTART &&
        analysis.category !== DisconnectCategory.EXPLICIT_LOGOUT
      ) {
        closeLogPayload.error = analysis.errorMessage;
      }

      logWhatsAppEvent(WhatsAppLogEvent.CONNECTION_CLOSED, closeLogPayload);

      this.statusManager.setLastDisconnect(new Date().toISOString(), analysis.humanReason);

      // Case: Authentication is definitively invalid or logged out
      if (analysis.clearAuth) {
        logWhatsAppEvent(WhatsAppLogEvent.LOGGED_OUT, {
          category: analysis.category,
          statusCode: analysis.statusCode,
          reason: analysis.humanReason
        });

        logWhatsAppEvent(WhatsAppLogEvent.AUTH_ERROR, `Authentication invalidated (${analysis.statusCode || 'unlinked'}): ${analysis.humanReason}`);

        console.warn(`[SocketConnectionManager] ${analysis.category}: Purging auth state files. (${analysis.humanReason})`);
        await this.authStateManager.clearAuthSession();
        this.destroyCurrentSocket();
        this.reconnectAttempts = 0;
        this.isReconnecting = false;
        this.clearReconnectTimer();

        this.statusManager.transition('LOGGED_OUT', analysis.humanReason, {
          lastError: 'Session terminated. Admin must scan QR code to reconnect.'
        });
        return;
      }

      // Case: Manual pause by administrator
      if (analysis.category === DisconnectCategory.MANUAL_DISCONNECT || this.isManualDisconnect) {
        this.destroyCurrentSocket();
        this.reconnectAttempts = 0;
        this.isReconnecting = false;
        this.clearReconnectTimer();
        this.statusManager.transition('DISCONNECTED', analysis.humanReason, {
          lastError: null
        });
        return;
      }

      // Case: Server restart / shutdown
      if (analysis.category === DisconnectCategory.SERVER_RESTART) {
        this.destroyCurrentSocket();
        this.isReconnecting = false;
        this.clearReconnectTimer();
        this.statusManager.transition('DISCONNECTED', analysis.humanReason);
        return;
      }

      // Case: Temporary network disconnection or service interruption
      // Enforce: A socket closure must NOT automatically mean "logged out"
      // Enforce: Only one reconnect loop may exist at a time
      if (analysis.shouldReconnect) {
        if (this.isReconnecting || this.reconnectTimer) {
          console.log('[SocketConnectionManager] Reconnection loop already active. Ignoring duplicate close trigger.');
          return;
        }

        // Clean up previous socket instance immediately upon closure
        this.destroyCurrentSocket();

        let delayMs: number;
        let baseMs: number;
        let jitterMs: number;

        if (analysis.isImmediateRestart) {
          // Status code 515 (restartRequired): Normal Baileys protocol signal after credential synchronization
          // Reconnect after 1500ms to allow WhatsApp server-side socket release and prevent stream conflicts
          delayMs = 1500;
          baseMs = 1500;
          jitterMs = 0;
          console.log('[SocketConnectionManager] Baileys 515 restartRequired detected. Triggering clean stream restart in 1500ms...');
        } else {
          if (this.reconnectAttempts >= this.MAX_RECONNECT_ATTEMPTS) {
            this.isReconnecting = false;
            this.clearReconnectTimer();

            this.statusManager.transition(
              'ERROR',
              `Connection failed after ${this.MAX_RECONNECT_ATTEMPTS} attempts: ${analysis.humanReason}`,
              {
                lastError: `Connection lost: ${analysis.humanReason}. Please click Connect to retry.`,
                reconnectAttempt: this.reconnectAttempts
              }
            );
            return;
          }

          // Increment attempts and calculate exponential backoff with jitter
          this.reconnectAttempts++;
          const backoff = calculateBackoffWithJitter(this.reconnectAttempts);
          delayMs = backoff.delayMs;
          baseMs = backoff.baseMs;
          jitterMs = backoff.jitterMs;
        }

        // Log RECONNECT_STARTED
        logWhatsAppEvent(WhatsAppLogEvent.RECONNECT_STARTED, {
          attempt: this.reconnectAttempts,
          maxAttempts: this.MAX_RECONNECT_ATTEMPTS,
          delayMs,
          baseMs,
          jitterMs,
          category: analysis.category,
          isImmediateRestart: !!analysis.isImmediateRestart,
          reason: analysis.humanReason
        });

        // State Machine: CONNECTED → RECONNECTING
        const reconnectMessage = analysis.isImmediateRestart
          ? 'Restarting socket for synchronized session keys...'
          : `[${analysis.category}] ${analysis.humanReason} Retrying in ${(delayMs / 1000).toFixed(1)}s (Attempt ${this.reconnectAttempts}/${this.MAX_RECONNECT_ATTEMPTS})`;

        this.statusManager.transition(
          'RECONNECTING',
          reconnectMessage,
          {
            lastError: analysis.isImmediateRestart ? null : `Reconnecting: ${analysis.humanReason}`,
            reconnectAttempt: this.reconnectAttempts
          }
        );

        // Schedule single reconnect timer
        this.isReconnecting = true;
        this.reconnectTimer = setTimeout(async () => {
          this.reconnectTimer = null;
          console.log(`[SocketConnectionManager] Executing reconnect (${analysis.isImmediateRestart ? 'Immediate 515 restart' : `Attempt ${this.reconnectAttempts}/${this.MAX_RECONNECT_ATTEMPTS}`})...`);
          try {
            await this.authStateManager.waitForPendingCredsSave();
            await this.connect();
          } catch (reconnErr: any) {
            console.error('[SocketConnectionManager] Reconnection attempt failed:', reconnErr?.message);
          }
        }, delayMs);
      } else {
        // Fallback for unclassified disconnects: preserve credentials, state = ERROR
        this.destroyCurrentSocket();
        this.statusManager.transition('ERROR', analysis.humanReason, {
          lastError: analysis.humanReason
        });
      }
    }
  }

  /**
   * Graceful disconnect or logout
   */
  public async disconnect(logout = false): Promise<void> {
    this.isManualDisconnect = true;
    this.isExplicitLogout = logout;
    this.clearReconnectTimer();
    this.clearStableConnectionTimer();
    this.reconnectAttempts = 0;
    this.isReconnecting = false;
    this.qrManager.clear();

    if (this.socket) {
      try {
        if (logout) {
          await this.socket.logout();
          await this.authStateManager.clearAuthSession();
          logWhatsAppEvent(WhatsAppLogEvent.LOGGED_OUT, {
            category: DisconnectCategory.EXPLICIT_LOGOUT,
            reason: 'Administrator explicitly unlinked WhatsApp device.'
          });
        } else {
          this.socket.end(undefined);
        }
      } catch (err) {
        console.warn('[SocketConnectionManager] Notice during disconnect:', err);
      } finally {
        this.destroyCurrentSocket();
      }
    }

    if (logout) {
      await this.authStateManager.clearAuthSession();
      this.statusManager.setLastDisconnect(new Date().toISOString(), 'Device logged out by administrator');
      this.statusManager.transition('LOGGED_OUT', 'Device logged out by administrator');
    } else {
      this.statusManager.setLastDisconnect(new Date().toISOString(), 'Connection closed by administrator');
      this.statusManager.transition('DISCONNECTED', 'Connection closed by administrator');
    }
  }

  /**
   * Graceful server shutdown: preserves credentials
   */
  public async shutdown(): Promise<void> {
    this.isServerShutdown = true;
    this.isManualDisconnect = true;
    this.clearReconnectTimer();
    this.clearStableConnectionTimer();
    this.isReconnecting = false;
    this.qrManager.clear();

    if (this.socket) {
      try {
        this.socket.end(undefined);
        logWhatsAppEvent(WhatsAppLogEvent.CONNECTION_CLOSED, 'Server shutdown initiated');
      } catch {}
      this.destroyCurrentSocket();
    }

    // Do NOT delete credentials on shutdown!
    this.statusManager.transition('DISCONNECTED', 'Server shutdown gracefully');
  }

  private destroyCurrentSocket(): void {
    if (this.socket) {
      const sock = this.socket;
      this.socket = null;
      try {
        sock.ev.removeAllListeners('connection.update');
        sock.ev.removeAllListeners('creds.update');
        sock.ev.removeAllListeners('messages.update');
        sock.ev.removeAllListeners('message-receipt.update');
        if ((sock as any).ws) {
          try {
            (sock as any).ws.terminate?.();
          } catch {}
        }
        sock.end(undefined);
      } catch {}
    }
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.isReconnecting = false;
  }

  private clearStableConnectionTimer(): void {
    if (this.stableConnectionTimer) {
      clearTimeout(this.stableConnectionTimer);
      this.stableConnectionTimer = null;
    }
  }
}
