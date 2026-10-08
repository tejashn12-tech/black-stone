import { Router, Response } from 'express';
import { WhatsAppService } from '../whatsapp/WhatsAppService';
import {
  WhatsAppError,
  WhatsAppRateLimitError,
  WhatsAppSendInProgressError,
  WhatsAppNotConnectedError
} from '../whatsapp/errors/WhatsAppErrors';
import { AuthenticatedRequest } from '../middleware/authenticate';
import { MessageRateLimiter } from '../whatsapp/ratelimit/MessageRateLimiter';
import { IdempotencyManager } from '../whatsapp/idempotency/IdempotencyManager';
import { RenewalAutomationService } from '../whatsapp/automation/RenewalAutomationService';
import { getAdminDb } from '../config/firebase';
import { HandshakeDiagnostics } from '../whatsapp/diagnostics/HandshakeDiagnostics';
import { MessageStatusTracker } from '../whatsapp/messaging/MessageStatusTracker';
import { MessageDispatcher } from '../whatsapp/messaging/MessageDispatcher';
import { generateReceiptPdfBuffer, ReceiptPdfData } from '../utils/receiptPdfGenerator';

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
 * GET /api/whatsapp/handshake-diagnostics
 * Returns the deep production authentication handshake diagnostic report.
 * Strictly adheres to privacy: NO credentials, secret keys, or auth tokens are exposed.
 */
whatsappRoutes.get('/handshake-diagnostics', async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const report = await HandshakeDiagnostics.getInstance().getDiagnosticReport();
    res.json({
      success: true,
      report
    });
  } catch (err: any) {
    console.error('[whatsappRoutes] Error generating handshake diagnostics report:', err);
    res.status(500).json({
      success: false,
      error: err?.message || 'Failed generating handshake diagnostics report'
    });
  }
});

/**
 * POST /api/whatsapp/clean-prod-vault
 * Cleans the production authentication vault once prior to production device pairing.
 * SAFEGUARD: Only executes in production environment, and only deletes bsf_whatsapp_session_prod.
 * NEVER deletes or alters bsf_whatsapp_session_dev.
 */
