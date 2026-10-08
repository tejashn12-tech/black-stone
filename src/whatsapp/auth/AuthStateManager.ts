import path from 'path';
import fs from 'fs';
import * as BaileysModule from '@whiskeysockets/baileys';
import { useMultiFileAuthState as useMultiFileAuthStateNamed, type AuthenticationState } from '@whiskeysockets/baileys';
import { getAdminDb } from '../../config/firebase';
import { logWhatsAppEvent, WhatsAppLogEvent } from '../utils/whatsappLogger';
import {
  getWhatsAppEnvironment,
  getWhatsAppSessionVault,
  getWhatsAppVaultDocId,
  validateVaultDocAccess,
  VAULT_COLLECTION,
  DEV_VAULT_DOC_ID,
  PROD_VAULT_DOC_ID,
  WhatsAppEnvironment,
  WhatsAppSessionVault
} from '../environment';
import { HandshakeDiagnostics } from '../diagnostics/HandshakeDiagnostics';

function getMultiFileAuthStateHelper(): typeof useMultiFileAuthStateNamed {
  const mod = BaileysModule as any;
  const candidates = [
    useMultiFileAuthStateNamed,
    mod?.useMultiFileAuthState,
    mod?.default?.useMultiFileAuthState,
  ];
  for (const c of candidates) {
    if (typeof c === 'function') return c;
  }
  return useMultiFileAuthStateNamed;
}

/**
 * AuthStateManager provides robust, persistent server-side storage for
 * Baileys multi-device authentication credentials.
 *
 * Guarantees:
 * - Credentials survive frontend refresh, browser closing, server restarts, and container restarts.
 * - Credentials NEVER reach the client browser or frontend localStorage.
 * - Credentials are NEVER stored in publicly readable Firestore documents.
 * - Server-only private vault (_private_server_auth) is strictly denied in firestore.rules.
 * - Only genuine logout or invalid auth triggers session deletion. Temporary drops preserve credentials.
 * - Development and Production use isolated session documents and never cross-pollinate.
 */
export class AuthStateManager {
  private sessionDir: string;
  private readonly VAULT_COLLECTION = VAULT_COLLECTION;
  private readonly environment: WhatsAppEnvironment;
  private readonly sessionVault: WhatsAppSessionVault;
  private readonly vaultDocId: string;
  private pendingSaveCredsPromise: Promise<void> | null = null;

  constructor(customSessionPath?: string) {
    this.environment = getWhatsAppEnvironment();
    this.sessionVault = getWhatsAppSessionVault();
    this.vaultDocId = getWhatsAppVaultDocId(this.sessionVault);

    // Validate that document matches environment
    validateVaultDocAccess(this.vaultDocId);

    // For development, maintain EXACT existing 'storage/whatsapp-session' so AI Studio connection is 100% untouched
    if (customSessionPath || process.env.WHATSAPP_SESSION_PATH) {
      this.sessionDir = customSessionPath || process.env.WHATSAPP_SESSION_PATH!;
    } else if (this.environment === 'production') {
      this.sessionDir = path.resolve(process.cwd(), 'storage', 'whatsapp-session-prod');
    } else {
      this.sessionDir = path.resolve(process.cwd(), 'storage', 'whatsapp-session');
    }

    this.ensureSessionDir();

    // Required startup logs without leaking credentials
    console.log(`[AuthStateManager] WHATSAPP_ENVIRONMENT=${this.environment}`);
    console.log(`[AuthStateManager] WHATSAPP_SESSION_VAULT=${this.sessionVault}`);
    console.log(`[AuthStateManager] AUTH_STATE_INITIALIZED environment=${this.environment} vault=${this.sessionVault}`);
  }

  public getEnvironment(): WhatsAppEnvironment {
    return this.environment;
  }

  public getSessionVault(): WhatsAppSessionVault {
    return this.sessionVault;
  }

  public getVaultDocId(): string {
    return this.vaultDocId;
  }

