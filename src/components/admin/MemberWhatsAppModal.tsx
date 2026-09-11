import React, { useState, useEffect, useMemo } from 'react';
import { Member } from '../../types';
import { useGym } from '../../context/GymContext';
import {
  MessageSquare,
  Send,
  Calendar,
  Cake,
  CreditCard,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  X,
  Copy,
  Smartphone,
  RefreshCw,
  Clock,
  User,
  ShieldCheck,
  Zap
} from 'lucide-react';

export type WhatsAppMessageType = 'renewal' | 'birthday' | 'payment_due' | 'welcome' | 'custom';

interface MemberWhatsAppModalProps {
  isOpen: boolean;
  member: Member | null;
  onClose: () => void;
  defaultType?: WhatsAppMessageType;
}

export const MemberWhatsAppModal: React.FC<MemberWhatsAppModalProps> = ({
  isOpen,
  member,
  onClose,
  defaultType = 'renewal'
}) => {
  const { whatsAppSession, sendWhatsAppMessage } = useGym();

  const [messageType, setMessageType] = useState<WhatsAppMessageType>(defaultType);
  const [messageText, setMessageText] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sendSuccess, setSendSuccess] = useState<boolean>(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Clean recipient phone
  const rawPhone = member?.whatsapp || member?.phone || '';
  const cleanPhoneDigits = rawPhone.replace(/\D/g, '');
  const recipientPhone10 = cleanPhoneDigits.length >= 10 ? cleanPhoneDigits.slice(-10) : cleanPhoneDigits;
  const fullWhatsAppPhone = `91${recipientPhone10}`;

  // Generate templates whenever member or messageType changes
  const templates = useMemo(() => {
    if (!member) return {};

    const name = member.fullName || 'Member';
    const plan = member.packageName || 'Gym Membership';
    const expiry = member.expiryDate || 'upcoming date';
    const dues = member.pendingAmount || 0;

    return {
      renewal:
        `⚠️ *MEMBERSHIP RENEWAL ALERT - BLACK STONE FITNESS*\n\n` +
        `Hello ${name},\n` +
        `Greetings from Black Stone Fitness Mysuru! This is a friendly reminder that your *${plan}* validity is set to expire on *${expiry}*.\n\n` +
        `Renew before expiry to maintain your regular fitness routine without interruption, keep your locker preference, and lock in our ongoing renewal benefits.\n\n` +
        `📍 Visit our front desk at New Kantharaj Urs Road, Mysuru or reply to this message for instant UPI renewal details.\n\n` +
        `Stay consistent, stay strong! 💪🔥`,

      birthday:
        `🎉 *HAPPY BIRTHDAY FROM BLACK STONE FITNESS!* 🎂\n\n` +
        `Dear ${name},\n` +
        `The entire coaching team and family at Black Stone Fitness wishes you a very Happy Birthday! 💥\n\n` +
        `May this year bring you abundant health, unstoppable vitality, and powerful personal bests on the gym floor.\n\n` +
        `Enjoy your special day and keep inspiring everyone around you! 🏋️‍♂️✨`,

      payment_due:
        `🧾 *FEE BALANCE CLEARANCE REMINDER - BLACK STONE FITNESS*\n\n` +
        `Hello ${name},\n` +
        `This is a gentle update regarding your gym membership for *${plan}*.\n\n` +
        `• *Member Code:* ${member.memberCode}\n` +
        `• *Outstanding Balance:* *₹${dues.toLocaleString('en-IN')}*\n` +
        `• *Valid Till:* ${expiry}\n\n` +
        `Please settle your pending balance at the reception or reply here to request our direct UPI payment QR.\n\n` +
        `Thank you for being part of Black Stone Fitness Mysuru! 🤝`,

      welcome:
        `👋 *WELCOME TO BLACK STONE FITNESS MYSURU!* 🏋️\n\n` +
        `Hello ${name},\n` +
        `Welcome to the Black Stone Fitness family! We are delighted to have you train with us.\n\n` +
        `• *Plan Activated:* ${plan}\n` +
        `• *Member Code:* ${member.memberCode}\n` +
        `• *Validity:* From ${member.startDate} to ${expiry}\n` +
        `• *Gym Timings:* Mon–Sat 6:00 AM – 10:00 PM\n\n` +
        `Our certified trainers are always available on the floor to guide your technique and workouts. See you at the gym! 💪🚀`,

      custom:
        `Hi ${name},\n\n` +
        `Greetings from Black Stone Fitness Mysuru regarding your *${plan}* membership. We wanted to follow up and see how your fitness training has been going!\n\n` +
        `Please let us know if you need any assistance with your workout regimen or membership renewal.`
    };
  }, [member]);

  // When opening or changing messageType, load matching template
  useEffect(() => {
    if (member && templates[messageType]) {
      setMessageText(templates[messageType] || '');
      setSendSuccess(false);
    }
  }, [member, messageType, templates]);

  if (!isOpen || !member) return null;

  // Insert variable tag into message
  const handleInsertTag = (tag: string) => {
    setMessageText(prev => `${prev} ${tag}`);
  };

  // Dispatch message via WhatsApp Integration Gateway
  const handleSendViaGateway = async () => {
    if (!messageText.trim()) return;
    setIsSending(true);
    setSendSuccess(false);
    setSendError(null);

    try {
      // Map modal message type to WhatsAppMessageLog type
      const logType =
        messageType === 'renewal'
          ? 'expiry_reminder'
          : messageType === 'birthday'
          ? 'birthday'
          : messageType === 'payment_due'
          ? 'receipt'
          : messageType === 'welcome'
          ? 'announcement'
          : 'custom';

      const res = await sendWhatsAppMessage(
        recipientPhone10 ? `+91 ${recipientPhone10}` : member.phone,
        member.fullName,
        messageText.trim(),
        logType
      );

      if (res.success) {
        setSendSuccess(true);
        setTimeout(() => {
          setSendSuccess(false);
        }, 4000);
      } else {
        setSendError(res.error || 'Failed to dispatch via gateway. You can send directly using WhatsApp Web/App below.');
      }
    } catch (err: any) {
      console.error('Error sending WhatsApp message:', err);
      setSendError(err?.message || 'Unexpected error sending WhatsApp message');
    } finally {
      setIsSending(false);
    }
  };

  // Copy message text to clipboard
  const handleCopyText = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Direct wa.me URL
  const waMeUrl = `https://wa.me/${fullWhatsAppPhone}?text=${encodeURIComponent(messageText)}`;

  const isGatewayConnected = whatsAppSession?.status === 'connected';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative bg-zinc-900 border border-zinc-700/80 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-6"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-zinc-950/90 border-b border-zinc-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 shadow-inner">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-white text-base leading-tight font-display">
                  WhatsApp Messenger
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Integration Active</span>
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Dispatch personalized notices, renewal prompts & greetings to <strong className="text-white">{member.fullName}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition shrink-0"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Member Quick Bio Strip */}
        <div className="px-5 py-2.5 bg-zinc-950/50 border-b border-zinc-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-3 font-mono">
            <span className="text-orange-400 font-bold bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
              {member.memberCode}
            </span>
            <span className="text-zinc-300 font-semibold">{member.packageName}</span>
            <span className="text-zinc-500">•</span>
            <span className="text-zinc-400 flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>+91 {recipientPhone10 || member.phone}</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-zinc-500">Valid Till:</span>
            <span className={`font-mono font-bold ${
              member.status === 'expired' ? 'text-rose-400' : member.status === 'expiring_soon' ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {member.expiryDate}
            </span>
            {(member.pendingAmount || 0) > 0 && (
              <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                Due: ₹{member.pendingAmount}
              </span>
            )}
          </div>
        </div>

        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto font-sans-body">
          {/* Message Type Selector Tabs */}
          <div>
            <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
              Select Message Type:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <button
                type="button"
                onClick={() => setMessageType('renewal')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border text-center ${
                  messageType === 'renewal'
                    ? 'bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-500/20 font-black'
                    : 'bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 border-zinc-700/80'
                }`}
              >
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>Renewal</span>
              </button>

              <button
                type="button"
                onClick={() => setMessageType('birthday')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border text-center ${
                  messageType === 'birthday'
                    ? 'bg-pink-500 text-white border-pink-400 shadow-md shadow-pink-500/20 font-black'
                    : 'bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 border-zinc-700/80'
                }`}
              >
                <Cake className="w-3.5 h-3.5 shrink-0" />
                <span>Birthday</span>
              </button>

              <button
                type="button"
                onClick={() => setMessageType('payment_due')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border text-center ${
                  messageType === 'payment_due'
                    ? 'bg-sky-500 text-black border-sky-400 shadow-md shadow-sky-500/20 font-black'
                    : 'bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 border-zinc-700/80'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5 shrink-0" />
                <span>Due Balance</span>
              </button>

              <button
                type="button"
                onClick={() => setMessageType('welcome')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border text-center ${
                  messageType === 'welcome'
                    ? 'bg-emerald-500 text-black border-emerald-400 shadow-md shadow-emerald-500/20 font-black'
                    : 'bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 border-zinc-700/80'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>Welcome</span>
              </button>

              <button
                type="button"
                onClick={() => setMessageType('custom')}
                className={`col-span-2 sm:col-span-1 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border text-center ${
                  messageType === 'custom'
                    ? 'bg-orange-400 text-black border-orange-300 shadow-md shadow-orange-400/20 font-black'
                    : 'bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 border-zinc-700/80'
                }`}
              >
                <User className="w-3.5 h-3.5 shrink-0" />
                <span>Custom</span>
              </button>
            </div>
          </div>

          {/* Quick Insert Variables for Custom Messages */}
          <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-zinc-400">
            <span className="font-bold text-zinc-500">Insert tag:</span>
            <button
              type="button"
              onClick={() => handleInsertTag(member.fullName)}
              className="px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md border border-zinc-700 transition"
            >
              + Member Name
            </button>
            <button
              type="button"
              onClick={() => handleInsertTag(member.packageName)}
              className="px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md border border-zinc-700 transition"
            >
              + Plan Name
            </button>
            <button
              type="button"
              onClick={() => handleInsertTag(member.expiryDate)}
              className="px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md border border-zinc-700 transition"
            >
              + Expiry Date
            </button>
            {(member.pendingAmount || 0) > 0 && (
              <button
                type="button"
                onClick={() => handleInsertTag(`₹${member.pendingAmount}`)}
                className="px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-rose-300 rounded-md border border-rose-500/30 transition"
              >
                + Due Amount
              </button>
            )}
            <button
              type="button"
              onClick={() => setMessageText(templates[messageType] || '')}
              className="ml-auto text-orange-400 hover:text-orange-300 flex items-center gap-1 font-semibold"
              title="Reset to default template"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Template</span>
            </button>
          </div>

          {/* Message Content Textarea */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="font-bold uppercase tracking-wider text-[11px]">Edit Message Text:</span>
              <span className="font-mono text-[11px] text-zinc-500">{messageText.length} characters</span>
            </div>
            <textarea
              rows={5}
              value={messageText}
              onChange={e => setMessageText(e.target.value)}
              placeholder="Type message to send via WhatsApp..."
              className="w-full p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs leading-relaxed focus:border-emerald-500 focus:outline-none shadow-inner font-mono resize-y"
            />
          </div>

          {/* WhatsApp Chat Simulation Bubble */}
          <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-zinc-400 pb-1 border-b border-zinc-800/50">
              <span className="font-bold flex items-center gap-1.5 text-zinc-300">
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Live WhatsApp Chat Preview</span>
              </span>
              <span className="text-zinc-500 font-mono">Recipient: {member.fullName}</span>
            </div>

            <div className="p-3 rounded-xl bg-[#0b141a] border border-[#1f2c34] flex flex-col items-end">
              <div className="max-w-[90%] bg-[#005c4b] text-white p-3 rounded-2xl rounded-tr-sm shadow-md text-xs whitespace-pre-wrap leading-relaxed font-sans">
                {messageText || <span className="italic text-emerald-200/60">No message drafted yet</span>}
                <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-emerald-200/80 font-mono">
                  <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <CheckCircle2 className="w-3 h-3 text-sky-400 inline" />
                </div>
              </div>
            </div>
          </div>

          {/* Gateway Status Notification Banner */}
          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-zinc-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                {isGatewayConnected ? (
                  <>
                    <strong className="text-emerald-400">Gateway Linked:</strong> {whatsAppSession.phoneNumber || '+91 98803 97294'} (Ready for 1-click dispatch)
                  </>
                ) : (
                  <>
                    <strong className="text-amber-400">Direct Gateway Ready:</strong> Dispatch logs to audit history & supports 1-click WhatsApp app launch.
                  </>
                )}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCopyText}
              className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition flex items-center gap-1 text-[11px] shrink-0 font-medium"
              title="Copy message to clipboard"
            >
              <Copy className="w-3 h-3" />
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          {/* Success feedback */}
          {sendSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in duration-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-semibold">
                Message successfully dispatched via WhatsApp integration to +91 {recipientPhone10}!
              </span>
            </div>
          )}

          {/* Error feedback with direct 1-click fallback */}
          {sendError && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-300">
              <div className="flex items-start sm:items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5 sm:mt-0" />
                <span className="leading-relaxed">{sendError}</span>
              </div>
              <a
                href={waMeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  sendWhatsAppMessage(
                    recipientPhone10 ? `+91 ${recipientPhone10}` : member.phone,
                    member.fullName,
                    messageText.trim(),
                    messageType === 'renewal' ? 'expiry_reminder' : messageType === 'birthday' ? 'birthday' : 'custom'
                  );
                }}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 shrink-0 transition"
                title="Send directly using WhatsApp Web or Mobile App"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Send via WhatsApp Web/App</span>
              </a>
            </div>
          )}
        </div>

        {/* Action Buttons Footer */}
        <div className="px-5 py-4 bg-zinc-950 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs transition text-center"
          >
            Close
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Secondary fallback: Open directly in WhatsApp Web / Mobile */}
            <a
              href={waMeUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                // Log communication
                sendWhatsAppMessage(
                  recipientPhone10 ? `+91 ${recipientPhone10}` : member.phone,
                  member.fullName,
                  messageText.trim(),
                  messageType === 'renewal' ? 'expiry_reminder' : messageType === 'birthday' ? 'birthday' : 'custom'
                );
              }}
              className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-emerald-400 hover:text-emerald-300 border border-zinc-700 hover:border-emerald-500/50 font-bold text-xs transition flex items-center justify-center gap-1.5"
              title="Open message in WhatsApp Web or native WhatsApp App"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>WhatsApp Web / App</span>
            </a>

            {/* Primary Action: Send through WhatsApp Integration */}
            <button
              type="button"
              onClick={handleSendViaGateway}
              disabled={isSending || !messageText.trim()}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-black font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Sending Message...</span>
                </>
              ) : sendSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Dispatched!</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send via WhatsApp Integration</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
