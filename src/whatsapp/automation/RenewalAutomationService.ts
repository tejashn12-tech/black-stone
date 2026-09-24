import { WhatsAppService } from '../WhatsAppService';
import { getAdminDb, isQuotaExhaustedError } from '../../config/firebase';
import { IdempotencyManager } from '../idempotency/IdempotencyManager';
import { GymSettings, Member } from '../../types';
import { INITIAL_SETTINGS } from '../../data/initialData';
import { logger } from '../../utils/logger';

export interface RenewalCandidate {
  memberId: string;
  membershipId: string;
  memberName: string;
  phone: string;
  expiryDate: string;
  daysLeft: 7 | 3 | 1;
  idempotencyKey: string;
  messageText: string;
  status: 'active' | 'expiring_soon';
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
  details: Array<{
    idempotencyKey: string;
    memberId: string;
    memberName: string;
    phone: string;
    daysLeft: number;
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
   * Loads all active members from Firestore
   */
  public async loadMembers(): Promise<Member[]> {
    const db = getAdminDb();
    if (!db) {
      return [];
    }

    try {
      const snap = await db.collection('members').get();
      if (!snap || !snap.docs) {
        return [];
      }
      return snap.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          id: data.id || doc.id
        } as Member;
      });
    } catch (err: any) {
      logger.warn({ reason: err?.message }, '[RenewalAutomation] Notice reading members collection');
      return [];
    }
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
        : settings.reminder1DayTemplate ||
          'FINAL REMINDER: Hi {MEMBER_NAME}, your {GYM_NAME} membership expires tomorrow ({EXPIRY_DATE}). Renew today to keep seamless gym access. ⚡ - Team {GYM_NAME} Mysuru';

    const chosenTemplate = template && template.trim() ? template : fallbackTemplate;

    return chosenTemplate
      .replace(/{MEMBER_NAME}/gi, member.fullName || 'Member')
      .replace(/{EXPIRY_DATE}/gi, member.expiryDate || '')
      .replace(/{DAYS_LEFT}/gi, String(daysLeft))
      .replace(/{GYM_NAME}/gi, gymName);
  }

  /**
   * Identifies all eligible renewal candidates for today in Asia/Kolkata
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
    const referenceDate = customDateStr ? new Date(customDateStr) : new Date();
    const kolkataToday = this.getTodayInKolkata(referenceDate);

    const candidates: RenewalCandidate[] = [];
    let activeMembersCount = 0;

    for (const member of members) {
      // 1. Membership must be active
      const statusLower = (member.status || '').toLowerCase();
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
      const phone = member.whatsapp || member.phone;
      if (!this.isValidPhoneNumber(phone)) {
        continue;
      }

      // 3. Expiry date calculation in Asia/Kolkata
      const daysLeft = this.calculateDaysRemainingInKolkata(member.expiryDate, referenceDate);
      if (daysLeft !== 7 && daysLeft !== 3 && daysLeft !== 1) {
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
      const membershipId = member.packageId || member.memberCode || member.id;
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
          : settings.reminder1DayTemplate;

      const messageText = this.formatMessage(template, member, daysLeft, settings);

      candidates.push({
        memberId: member.id,
        membershipId,
        memberName: member.fullName,
        phone,
        expiryDate: member.expiryDate,
        daysLeft: daysLeft as 7 | 3 | 1,
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

      if (options?.dryRun) {
        for (const c of candidates) {
          summary.details.push({
            idempotencyKey: c.idempotencyKey,
            memberId: c.memberId,
            memberName: c.memberName,
            phone: c.phone,
            daysLeft: c.daysLeft,
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
          const sendResult = await this.whatsappService.sendMessage({
            to: candidate.phone,
            text: candidate.messageText,
            type: 'expiry_reminder',
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
              action: 'duplicate_prevented',
              reason: 'Already sent successfully in a previous dispatch (idempotency enforced)'
            });
          } else {
            summary.sentCount++;
            summary.details.push({
              idempotencyKey: candidate.idempotencyKey,
              memberId: candidate.memberId,
              memberName: candidate.memberName,
              phone: candidate.phone,
              daysLeft: candidate.daysLeft,
              action: 'sent',
              reason: `Dispatched successfully (Message ID: ${sendResult.messageId})`
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
