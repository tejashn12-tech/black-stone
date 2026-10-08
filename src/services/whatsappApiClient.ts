/**
 * Frontend WhatsApp API Client
 *
 * Communicates strictly via HTTP REST with the backend Express server.
 * This client contains ZERO Baileys logic, ZERO socket handling, and ZERO raw QR processing.
 */

export type WhatsAppState =
  | 'DISCONNECTED'
  | 'CONNECTING'
  | 'WAITING_FOR_QR'
  | 'QR_SCANNED'
  | 'AUTHENTICATING'
  | 'CONNECTED'
  | 'RECONNECTING'
  | 'LOGGED_OUT'
  | 'ERROR';

export interface StateTransitionEvent {
  from: WhatsAppState;
  to: WhatsAppState;
  reason?: string;
  timestamp: string;
}

export type MessageDeliveryStatus =
  | 'QUEUED'
  | 'SENDING'
  | 'SENT'
  | 'SERVER_ACK'
  | 'DELIVERED'
  | 'READ'
  | 'PLAYED'
  | 'FAILED';

export interface MessageTransition {
  status: MessageDeliveryStatus;
  timestamp: string;
  reason: string;
  rawStatus?: string | number;
}

export interface WhatsAppMessageRecord {
  id: string;
  messageId: string | null;
  recipientPhone: string;
  recipientJid?: string;
  recipientName: string;
  content: string;
  type: string;
  status: MessageDeliveryStatus;
  statusDisplay: string;
  sentAt: string | null;
  serverAckAt: string | null;
  deliveredAt: string | null;
  readAt: string | null;
  failedAt: string | null;
  errorMessage: string | null;
  transitions: MessageTransition[];
  memberId?: string | null;
  receiptNo?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WhatsAppClientStatus {
  state: WhatsAppState;
  status: 'disconnected' | 'connecting' | 'qr_ready' | 'connected' | 'reconnecting' | 'logged_out' | 'error';
  phoneNumber: string | null;
  connectedAt: string | null;
  deviceInfo: string | null;
  hasQr: boolean;
  qrExpiresAt: string | null;
  lastError: string | null;
  isServiceUnavailable?: boolean;
  reconnectAttempt?: number;
  recentTransitions?: StateTransitionEvent[];
  updatedAt: string;
}

export interface WhatsAppQrResponse {
  success: boolean;
  qrDataUrl: string | null;
  expiresAt: string | null;
  state?: WhatsAppState;
  error?: string;
}

export interface SendWhatsAppResponse {
  success: boolean;
  messageId?: string;
  trackingId?: string;
  status?: MessageDeliveryStatus;
  statusDisplay?: string;
  recipientPhone?: string;
  timestamp?: string;
  transitions?: MessageTransition[];
  isDuplicate?: boolean;
  idempotencyKey?: string;
  error?: string;
  code?: string;
  retryAfterSeconds?: number;
}

const getAuthHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  try {
    const adminSession = localStorage.getItem('bsf_admin_session');
    if (adminSession) {
      headers['Authorization'] = `Bearer ${adminSession}`;
    }
  } catch {}

  return headers;
};

const API_BASE_URL = '/api/whatsapp';

// Cache and in-flight deduplication for WhatsApp status requests to prevent redundant API storms
let cachedStatus: { data: WhatsAppClientStatus; timestamp: number } | null = null;
let inFlightStatusPromise: Promise<WhatsAppClientStatus> | null = null;
const STATUS_CACHE_TTL_MS = 2500;

/**
 * Retrieves the current connection status from the backend service.
 * Automatically deduplicates simultaneous calls and uses a short TTL cache.
 */