  public async waitForPendingCredsSave(): Promise<void> {
    if (this.pendingSaveCredsPromise) {
      try {
        await this.pendingSaveCredsPromise;
      } catch {}
    }
  }

  private ensureSessionDir(): void {
    if (!fs.existsSync(this.sessionDir)) {
      fs.mkdirSync(this.sessionDir, { recursive: true });
    }
  }

  /**
   * Initializes or loads the multi-file authentication state.
   * If local disk is empty (e.g. after fresh container deployment),
   * attempts hydration from the private server vault.
   */
  public async loadAuthState(): Promise<{
    state: AuthenticationState;
    saveCreds: () => Promise<void>;
  }> {
    this.ensureSessionDir();

    // If local disk doesn't have creds.json, attempt restore from secure private server vault
    if (!this.hasLocalSession()) {
      await this.restoreFromPrivateServerVault();
    }

    try {
      const initMultiFileAuthState = getMultiFileAuthStateHelper();
      const { state, saveCreds: originalSaveCreds } = await initMultiFileAuthState(this.sessionDir);

      if (state.creds?.me?.id && !state.creds.registered) {
        state.creds.registered = true;
      }

      const hasCreds = this.hasLocalSession();
      logWhatsAppEvent(WhatsAppLogEvent.AUTH_STATE_LOADED, {
        sessionPath: this.sessionDir,
        hasCreds
      });

      // Wrap saveCreds to log and sync to private server vault
      const wrappedSaveCreds = async (): Promise<void> => {
        const p = (async () => {
          try {
            if (state.creds?.me?.id && !state.creds.registered) {
              state.creds.registered = true;
            }

            HandshakeDiagnostics.getInstance().recordCredsUpdate({
              hasMe: Boolean(state.creds?.me?.id),
              registered: state.creds?.registered || false,
              platform: state.creds?.platform || null
            });
            HandshakeDiagnostics.getInstance().recordCredsPersistStart({
              vaultDocId: this.vaultDocId,
              sessionDir: this.sessionDir
            });

            await originalSaveCreds();
            logWhatsAppEvent(WhatsAppLogEvent.AUTH_STATE_SAVED, {
              timestamp: new Date().toISOString()
            });

            // Sync snapshot to private server vault asynchronously without blocking saveCreds
            this.syncToPrivateServerVault().catch((vaultErr) => {
              console.warn('[AuthStateManager] Background vault sync notice:', vaultErr?.message);
            });
          } catch (saveErr: any) {
            HandshakeDiagnostics.getInstance().recordCredsPersistFailed(
              saveErr?.message || 'saveCreds failed',
              { code: saveErr?.code, vaultDocId: this.vaultDocId, isFatal: true }
            );
            logWhatsAppEvent(WhatsAppLogEvent.AUTH_ERROR, `Failed to save credentials to disk: ${saveErr?.message}`);
            throw saveErr;
          }
        })();
        this.pendingSaveCredsPromise = p;
        await p;
      };

      // Wrap state.keys.set to monitor key lifecycle events and prevent stranded keys
      const originalKeysSet = state.keys.set;
      state.keys.set = async (data: any) => {
        try {
          for (const category in data) {
            const count = Object.keys(data[category] || {}).length;
            HandshakeDiagnostics.getInstance().recordKeyStateUpdate(category, count);
          }
        } catch {}
        await originalKeysSet(data);
        this.scheduleVaultSync();
      };

      return {
        state,
        saveCreds: wrappedSaveCreds
      };
    } catch (err: any) {
      logWhatsAppEvent(WhatsAppLogEvent.AUTH_ERROR, `Failed loading auth state: ${err?.message}`);
      throw err;
    }
  }

  /**
   * Checks whether valid credentials exist in local storage or the private server vault
   */
  public hasExistingSession(): boolean {
    return this.hasRegisteredSession();
  }

