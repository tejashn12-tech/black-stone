import { getAdminDb, runFirestoreTransaction, isQuotaExhaustedError } from '../../config/firebase';
import { sanitizeWhatsAppError } from '../messaging/MessageStatusTracker';
import { logger } from '../../utils/logger';

export type IdempotencyState = 'PENDING' | 'SUCCESS' | 'FAILED';

export interface IdempotencyRecord {
  idempotencyKey: string;
  status: IdempotencyState;
  lockedAt: string;
  lockedUntil: number; // epoch ms
  completedAt?: string | null;
  failedAt?: string | null;
  trackingId?: string | null;
  messageId?: string | null;
  recipientPhone: string;
  recipientName?: string;
  type?: string;
  attempts: number;
  lastError?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AcquireLockResult {
  canSend: boolean;
  reason?: 'ALREADY_SENT' | 'IN_FLIGHT' | 'RETRY_COOLDOWN';
  record?: IdempotencyRecord;
  message?: string;
}

export class IdempotencyManager {
  private static instance: IdempotencyManager | null = null;

  // In-memory mutex map to serialize concurrent promises in the local event loop
  private localMutexLocks: Map<string, Promise<any>> = new Map();

  // In-memory cache of idempotency records for fast lookup & offline fallback
  private inMemoryRecords: Map<string, IdempotencyRecord> = new Map();

  // Config: Lock time-to-live for in-flight dispatch (60 seconds)
  private readonly IN_FLIGHT_LOCK_TTL_MS = 60 * 1000;

  // Config: Minimum cooldown between failed retry attempts (3 seconds)
  private readonly RETRY_COOLDOWN_MS = 3 * 1000;

  private constructor() {}

  public static getInstance(): IdempotencyManager {
    if (!IdempotencyManager.instance) {
      IdempotencyManager.instance = new IdempotencyManager();
    }
    return IdempotencyManager.instance;
  }