export async function fetchWhatsAppStatus(forceRefresh = false): Promise<WhatsAppClientStatus> {
  const now = Date.now();
  if (!forceRefresh && cachedStatus && (now - cachedStatus.timestamp) < STATUS_CACHE_TTL_MS) {
    return cachedStatus.data;
  }

  if (inFlightStatusPromise) {
    return inFlightStatusPromise;
  }

  inFlightStatusPromise = (async () => {
    try {
      const res = await fetch('/api/whatsapp/status', {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!res.ok) {
        throw new Error(`WhatsApp service unavailable (HTTP ${res.status})`);
      }

      const data = await res.json();
      const clientStatus: WhatsAppClientStatus = {
        state: data.state || 'DISCONNECTED',
        status: data.status || 'disconnected',
        phoneNumber: data.phoneNumber || null,
        connectedAt: data.connectedAt || null,
        deviceInfo: data.deviceInfo || null,
        hasQr: !!data.hasQr,
        qrExpiresAt: data.qrExpiresAt || null,
        lastError: data.lastError || null,
        isServiceUnavailable: false,
        reconnectAttempt: data.reconnectAttempt || 0,
        recentTransitions: data.recentTransitions || [],
        updatedAt: data.updatedAt || new Date().toISOString()
      };

      cachedStatus = { data: clientStatus, timestamp: Date.now() };
      return clientStatus;
    } catch (err: any) {
      const fallbackStatus: WhatsAppClientStatus = {
        state: 'DISCONNECTED',
        status: 'disconnected',
        phoneNumber: null,
        connectedAt: null,
        deviceInfo: null,
        hasQr: false,
        qrExpiresAt: null,
        lastError: err?.message || 'WhatsApp service unavailable',
        isServiceUnavailable: true,
        reconnectAttempt: 0,
        recentTransitions: [],
        updatedAt: new Date().toISOString()
      };
      cachedStatus = { data: fallbackStatus, timestamp: Date.now() };
      return fallbackStatus;
    } finally {
      inFlightStatusPromise = null;
    }
  })();

  return inFlightStatusPromise;
}

/**
 * Retrieves the current Base64 PNG QR code generated server-side
 */
export async function fetchWhatsAppQr(): Promise<WhatsAppQrResponse> {
  try {
    const res = await fetch('/api/whatsapp/qr', {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch QR code (HTTP ${res.status})`);
    }

    return await res.json();
  } catch (err: any) {
    return {
      success: false,
      qrDataUrl: null,
      expiresAt: null,
      error: err?.message || 'Failed to fetch QR code from server'
    };
  }
}

/**
 * Initiates the Baileys connection on the backend
 */
export async function initiateWhatsAppConnect(): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const res = await fetch('/api/whatsapp/connect', {
      method: 'POST',
      headers: getAuthHeaders()
    });

    const data = await res.json();
    return data;
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Failed to initiate WhatsApp connection'
    };
  }
}

/**
 * Disconnects the socket or logs out the device
 */
export async function terminateWhatsAppSession(logout = false): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const res = await fetch('/api/whatsapp/disconnect', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ logout })
    });

    return await res.json();
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Failed to disconnect WhatsApp'
    };
  }
}

/**
 * Dispatches a message through the backend Baileys gateway with truthful status tracking
 * and transactional idempotency protection.
 */
export async function dispatchWhatsAppMessage(
  to: string,
  text: string,
  type = 'custom',
  metadata?: {
    recipientName?: string;
    memberId?: string;
    receiptNo?: string;
    idempotencyKey?: string;
  }
): Promise<SendWhatsAppResponse> {
  try {
    const headers = getAuthHeaders();
    if (metadata?.idempotencyKey) {
      headers['X-Idempotency-Key'] = metadata.idempotencyKey;
    }

    const res = await fetch('/api/whatsapp/send', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        to,
        text,
        type,
        recipientName: metadata?.recipientName,
        memberId: metadata?.memberId,
        receiptNo: metadata?.receiptNo,
        idempotencyKey: metadata?.idempotencyKey
      })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return {
        success: false,
        code: data.code,
        retryAfterSeconds: data.retryAfterSeconds,
        error: data.error || `HTTP ${res.status}: Failed to send message`
      };
    }

    return data;
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Failed to communicate with WhatsApp dispatch service'
    };
  }
}

/**
 * Dispatches an automated New Member Admission WhatsApp Welcome notification.
 * Protected by idempotency key: admissionWhatsAppNotification:{memberId}
 */
export async function dispatchAdmissionNotification(
  member: any,
  options?: {
    customTemplate?: string;
    testMode?: boolean;
    testPhone?: string;
    idempotencyKey?: string;
  }
): Promise<SendWhatsAppResponse> {
  try {
    const res = await fetch('/api/whatsapp/notify/admission', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        member,
        customTemplate: options?.customTemplate,
        testMode: options?.testMode || false,
        testPhone: options?.testPhone,
        idempotencyKey: options?.idempotencyKey
      })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return {
        success: false,
        status: data.status || 'FAILED',
        error: data.error || `HTTP ${res.status}: Failed to dispatch admission notification`,
        isDuplicate: data.isDuplicate || false
      };
    }
    return data;
  } catch (err: any) {
    return {
      success: false,
      status: 'FAILED',
      error: err?.message || 'Failed to connect to WhatsApp notification endpoint'
    };
  }
}

/**
 * Dispatches an automated Membership Renewal confirmation WhatsApp notification.
 * Protected by idempotency key: renewal:{renewalId}:{memberId}
 */
export async function dispatchRenewalNotification(
  member: any,
  renewalDetails: {
    renewalId: string;
    planName: string;
    renewalDate: string;
    expiryDate: string;
    receiptNo?: string;
    payment?: any;
    gymSettings?: any;
    renewal?: any;
    isPaid?: boolean;
  },
  options?: {
    customTemplate?: string;
    testMode?: boolean;
    testPhone?: string;
    idempotencyKey?: string;
    payment?: any;
    gymSettings?: any;
  }
): Promise<SendWhatsAppResponse> {
  try {
    const res = await fetch('/api/whatsapp/notify/renewal', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        member,
        renewalDetails,
        payment: options?.payment || renewalDetails.payment,
        gymSettings: options?.gymSettings || renewalDetails.gymSettings,
        customTemplate: options?.customTemplate,
        testMode: options?.testMode || false,
        testPhone: options?.testPhone,
        idempotencyKey: options?.idempotencyKey
      })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return {
        success: false,
        status: data.status || 'FAILED',
        error: data.error || `HTTP ${res.status}: Failed to dispatch renewal notification`,
        isDuplicate: data.isDuplicate || false
      };
    }
    return data;
  } catch (err: any) {
    return {
      success: false,
      status: 'FAILED',
      error: err?.message || 'Failed to connect to WhatsApp notification endpoint'
    };
  }
}

/**
 * Sends an official PDF receipt document to a member via the existing WhatsApp connection
 */
export async function sendWhatsAppReceipt(data: {
  member: any;
  payment: any;
  gymSettings?: any;
  renewal?: any;
  targetPhone?: string;
  customMessage?: string;
  idempotencyKey?: string;
  isSettlement?: boolean;
}): Promise<SendWhatsAppResponse> {
  try {
    const res = await fetch('/api/whatsapp/receipt/send', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    const resData = await res.json();
    if (!res.ok || !resData.success) {
      return {
        success: false,
        status: resData.status || 'FAILED',
        error: resData.error || `HTTP ${res.status}: Failed to send receipt over WhatsApp`,
        isDuplicate: resData.isDuplicate || false
      };
    }
    return resData;
  } catch (err: any) {
    return {
      success: false,
      status: 'FAILED',
      error: err?.message || 'Failed to connect to WhatsApp receipt send endpoint'
    };
  }
}

/**
 * Fetches the official generated A4 PDF receipt binary blob from backend
 */
export async function fetchReceiptPdfBlob(data: {
  member: any;
  payment: any;
  gymSettings?: any;
  renewal?: any;
}): Promise<Blob | null> {
  try {
    const res = await fetch('/api/whatsapp/receipt/pdf', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) return null;
    return await res.blob();
  } catch (err) {
    console.error('Failed to fetch receipt PDF blob:', err);
    return null;
  }
}

/**
 * Retrieves truthful message records and status progression from backend
 */
export async function fetchWhatsAppMessages(limit = 50): Promise<{ success: boolean; messages: WhatsAppMessageRecord[]; error?: string }> {
  try {
    const res = await fetch(`/api/whatsapp/messages?limit=${limit}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    const data = await res.json();
    return {
      success: data.success !== false,
      messages: data.messages || []
    };
  } catch (err: any) {
    return {
      success: false,
      messages: [],
      error: err?.message || 'Failed to fetch WhatsApp message history'
    };
  }
}

/**
 * Sends a system test message to verify end-to-end socket delivery with double-click protection
 */
export async function dispatchWhatsAppTest(
  testPhone: string,
  message?: string,
  testType = 'connectivity',
  idempotencyKey?: string
): Promise<SendWhatsAppResponse> {
  try {
    const headers = getAuthHeaders();
    if (idempotencyKey) {
      headers['X-Idempotency-Key'] = idempotencyKey;
    }

    const res = await fetch('/api/whatsapp/test', {
      method: 'POST',
      headers,
      body: JSON.stringify({ testPhone, message, testType, idempotencyKey })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return {
        success: false,
        code: data.code,
        retryAfterSeconds: data.retryAfterSeconds,
        error: data.error || `HTTP ${res.status}: Failed to send test message`
      };
    }

    return data;
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Failed to send test message'
    };
  }
}

/**
 * Reconnects WhatsApp by safely terminating current socket and initializing a fresh connection
 */
export async function reconnectWhatsApp(): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    await terminateWhatsAppSession(false);
    return await initiateWhatsAppConnect();
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Failed to reconnect WhatsApp'
    };
  }
}

