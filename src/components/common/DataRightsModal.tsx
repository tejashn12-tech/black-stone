import React, { useState } from 'react';
import {
  Shield,
  X,
  Download,
  Edit3,
  Trash2,
  UserX,
  UserPlus,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  FileCode,
  Clock,
  Send,
  Lock
} from 'lucide-react';
import { useGym } from '../../context/GymContext';
import { DSRType } from '../../types';

interface DataRightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultContact?: string;
  defaultName?: string;
  initialContact?: string;
  initialName?: string;
}

export const DataRightsModal: React.FC<DataRightsModalProps> = ({
  isOpen,
  onClose,
  defaultContact = '',
  defaultName = '',
  initialContact,
  initialName
}) => {
  const { createDSR, members, payments, enquiries, recordConsent } = useGym();

  const [requestType, setRequestType] = useState<DSRType>('access_summary');
  const [fullName, setFullName] = useState(initialName || defaultName);
  const [contact, setContact] = useState(initialContact || defaultContact);
  const [memberCode, setMemberCode] = useState('');
  const [details, setDetails] = useState('');
  const [correctionsRequested, setCorrectionsRequested] = useState('');
  const [nomineeName, setNomineeName] = useState('');
  const [nomineeContact, setNomineeContact] = useState('');
  const [nomineeRelationship, setNomineeRelationship] = useState('');
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedRequestNumber, setSubmittedRequestNumber] = useState('');
  const [instantExportData, setInstantExportData] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !contact.trim()) return;

    const dsr = createDSR({
      principalName: fullName.trim(),
      principalContact: contact.trim(),
      principalIdentifier: memberCode.trim() || undefined,
      requestType,
      details: details.trim() || `Request for ${requestType.replace('_', ' ')} under DPDP Act 2023`,
      correctionsRequested: correctionsRequested.trim() || undefined,
      nomineeName: nomineeName.trim() || undefined,
      nomineeContact: nomineeContact.trim() || undefined,
      nomineeRelationship: nomineeRelationship.trim() || undefined
    });

    setSubmittedRequestNumber(dsr.requestNumber);

    // If instant access requested, generate export preview
    if (requestType === 'access_summary') {
      const matchedMember = members.find(m => 
        m.phone.includes(contact.trim()) || 
        m.memberCode.toLowerCase() === memberCode.trim().toLowerCase() ||
        m.fullName.toLowerCase() === fullName.trim().toLowerCase()
      );
      const matchedPayments = matchedMember ? payments.filter(p => p.memberId === matchedMember.id) : [];
      const matchedEnquiries = enquiries.filter(e => e.phone.includes(contact.trim()));

      setInstantExportData({
        exportGeneratedAt: new Date().toISOString(),
        statutoryNotice: 'Generated pursuant to DPDP Act 2023 Section 11',
        dataPrincipal: {
          fullName,
          contact,
          memberCode: matchedMember?.memberCode || 'N/A'
        },
        profileRecord: matchedMember || 'No active membership profile found matching credentials',
        paymentHistory: matchedPayments,
        enquiryLeads: matchedEnquiries
      });
    }

    setIsSubmitted(true);
  };

  const handleDownloadJSON = () => {
    if (!instantExportData) return;
    const blob = new Blob([JSON.stringify(instantExportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BSF_DataPrincipal_Export_${fullName.replace(/\s+/g, '_')}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setSubmittedRequestNumber('');
    setInstantExportData(null);
    setDetails('');
    setCorrectionsRequested('');
    setNomineeName('');
    setNomineeContact('');
    setNomineeRelationship('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-display">DPDP Data Principal Rights Portal</h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Exercise your statutory privacy rights under the DPDP Act (India) 2023
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Select Right to Exercise */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Select Right to Exercise (Sections 11–14 DPDP Act)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  
                  <button
                    type="button"
                    onClick={() => setRequestType('access_summary')}
                    className={`p-3 rounded-xl border text-left flex items-start gap-3 transition ${
                      requestType === 'access_summary'
                        ? 'bg-orange-500/10 border-orange-500/50 text-white'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <Download className={`w-4 h-4 mt-0.5 ${requestType === 'access_summary' ? 'text-orange-400' : 'text-zinc-500'}`} />
                    <div>
                      <div className="font-bold text-xs">1. Access & Download My Data</div>
                      <p className="text-[11px] text-zinc-500 mt-0.5">Summary of all personal records & billing history</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRequestType('correction')}
                    className={`p-3 rounded-xl border text-left flex items-start gap-3 transition ${
                      requestType === 'correction'
                        ? 'bg-orange-500/10 border-orange-500/50 text-white'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <Edit3 className={`w-4 h-4 mt-0.5 ${requestType === 'correction' ? 'text-orange-400' : 'text-zinc-500'}`} />
                    <div>
                      <div className="font-bold text-xs">2. Correction / Updation</div>
                      <p className="text-[11px] text-zinc-500 mt-0.5">Rectify inaccurate profile or health entries</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRequestType('erasure')}
                    className={`p-3 rounded-xl border text-left flex items-start gap-3 transition ${
                      requestType === 'erasure'
                        ? 'bg-orange-500/10 border-orange-500/50 text-white'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <Trash2 className={`w-4 h-4 mt-0.5 ${requestType === 'erasure' ? 'text-orange-400' : 'text-zinc-500'}`} />
                    <div>
                      <div className="font-bold text-xs">3. Erasure / Forget Me</div>
                      <p className="text-[11px] text-zinc-500 mt-0.5">Purge personal data post-membership expiry</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRequestType('withdraw_consent')}
                    className={`p-3 rounded-xl border text-left flex items-start gap-3 transition ${
                      requestType === 'withdraw_consent'
                        ? 'bg-orange-500/10 border-orange-500/50 text-white'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <UserX className={`w-4 h-4 mt-0.5 ${requestType === 'withdraw_consent' ? 'text-orange-400' : 'text-zinc-500'}`} />
                    <div>
                      <div className="font-bold text-xs">4. Withdraw Consent</div>
                      <p className="text-[11px] text-zinc-500 mt-0.5">Revoke WhatsApp or marketing permissions</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRequestType('nomination')}
                    className={`sm:col-span-2 p-3 rounded-xl border text-left flex items-start gap-3 transition ${
                      requestType === 'nomination'
                        ? 'bg-orange-500/10 border-orange-500/50 text-white'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <UserPlus className={`w-4 h-4 mt-0.5 ${requestType === 'nomination' ? 'text-orange-400' : 'text-zinc-500'}`} />
                    <div>
                      <div className="font-bold text-xs">5. Nominate Representative (Section 14)</div>
                      <p className="text-[11px] text-zinc-500 mt-0.5">Appoint a trusted individual to exercise your rights in case of death/incapacity</p>
                    </div>
                  </button>

                </div>
              </div>

              {/* Data Principal Identification Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">
                    Your Full Name <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Praveen Kumar"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">
                    Registered Phone or Email <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="e.g. 9880123456 or name@gmail.com"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Member ID Code (Optional)
                </label>
                <input
                  type="text"
                  value={memberCode}
                  onChange={(e) => setMemberCode(e.target.value)}
                  placeholder="e.g. BSF-2026-101 (Leave blank if trial lead)"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>

              {/* Dynamic Context Fields */}
              {requestType === 'correction' && (
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">
                    Specify Corrections / Updates Required <span className="text-orange-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={correctionsRequested}
                    onChange={(e) => setCorrectionsRequested(e.target.value)}
                    placeholder="e.g. Please update my emergency contact number to +91 98803 11111 and correct blood group to O+."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500"
                  />
                </div>
              )}

              {requestType === 'nomination' && (
                <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-3">
                  <div className="text-xs font-bold text-orange-400">Nominee Particulars</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">Nominee Full Name *</label>
                      <input
                        type="text"
                        required
                        value={nomineeName}
                        onChange={(e) => setNomineeName(e.target.value)}
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">Nominee Contact *</label>
                      <input
                        type="text"
                        required
                        value={nomineeContact}
                        onChange={(e) => setNomineeContact(e.target.value)}
                        placeholder="+91 99000 00000"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">Relationship *</label>
                      <input
                        type="text"
                        required
                        value={nomineeRelationship}
                        onChange={(e) => setNomineeRelationship(e.target.value)}
                        placeholder="e.g. Spouse / Brother"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Additional Details or Reason (Optional)
                </label>
                <textarea
                  rows={2}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Provide any specific context to assist our Data Protection Officer..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Statutory Notice */}
              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl flex items-start gap-2.5 text-[11px] text-zinc-400">
                <Clock className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <p>
                  Upon submission, your request is officially logged into our DPDP compliance register and assigned a statutory 30-day resolution window. An automated acknowledgment is recorded for compliance auditing.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-zinc-950 font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-orange-500/20"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Statutory Request</span>
                </button>
              </div>

            </form>
          ) : (
            <div className="space-y-6 py-4">
              
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white">Statutory DSR Logged Successfully</h3>
                <p className="text-xs text-zinc-400">
                  Tracking Number: <strong className="font-mono text-orange-400">{submittedRequestNumber}</strong>
                </p>
              </div>

              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-2 text-xs text-zinc-300">
                <div className="flex justify-between pb-2 border-b border-zinc-850">
                  <span className="text-zinc-500">Request Type:</span>
                  <span className="font-semibold uppercase text-white">{requestType.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-zinc-850">
                  <span className="text-zinc-500">Data Principal:</span>
                  <span className="font-semibold text-white">{fullName} ({contact})</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-zinc-850">
                  <span className="text-zinc-500">Statutory Resolution Deadline:</span>
                  <span className="font-mono text-emerald-400">30 Calendar Days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Grievance Officer:</span>
                  <span className="text-zinc-300">Mr. Tejash N. (privacy@blackstonefitness.in)</span>
                </div>
              </div>

              {/* Instant JSON Export Option */}
              {instantExportData && (
                <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl space-y-3">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-orange-400" />
                    <h4 className="text-xs font-bold text-white">Instant Personal Data Archive (JSON)</h4>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    A machine-readable summary of your personal data held in Black Stone Fitness’s Firestore database has been compiled and is ready for download:
                  </p>
                  <button
                    onClick={handleDownloadJSON}
                    className="w-full py-2.5 px-4 rounded-lg bg-orange-500 hover:bg-orange-600 text-zinc-950 font-bold text-xs transition flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download My Personal Data (.JSON)</span>
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handleReset}
                  className="text-xs text-zinc-400 hover:text-white transition"
                >
                  ← Submit another request
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition"
                >
                  Done
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
