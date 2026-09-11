import React from 'react';
import {
  FileText,
  X,
  Shield,
  AlertTriangle,
  Scale,
  CheckCircle2,
  Lock,
  UserCheck
} from 'lucide-react';
import { BSFLogo } from './BSFLogo';

interface TermsOfServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPrivacyNotice?: () => void;
}

export const TermsOfServiceModal: React.FC<TermsOfServiceModalProps> = ({
  isOpen,
  onClose,
  onOpenPrivacyNotice
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-display">Terms of Service & Facility Rules</h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Black Stone Fitness (BSF) Mysuru • Terms Version 2026.1 • Updated January 2026
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

        {/* Legal Counsel Review Banner */}
        <div className="bg-amber-500/10 border-b border-amber-500/30 px-6 py-3 flex items-center gap-3 text-xs text-amber-300">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <p className="leading-snug">
            <span className="font-bold uppercase tracking-wider text-amber-400">[LEGAL REVIEW REQUIRED]: </span>
            These Terms include mandatory Data Protection and DPDP Act (India) compliance clauses. Final execution version subject to legal counsel review.
          </p>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-zinc-300 text-xs sm:text-sm leading-relaxed">
          
          <section className="space-y-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-orange-400">
              1. Acceptance of Terms & Membership Eligibility
            </h3>
            <p>
              By accessing Black Stone Fitness facilities, registering as a member, signing up for trial sessions, or using our digital member portal, you agree to be bound by these Terms of Service. Members must be at least 18 years of age or possess signed parental/guardian consent if between 15 and 17 years old.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-orange-400">
              2. Facility Access, Gym Etiquette & Safety
            </h3>
            <p>
              Members are required to present their digital Member ID or app QR code upon entry. Proper athletic footwear and gym attire are mandatory. Weights and dumbbells must be returned to designated racks after use. Towels are required on all workout benches.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-orange-400">
              3. Payments, GST Invoicing & Non-Refundability
            </h3>
            <p>
              All membership subscriptions must be paid in full or as mutually agreed in writing prior to workout commencement. All published fees are inclusive of applicable Goods and Services Tax (GST). All membership packages are strictly non-refundable and non-transferable unless explicitly authorized under medical emergency exception policies.
            </p>
          </section>

          {/* DEDICATED DPDP ACT SECTION */}
          <section className="p-5 bg-zinc-950 border border-orange-500/30 rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-orange-400 font-bold text-sm">
              <Shield className="w-4 h-4" />
              <span>4. Data Protection & DPDP Act (India) 2023 Compliance Clause</span>
            </div>
            
            <p className="text-xs text-zinc-300">
              <strong className="text-white">4.1 Statutory Grounds:</strong> Black Stone Fitness functions as a Data Fiduciary under the Digital Personal Data Protection Act, 2023. We collect digital personal data (including contact information, emergency contacts, physical metrics, and billing records) solely for lawful and specified purposes connected with facility administration, physical safety, and tax compliance.
            </p>

            <p className="text-xs text-zinc-300">
              <strong className="text-white">4.2 Consent & Purpose Limitation:</strong> Data Principals provide explicit opt-in consent for distinct processing purposes (e.g. transactional WhatsApp receipts, workout guidance, and marketing broadcasts). Consent may be withdrawn at any time through our Data Rights Portal or by writing to our Grievance Officer.
            </p>

            <p className="text-xs text-zinc-300">
              <strong className="text-white">4.3 Security Safeguards:</strong> We employ reasonable security safeguards including TLS 1.3 encryption in transit, AES-256 cloud database encryption, restricted role-based staff access, and automatic audit logging to prevent personal data breaches.
            </p>

            <p className="text-xs text-zinc-300">
              <strong className="text-white">4.4 Data Principal Statutory Rights:</strong> Members and prospective leads retain all statutory rights under Sections 11–14 of the DPDP Act, including the Right to Access summaries of processed data, Right to Correction/Updation, Right to Erasure, Right of Grievance Redressal, and Right to Nominate.
            </p>

            {onOpenPrivacyNotice && (
              <div className="pt-1">
                <button
                  onClick={() => {
                    onClose();
                    onOpenPrivacyNotice();
                  }}
                  className="text-xs text-orange-400 hover:underline font-semibold flex items-center gap-1"
                >
                  Read our full DPDP Privacy Notice & Retention Schedules →
                </button>
              </div>
            )}
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-orange-400">
              5. Physical Health & Assumption of Risk
            </h3>
            <p>
              High-intensity resistance training and cardiovascular exercise involve inherent risks of physical exertion and injury. Members voluntarily assume all risk of injury resulting from participation. Members agree to consult a licensed medical physician prior to beginning any rigorous workout regimen.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-orange-400">
              6. Grievance Redressal & Governing Law
            </h3>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the Republic of India. Any disputes arising hereunder shall be subject to the exclusive jurisdiction of the competent courts in Mysuru, Karnataka.
            </p>
            <p className="text-xs text-zinc-400">
              Data protection grievances should be directed to Mr. Tejash N., Data Protection Officer (<a href="mailto:privacy@blackstonefitness.in" className="text-orange-400 hover:underline">privacy@blackstonefitness.in</a>, +91 98803 97294).
            </p>
          </section>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between">
          <div className="text-[11px] text-zinc-500">
            © {new Date().getFullYear()} Black Stone Fitness Mysuru • All Rights Reserved
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-zinc-950 font-bold text-xs transition"
          >
            Close Terms
          </button>
        </div>

      </div>
    </div>
  );
};
