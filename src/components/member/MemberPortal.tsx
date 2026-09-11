import React, { useState, useRef } from 'react';
import { useGym } from '../../context/GymContext';
import { Member, PaymentRecord } from '../../types';
import { BSFLogo } from '../common/BSFLogo';
import { ReceiptModal } from '../common/ReceiptModal';
import { DataRightsModal } from '../common/DataRightsModal';
import { PrivacyNoticeModal } from '../common/PrivacyNoticeModal';
import { LiveCameraModal } from '../common/LiveCameraModal';
import { compressImageToDataUrl } from '../../utils/photoStorage';
import {
  Calendar,
  CreditCard,
  User,
  ShieldCheck,
  Phone,
  QrCode,
  Download,
  Receipt,
  Clock,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  LogOut,
  Dumbbell,
  CheckCircle2,
  ExternalLink,
  Shield,
  FileText,
  UserX,
  Lock,
  Camera,
  Upload
} from 'lucide-react';

interface MemberPortalProps {
  onGoToCalculators?: () => void;
  onGoToExercises?: () => void;
}

export const MemberPortal: React.FC<MemberPortalProps> = ({
  onGoToCalculators,
  onGoToExercises
}) => {
  const { currentMember, payments, packages, renewMember, updateMember, logout, getTrainerById } = useGym();
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentRecord | null>(null);
  const [isRenewModalOpen, setIsRenewModalOpen] = useState<boolean>(false);
  const [isDSRModalOpen, setIsDSRModalOpen] = useState<boolean>(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState<boolean>(false);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState<boolean>(false);
  const [renewPackageId, setRenewPackageId] = useState<string>('');
  const [renewPaymentMethod, setRenewPaymentMethod] = useState<PaymentRecord['paymentMethod']>('UPI');
  const [renewAmount, setRenewAmount] = useState<number>(0);
  const memberPhotoFileInputRef = useRef<HTMLInputElement | null>(null);

  if (!currentMember) return null;

  const handleSelfieCapture = (capturedDataUrl: string) => {
    updateMember(currentMember.id, { photoUrl: capturedDataUrl });
    setIsCameraModalOpen(false);
  };

  const handleMemberPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && currentMember) {
      try {
        const compressed = await compressImageToDataUrl(file, 500, 0.82);
        updateMember(currentMember.id, { photoUrl: compressed });
      } catch (err) {
        console.error('Failed to compress member photo:', err);
      } finally {
        e.target.value = '';
      }
    }
  };

  // Filter payments for this member
  const memberPayments = payments.filter(p => p.memberId === currentMember.id);
  const assignedTrainer = currentMember.assignedTrainerId ? getTrainerById(currentMember.assignedTrainerId) : null;

  // Export personal data as JSON
  const handleExportMyData = () => {
    const exportPayload = {
      complianceNotice: 'Data Export under Section 11 of DPDP Act 2023 (Digital Personal Data Protection Act, India)',
      exportedAt: new Date().toISOString(),
      dataPrincipal: {
        id: currentMember.id,
        memberCode: currentMember.memberCode,
        fullName: currentMember.fullName,
        email: currentMember.email,
        phone: currentMember.phone,
        whatsapp: currentMember.whatsapp,
        dob: currentMember.dob,
        gender: currentMember.gender,
        address: currentMember.address,
        healthNotes: currentMember.notes,
        admissionDate: currentMember.startDate,
        membershipExpiry: currentMember.expiryDate,
        packageName: currentMember.packageName,
        membershipStatus: currentMember.status,
        assignedTrainer: assignedTrainer ? `${assignedTrainer.name} (${assignedTrainer.specialization})` : 'Floor Coach'
      },
      financialLedger: memberPayments.map(p => ({
        invoiceId: p.id,
        date: p.paymentDate,
        amount: p.amountPaid,
        method: p.paymentMethod,
        status: p.status,
        notes: p.notes
      })),
      grievanceOfficer: {
        name: 'Mr. Tejas HN',
        email: 'privacy@blackstonefitness.in',
        phone: '+91 98803 97294',
        address: '52/4 New Kantharaj Urs Rd, Sharadadevi Nagar, Mysuru 570023'
      }
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BSF_Personal_Data_${currentMember.memberCode}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Calculate days remaining
  const expiryDate = new Date(currentMember.expiryDate);
  const today = new Date();
  const diffTime = expiryDate.getTime() - today.getTime();
  const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const isExpiringSoon = daysRemaining <= 7 && daysRemaining > 0;
  const isExpired = daysRemaining <= 0;

  const handleOpenRenew = () => {
    const pkg = packages.find(p => p.id === currentMember.packageId) || packages[0];
    setRenewPackageId(pkg?.id || 'pkg-12');
    setRenewAmount(pkg?.price || 9999);
    setIsRenewModalOpen(true);
  };

  const handleExecuteRenew = (e: React.FormEvent) => {
    e.preventDefault();
    const pkg = packages.find(p => p.id === renewPackageId);
    if (!pkg) return;

    renewMember(
      currentMember.id,
      pkg.id,
      pkg.durationMonths,
      renewAmount,
      renewPaymentMethod,
      'Member Portal Self-Renewal'
    );
    setIsRenewModalOpen(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8" id="bsf-member-portal-dashboard">
      
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-zinc-900/90 border border-zinc-800 rounded-3xl backdrop-blur">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <img
              src={currentMember.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
              alt={currentMember.fullName}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-2xl object-cover border-2 border-orange-400/80 shadow-lg shadow-orange-400/10 cursor-pointer"
              onClick={() => setIsCameraModalOpen(true)}
              title="Click to take / update your live photo"
            />
            <div className="absolute -bottom-1 -right-1 flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsCameraModalOpen(true)}
                className="p-1.5 bg-orange-400 hover:bg-orange-300 text-black rounded-full shadow-lg transition"
                title="Take Live Camera Photo"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => memberPhotoFileInputRef.current?.click()}
                className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-full shadow-lg transition"
                title="Upload Photo File"
              >
                <Upload className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white font-display tracking-wide">
                WELCOME, {currentMember.fullName.toUpperCase()}
              </h1>
              <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider border ${
                currentMember.status === 'active'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : currentMember.status === 'expiring_soon'
                  ? 'bg-orange-500/10 text-orange-400 border-orange-500/30'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
              }`}>
                {currentMember.status.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5 font-mono">
              Member ID: <strong className="text-orange-400">{currentMember.memberCode}</strong> • Enrolled since {currentMember.joinedDate}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenRenew}
            className="px-4 py-2.5 bg-orange-400 hover:bg-orange-300 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-orange-400/20 flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Renew Membership</span>
          </button>
          <button
            onClick={logout}
            className="px-3.5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-semibold rounded-xl transition flex items-center gap-1.5 border border-zinc-700"
            title="Sign out of Member Portal"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Expiry Warning Banner (if expiring soon or expired) */}
      {(isExpiringSoon || isExpired) && (
        <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
          isExpired
            ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
            : 'bg-orange-950/40 border-orange-500/40 text-orange-200'
        }`}>
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-400 shrink-0" />
            <div className="text-xs">
              <p className="font-bold">
                {isExpired ? 'Your Membership Has Expired' : `Membership Expiring in ${daysRemaining} Days`}
              </p>
              <p className="text-zinc-300">
                Plan validity ended on <strong className="text-white">{currentMember.expiryDate}</strong>. Renew today to maintain uninterrupted access to BSF facilities and trainers.
              </p>
            </div>
          </div>
          <button
            onClick={handleOpenRenew}
            className="px-4 py-1.5 bg-orange-400 text-black font-bold text-xs rounded-xl hover:bg-orange-300 transition whitespace-nowrap shadow"
          >
            Renew Now
          </button>
        </div>
      )}

      {/* Outstanding Dues Alert */}
      {currentMember.pendingAmount > 0 && (
        <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 text-rose-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-rose-400 shrink-0" />
            <div className="text-xs">
              <p className="font-bold text-rose-300">Outstanding Balance Pending: ₹{currentMember.pendingAmount.toLocaleString('en-IN')}</p>
              <p className="text-zinc-300">Please settle your remaining fee at the front desk or via UPI to keep your membership active.</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold bg-rose-900/60 px-3 py-1.5 rounded-lg border border-rose-700">
            Due: ₹{currentMember.pendingAmount.toLocaleString('en-IN')}
          </span>
        </div>
      )}

      {/* Main Grid: Digital ID Card + Membership Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Digital BSF Membership Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-orange-400" /> Digital Access Pass
          </h2>

          {/* Realistic High-End Membership Card */}
          <div className="relative aspect-[1.586/1] w-full rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-6 border border-zinc-700/80 shadow-2xl shadow-black/80 flex flex-col justify-between overflow-hidden group">
            {/* Subtle holographic foil shine */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(251,191,36,0.15),transparent_70%)] pointer-events-none" />
            
            {/* Top Row of Card */}
            <div className="flex items-start justify-between relative z-10">
              <BSFLogo size="sm" />
              <div className="text-right">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-orange-400 text-black">
                  VIP PASS
                </span>
                <p className="text-[9px] text-zinc-400 font-mono mt-1">BSF MYSURU</p>
              </div>
            </div>

            {/* Middle: Member Photo + Info */}
            <div className="flex items-center gap-3.5 relative z-10 my-2">
              <img
                src={currentMember.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                alt={currentMember.fullName}
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-xl object-cover border border-orange-400/60 shadow"
              />
              <div className="leading-tight">
                <p className="text-base font-extrabold text-white font-display tracking-wide">{currentMember.fullName}</p>
                <p className="text-xs font-mono text-orange-400">{currentMember.memberCode}</p>
                <p className="text-[10px] text-zinc-400">{currentMember.packageName}</p>
              </div>
            </div>

            {/* Bottom: Dates & Barcode */}
            <div className="flex items-end justify-between relative z-10 pt-2 border-t border-zinc-800">
              <div>
                <p className="text-[8px] uppercase tracking-wider text-zinc-500">Valid Until</p>
                <p className="text-xs font-mono font-bold text-white">{currentMember.expiryDate}</p>
              </div>

              {/* Monogram QR Badge */}
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-white rounded-lg shadow">
                  <QrCode className="w-6 h-6 text-black" />
                </div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-zinc-400 text-center font-sans-body">
            Present this card or QR code at the BSF reception entrance.
          </p>
        </div>

        {/* Membership Details & Coach (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-orange-400" /> Plan Status & Coach
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Days Remaining Card */}
            <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-400">Validity Countdown</span>
                <Calendar className="w-4 h-4 text-orange-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-display font-black text-4xl text-white">
                  {Math.max(0, daysRemaining)}
                </span>
                <span className="text-xs font-bold text-orange-400">DAYS REMAINING</span>
              </div>
              <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-800">
                <div
                  className="bg-orange-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(5, (daysRemaining / 365) * 100))}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
                <span>Start: {currentMember.startDate}</span>
                <span>End: {currentMember.expiryDate}</span>
              </div>
            </div>

            {/* Assigned Trainer / PT Card */}
            <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-400">
                    {currentMember.hasPersonalTraining || currentMember.personalTraining?.enrolled
                      ? '1-on-1 Personal Trainer (PT)'
                      : 'General Floor Trainer'}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    currentMember.hasPersonalTraining || currentMember.personalTraining?.enrolled
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {currentMember.hasPersonalTraining || currentMember.personalTraining?.enrolled
                      ? 'PT ENROLLED'
                      : 'FLOOR ACCESS'}
                  </span>
                </div>
                <div className="mt-2.5 flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-zinc-800 border border-zinc-700 overflow-hidden shrink-0">
                    <img
                      src={assignedTrainer?.photoUrl || 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=200&q=80'}
                      alt={assignedTrainer?.name || 'Coach'}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white leading-tight truncate">
                      Coach {assignedTrainer?.name || 'Vikram Shetty'}
                    </p>
                    <p className="text-[11px] text-orange-400 truncate">
                      {currentMember.personalTraining?.planName || assignedTrainer?.specialization || 'Strength & Conditioning'}
                    </p>
                  </div>
                </div>

                {/* PT Sessions Progress Bar if enrolled */}
                {(currentMember.hasPersonalTraining || currentMember.personalTraining?.enrolled) && (
                  <div className="mt-3 space-y-1 bg-black/40 p-2.5 rounded-xl border border-zinc-800/80">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-zinc-400">PT Sessions:</span>
                      <span className="font-mono font-bold text-orange-400">
                        {currentMember.personalTraining?.completedSessions || 16} / {currentMember.personalTraining?.totalSessions || 24} Done
                      </span>
                    </div>
                    <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden border border-zinc-800">
                      <div
                        className="bg-orange-400 h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.round(
                              ((currentMember.personalTraining?.completedSessions || 16) /
                                (currentMember.personalTraining?.totalSessions || 24)) *
                                100
                            )
                          )}%`
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {assignedTrainer ? (
                <a
                  href={`https://wa.me/91${assignedTrainer.phone}?text=Hi%20Coach%20${encodeURIComponent(assignedTrainer.name)},%20this%20is%20${encodeURIComponent(currentMember.fullName)}%20from%20BSF.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 mt-2"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>WhatsApp Coach ({assignedTrainer.phone})</span>
                </a>
              ) : (
                <button
                  onClick={() => alert('Please contact the front desk or call +91 98803 97294 to book a 1-on-1 Personal Trainer!')}
                  className="w-full py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 mt-2"
                >
                  <Dumbbell className="w-3.5 h-3.5" />
                  <span>Upgrade to 1-on-1 PT</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Tools Jump Cards */}
          <div className="grid grid-cols-2 gap-4">
            {onGoToCalculators && (
              <button
                onClick={onGoToCalculators}
                className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-orange-400/40 text-left transition group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white group-hover:text-orange-400">BMI / BMR Calculators</span>
                  <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-orange-400 group-hover:translate-x-1 transition" />
                </div>
                <p className="text-[11px] text-zinc-400">Check body composition & calorie targets</p>
              </button>
            )}

            {onGoToExercises && (
              <button
                onClick={onGoToExercises}
                className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-orange-400/40 text-left transition group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white group-hover:text-orange-400">Exercises</span>
                  <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-orange-400 group-hover:translate-x-1 transition" />
                </div>
                <p className="text-[11px] text-zinc-400">1,000 guided workout movement guides</p>
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Payment Receipts History Table */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-white font-display tracking-wide">
              PAYMENT & RECEIPT HISTORY
            </h2>
            <p className="text-xs text-zinc-400 font-sans-body">
              Official transaction receipts, GST invoices, and WhatsApp delivery logs.
            </p>
          </div>
        </div>

        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
          {memberPayments.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-500">
              No recorded payment receipts found for this profile.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-950/80 text-zinc-400 uppercase text-[10px] font-bold tracking-wider">
                    <th className="py-3 px-5">Receipt #</th>
                    <th className="py-3 px-5">Date</th>
                    <th className="py-3 px-5">Package / Plan</th>
                    <th className="py-3 px-5">Amount Paid</th>
                    <th className="py-3 px-5">Mode</th>
                    <th className="py-3 px-5">Status</th>
                    <th className="py-3 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-sans-body">
                  {memberPayments.map(pay => (
                    <tr key={pay.id} className="hover:bg-zinc-800/30 transition">
                      <td className="py-4 px-5 font-mono font-bold text-orange-400">
                        {pay.receiptNo}
                      </td>
                      <td className="py-4 px-5 text-zinc-300">
                        {pay.paymentDate}
                      </td>
                      <td className="py-4 px-5 font-medium text-white">
                        {pay.packageName}
                      </td>
                      <td className="py-4 px-5 font-mono font-bold text-emerald-400">
                        ₹{pay.amountPaid.toLocaleString('en-IN')}
                      </td>
                      <td className="py-4 px-5 text-zinc-300">
                        {pay.paymentMethod}
                      </td>
                      <td className="py-4 px-5">
                        <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          pay.status === 'PAID'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-orange-500/10 text-orange-400 border border-orange-500/30'
                        }`}>
                          {pay.status}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <button
                          onClick={() => setSelectedReceipt(pay)}
                          className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-semibold transition inline-flex items-center gap-1.5 border border-zinc-700"
                        >
                          <Receipt className="w-3.5 h-3.5 text-orange-400" />
                          <span>View Receipt</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* DPDP Act (India) 2023 - Member Data Rights & Privacy Controls */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-400/10 border border-orange-400/20 flex items-center justify-center text-orange-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-display">YOUR DATA PRIVACY & STATUTORY RIGHTS</h2>
              <p className="text-xs text-zinc-400">DPDP Act (India) 2023 Compliance & Data Principal Self-Service Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              Active Consent Recorded
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-xs">
              <FileText className="w-4 h-4 text-orange-400" />
              <span>Right to Access & Portability</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Download all digital personal data, fitness notes, and billing records stored by Black Stone Fitness in machine-readable JSON format.
            </p>
            <button
              onClick={handleExportMyData}
              className="w-full py-2.5 px-3 bg-zinc-900 hover:bg-zinc-800 text-orange-400 border border-orange-400/30 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export My Data (JSON)</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-xs">
              <UserX className="w-4 h-4 text-rose-400" />
              <span>Right to Correction / Erasure</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Request correction of inaccuracies, withdrawal of consent, or permanent deletion of your profile upon membership termination.
            </p>
            <button
              onClick={() => setIsDSRModalOpen(true)}
              className="w-full py-2.5 px-3 bg-zinc-900 hover:bg-zinc-800 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Submit Data Subject Request</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-xs">
              <Lock className="w-4 h-4 text-sky-400" />
              <span>Privacy Notice & DPO Grievance</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Review our statutory data protection policy, processing purposes, 7-year retention policy, or contact our appointed Grievance Officer.
            </p>
            <button
              onClick={() => setIsPrivacyModalOpen(true)}
              className="w-full py-2.5 px-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Privacy Notice & DPO</span>
            </button>
          </div>
        </div>
      </div>

      {/* Renewal Dialog Modal */}
      {isRenewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-3xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-400" />
                <h3 className="text-lg font-black text-white font-display">RENEW MEMBERSHIP PLAN</h3>
              </div>
              <button
                onClick={() => setIsRenewModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleExecuteRenew} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-zinc-400 uppercase mb-1">Select Membership Package</label>
                <select
                  value={renewPackageId}
                  onChange={e => {
                    const id = e.target.value;
                    setRenewPackageId(id);
                    const selected = packages.find(p => p.id === id);
                    if (selected) setRenewAmount(selected.price);
                  }}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-400 focus:outline-none"
                >
                  {packages.map(pkg => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} ({pkg.durationMonths} Mo) — ₹{pkg.price.toLocaleString('en-IN')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-zinc-400 uppercase mb-1">Payment Amount (INR)</label>
                <input
                  type="number"
                  value={renewAmount}
                  onChange={e => setRenewAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono focus:border-orange-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-400 uppercase mb-1">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['UPI', 'Card', 'Cash'] as const).map(mode => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setRenewPaymentMethod(mode)}
                      className={`py-2 rounded-xl border text-center font-bold transition ${
                        renewPaymentMethod === mode
                          ? 'bg-orange-400 text-black border-orange-400'
                          : 'bg-zinc-950 text-zinc-400 border-zinc-800'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-[11px] text-zinc-400 space-y-1">
                <p>✓ Instant membership validity extension from current expiry date.</p>
                <p>✓ Official WhatsApp Receipt dispatched immediately upon confirmation.</p>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-orange-400 hover:bg-orange-300 text-black font-extrabold rounded-xl transition uppercase tracking-wider"
              >
                Confirm Renewal & Generate Receipt
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      <ReceiptModal
        payment={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />

      {/* Data Subject Request Modal */}
      <DataRightsModal
        isOpen={isDSRModalOpen}
        onClose={() => setIsDSRModalOpen(false)}
        initialName={currentMember.fullName}
        initialContact={currentMember.phone}
      />

      {/* Privacy Notice Modal */}
      <PrivacyNoticeModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      {/* Live Selfie Camera Modal */}
      <LiveCameraModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onCapture={handleSelfieCapture}
        title="Update Profile Photo"
        subtitle="Smile! Position your face in the frame and capture your new photo"
        currentPhotoUrl={currentMember.photoUrl}
        memberName={currentMember.fullName}
      />

      {/* Hidden file input for direct photo upload */}
      <input
        ref={memberPhotoFileInputRef}
        type="file"
        accept="image/*"
        onChange={handleMemberPhotoUpload}
        className="hidden"
      />

    </div>
  );
};
