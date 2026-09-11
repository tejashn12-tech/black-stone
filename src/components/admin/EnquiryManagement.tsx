import React, { useState, useMemo } from 'react';
import { useGym } from '../../context/GymContext';
import { Enquiry, LeadStatus, ReferralSource, PaymentMethod } from '../../types';
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
  Share2
} from 'lucide-react';

export const EnquiryManagement: React.FC = () => {
  const {
    enquiries,
    packages,
    trainers,
    addEnquiry,
    updateEnquiry,
    deleteEnquiry,
    convertEnquiryToMember
  } = useGym();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isConvertModalOpen, setIsConvertModalOpen] = useState<boolean>(false);
  const [activeEnquiry, setActiveEnquiry] = useState<Enquiry | null>(null);

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

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesCode = e.enquiryCode.toLowerCase().includes(q);
        const matchesName = e.name.toLowerCase().includes(q);
        const matchesPhone = e.phone.includes(q) || e.whatsapp.includes(q);
        const matchesGoal = e.fitnessGoal?.toLowerCase().includes(q);
        if (!matchesCode && !matchesName && !matchesPhone && !matchesGoal) return false;
      }
      return true;
    });
  }, [enquiries, statusFilter, sourceFilter, searchQuery]);

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
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs placeholder:text-zinc-500 focus:border-orange-400 focus:outline-none"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
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
            onChange={e => setSourceFilter(e.target.value)}
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
                <th className="py-3.5 px-4">Fitness Goal</th>
                <th className="py-3.5 px-4">Interested Plan</th>
                <th className="py-3.5 px-4">Lead Source</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-sans-body">
              {filteredEnquiries.map(e => (
                <tr key={e.id} className="hover:bg-zinc-800/30 transition">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-white text-sm">{e.name}</p>
                    <span className="text-[10px] text-orange-400 font-mono">{e.enquiryCode}</span>
                    <span className="text-[10px] text-zinc-500 block">Created: {e.createdAt}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <p className="font-mono text-zinc-200">{e.phone}</p>
                    <p className="text-[10px] text-zinc-400">{e.gender}, {e.age || 25} yrs</p>
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
                      {e.status !== 'Converted to Member' ? (
                        <button
                          onClick={() => handleOpenConvert(e)}
                          className="px-3 py-1.5 bg-orange-400 hover:bg-orange-300 text-black font-extrabold text-[11px] rounded-lg transition shadow flex items-center gap-1"
                          title="Convert to full member in 1 click"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Convert to Member</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Enrolled
                        </span>
                      )}

                      <a
                        href={`https://wa.me/91${e.whatsapp || e.phone}?text=Hi%20${encodeURIComponent(e.name)},%20thank%20you%20for%20enquiring%20at%20Black%20Stone%20Fitness%20Mysuru!%20Would%20you%20like%20to%20schedule%20a%20free%20gym%20trial%20session%20today?`}
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
              ))}
            </tbody>
          </table>
        </div>
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

    </div>
  );
};