  /**
   * Sanitizes key for safe Firestore document ID representation
   */
  public sanitizeDocKey(rawKey: string): string {
    return rawKey.trim().replace(/\//g, '__');
  }

  /**
   * Atomically acquires a message dispatch lock using Firestore transaction.
   * Prevents duplicate sending across multiple processes, tabs, server restarts,
   * or scheduler runs.
   */
  public async acquireLock(
    idempotencyKey: string,
    details: {
      recipientPhone: string;
      recipientName?: string;
      type?: string;
    }
  ): Promise<AcquireLockResult> {
    if (!idempotencyKey || !idempotencyKey.trim()) {
      return { canSend: true };
    }

    const docKey = this.sanitizeDocKey(idempotencyKey);

    // Wait on any existing local in-flight promise for this exact key
    while (this.localMutexLocks.has(docKey)) {
      try {
        await this.localMutexLocks.get(docKey);
      } catch {}
    }

    let resolveMutex: () => void = () => {};
    const mutexPromise = new Promise<void>((resolve) => {
      resolveMutex = resolve;
    });
    this.localMutexLocks.set(docKey, mutexPromise);

    try {
      return await this.executeTransactionalAcquire(docKey, idempotencyKey, details);
    } finally {
      this.localMutexLocks.delete(docKey);
      resolveMutex();
    }
  }

  private async executeTransactionalAcquire(
    docKey: string,
    idempotencyKey: string,
    details: {
      recipientPhone: string;
      recipientName?: string;
      type?: string;
    }
  ): Promise<AcquireLockResult> {
    const db = getAdminDb();
    const now = Date.now();
    const nowIso = new Date(now).toISOString();

    if (!db) {
      return this.acquireInMemoryFallback(idempotencyKey, details);
    }

    const docRef = db.collection('whatsappIdempotency').doc(docKey);

    try {
      const result = await runFirestoreTransaction<AcquireLockResult>(async (tx) => {
        const snap = await tx.get(docRef);

        if (snap.exists) {
          const existing = snap.data() as IdempotencyRecord;

          // 1. Check whether this idempotency key already has a successful message
          if (existing.status === 'SUCCESS') {
            return {
              canSend: false,
              reason: 'ALREADY_SENT',
              record: existing,
              message: `Message with idempotency key "${idempotencyKey}" was already delivered successfully.`
            };
          }

          // 2. Check if currently sending (in flight)
          if (existing.status === 'PENDING') {
            const isLockStillValid = now < (existing.lockedUntil || 0);

            if (isLockStillValid) {
              return {
                canSend: false,
                reason: 'IN_FLIGHT',
                record: existing,
                message: `Message with idempotency key "${idempotencyKey}" is currently being dispatched by another process. Duplicate send prevented.`
              };
            }

            // Lock has expired (> 60s without resolution, likely previous server crashed / timed out)
            // Allow controlled retry
            const updatedPending: IdempotencyRecord = {
              ...existing,
              status: 'PENDING',
              lockedAt: nowIso,
              lockedUntil: now + this.IN_FLIGHT_LOCK_TTL_MS,
              attempts: (existing.attempts || 1) + 1,
              updatedAt: nowIso
            };

            tx.set(docRef, updatedPending, { merge: true });
            return {
              canSend: true,
              record: updatedPending
            };
          }

          // 3. Previous attempt failed -> allow controlled retry
          if (existing.status === 'FAILED') {
            const timeSinceFailed = existing.failedAt ? now - new Date(existing.failedAt).getTime() : 999999;
            if (timeSinceFailed < this.RETRY_COOLDOWN_MS) {
              const waitMs = this.RETRY_COOLDOWN_MS - timeSinceFailed;
              return {
                canSend: false,
                reason: 'RETRY_COOLDOWN',
                record: existing,
                message: `Controlled retry cooldown active. Please wait ${Math.ceil(waitMs / 1000)}s before retrying.`
              };
            }

            const updatedRetry: IdempotencyRecord = {
              ...existing,
              status: 'PENDING',
              lockedAt: nowIso,
              lockedUntil: now + this.IN_FLIGHT_LOCK_TTL_MS,
              attempts: (existing.attempts || 0) + 1,
              updatedAt: nowIso
            };

            tx.set(docRef, updatedRetry, { merge: true });
            return {
              canSend: true,
              record: updatedRetry
            };
          }
        }

        // 4. Document does not exist: fresh reservation
        const newRecord: IdempotencyRecord = {
          idempotencyKey,
          status: 'PENDING',
          lockedAt: nowIso,
          lockedUntil: now + this.IN_FLIGHT_LOCK_TTL_MS,
          completedAt: null,
          failedAt: null,
          trackingId: null,
          messageId: null,
          recipientPhone: details.recipientPhone,
          recipientName: details.recipientName || '',
          type: details.type || 'custom',
          attempts: 1,
          lastError: null,
          createdAt: nowIso,
          updatedAt: nowIso
        };

        tx.set(docRef, newRecord);
        return {
          canSend: true,
          record: newRecord
        };
      });

      if (result.record) {
        this.inMemoryRecords.set(idempotencyKey, result.record);
      }

      return result;
    } catch (err: any) {
      if (!isQuotaExhaustedError(err)) {
        logger.info({ reason: err?.message, key: idempotencyKey }, 'Firestore idempotency transaction notice; utilizing memory guard');
      }
      return this.acquireInMemoryFallback(idempotencyKey, details);
    }
  }

  private acquireInMemoryFallback(
    idempotencyKey: string,
    details: {
      recipientPhone: string;
      recipientName?: string;
      type?: string;
    }
  ): AcquireLockResult {
    const now = Date.now();
    const nowIso = new Date(now).toISOString();
    const existing = this.inMemoryRecords.get(idempotencyKey);

    if (existing) {
      if (existing.status === 'SUCCESS') {
        return {
          canSend: false,
          reason: 'ALREADY_SENT',
          record: existing,
          message: `Message with key "${idempotencyKey}" already sent.`
        };
      }

      if (existing.status === 'PENDING' && now < existing.lockedUntil) {
        return {
          canSend: false,
          reason: 'IN_FLIGHT',
          record: existing,
          message: `Message with key "${idempotencyKey}" is currently sending.`
        };
      }
    }

    const record: IdempotencyRecord = {
      idempotencyKey,
      status: 'PENDING',
      lockedAt: nowIso,
      lockedUntil: now + this.IN_FLIGHT_LOCK_TTL_MS,
      completedAt: null,
      failedAt: null,
      trackingId: null,
      messageId: null,
      recipientPhone: details.recipientPhone,
      recipientName: details.recipientName || '',
      type: details.type || 'custom',
      attempts: (existing?.attempts || 0) + 1,
      lastError: null,
      createdAt: existing?.createdAt || nowIso,
      updatedAt: nowIso
    };

    this.inMemoryRecords.set(idempotencyKey, record);
    return { canSend: true, record };
  }

  /**
   * Finalizes the idempotency record as SUCCESS
   * Never allows multiple successful sends for the same idempotency key.
   */
  public async markSuccess(
    idempotencyKey: string,
    result: { messageId?: string; trackingId?: string }
  ): Promise<void> {
    if (!idempotencyKey) return;
    const docKey = this.sanitizeDocKey(idempotencyKey);
    const nowIso = new Date().toISOString();

    const mem = this.inMemoryRecords.get(idempotencyKey);
    if (mem) {
      mem.status = 'SUCCESS';
      mem.completedAt = nowIso;
      mem.messageId = result.messageId || mem.messageId || null;
      mem.trackingId = result.trackingId || mem.trackingId || null;
      mem.updatedAt = nowIso;
    }

    try {
      const db = getAdminDb();
      if (!db) return;

      await db.collection('whatsappIdempotency').doc(docKey).set(
        {
          status: 'SUCCESS',
          completedAt: nowIso,
          messageId: result.messageId || null,
          trackingId: result.trackingId || null,
          updatedAt: nowIso
        },
        { merge: true }
      );
    } catch (err: any) {
      if (!isQuotaExhaustedError(err)) {
        logger.info({ reason: err?.message, key: idempotencyKey }, 'Notice updating idempotency SUCCESS record in database');
      }
    }
  }

  /**
   * Finalizes the idempotency record as FAILED, which allows controlled retry.
   */
  public async markFailed(idempotencyKey: string, error: any): Promise<void> {
    if (!idempotencyKey) return;
    const docKey = this.sanitizeDocKey(idempotencyKey);
    const nowIso = new Date().toISOString();
    const sanitizedErr = sanitizeWhatsAppError(error);

    const mem = this.inMemoryRecords.get(idempotencyKey);
    if (mem) {
      mem.status = 'FAILED';
      mem.failedAt = nowIso;
      mem.lastError = sanitizedErr;
      mem.updatedAt = nowIso;
    }

    try {
      const db = getAdminDb();
      if (!db) return;

      await db.collection('whatsappIdempotency').doc(docKey).set(
        {
          status: 'FAILED',
          failedAt: nowIso,
          lastError: sanitizedErr,
          updatedAt: nowIso
        },
        { merge: true }
      );
    } catch (err: any) {
      if (!isQuotaExhaustedError(err)) {
        logger.info({ reason: err?.message, key: idempotencyKey }, 'Notice updating idempotency state record in database');
      }
    }
  }

  /**
   * Release an in-flight lock without marking failed (e.g. invalid inputs before send attempt)
   */
  public async releaseLock(idempotencyKey: string): Promise<void> {
    if (!idempotencyKey) return;
    const docKey = this.sanitizeDocKey(idempotencyKey);

    this.inMemoryRecords.delete(idempotencyKey);

    try {
      const db = getAdminDb();
      if (!db) return;
      await db.collection('whatsappIdempotency').doc(docKey).delete();
    } catch {}
  }

  /**
   * Records or updates the idempotency record as PENDING (e.g. queued waiting for connection)
   */
  public async markPending(
    idempotencyKey: string,
    details?: {
      recipientPhone?: string;
      recipientName?: string;
      reason?: string;
    }
  ): Promise<void> {
    if (!idempotencyKey) return;
    const docKey = this.sanitizeDocKey(idempotencyKey);
    const nowIso = new Date().toISOString();

    const mem = this.inMemoryRecords.get(idempotencyKey);
    if (mem) {
      mem.status = 'PENDING';
      mem.updatedAt = nowIso;
    } else {
      const newRec: IdempotencyRecord = {
        idempotencyKey,
        status: 'PENDING',
        lockedAt: nowIso,
        lockedUntil: 0, // Not locked against execution, simply pending
        completedAt: null,
        failedAt: null,
        trackingId: null,
        messageId: null,
        recipientPhone: details?.recipientPhone || '',
        recipientName: details?.recipientName || '',
        type: 'expiry_reminder',
        attempts: 0,
        lastError: null,
        createdAt: nowIso,
        updatedAt: nowIso
      };
      this.inMemoryRecords.set(idempotencyKey, newRec);
    }

    try {
      const db = getAdminDb();
      if (!db) return;

      await db.collection('whatsappIdempotency').doc(docKey).set(
        {
          idempotencyKey,
          status: 'PENDING',
          recipientPhone: details?.recipientPhone || '',
          recipientName: details?.recipientName || '',
          type: 'expiry_reminder',
          updatedAt: nowIso
        },
        { merge: true }
      );
    } catch (err: any) {
      if (!isQuotaExhaustedError(err)) {
        logger.info({ reason: err?.message, key: idempotencyKey }, 'Notice updating idempotency PENDING record');
      }
    }
  }

  /**
   * Queries existing record for a key
   */
  public async getRecord(idempotencyKey: string): Promise<IdempotencyRecord | null> {
    if (!idempotencyKey) return null;
    const docKey = this.sanitizeDocKey(idempotencyKey);

    const cached = this.inMemoryRecords.get(idempotencyKey);
    if (cached) return cached;

    try {
      const db = getAdminDb();
      if (!db) return null;

      const snap = await db.collection('whatsappIdempotency').doc(docKey).get();
      if (snap.exists) {
        const data = snap.data() as IdempotencyRecord;
        this.inMemoryRecords.set(idempotencyKey, data);
        return data;
      }
    } catch {}

    return null;
  }
}
