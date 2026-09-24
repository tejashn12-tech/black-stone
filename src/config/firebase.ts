import { initializeApp as initAdminApp, cert, getApps as getAdminApps, App as AdminApp } from 'firebase-admin/app';
import { getAuth as getAdminAuthInstance, Auth as AdminAuth } from 'firebase-admin/auth';
import { getFirestore as getAdminFirestoreInstance, Firestore as AdminFirestore } from 'firebase-admin/firestore';
import { initializeApp as initClientApp, getApps as getClientApps, FirebaseApp } from 'firebase/app';
import {
  initializeFirestore as initClientFirestore,
  doc as clientDoc,
  getDoc as clientGetDoc,
  setDoc as clientSetDoc,
  deleteDoc as clientDeleteDoc,
  collection as clientCollection,
  query as clientQuery,
  where as clientWhere,
  limit as clientLimit,
  getDocs as clientGetDocs,
  Firestore as ClientFirestore,
  WhereFilterOp,
  setLogLevel,
  runTransaction as clientRunTransaction,
} from 'firebase/firestore';
import { logger } from '../utils/logger';
import firebaseClientConfig from '../../firebase-applet-config.json';

try {
  setLogLevel('silent');
} catch {}

let adminApp: AdminApp | null = null;
let adminAuth: AdminAuth | null = null;
let adminDb: AdminFirestore | null = null;

let clientApp: FirebaseApp | null = null;
let clientDb: ClientFirestore | null = null;
let webDbAdapter: any = null;

// Server-side quota exhaustion guard
let isServerQuotaExhausted = false;
let quotaExhaustedUntil = 0;

export function isQuotaExhaustedError(err: any): boolean {
  if (!err) return false;
  const str = err?.message || err?.stack || String(err || '');
  const code = err?.code;
  return (
    code === 'resource-exhausted' ||
    code === 8 ||
    str.includes('RESOURCE_EXHAUSTED') ||
    str.includes('resource-exhausted') ||
    str.includes('Quota limit exceeded') ||
    str.includes('Free daily write units') ||
    str.includes('free tier database') ||
    str.includes('Write stream')
  );
}

function markQuotaExhausted(err?: any) {
  isServerQuotaExhausted = true;
  // Suspend server-side Firestore write retries for 30 minutes
  quotaExhaustedUntil = Date.now() + 30 * 60 * 1000;
  logger.info({ reason: err?.message || 'Quota limit exceeded' }, 'Server Firestore write quota limit reached; operating in safe read-only/in-memory mode');
}

const hasServiceAccount = Boolean(
  process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY
);

export function initializeFirebaseAdmin(): { app: AdminApp; auth: AdminAuth; db: any } {
  if (adminApp && adminAuth && (adminDb || webDbAdapter)) {
    return { app: adminApp, auth: adminAuth, db: getAdminDb() };
  }

  const existingAdminApps = getAdminApps();
  const projectId =
    process.env.FIREBASE_PROJECT_ID ||
    process.env.VITE_FIREBASE_PROJECT_ID ||
    firebaseClientConfig.projectId ||
    'silver-day-h5jvd';

  if (existingAdminApps.length > 0) {
    adminApp = existingAdminApps[0];
  } else {
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;

    try {
      if (clientEmail && privateKeyRaw) {
        const privateKey = privateKeyRaw.replace(/\\n/g, '\n');
        adminApp = initAdminApp({
          credential: cert({
            projectId,
            clientEmail,
            privateKey,
          }),
          projectId,
        });
        logger.info({ projectId, clientEmail }, 'Firebase Admin initialized with service account credentials');
      } else {
        // Application default credentials
        adminApp = initAdminApp({
          projectId,
        });
        logger.info({ projectId }, 'Firebase Admin initialized with project credentials');
      }
    } catch (err: any) {
      logger.warn({ error: err?.message }, 'Firebase Admin initialization warning; proceeding with fallback');
      adminApp = initAdminApp({ projectId }, 'fallback-admin-app');
    }
  }

  adminAuth = getAdminAuthInstance(adminApp);

  const firestoreDbId =
    process.env.FIRESTORE_DATABASE_ID ||
    firebaseClientConfig.firestoreDatabaseId ||
    '(default)';

  if (hasServiceAccount) {
    try {
      adminDb = getAdminFirestoreInstance(adminApp, firestoreDbId);
    } catch {
      adminDb = getAdminFirestoreInstance(adminApp);
    }
  }

  return { app: adminApp, auth: adminAuth, db: getAdminDb() };
}

