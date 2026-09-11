import type { Member, MembershipPackage, PaymentRecord, Trainer } from '../types';

export const STORAGE_KEYS = {
  MEMBERS: 'bsf_members_v14',
  PACKAGES: 'bsf_packages_v13',
  PAYMENTS: 'bsf_payments_v13',
  TRAINERS: 'bsf_trainers_v13',
  ENQUIRIES: 'bsf_enquiries_v13',
  FESTIVALS: 'bsf_festivals_v13',
  WHATSAPP_SESSION: 'bsf_whatsapp_session_v13',
  WHATSAPP_LOGS: 'bsf_whatsapp_logs_v13',
  NOTIFICATIONS: 'bsf_notifications_v13',
  SETTINGS: 'bsf_settings_v13',
  SESSION_ROLE: 'bsf_session_role_v1',
  SESSION_MEMBER: 'bsf_session_member_v1',
  CONSENT_RECORDS: 'bsf_dpdp_consent_records_v13',
  DSR_REQUESTS: 'bsf_dpdp_dsr_requests_v13',
  COOKIE_PREFERENCES: 'bsf_cookie_consent_preferences_v1',
  DATA_RESET_KEY: 'bsf_data_purged_v14',
  ADMIN_TOKEN: 'bsf_admin_token',
} as const;

// Set of all legitimate, current active keys
const ACTIVE_STORAGE_KEYS = new Set<string>(Object.values(STORAGE_KEYS));

/**
 * Sweep localStorage and remove all stale, dead, or previous-version keys
 * (e.g. bsf_members_v1 through v13, old logs, etc.) to free quota.
 */
export function pruneStaleLocalStorage(): void {
  if (typeof window === 'undefined' || !window.localStorage) return;

  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('bsf_') || key.startsWith('gym_')) && !ACTIVE_STORAGE_KEYS.has(key)) {
        keysToRemove.push(key);
      }
    }

    for (const key of keysToRemove) {
      try {
        localStorage.removeItem(key);
      } catch {
        // ignore
      }
    }
  } catch {
    // LocalStorage access restricted (e.g. private browsing or sandboxed iframe)
  }
}

/**
 * Strip heavy base64 data URIs (e.g. webcam photo snapshots) from member records
 * before serializing to localStorage. Real photos remain intact in memory and Firestore.
 */
export function sanitizeMembersForCache(members: Member[]): Member[] {
  if (!Array.isArray(members)) return [];
  return members.map((m) => {
    if (m.photoUrl && m.photoUrl.startsWith('data:image') && m.photoUrl.length > 500) {
      // Retain member data without the heavy base64 payload in browser localStorage
      const { photoUrl, ...rest } = m;
      return rest as Member;
    }
    return m;
  });
}

/**
 * Strip heavy base64 data URIs from single member profile before caching.
 */
export function sanitizeMemberForCache(member: Member | null): Member | null {
  if (!member) return null;
  if (member.photoUrl && member.photoUrl.startsWith('data:image') && member.photoUrl.length > 500) {
    const { photoUrl, ...rest } = member;
    return rest as Member;
  }
  return member;
}

/**
 * Strip heavy base64 data URIs from trainers before caching.
 */
export function sanitizeTrainersForCache(trainers: Trainer[]): Trainer[] {
  if (!Array.isArray(trainers)) return [];
  return trainers.map((t) => {
    if (t.photoUrl && t.photoUrl.startsWith('data:image') && t.photoUrl.length > 500) {
      const { photoUrl, ...rest } = t;
      return rest as Trainer;
    }
    return t;
  });
}

/**
 * Safe wrapper around localStorage.setItem that intercepts QuotaExceededError,
 * prunes stale keys, purges heavy payloads, and guarantees zero unhandled crashes.
 */
export function safeLocalStorageSet(key: string, value: string): boolean {
  if (typeof window === 'undefined' || !window.localStorage) return false;

  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error: any) {
    const isQuotaError =
      error?.name === 'QuotaExceededError' ||
      error?.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
      error?.code === 22 ||
      error?.code === 1014 ||
      (typeof error?.message === 'string' && error.message.toLowerCase().includes('quota'));

    if (isQuotaError) {
      console.warn(`[Storage] Quota exceeded for "${key}". Pruning stale keys and retrying...`);

      // 1. Purge dead and outdated keys
      pruneStaleLocalStorage();

      // 2. Clear non-essential large caches to free quota
      try {
        localStorage.removeItem(STORAGE_KEYS.WHATSAPP_LOGS);
        localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
      } catch {
        // ignore
      }

      // 3. Retry setting item
      try {
        localStorage.setItem(key, value);
        return true;
      } catch {
        // If still failing and key is members, try setting an empty or slimmed cache
        if (key === STORAGE_KEYS.MEMBERS) {
          try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) {
              // Store lightweight summary of members
              const slimmed = parsed.map((m: any) => ({
                id: m.id,
                memberCode: m.memberCode,
                fullName: m.fullName,
                phone: m.phone,
                whatsapp: m.whatsapp,
                packageName: m.packageName,
                startDate: m.startDate,
                expiryDate: m.expiryDate,
                status: m.status,
                totalAmount: m.totalAmount,
                paidAmount: m.paidAmount,
                pendingAmount: m.pendingAmount,
              }));
              localStorage.setItem(key, JSON.stringify(slimmed));
              return true;
            }
          } catch {
            // fallback
          }
        }

        console.warn(`[Storage] Storage quota exhausted. Skipped offline cache for "${key}". Data remains preserved in Firestore.`);
        return false;
      }
    }

    console.warn(`[Storage] Error setting "${key}":`, error?.message);
    return false;
  }
}

/**
 * Safe wrapper around localStorage.getItem
 */
export function safeLocalStorageGet(key: string): string | null {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * Safe wrapper around localStorage.removeItem
 */
export function safeLocalStorageRemove(key: string): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}
