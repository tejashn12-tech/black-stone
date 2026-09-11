import React, { useState } from 'react';
import { Member, MemberSubscriptionItem } from '../../../types';
import { useGym } from '../../../context/GymContext';
import {
  CreditCard,
  PlusCircle,
  RefreshCw,
  Edit2,
  CheckCircle2,
  Calendar,
  Sparkles,
  Ban,
  Dumbbell,
  UserCheck,
  Award,
  Layers,
  Check,
  Clock,
  Flame,
  AlertCircle
} from 'lucide-react';

interface SubscriptionsTabProps {
  member: Member;
  onOpenModal: (type: any, data?: any) => void;
}

export const SubscriptionsTab: React.FC<SubscriptionsTabProps> = ({
  member,
  onOpenModal
}) => {
  const { updateMember } = useGym();
  const [filterType, setFilterType] = useState<'all' | 'plans' | 'pt'>('all');
  const [statusFilter, setStatusFilter] = useState<'active' | 'all'>('active');

  // Derive member's primary plan subscription
  const primaryPlanSub: MemberSubscriptionItem = {
    id: `sub-${member.id}-main-plan`,
    type: 'membership_plan',
    membershipName: member.packageName || '3 Months Power Builder',
    category: 'Gym Floor & Functional Access',
    startDate: member.startDate,
    endDate: member.expiryDate,
    price: member.totalAmount || 3499,
    paidAmount: member.paidAmount || member.totalAmount,
    pendingAmount: member.pendingAmount || 0,
    membershipStatus: member.isFrozen ? 'Frozen' : (member.status === 'expired' ? 'Expired' : 'Active'),
    paymentStatus: member.pendingAmount > 0 ? 'Pending' : 'Paid',
    packageId: member.packageId,
    notes: 'Primary Gym Access Plan'
  };

  // Derive all subscriptions list including primary plan and any PT/add-ons
  const rawSubs = member.subscriptions && member.subscriptions.length > 0
    ? member.subscriptions
    : [primaryPlanSub];

  // If member has personal training assigned, ensure PT subscription item is represented
  const hasPT = Boolean(
    member.hasPersonalTraining ||
    member.personalTraining?.enrolled ||
    (member.assignedTrainerName && member.assignedTrainerName !== 'Floor Coach' && member.assignedTrainerName !== 'Unassigned')
  );

  const ptPlanSub: MemberSubscriptionItem | null = hasPT
    ? {
        id: `sub-${member.id}-pt-plan`,
        type: 'personal_training',
        membershipName: member.personalTraining?.planName || '1-on-1 Personal Training (24 Sessions)',
        category: 'Dedicated Personal Trainer',
        trainerName: member.personalTraining?.trainerName || member.assignedTrainerName || 'Vikram Shetty',
        trainerId: member.personalTraining?.trainerId || member.assignedTrainerId,
        startDate: member.personalTraining?.startDate || member.startDate,
        endDate: member.personalTraining?.endDate || member.expiryDate,
        totalSessions: member.personalTraining?.totalSessions || 24,
        completedSessions: member.personalTraining?.completedSessions || 16,
        price: member.personalTraining?.price || 7999,
        paidAmount: member.personalTraining?.paidAmount || 7999,
        pendingAmount: member.personalTraining?.pendingAmount || 0,
        membershipStatus: member.personalTraining?.status === 'Expired' ? 'Expired' : 'Active',
        paymentStatus: 'Paid',
        notes: `Coach: ${member.personalTraining?.trainerName || member.assignedTrainerName || 'Vikram Shetty'}`
      }
    : null;

  // Combine items safely without duplicates
  const allSubscriptions: MemberSubscriptionItem[] = [];
  
  // 1. Add primary plan if not already present
  const hasMainInList = rawSubs.some(s => s.type === 'membership_plan' || s.id.includes('main-plan') || s.membershipName === member.packageName);
  if (!hasMainInList) {
    allSubscriptions.push(primaryPlanSub);
  }
  
  rawSubs.forEach(s => {
    // Determine type if not set
    const itemType = s.type || (s.membershipName.toLowerCase().includes('personal') || s.membershipName.toLowerCase().includes('pt') || s.category.toLowerCase().includes('trainer') ? 'personal_training' : 'membership_plan');
    allSubscriptions.push({ ...s, type: itemType });
  });

  if (ptPlanSub && !allSubscriptions.some(s => s.type === 'personal_training')) {
    allSubscriptions.push(ptPlanSub);
  }

  // Filter subscriptions into separate buckets
  const membershipPlans = allSubscriptions.filter(s => s.type === 'membership_plan' || (!s.type && !s.membershipName.toLowerCase().includes('personal')));
  const personalTrainingSubs = allSubscriptions.filter(s => s.type === 'personal_training' || s.membershipName.toLowerCase().includes('personal') || s.membershipName.toLowerCase().includes('pt'));

  const handleCancelSubscription = (subId: string, subName: string) => {
    if (confirm(`Are you sure you want to cancel subscription "${subName}" for ${member.fullName}?`)) {
      const updated = allSubscriptions.map(s => (s.id === subId ? { ...s, membershipStatus: 'Cancelled' as const } : s));
      updateMember(member.id, { subscriptions: updated });
    }
  };

  const handleIncrementSession = () => {
    const currentCompleted = member.personalTraining?.completedSessions || 16;
    const currentTotal = member.personalTraining?.totalSessions || 24;
    const nextCompleted = Math.min(currentTotal, currentCompleted + 1);

    const updatedPT = {
      enrolled: true,
      trainerId: member.personalTraining?.trainerId || member.assignedTrainerId || 'tr-1',
      trainerName: member.personalTraining?.trainerName || member.assignedTrainerName || 'Vikram Shetty',
      planName: member.personalTraining?.planName || '1-on-1 Personal Training (24 Sessions)',
      totalSessions: currentTotal,
      completedSessions: nextCompleted,
      startDate: member.personalTraining?.startDate || member.startDate,
      endDate: member.personalTraining?.endDate || member.expiryDate,
      price: member.personalTraining?.price || 7999,
      status: (nextCompleted >= currentTotal ? 'Completed' : 'Active') as 'Active' | 'Completed' | 'Expired' | 'Paused',
      sessionHistory: [
        ...(member.personalTraining?.sessionHistory || []),
        {
          id: `pt-log-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          focus: 'Strength & Hypertrophy Circuit',
          trainerName: member.personalTraining?.trainerName || member.assignedTrainerName || 'Vikram Shetty',
          durationMinutes: 60
        }
      ]
    };

    updateMember(member.id, {
      hasPersonalTraining: true,
      personalTraining: updatedPT
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Fast Filter Bar */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <h3 className="font-bold text-zinc-900 dark:text-white text-base flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-orange-500" />
              <span>Plans & Personal Training Subscriptions</span>
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Separate view for gym membership plans and assigned personal coaching packages
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => onOpenModal('add_subscription')}
              className="px-3.5 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Plan</span>
            </button>

            <button
              onClick={() => onOpenModal('assign_pt')}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <Dumbbell className="w-3.5 h-3.5" />
              <span>{hasPT ? 'Renew / Update PT' : 'Assign Personal Training'}</span>
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-between gap-2 flex-wrap pt-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                filterType === 'all'
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-sm'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All Plans ({allSubscriptions.length})</span>
            </button>

            <button
              onClick={() => setFilterType('plans')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                filterType === 'plans'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-950/50'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Membership Plans ({membershipPlans.length})</span>
            </button>

            <button
              onClick={() => setFilterType('pt')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                filterType === 'pt'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-950/50'
              }`}
            >
              <Dumbbell className="w-3.5 h-3.5" />
              <span>Personal Training ({personalTrainingSubs.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <span>Status:</span>
            <button
              onClick={() => setStatusFilter(statusFilter === 'active' ? 'all' : 'active')}
              className="font-bold text-zinc-700 dark:text-zinc-200 hover:text-orange-500 underline"
            >
              {statusFilter === 'active' ? 'Active Only' : 'Show All History'}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: MEMBERSHIP PLANS TAKEN                                        */}
      {/* ========================================================================= */}
      {(filterType === 'all' || filterType === 'plans') && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-zinc-900 dark:text-white text-sm">
                  1. Gym Membership Plans (Taken)
                </h4>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Floor access, cardio, turf zone, and tenure validity
                </p>
              </div>
            </div>

            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
              {membershipPlans.length} Active Plan
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 dark:bg-zinc-950/80 text-zinc-500 dark:text-zinc-400 font-bold uppercase text-[10px] tracking-wider border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="py-3 px-3.5">Plan Name</th>
                  <th className="py-3 px-3.5">Category</th>
                  <th className="py-3 px-3.5">Start Date</th>
                  <th className="py-3 px-3.5">End Date</th>
                  <th className="py-3 px-3.5">Price</th>
                  <th className="py-3 px-3.5">Status</th>
                  <th className="py-3 px-3.5">Payment</th>
                  <th className="py-3 px-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 font-medium">
                {membershipPlans.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-6 text-center text-zinc-400">
                      No membership plans registered. Click "Add Plan" to assign one.
                    </td>
                  </tr>
                ) : (
                  membershipPlans.map((plan) => (
                    <tr key={plan.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition">
                      <td className="py-3.5 px-3.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                          <div>
                            <p className="font-bold text-zinc-900 dark:text-white">{plan.membershipName}</p>
                            <span className="text-[10px] text-zinc-400 font-mono">ID: {plan.packageId || 'pkg-standard'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3.5 text-zinc-600 dark:text-zinc-300">
                        {plan.category || 'Gym Floor & Functional Access'}
                      </td>
                      <td className="py-3.5 px-3.5 font-mono text-zinc-600 dark:text-zinc-400">
                        {plan.startDate}
                      </td>
                      <td className="py-3.5 px-3.5 font-mono font-bold text-zinc-900 dark:text-zinc-100">
                        {plan.endDate}
                      </td>
                      <td className="py-3.5 px-3.5 font-mono font-bold text-zinc-900 dark:text-white">
                        ₹{plan.price.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            plan.membershipStatus === 'Active'
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : plan.membershipStatus === 'Frozen'
                              ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                              : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {plan.membershipStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-3.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            plan.paymentStatus === 'Paid'
                              ? 'bg-emerald-100/60 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300'
                              : 'bg-amber-100/60 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300'
                          }`}
                        >
                          {plan.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenModal('renew_subscription', plan)}
                            className="px-2.5 py-1 rounded-lg bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/30 dark:hover:bg-orange-900/40 text-orange-700 dark:text-orange-300 text-xs font-bold transition flex items-center gap-1"
                            title="Renew Membership Plan"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Renew</span>
                          </button>
                          <button
                            onClick={() => onOpenModal('extend', plan)}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-950/30 transition"
                            title="Extend Validity"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: PERSONAL TRAINING (PT) TAKEN / ASSIGNED                       */}
      {/* ========================================================================= */}
      {(filterType === 'all' || filterType === 'pt') && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
                <Dumbbell className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-zinc-900 dark:text-white text-sm">
                  2. Personal Training (PT) Packages (Taken)
                </h4>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Dedicated 1-on-1 personal coach, workout progression, and session ledger
                </p>
              </div>
            </div>

            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
              hasPT
                ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-zinc-200 dark:border-zinc-700'
            }`}>
              {hasPT ? 'PT Enrolled (Active)' : 'No PT Enrolled'}
            </span>
          </div>

          {hasPT ? (
            <div className="space-y-4">
              {/* Active PT Hero Card */}
              <div className="bg-gradient-to-r from-indigo-900/90 via-indigo-950 to-zinc-900 border border-indigo-800/60 rounded-2xl p-5 text-white shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300 text-lg font-bold shrink-0">
                      <Dumbbell className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-700/50">
                        1-on-1 Personal Coaching
                      </span>
                      <h5 className="text-lg font-black mt-1 font-display">
                        {member.personalTraining?.planName || '1-on-1 Personal Training (24 Sessions)'}
                      </h5>
                      <p className="text-xs text-indigo-200">
                        Assigned Coach: <strong className="text-white font-bold">{member.personalTraining?.trainerName || member.assignedTrainerName || 'Vikram Shetty'}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleIncrementSession}
                      className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>+1 Log Session</span>
                    </button>

                    <button
                      onClick={() => onOpenModal('renew_pt')}
                      className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Renew PT</span>
                    </button>
                  </div>
                </div>

                {/* Session Progress Meter */}
                <div className="bg-black/30 rounded-xl p-4 border border-indigo-700/30 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-indigo-200 flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-orange-400" />
                      <span>Sessions Progress:</span>
                    </span>
                    <span className="font-mono font-bold text-white text-sm">
                      {member.personalTraining?.completedSessions || 16} / {member.personalTraining?.totalSessions || 24} Sessions Completed
                    </span>
                  </div>

                  <div className="w-full bg-indigo-950 h-3 rounded-full overflow-hidden border border-indigo-800/50">
                    <div
                      className="bg-gradient-to-r from-orange-500 to-amber-400 h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round(
                            ((member.personalTraining?.completedSessions || 16) /
                              (member.personalTraining?.totalSessions || 24)) *
                              100
                          )
                        )}%`
                      }}
                    />
                  </div>

                  <div className="flex justify-between text-[10px] text-indigo-300 font-mono pt-1">
                    <span>Validity: {member.personalTraining?.startDate || member.startDate} to {member.personalTraining?.endDate || member.expiryDate}</span>
                    <span>Remaining: {Math.max(0, (member.personalTraining?.totalSessions || 24) - (member.personalTraining?.completedSessions || 16))} Sessions</span>
                  </div>
                </div>
              </div>

              {/* PT Subscriptions Table List */}
              <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 dark:bg-zinc-950/80 text-zinc-500 dark:text-zinc-400 font-bold uppercase text-[10px] tracking-wider border-b border-zinc-200 dark:border-zinc-800">
                    <tr>
                      <th className="py-3 px-3.5">PT Package</th>
                      <th className="py-3 px-3.5">Coach</th>
                      <th className="py-3 px-3.5">Sessions</th>
                      <th className="py-3 px-3.5">Start Date</th>
                      <th className="py-3 px-3.5">End Date</th>
                      <th className="py-3 px-3.5">Price</th>
                      <th className="py-3 px-3.5">Status</th>
                      <th className="py-3 px-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 font-medium">
                    {personalTrainingSubs.map((pt) => (
                      <tr key={pt.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition">
                        <td className="py-3.5 px-3.5">
                          <p className="font-bold text-zinc-900 dark:text-white">{pt.membershipName}</p>
                          <span className="text-[10px] text-indigo-500 font-mono">1-on-1 Coaching</span>
                        </td>
                        <td className="py-3.5 px-3.5 font-bold text-indigo-600 dark:text-indigo-400">
                          {pt.trainerName || member.assignedTrainerName || 'Vikram Shetty'}
                        </td>
                        <td className="py-3.5 px-3.5 font-mono font-bold text-zinc-900 dark:text-white">
                          {member.personalTraining?.completedSessions || 16} / {pt.totalSessions || 24}
                        </td>
                        <td className="py-3.5 px-3.5 font-mono text-zinc-600 dark:text-zinc-400">
                          {pt.startDate}
                        </td>
                        <td className="py-3.5 px-3.5 font-mono font-bold text-zinc-900 dark:text-zinc-100">
                          {pt.endDate}
                        </td>
                        <td className="py-3.5 px-3.5 font-mono font-bold text-zinc-900 dark:text-white">
                          ₹{(pt.price || 7999).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-3.5">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                            Active PT
                          </span>
                        </td>
                        <td className="py-3.5 px-3.5 text-right whitespace-nowrap">
                          <button
                            onClick={handleIncrementSession}
                            className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-bold transition inline-flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            <span>Log Session</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* Empty State for Personal Training with easy assign button */
            <div className="p-8 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto">
                <Dumbbell className="w-6 h-6" />
              </div>
              <h5 className="font-bold text-zinc-900 dark:text-white text-sm">
                No Personal Training (PT) Taken
              </h5>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
                This member currently has general gym floor access only. You can assign a dedicated coach and allocate session packages below.
              </p>
              <button
                onClick={() => onOpenModal('assign_pt')}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-sm inline-flex items-center gap-2 mt-2"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Assign Personal Trainer & PT Package</span>
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
