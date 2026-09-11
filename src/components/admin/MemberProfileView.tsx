import React, { useState, useEffect } from 'react';
import { useGym } from '../../context/GymContext';
import { Member, MembershipPackage, PaymentRecord } from '../../types';
import { ProfileTab, ProfileModalState } from './member-profile/types';
import { MembershipActionsCard } from './member-profile/MembershipActionsCard';
import { SubscriptionsTab } from './member-profile/SubscriptionsTab';
import { AttendanceTab } from './member-profile/AttendanceTab';
import { PaymentsTab } from './member-profile/PaymentsTab';
import { WorkoutTab } from './member-profile/WorkoutTab';
import { MedicalTab } from './member-profile/MedicalTab';
import { CommunicationTab } from './member-profile/CommunicationTab';
import { AutomationStatusCard } from './member-profile/AutomationStatusCard';
import { FollowUpTab } from './member-profile/FollowUpTab';
import { LiveCameraModal } from '../common/LiveCameraModal';
import { MemberPhotoPicker } from '../common/MemberPhotoPicker';
import { ReceiptModal } from '../common/ReceiptModal';
import {
  ArrowLeft,
  Camera,
  Edit2,
  CheckCircle2,
  Bell,
  MessageSquare,
  Trophy,
  PhoneCall,
  UserCheck,
  UserX,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  Shield,
  HeartPulse,
  CreditCard,
  Smartphone,
  AlertCircle,
  Clock,
  Sparkles,
  Zap,
  Info,
  Layers,
  Dumbbell,
  FileText,
  X,
  Plus,
  Trash2,
  Check
} from 'lucide-react';

interface MemberProfileViewProps {
  memberId: string;
  onBack: () => void;
  onSelectMember?: (id: string) => void;
}

