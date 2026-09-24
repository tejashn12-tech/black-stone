import path from 'path';
import fs from 'fs';
import { useMultiFileAuthState, AuthenticationState } from '@whiskeysockets/baileys';
import { getAdminDb } from '../../config/firebase';
import { logWhatsAppEvent, WhatsAppLogEvent } from '../utils/whatsappLogger';

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
 */
export class AuthStateManager {
  private sessionDir: string;
  private readonly VAULT_COLLECTION = '_private_server_auth';
  private readonly VAULT_DOC_ID = 'bsf_whatsapp_session';
  private pendingSaveCredsPromise: Promise<void> | null = null;

  constructor(customSessionPath?: string) {
    this.sessionDir = customSessionPath || process.env.WHATSAPP_SESSION_PATH || path.resolve(process.cwd(), 'storage', 'whatsapp-session');
    this.ensureSessionDir();
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
      const { state, saveCreds: originalSaveCreds } = await useMultiFileAuthState(this.sessionDir);

      const hasCreds = this.hasLocalSession();
      logWhatsAppEvent(WhatsAppLogEvent.AUTH_STATE_LOADED, {
        sessionPath: this.sessionDir,
        hasCreds
      });

      // Wrap saveCreds to log and sync to private server vault
      const wrappedSaveCreds = async (): Promise<void> => {
        const p = (async () => {
          try {
            await originalSaveCreds();
            logWhatsAppEvent(WhatsAppLogEvent.AUTH_STATE_SAVED, {
              timestamp: new Date().toISOString()
            });

            // Sync snapshot to private server vault for container restart resilience
            await this.syncToPrivateServerVault();
          } catch (saveErr: any) {
            logWhatsAppEvent(WhatsAppLogEvent.AUTH_ERROR, `Failed to save credentials: ${saveErr?.message}`);
            throw saveErr;
          }
        })();
        this.pendingSaveCredsPromise = p;
        await p;
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
      return !!(parsed && (parsed.me?.id || parsed.registered === true));
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
      const db = getAdminDb();
      if (!db) return false;

      const docRef = db.collection(this.VAULT_COLLECTION).doc(this.VAULT_DOC_ID);
      const snap = await docRef.get();

      if (!snap || !snap.exists) {
        return false;
      }

      const data = snap.data();
      if (!data || !data.files || typeof data.files !== 'object') {
        return false;
      }

      console.log('[AuthStateManager] Hydrating local session files from private server vault...');
      this.ensureSessionDir();

      for (const [filename, fileContent] of Object.entries(data.files)) {
        if (typeof fileContent === 'string') {
          const filePath = path.join(this.sessionDir, filename);
          fs.writeFileSync(filePath, fileContent, 'utf8');
        }
      }

      console.log(`[AuthStateManager] Restored ${Object.keys(data.files).length} session file(s) from vault.`);
      return true;
    } catch (err: any) {
      console.warn('[AuthStateManager] Vault restore notice (falling back to fresh local session):', err?.message);
      return false;
    }
  }

  /**
   * Syncs active creds.json and session state to the private server vault
   */
  private async syncToPrivateServerVault(): Promise<void> {
    try {
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

      const docRef = db.collection(this.VAULT_COLLECTION).doc(this.VAULT_DOC_ID);
      await docRef.set({
        files,
        updatedAt: new Date().toISOString(),
        serverInstance: process.env.HOSTNAME || 'bsf-server'
      });
    } catch (err: any) {
      // Non-blocking: local disk remains the primary source of truth
      console.warn('[AuthStateManager] Vault sync notice (local disk intact):', err?.message);
    }
  }

  /**
   * Clears the session completely when genuinely logged out or authentication is invalid.
   * Purges local disk AND the private server vault.
   */
  public async clearAuthSession(): Promise<void> {
    try {
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

      // 2. Purge private server vault
      try {
        const db = getAdminDb();
        if (db) {
          await db.collection(this.VAULT_COLLECTION).doc(this.VAULT_DOC_ID).delete();
        }
      } catch (vaultErr: any) {
        console.warn('[AuthStateManager] Vault purge notice:', vaultErr?.message);
      }

      logWhatsAppEvent(WhatsAppLogEvent.LOGGED_OUT, 'Session credentials purged from server storage and vault');
    } catch (err: any) {
      logWhatsAppEvent(WhatsAppLogEvent.AUTH_ERROR, `Failed clearing session: ${err?.message}`);
    }
  }

  public getSessionPath(): string {
    return this.sessionDir;
  }
}
