export type MembershipStatus = 'active' | 'expiring_soon' | 'expired' | 'payment_due' | 'fully_paid';
export type PaymentStatus = 'PAID' | 'PARTIALLY PAID' | 'PAYMENT DUE' | 'REFUNDED' | 'VOID';
export type PaymentMethod = 'UPI' | 'Cash' | 'Card' | 'Bank Transfer' | 'Other';
export type MessageDeliveryStatus =
  | 'QUEUED'
  | 'SENDING'
  | 'SENT'
  | 'SERVER_ACK'
  | 'DELIVERED'
  | 'READ'
  | 'PLAYED'
  | 'FAILED';

export type WhatsAppStatus =
  | 'Queued'
  | 'Sending'
  | 'Sent'
  | 'Server Ack'
  | 'Delivered'
  | 'Read'
  | 'Played'
  | 'Failed'
  | 'Pending';

export interface WhatsAppMessageTransition {
  status: MessageDeliveryStatus | string;
  timestamp: string;
  reason: string;
  rawStatus?: string | number;
}
export type LeadStatus = 'New Lead' | 'Contacted' | 'Follow-up Required' | 'Interested' | 'Not Interested' | 'Converted to Member';
export type ReferralSource = 'Google' | 'Instagram' | 'Facebook' | 'Friend/Referral' | 'Walk-in' | 'Advertisement' | 'Other';
export type ExerciseCategory = 
  | 'upper_body'
  | 'lower_body'
  | 'core'
  | 'cardio'
  | 'flexibility'
  | 'chest' 
  | 'back' 
  | 'biceps' 
  | 'triceps' 
  | 'shoulders' 
  | 'legs' 
  | 'quads'
  | 'quadriceps' 
  | 'hamstrings' 
  | 'glutes' 
  | 'calves' 
  | 'abs'
  | 'abs_core'
  | 'obliques'
  | 'lower_back'
  | 'forearms'
  | 'full_body'
  | 'all'
  | string;

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type EquipmentType = 'Barbell' | 'Dumbbell' | 'Cable' | 'Machine' | 'Bodyweight' | 'Kettlebell' | 'Resistance Band' | 'Other' | string;

export interface PTSessionLog {
  id: string;
  date: string;
  focus: string;
  trainerName: string;
  durationMinutes?: number;
  notes?: string;
}

export interface MemberPersonalTraining {
  enrolled: boolean;
  trainerId?: string;
  trainerName?: string;
  trainerPhone?: string;
  trainerSpecialization?: string;
  trainerPhotoUrl?: string;
  planName?: string;
  totalSessions: number;
  completedSessions: number;
  startDate?: string;
  endDate?: string;
  price?: number;
  paidAmount?: number;
  pendingAmount?: number;
  status?: 'Active' | 'Completed' | 'Expired' | 'Paused';
  sessionHistory?: PTSessionLog[];
  notes?: string;
}

export interface MemberSubscriptionItem {
  id: string;
  type?: 'membership_plan' | 'personal_training' | 'add_on';
  membershipName: string;
  category: string;
  startDate: string;
  endDate: string;
  price: number;
  paidAmount?: number;
  pendingAmount?: number;
  membershipStatus: 'Active' | 'Expired' | 'Frozen' | 'Cancelled';
  paymentStatus: 'Paid' | 'Pending' | 'Partially Paid';
  packageId?: string;
  trainerId?: string;
  trainerName?: string;
  totalSessions?: number;
  completedSessions?: number;
  notes?: string;
}

export interface MemberAttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  checkInTime: string; // HH:MM AM/PM
  checkOutTime?: string;
  method: 'QR' | 'Front Desk' | 'App' | 'Manual';
  status: 'Present' | 'Late' | 'Rest Day';
  gate?: string;
}

export interface MemberWorkoutPlan {
  planName: string;
  goal: string;
  level: string;
  assignedTrainerName?: string;
  schedule: { day: string; focus: string; exercises: string[] }[];
  notes?: string;
  lastUpdated?: string;
}

export interface MemberMedicalRecord {
  notes?: string;
  injuries?: string;
  allergies?: string;
  restrictions?: string;
  bloodGroup?: string;
  emergencyDoctor?: string;
  doctorPhone?: string;
  updatedAt?: string;
}

export interface MemberFollowUpLog {
  id: string;
  date: string;
  staffName: string;
  note: string;
  outcome: 'Interested' | 'Renewal Promised' | 'No Answer' | 'Fee Dispute' | 'Feedback Shared' | 'General';
  nextFollowUpDate?: string;
}

export interface MemberChallengeRecord {
  id: string;
  name: string;
  date: string;
  rank?: string;
  badge?: string;
  completed: boolean;
  score?: string;
}

