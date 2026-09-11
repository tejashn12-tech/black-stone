import { getAdminDb } from '../config/firebase';
import { logger } from '../utils/logger';
import { sessionManager } from './WhatsAppSessionManager';
import { WhatsAppMessageService } from './WhatsAppMessageService';
import { INITIAL_SETTINGS, INITIAL_FESTIVALS } from '../data/initialData';
import { PARSED_IMPORTED_MEMBERS } from '../data/importedMembers';
import { Member, GymSettings, FestivalEvent, WhatsAppMessageLog } from '../types';

export interface AutomationCandidate {
  type: 'renewal_7d' | 'renewal_3d' | 'renewal_1d' | 'birthday' | 'festival';
  memberId: string;
  memberName: string;
  phone: string;
  message: string;
  trackingKey: string;
  detail: string;
  festivalId?: string;
  festivalName?: string;
}

export interface AutomationRunResult {
  success: boolean;
  timestamp: string;
  targetDate: string;
  summary: {
    totalCandidates: number;
    totalSent: number;
    alreadySentCount: number;
    renewals7d: { sent: number; candidates: string[] };
    renewals3d: { sent: number; candidates: string[] };
    renewals1d: { sent: number; candidates: string[] };
    birthdays: { sent: number; candidates: string[] };
    festivals: { sent: number; festivalName?: string; candidates: string[] };
    skipped: number;
    errors?: string[];
    failureReasons?: string[];
    notice?: string;
  };
  dispatchedLogs: WhatsAppMessageLog[];
}

export class WhatsAppAutomationService {
  private static instance: WhatsAppAutomationService;
  private backgroundInterval: NodeJS.Timeout | null = null;
  private dailyTimer: NodeJS.Timeout | null = null;
  private lastRunDateIST: string = '';
  private lastRunTimestamp: string = '';
  private isRunning: boolean = false;
  private inMemoryDispatchedKeys: Set<string> = new Set();

  private constructor() {}

  public static getInstance(): WhatsAppAutomationService {
    if (!WhatsAppAutomationService.instance) {
      WhatsAppAutomationService.instance = new WhatsAppAutomationService();
    }
    return WhatsAppAutomationService.instance;
  }

  /**
   * Returns current date in Asia/Kolkata (IST) timezone
   */
  public getTodayIST(customDate?: string): { dateStr: string; mmdd: string; year: string } {
    if (customDate && /^\d{4}-\d{2}-\d{2}$/.test(customDate)) {
      const [year, month, day] = customDate.split('-');
      return { dateStr: customDate, mmdd: `${month}-${day}`, year };
    }

    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const dateStr = formatter.format(now); // YYYY-MM-DD
    const [year, month, day] = dateStr.split('-');
    return { dateStr, mmdd: `${month}-${day}`, year };
  }

  /**
   * Returns current date, time, hour, and minute in Asia/Kolkata (IST) timezone
   */
  public getCurrentISTTime(): {
    dateStr: string;
    mmdd: string;
    year: string;
    hour: number;
    minute: number;
    second: number;
  } {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    const parts = formatter.formatToParts(now);
    const getVal = (type: string) => parts.find((p) => p.type === type)?.value || '';

    const year = getVal('year');
    const month = getVal('month');
    const day = getVal('day');
    const hour = parseInt(getVal('hour'), 10) || 0;
    const minute = parseInt(getVal('minute'), 10) || 0;
    const second = parseInt(getVal('second'), 10) || 0;

    return {
      dateStr: `${year}-${month}-${day}`,
      mmdd: `${month}-${day}`,
      year,
      hour,
      minute,
      second,
    };
  }

  /**
   * Calculates milliseconds remaining until the next 9:00:00 AM IST
   * Note: IST is UTC+05:30 with no DST, meaning 9:00:00 AM IST is always exactly 03:30:00 UTC.
   */
  public getMillisUntilNext9AMIST(): { delayMs: number; targetDateIST: string } {
    const now = new Date();
    const ist = this.getCurrentISTTime();
    const [year, month, day] = ist.dateStr.split('-').map(Number);

    // 09:00:00 IST in UTC is 03:30:00 UTC
    const today9AMUTC = Date.UTC(year, month - 1, day, 3, 30, 0, 0);

    if (now.getTime() < today9AMUTC) {
      // Today's 9:00 AM IST hasn't arrived yet
      return {
        delayMs: Math.max(1000, today9AMUTC - now.getTime()),
        targetDateIST: ist.dateStr,
      };
    } else {
      // Today's 9:00 AM IST has passed; schedule for tomorrow's 9:00 AM IST
      const tomorrow9AMUTC = today9AMUTC + 24 * 60 * 60 * 1000;
      const tomorrowDate = new Date(tomorrow9AMUTC);
      const tomorrowISTFormatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
      return {
        delayMs: Math.max(1000, tomorrow9AMUTC - now.getTime()),
        targetDateIST: tomorrowISTFormatter.format(tomorrowDate),
      };
    }
  }

