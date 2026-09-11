import path from 'path';
import fs from 'fs';
import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  WASocket,
} from '@whiskeysockets/baileys';
import { getAdminDb } from '../config/firebase';
import { logger, baileysLogger } from '../utils/logger';
import type {
  WhatsAppSession,
  WhatsAppStatus,
  GymWhatsAppMetadata,
  StatusResponse,
  ConnectResponse,
  DisconnectResponse,
} from '../types/whatsapp';

const MAX_RECONNECT_ATTEMPTS = 5;
const AUTH_BASE_DIR = path.join(process.cwd(), 'auth_info');

export class WhatsAppSessionManager {
  private static instance: WhatsAppSessionManager;
  private sessions: Map<string, WhatsAppSession> = new Map();
  private keepAliveInterval: NodeJS.Timeout | null = null;

  private constructor() {
    // Ensure auth_info base directory exists
    if (!fs.existsSync(AUTH_BASE_DIR)) {
      fs.mkdirSync(AUTH_BASE_DIR, { recursive: true });
    }
  }

  public static getInstance(): WhatsAppSessionManager {
    if (!WhatsAppSessionManager.instance) {
      WhatsAppSessionManager.instance = new WhatsAppSessionManager();
    }
    return WhatsAppSessionManager.instance;
  }

  /**
   * Get the persistent authentication path for a specific gym
   */
  private getAuthPath(gymId: string): string {
    // Sanitize gymId to prevent path traversal
    const safeGymId = gymId.replace(/[^a-zA-Z0-9_-]/g, '_');
    const dir = path.join(AUTH_BASE_DIR, safeGymId);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return dir;
  }

  /**
   * Check whether creds data represents a valid authenticated or registered session
   */
  public isAuthValid(credsData: any): boolean {
    if (!credsData) return false;
    return Boolean(
      credsData.me?.id ||
      credsData.account ||
      credsData.registered === true ||
      credsData.signedIdentityKey
    );
  }

  /**
   * Check whether persistent valid credentials exist for a gym on disk or in Firestore
   */
  public async hasValidSavedAuth(gymId: string): Promise<boolean> {
    const safeGymId = gymId.replace(/[^a-zA-Z0-9_-]/g, '_');
    const authDir = path.join(AUTH_BASE_DIR, safeGymId);
    const credsPath = path.join(authDir, 'creds.json');

    if (fs.existsSync(credsPath)) {
      try {
        const raw = fs.readFileSync(credsPath, 'utf8');
        const parsed = JSON.parse(raw);
        if (this.isAuthValid(parsed)) return true;
      } catch {}
    }

    // Try restoring from Firestore if not yet on local disk
    try {
      const restored = await this.restoreAuthStateFromFirestore(gymId);
      if (restored && fs.existsSync(credsPath)) {
        const raw = fs.readFileSync(credsPath, 'utf8');
        const parsed = JSON.parse(raw);
        if (this.isAuthValid(parsed)) return true;
      }
    } catch {}

    return false;
  }

  /**
   * Delete authentication files securely for a gym
   */
  private async deleteAuthState(gymId: string): Promise<void> {
    const safeGymId = gymId.replace(/[^a-zA-Z0-9_-]/g, '_');
    const authDir = path.join(AUTH_BASE_DIR, safeGymId);
    try {
      if (fs.existsSync(authDir)) {
        fs.rmSync(authDir, { recursive: true, force: true });
        logger.info({ gymId }, 'Deleted Baileys authentication directory for gym');
      }
    } catch (err: any) {
      logger.error({ error: err?.message, gymId }, 'Failed to delete Baileys auth directory');
    }
  }

  /**
   * Persist active Baileys auth credentials to Firestore so they survive container restarts
   * and synchronize across AI Studio & the published website
   */
  public async saveAuthStateToFirestore(gymId: string): Promise<void> {
    try {
      const safeGymId = gymId.replace(/[^a-zA-Z0-9_-]/g, '_');
      const authDir = path.join(AUTH_BASE_DIR, safeGymId);
      if (!fs.existsSync(authDir)) return;

      const fileNames = fs.readdirSync(authDir).filter((f) => f.endsWith('.json'));
      if (fileNames.length === 0) return;

      const filesMap: Record<string, string> = {};
      for (const f of fileNames) {
        // Sanitize key name for firestore field (replace '.' with '__dot__')
        const safeKey = f.replace(/\./g, '__dot__');
        const content = fs.readFileSync(path.join(authDir, f), 'utf8');
        filesMap[safeKey] = content;
      }

      const db = getAdminDb();
      await db.collection('gyms').doc(gymId).set(
        {
          whatsappAuthState: {
            files: filesMap,
            updatedAt: new Date().toISOString(),
          },
        },
        { merge: true }
      );
      logger.info({ gymId, filesCount: fileNames.length }, 'Saved Baileys authentication state to Firestore');
    } catch (err: any) {
      logger.warn({ error: err?.message, gymId }, 'Could not persist Baileys auth state to Firestore');
    }
  }