/**
 * Fetches a single message by ID or tracking ID to inspect live delivery status
 */
export async function fetchWhatsAppMessageById(id: string): Promise<{ success: boolean; message?: WhatsAppMessageRecord; error?: string }> {
  try {
    const res = await fetch(`/api/whatsapp/messages/${encodeURIComponent(id)}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return await res.json();
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Failed to fetch message details'
    };
  }
}

/**
 * Inspects status of an idempotency key directly from the backend
 */
export async function checkWhatsAppIdempotency(key: string): Promise<{ success: boolean; exists: boolean; record?: any; error?: string }> {
  try {
    const res = await fetch(`/api/whatsapp/idempotency/${encodeURIComponent(key)}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return await res.json();
  } catch (err: any) {
    return {
      success: false,
      exists: false,
      error: err?.message || 'Failed to verify idempotency state'
    };
  }
}

/**
 * Runs backend automated reminder engine using Firestore transaction idempotency
 */
export async function runWhatsAppAutomationsBackend(options?: {
  items?: any[];
  customDate?: string;
}): Promise<{ success: boolean; summary?: any; error?: string }> {
  try {
    const res = await fetch('/api/whatsapp/automations/run', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(options || {})
    });
    return await res.json();
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Failed to execute WhatsApp automated dispatch'
    };
  }
}

