/**
 * HandshakeDiagnosticTracker
 *
 * Captures granular, safe diagnostic telemetry throughout the Baileys connection,
 * QR emission, mobile device scan, credential update, and disconnection lifecycle.
 *
 * Strictly sanitized: NEVER captures QR data, private keys, authentication tokens,
 * session payloads, or personal messages.
 */

export interface HandshakeEventRecord {
  event: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface DisconnectSnapshot {
  timestamp: string;
  statusCode: number | undefined;
  baileysReasonName: string;
  errorName: string;
  errorMessage: string;
  errorStack: string;
  isNewLogin?: boolean;
  isOnline?: boolean;
  receivedPendingNotifications?: boolean;
}

export interface CredsPersistSnapshot {
  timestamp: string;
  status: 'START' | 'SUCCESS' | 'FAILED';
  vaultDocId: string;
  fileCount?: number;
  totalBytes?: number;
  error?: string;
}

export class HandshakeDiagnosticTracker {
  private static instance: HandshakeDiagnosticTracker | null = null;

  private serverStartupTime: string = new Date().toISOString();
  private timeline: HandshakeEventRecord[] = [];
  private lastDisconnect: DisconnectSnapshot | null = null;
  private lastCredsPersist: CredsPersistSnapshot | null = null;
  private credsUpdateCount = 0;
  private socketCreateCount = 0;
  private qrGenerateCount = 0;

  private constructor() {}

  public static getInstance(): HandshakeDiagnosticTracker {
    if (!HandshakeDiagnosticTracker.instance) {
      HandshakeDiagnosticTracker.instance = new HandshakeDiagnosticTracker();
    }
    return HandshakeDiagnosticTracker.instance;
  }

  public recordEvent(eventName: string, metadata?: Record<string, any>): void {
    const timestamp = new Date().toISOString();
    console.log(`[WHATSAPP] [${timestamp}] ${eventName}${metadata ? ' ' + JSON.stringify(metadata) : ''}`);

    if (eventName === 'SOCKET_CREATED') this.socketCreateCount++;
    if (eventName === 'QR_GENERATED') this.qrGenerateCount++;
    if (eventName === 'CREDS_UPDATE_RECEIVED') this.credsUpdateCount++;

    this.timeline.unshift({
      event: eventName,
      timestamp,
      metadata
    });

    if (this.timeline.length > 50) {
      this.timeline.pop();
    }
  }

  public recordCredsPersist(status: 'START' | 'SUCCESS' | 'FAILED', vaultDocId: string, details?: { fileCount?: number; totalBytes?: number; error?: string }): void {
    const timestamp = new Date().toISOString();
    this.lastCredsPersist = {
      timestamp,
      status,
      vaultDocId,
      fileCount: details?.fileCount,
      totalBytes: details?.totalBytes,
      error: details?.error
    };

    if (status === 'START') {
      this.recordEvent('CREDS_PERSIST_START', { vaultDocId });
    } else if (status === 'SUCCESS') {
      this.recordEvent('CREDS_PERSIST_SUCCESS', {
        vaultDocId,
        fileCount: details?.fileCount,
        totalBytes: details?.totalBytes
      });
    } else {
      this.recordEvent('CREDS_PERSIST_FAILED', {
        vaultDocId,
        error: details?.error
      });
    }
  }

  public recordDisconnect(snapshot: DisconnectSnapshot): void {
    this.lastDisconnect = snapshot;
    this.recordEvent('CONNECTION_CLOSED', {
      statusCode: snapshot.statusCode,
      baileysReasonName: snapshot.baileysReasonName,
      errorName: snapshot.errorName,
      errorMessage: snapshot.errorMessage
    });
  }

  public getSnapshot(sessionVault: string, vaultDocId: string) {
    return {
      serverStartupTime: this.serverStartupTime,
      socketCreateCount: this.socketCreateCount,
      qrGenerateCount: this.qrGenerateCount,
      credsUpdateCount: this.credsUpdateCount,
      lastCredsPersist: this.lastCredsPersist,
      lastDisconnect: this.lastDisconnect,
      baileysVersion: '6.7.24',
      nodeVersion: process.version,
      esbuildVersion: '0.25.12',
      sessionVault,
      vaultDocId,
      cloudRunMetadata: {
        service: process.env.K_SERVICE || null,
        revision: process.env.K_REVISION || null,
        configuration: process.env.K_CONFIGURATION || null,
        instanceId: process.env.HOSTNAME || null
      },
      timeline: [...this.timeline]
    };
  }
}