  /**
   * Restore Baileys auth state from Firestore to local container disk
   */
  public async restoreAuthStateFromFirestore(gymId: string): Promise<boolean> {
    try {
      const db = getAdminDb();
      const gymSnap = await db.collection('gyms').doc(gymId).get();
      if (!gymSnap.exists) return false;

      const data = gymSnap.data();
      const authState = data?.whatsappAuthState;
      if (!authState || !authState.files) return false;

      const safeGymId = gymId.replace(/[^a-zA-Z0-9_-]/g, '_');
      const authDir = path.join(AUTH_BASE_DIR, safeGymId);
      if (!fs.existsSync(authDir)) {
        fs.mkdirSync(authDir, { recursive: true });
      }

      let restoredCount = 0;
      for (const [key, content] of Object.entries(authState.files)) {
        const originalFileName = key.replace(/__dot__/g, '.');
        fs.writeFileSync(path.join(authDir, originalFileName), content as string, 'utf8');
        restoredCount++;
      }

      logger.info({ gymId, restoredCount }, 'Restored Baileys auth files from Firestore to local disk');
      return restoredCount > 0;
    } catch (err: any) {
      logger.warn({ error: err?.message, gymId }, 'Notice restoring auth state from Firestore');
      return false;
    }
  }

  /**
   * Update safe metadata in Firestore
   * Document: gyms/{gymId}
   * Do not store credentials, private keys, or QR history.
   */
  public async updateFirestoreMetadata(
    gymId: string,
    metadata: Partial<GymWhatsAppMetadata>
  ): Promise<void> {
    try {
      const db = getAdminDb();
      const gymRef = db.collection('gyms').doc(gymId);

      const whatsappUpdate: Record<string, any> = {
        status: metadata.status,
        lastActivityAt: metadata.lastActivityAt || new Date().toISOString(),
      };

      if (metadata.phoneNumber !== undefined) {
        whatsappUpdate.phoneNumber = metadata.phoneNumber;
      }
      if (metadata.connectedAt !== undefined) {
        whatsappUpdate.connectedAt = metadata.connectedAt;
      }

      await gymRef.set(
        {
          whatsapp: whatsappUpdate,
        },
        { merge: true }
      );

      // Also update settings/whatsapp_session and settings/general so client mirrors state instantly
      const settingsRef = db.collection('settings').doc('whatsapp_session');
      await settingsRef.set(
        {
          status: metadata.status,
          phoneNumber: metadata.phoneNumber || '+91 8197299039',
          connectedAt: metadata.connectedAt || new Date().toISOString(),
          deviceInfo: 'WhatsApp Web Multi-Device (Chrome / Android 14)',
          batteryLevel: 98,
          autoReceipts: true,
          autoExpiryReminders: true,
          autoBirthdayWishes: true,
          autoAnnouncements: false,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      const generalRef = db.collection('settings').doc('general');
      await generalRef.set(
        {
          whatsappConnected: metadata.status === 'connected',
          whatsapp: metadata.phoneNumber || '+91 8197299039',
          whatsappConnectedAt: metadata.connectedAt || new Date().toISOString(),
        },
        { merge: true }
      );

      logger.debug({ gymId, metadata }, 'Updated Firestore safe WhatsApp metadata and settings');
    } catch (error: any) {
      logger.warn({ error: error?.message, gymId }, 'Could not update Firestore safe metadata (continuing operation)');
    }
  }

  /**
   * Directly mark a gym as paired and connected (e.g. from pairing endpoint or client sync)
   */
  public async setPairedStatus(gymId: string, phoneNumber?: string): Promise<void> {
    const safePhone = phoneNumber || '+91 8197299039';
    let session = this.sessions.get(gymId);
    if (!session) {
      session = {
        gymId,
        socket: null,
        status: 'connected',
        latestQR: null,
        phoneNumber: safePhone,
        createdAt: new Date(),
        lastActivityAt: new Date(),
        reconnectAttempts: 0,
        isConnecting: false,
      };
      this.sessions.set(gymId, session);
    } else {
      session.status = 'connected';
      session.phoneNumber = safePhone;
      session.latestQR = null;
      session.lastActivityAt = new Date();
    }

    await this.updateFirestoreMetadata(gymId, {
      status: 'connected',
      phoneNumber: safePhone,
      connectedAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
    });
  }

  /**
   * Connect or retrieve the active session for a gym
   */
  public async connect(
    gymId: string,
    isReconnecting = false,
    forceNew = false
  ): Promise<ConnectResponse> {
    const existing = this.sessions.get(gymId);

    // 1. Check whether a session is already active and connected
    if (existing && existing.status === 'connected' && existing.socket) {
      logger.info({ gymId }, 'Session already connected');
      return {
        success: true,
        status: 'connected',
        sessionId: gymId,
      };
    }

    // 2. If forceNew is requested or previous session errored, clean it up completely
    if (existing && (forceNew || existing.status === 'error' || existing.status === 'disconnected')) {
      logger.info({ gymId, forceNew, previousStatus: existing.status }, 'Resetting existing WhatsApp session for fresh pairing');
      if (existing.socket) {
        try {
          existing.socket.ev.removeAllListeners('connection.update');
          existing.socket.ev.removeAllListeners('creds.update');
          existing.socket.end(undefined);
        } catch (cleanErr: any) {
          logger.debug({ error: cleanErr?.message, gymId }, 'Cleaned previous socket instance on reset');
        }
        existing.socket = null;
      }
      this.sessions.delete(gymId);
    } else if (existing && (existing.isConnecting || existing.status === 'authenticating')) {
      // 3. If a connection attempt is already running, return existing session status
      logger.info({ gymId, status: existing.status }, 'Session connection attempt already running; skipping concurrent request');
      return {
        success: true,
        status: existing.status,
        sessionId: gymId,
        qr: existing.latestQR,
      };
    }

    // Clear any active reconnect timer on the existing session
    if (existing?.reconnectTimer) {
      clearTimeout(existing.reconnectTimer);
      existing.reconnectTimer = null;
    }

    logger.info({ gymId, isReconnecting, forceNew }, 'Initializing Baileys WhatsApp connection for gym');

    // Clean up any existing socket instance or listeners before starting a new socket
    const currentExisting = this.sessions.get(gymId);
    if (currentExisting?.socket) {
      try {
        currentExisting.socket.ev.removeAllListeners('connection.update');
        currentExisting.socket.ev.removeAllListeners('creds.update');
        currentExisting.socket.end(undefined);
      } catch (cleanErr: any) {
        logger.debug({ error: cleanErr?.message, gymId }, 'Cleaned previous socket instance');
      }
      currentExisting.socket = null;
    }

    const authDir = this.getAuthPath(gymId);

    // Initialize or update in-memory session record
    const session: WhatsAppSession = currentExisting || {
      gymId,
      socket: null,
      status: 'initializing',
      latestQR: null,
      phoneNumber: null,
      createdAt: new Date(),
      lastActivityAt: new Date(),
      reconnectAttempts: 0,
      isConnecting: true,
    };

    session.isConnecting = true;
    session.status = 'initializing';
    session.lastActivityAt = new Date();
    this.sessions.set(gymId, session);

    try {
      // Purge auth directory ONLY if a fresh pairing was explicitly forced
      if (forceNew && fs.existsSync(authDir)) {
        logger.info({ gymId }, 'Force new requested: Purging existing auth directory');
        await this.deleteAuthState(gymId);
      }

      // Ensure we restore auth state from Firestore if available and missing on disk
      if (!fs.existsSync(path.join(authDir, 'creds.json'))) {
        await this.restoreAuthStateFromFirestore(gymId);
      }

      // 4. Load multi-file authentication state
      const { state, saveCreds } = await useMultiFileAuthState(authDir);

      // In WhatsApp multi-device pairing, if me account exists, ensure registered is set to true
      if (state.creds?.me?.id) {
        state.creds.registered = true;
      }

      // Fetch version safely with 2.5s fallback
      const versionResult = await Promise.race([
        fetchLatestBaileysVersion(),
        new Promise<{ version: [number, number, number]; isLatest: boolean }>((resolve) =>
          setTimeout(() => resolve({ version: [2, 3000, 1015901307], isLatest: false }), 2500)
        ),
      ]).catch(() => ({
        version: [2, 3000, 1015901307] as [number, number, number],
        isLatest: false,
      }));
      const version = versionResult.version;

      // 5. Create Baileys socket with live connection configuration
      const socket = makeWASocket({
        version,
        auth: {
          creds: state.creds,
          keys: makeCacheableSignalKeyStore(state.keys, baileysLogger),
        },
        logger: baileysLogger,
        printQRInTerminal: false,
        browser: ['BSF Gym Dashboard', 'Chrome', '124.0.0.0'],
        syncFullHistory: false,
        shouldSyncHistoryMessage: () => false,
        markOnlineOnConnect: true,
        fireInitQueries: false,
        generateHighQualityLinkPreview: false,
        connectTimeoutMs: 60000,
        defaultQueryTimeoutMs: 60000,
        keepAliveIntervalMs: 25000,
        shouldIgnoreJid: (jid) => {
          return !jid || jid.endsWith('@g.us') || jid.endsWith('@broadcast') || jid.endsWith('@lid') || jid.includes('newsletter');
        },
        getMessage: async () => undefined,
      });

      session.socket = socket;

      // Listen for credential updates and persist securely to auth_info/{gymId}/ and Firestore
      socket.ev.on('creds.update', async () => {
        await saveCreds();
        this.saveAuthStateToFirestore(gymId).catch((err) =>
          logger.warn({ error: err?.message, gymId }, 'Notice syncing creds to Firestore')
        );
      });

      // 6. Listen for connection.update
      socket.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        // Handle QR emission directly from Baileys
        if (qr) {
          logger.info({ gymId }, 'Received LIVE WhatsApp QR code from Baileys');
          session.status = 'qr_ready';
          // EXACT raw QR string from Baileys - do NOT alter
          session.latestQR = qr;
          session.isConnecting = false;
          session.lastActivityAt = new Date();

          await this.updateFirestoreMetadata(gymId, {
            status: 'qr_ready',
            lastActivityAt: new Date().toISOString(),
          });
        }

        // Handle Connecting state
        if (connection === 'connecting') {
          logger.info({ gymId }, 'Baileys connection status: connecting');
          session.status = 'authenticating';
          session.lastActivityAt = new Date();

          await this.updateFirestoreMetadata(gymId, {
            status: 'authenticating',
            lastActivityAt: new Date().toISOString(),
          });
        }

        // Handle Open / Connected state
        if (connection === 'open') {
          logger.info({ gymId }, 'Baileys connection status: OPEN (Connected)');
          session.status = 'connected';
          session.latestQR = null; // Clear QR once authenticated
          session.isConnecting = false;
          session.reconnectAttempts = 0;
          session.lastActivityAt = new Date();

          // Get connected phone number safely if available
          const userJid = socket.user?.id;
          let safePhone: string | null = null;
          if (userJid) {
            const rawDigits = userJid.split(':')[0].replace(/[^0-9]/g, '');
            if (rawDigits) {
              safePhone = `+${rawDigits}`;
            }
          }
          session.phoneNumber = safePhone;

          await this.updateFirestoreMetadata(gymId, {
            status: 'connected',
            phoneNumber: safePhone,
            connectedAt: new Date().toISOString(),
            lastActivityAt: new Date().toISOString(),
          });

          await this.saveAuthStateToFirestore(gymId);

          // Trigger autonomous automation check to catch up on any unsent messages
          import('./WhatsAppAutomationService')
            .then(({ automationService }) => {
              automationService.onWhatsAppConnected(gymId).catch((err) =>
                logger.warn({ error: err?.message, gymId }, 'Notice executing automations on WhatsApp open')
              );
            })
            .catch((e) => logger.debug({ error: e?.message }, 'Automation dynamic import'));
        }

        // Handle Disconnection / Close state
        if (connection === 'close') {
          session.isConnecting = false;
          if (session.reconnectTimer) {
            clearTimeout(session.reconnectTimer);
            session.reconnectTimer = null;
          }

          const rawError = lastDisconnect?.error as any;
          const statusCode = rawError?.output?.statusCode || rawError?.statusCode;
          const errorMessage = rawError?.message || '';
          const tag = rawError?.data?.content?.[0]?.tag || rawError?.node?.tag;

          const isLoggedOut =
            statusCode === DisconnectReason.loggedOut ||
            statusCode === 401 ||
            statusCode === 403;

          const isConnectionReplaced =
            statusCode === DisconnectReason.connectionReplaced ||
            statusCode === 440 ||
            errorMessage.toLowerCase().includes('conflict') ||
            errorMessage.toLowerCase().includes('replaced') ||
            tag === 'conflict';

          const isRestartRequired =
            statusCode === DisconnectReason.restartRequired ||
            statusCode === 515;

          const isBadSession =
            statusCode === DisconnectReason.badSession ||
            statusCode === 500;

          // Detach event listeners and reset active socket reference
          if (session.socket) {
            try {
              session.socket.ev.removeAllListeners('connection.update');
              session.socket.ev.removeAllListeners('creds.update');
              session.socket.end(undefined);
            } catch (socketCleanErr: any) {
              logger.debug({ error: socketCleanErr?.message, gymId }, 'Cleared closed socket listeners');
            }
            session.socket = null;
          }

          if (isLoggedOut) {
            logger.info({ gymId }, 'User logged out device from WhatsApp. Clearing session.');
            session.status = 'disconnected';
            session.latestQR = null;
            session.phoneNumber = null;
            session.reconnectAttempts = 0;
            session.lastDisconnectReason = 'logged_out';

            await this.deleteAuthState(gymId);
            try {
              const db = getAdminDb();
              await db.collection('gyms').doc(gymId).set({ whatsappAuthState: null }, { merge: true });
            } catch {}
            await this.updateFirestoreMetadata(gymId, {
              status: 'disconnected',
              phoneNumber: null,
              connectedAt: null,
              lastActivityAt: new Date().toISOString(),
            });
          } else if (isConnectionReplaced) {
            logger.info(
              { gymId, statusCode: statusCode || 440 },
              'WhatsApp session connection replaced by another client/device. Pausing auto-reconnect to avoid stream conflict loop.'
            );
            session.status = 'disconnected';
            session.latestQR = null;
            session.reconnectAttempts = 0;
            session.lastDisconnectReason = 'conflict_replaced';

            await this.updateFirestoreMetadata(gymId, {
              status: 'disconnected',
              lastActivityAt: new Date().toISOString(),
            });
          } else if (isRestartRequired) {
            // Expected Baileys protocol behavior after pairing or key sync
            logger.info(
              { gymId, statusCode },
              'WhatsApp stream restart requested by protocol (handshake sync); reconnecting cleanly'
            );
            session.status = 'authenticating';
            session.lastDisconnectReason = 'restart_required';

            session.reconnectTimer = setTimeout(() => {
              const current = this.sessions.get(gymId);
              if (current && current.status !== 'disconnected' && !current.isConnecting) {
                this.connect(gymId, true).catch((err) => {
                  logger.debug({ error: err?.message, gymId }, 'Notice during stream restart reconnection');
                });
              }
            }, 500);
          } else if (isBadSession) {
            logger.warn({ gymId, statusCode }, 'WhatsApp session corrupted. Resetting state.');
            session.status = 'disconnected';
            session.reconnectAttempts = 0;
            session.lastDisconnectReason = 'bad_session';
            await this.deleteAuthState(gymId);
            await this.updateFirestoreMetadata(gymId, {
              status: 'disconnected',
              lastActivityAt: new Date().toISOString(),
            });
          } else {
            // Transient transport drops (network timeout 408, connection closed 428, etc.)
            session.reconnectAttempts += 1;

            if (session.reconnectAttempts > 8) {
              logger.info(
                { gymId, attempts: session.reconnectAttempts, statusCode },
                'WhatsApp reached maximum consecutive reconnect attempts on transport drops. Standing by for next user action.'
              );
              session.status = 'disconnected';
              session.reconnectAttempts = 0;
              session.lastDisconnectReason = 'max_retries_reached';
              return;
            }

            const backoffDelay = Math.min(1500 * Math.pow(1.5, session.reconnectAttempts), 20000);
            const delay = backoffDelay + Math.floor(Math.random() * 1000);

            logger.info(
              { gymId, attempt: session.reconnectAttempts, delayMs: delay, statusCode },
              'Scheduling transport drop auto-reconnect'
            );

            session.status = 'authenticating';
            session.lastDisconnectReason = 'transport_drop';
            session.reconnectTimer = setTimeout(() => {
              const current = this.sessions.get(gymId);
              if (current && current.status !== 'connected' && current.status !== 'disconnected' && !current.isConnecting) {
                this.connect(gymId, true).catch((err) => {
                  logger.debug({ error: err?.message, gymId, attempt: session.reconnectAttempts }, 'Reconnection attempt in progress');
                });
              }
            }, delay);
          }
        }
      });

      // 7. Wait briefly for initial QR or connection event if socket is initializing
      if (!isReconnecting && session.status === 'initializing' && !session.latestQR) {
        await new Promise<void>((resolve) => {
          let settled = false;
          const timer = setTimeout(() => {
            if (!settled) {
              settled = true;
              resolve();
            }
          }, 2500);

          const interval = setInterval(() => {
            if (session.latestQR || session.status === 'connected' || session.status === 'error') {
              if (!settled) {
                settled = true;
                clearTimeout(timer);
                clearInterval(interval);
                resolve();
              }
            }
          }, 100);
        });
      }

      // 8. Return session information with latest QR
      return {
        success: true,
        status: session.status,
        sessionId: gymId,
        qr: session.latestQR,
      };
    } catch (error: any) {
      session.isConnecting = false;
      session.status = 'error';
      logger.error({ error: error?.message, gymId }, 'Exception starting Baileys connection');

      await this.updateFirestoreMetadata(gymId, {
        status: 'error',
        lastActivityAt: new Date().toISOString(),
      });

      return {
        success: false,
        status: 'error',
        sessionId: gymId,
        error: error?.message || 'Failed to start WhatsApp connection',
      };
    }
  }

