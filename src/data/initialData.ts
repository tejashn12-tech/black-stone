import {
  Member,
  MembershipPackage,
  PaymentRecord,
  Trainer,
  Enquiry,
  WhatsAppLog,
  FestivalEvent,
  AppNotification,
  GymSettings
} from '../types';
import { PARSED_IMPORTED_MEMBERS } from './importedMembers';
import { PARSED_IMPORTED_PAYMENTS } from './importedPayments';
import { PARSED_IMPORTED_ENQUIRIES } from './importedEnquiries';

export const INITIAL_SETTINGS: GymSettings = {
  gymName: 'Black Stone Fitness',
  shortLogo: 'BSF',
  tagline: 'Build Your Strongest Self',
  address: '52/4 New, New Kantharaj Urs Rd, Near Sharadadevi Nagar, Basaveshwaranagar, Sharadadevi Nagar',
  city: 'Mysuru',
  state: 'Karnataka',
  pincode: '570023',
  phone: '+91 98803 97294',
  whatsapp: '+91 98803 97294',
  email: 'support@blackstonefitness.in',
  openingHoursWeekdays: 'Monday – Saturday: 5:30 AM – 10:30 PM',
  openingHoursSunday: 'Sunday: 6:00 AM – 2:00 PM',
  upiId: '',
  gstNumber: '29AAFCB1234F1Z8',
  receiptPrefix: 'BSF-REC',
  metaCloudApiKey: 'EAAQ2ZC89BSF_META_CLOUD_API_TOKEN_SECURE',
  metaPhoneNumberId: '108923485721902',
  metaBusinessAccountId: '78291045239108',
  isMetaApiActive: true,
  enable7DayReminders: true,
  enable3DayReminders: true,
  enable1DayReminders: true,
  enablePostExpiryReminders: true,
  enableBirthdayGreetings: true,
  reminder7DayTemplate: 'Hello {MEMBER_NAME}, your Black Stone Fitness membership will expire in 7 days on {EXPIRY_DATE}. Renew early to lock in your legacy rate & zero admission fees! 💪 - BSF Mysuru',
  reminder3DayTemplate: 'Hi {MEMBER_NAME}, only 3 days left on your BSF membership ({EXPIRY_DATE}). Don\'t break your workout streak! Visit the front desk or renew via UPI. 🏋️‍♂️ - Black Stone Fitness',
  reminder1DayTemplate: 'FINAL REMINDER: Hi {MEMBER_NAME}, your BSF membership expires tomorrow ({EXPIRY_DATE}). Renew today to keep seamless gym access. ⚡ - Team BSF Mysuru',
  birthdayTemplate: '🎉 Happy Birthday, {MEMBER_NAME}! 🎂 The entire Black Stone Fitness family wishes you a healthy, strong, and powerhouse year ahead. Keep crushing your goals! 💪🔥 — Team BSF Mysuru'
};

export const INITIAL_PACKAGES: MembershipPackage[] = [
  {
    id: 'pkg-1',
    name: '1 Month Power Starter',
    durationMonths: 1,
    price: 1499,
    originalPrice: 1999,
    description: 'Flexible 1-month high-intensity kickstart for new and resuming gym members.',
    features: [
      'Full Gym & Turf Floor Access',
      'Initial Workout Assessment & Body Composition Scan',
      'Free Locker & Shower Access',
      'Standard Mobile Member Portal Access'
    ],
    popular: false,
    active: true,
    badge: 'Starter'
  },
  {
    id: 'pkg-3',
    name: '3 Months Power Builder',
    durationMonths: 3,
    price: 3499,
    originalPrice: 4499,
    description: 'Quarterly progressive overload program designed for consistent muscle gain and fat loss.',
    features: [
      'Full Gym, Turf & Functional Zone Access',
      'Quarterly InBody Body Composition Scan',
      'Custom Workout Routine & Progression Chart',
      'Free Locker & Steam Bath Access',
      '1 Complimentary Guest Pass'
    ],
    popular: true,
    active: true,
    badge: 'Most Popular'
  },
  {
    id: 'pkg-6',
    name: '6 Months Shred & Bulk',
    durationMonths: 6,
    price: 5999,
    originalPrice: 7999,
    description: 'Half-yearly dedicated transformation plan for serious physique and endurance gains.',
    features: [
      'Unlimited All-Floor Access (6:00 AM – 10:30 PM)',
      'Monthly InBody Body Composition Tracking',
      'Free Diet & Macro Counseling Guide',
      'Dedicated Locker Storage & Steam Access',
      '3 Complimentary Guest Workout Passes'
    ],
    popular: false,
    active: true,
    badge: 'High Value'
  },
  {
    id: 'pkg-12',
    name: '12 Months Annual VIP Pro',
    durationMonths: 12,
    price: 9999,
    originalPrice: 14999,
    description: 'All-inclusive 365-day elite athletic membership with locked-in legacy rates.',
    features: [
      '365 Days Unrestricted Floor & Turf Access',
      'Full Fitness & Strength Benchmarking',
      'Free Nutrition Consultation & Custom Diet Plan',
      'Zero Admission Fee on Auto-Renewal',
      '5 Free Guest Passes + BSF Merch Welcome Kit'
    ],
    popular: false,
    active: true,
    badge: 'Best Value'
  }
];

