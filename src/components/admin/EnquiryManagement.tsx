import React, { useState, useMemo } from 'react';
import { useGym } from '../../context/GymContext';
import { Enquiry, LeadStatus, ReferralSource, PaymentMethod } from '../../types';
import { normalizeEnquiry, addDaysToDate } from '../../utils/enquiryFollowUp';
import {
  UserPlus,
  Search,
  Plus,
  Filter,
  Phone,
  MessageSquare,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  UserCheck,
  Calendar,
  AlertCircle,
  HelpCircle,
  Tag,
  Share2,
  Check,
  StopCircle,
  Play,
  Send,
  Loader2,
  Info,
  History,
  ShieldAlert
} from 'lucide-react';

export const EnquiryManagement: React.FC = () => {
  const {
    enquiries,
    packages,
    trainers,
    settings,
    addEnquiry,
    updateEnquiry,
    deleteEnquiry,
    convertEnquiryToMember,
    sendWhatsAppMessage
  } = useGym();

  const [searchInput, setSearchInput] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');

  // Pagination state (25 leads per page)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 25;

  // 300ms debounce for search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isConvertModalOpen, setIsConvertModalOpen] = useState<boolean>(false);
  const [activeEnquiry, setActiveEnquiry] = useState<Enquiry | null>(null);

  // Follow-Up Sequence & Details Modal State
  const [selectedFollowUpEnquiry, setSelectedFollowUpEnquiry] = useState<Enquiry | null>(null);
  const [isManualMsgModalOpen, setIsManualMsgModalOpen] = useState<boolean>(false);
  const [manualMsgText, setManualMsgText] = useState<string>('');
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false);
  const [actionNotice, setActionNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Helper date formatter: e.g. "10 Sep 2026"
  const formatDateDisplay = (dateStr?: string | null): string => {
    if (!dateStr) return 'NONE';
    try {
      const parts = dateStr.split('T')[0].split('-').map(Number);
      if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
        const d = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
        return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
      }
    } catch {}
    return dateStr;
  };

  // New Lead Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    whatsapp: '',
    age: 24,
    gender: 'Male' as Enquiry['gender'],
    fitnessGoal: 'Muscle Hypertrophy & Strength',
    referralSource: 'Walk-in' as ReferralSource,
    preferredPackageId: packages[0]?.id || '',
    budget: '₹10,000 - ₹16,000',
    notes: 'Visited gym floor, interested in morning timings',
    injuries: 'None reported'
  });

  // Convert to Member Form State
  const [convertPkgId, setConvertPkgId] = useState<string>(packages[0]?.id || '');
  const [convertPaidAmount, setConvertPaidAmount] = useState<number>(packages[0]?.price || 15999);
  const [convertMethod, setConvertMethod] = useState<PaymentMethod>('UPI');

  // Filtered enquiries
  const filteredEnquiries = useMemo(() => {
    return enquiries.filter(e => {
      if (statusFilter !== 'all' && e.status !== statusFilter) return false;
      if (sourceFilter !== 'all' && e.referralSource !== sourceFilter) return false;

      if (debouncedSearch.trim()) {
        const q = debouncedSearch.toLowerCase();
        const matchesCode = e.enquiryCode.toLowerCase().includes(q);
        const matchesName = e.name.toLowerCase().includes(q);
        const matchesPhone = e.phone.includes(q) || e.whatsapp.includes(q);
        const matchesGoal = e.fitnessGoal?.toLowerCase().includes(q);
        if (!matchesCode && !matchesName && !matchesPhone && !matchesGoal) return false;
      }
      return true;
    });
  }, [enquiries, statusFilter, sourceFilter, debouncedSearch]);

  // Derived paginated slice
  const totalPages = Math.max(1, Math.ceil(filteredEnquiries.length / pageSize));
  const paginatedEnquiries = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredEnquiries.slice(start, start + pageSize);
  }, [filteredEnquiries, currentPage, pageSize]);

  // Lead Conversion Stats
  const totalLeads = enquiries.length;
  const convertedLeads = enquiries.filter(e => e.status === 'Converted to Member').length;
  const conversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;
  const pendingFollowUps = enquiries.filter(e => e.status === 'Follow-up Required' || e.status === 'Interested').length;

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      phone: '',
      whatsapp: '',
      age: 24,
      gender: 'Male',
      fitnessGoal: 'Muscle Hypertrophy & Strength',
      referralSource: 'Walk-in',
      preferredPackageId: packages[0]?.id || '',
      budget: '₹10,000 - ₹16,000',
      notes: 'Interested in annual membership and evening batch',
      injuries: 'None'
    });
    setIsAddModalOpen(true);
  };

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const pkg = packages.find(p => p.id === formData.preferredPackageId);

    addEnquiry({
      name: formData.name,
      phone: formData.phone,
      whatsapp: formData.whatsapp || formData.phone,
      age: formData.age,
      gender: formData.gender,
      fitnessGoal: formData.fitnessGoal,
      referralSource: formData.referralSource,
      preferredPackageId: pkg?.id,
      preferredPackageName: pkg?.name,
      budget: formData.budget,
      notes: formData.notes,
      injuries: formData.injuries,
      status: 'New Lead'
    });

    setIsAddModalOpen(false);
  };

  // Open 1-Click Convert Modal
  const handleOpenConvert = (enquiry: Enquiry) => {
    setActiveEnquiry(enquiry);
    const targetPkg = packages.find(p => p.id === enquiry.preferredPackageId) || packages[0];
    setConvertPkgId(targetPkg?.id || 'pkg-12');
    setConvertPaidAmount(targetPkg?.price || 9999);
    setConvertMethod('UPI');
    setIsConvertModalOpen(true);
  };

  // Submit Conversion
  const handleSubmitConvert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEnquiry) return;

    convertEnquiryToMember(
      activeEnquiry.id,
      convertPkgId,
      convertPaidAmount,
      convertMethod
    );

    setIsConvertModalOpen(false);
  };

  const handleStopFollowUp = async (enquiryId: string) => {
    setIsActionLoading(true);
    setActionNotice(null);
    try {
      updateEnquiry(enquiryId, {
        followUpStopped: true,
        followUpStatus: 'STOPPED',
        nextFollowUpAt: null
      });
      setActionNotice({ type: 'success', message: 'Follow-up sequence stopped successfully.' });
      if (selectedFollowUpEnquiry && selectedFollowUpEnquiry.id === enquiryId) {
        setSelectedFollowUpEnquiry({
          ...selectedFollowUpEnquiry,
          followUpStopped: true,
          followUpStatus: 'STOPPED',
          nextFollowUpAt: null
        });
      }
    } catch (err: any) {
      setActionNotice({ type: 'error', message: err?.message || 'Error stopping follow-ups' });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleResumeFollowUp = async (enquiryId: string) => {
    setIsActionLoading(true);
    setActionNotice(null);
    try {
      updateEnquiry(enquiryId, {
        followUpStopped: false,
        followUpStatus: 'PENDING'
      });
      setActionNotice({ type: 'success', message: 'Follow-up sequence resumed successfully.' });
      if (selectedFollowUpEnquiry && selectedFollowUpEnquiry.id === enquiryId) {
        const norm = normalizeEnquiry({ ...selectedFollowUpEnquiry, followUpStopped: false, followUpStatus: 'PENDING' });
        setSelectedFollowUpEnquiry(norm);
      }
    } catch (err: any) {
      setActionNotice({ type: 'error', message: err?.message || 'Error resuming follow-ups' });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleSendManualWhatsAppMsg = async () => {
    if (!selectedFollowUpEnquiry || !manualMsgText.trim()) return;
    setIsActionLoading(true);
    setActionNotice(null);
    try {
      const recipientPhone = selectedFollowUpEnquiry.whatsapp || selectedFollowUpEnquiry.phone;
      const res = await sendWhatsAppMessage(
        recipientPhone,
        selectedFollowUpEnquiry.name,
        manualMsgText.trim(),
        'custom',
        { memberId: selectedFollowUpEnquiry.id }
      );
      if (res.success) {
        setActionNotice({ type: 'success', message: 'Custom WhatsApp message sent successfully!' });
        setManualMsgText('');
        setIsManualMsgModalOpen(false);
      } else {
        setActionNotice({ type: 'error', message: res.error || 'Failed to send message.' });
      }
    } catch (err: any) {
      setActionNotice({ type: 'error', message: err?.message || 'Error sending message' });
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div className="space-y-6" id="bsf-admin-enquiry-management">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white font-display tracking-wide flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-orange-400" />
            LEADS & ENQUIRY CRM ({enquiries.length})
          </h2>
          <p className="text-xs text-zinc-400 font-sans-body">
            Capture gym walk-ins, track prospect pipeline, schedule follow-ups, and convert to active members with 1-click.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-orange-400 hover:bg-orange-300 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-orange-400/20 flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Lead Walk-In</span>
        </button>
      </div>

      {/* CRM Funnel Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Total Leads</span>
            <p className="font-display font-black text-2xl text-white mt-1">{totalLeads}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <UserPlus className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Converted Members</span>
            <p className="font-display font-black text-2xl text-emerald-400 mt-1">{convertedLeads}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Conversion Rate</span>
            <p className="font-display font-black text-2xl text-orange-400 mt-1">{conversionRate}%</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-400/10 border border-orange-400/30 flex items-center justify-center text-orange-400">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Follow-Up Queue</span>
            <p className="font-display font-black text-2xl text-rose-400 mt-1">{pendingFollowUps}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl">
        <div className="sm:col-span-6 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by prospect name, phone, enquiry code, or fitness goal..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs placeholder:text-zinc-500 focus:border-orange-400 focus:outline-none"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-300 text-xs focus:border-orange-400 focus:outline-none"
          >
            <option value="all">All Pipeline Stages</option>
            <option value="New Lead">New Lead</option>
            <option value="Interested">Interested / In Negotiation</option>
            <option value="Follow-up Required">Follow-up Required</option>
            <option value="Converted to Member">Converted to Member</option>
            <option value="Not Interested">Not Interested / Closed</option>
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={sourceFilter}
            onChange={e => { setSourceFilter(e.target.value); setCurrentPage(1); }}
            className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-300 text-xs focus:border-orange-400 focus:outline-none"
          >
            <option value="all">All Referral Sources</option>
            <option value="Walk-in">Walk-in</option>
            <option value="Instagram">Instagram</option>
            <option value="Google">Google Search / Maps</option>
            <option value="Friend/Referral">Friend / Member Referral</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/80 text-zinc-400 uppercase text-[10px] font-bold tracking-wider">
                <th className="py-3.5 px-4">Enquiry ID & Name</th>
                <th className="py-3.5 px-4">Contact Info</th>
                <th className="py-3.5 px-4">WhatsApp Sequence (Day 7, 15, 30, 45)</th>
                <th className="py-3.5 px-4">Fitness Goal</th>
                <th className="py-3.5 px-4">Interested Plan</th>
                <th className="py-3.5 px-4">Lead Source</th>
                <th className="py-3.5 px-4">Pipeline Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-sans-body">
              {paginatedEnquiries.map(e => {
                const norm = normalizeEnquiry(e);
                const count = norm.followUpCount || 0;
                const isCompleted = norm.followUpStatus === 'COMPLETED' || norm.followUpStage === 'DAY_45_COMPLETED';
                const isStopped = norm.followUpStopped && !isCompleted;

                return (
                  <tr key={e.id} className="hover:bg-zinc-800/30 transition">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-white text-sm">{e.name}</p>
                      <span className="text-[10px] text-orange-400 font-mono">{e.enquiryCode}</span>
                      <span className="text-[10px] text-zinc-500 block">Created: {formatDateDisplay(norm.enquiryCreatedAt || e.createdAt)}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-mono text-zinc-200">{e.phone}</p>
                      <p className="text-[10px] text-zinc-400">{e.gender}, {e.age || 25} yrs</p>
                    </td>

                    {/* BSF 4-Stage Follow-Up Sequence Column */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                            isCompleted
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : isStopped
                              ? 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                              : norm.followUpStatus === 'FAILED'
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                              : 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                          }`}>
                            {norm.followUpStatus?.replace(/_/g, ' ') || 'PENDING'}
                          </span>
                          <span className="font-mono text-[10px] text-zinc-300 font-bold bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800">
                            {count} / 4
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-400">
                          Next: <span className="text-white font-semibold font-mono">{isCompleted || isStopped ? 'NONE' : formatDateDisplay(norm.nextFollowUpAt)}</span>
                        </p>
                        <button
                          type="button"
                          onClick={() => setSelectedFollowUpEnquiry(norm)}
                          className="text-[10px] text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1 transition mt-0.5"
                          title="View 4-stage sequence schedule and admin controls"
                        >
                          <History className="w-3 h-3" />
                          <span>Sequence Details</span>
                        </button>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-zinc-300">
                      <p className="font-medium text-white">{e.fitnessGoal || 'General Fitness'}</p>
                      {e.injuries && e.injuries !== 'None' && (
                        <span className="text-[10px] text-orange-400 block font-sans-body">Note: {e.injuries}</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-zinc-300">
                      {e.preferredPackageName || 'Annual Elite'}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">
                        {e.referralSource}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        e.status === 'Converted to Member'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : e.status === 'Interested' || e.status === 'Follow-up Required'
                          ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}>
                        {e.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedFollowUpEnquiry(norm)}
                          className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition"
                          title="View Sequence & Controls"
                        >
                          <Clock className="w-4 h-4 text-orange-400" />
                        </button>

                        {e.status !== 'Converted to Member' ? (
                          <button
                            onClick={() => handleOpenConvert(e)}
                            className="px-3 py-1.5 bg-orange-400 hover:bg-orange-300 text-black font-extrabold text-[11px] rounded-lg transition shadow flex items-center gap-1"
                            title="Convert to full member in 1 click"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Convert</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Enrolled
                          </span>
                        )}

                        <a
                          href={`https://wa.me/91${(e.whatsapp || e.phone).replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(e.name)},%20this%20is%20Blackstone%20Fitness!`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-lg transition"
                          title="Chat on WhatsApp"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Leads Table Pagination Bar */}
        {filteredEnquiries.length > pageSize && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-zinc-950/70 border-t border-zinc-800 text-xs">
            <div className="text-zinc-400">
              Showing <span className="font-bold text-white font-mono">{(currentPage - 1) * pageSize + 1}</span> to{' '}
              <span className="font-bold text-white font-mono">{Math.min(filteredEnquiries.length, currentPage * pageSize)}</span> of{' '}
              <span className="font-bold text-orange-400 font-mono">{filteredEnquiries.length}</span> leads
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:hover:bg-zinc-800 text-zinc-200 hover:text-white rounded-lg font-semibold transition border border-zinc-700 text-xs"
              >
                Previous
              </button>
              <span className="px-2 text-zinc-400 font-mono text-xs">
                Page <span className="text-white font-bold">{currentPage}</span> of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:hover:bg-zinc-800 text-zinc-200 hover:text-white rounded-lg font-semibold transition border border-zinc-700 text-xs"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Lead Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl bg-zinc-900 border border-zinc-700 rounded-3xl p-6 space-y-5 shadow-2xl my-6">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-lg font-black text-white font-display">RECORD NEW LEAD / WALK-IN</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmitAdd} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-zinc-400 uppercase mb-1">Prospect Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Gowda"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-400 uppercase mb-1">Phone / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 9845011223"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value, whatsapp: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-zinc-400 uppercase mb-1">Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={e => setFormData({ ...formData, age: Number(e.target.value) })}
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
                <div>
                  <label className="block font-semibold text-zinc-400 uppercase mb-1">Lead Source</label>
                  <select
                    value={formData.referralSource}
                    onChange={e => setFormData({ ...formData, referralSource: e.target.value as ReferralSource })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-400 focus:outline-none"
                  >
                    <option value="Walk-in">Walk-in</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Google">Google / Maps</option>
                    <option value="Friend/Referral">Friend / Referral</option>
                    <option value="Advertisement">Advertisement</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-400 uppercase mb-1">Primary Fitness Goal</label>
                <input
                  type="text"
                  placeholder="e.g. Fat loss 8kg, Hypertrophy, Strength conditioning"
                  value={formData.fitnessGoal}
                  onChange={e => setFormData({ ...formData, fitnessGoal: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-zinc-400 uppercase mb-1">Interested Membership</label>
                  <select
                    value={formData.preferredPackageId}
                    onChange={e => setFormData({ ...formData, preferredPackageId: e.target.value })}
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
                  <label className="block font-semibold text-zinc-400 uppercase mb-1">Medical Issues / Injuries</label>
                  <input
                    type="text"
                    placeholder="e.g. None, Lower back soreness"
                    value={formData.injuries}
                    onChange={e => setFormData({ ...formData, injuries: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-400 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-orange-400 hover:bg-orange-300 text-black font-extrabold rounded-xl transition uppercase tracking-wider shadow-lg shadow-orange-400/20"
              >
                Log Lead into Pipeline
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 1-Click Convert to Full Member Modal */}
      {isConvertModalOpen && activeEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-3xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-lg font-black text-white font-display">1-CLICK CONVERT LEAD TO MEMBER</h3>
              <button onClick={() => setIsConvertModalOpen(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs space-y-1">
              <p className="text-zinc-400">Prospect: <strong className="text-white">{activeEnquiry.name}</strong> ({activeEnquiry.phone})</p>
              <p className="text-zinc-400">Goal: <span className="text-orange-400">{activeEnquiry.fitnessGoal}</span></p>
            </div>

            <form onSubmit={handleSubmitConvert} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-zinc-400 uppercase mb-1">Select Enrolling Package *</label>
                <select
                  value={convertPkgId}
                  onChange={e => {
                    const id = e.target.value;
                    setConvertPkgId(id);
                    const selected = packages.find(p => p.id === id);
                    if (selected) setConvertPaidAmount(selected.price);
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-zinc-400 uppercase mb-1">Paid Amount (INR)</label>
                  <input
                    type="number"
                    value={convertPaidAmount}
                    onChange={e => setConvertPaidAmount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono font-bold focus:border-orange-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-zinc-400 uppercase mb-1">Payment Method</label>
                  <select
                    value={convertMethod}
                    onChange={e => setConvertMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-400 focus:outline-none"
                  >
                    <option value="UPI">UPI</option>
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold rounded-xl transition uppercase tracking-wider shadow-lg shadow-emerald-400/20"
              >
                Enroll Member & Generate Receipt
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Follow-Up Sequence & Admin Controls Modal */}
      {selectedFollowUpEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-700 rounded-3xl p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-orange-400" />
                <h3 className="text-base font-black text-white font-display">WHATSAPP FOLLOW-UP TIMELINE</h3>
              </div>
              <button
                onClick={() => {
                  setSelectedFollowUpEnquiry(null);
                  setActionNotice(null);
                }}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {actionNotice && (
              <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                actionNotice.type === 'success'
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
              }`}>
                {actionNotice.type === 'success' ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                <span>{actionNotice.message}</span>
              </div>
            )}

            {/* Candidate Summary Card */}
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h4 className="font-bold text-white text-sm">{selectedFollowUpEnquiry.name}</h4>
                  <p className="text-xs text-zinc-400 font-mono">{selectedFollowUpEnquiry.phone} • {selectedFollowUpEnquiry.enquiryCode}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${
                    selectedFollowUpEnquiry.followUpStatus === 'COMPLETED'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : selectedFollowUpEnquiry.followUpStopped
                      ? 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                      : 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                  }`}>
                    {selectedFollowUpEnquiry.followUpStatus || 'PENDING'}
                  </span>
                  <span className="font-mono text-xs font-bold bg-zinc-900 px-2 py-1 rounded border border-zinc-800 text-zinc-300">
                    {selectedFollowUpEnquiry.followUpCount || 0} / 4 Sent
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-zinc-850 text-xs">
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase font-bold">Enquiry Created</span>
                  <span className="text-white font-mono font-semibold">{formatDateDisplay(selectedFollowUpEnquiry.enquiryCreatedAt || selectedFollowUpEnquiry.createdAt)}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase font-bold">Current Stage</span>
                  <span className="text-orange-400 font-semibold">{selectedFollowUpEnquiry.followUpStage || 'DAY_7'}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase font-bold">Next Follow-Up</span>
                  <span className="text-white font-mono font-semibold">
                    {selectedFollowUpEnquiry.followUpStopped || selectedFollowUpEnquiry.followUpStatus === 'COMPLETED'
                      ? 'NONE'
                      : formatDateDisplay(selectedFollowUpEnquiry.nextFollowUpAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* 4-Stage Timeline Schedule */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-orange-400" />
                <span>4-Stage Sequence Progression</span>
              </h4>

              <div className="space-y-2">
                {[
                  {
                    key: 'day7' as const,
                    title: 'Stage 1: Day 7 Check-in',
                    days: 7,
                    record: selectedFollowUpEnquiry.followUpHistory?.day7,
                    template: settings.enquiryDay7Template || `Hi {name}, this is Blackstone Fitness (BSF). 👋\n\nYou had recently enquired about our gym membership. We just wanted to check if you're still interested.\n\nIf you'd like to know about our plans, timings or membership options, feel free to reply to this message.\n\n— Blackstone Fitness`
                  },
                  {
                    key: 'day15' as const,
                    title: 'Stage 2: Day 15 Follow-Up',
                    days: 15,
                    record: selectedFollowUpEnquiry.followUpHistory?.day15,
                    template: settings.enquiryDay15Template || `Hi {name}, just following up from Blackstone Fitness regarding your earlier enquiry. 💪\n\nIf you're still planning to join a gym, we'd be happy to help you choose a suitable membership plan.\n\nFeel free to message us if you'd like more details.\n\n— Blackstone Fitness`
                  },
                  {
                    key: 'day30' as const,
                    title: 'Stage 3: Day 30 Follow-Up',
                    days: 30,
                    record: selectedFollowUpEnquiry.followUpHistory?.day30,
                    template: settings.enquiryDay30Template || `Hi {name}, this is Blackstone Fitness.\n\nWe're following up regarding your previous gym enquiry. If you're still considering joining, you can contact us anytime and our team will be happy to assist you.\n\nWe'd love to have you train with us. 💪\n\n— Blackstone Fitness`
                  },
                  {
                    key: 'day45' as const,
                    title: 'Stage 4: Day 45 Final Notice',
                    days: 45,
                    record: selectedFollowUpEnquiry.followUpHistory?.day45,
                    template: settings.enquiryDay45Template || `Hi {name}, this is Blackstone Fitness.\n\nThis is our final automatic follow-up regarding your previous enquiry.\n\nIf you're still interested in joining BSF or would like information about our membership plans, feel free to contact us anytime.\n\nThank you for considering Blackstone Fitness. 💪\n\n— Blackstone Fitness`
                  }
                ].map((stage, idx) => {
                  const isSent = stage.record?.status === 'SENT';
                  const isFailed = stage.record?.status === 'FAILED';
                  const origCreated = (selectedFollowUpEnquiry.enquiryCreatedAt || selectedFollowUpEnquiry.createdAt || '').split('T')[0];
                  const scheduledDate = stage.record?.scheduledAt || addDaysToDate(origCreated, stage.days);

                  return (
                    <div
                      key={stage.key}
                      className={`p-3.5 rounded-xl border transition ${
                        isSent
                          ? 'bg-emerald-950/20 border-emerald-500/30'
                          : isFailed
                          ? 'bg-rose-950/20 border-rose-500/30'
                          : 'bg-zinc-950/60 border-zinc-800'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isSent
                              ? 'bg-emerald-500 text-black'
                              : isFailed
                              ? 'bg-rose-500 text-white'
                              : 'bg-zinc-800 text-zinc-400'
                          }`}>
                            {idx + 1}
                          </span>
                          <span className="font-bold text-white text-xs">{stage.title}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono text-zinc-400">
                            Scheduled: <strong className="text-zinc-200">{formatDateDisplay(scheduledDate)}</strong>
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            isSent
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : isFailed
                              ? 'bg-rose-500/20 text-rose-400'
                              : 'bg-zinc-800 text-zinc-400'
                          }`}>
                            {stage.record?.status || 'PENDING'}
                          </span>
                        </div>
                      </div>

                      {stage.record?.sentAt && (
                        <p className="text-[10px] text-emerald-400/80 mt-1 pl-7">
                          Delivered: {new Date(stage.record.sentAt).toLocaleString('en-GB')}
                        </p>
                      )}

                      {stage.record?.error && (
                        <p className="text-[10px] text-rose-400 mt-1 pl-7">
                          Error: {stage.record.error}
                        </p>
                      )}

                      <div className="mt-2 pl-7 pt-2 border-t border-zinc-850/60 text-[11px] text-zinc-400 italic font-mono bg-zinc-900/40 p-2 rounded-lg">
                        "{stage.template.replace(/{name}/g, selectedFollowUpEnquiry.name.split(' ')[0] || 'Friend')}"
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sequence Admin Controls */}
            <div className="pt-3 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {!selectedFollowUpEnquiry.followUpStopped && selectedFollowUpEnquiry.followUpStatus !== 'COMPLETED' ? (
                  <button
                    type="button"
                    disabled={isActionLoading}
                    onClick={() => handleStopFollowUp(selectedFollowUpEnquiry.id)}
                    className="px-3.5 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 font-bold text-xs rounded-xl border border-rose-500/40 transition flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <StopCircle className="w-3.5 h-3.5" />
                    <span>Stop Future Follow-Ups</span>
                  </button>
                ) : selectedFollowUpEnquiry.followUpStatus !== 'COMPLETED' ? (
                  <button
                    type="button"
                    disabled={isActionLoading}
                    onClick={() => handleResumeFollowUp(selectedFollowUpEnquiry.id)}
                    className="px-3.5 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-bold text-xs rounded-xl border border-emerald-500/40 transition flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Resume Follow-Up Sequence</span>
                  </button>
                ) : (
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> 45-Day Sequence Fully Completed
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setManualMsgText(`Hi ${selectedFollowUpEnquiry.name}, this is Blackstone Fitness. `);
                    setIsManualMsgModalOpen(true);
                  }}
                  className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5"
                  title="Send one-off WhatsApp message without altering sequence or resetting schedule"
                >
                  <Send className="w-3.5 h-3.5 text-orange-400" />
                  <span>Send Custom Message</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedFollowUpEnquiry(null);
                  setActionNotice(null);
                }}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Custom WhatsApp Message Modal */}
      {isManualMsgModalOpen && selectedFollowUpEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-orange-400" />
                <h3 className="text-sm font-black text-white font-display">SEND CUSTOM WHATSAPP MESSAGE</h3>
              </div>
              <button onClick={() => setIsManualMsgModalOpen(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs space-y-1">
              <p className="text-zinc-400">Recipient: <strong className="text-white">{selectedFollowUpEnquiry.name}</strong> ({selectedFollowUpEnquiry.phone})</p>
              <p className="text-[10px] text-zinc-500">Note: Manual messages will NOT count toward the 4-stage automated follow-up sequence, nor will they alter the scheduled dates.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">Message Text *</label>
              <textarea
                rows={5}
                value={manualMsgText}
                onChange={e => setManualMsgText(e.target.value)}
                placeholder="Type custom message to send directly via gym WhatsApp socket..."
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs focus:border-orange-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsManualMsgModalOpen(false)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isActionLoading || !manualMsgText.trim()}
                onClick={handleSendManualWhatsAppMsg}
                className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold text-xs rounded-xl transition flex items-center gap-1.5 shadow-lg shadow-emerald-400/20 disabled:opacity-50"
              >
                {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>Send WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
