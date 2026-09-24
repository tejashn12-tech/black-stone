/**
 * Typed domain errors for the Baileys WhatsApp integration
 */

export class WhatsAppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;

  constructor(message: string, code = 'WHATSAPP_ERROR', statusCode = 500) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class WhatsAppNotConnectedError extends WhatsAppError {
  constructor(message = 'WhatsApp is not connected. Please scan the QR code to pair your device.') {
    super(message, 'WHATSAPP_NOT_CONNECTED', 400);
  }
}

export class WhatsAppAuthError extends WhatsAppError {
  constructor(message = 'WhatsApp authentication failed. Please re-authenticate.') {
    super(message, 'WHATSAPP_AUTH_ERROR', 401);
  }
}

export class WhatsAppInvalidRecipientError extends WhatsAppError {
  constructor(phone: string) {
    super(`Invalid WhatsApp recipient phone number: "${phone}". Phone number must contain at least 10 digits.`, 'WHATSAPP_INVALID_RECIPIENT', 400);
  }
}

export class WhatsAppSendFailedError extends WhatsAppError {
  constructor(reason: string) {
    super(`Failed to send WhatsApp message: ${reason}`, 'WHATSAPP_SEND_FAILED', 500);
  }
}

export class WhatsAppConnectionTimeoutError extends WhatsAppError {
  constructor(message = 'WhatsApp connection timed out. Please try again.') {
    super(message, 'WHATSAPP_CONNECTION_TIMEOUT', 504);
  }
}

export class WhatsAppDuplicateMessageError extends WhatsAppError {
  public readonly existingRecord?: any;

  constructor(message: string, existingRecord?: any) {
    super(message, 'WHATSAPP_DUPLICATE_MESSAGE', 409);
    this.existingRecord = existingRecord;
  }
}

export class WhatsAppSendInProgressError extends WhatsAppError {
  public readonly inFlightRecord?: any;

  constructor(message: string, inFlightRecord?: any) {
    super(message, 'WHATSAPP_SEND_IN_PROGRESS', 409);
    this.inFlightRecord = inFlightRecord;
  }
}

export class WhatsAppRateLimitError extends WhatsAppError {
  public readonly retryAfterSeconds: number;

  constructor(message: string, retryAfterSeconds = 5) {
    super(message, 'WHATSAPP_RATE_LIMIT', 429);
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