export const INITIAL_TRAINERS: Trainer[] = [];

export const INITIAL_MEMBERS: Member[] = PARSED_IMPORTED_MEMBERS;

export const INITIAL_PAYMENTS: PaymentRecord[] = PARSED_IMPORTED_PAYMENTS;

export const INITIAL_ENQUIRIES: Enquiry[] = PARSED_IMPORTED_ENQUIRIES;

export const INITIAL_FESTIVALS: FestivalEvent[] = [
  {
    id: 'fest-1',
    name: 'Republic Day',
    dateString: '26 January',
    monthDay: '01-26',
    category: 'National Day',
    messageTemplate: '🇮🇳 Happy Republic Day from Black Stone Fitness Mysuru! Let us celebrate strength, discipline, and unity. May we always strive for a fitter, stronger, and healthier India! 💪 Jai Hind!',
    enabled: true,
    targetAudience: 'All Members',
    icon: 'Flag'
  },
  {
    id: 'fest-2',
    name: 'Makar Sankranti / Pongal',
    dateString: '14 January',
    monthDay: '01-14',
    category: 'Festival',
    messageTemplate: '🌾 Happy Makara Sankranti! Wishing you and your family abundance, boundless energy, and glorious harvest of health & strength! 🌞 — Team BSF Mysuru',
    enabled: true,
    targetAudience: 'All Members',
    icon: 'Sun'
  },
  {
    id: 'fest-3',
    name: 'Ugadi (Kannada New Year)',
    dateString: 'March / April',
    monthDay: '03-30',
    category: 'Cultural',
    messageTemplate: '🥭 ಯುಗಾದಿ ಹಬ್ಬದ ಹಾರ್ದಿಕ ಶುಭಾಶಯಗಳು! Wishing you a very Happy Ugadi. May this new year bring supreme vitality, new PRs, and good health to your life! 🌿 — Black Stone Fitness, Mysuru',
    enabled: true,
    targetAudience: 'All Members',
    icon: 'Sparkles'
  },
  {
    id: 'fest-4',
    name: 'Independence Day',
    dateString: '15 August',
    monthDay: '08-15',
    category: 'National Day',
    messageTemplate: '🇮🇳 Happy 80th Independence Day! Celebrate freedom from sedentary habits and elevate your physical resilience. Proud to build a stronger Mysuru! 💪 — Black Stone Fitness',
    enabled: true,
    targetAudience: 'All Members',
    icon: 'Flag'
  },
  {
    id: 'fest-5',
    name: 'Mysuru Dasara / Vijayadashami',
    dateString: 'October',
    monthDay: '10-20',
    category: 'Festival',
    messageTemplate: '🐘 ದಸರಾ ಹಬ್ಬದ ಹಾರ್ದಿಕ ಶುಭಾಶಯಗಳು! Happy Mysuru Dasara! May the divine triumph of strength, perseverance, and good over evil inspire your fitness journey every single day! 👑✨ — BSF Mysuru',
    enabled: true,
    targetAudience: 'All Members',
    icon: 'Crown'
  },
  {
    id: 'fest-6',
    name: 'Kannada Rajyotsava',
    dateString: '01 November',
    monthDay: '11-01',
    category: 'Cultural',
    messageTemplate: '💛❤️ ಕನ್ನಡ ರಾಜ್ಯೋತ್ಸವದ ಹಾರ್ದಿಕ ಶುಭಾಶಯಗಳು! Proudly celebrating Karnataka\'s heritage, pride, and unbreakable athletic spirit! ಸಿರಿಗನ್ನಡಂ ಗೆಲ್ಗೆ! 🦁 — Black Stone Fitness Mysuru',
    enabled: true,
    targetAudience: 'All Members',
    icon: 'Heart'
  },
  {
    id: 'fest-7',
    name: 'Diwali (Deepavali)',
    dateString: 'November',
    monthDay: '11-10',
    category: 'Festival',
    messageTemplate: '🪔 Happy Deepavali! May the divine light illuminate your path with vitality, unstoppable energy, and peak strength. Stay energized, stay lit! 💥 — Black Stone Fitness Family',
    enabled: true,
    targetAudience: 'All Members',
    icon: 'Flame'
  },
  {
    id: 'fest-8',
    name: 'Christmas & New Year',
    dateString: '25 December & 01 January',
    monthDay: '12-25',
    category: 'Special Occasion',
    messageTemplate: '🎄 Merry Christmas & Happy New Year from BSF! Time to reset, level up your resolutions, and crush your biggest fitness breakthroughs in 2027! 🚀💪 — Team Black Stone Fitness',
    enabled: true,
    targetAudience: 'All Members',
    icon: 'Gift'
  }
];

export const INITIAL_WHATSAPP_LOGS: WhatsAppLog[] = [];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [];

export const INITIAL_CONSENT_RECORDS: import('../types').ConsentRecord[] = [];

export const INITIAL_DSR_REQUESTS: import('../types').DataSubjectRequest[] = [];

export const DEFAULT_COOKIE_PREFERENCES: import('../types').CookieConsentPreferences = {
  essential: true,
  analytics: false,
  marketing: false,
  timestamp: new Date().toISOString(),
  version: '1.0'
};