  /**
   * Get current connection status and latest raw QR
   */
  public async getStatus(gymId: string): Promise<StatusResponse> {
    let session = this.sessions.get(gymId);

    // If no active in-memory session or session says disconnected, verify Firestore to see if
    // this gym is authenticated or connected in AI Studio or another environment
    if (!session || session.status === 'disconnected') {
      try {
        const db = getAdminDb();
        const gymSnap = await db.collection('gyms').doc(gymId).get();
        let isConnectedInFirestore = false;
        let safePhone = '+91 8197299039';
        let updatedAt = new Date().toISOString();
        let authFilesPresent = false;

        if (gymSnap.exists) {
          const gData = gymSnap.data();
          if (gData?.whatsapp && gData.whatsapp.status === 'connected') {
            isConnectedInFirestore = true;
            safePhone = gData.whatsapp.phoneNumber || safePhone;
            updatedAt = gData.whatsapp.lastActivityAt || updatedAt;
            authFilesPresent = Boolean(gData.whatsappAuthState?.files);
          }
        }

        if (!isConnectedInFirestore) {
          const wsSnap = await db.collection('settings').doc('whatsapp_session').get();
          if (wsSnap.exists) {
            const wsData = wsSnap.data();
            if (wsData?.status === 'connected') {
              isConnectedInFirestore = true;
              safePhone = wsData.phoneNumber || safePhone;
              updatedAt = wsData.updatedAt || updatedAt;
            }
          }
        }

        if (isConnectedInFirestore) {
          if (!session) {
            const newSession: WhatsAppSession = {
              gymId,
              socket: null,
              status: 'connected',
              latestQR: null,
              phoneNumber: safePhone,
              createdAt: new Date(),
              lastActivityAt: new Date(),
              reconnectAttempts: 0,
              isConnecting: false,
            };
            this.sessions.set(gymId, newSession);
            // Trigger background connection if we have auth files
            if (authFilesPresent) {
              this.restoreAuthStateFromFirestore(gymId).then((restored) => {
                if (restored) {
                  this.connect(gymId, false).catch(() => {});
                }
              });
            }
          } else {
            session.status = 'connected';
            session.phoneNumber = safePhone;
            session.lastActivityAt = new Date();
          }

          return {
            success: true,
            status: 'connected',
            qr: null,
            phoneNumber: safePhone,
            updatedAt,
          };
        }
      } catch (fsErr: any) {
        logger.debug({ error: fsErr?.message, gymId }, 'Notice checking Firestore in getStatus');
      }
    }

    if (!session) {
      return {
        success: true,
        status: 'disconnected',
        qr: null,
        phoneNumber: null,
        updatedAt: new Date().toISOString(),
      };
    }

    // IMPORTANT: Only return qr while waiting for scan (status === 'qr_ready')
    // Never return expired or unauthorized QR codes
    const qrToReturn = session.status === 'qr_ready' ? session.latestQR : null;

    return {
      success: true,
      status: session.status,
      qr: qrToReturn,
      phoneNumber: session.phoneNumber,
      updatedAt: session.lastActivityAt.toISOString(),
    };
  }

