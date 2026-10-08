import * as BaileysModule from '@whiskeysockets/baileys';
import { DisconnectReason as BaileysDisconnectReason } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';

const DisconnectReason =
  (BaileysModule as any)?.DisconnectReason ||
  (BaileysModule as any)?.default?.DisconnectReason ||
  BaileysDisconnectReason || {
    loggedOut: 401,
    forbidden: 403,
    timedOut: 408,
    connectionLost: 408,
    multideviceMismatch: 411,
    connectionClosed: 428,
    connectionReplaced: 440,
    badSession: 500,
    restartRequired: 515,
    unavailableService: 503,
  };

export enum DisconnectCategory {
  TEMPORARY_NETWORK = 'TEMPORARY_NETWORK',
  SERVER_RESTART = 'SERVER_RESTART',
  SERVICE_INTERRUPTION = 'SERVICE_INTERRUPTION',
  AUTHENTICATION_FAILURE = 'AUTHENTICATION_FAILURE',
  EXPLICIT_LOGOUT = 'EXPLICIT_LOGOUT',
  MANUAL_DISCONNECT = 'MANUAL_DISCONNECT',
  PERMANENT_INVALID_AUTH = 'PERMANENT_INVALID_AUTH'
}

export interface DisconnectAnalysis {
  category: DisconnectCategory;
  statusCode: number | undefined;
  errorName: string;
  errorMessage: string;
  shouldReconnect: boolean;
  isImmediateRestart?: boolean;
  clearAuth: boolean;
  humanReason: string;
}

/**
 * Distinguishes between:
 * 1. Temporary network disconnection
 * 2. Server restart
 * 3. WhatsApp service interruption
 * 4. Authentication failure
 * 5. Explicit logout
 * 6. Permanent/invalid authentication
 *
 * Enforces rule: A socket closure must NOT automatically mean "logged out".
 * Only clear authentication state when the disconnect reason definitively
 * indicates that the authentication/session is no longer valid.
 */