/**
 * Web Firestore adapter used when service account keys are not provided
 * or when gRPC permissions are restricted in cloud containers.
 */
function getWebDbAdapter(): any {
  if (webDbAdapter) {
    return webDbAdapter;
  }

  const existingClientApps = getClientApps();
  if (existingClientApps.length > 0) {
    clientApp = existingClientApps[0];
  } else {
    clientApp = initClientApp(firebaseClientConfig, 'bsf-server-db-client');
  }

  const firestoreDbId =
    process.env.FIRESTORE_DATABASE_ID ||
    firebaseClientConfig.firestoreDatabaseId ||
    '(default)';

  clientDb = initClientFirestore(
    clientApp,
    {
      experimentalForceLongPolling: true,
      ignoreUndefinedProperties: true,
    },
    firestoreDbId
  );

  function createDocAdapter(documentRef: any): any {
    return {
      id: documentRef.id,
      _clientDocRef: documentRef,
      path: documentRef.path,
      async get() {
        const snap = await clientGetDoc(documentRef);
        return {
          id: snap.id,
          exists: snap.exists(),
          data: () => snap.data(),
        };
      },
      async set(data: any, options?: { merge?: boolean }) {
        if (isServerQuotaExhausted && Date.now() < quotaExhaustedUntil) {
          return;
        }
        try {
          return await clientSetDoc(documentRef, data, options || {});
        } catch (err: any) {
          if (isQuotaExhaustedError(err)) {
            markQuotaExhausted(err);
            return;
          }
          throw err;
        }
      },
      async update(data: any) {
        if (isServerQuotaExhausted && Date.now() < quotaExhaustedUntil) {
          return;
        }
        try {
          return await clientSetDoc(documentRef, data, { merge: true });
        } catch (err: any) {
          if (isQuotaExhaustedError(err)) {
            markQuotaExhausted(err);
            return;
          }
          throw err;
        }
      },
      async delete() {
        if (isServerQuotaExhausted && Date.now() < quotaExhaustedUntil) {
          return;
        }
        try {
          return await clientDeleteDoc(documentRef);
        } catch (err: any) {
          if (isQuotaExhaustedError(err)) {
            markQuotaExhausted(err);
            return;
          }
          throw err;
        }
      },
      collection(subcollectionName: string) {
        const subColRef = clientCollection(documentRef, subcollectionName);
        return createCollectionAdapter(subColRef);
      },
    };
  }

  function createCollectionAdapter(colRef: any): any {
    const buildQuery = (currentQuery: any) => ({
      where(field: string, op: string, val: any) {
        return buildQuery(clientQuery(currentQuery, clientWhere(field, op as WhereFilterOp, val)));
      },
      limit(n: number) {
        return buildQuery(clientQuery(currentQuery, clientLimit(n)));
      },
      async get() {
        const snap = await clientGetDocs(currentQuery);
        const docs = snap.docs.map((d) => ({
          id: d.id,
          exists: d.exists(),
          data: () => d.data(),
        }));
        return {
          empty: snap.empty,
          size: snap.size,
          docs,
        };
      },
    });

    return {
      doc(docId?: string) {
        const documentRef = docId ? clientDoc(colRef, docId) : clientDoc(colRef);
        return createDocAdapter(documentRef);
      },
      where(field: string, op: string, val: any) {
        return buildQuery(clientQuery(colRef, clientWhere(field, op as WhereFilterOp, val)));
      },
      limit(n: number) {
        return buildQuery(clientQuery(colRef, clientLimit(n)));
      },
      async get() {
        return await buildQuery(colRef).get();
      },
    };
  }

  webDbAdapter = {
    collection(collectionName: string) {
      const colRef = clientCollection(clientDb!, collectionName);
      return createCollectionAdapter(colRef);
    },
    doc(docPath: string) {
      const documentRef = clientDoc(clientDb!, docPath);
      return createDocAdapter(documentRef);
    },
  };

  return webDbAdapter;
}

