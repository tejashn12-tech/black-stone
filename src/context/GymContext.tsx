import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  Member,
  MembershipPackage,
  PaymentRecord,
  Trainer,
  Enquiry,
  FestivalEvent,
  AppNotification,
  GymSettings,
  ConsentRecord,
  DataSubjectRequest,
  CookieConsentPreferences,
  ConsentPurposesMap,
  DSRType,
  WhatsAppSessionData,
  WhatsAppMessageLog,
  WhatsAppConnectionStatus
} from '../types';
import {
  INITIAL_MEMBERS,
  INITIAL_PACKAGES,
  INITIAL_PAYMENTS,
  INITIAL_TRAINERS,
  INITIAL_ENQUIRIES,
  INITIAL_FESTIVALS,
  INITIAL_WHATSAPP_LOGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_SETTINGS,
  INITIAL_CONSENT_RECORDS,
  INITIAL_DSR_REQUESTS,
  DEFAULT_COOKIE_PREFERENCES
} from '../data/initialData';
import {
  collection,
  doc,
  onSnapshot,
  query,
  limit,
  orderBy
} from 'firebase/firestore';
import {
  db,
  handleFirestoreError,
  OperationType,
  isFirestoreQuotaExhausted,
  subscribeToQuotaStatus,
  resetQuotaExhaustedMode
} from '../lib/firebase';
import {
  COLLECTIONS,
  seedCollectionIfEmpty,
  seedSettingsIfEmpty,
  fsSaveMember,
  fsUpdateMember,
  fsDeleteMember,
  fsSavePayment,
  fsUpdatePayment,
  fsDeletePayment,
  fsSavePackage,
  fsUpdatePackage,
  fsDeletePackage,
  fsSaveTrainer,
  fsUpdateTrainer,
  fsDeleteTrainer,
  fsSaveEnquiry,
  fsUpdateEnquiry,
  fsDeleteEnquiry,
  fsUpdateSettings,
  fsSaveConsentRecord,
  fsUpdateConsentRecord,
  fsDeleteConsentRecord,
  fsSaveDSR,
  fsUpdateDSR,
  fsDeleteDSR,
  clearAllGymFirestoreData,
  clearTrainersPlansAndUpiFirestore
} from '../lib/firestoreService';
import { resolveMemberStatus, getEffectiveMemberStatus, isExpiringSoon, isActiveMember, compareMembersRecentlyJoined } from '../utils/memberStatus';
import {
  fetchWhatsAppStatus,
  initiateWhatsAppConnect,
  terminateWhatsAppSession,
  dispatchWhatsAppMessage,
  dispatchWhatsAppTest,
  fetchWhatsAppMessages,
  dispatchAdmissionNotification,
  dispatchRenewalNotification,
  sendWhatsAppReceipt
} from '../services/whatsappApiClient';
import {
  STORAGE_KEYS,
  safeLocalStorageSet,
  safeLocalStorageGet,
  safeLocalStorageRemove,
  pruneStaleLocalStorage,
  sanitizeMembersForCache,
  sanitizeMemberForCache,
  sanitizeTrainersForCache
} from '../utils/storage';
import {
  savePhotoToIndexedDB,
  getAllPhotosFromIndexedDB,
  deletePhotoFromIndexedDB
} from '../utils/photoStorage';

interface GymContextType {
  // Data
  members: Member[];
  packages: MembershipPackage[];
  payments: PaymentRecord[];
  trainers: Trainer[];
  enquiries: Enquiry[];
  festivals: FestivalEvent[];
  notifications: AppNotification[];
  settings: GymSettings;

  // Firebase status
  isFirebaseConnected: boolean;
  firestoreSynced: boolean;
  isQuotaExhausted: boolean;
  reconnectFirestore: () => Promise<boolean>;

  // Active user session (Admin or Member)
  currentUserRole: 'guest' | 'member' | 'admin' | 'staff';
  currentMember: Member | null;
  isAdminAuthenticated: boolean;
  setCurrentUserRole: (role: 'guest' | 'member' | 'admin' | 'staff') => void;
  setCurrentMember: (member: Member | null) => void;
  loginAsMember: (phoneOrCode: string) => boolean;
  loginAsAdmin: (passcode: string) => boolean;
  logout: () => void;

  // Global Data Purge / Reset / Cloud Sync
  clearAllGymData: () => Promise<void>;
  clearTrainersPlansAndUpi: () => Promise<void>;
  syncAllToFirestore: () => Promise<{ success: boolean; count: number; error?: string }>;

