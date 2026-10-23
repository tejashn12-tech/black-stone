import { WhatsAppService } from '../WhatsAppService';
import { getAdminDb, isQuotaExhaustedError } from '../../config/firebase';
import { IdempotencyManager } from '../idempotency/IdempotencyManager';
import { GymSettings, Member, FestivalEvent } from '../../types';
import { INITIAL_SETTINGS, INITIAL_MEMBERS, INITIAL_FESTIVALS } from '../../data/initialData';
import { logger } from '../../utils/logger';

export interface RenewalCandidate {
  type?: 'renewal' | 'birthday' | 'festival';
  memberId: string;
  membershipId: string;
  memberName: string;
  phone: string;
  expiryDate?: string;
  daysLeft?: number;
  dob?: string;
  festivalId?: string;
  festivalName?: string;
  idempotencyKey: string;
  messageText: string;
  status: 'active' | 'expiring_soon' | 'expired';
  deliveryState?: 'SUCCESS' | 'PENDING' | 'IN_FLIGHT' | 'UNPROCESSED';
  deliveredAt?: string | null;
}

export interface RenewalRunSummary {
  runId: string;
  timestamp: string;
  timezone: string;
  currentKolkataDate: string;
  whatsappConnected: boolean;
  totalMembersChecked: number;
  activeMembersCount: number;
  totalCandidates: number;
  sentCount: number;
  duplicatePreventedCount: number;
  inFlightCount: number;
  failedCount: number;
  disconnectedSkippedCount: number;
  birthdaysCount?: number;
  birthdaysSentCount?: number;
  festivalsCount?: number;
  festivalsSentCount?: number;
  details: Array<{
    idempotencyKey: string;
    memberId: string;
    memberName: string;
    phone: string;
    daysLeft?: number;
    type?: 'renewal' | 'birthday' | 'festival';
    festivalId?: string;
    festivalName?: string;
    action: 'sent' | 'duplicate_prevented' | 'in_flight' | 'failed' | 'disconnected_queued' | 'skipped_criteria';
    reason?: string;
  }>;
}

export class RenewalAutomationService {
  private static instance: RenewalAutomationService | null = null;
  private whatsappService: WhatsAppService;
  private idempotencyManager: IdempotencyManager;
  private timer: NodeJS.Timeout | null = null;
  private isRunning = false;
  private lastRunSummary: RenewalRunSummary | null = null;
  private lastRunDateKolkata: string | null = null;
  private runHistory: RenewalRunSummary[] = [];

  // Configuration
  private readonly TIMEZONE = 'Asia/Kolkata';
  private readonly SCHEDULED_HOUR_IST = 9; // 9:00 AM IST
  private readonly CHECK_INTERVAL_MS = 15 * 60 * 1000; // Check every 15 minutes

  private constructor() {
    this.whatsappService = WhatsAppService.getInstance();
    this.idempotencyManager = IdempotencyManager.getInstance();

    // Hook into WhatsApp status changes: when WhatsApp becomes available/connected,
    // safely trigger a retry for today's reminders that haven't succeeded yet.
    let reconnectDebounceTimer: NodeJS.Timeout | null = null;
    let lastHandledState: string | null = null;

    this.whatsappService.onStatusChange((statusInfo) => {
      if (statusInfo.state === 'CONNECTED') {
        if (lastHandledState === 'CONNECTED') {
          return;
        }
        lastHandledState = 'CONNECTED';

        const kolkataDate = this.getTodayInKolkata().dateString;
        if (this.lastRunDateKolkata === kolkataDate) {
          // Today's scheduled batch has already completed
          return;
        }

        logger.info('[RenewalAutomation] WhatsApp connected event detected. Evaluating retry for pending renewal reminders...');
        if (reconnectDebounceTimer) {
          clearTimeout(reconnectDebounceTimer);
        }
        reconnectDebounceTimer = setTimeout(() => {
          const currentKolkataDate = this.getTodayInKolkata().dateString;
          if (this.lastRunDateKolkata === currentKolkataDate) {
            reconnectDebounceTimer = null;
            return;
          }
          this.runRenewalCheck({ source: 'whatsapp_reconnect', allowRetryDisconnected: true }).catch((err) => {
            logger.warn({ reason: err?.message }, '[RenewalAutomation] Reconnect renewal check notice');
          });
          reconnectDebounceTimer = null;
        }, 5000);
      } else {
        lastHandledState = statusInfo.state;
      }
    });
  }

  public static getInstance(): RenewalAutomationService {
    if (!RenewalAutomationService.instance) {
      RenewalAutomationService.instance = new RenewalAutomationService();
    }
    return RenewalAutomationService.instance;
  }

