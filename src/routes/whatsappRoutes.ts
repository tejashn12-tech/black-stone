import { Router, Response } from 'express';
import { WhatsAppService } from '../whatsapp/WhatsAppService';
import {
  WhatsAppError,
  WhatsAppRateLimitError,
  WhatsAppSendInProgressError
} from '../whatsapp/errors/WhatsAppErrors';
import { AuthenticatedRequest } from '../middleware/authenticate';
import { MessageRateLimiter } from '../whatsapp/ratelimit/MessageRateLimiter';
import { IdempotencyManager } from '../whatsapp/idempotency/IdempotencyManager';
import { RenewalAutomationService } from '../whatsapp/automation/RenewalAutomationService';
import { getAdminDb } from '../config/firebase';

export const whatsappRoutes = Router();
const whatsappService = WhatsAppService.getInstance();
const rateLimiter = MessageRateLimiter.getInstance();
const idempotencyManager = IdempotencyManager.getInstance();
const renewalService = RenewalAutomationService.getInstance();

/**
 * GET /api/whatsapp/status
 * Fetches the current connection status, device info, and error status
 */
whatsappRoutes.get('/status', (_req: AuthenticatedRequest, res: Response): void => {
  try {
    const status = whatsappService.getStatus();
    res.json({
      success: true,
      ...status
    });
  } catch (err: any) {
    console.error('[whatsappRoutes] Error getting status:', err);
    res.status(500).json({
      success: false,
      error: err?.message || 'Failed to retrieve WhatsApp status.'
    });
  }
});

/**
 * GET /api/whatsapp/qr
 * Retrieves the current server-generated Base64 PNG QR code
 */
whatsappRoutes.get('/qr', (_req: AuthenticatedRequest, res: Response): void => {
  try {
    const qrData = whatsappService.getQr();
    res.json({
      success: true,
      ...qrData
    });
  } catch (err: any) {
    console.error('[whatsappRoutes] Error getting QR code:', err);
    res.status(500).json({
      success: false,
      error: err?.message || 'Failed to retrieve WhatsApp QR code.'
    });
  }
});

/**
 * GET /api/whatsapp/diagnostics
 * GET /api/whatsapp/health
 * Returns comprehensive, real-time subsystem diagnostics.
 * Strictly does not expose credentials, private keys, session files, or sensitive server info.
 */
whatsappRoutes.get(['/diagnostics', '/health'], (_req: AuthenticatedRequest, res: Response): void => {
  try {
    const diagnostics = whatsappService.getDiagnostics();
    res.json({
      success: true,
      diagnostics
    });
  } catch (err: any) {
    console.error('[whatsappRoutes] Error retrieving WhatsApp diagnostics:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve WhatsApp diagnostics.',
      diagnostics: {
        whatsAppService: 'OFFLINE',
        baileysConnection: 'DISCONNECTED',
        authentication: 'UNKNOWN',
        lastSuccessfulConnection: null,
        lastDisconnect: null,
        lastDisconnectReason: err?.message || 'Internal diagnostics evaluation failure',
        lastMessageAttempt: null,
        lastSuccessfulMessage: null,
        messagesQueued: 0,
        messagesSending: 0,
        messagesSent: 0,
        messagesFailed: 0,
        reconnectAttempts: 0,
        qrCurrentlyAvailable: false,
        diagnosticsTimestamp: new Date().toISOString()
      }
    });
  }
});

/**
 * POST /api/whatsapp/connect
 * Initiates the Baileys socket connection and QR generation
 */
whatsappRoutes.post('/connect', async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    whatsappService.connect().catch((err) => {
      console.warn('[whatsappRoutes] Connection background notice:', err?.message);
    });

    res.json({
      success: true,
      message: 'WhatsApp connection initiated.',
      ...whatsappService.getStatus()
    });
  } catch (err: any) {
    console.error('[whatsappRoutes] Error connecting WhatsApp:', err);
    res.status(500).json({
      success: false,
      error: err?.message || 'Failed to initiate WhatsApp connection.'
    });
  }
});

/**
 * POST /api/whatsapp/disconnect
 * Disconnects socket or unlinks device
 */
