import React, { useRef, useState } from 'react';
import { PaymentRecord } from '../../types';
import { useGym } from '../../context/GymContext';
import { BSFLogo } from './BSFLogo';
import { X, Printer, Download, CheckCircle2, ShieldCheck, Send, Loader2 } from 'lucide-react';
import { generateReceiptPdfDoc } from '../../utils/receiptPdfGenerator';
import { sendWhatsAppReceipt } from '../../services/whatsappApiClient';

interface ReceiptModalProps {
  payment: PaymentRecord | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  payment,
  onClose
}) => {
  const { settings, getMemberById, refreshWhatsAppLogs } = useGym();
  const receiptRef = useRef<HTMLDivElement>(null);
  const [isSendingWhatsApp, setIsSendingWhatsApp] = useState(false);
  const [whatsAppNotice, setWhatsAppNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!payment) return null;

  const member = getMemberById(payment.memberId);
  const isPaid = (payment.status || '').toUpperCase() === 'PAID' || Number(payment.pendingAmount || 0) === 0;
  const canSendWhatsApp = Number(payment.amountPaid || 0) > 0 || isPaid;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    try {
      const doc = generateReceiptPdfDoc({
        gymSettings: {
          gymName: settings.gymName,
          address: settings.address,
          city: settings.city,
          state: settings.state,
          pincode: settings.pincode,
          phone: settings.phone,
          email: settings.email,
          gstNumber: settings.gstNumber,
          receiptTerms: settings.receiptTerms,
          receiptCollectorName: settings.receiptCollectorName
        },
        member: {
          fullName: payment.memberName,
          phone: payment.memberPhone,
          whatsapp: payment.memberPhone,
          memberCode: member?.memberCode || 'BSF-MEMBER'
        },
        payment: {
          id: payment.id,
          receiptNo: payment.receiptNo,
          paymentDate: payment.paymentDate,
          paymentTime: payment.paymentTime,
          paymentMethod: payment.paymentMethod,
          status: payment.status,
          totalPackageAmount: payment.totalPackageAmount,
          amountPaid: payment.amountPaid,
          pendingAmount: payment.pendingAmount,
          discount: payment.discount,
          notes: payment.notes,
          staffName: payment.staffName || settings.receiptCollectorName
        },
        renewal: {
          packageName: payment.packageName,
          startDate: payment.paymentDate,
          expiryDate: payment.expiryDate || 'N/A'
        }
      });

      const cleanMemberName = (payment.memberName || 'Member').replace(/[^a-zA-Z0-9_-]/g, '_');
      const cleanReceiptNo = (payment.receiptNo || 'REC').replace(/[^a-zA-Z0-9_-]/g, '_');
      doc.save(`BSF_Receipt_${cleanMemberName}_${cleanReceiptNo}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
      window.print();
    }
  };

  const handleSendWhatsAppReceipt = async () => {
    if (!canSendWhatsApp) return;
    setIsSendingWhatsApp(true);
    setWhatsAppNotice(null);

    try {
      const res = await sendWhatsAppReceipt({
        member: {
          id: payment.memberId,
          fullName: payment.memberName,
          phone: payment.memberPhone,
          whatsapp: payment.memberPhone,
          memberCode: member?.memberCode || 'BSF-MEMBER'
        },
        payment,
        gymSettings: {
          gymName: settings.gymName,
          address: settings.address,
          city: settings.city,
          state: settings.state,
          pincode: settings.pincode,
          phone: settings.phone,
          email: settings.email,
          gstNumber: settings.gstNumber,
          receiptTerms: settings.receiptTerms,
          receiptCollectorName: settings.receiptCollectorName
        },
        renewal: {
          packageName: payment.packageName,
          startDate: payment.paymentDate,
          expiryDate: payment.expiryDate || 'N/A'
        }
      });

      if (res.success) {
        setWhatsAppNotice({ type: 'success', text: 'PDF receipt sent successfully over WhatsApp!' });
        refreshWhatsAppLogs();
      } else {
        setWhatsAppNotice({ type: 'error', text: res.error || 'Failed to dispatch WhatsApp receipt.' });
      }
    } catch (err: any) {
      setWhatsAppNotice({ type: 'error', text: err?.message || 'Error sending receipt.' });
    } finally {
      setIsSendingWhatsApp(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto" id="receipt-modal-container">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-700/70 rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Top Control Bar (Hidden on print) */}
        <div className="no-print flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/80">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-400/10 text-orange-400 border border-orange-400/20">
              <ShieldCheck className="w-3.5 h-3.5" /> Official Fee Receipt
            </span>
            <span className="text-sm font-mono text-zinc-400">{payment.receiptNo}</span>
          </div>

          <div className="flex items-center gap-2">
            {canSendWhatsApp && (
              <button
                onClick={handleSendWhatsAppReceipt}
                disabled={isSendingWhatsApp}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-600/90 text-white hover:bg-emerald-500 border border-emerald-500/30 transition disabled:opacity-50"
                title="Send PDF receipt directly to member's WhatsApp"
              >
                {isSendingWhatsApp ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>{isSendingWhatsApp ? 'Sending...' : 'Send WhatsApp'}</span>
              </button>
            )}
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border border-zinc-700 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-orange-400 text-black hover:bg-orange-300 font-semibold transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {whatsAppNotice && (
          <div className={`no-print px-6 py-2.5 text-xs flex items-center justify-between border-b ${
            whatsAppNotice.type === 'success'
              ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
              : 'bg-rose-950/60 text-rose-300 border-rose-800/60'
          }`}>
            <span>{whatsAppNotice.text}</span>
            <button onClick={() => setWhatsAppNotice(null)} className="opacity-70 hover:opacity-100 text-xs ml-3">✕</button>
          </div>
        )}

        {/* Printable Receipt Content Area */}
        <div ref={receiptRef} className="p-8 bg-zinc-950 text-zinc-100 font-sans-body" id="printable-receipt-area">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-zinc-800">
            <div>
              <BSFLogo size="md" />
              <p className="mt-2 text-xs text-zinc-400 max-w-xs leading-relaxed">
                {settings.address}, {settings.city}, {settings.state} - {settings.pincode}
              </p>
              <div className="mt-1 text-xs text-zinc-400 flex flex-wrap gap-x-4">
                <span>Phone: <strong className="text-zinc-200">{settings.phone}</strong></span>
                <span>GSTIN: <strong className="text-zinc-200">{settings.gstNumber}</strong></span>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <div className="inline-block px-3 py-1 bg-zinc-900 border border-zinc-700 rounded-lg text-xs font-mono font-bold text-orange-400">
                RECEIPT #{payment.receiptNo}
              </div>
              <p className="text-xs text-zinc-400 mt-2">
                Date: <span className="text-zinc-200 font-medium">{payment.paymentDate}</span>
              </p>
              <div className="mt-1">
                <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                  payment.status === 'PAID' 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                    : payment.status === 'PARTIALLY PAID'
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                }`}>
                  {payment.status}
                </span>
              </div>
            </div>
          </div>

          {/* Member & Transaction Meta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-5 border-b border-zinc-800/80 text-xs">
            <div className="space-y-1.5">
              <p className="text-zinc-400 uppercase tracking-wider text-[10px] font-bold">Billed To Member</p>
              <p className="text-base font-semibold text-white">{payment.memberName}</p>
              <p className="text-zinc-400">Member ID: <span className="text-zinc-200 font-mono">{member?.memberCode || 'BSF-MEMBER'}</span></p>
              <p className="text-zinc-400">WhatsApp / Phone: <span className="text-zinc-200">{payment.memberPhone}</span></p>
              {member?.assignedTrainerName && (
                <p className="text-zinc-400">Coach: <span className="text-orange-400 font-medium">{member.assignedTrainerName}</span></p>
              )}
            </div>

            <div className="space-y-1.5 sm:text-right">
              <p className="text-zinc-400 uppercase tracking-wider text-[10px] font-bold">Payment Particulars</p>
              <p className="text-zinc-300">Method: <strong className="text-white">{payment.paymentMethod}</strong></p>
              <p className="text-zinc-400">Reference: <span className="text-zinc-200 font-mono text-[11px]">{payment.transactionRef || 'FRONT-DESK-COUNTER'}</span></p>
              <p className="text-zinc-400">Membership Valid Until: <strong className="text-emerald-400">{payment.expiryDate}</strong></p>
              <p className="text-zinc-400">WhatsApp Status: <span className="text-zinc-300">{payment.whatsappStatus} ({payment.whatsappSentAt || 'Auto'})</span></p>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="py-6">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 uppercase text-[10px] font-bold tracking-wider">
                  <th className="py-2.5">Description</th>
                  <th className="py-2.5 text-center">Duration</th>
                  <th className="py-2.5 text-right">Package Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                <tr>
                  <td className="py-3.5">
                    <p className="font-semibold text-white text-sm">{payment.packageName}</p>
                    <p className="text-[11px] text-zinc-400">Includes full gym, turf, locker, shower & conditioning facilities</p>
                  </td>
                  <td className="py-3.5 text-center text-zinc-300">
                    Active Plan
                  </td>
                  <td className="py-3.5 text-right font-mono font-medium text-white">
                    ₹{payment.totalPackageAmount.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals Breakdown */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-zinc-900/90 border border-zinc-800">
            <div className="text-xs text-zinc-400 space-y-1">
              <p className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4" /> System Verified Digital Token
              </p>
              <p className="text-[11px] text-zinc-500">BSF Mysuru • Powered by Official Cloud Management</p>
            </div>

            <div className="w-full sm:w-auto min-w-[220px] space-y-1.5 text-xs text-right">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal:</span>
                <span className="font-mono">₹{payment.totalPackageAmount.toLocaleString('en-IN')}</span>
              </div>
              {payment.discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Special Discount:</span>
                  <span className="font-mono">-₹{payment.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-white font-bold text-sm pt-1 border-t border-zinc-800">
                <span>Amount Paid:</span>
                <span className="text-emerald-400 font-mono font-extrabold text-base">₹{payment.amountPaid.toLocaleString('en-IN')}</span>
              </div>
              {payment.pendingAmount > 0 && (
                <div className="flex justify-between text-rose-400 font-medium text-xs pt-0.5">
                  <span>Pending Balance:</span>
                  <span className="font-mono font-bold">₹{payment.pendingAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Notes & Footer Policy */}
          {payment.notes && (
            <div className="mt-4 p-3 bg-zinc-900/50 rounded-lg text-xs text-zinc-400 border border-zinc-800/60">
              <strong className="text-zinc-300">Admin Remarks:</strong> {payment.notes}
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-zinc-800 text-[10px] text-zinc-500 space-y-1 leading-relaxed">
            <p>1. Membership fees are non-refundable. Carry your digital BSF membership card or App ID at entry.</p>
            <p>2. Payment receipt automatically synced with Black Stone Fitness Accounts.</p>
            <div className="flex justify-between items-end pt-4">
              <p className="font-mono text-zinc-400">BSF MYSURU • VIJAYANAGAR / GOKULAM</p>
              <div className="text-right">
                <div className="w-32 border-b border-zinc-700 pb-1 mb-1 font-mono text-[9px] text-zinc-400 text-center">
                  [ Authorized Signature ]
                </div>
                <p className="text-[9px] text-zinc-400">Black Stone Fitness Accounts</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
