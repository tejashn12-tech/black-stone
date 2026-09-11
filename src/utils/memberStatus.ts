import { Member, MembershipStatus } from '../types';

/**
 * Calculates the whole calendar days remaining until the given expiry date.
 * Uses local midnight comparison to ensure consistent day-boundary calculations.
 * 
 * Returns:
 *   < 0 : Plan has already expired (e.g., -1 = expired yesterday)
 *   = 0 : Plan expires today (0 days left)
 *   1-7 : Plan expires in 1 to 7 days (7 days or less left)
 *   > 7 : Plan has more than 7 days left
 */
export function getDaysUntilExpiry(expiryDate?: string): number {
  if (!expiryDate) return -999;
  
  // Normalize today to start of day
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const parts = expiryDate.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) {
    // Fallback parsing if date isn't YYYY-MM-DD
    const parsed = new Date(expiryDate);
    if (isNaN(parsed.getTime())) return -999;
    parsed.setHours(0, 0, 0, 0);
    const diffMs = parsed.getTime() - today.getTime();
    return Math.round(diffMs / (1000 * 60 * 60 * 24));
  }

  const expDate = new Date(parts[0], parts[1] - 1, parts[2], 0, 0, 0, 0);
  const diffMs = expDate.getTime() - today.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Checks if a member has only 7 days or less left to their plan's expiry date (0 to 7 days inclusive).
 */
export function isExpiringSoon(expiryDate?: string): boolean {
  const days = getDaysUntilExpiry(expiryDate);
  return days >= 0 && days <= 7;
}

/**
 * Checks if a plan has already passed its expiry date (< 0 days remaining).
 */
export function isExpired(expiryDate?: string): boolean {
  const days = getDaysUntilExpiry(expiryDate);
  return days < 0;
}

/**
 * Checks if a member is currently an active member in the gym
 * (their membership plan has not expired, i.e., 0 or more days remaining, and they are not marked inactive).
 */
export function isActiveMember(member: Pick<Member, 'status' | 'expiryDate'>): boolean {
  if ((member.status as string) === 'inactive') return false;
  return !isExpired(member.expiryDate);
}

/**
 * Computes the canonical membership status based on the business rule:
 * - Members with only 7 days or less left to their plan's expiry date => 'expiring_soon'
 * - Members past their expiry date => 'expired'
 * - Members with > 7 days left:
 *     - If pendingAmount > 0 => 'payment_due'
 *     - Otherwise => 'active'
 */
export function getEffectiveMemberStatus(
  member: Pick<Member, 'status' | 'expiryDate' | 'pendingAmount'>
): MembershipStatus {
  // If explicitly archived/inactive in system
  if ((member.status as string) === 'inactive') {
    return 'expired';
  }

  const days = getDaysUntilExpiry(member.expiryDate);

  // Past expiry date -> Expired
  if (days < 0) {
    return 'expired';
  }

  // Only 7 days or less left to plan's expiry date -> Expiring Soon
  if (days <= 7) {
    return 'expiring_soon';
  }

  // More than 7 days left
  if ((member.pendingAmount || 0) > 0) {
    return 'payment_due';
  }

  return 'active';
}

/**
 * Returns a human-friendly string describing days remaining until plan expiry.
 */
export function getExpiryCountdownLabel(expiryDate?: string): string {
  const days = getDaysUntilExpiry(expiryDate);
  if (days < -365) return `Expired > 1 yr ago`;
  if (days < 0) return `Expired ${Math.abs(days)}d ago`;
  if (days === 0) return 'Expires today';
  if (days === 1) return 'Expires tomorrow (1 day)';
  return `${days} days left`;
}

/**
 * Returns a Member object whose status is guaranteed to match their plan's expiry date.
 */
export function resolveMemberStatus<T extends Member>(member: T): T {
  const effectiveStatus = getEffectiveMemberStatus(member);
  if (member.status !== effectiveStatus) {
    return { ...member, status: effectiveStatus };
  }
  return member;
}

/**
 * Comparator to sort members so the most recently joined profiles appear on top (newest first).
 * Uses joinedDate or startDate descending, with numeric memberCode and ID as tiebreakers.
 */
export function compareMembersRecentlyJoined(a: Member, b: Member): number {
  const parseTime = (dateStr?: string) => {
    if (!dateStr) return 0;
    const t = new Date(dateStr).getTime();
    return isNaN(t) ? 0 : t;
  };
  
  const timeA = parseTime(a.joinedDate) || parseTime(a.startDate);
  const timeB = parseTime(b.joinedDate) || parseTime(b.startDate);

  if (timeB !== timeA) {
    return timeB - timeA;
  }

  const numA = parseInt((a.memberCode || '').replace(/\D/g, ''), 10) || 0;
  const numB = parseInt((b.memberCode || '').replace(/\D/g, ''), 10) || 0;
  if (numB !== numA) {
    return numB - numA;
  }
  return (b.id || '').localeCompare(a.id || '');
}

