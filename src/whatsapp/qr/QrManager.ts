import QRCode from 'qrcode';
import { WhatsAppState, QrData } from '../status/types';
import { HandshakeDiagnostics } from '../diagnostics/HandshakeDiagnostics';

/**
 * QrManager manages in-memory caching and server-side PNG rendering of
 * QR codes provided by Baileys.
 *
 * Strict Rules Enforced:
 * 1. Baileys is the sole source of truth for QR codes.
 * 2. Generated ONLY when Baileys provides a new raw QR.
 * 3. Frontend polling reads ONLY from in-memory cache and never triggers generation.
 * 4. Cleared immediately once scanned or connected.
 */
export class QrManager {
  private currentQrDataUrl: string | null = null;
  private rawQrString: string | null = null;
  private expiresAt: string | null = null;
  private qrTimeout: NodeJS.Timeout | null = null;

  // Approximate lifetime before Baileys automatically pushes a refreshed QR
  private readonly QR_TTL_MS = 60000;

  /**
   * Processes a raw QR string provided by Baileys.
   * Caches the rendered image URL in memory.
   */
  public async handleBaileysQr(rawQr: string): Promise<string> {
    // If the exact same raw string was already rendered and is not expired, reuse cache
    if (this.rawQrString === rawQr && this.currentQrDataUrl && this.isValid()) {
      return this.currentQrDataUrl;
    }

    this.rawQrString = rawQr;
    this.expiresAt = new Date(Date.now() + this.QR_TTL_MS).toISOString();

    try {
      this.currentQrDataUrl = await QRCode.toDataURL(rawQr, {
        margin: 2,
        scale: 8,
        color: {
          dark: '#000000',
          light: '#ffffff'
        },
        errorCorrectionLevel: 'M'
      });
      HandshakeDiagnostics.getInstance().recordQrGenerated({ expiresAt: this.expiresAt });
    } catch (err) {
      console.error('[QrManager] Failed to render Baileys QR code:', err);
      this.currentQrDataUrl = null;
      throw err;
    }

    // Schedule cache cleanup upon expiration if Baileys doesn't push a replacement
    if (this.qrTimeout) {
      clearTimeout(this.qrTimeout);
    }
    this.qrTimeout = setTimeout(() => {
      this.currentQrDataUrl = null;
      this.rawQrString = null;
      this.expiresAt = null;
    }, this.QR_TTL_MS);

    return this.currentQrDataUrl;
  }

  /**
   * Retrieves the current QR from in-memory cache without generating or modifying anything.
   * Safe for high-frequency polling.
   */
  public getCachedQr(currentState: WhatsAppState): QrData {
    // If connected or logged out or in invalid state, never return a QR
    if (currentState === 'CONNECTED' || currentState === 'AUTHENTICATING' || currentState === 'QR_SCANNED') {
      return {
        qrDataUrl: null,
        expiresAt: null,
        state: currentState
      };
    }

    // Check if expired
    if (this.expiresAt && new Date(this.expiresAt).getTime() < Date.now()) {
      return {
        qrDataUrl: null,
        expiresAt: null,
        state: currentState
      };
    }

    if (this.currentQrDataUrl) {
      HandshakeDiagnostics.getInstance().recordQrDisplayed({ expiresAt: this.expiresAt });
    }

    return {
      qrDataUrl: this.currentQrDataUrl,
      expiresAt: this.expiresAt,
      state: currentState
    };
  }

  public isValid(): boolean {
    if (!this.currentQrDataUrl || !this.expiresAt) return false;
    return new Date(this.expiresAt).getTime() > Date.now();
  }

  /**
   * Clears QR immediately (e.g., when scanned, authenticated, or connected)
   */
  public clear(): void {
    if (this.qrTimeout) {
      clearTimeout(this.qrTimeout);
      this.qrTimeout = null;
    }
    this.currentQrDataUrl = null;
    this.rawQrString = null;
    this.expiresAt = null;
  }
}
