import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  writeBatch
} from 'firebase/firestore';
import {
  db,
  handleFirestoreError,
  OperationType,
  isFirestoreQuotaExhausted,
  isQuotaExhaustedError,
  triggerQuotaExhaustedMode
} from './firebase';
import {
  Member,
  MembershipPackage,
  PaymentRecord,
  Trainer,
  Enquiry,
  GymSettings,
  ConsentRecord,
  DataSubjectRequest
} from '../types';

// Helper to remove undefined values recursively before Firestore writes
export function cleanForFirestore<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => cleanForFirestore(item)).filter(item => item !== undefined) as unknown as T;
  }
  if (typeof obj === 'object' && !(obj instanceof Date)) {
    const clean: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        clean[key] = cleanForFirestore(value);
      }
    }
    return clean as T;
  }
  return obj;
}

// Collections
export const COLLECTIONS = {
  MEMBERS: 'members',
  PACKAGES: 'packages',
  PAYMENTS: 'payments',
  TRAINERS: 'trainers',
  ENQUIRIES: 'enquiries',
  SETTINGS: 'settings',
  CONSENT_RECORDS: 'consentRecords',
  DATA_SUBJECT_REQUESTS: 'dataSubjectRequests'
};

// Seed initial data to Firestore if collection is empty or has missing records
export async function seedCollectionIfEmpty<T extends { id: string }>(
  collectionName: string,
  initialData: T[]
) {
  if (isFirestoreQuotaExhausted()) {
    console.info(`[Firestore] Skipping seed for ${collectionName} because write quota is exhausted.`);
    return;
  }

  try {
    const colRef = collection(db, collectionName);
    const snap = await getDocs(colRef);
    const existingIds = new Set(snap.docs.map(d => d.id));
    const missingItems = initialData.filter(item => !existingIds.has(item.id));

    if (missingItems.length > 0) {
      console.log(`Syncing ${missingItems.length} records for ${collectionName} to Firestore...`);
      // Chunk writes into batches of 400 to respect Firestore batch limits (max 500)
      for (let i = 0; i < missingItems.length; i += 400) {
        if (isFirestoreQuotaExhausted()) break;
        const chunk = missingItems.slice(i, i + 400);
        const batch = writeBatch(db);
        chunk.forEach(item => {
          const docRef = doc(db, collectionName, item.id);
          batch.set(docRef, cleanForFirestore(item), { merge: true });
        });
        await batch.commit();
      }
      console.log(`Syncing for ${collectionName} completed.`);
    }
  } catch (error) {
    if (isQuotaExhaustedError(error)) {
      triggerQuotaExhaustedMode(error instanceof Error ? error.message : String(error));
      return;
    }
    handleFirestoreError(error, OperationType.WRITE, collectionName);
  }
}

// Seed settings doc
export async function seedSettingsIfEmpty(initialSettings: GymSettings) {
  if (isFirestoreQuotaExhausted()) return;

  try {
    const docRef = doc(db, COLLECTIONS.SETTINGS, 'general');
    const snap = await getDocs(collection(db, COLLECTIONS.SETTINGS));
    if (snap.empty) {
      console.log('Seeding settings to Firestore...');
      await setDoc(docRef, cleanForFirestore(initialSettings));
    }
  } catch (error) {
    if (isQuotaExhaustedError(error)) {
      triggerQuotaExhaustedMode(error instanceof Error ? error.message : String(error));
      return;
    }
    handleFirestoreError(error, OperationType.WRITE, 'settings/general');
  }
}

// Firestore operations for Members
export async function fsSaveMember(member: Member) {
  if (isFirestoreQuotaExhausted()) return;
  try {
    await setDoc(doc(db, COLLECTIONS.MEMBERS, member.id), cleanForFirestore(member));
  } catch (error) {
    if (isQuotaExhaustedError(error)) {
      triggerQuotaExhaustedMode(error instanceof Error ? error.message : String(error));
      return;
    }
    handleFirestoreError(error, OperationType.WRITE, `members/${member.id}`);
  }
}

export async function fsUpdateMember(id: string, updates: Partial<Member>) {
  if (isFirestoreQuotaExhausted()) return;
  try {
    await setDoc(doc(db, COLLECTIONS.MEMBERS, id), cleanForFirestore(updates), { merge: true });
  } catch (error) {
    if (isQuotaExhaustedError(error)) {
      triggerQuotaExhaustedMode(error instanceof Error ? error.message : String(error));
      return;
    }
    handleFirestoreError(error, OperationType.UPDATE, `members/${id}`);
  }
}

