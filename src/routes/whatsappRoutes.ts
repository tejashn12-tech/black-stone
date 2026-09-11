import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import { sessionManager } from '../services/WhatsAppSessionManager';
import { messageService } from '../services/WhatsAppMessageService';
import { logger } from '../utils/logger';
import type { AuthenticatedRequest } from '../types/whatsapp';

const router = Router();

/**
 * POST /api/whatsapp/connect
 * Authentication required.
 * Backend determines the user's gym via Firebase Token + Firestore.
 * Starts a live Baileys WhatsApp connection.
 */
router.post('/connect', authenticate, async (req: AuthenticatedRequest, res) => {
  const gymId = req.gymId;

  if (!gymId) {
    res.status(403).json({
      success: false,
      error: 'No authorized gym associated with user profile',
    });
    return;
  }

  try {
    const forceNew = Boolean(req.body?.force);
    logger.info({ gymId, uid: req.user?.uid, forceNew }, 'Request to connect WhatsApp session');
    const result = await sessionManager.connect(gymId, false, forceNew);

    const statusData = await sessionManager.getStatus(gymId);
    res.status(result.success ? 200 : 500).json({
      success: result.success,
      status: result.status,
      sessionId: result.sessionId,
      qr: result.qr || statusData.qr,
      ...(result.error ? { error: result.error } : {}),
    });
  } catch (err: any) {
    logger.error({ error: err?.message, gymId }, 'Error in /api/whatsapp/connect');
    res.status(500).json({
      success: false,
      error: err?.message || 'Internal server error while connecting WhatsApp',
    });
  }
});

/**
 * GET /api/whatsapp/status
 * Authentication required.
 * Returns the exact live QR string only while waiting for scan.
 * Never returns authentication credentials.
 */
router.get('/status', authenticate, async (req: AuthenticatedRequest, res) => {
  const gymId = req.gymId;

  if (!gymId) {
    res.status(403).json({
      success: false,
      error: 'No authorized gym associated with user profile',
    });
    return;
  }

  try {
    const statusData = await sessionManager.getStatus(gymId);
    res.json(statusData);
  } catch (err: any) {
    logger.error({ error: err?.message, gymId }, 'Error in /api/whatsapp/status');
    res.status(500).json({
      success: false,
      error: err?.message || 'Internal server error while fetching status',
    });
  }
});

/**
 * POST /api/whatsapp/disconnect
 * Authentication required.
 * Closes Baileys socket, deletes auth_info/{gymId}/ state, clears memory, updates Firestore.
 */
router.post('/disconnect', authenticate, async (req: AuthenticatedRequest, res) => {
  const gymId = req.gymId;

  if (!gymId) {
    res.status(403).json({
      success: false,
      error: 'No authorized gym associated with user profile',
    });
    return;
  }

  try {
    logger.info({ gymId, uid: req.user?.uid }, 'Request to disconnect WhatsApp session');
    const result = await sessionManager.disconnect(gymId);
    res.json(result);
  } catch (err: any) {
    logger.error({ error: err?.message, gymId }, 'Error in /api/whatsapp/disconnect');
    res.status(500).json({
      success: false,
      error: err?.message || 'Internal server error while disconnecting WhatsApp',
    });
  }
});

/**
 * POST /api/whatsapp/pair
 * Authentication required.
 * Marks WhatsApp session as paired and ready for automated messages.
 */
router.post('/pair', authenticate, async (req: AuthenticatedRequest, res) => {
  const gymId = req.gymId || 'bsf-mysuru';
  const { phoneNumber } = req.body || {};
  const safePhone = phoneNumber || '+91 8197299039';

  try {
    await sessionManager.setPairedStatus(gymId, safePhone);
    logger.info({ gymId, phoneNumber: safePhone }, 'WhatsApp device session marked paired in backend');
    res.json({
      success: true,
      status: 'connected',
      phoneNumber: safePhone,
    });
  } catch (err: any) {
    logger.error({ error: err?.message, gymId }, 'Error in /api/whatsapp/pair');
    res.status(500).json({
      success: false,
      error: err?.message || 'Failed to update WhatsApp paired status',
    });
  }
});

/**
 * POST /api/whatsapp/send
 * Authentication required.
 * Sends a real message via the gym's active Baileys socket.
 */
router.post('/send', authenticate, async (req: AuthenticatedRequest, res) => {
  const gymId = req.gymId || 'bsf-mysuru';
  const { phoneNumber, message } = req.body;

  if (!phoneNumber || !message) {
    res.status(400).json({
      success: false,
      error: 'Both "phoneNumber" and "message" are required in the request body',
    });
    return;
  }

  try {
    const result = await messageService.sendMessage(gymId, phoneNumber, message);
    if (!result.success) {
      res.status(400).json(result);
      return;
    }
    res.json(result);
  } catch (err: any) {
    logger.error({ error: err?.message, gymId, phoneNumber }, 'Error in /api/whatsapp/send');
    res.status(500).json({
      success: false,
      error: err?.message || 'Internal server error while dispatching WhatsApp message',
    });
  }
});

/**
 * GET /api/whatsapp/automations/status
 * Get status of today's automated messages: renewals (7d, 3d, 1d), birthdays, festivals
 */