  // Member CRUD
  addMember: (
    memberData: Omit<Member, 'id' | 'memberCode' | 'joinedDate'>,
    options?: { skipWhatsApp?: boolean; customTemplate?: string }
  ) => Member;
  updateMember: (id: string, updates: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  renewMember: (
    id: string,
    packageId: string,
    durationMonths: number,
    paymentAmount: number,
    paymentMethod: PaymentRecord['paymentMethod'],
    notes?: string,
    options?: { skipWhatsApp?: boolean; customMessage?: string }
  ) => { member: Member; payment: PaymentRecord; newExpiryDate: string } | undefined;

  // Payment CRUD
  recordPayment: (
    paymentData: Omit<PaymentRecord, 'id' | 'receiptNo'>,
    options?: { skipAutoReceipt?: boolean; customMessage?: string }
  ) => PaymentRecord;
  updatePayment: (id: string, updates: Partial<PaymentRecord>, syncMember?: boolean) => void;
  deletePayment: (id: string, revertMemberDues?: boolean) => void;
  undoPayment: (id: string, reason?: string) => { success: boolean; revertedAmount: number; memberName: string };

  // Trainer CRUD
  addTrainer: (trainerData: Omit<Trainer, 'id' | 'assignedMemberCount'>) => Promise<Trainer>;
  updateTrainer: (id: string, updates: Partial<Trainer>) => Promise<Trainer | undefined>;
  deleteTrainer: (id: string) => Promise<void>;

  // Package CRUD
  addPackage: (pkgData: Omit<MembershipPackage, 'id'>) => void;
  updatePackage: (id: string, updates: Partial<MembershipPackage>) => void;
  deletePackage: (id: string) => void;

  // Enquiry CRUD & Conversion
  addEnquiry: (enquiryData: Omit<Enquiry, 'id' | 'enquiryCode' | 'createdAt'>) => Enquiry;
  updateEnquiry: (id: string, updates: Partial<Enquiry>) => void;
  deleteEnquiry: (id: string) => void;
  convertEnquiryToMember: (enquiryId: string, packageId: string, paidAmount: number, paymentMethod: PaymentRecord['paymentMethod'], assignedTrainerId?: string) => Member;

  // Settings & Notifications
  updateSettings: (updates: Partial<GymSettings>) => void;
  toggleFestival: (id: string) => void;
  updateFestivalTemplate: (id: string, messageTemplate: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (title: string, message: string, type: AppNotification['type'], linkTab?: string) => void;

  // DPDP Act Compliance Data & Operations
  consentRecords: ConsentRecord[];
  dataSubjectRequests: DataSubjectRequest[];
  cookiePreferences: CookieConsentPreferences;
  recordConsent: (data: {
    principalName: string;
    principalContact: string;
    principalType: 'member' | 'lead' | 'visitor';
    principalId?: string;
    purposes: ConsentPurposesMap;
    noticeVersion?: string;
  }) => ConsentRecord;
  withdrawConsent: (consentId: string, reason?: string) => void;
  createDSR: (requestData: {
    principalName: string;
    principalContact: string;
    principalIdentifier?: string;
    requestType: DSRType;
    details: string;
    correctionsRequested?: string;
    nomineeName?: string;
    nomineeContact?: string;
    nomineeRelationship?: string;
  }) => DataSubjectRequest;
  updateDSR: (id: string, updates: Partial<DataSubjectRequest>) => void;
  deleteDSR: (id: string) => void;
  updateCookiePreferences: (prefs: Partial<CookieConsentPreferences>) => void;

  // WhatsApp Integration
  whatsAppSession: WhatsAppSessionData;
  whatsAppLogs: WhatsAppMessageLog[];
  connectWhatsApp: (phoneNumber?: string) => Promise<boolean>;
  disconnectWhatsApp: () => Promise<void>;
  updateWhatsAppConfig: (updates: Partial<WhatsAppSessionData>) => void;
  refreshWhatsAppLogs: () => Promise<void>;
  sendWhatsAppMessage: (
    recipientPhone: string,
    recipientName: string,
    text: string,
    type?: WhatsAppMessageLog['type'],
    metadata?: { memberId?: string; receiptNo?: string; idempotencyKey?: string }
  ) => Promise<{ success: boolean; error?: string; messageId?: string; trackingId?: string; status?: string; statusDisplay?: string; isDuplicate?: boolean }>;
  clearWhatsAppLogs: () => void;
  runWhatsAppAutomations: (options?: { force?: boolean; dryRun?: boolean; type?: 'all' | 'renewals' | 'birthdays' | 'festivals'; customDate?: string }) => Promise<{ success: boolean; summary?: any; error?: string }>;
  getUpcomingAutomationsSummary: (customDate?: string) => {
    renewals7d: { member: Member; daysLeft: number; message: string; phone: string }[];
    renewals3d: { member: Member; daysLeft: number; message: string; phone: string }[];
    renewals1d: { member: Member; daysLeft: number; message: string; phone: string }[];
    birthdays: { member: Member; message: string; phone: string }[];
    festivals: { festival: FestivalEvent; members: Member[]; message: string }[];
  };
  testWhatsAppAutomation: (params: { testPhone: string; templateType: 'renewal_7d' | 'renewal_3d' | 'renewal_1d' | 'birthday' | 'festival'; memberName?: string; customMessage?: string }) => Promise<{ success: boolean; error?: string }>;

  // Financial & Analytics Getters
  getStats: () => {
    todayCollection: number;
    monthCollection: number;
    yearCollection: number;
    totalCollection: number;
    pendingCollection: number;
    totalMembers: number;
    activeMembers: number;
    expiringThisMonth: number;
    expiredMembers: number;
    newAdmissionsThisMonth: number;
    renewalsThisMonth: number;
  };

  // Quick helper
  getMemberById: (id: string) => Member | undefined;
  getPackageById: (id: string) => MembershipPackage | undefined;
  getTrainerById: (id: string) => Trainer | undefined;
  getReceiptById: (id: string) => PaymentRecord | undefined;
}

const GymContext = createContext<GymContextType | undefined>(undefined);

// Safe deduplication helper to prevent duplicate key React errors
function deduplicateById<T extends { id: string }>(items: T[]): T[] {
  if (!Array.isArray(items)) return [];
  const seen = new Set<string>();
  const result: T[] = [];
  for (const item of items) {
    if (!item) continue;
    let finalItem = item;
    if (!item.id || seen.has(item.id)) {
      const uniqueSuffix = Math.random().toString(36).substring(2, 8);
      finalItem = { ...item, id: `${item.id || 'item'}-${uniqueSuffix}` };
    }
    seen.add(finalItem.id);
    result.push(finalItem);
  }
  return result;
}

export const GymProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(!isFirestoreQuotaExhausted());
  const [firestoreSynced, setFirestoreSynced] = useState(false);
  const [isQuotaExhausted, setIsQuotaExhausted] = useState<boolean>(() => isFirestoreQuotaExhausted());

  // Listen for real-time quota exhaustion events
  useEffect(() => {
    const unsub = subscribeToQuotaStatus((exhausted) => {
      setIsQuotaExhausted(exhausted);
      if (exhausted) {
        setIsFirebaseConnected(false);
        setFirestoreSynced(false);
      }
    });
    return unsub;
  }, []);

  const reconnectFirestore = async (): Promise<boolean> => {
    const success = await resetQuotaExhaustedMode();
    if (success) {
      setIsQuotaExhausted(false);
      setIsFirebaseConnected(true);
      setFirestoreSynced(true);
    }
    return success;
  };

  // Clean legacy demo items and prune obsolete keys on load to avoid quota limits
  if (typeof window !== 'undefined') {
    pruneStaleLocalStorage();
  }

  // Members State
  const [members, setMembers] = useState<Member[]>(() => {
    try {
      const initialMap = new Map(INITIAL_MEMBERS.map(im => [im.id, im]));
      const saved = safeLocalStorageGet(STORAGE_KEYS.MEMBERS);
      if (saved) {
        const parsed: Member[] = JSON.parse(saved);
        if (parsed && parsed.length > 0) {
          const hydrated = parsed.map(m => {
            const init = initialMap.get(m.id);
            const lastFees = m.lastFeesPaid !== undefined ? m.lastFeesPaid : (init?.lastFeesPaid ?? m.paidAmount ?? 0);
            return resolveMemberStatus({
              ...m,
              lastFeesPaid: lastFees
            });
          });
          return deduplicateById(hydrated).sort(compareMembersRecentlyJoined);
        }
      }
      return deduplicateById(INITIAL_MEMBERS).map(resolveMemberStatus).sort(compareMembersRecentlyJoined);
    } catch {
      return deduplicateById(INITIAL_MEMBERS).map(resolveMemberStatus).sort(compareMembersRecentlyJoined);
    }
  });

  // Packages State
  const [packages, setPackages] = useState<MembershipPackage[]>(() => {
    try {
      const saved = safeLocalStorageGet(STORAGE_KEYS.PACKAGES);
      if (saved) {
        const parsed: MembershipPackage[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return deduplicateById(parsed);
        }
      }
      return deduplicateById(INITIAL_PACKAGES);
    } catch {
      return deduplicateById(INITIAL_PACKAGES);
    }
  });

  // Payments State
  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    try {
      const saved = safeLocalStorageGet(STORAGE_KEYS.PAYMENTS);
      if (saved) {
        const parsed: PaymentRecord[] = JSON.parse(saved);
        if (parsed && parsed.length > 0) {
          return deduplicateById(parsed);
        }
      }
      return deduplicateById(INITIAL_PAYMENTS);
    } catch {
      return deduplicateById(INITIAL_PAYMENTS);
    }
  });

  // Trainers State (Cleared of demo trainers)
  const [trainers, setTrainers] = useState<Trainer[]>(() => {
    try {
      const saved = safeLocalStorageGet(STORAGE_KEYS.TRAINERS);
      if (saved) {
        const parsed: Trainer[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed.some(t => t.id === 'tr-1' || t.id === 'tr-2' || t.id === 'tr-3')) {
          safeLocalStorageRemove(STORAGE_KEYS.TRAINERS);
          return [];
        }
        return deduplicateById(parsed);
      }
      return [];
    } catch {
      return [];
    }
  });

  // Enquiries State
  const [enquiries, setEnquiries] = useState<Enquiry[]>(() => {
    try {
      const saved = safeLocalStorageGet(STORAGE_KEYS.ENQUIRIES);
      if (saved) {
        const parsed: Enquiry[] = JSON.parse(saved);
        if (parsed && parsed.length > 0) {
          return deduplicateById(parsed);
        }
      }
      return deduplicateById(INITIAL_ENQUIRIES);
    } catch {
      return deduplicateById(INITIAL_ENQUIRIES);
    }
  });

  // Festivals State
  const [festivals, setFestivals] = useState<FestivalEvent[]>(() => {
    try {
      const saved = safeLocalStorageGet(STORAGE_KEYS.FESTIVALS);
      return deduplicateById(saved ? JSON.parse(saved) : INITIAL_FESTIVALS);
    } catch {
      return deduplicateById(INITIAL_FESTIVALS);
    }
  });

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      if (safeLocalStorageGet(STORAGE_KEYS.DATA_RESET_KEY) !== 'true') {
        return [];
      }
      const saved = safeLocalStorageGet(STORAGE_KEYS.NOTIFICATIONS);
      return deduplicateById(saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS);
    } catch {
      return deduplicateById(INITIAL_NOTIFICATIONS);
    }
  });

  // Settings (Cleared of demo UPI ID)
  const [settings, setSettings] = useState<GymSettings>(() => {
    try {
      const saved = safeLocalStorageGet(STORAGE_KEYS.SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        let updated = { ...parsed };
        if (parsed.address && parsed.address.includes('Plot No. 42')) {
          updated = {
            ...updated,
            address: INITIAL_SETTINGS.address,
            city: INITIAL_SETTINGS.city,
            state: INITIAL_SETTINGS.state,
            pincode: INITIAL_SETTINGS.pincode
          };
        }
        if (!parsed.whatsapp || parsed.whatsapp.includes('98452') || parsed.whatsapp.includes('98450')) {
          updated = {
            ...updated,
            whatsapp: INITIAL_SETTINGS.whatsapp,
            phone: INITIAL_SETTINGS.phone
          };
        }
        if (parsed.upiId === 'blackstonefitness@okaxis') {
          updated = {
            ...updated,
            upiId: ''
          };
        }
        return updated;
      }
    } catch {
      // fallback
    }
    return INITIAL_SETTINGS;
  });

  // User Auth State
  const [currentUserRole, setCurrentUserRole] = useState<'guest' | 'member' | 'admin' | 'staff'>(() => {
    const saved = safeLocalStorageGet(STORAGE_KEYS.SESSION_ROLE);
    return (saved as any) || 'guest';
  });

  const [currentMember, setCurrentMember] = useState<Member | null>(() => {
    try {
      const saved = safeLocalStorageGet(STORAGE_KEYS.SESSION_MEMBER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // DPDP Consent Records State
  const [consentRecords, setConsentRecords] = useState<ConsentRecord[]>(() => {
    if (safeLocalStorageGet(STORAGE_KEYS.DATA_RESET_KEY) !== 'true') {
      return [];
    }
    const saved = safeLocalStorageGet(STORAGE_KEYS.CONSENT_RECORDS);
    try {
      return saved ? JSON.parse(saved) : INITIAL_CONSENT_RECORDS;
    } catch {
      return INITIAL_CONSENT_RECORDS;
    }
  });

  // DPDP Data Subject Requests State
  const [dataSubjectRequests, setDataSubjectRequests] = useState<DataSubjectRequest[]>(() => {
    if (safeLocalStorageGet(STORAGE_KEYS.DATA_RESET_KEY) !== 'true') {
      return [];
    }
    const saved = safeLocalStorageGet(STORAGE_KEYS.DSR_REQUESTS);
    try {
      return saved ? JSON.parse(saved) : INITIAL_DSR_REQUESTS;
    } catch {
      return INITIAL_DSR_REQUESTS;
    }
  });

  // Cookie & Tracker Consent Preferences State
  const [cookiePreferences, setCookiePreferences] = useState<CookieConsentPreferences>(() => {
    try {
      const saved = safeLocalStorageGet(STORAGE_KEYS.COOKIE_PREFERENCES);
      return saved ? JSON.parse(saved) : DEFAULT_COOKIE_PREFERENCES;
    } catch {
      return DEFAULT_COOKIE_PREFERENCES;
    }
  });

  // WhatsApp Integration State (Uninstalled)
  const DEFAULT_WHATSAPP_SESSION: WhatsAppSessionData = {
    status: 'disconnected',
    phoneNumber: '',
    connectedAt: null,
    deviceInfo: 'WhatsApp Integration Not Installed',
    batteryLevel: 0,
    autoReceipts: false,
    autoExpiryReminders: false,
    autoBirthdayWishes: false,
    autoAnnouncements: false
  };

  const [whatsAppSession, setWhatsAppSession] = useState<WhatsAppSessionData>(DEFAULT_WHATSAPP_SESSION);

  const [whatsAppLogs, setWhatsAppLogs] = useState<WhatsAppMessageLog[]>(() => {
    try {
      const saved = safeLocalStorageGet(STORAGE_KEYS.WHATSAPP_LOGS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Hydrate member photos from persistent IndexedDB on startup
  useEffect(() => {
    getAllPhotosFromIndexedDB().then((photos) => {
      if (photos && Object.keys(photos).length > 0) {
        setMembers((prev) =>
          prev.map((m) => {
            if (photos[m.id] && (!m.photoUrl || m.photoUrl !== photos[m.id])) {
              return { ...m, photoUrl: photos[m.id] };
            }
            return m;
          })
        );
        setCurrentMember((prev) => {
          if (prev && photos[prev.id] && (!prev.photoUrl || prev.photoUrl !== photos[prev.id])) {
            return { ...prev, photoUrl: photos[prev.id] };
          }
          return prev;
        });
      }
    }).catch(() => {});
  }, []);

  // 1. Initial Firestore Seeding & Real-time Listeners
  useEffect(() => {
    let unsubs: (() => void)[] = [];

    const initFirestoreSync = async () => {
      try {
        if (isFirestoreQuotaExhausted()) {
          console.info('[GymContext] Firestore write quota exhausted. Operating safely in local storage mode.');
          setIsFirebaseConnected(false);
          setFirestoreSynced(false);
          return;
        }

        setFirestoreSynced(true);
        setIsFirebaseConnected(true);

        // Setup real-time snapshot listeners
        // 1. Members
        const unsubMembers = onSnapshot(collection(db, COLLECTIONS.MEMBERS), (snapshot) => {
          if (!snapshot.empty) {
            const data = snapshot.docs.map(doc => resolveMemberStatus({ ...doc.data(), id: doc.id } as Member));
            const deduplicated = deduplicateById(data);
            deduplicated.sort(compareMembersRecentlyJoined);
            setMembers(deduplicated);

            // Persist all photos to IndexedDB cache so they are available offline and instant on reload
            deduplicated.forEach(m => {
              if (m.photoUrl) {
                savePhotoToIndexedDB(m.id, m.photoUrl).catch(() => {});
              }
            });

            // Keep currently logged-in member in sync with authoritative database updates
            setCurrentMember(prev => {
              if (!prev) return null;
              const matching = deduplicated.find(m => m.id === prev.id);
              return matching ? resolveMemberStatus(matching) : prev;
            });
          } else {
            setMembers(prev => prev.length > 0 ? prev : deduplicateById(INITIAL_MEMBERS).map(resolveMemberStatus).sort(compareMembersRecentlyJoined));
          }
        }, (error) => {
          handleFirestoreError(error, OperationType.LIST, COLLECTIONS.MEMBERS);
        });
        unsubs.push(unsubMembers);

        // 2. Packages
        const unsubPackages = onSnapshot(collection(db, COLLECTIONS.PACKAGES), (snapshot) => {
          if (!snapshot.empty) {
            const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as MembershipPackage));
            setPackages(deduplicateById(data));
          } else {
            setPackages(prev => prev.length > 0 ? prev : deduplicateById(INITIAL_PACKAGES));
          }
        }, (error) => {
          handleFirestoreError(error, OperationType.LIST, COLLECTIONS.PACKAGES);
        });
        unsubs.push(unsubPackages);

        // 3. Payments
        const unsubPayments = onSnapshot(collection(db, COLLECTIONS.PAYMENTS), (snapshot) => {
          if (!snapshot.empty) {
            const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as PaymentRecord));
            const deduplicated = deduplicateById(data);
            deduplicated.sort((a, b) => (b.id > a.id ? 1 : -1));
            setPayments(deduplicated);
          } else {
            setPayments(prev => prev.length > 0 ? prev : deduplicateById(INITIAL_PAYMENTS));
          }
        }, (error) => {
          handleFirestoreError(error, OperationType.LIST, COLLECTIONS.PAYMENTS);
        });
        unsubs.push(unsubPayments);

        // 4. Trainers
        const unsubTrainers = onSnapshot(collection(db, COLLECTIONS.TRAINERS), (snapshot) => {
          if (!snapshot.empty) {
            const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Trainer));
            const deduplicated = deduplicateById(data);
            setTrainers(deduplicated);
            safeLocalStorageSet(STORAGE_KEYS.TRAINERS, JSON.stringify(sanitizeTrainersForCache(deduplicated)));
          }
        }, (error) => {
          handleFirestoreError(error, OperationType.LIST, COLLECTIONS.TRAINERS);
        });
        unsubs.push(unsubTrainers);

        // 5. Enquiries
        const unsubEnquiries = onSnapshot(collection(db, COLLECTIONS.ENQUIRIES), (snapshot) => {
          if (!snapshot.empty) {
            const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Enquiry));
            const deduplicated = deduplicateById(data);
            deduplicated.sort((a, b) => (b.id > a.id ? 1 : -1));
            setEnquiries(deduplicated);
          } else {
            setEnquiries(prev => prev.length > 0 ? prev : deduplicateById(INITIAL_ENQUIRIES));
          }
        }, (error) => {
          handleFirestoreError(error, OperationType.LIST, COLLECTIONS.ENQUIRIES);
        });
        unsubs.push(unsubEnquiries);

        // 6. Settings
        const unsubSettings = onSnapshot(doc(db, COLLECTIONS.SETTINGS, 'general'), (snapshot) => {
          if (snapshot.exists()) {
            const sData = snapshot.data() as GymSettings;
            if (sData.upiId === 'blackstonefitness@okaxis') {
              sData.upiId = '';
            }
            setSettings(sData);
          }
        }, (error) => {
          handleFirestoreError(error, OperationType.GET, 'settings/general');
        });
        unsubs.push(unsubSettings);

        // 7. DPDP Consent Records
        const unsubConsent = onSnapshot(collection(db, COLLECTIONS.CONSENT_RECORDS), (snapshot) => {
          if (!snapshot.empty) {
            const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as ConsentRecord));
            const deduplicated = deduplicateById(data);
            deduplicated.sort((a, b) => (b.timestamp > a.timestamp ? 1 : -1));
            setConsentRecords(deduplicated);
          } else {
            setConsentRecords([]);
          }
        }, (error) => {
          handleFirestoreError(error, OperationType.LIST, COLLECTIONS.CONSENT_RECORDS);
        });
        unsubs.push(unsubConsent);

        // 8. DPDP Data Subject Requests
        const unsubDSR = onSnapshot(collection(db, COLLECTIONS.DATA_SUBJECT_REQUESTS), (snapshot) => {
          if (!snapshot.empty) {
            const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as DataSubjectRequest));
            const deduplicated = deduplicateById(data);
            deduplicated.sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
            setDataSubjectRequests(deduplicated);
          } else {
            setDataSubjectRequests([]);
          }
        }, (error) => {
          handleFirestoreError(error, OperationType.LIST, COLLECTIONS.DATA_SUBJECT_REQUESTS);
        });
        unsubs.push(unsubDSR);

        // 9. Real-time WhatsApp Message Status & Transition Stream (Limited to newest 50 to avoid loading thousands)
        const waLogsQuery = query(collection(db, 'whatsappLogs'), orderBy('createdAt', 'desc'), limit(50));
        const unsubWALogs = onSnapshot(waLogsQuery, (snapshot) => {
          if (!snapshot.empty) {
            const mappedLogs: WhatsAppMessageLog[] = snapshot.docs.map(doc => {
              const data = doc.data();
              return {
                id: doc.id,
                recipientPhone: data.recipientPhone || '',
                recipientName: data.recipientName || '',
                type: data.type || 'custom',
                message: data.content || data.message || '',
                content: data.content || data.message || '',
                status: data.status || 'SENT',
                statusDisplay: data.statusDisplay || '',
                timestamp: data.sentAt || data.createdAt || data.timestamp || new Date().toISOString(),
                messageId: data.messageId || null,
                sentAt: data.sentAt || null,
                serverAckAt: data.serverAckAt || null,
                deliveredAt: data.deliveredAt || null,
                readAt: data.readAt || null,
                failedAt: data.failedAt || null,
                errorMessage: data.errorMessage || null,
                transitions: data.transitions || [],
                memberId: data.memberId || null,
                receiptNo: data.receiptNo || null
              };
            });

            // Sort newest first
            mappedLogs.sort((a, b) =>
              new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime()
            );

            setWhatsAppLogs(mappedLogs);
            safeLocalStorageSet(STORAGE_KEYS.WHATSAPP_LOGS, JSON.stringify(mappedLogs.slice(0, 50)));
          }
        }, (error) => {
          console.warn('[GymContext] WhatsApp logs snapshot notice:', error?.message);
        });
        unsubs.push(unsubWALogs);

      } catch (err) {
        console.warn('Firestore initial sync notice:', err);
      }
    };

    initFirestoreSync();

    return () => {
      unsubs.forEach(unsub => unsub());
    };
  }, []);

  // Local backup caching (debounced & async-scheduled to prevent UI thread lock during typing/modifications)
  useEffect(() => {
    const timer = setTimeout(() => {
      const sanitized = sanitizeMembersForCache(members);
      safeLocalStorageSet(STORAGE_KEYS.MEMBERS, JSON.stringify(sanitized));
    }, 400);
    return () => clearTimeout(timer);
  }, [members]);

  useEffect(() => {
    const timer = setTimeout(() => {
      safeLocalStorageSet(STORAGE_KEYS.PACKAGES, JSON.stringify(packages));
    }, 400);
    return () => clearTimeout(timer);
  }, [packages]);

  useEffect(() => {
    const timer = setTimeout(() => {
      safeLocalStorageSet(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
    }, 400);
    return () => clearTimeout(timer);
  }, [payments]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const sanitized = sanitizeTrainersForCache(trainers);
      safeLocalStorageSet(STORAGE_KEYS.TRAINERS, JSON.stringify(sanitized));
    }, 400);
    return () => clearTimeout(timer);
  }, [trainers]);

  useEffect(() => {
    const timer = setTimeout(() => {
      safeLocalStorageSet(STORAGE_KEYS.ENQUIRIES, JSON.stringify(enquiries));
    }, 400);
    return () => clearTimeout(timer);
  }, [enquiries]);

  useEffect(() => {
    const timer = setTimeout(() => {
      safeLocalStorageSet(STORAGE_KEYS.FESTIVALS, JSON.stringify(festivals));
    }, 400);
    return () => clearTimeout(timer);
  }, [festivals]);

  useEffect(() => {
    const timer = setTimeout(() => {
      safeLocalStorageSet(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    }, 400);
    return () => clearTimeout(timer);
  }, [notifications]);

  useEffect(() => {
    const timer = setTimeout(() => {
      safeLocalStorageSet(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    }, 400);
    return () => clearTimeout(timer);
  }, [settings]);

  useEffect(() => {
    const timer = setTimeout(() => {
      safeLocalStorageSet(STORAGE_KEYS.CONSENT_RECORDS, JSON.stringify(consentRecords));
    }, 400);
    return () => clearTimeout(timer);
  }, [consentRecords]);

  useEffect(() => {
    const timer = setTimeout(() => {
      safeLocalStorageSet(STORAGE_KEYS.DSR_REQUESTS, JSON.stringify(dataSubjectRequests));
    }, 400);
    return () => clearTimeout(timer);
  }, [dataSubjectRequests]);

  useEffect(() => {
    const timer = setTimeout(() => {
      safeLocalStorageSet(STORAGE_KEYS.COOKIE_PREFERENCES, JSON.stringify(cookiePreferences));
    }, 400);
    return () => clearTimeout(timer);
  }, [cookiePreferences]);

  useEffect(() => {
    safeLocalStorageSet(STORAGE_KEYS.SESSION_ROLE, currentUserRole);
  }, [currentUserRole]);

  useEffect(() => {
    if (currentMember) {
      const sanitized = sanitizeMemberForCache(currentMember);
      safeLocalStorageSet(STORAGE_KEYS.SESSION_MEMBER, JSON.stringify(sanitized));
    } else {
      safeLocalStorageRemove(STORAGE_KEYS.SESSION_MEMBER);
    }
  }, [currentMember]);

  // Sync WhatsApp status from backend gateway with adaptive polling
  // Polling ONLY happens while connecting. Once CONNECTED, DISCONNECTED, or ERROR: stop polling!
  const refreshWhatsAppStatus = async (force = false): Promise<string> => {
    try {
      const backendStatus = await fetchWhatsAppStatus(force);
      const mapped = backendStatus.status === 'connected' ? 'connected' : backendStatus.status === 'connecting' ? 'connecting' : 'disconnected';
      setWhatsAppSession(prev => ({
        ...prev,
        status: mapped,
        phoneNumber: backendStatus.phoneNumber || prev.phoneNumber,
        connectedAt: backendStatus.connectedAt || prev.connectedAt,
        deviceInfo: backendStatus.deviceInfo || prev.deviceInfo
      }));
      return mapped;
    } catch {
      return 'disconnected';
    }
  };

  useEffect(() => {
    let pollInterval: NodeJS.Timeout | null = null;
    refreshWhatsAppStatus().then(status => {
      // If currently connecting on app boot, poll briefly until state resolves
      if (status === 'connecting') {
        let attempts = 0;
        pollInterval = setInterval(async () => {
          attempts++;
          const cur = await refreshWhatsAppStatus(true);
          if (cur !== 'connecting' || attempts > 15) {
            if (pollInterval) clearInterval(pollInterval);
            pollInterval = null;
          }
        }, 3000);
      }
    });

    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, []);

  // Auth methods
  const loginAsMember = (phoneOrCode: string): boolean => {
    const cleanSearch = phoneOrCode.trim().toLowerCase().replace(/\s+/g, '');
    const found = members.find(m => 
      m.phone.replace(/\s+/g, '').includes(cleanSearch) || 
      m.whatsapp.replace(/\s+/g, '').includes(cleanSearch) ||
      m.memberCode.toLowerCase() === cleanSearch ||
      m.email.toLowerCase() === cleanSearch
    );
    if (found) {
      setCurrentMember(found);
      setCurrentUserRole('member');
      return true;
    }
    return false;
  };

  const loginAsAdmin = (passcode: string): boolean => {
    if (passcode.trim() === '123456' || passcode.trim() === 'bsfadmin') {
      setCurrentUserRole('admin');
      if (typeof window !== 'undefined') {
        try { sessionStorage.setItem('bsf_admin_token', 'bsf-admin-portal-token'); } catch {}
        safeLocalStorageSet('bsf_admin_token', 'bsf-admin-portal-token');
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUserRole('guest');
    setCurrentMember(null);
    if (typeof window !== 'undefined') {
      try { sessionStorage.removeItem('bsf_admin_token'); } catch {}
      safeLocalStorageRemove('bsf_admin_token');
    }
  };

  // Add Member
  const addMember = (
    memberData: Omit<Member, 'id' | 'memberCode' | 'joinedDate'>,
    options?: { skipWhatsApp?: boolean; customTemplate?: string }
  ): Member => {
    const count = members.length + 101;
    const newCode = `BSF-2026-${count}`;
    const newId = `mem-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const today = new Date().toISOString().split('T')[0];

    const newMember: Member = resolveMemberStatus({
      ...memberData,
      id: newId,
      memberCode: newCode,
      joinedDate: today,
      lastFeesPaid: memberData.lastFeesPaid !== undefined ? memberData.lastFeesPaid : memberData.paidAmount
    });

    setMembers(prev => deduplicateById([newMember, ...prev]).sort(compareMembersRecentlyJoined));
    if (newMember.photoUrl) {
      savePhotoToIndexedDB(newMember.id, newMember.photoUrl).catch(() => {});
    }
    fsSaveMember(newMember);

    // Add notification
    addNotification(
      'New Member Registered',
      `${newMember.fullName} (${newMember.memberCode}) enrolled in ${newMember.packageName}.`,
      'system',
      'members'
    );

    // Trigger automatic New Member WhatsApp Welcome Message
    // Triggers ONLY when a NEW member is successfully created
    // Idempotent: exactly ONE message per admission (admissionWhatsAppNotification:{memberId})
    if (!options?.skipWhatsApp && settings.enableNewMemberWelcome !== false) {
      const recipientPhone = newMember.whatsapp || newMember.phone;
      if (recipientPhone && recipientPhone.trim()) {
        const idempotencyKey = `admissionWhatsAppNotification:${newMember.id}`;
        dispatchAdmissionNotification(newMember, {
          customTemplate: options?.customTemplate || settings.newMemberWelcomeTemplate,
          idempotencyKey
        }).then(() => {
          refreshWhatsAppLogs();
        }).catch((err) => {
          console.warn('[GymContext] Automatic admission welcome dispatch notice:', err?.message);
        });
      }
    }

    return newMember;
  };

  const updateMember = (id: string, updates: Partial<Member>) => {
    // Strip undefined keys so partial updates do not accidentally wipe existing values
    const cleanedUpdates: Partial<Member> = {};
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        (cleanedUpdates as any)[key] = value;
      }
    }

    setMembers(prev => prev.map(m => {
      if (m.id === id) {
        const merged = { ...m, ...cleanedUpdates };
        return resolveMemberStatus(merged);
      }
      return m;
    }));

    if (currentMember && currentMember.id === id) {
      setCurrentMember(prev => prev ? resolveMemberStatus({ ...prev, ...cleanedUpdates }) : null);
    }

    // Persist photo to IndexedDB cache
    if (typeof updates.photoUrl === 'string' && updates.photoUrl.trim() !== '') {
      savePhotoToIndexedDB(id, updates.photoUrl).catch(() => {});
    } else if (updates.photoUrl === '' || updates.photoUrl === null) {
      deletePhotoFromIndexedDB(id).catch(() => {});
    }

    if (updates.phone || updates.whatsapp || updates.fullName) {
      const newPhone = updates.whatsapp || updates.phone;
      setPayments(prev => prev.map(p => {
        if (p.memberId === id) {
          return {
            ...p,
            ...(newPhone ? { memberPhone: newPhone } : {}),
            ...(updates.fullName ? { memberName: updates.fullName } : {})
          };
        }
        return p;
      }));
    }

    // Persist to Cloud Firestore Database
    fsUpdateMember(id, cleanedUpdates);
  };

  const deleteMember = (id: string) => {
    const targetMember = members.find(m => m.id === id);
    const memberName = targetMember?.fullName || 'Member';
    const memberCode = targetMember?.memberCode || '';
    const rawPhone = targetMember?.whatsapp || targetMember?.phone || '';
    const phoneDigits = rawPhone.replace(/\D/g, '');
    const phone10 = phoneDigits.length >= 10 ? phoneDigits.slice(-10) : phoneDigits;

    // 1. Delete and purge all payment records for this member (local state + Firestore)
    const relatedPayments = payments.filter(p => p.memberId === id);
    relatedPayments.forEach(p => {
      fsDeletePayment(p.id);
    });
    setPayments(prev => prev.filter(p => p.memberId !== id));

    // 2. Remove member from local state and delete from Firestore
    setMembers(prev => prev.filter(m => m.id !== id));
    fsDeleteMember(id);

    // 3. Clear current logged-in portal member if it matches the deleted member
    if (currentMember && currentMember.id === id) {
      setCurrentMember(null);
    }

    // 4. Remove all DPDP consent records for this member (local state + Firestore)
    const relatedConsents = consentRecords.filter(c => 
      c.principalId === id ||
      (memberCode && c.principalId === memberCode) ||
      (phone10 && c.principalContact && c.principalContact.replace(/\D/g, '').endsWith(phone10))
    );
    relatedConsents.forEach(c => {
      fsDeleteConsentRecord(c.id);
    });
    setConsentRecords(prev => prev.filter(c => !relatedConsents.some(rc => rc.id === c.id)));

    // 5. Remove all Data Subject Requests (DSR) for this member (local state + Firestore)
    const relatedDSRs = dataSubjectRequests.filter(d => 
      d.principalIdentifier === memberCode ||
      d.principalIdentifier === id ||
      (phone10 && d.principalContact && d.principalContact.replace(/\D/g, '').endsWith(phone10))
    );
    relatedDSRs.forEach(d => {
      fsDeleteDSR(d.id);
    });
    setDataSubjectRequests(prev => prev.filter(d => !relatedDSRs.some(rd => rd.id === d.id)));

    // 6. Purge WhatsApp message logs associated with this member
    setWhatsAppLogs(prev => prev.filter(l => {
      if (l.memberId === id) return false;
      if (phone10 && l.recipientPhone && l.recipientPhone.replace(/\D/g, '').endsWith(phone10)) {
        return false;
      }
      return true;
    }));

    // 7. Delete photo cache from IndexedDB
    deletePhotoFromIndexedDB(id).catch(() => {});

    // 8. Add audit log notification
    addNotification(
      'Member & All Related Data Deleted',
      `${memberName} (${memberCode || id}) and all related records (payments, receipts, consent records, and message logs) have been permanently deleted.`,
      'system',
      'members'
    );
  };

  // Renew Member
  const renewMember = (
    id: string,
    packageId: string,
    durationMonths: number,
    paymentAmount: number,
    paymentMethod: PaymentRecord['paymentMethod'],
    notes?: string,
    options?: { skipWhatsApp?: boolean; customMessage?: string }
  ): { member: Member; payment: PaymentRecord; newExpiryDate: string } | undefined => {
    const member = members.find(m => m.id === id);
    const selectedPkg = packages.find(p => p.id === packageId);
    if (!member || !selectedPkg) return undefined;

    const currentExpiry = new Date(member.expiryDate);
    const now = new Date();
    // If expired, start from today; if still active, extend from current expiry
    const baseDate = currentExpiry > now ? currentExpiry : now;
    const newExpiry = new Date(baseDate);
    newExpiry.setMonth(newExpiry.getMonth() + durationMonths);
    const newExpiryStr = newExpiry.toISOString().split('T')[0];
    const todayStr = now.toISOString().split('T')[0];

    const totalPkgPrice = selectedPkg.price;
    const pending = Math.max(0, totalPkgPrice - paymentAmount);
    const newStatus = pending > 0 ? 'payment_due' : 'active';

    // Update Member
    updateMember(id, {
      packageId: selectedPkg.id,
      packageName: selectedPkg.name,
      expiryDate: newExpiryStr,
      status: newStatus,
      totalAmount: totalPkgPrice,
      paidAmount: paymentAmount,
      lastFeesPaid: paymentAmount,
      pendingAmount: pending
    });

    // Record Payment
    const payment = recordPayment({
      memberId: member.id,
      memberName: member.fullName,
      memberPhone: member.whatsapp || member.phone,
      packageId: selectedPkg.id,
      packageName: selectedPkg.name,
      amountPaid: paymentAmount,
      totalPackageAmount: totalPkgPrice,
      pendingAmount: pending,
      discount: 0,
      paymentDate: todayStr,
      paymentMethod,
      status: pending === 0 ? 'PAID' : (paymentAmount > 0 ? 'PARTIALLY PAID' : 'PAYMENT DUE'),
      notes: notes || `Membership Renewal for ${selectedPkg.name}`,
      whatsappStatus: 'Pending',
      expiryDate: newExpiryStr
    }, { skipAutoReceipt: true });

    addNotification(
      'Membership Renewed',
      `${member.fullName} renewed for ${durationMonths} months until ${newExpiryStr}.`,
      'system',
      'members'
    );

    // Trigger automatic Membership Renewal WhatsApp confirmation message
    // Triggers ONLY after renewal and payment operations successfully complete
    // Idempotent: exactly ONE message per renewal (renewal:{payment.id}:{member.id})
    if (!options?.skipWhatsApp && settings.enableRenewalConfirmation !== false) {
      const recipientPhone = member.whatsapp || member.phone;
      if (recipientPhone && recipientPhone.trim()) {
        const renewalId = payment.id;
        const idempotencyKey = `renewal:${renewalId}:${member.id}`;
        dispatchRenewalNotification(
          member,
          {
            renewalId,
            planName: selectedPkg.name,
            renewalDate: todayStr,
            expiryDate: newExpiryStr,
            receiptNo: payment.receiptNo,
            payment,
            gymSettings: {
              gymName: settings.gymName,
              address: settings.address,
              city: settings.city,
              state: settings.state,
              pincode: settings.pincode,
              phone: settings.phone,
              email: settings.email,
              gstNumber: settings.gstNumber,
              receiptTerms: settings.receiptTerms,
              receiptCollectorName: settings.receiptCollectorName
            },
            renewal: {
              packageName: selectedPkg.name,
              startDate: todayStr,
              expiryDate: newExpiryStr,
              durationMonths
            },
            isPaid: payment.status === 'PAID'
          },
          {
            customTemplate: options?.customMessage || settings.renewalConfirmationTemplate,
            idempotencyKey,
            payment,
            gymSettings: {
              gymName: settings.gymName,
              address: settings.address,
              city: settings.city,
              state: settings.state,
              pincode: settings.pincode,
              phone: settings.phone,
              email: settings.email,
              gstNumber: settings.gstNumber,
              receiptTerms: settings.receiptTerms,
              receiptCollectorName: settings.receiptCollectorName
            }
          }
        ).then(() => {
          refreshWhatsAppLogs();
        }).catch((err) => {
          console.warn('[GymContext] Automatic renewal WhatsApp dispatch notice:', err?.message);
        });
      }
    }

    return {
      member: {
        ...member,
        packageId: selectedPkg.id,
        packageName: selectedPkg.name,
        expiryDate: newExpiryStr,
        status: newStatus
      },
      payment,
      newExpiryDate: newExpiryStr
    };
  };

  // Payments
  const recordPayment = (
    paymentData: Omit<PaymentRecord, 'id' | 'receiptNo'>,
    options?: { skipAutoReceipt?: boolean; customMessage?: string }
  ): PaymentRecord => {
    const randomReceipt = Math.floor(1000 + Math.random() * 9000);
    const receiptNo = `${settings.receiptPrefix}-${randomReceipt}`;
    const newPayment: PaymentRecord = {
      ...paymentData,
      id: `pay-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      receiptNo,
      whatsappStatus: 'Pending',
      receiptSent: paymentData.receiptSent ?? false
    };

    setPayments(prev => deduplicateById([newPayment, ...prev]));
    fsSavePayment(newPayment);

    // Sync member lastFeesPaid if applicable
    if (newPayment.memberId && newPayment.amountPaid > 0) {
      updateMember(newPayment.memberId, {
        lastFeesPaid: newPayment.amountPaid
      });
    }

    // Automatically send invoice PDF along with message whenever payment is received
    if (!options?.skipAutoReceipt && newPayment.amountPaid > 0 && newPayment.memberId) {
      const targetMember = members.find(m => m.id === newPayment.memberId);
      const recipientPhone = targetMember?.whatsapp || targetMember?.phone || newPayment.memberPhone;

      if (recipientPhone && recipientPhone.trim()) {
        const pkg = packages.find(p => p.id === newPayment.packageId);
        const pkgName = newPayment.packageName || pkg?.name || targetMember?.packageName || 'Gym Membership';
        const pendingAmount = Number(newPayment.pendingAmount || 0);

        const defaultPaymentMsg = options?.customMessage ||
          `Hi ${newPayment.memberName}! 👋\n\nYour payment of ₹${Number(newPayment.amountPaid).toLocaleString('en-IN')} has been received and confirmed at Blackstone Fitness (BSF).\n\nReceipt No: ${newPayment.receiptNo}\nPackage: ${pkgName}\nMode of Payment: ${newPayment.paymentMethod}\n${pendingAmount > 0 ? `Remaining Balance: ₹${pendingAmount.toLocaleString('en-IN')}\n` : 'Status: Fully Paid ✅\n'}\nYour official payment invoice is attached below. Thank you for choosing BSF! 💪`;

        sendWhatsAppReceipt({
          member: {
            id: newPayment.memberId,
            fullName: newPayment.memberName,
            phone: recipientPhone,
            whatsapp: recipientPhone,
            memberCode: targetMember?.memberCode || 'BSF-MEMBER'
          },
          payment: newPayment,
          gymSettings: {
            gymName: settings.gymName,
            address: settings.address,
            city: settings.city,
            state: settings.state,
            pincode: settings.pincode,
            phone: settings.phone,
            email: settings.email,
            gstNumber: settings.gstNumber,
            receiptTerms: settings.receiptTerms,
            receiptCollectorName: settings.receiptCollectorName
          },
          renewal: {
            packageName: pkgName,
            startDate: newPayment.paymentDate,
            expiryDate: newPayment.expiryDate || targetMember?.expiryDate || 'N/A'
          },
          targetPhone: recipientPhone,
          customMessage: defaultPaymentMsg
        }).then((res) => {
          if (res.success) {
            updatePayment(newPayment.id, { whatsappStatus: 'Sent', receiptSent: true }, false);
          }
          refreshWhatsAppLogs();
        }).catch(err => {
          console.warn('[GymContext] Automatic payment invoice dispatch notice:', err?.message);
        });
      }
    }

    return newPayment;
  };

  const updatePayment = (id: string, updates: Partial<PaymentRecord>, syncMember: boolean = true) => {
    const existing = payments.find(p => p.id === id);
    setPayments(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    fsUpdatePayment(id, updates);

    // If amountPaid or pendingAmount changed and syncMember is true, sync member's totals
    if (syncMember && existing && existing.memberId && (updates.amountPaid !== undefined || updates.pendingAmount !== undefined)) {
      const member = members.find(m => m.id === existing.memberId);
      if (member) {
        const delta = (updates.amountPaid ?? existing.amountPaid) - existing.amountPaid;
        const newPaid = Math.max(0, (member.paidAmount || 0) + delta);
        const newPending = Math.max(0, (member.totalAmount || 0) - newPaid);
        const newStatus: Member['status'] = newPending > 0 ? 'payment_due' : 'active';
        updateMember(member.id, {
          paidAmount: newPaid,
          pendingAmount: newPending,
          status: newStatus
        });
      }
    }
  };

  const deletePayment = (id: string, revertMemberDues: boolean = true) => {
    const targetPayment = payments.find(p => p.id === id);
    if (targetPayment && revertMemberDues && targetPayment.memberId) {
      const member = members.find(m => m.id === targetPayment.memberId);
      if (member) {
        const newPaid = Math.max(0, (member.paidAmount || 0) - targetPayment.amountPaid);
        const newPending = Math.max(0, (member.totalAmount || 0) - newPaid);
        const newStatus: Member['status'] = newPending > 0 ? 'payment_due' : 'active';
        updateMember(member.id, {
          paidAmount: newPaid,
          pendingAmount: newPending,
          status: newStatus
        });
      }
    }
    setPayments(prev => prev.filter(p => p.id !== id));
    fsDeletePayment(id);
    addNotification('Payment Record Deleted', `Receipt #${targetPayment?.receiptNo || id} has been permanently deleted.`, 'system');
  };

  const undoPayment = (id: string, reason?: string) => {
    const target = payments.find(p => p.id === id);
    if (!target) return { success: false, revertedAmount: 0, memberName: '' };
    
    const revertedAmt = target.amountPaid;
    const memberName = target.memberName;

    updatePayment(id, {
      status: 'REFUNDED',
      notes: target.notes ? `${target.notes} | REVERTED: ${reason || 'Admin Undo'}` : `REVERTED: ${reason || 'Admin Undo'}`
    }, true);

    addNotification(
      'Payment Undone & Reverted',
      `Receipt #${target.receiptNo} of ₹${revertedAmt.toLocaleString('en-IN')} for ${memberName} was marked as REFUNDED/UNDONE.`,
      'system'
    );

    return { success: true, revertedAmount: revertedAmt, memberName };
  };

  // Trainers
  const addTrainer = async (trainerData: Omit<Trainer, 'id' | 'assignedMemberCount'>): Promise<Trainer> => {
    const newTrainer: Trainer = {
      ...trainerData,
      id: `tr-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      assignedMemberCount: 0
    };
    setTrainers(prev => {
      const next = deduplicateById([...prev, newTrainer]);
      safeLocalStorageSet(STORAGE_KEYS.TRAINERS, JSON.stringify(sanitizeTrainersForCache(next)));
      return next;
    });
    await fsSaveTrainer(newTrainer);
    return newTrainer;
  };

  const updateTrainer = async (id: string, updates: Partial<Trainer>): Promise<Trainer | undefined> => {
    let updated: Trainer | undefined;
    setTrainers(prev => {
      const next = prev.map(t => {
        if (t.id === id) {
          updated = { ...t, ...updates };
          return updated;
        }
        return t;
      });
      safeLocalStorageSet(STORAGE_KEYS.TRAINERS, JSON.stringify(sanitizeTrainersForCache(next)));
      return next;
    });
    await fsUpdateTrainer(id, updates);
    return updated;
  };

  const deleteTrainer = async (id: string): Promise<void> => {
    setTrainers(prev => {
      const next = prev.filter(t => t.id !== id);
      safeLocalStorageSet(STORAGE_KEYS.TRAINERS, JSON.stringify(sanitizeTrainersForCache(next)));
      return next;
    });
    await fsDeleteTrainer(id);
  };

  // Packages
  const addPackage = async (pkgData: Omit<MembershipPackage, 'id'>) => {
    const newPkg: MembershipPackage = {
      ...pkgData,
      id: `pkg-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`
    };
    setPackages(prev => {
      const next = deduplicateById([...prev, newPkg]);
      safeLocalStorageSet(STORAGE_KEYS.PACKAGES, JSON.stringify(next));
      return next;
    });
    await fsSavePackage(newPkg);
    return newPkg;
  };

  const updatePackage = async (id: string, updates: Partial<MembershipPackage>) => {
    setPackages(prev => {
      const next = prev.map(p => p.id === id ? { ...p, ...updates } : p);
      safeLocalStorageSet(STORAGE_KEYS.PACKAGES, JSON.stringify(next));
      return next;
    });
    await fsUpdatePackage(id, updates);
  };

  const deletePackage = async (id: string) => {
    setPackages(prev => {
      const next = prev.filter(p => p.id !== id);
      safeLocalStorageSet(STORAGE_KEYS.PACKAGES, JSON.stringify(next));
      return next;
    });
    await fsDeletePackage(id);
  };

  // Enquiries
  const addEnquiry = (enquiryData: Omit<Enquiry, 'id' | 'enquiryCode' | 'createdAt'>): Enquiry => {
    const codeNum = enquiries.length + 501;
    const enquiryCode = `ENQ-2026-${codeNum}`;
    const today = new Date().toISOString().split('T')[0];
    const newEnquiry: Enquiry = {
      ...enquiryData,
      id: `enq-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      enquiryCode,
      createdAt: today
    };

    setEnquiries(prev => deduplicateById([newEnquiry, ...prev]));
    fsSaveEnquiry(newEnquiry);

    addNotification(
      'New Lead Received',
      `${newEnquiry.name} (${newEnquiry.phone}) enquired via ${newEnquiry.referralSource}.`,
      'new_enquiry',
      'enquiries'
    );

    return newEnquiry;
  };

  const updateEnquiry = (id: string, updates: Partial<Enquiry>) => {
    setEnquiries(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
    fsUpdateEnquiry(id, updates);
  };

  const deleteEnquiry = (id: string) => {
    setEnquiries(prev => prev.filter(e => e.id !== id));
    fsDeleteEnquiry(id);
  };

  // 1-Click Convert Enquiry to Full Member
  const convertEnquiryToMember = (
    enquiryId: string,
    packageId: string,
    paidAmount: number,
    paymentMethod: PaymentRecord['paymentMethod'],
    assignedTrainerId?: string
  ): Member => {
    const enquiry = enquiries.find(e => e.id === enquiryId);
    const selectedPkg = packages.find(p => p.id === packageId);
    if (!enquiry || !selectedPkg) throw new Error('Invalid enquiry or package');

    const trainer = trainers.find(t => t.id === assignedTrainerId);
    const now = new Date();
    const startDateStr = now.toISOString().split('T')[0];
    const expiryDate = new Date(now);
    expiryDate.setMonth(expiryDate.getMonth() + selectedPkg.durationMonths);
    const expiryDateStr = expiryDate.toISOString().split('T')[0];

    const pending = Math.max(0, selectedPkg.price - paidAmount);
    const status: Member['status'] = pending > 0 ? 'payment_due' : 'active';

    // 1. Create Member
    const newMember = addMember({
      fullName: enquiry.name,
      email: `${enquiry.name.toLowerCase().replace(/\s+/g, '.') || 'member'}@gmail.com`,
      phone: enquiry.phone,
      whatsapp: enquiry.whatsapp || enquiry.phone,
      gender: enquiry.gender || 'Male',
      dob: enquiry.age ? `${2026 - enquiry.age}-01-01` : '2000-01-01',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      packageId: selectedPkg.id,
      packageName: selectedPkg.name,
      startDate: startDateStr,
      expiryDate: expiryDateStr,
      status,
      totalAmount: selectedPkg.price,
      paidAmount,
      pendingAmount: pending,
      assignedTrainerId: trainer?.id,
      assignedTrainerName: trainer?.name,
      notes: `Converted from Lead ${enquiry.enquiryCode}. Goal: ${enquiry.fitnessGoal || 'General Fitness'}. History: ${enquiry.injuries || 'None'}`,
      address: enquiry.address || 'Mysuru',
      password: 'password123'
    });

    // 2. Record Initial Payment
    if (paidAmount > 0) {
      recordPayment({
        memberId: newMember.id,
        memberName: newMember.fullName,
        memberPhone: newMember.whatsapp,
        packageId: selectedPkg.id,
        packageName: selectedPkg.name,
        amountPaid: paidAmount,
        totalPackageAmount: selectedPkg.price,
        pendingAmount: pending,
        discount: 0,
        paymentDate: startDateStr,
        paymentMethod,
        status: pending === 0 ? 'PAID' : 'PARTIALLY PAID',
        notes: `Initial registration payment for ${selectedPkg.name}`,
        whatsappStatus: 'Pending',
        expiryDate: expiryDateStr
      });
    }

    // 3. Mark Enquiry as Converted
    updateEnquiry(enquiryId, {
      status: 'Converted to Member',
      convertedMemberId: newMember.id,
      followUpNotes: `Successfully converted to active member (${newMember.memberCode})`
    });

    return newMember;
  };

  // Settings & Notifications
  const updateSettings = (updates: Partial<GymSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
    fsUpdateSettings(updates);
  };

  const toggleFestival = (id: string) => {
    setFestivals(prev => prev.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f));
  };

  const updateFestivalTemplate = (id: string, messageTemplate: string) => {
    setFestivals(prev => prev.map(f => f.id === id ? { ...f, messageTemplate } : f));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const addNotification = (title: string, message: string, type: AppNotification['type'], linkTab?: string) => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      title,
      message,
      type,
      read: false,
      timestamp: 'Just now',
      linkTab
    };
    setNotifications(prev => deduplicateById([newNotif, ...prev]));
  };

  // Memoized Live Aggregate Statistics to prevent recalculating across large arrays on every re-render
  const calculatedStats = useMemo(() => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed

    let todayCollection = 0;
    let monthCollection = 0;
    let yearCollection = 0;
    let totalCollection = 0;
    let pendingCollection = 0;

    const monthTotals: { [key: string]: { revenue: number; admissions: number; renewals: number } } = {};

    payments.forEach(p => {
      if (p.status === 'VOID' || p.status === 'REFUNDED') return;

      const amt = Number(p.amountPaid) || 0;
      const pend = Number(p.pendingAmount) || 0;
      totalCollection += amt;
      pendingCollection += pend;

      const pDateStr = p.paymentDate || '';
      if (pDateStr === today) {
        todayCollection += amt;
      }

      const parts = pDateStr.split('-');
      if (parts.length === 3) {
        const pYear = parseInt(parts[0], 10);
        const pMonth = parseInt(parts[1], 10) - 1;
        const key = `${parts[0]}-${parts[1]}`;

        if (!monthTotals[key]) {
          monthTotals[key] = { revenue: 0, admissions: 0, renewals: 0 };
        }
        monthTotals[key].revenue += amt;
        if (p.notes?.toLowerCase().includes('renewal')) {
          monthTotals[key].renewals += 1;
        } else {
          monthTotals[key].admissions += 1;
        }

        if (pYear === currentYear) {
          yearCollection += amt;
        }
        if (pYear === currentYear && pMonth === currentMonth) {
          monthCollection += amt;
        }
      }
    });

    const totalMembers = members.length;
    const activeMembers = members.filter(isActiveMember).length;

    const expiringThisMonth = members.filter(m => {
      const exp = (m.expiryDate || '').split('-');
      if (exp.length === 3) {
        return parseInt(exp[0], 10) === currentYear && (parseInt(exp[1], 10) - 1) === currentMonth;
      }
      return false;
    }).length;

    const expiredMembers = members.filter(m => {
      const s = (m.status || '').toLowerCase();
      return s === 'expired' || s === 'inactive';
    }).length;

    const newAdmissionsThisMonth = members.filter(m => {
      const j = (m.joinedDate || '').split('-');
      if (j.length === 3) {
        return parseInt(j[0], 10) === currentYear && (parseInt(j[1], 10) - 1) === currentMonth;
      }
      return false;
    }).length;

    const renewalsThisMonth = payments.filter(p => {
      if (p.status === 'VOID' || p.status === 'REFUNDED') return false;
      const parts = (p.paymentDate || '').split('-');
      if (parts.length === 3) {
        const pYear = parseInt(parts[0], 10);
        const pMonth = parseInt(parts[1], 10) - 1;
        return pYear === currentYear && pMonth === currentMonth && p.notes?.toLowerCase().includes('renewal');
      }
      return false;
    }).length;

    // Reconcile pending collection with members' individual balances
    const memberPendingSum = members.reduce((sum, m) => sum + (Number(m.pendingAmount) || 0), 0);
    const finalPending = Math.max(pendingCollection, memberPendingSum);

    return {
      todayCollection,
      monthCollection,
      yearCollection,
      totalCollection,
      pendingCollection: finalPending,
      totalMembers,
      activeMembers,
      expiringThisMonth,
      expiredMembers,
      newAdmissionsThisMonth,
      renewalsThisMonth
    };
  }, [members, payments]);

  const getStats = useCallback(() => calculatedStats, [calculatedStats]);

  // DPDP Operations
  const recordConsent = (data: {
    principalName: string;
    principalContact: string;
    principalType: 'member' | 'lead' | 'visitor';
    principalId?: string;
    purposes: ConsentPurposesMap;
    noticeVersion?: string;
  }): ConsentRecord => {
    const newRecord: ConsentRecord = {
      id: `consent-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      principalName: data.principalName,
      principalContact: data.principalContact,
      principalType: data.principalType,
      principalId: data.principalId,
      purposes: data.purposes,
      consentVersion: '1.0-DPDP-2023',
      noticeVersion: data.noticeVersion || 'v2026.1',
      timestamp: new Date().toISOString(),
      status: 'active',
      ipAddress: 'Encrypted Session IP (Client Device)',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent.substring(0, 150) : 'Browser Client'
    };

    setConsentRecords(prev => [newRecord, ...prev]);
    fsSaveConsentRecord(newRecord);
    return newRecord;
  };

  const withdrawConsent = (consentId: string, reason?: string) => {
    const now = new Date().toISOString();
    setConsentRecords(prev => prev.map(c => {
      if (c.id === consentId) {
        return {
          ...c,
          status: 'withdrawn',
          withdrawalTimestamp: now,
          withdrawalReason: reason || 'Withdrawn by Data Principal request'
        };
      }
      return c;
    }));
    fsUpdateConsentRecord(consentId, {
      status: 'withdrawn',
      withdrawalTimestamp: now,
      withdrawalReason: reason || 'Withdrawn by Data Principal request'
    });
  };

  const createDSR = (requestData: {
    principalName: string;
    principalContact: string;
    principalIdentifier?: string;
    requestType: DSRType;
    details: string;
    correctionsRequested?: string;
    nomineeName?: string;
    nomineeContact?: string;
    nomineeRelationship?: string;
  }): DataSubjectRequest => {
    const count = dataSubjectRequests.length + 1;
    const reqNum = `DSR-2026-${String(count).padStart(4, '0')}`;
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 30);

    const newDSR: DataSubjectRequest = {
      id: `dsr-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      requestNumber: reqNum,
      principalName: requestData.principalName,
      principalContact: requestData.principalContact,
      principalIdentifier: requestData.principalIdentifier,
      requestType: requestData.requestType,
      details: requestData.details,
      correctionsRequested: requestData.correctionsRequested,
      nomineeName: requestData.nomineeName,
      nomineeContact: requestData.nomineeContact,
      nomineeRelationship: requestData.nomineeRelationship,
      status: 'pending',
      createdAt: new Date().toISOString(),
      statutoryDeadline: deadline.toISOString()
    };

    setDataSubjectRequests(prev => deduplicateById([newDSR, ...prev]));
    fsSaveDSR(newDSR);

    // Also trigger admin notification
    addNotification(
      `New DPDP Data Rights Request: ${reqNum}`,
      `${requestData.principalName} submitted a ${requestData.requestType.replace('_', ' ').toUpperCase()} request. Statutory 30-day resolution deadline started.`,
      'system',
      'dpdp'
    );

    return newDSR;
  };

  const updateDSR = (id: string, updates: Partial<DataSubjectRequest>) => {
    setDataSubjectRequests(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
    fsUpdateDSR(id, updates);
  };

  const deleteDSR = (id: string) => {
    setDataSubjectRequests(prev => prev.filter(d => d.id !== id));
    fsDeleteDSR(id);
  };

  const updateCookiePreferences = (prefs: Partial<CookieConsentPreferences>) => {
    setCookiePreferences(prev => {
      const updated: CookieConsentPreferences = {
        ...prev,
        ...prefs,
        essential: true, // Non-negotiable
        timestamp: new Date().toISOString()
      };
      safeLocalStorageSet(STORAGE_KEYS.COOKIE_PREFERENCES, JSON.stringify(updated));
      return updated;
    });
  };

  const clearAllGymData = async () => {
    setMembers([]);
    setPackages([]);
    setPayments([]);
    setTrainers([]);
    setEnquiries([]);
    setNotifications([]);
    setConsentRecords([]);
    setDataSubjectRequests([]);
    setWhatsAppLogs([]);
    setSettings(prev => ({ ...prev, upiId: '' }));
    safeLocalStorageRemove(STORAGE_KEYS.MEMBERS);
    safeLocalStorageRemove(STORAGE_KEYS.PACKAGES);
    safeLocalStorageRemove(STORAGE_KEYS.PAYMENTS);
    safeLocalStorageRemove(STORAGE_KEYS.TRAINERS);
    safeLocalStorageRemove(STORAGE_KEYS.ENQUIRIES);
    safeLocalStorageRemove(STORAGE_KEYS.NOTIFICATIONS);
    safeLocalStorageRemove(STORAGE_KEYS.CONSENT_RECORDS);
    safeLocalStorageRemove(STORAGE_KEYS.DSR_REQUESTS);
    safeLocalStorageRemove(STORAGE_KEYS.WHATSAPP_LOGS);
    safeLocalStorageSet(STORAGE_KEYS.DATA_RESET_KEY, 'true');
    await clearAllGymFirestoreData();
  };

  const connectWhatsApp = async (_phoneNumber?: string) => {
    try {
      const res = await initiateWhatsAppConnect();
      if (res.success) {
        addNotification(
          'WhatsApp Connection Initiated',
          'Connecting to WhatsApp Gateway. Please scan QR code if not already paired.',
          'whatsapp'
        );
        await refreshWhatsAppStatus();
        return true;
      }
      addNotification('WhatsApp Connection Error', res.error || 'Failed to start connection', 'system');
      return false;
    } catch (err: any) {
      addNotification('WhatsApp Connection Error', err?.message, 'system');
      return false;
    }
  };

  const disconnectWhatsApp = async () => {
    try {
      await terminateWhatsAppSession(true);
      await refreshWhatsAppStatus();
      addNotification(
        'WhatsApp Disconnected',
        'WhatsApp session has been unlinked from this device.',
        'system'
      );
    } catch (err: any) {
      console.warn('Disconnect notice:', err);
    }
  };

  const updateWhatsAppConfig = (updates: Partial<WhatsAppSessionData>) => {
    setWhatsAppSession(prev => ({ ...prev, ...updates }));
  };

  const refreshWhatsAppLogs = useCallback(async (): Promise<void> => {
    try {
      const res = await fetchWhatsAppMessages(50);
      if (res.success && Array.isArray(res.messages) && res.messages.length > 0) {
        const mapped: WhatsAppMessageLog[] = res.messages.map((m) => ({
          id: m.id,
          recipientPhone: m.recipientPhone,
          recipientName: m.recipientName,
          message: m.content,
          content: m.content,
          type: (m.type || 'custom') as WhatsAppMessageLog['type'],
          status: m.status,
          statusDisplay: m.statusDisplay,
          timestamp: m.createdAt || m.updatedAt || new Date().toISOString(),
          sentAt: m.sentAt,
          messageId: m.messageId,
          errorMessage: m.errorMessage,
          transitions: m.transitions,
          memberId: m.memberId,
          receiptNo: m.receiptNo
        }));
        setWhatsAppLogs(mapped);
        safeLocalStorageSet(STORAGE_KEYS.WHATSAPP_LOGS, JSON.stringify(mapped.slice(0, 50)));
      }
    } catch {
      // non-fatal
    }
  }, []);

  // Sync WhatsApp logs periodically and when gateway is connected
  useEffect(() => {
    refreshWhatsAppLogs();
    const interval = setInterval(() => {
      if (whatsAppSession.status === 'connected') {
        refreshWhatsAppLogs();
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [refreshWhatsAppLogs, whatsAppSession.status]);

  const sendWhatsAppMessage = async (
    recipientPhone: string,
    recipientName: string,
    text: string,
    type: WhatsAppMessageLog['type'] = 'custom',
    metadata?: { memberId?: string; receiptNo?: string; idempotencyKey?: string }
  ): Promise<{ success: boolean; error?: string; messageId?: string; trackingId?: string; status?: string; statusDisplay?: string; isDuplicate?: boolean }> => {
    try {
      const res = await dispatchWhatsAppMessage(recipientPhone, text, type, {
        recipientName,
        memberId: metadata?.memberId,
        receiptNo: metadata?.receiptNo,
        idempotencyKey: metadata?.idempotencyKey
      });
      const isSuccess = !!res.success;

      // Status is strictly SENT ("Message accepted by WhatsApp connection"), NEVER DELIVERED!
      const initialStatus = isSuccess ? (res.status || 'SENT') : 'FAILED';
      const initialStatusDisplay = res.statusDisplay || (isSuccess ? (res.isDuplicate ? 'Already Sent (Duplicate Prevented)' : 'Accepted by WhatsApp Connection') : 'Transmission Failed');

      const newLog: WhatsAppMessageLog = {
        id: res.trackingId || res.messageId || `walog-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        recipientPhone: res.recipientPhone || recipientPhone,
        recipientName,
        message: text,
        content: text,
        type,
        status: initialStatus,
        statusDisplay: initialStatusDisplay,
        timestamp: res.timestamp || new Date().toISOString(),
        sentAt: isSuccess ? (res.timestamp || new Date().toISOString()) : null,
        messageId: res.messageId || null,
        errorMessage: res.error || null,
        transitions: res.transitions || [
          { status: 'QUEUED', timestamp: new Date().toISOString(), reason: 'Message queued' },
          ...(isSuccess ? [{ status: 'SENT', timestamp: new Date().toISOString(), reason: res.isDuplicate ? 'Duplicate send prevented by idempotency lock' : 'Message accepted by WhatsApp connection' }] : [])
        ],
        memberId: metadata?.memberId || null,
        receiptNo: metadata?.receiptNo || null
      };

      setWhatsAppLogs(prev => {
        const existingIdx = prev.findIndex(l => l.id === newLog.id || (l.messageId && l.messageId === newLog.messageId));
        let updated: WhatsAppMessageLog[];
        if (existingIdx >= 0) {
          updated = [...prev];
          updated[existingIdx] = { ...updated[existingIdx], ...newLog };
        } else {
          updated = [newLog, ...prev];
        }
        safeLocalStorageSet(STORAGE_KEYS.WHATSAPP_LOGS, JSON.stringify(updated.slice(0, 50)));
        return updated;
      });

      // Poll in quick bursts after dispatch to reflect server ACK and delivery receipts
      if (isSuccess) {
        setTimeout(() => refreshWhatsAppLogs(), 1500);
        setTimeout(() => refreshWhatsAppLogs(), 4000);
        setTimeout(() => refreshWhatsAppLogs(), 8000);
      }

      return {
        success: isSuccess,
        error: res.error,
        messageId: res.messageId,
        trackingId: res.trackingId,
        status: initialStatus,
        statusDisplay: initialStatusDisplay,
        isDuplicate: res.isDuplicate
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Failed to dispatch WhatsApp message.',
        status: 'FAILED',
        statusDisplay: 'Transmission Failed'
      };
    }
  };

  const clearWhatsAppLogs = () => {
    setWhatsAppLogs([]);
    safeLocalStorageRemove(STORAGE_KEYS.WHATSAPP_LOGS);
  };

  const getUpcomingAutomationsSummary = (customDate?: string) => {
    // Current date (or custom preview date)
    const now = customDate ? new Date(customDate) : new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const todayStr = `${year}-${month}-${day}`;
    const todayMMDD = `${month}-${day}`;

    const renewals7d: { member: Member; daysLeft: number; message: string; phone: string }[] = [];
    const renewals3d: { member: Member; daysLeft: number; message: string; phone: string }[] = [];
    const renewals1d: { member: Member; daysLeft: number; message: string; phone: string }[] = [];
    const birthdays: { member: Member; message: string; phone: string }[] = [];
    const festivalsSummary: { festival: FestivalEvent; members: Member[]; message: string }[] = [];

    const formatTokens = (tmpl: string, mem: Member, festName?: string, daysLeft?: number) => {
      return tmpl
        .replace(/{MEMBER_NAME}/gi, mem.fullName)
        .replace(/{EXPIRY_DATE}/gi, mem.expiryDate)
        .replace(/{DAYS_LEFT}/gi, String(daysLeft ?? ''))
        .replace(/{GYM_NAME}/gi, settings.gymName || 'Black Stone Fitness')
        .replace(/{PACKAGE_NAME}/gi, mem.packageName || 'Membership')
        .replace(/{UPI_ID}/gi, settings.upiId || 'blackstonefitness@upi')
        .replace(/{FESTIVAL_NAME}/gi, festName || '');
    };

    const getDaysUntilExpiry = (expiryDateStr: string): number => {
      try {
        const [y, m, d] = expiryDateStr.split('-').map(Number);
        const expDate = new Date(y, m - 1, d);
        const [ty, tm, td] = todayStr.split('-').map(Number);
        const todayDate = new Date(ty, tm - 1, td);
        const diffMs = expDate.getTime() - todayDate.getTime();
        return Math.round(diffMs / (1000 * 60 * 60 * 24));
      } catch {
        return -999;
      }
    };

    // Scan Members
    for (const m of members) {
      if ((m.status as string) === 'inactive') continue;
      const phone = m.whatsapp || m.phone;
      if (!phone) continue;

      // Expiry checks
      if (m.expiryDate) {
        const days = getDaysUntilExpiry(m.expiryDate);
        if (days === 7 && settings.enable7DayReminders && m.automationOverrides?.reminder7Days !== false) {
          const tmpl =
            settings.reminder7DayTemplate ||
            'Hello {MEMBER_NAME}, your Black Stone Fitness membership will expire in 7 days on {EXPIRY_DATE}. Renew early to lock in your legacy rate & zero admission fees! 💪 - BSF Mysuru';
          renewals7d.push({ member: m, daysLeft: 7, message: formatTokens(tmpl, m, undefined, 7), phone });
        }
        if (days === 3 && settings.enable3DayReminders && m.automationOverrides?.reminder3Days !== false) {
          const tmpl =
            settings.reminder3DayTemplate ||
            "Hi {MEMBER_NAME}, only 3 days left on your BSF membership ({EXPIRY_DATE}). Don't break your workout streak! Visit the front desk or renew via UPI. 🏋️‍♂️ - Black Stone Fitness";
          renewals3d.push({ member: m, daysLeft: 3, message: formatTokens(tmpl, m, undefined, 3), phone });
        }
        if (days === 1 && settings.enable1DayReminders && m.automationOverrides?.reminder1Day !== false) {
          const tmpl =
            settings.reminder1DayTemplate ||
            'FINAL REMINDER: Hi {MEMBER_NAME}, your BSF membership expires tomorrow ({EXPIRY_DATE}). Renew today to keep seamless gym access. ⚡ - Team BSF Mysuru';
          renewals1d.push({ member: m, daysLeft: 1, message: formatTokens(tmpl, m, undefined, 1), phone });
        }
      }

      // Birthday checks
      if (m.dob && settings.enableBirthdayGreetings && m.automationOverrides?.birthdayWish !== false) {
        const parts = m.dob.split('-');
        if (parts.length === 3 && `${parts[1]}-${parts[2]}` === todayMMDD) {
          const tmpl =
            settings.birthdayTemplate ||
            '🎉 Happy Birthday, {MEMBER_NAME}! 🎂 The entire Black Stone Fitness family wishes you a healthy, strong, and powerhouse year ahead. Keep crushing your goals! 💪🔥 — Team BSF Mysuru';
          birthdays.push({ member: m, message: formatTokens(tmpl, m), phone });
        }
      }
    }

    // Festival checks
    for (const fest of festivals) {
      if (!fest.enabled) continue;
      if (fest.monthDay === todayMMDD || (fest.dateString && fest.dateString.includes(todayStr))) {
        const eligible = members.filter(
          (m) =>
            (m.status as string) !== 'inactive' &&
            m.automationOverrides?.festivalGreetings !== false &&
            (m.whatsapp || m.phone)
        );
        festivalsSummary.push({
          festival: fest,
          members: eligible,
          message: fest.messageTemplate,
        });
      }
    }

    return {
      renewals7d,
      renewals3d,
      renewals1d,
      birthdays,
      festivals: festivalsSummary,
    };
  };

  const runWhatsAppAutomations = async (options?: {
    force?: boolean;
    dryRun?: boolean;
    type?: 'all' | 'renewals' | 'birthdays' | 'festivals';
    customDate?: string;
  }) => {
    try {
      const summary = getUpcomingAutomationsSummary(options?.customDate);
      const results = {
        totalCandidates: 0,
        sentCount: 0,
        duplicatePreventedCount: 0,
        failedCount: 0,
        details: [] as Array<{
          key: string;
          memberId: string;
          phone: string;
          action: 'sent' | 'duplicate_prevented' | 'failed' | 'dry_run';
          reason?: string;
        }>
      };

      const filterType = options?.type || 'all';

      // 1. Process 7-day reminders with exact key format: {membershipId}:renewal:7
      if (filterType === 'all' || filterType === 'renewals') {
        for (const item of summary.renewals7d) {
          results.totalCandidates++;
          const membershipId = (item.member as any).membershipId || item.member.id;
          const key = `${membershipId}:renewal:7`;

          if (options?.dryRun) {
            results.details.push({ key, memberId: item.member.id, phone: item.phone, action: 'dry_run' });
            continue;
          }

          const res = await sendWhatsAppMessage(
            item.phone,
            item.member.fullName,
            item.message,
            'expiry_reminder',
            { memberId: item.member.id, idempotencyKey: key }
          );

          if (res.isDuplicate) {
            results.duplicatePreventedCount++;
            results.details.push({
              key,
              memberId: item.member.id,
              phone: item.phone,
              action: 'duplicate_prevented',
              reason: 'Message already successfully sent in previous execution'
            });
          } else if (res.success) {
            results.sentCount++;
            results.details.push({
              key,
              memberId: item.member.id,
              phone: item.phone,
              action: 'sent'
            });
          } else {
            results.failedCount++;
            results.details.push({
              key,
              memberId: item.member.id,
              phone: item.phone,
              action: 'failed',
              reason: res.error || 'Failed to dispatch'
            });
          }
        }

        // 2. Process 3-day reminders with exact key format: {membershipId}:renewal:3
        for (const item of summary.renewals3d) {
          results.totalCandidates++;
          const membershipId = (item.member as any).membershipId || item.member.id;
          const key = `${membershipId}:renewal:3`;

          if (options?.dryRun) {
            results.details.push({ key, memberId: item.member.id, phone: item.phone, action: 'dry_run' });
            continue;
          }

          const res = await sendWhatsAppMessage(
            item.phone,
            item.member.fullName,
            item.message,
            'expiry_reminder',
            { memberId: item.member.id, idempotencyKey: key }
          );

          if (res.isDuplicate) {
            results.duplicatePreventedCount++;
            results.details.push({
              key,
              memberId: item.member.id,
              phone: item.phone,
              action: 'duplicate_prevented',
              reason: 'Message already successfully sent in previous execution'
            });
          } else if (res.success) {
            results.sentCount++;
            results.details.push({
              key,
              memberId: item.member.id,
              phone: item.phone,
              action: 'sent'
            });
          } else {
            results.failedCount++;
            results.details.push({
              key,
              memberId: item.member.id,
              phone: item.phone,
              action: 'failed',
              reason: res.error || 'Failed to dispatch'
            });
          }
        }

        // 3. Process 1-day reminders with exact key format: {membershipId}:renewal:1
        for (const item of summary.renewals1d) {
          results.totalCandidates++;
          const membershipId = (item.member as any).membershipId || item.member.id;
          const key = `${membershipId}:renewal:1`;

          if (options?.dryRun) {
            results.details.push({ key, memberId: item.member.id, phone: item.phone, action: 'dry_run' });
            continue;
          }

          const res = await sendWhatsAppMessage(
            item.phone,
            item.member.fullName,
            item.message,
            'expiry_reminder',
            { memberId: item.member.id, idempotencyKey: key }
          );

          if (res.isDuplicate) {
            results.duplicatePreventedCount++;
            results.details.push({
              key,
              memberId: item.member.id,
              phone: item.phone,
              action: 'duplicate_prevented',
              reason: 'Message already successfully sent in previous execution'
            });
          } else if (res.success) {
            results.sentCount++;
            results.details.push({
              key,
              memberId: item.member.id,
              phone: item.phone,
              action: 'sent'
            });
          } else {
            results.failedCount++;
            results.details.push({
              key,
              memberId: item.member.id,
              phone: item.phone,
              action: 'failed',
              reason: res.error || 'Failed to dispatch'
            });
          }
        }
      }

      // 4. Process Birthday Wishes
      if (filterType === 'all' || filterType === 'birthdays') {
        const currentYear = new Date().getFullYear();
        for (const item of summary.birthdays) {
          results.totalCandidates++;
          const membershipId = (item.member as any).membershipId || item.member.id;
          const key = `${membershipId}:birthday:${currentYear}`;

          if (options?.dryRun) {
            results.details.push({ key, memberId: item.member.id, phone: item.phone, action: 'dry_run' });
            continue;
          }

          const res = await sendWhatsAppMessage(
            item.phone,
            item.member.fullName,
            item.message,
            'birthday',
            { memberId: item.member.id, idempotencyKey: key }
          );

          if (res.isDuplicate) {
            results.duplicatePreventedCount++;
            results.details.push({
              key,
              memberId: item.member.id,
              phone: item.phone,
              action: 'duplicate_prevented',
              reason: 'Birthday wish already sent for this year'
            });
          } else if (res.success) {
            results.sentCount++;
            results.details.push({
              key,
              memberId: item.member.id,
              phone: item.phone,
              action: 'sent'
            });
          } else {
            results.failedCount++;
            results.details.push({
              key,
              memberId: item.member.id,
              phone: item.phone,
              action: 'failed',
              reason: res.error || 'Failed to dispatch'
            });
          }
        }
      }

      // 5. Process Festival Greetings
      if (filterType === 'all' || filterType === 'festivals') {
        const currentYear = new Date().getFullYear();
        for (const festGroup of summary.festivals) {
          for (const member of festGroup.members) {
            const phone = member.whatsapp || member.phone;
            if (!phone) continue;
            results.totalCandidates++;

            const membershipId = (member as any).membershipId || member.id;
            const key = `${membershipId}:festival:${festGroup.festival.id}:${currentYear}`;

            if (options?.dryRun) {
              results.details.push({ key, memberId: member.id, phone, action: 'dry_run' });
              continue;
            }

            const res = await sendWhatsAppMessage(
              phone,
              member.fullName,
              festGroup.message,
              'announcement',
              { memberId: member.id, idempotencyKey: key }
            );

            if (res.isDuplicate) {
              results.duplicatePreventedCount++;
              results.details.push({
                key,
                memberId: member.id,
                phone,
                action: 'duplicate_prevented',
                reason: 'Festival greeting already dispatched for this event'
              });
            } else if (res.success) {
              results.sentCount++;
              results.details.push({
                key,
                memberId: member.id,
                phone,
                action: 'sent'
              });
            } else {
              results.failedCount++;
              results.details.push({
                key,
                memberId: member.id,
                phone,
                action: 'failed',
                reason: res.error || 'Failed to dispatch'
              });
            }
          }
        }
      }

      return {
        success: true,
        summary: results
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Failed to execute WhatsApp automations.'
      };
    }
  };

  const testWhatsAppAutomation = async (params: {
    testPhone: string;
    templateType: 'renewal_7d' | 'renewal_3d' | 'renewal_1d' | 'birthday' | 'festival';
    memberName?: string;
    customMessage?: string;
  }) => {
    try {
      // Accidental double-click protection via client debounce & unique idempotency key
      const idempotencyKey = `test:${params.testPhone.replace(/\D/g, '')}:${params.templateType}:${Date.now()}`;
      const res = await dispatchWhatsAppTest(params.testPhone, params.templateType, idempotencyKey);
      if (res.success) {
        return { success: true };
      }
      return { success: false, error: res.error || 'Failed to dispatch test message.' };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Error sending test message.' };
    }
  };

  const clearTrainersPlansAndUpi = async () => {
    setPackages([]);
    setTrainers([]);
    setSettings(prev => ({ ...prev, upiId: '' }));
    safeLocalStorageRemove(STORAGE_KEYS.PACKAGES);
    safeLocalStorageRemove(STORAGE_KEYS.TRAINERS);
    await clearTrainersPlansAndUpiFirestore();
  };

  const syncAllToFirestore = async (): Promise<{ success: boolean; count: number; error?: string }> => {
    try {
      let count = 0;
      for (const t of trainers) {
        await fsSaveTrainer(t);
        count++;
      }
      for (const m of members) {
        await fsSaveMember(m);
        count++;
      }
      for (const p of packages) {
        await fsSavePackage(p);
        count++;
      }
      for (const e of enquiries) {
        await fsSaveEnquiry(e);
        count++;
      }
      for (const pay of payments) {
        await fsSavePayment(pay);
        count++;
      }
      await fsUpdateSettings(settings);
      count++;
      return { success: true, count };
    } catch (err: any) {
      console.error('Error syncing all to Firestore:', err);
      return { success: false, count: 0, error: err?.message || String(err) };
    }
  };

  const getMemberById = (id: string) => members.find(m => m.id === id);
  const getPackageById = (id: string) => packages.find(p => p.id === id);
  const getTrainerById = (id: string) => trainers.find(t => t.id === id);
  const getReceiptById = (id: string) => payments.find(p => p.id === id);

  return (
    <GymContext.Provider
      value={{
        members,
        packages,
        payments,
        trainers,
        enquiries,
        festivals,
        notifications,
        settings,
        consentRecords,
        dataSubjectRequests,
        cookiePreferences,
        recordConsent,
        withdrawConsent,
        createDSR,
        updateDSR,
        deleteDSR,
        updateCookiePreferences,
        clearAllGymData,
        clearTrainersPlansAndUpi,
        syncAllToFirestore,
        isFirebaseConnected,
        firestoreSynced,
        isQuotaExhausted,
        reconnectFirestore,
        currentUserRole,
        currentMember,
        isAdminAuthenticated: currentUserRole === 'admin',
        setCurrentUserRole,
        setCurrentMember,
        loginAsMember,
        loginAsAdmin,
        logout,
        addMember,
        updateMember,
        deleteMember,
        renewMember,
        recordPayment,
        updatePayment,
        deletePayment,
        undoPayment,
        addTrainer,
        updateTrainer,
        deleteTrainer,
        addPackage,
        updatePackage,
        deletePackage,
        addEnquiry,
        updateEnquiry,
        deleteEnquiry,
        convertEnquiryToMember,
        updateSettings,
        toggleFestival,
        updateFestivalTemplate,
        markNotificationRead,
        markAllNotificationsRead,
        addNotification,
        whatsAppSession,
        whatsAppLogs,
        connectWhatsApp,
        disconnectWhatsApp,
        updateWhatsAppConfig,
        refreshWhatsAppLogs,
        sendWhatsAppMessage,
        clearWhatsAppLogs,
        runWhatsAppAutomations,
        getUpcomingAutomationsSummary,
        testWhatsAppAutomation,
        getStats,
        getMemberById,
        getPackageById,
        getTrainerById,
        getReceiptById
      }}
    >
      {children}
    </GymContext.Provider>
  );
};

export const useGym = () => {
  const context = useContext(GymContext);
  if (!context) throw new Error('useGym must be used within a GymProvider');
  return context;
};