  /**
   * Checks if an authenticated/registered user session exists on local disk
   */
  public hasRegisteredSession(): boolean {
    try {
      if (!fs.existsSync(this.sessionDir)) return false;
      const credsPath = path.join(this.sessionDir, 'creds.json');
      if (!fs.existsSync(credsPath)) return false;

      const stat = fs.statSync(credsPath);
      if (stat.size < 50) return false;

      const content = fs.readFileSync(credsPath, 'utf8');
      const parsed = JSON.parse(content);
      // In Baileys multi-device companion mode, me.id is populated upon successful pairing
      return Boolean(parsed && parsed.me?.id);
    } catch {
      return false;
    }
  }

  /**
   * Checks if valid creds.json exists on local disk
   */
  public hasLocalSession(): boolean {
    try {
      if (!fs.existsSync(this.sessionDir)) return false;
      const credsPath = path.join(this.sessionDir, 'creds.json');
      if (!fs.existsSync(credsPath)) return false;

      const stat = fs.statSync(credsPath);
      return stat.size > 20;
    } catch {
      return false;
    }
  }

  /**
   * Hydrates local disk from the private server-side vault (used on fresh container start)
   */
  private async restoreFromPrivateServerVault(): Promise<boolean> {
    try {
      validateVaultDocAccess(this.vaultDocId);
      const db = getAdminDb();
      if (!db) return false;

      const docRef = db.collection(this.VAULT_COLLECTION).doc(this.vaultDocId);
      const snap = await docRef.get();

      if (!snap || !snap.exists) {
        return false;
      }

      const data = snap.data();
      if (!data || !data.files || typeof data.files !== 'object') {
        return false;
      }

      console.log(`[AuthStateManager] Hydrating local session files from private server vault (${this.vaultDocId})...`);
      this.ensureSessionDir();

      for (const [filename, fileContent] of Object.entries(data.files)) {
        if (typeof fileContent === 'string') {
          const filePath = path.join(this.sessionDir, filename);
          fs.writeFileSync(filePath, fileContent, 'utf8');
        }
      }

      console.log(`[AuthStateManager] Restored ${Object.keys(data.files).length} session file(s) from vault (${this.vaultDocId}).`);
      return true;
    } catch (err: any) {
      console.warn('[AuthStateManager] Vault restore notice (falling back to fresh local session):', err?.message);
      return false;
    }
  }

  private syncDebounceTimer: NodeJS.Timeout | null = null;
  private scheduleVaultSync(): void {
    if (this.syncDebounceTimer) return;
    this.syncDebounceTimer = setTimeout(() => {
      this.syncDebounceTimer = null;
      this.syncToPrivateServerVault().catch(() => {});
    }, 1500);
  }

  /**
   * Syncs active creds.json and session state to the private server vault
   */
  private async syncToPrivateServerVault(): Promise<void> {
    try {
      validateVaultDocAccess(this.vaultDocId);
      if (!this.hasLocalSession()) return;

      const db = getAdminDb();
      if (!db) return;

      const files: Record<string, string> = {};
      const dirFiles = fs.readdirSync(this.sessionDir);
      let totalBytes = 0;

      // Always include creds.json first
      if (dirFiles.includes('creds.json')) {
        const content = fs.readFileSync(path.join(this.sessionDir, 'creds.json'), 'utf8');
        files['creds.json'] = content;
        totalBytes += content.length;
      }

      for (const file of dirFiles) {
        if (file !== 'creds.json' && file.endsWith('.json')) {
          const filePath = path.join(this.sessionDir, file);
          try {
            const content = fs.readFileSync(filePath, 'utf8');
            if (totalBytes + content.length < 800000) {
              files[file] = content;
              totalBytes += content.length;
            }
          } catch {}
        }
      }

      if (!files['creds.json']) return;

      const docRef = db.collection(this.VAULT_COLLECTION).doc(this.vaultDocId);
      await docRef.set({
        files,
        environment: this.environment,
        sessionVault: this.sessionVault,
        updatedAt: new Date().toISOString(),
        serverInstance: process.env.HOSTNAME || 'bsf-server'
      });

      HandshakeDiagnostics.getInstance().recordCredsPersistSuccess({
        vaultDocId: this.vaultDocId,
        fileCount: Object.keys(files).length,
        hasCreds: !!files['creds.json'],
        keyFilesCount: Object.keys(files).filter(k => k !== 'creds.json').length,
        totalBytes
      });
    } catch (err: any) {
      HandshakeDiagnostics.getInstance().recordCredsPersistFailed(err?.message || 'Sync failed', {
        code: (err as any)?.code,
        vaultDocId: this.vaultDocId,
        isFatal: false
      });
      // Non-blocking: local disk remains the primary source of truth
      console.warn('[AuthStateManager] Vault sync notice (local disk intact):', err?.message);
    }
  }

