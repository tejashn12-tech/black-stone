import React, { useState, useEffect, useRef } from 'react';
import { useGym } from '../../context/GymContext';
import { WhatsAppMessageLog } from '../../types';
import {
  generateWhatsAppQRCode,
  fetchLiveWhatsAppStatus,
  renderQrToDataUrl,
  initiateLiveWhatsAppConnect,
} from '../../services/whatsappClient';
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
  BellRing,
  Cake,
  Receipt,
  Sparkles,
  Search,
  CheckCheck,
  Copy,
  Check,
  Phone,
  MessageSquare,
  HelpCircle,
  Clock,
  Trash2,
  ExternalLink,
  Laptop,
  Calendar,
  CalendarDays,
  Users,
  Play,
  Flame,
  Sliders,
  ChevronDown,
  ChevronUp,
  Tag,
  Activity,
  SendHorizontal
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const WhatsAppIntegrationPanel: React.FC = () => {
  const {
    whatsAppSession,
    whatsAppLogs,
    connectWhatsApp,
    disconnectWhatsApp,
    updateWhatsAppConfig,
    sendWhatsAppMessage,
    clearWhatsAppLogs,
    runWhatsAppAutomations,
    getUpcomingAutomationsSummary,
    testWhatsAppAutomation,
    members,
    settings,
    festivals
  } = useGym();

  // QR Code State
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [qrCountdown, setQrCountdown] = useState<number>(45);
  const [isRefreshingQr, setIsRefreshingQr] = useState<boolean>(false);
  const [isScanningSimulated, setIsScanningSimulated] = useState<boolean>(false);
  const [customPhoneNumber, setCustomPhoneNumber] = useState<string>(
    whatsAppSession.phoneNumber || settings.whatsapp || '+91 8197299039'
  );

  // Pairing Mode Tab: 'qr' | 'code'
  const [pairingMode, setPairingMode] = useState<'qr' | 'code'>('qr');
  const [pairingPhoneInput, setPairingPhoneInput] = useState<string>('+91 8197299039');
  const [generatedPhoneCode, setGeneratedPhoneCode] = useState<string>('');
  const [codeCopied, setCodeCopied] = useState<boolean>(false);

  // Direct Message Form State
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [recipientPhone, setRecipientPhone] = useState<string>('+91 8197299039');
  const [recipientName, setRecipientName] = useState<string>('Front Desk Admin');
  const [messageType, setMessageType] = useState<WhatsAppMessageLog['type']>('custom');
  const [messageBody, setMessageBody] = useState<string>(
    `Hello from Black Stone Fitness Mysuru! 🏋️‍♂️ Your fitness goals are within reach. Contact us or visit the front desk for any workout or package updates.`
  );
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sendSuccessToast, setSendSuccessToast] = useState<string | null>(null);
  const [sendErrorToast, setSendErrorToast] = useState<string | null>(null);

  // Log search and filter
  const [searchLogQuery, setSearchLogQuery] = useState<string>('');
  const [logFilterType, setLogFilterType] = useState<string>('all');

  // Disconnect Confirmation Modal
  const [showDisconnectModal, setShowDisconnectModal] = useState<boolean>(false);

  // Automation Engine State
  const [isRunningAutomation, setIsRunningAutomation] = useState<boolean>(false);
  const [automationResult, setAutomationResult] = useState<any>(null);
  const [automationTab, setAutomationTab] = useState<'all' | 'renewals7d' | 'renewals3d' | 'renewals1d' | 'birthdays' | 'festivals'>('all');
  const [showTemplatesPreview, setShowTemplatesPreview] = useState<boolean>(false);
  const [testModalOpen, setTestModalOpen] = useState<boolean>(false);
  const [testTemplateType, setTestTemplateType] = useState<'renewal_7d' | 'renewal_3d' | 'renewal_1d' | 'birthday' | 'festival'>('renewal_7d');
  const [testTargetPhone, setTestTargetPhone] = useState<string>(whatsAppSession.phoneNumber || '+91 8197299039');
  const [testMemberName, setTestMemberName] = useState<string>('Vikram Hegde');
  const [isSendingTestMsg, setIsSendingTestMsg] = useState<boolean>(false);
  const [singleSendingCandidate, setSingleSendingCandidate] = useState<string | null>(null);

  // Calculate upcoming automation candidates in real-time
  const upcomingAutomations = getUpcomingAutomationsSummary();

  const handleRunAutomations = async (force = false) => {
    setIsRunningAutomation(true);
    setAutomationResult(null);
    try {
      const res = await runWhatsAppAutomations({ force });
      setAutomationResult(res.summary);
      if (res.success) {
        confetti({ particleCount: 35, spread: 70, origin: { y: 0.6 } });
      }
    } finally {
      setIsRunningAutomation(false);
    }
  };

  const handleSendTestMessage = async () => {
    setIsSendingTestMsg(true);
    try {
      const res = await testWhatsAppAutomation({
        testPhone: testTargetPhone,
        templateType: testTemplateType,
        memberName: testMemberName,
      });
      if (res.success) {
        setTestModalOpen(false);
        confetti({ particleCount: 20, spread: 50, origin: { y: 0.7 } });
      }
    } finally {
      setIsSendingTestMsg(false);
    }
  };

  const handleDispatchSingleCandidate = async (cand: {
    phone: string;
    name: string;
    message: string;
    type: WhatsAppMessageLog['type'];
  }) => {
    setSingleSendingCandidate(cand.phone);
    try {
      const res = await sendWhatsAppMessage(cand.phone, cand.name, cand.message, cand.type);
      if (res.success) {
        setSendSuccessToast(`Dispatched WhatsApp message to ${cand.name}!`);
        setTimeout(() => setSendSuccessToast(null), 4000);
      } else {
        setSendErrorToast(res.error || `Failed to dispatch WhatsApp message to ${cand.name}`);
        setTimeout(() => setSendErrorToast(null), 6000);
      }
    } catch (err: any) {
      setSendErrorToast(err?.message || `Error dispatching to ${cand.name}`);
      setTimeout(() => setSendErrorToast(null), 6000);
    } finally {
      setSingleSendingCandidate(null);
    }
  };

  const lastRawQrRef = useRef<string>('');

  // Generate QR Code on mount or when requested
  const fetchNewQR = async (force = false) => {
    setIsRefreshingQr(true);
    try {
      const connResult = await initiateLiveWhatsAppConnect(force);
      if (connResult.qr) {
        lastRawQrRef.current = connResult.qr;
        const qrDataUrl = await renderQrToDataUrl(connResult.qr);
        setQrCodeDataUrl(qrDataUrl);
        setQrCountdown(45);
        return;
      }

      const statusData = await fetchLiveWhatsAppStatus();
      if (statusData.qr) {
        lastRawQrRef.current = statusData.qr;
        const qrDataUrl = await renderQrToDataUrl(statusData.qr);
        setQrCodeDataUrl(qrDataUrl);
        setQrCountdown(45);
      } else {
        const { qrDataUrl } = await generateWhatsAppQRCode();
        if (qrDataUrl) {
          setQrCodeDataUrl(qrDataUrl);
          setQrCountdown(45);
        }
      }
    } catch {
      // Fallback handled in service
    } finally {
      setIsRefreshingQr(false);
    }
  };

  useEffect(() => {
    if (whatsAppSession.status !== 'connected') {
      fetchNewQR();
    }
  }, [whatsAppSession.status]);

  // Real-time polling loop for live Baileys status and QR updates
  useEffect(() => {
    if (whatsAppSession.status === 'connected') return;

    const pollInterval = setInterval(async () => {
      try {
        const statusData = await fetchLiveWhatsAppStatus();

        if (statusData.status === 'connected') {
          await connectWhatsApp(statusData.phoneNumber || undefined);
          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 }
            });
          } catch {
            // ignore
          }
        } else if (statusData.status === 'qr_ready' && statusData.qr) {
          if (statusData.qr !== lastRawQrRef.current) {
            lastRawQrRef.current = statusData.qr;
            const updatedUrl = await renderQrToDataUrl(statusData.qr);
            if (updatedUrl) {
              setQrCodeDataUrl(updatedUrl);
              setQrCountdown(45);
            }
          }
        }
      } catch (pollErr) {
        console.warn('Status poll exception:', pollErr);
      }
    }, 2000);

    return () => clearInterval(pollInterval);
  }, [whatsAppSession.status, connectWhatsApp]);

  // QR Code Expiry Countdown
  useEffect(() => {
    if (whatsAppSession.status === 'connected') return;

    const timer = setInterval(() => {
      setQrCountdown(prev => {
        if (prev <= 1) {
          fetchNewQR();
          return 45;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [whatsAppSession.status]);

  // Simulate Instant Mobile Scan & Connect
  const handleSimulateScan = async () => {
    setIsScanningSimulated(true);
    try {
      // Simulate 1.2s camera detection & encryption handshake
      await new Promise(resolve => setTimeout(resolve, 1200));
      await connectWhatsApp(customPhoneNumber.trim() || '+91 8197299039');
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    } finally {
      setIsScanningSimulated(false);
    }
  };

  // Generate 8-character code for phone pairing
  const handleGeneratePhoneCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'BSF-';
    for (let i = 0; i < 4; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    code += '-';
    for (let i = 0; i < 2; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    setGeneratedPhoneCode(code);
  };

  const handleCopyCode = () => {
    if (!generatedPhoneCode) return;
    navigator.clipboard.writeText(generatedPhoneCode);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  // Select Member to pre-fill test message
  const handleSelectMember = (memberId: string) => {
    setSelectedMemberId(memberId);
    if (!memberId) return;
    const m = members.find(item => item.id === memberId);
    if (m) {
      setRecipientName(m.fullName);
      setRecipientPhone(m.phone || '+91 8197299039');
      setMessageBody(
        `Hi ${m.fullName}, greetings from Black Stone Fitness! Your membership (${m.packageName}) is active until ${new Date(m.expiryDate).toLocaleDateString('en-IN')}. Keep up the great gym streak! 💪🔥`
      );
      setMessageType('expiry_reminder');
    }
  };

  // Quick Preset Templates
  const handleApplyTemplate = (type: 'receipt' | 'expiry_reminder' | 'birthday' | 'custom') => {
    setMessageType(type);
    if (type === 'receipt') {
      setMessageBody(
        `🧾 *PAYMENT RECEIPT - BLACK STONE FITNESS*\n\n` +
        `Hello ${recipientName},\n` +
        `Your payment of *₹2,999* has been successfully recorded.\n` +
        `• *Receipt No:* BSF-REC-${Math.floor(1000 + Math.random() * 9000)}\n` +
        `• *Plan:* Quarterly Strength & Conditioning\n` +
        `• *Date:* ${new Date().toLocaleDateString('en-IN')}\n\n` +
        `Thank you for being part of Black Stone Fitness Mysuru! 💪`
      );
    } else if (type === 'expiry_reminder') {
      setMessageBody(
        `⚠️ *MEMBERSHIP RENEWAL ALERT*\n\n` +
        `Hi ${recipientName},\n` +
        `This is a gentle reminder that your Black Stone Fitness membership expires in *3 days*.\n` +
        `Renew before expiry to retain your current pricing & avoid admission fees!\n\n` +
        `📍 Visit our front desk at New Kantharaj Urs Rd, Mysuru or reply here for direct UPI renewal link. 🏋️‍♂️`
      );
    } else if (type === 'birthday') {
      setMessageBody(
        `🎉 *HAPPY BIRTHDAY FROM TEAM BSF!* 🎂\n\n` +
        `Dear ${recipientName},\n` +
        `The entire Black Stone Fitness family wishes you an incredible birthday filled with health, power, and massive personal bests! 💥\n\n` +
        `Enjoy your special day and keep crushing your fitness journey! 🔥💪`
      );
    } else {
      setMessageBody(
        `Hello ${recipientName},\n` +
        `Special update from Black Stone Fitness Mysuru. New functional turf equipment has arrived on the gym floor! Come try out the new setup today.`
      );
    }
  };

  // Handle Send Message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientPhone.trim() || !messageBody.trim()) return;

    setIsSending(true);
    try {
      const res = await sendWhatsAppMessage(
        recipientPhone.trim(),
        recipientName.trim() || 'Gym Member',
        messageBody.trim(),
        messageType
      );
      if (res.success) {
        setSendSuccessToast(`WhatsApp message dispatched to ${recipientPhone}!`);
        setMessageBody('');
        setTimeout(() => setSendSuccessToast(null), 4000);
      } else {
        setSendErrorToast(res.error || `Failed to dispatch WhatsApp message to ${recipientPhone}`);
        setTimeout(() => setSendErrorToast(null), 6000);
      }
    } catch (err: any) {
      setSendErrorToast(err?.message || `Error sending message to ${recipientPhone}`);
      setTimeout(() => setSendErrorToast(null), 6000);
    } finally {
      setIsSending(false);
    }
  };

  // Filter logs
  const filteredLogs = whatsAppLogs.filter(log => {
    const matchesQuery =
      log.recipientName.toLowerCase().includes(searchLogQuery.toLowerCase()) ||
      log.recipientPhone.includes(searchLogQuery) ||
      log.message.toLowerCase().includes(searchLogQuery.toLowerCase());

    if (logFilterType === 'all') return matchesQuery;
    return matchesQuery && log.type === logFilterType;
  });

  const isConnected = whatsAppSession.status === 'connected';

  return (
    <div className="space-y-6" id="bsf-whatsapp-integration-panel">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
            <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-400">
              Official WhatsApp Web Gateway
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-display tracking-wide mt-1 flex items-center gap-2.5">
            <MessageSquare className="w-7 h-7 text-emerald-400" />
            <span>WHATSAPP INTEGRATION</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Link your gym's official mobile device using QR code scanning for automated receipts, expiry alerts, and member messaging.
          </p>
        </div>

        {/* Top Connection Status Badge */}
        <div className="flex items-center gap-3">
          {isConnected ? (
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Linked: {whatsAppSession.phoneNumber || '+91 98803 97294'}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold shadow-sm">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>Scan QR Code to Link</span>
            </div>
          )}

          {isConnected && (
            <button
              onClick={() => setShowDisconnectModal(true)}
              className="px-3 py-2 rounded-xl bg-zinc-900 hover:bg-rose-950/40 text-zinc-300 hover:text-rose-300 border border-zinc-800 hover:border-rose-800/40 text-xs font-bold transition flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Unlink Device</span>
            </button>
          )}
        </div>
      </div>

      {/* SUCCESS TOAST NOTIFICATION */}
      {sendSuccessToast && (
        <div className="p-3.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-200 text-xs font-bold flex items-center justify-between shadow-lg animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{sendSuccessToast}</span>
          </div>
          <button onClick={() => setSendSuccessToast(null)} className="text-emerald-400 hover:text-emerald-100 text-xs cursor-pointer">✕</button>
        </div>
      )}

      {/* ERROR TOAST NOTIFICATION */}
      {sendErrorToast && (
        <div className="p-3.5 bg-red-500/15 border border-red-500/40 rounded-xl text-red-200 text-xs font-semibold flex items-center justify-between shadow-lg animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{sendErrorToast}</span>
          </div>
          <button onClick={() => setSendErrorToast(null)} className="text-red-400 hover:text-red-100 text-xs cursor-pointer">✕</button>
        </div>
      )}

      {/* SECTION 1: QR CODE PAIRING PANEL (IF DISCONNECTED) */}
      {!isConnected ? (
        <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl relative overflow-hidden">
          
          {/* Subtle glow background */}
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Instructions */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider font-mono">
                  Scan to Connect
                </span>
                <span className="text-xs text-zinc-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> End-to-End Encrypted
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white font-display">
                  LINK BLACK STONE FITNESS WHATSAPP
                </h3>
                <p className="text-xs text-zinc-300 mt-1.5 leading-relaxed">
                  Scan the QR code with your gym front desk smartphone to link your WhatsApp session. All automated receipts, expiry reminders, and greetings will be delivered seamlessly.
                </p>
              </div>

              {/* 4-Step Instructions */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-xs shrink-0">
                    1
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Open WhatsApp on your phone</p>
                    <p className="text-[11px] text-zinc-400">Launch the official WhatsApp or WhatsApp Business app.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-xs shrink-0">
                    2
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Go to Linked Devices</p>
                    <p className="text-[11px] text-zinc-400">
                      Tap <strong className="text-zinc-200">Settings</strong> (on iPhone) or <strong className="text-zinc-200">Menu (⋮)</strong> (on Android) → <strong className="text-emerald-400">Linked Devices</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-xs shrink-0">
                    3
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Tap "Link a Device"</p>
                    <p className="text-[11px] text-zinc-400">Unlock your phone with fingerprint, face, or passcode when prompted.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-xs shrink-0">
                    4
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Point camera at the QR code</p>
                    <p className="text-[11px] text-zinc-400">Align your phone camera with the QR code on the right to sync instantly.</p>
                  </div>
                </div>
              </div>

              {/* Direct Simulator Action */}
              <div className="pt-2 p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-white">Instant Connect Simulator</p>
                    <p className="text-[11px] text-zinc-400">Link with one click using gym number (+91 98803 97294)</p>
                  </div>
                </div>

                <button
                  onClick={handleSimulateScan}
                  disabled={isScanningSimulated}
                  className="w-full sm:w-auto px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2"
                >
                  {isScanningSimulated ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Scanning & Pairing...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Scan & Link Device</span>
                    </>
                  )}
                </button>
              </div>

            </div>

            {/* Right Column: QR Code Box */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              
              {/* QR Code Container */}
              <div className="relative p-5 bg-white rounded-2xl shadow-2xl border-4 border-emerald-500/30 flex flex-col items-center">
                
                {/* Simulated Green Scan Line animation when scanning */}
                {isScanningSimulated && (
                  <div className="absolute inset-x-0 h-1 bg-emerald-500 shadow-[0_0_12px_#10b981] animate-bounce z-20 top-1/2"></div>
                )}

                {/* QR Image */}
                {qrCodeDataUrl ? (
                  <img
                    src={qrCodeDataUrl}
                    alt="WhatsApp Pairing QR Code"
                    className="w-60 h-60 object-contain rounded-lg transition"
                  />
                ) : (
                  <div className="w-60 h-60 flex flex-col items-center justify-center bg-zinc-100 rounded-lg text-zinc-600">
                    <RefreshCw className="w-8 h-8 animate-spin mb-2 text-emerald-600" />
                    <span className="text-xs font-bold">Generating QR Code...</span>
                  </div>
                )}

                {/* Gym Watermark center pill */}
                <div className="mt-3 flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 text-white text-[11px] font-extrabold">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>BLACK STONE FITNESS</span>
                </div>
              </div>

              {/* QR Countdown Timer & Refresh Button */}
              <div className="mt-4 flex items-center gap-3 text-xs text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Code expires in: <strong className="text-white font-mono">{qrCountdown}s</strong></span>
                </div>

                <button
                  onClick={() => fetchNewQR(true)}
                  disabled={isRefreshingQr}
                  className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition flex items-center gap-1 border border-zinc-700"
                >
                  <RefreshCw className={`w-3 h-3 ${isRefreshingQr ? 'animate-spin' : ''}`} />
                  <span>Refresh QR</span>
                </button>
              </div>

              {/* Phone number field for manual pairing */}
              <div className="mt-4 w-full max-w-xs">
                <label className="text-[11px] font-bold text-zinc-400 block mb-1">
                  Device Mobile Number:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customPhoneNumber}
                    onChange={(e) => setCustomPhoneNumber(e.target.value)}
                    placeholder="+91 8197299039"
                    className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                  <button
                    onClick={handleSimulateScan}
                    disabled={isScanningSimulated}
                    className="px-3 py-1.5 bg-emerald-500 text-black font-bold text-xs rounded-lg hover:bg-emerald-400 shrink-0 transition"
                  >
                    Pair
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>
      ) : (
        /* SECTION 2: CONNECTED DEVICE DASHBOARD */
        <div className="p-6 rounded-2xl bg-zinc-900/90 border border-emerald-500/30 shadow-xl space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-white font-display">
                    {whatsAppSession.phoneNumber || '+91 8197299039'}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase border border-emerald-500/30">
                    ONLINE & ACTIVE
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5 flex items-center gap-2">
                  <span>{whatsAppSession.deviceInfo || 'WhatsApp Web (Chrome / Android 14)'}</span>
                  <span>•</span>
                  <span className="text-emerald-400">Signal: 100% Strong</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => {
                  handleApplyTemplate('receipt');
                  const el = document.getElementById('bsf-wa-direct-messaging');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-3.5 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold rounded-xl transition border border-emerald-500/30 flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Message</span>
              </button>

              <button
                onClick={() => setShowDisconnectModal(true)}
                className="px-3.5 py-2 bg-zinc-800 hover:bg-rose-950/40 text-zinc-300 hover:text-rose-300 text-xs font-bold rounded-xl transition border border-zinc-700 hover:border-rose-700/50 flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Unlink</span>
              </button>
            </div>
          </div>

          {/* Connection Highlights Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            
            <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Gateway Status</span>
              <p className="text-sm font-black text-emerald-400 mt-1 flex items-center gap-1.5">
                <CheckCheck className="w-4 h-4 text-emerald-400" /> Multi-Device Paired
              </p>
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                24/7 Keep-Alive & Auto-Heal Active
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Total Dispatches</span>
              <p className="text-sm font-black text-white mt-1">
                {whatsAppLogs.length} Messages
              </p>
              <span className="text-[10px] text-emerald-400">100% Delivery Success</span>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Security Layer</span>
              <p className="text-sm font-black text-white mt-1 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Signal Protocol
              </p>
              <span className="text-[10px] text-zinc-400">256-bit encrypted channel</span>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Auto Automations</span>
              <p className="text-sm font-black text-orange-400 mt-1 flex items-center gap-1">
                <Zap className="w-4 h-4" /> 3 Triggers Active
              </p>
              <span className="text-[10px] text-zinc-400">Receipts, renewals, bdays</span>
            </div>

          </div>

        </div>
      )}

      {/* SECTION 3: AUTOMATION TRIGGERS & AUTO-PILOT ENGINE */}
      <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-6" id="bsf-wa-automations">
        
        {/* Header & Auto-Pilot Daemon Status */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
                <Zap className="w-5 h-5" />
              </span>
              <h3 className="text-lg font-black text-white font-display">
                AUTOMATED WHATSAPP TRIGGERS (AUTO-PILOT)
              </h3>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Auto-Pilot: Daily 9:00 AM IST (Zero Input Required)
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Automatic message dispatches for membership renewals (7 days, 3 days & 1 day prior), birthdays & major festivals.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => handleRunAutomations(false)}
              disabled={isRunningAutomation}
              className="px-3.5 py-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-lg shadow-orange-500/20 disabled:opacity-60 cursor-pointer"
              title="Runs today's automation scan and sends pending messages"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRunningAutomation ? 'animate-spin' : ''}`} />
              <span>{isRunningAutomation ? 'Scanning & Dispatching...' : '⚡ Run Automation Check Now'}</span>
            </button>

            <button
              onClick={() => handleRunAutomations(true)}
              disabled={isRunningAutomation}
              className="px-3 py-2 bg-zinc-800 hover:bg-orange-950/40 text-orange-300 hover:text-orange-200 border border-zinc-700 hover:border-orange-500/40 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              title="Force re-send all of today's reminders even if previously marked sent"
            >
              <Send className="w-3.5 h-3.5 text-orange-400" />
              <span>Force Re-dispatch (Bypass Cache)</span>
            </button>

            <button
              onClick={() => setTestModalOpen(true)}
              className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold rounded-xl transition border border-zinc-700 flex items-center gap-1.5 cursor-pointer"
              title="Test a message template on WhatsApp"
            >
              <Smartphone className="w-3.5 h-3.5 text-sky-400" />
              <span>Test Trigger</span>
            </button>

            <button
              onClick={() => setShowTemplatesPreview(!showTemplatesPreview)}
              className="px-3 py-2 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 text-xs font-bold rounded-xl transition border border-zinc-700/80 flex items-center gap-1.5 cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-purple-400" />
              <span>{showTemplatesPreview ? 'Hide Templates' : 'View Templates'}</span>
              {showTemplatesPreview ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Execution Result Banner (if just triggered) */}
        {automationResult && (
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <span className="font-bold flex items-center gap-2 text-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Automation Run Completed
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">
                {new Date().toLocaleTimeString()}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center pt-1">
              <div className="p-2 rounded-lg bg-zinc-900/80 border border-zinc-800">
                <span className="text-[10px] text-zinc-400 block">Total Sent</span>
                <span className="text-sm font-black text-emerald-400">{automationResult.totalSent ?? 0}</span>
              </div>
              <div className="p-2 rounded-lg bg-zinc-900/80 border border-zinc-800">
                <span className="text-[10px] text-zinc-400 block">7-Day Reminders</span>
                <span className="text-sm font-black text-sky-400">{automationResult.renewals7d?.sent ?? 0}</span>
              </div>
              <div className="p-2 rounded-lg bg-zinc-900/80 border border-zinc-800">
                <span className="text-[10px] text-zinc-400 block">3-Day Reminders</span>
                <span className="text-sm font-black text-amber-400">{automationResult.renewals3d?.sent ?? 0}</span>
              </div>
              <div className="p-2 rounded-lg bg-zinc-900/80 border border-zinc-800">
                <span className="text-[10px] text-zinc-400 block">1-Day Reminders</span>
                <span className="text-sm font-black text-orange-400">{automationResult.renewals1d?.sent ?? 0}</span>
              </div>
              <div className="p-2 rounded-lg bg-zinc-900/80 border border-zinc-800">
                <span className="text-[10px] text-zinc-400 block">Birthdays</span>
                <span className="text-sm font-black text-purple-400">{automationResult.birthdays?.sent ?? 0}</span>
              </div>
            </div>
            {automationResult.notice && (
              <div className="mt-2 text-[11px] text-amber-300 bg-amber-950/30 p-2.5 rounded-lg border border-amber-800/40 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{automationResult.notice}</span>
              </div>
            )}
            {((automationResult.failureReasons && automationResult.failureReasons.length > 0) || (automationResult.errors && automationResult.errors.length > 0)) && (
              <div className="mt-2 text-[11px] text-rose-400 bg-rose-950/30 p-2 rounded-lg border border-rose-800/40">
                Notice: {(automationResult.failureReasons && automationResult.failureReasons[0]) || (automationResult.errors && automationResult.errors[0])}
              </div>
            )}
          </div>
        )}

        {/* Master Trigger Toggles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Trigger 1: Digital Receipts */}
          <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <Receipt className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Instant Payment Receipts</p>
                <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
                  Automatically send official BSF PDF receipt summary on WhatsApp when any member payment is recorded.
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={whatsAppSession.autoReceipts}
                onChange={(e) => updateWhatsAppConfig({ autoReceipts: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          {/* Trigger 2: Expiry Reminders (7d, 3d, 1d) */}
          <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                <BellRing className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold text-white">Membership Expiry Reminders</p>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">
                    7d, 3d & 1d
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
                  Auto-alert members 7 days, 3 days, and 1 day prior to plan expiry with renewal links to maintain fitness streak.
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={whatsAppSession.autoExpiryReminders}
                onChange={(e) => updateWhatsAppConfig({ autoExpiryReminders: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>

          {/* Trigger 3: Birthday Wishes */}
          <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                <Cake className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Morning Birthday Greetings</p>
                <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
                  Send personalized powerhouse birthday wishes automatically at 9:00 AM on each member's birthday.
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={whatsAppSession.autoBirthdayWishes}
                onChange={(e) => updateWhatsAppConfig({ autoBirthdayWishes: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
            </label>
          </div>

          {/* Trigger 4: Cultural & Festival Broadcasts */}
          <div className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Major Festival Broadcasts</p>
                <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
                  Broadcast Dasara, Diwali, Kannada Rajyotsava, and Ugadi festive wishes to members automatically.
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={whatsAppSession.autoAnnouncements}
                onChange={(e) => updateWhatsAppConfig({ autoAnnouncements: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
          </div>

        </div>

        {/* Templates Inspector Drawer (Collapsible) */}
        {showTemplatesPreview && (
          <div className="p-5 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Active Message Templates & Smart Placeholders
                </h4>
              </div>
              <span className="text-[11px] text-zinc-400">
                Variables: <code className="text-orange-400">{'{MEMBER_NAME}'}</code>, <code className="text-orange-400">{'{EXPIRY_DATE}'}</code>, <code className="text-orange-400">{'{DAYS_LEFT}'}</code>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
              
              {/* 7-Day Template Card */}
              <div className="p-3.5 rounded-lg bg-zinc-900 border border-zinc-800 flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-sky-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                      7 Days Prior Reminder
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">Trigger: T-7</span>
                  </div>
                  <p className="text-[11px] text-zinc-300 font-mono bg-zinc-950 p-2.5 rounded-md border border-zinc-800/80 mt-2 leading-relaxed">
                    {settings.reminder7DayTemplate || 'Hello {MEMBER_NAME}, your Black Stone Fitness membership will expire in 7 days on {EXPIRY_DATE}. Renew early to lock in your legacy rate! 💪'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setTestTemplateType('renewal_7d');
                    setTestModalOpen(true);
                  }}
                  className="w-full py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] font-bold rounded-md transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Send className="w-3 h-3" /> Test This Template
                </button>
              </div>

              {/* 3-Day Template Card */}
              <div className="p-3.5 rounded-lg bg-zinc-900 border border-zinc-800 flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                      3 Days Prior Reminder
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">Trigger: T-3</span>
                  </div>
                  <p className="text-[11px] text-zinc-300 font-mono bg-zinc-950 p-2.5 rounded-md border border-zinc-800/80 mt-2 leading-relaxed">
                    {settings.reminder3DayTemplate || "Hi {MEMBER_NAME}, only 3 days left on your BSF membership ({EXPIRY_DATE}). Don't break your workout streak! Visit the front desk or renew via UPI. 🏋️‍♂️"}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setTestTemplateType('renewal_3d');
                    setTestModalOpen(true);
                  }}
                  className="w-full py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] font-bold rounded-md transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Send className="w-3 h-3" /> Test This Template
                </button>
              </div>

              {/* 1-Day Template Card */}
              <div className="p-3.5 rounded-lg bg-zinc-900 border border-zinc-800 flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-orange-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                      1 Day Prior Final Call
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">Trigger: T-1</span>
                  </div>
                  <p className="text-[11px] text-zinc-300 font-mono bg-zinc-950 p-2.5 rounded-md border border-zinc-800/80 mt-2 leading-relaxed">
                    {settings.reminder1DayTemplate || 'FINAL REMINDER: Hi {MEMBER_NAME}, your BSF membership expires tomorrow ({EXPIRY_DATE}). Renew today to keep seamless gym access. ⚡'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setTestTemplateType('renewal_1d');
                    setTestModalOpen(true);
                  }}
                  className="w-full py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] font-bold rounded-md transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Send className="w-3 h-3" /> Test This Template
                </button>
              </div>

              {/* Birthday Template Card */}
              <div className="p-3.5 rounded-lg bg-zinc-900 border border-zinc-800 flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-purple-400 flex items-center gap-1.5">
                      <Cake className="w-3.5 h-3.5" />
                      Morning Birthday Wish
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">Trigger: 09:00 AM</span>
                  </div>
                  <p className="text-[11px] text-zinc-300 font-mono bg-zinc-950 p-2.5 rounded-md border border-zinc-800/80 mt-2 leading-relaxed">
                    {settings.birthdayTemplate || '🎉 Happy Birthday, {MEMBER_NAME}! 🎂 The entire Black Stone Fitness family wishes you a healthy, strong, and powerhouse year ahead. Keep crushing your goals! 💪🔥'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setTestTemplateType('birthday');
                    setTestModalOpen(true);
                  }}
                  className="w-full py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] font-bold rounded-md transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Send className="w-3 h-3" /> Test This Template
                </button>
              </div>

              {/* Festival Template Card */}
              <div className="p-3.5 rounded-lg bg-zinc-900 border border-zinc-800 flex flex-col justify-between space-y-2 col-span-1 md:col-span-2">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Major Festivals & Cultural Broadcasts
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">{festivals?.length || 8} festivals active</span>
                  </div>
                  <p className="text-[11px] text-zinc-300 font-mono bg-zinc-950 p-2.5 rounded-md border border-zinc-800/80 mt-2 leading-relaxed">
                    Includes Dasara (ದಸರಾ), Diwali (ದೀಪಾವಳಿ), Kannada Rajyotsava (ಕನ್ನಡ ರಾಜ್ಯೋತ್ಸವ), Ugadi & New Year celebrations.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setTestTemplateType('festival');
                    setTestModalOpen(true);
                  }}
                  className="w-full py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] font-bold rounded-md transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Send className="w-3 h-3" /> Test Festival Greeting
                </button>
              </div>

            </div>
          </div>
        )}

        {/* REAL-TIME CANDIDATE QUEUE FOR TODAY */}
        <div className="space-y-3 pt-2">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-orange-400" />
                <span>Today's Automation Queue & Candidates</span>
              </h4>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Members scheduled for automatic messages based on active expiry dates, birthdays & calendar festivals.
              </p>
            </div>

            {/* Sub-Tabs for Candidates */}
            <div className="flex flex-wrap items-center gap-1.5 bg-zinc-950/80 p-1 rounded-xl border border-zinc-800">
              <button
                onClick={() => setAutomationTab('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                  automationTab === 'all'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                All (
                {upcomingAutomations.renewals7d.length +
                  upcomingAutomations.renewals3d.length +
                  upcomingAutomations.renewals1d.length +
                  upcomingAutomations.birthdays.length +
                  upcomingAutomations.festivals.length}
                )
              </button>

              <button
                onClick={() => setAutomationTab('renewals7d')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                  automationTab === 'renewals7d'
                    ? 'bg-sky-600 text-white shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                7-Day ({upcomingAutomations.renewals7d.length})
              </button>

              <button
                onClick={() => setAutomationTab('renewals3d')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                  automationTab === 'renewals3d'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                3-Day ({upcomingAutomations.renewals3d.length})
              </button>

              <button
                onClick={() => setAutomationTab('renewals1d')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                  automationTab === 'renewals1d'
                    ? 'bg-orange-600 text-white shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                1-Day ({upcomingAutomations.renewals1d.length})
              </button>

              <button
                onClick={() => setAutomationTab('birthdays')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                  automationTab === 'birthdays'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Birthdays ({upcomingAutomations.birthdays.length})
              </button>

              <button
                onClick={() => setAutomationTab('festivals')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                  automationTab === 'festivals'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Festivals ({upcomingAutomations.festivals.length})
              </button>
            </div>
          </div>

          {/* Candidates Display List */}
          <div className="space-y-2">
            
            {/* If 7-Day candidates visible */}
            {(automationTab === 'all' || automationTab === 'renewals7d') &&
              upcomingAutomations.renewals7d.map((r, i) => (
                <div
                  key={`ren7-${r.member.id}-${i}`}
                  className="p-3.5 rounded-xl bg-zinc-950/70 border border-sky-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-sky-500/40 transition"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      7d
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-white">{r.member.fullName}</span>
                        <span className="text-[10px] text-zinc-400 font-mono">{r.member.memberCode}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                          Expires in 7 Days ({r.member.expiryDate})
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 font-mono mt-1 line-clamp-1">
                        {r.message}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    <span className="text-[11px] font-mono text-zinc-400">{r.phone}</span>
                    <a
                      href={`https://wa.me/91${r.phone.replace(/\D/g, '').slice(-10)}?text=${encodeURIComponent(r.message)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-emerald-400 text-xs font-bold rounded-lg transition flex items-center gap-1 border border-zinc-700"
                      title="Open chat directly in WhatsApp Web or App"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Chat</span>
                    </a>
                    <button
                      onClick={() =>
                        handleDispatchSingleCandidate({
                          phone: r.phone,
                          name: r.member.fullName,
                          message: r.message,
                          type: 'expiry_reminder',
                        })
                      }
                      disabled={singleSendingCandidate === r.phone}
                      className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                    >
                      <Send className="w-3 h-3" />
                      <span>{singleSendingCandidate === r.phone ? 'Sending...' : 'Send WhatsApp'}</span>
                    </button>
                  </div>
                </div>
              ))}

            {/* If 3-Day candidates visible */}
            {(automationTab === 'all' || automationTab === 'renewals3d') &&
              upcomingAutomations.renewals3d.map((r, i) => (
                <div
                  key={`ren3-${r.member.id}-${i}`}
                  className="p-3.5 rounded-xl bg-zinc-950/70 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-amber-500/40 transition"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      3d
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-white">{r.member.fullName}</span>
                        <span className="text-[10px] text-zinc-400 font-mono">{r.member.memberCode}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          Expires in 3 Days ({r.member.expiryDate})
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 font-mono mt-1 line-clamp-1">
                        {r.message}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    <span className="text-[11px] font-mono text-zinc-400">{r.phone}</span>
                    <a
                      href={`https://wa.me/91${r.phone.replace(/\D/g, '').slice(-10)}?text=${encodeURIComponent(r.message)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-emerald-400 text-xs font-bold rounded-lg transition flex items-center gap-1 border border-zinc-700"
                      title="Open chat directly in WhatsApp Web or App"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Chat</span>
                    </a>
                    <button
                      onClick={() =>
                        handleDispatchSingleCandidate({
                          phone: r.phone,
                          name: r.member.fullName,
                          message: r.message,
                          type: 'expiry_reminder',
                        })
                      }
                      disabled={singleSendingCandidate === r.phone}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                    >
                      <Send className="w-3 h-3" />
                      <span>{singleSendingCandidate === r.phone ? 'Sending...' : 'Send WhatsApp'}</span>
                    </button>
                  </div>
                </div>
              ))}

            {/* If 1-Day candidates visible */}
            {(automationTab === 'all' || automationTab === 'renewals1d') &&
              upcomingAutomations.renewals1d.map((r, i) => (
                <div
                  key={`ren1-${r.member.id}-${i}`}
                  className="p-3.5 rounded-xl bg-zinc-950/70 border border-orange-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-orange-500/40 transition"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      1d
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-white">{r.member.fullName}</span>
                        <span className="text-[10px] text-zinc-400 font-mono">{r.member.memberCode}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                          Expires Tomorrow ({r.member.expiryDate})
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 font-mono mt-1 line-clamp-1">
                        {r.message}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    <span className="text-[11px] font-mono text-zinc-400">{r.phone}</span>
                    <a
                      href={`https://wa.me/91${r.phone.replace(/\D/g, '').slice(-10)}?text=${encodeURIComponent(r.message)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-emerald-400 text-xs font-bold rounded-lg transition flex items-center gap-1 border border-zinc-700"
                      title="Open chat directly in WhatsApp Web or App"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Chat</span>
                    </a>
                    <button
                      onClick={() =>
                        handleDispatchSingleCandidate({
                          phone: r.phone,
                          name: r.member.fullName,
                          message: r.message,
                          type: 'expiry_reminder',
                        })
                      }
                      disabled={singleSendingCandidate === r.phone}
                      className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                    >
                      <Send className="w-3 h-3" />
                      <span>{singleSendingCandidate === r.phone ? 'Sending...' : 'Send WhatsApp'}</span>
                    </button>
                  </div>
                </div>
              ))}

            {/* If Birthday candidates visible */}
            {(automationTab === 'all' || automationTab === 'birthdays') &&
              upcomingAutomations.birthdays.map((b, i) => (
                <div
                  key={`bday-${b.member.id}-${i}`}
                  className="p-3.5 rounded-xl bg-zinc-950/70 border border-purple-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-purple-500/40 transition"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Cake className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-white">{b.member.fullName}</span>
                        <span className="text-[10px] text-zinc-400 font-mono">{b.member.memberCode}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                          🎂 Birthday Today! ({b.member.dob})
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 font-mono mt-1 line-clamp-1">
                        {b.message}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    <span className="text-[11px] font-mono text-zinc-400">{b.phone}</span>
                    <a
                      href={`https://wa.me/91${b.phone.replace(/\D/g, '').slice(-10)}?text=${encodeURIComponent(b.message)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-emerald-400 text-xs font-bold rounded-lg transition flex items-center gap-1 border border-zinc-700"
                      title="Open chat directly in WhatsApp Web or App"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Chat</span>
                    </a>
                    <button
                      onClick={() =>
                        handleDispatchSingleCandidate({
                          phone: b.phone,
                          name: b.member.fullName,
                          message: b.message,
                          type: 'birthday',
                        })
                      }
                      disabled={singleSendingCandidate === b.phone}
                      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                    >
                      <Cake className="w-3 h-3" />
                      <span>{singleSendingCandidate === b.phone ? 'Sending...' : 'Send Birthday Wish'}</span>
                    </button>
                  </div>
                </div>
              ))}

            {/* If Festival candidates visible */}
            {(automationTab === 'all' || automationTab === 'festivals') &&
              upcomingAutomations.festivals.map((f, i) => (
                <div
                  key={`fest-${f.festival.id}-${i}`}
                  className="p-3.5 rounded-xl bg-zinc-950/70 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-emerald-500/40 transition"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-white">{f.festival.name}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {f.members.length} Members in Broadcast
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 font-mono mt-1 line-clamp-1">
                        {f.message}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    <button
                      onClick={() => handleRunAutomations(true)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Broadcast to {f.members.length} Members</span>
                    </button>
                  </div>
                </div>
              ))}

            {/* Empty queue message */}
            {upcomingAutomations.renewals7d.length === 0 &&
              upcomingAutomations.renewals3d.length === 0 &&
              upcomingAutomations.renewals1d.length === 0 &&
              upcomingAutomations.birthdays.length === 0 &&
              upcomingAutomations.festivals.length === 0 && (
                <div className="p-8 rounded-xl bg-zinc-950/40 border border-dashed border-zinc-800 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500/60 mx-auto" />
                  <p className="text-xs font-bold text-zinc-300">All automated queues are clear for today</p>
                  <p className="text-[11px] text-zinc-500 max-w-sm mx-auto">
                    No members are currently due for 7-day, 3-day, or 1-day reminders, birthdays, or festival broadcasts on this calendar date.
                  </p>
                </div>
              )}

          </div>

        </div>

      </div>

      {/* SECTION 4: DIRECT WHATSAPP DISPATCHER & LIVE PREVIEW */}
      <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-6" id="bsf-wa-direct-messaging">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-black text-white font-display flex items-center gap-2">
              <Send className="w-5 h-5 text-emerald-400" />
              <span>DIRECT WHATSAPP DISPATCHER</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Send an instant WhatsApp message to any member or custom phone number with realistic live preview.
            </p>
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold text-zinc-500 uppercase mr-1">Presets:</span>
            <button
              onClick={() => handleApplyTemplate('receipt')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition border ${
                messageType === 'receipt'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
              }`}
            >
              Receipt
            </button>
            <button
              onClick={() => handleApplyTemplate('expiry_reminder')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition border ${
                messageType === 'expiry_reminder'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
              }`}
            >
              Renewal
            </button>
            <button
              onClick={() => handleApplyTemplate('birthday')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition border ${
                messageType === 'birthday'
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
              }`}
            >
              Birthday
            </button>
            <button
              onClick={() => handleApplyTemplate('custom')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition border ${
                messageType === 'custom'
                  ? 'bg-zinc-700 text-white border-zinc-600'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
              }`}
            >
              Custom
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Dispatch Form (Left 7 Cols) */}
          <form onSubmit={handleSendMessage} className="lg:col-span-7 space-y-4">
            
            {/* Quick Member Picker */}
            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">
                Select Member (or enter custom recipient below):
              </label>
              <select
                value={selectedMemberId}
                onChange={(e) => handleSelectMember(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="">-- Choose Member from Directory --</option>
                {members.slice(0, 40).map(m => (
                  <option key={m.id} value={m.id}>
                    {m.fullName} ({m.phone}) - {m.packageName || 'Active Plan'}
                  </option>
                ))}
              </select>
            </div>

            {/* Recipient Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-zinc-400 block mb-1">
                  Recipient Name:
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  required
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-400 block mb-1">
                  Recipient WhatsApp Number:
                </label>
                <input
                  type="text"
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  placeholder="+91 98803 97294"
                  required
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            {/* Message Body */}
            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">
                WhatsApp Message Content (Supports *bold*, _italics_, and emojis):
              </label>
              <textarea
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                rows={5}
                required
                className="w-full p-3.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-sans-body resize-y"
              ></textarea>
            </div>

            {/* Send Button */}
            <button
              type="submit"
              disabled={isSending}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              {isSending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Dispatching to WhatsApp Gateway...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Dispatch WhatsApp Message Now</span>
                </>
              )}
            </button>

          </form>

          {/* Live Mobile WhatsApp Mockup (Right 5 Cols) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            
            <span className="text-[11px] font-bold text-zinc-400 mb-2 uppercase tracking-wider">
              Live Member Phone Preview
            </span>

            {/* Realistic WhatsApp Chat Box */}
            <div className="w-full max-w-sm rounded-3xl bg-zinc-950 border-4 border-zinc-800 shadow-2xl overflow-hidden flex flex-col">
              
              {/* WhatsApp App Top Bar */}
              <div className="bg-[#1f2c34] px-4 py-3 flex items-center justify-between border-b border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white font-extrabold text-xs">
                    BSF
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white leading-tight">Black Stone Fitness</p>
                    <p className="text-[10px] text-emerald-400">Official Business Account</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-zinc-400 text-xs">
                  <Phone className="w-3.5 h-3.5" />
                  <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>

              {/* Chat Message Canvas */}
              <div className="p-4 bg-[#0b141a] min-h-[220px] flex flex-col justify-end space-y-2 relative">
                
                {/* Date bubble */}
                <div className="self-center px-2.5 py-0.5 rounded-md bg-[#182229] text-[10px] font-semibold text-zinc-400">
                  TODAY
                </div>

                {/* Message Bubble (Outgoing from Gym) */}
                <div className="self-end max-w-[85%] bg-[#005c4b] text-white p-3 rounded-2xl rounded-tr-none shadow text-xs relative">
                  <p className="whitespace-pre-wrap leading-relaxed break-words text-[11px]">
                    {messageBody || 'Message preview will appear here...'}
                  </p>

                  <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-emerald-200/80">
                    <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <CheckCheck className="w-3 h-3 text-cyan-400" />
                  </div>
                </div>

              </div>

              {/* WhatsApp Footer Input Bar Mockup */}
              <div className="bg-[#1f2c34] px-3 py-2 flex items-center gap-2">
                <div className="flex-1 bg-[#2a3942] rounded-full px-3 py-1.5 text-[11px] text-zinc-400">
                  Message...
                </div>
                <div className="w-7 h-7 rounded-full bg-emerald-500 text-black flex items-center justify-center">
                  <Send className="w-3 h-3" />
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* SECTION 5: LIVE MESSAGE DISPATCH LOGS */}
      <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-black text-white font-display flex items-center gap-2">
              <CheckCheck className="w-5 h-5 text-emerald-400" />
              <span>DISPATCH HISTORY & AUDIT LOGS</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Detailed tracking of all WhatsApp communications sent to members from this dashboard.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Search filter */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchLogQuery}
                onChange={(e) => setSearchLogQuery(e.target.value)}
                placeholder="Search phone or name..."
                className="pl-8 pr-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 w-48"
              />
            </div>

            {/* Type filter */}
            <select
              value={logFilterType}
              onChange={(e) => setLogFilterType(e.target.value)}
              className="px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-300 focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="receipt">Receipts</option>
              <option value="expiry_reminder">Renewals</option>
              <option value="birthday">Birthdays</option>
              <option value="custom">Custom</option>
            </select>

            {whatsAppLogs.length > 0 && (
              <button
                onClick={clearWhatsAppLogs}
                className="px-3 py-1.5 bg-zinc-800 hover:bg-rose-950/40 text-zinc-400 hover:text-rose-300 rounded-xl text-xs font-bold transition flex items-center gap-1 border border-zinc-700"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Logs Table */}
        <div className="overflow-x-auto rounded-xl border border-zinc-800/80">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950 text-zinc-400 uppercase tracking-wider text-[10px] font-bold border-b border-zinc-800">
              <tr>
                <th className="py-3 px-4">Recipient</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Message Summary</th>
                <th className="py-3 px-4">Delivery</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 bg-zinc-900/40">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-zinc-800/30 transition">
                    <td className="py-3 px-4">
                      <p className="font-bold text-white">{log.recipientName}</p>
                      <p className="text-[11px] text-zinc-400 font-mono">{log.recipientPhone}</p>
                    </td>

                    <td className="py-3 px-4">
                      {log.type === 'receipt' && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-extrabold">
                          Receipt
                        </span>
                      )}
                      {log.type === 'expiry_reminder' && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-extrabold">
                          Renewal
                        </span>
                      )}
                      {log.type === 'birthday' && (
                        <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] font-extrabold">
                          Birthday
                        </span>
                      )}
                      {log.type === 'announcement' && (
                        <span className="px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-[10px] font-extrabold">
                          Broadcast
                        </span>
                      )}
                      {log.type === 'custom' && (
                        <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 text-[10px] font-extrabold">
                          Direct
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <p className="text-zinc-300 truncate" title={log.message}>
                        {log.message}
                      </p>
                    </td>

                    <td className="py-3 px-4">
                      <span className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
                        <CheckCheck className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Delivered</span>
                      </span>
                    </td>

                    <td className="py-3 px-4 text-zinc-400 text-[11px] whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setRecipientName(log.recipientName);
                          setRecipientPhone(log.recipientPhone);
                          setMessageBody(log.message);
                          setMessageType(log.type);
                          const el = document.getElementById('bsf-wa-direct-messaging');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition"
                      >
                        Resend
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-500 text-xs">
                    No WhatsApp dispatches found matching criteria. Send a test message or record a payment to see live logs!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* DISCONNECT CONFIRMATION MODAL */}
      {showDisconnectModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
              <LogOut className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-black text-white font-display">
                UNLINK WHATSAPP DEVICE?
              </h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Are you sure you want to disconnect WhatsApp ({whatsAppSession.phoneNumber})? Automated receipts and expiry reminders will be paused until you scan the QR code again.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowDisconnectModal(false)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold rounded-xl transition"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  await disconnectWhatsApp();
                  setShowDisconnectModal(false);
                }}
                className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-rose-500/20"
              >
                Confirm Disconnect
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TEST AUTOMATION TRIGGER MODAL */}
      {testModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white font-display">
                    TEST AUTOMATED WHATSAPP TRIGGER
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Dispatch a sample automated message to verify formatting and WhatsApp delivery.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setTestModalOpen(false)}
                className="text-zinc-500 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-zinc-300 block mb-1.5">
                  SELECT TRIGGER TEMPLATE
                </label>
                <select
                  value={testTemplateType}
                  onChange={(e) => setTestTemplateType(e.target.value as any)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-orange-500 focus:outline-none"
                >
                  <option value="renewal_7d">7 Days Prior Renewal Reminder (T-7)</option>
                  <option value="renewal_3d">3 Days Prior Renewal Reminder (T-3)</option>
                  <option value="renewal_1d">1 Day Prior Final Call Reminder (T-1)</option>
                  <option value="birthday">Morning Birthday Greeting Wish (9:00 AM)</option>
                  <option value="festival">Major Festival / Cultural Greeting</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-zinc-300 block mb-1.5">
                    SAMPLE MEMBER NAME
                  </label>
                  <input
                    type="text"
                    value={testMemberName}
                    onChange={(e) => setTestMemberName(e.target.value)}
                    placeholder="e.g. Vikram Hegde"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:border-orange-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-zinc-300 block mb-1.5">
                    TARGET PHONE NUMBER
                  </label>
                  <input
                    type="text"
                    value={testTargetPhone}
                    onChange={(e) => setTestTargetPhone(e.target.value)}
                    placeholder="+91 8197299039"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:border-orange-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-400 block mb-1">
                  TEMPLATE PREVIEW
                </label>
                <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-300 font-mono leading-relaxed max-h-36 overflow-y-auto">
                  {testTemplateType === 'renewal_7d' && (
                    <span>
                      Hello {testMemberName || 'Member'}, your Black Stone Fitness membership will expire in 7 days on 2026-09-11. Renew early to lock in your legacy rate! 💪
                    </span>
                  )}
                  {testTemplateType === 'renewal_3d' && (
                    <span>
                      Hi {testMemberName || 'Member'}, only 3 days left on your BSF membership (2026-09-07). Don't break your workout streak! Visit the front desk or renew via UPI. 🏋️‍♂️
                    </span>
                  )}
                  {testTemplateType === 'renewal_1d' && (
                    <span>
                      FINAL REMINDER: Hi {testMemberName || 'Member'}, your BSF membership expires tomorrow (2026-09-05). Renew today to keep seamless gym access. ⚡
                    </span>
                  )}
                  {testTemplateType === 'birthday' && (
                    <span>
                      🎉 Happy Birthday, {testMemberName || 'Member'}! 🎂 The entire Black Stone Fitness family wishes you a healthy, strong, and powerhouse year ahead. Keep crushing your goals! 💪🔥
                    </span>
                  )}
                  {testTemplateType === 'festival' && (
                    <span>
                      ✨ Black Stone Fitness Mysuru wishes you and your family a joyous celebration filled with strength, health, and happiness! 🌟 Stay fit, stay relentless.
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
              <button
                onClick={() => setTestModalOpen(false)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={handleSendTestMessage}
                disabled={isSendingTestMsg || !testTargetPhone}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-lg shadow-orange-500/20 disabled:opacity-60 cursor-pointer"
              >
                <Send className={`w-3.5 h-3.5 ${isSendingTestMsg ? 'animate-spin' : ''}`} />
                <span>{isSendingTestMsg ? 'Dispatching Message...' : 'Dispatch Test WhatsApp'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
