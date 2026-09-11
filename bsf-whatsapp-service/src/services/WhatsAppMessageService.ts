import { WhatsAppSessionManager } from './WhatsAppSessionManager';
import { logger } from '../utils/logger';
import type { SendMessageResult } from '../types/whatsapp';

export class WhatsAppMessageService {
  /**
   * Safely formats and normalizes standard mobile phone numbers to WhatsApp JID
   * Example: "+91 98450 12890" -> "919845012890@s.whatsapp.net"
   */
  public static normalizePhoneNumberToJid(phone: string): string {
    // Strip all non-numeric characters except digits
    let cleaned = phone.replace(/[^0-9]/g, '');

    // Handle leading 0 for 11 digit local mobile numbers (e.g. 09845012890 -> 9845012890)
    if (cleaned.startsWith('0') && cleaned.length === 11) {
      cleaned = cleaned.substring(1);
    }

    // Handle common India local format (10-digit number e.g. 9845012890) -> prepend 91
    if (cleaned.length === 10) {
      cleaned = `91${cleaned}`;
    }

    return `${cleaned}@s.whatsapp.net`;
  }

  /**
   * Send WhatsApp text message via active Baileys socket for a gym
   */
  public static async sendMessage(
    gymId: string,
    phoneNumber: string,
    message: string
  ): Promise<SendMessageResult> {
    const session = WhatsAppSessionManager.getSession(gymId);

    if (!session || session.status !== 'connected' || !session.socket) {
      logger.warn({ gymId, status: session?.status }, 'Cannot send message: WhatsApp is not connected');
      throw new Error(`WhatsApp is not connected for this gym (Current status: ${session?.status || 'disconnected'}). Please scan the QR code in the dashboard first.`);
    }

    if (!phoneNumber || !phoneNumber.trim()) {
      throw new Error('Valid recipient phone number is required');
    }

    if (!message || !message.trim()) {
      throw new Error('Message text body cannot be empty');
    }

    try {
      const jid = this.normalizePhoneNumberToJid(phoneNumber);
      logger.info({ gymId, jid }, 'Dispatching WhatsApp message via Baileys socket');

      const sendResult = await session.socket.sendMessage(jid, {
        text: message
      });

      const messageId = sendResult?.key?.id || `msg_${Date.now()}`;

      logger.info({ gymId, jid, messageId }, 'WhatsApp message sent successfully');

      return {
        success: true,
        messageId,
        recipient: phoneNumber,
        timestamp: new Date().toISOString()
      };
    } catch (error: any) {
      logger.error({ gymId, phoneNumber, err: error.message }, 'Failed to dispatch WhatsApp message');
      throw new Error(`Failed to send WhatsApp message: ${error.message}`);
    }
  }
}