whatsappRoutes.post('/disconnect', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const logout = req.body?.logout === true;
    const updatedStatus = await whatsappService.disconnect(logout);

    res.json({
      success: true,
      message: logout ? 'Device unlinked and logged out.' : 'WhatsApp socket disconnected.',
      ...updatedStatus
    });
  } catch (err: any) {
    console.error('[whatsappRoutes] Error disconnecting WhatsApp:', err);
    res.status(500).json({
      success: false,
      error: err?.message || 'Failed to disconnect WhatsApp.'
    });
  }
});

/**
 * POST /api/whatsapp/send
 * Dispatches a WhatsApp message to a recipient with:
 * - Idempotency key protection (Firestore transactions)
 * - Rate limiting and recipient cooldown
 * - Truthful delivery status tracking
 */
whatsappRoutes.post('/send', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { to, text, type, recipientName, memberId, receiptNo } = req.body || {};

    // Support idempotency key from body or HTTP headers
    const headerIdempotencyKey = (req.headers['idempotency-key'] || req.headers['x-idempotency-key']) as string | undefined;
    const rawIdempotencyKey = req.body?.idempotencyKey || headerIdempotencyKey;
    const idempotencyKey = typeof rawIdempotencyKey === 'string' && rawIdempotencyKey.trim()
      ? rawIdempotencyKey.trim()
      : undefined;

    if (!to || typeof to !== 'string') {
      res.status(400).json({
        success: false,
        error: 'Recipient phone number ("to") is required.'
      });
      return;
    }

    if (!text || typeof text !== 'string' || !text.trim()) {
      res.status(400).json({
        success: false,
        error: 'Message content ("text") cannot be empty.'
      });
      return;
    }

    const result = await whatsappService.sendMessage({
      to,
      text: text.trim(),
      type: type || 'custom',
      recipientName,
      memberId,
      receiptNo,
      idempotencyKey
    });

    res.json(result);
  } catch (err: any) {
    if (err instanceof WhatsAppRateLimitError) {
      res.setHeader('Retry-After', String(err.retryAfterSeconds));
      res.status(429).json({
        success: false,
        code: err.code,
        error: err.message,
        retryAfterSeconds: err.retryAfterSeconds
      });
      return;
    }

    if (err instanceof WhatsAppSendInProgressError) {
      res.status(409).json({
        success: false,
        code: err.code,
        error: err.message,
        inFlightRecord: err.inFlightRecord
      });
      return;
    }

    if (err instanceof WhatsAppError) {
      res.status(err.statusCode).json({
        success: false,
        code: err.code,
        error: err.message
      });
      return;
    }

    console.error('[whatsappRoutes] Error sending message:', err?.message);
    res.status(500).json({
      success: false,
      error: 'Unable to deliver message due to a connection or network issue.'
    });
  }
});

/**
 * GET /api/whatsapp/messages
 * Retrieves tracked messages and truthful status histories
 */
whatsappRoutes.get('/messages', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const limit = Math.min(parseInt(req.query?.limit as string) || 50, 100);
    const messages = whatsappService.getRecentMessages(limit);
    res.json({
      success: true,
      messages
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve message logs.'
    });
  }
});

/**
 * GET /api/whatsapp/messages/:id
 * Retrieves a specific message by tracking ID or Baileys ID with its full transition timeline
 */
whatsappRoutes.get('/messages/:id', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const message = whatsappService.getMessage(req.params.id);
    if (!message) {
      res.status(404).json({
        success: false,
        error: 'Message not found.'
      });
      return;
    }
    res.json({
      success: true,
      message
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve message details.'
    });
  }
});

/**
 * GET /api/whatsapp/idempotency/:key
 * Retrieves state of an idempotency key (verification for clients)
 */
whatsappRoutes.get('/idempotency/:key', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const key = req.params.key;
    const record = await idempotencyManager.getRecord(key);

    if (!record) {
      res.status(404).json({
        success: false,
        exists: false,
        message: 'No idempotency record found for this key.'
      });
      return;
    }

    res.json({
      success: true,
      exists: true,
      record
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err?.message || 'Failed to inspect idempotency record.'
    });
  }
});

/**
 * POST /api/whatsapp/test
 * Sends a pre-configured test message to verify active connectivity with:
 * - Protection against accidental double-clicks (server-side cooldown & debounce)
 * - Rate limiting
 */