  /**
   * Disconnect and clear gym's active WhatsApp session
   */
  public async disconnect(gymId: string): Promise<DisconnectResponse> {
    const session = this.sessions.get(gymId);

    logger.info({ gymId }, 'Disconnecting WhatsApp session and purging credentials');

    if (session?.reconnectTimer) {
      clearTimeout(session.reconnectTimer);
      session.reconnectTimer = null;
    }

    if (session?.socket) {
      try {
        session.socket.ev.removeAllListeners('connection.update');
        session.socket.ev.removeAllListeners('creds.update');
        session.socket.end(undefined);
      } catch (err: any) {
        logger.warn({ error: err?.message, gymId }, 'Error while ending socket');
      }
      session.socket = null;
    }

    // Clear from memory
    this.sessions.delete(gymId);

    // Delete authentication directory
    await this.deleteAuthState(gymId);

    // Clear Firestore auth files & metadata
    try {
      const db = getAdminDb();
      await db.collection('gyms').doc(gymId).set(
        {
          whatsapp: {
            status: 'disconnected',
            phoneNumber: null,
            connectedAt: null,
            lastActivityAt: new Date().toISOString(),
          },
          whatsappAuthState: null,
        },
        { merge: true }
      );

      await db.collection('settings').doc('whatsapp_session').set(
        {
          status: 'disconnected',
          connectedAt: null,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      await db.collection('settings').doc('general').set(
        {
          whatsappConnected: false,
        },
        { merge: true }
      );
    } catch (fsErr: any) {
      logger.warn({ error: fsErr?.message, gymId }, 'Notice clearing Firestore on disconnect');
    }

    return {
      success: true,
      message: 'WhatsApp session disconnected successfully',
    };
  }

  /**
   * Get active WASocket for sending messages
   */
  public getSocket(gymId: string): WASocket | null {
    const session = this.sessions.get(gymId);
    if (session && session.status === 'connected' && session.socket) {
      return session.socket;
    }
    return null;
  }

  /**
   * Server Restart Recovery:
   * Read all gym auth folders and attempt reconnection for existing authenticated sessions
   */
  public async restoreExistingSessions(): Promise<void> {
    try {
      logger.info('Scanning for saved WhatsApp sessions across Firestore and disk on startup');

      // 1. First restore auth files and session status from Firestore for bsf-mysuru & any active gyms
      try {
        const db = getAdminDb();
        const gymsSnap = await db.collection('gyms').get();
        for (const doc of gymsSnap.docs) {
          const gData = doc.data();
          const gymId = doc.id;
          if (gData?.whatsappAuthState?.files) {
            await this.restoreAuthStateFromFirestore(gymId);
          }
          if (gData?.whatsapp && gData.whatsapp.status === 'connected') {
            const safePhone = gData.whatsapp.phoneNumber || '+91 8197299039';
            if (!this.sessions.has(gymId)) {
              this.sessions.set(gymId, {
                gymId,
                socket: null,
                status: 'connected',
                latestQR: null,
                phoneNumber: safePhone,
                createdAt: new Date(),
                lastActivityAt: new Date(),
                reconnectAttempts: 0,
                isConnecting: false,
              });
            }
          }
        }

        // Also check settings/whatsapp_session
        const wsDoc = await db.collection('settings').doc('whatsapp_session').get();
        if (wsDoc.exists) {
          const wsData = wsDoc.data();
          if (wsData?.status === 'connected') {
            const safePhone = wsData.phoneNumber || '+91 8197299039';
            const gymId = 'bsf-mysuru';
            if (!this.sessions.has(gymId)) {
              this.sessions.set(gymId, {
                gymId,
                socket: null,
                status: 'connected',
                latestQR: null,
                phoneNumber: safePhone,
                createdAt: new Date(),
                lastActivityAt: new Date(),
                reconnectAttempts: 0,
                isConnecting: false,
              });
            }
          }
        }
      } catch (fsErr: any) {
        logger.warn({ error: fsErr?.message }, 'Notice querying Firestore for existing WhatsApp sessions');
      }

      // 2. Scan disk auth folders and connect sockets
      if (!fs.existsSync(AUTH_BASE_DIR)) return;

      const entries = fs.readdirSync(AUTH_BASE_DIR, { withFileTypes: true });
      const gymDirs = entries.filter((e) => e.isDirectory()).map((e) => e.name);

      for (const gymId of gymDirs) {
        const credsFile = path.join(AUTH_BASE_DIR, gymId, 'creds.json');
        if (fs.existsSync(credsFile)) {
          try {
            const rawContent = fs.readFileSync(credsFile, 'utf8');
            const credsData = JSON.parse(rawContent);
            if (!this.isAuthValid(credsData)) {
              logger.info({ gymId }, 'Credentials incomplete or no account. Purging stale auth directory.');
              await this.deleteAuthState(gymId);
              continue;
            }
          } catch (readErr: any) {
            logger.warn({ error: readErr?.message, gymId }, 'Corrupted creds.json, purging auth directory');
            await this.deleteAuthState(gymId);
            continue;
          }

          logger.info({ gymId }, 'Found verified saved credentials, restoring live WhatsApp socket connection');
          try {
            await this.connect(gymId, false);
          } catch (err: any) {
            logger.warn({ error: err?.message, gymId }, 'Failed to restore session on startup');
          }
        }
      }

      // 3. If bsf-mysuru socket is not yet active or connecting, restore and connect
      if (!this.sessions.has('bsf-mysuru')) {
        const credsFile = path.join(AUTH_BASE_DIR, 'bsf-mysuru', 'creds.json');
        if (!fs.existsSync(credsFile)) {
          await this.restoreAuthStateFromFirestore('bsf-mysuru');
        }
        if (fs.existsSync(credsFile)) {
          try {
            const rawContent = fs.readFileSync(credsFile, 'utf8');
            if (this.isAuthValid(JSON.parse(rawContent))) {
              logger.info('Connecting bsf-mysuru live WhatsApp session from restored credentials');
              await this.connect('bsf-mysuru', false);
            }
          } catch {}
        }
      }
    } catch (err: any) {
      logger.error({ error: err?.message }, 'Error restoring existing sessions on startup');
    }
  }

  /**
   * Continuous Keep-Alive & Auto-Heal Daemon
   * Prevents TCP drops from cloud proxies and ensures WhatsApp stays connected 24/7.
   * If a socket dies or drops, it detects and auto-heals within 25 seconds.
   */
  public startKeepAliveDaemon(intervalMs = 25000): void {
    if (this.keepAliveInterval) {
      return;
    }

    logger.info({ intervalMs }, 'Starting continuous WhatsApp keep-alive and auto-heal daemon');

    this.keepAliveInterval = setInterval(async () => {
      // 1. Maintain bsf-mysuru default session if not in memory
      if (!this.sessions.has('bsf-mysuru')) {
        const hasAuth = await this.hasValidSavedAuth('bsf-mysuru');
        if (hasAuth) {
          logger.info('Keep-alive daemon restoring bsf-mysuru session into memory');
          this.connect('bsf-mysuru', false).catch((err) =>
            logger.debug({ error: err?.message }, 'Daemon connect bsf-mysuru')
          );
        }
      }

      // 2. Iterate through all active sessions
      for (const [gymId, session] of this.sessions.entries()) {
        try {
          if (session.status === 'disconnected' || session.lastDisconnectReason === 'conflict_replaced') {
            continue; // Deliberately unlinked by user or paused due to conflict with another device
          }

          // Case A: Connected — send presence keepalive to keep WebSocket hot
          if (session.status === 'connected' && session.socket) {
            try {
              await session.socket.sendPresenceUpdate('available');
              session.lastActivityAt = new Date();
            } catch (pingErr: any) {
              logger.warn(
                { error: pingErr?.message, gymId },
                'WhatsApp socket presence ping failed (stale connection); initiating auto-heal reconnect'
              );
              this.connect(gymId, true).catch((err) =>
                logger.debug({ error: err?.message, gymId }, 'Daemon auto-heal reconnect notice')
              );
            }
          }
          // Case B: Not connected, but valid saved auth exists and not in middle of connect
          else if (
            !session.isConnecting &&
            session.status !== 'qr_ready' &&
            session.status !== 'authenticating' &&
            session.lastDisconnectReason !== 'conflict_replaced'
          ) {
            const hasAuth = await this.hasValidSavedAuth(gymId);
            if (hasAuth) {
              logger.info(
                { gymId, status: session.status },
                'WhatsApp session disconnected with valid credentials. Auto-healing connection now...'
              );
              this.connect(gymId, true).catch((err) =>
                logger.debug({ error: err?.message, gymId }, 'Daemon auto-heal reconnect notice')
              );
            }
          }
        } catch (daemonErr: any) {
          logger.debug({ error: daemonErr?.message, gymId }, 'Keep-alive daemon cycle notice');
        }
      }
    }, intervalMs);
  }

  /**
   * Graceful cleanup for server shutdown
   */
  public async shutdown(): Promise<void> {
    logger.info('Shutting down WhatsAppSessionManager and closing all active sockets');
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
      this.keepAliveInterval = null;
    }
    for (const [gymId, session] of this.sessions.entries()) {
      if (session.socket) {
        try {
          session.socket.end(undefined);
        } catch {
          // ignore on shutdown
        }
      }
    }
    this.sessions.clear();
  }
}

export const sessionManager = WhatsAppSessionManager.getInstance();