export async function fsDeleteMember(id: string) {
  if (isFirestoreQuotaExhausted()) return;
  try {
    await deleteDoc(doc(db, COLLECTIONS.MEMBERS, id));
  } catch (error) {
    if (isQuotaExhaustedError(error)) {
      triggerQuotaExhaustedMode(error instanceof Error ? error.message : String(error));
      return;
    }
    handleFirestoreError(error, OperationType.DELETE, `members/${id}`);
  }
}

// Firestore operations for Payments
export async function fsSavePayment(payment: PaymentRecord) {
  if (isFirestoreQuotaExhausted()) return;
  try {
    await setDoc(doc(db, COLLECTIONS.PAYMENTS, payment.id), cleanForFirestore(payment));
  } catch (error) {
    if (isQuotaExhaustedError(error)) {
      triggerQuotaExhaustedMode(error instanceof Error ? error.message : String(error));
      return;
    }
    handleFirestoreError(error, OperationType.WRITE, `payments/${payment.id}`);
  }
}

export async function fsUpdatePayment(id: string, updates: Partial<PaymentRecord>) {
  if (isFirestoreQuotaExhausted()) return;
  try {
    await setDoc(doc(db, COLLECTIONS.PAYMENTS, id), cleanForFirestore(updates), { merge: true });
  } catch (error) {
    if (isQuotaExhaustedError(error)) {
      triggerQuotaExhaustedMode(error instanceof Error ? error.message : String(error));
      return;
    }
    handleFirestoreError(error, OperationType.UPDATE, `payments/${id}`);
  }
}

export async function fsDeletePayment(id: string) {
  if (isFirestoreQuotaExhausted()) return;
  try {
    await deleteDoc(doc(db, COLLECTIONS.PAYMENTS, id));
  } catch (error) {
    if (isQuotaExhaustedError(error)) {
      triggerQuotaExhaustedMode(error instanceof Error ? error.message : String(error));
      return;
    }
    handleFirestoreError(error, OperationType.DELETE, `payments/${id}`);
  }
}

// Firestore operations for Packages
export async function fsSavePackage(pkg: MembershipPackage) {
  if (isFirestoreQuotaExhausted()) return;
  try {
    await setDoc(doc(db, COLLECTIONS.PACKAGES, pkg.id), cleanForFirestore(pkg));
  } catch (error) {
    if (isQuotaExhaustedError(error)) {
      triggerQuotaExhaustedMode(error instanceof Error ? error.message : String(error));
      return;
    }
    handleFirestoreError(error, OperationType.WRITE, `packages/${pkg.id}`);
  }
}

export async function fsUpdatePackage(id: string, updates: Partial<MembershipPackage>) {
  if (isFirestoreQuotaExhausted()) return;
  try {
    await setDoc(doc(db, COLLECTIONS.PACKAGES, id), cleanForFirestore(updates), { merge: true });
  } catch (error) {
    if (isQuotaExhaustedError(error)) {
      triggerQuotaExhaustedMode(error instanceof Error ? error.message : String(error));
      return;
    }
    handleFirestoreError(error, OperationType.UPDATE, `packages/${id}`);
  }
}

export async function fsDeletePackage(id: string) {
  if (isFirestoreQuotaExhausted()) return;
  try {
    await deleteDoc(doc(db, COLLECTIONS.PACKAGES, id));
  } catch (error) {
    if (isQuotaExhaustedError(error)) {
      triggerQuotaExhaustedMode(error instanceof Error ? error.message : String(error));
      return;
    }
    handleFirestoreError(error, OperationType.DELETE, `packages/${id}`);
  }
}

// Firestore operations for Trainers
export async function fsSaveTrainer(trainer: Trainer) {
  if (isFirestoreQuotaExhausted()) return;
  try {
    await setDoc(doc(db, COLLECTIONS.TRAINERS, trainer.id), cleanForFirestore(trainer), { merge: true });
  } catch (error) {
    if (isQuotaExhaustedError(error)) {
      triggerQuotaExhaustedMode(error instanceof Error ? error.message : String(error));
      return;
    }
    handleFirestoreError(error, OperationType.WRITE, `trainers/${trainer.id}`);
  }
}

