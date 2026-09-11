import React, { useState, useMemo } from 'react';
import { useGym } from '../../context/GymContext';
import { PaymentRecord, PaymentMethod, PaymentStatus, Member } from '../../types';
import { ReceiptModal } from '../common/ReceiptModal';
import {
  CreditCard,
  Search,
  Plus,
  Filter,
  Download,
  Printer,
  MessageSquare,
  TrendingUp,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Send,
  Sparkles,
  Receipt,
  FileSpreadsheet,
  Calendar,
  Layers,
  ChevronRight,
  PhoneCall,
  Check,
  Edit3,
  RotateCcw,
  Trash2,
  Save,
  AlertTriangle,
  Undo2,
  ShieldAlert,
  Info
} from 'lucide-react';

export const PaymentManagement: React.FC = () => {
  const {
    payments,
    members,
    packages,
    settings,
    recordPayment,
    updatePayment,
    deletePayment,
    undoPayment,
    getStats
  } = useGym();

  const stats = getStats();

  // Active view tab
  const [activeTab, setActiveTab] = useState<'all' | 'monthly_ledger' | 'dues'>('all');

  // Filter States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [monthFilter, setMonthFilter] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<string>('all');

  // Modals
  const [isRecordModalOpen, setIsRecordModalOpen] = useState<boolean>(false);
  const [isSettleModalOpen, setIsSettleModalOpen] = useState<boolean>(false);
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentRecord | null>(null);
  const [settlePaymentTarget, setSettlePaymentTarget] = useState<PaymentRecord | null>(null);

  // Edit Payment Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editPaymentTarget, setEditPaymentTarget] = useState<PaymentRecord | null>(null);
  const [editFormData, setEditFormData] = useState({
    amountPaid: 0,
    totalPackageAmount: 0,
    pendingAmount: 0,
    discount: 0,
    paymentMethod: 'UPI' as PaymentMethod,
    paymentDate: '',
    status: 'PAID' as PaymentStatus,
    transactionRef: '',
    notes: '',
    syncMember: true
  });

  // Undo / Void Payment Modal State
  const [isUndoModalOpen, setIsUndoModalOpen] = useState<boolean>(false);
  const [undoPaymentTarget, setUndoPaymentTarget] = useState<PaymentRecord | null>(null);
  const [undoReason, setUndoReason] = useState<string>('Customer Request / Entry Mistake');
  const [undoActionType, setUndoActionType] = useState<'mark_refunded' | 'delete_record'>('mark_refunded');

  // New Payment Form State
  const [formData, setFormData] = useState({
    memberId: members[0]?.id || '',
    packageId: packages[0]?.id || '',
    amountPaid: packages[0]?.price || 15999,
    discount: 0,
    paymentMethod: 'UPI' as PaymentMethod,
    transactionRef: '',
    paymentDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  // Settle Balance Form
  const [settleAmount, setSettleAmount] = useState<number>(0);
  const [settleMethod, setSettleMethod] = useState<PaymentMethod>('UPI');
  const [settleRef, setSettleRef] = useState<string>('');

  // Extract distinct available months from payments
  const availableMonths = useMemo(() => {
    const monthsSet = new Set<string>();
    payments.forEach(p => {
      if (p.paymentDate) {
        const parts = p.paymentDate.split('-');
        if (parts.length >= 2) {
          monthsSet.add(`${parts[0]}-${parts[1]}`);
        }
      }
    });
    return Array.from(monthsSet).sort().reverse();
  }, [payments]);

  // Format month key to readable string: "2026-08" -> "August 2026"
  const formatMonthName = (monthKey: string) => {
    const [y, m] = monthKey.split('-');
    const date = new Date(parseInt(y), parseInt(m) - 1, 1);
    return date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  };

  // Monthly breakdown calculation
  const monthlyLedger = useMemo(() => {
    const map: {
      [key: string]: {
        monthKey: string;
        label: string;
        year: string;
        totalCollected: number;
        totalPending: number;
        cash: number;
        upi: number;
        card: number;
        bank: number;
        count: number;
        paidCount: number;
        dueCount: number;
      };
    } = {};

    payments.forEach(p => {
      if (p.status === 'VOID' || p.status === 'REFUNDED') return;

      const dateParts = (p.paymentDate || '2026-01-01').split('-');
      const year = dateParts[0] || '2026';
      const monthKey = `${year}-${dateParts[1] || '01'}`;

      if (!map[monthKey]) {
        map[monthKey] = {
          monthKey,
          label: formatMonthName(monthKey),
          year,
          totalCollected: 0,
          totalPending: 0,
          cash: 0,
          upi: 0,
          card: 0,
          bank: 0,
          count: 0,
          paidCount: 0,
          dueCount: 0
        };
      }

      map[monthKey].totalCollected += p.amountPaid;
      map[monthKey].totalPending += p.pendingAmount;
      map[monthKey].count += 1;

      if (p.pendingAmount === 0) {
        map[monthKey].paidCount += 1;
      } else {
        map[monthKey].dueCount += 1;
      }

      if (p.paymentMethod === 'Cash') map[monthKey].cash += p.amountPaid;
      else if (p.paymentMethod === 'Card') map[monthKey].card += p.amountPaid;
      else if (p.paymentMethod === 'Bank Transfer') map[monthKey].bank += p.amountPaid;
      else map[monthKey].upi += p.amountPaid;
    });

    return Object.values(map).sort((a, b) => b.monthKey.localeCompare(a.monthKey));
  }, [payments]);

  // Filtered Payments (for All Transactions tab)
  const filteredPayments = useMemo(() => {
    return payments.filter(p => {
      if (methodFilter !== 'all' && p.paymentMethod !== methodFilter) return false;
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      
      if (monthFilter !== 'all') {
        const parts = (p.paymentDate || '').split('-');
        const pMonth = `${parts[0]}-${parts[1]}`;
        if (pMonth !== monthFilter) return false;
      }

      if (yearFilter !== 'all') {
        const parts = (p.paymentDate || '').split('-');
        if (parts[0] !== yearFilter) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesReceipt = p.receiptNo.toLowerCase().includes(q);
        const matchesName = p.memberName.toLowerCase().includes(q);
        const matchesPhone = p.memberPhone.includes(q);
        const matchesPkg = p.packageName.toLowerCase().includes(q);
        const matchesRef = p.transactionRef?.toLowerCase().includes(q);
        if (!matchesReceipt && !matchesName && !matchesPhone && !matchesPkg && !matchesRef) return false;
      }
      return true;
    });
  }, [payments, methodFilter, statusFilter, monthFilter, yearFilter, searchQuery]);

  // Outstanding Dues List (for Dues tab)
  const outstandingDuesList = useMemo(() => {
    return payments.filter(p => {
      if (p.pendingAmount <= 0) return false;

      if (monthFilter !== 'all') {
        const parts = (p.paymentDate || '').split('-');
        const pMonth = `${parts[0]}-${parts[1]}`;
        if (pMonth !== monthFilter) return false;
      }

      if (yearFilter !== 'all') {
        const parts = (p.paymentDate || '').split('-');
        if (parts[0] !== yearFilter) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesReceipt = p.receiptNo.toLowerCase().includes(q);
        const matchesName = p.memberName.toLowerCase().includes(q);
        const matchesPhone = p.memberPhone.includes(q);
        const matchesPkg = p.packageName.toLowerCase().includes(q);
        if (!matchesReceipt && !matchesName && !matchesPhone && !matchesPkg) return false;
      }
      return true;
    });
  }, [payments, monthFilter, yearFilter, searchQuery]);

  const totalOutstandingDuesSum = useMemo(() => {
    return payments.reduce((acc, p) => acc + (p.pendingAmount || 0), 0);
  }, [payments]);

  // Open Record Modal
  const handleOpenRecord = () => {
    const defaultMember = members[0];
    const defaultPkg = packages.find(p => p.id === defaultMember?.packageId) || packages[0];
    setFormData({
      memberId: defaultMember?.id || '',
      packageId: defaultPkg?.id || '',
      amountPaid: defaultPkg?.price || 15999,
      discount: 0,
      paymentMethod: 'UPI',
      transactionRef: `UPI-BSF-${Math.floor(100000 + Math.random() * 900000)}`,
      paymentDate: new Date().toISOString().split('T')[0],
      notes: 'Front Desk Payment'
    });
    setIsRecordModalOpen(true);
  };

  // Submit New Payment
  const handleSubmitRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const member = members.find(m => m.id === formData.memberId);
    const pkg = packages.find(p => p.id === formData.packageId) || packages[0];
    if (!member) return;

    const totalPkg = pkg?.price || 9999;
    const pkgId = pkg?.id || member.packageId || 'pkg-12';
    const pkgName = pkg?.name || member.packageName || '12 Months Annual VIP Pro';
    const finalBill = Math.max(0, totalPkg - formData.discount);
    const pending = Math.max(0, finalBill - formData.amountPaid);
    const payStatus: PaymentStatus = pending === 0 ? 'PAID' : (formData.amountPaid > 0 ? 'PARTIALLY PAID' : 'PAYMENT DUE');

    const created = recordPayment({
      memberId: member.id,
      memberName: member.fullName,
      memberPhone: member.whatsapp || member.phone,
      packageId: pkgId,
      packageName: pkgName,
      amountPaid: formData.amountPaid,
      totalPackageAmount: totalPkg,
      pendingAmount: pending,
      discount: formData.discount,
      paymentDate: formData.paymentDate,
      paymentMethod: formData.paymentMethod,
      status: payStatus,
      notes: formData.notes,
      whatsappStatus: 'Pending',
      transactionRef: formData.transactionRef,
      expiryDate: member.expiryDate
    });

    setIsRecordModalOpen(false);
    setSelectedReceipt(created);
  };

  // Open Settle Balance Modal
  const handleOpenSettle = (payment: PaymentRecord) => {
    setSettlePaymentTarget(payment);
    setSettleAmount(payment.pendingAmount);
    setSettleMethod('UPI');
    setSettleRef(`UPI-SETTLE-${Math.floor(100000 + Math.random() * 900000)}`);
    setIsSettleModalOpen(true);
  };

  // Submit Settle Balance
  const handleSubmitSettle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settlePaymentTarget) return;

    const newAmountPaid = settlePaymentTarget.amountPaid + settleAmount;
    const newPending = Math.max(0, settlePaymentTarget.pendingAmount - settleAmount);
    const newStatus: PaymentStatus = newPending === 0 ? 'PAID' : 'PARTIALLY PAID';

    updatePayment(settlePaymentTarget.id, {
      amountPaid: newAmountPaid,
      pendingAmount: newPending,
      status: newStatus,
      notes: `${settlePaymentTarget.notes || ''} | Settled ₹${settleAmount} on ${new Date().toISOString().split('T')[0]} via ${settleMethod}`
    });

    setIsSettleModalOpen(false);
  };

  // Open Edit Payment Modal
  const handleOpenEdit = (payment: PaymentRecord) => {
    setEditPaymentTarget(payment);
    const totalPkg = payment.totalPackageAmount || (payment.amountPaid + payment.pendingAmount);
    setEditFormData({
      amountPaid: payment.amountPaid,
      totalPackageAmount: totalPkg,
      pendingAmount: payment.pendingAmount,
      discount: payment.discount || 0,
      paymentMethod: payment.paymentMethod,
      paymentDate: payment.paymentDate,
      status: payment.status,
      transactionRef: payment.transactionRef || '',
      notes: payment.notes || '',
      syncMember: true
    });
    setIsEditModalOpen(true);
  };

  // Recalculate Edit Values dynamically
  const handleEditAmountChange = (newPaid: number) => {
    const finalBill = Math.max(0, editFormData.totalPackageAmount - editFormData.discount);
    const newPending = Math.max(0, finalBill - newPaid);
    const autoStatus: PaymentStatus = newPending === 0 ? 'PAID' : (newPaid > 0 ? 'PARTIALLY PAID' : 'PAYMENT DUE');
    setEditFormData(prev => ({
      ...prev,
      amountPaid: newPaid,
      pendingAmount: newPending,
      status: autoStatus
    }));
  };

  const handleEditDiscountChange = (newDiscount: number) => {
    const finalBill = Math.max(0, editFormData.totalPackageAmount - newDiscount);
    const newPending = Math.max(0, finalBill - editFormData.amountPaid);
    const autoStatus: PaymentStatus = newPending === 0 ? 'PAID' : (editFormData.amountPaid > 0 ? 'PARTIALLY PAID' : 'PAYMENT DUE');
    setEditFormData(prev => ({
      ...prev,
      discount: newDiscount,
      pendingAmount: newPending,
      status: autoStatus
    }));
  };

  const handleEditTotalPkgChange = (newTotal: number) => {
    const finalBill = Math.max(0, newTotal - editFormData.discount);
    const newPending = Math.max(0, finalBill - editFormData.amountPaid);
    const autoStatus: PaymentStatus = newPending === 0 ? 'PAID' : (editFormData.amountPaid > 0 ? 'PARTIALLY PAID' : 'PAYMENT DUE');
    setEditFormData(prev => ({
      ...prev,
      totalPackageAmount: newTotal,
      pendingAmount: newPending,
      status: autoStatus
    }));
  };

  // Submit Edit Form
  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPaymentTarget) return;

    updatePayment(
      editPaymentTarget.id,
      {
        amountPaid: editFormData.amountPaid,
        totalPackageAmount: editFormData.totalPackageAmount,
        pendingAmount: editFormData.pendingAmount,
        discount: editFormData.discount,
        paymentMethod: editFormData.paymentMethod,
        paymentDate: editFormData.paymentDate,
        status: editFormData.status,
        transactionRef: editFormData.transactionRef,
        notes: editFormData.notes
      },
      editFormData.syncMember
    );

    setIsEditModalOpen(false);
    setEditPaymentTarget(null);
  };

  // Open Undo Modal
  const handleOpenUndo = (payment: PaymentRecord) => {
    setUndoPaymentTarget(payment);
    setUndoReason('Customer Cancellation / Billing Reversal');
    setUndoActionType('mark_refunded');
    setIsUndoModalOpen(true);
  };

  // Execute Undo
  const handleExecuteUndo = () => {
    if (!undoPaymentTarget) return;

    if (undoActionType === 'delete_record') {
      deletePayment(undoPaymentTarget.id, true);
    } else {
      undoPayment(undoPaymentTarget.id, undoReason);
    }

    setIsUndoModalOpen(false);
    setUndoPaymentTarget(null);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Receipt / Ref No', 'Date', 'Member Name', 'Phone', 'Package', 'Paid (INR)', 'Pending Due (INR)', 'Method', 'Status', 'Ref'];
    const dataToExport = activeTab === 'dues' ? outstandingDuesList : filteredPayments;
    const rows = dataToExport.map(p => [
      p.receiptNo,
      p.paymentDate,
      `"${p.memberName}"`,
      p.memberPhone,
      `"${p.packageName}"`,
      p.amountPaid,
      p.pendingAmount,
      p.paymentMethod,
      p.status,
      p.transactionRef || ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BSF-Collections-Dues-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6" id="bsf-admin-payment-management">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white font-display tracking-wide flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-orange-400" />
            COLLECTIONS & DUES MANAGEMENT
          </h2>
          <p className="text-xs text-zinc-400 font-sans-body">
            Complete financial revenue ledger (Sep 2024 – Aug 2026), pending dues recovery, and WhatsApp receipt dispatch.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold rounded-xl border border-zinc-700 transition flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export Report</span>
          </button>

          <button
            onClick={handleOpenRecord}
            className="px-4 py-2 bg-orange-400 hover:bg-orange-300 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-orange-400/20 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Record Payment</span>
          </button>
        </div>
      </div>

      {/* Financial Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Total Revenue Collected</span>
            <p className="font-display font-black text-2xl text-emerald-400 mt-1">₹{stats.totalCollection.toLocaleString('en-IN')}</p>
            <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{payments.length} Recorded Transactions</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Total Outstanding Dues</span>
            <p className="font-display font-black text-2xl text-rose-400 mt-1">₹{totalOutstandingDuesSum.toLocaleString('en-IN')}</p>
            <p className="text-[10px] text-rose-400/80 font-mono mt-0.5">{outstandingDuesList.length} Pending Accounts</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Total Invoiced Volume</span>
            <p className="font-display font-black text-2xl text-white mt-1">₹{(stats.totalCollection + totalOutstandingDuesSum).toLocaleString('en-IN')}</p>
            <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Collections + Pending Dues</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Receipt className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Recovery Rate</span>
            <p className="font-display font-black text-2xl text-orange-400 mt-1">
              {stats.totalCollection + totalOutstandingDuesSum > 0
                ? `${Math.round((stats.totalCollection / (stats.totalCollection + totalOutstandingDuesSum)) * 100)}%`
                : '100%'}
            </p>
            <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Payment Clearance Index</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-400/10 border border-orange-400/30 flex items-center justify-center text-orange-400">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'all'
              ? 'bg-orange-400 text-black shadow-lg shadow-orange-400/20'
              : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>All Transactions ({payments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('monthly_ledger')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'monthly_ledger'
              ? 'bg-orange-400 text-black shadow-lg shadow-orange-400/20'
              : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Monthly Collections Ledger (2024–2026)</span>
        </button>

        <button
          onClick={() => setActiveTab('dues')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'dues'
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
              : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <AlertCircle className="w-4 h-4" />
          <span>Outstanding Dues Recovery ({outstandingDuesList.length})</span>
        </button>
      </div>

      {/* Filter & Search Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl">
        <div className="sm:col-span-5 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by receipt # (BSF-REC-...), member name, phone or UPI ref..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs placeholder:text-zinc-500 focus:border-orange-400 focus:outline-none"
          />
        </div>

        {/* Month Selector */}
        <div className="sm:col-span-3">
          <select
            value={monthFilter}
            onChange={e => setMonthFilter(e.target.value)}
            className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-300 text-xs focus:border-orange-400 focus:outline-none font-mono"
          >
            <option value="all">📅 All Months & Years</option>
            {availableMonths.map(m => (
              <option key={m} value={m}>
                {formatMonthName(m)}
              </option>
            ))}
          </select>
        </div>

        {activeTab !== 'dues' ? (
          <>
            <div className="sm:col-span-2">
              <select
                value={methodFilter}
                onChange={e => setMethodFilter(e.target.value)}
                className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-300 text-xs focus:border-orange-400 focus:outline-none"
              >
                <option value="all">All Methods</option>
                <option value="UPI">UPI / Online</option>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-300 text-xs focus:border-orange-400 focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="PAID">PAID (Settled)</option>
                <option value="PARTIALLY PAID">PARTIALLY PAID</option>
                <option value="PAYMENT DUE">PAYMENT DUE</option>
                <option value="REFUNDED">REFUNDED / UNDONE</option>
                <option value="VOID">VOID</option>
              </select>
            </div>
          </>
        ) : (
          <div className="sm:col-span-4 flex items-center justify-end">
            <span className="text-xs text-rose-400 font-mono font-bold bg-rose-500/10 px-3 py-2 rounded-xl border border-rose-500/20">
              Total Dues in View: ₹{outstandingDuesList.reduce((acc, p) => acc + p.pendingAmount, 0).toLocaleString('en-IN')}
            </span>
          </div>
        )}
      </div>

      {/* TAB 1: ALL TRANSACTIONS & RECEIPTS */}
      {activeTab === 'all' && (
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              Showing {filteredPayments.length} of {payments.length} Collections
            </span>
            <span className="text-xs text-emerald-400 font-mono font-bold">
              Subtotal: ₹{filteredPayments.reduce((acc, p) => acc + p.amountPaid, 0).toLocaleString('en-IN')}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950/80 text-zinc-400 uppercase text-[10px] font-bold tracking-wider">
                  <th className="py-3.5 px-4">Receipt / Ref</th>
                  <th className="py-3.5 px-4">Member Name</th>
                  <th className="py-3.5 px-4">Plan / Package</th>
                  <th className="py-3.5 px-4">Paid / Total</th>
                  <th className="py-3.5 px-4">Mode</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-sans-body">
                {filteredPayments.map(p => (
                  <tr key={p.id} className="hover:bg-zinc-800/30 transition">
                    {/* Receipt # */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-orange-400 bg-orange-400/10 px-2 py-1 rounded border border-orange-400/20">
                        {p.receiptNo}
                      </span>
                    </td>

                    {/* Member Name */}
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-white leading-tight">{p.memberName}</p>
                      <p className="text-[10px] text-zinc-400 font-mono">{p.memberPhone}</p>
                    </td>

                    {/* Plan */}
                    <td className="py-3.5 px-4 text-zinc-300 font-medium">
                      {p.packageName}
                    </td>

                    {/* Amount Paid vs Total */}
                    <td className="py-3.5 px-4">
                      <p className="font-mono font-extrabold text-emerald-400">₹{p.amountPaid.toLocaleString('en-IN')}</p>
                      {p.pendingAmount > 0 && (
                        <p className="font-mono text-[10px] text-rose-400 font-bold">Due: ₹{p.pendingAmount.toLocaleString('en-IN')}</p>
                      )}
                    </td>

                    {/* Mode */}
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">
                        {p.paymentMethod}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 font-mono text-zinc-400 text-[11px]">
                      {p.paymentDate}
                    </td>

                    {/* Payment Status */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        p.status === 'PAID'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : p.status === 'PARTIALLY PAID'
                          ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30'
                          : p.status === 'REFUNDED'
                          ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                          : p.status === 'VOID'
                          ? 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}>
                        {p.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {p.pendingAmount > 0 && p.status !== 'REFUNDED' && p.status !== 'VOID' && (
                          <button
                            onClick={() => handleOpenSettle(p)}
                            className="px-2.5 py-1.5 bg-orange-400/15 hover:bg-orange-400/25 text-orange-400 border border-orange-400/30 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition flex items-center gap-1 shadow-sm"
                            title="Settle Outstanding Balance"
                          >
                            <Check className="w-3 h-3" />
                            <span>Settle</span>
                          </button>
                        )}

                        {/* Edit Payment */}
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="px-2.5 py-1.5 bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 hover:text-amber-300 border border-amber-400/30 rounded-xl text-[10px] font-bold transition flex items-center gap-1 shadow-sm"
                          title="Edit Payment Details, Date, Mode & Dues"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        {/* Undo / Void Payment */}
                        <button
                          onClick={() => handleOpenUndo(p)}
                          className="px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/30 rounded-xl text-[10px] font-bold transition flex items-center gap-1 shadow-sm"
                          title="Undo, Refund or Revert Payment"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Undo</span>
                        </button>
                        
                        {/* Print Receipt */}
                        <button
                          onClick={() => setSelectedReceipt(p)}
                          className="p-1.5 text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-700/60 rounded-xl transition"
                          title="View & Print Official Receipt"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: MONTHLY COLLECTIONS LEDGER (Sep 2024 – Aug 2026) */}
      {activeTab === 'monthly_ledger' && (
        <div className="space-y-4">
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-black text-white font-display">
                  MONTHLY REVENUE & COLLECTIONS BREAKDOWN
                </h3>
                <p className="text-xs text-zinc-400">
                  Comprehensive audit ledger tracking month-by-month cash, online UPI, and dues clearance from September 2024 to August 2026.
                </p>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-bold text-zinc-400 uppercase">Grand Total Collected</span>
                <p className="text-2xl font-black text-emerald-400 font-display">₹{stats.totalCollection.toLocaleString('en-IN')}</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-950/80 text-zinc-400 uppercase text-[10px] font-bold tracking-wider">
                    <th className="py-3.5 px-4">Billing Month</th>
                    <th className="py-3.5 px-4">Total Collected</th>
                    <th className="py-3.5 px-4">Cash Received</th>
                    <th className="py-3.5 px-4">UPI / Online</th>
                    <th className="py-3.5 px-4">Card / Bank</th>
                    <th className="py-3.5 px-4">Pending Dues</th>
                    <th className="py-3.5 px-4">Receipts Count</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-sans-body">
                  {monthlyLedger.map(m => (
                    <tr key={m.monthKey} className="hover:bg-zinc-800/30 transition">
                      {/* Month Label */}
                      <td className="py-3.5 px-4 font-bold text-white">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-orange-400" />
                          <span>{m.label}</span>
                        </div>
                      </td>

                      {/* Total Collected */}
                      <td className="py-3.5 px-4 font-mono font-extrabold text-emerald-400 text-sm">
                        ₹{m.totalCollected.toLocaleString('en-IN')}
                      </td>

                      {/* Cash */}
                      <td className="py-3.5 px-4 font-mono text-zinc-300">
                        {m.cash > 0 ? `₹${m.cash.toLocaleString('en-IN')}` : '—'}
                      </td>

                      {/* UPI */}
                      <td className="py-3.5 px-4 font-mono text-zinc-300">
                        {m.upi > 0 ? `₹${m.upi.toLocaleString('en-IN')}` : '—'}
                      </td>

                      {/* Card / Bank */}
                      <td className="py-3.5 px-4 font-mono text-zinc-300">
                        {(m.card + m.bank) > 0 ? `₹${(m.card + m.bank).toLocaleString('en-IN')}` : '—'}
                      </td>

                      {/* Pending */}
                      <td className="py-3.5 px-4 font-mono">
                        {m.totalPending > 0 ? (
                          <span className="text-rose-400 font-bold">₹{m.totalPending.toLocaleString('en-IN')}</span>
                        ) : (
                          <span className="text-emerald-500/70">All Settled</span>
                        )}
                      </td>

                      {/* Transactions count */}
                      <td className="py-3.5 px-4 font-mono text-zinc-400">
                        {m.count} receipts
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setMonthFilter(m.monthKey);
                            setActiveTab('all');
                          }}
                          className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-orange-400 text-[10px] font-bold rounded-lg border border-zinc-700 transition inline-flex items-center gap-1"
                        >
                          <span>View Receipts</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: OUTSTANDING DUES & FEE RECOVERY */}
      {activeTab === 'dues' && (
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                OUTSTANDING MEMBERSHIP DUES RECOVERY ({outstandingDuesList.length} ACCOUNTS)
              </span>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Review accounts with outstanding balances and record counter dues settlements.
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-zinc-500 uppercase">Total Outstanding</span>
              <p className="text-xl font-black text-rose-400 font-mono">
                ₹{outstandingDuesList.reduce((acc, p) => acc + p.pendingAmount, 0).toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950/80 text-zinc-400 uppercase text-[10px] font-bold tracking-wider">
                  <th className="py-3.5 px-4">Ref / Receipt</th>
                  <th className="py-3.5 px-4">Member Name & Contact</th>
                  <th className="py-3.5 px-4">Membership Plan</th>
                  <th className="py-3.5 px-4">Package Value</th>
                  <th className="py-3.5 px-4">Amount Paid</th>
                  <th className="py-3.5 px-4">Pending Due</th>
                  <th className="py-3.5 px-4">Billing Date</th>
                  <th className="py-3.5 px-4 text-right">Recovery Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-sans-body">
                {outstandingDuesList.map(p => (
                  <tr key={p.id} className="hover:bg-zinc-800/30 transition">
                    {/* Ref */}
                    <td className="py-3.5 px-4 font-mono font-bold text-orange-400">
                      {p.receiptNo}
                    </td>

                    {/* Member */}
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-white">{p.memberName}</p>
                      <a
                        href={`tel:${p.memberPhone}`}
                        className="text-[10px] text-zinc-400 hover:text-orange-400 font-mono inline-flex items-center gap-1 mt-0.5"
                      >
                        <PhoneCall className="w-2.5 h-2.5" />
                        <span>{p.memberPhone}</span>
                      </a>
                    </td>

                    {/* Plan */}
                    <td className="py-3.5 px-4 text-zinc-300 font-medium">
                      {p.packageName}
                    </td>

                    {/* Total Value */}
                    <td className="py-3.5 px-4 font-mono text-zinc-300">
                      ₹{p.totalPackageAmount.toLocaleString('en-IN')}
                    </td>

                    {/* Amount Paid */}
                    <td className="py-3.5 px-4 font-mono text-emerald-400 font-semibold">
                      ₹{p.amountPaid.toLocaleString('en-IN')}
                    </td>

                    {/* Pending Due */}
                    <td className="py-3.5 px-4 font-mono font-extrabold text-rose-400 text-sm">
                      ₹{p.pendingAmount.toLocaleString('en-IN')}
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 font-mono text-zinc-400 text-[11px]">
                      {p.paymentDate}
                    </td>

                    {/* Recovery Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`tel:${p.memberPhone}`}
                          className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 rounded-xl text-[10px] font-bold transition flex items-center gap-1.5"
                          title="Call Member"
                        >
                          <PhoneCall className="w-3.5 h-3.5 text-orange-400" />
                          <span className="hidden sm:inline">Call</span>
                        </a>

                        <button
                          onClick={() => handleOpenSettle(p)}
                          className="px-3 py-1.5 bg-orange-400 hover:bg-orange-300 text-black font-extrabold rounded-xl text-[10px] uppercase tracking-wider transition shadow-sm flex items-center gap-1"
                          title="Settle Outstanding Due"
                        >
                          <Check className="w-3 h-3" />
                          <span>Clear Due</span>
                        </button>

                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="px-2 py-1.5 bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 border border-amber-400/30 rounded-xl text-[10px] font-bold transition flex items-center gap-1"
                          title="Edit Dues or Adjust Amounts"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => handleOpenUndo(p)}
                          className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/30 rounded-xl transition"
                          title="Undo / Void Payment"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {isRecordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl bg-zinc-900 border border-zinc-700 rounded-3xl p-6 space-y-5 shadow-2xl my-6">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-lg font-black text-white font-display">RECORD NEW MEMBERSHIP FEE</h3>
              <button onClick={() => setIsRecordModalOpen(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmitRecord} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-zinc-400 uppercase mb-1">Select Member *</label>
                <select
                  value={formData.memberId}
                  onChange={e => setFormData({ ...formData, memberId: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-400 focus:outline-none"
                >
                  {members.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.fullName} ({m.memberCode}) • {m.phone}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-zinc-400 uppercase mb-1">Package Plan</label>
                  <select
                    value={formData.packageId}
                    onChange={e => {
                      const id = e.target.value;
                      const selected = packages.find(p => p.id === id);
                      setFormData({
                        ...formData,
                        packageId: id,
                        amountPaid: selected?.price || formData.amountPaid
                      });
                    }}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-400 focus:outline-none"
                  >
                    {packages.map(pkg => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name} — ₹{pkg.price.toLocaleString('en-IN')}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-zinc-400 uppercase mb-1">Payment Date</label>
                  <input
                    type="date"
                    value={formData.paymentDate}
                    onChange={e => setFormData({ ...formData, paymentDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-semibold text-zinc-400 uppercase">Amount Paid (INR) *</label>
                    <span className="text-[10px] text-zinc-500 font-mono">Presets:</span>
                  </div>
                  <input
                    type="number"
                    required
                    value={formData.amountPaid}
                    onChange={e => setFormData({ ...formData, amountPaid: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono font-bold focus:border-orange-400 focus:outline-none text-sm"
                  />
                  {/* Quick Amount Preset Chips for fast desk entry */}
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    {[1000, 2500, 5000, 10000].map(amt => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setFormData({ ...formData, amountPaid: amt })}
                        className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-[10px] font-mono text-zinc-300 transition border border-zinc-700"
                      >
                        +₹{amt.toLocaleString('en-IN')}
                      </button>
                    ))}
                    {packages.find(p => p.id === formData.packageId) && (
                      <button
                        type="button"
                        onClick={() => {
                          const p = packages.find(pkg => pkg.id === formData.packageId);
                          if (p) setFormData({ ...formData, amountPaid: p.price });
                        }}
                        className="px-2 py-0.5 rounded bg-orange-400/20 text-orange-300 hover:bg-orange-400/30 text-[10px] font-bold font-mono transition border border-orange-400/40"
                      >
                        Full Plan (₹{packages.find(p => p.id === formData.packageId)?.price.toLocaleString('en-IN')})
                      </button>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-zinc-400 uppercase mb-1">Discount Applied (INR)</label>
                  <input
                    type="number"
                    value={formData.discount}
                    onChange={e => setFormData({ ...formData, discount: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono focus:border-orange-400 focus:outline-none"
                  />
                  <div className="flex items-center gap-1.5 mt-2">
                    {[500, 1000, 2000].map(disc => (
                      <button
                        key={disc}
                        type="button"
                        onClick={() => setFormData({ ...formData, discount: disc })}
                        className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-[10px] font-mono text-zinc-400 transition"
                      >
                        -₹{disc}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, discount: 0 })}
                      className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-[10px] font-mono text-zinc-500"
                    >
                      No Disc
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-zinc-400 uppercase mb-1">Payment Method</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={e => setFormData({ ...formData, paymentMethod: e.target.value as PaymentMethod })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-400 focus:outline-none"
                  >
                    <option value="UPI">UPI (Google Pay / PhonePe)</option>
                    <option value="Cash">Cash</option>
                    <option value="Card">Debit / Credit Card</option>
                    <option value="Bank Transfer">Bank Transfer (NEFT/IMPS)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-zinc-400 uppercase mb-1">Transaction Ref / UPI UTR</label>
                  <input
                    type="text"
                    placeholder="e.g. UPI/4028198762"
                    value={formData.transactionRef}
                    onChange={e => setFormData({ ...formData, transactionRef: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-zinc-400 uppercase mb-1">Remarks / Counter Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Paid at reception counter via QR scan"
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-orange-400 hover:bg-orange-300 text-black font-extrabold rounded-xl transition uppercase tracking-wider shadow-lg shadow-orange-400/20"
              >
                Save Payment & Generate Official Receipt
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Settle Balance Modal */}
      {isSettleModalOpen && settlePaymentTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-3xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-lg font-black text-white font-display">SETTLE OUTSTANDING DUE</h3>
              <button onClick={() => setIsSettleModalOpen(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl space-y-1 text-xs">
              <p className="text-zinc-400">Member: <strong className="text-white">{settlePaymentTarget.memberName}</strong></p>
              <p className="text-zinc-400">Receipt / Ref: <span className="text-orange-400 font-mono">{settlePaymentTarget.receiptNo}</span></p>
              <p className="text-zinc-400">Current Due: <strong className="text-rose-400 font-mono">₹{settlePaymentTarget.pendingAmount.toLocaleString('en-IN')}</strong></p>
            </div>

            <form onSubmit={handleSubmitSettle} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-zinc-400 uppercase mb-1">Settlement Amount (INR)</label>
                <input
                  type="number"
                  max={settlePaymentTarget.pendingAmount}
                  value={settleAmount}
                  onChange={e => setSettleAmount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono font-bold focus:border-orange-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-400 uppercase mb-1">Payment Method</label>
                <select
                  value={settleMethod}
                  onChange={e => setSettleMethod(e.target.value as PaymentMethod)}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-400 focus:outline-none"
                >
                  <option value="UPI">UPI</option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-zinc-400 uppercase mb-1">Transaction Ref</label>
                <input
                  type="text"
                  value={settleRef}
                  onChange={e => setSettleRef(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold rounded-xl transition uppercase tracking-wider"
              >
                Confirm Dues Clearance
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Official Receipt Modal */}
      <ReceiptModal
        payment={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />

      {/* EDIT PAYMENT MODAL */}
      {isEditModalOpen && editPaymentTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl bg-zinc-900 border border-zinc-700 rounded-3xl p-6 space-y-5 shadow-2xl my-6">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-400/10 border border-amber-400/30 rounded-xl text-amber-400">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white font-display uppercase tracking-wide">
                    Edit Payment & Billing Details
                  </h3>
                  <p className="text-xs text-zinc-400 font-mono">
                    Receipt: <span className="text-amber-400 font-bold">{editPaymentTarget.receiptNo}</span> • Member: <span className="text-white font-semibold">{editPaymentTarget.memberName}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditPaymentTarget(null);
                }}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitEdit} className="space-y-4 text-xs">
              {/* Target Details Badge */}
              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-2xl flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase">Membership Plan</span>
                  <p className="font-bold text-white text-xs">{editPaymentTarget.packageName}</p>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase">Billing Contact</span>
                  <p className="font-mono text-zinc-300 text-xs">{editPaymentTarget.memberPhone}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase">Current Status</span>
                  <div>
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      editPaymentTarget.status === 'PAID'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : editPaymentTarget.status === 'PARTIALLY PAID'
                        ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30'
                        : editPaymentTarget.status === 'REFUNDED'
                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}>
                      {editPaymentTarget.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Amounts Calculation Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Total Package Value */}
                <div>
                  <label className="block font-semibold text-zinc-400 uppercase mb-1">
                    Plan Value (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editFormData.totalPackageAmount}
                    onChange={e => handleEditTotalPkgChange(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono font-bold focus:border-amber-400 focus:outline-none"
                    required
                  />
                </div>

                {/* Discount */}
                <div>
                  <label className="block font-semibold text-zinc-400 uppercase mb-1">
                    Discount (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editFormData.discount}
                    onChange={e => handleEditDiscountChange(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono font-bold focus:border-amber-400 focus:outline-none"
                  />
                </div>

                {/* Amount Paid */}
                <div>
                  <label className="block font-semibold text-zinc-400 uppercase mb-1">
                    Amount Paid (₹) *
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editFormData.amountPaid}
                    onChange={e => handleEditAmountChange(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-emerald-400 font-mono font-black focus:border-amber-400 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-zinc-500 uppercase font-bold mr-1">Quick Pay:</span>
                <button
                  type="button"
                  onClick={() => {
                    const bill = Math.max(0, editFormData.totalPackageAmount - editFormData.discount);
                    handleEditAmountChange(bill);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold transition"
                >
                  Full Paid (₹0 Due)
                </button>
                <button
                  type="button"
                  onClick={() => handleEditAmountChange(editFormData.amountPaid + 1000)}
                  className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-mono transition"
                >
                  +₹1,000
                </button>
                <button
                  type="button"
                  onClick={() => handleEditAmountChange(editFormData.amountPaid + 500)}
                  className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-mono transition"
                >
                  +₹500
                </button>
                <button
                  type="button"
                  onClick={() => handleEditAmountChange(0)}
                  className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-mono transition"
                >
                  Zero (₹0 Paid)
                </button>
              </div>

              {/* Summary of Recalculated Dues */}
              <div className="p-3 bg-zinc-950/80 border border-zinc-800/80 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-amber-400" />
                  <span className="text-zinc-400 text-xs">Recalculated Balance Due:</span>
                </div>
                <span className={`text-sm font-mono font-black ${
                  editFormData.pendingAmount === 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  ₹{editFormData.pendingAmount.toLocaleString('en-IN')} {editFormData.pendingAmount === 0 ? '(SETTLED)' : '(PENDING)'}
                </span>
              </div>

              {/* Payment Method, Date and Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-400 uppercase mb-1">
                    Payment Method
                  </label>
                  <select
                    value={editFormData.paymentMethod}
                    onChange={e => setEditFormData({ ...editFormData, paymentMethod: e.target.value as PaymentMethod })}
                    className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-amber-400 focus:outline-none"
                  >
                    <option value="UPI">UPI (Google Pay / PhonePe)</option>
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-zinc-400 uppercase mb-1">
                    Payment Date
                  </label>
                  <input
                    type="date"
                    value={editFormData.paymentDate}
                    onChange={e => setEditFormData({ ...editFormData, paymentDate: e.target.value })}
                    className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono focus:border-amber-400 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-400 uppercase mb-1">
                    Status Override
                  </label>
                  <select
                    value={editFormData.status}
                    onChange={e => setEditFormData({ ...editFormData, status: e.target.value as PaymentStatus })}
                    className="w-full px-3 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-amber-400 focus:outline-none font-bold"
                  >
                    <option value="PAID">PAID</option>
                    <option value="PARTIALLY PAID">PARTIALLY PAID</option>
                    <option value="PAYMENT DUE">PAYMENT DUE</option>
                    <option value="REFUNDED">REFUNDED</option>
                    <option value="VOID">VOID</option>
                  </select>
                </div>
              </div>

              {/* Transaction Ref and Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-zinc-400 uppercase mb-1">
                    Transaction Ref / UPI UTR
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. UPI/4028198762"
                    value={editFormData.transactionRef}
                    onChange={e => setEditFormData({ ...editFormData, transactionRef: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white font-mono focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-zinc-400 uppercase mb-1">
                    Audit Note / Reason
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Corrected cash receipt entry"
                    value={editFormData.notes}
                    onChange={e => setEditFormData({ ...editFormData, notes: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Sync Member Checkbox */}
              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">Auto-Sync Member Balance</p>
                  <p className="text-[10px] text-zinc-400">
                    Automatically adjusts member's lifetime paid and outstanding dues based on this update.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={editFormData.syncMember}
                  onChange={e => setEditFormData({ ...editFormData, syncMember: e.target.checked })}
                  className="w-4 h-4 rounded accent-orange-400 bg-zinc-900 border-zinc-700"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const target = editPaymentTarget;
                    setIsEditModalOpen(false);
                    setEditPaymentTarget(null);
                    handleOpenUndo(target);
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl font-bold transition flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Undo / Revert Payment</span>
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setEditPaymentTarget(null);
                    }}
                    className="flex-1 sm:flex-none px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl font-bold transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="flex-1 sm:flex-none px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-extrabold rounded-xl transition flex items-center justify-center gap-1.5 shadow-lg shadow-amber-400/20 uppercase tracking-wider"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UNDO / VOID / REVERT PAYMENT MODAL */}
      {isUndoModalOpen && undoPaymentTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-3xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white font-display uppercase">
                    Undo / Revert Payment
                  </h3>
                  <p className="text-xs text-zinc-400">Receipt #{undoPaymentTarget.receiptNo}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsUndoModalOpen(false);
                  setUndoPaymentTarget(null);
                }}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Warning Card */}
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/25 rounded-2xl flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-bold text-rose-300">Reversal Confirmation</p>
                <p className="text-rose-200/80">
                  Reverting this payment will reverse the <strong className="text-white font-mono">₹{undoPaymentTarget.amountPaid.toLocaleString('en-IN')}</strong> credit for <strong className="text-white">{undoPaymentTarget.memberName}</strong> and restore their pending membership balance.
                </p>
              </div>
            </div>

            {/* Reversal Type Selection */}
            <div className="space-y-2 text-xs">
              <label className="block font-semibold text-zinc-400 uppercase">Select Action Type</label>
              
              <label className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition ${
                undoActionType === 'mark_refunded'
                  ? 'bg-purple-500/10 border-purple-500/40 text-white'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
              }`}>
                <input
                  type="radio"
                  name="undoAction"
                  value="mark_refunded"
                  checked={undoActionType === 'mark_refunded'}
                  onChange={() => setUndoActionType('mark_refunded')}
                  className="mt-0.5 accent-purple-400"
                />
                <div>
                  <p className="font-bold text-white">Mark as REFUNDED / VOID (Recommended)</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    Maintains accounting audit trail, marks status as REFUNDED, and restores member dues.
                  </p>
                </div>
              </label>

              <label className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition ${
                undoActionType === 'delete_record'
                  ? 'bg-rose-500/10 border-rose-500/40 text-white'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
              }`}>
                <input
                  type="radio"
                  name="undoAction"
                  value="delete_record"
                  checked={undoActionType === 'delete_record'}
                  onChange={() => setUndoActionType('delete_record')}
                  className="mt-0.5 accent-rose-400"
                />
                <div>
                  <p className="font-bold text-rose-300">Delete Payment Record Permanently</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    Completely purges this receipt from the database and restores member dues.
                  </p>
                </div>
              </label>
            </div>

            {/* Reversal Reason Input */}
            <div className="space-y-1 text-xs">
              <label className="block font-semibold text-zinc-400 uppercase">Reason for Reversal / Note</label>
              <input
                type="text"
                value={undoReason}
                onChange={e => setUndoReason(e.target.value)}
                placeholder="e.g. Member refund requested / Duplicate entry"
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-rose-400 focus:outline-none"
              />
            </div>

            {/* Modal Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setIsUndoModalOpen(false);
                  setUndoPaymentTarget(null);
                }}
                className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-xl transition"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleExecuteUndo}
                className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-extrabold rounded-xl transition flex items-center gap-1.5 shadow-lg shadow-rose-500/25 uppercase tracking-wider"
              >
                {undoActionType === 'delete_record' ? (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Permanently</span>
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-4 h-4" />
                    <span>Confirm Undo & Revert</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