export interface MemberAutomationOverrides {
  birthdayWish?: boolean;
  festivalGreetings?: boolean;
  reminder7Days?: boolean;
  reminder3Days?: boolean;
  reminder1Day?: boolean;
  expiryDay?: boolean;
  paymentConfirmation?: boolean;
}

export interface Member {
  id: string;
  memberCode: string; // e.g., BSF-2026-104
  fullName: string;
  email: string;
  phone: string;
  whatsapp: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string; // YYYY-MM-DD
  photoUrl?: string;
  packageId: string;
  packageName: string;
  startDate: string; // YYYY-MM-DD
  expiryDate: string; // YYYY-MM-DD
  status: MembershipStatus;
  totalAmount: number;
  paidAmount: number;
  lastFeesPaid?: number;
  pendingAmount: number;
  assignedTrainerId?: string;
  assignedTrainerName?: string;
  hasPersonalTraining?: boolean;
  personalTraining?: MemberPersonalTraining;
  notes?: string;
  emergencyContact?: string;
  bloodGroup?: string;
  address?: string;
  heightCm?: number;
  weightKg?: number;
  bmi?: number;
  joinedDate: string;
  password?: string;
  // Extended Gym CRM Profile Fields
  enquiryDate?: string;
  clientRepresentative?: string;
  appInstalled?: boolean;
  biometricStatus?: 'added' | 'not_added' | 'blocked';
  biometricDeviceId?: string;
  biometricEnrollId?: string;
  biometricSyncedAt?: string;
  isFrozen?: boolean;
  frozenUntil?: string;
  medicalHistory?: MemberMedicalRecord;
  workoutPlan?: MemberWorkoutPlan;
  attendanceHistory?: MemberAttendanceRecord[];
  subscriptions?: MemberSubscriptionItem[];
  automationOverrides?: MemberAutomationOverrides;
  followUps?: MemberFollowUpLog[];
  participatedChallenges?: MemberChallengeRecord[];
}

export interface MembershipPackage {
  id: string;
  name: string;
  durationMonths: number;
  price: number;
  originalPrice?: number;
  description: string;
  features: string[];
  popular?: boolean;
  active: boolean;
  badge?: string;
}

export interface PaymentRecord {
  id: string;
  receiptNo: string; // e.g., BSF-REC-8921
  memberId: string;
  memberName: string;
  memberPhone: string;
  packageId: string;
  packageName: string;
  amountPaid: number;
  totalPackageAmount: number;
  pendingAmount: number;
  discount: number;
  paymentDate: string; // YYYY-MM-DD
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  notes?: string;
  whatsappStatus: WhatsAppStatus;
  whatsappSentAt?: string;
  transactionRef?: string;
  expiryDate: string;
  receiptSent?: boolean;
  paymentTime?: string;
  staffName?: string;
}

export interface Trainer {
  id: string;
  name: string;
  role: string;
  specialization: string[];
  experienceYears: number;
  certifications: string[];
  bio: string;
  photoUrl: string;
  rating: number;
  active: boolean;
  phone: string;
  instagram?: string;
  assignedMemberCount: number;
}

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  categoryDisplay: string;
  targetMuscle?: string;
  targetMuscleKey?: string;
  targetMuscles: string[];
  secondaryMuscles: string[];
  difficulty: DifficultyLevel;
  equipment: EquipmentType;
  instructions: string[];
  safetyTips: string[];
  commonMistakes: string[];
  imageUrl: string;
  gifUrl?: string;
  mirrorGifUrl?: string;
  videoEmbedUrl?: string;
  caloriesBurnEstimatePerHour?: number;
}

export type FollowUpStage = 'DAY_7' | 'DAY_15' | 'DAY_30' | 'DAY_45' | 'DAY_45_COMPLETED';
export type FollowUpStatus = 'PENDING' | 'DAY_7_SENT' | 'DAY_15_SENT' | 'DAY_30_SENT' | 'DAY_45_SENT' | 'COMPLETED' | 'STOPPED' | 'FAILED';
export type StageDeliveryStatus = 'PENDING' | 'SENT' | 'FAILED' | 'SKIPPED';

export interface FollowUpStageRecord {
  scheduledAt: string;
  sentAt?: string | null;
  status: StageDeliveryStatus;
  error?: string;
  messageId?: string;
}

export interface FollowUpHistory {
  day7?: FollowUpStageRecord;
  day15?: FollowUpStageRecord;
  day30?: FollowUpStageRecord;
  day45?: FollowUpStageRecord;
}

