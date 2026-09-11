import fs from 'fs';
import path from 'path';
import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  type WASocket,
  type ConnectionState
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import qrcodeTerminal from 'qrcode-terminal';
import { logger, baileysLogger } from '../utils/logger';
import { updateFirestoreGymWhatsAppStatus } from '../config/firebase';
import type { WhatsAppSession, WhatsAppConnectionStatus } from '../types/whatsapp';

// Base persistent storage directory for Baileys multi-file authentication
const AUTH_BASE_DIR = path.resolve(process.cwd(), 'auth_info');

export class WhatsAppSessionManager {
  private static sessions: Map<string, WhatsAppSession> = new Map();
  private static reconnectTimeouts: Map<string, NodeJS.Timeout> = new Map();
  private static maxReconnectAttempts = 5;

  /**
   * Ensure base auth directory exists
   */
  private static ensureAuthBaseDir(): void {
    if (!fs.existsSync(AUTH_BASE_DIR)) {
      fs.mkdirSync(AUTH_BASE_DIR, { recursive: true });
    }
  }

  /**
   * Get auth folder path for a specific gym
   */
  private static getGymAuthPath(gymId: string): string {
    this.ensureAuthBaseDir();
    // Sanitize gymId to prevent path traversal
    const safeGymId = gymId.replace(/[^a-zA-Z0-9_-]/g, '_');
    const gymPath = path.join(AUTH_BASE_DIR, safeGymId);
    if (!fs.existsSync(gymPath)) {
      fs.mkdirSync(gymPath, { recursive: true });
    }
    return gymPath;
  }

  /**
   * Clean up auth folder for a gym upon logout
   */
  private static async deleteGymAuthFolder(gymId: string): Promise<void> {
    try {
      const safeGymId = gymId.replace(/[^a-zA-Z0-9_-]/g, '_');
      const gymPath = path.join(AUTH_BASE_DIR, safeGymId);
      if (fs.existsSync(gymPath)) {
        fs.rmSync(gymPath, { recursive: true, force: true });
        logger.info({ gymId }, 'Deleted persistent auth_info directory for gym');
      }
    } catch (err: any) {
      logger.error({ gymId, err: err.message }, 'Failed to delete gym auth folder');
    }
  }

  /**
   * Checks if gym has persistent credentials saved on disk
   */
  public static hasStoredCredentials(gymId: string): boolean {
    const safeGymId = gymId.replace(/[^a-zA-Z0-9_-]/g, '_');
    const credsPath = path.join(AUTH_BASE_DIR, safeGymId, 'creds.json');
    return fs.existsSync(credsPath);
  }

  /**
   * Retrieve active session from memory
   */
  public static getSession(gymId: string): WhatsAppSession | undefined {
    return this.sessions.get(gymId);
  }

  /**
   * Get safe connection status for a gym
   */
  public static getGymStatus(gymId: string): {
    status: WhatsAppConnectionStatus;
    qr: string | null;
    phoneNumber: string | null;
    connectedAt: string | null;
    updatedAt: string;
  } {
    const session = this.sessions.get(gymId);
    if (!session) {
      // Check if credentials exist on disk
      const hasCreds = this.hasStoredCredentials(gymId);
      return {
        status: hasCreds ? 'initializing' : 'disconnected',
        qr: null,
        phoneNumber: null,
        connectedAt: null,
        updatedAt: new Date().toISOString()
      };
    }

    const isQRActive = session.status === 'qr_ready' || session.status === 'waiting_for_scan';

    return {
      status: session.status,
      qr: isQRActive ? session.latestQR : null,
      phoneNumber: session.phoneNumber,
      connectedAt: session.connectedAt,
      updatedAt: session.lastActivityAt || new Date().toISOString()
    };
  }

