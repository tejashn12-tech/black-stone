import React, { useState } from 'react';
import { Member } from '../../../types';
import { useGym } from '../../../context/GymContext';
import { MemberWhatsAppModal } from '../MemberWhatsAppModal';
import {
  MessageSquare,
  CheckCheck,
  Bell,
  Sparkles,
  Cake,
  Receipt,
  RotateCcw
} from 'lucide-react';

interface CommunicationTabProps {
  member: Member;
  onOpenModal: (type: any, data?: any) => void;
}

export const CommunicationTab: React.FC<CommunicationTabProps> = ({ member, onOpenModal }) => {
  const { notifications } = useGym();
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState<boolean>(false);

  const memberNotifications = notifications.filter(
    (n) => n.targetRole === 'members' || n.title.includes(member.fullName) || n.message.includes(member.fullName)
  );

  // Fallback synthetic communication events if no automated logs exist yet
  const displayLogs = memberNotifications.length > 0
    ? memberNotifications.map(n => ({
        id: n.id,
        messageType: 'notification',
        recipient: member.phone,
        messageText: `${n.title}: ${n.message}`,
        status: n.read ? ('read' as const) : ('delivered' as const),
        createdAt: n.timestamp,
        sentAt: n.timestamp
      }))
    : [
        {
          id: 'msg-1',
          messageType: 'expiry_reminder',
          recipient: member.phone,
          messageText: `Hi ${member.fullName}, your gym membership at Black Stone Fitness is scheduled for renewal in 7 days. Click here to renew online with special renewal perks!`,
          status: 'read' as const,
          createdAt: '2026-08-28 10:30 AM',
          sentAt: '2026-08-28 10:30 AM',
          deliveredAt: '2026-08-28 10:31 AM',
          readAt: '2026-08-28 10:34 AM'
        },
        {
          id: 'msg-2',
          messageType: 'payment_receipt',
          recipient: member.phone,
          messageText: `Dear ${member.fullName}, thank you for your payment of ₹15,999 for ${member.packageName}. Official receipt #BSF-REC-8921 is generated.`,
          status: 'delivered' as const,
          createdAt: '2026-08-01 04:15 PM',
          sentAt: '2026-08-01 04:15 PM',
          deliveredAt: '2026-08-01 04:16 PM'
        },
        {
          id: 'msg-3',
          messageType: 'festival_greeting',
          recipient: member.phone,
          messageText: `Happy Independence Day! Black Stone Fitness wishes ${member.fullName} strength and great health this festive season.`,
          status: 'read' as const,
          createdAt: '2026-08-15 08:00 AM',
          sentAt: '2026-08-15 08:00 AM',
          readAt: '2026-08-15 09:12 AM'
        }
      ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'birthday_wish':
        return <Cake className="w-4 h-4 text-amber-500" />;
      case 'festival_greeting':
        return <Sparkles className="w-4 h-4 text-purple-500" />;
      case 'payment_receipt':
        return <Receipt className="w-4 h-4 text-emerald-500" />;
      case 'expiry_reminder':
        return <RotateCcw className="w-4 h-4 text-sky-500" />;
      default:
        return <Bell className="w-4 h-4 text-orange-500" />;
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <h3 className="font-bold text-zinc-900 dark:text-white text-base flex items-center gap-2">
            <Bell className="w-5 h-5 text-orange-500" />
            <span>Communication & Broadcast History</span>
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Audit trail of notices, renewals, receipts, and custom broadcasts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsWhatsAppOpen(true)}
            className="py-1.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition flex items-center gap-1.5 shadow-sm shadow-emerald-500/20"
            title="Open WhatsApp Messenger for this member"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp Message</span>
          </button>

          <button
            onClick={() => onOpenModal('send_notification')}
            className="py-1.5 px-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-bold transition flex items-center gap-1.5"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Send Notification</span>
          </button>
        </div>
      </div>

      {/* Timeline List */}
      <div className="space-y-3">
        {displayLogs.map((log, index) => (
          <div
            key={`${log.id}-${index}`}
            className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 flex flex-col sm:flex-row sm:items-start justify-between gap-3"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shrink-0">
                {getIcon(log.messageType)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-xs text-zinc-900 dark:text-white capitalize">
                    {log.messageType.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">
                    To: {log.recipient}
                  </span>
                </div>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed bg-white dark:bg-zinc-900 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800/80">
                  {log.messageText}
                </p>
                <div className="flex items-center gap-3 text-[10px] text-zinc-400 font-mono pt-1">
                  <span>Sent: {log.createdAt}</span>
                  {log.deliveredAt && <span>• Delivered: {log.deliveredAt}</span>}
                  {log.readAt && <span>• Read: {log.readAt}</span>}
                </div>
              </div>
            </div>

            <div className="shrink-0 self-end sm:self-start">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  log.status === 'read'
                    ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                    : log.status === 'delivered'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                }`}
              >
                <CheckCheck className="w-3 h-3" />
                <span>{log.status}</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {isWhatsAppOpen && (
        <MemberWhatsAppModal
          isOpen={isWhatsAppOpen}
          member={member}
          onClose={() => setIsWhatsAppOpen(false)}
        />
      )}
    </div>
  );
};
