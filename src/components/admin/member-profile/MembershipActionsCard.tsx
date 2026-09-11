import React from 'react';
import { Member } from '../../../types';
import { ProfileModalState } from './types';
import {
  Snowflake,
  CalendarPlus,
  ArrowDownRight,
  UserCheck,
  ArrowUpRight,
  Layers,
  Dumbbell,
  RefreshCw,
  Gift,
  PlusCircle,
  Sparkles,
  Zap,
  CheckCircle2,
  Calendar
} from 'lucide-react';

interface MembershipActionsCardProps {
  member: Member;
  onOpenModal: (type: ProfileModalState['type'], data?: any) => void;
}

export const MembershipActionsCard: React.FC<MembershipActionsCardProps> = ({
  member,
  onOpenModal
}) => {
  const hasPT = Boolean(
    member.hasPersonalTraining ||
    member.personalTraining?.enrolled ||
    (member.assignedTrainerName && member.assignedTrainerName !== 'Floor Coach' && member.assignedTrainerName !== 'Unassigned')
  );

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3.5 border-b border-zinc-100 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-500">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-zinc-900 dark:text-white text-sm">Membership & PT Action Center</h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Separated controls for Membership Plans and Personal Training packages
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-zinc-600 dark:text-zinc-300 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 px-2 py-0.5 rounded-md font-semibold">
            Plan: {member.packageName}
          </span>
          {hasPT && (
            <span className="text-[11px] font-mono text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 px-2 py-0.5 rounded-md font-semibold">
              PT: {member.personalTraining?.trainerName || member.assignedTrainerName}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Membership Plan Operations (6 cols) */}
        <div className="lg:col-span-6 space-y-2.5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>1. Membership Plan Operations</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onOpenModal('extend')}
              className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 hover:bg-emerald-50 dark:bg-zinc-800/60 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:border-emerald-300 text-xs font-semibold transition flex items-center gap-2 text-left"
            >
              <CalendarPlus className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Extend Plan</span>
            </button>

            <button
              onClick={() => onOpenModal('upgrade')}
              className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 hover:bg-orange-50 dark:bg-zinc-800/60 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:border-orange-300 text-xs font-semibold transition flex items-center gap-2 text-left"
            >
              <ArrowUpRight className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              <span>Upgrade Plan</span>
            </button>

            <button
              onClick={() => onOpenModal('freeze')}
              className={`px-3 py-2 rounded-xl border text-xs font-semibold transition flex items-center gap-2 text-left ${
                member.isFrozen
                  ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-300 dark:border-sky-800 text-sky-700 dark:text-sky-300'
                  : 'bg-zinc-50 hover:bg-sky-50 dark:bg-zinc-800/60 dark:hover:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:border-sky-300'
              }`}
            >
              <Snowflake className="w-3.5 h-3.5 text-sky-500 shrink-0" />
              <span>{member.isFrozen ? 'Unfreeze' : 'Freeze / Pause'}</span>
            </button>

            <button
              onClick={() => onOpenModal('transfer')}
              className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 hover:bg-purple-50 dark:bg-zinc-800/60 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:border-purple-300 text-xs font-semibold transition flex items-center gap-2 text-left"
            >
              <UserCheck className="w-3.5 h-3.5 text-purple-500 shrink-0" />
              <span>Transfer Plan</span>
            </button>

            <button
              onClick={() => onOpenModal('downgrade')}
              className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/60 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 text-xs font-semibold transition flex items-center gap-2 text-left"
            >
              <ArrowDownRight className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <span>Downgrade</span>
            </button>

            <button
              onClick={() => onOpenModal('add_subscription')}
              className="px-3 py-2 rounded-xl border border-orange-200 dark:border-orange-800 bg-orange-50/60 hover:bg-orange-100 dark:bg-orange-950/20 dark:hover:bg-orange-950/40 text-orange-800 dark:text-orange-300 text-xs font-semibold transition flex items-center gap-2 text-left"
            >
              <PlusCircle className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              <span>Add New Plan</span>
            </button>
          </div>
        </div>

        {/* Right: Personal Training (PT) Operations (6 cols) */}
        <div className="lg:col-span-6 space-y-2.5 lg:border-l lg:border-zinc-100 dark:lg:border-zinc-800 lg:pl-5">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <Dumbbell className="w-3.5 h-3.5" />
              <span>2. Personal Training (PT) Operations</span>
            </p>
            {hasPT && (
              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono font-bold">
                {member.personalTraining?.completedSessions || 16}/{member.personalTraining?.totalSessions || 24} Done
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onOpenModal('assign_pt')}
              className="px-3 py-2 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/70 hover:bg-indigo-100 dark:bg-indigo-950/30 dark:hover:bg-indigo-950/50 text-indigo-900 dark:text-indigo-200 text-xs font-bold transition flex items-center gap-2 text-left shadow-sm"
            >
              <Dumbbell className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>{hasPT ? 'Reassign PT Trainer' : 'Assign PT Package'}</span>
            </button>

            <button
              onClick={() => onOpenModal('renew_pt')}
              className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/60 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 text-xs font-semibold transition flex items-center gap-2 text-left"
            >
              <RefreshCw className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <span>Renew PT Sessions</span>
            </button>

            <button
              onClick={() => onOpenModal('combo')}
              className="px-3 py-2 rounded-xl border border-amber-200 dark:border-amber-800/60 bg-amber-50/60 hover:bg-amber-100/70 dark:bg-amber-950/20 dark:hover:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-semibold transition flex items-center gap-2 text-left"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Plan + PT Combo</span>
            </button>

            <button
              onClick={() => onOpenModal('free_trial')}
              className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 hover:bg-rose-50 dark:bg-zinc-800/60 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:border-rose-300 text-xs font-semibold transition flex items-center gap-2 text-left"
            >
              <Gift className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span>Book PT Trial</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
