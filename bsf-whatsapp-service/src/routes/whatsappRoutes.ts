import { Router, Request, Response } from 'express';
import { authenticateFirebaseUser } from '../middleware/authenticate';
import { WhatsAppSessionManager } from '../services/WhatsAppSessionManager';
import { WhatsAppMessageService } from '../services/WhatsAppMessageService';
import { logger } from '../utils/logger';

const router = Router();

/**
 * Health Check Endpoint
 * GET /health or GET /api/health
 */
router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'BSF WhatsApp Service',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

/**
 * POST /api/whatsapp/connect
 * Starts or retrieves the Baileys connection session for the authorized gym
 */
router.post('/api/whatsapp/connect', authenticateFirebaseUser, async (req: Request, res: Response) => {
  try {
    const gymId = req.gymId || 'bsf_mysuru_01';
    const forceRefresh = req.body?.force === true || req.query?.force === 'true';
    logger.info({ gymId, forceRefresh, uid: req.user?.uid }, 'API: Connect WhatsApp requested');

    const session = await WhatsAppSessionManager.connect(gymId, forceRefresh);

    return res.status(200).json({
      success: true,
      status: session.status,
      sessionId: session.gymId,
      qr: session.latestQR
    });
  } catch (error: any) {
    logger.error({ err: error.message }, 'API Error in /api/whatsapp/connect');
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to initialize WhatsApp connection'
    });
  }
});

/**
 * GET /api/whatsapp/status
 * Returns current connection status and the exact live QR string when waiting for scan
 */
router.get('/api/whatsapp/status', authenticateFirebaseUser, (req: Request, res: Response) => {
  try {
    const gymId = req.gymId || 'bsf_mysuru_01';
    const statusData = WhatsAppSessionManager.getGymStatus(gymId);

    return res.status(200).json({
      success: true,
      status: statusData.status,
      qr: statusData.qr, // Exact live Baileys QR code string (only when qr_ready / waiting_for_scan)
      phoneNumber: statusData.phoneNumber,
      connectedAt: statusData.connectedAt,
      updatedAt: statusData.updatedAt
    });
  } catch (error: any) {
    logger.error({ err: error.message }, 'API Error in /api/whatsapp/status');
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch WhatsApp status'
    });
  }
});

/**
 * POST /api/whatsapp/disconnect
 * Closes active Baileys socket, cleans auth_info directory, and updates Firestore
 */
router.post('/api/whatsapp/disconnect', authenticateFirebaseUser, async (req: Request, res: Response) => {
  try {
    const gymId = req.gymId || 'bsf_mysuru_01';
    logger.info({ gymId, uid: req.user?.uid }, 'API: Disconnect WhatsApp requested');

    await WhatsAppSessionManager.disconnect(gymId);

    return res.status(200).json({
      success: true,
      message: 'WhatsApp session disconnected and authentication credentials cleared'
    });
  } catch (error: any) {
    logger.error({ err: error.message }, 'API Error in /api/whatsapp/disconnect');
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to disconnect WhatsApp'
    });
  }
});

/**
 * Handler for sending WhatsApp messages
 * Supports both /api/whatsapp/send and /api/whatsapp/messages/send
 */
const handleSendMessage = async (req: Request, res: Response) => {
  try {
    const gymId = req.gymId || 'bsf_mysuru_01';
    const phoneNumber = req.body?.phoneNumber || req.body?.recipient;
    const message = req.body?.message || req.body?.messageText;

    if (!phoneNumber || !message) {
      return res.status(400).json({
        success: false,
        error: 'Both recipient phone number (phoneNumber/recipient) and message text (message/messageText) are required'
      });
    }

    const result = await WhatsAppMessageService.sendMessage(gymId, phoneNumber, message);

    return res.status(200).json({
      success: true,
      messageId: result.messageId,
      recipient: result.recipient,
      timestamp: result.timestamp,
      message: {
        id: result.messageId,
        recipient: result.recipient,
        text: message,
        status: 'sent',
        sentAt: result.timestamp
      }
    });
  } catch (error: any) {
    logger.error({ err: error.message }, 'API Error in send message endpoint');
    return res.status(400).json({
      success: false,
      error: error.message || 'Failed to send WhatsApp message'
    });
  }
};

/**
 * POST /api/whatsapp/send and POST /api/whatsapp/messages/send
 */
router.post('/api/whatsapp/send', authenticateFirebaseUser, handleSendMessage);
router.post('/api/whatsapp/messages/send', authenticateFirebaseUser, handleSendMessage);

export default router;
