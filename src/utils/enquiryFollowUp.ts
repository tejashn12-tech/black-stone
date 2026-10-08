import { Enquiry } from '../types';

/**
 * Normalizes an enquiry object ensuring all follow-up tracking properties exist
 */
export const normalizeEnquiry = (enquiry: Enquiry): Enquiry => {
  const enquiryCreatedAt = enquiry.enquiryCreatedAt || enquiry.createdAt || new Date().toISOString();
  return {
    ...enquiry,
    enquiryCreatedAt,
    followUpStatus: enquiry.followUpStatus || 'PENDING',
    followUpStage: enquiry.followUpStage || 'DAY_7',
    followUpStopped: enquiry.followUpStopped || false,
    followUpCount: enquiry.followUpCount || 0,
    nextFollowUpAt: enquiry.nextFollowUpAt ?? null,
    lastFollowUpAt: enquiry.lastFollowUpAt ?? null,
    followUpHistory: enquiry.followUpHistory || {}
  };
};

/**
 * Adds a given number of days to an ISO date string
 */
export const addDaysToDate = (dateStr: string, days: number): string => {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  } catch {
    return dateStr;
  }
};