export interface Enquiry {
  id: string;
  enquiryCode: string;
  name: string;
  phone: string;
  whatsapp: string;
  age?: number;
  gender: 'Male' | 'Female' | 'Other';
  address?: string;
  fitnessGoal?: string;
  referralSource: ReferralSource;
  pastExperience?: string;
  medicalConsultation?: string;
  injuries?: string;
  preferredPackageId?: string;
  preferredPackageName?: string;
  budget?: string;
  preferredTrainer?: string;
  notes?: string;
  status: LeadStatus;
  followUpDate?: string;
  followUpNotes?: string;
  createdAt: string;
  convertedMemberId?: string;
  // BSF Enquiry Follow-Up Automation fields
  enquiryCreatedAt?: string;
  followUpStatus?: FollowUpStatus;
  followUpStage?: FollowUpStage;
  nextFollowUpAt?: string | null;
  followUpStopped?: boolean;
  followUpCount?: number;
  lastFollowUpAt?: string | null;
  followUpHistory?: FollowUpHistory;
}

export interface WhatsAppLog {
  id: string;
  recipientName: string;
  recipientPhone: string;
  type: 'payment_receipt' | 'renewal_reminder_7d' | 'renewal_reminder_3d' | 'renewal_reminder_1d' | 'post_expiry' | 'birthday' | 'festival_greeting' | 'custom_broadcast' | 'enquiry_followup_7d' | 'enquiry_followup_15d' | 'enquiry_followup_30d' | 'enquiry_followup_45d' | 'enquiry_manual_message';
  templateName: string;
  content: string;
  status: WhatsAppStatus;
  sentAt: string;
  receiptNo?: string;
  memberId?: string;
  enquiryId?: string;
  errorMessage?: string;
}

export interface FestivalEvent {
  id: string;
  name: string;
  dateString: string; // e.g. "2026-10-20" or "26 January"
  monthDay: string; // MM-DD
  category: 'National Day' | 'Festival' | 'Cultural' | 'Special Occasion';
  messageTemplate: string;
  enabled: boolean;
  targetAudience: 'All Active Members' | 'All Members' | 'VIP Members';
  icon: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'expiry' | 'payment_due' | 'new_enquiry' | 'birthday' | 'system' | 'whatsapp';
  read: boolean;
  timestamp: string;
  linkTab?: string;
  targetRole?: string;
}

export interface GymSettings {
  gymName: string;
  shortLogo: string;
  tagline: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  whatsapp: string;
  email: string;
  openingHoursWeekdays: string;
  openingHoursSunday: string;
  upiId: string;
  gstNumber: string;
  receiptPrefix: string;
  metaCloudApiKey: string;
  metaPhoneNumberId: string;
  metaBusinessAccountId: string;
  isMetaApiActive: boolean;
  enable7DayReminders: boolean;
  enable3DayReminders: boolean;
  enable1DayReminders: boolean;
  enablePostExpiryReminders: boolean;
  enableBirthdayGreetings: boolean;
  reminder7DayTemplate: string;
  reminder3DayTemplate: string;
  reminder1DayTemplate: string;
  birthdayTemplate: string;
  enquiryFollowUpHourIST?: number; // Configurable sending hour in Asia/Kolkata (default 9 = 9:00 AM IST)
  enableEnquiryFollowUps?: boolean; // Toggle for automated enquiry follow-up sequence
  enquiryDay7Template?: string;
  enquiryDay15Template?: string;
  enquiryDay30Template?: string;
  enquiryDay45Template?: string;
  enableNewMemberWelcome?: boolean;
  newMemberWelcomeTemplate?: string;
  enableRenewalConfirmation?: boolean;
  renewalConfirmationTemplate?: string;
  receiptTerms?: string;
  receiptCollectorName?: string;
  whatsappConnected?: boolean;
  whatsappConnectedAt?: string | null;
}

// WhatsApp Integration System Types
export type WhatsAppConnectionStatus = 
  | 'disconnected'
  | 'initializing'
  | 'qr_ready'
  | 'waiting_for_scan'
  | 'connecting'
  | 'authenticating'
  | 'connected'
  | 'reconnecting'
  | 'logged_out'
  | 'qr_expired'
  | 'error';

export interface WhatsAppGymDoc {
  status: WhatsAppConnectionStatus;
  phoneNumber: string;
  connectedAt: string | null;
  connectionSessionId: string;
  automationsEnabled: boolean;
  lastStatusUpdate: string;
  sessionStatus?: string;
  deviceInfo?: string;
  errorMessage?: string;
}

export interface WhatsAppSessionDoc {
  id: string;
  gymId: string;
  status: WhatsAppConnectionStatus;
  qrCode?: string;
  qrExpiresAt?: string;
  createdAt: string;
  connectedAt: string | null;
  disconnectedAt: string | null;
  lastActivityAt: string;
  phoneNumber?: string;
  deviceInfo?: string;
}

