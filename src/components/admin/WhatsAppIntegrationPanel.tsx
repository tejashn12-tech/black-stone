import React, { useState, useEffect, useRef } from 'react';
import { useGym } from '../../context/GymContext';
import { WhatsAppMessageLog } from '../../types';
import { WhatsAppStatusBadge } from './WhatsAppStatusBadge';
import {
  fetchWhatsAppStatus,
  fetchWhatsAppQr,
  initiateWhatsAppConnect,
  terminateWhatsAppSession,
  reconnectWhatsApp,
  dispatchWhatsAppTest,
  fetchWhatsAppMessageById,
  fetchRenewalAutomationStatus,
  fetchRenewalCandidates,
  triggerRenewalAutomation,
  getWhatsAppDiagnostics,
  WhatsAppDiagnosticsData,
  WhatsAppClientStatus,
  WhatsAppState,
  WhatsAppMessageRecord
} from '../../services/whatsappApiClient';
import {
  QrCode,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Send,
  LogOut,
  ShieldCheck,
  Zap,
  Clock,
  Phone,
  MessageSquare,
  Sparkles,
  Laptop,
  Radio,
  ArrowRight,
  ShieldAlert,
  Check,
  CheckCheck,
  Info,
  X,
  Calendar,
  Bell,
  Users,
  Activity,
  Server,
  RotateCcw,
  Loader2
} from 'lucide-react';

interface TestMessageState {
  status: 'Queued' | 'Sending' | 'Sent' | 'Delivered' | 'Read' | 'Failed';
  trackingId?: string;
  recipientPhone?: string;
  timestamp?: string;
  deliveredAt?: string;
  readAt?: string;
  errorMessage?: string;
  statusDisplay?: string;
  isDuplicate?: boolean;
}