/**
 * Fetches current server-side renewal automation status
 */
export async function fetchRenewalAutomationStatus(): Promise<{
  success: boolean;
  schedulerRunning?: boolean;
  timezone?: string;
  currentKolkataTime?: string;
  lastRunDateKolkata?: string | null;
  lastRunSummary?: any;
  historyCount?: number;
  whatsappStatus?: string;
  error?: string;
}> {
  try {
    const res = await fetch('/api/whatsapp/automations/status', {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return await res.json();
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Failed to fetch automation status'
    };
  }
}

/**
 * Previews eligible candidates for today in Asia/Kolkata
 */
export async function fetchRenewalCandidates(date?: string): Promise<{
  success: boolean;
  candidates?: any[];
  totalCandidates?: number;
  totalMembers?: number;
  activeMembers?: number;
  currentKolkataTime?: any;
  error?: string;
}> {
  try {
    const query = date ? `?date=${encodeURIComponent(date)}` : '';
    const res = await fetch(`/api/whatsapp/automations/candidates${query}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return await res.json();
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Failed to fetch candidates'
    };
  }
}

/**
 * Manually triggers server-side renewal automation run
 */
export async function triggerRenewalAutomation(options?: {
  customDate?: string;
  dryRun?: boolean;
}): Promise<{ success: boolean; summary?: any; error?: string }> {
  try {
    const res = await fetch('/api/whatsapp/automations/run-renewal', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(options || {})
    });
    return await res.json();
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Failed to trigger renewal automation'
    };
  }
}

export interface WhatsAppDiagnosticsData {
  whatsAppService: 'ONLINE' | 'OFFLINE';
  baileysConnection: 'CONNECTED' | 'CONNECTING' | 'RECONNECTING' | 'DISCONNECTED' | 'LOGGED_OUT';
  authentication: 'VALID' | 'NOT_AUTHENTICATED' | 'UNKNOWN';
  lastSuccessfulConnection: string | null;
  lastDisconnect: string | null;
  lastDisconnectReason: string | null;
  lastMessageAttempt: string | null;
  lastSuccessfulMessage: string | null;
  messagesQueued: number;
  messagesSending: number;
  messagesSent: number;
  messagesFailed: number;
  reconnectAttempts: number;
  qrCurrentlyAvailable: boolean;
  diagnosticsTimestamp: string;
}

/**
 * Fetches real-time server health and WhatsApp subsystem diagnostics.
 * Strictly does not expose credentials, private keys, session files, or sensitive server info.
 */
export async function getWhatsAppDiagnostics(): Promise<{
  success: boolean;
  diagnostics: WhatsAppDiagnosticsData;
  error?: string;
}> {
  try {
    const res = await fetch('/api/whatsapp/diagnostics', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        ...getAuthHeaders()
      }
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return {
        success: false,
        diagnostics: errData.diagnostics || {
          whatsAppService: 'OFFLINE',
          baileysConnection: 'DISCONNECTED',
          authentication: 'UNKNOWN',
          lastSuccessfulConnection: null,
          lastDisconnect: null,
          lastDisconnectReason: `HTTP ${res.status}: ${res.statusText}`,
          lastMessageAttempt: null,
          lastSuccessfulMessage: null,
          messagesQueued: 0,
          messagesSending: 0,
          messagesSent: 0,
          messagesFailed: 0,
          reconnectAttempts: 0,
          qrCurrentlyAvailable: false,
          diagnosticsTimestamp: new Date().toISOString()
        },
        error: errData.error || `HTTP ${res.status}: WhatsApp service unreachable`
      };
    }

    const data = await res.json();
    return {
      success: true,
      diagnostics: data.diagnostics
    };
  } catch (err: any) {
    return {
      success: false,
      diagnostics: {
        whatsAppService: 'OFFLINE',
        baileysConnection: 'DISCONNECTED',
        authentication: 'UNKNOWN',
        lastSuccessfulConnection: null,
        lastDisconnect: null,
        lastDisconnectReason: err?.message || 'Network error reaching WhatsApp backend',
        lastMessageAttempt: null,
        lastSuccessfulMessage: null,
        messagesQueued: 0,
        messagesSending: 0,
        messagesSent: 0,
        messagesFailed: 0,
        reconnectAttempts: 0,
        qrCurrentlyAvailable: false,
        diagnosticsTimestamp: new Date().toISOString()
      },
      error: err?.message || 'Network connection failed'
    };
  }
}

/**
 * Fetches status of BSF Enquiry Follow-Up Automation
 */
export async function fetchEnquiryFollowUpStatus(): Promise<{
  success: boolean;
  schedulerActive?: boolean;
  isProcessing?: boolean;
  timezone?: string;
  currentKolkataTime?: any;
  lastRunSummary?: any;
  error?: string;
}> {
  try {
    const res = await fetch(`${API_BASE_URL}/enquiry-automations/status`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      return { success: false, error: `HTTP ${res.status}` };
    }
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network error' };
  }
}

/**
 * Previews eligible enquiry follow-up candidates
 */
export async function fetchEnquiryFollowUpCandidates(date?: string): Promise<{
  success: boolean;
  candidates?: any[];
  totalCandidates?: number;
  totalEnquiries?: number;
  error?: string;
}> {
  try {
    const url = date
      ? `${API_BASE_URL}/enquiry-automations/candidates?date=${encodeURIComponent(date)}`
      : `${API_BASE_URL}/enquiry-automations/candidates`;
    const res = await fetch(url, { headers: getAuthHeaders() });
    if (!res.ok) {
      return { success: false, error: `HTTP ${res.status}` };
    }
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network error' };
  }
}

/**
 * Triggers server-side enquiry follow-up check
 */
export async function runEnquiryFollowUpCheck(options?: {
  customDate?: string;
  dryRun?: boolean;
}): Promise<{
  success: boolean;
  summary?: any;
  error?: string;
}> {
  try {
    const res = await fetch(`${API_BASE_URL}/enquiry-automations/run`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(options || {})
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, error: err.error || `HTTP ${res.status}` };
    }
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network error' };
  }
}

/**
 * Admin control: Stops follow-ups for an enquiry
 */
export async function stopEnquiryFollowUps(enquiryId: string, reason?: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/enquiry-automations/${encodeURIComponent(enquiryId)}/stop`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ reason })
    });
    if (!res.ok) return false;
    const data = await res.json();
    return Boolean(data.success);
  } catch {
    return false;
  }
}

/**
 * Admin control: Resumes follow-ups for an enquiry
 */
export async function resumeEnquiryFollowUps(enquiryId: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/enquiry-automations/${encodeURIComponent(enquiryId)}/resume`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      }
    });
    if (!res.ok) return false;
    const data = await res.json();
    return Boolean(data.success);
  } catch {
    return false;
  }
}

/**
 * Admin control: Sends manual WhatsApp message to an enquiry without altering 4-step sequence
 */
export async function sendEnquiryManualWhatsAppMessage(
  enquiryId: string,
  text: string
): Promise<{ success: boolean; error?: string; messageId?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/enquiry-automations/${encodeURIComponent(enquiryId)}/manual-message`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { success: false, error: data.error || `HTTP ${res.status}` };
    }
    return data;
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network error' };
  }
}



