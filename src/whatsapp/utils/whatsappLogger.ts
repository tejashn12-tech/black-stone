/**
 * Standardized logging for WhatsApp authentication and connection events
 */
export enum WhatsAppLogEvent {
  AUTH_STATE_LOADED = 'AUTH_STATE_LOADED',
  AUTH_STATE_SAVED = 'AUTH_STATE_SAVED',
  CONNECTION_STARTED = 'CONNECTION_STARTED',
  CONNECTION_OPEN = 'CONNECTION_OPEN',
  CONNECTION_CLOSED = 'CONNECTION_CLOSED',
  LOGGED_OUT = 'LOGGED_OUT',
  AUTH_ERROR = 'AUTH_ERROR',
  RECONNECT_STARTED = 'RECONNECT_STARTED',
  RECONNECT_SUCCESS = 'RECONNECT_SUCCESS'
}

export function logWhatsAppEvent(event: WhatsAppLogEvent, details?: any): void {
  const detailStr = details
    ? typeof details === 'string'
      ? details
      : JSON.stringify(details)
    : '';
  console.log(`[WHATSAPP_LOG] ${event}${detailStr ? `: ${detailStr}` : ''}`);
}
