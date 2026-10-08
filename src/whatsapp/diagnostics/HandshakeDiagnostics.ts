/**
 * Production Authentication Handshake Diagnostics
 *
 * Dedicated tracing and telemetry for the Baileys multi-device pairing lifecycle.
 * Strictly adheres to privacy and security rules:
 * - NO credentials, auth secrets, encryption keys, private keys, or tokens are logged or returned.
 * - Captures exact status codes, DisconnectReason mappings, connection events, and timestamps.
 */

import fs from 'fs';
import path from 'path';
import { getAdminDb } from '../../config/firebase';
import {
  getWhatsAppEnvironment,
  getWhatsAppSessionVault,
  getWhatsAppVaultDocId,
  VAULT_COLLECTION,
  PROD_VAULT_DOC_ID,
  DEV_VAULT_DOC_ID
} from '../environment';

export interface HandshakeEvent {
  timestamp: string;
  type: string;
  details?: Record<string, any>;
}

export interface DisconnectDiagnosticInfo {
  timestamp: string;
  statusCode: number | null;
  disconnectReasonCode: string | null;
  errorName: string | null;
  errorMessage: string | null;
  sanitizedStack?: string | null;
  isNewLogin?: boolean;
  isOnline?: boolean;
  receivedPendingNotifications?: boolean;
  rawErrorType?: string | null;
}

export class HandshakeDiagnostics {
  private static instance: HandshakeDiagnostics;

  private events: HandshakeEvent[] = [];
  private readonly MAX_EVENTS = 150;

  private socketCreationTime: string | null = null;
  private qrCreationTime: string | null = null;
  private qrDisplayedTime: string | null = null;
  private qrScanActivityTime: string | null = null;
  private credsUpdateTime: string | null = null;
  private connectionOpenTime: string | null = null;
  private connectionCloseTime: string | null = null;

  private lastDisconnect: DisconnectDiagnosticInfo | null = null;
  private detectedCase: 'A' | 'B' | 'C' | 'D' | 'PENDING' = 'PENDING';
  private detectedCaseReason: string = 'Awaiting connection activity';

  private credsUpdateCount = 0;
  private credsPersistSuccessCount = 0;
  private credsPersistFailCount = 0;
  private keyStateUpdateCount = 0;
  private lastPersistError: string | null = null;

  private constructor() {}

  public static getInstance(): HandshakeDiagnostics {
    if (!HandshakeDiagnostics.instance) {
      HandshakeDiagnostics.instance = new HandshakeDiagnostics();
    }
    return HandshakeDiagnostics.instance;
  }

  /**
   * Logs a formal diagnostic event with standard timestamp formatting.
   */
  public logEvent(type: string, details?: Record<string, any>): void {
    const timestamp = new Date().toISOString();
    const event: HandshakeEvent = { timestamp, type, details };

    this.events.unshift(event);
    if (this.events.length > this.MAX_EVENTS) {
      this.events.pop();
    }

    // Print to server console with strict formatting
    const detailString = details ? ` ${JSON.stringify(details)}` : '';
    console.log(`[WHATSAPP] [${timestamp}] ${type}${detailString}`);
  }

  public recordSocketCreated(details?: Record<string, any>): void {
    this.socketCreationTime = new Date().toISOString();
    this.logEvent('SOCKET_CREATED', details);
  }

  public recordQrGenerated(details?: Record<string, any>): void {
    this.qrCreationTime = new Date().toISOString();
    this.logEvent('QR_GENERATED', details);
  }

  public recordQrDisplayed(details?: Record<string, any>): void {
    this.qrDisplayedTime = new Date().toISOString();
    this.logEvent('QR_DISPLAYED', details);
  }

  public recordQrScannedActivity(details?: Record<string, any>): void {
    this.qrScanActivityTime = new Date().toISOString();
    this.logEvent('QR_SCANNED_ACTIVITY', details);
  }

  public recordCredsUpdate(details?: Record<string, any>): void {
    this.credsUpdateTime = new Date().toISOString();
    this.credsUpdateCount++;
    this.logEvent('CREDS_UPDATE_RECEIVED', details);
  }