  /**
   * Loads persisted last daily automation run metadata from Firestore
   */
  public async loadLastRunMeta(gymId: string): Promise<void> {
    try {
      const db = getAdminDb();
      const doc = await db.collection('gyms').doc(gymId).collection('automations_meta').doc('daily_schedule').get();
      if (doc.exists) {
        const data = doc.data();
        if (data?.lastRunDateIST) {
          this.lastRunDateIST = data.lastRunDateIST;
        }
        if (data?.lastRunTimestamp) {
          this.lastRunTimestamp = data.lastRunTimestamp;
        }
      }
    } catch (err: any) {
      logger.warn({ error: err?.message, gymId }, 'Notice: reading daily_schedule meta from Firestore');
    }
  }

  /**
   * Returns metadata about the 9:00 AM IST automated schedule
   */
  public getScheduleInfo(): {
    scheduledTime: string;
    nextRunIST: string;
    lastRunDateIST: string;
    lastRunTimestamp: string;
    isAutomationActive: boolean;
  } {
    const { targetDateIST } = this.getMillisUntilNext9AMIST();
    return {
      scheduledTime: '09:00 AM IST',
      nextRunIST: `${targetDateIST} at 09:00 AM IST`,
      lastRunDateIST: this.lastRunDateIST || 'Pending today',
      lastRunTimestamp: this.lastRunTimestamp || '',
      isAutomationActive: Boolean(this.dailyTimer || this.backgroundInterval),
    };
  }

  /**
   * Calculate difference in days: targetDate - today
   */
  public calculateDaysDifference(todayStr: string, targetDateStr: string): number {
    if (!targetDateStr) return -999;
    const [tY, tM, tD] = todayStr.split('-').map(Number);
    const [eY, eM, eD] = targetDateStr.split('-').map(Number);

    if (isNaN(tY) || isNaN(tM) || isNaN(tD) || isNaN(eY) || isNaN(eM) || isNaN(eD)) {
      return -999;
    }

    const today = new Date(Date.UTC(tY, tM - 1, tD));
    const target = new Date(Date.UTC(eY, eM - 1, eD));
    const diffMs = target.getTime() - today.getTime();
    return Math.round(diffMs / (1000 * 60 * 60 * 24));
  }

  /**
   * Substitute template variables safely
   */
  public formatMessage(template: string, data: Record<string, string>): string {
    let result = template;
    for (const [key, value] of Object.entries(data)) {
      const regex = new RegExp(`{${key}}`, 'gi');
      result = result.replace(regex, value || '');
    }
    return result;
  }

  /**
   * Load active settings from Firestore or fallback
   */
  public async loadSettings(gymId: string): Promise<GymSettings> {
    try {
      const db = getAdminDb();
      const snap = await db.collection('settings').doc('general').get();
      if (snap.exists) {
        return { ...INITIAL_SETTINGS, ...(snap.data() as Partial<GymSettings>) };
      }
    } catch (err) {
      logger.warn({ error: (err as any)?.message, gymId }, 'Could not read settings from Firestore, using initial defaults');
    }
    return INITIAL_SETTINGS;
  }

  /**
   * Load members from Firestore or fallback
   */
  public async loadMembers(gymId: string): Promise<Member[]> {
    try {
      const db = getAdminDb();
      const snap = await db.collection('members').get();
      if (!snap.empty) {
        return snap.docs.map((d: any) => ({ id: d.id, ...d.data() } as Member));
      }
    } catch (err) {
      logger.warn({ error: (err as any)?.message, gymId }, 'Could not read members from Firestore, using initial fallback');
    }
    return PARSED_IMPORTED_MEMBERS;
  }

