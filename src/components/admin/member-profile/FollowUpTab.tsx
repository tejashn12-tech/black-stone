import React, { useState } from 'react';
import { Member, MemberFollowUpLog } from '../../../types';
import { useGym } from '../../../context/GymContext';
import {
  PhoneCall,
  PlusCircle,
  Calendar,
  UserCheck,
  Clock,
  MessageSquare,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface FollowUpTabProps {
  member: Member;
  onOpenModal: (type: any, data?: any) => void;
}

export const FollowUpTab: React.FC<FollowUpTabProps> = ({ member, onOpenModal }) => {
  const followUps: MemberFollowUpLog[] = member.followUps && member.followUps.length > 0
    ? member.followUps
    : [
        {
          id: 'fu-1',
          date: '2026-08-25',
          staffName: 'Pooja (Front Desk CRM)',
          note: 'Called member regarding personal training progress and workout satisfaction. Member expressed high satisfaction with leg press & squat improvements.',
          outcome: 'Interested',
          nextFollowUpDate: '2026-09-15'
        },
        {
          id: 'fu-2',
          date: '2026-08-10',
          staffName: 'Admin Desk',
          note: 'Renewal reminder touchpoint. Informed member about annual combo discounts.',
          outcome: 'Renewal Promised',
          nextFollowUpDate: '2026-08-25'
        }
      ];

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <h3 className="font-bold text-zinc-900 dark:text-white text-base flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-indigo-500" />
            <span>Staff Follow-up & CRM Engagement Logs</span>
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Call history, renewal promises, customer feedback notes, and scheduled next calls
          </p>
        </div>

        <button
          onClick={() => onOpenModal('add_followup')}
          className="py-1.5 px-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Add Follow-up Log</span>
        </button>
      </div>

      <div className="space-y-3">
        {followUps.map((log) => (
          <div
            key={log.id}
            className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/60 space-y-2"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-zinc-900 dark:text-white">{log.staffName}</span>
                <span className="text-[10px] text-zinc-400 font-mono">• {log.date}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {log.outcome}
                </span>
                {log.nextFollowUpDate && (
                  <span className="text-[10px] font-mono text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30 px-2 py-0.5 rounded border border-orange-200 dark:border-orange-800">
                    Next: {log.nextFollowUpDate}
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
              "{log.note}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