export const WhatsAppIntegrationPanel: React.FC = () => {
  const {
    whatsAppLogs,
    clearWhatsAppLogs,
    sendWhatsAppMessage,
    refreshWhatsAppLogs
  } = useGym();

  const [status, setStatus] = useState<WhatsAppClientStatus>({
    state: 'DISCONNECTED',
    status: 'disconnected',
    phoneNumber: null,
    connectedAt: null,
    deviceInfo: null,
    hasQr: false,
    qrExpiresAt: null,
    lastError: null,
    isServiceUnavailable: false,
    reconnectAttempt: 0,
    recentTransitions: [],
    updatedAt: new Date().toISOString()
  });

  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Test Message States
  const [testPhone, setTestPhone] = useState<string>('');
  const [testMessage, setTestMessage] = useState<string>(
    'Hello from Blackstone Fitness Mysuru! This is a test message to verify WhatsApp connectivity. 🏋️‍♂️'
  );
  const [isSendingTest, setIsSendingTest] = useState<boolean>(false);
  const [testMessageState, setTestMessageState] = useState<TestMessageState | null>(null);

  const [selectedLog, setSelectedLog] = useState<WhatsAppMessageLog | null>(null);

  // Individual Resend State
  const [isResendingId, setIsResendingId] = useState<string | null>(null);
  const [resendNotice, setResendNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleResendLog = async (log: WhatsAppMessageLog) => {
    if (isResendingId) return;
    setIsResendingId(log.id);
    setResendNotice(null);
    try {
      const cleanPhone = (log.recipientPhone || '').replace(/\D/g, '');
      const freshIdempotencyKey = `resend:${cleanPhone || log.id}:${Date.now()}`;
      const msgContent = log.content || log.message || '';
      
      const res = await sendWhatsAppMessage(
        log.recipientPhone,
        log.recipientName || 'Member',
        msgContent,
        log.type || 'custom',
        {
          memberId: log.memberId,
          receiptNo: log.receiptNo,
          idempotencyKey: freshIdempotencyKey
        }
      );

      if (res.success) {
        setResendNotice({
          type: 'success',
          message: `Message successfully resent to ${log.recipientName} (${log.recipientPhone})!`
        });
      } else {
        setResendNotice({
          type: 'error',
          message: res.error || 'Failed to resend message.'
        });
      }
      await refreshWhatsAppLogs();
    } catch (err: any) {
      setResendNotice({
        type: 'error',
        message: err?.message || 'Error occurred while resending to individual.'
      });
    } finally {
      setIsResendingId(null);
      setTimeout(() => setResendNotice(null), 7000);
    }
  };

  const handleSendIndividualCandidate = async (candidate: any) => {
    const candidateKey = candidate.phone || candidate.idempotencyKey;
    if (isResendingId) return;
    setIsResendingId(candidateKey);
    setResendNotice(null);
    try {
      const cleanPhone = (candidate.phone || '').replace(/\D/g, '');
      const freshIdempotencyKey = `candidate:${cleanPhone}:${Date.now()}`;
      
      const res = await sendWhatsAppMessage(
        candidate.phone,
        candidate.memberName || 'Member',
        candidate.messageText,
        'custom_broadcast',
        {
          memberId: candidate.memberId,
          idempotencyKey: freshIdempotencyKey
        }
      );

      if (res.success) {
        setResendNotice({
          type: 'success',
          message: `Renewal reminder dispatched to ${candidate.memberName} (${candidate.phone})!`
        });
        await loadRenewalInfo();
      } else {
        setResendNotice({
          type: 'error',
          message: res.error || 'Failed to dispatch individual reminder.'
        });
      }
      await refreshWhatsAppLogs();
    } catch (err: any) {
      setResendNotice({
        type: 'error',
        message: err?.message || 'Error sending to candidate.'
      });
    } finally {
      setIsResendingId(null);
      setTimeout(() => setResendNotice(null), 7000);
    }
  };

  // Renewal Automation State
  const [renewalStatus, setRenewalStatus] = useState<any>(null);
  const [renewalCandidates, setRenewalCandidates] = useState<any[]>([]);
  const [isRunningRenewal, setIsRunningRenewal] = useState(false);
  const [renewalRunFeedback, setRenewalRunFeedback] = useState<string | null>(null);
  const [showCandidatesModal, setShowCandidatesModal] = useState(false);

  // Subsystem Diagnostics State
  const [diagnostics, setDiagnostics] = useState<WhatsAppDiagnosticsData | null>(null);
  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState<boolean>(false);
  const [diagnosticsError, setDiagnosticsError] = useState<string | null>(null);
  const [lastDiagnosticsRunAt, setLastDiagnosticsRunAt] = useState<string | null>(null);

  const formatDiagnosticTimestamp = (isoStr: string | null | undefined): string => {
    if (!isoStr) return 'None';
    try {
      const d = new Date(isoStr);
      if (isNaN(d.getTime())) return isoStr;
      return d.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }) + ' IST';
    } catch {
      return isoStr;
    }
  };

  const runDiagnostics = async () => {
    setIsRunningDiagnostics(true);
    setDiagnosticsError(null);
    try {
      const res = await getWhatsAppDiagnostics();
      setDiagnostics(res.diagnostics);
      setLastDiagnosticsRunAt(new Date().toISOString());
      if (!res.success && res.error) {
        setDiagnosticsError(res.error);
      }
    } catch (err: any) {
      setDiagnosticsError(err?.message || 'Failed to retrieve diagnostics.');
    } finally {
      setIsRunningDiagnostics(false);
    }
  };

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const testTrackIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch renewal automation status & candidates
  const loadRenewalInfo = async () => {
    try {
      const [statusRes, candRes] = await Promise.all([
        fetchRenewalAutomationStatus(),
        fetchRenewalCandidates()
      ]);
      if (statusRes.success) setRenewalStatus(statusRes);
      if (candRes.success && candRes.candidates) setRenewalCandidates(candRes.candidates);
    } catch (err) {
      console.warn('[WhatsAppPanel] Renewal info fetch notice:', err);
    }
  };

  const handleRunRenewalNow = async () => {
    setIsRunningRenewal(true);
    setRenewalRunFeedback(null);
    try {
      const res = await triggerRenewalAutomation();
      if (res.success && res.summary) {
        const s = res.summary;
        setRenewalRunFeedback(
          `Renewal Check Run Completed! Candidates: ${s.totalCandidates} | Sent: ${s.sentCount} | Disconnected Queued: ${s.disconnectedSkippedCount} | Duplicates Blocked: ${s.duplicatePreventedCount}`
        );
      } else {
        setRenewalRunFeedback(`Notice: ${res.error || 'Check completed'}`);
      }
      await loadRenewalInfo();
    } catch (err: any) {
      setRenewalRunFeedback(`Error: ${err?.message || 'Failed to trigger check'}`);
    } finally {
      setIsRunningRenewal(false);
      setTimeout(() => setRenewalRunFeedback(null), 8000);
    }
  };

  // Fetch status and QR from backend
  const loadStatus = async () => {
    try {
      const current = await fetchWhatsAppStatus();
      setStatus(current);

      if (current.isServiceUnavailable) {
        setQrDataUrl(null);
        return;
      }

      // Display QR when waiting for QR scan
      // Note: Do not refresh/regenerate the QR merely because the page polls
      if (current.state === 'WAITING_FOR_QR') {
        if (!qrDataUrl) {
          const qrRes = await fetchWhatsAppQr();
          if (qrRes.success && qrRes.qrDataUrl) {
            setQrDataUrl(qrRes.qrDataUrl);
          }
        }
      } else {
        // Hide QR after successful authentication or disconnected
        setQrDataUrl(null);
      }
    } catch (err: any) {
      console.warn('[WhatsAppPanel] Status fetch notice:', err);
    }
  };

  // Initial one-time diagnostics & renewal candidates load on panel mount
  useEffect(() => {
    loadRenewalInfo();
    runDiagnostics();
  }, []);

  // Adaptive polling: ONLY poll status while connecting, waiting for QR, or authenticating.
  // Once the connection becomes CONNECTED, ERROR, DISCONNECTED, or LOGGED_OUT: STOP polling.
  useEffect(() => {
    loadStatus();

    const isConnectingOrAuthenticating =
      status.state === 'CONNECTING' ||
      status.state === 'WAITING_FOR_QR' ||
      status.state === 'QR_SCANNED' ||
      status.state === 'AUTHENTICATING' ||
      status.state === 'RECONNECTING';

    if (isConnectingOrAuthenticating) {
      pollIntervalRef.current = setInterval(() => {
        loadStatus();
      }, 2500);
    } else {
      // Terminal or stable state: cease polling
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    }

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, [status.state]);

  // Clean up test message polling on unmount
  useEffect(() => {
    return () => {
      if (testTrackIntervalRef.current) {
        clearInterval(testTrackIntervalRef.current);
      }
    };
  }, []);

  // Handle Connect
  const handleConnect = async () => {
    setIsLoading(true);
    setActionError(null);
    try {
      const res = await initiateWhatsAppConnect();
      if (!res.success) {
        setActionError(res.error || 'Failed to start WhatsApp connection.');
      }
      await loadStatus();
    } catch (err: any) {
      setActionError(err?.message || 'Error initiating connection.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Disconnect
  const handleDisconnect = async (logout = false) => {
    if (
      logout &&
      !window.confirm(
        'Are you sure you want to unlink this WhatsApp account? The active session credentials will be purged, requiring a fresh QR scan.'
      )
    ) {
      return;
    }

    setIsLoading(true);
    setActionError(null);
    try {
      await terminateWhatsAppSession(logout);
      setQrDataUrl(null);
      await loadStatus();
    } catch (err: any) {
      setActionError(err?.message || 'Error disconnecting WhatsApp.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Reconnect
  const handleReconnect = async () => {
    setIsLoading(true);
    setActionError(null);
    try {
      const res = await reconnectWhatsApp();
      if (!res.success) {
        setActionError(res.error || 'Failed to reconnect WhatsApp.');
      }
      await loadStatus();
    } catch (err: any) {
      setActionError(err?.message || 'Error reconnecting WhatsApp.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Test Message Send & Delivery Tracking
  const handleSendTestMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testPhone || testPhone.trim().length < 10) {
      setTestMessageState({
        status: 'Failed',
        errorMessage: 'Please enter a valid phone number (at least 10 digits).'
      });
      return;
    }

    if (testTrackIntervalRef.current) {
      clearInterval(testTrackIntervalRef.current);
    }

    setIsSendingTest(true);

    // Initial state: Sending
    setTestMessageState({
      status: 'Sending',
      recipientPhone: testPhone.trim(),
      timestamp: new Date().toISOString(),
      statusDisplay: 'Sending payload to WhatsApp gateway...'
    });

    try {
      const idempotencyKey = `test:${testPhone.replace(/\D/g, '')}:${Date.now()}`;
      const res = await dispatchWhatsAppTest(
        testPhone.trim(),
        testMessage.trim(),
        'connectivity',
        idempotencyKey
      );

      if (!res.success) {
        setTestMessageState({
          status: 'Failed',
          recipientPhone: testPhone.trim(),
          errorMessage: res.error || 'Failed to dispatch test message.',
          timestamp: new Date().toISOString()
        });
        setIsSendingTest(false);
        return;
      }

      // Backend returned success: check exact returned status
      // In WhatsApp protocol, socket.sendMessage() returns when accepted by connection -> SENT
      const mappedInitialStatus: 'Queued' | 'Sending' | 'Sent' | 'Delivered' =
        res.status === 'QUEUED'
          ? 'Queued'
          : res.status === 'SENDING'
          ? 'Sending'
          : res.status === 'DELIVERED'
          ? 'Delivered'
          : 'Sent';

      setTestMessageState({
        status: mappedInitialStatus,
        trackingId: res.trackingId,
        recipientPhone: res.recipientPhone || testPhone.trim(),
        timestamp: res.timestamp || new Date().toISOString(),
        statusDisplay:
          res.statusDisplay ||
          (mappedInitialStatus === 'Sent'
            ? 'Accepted by WhatsApp connection (awaiting delivery confirmation)'
            : mappedInitialStatus),
        isDuplicate: res.isDuplicate
      });

      setIsSendingTest(false);

      // Start live polling of message status if trackingId exists and not already in terminal state
      if (res.trackingId && mappedInitialStatus !== 'Delivered') {
        const trackingId = res.trackingId;
        let attempts = 0;
        const maxAttempts = 20; // Poll for 30 seconds

        testTrackIntervalRef.current = setInterval(async () => {
          attempts += 1;
          try {
            const trackRes = await fetchWhatsAppMessageById(trackingId);
            if (trackRes.success && trackRes.message) {
              const msg: WhatsAppMessageRecord = trackRes.message;

              if (msg.status === 'DELIVERED') {
                // Truthful delivery confirmed by WhatsApp server/recipient device
                setTestMessageState((prev) => ({
                  ...prev,
                  status: 'Delivered',
                  deliveredAt: msg.deliveredAt || new Date().toISOString(),
                  statusDisplay: 'Delivered to recipient device'
                }));
                if (testTrackIntervalRef.current) {
                  clearInterval(testTrackIntervalRef.current);
                }
              } else if (msg.status === 'READ' || msg.status === 'PLAYED') {
                // Read receipt confirmed
                setTestMessageState((prev) => ({
                  ...prev,
                  status: 'Read',
                  readAt: msg.readAt || new Date().toISOString(),
                  statusDisplay: 'Read by recipient (blue ticks)'
                }));
                if (testTrackIntervalRef.current) {
                  clearInterval(testTrackIntervalRef.current);
                }
              } else if (msg.status === 'FAILED') {
                setTestMessageState((prev) => ({
                  ...prev,
                  status: 'Failed',
                  errorMessage: msg.errorMessage || 'Message delivery failed',
                  statusDisplay: 'Transmission failed'
                }));
                if (testTrackIntervalRef.current) {
                  clearInterval(testTrackIntervalRef.current);
                }
              } else if (msg.status === 'QUEUED') {
                setTestMessageState((prev) => ({
                  ...prev,
                  status: 'Queued',
                  statusDisplay: msg.statusDisplay
                }));
              } else if (msg.status === 'SENDING') {
                setTestMessageState((prev) => ({
                  ...prev,
                  status: 'Sending',
                  statusDisplay: msg.statusDisplay
                }));
              } else if (msg.status === 'SENT' || msg.status === 'SERVER_ACK') {
                setTestMessageState((prev) => ({
                  ...prev,
                  status: 'Sent',
                  statusDisplay: msg.statusDisplay || 'Accepted by WhatsApp connection'
                }));
              }
            }
          } catch (err) {
            console.warn('[WhatsAppPanel] Message tracking error:', err);
          }

          if (attempts >= maxAttempts) {
            if (testTrackIntervalRef.current) {
              clearInterval(testTrackIntervalRef.current);
            }
          }
        }, 1500);
      }
    } catch (err: any) {
      setTestMessageState({
        status: 'Failed',
        recipientPhone: testPhone.trim(),
        errorMessage: err?.message || 'Unexpected network error.',
        timestamp: new Date().toISOString()
      });
      setIsSendingTest(false);
    }
  };

  const isConnected = status.state === 'CONNECTED' && !status.isServiceUnavailable;
  const isConnecting =
    (status.state === 'CONNECTING' ||
      status.state === 'AUTHENTICATING' ||
      status.state === 'QR_SCANNED' ||
      isLoading) &&
    status.state !== 'WAITING_FOR_QR' &&
    status.state !== 'CONNECTED';
  const isWaitingForQr = status.state === 'WAITING_FOR_QR' && !status.isServiceUnavailable;
  const isReconnecting = status.state === 'RECONNECTING' && !status.isServiceUnavailable;
  const isDisconnected =
    (status.state === 'DISCONNECTED' ||
      status.state === 'LOGGED_OUT' ||
      status.state === 'ERROR') &&
    !isConnecting &&
    !isWaitingForQr &&
    !isReconnecting &&
    !isConnected;

  // Render Status Line according to specification
  const renderStatus = () => {
    if (status.isServiceUnavailable) {
      return (
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-red-400 font-bold text-sm tracking-wide">
            WhatsApp service unavailable
          </span>
        </div>
      );
    }

    switch (status.state) {
      case 'CONNECTED':
        return (
          <div className="flex items-center gap-2">
            <span className="text-base leading-none">🟢</span>
            <span className="text-emerald-400 font-bold text-sm tracking-wide">
              Connected
            </span>
          </div>
        );
      case 'CONNECTING':
      case 'AUTHENTICATING':
      case 'QR_SCANNED':
        return (
          <div className="flex items-center gap-2">
            <span className="text-base leading-none">🟡</span>
            <span className="text-amber-400 font-bold text-sm tracking-wide">
              Connecting
            </span>
          </div>
        );
      case 'RECONNECTING':
        return (
          <div className="flex items-center gap-2">
            <span className="text-base leading-none">🟡</span>
            <span className="text-amber-400 font-bold text-sm tracking-wide">
              Reconnecting
            </span>
          </div>
        );
      case 'WAITING_FOR_QR':
        return (
          <div className="flex items-center gap-2">
            <span className="text-base leading-none">🔵</span>
            <span className="text-blue-400 font-bold text-sm tracking-wide">
              Waiting for QR
            </span>
          </div>
        );
      case 'LOGGED_OUT':
        return (
          <div className="flex items-center gap-2">
            <span className="text-base leading-none">🔴</span>
            <span className="text-rose-400 font-bold text-sm tracking-wide">
              Logged out
            </span>
          </div>
        );
      case 'ERROR':
        return (
          <div className="flex items-center gap-2">
            <span className="text-base leading-none">🔴</span>
            <span className="text-red-400 font-bold text-sm tracking-wide">
              Error
            </span>
          </div>
        );
      case 'DISCONNECTED':
      default:
        return (
          <div className="flex items-center gap-2">
            <span className="text-base leading-none">🔴</span>
            <span className="text-red-400 font-bold text-sm tracking-wide">
              Disconnected
            </span>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Error Notice */}
      {actionError && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Main Grid: CONNECTION on Left, TEST MESSAGE on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CONNECTION CARD */}
        <div className="lg:col-span-6 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Header: CONNECTION */}
            <div className="border-b border-zinc-800 pb-4">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                <h2 className="text-xs font-black tracking-widest text-zinc-400 uppercase font-mono">
                  CONNECTION
                </h2>
                {status.isServiceUnavailable && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                    Offline
                  </span>
                )}
              </div>

              {/* Status Row */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-zinc-400">Status:</span>
                {renderStatus()}
              </div>
            </div>

            {/* Service Unavailable Notice */}
            {status.isServiceUnavailable && (
              <div className="p-4 rounded-xl bg-red-950/30 border border-red-800/50 text-xs text-red-300 space-y-1">
                <div className="font-bold flex items-center gap-2 text-red-200">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span>WhatsApp service unavailable</span>
                </div>
                <p className="text-zinc-400">
                  Cannot connect to the WhatsApp background service. Make sure the server is running and try again.
                </p>
              </div>
            )}

            {/* State: When Disconnected */}
            {isDisconnected && !status.isServiceUnavailable && (
              <div className="p-6 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-4 text-center">
                <div className="w-12 h-12 rounded-2xl bg-zinc-800/80 border border-zinc-700 text-zinc-400 flex items-center justify-center mx-auto">
                  <QrCode className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white">WhatsApp Not Connected</h3>
                  <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                    Connect WhatsApp to enable transactional member notifications, expiry alerts, and payment receipts.
                  </p>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={handleConnect}
                    className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-black font-extrabold text-xs transition inline-flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Connect WhatsApp</span>
                  </button>
                </div>
              </div>
            )}

            {/* State: When Connecting */}
            {isConnecting && !status.isServiceUnavailable && (
              <div className="p-6 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-4 text-center">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
                  <RefreshCw className="w-6 h-6 animate-spin" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white">Connecting WhatsApp...</h3>
                  <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                    Initializing socket and authenticating credentials.
                  </p>
                </div>
                <div>
                  <button
                    type="button"
                    disabled
                    className="px-6 py-2.5 rounded-xl bg-amber-500/30 text-amber-300 font-extrabold text-xs border border-amber-500/40 inline-flex items-center gap-2 cursor-not-allowed"
                  >
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Connecting...</span>
                  </button>
                </div>
              </div>
            )}

            {/* State: When Reconnecting */}
            {isReconnecting && !status.isServiceUnavailable && (
              <div className="p-6 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-4 text-center">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
                  <RefreshCw className="w-6 h-6 animate-spin" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white">Reconnecting to WhatsApp</h3>
                  <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                    Transient socket disconnection. Saved credentials are preserved on server while auto-reconnecting (Attempt {status.reconnectAttempt || 1}/6).
                  </p>
                </div>
                <div>
                  <button
                    type="button"
                    disabled
                    className="px-6 py-2.5 rounded-xl bg-amber-500/30 text-amber-300 font-extrabold text-xs border border-amber-500/40 inline-flex items-center gap-2 cursor-not-allowed"
                  >
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Reconnecting...</span>
                  </button>
                </div>
              </div>
            )}

            {/* State: When Waiting for QR */}
            {isWaitingForQr && !status.isServiceUnavailable && (
              <div className="p-6 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-4 text-center">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white">
                    Scan this QR using WhatsApp → Linked Devices
                  </p>
                  <p className="text-xs text-zinc-400">
                    Point your camera at this code to link your admin device.
                  </p>
                </div>

                {/* Display Current QR Code */}
                <div className="p-3 bg-white rounded-2xl shadow-xl inline-block mx-auto">
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt="Scan this QR using WhatsApp"
                      className="w-56 h-56 object-contain"
                    />
                  ) : (
                    <div className="w-56 h-56 flex flex-col items-center justify-center gap-2 text-zinc-500">
                      <RefreshCw className="w-6 h-6 animate-spin text-zinc-700" />
                      <span className="text-xs">Loading QR Code...</span>
                    </div>
                  )}
                </div>

                <div className="text-[11px] text-zinc-500 max-w-xs mx-auto">
                  Open WhatsApp on your phone &gt; Settings or Menu (⋮) &gt; Linked Devices &gt; Link a device.
                </div>
              </div>
            )}

            {/* State: After Successful Authentication (Connected) */}
            {isConnected && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div className="text-xs">
                    <strong className="block text-sm text-white font-bold mb-0.5">
                      WhatsApp Connected
                    </strong>
                    <span>Baileys multi-device socket authenticated and active.</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1">
                    <span className="text-zinc-500 uppercase tracking-wider text-[10px] font-bold">
                      Phone number
                    </span>
                    <div className="text-base font-black text-white font-mono flex items-center gap-2">
                      <Phone className="w-4 h-4 text-emerald-400" />
                      <span>{status.phoneNumber || 'Front Desk'}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1">
                    <span className="text-zinc-500 uppercase tracking-wider text-[10px] font-bold">
                      Connection time
                    </span>
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-400" />
                      <span>
                        {status.connectedAt
                          ? new Date(status.connectedAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : 'Active'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Buttons: [ Disconnect ] [ Reconnect ] */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleDisconnect(false)}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-bold text-xs transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <LogOut className="w-4 h-4 text-zinc-400" />
                    <span>Disconnect</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleReconnect}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold text-xs transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 text-emerald-400 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>Reconnect</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Device Unlink Option */}
          {isConnected && (
            <div className="pt-4 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-500">
              <span>Change phone or reset session credentials?</span>
              <button
                type="button"
                onClick={() => handleDisconnect(true)}
                className="text-red-400 hover:text-red-300 hover:underline transition"
              >
                Unlink Account (Log Out)
              </button>
            </div>
          )}
        </div>

        {/* TEST MESSAGE CARD */}
        <div className="lg:col-span-6 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6 flex flex-col justify-between">
          <div className="space-y-5">
            {/* Header: TEST MESSAGE */}
            <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-xs font-black tracking-widest text-zinc-400 uppercase font-mono">
                  TEST MESSAGE
                </h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Verify actual socket transmission and confirmed receipt.
                </p>
              </div>
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>

            {/* Offline Alert if not connected */}
            {!isConnected && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  WhatsApp is not connected. Connect WhatsApp first to test message delivery.
                </span>
              </div>
            )}

            <form onSubmit={handleSendTestMessage} className="space-y-4">
              {/* Phone number */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Phone number
                </label>
                <input
                  type="tel"
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  placeholder="e.g. +91 98803 97294 or 10-digit number"
                  className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none font-mono"
                />
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Message
                </label>
                <textarea
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  rows={3}
                  placeholder="Enter message content..."
                  className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none resize-none leading-relaxed"
                />
              </div>

              {/* [ Send Test Message ] Button */}
              <button
                type="submit"
                disabled={isSendingTest || !testPhone.trim() || !isConnected}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-black font-extrabold text-xs transition flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
              >
                {isSendingTest ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Test Message</span>
                  </>
                )}
              </button>
            </form>

            {/* Delivery Status Display */}
            {testMessageState && (
              <div className="pt-2 border-t border-zinc-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-400">Actual Backend Status:</span>

                  {/* Render only allowed truthful states */}
                  {testMessageState.status === 'Queued' && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Queued</span>
                    </span>
                  )}

                  {testMessageState.status === 'Sending' && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 text-sky-400 animate-spin" />
                      <span>Sending</span>
                    </span>
                  )}

                  {testMessageState.status === 'Sent' && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-zinc-800 text-zinc-200 border border-zinc-700 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Sent</span>
                    </span>
                  )}

                  {testMessageState.status === 'Delivered' && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                      <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Delivered</span>
                    </span>
                  )}

                  {testMessageState.status === 'Read' && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
                      <CheckCheck className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Read</span>
                    </span>
                  )}

                  {testMessageState.status === 'Failed' && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/30 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                      <span>Failed</span>
                    </span>
                  )}
                </div>

                {/* Explanatory Truthful Delivery Badge Info */}
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs space-y-1">
                  {testMessageState.status === 'Queued' && (
                    <p className="text-zinc-400">
                      Message queued locally in transmission pipeline.
                    </p>
                  )}
                  {testMessageState.status === 'Sending' && (
                    <p className="text-zinc-400">
                      Transmitting message payload across active Baileys socket...
                    </p>
                  )}
                  {testMessageState.status === 'Sent' && (
                    <p className="text-zinc-400">
                      Message accepted by WhatsApp connection. Awaiting confirmed delivery to recipient device (single tick).
                    </p>
                  )}
                  {testMessageState.status === 'Delivered' && (
                    <p className="text-emerald-400">
                      ✓ Confirmed delivered to recipient device by WhatsApp network receipt (double ticks).
                    </p>
                  )}
                  {testMessageState.status === 'Read' && (
                    <p className="text-cyan-400">
                      ✓ Confirmed read by recipient (blue ticks).
                    </p>
                  )}
                  {testMessageState.status === 'Failed' && (
                    <p className="text-red-400">
                      {testMessageState.errorMessage || 'Transmission failed.'}
                    </p>
                  )}

                  {testMessageState.recipientPhone && (
                    <div className="text-[10px] text-zinc-500 flex items-center justify-between pt-1">
                      <span>Recipient: {testMessageState.recipientPhone}</span>
                      {testMessageState.timestamp && (
                        <span>
                          {new Date(testMessageState.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                          })}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="pt-2 text-[11px] text-zinc-500 flex items-center justify-between">
            <span>Server rate limiting &amp; idempotency active</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500/70" />
          </div>
        </div>
      </div>

      {/* WHATSAPP DIAGNOSTICS SECTION */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-black tracking-widest text-zinc-400 uppercase font-mono flex items-center gap-2">
                  <span>WhatsApp Diagnostics</span>
                  {diagnostics && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        diagnostics.whatsAppService === 'ONLINE'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : 'bg-red-500/20 text-red-300 border-red-500/30'
                      }`}
                    >
                      {diagnostics.whatsAppService}
                    </span>
                  )}
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Subsystem health check, Baileys socket state, and actual message metrics
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {lastDiagnosticsRunAt && (
              <span className="text-[11px] text-zinc-500 font-mono hidden md:inline">
                Evaluated: {formatDiagnosticTimestamp(lastDiagnosticsRunAt)}
              </span>
            )}
            <button
              type="button"
              onClick={runDiagnostics}
              disabled={isRunningDiagnostics}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-bold text-xs transition flex items-center gap-2 shadow-lg shadow-cyan-950/40"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRunningDiagnostics ? 'animate-spin' : ''}`} />
              <span>{isRunningDiagnostics ? 'Running Diagnostics...' : 'Run Diagnostics'}</span>
            </button>
          </div>
        </div>

        {diagnosticsError && (
          <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-300 flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span className="flex-1 font-mono text-[11px]">{diagnosticsError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {/* 1. WhatsApp service: ONLINE / OFFLINE */}
          <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80 flex flex-col justify-between">
            <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2 font-mono">
              WhatsApp service:
            </div>
            <div>
              <span
                className={`inline-block px-2.5 py-1 rounded-md text-xs font-mono font-bold border ${
                  diagnostics?.whatsAppService === 'ONLINE'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-red-500/20 text-red-300 border-red-500/40'
                }`}
              >
                {diagnostics?.whatsAppService ?? (status.isServiceUnavailable ? 'OFFLINE' : 'ONLINE')}
              </span>
            </div>
          </div>

          {/* 2. Baileys connection: CONNECTED / CONNECTING / RECONNECTING / DISCONNECTED / LOGGED_OUT */}
          <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80 flex flex-col justify-between">
            <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2 font-mono">
              Baileys connection:
            </div>
            <div>
              <span
                className={`inline-block px-2.5 py-1 rounded-md text-xs font-mono font-bold border ${
                  diagnostics?.baileysConnection === 'CONNECTED'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : diagnostics?.baileysConnection === 'CONNECTING' || diagnostics?.baileysConnection === 'RECONNECTING'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : diagnostics?.baileysConnection === 'LOGGED_OUT'
                    ? 'bg-red-500/20 text-red-300 border-red-500/40'
                    : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                }`}
              >
                {diagnostics?.baileysConnection ?? (
                  status.state === 'CONNECTED'
                    ? 'CONNECTED'
                    : status.state === 'RECONNECTING'
                    ? 'RECONNECTING'
                    : status.state === 'LOGGED_OUT'
                    ? 'LOGGED_OUT'
                    : status.state === 'CONNECTING' || status.state === 'WAITING_FOR_QR' || status.state === 'QR_SCANNED' || status.state === 'AUTHENTICATING'
                    ? 'CONNECTING'
                    : 'DISCONNECTED'
                )}
              </span>
            </div>
          </div>

          {/* 3. Authentication: VALID / NOT_AUTHENTICATED / UNKNOWN */}
          <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80 flex flex-col justify-between">
            <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2 font-mono">
              Authentication:
            </div>
            <div>
              <span
                className={`inline-block px-2.5 py-1 rounded-md text-xs font-mono font-bold border ${
                  diagnostics?.authentication === 'VALID'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : diagnostics?.authentication === 'NOT_AUTHENTICATED'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                }`}
              >
                {diagnostics?.authentication ?? (status.state === 'CONNECTED' ? 'VALID' : 'NOT_AUTHENTICATED')}
              </span>
            </div>
          </div>

          {/* 4. Last successful connection */}
          <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80 flex flex-col justify-between">
            <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2 font-mono">
              Last successful connection:
            </div>
            <div
              className="text-xs font-mono font-semibold text-zinc-200 truncate"
              title={diagnostics?.lastSuccessfulConnection || status.connectedAt || 'None'}
            >
              {formatDiagnosticTimestamp(diagnostics?.lastSuccessfulConnection || status.connectedAt)}
            </div>
          </div>

          {/* 5. Last disconnect */}
          <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80 flex flex-col justify-between">
            <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2 font-mono">
              Last disconnect:
            </div>
            <div
              className="text-xs font-mono font-semibold text-zinc-200 truncate"
              title={diagnostics?.lastDisconnect || 'None'}
            >
              {formatDiagnosticTimestamp(diagnostics?.lastDisconnect)}
            </div>
          </div>

          {/* 6. Last disconnect reason */}
          <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80 flex flex-col justify-between sm:col-span-2 lg:col-span-1">
            <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2 font-mono">
              Last disconnect reason:
            </div>
            <div
              className="text-xs font-mono font-semibold text-zinc-300 line-clamp-2"
              title={diagnostics?.lastDisconnectReason || 'None'}
            >
              {diagnostics?.lastDisconnectReason || 'None'}
            </div>
          </div>

          {/* 7. Last message attempt */}
          <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80 flex flex-col justify-between">
            <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2 font-mono">
              Last message attempt:
            </div>
            <div
              className="text-xs font-mono font-semibold text-zinc-200 truncate"
              title={diagnostics?.lastMessageAttempt || 'None'}
            >
              {formatDiagnosticTimestamp(diagnostics?.lastMessageAttempt)}
            </div>
          </div>

          {/* 8. Last successful message */}
          <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80 flex flex-col justify-between">
            <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2 font-mono">
              Last successful message:
            </div>
            <div
              className="text-xs font-mono font-semibold text-zinc-200 truncate"
              title={diagnostics?.lastSuccessfulMessage || 'None'}
            >
              {formatDiagnosticTimestamp(diagnostics?.lastSuccessfulMessage)}
            </div>
          </div>

          {/* 9. Messages queued */}
          <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80 flex flex-col justify-between">
            <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2 font-mono">
              Messages queued:
            </div>
            <div className="text-lg font-mono font-black text-amber-400">
              {diagnostics?.messagesQueued ?? 0}
            </div>
          </div>

          {/* 10. Messages sending */}
          <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80 flex flex-col justify-between">
            <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2 font-mono">
              Messages sending:
            </div>
            <div className="text-lg font-mono font-black text-sky-400">
              {diagnostics?.messagesSending ?? 0}
            </div>
          </div>

          {/* 11. Messages sent */}
          <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80 flex flex-col justify-between">
            <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2 font-mono">
              Messages sent:
            </div>
            <div className="text-lg font-mono font-black text-emerald-400">
              {diagnostics?.messagesSent ?? 0}
            </div>
          </div>

          {/* 12. Messages failed */}
          <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80 flex flex-col justify-between">
            <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2 font-mono">
              Messages failed:
            </div>
            <div
              className={`text-lg font-mono font-black ${
                (diagnostics?.messagesFailed ?? 0) > 0 ? 'text-red-400' : 'text-zinc-400'
              }`}
            >
              {diagnostics?.messagesFailed ?? 0}
            </div>
          </div>

          {/* 13. Reconnect attempts */}
          <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80 flex flex-col justify-between">
            <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2 font-mono">
              Reconnect attempts:
            </div>
            <div className="text-lg font-mono font-black text-zinc-200">
              {diagnostics?.reconnectAttempts ?? status.reconnectAttempt ?? 0}
            </div>
          </div>

          {/* 14. QR currently available */}
          <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80 flex flex-col justify-between">
            <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2 font-mono">
              QR currently available:
            </div>
            <div>
              <span
                className={`inline-block px-2.5 py-1 rounded-md text-xs font-mono font-bold border ${
                  (diagnostics?.qrCurrentlyAvailable ?? status.hasQr)
                    ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                    : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                }`}
              >
                {(diagnostics?.qrCurrentlyAvailable ?? status.hasQr) ? 'YES' : 'NO'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* AUTOMATION & RECENT DISPATCH SECTION */}
      <div className="space-y-6">
        {/* Membership Renewal Automation Engine */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Membership Renewal Reminders (Server Engine)</span>
                </h3>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Automated reminders at 7, 3, and 1 day prior to membership expiry.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowCandidatesModal(true)}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition flex items-center gap-1.5"
              >
                <Users className="w-3.5 h-3.5 text-zinc-400" />
                <span>Today's Candidates</span>
                {renewalCandidates.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500/30 text-emerald-300 font-bold">
                    {renewalCandidates.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={handleRunRenewalNow}
                disabled={isRunningRenewal}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white transition flex items-center gap-1.5 shadow-lg shadow-emerald-950/40"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRunningRenewal ? 'animate-spin' : ''}`} />
                <span>{isRunningRenewal ? 'Evaluating...' : 'Run Check Now'}</span>
              </button>
            </div>
          </div>

          {/* Feedback Alert */}
          {renewalRunFeedback && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="flex-1">{renewalRunFeedback}</div>
              <button
                type="button"
                onClick={() => setRenewalRunFeedback(null)}
                className="text-emerald-400 hover:text-emerald-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Automation Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 mb-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Kolkata Engine Time</span>
              </div>
              <div className="text-sm font-bold text-white font-mono">
                {renewalStatus?.currentKolkataTime || 'Loading...'}
              </div>
              <div className="text-[10px] text-zinc-500 mt-0.5">
                Scheduled daily cycle: 09:00 AM IST
              </div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 mb-1">
                <Bell className="w-3.5 h-3.5 text-amber-400" />
                <span>Configured Intervals</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-200 mt-1">
                <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800">7 Days</span>
                <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800">3 Days</span>
                <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800">1 Day</span>
              </div>
              <div className="text-[10px] text-zinc-500 mt-1">
                Strict idempotency &amp; opt-in verified
              </div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Connection Guarantee</span>
              </div>
              <div className="text-xs font-bold text-zinc-200 mt-1 flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-amber-400'}`}
                />
                <span>{isConnected ? 'Direct Dispatch Ready' : 'Auto-Queue upon Disconnect'}</span>
              </div>
              <div className="text-[10px] text-zinc-500 mt-1">
                No fake "sent" states when offline
              </div>
            </div>
          </div>

          {/* Candidate Quick Preview Banner */}
          {renewalCandidates.length > 0 && (() => {
            const deliveredCount = renewalCandidates.filter(
              (c) => c.deliveryState === 'SUCCESS'
            ).length;
            const pendingCount = renewalCandidates.length - deliveredCount;
            return (
              <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-zinc-300">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      pendingCount === 0 ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
                    }`}
                  />
                  <span>
                    {pendingCount === 0 ? (
                      <span>
                        <strong>All {renewalCandidates.length} eligible member(s)</strong> due for renewal reminders today have been notified (0 duplicates).
                      </span>
                    ) : (
                      <span>
                        <strong>{renewalCandidates.length} eligible member(s)</strong> due today: {deliveredCount > 0 ? `${deliveredCount} delivered, ` : ''}{pendingCount} pending dispatch.
                      </span>
                    )}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCandidatesModal(true)}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold text-[11px] underline"
                >
                  Review Details
                </button>
              </div>
            );
          })()}
        </div>

        {/* Recent Dispatch Log with Truthful Delivery Tracking */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-zinc-400" />
                <span>Recent Transmission Logs</span>
              </h3>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Real-time delivery confirmation from WhatsApp network events
              </p>
            </div>
            {whatsAppLogs.length > 0 && (
              <button
                type="button"
                onClick={clearWhatsAppLogs}
                className="text-[11px] text-zinc-500 hover:text-zinc-300 transition"
              >
                Clear
              </button>
            )}
          </div>

          {/* Resend to Individual Notice */}
          {resendNotice && (
            <div className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-2 transition ${
              resendNotice.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}>
              <div className="flex items-center gap-2">
                {resendNotice.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span className="font-medium">{resendNotice.message}</span>
              </div>
              <button
                type="button"
                onClick={() => setResendNotice(null)}
                className="text-zinc-400 hover:text-white transition p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Status Definition Legend */}
          <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 text-[11px] space-y-2">
            <div className="flex items-center gap-1.5 text-zinc-300 font-semibold">
              <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Truthful Delivery Progression:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[10px]">
              <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                <div className="flex items-center gap-1 font-bold text-zinc-300 mb-1">
                  <Check className="w-3 h-3 text-zinc-400" />
                  <span>Accepted (Sent)</span>
                </div>
                <p className="text-zinc-400">Accepted by WhatsApp connection stream</p>
              </div>
              <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                <div className="flex items-center gap-1 font-bold text-emerald-300 mb-1">
                  <CheckCheck className="w-3 h-3 text-emerald-400" />
                  <span>Delivered</span>
                </div>
                <p className="text-zinc-400">Confirmed reached recipient device</p>
              </div>
              <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                <div className="flex items-center gap-1 font-bold text-cyan-300 mb-1">
                  <CheckCheck className="w-3 h-3 text-cyan-400" />
                  <span>Read</span>
                </div>
                <p className="text-zinc-400">Recipient opened &amp; viewed message</p>
              </div>
            </div>
          </div>

          {whatsAppLogs.length === 0 ? (
            <p className="text-xs text-zinc-500 italic py-4 text-center">
              No WhatsApp messages logged in this session yet.
            </p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {whatsAppLogs.slice(0, 10).map((log) => (
                <div
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80 hover:border-zinc-700 transition flex items-center justify-between text-xs cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <WhatsAppStatusBadge status={log.status} compact />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-white group-hover:text-emerald-400 transition">
                          {log.recipientName}
                        </span>
                        <span className="text-[11px] text-zinc-500 font-mono">
                          {log.recipientPhone}
                        </span>
                        {/* Notification Type Badge */}
                        {(() => {
                          const normType = (log.type || '').toUpperCase();
                          if (normType === 'NEW_MEMBER') {
                            return (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 uppercase tracking-wide">
                                New Member
                              </span>
                            );
                          }
                          if (normType === 'MEMBERSHIP_RENEWAL') {
                            return (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/15 text-sky-300 border border-sky-500/30 uppercase tracking-wide">
                                Membership Renewal
                              </span>
                            );
                          }
                          if (normType) {
                            return (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-medium bg-zinc-800 text-zinc-400 border border-zinc-700 uppercase tracking-wide">
                                {normType.replace(/_/g, ' ')}
                              </span>
                            );
                          }
                          return null;
                        })()}
                        {log.isDuplicate && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            Duplicate Prevented
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-400 line-clamp-1 max-w-md mt-0.5">
                        {log.content}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <button
                      type="button"
                      title="Resend to this individual recipient"
                      disabled={isResendingId === log.id || status.state !== 'CONNECTED'}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleResendLog(log);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-emerald-600/30 text-zinc-300 hover:text-emerald-300 border border-zinc-700 hover:border-emerald-500/40 text-[11px] font-semibold transition flex items-center gap-1.5 shrink-0 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 shadow-sm"
                    >
                      {isResendingId === log.id ? (
                        <Loader2 className="w-3 h-3 animate-spin text-emerald-400" />
                      ) : (
                        <RotateCcw className="w-3 h-3 text-emerald-400" />
                      )}
                      <span>Resend</span>
                    </button>

                    <div className="text-right">
                      <span className="text-[10px] text-zinc-500 font-mono block">
                        {new Date(log.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })} {new Date(log.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      <span className="text-[10px] text-emerald-400/80 group-hover:underline">
                        View details →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Selected Log Inspector Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base">Message Delivery Audit</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Recipient (Member):</span>
                <span className="font-bold text-white">
                  {selectedLog.recipientName} ({selectedLog.recipientPhone})
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Notification Type:</span>
                <span className="font-mono text-emerald-400 font-bold text-[11px] uppercase">
                  {selectedLog.type || 'Custom'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Date / Time:</span>
                <span className="text-zinc-300 font-mono text-[11px]">
                  {new Date(selectedLog.timestamp).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Current Status:</span>
                <WhatsAppStatusBadge status={selectedLog.status} statusDisplay={selectedLog.statusDisplay} />
              </div>
              {selectedLog.errorMessage && (
                <div className="p-2 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-[11px] flex items-start gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                  <span>{selectedLog.errorMessage}</span>
                </div>
              )}
              {selectedLog.messageId && (
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">WhatsApp Message ID:</span>
                  <span className="font-mono text-zinc-300 text-[10px]">
                    {selectedLog.messageId}
                  </span>
                </div>
              )}
            </div>

            <div className="p-3 rounded-2xl bg-zinc-950/60 border border-zinc-800/60 text-xs text-zinc-300">
              <span className="text-zinc-500 font-bold uppercase tracking-wider text-[10px] block mb-1">
                Content
              </span>
              <p className="whitespace-pre-wrap">{selectedLog.content}</p>
            </div>

            {/* Transition Timeline */}
            <div className="space-y-2">
              <span className="text-zinc-400 font-bold uppercase tracking-wider text-[10px] block">
                Status Progression Timeline
              </span>
              <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-2.5 max-h-40 overflow-y-auto">
                {selectedLog.transitions && selectedLog.transitions.length > 0 ? (
                  selectedLog.transitions.map((t, idx) => (
                    <div key={`${t.timestamp}-${idx}`} className="flex items-start gap-2.5 text-xs">
                      <div className="mt-0.5 shrink-0">
                        {t.status === 'DELIVERED' ? (
                          <CheckCheck className="w-4 h-4 text-emerald-400" />
                        ) : t.status === 'READ' ? (
                          <CheckCheck className="w-4 h-4 text-cyan-400" />
                        ) : t.status === 'FAILED' ? (
                          <AlertCircle className="w-4 h-4 text-red-400" />
                        ) : (
                          <Clock className="w-4 h-4 text-amber-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">{t.status}</span>
                          <span className="text-[10px] text-zinc-500 font-mono">
                            {new Date(t.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit'
                            })}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-0.5">{t.reason}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-zinc-400 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{selectedLog.status.toUpperCase()}</span>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {new Date(selectedLog.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400">
                      {selectedLog.statusDisplay || 'Recorded status event'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {selectedLog.errorMessage && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{selectedLog.errorMessage}</span>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between border-t border-zinc-800">
              <button
                type="button"
                disabled={isResendingId === selectedLog.id || status.state !== 'CONNECTED'}
                onClick={() => handleResendLog(selectedLog)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-emerald-600/20"
              >
                {isResendingId === selectedLog.id ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Resending to Individual...</span>
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Resend to Individual</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Renewal Candidates Modal */}
      {showCandidatesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">
                    Eligible Renewal Candidates (Asia/Kolkata)
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Calculated for current date in IST ({renewalStatus?.currentKolkataTime || 'Today'})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCandidatesModal(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {renewalCandidates.length === 0 ? (
              <div className="py-12 text-center text-zinc-400 text-sm">
                No memberships are due for 7, 3, or 1-day reminders today in Asia/Kolkata timezone.
              </div>
            ) : (
              <div className="space-y-3">
                {renewalCandidates.map((c) => (
                  <div
                    key={c.idempotencyKey}
                    className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{c.memberName}</span>
                        <span className="text-xs text-zinc-400 font-mono">({c.phone})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {c.deliveryState === 'SUCCESS' ? (
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                            <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Sent Today</span>
                          </span>
                        ) : c.deliveryState === 'PENDING' ? (
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-amber-400" />
                            <span>Queued (Offline)</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                            <Zap className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Ready</span>
                          </span>
                        )}
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-zinc-800 text-zinc-300 border border-zinc-700">
                          {c.daysLeft} Day{c.daysLeft > 1 ? 's' : ''} Left
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-zinc-400">
                      <span>
                        Expiry: <strong className="text-zinc-200">{c.expiryDate}</strong>
                      </span>
                      <span>
                        Idempotency Key:{' '}
                        <code className="text-emerald-400 bg-zinc-900 px-1.5 py-0.5 rounded">
                          {c.idempotencyKey}
                        </code>
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-zinc-900/90 border border-zinc-800/60 text-xs text-zinc-300">
                      <p className="font-medium italic">"{c.messageText}"</p>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-zinc-500 font-mono">
                        {c.membershipType || 'Renewal Alert'}
                      </span>
                      <button
                        type="button"
                        disabled={isResendingId === (c.phone || c.idempotencyKey) || status.state !== 'CONNECTED'}
                        onClick={() => handleSendIndividualCandidate(c)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold transition flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                      >
                        {isResendingId === (c.phone || c.idempotencyKey) ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                            <span>Dispatching...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{c.deliveryState === 'SUCCESS' ? 'Resend to Individual' : 'Send to Individual'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 flex items-center justify-between border-t border-zinc-800">
              <span className="text-xs text-zinc-500">
                Server process checks daily at 09:00 AM IST with zero duplicate locks.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowCandidatesModal(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