whatsappRoutes.post('/test', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { testPhone, testType = 'connectivity', idempotencyKey, message, text } = req.body || {};

    if (!testPhone) {
      res.status(400).json({
        success: false,
        error: 'testPhone parameter is required.'
      });
      return;
    }

    // Server-side double-click protection check
    const doubleClickCheck = rateLimiter.checkTestDoubleDispatch(testPhone);
    if (!doubleClickCheck.allowed) {
      res.setHeader('Retry-After', String(doubleClickCheck.retryAfterSeconds || 5));
      res.status(429).json({
        success: false,
        code: 'TEST_COOLDOWN_ACTIVE',
        error: doubleClickCheck.reason || 'Please wait before sending another test message.',
        retryAfterSeconds: doubleClickCheck.retryAfterSeconds || 5
      });
      return;
    }

    const customContent = (typeof message === 'string' && message.trim()) || (typeof text === 'string' && text.trim()) || '';
    const testMessage = customContent || (
      `*BLACK STONE FITNESS - SYSTEM TEST* 🏋️‍♂️\n\n` +
      `Hello! This is an idempotent test message dispatched via the Blackstone Fitness WhatsApp Gateway.\n\n` +
      `• *Test Type:* ${testType}\n` +
      `• *Timestamp:* ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}\n` +
      `• *Status:* Operational & Active\n` +
      `• *Double-Click Protection:* Active\n\n` +
      `If you received this message, the Baileys multi-device socket integration is operating normally.`
    );

    // Generate or use provided idempotency key
    const effectiveKey = idempotencyKey || `test:${testPhone.replace(/\D/g, '')}:${Date.now()}`;

    const result = await whatsappService.sendMessage({
      to: testPhone,
      text: testMessage,
      type: 'custom',
      recipientName: 'BSF Admin Test',
      idempotencyKey: effectiveKey
    });

    res.json(result);
  } catch (err: any) {
    if (err instanceof WhatsAppRateLimitError) {
      res.setHeader('Retry-After', String(err.retryAfterSeconds));
      res.status(429).json({
        success: false,
        code: err.code,
        error: err.message,
        retryAfterSeconds: err.retryAfterSeconds
      });
      return;
    }

    if (err instanceof WhatsAppSendInProgressError) {
      res.status(409).json({
        success: false,
        code: err.code,
        error: err.message
      });
      return;
    }

    if (err instanceof WhatsAppError) {
      res.status(err.statusCode).json({
        success: false,
        code: err.code,
        error: err.message
      });
      return;
    }

    console.error('[whatsappRoutes] Error sending test message:', err?.message);
    res.status(500).json({
      success: false,
      error: 'Failed to dispatch test message due to a network or connection issue.'
    });
  }
});

/**
 * POST /api/whatsapp/automations/run
 * Server-authoritative automated reminder execution engine.
 * Dispatches membership expiry reminders with strictly idempotent keys:
 *   {membershipId}:renewal:7
 *   {membershipId}:renewal:3
 *   {membershipId}:renewal:1
 * Uses Firestore transactions to guarantee that if scheduler runs twice, server restarts,
 * or multiple tabs trigger the run, zero duplicate messages are created.
 */
/**
 * GET /api/whatsapp/automations/status
 * Returns current scheduler status, Asia/Kolkata date/time, and last run summary
 */
whatsappRoutes.get('/automations/status', (_req: AuthenticatedRequest, res: Response): void => {
  try {
    const status = renewalService.getStatus();
    res.json({
      success: true,
      ...status
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err?.message || 'Failed to retrieve automation scheduler status.'
    });
  }
});

/**
 * GET /api/whatsapp/automations/candidates
 * Previews eligible renewal candidates for today in Asia/Kolkata
 */
whatsappRoutes.get('/automations/candidates', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const customDate = req.query.date as string | undefined;
    const result = await renewalService.findEligibleCandidates(customDate);
    res.json({
      success: true,
      currentKolkataTime: renewalService.getTodayInKolkata(customDate ? new Date(customDate) : new Date()),
      candidates: result.candidates,
      totalCandidates: result.candidates.length,
      totalMembers: result.totalMembers,
      activeMembers: result.activeMembers
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err?.message || 'Failed to retrieve renewal candidates.'
    });
  }
});

/**
 * GET /api/whatsapp/automations/history
 * Returns history of previous automated renewal runs
 */