router.get('/automations/status', authenticate, async (req: AuthenticatedRequest, res) => {
  const gymId = req.gymId || 'bsf-mysuru';
  try {
    const { automationService } = await import('../services/WhatsAppAutomationService');
    const { candidates, settings, todayIST } = await automationService.scanCandidates(gymId);
    const schedule = automationService.getScheduleInfo();

    const renewals7d = candidates.filter((c) => c.type === 'renewal_7d');
    const renewals3d = candidates.filter((c) => c.type === 'renewal_3d');
    const renewals1d = candidates.filter((c) => c.type === 'renewal_1d');
    const birthdays = candidates.filter((c) => c.type === 'birthday');
    const festivals = candidates.filter((c) => c.type === 'festival');

    res.json({
      success: true,
      gymId,
      todayIST,
      schedule,
      settings: {
        enable7DayReminders: settings.enable7DayReminders,
        enable3DayReminders: settings.enable3DayReminders,
        enable1DayReminders: settings.enable1DayReminders,
        enableBirthdayGreetings: settings.enableBirthdayGreetings,
      },
      counts: {
        total: candidates.length,
        renewals7d: renewals7d.length,
        renewals3d: renewals3d.length,
        renewals1d: renewals1d.length,
        birthdays: birthdays.length,
        festivals: festivals.length,
      },
      candidates: candidates.slice(0, 50),
    });
  } catch (err: any) {
    logger.error({ error: err?.message, gymId }, 'Error in /api/whatsapp/automations/status');
    res.status(500).json({
      success: false,
      error: err?.message || 'Internal server error scanning automations',
    });
  }
});

/**
 * POST /api/whatsapp/automations/run
 * Execute automated scan and dispatch for renewals, birthdays, and festivals
 */
router.post('/automations/run', authenticate, async (req: AuthenticatedRequest, res) => {
  const gymId = req.gymId || 'bsf-mysuru';
  const { force, dryRun, type, customDate } = req.body || {};

  try {
    const { automationService } = await import('../services/WhatsAppAutomationService');
    const result = await automationService.runDailyAutomations(gymId, {
      force: Boolean(force),
      dryRun: Boolean(dryRun),
      type,
      customDate,
    });
    res.json(result);
  } catch (err: any) {
    logger.error({ error: err?.message, gymId }, 'Error in /api/whatsapp/automations/run');
    res.status(500).json({
      success: false,
      error: err?.message || 'Internal server error executing automations',
    });
  }
});

/**
 * POST /api/whatsapp/automations/test
 * Send a test automation message (7d, 3d, 1d renewal, birthday, or festival) to a target phone
 */
router.post('/automations/test', authenticate, async (req: AuthenticatedRequest, res) => {
  const gymId = req.gymId || 'bsf-mysuru';
  const { testPhone, templateType, memberName = 'Test Member', customMessage } = req.body || {};

  if (!testPhone) {
    res.status(400).json({ success: false, error: '"testPhone" is required' });
    return;
  }

  try {
    const { automationService } = await import('../services/WhatsAppAutomationService');
    const settings = await automationService.loadSettings(gymId);
    let messageToSend = customMessage;

    if (!messageToSend) {
      const commonData = {
        MEMBER_NAME: memberName,
        EXPIRY_DATE: new Date(Date.now() + 7 * 86400000).toLocaleDateString('en-IN'),
        DAYS_LEFT: templateType === 'renewal_3d' ? '3' : templateType === 'renewal_1d' ? '1' : '7',
        GYM_NAME: settings.gymName || 'Black Stone Fitness',
        PACKAGE_NAME: '3 Months Power Builder',
        UPI_ID: settings.upiId || 'blackstonefitness@upi',
        PHONE: settings.phone || '+91 98803 97294',
        FESTIVAL_NAME: 'Mysuru Dasara',
      };

      if (templateType === 'renewal_7d') {
        messageToSend = automationService.formatMessage(settings.reminder7DayTemplate, commonData);
      } else if (templateType === 'renewal_3d') {
        messageToSend = automationService.formatMessage(settings.reminder3DayTemplate, commonData);
      } else if (templateType === 'renewal_1d') {
        messageToSend = automationService.formatMessage(settings.reminder1DayTemplate, commonData);
      } else if (templateType === 'birthday') {
        messageToSend = automationService.formatMessage(settings.birthdayTemplate, commonData);
      } else if (templateType === 'festival') {
        messageToSend = `🐘 ದಸರಾ ಹಬ್ಬದ ಹಾರ್ದಿಕ ಶುಭಾಶಯಗಳು! Happy Mysuru Dasara to ${memberName} & family! May strength, discipline, and power bless your fitness journey! 👑✨ — Team ${settings.gymName}`;
      } else {
        messageToSend = `[BSF TEST] Automated alert test for ${memberName}. System active and operational! 💪🏋️`;
      }
    }

    const result = await messageService.sendMessage(gymId, testPhone, messageToSend);
    res.json({
      success: result.success,
      testPhone,
      templateType,
      message: messageToSend,
      error: result.error,
    });
  } catch (err: any) {
    logger.error({ error: err?.message, gymId, testPhone }, 'Error in /api/whatsapp/automations/test');
    res.status(500).json({
      success: false,
      error: err?.message || 'Failed to dispatch test message',
    });
  }
});

export default router;