  /**
   * Load festivals from Firestore or fallback
   */
  public async loadFestivals(gymId: string): Promise<FestivalEvent[]> {
    try {
      const db = getAdminDb();
      const snap = await db.collection('settings').doc('festivals').get();
      if (snap.exists && snap.data()?.festivals) {
        return snap.data()?.festivals as FestivalEvent[];
      }
    } catch (err) {
      logger.warn({ error: (err as any)?.message, gymId }, 'Could not read festivals from Firestore, using initial fallback');
    }
    return INITIAL_FESTIVALS;
  }

  /**
   * Check if a specific tracking key was already dispatched
   */
  public async isAlreadySent(gymId: string, trackingKey: string): Promise<boolean> {
    const memoryKey = `${gymId}:${trackingKey}`;
    if (this.inMemoryDispatchedKeys.has(memoryKey)) {
      return true;
    }
    try {
      const db = getAdminDb();
      const docRef = db.collection('gyms').doc(gymId).collection('automations_sent').doc(trackingKey);
      const snap = await docRef.get();
      if (snap && snap.exists) {
        this.inMemoryDispatchedKeys.add(memoryKey);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  /**
   * Mark a tracking key as dispatched in Firestore and write to whatsappLogs
   */
  public async markAsSent(
    gymId: string,
    candidate: AutomationCandidate,
    status: 'sent' | 'delivered' | 'failed',
    errorMessage?: string
  ): Promise<WhatsAppMessageLog> {
    const timestamp = new Date().toISOString();
    const logId = `walog-auto-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    // Immediately register in memory
    this.inMemoryDispatchedKeys.add(`${gymId}:${candidate.trackingKey}`);

    const logEntry: WhatsAppMessageLog = {
      id: logId,
      recipientPhone: candidate.phone,
      recipientName: candidate.memberName,
      type:
        candidate.type.startsWith('renewal')
          ? 'expiry_reminder'
          : candidate.type === 'birthday'
          ? 'birthday'
          : 'announcement',
      message: candidate.message,
      status: status === 'failed' ? 'failed' : 'delivered',
      timestamp,
    };

    try {
      const db = getAdminDb();
      // 1. Record deduplication tracking key
      try {
        await db
          .collection('gyms')
          .doc(gymId)
          .collection('automations_sent')
          .doc(candidate.trackingKey)
          .set({
            trackingKey: candidate.trackingKey,
            type: candidate.type,
            memberId: candidate.memberId,
            memberName: candidate.memberName,
            phone: candidate.phone,
            status,
            errorMessage: errorMessage || null,
            dispatchedAt: timestamp,
          });
      } catch (trackErr: any) {
        logger.warn({ error: trackErr?.message, key: candidate.trackingKey }, 'Notice persisting tracking key to automations_sent');
      }

      // 2. Add to global whatsappLogs for full visibility across portals
      try {
        await db.collection('whatsappLogs').doc(logId).set(logEntry);
      } catch (logErr: any) {
        logger.warn({ error: logErr?.message, logId }, 'Notice persisting logEntry to whatsappLogs');
      }
    } catch (err) {
      logger.warn({ error: (err as any)?.message, key: candidate.trackingKey }, 'Could not persist automation log to Firestore');
    }

    return logEntry;
  }

  /**
   * Scan all eligible candidates for renewals (7d, 3d, 1d), birthdays, and major festivals
   */
  public async scanCandidates(
    gymId = 'bsf-mysuru',
    targetDateStr?: string
  ): Promise<{
    candidates: AutomationCandidate[];
    settings: GymSettings;
    todayIST: { dateStr: string; mmdd: string; year: string };
  }> {
    const todayIST = this.getTodayIST(targetDateStr);
    const [settings, members, festivals] = await Promise.all([
      this.loadSettings(gymId),
      this.loadMembers(gymId),
      this.loadFestivals(gymId),
    ]);

    const candidates: AutomationCandidate[] = [];

    // 1. Scan Renewals: 7 days, 3 days, and 1 day prior
    if (settings.enable7DayReminders || settings.enable3DayReminders || settings.enable1DayReminders) {
      for (const member of members) {
        if (!member.expiryDate) continue;
        if ((member.status as string) === 'inactive') continue;

        const daysUntil = this.calculateDaysDifference(todayIST.dateStr, member.expiryDate);
        const recipientPhone = member.whatsapp || member.phone;
        if (!recipientPhone) continue;

        const commonData = {
          MEMBER_NAME: member.fullName,
          EXPIRY_DATE: member.expiryDate,
          DAYS_LEFT: String(daysUntil),
          GYM_NAME: settings.gymName || 'Black Stone Fitness',
          PACKAGE_NAME: member.packageName || 'BSF Membership',
          UPI_ID: settings.upiId || 'blackstonefitness@upi',
          PHONE: settings.phone || '+91 98803 97294',
        };

        // 7 Days Prior
        if (daysUntil === 7 && settings.enable7DayReminders && member.automationOverrides?.reminder7Days !== false) {
          const template =
            settings.reminder7DayTemplate ||
            'Hello {MEMBER_NAME}, your Black Stone Fitness membership will expire in 7 days on {EXPIRY_DATE}. Renew early to lock in your legacy rate & zero admission fees! 💪 - BSF Mysuru';
          candidates.push({
            type: 'renewal_7d',
            memberId: member.id,
            memberName: member.fullName,
            phone: recipientPhone,
            message: this.formatMessage(template, commonData),
            trackingKey: `renewal_7d_${member.id}_${member.expiryDate}`,
            detail: `Plan expires in 7 days on ${member.expiryDate}`,
          });
        }

        // 3 Days Prior
        if (daysUntil === 3 && settings.enable3DayReminders && member.automationOverrides?.reminder3Days !== false) {
          const template =
            settings.reminder3DayTemplate ||
            "Hi {MEMBER_NAME}, only 3 days left on your BSF membership ({EXPIRY_DATE}). Don't break your workout streak! Visit the front desk or renew via UPI. 🏋️‍♂️ - Black Stone Fitness";
          candidates.push({
            type: 'renewal_3d',
            memberId: member.id,
            memberName: member.fullName,
            phone: recipientPhone,
            message: this.formatMessage(template, commonData),
            trackingKey: `renewal_3d_${member.id}_${member.expiryDate}`,
            detail: `Plan expires in 3 days on ${member.expiryDate}`,
          });
        }

        // 1 Day Prior
        if (daysUntil === 1 && settings.enable1DayReminders && member.automationOverrides?.reminder1Day !== false) {
          const template =
            settings.reminder1DayTemplate ||
            'FINAL REMINDER: Hi {MEMBER_NAME}, your BSF membership expires tomorrow ({EXPIRY_DATE}). Renew today to keep seamless gym access. ⚡ - Team BSF Mysuru';
          candidates.push({
            type: 'renewal_1d',
            memberId: member.id,
            memberName: member.fullName,
            phone: recipientPhone,
            message: this.formatMessage(template, commonData),
            trackingKey: `renewal_1d_${member.id}_${member.expiryDate}`,
            detail: `Plan expires tomorrow on ${member.expiryDate}`,
          });
        }
      }
    }

    // 2. Scan Birthdays: Exactly on the member's birthday
    if (settings.enableBirthdayGreetings) {
      for (const member of members) {
        if (!member.dob) continue;
        if ((member.status as string) === 'inactive') continue;
        if (member.automationOverrides?.birthdayWish === false) continue;

        const memberPhone = member.whatsapp || member.phone;
        if (!memberPhone) continue;

        // Compare month & day (e.g., '09-04')
        const dobParts = member.dob.split('-');
        if (dobParts.length === 3) {
          const memberMMDD = `${dobParts[1]}-${dobParts[2]}`;
          if (memberMMDD === todayIST.mmdd) {
            const template =
              settings.birthdayTemplate ||
              '🎉 Happy Birthday, {MEMBER_NAME}! 🎂 The entire Black Stone Fitness family wishes you a healthy, strong, and powerhouse year ahead. Keep crushing your goals! 💪🔥 — Team BSF Mysuru';
            candidates.push({
              type: 'birthday',
              memberId: member.id,
              memberName: member.fullName,
              phone: memberPhone,
              message: this.formatMessage(template, {
                MEMBER_NAME: member.fullName,
                GYM_NAME: settings.gymName || 'Black Stone Fitness',
              }),
              trackingKey: `birthday_${member.id}_${todayIST.year}`,
              detail: `Celebrates birthday today (${member.dob})`,
            });
          }
        }
      }
    }

    // 3. Scan Major Festivals matching today's calendar date
    for (const fest of festivals) {
      if (!fest.enabled) continue;

      let isTodayFestival = false;
      if (fest.monthDay && fest.monthDay === todayIST.mmdd) {
        isTodayFestival = true;
      } else if (fest.dateString && fest.dateString.includes(todayIST.dateStr)) {
        isTodayFestival = true;
      }

      if (isTodayFestival) {
        for (const member of members) {
          if ((member.status as string) === 'inactive') continue;
          if (member.automationOverrides?.festivalGreetings === false) continue;

          const memberPhone = member.whatsapp || member.phone;
          if (!memberPhone) continue;

          const template = fest.messageTemplate;
          candidates.push({
            type: 'festival',
            memberId: member.id,
            memberName: member.fullName,
            phone: memberPhone,
            message: this.formatMessage(template, {
              MEMBER_NAME: member.fullName,
              FESTIVAL_NAME: fest.name,
              GYM_NAME: settings.gymName || 'Black Stone Fitness',
            }),
            trackingKey: `festival_${fest.id}_${member.id}_${todayIST.year}`,
            detail: `Festival: ${fest.name}`,
            festivalId: fest.id,
            festivalName: fest.name,
          });
        }
      }
    }

    return { candidates, settings, todayIST };
  }

  /**
   * Run automated checking and dispatching
   */
  public async runDailyAutomations(
    gymId = 'bsf-mysuru',
    options?: {
      force?: boolean;
      dryRun?: boolean;
      type?: 'all' | 'renewals' | 'birthdays' | 'festivals';
      customDate?: string;
    }
  ): Promise<AutomationRunResult> {
    if (this.isRunning) {
      logger.info('Automation check already running, skipping overlapping execution');
      return {
        success: false,
        timestamp: new Date().toISOString(),
        targetDate: this.getTodayIST().dateStr,
        summary: {
          totalCandidates: 0,
          totalSent: 0,
          alreadySentCount: 0,
          renewals7d: { sent: 0, candidates: [] },
          renewals3d: { sent: 0, candidates: [] },
          renewals1d: { sent: 0, candidates: [] },
          birthdays: { sent: 0, candidates: [] },
          festivals: { sent: 0, candidates: [] },
          skipped: 0,
          failureReasons: ['Automation is currently executing a previous batch'],
          errors: ['Automation is currently executing a previous batch'],
        },
        dispatchedLogs: [],
      };
    }

    this.isRunning = true;
    const force = options?.force ?? false;
    const dryRun = options?.dryRun ?? false;
    const filterType = options?.type ?? 'all';

    try {
      const { candidates, todayIST } = await this.scanCandidates(gymId, options?.customDate);

      // Filter candidates if requested
      const eligibleCandidates = candidates.filter((c) => {
        if (filterType === 'all') return true;
        if (filterType === 'renewals') return c.type.startsWith('renewal');
        if (filterType === 'birthdays') return c.type === 'birthday';
        if (filterType === 'festivals') return c.type === 'festival';
        return true;
      });

      const result: AutomationRunResult = {
        success: true,
        timestamp: new Date().toISOString(),
        targetDate: todayIST.dateStr,
        summary: {
          totalCandidates: eligibleCandidates.length,
          totalSent: 0,
          alreadySentCount: 0,
          renewals7d: { sent: 0, candidates: [] },
          renewals3d: { sent: 0, candidates: [] },
          renewals1d: { sent: 0, candidates: [] },
          birthdays: { sent: 0, candidates: [] },
          festivals: { sent: 0, candidates: [] },
          skipped: 0,
        },
        dispatchedLogs: [],
      };

      let status = await sessionManager.getStatus(gymId);
      let isConnected = status.status === 'connected';

      // Proactive on-demand connection: If not connected yet, check if valid credentials exist and connect!
      if (!isConnected && !dryRun) {
        const hasAuth = await sessionManager.hasValidSavedAuth(gymId);
        if (hasAuth) {
          logger.info({ gymId }, 'WhatsApp automation run: gateway inactive with saved credentials; auto-connecting now...');
          try {
            await sessionManager.connect(gymId, false);
            // Wait up to 6 seconds for connection to open
            for (let i = 0; i < 12; i++) {
              await new Promise((resolve) => setTimeout(resolve, 500));
              status = await sessionManager.getStatus(gymId);
              if (status.status === 'connected') {
                isConnected = true;
                break;
              }
            }
          } catch (connErr: any) {
            logger.warn({ error: connErr?.message, gymId }, 'Automation on-demand connect notice');
          }
        }
      }

      logger.info(
        {
          gymId,
          candidatesCount: eligibleCandidates.length,
          force,
          dryRun,
          filterType,
          isConnected,
        },
        'Executing WhatsApp automation check'
      );

      // If WhatsApp is awaiting pairing/connection and this is not a dry-run preview:
      if (!isConnected && !dryRun) {
        for (const candidate of eligibleCandidates) {
          if (candidate.type === 'renewal_7d') {
            result.summary.renewals7d.candidates.push(`${candidate.memberName} (${candidate.phone})`);
          } else if (candidate.type === 'renewal_3d') {
            result.summary.renewals3d.candidates.push(`${candidate.memberName} (${candidate.phone})`);
          } else if (candidate.type === 'renewal_1d') {
            result.summary.renewals1d.candidates.push(`${candidate.memberName} (${candidate.phone})`);
          } else if (candidate.type === 'birthday') {
            result.summary.birthdays.candidates.push(`${candidate.memberName} (${candidate.phone})`);
          } else if (candidate.type === 'festival') {
            result.summary.festivals.festivalName = candidate.festivalName;
            result.summary.festivals.candidates.push(`${candidate.memberName} (${candidate.phone})`);
          }
          result.summary.skipped++;
        }

        result.summary.notice = `WhatsApp gateway is awaiting connection in the Admin Panel. ${eligibleCandidates.length} candidate(s) queued for automatic delivery upon pairing.`;

        logger.info(
          {
            gymId,
            queuedCount: eligibleCandidates.length,
            notice: result.summary.notice,
          },
          'WhatsApp automation check evaluated: gateway awaiting device connection'
        );

        // Do not lock today's date so scheduled background runs will dispatch once linked
        return result;
      }

      const failureList: string[] = [];

      for (const candidate of eligibleCandidates) {
        // Check deduplication unless force
        if (!force) {
          const alreadySent = await this.isAlreadySent(gymId, candidate.trackingKey);
          if (alreadySent) {
            result.summary.alreadySentCount++;
            result.summary.skipped++;
            continue;
          }
        }

        // Record tracking metrics
        if (candidate.type === 'renewal_7d') {
          result.summary.renewals7d.candidates.push(`${candidate.memberName} (${candidate.phone})`);
        } else if (candidate.type === 'renewal_3d') {
          result.summary.renewals3d.candidates.push(`${candidate.memberName} (${candidate.phone})`);
        } else if (candidate.type === 'renewal_1d') {
          result.summary.renewals1d.candidates.push(`${candidate.memberName} (${candidate.phone})`);
        } else if (candidate.type === 'birthday') {
          result.summary.birthdays.candidates.push(`${candidate.memberName} (${candidate.phone})`);
        } else if (candidate.type === 'festival') {
          result.summary.festivals.festivalName = candidate.festivalName;
          result.summary.festivals.candidates.push(`${candidate.memberName} (${candidate.phone})`);
        }

        if (dryRun) {
          // Preview mode: simulate dispatch without socket send
          result.summary.totalSent++;
          const simLog: WhatsAppMessageLog = {
            id: `walog-dry-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            recipientPhone: candidate.phone,
            recipientName: candidate.memberName,
            type: candidate.type.startsWith('renewal') ? 'expiry_reminder' : candidate.type === 'birthday' ? 'birthday' : 'announcement',
            message: candidate.message,
            status: 'delivered',
            timestamp: new Date().toISOString(),
          };
          result.dispatchedLogs.push(simLog);
          continue;
        }

        try {
          // Dispatch live message through Baileys socket
          const sendRes = await WhatsAppMessageService.getInstance().sendMessage(
            gymId,
            candidate.phone,
            candidate.message
          );

          if (sendRes.success) {
            result.summary.totalSent++;
            if (candidate.type === 'renewal_7d') result.summary.renewals7d.sent++;
            if (candidate.type === 'renewal_3d') result.summary.renewals3d.sent++;
            if (candidate.type === 'renewal_1d') result.summary.renewals1d.sent++;
            if (candidate.type === 'birthday') result.summary.birthdays.sent++;
            if (candidate.type === 'festival') result.summary.festivals.sent++;

            const log = await this.markAsSent(gymId, candidate, 'delivered');
            result.dispatchedLogs.push(log);
          } else {
            const failMsg = `Failed to send to ${candidate.memberName}: ${sendRes.error}`;
            failureList.push(failMsg);
            await this.markAsSent(gymId, candidate, 'failed', sendRes.error);
          }

          // Anti-flood pacing delay between messages (300ms)
          await new Promise((resolve) => setTimeout(resolve, 300));
        } catch (sendErr: any) {
          logger.error({ error: sendErr?.message, candidate }, 'Automation dispatch exception');
          const failMsg = `Error sending to ${candidate.memberName}: ${sendErr?.message}`;
          failureList.push(failMsg);
        }
      }

      if (failureList.length > 0) {
        result.summary.failureReasons = failureList;
        result.summary.errors = failureList;
      }

      this.lastRunDateIST = todayIST.dateStr;
      this.lastRunTimestamp = new Date().toISOString();

      // Persist daily schedule metadata to Firestore
      try {
        const db = getAdminDb();
        await db.collection('gyms').doc(gymId).collection('automations_meta').doc('daily_schedule').set(
          {
            lastRunDateIST: todayIST.dateStr,
            lastRunTimestamp: this.lastRunTimestamp,
            scheduledDailyTime: '09:00 AM IST',
            totalCandidates: result.summary.totalCandidates,
            totalSent: result.summary.totalSent,
            alreadySentCount: result.summary.alreadySentCount,
            renewals7dSent: result.summary.renewals7d.sent,
            renewals3dSent: result.summary.renewals3d.sent,
            renewals1dSent: result.summary.renewals1d.sent,
            birthdaysSent: result.summary.birthdays.sent,
            festivalsSent: result.summary.festivals.sent,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (metaErr: any) {
        logger.warn({ error: metaErr?.message, gymId }, 'Notice: persisting daily_schedule metadata');
      }

      const { errors, failureReasons, ...cleanSummary } = result.summary;
      logger.info(
        {
          summary: {
            ...cleanSummary,
            ...(failureList.length > 0 ? { failureReasons: failureList } : {}),
          },
        },
        'WhatsApp automation check completed'
      );
      return result;
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Called automatically whenever the WhatsApp socket connects or reconnects.
   * Immediately inspects and dispatches any pending automated messages for today.
   */
  public async onWhatsAppConnected(gymId = 'bsf-mysuru'): Promise<void> {
    try {
      await this.loadLastRunMeta(gymId);
      const ist = this.getCurrentISTTime();
      logger.info(
        { gymId, dateIST: ist.dateStr, time: `${ist.hour}:${ist.minute}`, lastRunDateIST: this.lastRunDateIST },
        'WhatsApp connection opened: checking for pending automations to dispatch...'
      );

      // If during active daytime hours (>= 9:00 AM IST) and today's run has not executed:
      if (ist.hour >= 9 && this.lastRunDateIST !== ist.dateStr && !this.isRunning) {
        logger.info(
          { gymId, dateIST: ist.dateStr },
          'Auto-dispatching pending daily WhatsApp automations upon connection open'
        );
        await this.runDailyAutomations(gymId, { force: false });
      }
    } catch (err: any) {
      logger.warn({ error: err?.message, gymId }, 'Notice in onWhatsAppConnected automation check');
    }
  }

  /**
   * Schedules precision timer targeting the next 9:00:00 AM IST
   */
  public scheduleNextDaily9AMRun(gymId = 'bsf-mysuru'): void {
    if (this.dailyTimer) {
      clearTimeout(this.dailyTimer);
      this.dailyTimer = null;
    }

    const { delayMs, targetDateIST } = this.getMillisUntilNext9AMIST();
    const delayHours = (delayMs / (1000 * 60 * 60)).toFixed(2);

    logger.info(
      {
        scheduledDailyTime: '09:00 AM IST',
        nextRunTargetIST: `${targetDateIST} 09:00 AM IST`,
        inHours: delayHours,
      },
      'Registered autonomous daily 9:00 AM IST WhatsApp timer'
    );

    this.dailyTimer = setTimeout(async () => {
      try {
        const ist = this.getCurrentISTTime();
        logger.info(
          { dateIST: ist.dateStr, time: `${ist.hour}:${ist.minute}` },
          'Timer fired: Executing scheduled daily 9:00 AM IST WhatsApp automation run'
        );
        await this.runDailyAutomations(gymId, { force: false });
      } catch (err: any) {
        logger.error({ error: err?.message }, 'Exception in scheduled 9:00 AM IST daily WhatsApp automation');
      } finally {
        // Schedule next day's 9:00 AM run
        this.scheduleNextDaily9AMRun(gymId);
      }
    }, delayMs);
  }

  /**
   * Start recurring automated scheduler in Node.js
   * Runs autonomously every day at 9:00 AM IST without requiring any external input.
   * Includes safety heartbeat checks to recover seamlessly across server reboots.
   */
  public startBackgroundScheduler(gymId = 'bsf-mysuru'): void {
    if (this.backgroundInterval || this.dailyTimer) {
      logger.info('WhatsApp automated 9:00 AM IST background scheduler is already active');
      return;
    }

    logger.info('Starting autonomous WhatsApp daily 9:00 AM IST background scheduler (zero external input required)');

    // 1. Load persisted last run state and check if catch-up is needed
    setTimeout(async () => {
      try {
        await this.loadLastRunMeta(gymId);
        const ist = this.getCurrentISTTime();

        // If server started after 9:00 AM IST and today's run has not been executed yet:
        if (ist.hour >= 9 && this.lastRunDateIST !== ist.dateStr) {
          logger.info(
            { currentHour: ist.hour, today: ist.dateStr, lastRun: this.lastRunDateIST },
            'Server started after 9:00 AM IST with run pending. Auto-dispatching today\'s scheduled WhatsApp automations...'
          );
          await this.runDailyAutomations(gymId, { force: false });
        }
      } catch (err: any) {
        logger.warn({ error: err?.message }, 'Startup automation check notice');
      }
    }, 15000);

    // 2. Schedule exact precision timer targeting the upcoming 9:00:00 AM IST
    this.scheduleNextDaily9AMRun(gymId);

    // 3. Active 60-second safety heartbeat check
    // Guarantees execution even if container time sleeps or drifts across the 9:00 AM boundary
    this.backgroundInterval = setInterval(async () => {
      try {
        const ist = this.getCurrentISTTime();

        // If time is 9:00 AM IST or later and today's run has not been executed yet
        if (ist.hour >= 9 && this.lastRunDateIST !== ist.dateStr && !this.isRunning) {
          logger.info(
            {
              scheduledTime: '09:00 AM IST',
              currentHour: ist.hour,
              currentMinute: ist.minute,
              date: ist.dateStr,
            },
            'Daily 9:00 AM IST WhatsApp automation due — autonomous dispatch triggered'
          );
          await this.runDailyAutomations(gymId, { force: false });
        }
        // Daytime periodic sweep: every 30 minutes between 9:00 AM and 8:00 PM IST
        // Ensures any newly eligible candidates or temporarily delayed messages are dispatched automatically.
        // Strict deduplication (isAlreadySent) guarantees no member receives duplicate messages.
        else if (ist.hour >= 9 && ist.hour <= 20 && !this.isRunning) {
          if (ist.minute === 0 || ist.minute === 30) {
            logger.info(
              { dateIST: ist.dateStr, hour: ist.hour, minute: ist.minute },
              'Daytime 30-min WhatsApp sweep: checking for new/pending automated messages'
            );
            await this.runDailyAutomations(gymId, { force: false });
          }
        }
      } catch (err: any) {
        logger.error({ error: err?.message }, 'Error in automated WhatsApp 9:00 AM background heartbeat');
      }
    }, 60 * 1000);
  }

  /**
   * Shutdown scheduler gracefully
   */
  public stopBackgroundScheduler(): void {
    if (this.dailyTimer) {
      clearTimeout(this.dailyTimer);
      this.dailyTimer = null;
    }
    if (this.backgroundInterval) {
      clearInterval(this.backgroundInterval);
      this.backgroundInterval = null;
    }
    logger.info('WhatsApp 9:00 AM IST background scheduler stopped');
  }
}

export const automationService = WhatsAppAutomationService.getInstance();
