import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  initializeFirestore,
  doc,
  getDoc,
  disableNetwork,
  enableNetwork,
  setLogLevel
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Silence internal Firestore gRPC debug/stream logs
try {
  setLogLevel('silent');
} catch {}

// CRITICAL: Initialize Firestore with explicit database ID from config and resilient long-polling configuration
export const db = initializeFirestore(
  app,
  {
    experimentalForceLongPolling: true,
    ignoreUndefinedProperties: true
  },
  firebaseConfig.firestoreDatabaseId
);

export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export const QUOTA_STORAGE_KEY = 'bsf_firestore_quota_exhausted_v1';

// Global listeners for quota changes
type QuotaListener = (exhausted: boolean) => void;
const quotaListeners = new Set<QuotaListener>();

export function isQuotaExhaustedError(error: unknown): boolean {
  if (!error) return false;
  const msg = error instanceof Error ? `${error.name}: ${error.message} ${error.stack || ''}` : String(error);
  const code = (error as any)?.code;
  return (
    code === 'resource-exhausted' ||
    code === 8 ||
    msg.includes('RESOURCE_EXHAUSTED') ||
    msg.includes('resource-exhausted') ||
    msg.includes('Quota limit exceeded') ||
    msg.includes('Free daily write units') ||
    msg.includes('free tier database') ||
    msg.includes('Code: 8') ||
    (msg.includes('GrpcConnection') && msg.includes('stream') && msg.includes('Write'))
  );
}

// Check if quota was marked exhausted today
export function isFirestoreQuotaExhausted(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const stored = localStorage.getItem(QUOTA_STORAGE_KEY);
    if (!stored) return false;
    const { timestamp } = JSON.parse(stored);
    // Quota resets daily; check if marked within last 24 hours
    if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
      return true;
    } else {
      localStorage.removeItem(QUOTA_STORAGE_KEY);
      return false;
    }
  } catch {
    return false;
  }
}

export function subscribeToQuotaStatus(listener: QuotaListener): () => void {
  quotaListeners.add(listener);
  listener(isFirestoreQuotaExhausted());
  return () => quotaListeners.delete(listener);
}

export async function triggerQuotaExhaustedMode(reason?: string) {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        QUOTA_STORAGE_KEY,
        JSON.stringify({
          timestamp: Date.now(),
          date: new Date().toISOString(),
          reason: reason || 'Free daily write units per project exceeded'
        })
      );
    }
    quotaListeners.forEach(fn => {
      try { fn(true); } catch {}
    });

    // CRITICAL: Disable Firestore network to immediately stop and disconnect
    // the retrying GrpcConnection 'Write' stream that emits RESOURCE_EXHAUSTED errors
    await disableNetwork(db).catch(() => {});
    console.info('[Firestore] Daily free write quota reached. Disconnected cloud write stream and switched seamlessly to local storage mode.');
  } catch (err) {
    console.warn('[Firestore] Error entering quota-exhausted mode:', err);
  }
}

export async function resetQuotaExhaustedMode(): Promise<boolean> {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(QUOTA_STORAGE_KEY);
    }
    await enableNetwork(db).catch(() => {});
    quotaListeners.forEach(fn => {
      try { fn(false); } catch {}
    });
    console.info('[Firestore] Re-enabled network connection.');
    return true;
  } catch (err) {
    console.warn('[Firestore] Could not enable network:', err);
    return false;
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  if (isQuotaExhaustedError(error)) {
    triggerQuotaExhaustedMode(error instanceof Error ? error.message : String(error));
    return {
      error: 'Firestore daily write quota reached. System switched to local storage mode safely.',
      operationType,
      path,
      authInfo: { userId: null, email: null }
    };
  }

  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.warn('Firestore Operation Notice: ', JSON.stringify(errInfo));
  return errInfo;
}

// Resilient connection check on boot
export async function testConnection() {
  if (isFirestoreQuotaExhausted()) {
    return;
  }
  try {
    // Non-blocking cached or online check
    await getDoc(doc(db, 'settings', 'general'));
    console.log('Firebase Firestore connection active.');
  } catch (error) {
    if (isQuotaExhaustedError(error)) {
      triggerQuotaExhaustedMode(error instanceof Error ? error.message : String(error));
    } else if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore is running in offline cached mode.');
    }
  }
}

// Intercept unhandled Firestore write stream errors on client boot
if (typeof window !== 'undefined') {
  // If already exhausted from a previous session today, disconnect stream immediately
  if (isFirestoreQuotaExhausted()) {
    disableNetwork(db).catch(() => {});
  }

  // Intercept any unhandled gRPC write stream errors or console logs
  const checkAndSuppressQuotaError = (...args: any[]): boolean => {
    const combined = args
      .map(arg => {
        if (!arg) return '';
        if (typeof arg === 'string') return arg;
        if (arg instanceof Error) return `${arg.name}: ${arg.message} ${arg.stack || ''}`;
        try {
          return JSON.stringify(arg);
        } catch {
          return String(arg);
        }
      })
      .join(' ');

    if (
      combined.includes('RESOURCE_EXHAUSTED') ||
      combined.includes('resource-exhausted') ||
      combined.includes('Quota limit exceeded') ||
      combined.includes('Free daily write units') ||
      combined.includes('free tier database') ||
      (combined.includes('GrpcConnection') && combined.includes('stream'))
    ) {
      triggerQuotaExhaustedMode(combined);
      return true;
    }
    return false;
  };

  window.addEventListener('error', (event) => {
    if (checkAndSuppressQuotaError(event.message, event.error)) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);

  window.addEventListener('unhandledrejection', (event) => {
    if (checkAndSuppressQuotaError(event.reason?.message, event.reason)) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);

  // Suppress repeated console.error & console.warn from @firebase/firestore GrpcConnection Write stream
  const origConsoleError = console.error;
  console.error = function(...args: any[]) {
    if (checkAndSuppressQuotaError(...args)) {
      // Stream stopped cleanly
      return;
    }
    origConsoleError.apply(console, args);
  };

  const origConsoleWarn = console.warn;
  console.warn = function(...args: any[]) {
    if (checkAndSuppressQuotaError(...args)) {
      return;
    }
    origConsoleWarn.apply(console, args);
  };

  setTimeout(() => {
    testConnection().catch(() => {});
  }, 1000);
}