  public recordCredsPersistStart(details?: Record<string, any>): void {
    this.logEvent('CREDS_PERSIST_START', details);
  }

  public recordCredsPersistSuccess(details?: Record<string, any>): void {
    this.credsPersistSuccessCount++;
    this.logEvent('CREDS_PERSIST_SUCCESS', details);
  }

  public recordCredsPersistFailed(error: string, details?: Record<string, any>): void {
    if (details?.isFatal === false) {
      this.logEvent('CREDS_PERSIST_NOTICE', { error, ...details });
      return;
    }
    this.credsPersistFailCount++;
    this.lastPersistError = error;
    this.logEvent('CREDS_PERSIST_FAILED', { error, ...details });
  }

  public recordKeyStateUpdate(category: string, count: number): void {
    this.keyStateUpdateCount++;
    this.logEvent('KEY_STATE_UPDATE', { category, count });
  }

  public recordConnectionUpdate(details?: Record<string, any>): void {
    this.logEvent('CONNECTION_UPDATE', details);
  }

  public recordConnectionOpen(details?: Record<string, any>): void {
    this.connectionOpenTime = new Date().toISOString();
    this.detectedCase = 'C';
    this.detectedCaseReason = 'Connection transitioned to open';
    this.logEvent('CONNECTION_OPEN', details);
  }

  public recordConnectionClosed(info: DisconnectDiagnosticInfo): void {
    this.connectionCloseTime = info.timestamp;
    this.lastDisconnect = info;

    // Evaluate Handshake Cases (A, B, C, D)
    if (!this.qrScanActivityTime && !this.credsUpdateTime) {
      this.detectedCase = 'A';
      this.detectedCaseReason = 'QR generated → phone scanned or timed out → server received no auth data';
    } else if (this.credsUpdateTime && !this.connectionOpenTime) {
      this.detectedCase = 'B';
      this.detectedCaseReason = `QR generated → phone scanned → server received creds → handshake failed or closed (statusCode: ${info.statusCode})`;
    } else if (this.connectionOpenTime) {
      this.detectedCase = 'C';
      this.detectedCaseReason = `QR generated → phone scanned → authentication succeeded (was open) → connection closed (statusCode: ${info.statusCode})`;
    }

    const isRestart = info.statusCode === 515 || info.errorName === 'RestartRequired';
    const isConflict = info.statusCode === 440 || info.errorName === 'StreamConflict' || info.disconnectReasonCode?.includes('440');
    const isLoggedOut =
      info.statusCode === 401 ||
      info.disconnectReasonCode?.includes('401') ||
      info.errorName === 'LoggedOut';
    const eventType = isRestart
      ? 'CONNECTION_RESTART_REQUIRED'
      : isConflict
      ? 'CONNECTION_CONFLICT_HANDLED'
      : isLoggedOut
      ? 'DEVICE_LOGGED_OUT'
      : 'CONNECTION_CLOSED';

    this.logEvent(eventType, {
      statusCode: info.statusCode,
      disconnectReasonCode: info.disconnectReasonCode,
      ...(isRestart || isConflict || isLoggedOut ? {} : { errorName: info.errorName, errorMessage: info.errorMessage }),
      isNewLogin: info.isNewLogin,
      isOnline: info.isOnline,
      receivedPendingNotifications: info.receivedPendingNotifications
    });
  }

  public recordReconnectAttempt(attempt: number, delayMs: number, reason: string): void {
    this.logEvent('RECONNECT_ATTEMPT', { attempt, delayMs, reason });
  }

