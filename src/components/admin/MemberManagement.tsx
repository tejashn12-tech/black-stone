import React, { useState, useMemo, useRef } from 'react';
import { useGym } from '../../context/GymContext';
import { Member, MembershipPackage, PaymentRecord } from '../../types';
import { MemberBulkUploadModal } from './MemberBulkUploadModal';
import { MemberWhatsAppModal, WhatsAppMessageType } from './MemberWhatsAppModal';
import { LiveCameraModal } from '../common/LiveCameraModal';
import { MemberPhotoPicker } from '../common/MemberPhotoPicker';
import { MemberProfileView } from './MemberProfileView';
import { compressImageToDataUrl } from '../../utils/photoStorage';
import {
  getEffectiveMemberStatus,
  getDaysUntilExpiry,
  isExpiringSoon,
  isExpired,
  isActiveMember,
  getExpiryCountdownLabel,
  compareMembersRecentlyJoined
} from '../../utils/memberStatus';
import {
  Users,
  Search,
  Plus,
  Filter,
  Edit2,
  Trash2,
  Phone,
  MessageSquare,
  CreditCard,
  UserCheck,
  UserX,
  Clock,
  CheckCircle2,
  Sparkles,
  Download,
  Upload,
  Shield,
  AlertCircle,
  X,
  Zap,
  RefreshCw,
  LayoutList,
  LayoutGrid,
  Camera,
  Eye,
  Maximize2,
  IndianRupee,
  ArrowUpDown,
  Send,
  ExternalLink
} from 'lucide-react';

type MemberStatusTab = 'all' | 'active' | 'expiring_soon' | 'inactive' | 'payment_due';

interface MemberManagementProps {
  initialMemberId?: string;
}