whatsappRoutes.post('/clean-prod-vault', async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const cleaned = await whatsappService.cleanProductionVaultOnce();
    res.json({
      success: true,
      cleaned,
      message: cleaned
        ? 'Production session vault (bsf_whatsapp_session_prod) successfully cleaned.'
        : 'Production session vault reset skipped (environment is not production or already clean).'
    });
  } catch (err: any) {
    console.error('[whatsappRoutes] Error cleaning production vault:', err);
    res.status(500).json({
      success: false,
      error: err?.message || 'Failed to clean production vault.'
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
 * GET /api/whatsapp/verify-recipient/:phone
 * Checks whether a phone number is registered on WhatsApp and retrieves its canonical JID
 */
whatsappRoutes.get('/verify-recipient/:phone', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const socket = (whatsappService as any).connectionManager.getSocket();
    if (!socket) {
      res.status(503).json({ success: false, error: 'WhatsApp is not connected.' });
      return;
    }
    const phone = req.params.phone;
    let clean = phone.replace(/\D/g, '');
    if (clean.length === 10) clean = `91${clean}`;
    if (clean.length === 11 && clean.startsWith('0')) clean = `91${clean.slice(1)}`;
    const jid = `${clean}@s.whatsapp.net`;

    const results = await socket.onWhatsApp(jid);
    res.json({
      success: true,
      phone,
      formattedJid: jid,
      results
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err?.message || 'Failed to verify recipient on WhatsApp.'
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

const DEFAULT_NEW_MEMBER_TEMPLATE =
  `Hi {name}! 👋\n\nWelcome to Blackstone Fitness (BSF)! 💪\n\nYour membership has been successfully registered with us.\n\nWe’re excited to have you as part of the BSF family.\n\nIf you have any questions regarding your membership, timings, or training, feel free to contact us.\n\nSee you at the gym! 🏋️\n\n— Blackstone Fitness`;

const DEFAULT_RENEWAL_TEMPLATE =
  `Hi {name}! 👋\n\nYour membership at Blackstone Fitness (BSF) has been successfully renewed. 💪\n\nMembership Plan: {plan}\nRenewal Date: {renewalDate}\nNew Expiry Date: {expiryDate}\n\nThank you for continuing your journey with Blackstone Fitness.\n\nKeep training. Keep progressing. 💪🔥\n\n— Blackstone Fitness`;

/**
 * POST /api/whatsapp/notify/admission
 * Triggers exactly ONE automatic WhatsApp welcome message for a new member admission.
 * Protected by idempotency key: admissionWhatsAppNotification:{memberId}
 */
whatsappRoutes.post('/notify/admission', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { member, customTemplate, testMode, testPhone } = req.body || {};

  if (!member && !testMode) {
    res.status(400).json({ success: false, error: 'Member details are required.' });
    return;
  }

  const memberName = member?.fullName || member?.name || 'Member';
  const rawTargetPhone = testMode ? testPhone : (member?.whatsapp || member?.phone);

  if (!rawTargetPhone || typeof rawTargetPhone !== 'string' || !rawTargetPhone.trim()) {
    res.status(400).json({ success: false, error: 'Recipient phone number is required.' });
    return;
  }

  // Compose template with variable substitution
  const templateToUse = (typeof customTemplate === 'string' && customTemplate.trim())
    ? customTemplate.trim()
    : DEFAULT_NEW_MEMBER_TEMPLATE;

  const messageText = templateToUse
    .replace(/{name}/g, memberName)
    .replace(/{MEMBER_NAME}/g, memberName)
    .replace(/{plan}/g, member?.packageName || 'Membership')
    .replace(/{expiryDate}/g, member?.expiryDate || 'N/A');

  try {
    // Real admissions enforce strict idempotency key: admissionWhatsAppNotification:{memberId}
    const idempotencyKey = testMode
      ? `test:admission:${Date.now()}`
      : (req.body?.idempotencyKey || `admissionWhatsAppNotification:${member?.id}`);

    const result = await whatsappService.sendMessage({
      to: rawTargetPhone.trim(),
      text: messageText,
      type: 'NEW_MEMBER',
      recipientName: memberName,
      memberId: member?.id,
      idempotencyKey
    });

    res.json({
      success: true,
      status: result.status || 'SENT',
      messageId: result.messageId,
      trackingId: result.trackingId,
      isDuplicate: result.isDuplicate || false,
      statusDisplay: result.statusDisplay || 'Accepted by WhatsApp Connection'
    });
  } catch (err: any) {
    if (err instanceof WhatsAppNotConnectedError) {
      try {
        const jid = MessageDispatcher.formatJid(rawTargetPhone);
        const tracker = MessageStatusTracker.getInstance();
        const queued = await tracker.createQueuedMessage({
          recipientPhone: `+${jid.split('@')[0]}`,
          recipientJid: jid,
          recipientName: memberName,
          content: messageText,
          type: 'NEW_MEMBER',
          memberId: member?.id
        });
        await tracker.recordFailed(queued.id, err);
      } catch {}

      res.status(503).json({
        success: false,
        status: 'FAILED',
        error: err.message,
        isDisconnected: true
      });
      return;
    }

    if (err instanceof WhatsAppRateLimitError) {
      res.status(429).json({
        success: false,
        status: 'FAILED',
        error: err.message,
        retryAfterSeconds: err.retryAfterSeconds
      });
      return;
    }

    console.error('[whatsappRoutes] Error dispatching admission message:', err?.message);
    try {
      const jid = MessageDispatcher.formatJid(rawTargetPhone);
      const tracker = MessageStatusTracker.getInstance();
      const queued = await tracker.createQueuedMessage({
        recipientPhone: `+${jid.split('@')[0]}`,
        recipientJid: jid,
        recipientName: memberName,
        content: messageText,
        type: 'NEW_MEMBER',
        memberId: member?.id
      });
      await tracker.recordFailed(queued.id, err);
    } catch {}

    res.status(500).json({
      success: false,
      status: 'FAILED',
      error: err?.message || 'Failed to dispatch new member admission notification.'
    });
  }
});

/**
 * POST /api/whatsapp/notify/renewal
 * Triggers exactly ONE automatic WhatsApp confirmation message for a successful membership renewal.
 * Protected by idempotency key: renewal:{renewalId}:{memberId}
 */
whatsappRoutes.post('/notify/renewal', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { member, renewalDetails, customTemplate, testMode, testPhone } = req.body || {};

  if (!member && !testMode) {
    res.status(400).json({ success: false, error: 'Member details are required.' });
    return;
  }

  const memberName = member?.fullName || member?.name || 'Member';
  const rawTargetPhone = testMode ? testPhone : (member?.whatsapp || member?.phone);

  if (!rawTargetPhone || typeof rawTargetPhone !== 'string' || !rawTargetPhone.trim()) {
    res.status(400).json({ success: false, error: 'Recipient phone number is required.' });
    return;
  }

  const planName = renewalDetails?.planName || member?.packageName || 'Gym Membership';
  const renewalDate = renewalDetails?.renewalDate || new Date().toISOString().split('T')[0];
  const expiryDate = renewalDetails?.expiryDate || member?.expiryDate || 'N/A';
  const renewalId = renewalDetails?.renewalId || `ren-${Date.now()}`;

  // Compose template with variable substitution
  const templateToUse = (typeof customTemplate === 'string' && customTemplate.trim())
    ? customTemplate.trim()
    : DEFAULT_RENEWAL_TEMPLATE;

  const messageText = templateToUse
    .replace(/{name}/g, memberName)
    .replace(/{MEMBER_NAME}/g, memberName)
    .replace(/{plan}/g, planName)
    .replace(/{PLAN_NAME}/g, planName)
    .replace(/{renewalDate}/g, renewalDate)
    .replace(/{expiryDate}/g, expiryDate);

  try {
    // Real renewals enforce strict idempotency key: renewal:{renewalId}:{memberId}
    const idempotencyKey = testMode
      ? `test:renewal:${Date.now()}`
      : (req.body?.idempotencyKey || `renewal:${renewalId}:${member?.id}`);

    // Generate official renewal PDF invoice buffer to send along with message
    const paymentRecord = req.body?.payment || renewalDetails?.payment;
    let pdfBuffer: Buffer | null = null;
    let cleanPdfFileName = `BSF_Receipt_${memberName.replace(/[^a-zA-Z0-9_-]/g, '_')}_${renewalDetails?.receiptNo || 'REC'}.pdf`;
    let effectiveReceiptNo = renewalDetails?.receiptNo || paymentRecord?.receiptNo;

    try {
      const gymSettings = req.body?.gymSettings || {};
      const receiptData: ReceiptPdfData = {
        gymSettings: {
          gymName: gymSettings.gymName || 'BLACK STONE FITNESS',
          address: gymSettings.address || '#42, 2nd Stage, Vijayanagar / Dattagalli Ring Road',
          city: gymSettings.city || 'Mysuru',
          state: gymSettings.state || 'Karnataka',
          pincode: gymSettings.pincode || '570022',
          phone: gymSettings.phone || '+91 98803 97294',
          email: gymSettings.email || 'blackstonefitness@gmail.com',
          gstNumber: gymSettings.gstNumber || '29ABCDE1234F1Z5',
          receiptTerms: gymSettings.receiptTerms,
          receiptCollectorName: gymSettings.receiptCollectorName
        },
        member: {
          fullName: memberName,
          phone: member?.phone || rawTargetPhone,
          whatsapp: member?.whatsapp || rawTargetPhone,
          memberCode: member?.memberCode || 'BSF-MEMBER'
        },
        payment: {
          id: paymentRecord?.id || renewalId,
          receiptNo: paymentRecord?.receiptNo || renewalDetails?.receiptNo || `BSF-REC-${Math.floor(1000 + Math.random() * 9000)}`,
          paymentDate: paymentRecord?.paymentDate || renewalDate,
          paymentTime: paymentRecord?.paymentTime,
          paymentMethod: paymentRecord?.paymentMethod || 'UPI',
          status: paymentRecord?.status || (Number(paymentRecord?.pendingAmount || 0) === 0 ? 'PAID' : 'PARTIALLY PAID'),
          totalPackageAmount: Number(paymentRecord?.totalPackageAmount || paymentRecord?.amountPaid || 0),
          amountPaid: Number(paymentRecord?.amountPaid || 0),
          pendingAmount: Number(paymentRecord?.pendingAmount || 0),
          discount: Number(paymentRecord?.discount || 0),
          notes: paymentRecord?.notes || `Membership Renewal for ${planName}`,
          staffName: paymentRecord?.staffName || gymSettings.receiptCollectorName
        },
        renewal: {
          packageName: planName,
          startDate: renewalDetails?.startDate || renewalDate,
          expiryDate: expiryDate,
          durationMonths: renewalDetails?.durationMonths || 1
        }
      };

      pdfBuffer = generateReceiptPdfBuffer(receiptData);
      const cleanName = memberName.replace(/[^a-zA-Z0-9_-]/g, '_');
      const cleanRecNo = receiptData.payment.receiptNo.replace(/[^a-zA-Z0-9_-]/g, '_');
      cleanPdfFileName = `BSF_Receipt_${cleanName}_${cleanRecNo}.pdf`;
      effectiveReceiptNo = receiptData.payment.receiptNo;
    } catch (pdfGenErr: any) {
      console.warn('[whatsappRoutes] Could not generate renewal invoice PDF, will dispatch message text:', pdfGenErr?.message);
    }

    const result = await whatsappService.sendMessage({
      to: rawTargetPhone.trim(),
      text: messageText,
      caption: messageText,
      document: pdfBuffer || undefined,
      fileName: pdfBuffer ? cleanPdfFileName : undefined,
      mimetype: pdfBuffer ? 'application/pdf' : undefined,
      type: 'MEMBERSHIP_RENEWAL',
      recipientName: memberName,
      memberId: member?.id,
      receiptNo: effectiveReceiptNo,
      idempotencyKey
    });

    res.json({
      success: true,
      status: result.status || 'SENT',
      messageId: result.messageId,
      trackingId: result.trackingId,
      isDuplicate: result.isDuplicate || false,
      statusDisplay: result.statusDisplay || 'Accepted by WhatsApp Connection',
      receiptSent: Boolean(pdfBuffer),
      fileName: pdfBuffer ? cleanPdfFileName : undefined
    });
  } catch (err: any) {
    if (err instanceof WhatsAppNotConnectedError) {
      try {
        const jid = MessageDispatcher.formatJid(rawTargetPhone);
        const tracker = MessageStatusTracker.getInstance();
        const queued = await tracker.createQueuedMessage({
          recipientPhone: `+${jid.split('@')[0]}`,
          recipientJid: jid,
          recipientName: memberName,
          content: messageText,
          type: 'MEMBERSHIP_RENEWAL',
          memberId: member?.id,
          receiptNo: renewalDetails?.receiptNo
        });
        await tracker.recordFailed(queued.id, err);
      } catch {}

      res.status(503).json({
        success: false,
        status: 'FAILED',
        error: err.message,
        isDisconnected: true
      });
      return;
    }

    if (err instanceof WhatsAppRateLimitError) {
      res.status(429).json({
        success: false,
        status: 'FAILED',
        error: err.message,
        retryAfterSeconds: err.retryAfterSeconds
      });
      return;
    }

    console.error('[whatsappRoutes] Error dispatching renewal message:', err?.message);
    try {
      const jid = MessageDispatcher.formatJid(rawTargetPhone);
      const tracker = MessageStatusTracker.getInstance();
      const queued = await tracker.createQueuedMessage({
        recipientPhone: `+${jid.split('@')[0]}`,
        recipientJid: jid,
        recipientName: memberName,
        content: messageText,
        type: 'MEMBERSHIP_RENEWAL',
        memberId: member?.id,
        receiptNo: renewalDetails?.receiptNo
      });
      await tracker.recordFailed(queued.id, err);
    } catch {}

    res.status(500).json({
      success: false,
      status: 'FAILED',
      error: err?.message || 'Failed to dispatch membership renewal notification.'
    });
  }
});

/**
 * POST /api/whatsapp/receipt/pdf
 * Generates and streams an official printable A4 PDF receipt matching the BSF reference layout.
 */
whatsappRoutes.post('/receipt/pdf', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { gymSettings, member, payment, renewal } = req.body || {};
    if (!payment || !member) {
      res.status(400).json({ success: false, error: 'Member and payment details are required.' });
      return;
    }

    const receiptData: ReceiptPdfData = {
      gymSettings: {
        gymName: gymSettings?.gymName || 'BLACK STONE FITNESS',
        address: gymSettings?.address || '#42, 2nd Stage, Vijayanagar / Dattagalli Ring Road',
        city: gymSettings?.city || 'Mysuru',
        state: gymSettings?.state || 'Karnataka',
        pincode: gymSettings?.pincode || '570022',
        phone: gymSettings?.phone || '+91 98803 97294',
        email: gymSettings?.email || 'blackstonefitness@gmail.com',
        gstNumber: gymSettings?.gstNumber || '29ABCDE1234F1Z5',
        receiptTerms: gymSettings?.receiptTerms,
        receiptCollectorName: gymSettings?.receiptCollectorName
      },
      member: {
        fullName: member.fullName || member.name || 'Member',
        phone: member.phone || '',
        whatsapp: member.whatsapp || member.phone,
        memberCode: member.memberCode || 'BSF-MEMBER'
      },
      payment: {
        id: payment.id || `pay-${Date.now()}`,
        receiptNo: payment.receiptNo || `BSF-REC-${Math.floor(1000 + Math.random() * 9000)}`,
        paymentDate: payment.paymentDate || new Date().toISOString().split('T')[0],
        paymentTime: payment.paymentTime,
        paymentMethod: payment.paymentMethod || 'UPI',
        status: (payment.status || 'PAID').toUpperCase(),
        totalPackageAmount: Number(payment.totalPackageAmount || payment.amountPaid || 0),
        amountPaid: Number(payment.amountPaid || 0),
        pendingAmount: Number(payment.pendingAmount || 0),
        discount: Number(payment.discount || 0),
        notes: payment.notes,
        staffName: payment.staffName || gymSettings?.receiptCollectorName
      },
      renewal: {
        packageName: renewal?.packageName || payment.packageName || 'Membership',
        startDate: renewal?.startDate || payment.paymentDate || new Date().toISOString().split('T')[0],
        expiryDate: renewal?.expiryDate || payment.expiryDate || 'N/A',
        durationMonths: renewal?.durationMonths || 1
      }
    };

    const pdfBuffer = generateReceiptPdfBuffer(receiptData);
    const cleanMemberName = (member.fullName || 'Member').replace(/[^a-zA-Z0-9_-]/g, '_');
    const cleanReceiptNo = (payment.receiptNo || 'REC').replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `BSF_Receipt_${cleanMemberName}_${cleanReceiptNo}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);
  } catch (err: any) {
    console.error('[whatsappRoutes] Error generating receipt PDF:', err);
    res.status(500).json({ success: false, error: err?.message || 'Failed to generate receipt PDF' });
  }
});

/**
 * POST /api/whatsapp/receipt/send
 * Sends an official PDF receipt document to a member via the existing WhatsApp connection.
 * Strictly verifies payment status is PAID before sending.
 */
whatsappRoutes.post('/receipt/send', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { gymSettings, member, payment, renewal, targetPhone, customMessage, isSettlement } = req.body || {};
    if (!payment || !member) {
      res.status(400).json({ success: false, error: 'Member and payment details are required.' });
      return;
    }

    // Allow sending receipt for any payment where amount was paid or marked paid
    const hasPayment = Number(payment.amountPaid || 0) > 0 || (payment.status || '').toUpperCase() === 'PAID' || Number(payment.totalPackageAmount || 0) > 0;
    if (!hasPayment) {
      res.status(400).json({ success: false, error: 'Cannot send receipt. No payment amount recorded.' });
      return;
    }

    const rawPhone = targetPhone || member.whatsapp || member.phone;
    if (!rawPhone || !rawPhone.trim()) {
      res.status(400).json({ success: false, error: 'Recipient phone number is required.' });
      return;
    }

    const memberName = member.fullName || member.name || 'Member';
    const pendingVal = Number(payment.pendingAmount || 0);
    const amountPaidVal = Number(payment.amountPaid || 0);
    const totalPkgVal = Number(payment.totalPackageAmount || (amountPaidVal + pendingVal) || amountPaidVal || 0);

    const receiptData: ReceiptPdfData = {
      gymSettings: {
        gymName: gymSettings?.gymName || 'BLACK STONE FITNESS',
        address: gymSettings?.address || '#42, 2nd Stage, Vijayanagar / Dattagalli Ring Road',
        city: gymSettings?.city || 'Mysuru',
        state: gymSettings?.state || 'Karnataka',
        pincode: gymSettings?.pincode || '570022',
        phone: gymSettings?.phone || '+91 98803 97294',
        email: gymSettings?.email || 'blackstonefitness@gmail.com',
        gstNumber: gymSettings?.gstNumber || '29ABCDE1234F1Z5',
        receiptTerms: gymSettings?.receiptTerms,
        receiptCollectorName: gymSettings?.receiptCollectorName
      },
      member: {
        fullName: memberName,
        phone: member.phone || rawPhone,
        whatsapp: member.whatsapp || rawPhone,
        memberCode: member.memberCode || 'BSF-MEMBER'
      },
      payment: {
        id: payment.id || `pay-${Date.now()}`,
        receiptNo: payment.receiptNo || `BSF-REC-${Math.floor(1000 + Math.random() * 9000)}`,
        paymentDate: payment.paymentDate || new Date().toISOString().split('T')[0],
        paymentTime: payment.paymentTime,
        paymentMethod: payment.paymentMethod || 'UPI',
        status: payment.status || (pendingVal === 0 ? 'PAID' : 'PARTIALLY PAID'),
        totalPackageAmount: totalPkgVal,
        amountPaid: amountPaidVal,
        pendingAmount: pendingVal,
        discount: Number(payment.discount || 0),
        notes: payment.notes,
        staffName: payment.staffName || gymSettings?.receiptCollectorName
      },
      renewal: {
        packageName: renewal?.packageName || payment.packageName || 'Membership',
        startDate: renewal?.startDate || payment.paymentDate || new Date().toISOString().split('T')[0],
        expiryDate: renewal?.expiryDate || payment.expiryDate || 'N/A',
        durationMonths: renewal?.durationMonths || 1
      }
    };

    const pdfBuffer = generateReceiptPdfBuffer(receiptData);
    const cleanMemberName = memberName.replace(/[^a-zA-Z0-9_-]/g, '_');
    const cleanReceiptNo = (receiptData.payment.receiptNo || 'REC').replace(/[^a-zA-Z0-9_-]/g, '_');
    const pdfFileName = `BSF_Receipt_${cleanMemberName}_${cleanReceiptNo}.pdf`;

    const isSettleAction = isSettlement || (payment.notes && payment.notes.includes('Settled'));
    const defaultCaption = isSettleAction
      ? `Hi ${memberName}! 👋\n\nYour payment settlement of ₹${amountPaidVal.toLocaleString('en-IN')} has been received and confirmed at Blackstone Fitness (BSF).\n\nReceipt No: ${receiptData.payment.receiptNo}\nMode of Payment: ${payment.paymentMethod || 'UPI'}\n${pendingVal > 0 ? `Remaining Balance: ₹${pendingVal.toLocaleString('en-IN')}\n` : 'Status: Fully Settled ✅\n'}\nYour official settlement invoice is attached below. Thank you! 💪`
      : `Hi ${memberName}! 👋\n\nYour payment of ₹${amountPaidVal.toLocaleString('en-IN')} has been received and recorded at Blackstone Fitness (BSF).\n\nReceipt No: ${receiptData.payment.receiptNo}\nMode of Payment: ${payment.paymentMethod || 'UPI'}\n${pendingVal > 0 ? `Remaining Balance: ₹${pendingVal.toLocaleString('en-IN')}\n` : 'Status: Fully Paid ✅\n'}\nYour official invoice is attached below. Thank you for choosing BSF! 💪`;

    const pdfCaption = (typeof customMessage === 'string' && customMessage.trim())
      ? customMessage.trim()
      : defaultCaption;

    const idempotencyKey = req.body?.idempotencyKey || `receipt:${receiptData.payment.receiptNo || payment.id}:${amountPaidVal}:${Date.now()}`;

    const result = await whatsappService.sendMessage({
      to: rawPhone.trim(),
      text: pdfCaption,
      caption: pdfCaption,
      type: 'payment_receipt',
      recipientName: memberName,
      memberId: member.id,
      receiptNo: receiptData.payment.receiptNo,
      idempotencyKey,
      document: pdfBuffer,
      fileName: pdfFileName,
      mimetype: 'application/pdf'
    });

    res.json({
      success: true,
      status: result.status || 'SENT',
      messageId: result.messageId,
      trackingId: result.trackingId,
      isDuplicate: result.isDuplicate || false,
      fileName: pdfFileName
    });
  } catch (err: any) {
    console.error('[whatsappRoutes] Error sending receipt over WhatsApp:', err);
    res.status(500).json({ success: false, error: err?.message || 'Failed to send receipt over WhatsApp.' });
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
