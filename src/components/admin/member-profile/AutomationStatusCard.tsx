import React, { useState } from 'react';
import { Member, MemberAutomationOverrides } from '../../../types';
import { useGym } from '../../../context/GymContext';
import {
  Sparkles,
  Cake,
  RotateCcw,
  Receipt,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  Send,
  Zap
} from 'lucide-react';

interface AutomationStatusCardProps {
  member: Member;
}

export const AutomationStatusCard: React.FC<AutomationStatusCardProps> = ({ member }) => {
  const { updateMember, festivals, sendWhatsAppMessage, settings } = useGym();
  const [toggleFeedback, setToggleFeedback] = useState<string | null>(null);
  const [sendingKey, setSendingKey] = useState<string | null>(null);

  const overrides: MemberAutomationOverrides = member.automationOverrides || {
    birthdayWish: true,
    festivalGreetings: true,
    reminder7Days: true,
    reminder3Days: true,
    reminder1Day: true,
    expiryDay: true,
    paymentConfirmation: true
  };

  const handleToggle = (key: keyof MemberAutomationOverrides, label: string) => {
    const updated = {
      ...overrides,
      [key]: !overrides[key]
    };

    updateMember(member.id, { automationOverrides: updated });
    setToggleFeedback(`Automation "${label}" ${!overrides[key] ? 'Enabled' : 'Disabled'} for ${member.fullName}`);
    setTimeout(() => setToggleFeedback(null), 3000);
  };

  const handleSendNow = async (key: keyof MemberAutomationOverrides, title: string) => {
    setSendingKey(key);
    try {
      let msg = '';
      let msgType: any = 'custom';
      if (key === 'reminder7Days') {
        msg = (settings.reminder7DayTemplate || 'Hello {MEMBER_NAME}, your Black Stone Fitness membership will expire in 7 days on {EXPIRY_DATE}. Renew early to lock in your legacy rate! 💪')
          .replace(/{MEMBER_NAME}/gi, member.fullName)
          .replace(/{EXPIRY_DATE}/gi, member.expiryDate || '')
          .replace(/{DAYS_LEFT}/gi, '7');
        msgType = 'expiry_reminder';
      } else if (key === 'reminder3Days') {
        msg = (settings.reminder3DayTemplate || "Hi {MEMBER_NAME}, only 3 days left on your BSF membership ({EXPIRY_DATE}). Don't break your workout streak! Visit the front desk or renew via UPI. 🏋️‍♂️")
          .replace(/{MEMBER_NAME}/gi, member.fullName)
          .replace(/{EXPIRY_DATE}/gi, member.expiryDate || '')
          .replace(/{DAYS_LEFT}/gi, '3');
        msgType = 'expiry_reminder';
      } else if (key === 'reminder1Day') {
        msg = (settings.reminder1DayTemplate || 'FINAL REMINDER: Hi {MEMBER_NAME}, your BSF membership expires tomorrow ({EXPIRY_DATE}). Renew today to keep seamless gym access. ⚡')
          .replace(/{MEMBER_NAME}/gi, member.fullName)
          .replace(/{EXPIRY_DATE}/gi, member.expiryDate || '')
          .replace(/{DAYS_LEFT}/gi, '1');
        msgType = 'expiry_reminder';
      } else if (key === 'birthdayWish') {
        msg = (settings.birthdayTemplate || '🎉 Happy Birthday, {MEMBER_NAME}! 🎂 The entire Black Stone Fitness family wishes you a healthy, strong, and powerhouse year ahead. Keep crushing your goals! 💪🔥')
          .replace(/{MEMBER_NAME}/gi, member.fullName);
        msgType = 'birthday';
      } else if (key === 'festivalGreetings') {
        msg = `✨ Black Stone Fitness Mysuru wishes you, ${member.fullName}, and your family a festive season filled with power, health, and happiness! 🌟 Stay relentless.`;
        msgType = 'announcement';
      }

      if (msg) {
        await sendWhatsAppMessage(member.phone, member.fullName, msg, msgType);
        setToggleFeedback(`Sent "${title}" WhatsApp to ${member.fullName}!`);
        setTimeout(() => setToggleFeedback(null), 4000);
      }
    } catch (e: any) {
      setToggleFeedback(`Failed to send: ${e.message || 'WhatsApp error'}`);
      setTimeout(() => setToggleFeedback(null), 4000);
    } finally {
      setSendingKey(null);
    }
  };

  // Next birthday calculation
  const getNextBirthday = () => {
    if (!member.dob) return 'DOB not provided';
    const parts = member.dob.split('-');
    const currentYear = new Date().getFullYear();
    const bdayThisYear = `${currentYear}-${parts[1] || '01'}-${parts[2] || '01'}`;
    return `${bdayThisYear} (Next cycle)`;
  };

  const automationsList = [
    {
      id: 'birthdayWish' as keyof MemberAutomationOverrides,
      title: 'Birthday Wish & Celebration Offer',
      icon: Cake,
      iconColor: 'text-amber-500',
      scheduledDate: getNextBirthday(),
      enabled: overrides.birthdayWish !== false,
      status: overrides.birthdayWish !== false ? 'Scheduled' : 'Disabled'
    },
    {
      id: 'festivalGreetings' as keyof MemberAutomationOverrides,
      title: 'Festival Greeting & Holiday Notices',
      icon: Sparkles,
      iconColor: 'text-purple-500',
      scheduledDate: 'Upcoming Festive Calendar (Auto-Sync)',
      enabled: overrides.festivalGreetings !== false,
      status: overrides.festivalGreetings !== false ? 'Scheduled' : 'Disabled'
    },
    {
      id: 'reminder7Days' as keyof MemberAutomationOverrides,
      title: 'Renewal Reminder (7 Days Before Expiry)',
      icon: RotateCcw,
      iconColor: 'text-sky-500',
      scheduledDate: `7 Days before ${member.expiryDate}`,
      enabled: overrides.reminder7Days !== false,
      status: overrides.reminder7Days !== false ? (member.status === 'expired' ? 'Sent' : 'Scheduled') : 'Disabled'
    },
    {
      id: 'reminder3Days' as keyof MemberAutomationOverrides,
      title: 'Renewal Reminder (3 Days Before Expiry)',
      icon: RotateCcw,
      iconColor: 'text-amber-500',
      scheduledDate: `3 Days before ${member.expiryDate}`,
      enabled: overrides.reminder3Days !== false,
      status: overrides.reminder3Days !== false ? (member.status === 'expired' ? 'Sent' : 'Scheduled') : 'Disabled'
    },
    {
      id: 'reminder1Day' as keyof MemberAutomationOverrides,
      title: 'Renewal Reminder (1 Day Before Expiry)',
      icon: RotateCcw,
      iconColor: 'text-orange-500',
      scheduledDate: `1 Day before ${member.expiryDate}`,
      enabled: overrides.reminder1Day !== false,
      status: overrides.reminder1Day !== false ? (member.status === 'expired' ? 'Sent' : 'Scheduled') : 'Disabled'
    },
    {
      id: 'expiryDay' as keyof MemberAutomationOverrides,
      title: 'Expiry Day Final Grace Notice',
      icon: RotateCcw,
      iconColor: 'text-rose-500',
      scheduledDate: `On ${member.expiryDate}`,
      enabled: overrides.expiryDay !== false,
      status: overrides.expiryDay !== false ? (member.status === 'expired' ? 'Sent' : 'Scheduled') : 'Disabled'
    },
    {
      id: 'paymentConfirmation' as keyof MemberAutomationOverrides,
      title: 'Payment Confirmation & Digital Invoice',
      icon: Receipt,
      iconColor: 'text-emerald-500',
      scheduledDate: 'Instant on every recorded fee payment',
      enabled: overrides.paymentConfirmation !== false,
      status: overrides.paymentConfirmation !== false ? 'Sent' : 'Disabled'
    }
  ];

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3.5 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-500">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-zinc-900 dark:text-white text-sm">Automatic Message Status</h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Automated WhatsApp schedules & member-level opt-in controls
            </p>
          </div>
        </div>

        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1 self-start sm:self-auto">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Active WhatsApp Bot</span>
        </span>
      </div>

      {toggleFeedback && (
        <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>{toggleFeedback}</span>
        </div>
      )}

      <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
        {automationsList.map((auto) => {
          const Icon = auto.icon;
          return (
            <div
              key={auto.id}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 first:pt-0 last:pb-0"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 shrink-0">
                  <Icon className={`w-4 h-4 ${auto.iconColor}`} />
                </div>
                <div>
                  <p className="font-bold text-xs text-zinc-900 dark:text-white">{auto.title}</p>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3 text-zinc-400" />
                    <span>{auto.scheduledDate}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    auto.status === 'Scheduled'
                      ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                      : auto.status === 'Sent'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    auto.status === 'Scheduled' ? 'bg-sky-500 animate-pulse' : auto.status === 'Sent' ? 'bg-emerald-500' : 'bg-zinc-400'
                  }`} />
                  {auto.status}
                </span>

                {/* Send WhatsApp Now Button */}
                <button
                  type="button"
                  onClick={() => handleSendNow(auto.id, auto.title)}
                  disabled={sendingKey === auto.id || !member.phone}
                  className="p-1.5 rounded-lg bg-zinc-100 hover:bg-orange-50 dark:bg-zinc-800 dark:hover:bg-orange-950/40 text-zinc-600 hover:text-orange-600 dark:text-zinc-400 dark:hover:text-orange-400 transition cursor-pointer disabled:opacity-50"
                  title="Send this WhatsApp message to member now"
                >
                  <Send className={`w-3.5 h-3.5 ${sendingKey === auto.id ? 'animate-spin' : ''}`} />
                </button>

                {/* Switch Toggle */}
                <button
                  type="button"
                  onClick={() => handleToggle(auto.id, auto.title)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    auto.enabled ? 'bg-orange-500' : 'bg-zinc-300 dark:bg-zinc-700'
                  }`}
                  title={auto.enabled ? 'Click to disable for this member' : 'Click to enable for this member'}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      auto.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