  /**
   * Retrieves comprehensive snapshot of diagnostic metrics, system state,
   * vault metadata, and lifecycle logs.
   */
  public async getDiagnosticReport(): Promise<Record<string, any>> {
    const env = getWhatsAppEnvironment();
    const vault = getWhatsAppSessionVault();
    const docId = getWhatsAppVaultDocId();

    // 1. Inspect Firestore vault metadata safely (never reading credential values)
    let vaultMetadata: Record<string, any> = { exists: false };
    try {
      const db = getAdminDb();
      if (db) {
        const snap = await db.collection(VAULT_COLLECTION).doc(docId).get();
        if (snap.exists) {
          const data = snap.data() || {};
          const files = (data.files && typeof data.files === 'object') ? data.files : {};
          const fileKeys = Object.keys(files);
          let totalBytes = 0;
          for (const k of fileKeys) {
            totalBytes += (files[k]?.length || 0);
          }

          vaultMetadata = {
            exists: true,
            docId,
            updatedAt: data.updatedAt || null,
            serverInstance: data.serverInstance || null,
            environment: data.environment || null,
            sessionVault: data.sessionVault || null,
            fileCount: fileKeys.length,
            fileNames: fileKeys,
            hasCreds: fileKeys.includes('creds.json'),
            keyFileCount: fileKeys.filter(k => k !== 'creds.json').length,
            totalBytes
          };
        } else {
          vaultMetadata = {
            exists: false,
            docId,
            notice: 'Document does not exist in Firestore'
          };
        }
      }
    } catch (err: any) {
      vaultMetadata = {
        exists: false,
        docId,
        error: err?.message || 'Failed reading vault doc'
      };
    }

    // 2. Inspect local storage metadata
    const localPath = path.resolve(
      process.cwd(),
      'storage',
      env === 'production' ? 'whatsapp-session-prod' : 'whatsapp-session'
    );
    let localMetadata: Record<string, any> = { exists: false, path: localPath };
    try {
      if (fs.existsSync(localPath)) {
        const files = fs.readdirSync(localPath);
        let totalBytes = 0;
        for (const f of files) {
          try {
            totalBytes += fs.statSync(path.join(localPath, f)).size;
          } catch {}
        }
        localMetadata = {
          exists: true,
          path: localPath,
          fileCount: files.length,
          fileNames: files,
          hasCreds: files.includes('creds.json'),
          keyFileCount: files.filter(f => f !== 'creds.json').length,
          totalBytes
        };
      }
    } catch (err: any) {
      localMetadata = { exists: false, path: localPath, error: err?.message };
    }

    return {
      reportTimestamp: new Date().toISOString(),
      environment: env,
      sessionVault: vault,
      vaultDocId: docId,
      cloudRun: {
        isCloudRun: Boolean(process.env.K_SERVICE && !process.env.K_SERVICE.startsWith('ais-')),
        service: process.env.K_SERVICE || null,
        revision: process.env.K_REVISION || null,
        configuration: process.env.K_CONFIGURATION || null,
        instance: process.env.HOSTNAME || null,
        nodeVersion: process.version,
        uptimeSeconds: Math.floor(process.uptime()),
        memoryUsageMb: Math.round(process.memoryUsage().rss / (1024 * 1024))
      },
      packages: {
        baileysVersion: '6.7.24',
        nodeVersion: process.version,
        esbuildVersion: '0.25.12'
      },
      handshakeCase: {
        detectedCase: this.detectedCase,
        explanation: this.detectedCaseReason
      },
      lifecycleTimestamps: {
        socketCreationTime: this.socketCreationTime,
        qrCreationTime: this.qrCreationTime,
        qrDisplayedTime: this.qrDisplayedTime,
        qrScanActivityTime: this.qrScanActivityTime,
        credsUpdateTime: this.credsUpdateTime,
        connectionOpenTime: this.connectionOpenTime,
        connectionCloseTime: this.connectionCloseTime
      },
      counters: {
        credsUpdateCount: this.credsUpdateCount,
        credsPersistSuccessCount: this.credsPersistSuccessCount,
        credsPersistFailCount: this.credsPersistFailCount,
        keyStateUpdateCount: this.keyStateUpdateCount,
        lastPersistError: this.lastPersistError
      },
      lastDisconnect: this.lastDisconnect,
      vaultMetadata,
      localMetadata,
      recentEvents: this.events.slice(0, 50)
    };
  }
}
