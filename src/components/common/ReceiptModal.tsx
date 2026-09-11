import React, { useRef } from 'react';
import { PaymentRecord } from '../../types';
import { useGym } from '../../context/GymContext';
import { BSFLogo } from './BSFLogo';
import { X, Printer, Download, CheckCircle2, ShieldCheck } from 'lucide-react';
import jsPDF from 'jspdf';

interface ReceiptModalProps {
  payment: PaymentRecord | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  payment,
  onClose
}) => {
  const { settings, getMemberById } = useGym();
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!payment) return null;

  const member = getMemberById(payment.memberId);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Simple PDF generator
      doc.setFillColor(15, 15, 18);
      doc.rect(0, 0, 210, 40, 'F');

      doc.setTextColor(251, 191, 36);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('BLACK STONE FITNESS (BSF)', 14, 18);

      doc.setTextColor(200, 200, 200);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`${settings.address}, ${settings.city}, Karnataka - ${settings.pincode}`, 14, 25);
      doc.text(`Phone: ${settings.phone} | GSTIN: ${settings.gstNumber}`, 14, 31);

      // Receipt Title Box
      doc.setFillColor(245, 245, 245);
      doc.rect(14, 48, 182, 14, 'F');
      doc.setTextColor(20, 20, 20);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('OFFICIAL MEMBERSHIP & PAYMENT RECEIPT', 18, 57);
      doc.setFontSize(10);
      doc.text(`RECEIPT #: ${payment.receiptNo}`, 140, 57);

      // Member and Payment Details
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Date of Issue: ${payment.paymentDate}`, 14, 72);
      doc.text(`Member Name: ${payment.memberName}`, 14, 80);
      doc.text(`Member Code: ${member?.memberCode || 'N/A'}`, 14, 88);
      doc.text(`Phone Number: ${payment.memberPhone}`, 14, 96);

      doc.text(`Payment Mode: ${payment.paymentMethod}`, 120, 72);
      doc.text(`Status: ${payment.status}`, 120, 80);
      doc.text(`Txn Ref: ${payment.transactionRef || 'OFFLINE-DESK'}`, 120, 88);
      doc.text(`Validity Expiry: ${payment.expiryDate}`, 120, 96);

      // Table Header
      doc.setFillColor(30, 30, 35);
      doc.rect(14, 108, 182, 10, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.text('Item / Package Description', 18, 115);
      doc.text('Duration', 110, 115);
      doc.text('Amount (INR)', 160, 115);

      // Table Row
      doc.setTextColor(20, 20, 20);
      doc.setFont('helvetica', 'normal');
      doc.text(payment.packageName, 18, 128);
      doc.text(`Active plan`, 110, 128);
      doc.text(`Rs. ${payment.totalPackageAmount.toLocaleString('en-IN')}`, 160, 128);

      // Totals
      doc.line(14, 138, 196, 138);
      doc.text('Total Package Fee:', 120, 146);
      doc.text(`Rs. ${payment.totalPackageAmount.toLocaleString('en-IN')}`, 165, 146);

      doc.text('Discount Applied:', 120, 153);
      doc.text(`- Rs. ${payment.discount || 0}`, 165, 153);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(16, 185, 129);
      doc.text('Amount Received:', 120, 161);
      doc.text(`Rs. ${payment.amountPaid.toLocaleString('en-IN')}`, 165, 161);

      doc.setTextColor(239, 68, 68);
      doc.text('Balance Pending:', 120, 169);
      doc.text(`Rs. ${payment.pendingAmount.toLocaleString('en-IN')}`, 165, 169);

      // Footer Terms
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text('Terms & Conditions:', 14, 195);
      doc.text('1. Fees once paid are non-refundable and non-transferable under standard club policies.', 14, 200);
      doc.text('2. Please display your digital BSF Member Card at the reception desk upon entry.', 14, 205);
      doc.text('3. For any renewal queries or freeze requests, contact front desk at +91 821 241 8900.', 14, 210);

      // Signature line
      doc.line(140, 230, 190, 230);
      doc.text('Authorized Signatory', 148, 235);
      doc.text('Black Stone Fitness, Mysuru', 143, 240);

      doc.save(`BSF-Receipt-${payment.receiptNo}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
      window.print();
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