export function classifyDisconnect(
  lastDisconnect: { error?: Error | Boom; date?: Date } | undefined,
  isManualDisconnect: boolean,
  isExplicitLogout: boolean,
  isServerShutdown: boolean
): DisconnectAnalysis {
  // Case 2: Server restart / shutdown
  if (isServerShutdown) {
    return {
      category: DisconnectCategory.SERVER_RESTART,
      statusCode: undefined,
      errorName: 'ServerShutdown',
      errorMessage: '',
      shouldReconnect: false,
      clearAuth: false,
      humanReason: 'Server restart/shutdown. Authentication preserved.'
    };
  }

  // Case 5: Explicit logout by administrator
  if (isExplicitLogout) {
    return {
      category: DisconnectCategory.EXPLICIT_LOGOUT,
      statusCode: undefined,
      errorName: 'ExplicitLogout',
      errorMessage: '',
      shouldReconnect: false,
      clearAuth: true,
      humanReason: 'Administrator explicitly unlinked WhatsApp device.'
    };
  }

  // Manual pause/disconnect by administrator without logout
  if (isManualDisconnect) {
    return {
      category: DisconnectCategory.MANUAL_DISCONNECT,
      statusCode: undefined,
      errorName: 'ManualDisconnect',
      errorMessage: '',
      shouldReconnect: false,
      clearAuth: false,
      humanReason: 'Administrator paused WhatsApp connection.'
    };
  }

  const err = lastDisconnect?.error;
  const boom = err as Boom;
  const statusCode = boom?.output?.statusCode;
  const errorMsg = err?.message || 'Connection closed unexpectedly';
  const errorName = err?.name || 'Error';

  // Case 1: Temporary network / stream reconnection - restartRequired (515)
  // Baileys specifically issues 515 when WhatsApp asks the client to immediately reconnect
  if (statusCode === DisconnectReason.restartRequired || statusCode === 515) {
    return {
      category: DisconnectCategory.TEMPORARY_NETWORK,
      statusCode,
      errorName: 'RestartRequired',
      errorMessage: '', // Routine credential synchronization restart, not an error
      shouldReconnect: true,
      isImmediateRestart: true,
      clearAuth: false,
      humanReason: 'WhatsApp protocol requested socket restart (creds synchronized).'
    };
  }

  // Case 3: Stream Conflict / Session Replaced / Active Elsewhere
  // Note: WhatsApp emits "Stream Errored (conflict)" (often with statusCode 401 or 440)
  // when another socket connects or when reconnection overlaps.
  // CRITICAL RULE: Socket conflict or session replacement MUST NOT clear authentication state!
  const isConflict =
    statusCode === DisconnectReason.connectionReplaced ||
    statusCode === 440 ||
    errorMsg.toLowerCase().includes('conflict');

  if (isConflict) {
    return {
      category: DisconnectCategory.SERVICE_INTERRUPTION,
      statusCode,
      errorName: 'StreamConflict',
      errorMessage: '', // Routine stream conflict handled by backoff, not an unhandled error
      shouldReconnect: true,
      clearAuth: false,
      humanReason: 'WhatsApp connection conflict or stream active elsewhere. Authentication preserved.'
    };
  }

  // Case 4: Authentication failure (Device unlinked or logged out from phone)
  // Checked AFTER conflict check so that "Stream Errored (conflict)" is never mistaken for an unlinking!
  if (statusCode === DisconnectReason.loggedOut || statusCode === 401) {
    return {
      category: DisconnectCategory.AUTHENTICATION_FAILURE,
      statusCode,
      errorName,
      errorMessage: errorMsg,
      shouldReconnect: false,
      clearAuth: true,
      humanReason: 'Device unlinked or logged out from phone. Session invalid.'
    };
  }

  // Case 6: Permanent/invalid authentication (multi-device key mismatch or forbidden)
  if (
    statusCode === DisconnectReason.multideviceMismatch ||
    statusCode === DisconnectReason.forbidden ||
    statusCode === 403 ||
    statusCode === 411
  ) {
    return {
      category: DisconnectCategory.PERMANENT_INVALID_AUTH,
      statusCode,
      errorName,
      errorMessage: errorMsg,
      shouldReconnect: false,
      clearAuth: true,
      humanReason: 'Cryptographic multi-device credentials rejected by WhatsApp.'
    };
  }

  // Case 3: WhatsApp service interruption (500 badSession, 502, 503 unavailableService, 504)
  if (
    statusCode === DisconnectReason.unavailableService ||
    statusCode === 503 ||
    statusCode === 502 ||
    statusCode === 504 ||
    statusCode === DisconnectReason.badSession ||
    statusCode === 500
  ) {
    return {
      category: DisconnectCategory.SERVICE_INTERRUPTION,
      statusCode,
      errorName,
      errorMessage: errorMsg,
      shouldReconnect: true,
      clearAuth: false,
      humanReason: 'WhatsApp servers temporarily unavailable or sync interrupted.'
    };
  }

  // Case 1: Temporary network disconnection (408 timedOut, connectionLost, 428 connectionClosed, socket hung up, etc.)
  return {
    category: DisconnectCategory.TEMPORARY_NETWORK,
    statusCode,
    errorName,
    errorMessage: errorMsg,
    shouldReconnect: true,
    clearAuth: false,
    humanReason: `Temporary network drop (${statusCode ? `HTTP ${statusCode}` : errorMsg}).`
  };
}

/**
 * Calculates exponential backoff with jitter
 * Schedule: 1s, 2s, 4s, 8s, 16s, max 30s
 * Jitter: ±20% random spread to prevent synchronized retries
 */
export function calculateBackoffWithJitter(attempt: number): {
  delayMs: number;
  baseMs: number;
  jitterMs: number;
} {
  const schedule = [1000, 2000, 4000, 8000, 16000, 30000];
  const baseMs = attempt <= schedule.length ? schedule[attempt - 1] : 30000;

  // Jitter factor between 0.80 and 1.20 (±20%)
  const jitterOffset = (Math.random() * 0.4 - 0.2) * baseMs;
  const jitterMs = Math.round(jitterOffset);
  const delayMs = Math.max(500, Math.min(baseMs + jitterMs, 35000));

  return { delayMs, baseMs, jitterMs };
}