  /**
   * Clears the session completely when genuinely logged out or authentication is invalid.
   * Purges local disk AND the environment's designated private server vault.
   */
  public async clearAuthSession(): Promise<void> {
    try {
      validateVaultDocAccess(this.vaultDocId);

      // 1. Purge local directory
      if (fs.existsSync(this.sessionDir)) {
        const files = fs.readdirSync(this.sessionDir);
        for (const file of files) {
          const filePath = path.join(this.sessionDir, file);
          try {
            if (fs.lstatSync(filePath).isDirectory()) {
              fs.rmSync(filePath, { recursive: true, force: true });
            } else {
              fs.unlinkSync(filePath);
            }
          } catch (fileErr) {
            console.warn(`[AuthStateManager] Could not delete ${filePath}:`, fileErr);
          }
        }
      }
      this.ensureSessionDir();

      // 2. Purge private server vault for this environment ONLY
      try {
        const db = getAdminDb();
        if (db) {
          await db.collection(this.VAULT_COLLECTION).doc(this.vaultDocId).delete();
          console.log(`[AuthStateManager] Purged session vault: ${this.vaultDocId}`);
        }
      } catch (vaultErr: any) {
        console.warn('[AuthStateManager] Vault purge notice:', vaultErr?.message);
      }

      logWhatsAppEvent(WhatsAppLogEvent.LOGGED_OUT, `Session credentials purged from server storage and vault (${this.vaultDocId})`);
    } catch (err: any) {
      logWhatsAppEvent(WhatsAppLogEvent.AUTH_ERROR, `Failed clearing session: ${err?.message}`);
    }
  }

  /**
   * Cleans the production authentication vault once before the first production pairing.
   * STRICT SAFEGUARD:
   * - Only executes in production environment
   * - ONLY deletes bsf_whatsapp_session_prod
   * - NEVER deletes or modifies bsf_whatsapp_session_dev
   * - NEVER touches unrelated collections or documents
   */
  public async cleanProductionVaultOnce(): Promise<boolean> {
    if (this.environment !== 'production') {
      console.log('[AuthStateManager] cleanProductionVaultOnce skipped: current environment is development.');
      return false;
    }

    validateVaultDocAccess(PROD_VAULT_DOC_ID);

    try {
      // 1. Clear local production session directory
      if (fs.existsSync(this.sessionDir)) {
        const files = fs.readdirSync(this.sessionDir);
        for (const file of files) {
          const filePath = path.join(this.sessionDir, file);
          try {
            if (fs.lstatSync(filePath).isDirectory()) {
              fs.rmSync(filePath, { recursive: true, force: true });
            } else {
              fs.unlinkSync(filePath);
            }
          } catch {}
        }
      }
      this.ensureSessionDir();

      // 2. Clear ONLY bsf_whatsapp_session_prod in Firestore
      const db = getAdminDb();
      if (db) {
        await db.collection(this.VAULT_COLLECTION).doc(PROD_VAULT_DOC_ID).delete();
        console.log(`[AuthStateManager] Successfully cleaned production vault: ${PROD_VAULT_DOC_ID}`);
        return true;
      }
    } catch (err: any) {
      console.warn(`[AuthStateManager] Error cleaning production vault:`, err?.message);
    }
    return false;
  }

  public getSessionPath(): string {
    return this.sessionDir;
  }
}