  /**
   * Starts the server-side background scheduling engine.
   * Runs independently of browser sessions or website activity.
   */
  public startScheduler(): void {
    if (this.timer) {
      return;
    }

    logger.info(
      { timezone: this.TIMEZONE, scheduledHourIST: this.SCHEDULED_HOUR_IST },
      '[RenewalAutomation] Starting server-side scheduled renewal engine'
    );

    // Initial check on server boot (after a short delay to allow Firebase & WhatsApp init)
    setTimeout(() => {
      this.evaluateScheduledRun('startup_check').catch((err) => {
        logger.warn({ reason: err?.message }, '[RenewalAutomation] Initial startup run notice');
      });
    }, 5000);

    // Periodic timer to evaluate schedule every 15 minutes
    this.timer = setInterval(() => {
      this.evaluateScheduledRun('interval_timer').catch((err) => {
        logger.warn({ reason: err?.message }, '[RenewalAutomation] Scheduled interval run notice');
      });
    }, this.CHECK_INTERVAL_MS);
  }

  public stopScheduler(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      logger.info('[RenewalAutomation] Server-side renewal engine stopped');
    }
  }

  /**
   * Returns current calendar date in Asia/Kolkata timezone (YYYY-MM-DD)
   */
  public getTodayInKolkata(referenceDate = new Date()): {
    year: number;
    month: number;
    day: number;
    dateString: string;
    hours: number;
    minutes: number;
  } {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: this.TIMEZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });

    const parts = formatter.formatToParts(referenceDate);
    const partMap: Record<string, string> = {};
    for (const p of parts) {
      partMap[p.type] = p.value;
    }

    const year = Number(partMap.year);
    const month = Number(partMap.month);
    const day = Number(partMap.day);
    const hours = Number(partMap.hour || 0);
    const minutes = Number(partMap.minute || 0);
    const dateString = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    return { year, month, day, dateString, hours, minutes };
  }

  /**
   * Calculates difference in calendar days between member's expiry date and today in Asia/Kolkata
   */
  public calculateDaysRemainingInKolkata(expiryDateStr: string, referenceDate = new Date()): number | null {
    if (!expiryDateStr || typeof expiryDateStr !== 'string') {
      return null;
    }

    const trimmed = expiryDateStr.trim();
    const parts = trimmed.split('-');
    if (parts.length !== 3) {
      return null;
    }

    const expYear = Number(parts[0]);
    const expMonth = Number(parts[1]);
    const expDay = Number(parts[2]);

    if (!expYear || !expMonth || !expDay) {
      return null;
    }

    const todayKolkata = this.getTodayInKolkata(referenceDate);

    // Compute difference in whole calendar days using UTC epoch
    const expUtc = Date.UTC(expYear, expMonth - 1, expDay);
    const todayUtc = Date.UTC(todayKolkata.year, todayKolkata.month - 1, todayKolkata.day);

    const diffDays = Math.round((expUtc - todayUtc) / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  /**
   * Validates if a phone string is a usable recipient phone number
   */
  public isValidPhoneNumber(phone: string | undefined | null): boolean {
    if (!phone || typeof phone !== 'string') {
      return false;
    }
    const cleanDigits = phone.replace(/\D/g, '');
    return cleanDigits.length >= 10;
  }

  /**
   * Evaluates if a scheduled run should execute at the current time in Asia/Kolkata
   */
  private async evaluateScheduledRun(triggerSource: string): Promise<void> {
    const kolkataTime = this.getTodayInKolkata();

    // Check if we already successfully ran the primary daily batch for today
    if (this.lastRunDateKolkata === kolkataTime.dateString && triggerSource !== 'manual' && triggerSource !== 'manual_api_trigger') {
      logger.info(
        { kolkataDate: kolkataTime.dateString, triggerSource },
        '[RenewalAutomation] Primary batch already completed for today in Asia/Kolkata, skipping duplicate run'
      );
      return;
    }

    const waStatus = this.whatsappService.getStatus();
    const isWaConnected = waStatus.state === 'CONNECTED';

    // If WhatsApp is disconnected on server startup, do not trigger premature dispatch failures.
    // Standby until the socket connects, at which point onStatusChange triggers the check.
    if (!isWaConnected && triggerSource === 'startup_check') {
      logger.info(
        { timezone: this.TIMEZONE, kolkataDate: kolkataTime.dateString },
        '[RenewalAutomation] Server-side scheduler in standby (waiting for WhatsApp connection)'
      );
      return;
    }

    // Run if current hour in Kolkata is at or past the scheduled hour (9 AM IST)
    // or if explicitly triggered
    if (kolkataTime.hours >= this.SCHEDULED_HOUR_IST || triggerSource === 'startup_check') {
      await this.runRenewalCheck({ source: triggerSource });
    }
  }

  /**
   * Loads general gym settings from Firestore or defaults
   */
  public async loadSettings(): Promise<GymSettings> {
    try {
      const db = getAdminDb();
      if (db) {
        const snap = await db.collection('settings').doc('general').get();
        if (snap.exists) {
          return { ...INITIAL_SETTINGS, ...snap.data() } as GymSettings;
        }
      }
    } catch (err: any) {
      if (!isQuotaExhaustedError(err)) {
        logger.warn({ reason: err?.message }, '[RenewalAutomation] Notice loading settings, using defaults');
      }
    }
    return INITIAL_SETTINGS;
  }

  /**
   * Loads all active members from Firestore or memory fallback
   */
  public async loadMembers(): Promise<Member[]> {
    const db = getAdminDb();
    if (db) {
      try {
        const snap = await db.collection('members').get();
        if (snap && snap.docs && snap.docs.length > 0) {
          return snap.docs.map((doc) => {
            const data = doc.data();
            return {
              ...data,
              id: data.id || doc.id
            } as Member;
          });
        }
      } catch (err: any) {
        logger.warn({ reason: err?.message }, '[RenewalAutomation] Notice reading members collection, using fallback');
      }
    }
    return INITIAL_MEMBERS;
  }

  /**
   * Loads active festival events from Firestore or default initial dataset
   */
  private async loadFestivals(): Promise<FestivalEvent[]> {
    const adminDb = getAdminDb();
    if (adminDb) {
      try {
        const snap = await adminDb.collection('festivals').get();
        if (!snap.empty) {
          const list = snap.docs.map((doc: any) => {
            const data = doc.data();
            return {
              ...data,
              id: data.id || doc.id
            } as FestivalEvent;
          });
          return list;
        }
      } catch (err: any) {
        if (!isQuotaExhaustedError(err)) {
          logger.warn({ reason: err?.message }, '[RenewalAutomation] Notice reading festivals collection, using fallback');
        }
      }
    }
    return INITIAL_FESTIVALS;
  }

  /**
   * Formats the personalized festival greeting message template for any Indian festival
   */
  public formatFestivalMessage(
    template: string | undefined | null,
    member: Member,
    festival: FestivalEvent,
    settings: GymSettings
  ): string {
    const gymName = settings.gymName || 'Black Stone Fitness';
    const fallbackTemplate =
      festival.messageTemplate ||
      '🎉 Happy {FESTIVAL_NAME}, {MEMBER_NAME}! Wishing you supreme joy, peak fitness, and vibrant health! 🌟 — Team {GYM_NAME}';
    const chosenTemplate = template && template.trim() ? template : fallbackTemplate;

    return chosenTemplate
      .replace(/{MEMBER_NAME}/gi, member.fullName || 'Member')
      .replace(/{GYM_NAME}/gi, gymName)
      .replace(/{FESTIVAL_NAME}/gi, festival.name);
  }

  /**
   * Evaluates if a member's date of birth matches the current calendar month and day
   * in Asia/Kolkata timezone. Handles YYYY-MM-DD, DD-MM-YYYY, YYYY/MM/DD formats.
   */
  public isBirthdayToday(dobStr: string | undefined | null, targetMonth: number, targetDay: number): boolean {
    if (!dobStr || typeof dobStr !== 'string') return false;
    const clean = dobStr.trim();
    if (!clean) return false;
    const parts = clean.split(/[-/.]/);
    if (parts.length === 3) {
      let m = 0;
      let d = 0;
      if (parts[0].length === 4) {
        // YYYY-MM-DD
        m = parseInt(parts[1], 10);
        d = parseInt(parts[2], 10);
      } else if (parts[2].length === 4) {
        // DD-MM-YYYY
        d = parseInt(parts[0], 10);
        m = parseInt(parts[1], 10);
      } else {
        m = parseInt(parts[1], 10);
        d = parseInt(parts[2], 10);
      }
      return m === targetMonth && d === targetDay;
    }
    return false;
  }

  /**
   * Formats the personalized birthday wish message template
   */
  public formatBirthdayMessage(
    template: string | undefined | null,
    member: Member,
    settings: GymSettings
  ): string {
    const gymName = settings.gymName || 'Black Stone Fitness';
    const fallbackTemplate =
      settings.birthdayTemplate ||
      '🎉 Happy Birthday, {MEMBER_NAME}! 🎂 The entire Black Stone Fitness family wishes you a healthy, strong, and powerhouse year ahead. Keep crushing your goals! 💪🔥 — Team {GYM_NAME} Mysuru';
    const chosenTemplate = template && template.trim() ? template : fallbackTemplate;

    return chosenTemplate
      .replace(/{MEMBER_NAME}/gi, member.fullName || 'Member')
      .replace(/{GYM_NAME}/gi, gymName);
  }

  /**
   * Formats the renewal message template with member details
   */
  public formatMessage(
    template: string,
    member: Member,
    daysLeft: number,
    settings: GymSettings
  ): string {
    const gymName = settings.gymName || 'Black Stone Fitness';
    const fallbackTemplate =
      daysLeft === 7
        ? settings.reminder7DayTemplate ||
          'Hello {MEMBER_NAME}, your {GYM_NAME} membership will expire in 7 days on {EXPIRY_DATE}. Renew early to lock in your legacy rate! 💪 - {GYM_NAME} Mysuru'
        : daysLeft === 3
        ? settings.reminder3DayTemplate ||
          "Hi {MEMBER_NAME}, only 3 days left on your {GYM_NAME} membership ({EXPIRY_DATE}). Don't break your workout streak! Visit the front desk or renew via UPI. 🏋️‍♂️"
        : daysLeft === 1
        ? settings.reminder1DayTemplate ||
          'FINAL REMINDER: Hi {MEMBER_NAME}, your {GYM_NAME} membership expires tomorrow ({EXPIRY_DATE}). Renew today to keep seamless gym access. ⚡ - Team {GYM_NAME} Mysuru'
        : daysLeft === 0
        ? 'EXPIRING TODAY: Hi {MEMBER_NAME}, your {GYM_NAME} membership expires today ({EXPIRY_DATE})! Please renew at the front desk or via UPI to keep working out without pause. 🏋️‍♂️💪 - Team {GYM_NAME}'
        : 'MEMBERSHIP RENEWAL: Hi {MEMBER_NAME}, your {GYM_NAME} membership expired on {EXPIRY_DATE}. We miss you on the training floor! Renew today to reactivate your gym access immediately. ⚡ - {GYM_NAME} Mysuru';

    const chosenTemplate = template && template.trim() ? template : fallbackTemplate;

    return chosenTemplate
      .replace(/{MEMBER_NAME}/gi, member.fullName || 'Member')
      .replace(/{EXPIRY_DATE}/gi, member.expiryDate || '')
      .replace(/{DAYS_LEFT}/gi, String(daysLeft))
      .replace(/{GYM_NAME}/gi, gymName);
  }

  /**
   * Identifies all eligible renewal and birthday candidates for today in Asia/Kolkata
   */
  public async findEligibleCandidates(
    customDateStr?: string
  ): Promise<{
    candidates: RenewalCandidate[];
    totalMembers: number;
    activeMembers: number;
    settings: GymSettings;
  }> {
    const settings = await this.loadSettings();
    const members = await this.loadMembers();
    const festivals = await this.loadFestivals();
    const referenceDate = customDateStr ? new Date(customDateStr) : new Date();
    const kolkataToday = this.getTodayInKolkata(referenceDate);
    const todayMMDD = `${String(kolkataToday.month).padStart(2, '0')}-${String(kolkataToday.day).padStart(2, '0')}`;

    const candidates: RenewalCandidate[] = [];
    let activeMembersCount = 0;

    // -------------------------------------------------------------
    // 1. DAILY INDIAN FESTIVALS CHECK (Evaluated daily for all Indian festivals to everyone without fail)
    // -------------------------------------------------------------
    const activeTodayFestivals = festivals.filter(f => f.enabled !== false && f.monthDay === todayMMDD);
    for (const fest of activeTodayFestivals) {
      for (const member of members) {
        const statusLower = (member.status || '').toLowerCase();
        if (statusLower === 'inactive') continue;
        const phone = member.whatsapp || member.phone;
        if (!phone || !this.isValidPhoneNumber(phone)) continue;

        // Active by default unless member specifically opted out of festival greetings
        if (member.automationOverrides?.festivalGreetings === false) continue;

        const membershipId = member.packageId || member.memberCode || member.id;
        const festIdempotencyKey = `${member.id}:festival:${fest.id}:${kolkataToday.year}`;
        const existingRecord = await this.idempotencyManager.getRecord(festIdempotencyKey);
        let deliveryState: 'SUCCESS' | 'PENDING' | 'IN_FLIGHT' | 'UNPROCESSED' = 'UNPROCESSED';
        let deliveredAt: string | null = null;

        if (existingRecord) {
          if (existingRecord.status === 'SUCCESS') {
            deliveryState = 'SUCCESS';
            deliveredAt = existingRecord.completedAt || existingRecord.updatedAt;
          } else if (existingRecord.status === 'PENDING') {
            const now = Date.now();
            if (existingRecord.lockedUntil && existingRecord.lockedUntil > now) {
              deliveryState = 'IN_FLIGHT';
            } else {
              deliveryState = 'PENDING';
            }
          }
        }

        const festMessage = this.formatFestivalMessage(fest.messageTemplate, member, fest, settings);

        candidates.push({
          type: 'festival',
          memberId: member.id,
          membershipId,
          memberName: member.fullName,
          phone,
          festivalId: fest.id,
          festivalName: fest.name,
          daysLeft: 0,
          idempotencyKey: festIdempotencyKey,
          messageText: festMessage,
          status: (statusLower === 'active' || statusLower === 'expiring_soon') ? statusLower : 'expired',
          deliveryState,
          deliveredAt
        });
      }
    }

    for (const member of members) {
      const statusLower = (member.status || '').toLowerCase();
      const phone = member.whatsapp || member.phone;
      const membershipId = member.packageId || member.memberCode || member.id;

      // -------------------------------------------------------------
      // 2. DAILY BIRTHDAY CHECK (Evaluated daily without fail)
      // -------------------------------------------------------------
      const rawDob = member.dob || (member as any).dateOfBirth || (member as any).birthDate;
      const isBdayToday = this.isBirthdayToday(rawDob, kolkataToday.month, kolkataToday.day);
      if (isBdayToday && phone && this.isValidPhoneNumber(phone)) {
        // Active by default unless member specifically opted out
        const isBdayOptedOut = member.automationOverrides?.birthdayWish === false;
        if (!isBdayOptedOut) {
          const bdayIdempotencyKey = `${member.id}:birthday:${kolkataToday.year}`;
          const existingBdayRecord = await this.idempotencyManager.getRecord(bdayIdempotencyKey);
          let bdayDeliveryState: 'SUCCESS' | 'PENDING' | 'IN_FLIGHT' | 'UNPROCESSED' = 'UNPROCESSED';
          let bdayDeliveredAt: string | null = null;

          if (existingBdayRecord) {
            if (existingBdayRecord.status === 'SUCCESS') {
              bdayDeliveryState = 'SUCCESS';
              bdayDeliveredAt = existingBdayRecord.completedAt || existingBdayRecord.updatedAt;
            } else if (existingBdayRecord.status === 'PENDING') {
              const now = Date.now();
              if (existingBdayRecord.lockedUntil && existingBdayRecord.lockedUntil > now) {
                bdayDeliveryState = 'IN_FLIGHT';
              } else {
                bdayDeliveryState = 'PENDING';
              }
            }
          }

          const bdayMessage = this.formatBirthdayMessage(settings.birthdayTemplate, member, settings);

          candidates.push({
            type: 'birthday',
            memberId: member.id,
            membershipId,
            memberName: member.fullName,
            phone,
            dob: rawDob,
            daysLeft: 0,
            idempotencyKey: bdayIdempotencyKey,
            messageText: bdayMessage,
            status: (statusLower === 'active' || statusLower === 'expiring_soon') ? statusLower : 'expired',
            deliveryState: bdayDeliveryState,
            deliveredAt: bdayDeliveredAt
          });
        }
      }

      // -------------------------------------------------------------
      // 3. MEMBERSHIP EXPIRY / RENEWAL CHECK
      // -------------------------------------------------------------
      // 1. Membership must be active
      const isActive = statusLower === 'active' || statusLower === 'expiring_soon';
      if (!isActive) {
        continue;
      }

      // Check frozen status
      if (member.isFrozen) {
        continue;
      }

      activeMembersCount++;

      // 2. Member must have a valid phone number
      if (!this.isValidPhoneNumber(phone)) {
        continue;
      }

      // 3. Expiry date calculation in Asia/Kolkata
      const daysLeft = this.calculateDaysRemainingInKolkata(member.expiryDate, referenceDate);
      if (daysLeft === null) {
        continue;
      }
      const isEligibleDay = daysLeft === 7 || daysLeft === 3 || daysLeft === 1 || daysLeft === 0 || daysLeft === -1;
      if (!isEligibleDay) {
        continue;
      }

      // 4. Corresponding automation must be enabled globally
      if (daysLeft === 7 && settings.enable7DayReminders === false) {
        continue;
      }
      if (daysLeft === 3 && settings.enable3DayReminders === false) {
        continue;
      }
      if (daysLeft === 1 && settings.enable1DayReminders === false) {
        continue;
      }
      if (daysLeft === -1 && settings.enablePostExpiryReminders === false) {
        continue;
      }

      // 5. Member must have WhatsApp automation enabled/opted in
      const overrides = member.automationOverrides;
      if (overrides) {
        if (daysLeft === 7 && overrides.reminder7Days === false) {
          continue;
        }
        if (daysLeft === 3 && overrides.reminder3Days === false) {
          continue;
        }
        if (daysLeft === 1 && overrides.reminder1Day === false) {
          continue;
        }
      }

      // 6. Check existing delivery and idempotency record
      const idempotencyKey = `${member.id}:renewal:${daysLeft}`;

      const existingRecord = await this.idempotencyManager.getRecord(idempotencyKey);
      let deliveryState: 'SUCCESS' | 'PENDING' | 'IN_FLIGHT' | 'UNPROCESSED' = 'UNPROCESSED';
      let deliveredAt: string | null = null;

      if (existingRecord) {
        if (existingRecord.status === 'SUCCESS') {
          deliveryState = 'SUCCESS';
          deliveredAt = existingRecord.completedAt || existingRecord.updatedAt;
        } else if (existingRecord.status === 'PENDING') {
          const now = Date.now();
          if (existingRecord.lockedUntil && existingRecord.lockedUntil > now) {
            deliveryState = 'IN_FLIGHT';
          } else {
            deliveryState = 'PENDING';
          }
        }
      }

      // Build message text
      const template =
        daysLeft === 7
          ? settings.reminder7DayTemplate
          : daysLeft === 3
          ? settings.reminder3DayTemplate
          : daysLeft === 1
          ? settings.reminder1DayTemplate
          : '';

      const messageText = this.formatMessage(template, member, daysLeft, settings);

      candidates.push({
        type: 'renewal',
        memberId: member.id,
        membershipId,
        memberName: member.fullName,
        phone,
        expiryDate: member.expiryDate,
        daysLeft,
        idempotencyKey,
        messageText,
        status: statusLower as 'active' | 'expiring_soon',
        deliveryState,
        deliveredAt
      });
    }

    return {
      candidates,
      totalMembers: members.length,
      activeMembers: activeMembersCount,
      settings
    };
  }

  /**
   * Executes the renewal automation check.
   * If WhatsApp is disconnected:
   * - Does NOT pretend the message was sent
   * - Records as pending/failed according to implementation
   * - Allows safe retry when WhatsApp becomes available
   * - Preserves idempotency
   */
  public async runRenewalCheck(options?: {
    source?: string;
    customDate?: string;
    allowRetryDisconnected?: boolean;
    dryRun?: boolean;
  }): Promise<RenewalRunSummary> {
    if (this.isRunning) {
      logger.info('[RenewalAutomation] Renewal check is already executing, skipping concurrent run');
      if (this.lastRunSummary) return this.lastRunSummary;
      const nowKolkata = this.getTodayInKolkata(options?.customDate ? new Date(options.customDate) : new Date());
      return {
        runId: `skipped-${Date.now()}`,
        timestamp: new Date().toISOString(),
        timezone: this.TIMEZONE,
        currentKolkataDate: nowKolkata.dateString,
        whatsappConnected: this.whatsappService.getStatus().state === 'CONNECTED',
        totalMembersChecked: 0,
        activeMembersCount: 0,
        totalCandidates: 0,
        sentCount: 0,
        duplicatePreventedCount: 0,
        inFlightCount: 0,
        failedCount: 0,
        disconnectedSkippedCount: 0,
        details: []
      };
    }

    this.isRunning = true;
    const runId = `run-${Date.now()}`;
    const kolkataNow = this.getTodayInKolkata(options?.customDate ? new Date(options.customDate) : new Date());
    const isManualRun = options?.source === 'manual' || options?.source === 'manual_api_trigger';

    if (!isManualRun && !options?.dryRun && this.lastRunDateKolkata === kolkataNow.dateString) {
      this.isRunning = false;
      logger.info(
        { kolkataDate: kolkataNow.dateString, source: options?.source },
        '[RenewalAutomation] Primary batch already completed for today in Asia/Kolkata, skipping duplicate run'
      );
      if (this.lastRunSummary) return this.lastRunSummary;
      return {
        runId: `skipped-${Date.now()}`,
        timestamp: new Date().toISOString(),
        timezone: this.TIMEZONE,
        currentKolkataDate: kolkataNow.dateString,
        whatsappConnected: this.whatsappService.getStatus().state === 'CONNECTED',
        totalMembersChecked: 0,
        activeMembersCount: 0,
        totalCandidates: 0,
        sentCount: 0,
        duplicatePreventedCount: 0,
        inFlightCount: 0,
        failedCount: 0,
        disconnectedSkippedCount: 0,
        details: []
      };
    }

    const waStatus = this.whatsappService.getStatus();
    const isWaConnected = waStatus.state === 'CONNECTED';

    logger.info(
      {
        runId,
        source: options?.source || 'manual',
        kolkataDate: kolkataNow.dateString,
        isWaConnected
      },
      '[RenewalAutomation] Commencing membership renewal check'
    );

    const summary: RenewalRunSummary = {
      runId,
      timestamp: new Date().toISOString(),
      timezone: this.TIMEZONE,
      currentKolkataDate: kolkataNow.dateString,
      whatsappConnected: isWaConnected,
      totalMembersChecked: 0,
      activeMembersCount: 0,
      totalCandidates: 0,
      sentCount: 0,
      duplicatePreventedCount: 0,
      inFlightCount: 0,
      failedCount: 0,
      disconnectedSkippedCount: 0,
      details: []
    };

    try {
      const { candidates, totalMembers, activeMembers } = await this.findEligibleCandidates(
        options?.customDate
      );

      summary.totalMembersChecked = totalMembers;
      summary.activeMembersCount = activeMembers;
      summary.totalCandidates = candidates.length;
      summary.birthdaysCount = candidates.filter(c => c.type === 'birthday').length;
      summary.festivalsCount = candidates.filter(c => c.type === 'festival').length;

      if (options?.dryRun) {
        for (const c of candidates) {
          summary.details.push({
            idempotencyKey: c.idempotencyKey,
            memberId: c.memberId,
            memberName: c.memberName,
            phone: c.phone,
            daysLeft: c.daysLeft,
            type: c.type || 'renewal',
            festivalId: c.festivalId,
            festivalName: c.festivalName,
            action: 'skipped_criteria',
            reason: 'Dry-run preview mode'
          });
        }
        this.isRunning = false;
        return summary;
      }

      // Process candidates through the centralized WhatsAppService
      for (const candidate of candidates) {
        // If candidate was already successfully dispatched today, record as duplicate prevented
        if (candidate.deliveryState === 'SUCCESS') {
          summary.duplicatePreventedCount++;
          summary.details.push({
            idempotencyKey: candidate.idempotencyKey,
            memberId: candidate.memberId,
            memberName: candidate.memberName,
            phone: candidate.phone,
            daysLeft: candidate.daysLeft,
            type: candidate.type || 'renewal',
            festivalId: candidate.festivalId,
            festivalName: candidate.festivalName,
            action: 'duplicate_prevented',
            reason: `Already delivered successfully on ${candidate.deliveredAt || 'today'} (idempotency preserved)`
          });
          continue;
        }

        // If WhatsApp is disconnected:
        // Do NOT pretend the message was sent.
        // Record as pending truthfully, allow safe retry when socket connects.
        if (!isWaConnected) {
          summary.disconnectedSkippedCount++;
          summary.details.push({
            idempotencyKey: candidate.idempotencyKey,
            memberId: candidate.memberId,
            memberName: candidate.memberName,
            phone: candidate.phone,
            daysLeft: candidate.daysLeft,
            type: candidate.type || 'renewal',
            festivalId: candidate.festivalId,
            festivalName: candidate.festivalName,
            action: 'disconnected_queued',
            reason: 'WhatsApp socket is currently disconnected; queued for retry upon connection restoration'
          });

          // Mark idempotency key as PENDING so it preserves idempotency without blocking future retries
          await this.idempotencyManager.markPending(
            candidate.idempotencyKey,
            {
              recipientPhone: candidate.phone,
              recipientName: candidate.memberName,
              reason: 'WhatsApp socket is currently disconnected; message queued for auto-retry upon reconnection.'
            }
          );
          continue;
        }

        try {
          const isBday = candidate.type === 'birthday';
          const isFest = candidate.type === 'festival';
          const sendResult = await this.whatsappService.sendMessage({
            to: candidate.phone,
            text: candidate.messageText,
            type: isBday ? 'birthday' : isFest ? 'festival_greeting' : 'expiry_reminder',
            recipientName: candidate.memberName,
            memberId: candidate.memberId,
            idempotencyKey: candidate.idempotencyKey
          });

          if (sendResult.isDuplicate) {
            summary.duplicatePreventedCount++;
            summary.details.push({
              idempotencyKey: candidate.idempotencyKey,
              memberId: candidate.memberId,
              memberName: candidate.memberName,
              phone: candidate.phone,
              daysLeft: candidate.daysLeft,
              type: candidate.type || 'renewal',
              festivalId: candidate.festivalId,
              festivalName: candidate.festivalName,
              action: 'duplicate_prevented',
              reason: isBday
                ? 'Birthday wish already sent for this calendar year (idempotency enforced)'
                : isFest
                ? `Festival wish for "${candidate.festivalName || 'Festival'}" already sent for this calendar year (idempotency enforced)`
                : 'Already sent successfully in a previous dispatch (idempotency enforced)'
            });
          } else {
            summary.sentCount++;
            if (isBday) {
              summary.birthdaysSentCount = (summary.birthdaysSentCount || 0) + 1;
            }
            if (isFest) {
              summary.festivalsSentCount = (summary.festivalsSentCount || 0) + 1;
            }
            summary.details.push({
              idempotencyKey: candidate.idempotencyKey,
              memberId: candidate.memberId,
              memberName: candidate.memberName,
              phone: candidate.phone,
              daysLeft: candidate.daysLeft,
              type: candidate.type || 'renewal',
              festivalId: candidate.festivalId,
              festivalName: candidate.festivalName,
              action: 'sent',
              reason: isBday
                ? `Birthday wish dispatched successfully without fail (Message ID: ${sendResult.messageId})`
                : isFest
                ? `Festival wish for "${candidate.festivalName || 'Festival'}" dispatched successfully without fail (Message ID: ${sendResult.messageId})`
                : `Dispatched successfully (Message ID: ${sendResult.messageId})`
            });
          }
        } catch (dispatchErr: any) {
          summary.failedCount++;
          summary.details.push({
            idempotencyKey: candidate.idempotencyKey,
            memberId: candidate.memberId,
            memberName: candidate.memberName,
            phone: candidate.phone,
            daysLeft: candidate.daysLeft,
            type: candidate.type || 'renewal',
            festivalId: candidate.festivalId,
            festivalName: candidate.festivalName,
            action: 'failed',
            reason: dispatchErr?.message || 'Dispatch failed'
          });
        }
      }

      this.lastRunSummary = summary;
      if (isWaConnected && (summary.sentCount > 0 || summary.totalCandidates === summary.duplicatePreventedCount || summary.totalCandidates === 0)) {
        this.lastRunDateKolkata = kolkataNow.dateString;
      }
      this.runHistory.unshift(summary);
      if (this.runHistory.length > 20) {
        this.runHistory.pop();
      }

      if (isWaConnected) {
        logger.info(
          {
            runId,
            totalCandidates: summary.totalCandidates,
            sentCount: summary.sentCount,
            duplicatePreventedCount: summary.duplicatePreventedCount
          },
          summary.totalCandidates === 0
            ? '[RenewalAutomation] Membership renewal check completed (no members due today)'
            : '[RenewalAutomation] Membership renewal check completed'
        );

        if (summary.failedCount > 0) {
          logger.warn(
            { runId, unsentCandidateCount: summary.failedCount },
            '[RenewalAutomation] Some messages could not be dispatched during renewal check'
          );
        }
      } else {
        logger.info(
          {
            runId,
            totalCandidates: summary.totalCandidates,
            pendingQueuedCount: summary.disconnectedSkippedCount
          },
          '[RenewalAutomation] Membership renewal candidates registered in pending queue (awaiting WhatsApp connection)'
        );
      }

      return summary;
    } finally {
      this.isRunning = false;
    }
  }

  public getStatus(): {
    schedulerRunning: boolean;
    timezone: string;
    currentKolkataTime: string;
    lastRunDateKolkata: string | null;
    lastRunSummary: RenewalRunSummary | null;
    historyCount: number;
    whatsappStatus: string;
  } {
    const kolkata = this.getTodayInKolkata();
    const wa = this.whatsappService.getStatus();
    return {
      schedulerRunning: Boolean(this.timer),
      timezone: this.TIMEZONE,
      currentKolkataTime: `${kolkata.dateString} ${String(kolkata.hours).padStart(2, '0')}:${String(kolkata.minutes).padStart(2, '0')}`,
      lastRunDateKolkata: this.lastRunDateKolkata,
      lastRunSummary: this.lastRunSummary,
      historyCount: this.runHistory.length,
      whatsappStatus: wa.state
    };
  }

  public getRunHistory(): RenewalRunSummary[] {
    return this.runHistory;
  }
}
