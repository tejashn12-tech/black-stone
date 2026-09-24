import React from 'react';
import { Member, PaymentRecord } from '../../../types';
import { useGym } from '../../../context/GymContext';
import {
  CreditCard,
  PlusCircle,
  Download,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  Printer
} from 'lucide-react';

interface PaymentsTabProps {
  member: Member;
  onOpenModal: (type: any, data?: any) => void;
}

export const PaymentsTab: React.FC<PaymentsTabProps> = ({ member, onOpenModal }) => {
  const { payments } = useGym();

  // Filter payments belonging to this member
  const memberPayments = payments.filter((p) => p.memberId === member.id);

  const totalAmount = member.totalAmount || 15999;
  const lastFeesPaid = member.lastFeesPaid !== undefined ? member.lastFeesPaid : (member.paidAmount || (memberPayments[0]?.amountPaid || 0));
  const paidAmount = member.paidAmount || (memberPayments.reduce((acc, p) => acc + p.amountPaid, 0));
  const pendingAmount = Math.max(0, totalAmount - paidAmount);

  return (
    <div className="space-y-4">
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Total Billed Amount</span>
            <div className="p-1.5 rounded-lg bg-zinc-500/10 text-zinc-500">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-zinc-900 dark:text-white mt-1 font-mono">
            ₹{totalAmount.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-zinc-400">Package + add-ons</span>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Last Fees Paid</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
            ₹{lastFeesPaid.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Latest recorded fee</span>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Pending Balance</span>
            <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-2xl font-black mt-1 font-mono ${pendingAmount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-zinc-900 dark:text-white'}`}>
            ₹{pendingAmount.toLocaleString('en-IN')}
          </p>
          <span className="text-[10px] text-zinc-400">
            {pendingAmount > 0 ? 'Outstanding collection' : 'Zero dues pending'}
          </span>
        </div>
      </div>

      {/* Main Payment History Table */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <h3 className="font-bold text-zinc-900 dark:text-white text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-orange-500" />
              <span>Payment History & Invoices</span>
            </h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Receipt ledger, UPI / cash / card transaction logs, and PDF invoice generation
            </p>
          </div>

          <button
            onClick={() => onOpenModal('add_payment')}
            className="py-2 px-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition flex items-center gap-2 shadow-sm"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Payment</span>
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-950/80 text-zinc-500 dark:text-zinc-400 font-bold uppercase text-[10px] tracking-wider border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="py-3 px-3">Receipt No.</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Package / Items</th>
                <th className="py-3 px-3">Amount Paid</th>
                <th className="py-3 px-3">Method</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Receipt Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 font-medium">
              {memberPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-zinc-400 dark:text-zinc-500">
                    <p className="font-semibold text-sm">No payment records found for this member</p>
                    <p className="text-xs mt-1">Click "Add Payment" to record a cash, UPI, or card payment.</p>
                  </td>
                </tr>
              ) : (
                memberPayments.map((p, idx) => (
                  <tr key={`${p.id}-${idx}`} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition">
                    <td className="py-3 px-3 font-mono font-bold text-orange-600 dark:text-orange-400">
                      {p.receiptNo}
                    </td>
                    <td className="py-3 px-3 font-mono text-zinc-600 dark:text-zinc-400">{p.paymentDate}</td>
                    <td className="py-3 px-3 text-zinc-900 dark:text-white font-semibold">{p.packageName}</td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      ₹{p.amountPaid.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                        {p.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenModal('receipt_view', p)}
                          className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-semibold transition flex items-center gap-1"
                          title="View / Download PDF"
                        >
                          <FileText className="w-3.5 h-3.5 text-sky-500" />
                          <span>Receipt</span>
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
    </div>
  );
};