export const MemberProfileView: React.FC<MemberProfileViewProps> = ({
  memberId,
  onBack,
  onSelectMember
}) => {
  const {
    members,
    packages,
    trainers,
    updateMember,
    recordPayment,
    addNotification
  } = useGym();

  // Find member dynamically
  const member = members.find((m) => m.id === memberId || m.memberCode === memberId);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<ProfileTab>('information');

  // Modal dialog state
  const [modalState, setModalState] = useState<ProfileModalState>({ type: null, data: null });

  // Photo change state
  const [isPhotoPickerOpen, setIsPhotoPickerOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  // Top action feedback message
  const [actionNotice, setActionNotice] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  // Form states for modals
  const [freezeDays, setFreezeDays] = useState(30);
  const [freezeReason, setFreezeReason] = useState('Medical rest / Traveling');
  const [extendDays, setExtendDays] = useState(30);
  const [upgradePkgId, setUpgradePkgId] = useState(packages[0]?.id || '');
  const [transferName, setTransferName] = useState('');
  const [transferPhone, setTransferPhone] = useState('');
  const [assignedTrainerId, setAssignedTrainerId] = useState(trainers[0]?.id || '');
  const [ptSessions, setPtSessions] = useState(24);
  const [ptPlanName, setPtPlanName] = useState('1-on-1 Personal Training (24 Sessions)');
  const [ptFee, setPtFee] = useState(7999);
  const [freeTrialPhone, setFreeTrialPhone] = useState('');
  const [freeTrialName, setFreeTrialName] = useState('');
  const [notifTitle, setNotifTitle] = useState('Workout Reminder');
  const [notifMsg, setNotifMsg] = useState('Your trainer Vikram has updated your strength split routine for this week!');

  // Payment Form State
  const [payAmount, setPayAmount] = useState(5000);
  const [payMethod, setPayMethod] = useState<PaymentRecord['paymentMethod']>('UPI');
  const [payNotes, setPayNotes] = useState('Balance installment');

  // Follow up state
  const [fuStaff, setFuStaff] = useState('Staff CRM');
  const [fuNote, setFuNote] = useState('');
  const [fuOutcome, setFuOutcome] = useState<'Interested' | 'Renewal Promised' | 'No Answer' | 'Fee Dispute' | 'Feedback Shared' | 'General'>('Interested');
  const [fuNextDate, setFuNextDate] = useState('2026-09-20');

  // Medical form state
  const [medInjuries, setMedInjuries] = useState('');
  const [medAllergies, setMedAllergies] = useState('');
  const [medRestrictions, setMedRestrictions] = useState('');
  const [medNotes, setMedNotes] = useState('');
  const [medDoctor, setMedDoctor] = useState('');
  const [medDoctorPhone, setMedDoctorPhone] = useState('');

  // Selected receipt for PDF preview
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentRecord | null>(null);

  // Edit Member basic fields
  const [editFullName, setEditFullName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editDob, setEditDob] = useState('');
  const [editGender, setEditGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [editEmergency, setEditEmergency] = useState('');
  const [editBloodGroup, setEditBloodGroup] = useState('O+');
  const [editClientRep, setEditClientRep] = useState('Front Desk CRM');

  // Sync edit form when opening edit modal
  useEffect(() => {
    if (member && modalState.type === 'edit_member') {
      setEditFullName(member.fullName);
      setEditPhone(member.phone);
      setEditEmail(member.email || '');
      setEditAddress(member.address || 'Mysuru, Karnataka');
      setEditDob(member.dob || '1998-05-15');
      setEditGender(member.gender || 'Male');
      setEditEmergency(member.emergencyContact || '');
      setEditBloodGroup(member.bloodGroup || 'O+');
      setEditClientRep(member.clientRepresentative || 'Front Desk Staff');
    }
  }, [modalState.type, member]);

  if (!member) {
    return (
      <div className="p-8 text-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Member Not Found</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          The requested member with ID "{memberId}" could not be located in the database.
        </p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-xl text-xs font-bold hover:bg-orange-600 transition"
        >
          Return to Members Directory
        </button>
      </div>
    );
  }

  const hasDues = (member.pendingAmount || 0) > 0;
  const isExpiring = member.status === 'expiring_soon';
  const isExpired = member.status === 'expired';
  const isFrozen = member.isFrozen || member.status === 'expired';
  const appInstalled = member.appInstalled !== false;

  // Helper notification dispatcher
  const showNotice = (text: string, type: 'success' | 'info' = 'success') => {
    setActionNotice({ text, type });
    setTimeout(() => setActionNotice(null), 4000);
  };

  // Instant Check-In from Top Action Bar
  const handleTopCheckIn = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    const dateStr = now.toISOString().split('T')[0];

    const newRecord = {
      id: `att-${Date.now()}`,
      date: dateStr,
      checkInTime: timeStr,
      checkOutTime: 'In Gym',
      method: 'Front Desk' as const,
      status: 'Present' as const,
      gate: 'Front Desk VIP Entry'
    };

    const currentHistory = member.attendanceHistory || [];
    updateMember(member.id, { attendanceHistory: [newRecord, ...currentHistory] });
    showNotice(`Check-In recorded for ${member.fullName} at ${timeStr}`);
  };

  // Confirmation Action Handlers
  const handleConfirmFreeze = () => {
    const unfreeze = member.isFrozen;
    updateMember(member.id, {
      isFrozen: !unfreeze,
      status: !unfreeze ? 'expired' : 'active',
      frozenUntil: !unfreeze ? `Frozen for ${freezeDays} days (${freezeReason})` : undefined
    });
    setModalState({ type: null });
    showNotice(unfreeze ? `Membership un-frozen for ${member.fullName}` : `Membership frozen for ${freezeDays} days`);
  };

  const handleConfirmExtend = () => {
    // Add extension days to expiry date
    const expDate = new Date(member.expiryDate);
    expDate.setDate(expDate.getDate() + Number(extendDays));
    const newExpiry = expDate.toISOString().split('T')[0];

    updateMember(member.id, {
      expiryDate: newExpiry,
      status: 'active'
    });
    setModalState({ type: null });
    showNotice(`Membership successfully extended by ${extendDays} days till ${newExpiry}`);
  };

  const handleConfirmUpgrade = () => {
    const selectedPkg = packages.find((p) => p.id === upgradePkgId);
    if (!selectedPkg) return;

    const priceDiff = Math.max(0, selectedPkg.price - (member.paidAmount || 0));
    updateMember(member.id, {
      packageId: selectedPkg.id,
      packageName: selectedPkg.name,
      totalAmount: selectedPkg.price,
      pendingAmount: priceDiff,
      status: priceDiff > 0 ? 'payment_due' : 'active'
    });
    setModalState({ type: null });
    showNotice(`Upgraded ${member.fullName} to ${selectedPkg.name}!`);
  };

  const handleConfirmTransfer = () => {
    if (!transferName) {
      alert('Please enter recipient full name');
      return;
    }
    updateMember(member.id, {
      notes: `Transferred remaining tenure to ${transferName} (${transferPhone}) on ${new Date().toISOString().split('T')[0]}`,
      status: 'expired'
    });
    setModalState({ type: null });
    showNotice(`Membership transferred to ${transferName}`);
  };

  const handleConfirmAssignPT = () => {
    const trainer = trainers.find((t) => t.id === assignedTrainerId);
    const trainerName = trainer?.name || 'Vikram Shetty';
    updateMember(member.id, {
      assignedTrainerId: trainer?.id || 'tr-1',
      assignedTrainerName: trainerName,
      hasPersonalTraining: true,
      personalTraining: {
        enrolled: true,
        trainerId: trainer?.id || 'tr-1',
        trainerName: trainerName,
        trainerPhone: trainer?.phone || '+91 98803 97294',
        trainerSpecialization: trainer?.specialization?.join(', ') || 'Strength & Conditioning Specialist',
        trainerPhotoUrl: trainer?.photoUrl,
        planName: ptPlanName || `${ptSessions} Sessions 1-on-1 Personal Training`,
        totalSessions: Number(ptSessions) || 24,
        completedSessions: 0,
        startDate: new Date().toISOString().split('T')[0],
        endDate: member.expiryDate,
        price: Number(ptFee) || 7999,
        paidAmount: Number(ptFee) || 7999,
        pendingAmount: 0,
        status: 'Active',
        sessionHistory: []
      },
      notes: `${ptSessions} PT sessions enrolled with Coach ${trainerName}`
    });
    setModalState({ type: null });
    showNotice(`Assigned Personal Training with Coach ${trainerName} (${ptSessions} sessions)`);
  };

  const handleConfirmAddPayment = () => {
    if (payAmount <= 0) return;
    const newPaid = (member.paidAmount || 0) + Number(payAmount);
    const newPending = Math.max(0, (member.totalAmount || 15999) - newPaid);

    recordPayment({
      memberId: member.id,
      memberName: member.fullName,
      memberPhone: member.phone,
      packageId: member.packageId,
      packageName: member.packageName,
      amountPaid: Number(payAmount),
      totalPackageAmount: member.totalAmount || 15999,
      pendingAmount: newPending,
      discount: 0,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: payMethod,
      status: newPending === 0 ? 'PAID' : 'PARTIALLY PAID',
      whatsappStatus: 'Sent',
      expiryDate: member.expiryDate,
      notes: payNotes
    });

    updateMember(member.id, {
      paidAmount: newPaid,
      pendingAmount: newPending,
      status: newPending === 0 ? 'active' : 'payment_due'
    });

    setModalState({ type: null });
    showNotice(`Recorded payment of ₹${Number(payAmount).toLocaleString('en-IN')}!`);
  };

  const handleSaveEditMember = (e: React.FormEvent) => {
    e.preventDefault();
    updateMember(member.id, {
      fullName: editFullName,
      phone: editPhone,
      whatsapp: editPhone,
      email: editEmail,
      address: editAddress,
      dob: editDob,
      gender: editGender,
      emergencyContact: editEmergency,
      bloodGroup: editBloodGroup,
      clientRepresentative: editClientRep
    });
    setModalState({ type: null });
    showNotice(`Member profile updated successfully`);
  };

  const handleSaveMedical = (e: React.FormEvent) => {
    e.preventDefault();
    updateMember(member.id, {
      medicalHistory: {
        injuries: medInjuries || member.medicalHistory?.injuries,
        allergies: medAllergies || member.medicalHistory?.allergies,
        restrictions: medRestrictions || member.medicalHistory?.restrictions,
        notes: medNotes || member.medicalHistory?.notes,
        emergencyDoctor: medDoctor || member.medicalHistory?.emergencyDoctor,
        doctorPhone: medDoctorPhone || member.medicalHistory?.doctorPhone,
        updatedAt: new Date().toISOString()
      },
      bloodGroup: editBloodGroup || member.bloodGroup
    });
    setModalState({ type: null });
    showNotice(`Medical history and restrictions updated`);
  };

  const handleAddFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fuNote) return;

    const newLog = {
      id: `fu-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      staffName: fuStaff,
      note: fuNote,
      outcome: fuOutcome,
      nextFollowUpDate: fuNextDate
    };

    const currentLogs = member.followUps || [];
    updateMember(member.id, { followUps: [newLog, ...currentLogs] });
    setModalState({ type: null });
    setFuNote('');
    showNotice(`Follow-up note logged for ${member.fullName}`);
  };

  const handleSendInAppNotification = () => {
    addNotification(notifTitle, `${member.fullName}: ${notifMsg}`, 'system', 'members');
    setModalState({ type: null });
    showNotice(`Notification dispatched to member app & dashboard`);
  };

  return (
    <div className="space-y-5 pb-16 font-sans">
      {/* 1. Top Breadcrumb & Quick Switch Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Members List</span>
          </button>

          <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-700 hidden sm:block" />

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-zinc-900 dark:text-white text-base">
                {member.fullName}
              </h2>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
                {member.memberCode}
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Member Profile & Interactive CRM Dashboard
            </p>
          </div>
        </div>

        {/* Member Selector Switcher */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-zinc-400 hidden md:inline">Jump Member:</label>
          <select
            value={member.id}
            onChange={(e) => {
              if (onSelectMember) onSelectMember(e.target.value);
            }}
            className="text-xs bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-2.5 py-1.5 text-zinc-800 dark:text-zinc-200 font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.fullName} ({m.memberCode})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Action Notice Alert */}
      {actionNotice && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-xs text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-between shadow-sm animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>{actionNotice.text}</span>
          </div>
          <button onClick={() => setActionNotice(null)}>
            <X className="w-3.5 h-3.5 text-emerald-600" />
          </button>
        </div>
      )}

      {/* 2. Top Action Bar */}
      <div className="bg-white dark:bg-zinc-900 p-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setModalState({ type: 'edit_member' })}
          className="px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-bold transition flex items-center gap-2 shadow-sm"
        >
          <Edit2 className="w-3.5 h-3.5 text-orange-500" />
          <span>Edit Member</span>
        </button>

        <button
          onClick={handleTopCheckIn}
          className="px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition flex items-center gap-2 shadow-sm"
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Check-In</span>
        </button>

        <button
          onClick={() => setModalState({ type: 'send_notification' })}
          className="px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-bold transition flex items-center gap-2 shadow-sm"
        >
          <Bell className="w-3.5 h-3.5 text-sky-500" />
          <span>Send Notification</span>
        </button>

        <button
          onClick={() => setModalState({ type: 'view_challenges' })}
          className="px-3.5 py-2 rounded-xl border border-amber-200 dark:border-amber-800/60 bg-amber-50/60 hover:bg-amber-100/70 dark:bg-amber-950/20 dark:hover:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-bold transition flex items-center gap-2 shadow-sm"
        >
          <Trophy className="w-3.5 h-3.5 text-amber-500" />
          <span>View Participated Challenges</span>
        </button>

        <button
          onClick={() => setActiveTab('followup')}
          className="px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-bold transition flex items-center gap-2 shadow-sm ml-auto"
        >
          <PhoneCall className="w-3.5 h-3.5 text-indigo-500" />
          <span>See Follow-up History</span>
        </button>
      </div>

      {/* 3. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* LEFT SIDEBAR – MEMBER INFORMATION (4 cols on lg) */}
        <aside className="lg:col-span-4 space-y-4">
          
          {/* Member Card Box */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
            
            {/* Top Photo & Add/Change Button */}
            <div className="flex flex-col items-center text-center pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div className="relative group">
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-orange-500 shadow-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                  {member.photoUrl ? (
                    <img
                      src={member.photoUrl}
                      alt={member.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-black text-orange-500 font-display">
                      {member.fullName
                        .split(' ')
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((w) => w[0])
                        .join('')
                        .toUpperCase()}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setIsCameraOpen(true)}
                  className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-lg transition"
                  title="Open Live Webcam"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="mt-3">
                <button
                  onClick={() => setIsPhotoPickerOpen(true)}
                  className="px-3 py-1 rounded-lg text-xs font-bold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition"
                >
                  Add / Change Photo
                </button>
              </div>

              <h3 className="font-extrabold text-lg text-zinc-900 dark:text-white mt-2 font-display">
                {member.fullName}
              </h3>
              <p className="text-xs font-mono text-orange-500 font-bold">{member.memberCode}</p>
            </div>

            {/* Important Status Badges */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Account Status</p>
              <div className="flex flex-wrap gap-1.5">
                {/* Active / Expired / Frozen Badge */}
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                    member.isFrozen
                      ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                      : member.status === 'active' || member.status === 'fully_paid'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : member.status === 'expiring_soon'
                      ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                      : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    member.isFrozen ? 'bg-sky-500' : member.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'
                  }`} />
                  {member.isFrozen ? 'Frozen' : member.status.replace('_', ' ')}
                </span>

                {/* App Installed Badge */}
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                    appInstalled
                      ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700'
                      : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                  }`}
                >
                  <Smartphone className="w-3 h-3 text-sky-500" />
                  <span>{appInstalled ? 'App Installed' : 'App Not Installed'}</span>
                </span>

                {/* Payment Dues Badge */}
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                    hasDues
                      ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                      : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  }`}
                >
                  <CreditCard className="w-3 h-3 text-rose-500" />
                  <span>{hasDues ? `Due: ₹${member.pendingAmount.toLocaleString('en-IN')}` : 'Fully Settled'}</span>
                </span>
              </div>
            </div>

            {/* Member Details Breakdown List */}
            <div className="space-y-2.5 text-xs pt-2 border-t border-zinc-100 dark:border-zinc-800 font-medium">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Mobile:</span>
                </span>
                <a href={`tel:${member.phone}`} className="font-mono font-bold text-zinc-900 dark:text-white hover:text-orange-500">
                  {member.phone}
                </a>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Email:</span>
                </span>
                <span className="font-mono text-zinc-800 dark:text-zinc-200 truncate max-w-[160px]" title={member.email}>
                  {member.email || 'Not provided'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Location:</span>
                </span>
                <span className="text-zinc-800 dark:text-zinc-200 text-right truncate max-w-[160px]">
                  {member.address || 'Mysuru, Karnataka'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Date of Birth:</span>
                </span>
                <span className="font-mono text-zinc-800 dark:text-zinc-200">{member.dob || '1998-05-15'}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Gender:</span>
                </span>
                <span className="text-zinc-800 dark:text-zinc-200 font-semibold">{member.gender}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Date of Enquiry:</span>
                </span>
                <span className="font-mono text-zinc-800 dark:text-zinc-200">{member.enquiryDate || '2026-07-28'}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Joining Date:</span>
                </span>
                <span className="font-mono font-bold text-zinc-900 dark:text-white">{member.joinedDate || member.startDate}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Staff / Rep:</span>
                </span>
                <span className="text-zinc-800 dark:text-zinc-200 font-semibold">{member.clientRepresentative || 'Front Desk Staff'}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Emergency No:</span>
                </span>
                <span className="font-mono text-rose-600 dark:text-rose-400 font-bold">{member.emergencyContact || '+91 98450 99881'}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                  <Dumbbell className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Assigned Trainer:</span>
                </span>
                <span className="font-bold text-orange-600 dark:text-orange-400">{member.assignedTrainerName || 'Vikram Shetty'}</span>
              </div>
            </div>
          </div>

          {/* Sidebar Navigation Tabs */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-3 shadow-sm space-y-1">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider px-3 py-1">
              Member CRM Tabs
            </p>

            {[
              { id: 'information' as ProfileTab, label: 'Information (Overview)', icon: Info },
              { id: 'subscriptions' as ProfileTab, label: 'Subscriptions', icon: CreditCard },
              { id: 'attendance' as ProfileTab, label: 'Attendance', icon: Calendar },
              { id: 'workout' as ProfileTab, label: 'Workout', icon: Dumbbell },
              { id: 'followup' as ProfileTab, label: 'Follow-up History', icon: PhoneCall },
              { id: 'medical' as ProfileTab, label: 'Medical History', icon: HeartPulse },
              { id: 'payments' as ProfileTab, label: 'Payments & Receipts', icon: FileText },
              { id: 'communication' as ProfileTab, label: 'Communication History', icon: MessageSquare },
              { id: 'automations' as ProfileTab, label: 'Automatic Message Status', icon: Zap }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                    <span>{tab.label}</span>
                  </div>
                </button>
              );
            })}
          </div>

        </aside>

        {/* RIGHT MAIN WORKSPACE AREA (8 cols on lg) */}
        <main className="lg:col-span-8 space-y-5">
          
          {/* TAB 1: INFORMATION OVERVIEW */}
          {activeTab === 'information' && (
            <div className="space-y-5">
              {/* Dual Status Cards: 1. Membership Plan & 2. Personal Training */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 1. Active Membership Plan Card */}
                <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 rounded-2xl p-5 text-white shadow-md flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase font-mono tracking-wider bg-black/20 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                        Gym Membership Plan
                      </span>
                      <span className="text-xs font-mono font-bold">
                        {member.isFrozen ? 'FROZEN' : (member.status === 'expired' ? 'EXPIRED' : 'ACTIVE')}
                      </span>
                    </div>

                    <h3 className="text-xl font-black mt-2 font-display">{member.packageName}</h3>
                    <p className="text-xs text-white/90 mt-1">
                      Floor & Turf Access: <strong className="font-mono">{member.startDate}</strong> to <strong className="font-mono">{member.expiryDate}</strong>
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/20">
                    <div>
                      <span className="text-[10px] text-white/80 uppercase block">Last Fees Paid</span>
                      <p className="text-base font-black font-mono">₹{(member.lastFeesPaid !== undefined ? member.lastFeesPaid : member.paidAmount).toLocaleString('en-IN')}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-white/80 uppercase block">Dues</span>
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                        hasDues ? 'bg-rose-900/80 text-rose-100' : 'bg-black/20 text-white'
                      }`}>
                        {hasDues ? `₹${member.pendingAmount.toLocaleString('en-IN')} Due` : 'Fully Paid'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Personal Training (PT) Status Card */}
                {Boolean(
                  member.hasPersonalTraining ||
                  member.personalTraining?.enrolled ||
                  (member.assignedTrainerName && member.assignedTrainerName !== 'Floor Coach' && member.assignedTrainerName !== 'Unassigned')
                ) ? (
                  <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-zinc-900 border border-indigo-800/60 rounded-2xl p-5 text-white shadow-md flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase font-mono tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded-full">
                          1-on-1 Personal Training (PT)
                        </span>
                        <span className="text-xs font-mono font-bold text-emerald-400">
                          {member.personalTraining?.status || 'Active'}
                        </span>
                      </div>

                      <h3 className="text-xl font-black mt-2 font-display text-white">
                        Coach {member.personalTraining?.trainerName || member.assignedTrainerName || 'Vikram Shetty'}
                      </h3>
                      <p className="text-xs text-indigo-200 mt-1">
                        {member.personalTraining?.planName || 'Transformation Coaching Package'}
                      </p>
                    </div>

                    <div className="space-y-1.5 bg-black/30 p-2.5 rounded-xl border border-indigo-700/30">
                      <div className="flex justify-between text-xs">
                        <span className="text-indigo-200">Session Progress:</span>
                        <span className="font-mono font-bold text-white">
                          {member.personalTraining?.completedSessions || 16} / {member.personalTraining?.totalSessions || 24} Sessions
                        </span>
                      </div>
                      <div className="w-full bg-indigo-950 h-2 rounded-full overflow-hidden border border-indigo-800/40">
                        <div
                          className="bg-orange-400 h-full rounded-full transition-all duration-500"
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
                    </div>
                  </div>
                ) : (
                  <div className="bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-2xl p-5 flex flex-col justify-between space-y-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase font-mono tracking-wider text-zinc-500 dark:text-zinc-400 bg-zinc-200 dark:bg-zinc-700 px-2.5 py-0.5 rounded-full">
                        Personal Training Status
                      </span>
                      <h4 className="text-base font-bold text-zinc-900 dark:text-white mt-2">
                        No Personal Training Taken
                      </h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                        Member currently has general gym floor access without a dedicated 1-on-1 personal trainer.
                      </p>
                    </div>

                    <button
                      onClick={() => setModalState({ type: 'assign_pt' })}
                      className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5"
                    >
                      <Dumbbell className="w-3.5 h-3.5" />
                      <span>Assign Personal Trainer</span>
                    </button>
                  </div>
                )}

              </div>

              {/* 4. Membership Actions Card */}
              <MembershipActionsCard
                member={member}
                onOpenModal={(type, data) => setModalState({ type, data })}
              />

              {/* 5. Active Subscriptions Table */}
              <SubscriptionsTab
                member={member}
                onOpenModal={(type, data) => setModalState({ type, data })}
              />

              {/* 6. Automatic Message Status */}
              <AutomationStatusCard member={member} />
            </div>
          )}

          {/* TAB 2: SUBSCRIPTIONS */}
          {activeTab === 'subscriptions' && (
            <div className="space-y-5">
              <SubscriptionsTab
                member={member}
                onOpenModal={(type, data) => setModalState({ type, data })}
              />
              <MembershipActionsCard
                member={member}
                onOpenModal={(type, data) => setModalState({ type, data })}
              />
            </div>
          )}

          {/* TAB 3: ATTENDANCE */}
          {activeTab === 'attendance' && (
            <div className="space-y-5">
              <AttendanceTab member={member} />
            </div>
          )}

          {/* TAB 4: WORKOUT */}
          {activeTab === 'workout' && (
            <WorkoutTab
              member={member}
              onOpenModal={(type, data) => setModalState({ type, data })}
            />
          )}

          {/* TAB 5: FOLLOW-UP HISTORY */}
          {activeTab === 'followup' && (
            <FollowUpTab
              member={member}
              onOpenModal={(type, data) => setModalState({ type, data })}
            />
          )}

          {/* TAB 6: MEDICAL HISTORY */}
          {activeTab === 'medical' && (
            <MedicalTab
              member={member}
              onOpenModal={(type, data) => setModalState({ type, data })}
            />
          )}

          {/* TAB 7: PAYMENTS */}
          {activeTab === 'payments' && (
            <PaymentsTab
              member={member}
              onOpenModal={(type, data) => {
                if (type === 'receipt_view') {
                  setSelectedReceipt(data);
                } else {
                  setModalState({ type, data });
                }
              }}
            />
          )}

          {/* TAB 8: COMMUNICATION HISTORY */}
          {activeTab === 'communication' && (
            <CommunicationTab
              member={member}
              onOpenModal={(type, data) => setModalState({ type, data })}
            />
          )}

          {/* TAB 9: AUTOMATION STATUS */}
          {activeTab === 'automations' && (
            <AutomationStatusCard member={member} />
          )}

        </main>
      </div>

      {/* ========================================================================= */}
      {/* MODALS & CONFIRMATION DIALOGS                                            */}
      {/* ========================================================================= */}

      {/* Confirmation Modal: Freeze Membership */}
      {modalState.type === 'freeze' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <h3 className="font-bold text-zinc-900 dark:text-white text-base">
              {member.isFrozen ? 'Unfreeze Membership' : 'Freeze Membership'}
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              {member.isFrozen
                ? `Are you sure you want to unfreeze ${member.fullName}'s membership and restore active gym access?`
                : `Are you sure you want to freeze this membership? This will pause remaining validity days and temporarily hold gym access.`}
            </p>

            {!member.isFrozen && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[11px] font-bold text-zinc-500 uppercase">Freeze Duration (Days)</label>
                  <input
                    type="number"
                    value={freezeDays}
                    onChange={(e) => setFreezeDays(Number(e.target.value))}
                    className="w-full mt-1 p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-bold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-zinc-500 uppercase">Reason for Freezing</label>
                  <input
                    type="text"
                    value={freezeReason}
                    onChange={(e) => setFreezeReason(e.target.value)}
                    className="w-full mt-1 p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <button
                onClick={() => setModalState({ type: null })}
                className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmFreeze}
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold shadow-sm"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Extend Membership */}
      {modalState.type === 'extend' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <h3 className="font-bold text-zinc-900 dark:text-white text-base">Extend Membership</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Extend validity tenure for {member.fullName}. This adjusts the expiration date directly in the database.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-zinc-500 uppercase">Extension Days to Add</label>
                <input
                  type="number"
                  value={extendDays}
                  onChange={(e) => setExtendDays(Number(e.target.value))}
                  className="w-full mt-1 p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-bold"
                />
              </div>
              <p className="text-[11px] text-zinc-400 font-mono">
                Current Expiry: <strong className="text-orange-500">{member.expiryDate}</strong>
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <button
                onClick={() => setModalState({ type: null })}
                className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmExtend}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm"
              >
                Confirm Extension
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Upgrade / Combo Offer */}
      {(modalState.type === 'upgrade' || modalState.type === 'combo' || modalState.type === 'downgrade') && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <h3 className="font-bold text-zinc-900 dark:text-white text-base capitalize">
              {modalState.type.replace('_', ' ')} Plan
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Select target plan package. Price differential and updated validity will be calculated automatically.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-zinc-500 uppercase">Target Plan / Combo Package</label>
                <select
                  value={upgradePkgId}
                  onChange={(e) => setUpgradePkgId(e.target.value)}
                  className="w-full mt-1 p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-bold"
                >
                  {packages.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} — ₹{pkg.price.toLocaleString('en-IN')} ({pkg.durationMonths} Months)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <button
                onClick={() => setModalState({ type: null })}
                className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmUpgrade}
                className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-sm"
              >
                Confirm Upgrade
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Transfer Membership */}
      {modalState.type === 'transfer' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <h3 className="font-bold text-zinc-900 dark:text-white text-base">Transfer Membership</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Transfer remaining validity days from {member.fullName} to a new member / friend.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-zinc-500 uppercase">Recipient Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={transferName}
                  onChange={(e) => setTransferName(e.target.value)}
                  className="w-full mt-1 p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-zinc-500 uppercase">Recipient Phone Number</label>
                <input
                  type="tel"
                  placeholder="9845012345"
                  value={transferPhone}
                  onChange={(e) => setTransferPhone(e.target.value)}
                  className="w-full mt-1 p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-bold"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <button
                onClick={() => setModalState({ type: null })}
                className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmTransfer}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm"
              >
                Confirm Transfer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Assign Personal Training */}
      {(modalState.type === 'assign_pt' || modalState.type === 'renew_pt') && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <h3 className="font-bold text-zinc-900 dark:text-white text-base">Assign / Renew Personal Training</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Assign dedicated coach and training session credits for {member.fullName}.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-zinc-500 uppercase">Select Personal Trainer</label>
                <select
                  value={assignedTrainerId}
                  onChange={(e) => setAssignedTrainerId(e.target.value)}
                  className="w-full mt-1 p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-bold"
                >
                  {trainers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-500 uppercase">PT Package Name</label>
                <input
                  type="text"
                  value={ptPlanName}
                  onChange={(e) => setPtPlanName(e.target.value)}
                  placeholder="e.g. 1-on-1 Transformation PT (24 Sessions)"
                  className="w-full mt-1 p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-zinc-500 uppercase">PT Sessions Count</label>
                  <input
                    type="number"
                    value={ptSessions}
                    onChange={(e) => setPtSessions(Number(e.target.value))}
                    className="w-full mt-1 p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-bold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-zinc-500 uppercase">Package Fee (₹)</label>
                  <input
                    type="number"
                    value={ptFee}
                    onChange={(e) => setPtFee(Number(e.target.value))}
                    className="w-full mt-1 p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <button
                onClick={() => setModalState({ type: null })}
                className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAssignPT}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm"
              >
                Assign Trainer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Book Free Trial */}
      {modalState.type === 'free_trial' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <h3 className="font-bold text-zinc-900 dark:text-white text-base">Book a Free Guest Trial Pass</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Issue a 1-day complimentary gym workout pass referred by {member.fullName}.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-zinc-500 uppercase">Guest Friend Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ananya Rao"
                  value={freeTrialName}
                  onChange={(e) => setFreeTrialName(e.target.value)}
                  className="w-full mt-1 p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-zinc-500 uppercase">Guest Phone Number</label>
                <input
                  type="tel"
                  placeholder="9845012345"
                  value={freeTrialPhone}
                  onChange={(e) => setFreeTrialPhone(e.target.value)}
                  className="w-full mt-1 p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-bold"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <button
                onClick={() => setModalState({ type: null })}
                className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setModalState({ type: null });
                  showNotice(`Free 1-Day Trial Pass booked for ${freeTrialName || 'Guest'}!`);
                }}
                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-sm"
              >
                Issue Pass
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Subscription Modal */}
      {modalState.type === 'add_subscription' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <h3 className="font-bold text-zinc-900 dark:text-white text-base">Add Member Subscription</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Attach an active subscription (CrossFit, Sauna, Personal Training, etc.)
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-zinc-500 uppercase">Package</label>
                <select
                  value={upgradePkgId}
                  onChange={(e) => setUpgradePkgId(e.target.value)}
                  className="w-full mt-1 p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-bold"
                >
                  {packages.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} — ₹{pkg.price.toLocaleString('en-IN')}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <button
                onClick={() => setModalState({ type: null })}
                className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const selPkg = packages.find((p) => p.id === upgradePkgId) || packages[0];
                  const newSub = {
                    id: `sub-${Date.now()}`,
                    membershipName: selPkg.name,
                    category: 'Add-on Fitness',
                    startDate: new Date().toISOString().split('T')[0],
                    endDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
                    price: selPkg.price,
                    membershipStatus: 'Active' as const,
                    paymentStatus: 'Paid' as const,
                    packageId: selPkg.id
                  };
                  const currSubs = member.subscriptions || [];
                  updateMember(member.id, { subscriptions: [newSub, ...currSubs] });
                  setModalState({ type: null });
                  showNotice(`Added subscription "${selPkg.name}"`);
                }}
                className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-sm"
              >
                Add Subscription
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Payment Modal */}
      {modalState.type === 'add_payment' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <h3 className="font-bold text-zinc-900 dark:text-white text-base flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-orange-500" />
              <span>Record Fee Payment</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-zinc-500 uppercase">Amount to Pay (₹)</label>
                <input
                  type="number"
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full mt-1 p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-mono font-bold text-emerald-600 text-base"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-500 uppercase">Payment Method</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as any)}
                  className="w-full mt-1 p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-bold"
                >
                  <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
                  <option value="Cash">Cash (Front Desk)</option>
                  <option value="Card">Debit / Credit Card (POS Machine)</option>
                  <option value="Bank Transfer">Bank Transfer (NEFT/IMPS)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-500 uppercase">Notes / Transaction Ref</label>
                <input
                  type="text"
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  className="w-full mt-1 p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <button
                onClick={() => setModalState({ type: null })}
                className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAddPayment}
                className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-sm"
              >
                Save Payment & Generate Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {modalState.type === 'edit_member' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-lg w-full p-5 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <h3 className="font-bold text-zinc-900 dark:text-white text-base">Edit Member Profile</h3>
              <button onClick={() => setModalState({ type: null })}>
                <X className="w-4 h-4 text-zinc-400" />
              </button>
            </div>

            <form onSubmit={handleSaveEditMember} className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-zinc-500 uppercase">Full Name</label>
                <input
                  type="text"
                  required
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  className="w-full mt-1 p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-zinc-500 uppercase">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full mt-1 p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-zinc-500 uppercase">Email Address</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full mt-1 p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-zinc-500 uppercase">Date of Birth</label>
                  <input
                    type="date"
                    value={editDob}
                    onChange={(e) => setEditDob(e.target.value)}
                    className="w-full mt-1 p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-zinc-500 uppercase">Gender</label>
                  <select
                    value={editGender}
                    onChange={(e) => setEditGender(e.target.value as any)}
                    className="w-full mt-1 p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-zinc-500 uppercase">Blood Group</label>
                  <input
                    type="text"
                    value={editBloodGroup}
                    onChange={(e) => setEditBloodGroup(e.target.value)}
                    className="w-full mt-1 p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-500 uppercase">Address / Location</label>
                <input
                  type="text"
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full mt-1 p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-zinc-500 uppercase">Emergency Contact</label>
                  <input
                    type="tel"
                    value={editEmergency}
                    onChange={(e) => setEditEmergency(e.target.value)}
                    className="w-full mt-1 p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-zinc-500 uppercase">Staff Representative</label>
                  <input
                    type="text"
                    value={editClientRep}
                    onChange={(e) => setEditClientRep(e.target.value)}
                    className="w-full mt-1 p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setModalState({ type: null })}
                  className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-sm"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Medical Modal */}
      {modalState.type === 'edit_medical' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-lg w-full p-5 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <h3 className="font-bold text-zinc-900 dark:text-white text-base">Edit Confidential Medical Info</h3>
              <button onClick={() => setModalState({ type: null })}>
                <X className="w-4 h-4 text-zinc-400" />
              </button>
            </div>

            <form onSubmit={handleSaveMedical} className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-zinc-500 uppercase">Injuries / Past Surgeries</label>
                <textarea
                  rows={2}
                  defaultValue={member.medicalHistory?.injuries || ''}
                  onChange={(e) => setMedInjuries(e.target.value)}
                  className="w-full mt-1 p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-500 uppercase">Allergies</label>
                <input
                  type="text"
                  defaultValue={member.medicalHistory?.allergies || ''}
                  onChange={(e) => setMedAllergies(e.target.value)}
                  className="w-full mt-1 p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-500 uppercase">Exercise Restrictions</label>
                <textarea
                  rows={2}
                  defaultValue={member.medicalHistory?.restrictions || ''}
                  onChange={(e) => setMedRestrictions(e.target.value)}
                  className="w-full mt-1 p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-500 uppercase">General Medical Notes</label>
                <textarea
                  rows={2}
                  defaultValue={member.medicalHistory?.notes || ''}
                  onChange={(e) => setMedNotes(e.target.value)}
                  className="w-full mt-1 p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setModalState({ type: null })}
                  className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-sm"
                >
                  Save Medical Directives
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Follow-Up Log Modal */}
      {modalState.type === 'add_followup' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <h3 className="font-bold text-zinc-900 dark:text-white text-base">Add Staff CRM Follow-up Log</h3>

            <form onSubmit={handleAddFollowUp} className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-zinc-500 uppercase">Staff Member Name</label>
                <input
                  type="text"
                  required
                  value={fuStaff}
                  onChange={(e) => setFuStaff(e.target.value)}
                  className="w-full mt-1 p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-500 uppercase">Interaction Outcome</label>
                <select
                  value={fuOutcome}
                  onChange={(e) => setFuOutcome(e.target.value as any)}
                  className="w-full mt-1 p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
                >
                  <option value="Interested">Interested / Satisfied</option>
                  <option value="Renewal Promised">Renewal Promised</option>
                  <option value="No Answer">No Answer / Call Later</option>
                  <option value="Feedback Shared">Feedback Shared</option>
                  <option value="General">General Touchpoint</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-500 uppercase">Call Notes / Discussion</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter details of conversation..."
                  value={fuNote}
                  onChange={(e) => setFuNote(e.target.value)}
                  className="w-full mt-1 p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-500 uppercase">Next Follow-up Date</label>
                <input
                  type="date"
                  value={fuNextDate}
                  onChange={(e) => setFuNextDate(e.target.value)}
                  className="w-full mt-1 p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setModalState({ type: null })}
                  className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-sm"
                >
                  Log Follow-up
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Send Notification Modal */}
      {modalState.type === 'send_notification' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <h3 className="font-bold text-zinc-900 dark:text-white text-base flex items-center gap-2">
              <Bell className="w-5 h-5 text-sky-500" />
              <span>Send Mobile App Notification</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-zinc-500 uppercase">Notification Title</label>
                <input
                  type="text"
                  value={notifTitle}
                  onChange={(e) => setNotifTitle(e.target.value)}
                  className="w-full mt-1 p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-bold"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-zinc-500 uppercase">Message</label>
                <textarea
                  rows={3}
                  value={notifMsg}
                  onChange={(e) => setNotifMsg(e.target.value)}
                  className="w-full mt-1 p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <button
                onClick={() => setModalState({ type: null })}
                className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSendInAppNotification}
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold shadow-sm"
              >
                Dispatch Notification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Participated Challenges Modal */}
      {modalState.type === 'view_challenges' && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-lg w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <h3 className="font-bold text-zinc-900 dark:text-white text-base flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <span>Gym Challenges & Leaderboards</span>
              </h3>
              <button onClick={() => setModalState({ type: null })}>
                <X className="w-4 h-4 text-zinc-400" />
              </button>
            </div>

            <div className="space-y-2.5">
              {[
                { name: 'BSF 30-Day Summer Shred Challenge', date: 'June 2026', rank: 'Rank #4 / 64', score: '3,200 pts', badge: 'Top Finisher' },
                { name: '100kg Bench Press Milestone', date: 'July 2026', rank: 'Completed', score: 'PR 105kg', badge: 'Strength Club' },
                { name: 'Mysuru Marathon 10K Preparation', date: 'August 2026', rank: 'Active', score: '48m 12s', badge: 'Endurance' }
              ].map((c, i) => (
                <div
                  key={i}
                  className="p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl border border-zinc-200 dark:border-zinc-700 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-zinc-900 dark:text-white">{c.name}</p>
                    <p className="text-[10px] text-zinc-400 font-mono">{c.date} • {c.score}</p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                      {c.rank}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <button
                onClick={() => setModalState({ type: null })}
                className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Camera Modal */}
      <LiveCameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(dataUrl) => {
          updateMember(member.id, { photoUrl: dataUrl });
          setIsCameraOpen(false);
          showNotice('Live photo captured and profile updated!');
        }}
        memberName={member.fullName}
      />

      {/* Photo Picker Modal */}
      {isPhotoPickerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <h3 className="font-bold text-zinc-900 dark:text-white text-base">Select Member Photo</h3>
            <MemberPhotoPicker
              photoUrl={member.photoUrl}
              memberName={member.fullName}
              onChange={(url) => {
                updateMember(member.id, { photoUrl: url });
                setIsPhotoPickerOpen(false);
                showNotice('Photo updated successfully');
              }}
            />
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsPhotoPickerOpen(false)}
                className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {selectedReceipt && (
        <ReceiptModal
          payment={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      )}

    </div>
  );
};