// Lazy getters
export function getAdminAuth(): AdminAuth {
  if (!adminAuth) {
    initializeFirebaseAdmin();
  }
  return adminAuth!;
}

export function getAdminDb(): any {
  if (hasServiceAccount && adminDb) {
    return adminDb;
  }
  return getWebDbAdapter();
}

/**
 * Universal Firestore transaction runner that works across both Admin SDK
 * and Client SDK adapter fallback.
 */
export async function runFirestoreTransaction<T>(
  updateFunction: (transaction: {
    get: (docRef: any) => Promise<{ exists: boolean; data: () => any }>;
    set: (docRef: any, data: any, options?: { merge?: boolean }) => void;
    update: (docRef: any, data: any) => void;
  }) => Promise<T>
): Promise<T> {
  const db = getAdminDb();

  // If using native Admin Firestore SDK with service account
  if (hasServiceAccount && adminDb) {
    return await adminDb.runTransaction(async (adminTx: any) => {
      const txAdapter = {
        async get(docRef: any) {
          const rawRef = docRef._rawRef || docRef;
          const snap = await adminTx.get(rawRef);
          return {
            exists: typeof snap.exists === 'function' ? snap.exists() : Boolean(snap.exists),
            data: () => snap.data()
          };
        },
        set(docRef: any, data: any, options?: { merge?: boolean }) {
          const rawRef = docRef._rawRef || docRef;
          adminTx.set(rawRef, data, options || {});
        },
        update(docRef: any, data: any) {
          const rawRef = docRef._rawRef || docRef;
          adminTx.update(rawRef, data);
        }
      };
      return await updateFunction(txAdapter);
    });
  }

  // If using Web Client Firestore SDK adapter
  if (clientDb) {
    try {
      return await clientRunTransaction(clientDb, async (clientTx) => {
        const txAdapter = {
          async get(docRef: any) {
            const rawRef = docRef._clientDocRef || (typeof docRef === 'string' ? clientDoc(clientDb!, docRef) : docRef);
            const snap = await clientTx.get(rawRef);
            return {
              exists: snap.exists(),
              data: () => snap.data()
            };
          },
          set(docRef: any, data: any, options?: { merge?: boolean }) {
            const rawRef = docRef._clientDocRef || (typeof docRef === 'string' ? clientDoc(clientDb!, docRef) : docRef);
            clientTx.set(rawRef, data, options || {});
          },
          update(docRef: any, data: any) {
            const rawRef = docRef._clientDocRef || (typeof docRef === 'string' ? clientDoc(clientDb!, docRef) : docRef);
            clientTx.set(rawRef, data, { merge: true });
          }
        };
        return await updateFunction(txAdapter);
      });
    } catch (txErr: any) {
      // In case web long-polling transactions encounter concurrency or quota, fallback gracefully
      logger.info({ reason: txErr?.message }, 'Client Firestore transaction notice; operating with serialized read-write adapter');
    }
  }

  // Graceful fallback for environments where transactions cannot run over long-polling
  const txFallbackAdapter = {
    async get(docRef: any) {
      if (typeof docRef.get === 'function') {
        const snap = await docRef.get();
        return {
          exists: typeof snap.exists === 'function' ? snap.exists() : Boolean(snap.exists),
          data: () => (typeof snap.data === 'function' ? snap.data() : snap.data)
        };
      }
      return { exists: false, data: () => null };
    },
    set(docRef: any, data: any, options?: { merge?: boolean }) {
      if (typeof docRef.set === 'function') {
        docRef.set(data, options).catch(() => {});
      }
    },
    update(docRef: any, data: any) {
      if (typeof docRef.update === 'function') {
        docRef.update(data).catch(() => {});
      } else if (typeof docRef.set === 'function') {
        docRef.set(data, { merge: true }).catch(() => {});
      }
    }
  };
  return await updateFunction(txFallbackAdapter);
}