export interface WhatsAppAutomationsConfig {
  paymentReceipt: boolean;
  expiryReminders: {
    enabled: boolean;
    daysBefore: number[]; // e.g. [7, 3, 1]
  };
  birthdayWishes: boolean;
  festivalGreetings: boolean;
  updatedAt?: string;
}

export type WhatsAppMessageItemStatus = 'queued' | 'sent' | 'delivered' | 'read' | 'failed';

export interface WhatsAppMessageDoc {
  id: string;
  memberId?: string;
  memberName?: string;
  recipient: string;
  messageType: 'payment_receipt' | 'expiry_reminder' | 'birthday_wish' | 'festival_greeting' | 'custom';
  messageText?: string;
  status: WhatsAppMessageItemStatus;
  sessionId?: string;
  sentAt?: string;
  deliveredAt?: string;
  readAt?: string;
  errorMessage?: string;
  createdAt: string;
  receiptNumber?: string;
}

export interface FestivalCalendarDoc {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  monthDay: string; // MM-DD
  enabled: boolean;
  template?: string;
}

// DPDP (India) 2023 Compliance Types

export type ConsentPurpose = 
  | 'membership_administration'
  | 'workout_fitness_guidance'
  | 'whatsapp_transactional_updates'
  | 'promotions_marketing'
  | 'health_injury_consultation';

export interface ConsentPurposesMap {
  membershipAdministration: boolean;
  workoutFitnessGuidance: boolean;
  whatsappTransactionalUpdates: boolean;
  promotionsMarketing: boolean;
  healthInjuryConsultation: boolean;
}

export interface ConsentRecord {
  id: string;
  principalName: string;
  principalContact: string; // phone or email
  principalType: 'member' | 'lead' | 'visitor';
  principalId?: string; // memberId or enquiryId if known
  purposes: ConsentPurposesMap;
  consentVersion: string; // e.g. "1.0-DPDP-2023"
  noticeVersion: string; // e.g. "v2026.1"
  timestamp: string; // ISO 8601
  ipAddress?: string;
  userAgent?: string;
  status: 'active' | 'withdrawn' | 'partially_withdrawn';
  withdrawalTimestamp?: string;
  withdrawalReason?: string;
}

export type DSRType = 
  | 'access_summary'
  | 'correction'
  | 'erasure'
  | 'withdraw_consent'
  | 'nomination';

export type DSRStatus = 'pending' | 'in_progress' | 'fulfilled' | 'rejected';

export interface DataSubjectRequest {
  id: string;
  requestNumber: string; // e.g. DSR-2026-0042
  principalName: string;
  principalContact: string; // phone or email
  principalIdentifier?: string; // Member code or phone
  requestType: DSRType;
  details: string;
  correctionsRequested?: string;
  nomineeName?: string;
  nomineeContact?: string;
  nomineeRelationship?: string;
  status: DSRStatus;
  createdAt: string; // ISO 8601
  acknowledgedAt?: string;
  fulfilledAt?: string;
  resolutionNotes?: string;
  handledBy?: string;
  statutoryDeadline: string; // 30 days from creation
}

export interface CookieConsentPreferences {
  essential: boolean; // Always true
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
  version: string;
}

export interface WhatsAppSessionData {
  status: WhatsAppConnectionStatus;
  phoneNumber?: string;
  connectedAt?: string | null;
  deviceInfo?: string;
  batteryLevel?: number;
  autoReceipts: boolean;
  autoExpiryReminders: boolean;
  autoBirthdayWishes: boolean;
  autoAnnouncements: boolean;
}

export interface WhatsAppMessageLog {
  id: string;
  recipientPhone: string;
  recipientName: string;
  type: 'receipt' | 'expiry_reminder' | 'birthday' | 'announcement' | 'test' | 'custom' | string;
  message: string;
  content?: string;
  status: 'queued' | 'sending' | 'sent' | 'server_ack' | 'delivered' | 'read' | 'played' | 'failed' | 'QUEUED' | 'SENDING' | 'SENT' | 'SERVER_ACK' | 'DELIVERED' | 'READ' | 'PLAYED' | 'FAILED' | string;
  statusDisplay?: string;
  timestamp: string;
  messageId?: string | null;
  sentAt?: string | null;
  serverAckAt?: string | null;
  deliveredAt?: string | null;
  readAt?: string | null;
  failedAt?: string | null;
  errorMessage?: string | null;
  transitions?: WhatsAppMessageTransition[];
  memberId?: string | null;
  receiptNo?: string | null;
  isDuplicate?: boolean;
  idempotencyKey?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

