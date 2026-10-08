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
  birthdayTemplate: '🎉 Happy Birthday, {MEMBER_NAME}! 🎂 The entire Black Stone Fitness family wishes you a healthy, strong, and powerhouse year ahead. Keep crushing your goals! 💪🔥 — Team BSF Mysuru',
  enquiryFollowUpHourIST: 9,
  enableEnquiryFollowUps: true,
  enquiryDay7Template: `Hi {name}, this is Blackstone Fitness (BSF). 👋\n\nYou had recently enquired about our gym membership. We just wanted to check if you're still interested.\n\nIf you'd like to know about our plans, timings or membership options, feel free to reply to this message.\n\n— Blackstone Fitness`,
  enquiryDay15Template: `Hi {name}, just following up from Blackstone Fitness regarding your earlier enquiry. 💪\n\nIf you're still planning to join a gym, we'd be happy to help you choose a suitable membership plan.\n\nFeel free to message us if you'd like more details.\n\n— Blackstone Fitness`,
  enquiryDay30Template: `Hi {name}, this is Blackstone Fitness.\n\nWe're following up regarding your previous gym enquiry. If you're still considering joining, you can contact us anytime and our team will be happy to assist you.\n\nWe'd love to have you train with us. 💪\n\n— Blackstone Fitness`,
  enquiryDay45Template: `Hi {name}, this is Blackstone Fitness.\n\nThis is our final automatic follow-up regarding your previous enquiry.\n\nIf you're still interested in joining BSF or would like information about our membership plans, feel free to contact us anytime.\n\nThank you for considering Blackstone Fitness. 💪\n\n— Blackstone Fitness`,
  enableNewMemberWelcome: true,
  newMemberWelcomeTemplate: `Hi {name}! 👋\n\nWelcome to Blackstone Fitness (BSF)! 💪\n\nYour membership has been successfully registered with us.\n\nWe’re excited to have you as part of the BSF family.\n\nIf you have any questions regarding your membership, timings, or training, feel free to contact us.\n\nSee you at the gym! 🏋️\n\n— Blackstone Fitness`,
  enableRenewalConfirmation: true,
  renewalConfirmationTemplate: `Hi {name}! 👋\n\nYour membership at Blackstone Fitness (BSF) has been successfully renewed. 💪\n\nMembership Plan: {plan}\nRenewal Date: {renewalDate}\nNew Expiry Date: {expiryDate}\n\nThank you for continuing your journey with Blackstone Fitness.\n\nKeep training. Keep progressing. 💪🔥\n\n— Blackstone Fitness`
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
  // 1. January
  {
    id: 'fest-new-year',
    name: "New Year's Day (ಹೊಸ ವರ್ಷ)",
    dateString: '01 January',
    monthDay: '01-01',
    category: 'Special Occasion',
    messageTemplate: '✨ Happy New Year, {MEMBER_NAME}! Welcome to 365 days of new strength, higher PRs, and relentless progress. Make this your fittest year ever! 🚀💪 — {GYM_NAME} Family',
    enabled: true,
    targetAudience: 'All Members',
    icon: 'Sparkles'
  },
  {
    id: 'fest-guru-gobind-singh',
    name: 'Guru Gobind Singh Jayanti (ಗುರು ಗೋಬಿಂದ್ ಸಿಂಗ್ ಜಯಂತಿ)',
    dateString: '05 January',
    monthDay: '01-05',
    category: 'Cultural',
    messageTemplate: '☬ Happy Guru Gobind Singh Jayanti, {MEMBER_NAME}! Inspired by courage, valor, and righteous strength. Stay fearless and stay disciplined! ⚔️ — {GYM_NAME}',
    enabled: true,
    targetAudience: 'All Members',
    icon: 'Shield'
  },
  {
    id: 'fest-lohri',
    name: 'Lohri (ಲೋಹ್ರಿ - Punjab Harvest)',
    dateString: '13 January',
    monthDay: '01-13',
    category: 'Festival',
    messageTemplate: '🔥 Happy Lohri, {MEMBER_NAME}! May the sacred bonfire burn away all fatigue and weakness, igniting passion, vitality, and joyful strength! 🌾 — Team {GYM_NAME}',
    enabled: true,
    targetAudience: 'All Members',
    icon: 'Flame'
  },
  {
    id: 'fest-makar-sankranti',
    name: 'Makar Sankranti & Pongal & Uttarayan (ಮಕರ ಸಂಕ್ರಾಂತಿ / ಪೊಂಗಲ್)',
    dateString: '14 January',
    monthDay: '01-14',
    category: 'Festival',
    messageTemplate: '🌾 ಎಳ್ಳು-ಬೆಲ್ಲ ತಿಂದು ಒಳ್ಳೆಯ ಮಾತಾಡಿ! Happy Makara Sankranti & Pongal, {MEMBER_NAME}! May the sun shower you with boundless energy, abundant harvest, and peak vitality! 🌞 — {GYM_NAME}',
    enabled: true,
    targetAudience: 'All Members',
    icon: 'Sun'
  },
  {
    id: 'fest-netaji-jayanti',
    name: 'Netaji Subhas Chandra Bose Jayanti / Parakram Diwas (ಪರಾಕ್ರಮ ದಿವಸ)',
    dateString: '23 January',
    monthDay: '01-23',
    category: 'National Day',
    messageTemplate: '🇮🇳 Saluting Netaji Subhas Chandra Bose on Parakram Diwas! "Give me blood, and I shall give you freedom." May unyielding courage and warrior spirit fuel your workouts! 🎖️ — {GYM_NAME}',
    enabled: true,
    targetAudience: 'All Members',
    icon: 'Award'
  },
  {
    id: 'fest-republic-day',
    name: 'Republic Day (ಗಣರಾಜ್ಯೋತ್ಸವ)',
    dateString: '26 January',
    monthDay: '01-26',
    category: 'National Day',
    messageTemplate: '🇮🇳 Happy Republic Day, {MEMBER_NAME}! Let us celebrate unity, discipline, and physical strength. Together, let us forge a fitter, healthier, and unstoppable India! 💪 Jai Hind! — Team {GYM_NAME}',
    enabled: true,
    targetAudience: 'All Members',
    icon: 'Flag'
  },

  // 2. February
  {
    id: 'fest-vasant-panchami',
    name: 'Vasant Panchami & Saraswati Puja (ವಸಂತ ಪಂಚಮಿ)',
    dateString: '02 February',
    monthDay: '02-02',
    category: 'Festival',
    messageTemplate: '🌼 Happy Vasant Panchami & Saraswati Puja, {MEMBER_NAME}! May Goddess Saraswati bless you with wisdom, focus, and radiant health as spring arrives! 🪷 — {GYM_NAME}',
    enabled: true,
    targetAudience: 'All Members',
    icon: 'Sparkles'
  },
  {
    id: 'fest-maha-shivratri',
    name: 'Maha Shivratri (ಮಹಾ ಶಿವರಾತ್ರಿ)',
    dateString: '17 February',
    monthDay: '02-17',
    category: 'Festival',
    messageTemplate: '🔱 ಓಂ ನಮಃ ಶಿವಾಯ! Happy Maha Shivratri, {MEMBER_NAME}! May Lord Shiva bestow you with boundless inner power, endurance, and meditative discipline! 🕉️ — Team {GYM_NAME}',
    enabled: true,
    targetAudience: 'All Members',
    icon: 'Flame'
  },
  {
    id: 'fest-shivaji-jayanti',
    name: 'Chhatrapati Shivaji Maharaj Jayanti (ಛತ್ರಪತಿ ಶಿವಾಜಿ ಜಯಂತಿ)',
    dateString: '19 February',
    monthDay: '02-19',
    category: 'National Day',
    messageTemplate: '🚩 Saluting the bravery and strategic mastery of Chhatrapati Shivaji Maharaj on his Jayanti! Channel the Maratha lion spirit into every lift and rep! 🦁 — {GYM_NAME}',
    enabled: true,
    targetAudience: 'All Members',
    icon: 'Shield'
  },

  // 3. March
  {
    id: 'fest-holi',
    name: 'Holi / Dhulandi (ಹೋಳಿ ಹಬ್ಬ - Festival of Colours)',
    dateString: '14 March',
    monthDay: '03-14',
    category: 'Festival',
    messageTemplate: '🎨 Happy Holi, {MEMBER_NAME}! Wishing you a vibrant festival of colors, boundless joy, and peak fitness vitality! Stay hydrated and stay colorful! 🌈 — {GYM_NAME}',
    enabled: true,
    targetAudience: 'All Members',
    icon: 'Sparkles'
  },
  {
    id: 'fest-ugadi',
    name: 'Ugadi & Gudi Padwa (ಯುಗಾದಿ / ಗುಡಿ ಪಾಡ್ವ)',
    dateString: '30 March',
    monthDay: '03-30',
    category: 'Cultural',
    messageTemplate: '🥭 ಬೇವು-ಬೆಲ್ಲದ ಸಮಾಗಮದಂತೆ ಸುಖ-ದುಃಖಗಳನ್ನು ಸಮಾನವಾಗಿ ಸ್ವೀಕರಿಸೋಣ. ಯುಗಾದಿ ಹಬ್ಬದ ಹಾರ್ದಿಕ ಶುಭಾಶಯಗಳು, {MEMBER_NAME}! Happy Ugadi & Gudi Padwa! May this new year bring glorious fitness transformations! 🌿 — {GYM_NAME}',
    enabled: true,
    targetAudience: 'All Members',
    icon: 'Sparkles'
  },
  {
    id: 'fest-eid-ul-fitr',
    name: 'Eid ul-Fitr / Ramzan Eid (ಈದ್ ಉಲ್-ಫಿತರ್)',
    dateString: '31 March',
    monthDay: '03-31',
    category: 'Festival',
    messageTemplate: '🌙 Eid Mubarak, {MEMBER_NAME}! May this joyous day bring peace, prosperity, good health, and abundant blessings to you and your family! ✨ — {GYM_NAME} Family',
    enabled: true,
    targetAudience: 'All Members',
    icon: 'Moon'
  },

  // 4. April
  {
    id: 'fest-ram-navami',
    name: 'Sri Rama Navami (ಶ್ರೀ ರಾಮ ನವಮಿ)',
    dateString: '06 April',
    monthDay: '04-06',
    category: 'Festival',
    messageTemplate: '🏹 ಶ್ರೀ ರಾಮ ನವಮಿಯ ಶುಭಾಶಯಗಳು! Happy Sri Rama Navami, {MEMBER_NAME}! May Lord Rama inspire your path with righteous character, unwavering discipline, and strength! 🌟 — Team {GYM_NAME}',
    enabled: true,
    targetAudience: 'All Members',
    icon: 'Sun'
  },
  {
    id: 'fest-mahavir-jayanti',
    name: 'Mahavir Jayanti (ಮಹಾವೀರ ಜಯಂತಿ)',
    dateString: '10 April',
    monthDay: '04-10',
    category: 'Festival',
    messageTemplate: '🕊️ Happy Mahavir Jayanti, {MEMBER_NAME}! "Live and let live." Embracing non-violence, mental tranquility, and holistic wellness today and always. 🌿 — {GYM_NAME}',
    enabled: true,
    targetAudience: 'All Members',
    icon: 'Heart'
  },
  {
    id: 'fest-ambedkar-jayanti',
    name: 'Dr. B. R. Ambedkar Jayanti (ಡಾ. ಅಂಬೇಡ್ಕರ್ ಜಯಂತಿ)',
    dateString: '14 April',
    monthDay: '04-14',
    category: 'National Day',
    messageTemplate: '🇮🇳 Saluting Dr. B.R. Ambedkar on his Jayanti! "Educate, Agitate, Organise." Let us build equality, mental resilience, and physical strength! 📜 — {GYM_NAME}',
    enabled: true,
    targetAudience: 'All Members',
    icon: 'Award'
  },
  {
    id: 'fest-baisakhi-vishu',
    name: 'Baisakhi & Vishu & Puthandu & Pohela Boishakh (ಬೈಸಾಖಿ / ವಿಷು)',
    dateString: '14 April',
    monthDay: '04-14',
    category: 'Cultural',
    messageTemplate: '🌾 Happy Baisakhi, Vishu, Puthandu & Pohela Boishakh, {MEMBER_NAME}! Celebrating the glorious harvest and new solar beginnings across India! Power up your workouts! 🌞 — {GYM_NAME}',
    enabled: true,
    targetAudience: 'All Members',
    icon: 'Sun'
  },
  {
    id: 'fest-good-friday-easter',
    name: 'Good Friday & Easter Sunday (ಗುಡ್ ಫ್ರೈಡೇ ಮತ್ತು ಈಸ್ಟರ್)',
    dateString: '18 April',
    monthDay: '04-18',
    category: 'Festival',
    messageTemplate: '✝️ Warm Easter & Good Friday blessings to you, {MEMBER_NAME}! May the spirit of renewal, hope, and revitalization inspire your body, mind, and soul! 🕊️ — {GYM_NAME}',
    enabled: true,
    targetAudience: 'All Members',
    icon: 'Heart'
  },
  {
    id: 'fest-basava-jayanti',
    name: 'Basava Jayanti (ಬಸವ ಜಯಂತಿ - ಕಾಯಕವೇ ಕೈಲಾಸ)',
    dateString: '29 April',
    monthDay: '04-29',
    category: 'Cultural',
    messageTemplate: '✨ "ಕಾಯಕವೇ ಕೈಲಾಸ" - ಕಾಯಕಯೋಗಿ ಜಗಜ್ಯೋತಿ ಬಸವೇಶ್ವರ ಜಯಂತಿಯ ಹಾರ್ದಿಕ ಶುಭಾಶಯಗಳು, {MEMBER_NAME}! Dedicated work and disciplined workouts are pure worship! 🌿 — {GYM_NAME}',
    enabled: true,
    targetAudience: 'All Members',
    icon: 'Sparkles'
  },

  // 5. May
  {
    id: 'fest-buddha-purnima',
    name: 'Buddha Purnima / Vesak (ಬುದ್ಧ ಪೂರ್ಣಿಮೆ)',
    dateString: '12 May',
    monthDay: '05-12',
    category: 'Festival',
    messageTemplate: '🪷 Happy Buddha Purnima, {MEMBER_NAME}! May Lord Buddha\'s teachings of mindfulness, harmony, and balance guide your health and workout mindset! 🧘 — {GYM_NAME}',
    enabled: true,
    targetAudience: 'All Members',
    icon: 'Heart'
  },

  // 6. June
  {
    id: 'fest-eid-al-adha',
    name: 'Eid al-Adha / Bakrid (ಈದ್ ಅಲ್-ಅದಾ / ಬಕ್ರೀದ್)',
    dateString: '07 June',
    monthDay: '06-07',
    category: 'Festival',
    messageTemplate: '🌙 Eid al-Adha Mubarak, {MEMBER_NAME}! Wishing you peace, steadfast commitment, and glorious health with loved ones! 🌟 — Team {GYM_NAME}',
    enabled: true,
    targetAudience: 'All Members',
    icon: 'Moon'
  },
  {
    id: 'fest-yoga-day',
    name: 'International Day of Yoga (ಅಂತರರಾಷ್ಟ್ರೀಯ ಯೋಗ ದಿನ)',
    dateString: '21 June',
    monthDay: '06-21',
    category: 'Special Occasion',
    messageTemplate: '🧘‍♂️ Happy International Yoga Day, {MEMBER_NAME}! Yoga unites breath, flexibility, core strength, and mental tranquility. Stretch, breathe, and conquer today! 🕉️ — {GYM_NAME}',
    enabled: true,
    targetAudience: 'All Members',
    icon: 'Sun'
  },
  {
    id: 'fest-rath-yatra',
    name: 'Jagannath Puri Rath Yatra (ಜಗನ್ನಾಥ ರಥಯಾತ್ರೆ)',
    dateString: '26 June',
    monthDay: '06-26',
    category: 'Festival',
    messageTemplate: '🚩 Jai Jagannath! Wishing you a blessed Rath Yatra, {MEMBER_NAME}! May the chariot of progress lead you to supreme strength and happiness! 🛞 — {GYM_NAME}',
    enabled: true,
    targetAudience: 'All Members',
    icon: 'Sun'
  },

  // 7. July
  {
    id: 'fest-muharram',
    name: 'Muharram / Islamic New Year (ಮೊಹರಂ)',
    dateString: '06 July',
    monthDay: '07-06',
    category: 'Festival',
    messageTemplate: '🌙 Wishing you a peaceful and reflective Muharram, {MEMBER_NAME}. May the new year bring resilience, good health, and purpose! 🕊️ — {GYM_NAME}',
    enabled: true,
    targetAudience: 'All Members',
    icon: 'Moon'
  },
  {
    id: 'fest-guru-purnima',
    name: 'Guru Purnima (ಗುರು ಪೂರ್ಣಿಮೆ)',
    dateString: '10 July',
    monthDay: '07-10',
    category: 'Cultural',
    messageTemplate: '🙏 Happy Guru Purnima, {MEMBER_NAME}! Honoring our fitness mentors, coaches, and trainers who sculpt our bodies and empower our spirits! 🌟 — Team {GYM_NAME}',
    enabled: true,
    targetAudience: 'All Members',
    icon: 'Award'
  },
  {
    id: 'fest-kargil-vijay-diwas',
    name: 'Kargil Vijay Diwas (ಕಾರ್ಗಿಲ್ ವಿಜಯ್ ದಿವಸ್)',
    dateString: '26 July',
    monthDay: '07-26',
    category: 'National Day',
    messageTemplate: '🇮🇳 Saluting the unyielding courage and supreme sacrifice of our Indian Armed Forces heroes on Kargil Vijay Diwas! Jai Hind! 🎖️ — {GYM_NAME}',
    enabled: true,
    targetAudience: 'All Members',
    icon: 'Flag'
  },

  // 8. August
  {
    id: 'fest-varamahalakshmi',
    name: 'Varamahalakshmi Vrata (ವರಮಹಾಲಕ್ಷ್ಮಿ ವ್ರತ)',
    dateString: '08 August',
    monthDay: '08-08',
    category: 'Cultural',
    messageTemplate: '🌸 ವರಮಹಾಲಕ್ಷ್ಮಿ ಹಬ್ಬದ ಹಾರ್ದಿಕ ಶುಭಾಶಯಗಳು, {MEMBER_NAME}! May Goddess Mahalakshmi bless your home with health, abundance, and boundless prosperity! 🪷 — {GYM_NAME}',
    enabled: true,
    targetAudience: 'All Members',
    icon: 'Heart'
  },
  {
    id: 'fest-independence-day',
    name: 'Independence Day (ಸ್ವಾತಂತ್ರ್ಯ ದಿನಾಚರಣೆ)',
    dateString: '15 August',
    monthDay: '08-15',
    category: 'National Day',
    messageTemplate: '🇮🇳 Happy Independence Day, {MEMBER_NAME}! Break free from limitations, elevate your stamina, and proudly build a fitter, stronger Bharat! 💪 Jai Hind! — Team {GYM_NAME}',
    enabled: true,
    targetAudience: 'All Members',
    icon: 'Flag'
  },
  {
    id: 'fest-raksha-bandhan',
    name: 'Raksha Bandhan (ರಕ್ಷಾ ಬಂಧನ)',
    dateString: '19 August',
    monthDay: '08-19',
    category: 'Festival',
    messageTemplate: '🧵 Happy Raksha Bandhan, {MEMBER_NAME}! Celebrating the sacred bond of protection, trust, and family strength. Keep your loved ones protected and healthy! 🤝 — {GYM_NAME}',
    enabled: true,
    targetAudience: 'All Members',
    icon: 'Heart'
  },
  {
    id: 'fest-krishna-janmashtami',
    name: 'Krishna Janmashtami / Gokulashtami (ಶ್ರೀ ಕೃಷ್ಣ ಜನ್ಮಾಷ್ಟಮಿ)',
    dateString: '26 August',
    monthDay: '08-26',
    category: 'Festival',
    messageTemplate: '🦚 ಶ್ರೀ ಕೃಷ್ಣ ಜನ್ಮಾಷ್ಟಮಿಯ ಶುಭಾಶಯಗಳು, {MEMBER_NAME}! Happy Janmashtami! May Lord Krishna bless your life with divine happiness, playful energy, and victory! 🪈 — {GYM_NAME}',
    enabled: true,
    targetAudience: 'All Members',
    icon: 'Sparkles'
  },
  {
    id: 'fest-national-sports-day',
    name: 'National Sports Day (ರಾಷ್ಟ್ರೀಯ ಕ್ರೀಡಾ ದಿನ - Major Dhyan Chand)',
    dateString: '29 August',
    monthDay: '08-29',
    category: 'Special Occasion',
    messageTemplate: '🏆 Happy National Sports Day, {MEMBER_NAME}! Honoring hockey legend Major Dhyan Chand. Fitness is not a hobby—it is our daily discipline and duty! 🥇 — {GYM_NAME}',
    enabled: true,
    targetAudience: 'All Members',
    icon: 'Trophy'
  },

  // 9. September
  {
    id: 'fest-ganesh-chaturthi',
    name: 'Ganesh Chaturthi / Vinayaka Chavithi (ಗಣೇಶ ಚತುರ್ಥಿ)',
    dateString: '14 September',
    monthDay: '09-14',
    category: 'Festival',
    messageTemplate: '🐘 ಗಣೇಶ ಚತುರ್ಥಿಯ ಹಾರ್ದಿಕ ಶುಭಾಶಯಗಳು, {MEMBER_NAME}! Happy Ganesh Chaturthi! May Lord Vighnaharta crush all obstacles on your path to fitness greatness! 🌺 — {GYM_NAME}',
    enabled: true,
    targetAudience: 'All Members',
    icon: 'Crown'
  },
  {
    id: 'fest-onam',
    name: 'Onam / Thiruonam (ಓಣಂ - Kerala Harvest)',
    dateString: '27 August',
    monthDay: '08-27',
    category: 'Cultural',
    messageTemplate: '🌼 Happy Onam, {MEMBER_NAME}! May the spirit of King Mahabali fill your life with joy, athletic prosperity, and colorful pookkalam moments! 🌾 — Team {GYM_NAME}',
    enabled: true,
    targetAudience: 'All Members',
    icon: 'Sparkles'
  },
  {
    id: 'fest-milad-un-nabi',
    name: 'Milad un-Nabi / Mawlid (ಮಿಲಾದ್ ಉನ್-ನಬಿ)',
    dateString: '16 September',
    monthDay: '09-16',
    category: 'Festival',
    messageTemplate: '🌙 Eid-e-Milad un-Nabi Mubarak, {MEMBER_NAME}! Wishing you deep peace, kindness, good health, and prosperity with your loved ones! ✨ — {GYM_NAME}',
    enabled: true,
    targetAudience: 'All Members',
    icon: 'Moon'
  },

  // 10. October
  {
    id: 'fest-gandhi-jayanti',
    name: 'Mahatma Gandhi & Lal Bahadur Shastri Jayanti (ಗಾಂಧಿ ಜಯಂತಿ)',
    dateString: '02 October',
    monthDay: '10-02',
    category: 'National Day',
    messageTemplate: '🇮🇳 "Strength does not come from physical capacity. It comes from an indomitable will." — Mahatma Gandhi. Happy Gandhi & Shastri Jayanti, {MEMBER_NAME}! 👓 — {GYM_NAME}',
    enabled: true,
    targetAudience: 'All Members',
    icon: 'Flag'
  },
  {
    id: 'fest-navratri-durga-puja',
    name: 'Navratri & Durga Puja (ನವರಾತ್ರಿ / ದುರ್ಗಾ ಪೂಜೆ)',
    dateString: '03 October',
    monthDay: '10-03',
    category: 'Festival',
    messageTemplate: '🔱 ಶುಭ ನವರಾತ್ರಿ! Happy Navratri & Durga Puja, {MEMBER_NAME}! May Maa Durga bless you with unmatched strength, stamina, and nine days of divine energy! 🌺 — {GYM_NAME}',
    enabled: true,
    targetAudience: 'All Members',
    icon: 'Flame'
  },
  {
    id: 'fest-ayudha-puja',
    name: 'Ayudha Puja (ಆಯುಧ ಪೂಜೆ - Iron, Weights & Machinery)',
    dateString: '11 October',
    monthDay: '10-11',
    category: 'Festival',
    messageTemplate: '🛠️ ಆಯುಧ ಪೂಜೆಯ ಹಾರ್ದಿಕ ಶುಭಾಶಯಗಳು, {MEMBER_NAME}! Honoring our barbells, dumbbells, and gym iron that shape our willpower! Worship your craft and stay strong! 💪🔥 — {GYM_NAME}',
    enabled: true,
    targetAudience: 'All Members',
    icon: 'Trophy'
  },
  {
    id: 'fest-mysuru-dasara',
    name: 'Vijayadashami & Mysuru Dasara (ಮೈಸೂರು ದಸರಾ ಜಂಬೂ ಸವಾರಿ)',
    dateString: '12 October',
    monthDay: '10-12',
    category: 'Cultural',
    messageTemplate: '🐘 ಮೈಸೂರು ದಸರಾ ಮತ್ತು ವಿಜಯದಶಮಿ ಹಬ್ಬದ ಹಾರ್ದಿಕ ಶುಭಾಶಯಗಳು! Happy Mysuru Dasara, {MEMBER_NAME}! May truth, royalty, and courage triumph over every obstacle! 👑✨ — {GYM_NAME} Mysuru',
    enabled: true,
    targetAudience: 'All Members',
    icon: 'Crown'
  },
  {
    id: 'fest-valmiki-jayanti',
    name: 'Maharishi Valmiki Jayanti (ವಾಲ್ಮೀಕಿ ಜಯಂತಿ)',
    dateString: '17 October',
    monthDay: '10-17',
    category: 'Cultural',
    messageTemplate: '📜 ಮಹರ್ಷಿ ವಾಲ್ಮೀಕಿ ಜಯಂತಿಯ ಹಾರ್ದಿಕ ಶುಭಾಶಯಗಳು, {MEMBER_NAME}! Remembering the great sage and Adi Kavi of Ramayana. Transform yourself with discipline! 🪶 — {GYM_NAME}',
    enabled: true,
    targetAudience: 'All Members',
    icon: 'Sparkles'
  },
  {
    id: 'fest-karwa-chauth',
    name: 'Karwa Chauth (ಕರ್ವಾ ಚೌತ್)',
    dateString: '20 October',
    monthDay: '10-20',
    category: 'Cultural',
    messageTemplate: '🌕 Happy Karwa Chauth, {MEMBER_NAME}! Celebrating dedication, devotion, and family wellness. May your life be filled with enduring love and health! ✨ — {GYM_NAME}',
    enabled: true,
    targetAudience: 'All Members',
    icon: 'Moon'
  },

  // 11. November
  {
    id: 'fest-kannada-rajyotsava',
    name: 'Kannada Rajyotsava (ಕನ್ನಡ ರಾಜ್ಯೋತ್ಸವ - Karnataka Formation Day)',
    dateString: '01 November',
    monthDay: '11-01',
    category: 'Cultural',
    messageTemplate: '💛❤️ 69ನೇ ಕನ್ನಡ ರಾಜ್ಯೋತ್ಸವದ ಹಾರ್ದಿಕ ಶುಭಾಶಯಗಳು, {MEMBER_NAME}! ಸಿರಿಗನ್ನಡಂ ಗೆಲ್ಗೆ, ಸಿರಿಗನ್ನಡಂ ಬಾಳ್ಗೆ! Celebrating Karnataka\'s royal heritage, pride, and athletic power! 🦁 — {GYM_NAME} Mysuru',
    enabled: true,
    targetAudience: 'All Members',
    icon: 'Heart'
  },
  {
    id: 'fest-diwali',
    name: 'Diwali / Deepavali & Lakshmi Puja (ದೀಪಾವಳಿ ಹಬ್ಬ)',
    dateString: '01 November',
    monthDay: '11-01',
    category: 'Festival',
    messageTemplate: '🪔 ದೀಪಾವಳಿ ಹಬ್ಬದ ಹಾರ್ದಿಕ ಶುಭಾಶಯಗಳು! Happy Deepavali, {MEMBER_NAME}! May the divine light illuminate your path with boundless energy, vitality, and strength! 💥 — {GYM_NAME} Family',
    enabled: true,
    targetAudience: 'All Members',
    icon: 'Flame'
  },
  {
    id: 'fest-govardhan-balipadyami',
    name: 'Govardhan Puja & Balipadyami (ಗೋವರ್ಧನ ಪೂಜೆ / ಬಲಿಪಾಡ್ಯಮಿ)',
    dateString: '02 November',
    monthDay: '11-02',
    category: 'Festival',
    messageTemplate: '🌾 ಬಲಿಪಾಡ್ಯಮಿ ಹಾಗೂ ಗೋವರ್ಧನ ಪೂಜೆಯ ಶುಭಾಶಯಗಳು, {MEMBER_NAME}! May nature\'s grace nourish you with enduring strength, health, and peace! 🐮 — {GYM_NAME}',
    enabled: true,
    targetAudience: 'All Members',
    icon: 'Sun'
  },
  {
    id: 'fest-bhai-dooj',
    name: 'Bhai Dooj / Yama Dwitiya (ಭಾಯಿ ದೂಜ್)',
    dateString: '03 November',
    monthDay: '11-03',
    category: 'Festival',
    messageTemplate: '🌸 Happy Bhai Dooj, {MEMBER_NAME}! Celebrating the protective bond and lifelong friendship of siblings. Wishing your entire family supreme wellness! 🤝 — {GYM_NAME}',
    enabled: true,
    targetAudience: 'All Members',
    icon: 'Heart'
  },
  {
    id: 'fest-chhath-puja',
    name: 'Chhath Puja / Surya Shasthi (ಛತ್ ಪೂಜೆ - Sun God Worship)',
    dateString: '07 November',
    monthDay: '11-07',
    category: 'Festival',
    messageTemplate: '🌅 Happy Chhath Puja, {MEMBER_NAME}! Saluting Lord Surya and Chhathi Maiya for the blessing of life, solar energy, and endurance! 🌞 — Team {GYM_NAME}',
    enabled: true,
    targetAudience: 'All Members',
    icon: 'Sun'
  },
  {
    id: 'fest-guru-nanak-jayanti',
    name: 'Guru Nanak Jayanti / Gurpurab (ಗುರು ನಾನಕ್ ಜಯಂತಿ)',
    dateString: '15 November',
    monthDay: '11-15',
    category: 'Festival',
    messageTemplate: '☬ Happy Guru Nanak Jayanti, {MEMBER_NAME}! "Kirat Karo, Naam Japo, Vand Chhako." May truth, selfless service, and inner strength uplift you! ✨ — {GYM_NAME}',
    enabled: true,
    targetAudience: 'All Members',
    icon: 'Shield'
  },
  {
    id: 'fest-kanakadasa-jayanti',
    name: 'Kanakadasa Jayanti (ಭಕ್ತ ಕನಕದಾಸ ಜಯಂತಿ)',
    dateString: '18 November',
    monthDay: '11-18',
    category: 'Cultural',
    messageTemplate: '🪕 "ಕುಲ ಕುಲವೆಂದು ಹೊಡೆದಾಡದಿರಿ" - ಸಂತ ಶ್ರೇಷ್ಠ ಭಕ್ತ ಕನಕದಾಸ ಜಯಂತಿಯ ಹಾರ್ದಿಕ ಶುಭಾಶಯಗಳು, {MEMBER_NAME}! Dedicated mind, pure heart, and unbreakable body! 🌟 — {GYM_NAME}',
    enabled: true,
    targetAudience: 'All Members',
    icon: 'Sparkles'
  },

  // 12. December
  {
    id: 'fest-christmas',
    name: 'Christmas (ಕ್ರಿಸ್ಮಸ್ ಹಬ್ಬ)',
    dateString: '25 December',
    monthDay: '12-25',
    category: 'Festival',
    messageTemplate: '🎄 Merry Christmas, {MEMBER_NAME}! Wishing you warmth, peace, joy, and healthy fitness breakthroughs with your family and loved ones! 🎁⭐ — {GYM_NAME} Family',
    enabled: true,
    targetAudience: 'All Members',
    icon: 'Gift'
  },
  {
    id: 'fest-new-years-eve',
    name: "New Year's Eve (ಹೊಸ ವರ್ಷದ ಮುನ್ನಾದಿನ)",
    dateString: '31 December',
    monthDay: '12-31',
    category: 'Special Occasion',
    messageTemplate: "🎉 Happy New Year's Eve, {MEMBER_NAME}! Celebrate your fitness victories of the past year and gear up to crush new milestones in the year ahead! 🚀💪 — {GYM_NAME}",
    enabled: true,
    targetAudience: 'All Members',
    icon: 'Trophy'
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