export const MemberManagement: React.FC<MemberManagementProps> = ({ initialMemberId }) => {
  const {
    members,
    packages,
    addMember,
    updateMember,
    deleteMember,
    renewMember,
    recordPayment,
    recordConsent,
    sendWhatsAppMessage,
    whatsAppSession
  } = useGym();

  const [selectedProfileMemberId, setSelectedProfileMemberId] = useState<string | null>(initialMemberId || null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<MemberStatusTab>('all');
  const [viewDensity, setViewDensity] = useState<'compact' | 'standard'>('compact');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isRenewModalOpen, setIsRenewModalOpen] = useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [activeMember, setActiveMember] = useState<Member | null>(null);

  // Renewal WhatsApp Notification States
  const [renewSendWhatsApp, setRenewSendWhatsApp] = useState<boolean>(true);
  const [renewCustomMessage, setRenewCustomMessage] = useState<string>('');
  const [isRenewing, setIsRenewing] = useState<boolean>(false);
  const [renewalSuccessNotice, setRenewalSuccessNotice] = useState<{
    memberName: string;
    phone: string;
    newExpiry: string;
    packageName: string;
    amount: number;
    messageText: string;
    directUrl?: string;
  } | null>(null);

  // Live Camera Photo Capture States
  const [photoCaptureMember, setPhotoCaptureMember] = useState<Member | null>(null);
  const [previewPhotoMember, setPreviewPhotoMember] = useState<Member | null>(null);

  // WhatsApp Integration Modal States
  const [whatsAppModalMember, setWhatsAppModalMember] = useState<Member | null>(null);
  const [whatsAppDefaultType, setWhatsAppDefaultType] = useState<WhatsAppMessageType>('renewal');

  const handleOpenWhatsAppModal = (m: Member) => {
    let initialType: WhatsAppMessageType = 'renewal';
    if ((m.pendingAmount || 0) > 0) {
      initialType = 'payment_due';
    } else if (m.status === 'expiring_soon' || m.status === 'expired') {
      initialType = 'renewal';
    } else {
      const today = new Date();
      const dobMonthDay = m.dob ? m.dob.slice(5) : '';
      const todayMonthDay = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      if (dobMonthDay && dobMonthDay === todayMonthDay) {
        initialType = 'birthday';
      } else {
        initialType = 'renewal';
      }
    }
    setWhatsAppDefaultType(initialType);
    setWhatsAppModalMember(m);
  };

  // New / Edit Member Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    whatsapp: '',
    gender: 'Male' as Member['gender'],
    dob: '1998-05-15',
    packageId: packages[0]?.id || '',
    startDate: new Date().toISOString().split('T')[0],
    paidAmount: packages[0]?.price || 15999,
    notes: '',
    address: 'Mysuru, Karnataka',
    photoUrl: undefined as string | undefined
  });

  // Direct Live Photo capture handler from Member List
  const handleDirectPhotoCapture = (capturedDataUrl: string) => {
    if (photoCaptureMember) {
      updateMember(photoCaptureMember.id, { photoUrl: capturedDataUrl });
      if (previewPhotoMember && previewPhotoMember.id === photoCaptureMember.id) {
        setPreviewPhotoMember({ ...previewPhotoMember, photoUrl: capturedDataUrl });
      }
      setPhotoCaptureMember(null);
    }
  };

  // Quick Photo File Upload handler
  const quickFileInputRef = useRef<HTMLInputElement | null>(null);
  const [targetQuickUploadMember, setTargetQuickUploadMember] = useState<Member | null>(null);

  const handleTriggerQuickUpload = (m: Member, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setTargetQuickUploadMember(m);
    quickFileInputRef.current?.click();
  };

  const handleQuickFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && targetQuickUploadMember) {
      try {
        const compressed = await compressImageToDataUrl(file, 500, 0.82);
        updateMember(targetQuickUploadMember.id, { photoUrl: compressed });
        if (previewPhotoMember && previewPhotoMember.id === targetQuickUploadMember.id) {
          setPreviewPhotoMember({ ...previewPhotoMember, photoUrl: compressed });
        }
      } catch (err) {
        console.error('Failed to compress quick uploaded photo:', err);
      } finally {
        e.target.value = '';
        setTargetQuickUploadMember(null);
      }
    }
  };

  // DPDP Consent Checkboxes
  const [consentMembership, setConsentMembership] = useState<boolean>(true);
  const [consentWhatsAppUpdates, setConsentWhatsAppUpdates] = useState<boolean>(true);
  const [consentFitnessGuidance, setConsentFitnessGuidance] = useState<boolean>(true);
  const [consentPromotions, setConsentPromotions] = useState<boolean>(false);

  // Renewal Form State
  const [renewPkgId, setRenewPkgId] = useState<string>(packages[0]?.id || '');
  const [renewPaidAmount, setRenewPaidAmount] = useState<number>(0);
  const [renewPaymentMethod, setRenewPaymentMethod] = useState<PaymentRecord['paymentMethod']>('UPI');

  // Calculate status counts dynamically
  const statusCounts = useMemo(() => {
    let active = 0;
    let expiring = 0;
    let inactive = 0;
    let paymentDue = 0;

    members.forEach(m => {
      if (isActiveMember(m)) {
        active++;
      } else {
        inactive++;
      }
      if (isExpiringSoon(m.expiryDate)) {
        expiring++;
      }
      if ((m.pendingAmount && m.pendingAmount > 0) || m.status === 'payment_due') {
        paymentDue++;
      }
    });

    return {
      all: members.length,
      active,
      expiring_soon: expiring,
      inactive,
      payment_due: paymentDue
    };
  }, [members]);

  // Sort Order State - Defaults to Recently Joined on top
  const [sortBy, setSortBy] = useState<'recently_joined' | 'name_asc' | 'expiry_soon' | 'expiry_latest' | 'highest_fees'>('recently_joined');

  // Filtered members list
  const filteredMembers = useMemo(() => {
    const list = members.filter(m => {
      const isAct = isActiveMember(m);
      const isExpSoon = isExpiringSoon(m.expiryDate);
      const hasDues = (m.pendingAmount && m.pendingAmount > 0) || m.status === 'payment_due';

      if (statusFilter === 'active') {
        if (!isAct) return false;
      } else if (statusFilter === 'expiring_soon') {
        if (!isExpSoon) return false;
      } else if (statusFilter === 'inactive') {
        if (isAct) return false;
      } else if (statusFilter === 'payment_due') {
        if (!hasDues) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = m.fullName.toLowerCase().includes(q);
        const matchesCode = (m.memberCode || '').toLowerCase().includes(q);
        const matchesPhone = (m.phone || '').includes(q) || (m.whatsapp || '').includes(q);
        const matchesPackage = (m.packageName || '').toLowerCase().includes(q);
        const matchesEmail = (m.email || '').toLowerCase().includes(q);
        if (!matchesName && !matchesCode && !matchesPhone && !matchesPackage && !matchesEmail) {
          return false;
        }
      }
      return true;
    });

    return [...list].sort((a, b) => {
      // If filtering specifically by expiring soon and sortBy is default recently joined, show closest expiry first
      if (statusFilter === 'expiring_soon' && sortBy === 'recently_joined') {
        return a.expiryDate.localeCompare(b.expiryDate);
      }

      if (sortBy === 'recently_joined') {
        return compareMembersRecentlyJoined(a, b);
      }

      if (sortBy === 'name_asc') {
        return a.fullName.localeCompare(b.fullName);
      }

      if (sortBy === 'expiry_soon') {
        return (a.expiryDate || '').localeCompare(b.expiryDate || '');
      }

      if (sortBy === 'expiry_latest') {
        return (b.expiryDate || '').localeCompare(a.expiryDate || '');
      }

      if (sortBy === 'highest_fees') {
        const feesA = a.lastFeesPaid !== undefined ? a.lastFeesPaid : a.paidAmount;
        const feesB = b.lastFeesPaid !== undefined ? b.lastFeesPaid : b.paidAmount;
        return feesB - feesA;
      }

      return compareMembersRecentlyJoined(a, b);
    });
  }, [members, statusFilter, searchQuery, sortBy]);

  // Open Add Modal
  const handleOpenAdd = () => {
    const defaultPkg = packages[0];
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      whatsapp: '',
      gender: 'Male',
      dob: '1998-05-15',
      packageId: defaultPkg?.id || '',
      startDate: new Date().toISOString().split('T')[0],
      paidAmount: defaultPkg?.price || 15999,
      notes: '',
      address: 'Mysuru, Karnataka',
      photoUrl: undefined
    });
    setIsAddModalOpen(true);
  };

  // Submit Add Member
  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const pkg = packages.find(p => p.id === formData.packageId) || packages[0];
    const duration = pkg?.durationMonths || 12;
    const pkgPrice = pkg?.price || 9999;
    const pkgId = pkg?.id || 'pkg-12';
    const pkgName = pkg?.name || '12 Months Annual VIP Pro';

    const start = new Date(formData.startDate);
    const expiry = new Date(start);
    expiry.setMonth(expiry.getMonth() + duration);
    const expiryStr = expiry.toISOString().split('T')[0];

    const pending = Math.max(0, pkgPrice - formData.paidAmount);
    const status = getEffectiveMemberStatus({
      status: 'active',
      expiryDate: expiryStr,
      pendingAmount: pending
    });

    const newMember = addMember({
      fullName: formData.fullName,
      email: formData.email || `${formData.fullName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      phone: formData.phone,
      whatsapp: formData.whatsapp || formData.phone,
      gender: formData.gender,
      dob: formData.dob,
      photoUrl: formData.photoUrl,
      packageId: pkgId,
      packageName: pkgName,
      startDate: formData.startDate,
      expiryDate: expiryStr,
      status,
      totalAmount: pkgPrice,
      paidAmount: formData.paidAmount,
      pendingAmount: pending,
      notes: formData.notes,
      address: formData.address,
      password: 'password123'
    });

    // Record DPDP Act 2023 Consent
    recordConsent({
      principalName: newMember.fullName,
      principalContact: newMember.phone,
      principalType: 'member',
      principalId: newMember.id,
      purposes: {
        membershipAdministration: consentMembership,
        whatsappTransactionalUpdates: consentWhatsAppUpdates,
        workoutFitnessGuidance: consentFitnessGuidance,
        promotionsMarketing: consentPromotions,
        healthInjuryConsultation: true
      },
      noticeVersion: 'v2026.1'
    });

    if (formData.paidAmount > 0) {
      recordPayment({
        memberId: newMember.id,
        memberName: newMember.fullName,
        memberPhone: newMember.whatsapp,
        packageId: pkgId,
        packageName: pkgName,
        amountPaid: formData.paidAmount,
        totalPackageAmount: pkgPrice,
        pendingAmount: pending,
        discount: 0,
        paymentDate: formData.startDate,
        paymentMethod: 'UPI',
        status: pending === 0 ? 'PAID' : 'PARTIALLY PAID',
        notes: `Initial registration fee for ${pkgName}`,
        whatsappStatus: 'Pending',
        expiryDate: expiryStr
      });
    }

    setIsAddModalOpen(false);
  };

  // Open Edit Modal
  const handleOpenEdit = (member: Member) => {
    setActiveMember(member);
    setFormData({
      fullName: member.fullName,
      email: member.email,
      phone: member.phone,
      whatsapp: member.whatsapp,
      gender: member.gender,
      dob: member.dob,
      packageId: member.packageId,
      startDate: member.startDate,
      paidAmount: member.paidAmount,
      notes: member.notes || '',
      address: member.address || 'Mysuru',
      photoUrl: member.photoUrl
    });
    setIsEditModalOpen(true);
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMember) return;
    const pkg = packages.find(p => p.id === formData.packageId) || packages[0];
    const pkgPrice = pkg?.price || 9999;
    const pkgId = pkg?.id || activeMember.packageId || 'pkg-12';
    const pkgName = pkg?.name || activeMember.packageName || '12 Months Annual VIP Pro';
    const pending = Math.max(0, pkgPrice - formData.paidAmount);

    const finalPhotoUrl = formData.photoUrl !== undefined ? formData.photoUrl : activeMember.photoUrl;

    updateMember(activeMember.id, {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      whatsapp: formData.whatsapp,
      gender: formData.gender,
      dob: formData.dob,
      photoUrl: finalPhotoUrl,
      packageId: pkgId,
      packageName: pkgName,
      paidAmount: formData.paidAmount,
      pendingAmount: pending,
      notes: formData.notes,
      address: formData.address
    });
    setIsEditModalOpen(false);
  };

  // Generate formatted WhatsApp message for renewal
  const generateRenewalWhatsAppText = (
    member: Member,
    pkg: MembershipPackage,
    paidAmount: number,
    paymentMethod: string,
    newExpiryDate: string
  ) => {
    return `✅ *MEMBERSHIP RENEWED - BLACK STONE FITNESS* 💪🏋️‍♂️\n\n` +
      `Dear ${member.fullName},\n` +
      `Great news! Your gym membership at *Black Stone Fitness* has been successfully renewed!\n\n` +
      `• *Member Code:* ${member.memberCode}\n` +
      `• *Package:* ${pkg.name} (${pkg.durationMonths} Months)\n` +
      `• *New Expiry Date:* ${newExpiryDate}\n` +
      `• *Amount Paid:* ₹${paidAmount.toLocaleString('en-IN')}\n` +
      `• *Payment Mode:* ${paymentMethod}\n\n` +
      `Thank you for staying committed to your fitness goals. See you on the gym floor!\n\n` +
      `📍 Black Stone Fitness, New Kantharaj Urs Road, Mysuru\n` +
      `Stay strong & keep crushing your workouts! 🔥`;
  };

  // Open Renewal Modal
  const handleOpenRenew = (member: Member) => {
    setActiveMember(member);
    const pkg = packages.find(p => p.id === member.packageId) || packages[0];
    const pkgId = pkg?.id || 'pkg-12';
    const pkgPrice = pkg?.price || 9999;
    setRenewPkgId(pkgId);
    setRenewPaidAmount(pkgPrice);
    setRenewPaymentMethod('UPI');
    setRenewSendWhatsApp(true);

    const currentExpiry = new Date(member.expiryDate);
    const now = new Date();
    const baseDate = currentExpiry > now ? currentExpiry : now;
    const newExpiry = new Date(baseDate);
    newExpiry.setMonth(newExpiry.getMonth() + (pkg?.durationMonths || 12));
    const newExpiryStr = newExpiry.toISOString().split('T')[0];

    const initialMsg = generateRenewalWhatsAppText(member, pkg, pkgPrice, 'UPI', newExpiryStr);
    setRenewCustomMessage(initialMsg);
    setIsRenewModalOpen(true);
  };

  const handleRenewPkgChange = (newId: string) => {
    setRenewPkgId(newId);
    const selected = packages.find(p => p.id === newId);
    if (selected && activeMember) {
      setRenewPaidAmount(selected.price);
      const currentExpiry = new Date(activeMember.expiryDate);
      const now = new Date();
      const baseDate = currentExpiry > now ? currentExpiry : now;
      const newExpiry = new Date(baseDate);
      newExpiry.setMonth(newExpiry.getMonth() + selected.durationMonths);
      const newExpiryStr = newExpiry.toISOString().split('T')[0];
      setRenewCustomMessage(generateRenewalWhatsAppText(activeMember, selected, selected.price, renewPaymentMethod, newExpiryStr));
    }
  };

  const handleRenewPaymentMethodChange = (mode: PaymentRecord['paymentMethod']) => {
    setRenewPaymentMethod(mode);
    if (activeMember) {
      const selected = packages.find(p => p.id === renewPkgId) || packages[0];
      const currentExpiry = new Date(activeMember.expiryDate);
      const now = new Date();
      const baseDate = currentExpiry > now ? currentExpiry : now;
      const newExpiry = new Date(baseDate);
      newExpiry.setMonth(newExpiry.getMonth() + (selected?.durationMonths || 12));
      const newExpiryStr = newExpiry.toISOString().split('T')[0];
      setRenewCustomMessage(generateRenewalWhatsAppText(activeMember, selected, renewPaidAmount, mode, newExpiryStr));
    }
  };

  const handleSubmitRenew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMember) return;
    const pkg = packages.find(p => p.id === renewPkgId);
    if (!pkg) return;

    setIsRenewing(true);
    try {
      const currentExpiry = new Date(activeMember.expiryDate);
      const now = new Date();
      const baseDate = currentExpiry > now ? currentExpiry : now;
      const newExpiry = new Date(baseDate);
      newExpiry.setMonth(newExpiry.getMonth() + pkg.durationMonths);
      const newExpiryStr = newExpiry.toISOString().split('T')[0];

      const renewalResult = renewMember(
        activeMember.id,
        pkg.id,
        pkg.durationMonths,
        renewPaidAmount,
        renewPaymentMethod,
        `Front desk renewal for ${pkg.name}`
      );

      const targetPhone = activeMember.whatsapp || activeMember.phone || '+91 98803 97294';
      const cleanDigits = targetPhone.replace(/\D/g, '');
      const recipientPhone10 = cleanDigits.length >= 10 ? cleanDigits.slice(-10) : cleanDigits;
      const fullWhatsAppPhone = `91${recipientPhone10}`;

      const msgToSend = renewCustomMessage.trim() || generateRenewalWhatsAppText(activeMember, pkg, renewPaidAmount, renewPaymentMethod, newExpiryStr);
      const directUrl = `https://wa.me/${fullWhatsAppPhone}?text=${encodeURIComponent(msgToSend)}`;

      if (renewSendWhatsApp) {
        await sendWhatsAppMessage(
          targetPhone,
          activeMember.fullName,
          msgToSend,
          'expiry_reminder'
        );
      }

      setRenewalSuccessNotice({
        memberName: activeMember.fullName,
        phone: targetPhone,
        newExpiry: newExpiryStr,
        packageName: pkg.name,
        amount: renewPaidAmount,
        messageText: msgToSend,
        directUrl
      });

      setIsRenewModalOpen(false);
    } catch (err) {
      console.error('Renewal processing error:', err);
    } finally {
      setIsRenewing(false);
    }
  };

  // Export current members to CSV
  const handleExportCSV = () => {
    const headers = [
      'MemberCode',
      'FullName',
      'Phone',
      'WhatsApp',
      'Email',
      'Gender',
      'DOB',
      'PackageName',
      'StartDate',
      'ExpiryDate',
      'Status',
      'TotalAmount',
      'LastFeesPaid',
      'PaidAmount',
      'PendingAmount',
      'EmergencyContact',
      'BloodGroup',
      'Address',
      'Notes'
    ].join(',');

    const rows = filteredMembers.map(m => [
      `"${m.memberCode}"`,
      `"${m.fullName}"`,
      `"${m.phone}"`,
      `"${m.whatsapp}"`,
      `"${m.email}"`,
      `"${m.gender}"`,
      `"${m.dob}"`,
      `"${m.packageName}"`,
      `"${m.startDate}"`,
      `"${m.expiryDate}"`,
      `"${m.status}"`,
      m.totalAmount,
      m.lastFeesPaid !== undefined ? m.lastFeesPaid : m.paidAmount,
      m.paidAmount,
      m.pendingAmount,
      `"${m.emergencyContact || ''}"`,
      `"${m.bloodGroup || ''}"`,
      `"${m.address || ''}"`,
      `"${m.notes?.replace(/"/g, '""') || ''}"`
    ].join(','));

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `blackstone_members_${statusFilter}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // If a specific member profile is selected, render the dedicated Profile Page
  if (selectedProfileMemberId) {
    return (
      <div id="bsf-admin-member-profile-view">
        <MemberProfileView
          memberId={selectedProfileMemberId}
          onBack={() => setSelectedProfileMemberId(null)}
          onSelectMember={(id) => setSelectedProfileMemberId(id)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6" id="bsf-admin-member-management">
      
      {/* WhatsApp Renewal Success Toast Banner */}
      {renewalSuccessNotice && (
        <div className="bg-emerald-950/80 border border-emerald-500/50 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-emerald-100 shadow-xl shadow-emerald-950/40 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-bold text-white text-sm">
                  Membership Renewed & WhatsApp Dispatched!
                </h4>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded-full border border-emerald-500/30">
                  {renewalSuccessNotice.phone}
                </span>
              </div>
              <p className="text-xs text-emerald-200/90 mt-0.5">
                <strong className="text-white">{renewalSuccessNotice.memberName}</strong>'s membership was renewed for <strong className="text-white">{renewalSuccessNotice.packageName}</strong> until <strong className="text-white">{renewalSuccessNotice.newExpiry}</strong>. Payment of ₹{renewalSuccessNotice.amount.toLocaleString('en-IN')} recorded.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
            {renewalSuccessNotice.directUrl && (
              <a
                href={renewalSuccessNotice.directUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow-sm"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Open in WhatsApp Web</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            <button
              type="button"
              onClick={() => setRenewalSuccessNotice(null)}
              className="p-1.5 text-emerald-300 hover:text-white rounded-lg hover:bg-emerald-900/50 transition"
              title="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-800/80">
        <div>
          <h2 className="text-2xl font-black text-white font-display tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-orange-400" />
            MEMBER DIRECTORY ({members.length})
          </h2>
          <p className="text-xs text-zinc-400 font-sans-body mt-0.5">
            Manage athlete accounts, membership subscriptions, renewals, and payment records.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-bold text-xs rounded-xl transition border border-zinc-800 flex items-center gap-2"
            title="Export current view to CSV"
          >
            <Download className="w-4 h-4 text-zinc-400" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => setIsUploadModalOpen(true)}
            className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-orange-400 hover:text-orange-300 font-extrabold text-xs uppercase tracking-wider rounded-xl transition border border-orange-400/30 flex items-center gap-2 shadow-lg shadow-black/40"
          >
            <Upload className="w-4 h-4" />
            <span>Upload File</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-orange-400 hover:bg-orange-300 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-orange-400/20 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {/* Quick Status Toggle Tabs & Search Filter */}
      <div className="space-y-3">
        
        {/* Status Toggle Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          
          {/* ALL */}
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 shrink-0 border ${
              statusFilter === 'all'
                ? 'bg-orange-400 text-black border-orange-400 shadow-md shadow-orange-400/20 font-black'
                : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>All Members</span>
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono ${
              statusFilter === 'all' ? 'bg-black text-orange-400 font-extrabold' : 'bg-zinc-800 text-zinc-300'
            }`}>
              {statusCounts.all}
            </span>
          </button>

          {/* ACTIVE */}
          <button
            type="button"
            onClick={() => setStatusFilter('active')}
            title="All 66 active members with valid, unexpired memberships"
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 shrink-0 border ${
              statusFilter === 'active'
                ? 'bg-emerald-500 text-black border-emerald-500 shadow-md shadow-emerald-500/20 font-black'
                : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <UserCheck className="w-4 h-4" />
            <span>Active</span>
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono ${
              statusFilter === 'active' ? 'bg-black text-emerald-400 font-extrabold' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            }`}>
              {statusCounts.active}
            </span>
          </button>

          {/* EXPIRING SOON */}
          <button
            type="button"
            onClick={() => setStatusFilter('expiring_soon')}
            title="Members with 7 days or less left to their plan expiry date"
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 shrink-0 border ${
              statusFilter === 'expiring_soon'
                ? 'bg-amber-500 text-black border-amber-500 shadow-md shadow-amber-500/20 font-black'
                : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 animate-pulse" />
            <Clock className="w-4 h-4" />
            <span>Expiring Soon (≤7 Days)</span>
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono ${
              statusFilter === 'expiring_soon' ? 'bg-black text-amber-400 font-extrabold' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}>
              {statusCounts.expiring_soon}
            </span>
          </button>

          {/* INACTIVE / EXPIRED */}
          <button
            type="button"
            onClick={() => setStatusFilter('inactive')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 shrink-0 border ${
              statusFilter === 'inactive'
                ? 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/20 font-black'
                : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0" />
            <UserX className="w-4 h-4" />
            <span>Inactive</span>
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono ${
              statusFilter === 'inactive' ? 'bg-black text-rose-400 font-extrabold' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}>
              {statusCounts.inactive}
            </span>
          </button>

          {/* PAYMENT DUE */}
          <button
            type="button"
            onClick={() => setStatusFilter('payment_due')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 shrink-0 border ${
              statusFilter === 'payment_due'
                ? 'bg-sky-500 text-black border-sky-500 shadow-md shadow-sky-500/20 font-black'
                : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Payment Due</span>
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono ${
              statusFilter === 'payment_due' ? 'bg-black text-sky-400 font-extrabold' : 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
            }`}>
              {statusCounts.payment_due}
            </span>
          </button>

        </div>

        {/* Search Bar & Density Switcher */}
        <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by member name, ID code (BSF-...), phone number, or package plan..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs placeholder:text-zinc-500 focus:border-orange-400 focus:outline-none shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-1 rounded"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-between sm:justify-end">
            {/* Sort Dropdown */}
            <div id="bsf-member-sort-control" className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <label htmlFor="bsf-member-sort-select" className="text-zinc-400 text-[11px] font-medium hidden md:inline">Sort:</label>
              <select
                id="bsf-member-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-white text-xs font-bold focus:outline-none cursor-pointer pr-1"
                title="Sort member directory"
              >
                <option value="recently_joined" className="bg-zinc-900 text-white">Recently Joined (Newest on Top)</option>
                <option value="name_asc" className="bg-zinc-900 text-white">Name (A–Z)</option>
                <option value="expiry_soon" className="bg-zinc-900 text-white">Expiring Soonest</option>
                <option value="expiry_latest" className="bg-zinc-900 text-white">Expiry (Furthest)</option>
                <option value="highest_fees" className="bg-zinc-900 text-white">Highest Fees Paid</option>
              </select>
            </div>

            {/* Density switcher */}
            <div id="bsf-member-density-switcher" className="flex items-center gap-1.5 self-end sm:self-auto bg-zinc-900 border border-zinc-800 p-1 rounded-xl shrink-0">
              <button
                id="bsf-member-density-compact-btn"
                type="button"
                onClick={() => setViewDensity('compact')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  viewDensity === 'compact'
                    ? 'bg-zinc-800 text-orange-400 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Compact Dense View (Optimized for fast daily scanning)"
              >
                <LayoutList className="w-3.5 h-3.5" />
                <span>Compact</span>
              </button>

              <button
                id="bsf-member-density-standard-btn"
                type="button"
                onClick={() => setViewDensity('standard')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  viewDensity === 'standard'
                    ? 'bg-zinc-800 text-orange-400 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Standard View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Standard</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/80 text-zinc-400 uppercase text-[10px] font-bold tracking-wider">
                <th className={`px-3.5 ${viewDensity === 'compact' ? 'py-2.5' : 'py-3.5'}`}>Member Info</th>
                <th className={`px-3.5 ${viewDensity === 'compact' ? 'py-2.5' : 'py-3.5'}`}>Plan & Validity</th>
                <th className={`px-3.5 ${viewDensity === 'compact' ? 'py-2.5' : 'py-3.5'}`}>
                  <div className="flex items-center gap-1.5">
                    <IndianRupee className="w-3 h-3 text-emerald-400" />
                    <span>Last Fees Paid</span>
                  </div>
                </th>
                <th className={`px-3.5 ${viewDensity === 'compact' ? 'py-2.5' : 'py-3.5'}`}>Status</th>
                <th className={`px-3.5 text-right ${viewDensity === 'compact' ? 'py-2.5' : 'py-3.5'}`}>High-Speed Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-sans-body">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 px-4 text-center">
                    <div className="max-w-xs mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 text-zinc-400 flex items-center justify-center mx-auto">
                        <Users className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-bold text-white">No matching members found</p>
                      <p className="text-xs text-zinc-400">
                        {searchQuery
                          ? `No members matched "${searchQuery}" in the ${statusFilter} tab.`
                          : `No members currently classified as ${statusFilter.replace('_', ' ')}.`}
                      </p>
                      {(statusFilter !== 'all' || searchQuery) && (
                        <button
                          onClick={() => {
                            setStatusFilter('all');
                            setSearchQuery('');
                          }}
                          className="px-3 py-1.5 bg-orange-400 text-black font-bold text-xs rounded-xl hover:bg-orange-300 transition"
                        >
                          View All Members
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredMembers.map(m => {
                  const effectiveStatus = getEffectiveMemberStatus(m);
                  const daysLeft = getDaysUntilExpiry(m.expiryDate);
                  const hasDues = (m.pendingAmount || 0) > 0;
                  const isExpiring = effectiveStatus === 'expiring_soon';
                  const isExpired = effectiveStatus === 'expired';

                  return (
                    <tr
                      key={m.id}
                      onClick={() => setSelectedProfileMemberId(m.id)}
                      className="hover:bg-zinc-800/60 transition cursor-pointer group"
                      title="Click anywhere on row to open Member Profile & CRM Dashboard"
                    >
                      {/* Member info */}
                      <td className={`px-3.5 ${viewDensity === 'compact' ? 'py-2' : 'py-3.5'}`}>
                        <div className="flex items-center gap-2.5">
                          {/* Live Camera Photo Avatar */}
                          <div className="relative group/avatar shrink-0">
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                if (m.photoUrl) {
                                  setPreviewPhotoMember(m);
                                } else {
                                  setPhotoCaptureMember(m);
                                }
                              }}
                              className={`rounded-xl border overflow-hidden cursor-pointer flex items-center justify-center transition shadow-sm ${
                                m.photoUrl
                                  ? 'border-orange-400/80 bg-black hover:ring-2 hover:ring-orange-400'
                                  : 'border-zinc-700/80 bg-zinc-800 hover:border-orange-400 text-orange-400 font-extrabold'
                              } ${
                                viewDensity === 'compact' ? 'w-9 h-9 text-[11px]' : 'w-11 h-11 text-xs'
                              }`}
                              title={m.photoUrl ? 'Click to view photo / retake' : 'Click to take live webcam photo'}
                            >
                              {m.photoUrl ? (
                                <img
                                  src={m.photoUrl}
                                  alt={m.fullName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span>
                                  {m.fullName
                                    .split(' ')
                                    .filter(Boolean)
                                    .slice(0, 2)
                                    .map(w => w[0])
                                    .join('')
                                    .toUpperCase()}
                                </span>
                              )}
                            </div>

                            {/* Photo Action Buttons on Avatar */}
                            <div className="absolute -bottom-1 -right-1 flex items-center gap-0.5">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPhotoCaptureMember(m);
                                }}
                                className="p-1 rounded-full bg-orange-400 text-black shadow-md hover:bg-orange-300 transition opacity-80 group-hover/avatar:opacity-100 hover:scale-110"
                                title="Snap live webcam photo"
                              >
                                <Camera className="w-2.5 h-2.5" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => handleTriggerQuickUpload(m, e)}
                                className="p-1 rounded-full bg-zinc-800 text-zinc-200 border border-zinc-700 shadow-md hover:bg-zinc-700 hover:text-white transition opacity-0 group-hover/avatar:opacity-100 hover:scale-110"
                                title="Upload photo file"
                              >
                                <Upload className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <p className="font-bold text-white group-hover:text-orange-400 text-sm leading-snug transition">
                                {m.fullName}
                              </p>
                              <span className="text-[10px] text-orange-400 font-mono font-semibold px-1 py-0.2 rounded bg-zinc-950 border border-zinc-800">
                                {m.memberCode}
                              </span>
                              {(() => {
                                const d = m.joinedDate || m.startDate;
                                if (!d) return null;
                                const joinTime = new Date(d).getTime();
                                const now = new Date().getTime();
                                const diffDays = (now - joinTime) / (1000 * 60 * 60 * 24);
                                if (diffDays >= -1 && diffDays <= 45) {
                                  return (
                                    <span className="text-[9px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.2 rounded font-bold uppercase tracking-wider">
                                      New
                                    </span>
                                  );
                                }
                                return null;
                              })()}
                              <span className="text-[10px] text-zinc-400 px-1 py-0.2 rounded bg-zinc-800/80 border border-zinc-700/50">
                                {m.gender}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-[11px] text-zinc-400 font-mono mt-0.5 flex-wrap">
                              <a
                                href={`tel:${m.phone}`}
                                onClick={(e) => e.stopPropagation()}
                                className="hover:text-white transition flex items-center gap-1"
                              >
                                <Phone className="w-3 h-3 text-zinc-500" />
                                <span>{m.phone}</span>
                              </a>
                              {m.dob && (
                                <span className="text-zinc-400 flex items-center gap-1">
                                  <span className="text-zinc-500">DOB:</span>
                                  <span className="text-zinc-300 font-medium">{m.dob}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Plan & Expiry */}
                      <td className={`px-3.5 ${viewDensity === 'compact' ? 'py-2' : 'py-3.5'}`}>
                        <div className="flex items-center gap-1.5">
                          <p className="font-semibold text-white">{m.packageName}</p>
                        </div>
                        <div className="text-[11px] text-zinc-400 mt-0.5 space-y-0.5 font-mono">
                          <p className="text-zinc-400 flex items-center gap-1">
                            <span className="text-zinc-500">Joined: </span>
                            <span className="text-zinc-200 font-semibold">{m.joinedDate || m.startDate}</span>
                          </p>
                          <p className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-zinc-500">Valid Till: </span>
                            <strong className={`font-bold ${
                              isExpired ? 'text-rose-400' : isExpiring ? 'text-amber-400' : 'text-emerald-400'
                            }`}>
                              {m.expiryDate}
                            </strong>
                            {isExpiring && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                {daysLeft === 0 ? 'Today' : daysLeft === 1 ? '1d left' : `${daysLeft}d left`}
                              </span>
                            )}
                            {isExpired && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                Expired
                              </span>
                            )}
                          </p>
                        </div>
                      </td>

                      {/* Last Fees Paid */}
                      <td className={`px-3.5 ${viewDensity === 'compact' ? 'py-2' : 'py-3.5'}`}>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-emerald-400 text-sm tracking-tight">
                              ₹{(m.lastFeesPaid !== undefined ? m.lastFeesPaid : m.paidAmount).toLocaleString('en-IN')}
                            </span>
                            {(m.lastFeesPaid ?? m.paidAmount) > 0 ? (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                Paid
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-zinc-800 text-zinc-400 border border-zinc-700">
                                ₹0
                              </span>
                            )}
                          </div>
                          {hasDues ? (
                            <span className="font-mono text-rose-400 text-[10px] font-semibold mt-0.5">
                              Due: ₹{m.pendingAmount.toLocaleString('en-IN')}
                            </span>
                          ) : (
                            <span className="text-[10px] text-zinc-500 mt-0.5 font-medium">
                              {(m.lastFeesPaid ?? m.paidAmount) > 0 ? 'Last payment recorded' : 'No payment recorded'}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className={`px-3.5 ${viewDensity === 'compact' ? 'py-2' : 'py-3.5'}`}>
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                          effectiveStatus === 'active' || effectiveStatus === 'fully_paid'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : effectiveStatus === 'expiring_soon'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : effectiveStatus === 'payment_due'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            effectiveStatus === 'active' || effectiveStatus === 'fully_paid'
                              ? 'bg-emerald-400'
                              : effectiveStatus === 'expiring_soon'
                              ? 'bg-amber-400 animate-pulse'
                              : effectiveStatus === 'payment_due'
                              ? 'bg-rose-400'
                              : 'bg-zinc-500'
                          }`} />
                          {effectiveStatus === 'expiring_soon' ? 'EXPIRING SOON' : effectiveStatus === 'expired' ? 'EXPIRED' : effectiveStatus.replace('_', ' ')}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className={`px-3.5 text-right whitespace-nowrap ${viewDensity === 'compact' ? 'py-2' : 'py-3.5'}`}>
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Dedicated Open Profile Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProfileMemberId(m.id);
                            }}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 bg-orange-400/15 hover:bg-orange-400 text-orange-300 hover:text-black border border-orange-400/40 shadow-sm"
                            title="Open Full Member Profile & CRM Dashboard"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Profile</span>
                          </button>

                          {/* Live Camera Photo Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPhotoCaptureMember(m);
                            }}
                            className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                              m.photoUrl
                                ? 'bg-zinc-800 text-orange-400 hover:bg-zinc-700 border border-zinc-700'
                                : 'bg-orange-400/20 text-orange-300 border border-orange-400/40 hover:bg-orange-400 hover:text-black'
                            }`}
                            title={m.photoUrl ? 'Update Live Photo' : 'Take Live Camera Photo'}
                          >
                            <Camera className="w-3.5 h-3.5" />
                            <span className="hidden 2xl:inline">{m.photoUrl ? 'Photo' : 'Snap'}</span>
                          </button>

                          {/* Quick Renew Button with WhatsApp Automation */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenRenew(m);
                            }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95 group/renew ${
                              isExpiring || isExpired
                                ? 'bg-amber-500/20 hover:bg-amber-500/35 text-amber-200 border border-amber-500/50 hover:border-amber-400 shadow-amber-500/10'
                                : 'bg-emerald-500/20 hover:bg-emerald-500/35 text-emerald-300 hover:text-emerald-100 border border-emerald-500/50 hover:border-emerald-400 shadow-emerald-500/10'
                            }`}
                            title={`Renew membership & send WhatsApp confirmation to ${m.fullName}`}
                          >
                            <RefreshCw className="w-3.5 h-3.5 text-emerald-400 group-hover/renew:rotate-180 transition-transform duration-500" />
                            <span>Renew</span>
                            <span className="text-[9px] font-mono uppercase px-1 py-0.2 rounded bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 hidden md:inline">WA</span>
                          </button>

                          {/* WhatsApp Direct & Integration Messenger */}
                          <a
                            href="#whatsapp-message"
                            role="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleOpenWhatsAppModal(m);
                            }}
                            className="p-1.5 text-emerald-400 hover:text-emerald-200 bg-emerald-500/15 hover:bg-emerald-500/30 border border-emerald-500/40 hover:border-emerald-400 rounded-lg transition-all shadow-sm hover:shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-1 group/wa"
                            title="WhatsApp Integration: Send Renewal, Birthday, Due Alert or Custom Message"
                          >
                            <MessageSquare className="w-3.5 h-3.5 group-hover/wa:scale-110 transition-transform" />
                          </a>

                          {/* Edit */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEdit(m);
                            }}
                            className="p-1.5 text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition"
                            title="Edit Profile"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`Are you sure you want to delete member ${m.fullName}?`)) {
                                deleteMember(m.id);
                              }
                            }}
                            className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                            title="Delete Member"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Member Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-700 rounded-3xl p-6 space-y-5 shadow-2xl my-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-lg font-black text-white font-display">NEW MEMBER REGISTRATION</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmitAdd} className="space-y-4 text-xs">
              {/* Athlete Live Camera Photo Capture */}
              <MemberPhotoPicker
                photoUrl={formData.photoUrl}
                onChange={(url) => setFormData({ ...formData, photoUrl: url })}
                memberName={formData.fullName || 'New Member'}
                label="Athlete ID Photo (Live Camera Snap)"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-zinc-400 uppercase mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikram Rao"
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-400 uppercase mb-1">Phone / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 9845012345"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value, whatsapp: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-zinc-400 uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="member@gmail.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-400 uppercase mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-400 focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-zinc-400 uppercase mb-1">Membership Plan *</label>
                  <select
                    value={formData.packageId}
                    onChange={e => {
                      const id = e.target.value;
                      const selected = packages.find(p => p.id === id);
                      setFormData({
                        ...formData,
                        packageId: id,
                        paidAmount: selected?.price || formData.paidAmount
                      });
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
                  <label className="block font-semibold text-zinc-400 uppercase mb-1">Admission Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-zinc-400 uppercase mb-1">Last Fees Paid (INR) *</label>
                  <input
                    type="number"
                    value={formData.paidAmount}
                    onChange={e => setFormData({ ...formData, paidAmount: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono focus:border-orange-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-400 uppercase mb-1">Member Address / Landmark</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-400 uppercase mb-1">Health Notes / Goals</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Muscle hypertrophy, general fitness"
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-400 focus:outline-none"
                />
              </div>

              {/* DPDP Act 2023 Consent Collection */}
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2.5">
                <div className="flex items-center gap-1.5 text-zinc-300 font-bold text-xs">
                  <Shield className="w-3.5 h-3.5 text-orange-400" />
                  <span>Member Data Protection & Consent (DPDP Act 2023)</span>
                </div>
                
                <div className="space-y-1.5 text-[11px] text-zinc-400">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentMembership}
                      onChange={e => setConsentMembership(e.target.checked)}
                      className="mt-0.5 w-3.5 h-3.5 accent-orange-500 rounded"
                    />
                    <span><strong className="text-zinc-200">Required: </strong>Consent to store member profile and issue digital ID access pass.</span>
                  </label>

                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentWhatsAppUpdates}
                      onChange={e => setConsentWhatsAppUpdates(e.target.checked)}
                      className="mt-0.5 w-3.5 h-3.5 accent-orange-500 rounded"
                    />
                    <span><strong className="text-zinc-200">Transactional: </strong>Receive automated WhatsApp GST tax receipts and renewal notifications.</span>
                  </label>

                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentFitnessGuidance}
                      onChange={e => setConsentFitnessGuidance(e.target.checked)}
                      className="mt-0.5 w-3.5 h-3.5 accent-orange-500 rounded"
                    />
                    <span><strong className="text-zinc-200">Fitness: </strong>Gym floor fitness guidance and exercise safety logs.</span>
                  </label>

                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentPromotions}
                      onChange={e => setConsentPromotions(e.target.checked)}
                      className="mt-0.5 w-3.5 h-3.5 accent-orange-500 rounded"
                    />
                    <span><strong className="text-zinc-200">Marketing: </strong>Receive festival discounts and anniversary celebration broadcasts.</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-orange-400 hover:bg-orange-300 text-black font-extrabold rounded-xl transition uppercase tracking-wider shadow-lg shadow-orange-400/20"
              >
                Register Member & Auto-Send WhatsApp Receipt
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {isEditModalOpen && activeMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-700 rounded-3xl p-6 space-y-5 shadow-2xl my-6">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-lg font-black text-white font-display">EDIT MEMBER PROFILE: {activeMember.memberCode}</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmitEdit} className="space-y-4 text-xs">
              {/* Athlete Live Camera Photo Capture in Edit Modal */}
              <MemberPhotoPicker
                photoUrl={formData.photoUrl}
                onChange={(url) => setFormData({ ...formData, photoUrl: url })}
                memberName={formData.fullName || activeMember.fullName}
                label="Athlete ID Photo (Live Camera Snap)"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-zinc-400 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-400 uppercase mb-1">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value, whatsapp: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-zinc-400 uppercase mb-1">Membership Plan</label>
                  <select
                    value={formData.packageId}
                    onChange={e => setFormData({ ...formData, packageId: e.target.value })}
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
                  <label className="block font-semibold text-zinc-400 uppercase mb-1">Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-400 uppercase mb-1">Health Notes / Goals</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-orange-400 hover:bg-orange-300 text-black font-extrabold rounded-xl transition uppercase tracking-wider"
              >
                Save Member Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Renew Modal with WhatsApp Integration */}
      {isRenewModalOpen && activeMember && (() => {
        const currentPkg = packages.find(p => p.id === renewPkgId) || packages[0];
        const currentExpiry = new Date(activeMember.expiryDate);
        const now = new Date();
        const baseDate = currentExpiry > now ? currentExpiry : now;
        const calculatedNewExpiry = new Date(baseDate);
        calculatedNewExpiry.setMonth(calculatedNewExpiry.getMonth() + (currentPkg?.durationMonths || 12));
        const calculatedNewExpiryStr = calculatedNewExpiry.toISOString().split('T')[0];
        const memberPhone = activeMember.whatsapp || activeMember.phone || '+91 98803 97294';

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-3xl p-6 space-y-4 shadow-2xl my-8">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <RefreshCw className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                      RENEW MEMBERSHIP PLAN
                    </h3>
                    <p className="text-[11px] text-zinc-400">
                      {activeMember.fullName} • <span className="font-mono text-zinc-300">{activeMember.memberCode}</span>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsRenewModalOpen(false)}
                  className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Renewal Expiry & Target Card */}
              <div className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl bg-zinc-950 border border-zinc-800/80 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-0.5">Current Expiry</span>
                  <div className="font-mono text-zinc-300 font-bold">
                    {activeMember.expiryDate}
                  </div>
                </div>
                <div className="border-l border-zinc-800 pl-3">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-0.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> New Expiry (+{currentPkg?.durationMonths || 12} Mo)
                  </span>
                  <div className="font-mono text-emerald-300 font-bold">
                    {calculatedNewExpiryStr}
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmitRenew} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-zinc-400 uppercase mb-1">Renewal Package</label>
                  <select
                    value={renewPkgId}
                    onChange={e => handleRenewPkgChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-emerald-500 focus:outline-none"
                  >
                    {packages.map(pkg => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} ({pkg.durationMonths} Mo) — ₹{pkg.price.toLocaleString('en-IN')}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-zinc-400 uppercase mb-1">Amount Paid (INR)</label>
                    <input
                      type="number"
                      value={renewPaidAmount}
                      onChange={e => {
                        const val = Number(e.target.value);
                        setRenewPaidAmount(val);
                        if (activeMember && currentPkg) {
                          setRenewCustomMessage(generateRenewalWhatsAppText(activeMember, currentPkg, val, renewPaymentMethod, calculatedNewExpiryStr));
                        }
                      }}
                      className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-400 uppercase mb-1">Payment Method</label>
                    <div className="grid grid-cols-3 gap-1">
                      {(['UPI', 'Card', 'Cash'] as const).map(mode => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => handleRenewPaymentMethodChange(mode)}
                          className={`py-2 rounded-xl border text-center font-bold transition text-[11px] ${
                            renewPaymentMethod === mode
                              ? 'bg-emerald-500 text-black border-emerald-500'
                              : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* WhatsApp Renewal Message Dispatch Section */}
                <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={renewSendWhatsApp}
                        onChange={e => setRenewSendWhatsApp(e.target.checked)}
                        className="w-4 h-4 rounded text-emerald-500 bg-zinc-900 border-zinc-700 focus:ring-emerald-500"
                      />
                      <span className="font-bold text-emerald-300 text-xs flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                        Send WhatsApp Confirmation
                      </span>
                    </label>

                    <span className="text-[10px] font-mono text-emerald-400/90 bg-emerald-900/40 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      📱 {memberPhone}
                    </span>
                  </div>

                  {renewSendWhatsApp && (
                    <div className="space-y-1.5">
                      <div className="text-[11px] text-zinc-400">
                        Message will be sent to <strong className="text-white">{activeMember.fullName}</strong> upon renewal:
                      </div>
                      <textarea
                        rows={5}
                        value={renewCustomMessage}
                        onChange={e => setRenewCustomMessage(e.target.value)}
                        className="w-full px-3 py-2 bg-zinc-950 border border-emerald-500/30 rounded-xl text-zinc-200 text-xs font-mono leading-relaxed focus:border-emerald-400 focus:outline-none resize-none"
                      />
                    </div>
                  )}
                </div>

                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={isRenewing}
                    className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-extrabold rounded-xl transition uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 text-xs cursor-pointer"
                  >
                    {isRenewing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-black" />
                        <span>Processing Renewal & WhatsApp...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-black" />
                        <span>Confirm Renewal & Send WhatsApp Message</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      })()}

      {/* Bulk Member File Upload / Ingest Modal */}
      <MemberBulkUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />

      {/* Direct Live Camera Snapshot Modal for Individual Member */}
      {photoCaptureMember && (
        <LiveCameraModal
          isOpen={!!photoCaptureMember}
          onClose={() => setPhotoCaptureMember(null)}
          onCapture={handleDirectPhotoCapture}
          title={`Live Photo Capture: ${photoCaptureMember.fullName}`}
          subtitle={`Position member in camera frame for ID badge (${photoCaptureMember.memberCode})`}
          currentPhotoUrl={photoCaptureMember.photoUrl}
          memberName={photoCaptureMember.fullName}
        />
      )}

      {/* Photo Preview / Lightbox Modal */}
      {previewPhotoMember && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          onClick={() => setPreviewPhotoMember(null)}
        >
          <div
            className="relative bg-zinc-900 border border-zinc-700 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <div>
                <h3 className="font-bold text-white text-base leading-tight font-display">
                  {previewPhotoMember.fullName}
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-orange-400 font-mono">
                    {previewPhotoMember.memberCode} • {previewPhotoMember.packageName}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Database Synced
                  </span>
                </div>
              </div>
              <button
                onClick={() => setPreviewPhotoMember(null)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full aspect-square rounded-2xl overflow-hidden border-2 border-orange-400/80 bg-black shadow-inner flex items-center justify-center relative">
              {previewPhotoMember.photoUrl ? (
                <img
                  src={previewPhotoMember.photoUrl}
                  alt={previewPhotoMember.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-zinc-500 p-6 space-y-2">
                  <Users className="w-12 h-12 mx-auto text-zinc-600" />
                  <p className="text-sm font-semibold text-zinc-400">No photo uploaded yet</p>
                  <p className="text-xs text-zinc-500">Take a live photo or upload from your device below</p>
                </div>
              )}
            </div>

            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleTriggerQuickUpload(previewPhotoMember)}
                  className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 border border-zinc-700"
                >
                  <Upload className="w-3.5 h-3.5 text-orange-400" />
                  <span>Upload Photo File</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const m = previewPhotoMember;
                    setPreviewPhotoMember(null);
                    setPhotoCaptureMember(m);
                  }}
                  className="flex-1 py-2.5 bg-orange-400 hover:bg-orange-300 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 shadow-md shadow-orange-400/20"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>{previewPhotoMember.photoUrl ? 'Retake Live' : 'Take Live'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1">
                {previewPhotoMember.photoUrl ? (
                  <button
                    type="button"
                    onClick={() => {
                      updateMember(previewPhotoMember.id, { photoUrl: '' });
                      setPreviewPhotoMember(null);
                    }}
                    className="px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl transition flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove Photo</span>
                  </button>
                ) : <div />}

                <button
                  type="button"
                  onClick={() => setPreviewPhotoMember(null)}
                  className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs rounded-xl transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden file input for direct photo upload */}
      <input
        ref={quickFileInputRef}
        type="file"
        accept="image/*"
        onChange={handleQuickFileChange}
        className="hidden"
      />

      {/* WhatsApp Integration Messenger Modal */}
      {whatsAppModalMember && (
        <MemberWhatsAppModal
          isOpen={!!whatsAppModalMember}
          member={whatsAppModalMember}
          defaultType={whatsAppDefaultType}
          onClose={() => setWhatsAppModalMember(null)}
        />
      )}

    </div>
  );
};