whatsappRoutes.get('/automations/history', (_req: AuthenticatedRequest, res: Response): void => {
  try {
    res.json({
      success: true,
      history: renewalService.getRunHistory()
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err?.message || 'Failed to retrieve automation history.'
    });
  }
});

/**
 * POST /api/whatsapp/automations/run-renewal
 * Triggers the Asia/Kolkata server-side renewal process immediately
 */
whatsappRoutes.post('/automations/run-renewal', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { customDate, dryRun } = req.body || {};
    const summary = await renewalService.runRenewalCheck({
      source: 'manual_api_trigger',
      customDate,
      dryRun: Boolean(dryRun)
    });
    res.json({
      success: true,
      summary
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err?.message || 'Failed to execute renewal automation.'
    });
  }
});

/**
 * POST /api/whatsapp/automations/run
 * Server-authoritative automated reminder execution engine.
 * Dispatches membership expiry reminders with strictly idempotent keys:
 *   {membershipId}:renewal:7
 *   {membershipId}:renewal:3
 *   {membershipId}:renewal:1
 * Uses Firestore transactions to guarantee that if scheduler runs twice, server restarts,
 * or multiple tabs trigger the run, zero duplicate messages are created.
 */
whatsappRoutes.post('/automations/run', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { items, customDate } = req.body || {};

    // If no custom items passed, delegate directly to the robust RenewalAutomationService
    if (!Array.isArray(items) || items.length === 0) {
      const summary = await renewalService.runRenewalCheck({
        source: 'automations_run_endpoint',
        customDate
      });
      res.json({
        success: true,
        summary
      });
      return;
    }

    const summary = {
      totalCandidates: 0,
      sentCount: 0,
      duplicatePreventedCount: 0,
      inFlightCount: 0,
      failedCount: 0,
      details: [] as Array<{
        key: string;
        memberId: string;
        phone: string;
        action: 'sent' | 'duplicate_prevented' | 'in_flight' | 'failed';
        reason?: string;
      }>
    };

    const candidates = items.map((it: any) => ({
      memberId: it.memberId || it.membershipId || it.id,
      membershipId: it.membershipId || it.memberId || it.id,
      memberName: it.memberName || it.fullName || 'Member',
      phone: it.phone,
      daysLeft: it.daysLeft ?? it.days ?? 7,
      message: it.message || `Renewal reminder: ${it.daysLeft ?? it.days ?? 7} days remaining.`
    }));

    summary.totalCandidates = candidates.length;

    // Process each candidate through the idempotent message pipeline
    for (const item of candidates) {
      const membershipId = item.membershipId || item.memberId;
      // Exact required pattern: {membershipId}:renewal:{daysLeft}
      const idempotencyKey = `${membershipId}:renewal:${item.daysLeft}`;

      try {
        const result = await whatsappService.sendMessage({
          to: item.phone,
          text: item.message,
          type: 'expiry_reminder',
          recipientName: item.memberName,
          memberId: item.memberId,
          idempotencyKey
        });

        if (result.isDuplicate) {
          summary.duplicatePreventedCount++;
          summary.details.push({
            key: idempotencyKey,
            memberId: item.memberId,
            phone: item.phone,
            action: 'duplicate_prevented',
            reason: 'Already sent successfully in a previous execution'
          });
        } else {
          summary.sentCount++;
          summary.details.push({
            key: idempotencyKey,
            memberId: item.memberId,
            phone: item.phone,
            action: 'sent'
          });
        }
      } catch (sendErr: any) {
        if (sendErr instanceof WhatsAppSendInProgressError) {
          summary.inFlightCount++;
          summary.details.push({
            key: idempotencyKey,
            memberId: item.memberId,
            phone: item.phone,
            action: 'in_flight',
            reason: sendErr.message
          });
        } else {
          summary.failedCount++;
          summary.details.push({
            key: idempotencyKey,
            memberId: item.memberId,
            phone: item.phone,
            action: 'failed',
            reason: sendErr?.message || String(sendErr)
          });
        }
      }
    }

    res.json({
      success: true,
      summary
    });
  } catch (err: any) {
    console.error('[whatsappRoutes] Error running automations:', err);
    res.status(500).json({
      success: false,
      error: err?.message || 'Failed to run WhatsApp automations.'
    });
  }
});