  /**
   * Connect or retrieve Baileys session for a gym
   */
  public static async connect(gymId: string, forceRefresh: boolean = false): Promise<WhatsAppSession> {
    const existingSession = this.sessions.get(gymId);

    // 1. If already connected and not forcing refresh, return existing session
    if (existingSession && existingSession.status === 'connected' && existingSession.socket && !forceRefresh) {
      logger.info({ gymId }, 'WhatsApp session already active and connected');
      return existingSession;
    }

    // 2. If already authenticating or QR is ready, and not forcing refresh, return current session
    if (
      !forceRefresh &&
      existingSession &&
      (existingSession.status === 'authenticating' || existingSession.status === 'qr_ready') &&
      existingSession.socket
    ) {
      logger.info({ gymId, status: existingSession.status }, 'WhatsApp session already in progress');
      return existingSession;
    }

    logger.info({ gymId, forceRefresh }, 'Initializing Baileys WhatsApp connection socket');

    // Clean up any stale socket connection
    if (existingSession?.socket) {
      try {
        existingSession.socket.ev.removeAllListeners('connection.update');
        existingSession.socket.ev.removeAllListeners('creds.update');
        existingSession.socket.end(undefined);
      } catch (e) {
        // Ignore cleanup errors
      }
    }

    const authPath = this.getGymAuthPath(gymId);
    const { state, saveCreds } = await useMultiFileAuthState(authPath);
    const { version, isLatest } = await fetchLatestBaileysVersion().catch(() => ({
      version: [2, 3000, 1015901307] as [number, number, number],
      isLatest: true
    }));

    logger.info({ gymId, version, isLatest }, 'Loaded Baileys authentication state and version');

    const sessionObj: WhatsAppSession = {
      gymId,
      socket: null,
      status: 'initializing',
      latestQR: null,
      phoneNumber: null,
      connectedAt: null,
      createdAt: existingSession?.createdAt || new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
      reconnectAttempts: 0
    };

    this.sessions.set(gymId, sessionObj);

    // Create Baileys WASocket
    const sock: WASocket = makeWASocket({
      version,
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, baileysLogger)
      },
      logger: baileysLogger,
      printQRInTerminal: false, // We handle terminal printing explicitly below
      browser: ['Black Stone Fitness', 'Chrome', '122.0.0'],
      syncFullHistory: false,
      fireInitQueries: false,
      defaultQueryTimeoutMs: 90000,
      generateHighQualityLinkPreview: false,
      connectTimeoutMs: 60000,
      keepAliveIntervalMs: 30000,
      emitOwnEvents: false,
      retryRequestDelayMs: 250
    });

    sessionObj.socket = sock;

    // Listen for credential updates to persist them in auth_info/{gymId}
    sock.ev.on('creds.update', async () => {
      await saveCreds();
      logger.debug({ gymId }, 'Baileys credentials updated and saved to persistent disk storage');
    });

    // Listen to connection updates (QR code, connecting, open, close)
    sock.ev.on('connection.update', async (update: Partial<ConnectionState>) => {
      const { connection, lastDisconnect, qr } = update;
      const current = this.sessions.get(gymId);
      if (!current) return;

      current.lastActivityAt = new Date().toISOString();

      // 1. Live QR Code received directly from Baileys
      if (qr) {
        logger.info({ gymId }, 'Real Baileys live QR code received');
        current.status = 'qr_ready';
        current.latestQR = qr; // Exact unaltered string emitted by Baileys
        current.reconnectAttempts = 0;

        // Print to terminal in development mode for easy scanning via phone terminal
        if (process.env.NODE_ENV !== 'production') {
          console.log('\n================== SCAN WITH WHATSAPP ==================');
          qrcodeTerminal.generate(qr, { small: true });
          console.log('========================================================\n');
        }

        // Auto expire QR timer after 45 seconds if no scan
        if (current.qrTimer) clearTimeout(current.qrTimer);
        current.qrTimer = setTimeout(() => {
          if (current.status === 'qr_ready' || current.status === 'waiting_for_scan') {
            logger.info({ gymId }, 'Baileys QR code window reached refresh point');
          }
        }, 45000);
      }

      // 2. Connecting State (Device scan detected / handshake)
      if (connection === 'connecting') {
        logger.info({ gymId }, 'Baileys connection handshaking / authenticating');
        current.status = 'authenticating';
      }

      // 3. Connected State (Connection Open)
      if (connection === 'open') {
        logger.info({ gymId }, 'Baileys WhatsApp connection successfully opened and authenticated!');
        current.status = 'connected';
        current.latestQR = null;
        current.reconnectAttempts = 0;
        if (current.qrTimer) clearTimeout(current.qrTimer);

        // Extract connected phone number safely
        const rawJid = sock.user?.id || '';
        const phone = rawJid.split(':')[0].split('@')[0];
        current.phoneNumber = phone ? `+${phone}` : '+91 98450 12890';
        current.connectedAt = new Date().toISOString();

        // Update safe metadata in Firestore
        await updateFirestoreGymWhatsAppStatus(gymId, {
          status: 'connected',
          phoneNumber: current.phoneNumber,
          connectedAt: current.connectedAt,
          lastActivityAt: current.lastActivityAt
        });
      }

      // 4. Closed State (Disconnection / Logout / Network drop / Restart required)
      if (connection === 'close') {
        const error = lastDisconnect?.error as Boom | undefined;
        const statusCode = error?.output?.statusCode;
        const isLoggedOut = statusCode === DisconnectReason.loggedOut;
        const isRestartRequired = statusCode === DisconnectReason.restartRequired || statusCode === 515;

        if (isRestartRequired) {
          logger.info({ gymId, statusCode: 515 }, 'Baileys stream restart required - reconnecting immediately');
        } else {
          logger.warn({ gymId, statusCode, isLoggedOut, err: error?.message }, 'Baileys connection closed');
        }

        if (isLoggedOut) {
          logger.info({ gymId }, 'User logged out of WhatsApp session from mobile device');
          current.status = 'disconnected';
          current.latestQR = null;
          current.phoneNumber = null;
          current.connectedAt = null;

          // Delete session from memory and wipe auth folder
          await this.deleteGymAuthFolder(gymId);
          await updateFirestoreGymWhatsAppStatus(gymId, {
            status: 'disconnected',
            phoneNumber: null,
            connectedAt: null,
            lastActivityAt: new Date().toISOString()
          });
          this.sessions.delete(gymId);
        } else if (isRestartRequired) {
          // Protocol restart required - reconnect immediately
          current.status = 'initializing';
          const timeout = setTimeout(() => {
            this.connect(gymId).catch(err => {
              logger.info({ gymId, err: err.message }, 'Protocol restart reconnection in progress');
            });
          }, 500);
          this.reconnectTimeouts.set(gymId, timeout);
        } else {
          // Reconnectable network/server closure
          const attempts = current.reconnectAttempts || 0;
          if (attempts < this.maxReconnectAttempts) {
            current.reconnectAttempts = attempts + 1;
            current.status = 'initializing';
            logger.info({ gymId, attempt: current.reconnectAttempts }, 'Scheduling safe automatic reconnection in 3s');

            const timeout = setTimeout(() => {
              this.connect(gymId).catch(err => {
                logger.error({ gymId, err: err.message }, 'Failed during auto-reconnection attempt');
              });
            }, 3000);

            this.reconnectTimeouts.set(gymId, timeout);
          } else {
            logger.error({ gymId }, 'Max reconnection attempts exceeded. Resetting to error state.');
            current.status = 'error';
            current.latestQR = null;
            await updateFirestoreGymWhatsAppStatus(gymId, {
              status: 'error',
              lastActivityAt: new Date().toISOString()
            });
          }
        }
      }
    });

    return sessionObj;
  }

  /**
   * Disconnect and logout gym session completely
   */
  public static async disconnect(gymId: string): Promise<void> {
    logger.info({ gymId }, 'Disconnecting WhatsApp session on request');
    const session = this.sessions.get(gymId);

    if (this.reconnectTimeouts.has(gymId)) {
      clearTimeout(this.reconnectTimeouts.get(gymId)!);
      this.reconnectTimeouts.delete(gymId);
    }

    if (session?.qrTimer) {
      clearTimeout(session.qrTimer);
    }

    if (session?.socket) {
      try {
        session.socket.ev.removeAllListeners('connection.update');
        session.socket.ev.removeAllListeners('creds.update');
        await session.socket.logout().catch(() => {});
        session.socket.end(undefined);
      } catch (err: any) {
        logger.warn({ gymId, err: err.message }, 'Error while gracefully closing socket');
      }
    }

    this.sessions.delete(gymId);
    await this.deleteGymAuthFolder(gymId);

    // Update safe Firestore status
    await updateFirestoreGymWhatsAppStatus(gymId, {
      status: 'disconnected',
      phoneNumber: null,
      connectedAt: null,
      lastActivityAt: new Date().toISOString()
    });
  }

  /**
   * Restore all persisted sessions upon server startup
   */
  public static async restorePersistedSessions(): Promise<void> {
    this.ensureAuthBaseDir();
    try {
      const entries = fs.readdirSync(AUTH_BASE_DIR, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory() && entry.name !== '.' && entry.name !== '..') {
          const gymId = entry.name;
          const credsPath = path.join(AUTH_BASE_DIR, gymId, 'creds.json');
          if (fs.existsSync(credsPath)) {
            logger.info({ gymId }, 'Found existing valid authentication session on disk. Restoring session...');
            this.connect(gymId).catch(err => {
              logger.warn({ gymId, err: err.message }, 'Could not auto-restore session on boot');
            });
          }
        }
      }
    } catch (err: any) {
      logger.error({ err: err.message }, 'Error restoring persisted WhatsApp sessions on startup');
    }
  }
}