export async function fsUpdateTrainer(id: string, updates: Partial<Trainer>) {
  if (isFirestoreQuotaExhausted()) return;
  try {
    await setDoc(doc(db, COLLECTIONS.TRAINERS, id), cleanForFirestore(updates), { merge: true });
  } catch (error) {
    if (isQuotaExhaustedError(error)) {
      triggerQuotaExhaustedMode(error instanceof Error ? error.message : String(error));
      return;
    }
    handleFirestoreError(error, OperationType.UPDATE, `trainers/${id}`);
  }
}

export async function fsDeleteTrainer(id: string) {
  if (isFirestoreQuotaExhausted()) return;
  try {
    await deleteDoc(doc(db, COLLECTIONS.TRAINERS, id));
  } catch (error) {
    if (isQuotaExhaustedError(error)) {
      triggerQuotaExhaustedMode(error instanceof Error ? error.message : String(error));
      return;
    }
    handleFirestoreError(error, OperationType.DELETE, `trainers/${id}`);
  }
}

// Firestore operations for Enquiries
export async function fsSaveEnquiry(enquiry: Enquiry) {
  if (isFirestoreQuotaExhausted()) return;
  try {
    await setDoc(doc(db, COLLECTIONS.ENQUIRIES, enquiry.id), cleanForFirestore(enquiry));
  } catch (error) {
    if (isQuotaExhaustedError(error)) {
      triggerQuotaExhaustedMode(error instanceof Error ? error.message : String(error));
      return;
    }
    handleFirestoreError(error, OperationType.WRITE, `enquiries/${enquiry.id}`);
  }
}

export async function fsUpdateEnquiry(id: string, updates: Partial<Enquiry>) {
  if (isFirestoreQuotaExhausted()) return;
  try {
    await setDoc(doc(db, COLLECTIONS.ENQUIRIES, id), cleanForFirestore(updates), { merge: true });
  } catch (error) {
    if (isQuotaExhaustedError(error)) {
      triggerQuotaExhaustedMode(error instanceof Error ? error.message : String(error));
      return;
    }
    handleFirestoreError(error, OperationType.UPDATE, `enquiries/${id}`);
  }
}

export async function fsDeleteEnquiry(id: string) {
  if (isFirestoreQuotaExhausted()) return;
  try {
    await deleteDoc(doc(db, COLLECTIONS.ENQUIRIES, id));
  } catch (error) {
    if (isQuotaExhaustedError(error)) {
      triggerQuotaExhaustedMode(error instanceof Error ? error.message : String(error));
      return;
    }
    handleFirestoreError(error, OperationType.DELETE, `enquiries/${id}`);
  }
}

// Firestore operations for Settings
export async function fsUpdateSettings(settings: Partial<GymSettings>) {
  if (isFirestoreQuotaExhausted()) return;
  try {
    await setDoc(doc(db, COLLECTIONS.SETTINGS, 'general'), cleanForFirestore(settings), { merge: true });
  } catch (error) {
    if (isQuotaExhaustedError(error)) {
      triggerQuotaExhaustedMode(error instanceof Error ? error.message : String(error));
      return;
    }
    handleFirestoreError(error, OperationType.UPDATE, 'settings/general');
  }
}

// Firestore operations for DPDP Consent Records
export async function fsSaveConsentRecord(record: ConsentRecord) {
  if (isFirestoreQuotaExhausted()) return;
  try {
    await setDoc(doc(db, COLLECTIONS.CONSENT_RECORDS, record.id), cleanForFirestore(record));
  } catch (error) {
    if (isQuotaExhaustedError(error)) {
      triggerQuotaExhaustedMode(error instanceof Error ? error.message : String(error));
      return;
    }
    handleFirestoreError(error, OperationType.WRITE, `consentRecords/${record.id}`);
  }
}

export async function fsUpdateConsentRecord(id: string, updates: Partial<ConsentRecord>) {
  if (isFirestoreQuotaExhausted()) return;
  try {
    await setDoc(doc(db, COLLECTIONS.CONSENT_RECORDS, id), cleanForFirestore(updates), { merge: true });
  } catch (error) {
    if (isQuotaExhaustedError(error)) {
      triggerQuotaExhaustedMode(error instanceof Error ? error.message : String(error));
      return;
    }
    handleFirestoreError(error, OperationType.UPDATE, `consentRecords/${id}`);
  }
}

