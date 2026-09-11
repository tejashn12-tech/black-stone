import { sessionManager } from './WhatsAppSessionManager';
import { logger } from '../utils/logger';
import type { SendMessageResponse } from '../types/whatsapp';

export class WhatsAppMessageService {
  private static instance: WhatsAppMessageService;

  private constructor() {}

  public static getInstance(): WhatsAppMessageService {
    if (!WhatsAppMessageService.instance) {
      WhatsAppMessageService.instance = new WhatsAppMessageService();
    }
    return WhatsAppMessageService.instance;
  }

  /**
   * Safely formats and normalizes phone number into a valid WhatsApp JID
   */
  public normalizeWhatsAppJid(rawPhone: string): string {
    if (!rawPhone) {
      throw new Error('Phone number is required');
    }

    // Strip everything except digits
    let digits = rawPhone.replace(/[^0-9]/g, '');

    if (!digits) {
      throw new Error(`Invalid phone number: ${rawPhone}`);
    }

    // Handle standard 10-digit Indian numbers without country code
    if (digits.length === 10) {
      digits = `91${digits}`;
    }

    // If starts with 0 (national trunk prefix), replace with 91 if standard length
    if (digits.startsWith('0') && digits.length === 11) {
      digits = `91${digits.substring(1)}`;
    }

    if (digits.length < 10 || digits.length > 15) {
      throw new Error(`Invalid phone number length: ${rawPhone}`);
    }

    return `${digits}@s.whatsapp.net`;
  }

  /**
   * Send WhatsApp message through the active gym Baileys socket
   */
  public async sendMessage(
    gymId: string,
    phoneNumber: string,
    message: string
  ): Promise<SendMessageResponse> {
    if (!gymId) {
      return { success: false, error: 'Gym ID is required' };
    }

    if (!message || message.trim().length === 0) {
      return { success: false, error: 'Message content cannot be empty' };
    }

    // 1. Get active session & verify connected
    let socket = sessionManager.getSocket(gymId);
    if (!socket) {
      logger.info({ gymId }, 'Live Baileys socket not active in memory; attempting on-demand connection for message dispatch');
      try {
        await sessionManager.connect(gymId, false);
      } catch (connErr: any) {
        logger.warn({ error: connErr?.message, gymId }, 'Notice connecting socket on demand');
      }

      // Wait up to 7 seconds for socket to be open
      const startWait = Date.now();
      while (Date.now() - startWait < 7000) {
        socket = sessionManager.getSocket(gymId);
        if (socket) break;
        await new Promise((r) => setTimeout(r, 350));
      }
    }

    if (!socket) {
      const statusData = await sessionManager.getStatus(gymId);
      logger.warn({ gymId, phoneNumber, status: statusData.status }, 'Rejected message dispatch: WhatsApp socket is not connected');
      return {
        success: false,
        error: 'WhatsApp device is not connected or socket is offline. Please check connection or scan QR in Admin > WhatsApp Integration.',
      };
    }

    try {
      // 3. Normalize phone number to WhatsApp JID
      const jid = this.normalizeWhatsAppJid(phoneNumber);

      logger.info(
        { gymId, recipientJid: jid, messageLength: message.length },
        'Dispatching WhatsApp message through live Baileys socket'
      );

      // Check onWhatsApp to ensure delivery target is valid
      let targetJid = jid;
      try {
        const onWaResults = await socket.onWhatsApp(jid);
        if (onWaResults && onWaResults.length > 0 && onWaResults[0]?.jid) {
          targetJid = onWaResults[0].jid;
        }
      } catch (onWaErr: any) {
        logger.debug({ error: onWaErr?.message, jid }, 'Notice querying onWhatsApp (using normalized jid)');
      }

      // 4. Send WhatsApp message
      const sendResult = await socket.sendMessage(targetJid, { text: message });

      const messageId = sendResult?.key?.id || `baileys-${Date.now()}`;

      logger.info({ gymId, messageId, recipientJid: targetJid }, 'WhatsApp message delivered to Baileys network');

      return {
        success: true,
        messageId,
        status: 'sent',
      };
    } catch (error: any) {
      logger.error({ error: error?.message, gymId, phoneNumber }, 'Failed to send WhatsApp message via Baileys');
      return {
        success: false,
        error: error?.message || 'Failed to dispatch message via WhatsApp socket',
      };
    }
  }
}

export const messageService = WhatsAppMessageService.getInstance();