export async function fsDeleteConsentRecord(id: string) {
  if (isFirestoreQuotaExhausted()) return;
  try {
    await deleteDoc(doc(db, COLLECTIONS.CONSENT_RECORDS, id));
  } catch (error) {
    if (isQuotaExhaustedError(error)) {
      triggerQuotaExhaustedMode(error instanceof Error ? error.message : String(error));
      return;
    }
    handleFirestoreError(error, OperationType.DELETE, `consentRecords/${id}`);
  }
}

// Firestore operations for Data Subject Requests (DSR)
export async function fsSaveDSR(request: DataSubjectRequest) {
  if (isFirestoreQuotaExhausted()) return;
  try {
    await setDoc(doc(db, COLLECTIONS.DATA_SUBJECT_REQUESTS, request.id), cleanForFirestore(request));
  } catch (error) {
    if (isQuotaExhaustedError(error)) {
      triggerQuotaExhaustedMode(error instanceof Error ? error.message : String(error));
      return;
    }
    handleFirestoreError(error, OperationType.WRITE, `dataSubjectRequests/${request.id}`);
  }
}

export async function fsUpdateDSR(id: string, updates: Partial<DataSubjectRequest>) {
  if (isFirestoreQuotaExhausted()) return;
  try {
    await setDoc(doc(db, COLLECTIONS.DATA_SUBJECT_REQUESTS, id), cleanForFirestore(updates), { merge: true });
  } catch (error) {
    if (isQuotaExhaustedError(error)) {
      triggerQuotaExhaustedMode(error instanceof Error ? error.message : String(error));
      return;
    }
    handleFirestoreError(error, OperationType.UPDATE, `dataSubjectRequests/${id}`);
  }
}

export async function fsDeleteDSR(id: string) {
  if (isFirestoreQuotaExhausted()) return;
  try {
    await deleteDoc(doc(db, COLLECTIONS.DATA_SUBJECT_REQUESTS, id));
  } catch (error) {
    if (isQuotaExhaustedError(error)) {
      triggerQuotaExhaustedMode(error instanceof Error ? error.message : String(error));
      return;
    }
    handleFirestoreError(error, OperationType.DELETE, `dataSubjectRequests/${id}`);
  }
}

// Batch clear any Firestore collection
export async function clearFirestoreCollection(collectionName: string) {
  if (isFirestoreQuotaExhausted()) return;
  try {
    const colRef = collection(db, collectionName);
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const docs = snap.docs;
      for (let i = 0; i < docs.length; i += 400) {
        if (isFirestoreQuotaExhausted()) break;
        const chunk = docs.slice(i, i + 400);
        const batch = writeBatch(db);
        chunk.forEach(docSnap => {
          batch.delete(docSnap.ref);
        });
        await batch.commit();
      }
      console.log(`Cleared all documents in Firestore collection: ${collectionName}`);
    }
  } catch (error) {
    if (isQuotaExhaustedError(error)) {
      triggerQuotaExhaustedMode(error instanceof Error ? error.message : String(error));
      return;
    }
    handleFirestoreError(error, OperationType.DELETE, collectionName);
  }
}

// Clear all example / user data from Firestore
export async function clearAllGymFirestoreData() {
  if (isFirestoreQuotaExhausted()) return;
  console.log('Purging all member, payment, enquiry, and log data from Firestore...');
  await Promise.all([
    clearFirestoreCollection(COLLECTIONS.MEMBERS),
    clearFirestoreCollection(COLLECTIONS.PAYMENTS),
    clearFirestoreCollection(COLLECTIONS.ENQUIRIES),
    clearFirestoreCollection(COLLECTIONS.CONSENT_RECORDS),
    clearFirestoreCollection(COLLECTIONS.DATA_SUBJECT_REQUESTS),
    clearFirestoreCollection(COLLECTIONS.PACKAGES),
    clearFirestoreCollection(COLLECTIONS.TRAINERS)
  ]);
  await fsUpdateSettings({ upiId: '' });
  console.log('All Firestore data collections successfully cleared.');
}

// Clear specifically trainers, membership plans, and UPI details
export async function clearTrainersPlansAndUpiFirestore() {
  if (isFirestoreQuotaExhausted()) return;
  console.log('Clearing all trainers, packages/plans, and UPI details from Firestore...');
  await Promise.all([
    clearFirestoreCollection(COLLECTIONS.PACKAGES),
    clearFirestoreCollection(COLLECTIONS.TRAINERS)
  ]);
  await fsUpdateSettings({ upiId: '' });
  console.log('Trainers, plans, and UPI details cleared from Firestore.');
}


