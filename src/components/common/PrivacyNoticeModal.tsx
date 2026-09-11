import React, { useState } from 'react';
import {
  Shield,
  X,
  FileText,
  Lock,
  UserCheck,
  Clock,
  ExternalLink,
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  Download,
  Scale
} from 'lucide-react';
import { BSFLogo } from './BSFLogo';
import { useGym } from '../../context/GymContext';

interface PrivacyNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDataRights?: () => void;
}

export const PrivacyNoticeModal: React.FC<PrivacyNoticeModalProps> = ({
  isOpen,
  onClose,
  onOpenDataRights
}) => {
  const { settings } = useGym();
  const [activeSection, setActiveSection] = useState<'summary' | 'full_notice' | 'grievance' | 'retention'>('summary');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white font-display">Privacy Notice & Data Protection</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  DPDP Act (India) 2023
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Black Stone Fitness (BSF) Mysuru • Notice Version v2026.1 • Effective Date: January 1, 2026
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
            This document represents Black Stone Fitness’s statutory privacy notice draft pursuant to Section 5 of the Digital Personal Data Protection Act (DPDP Act), 2023 (India). Formal sign-off by designated legal counsel is recommended prior to multi-state expansion.
          </p>
        </div>

        {/* Nav Tabs */}
        <div className="flex border-b border-zinc-800 bg-zinc-950 px-6 gap-2 pt-2">
          <button
            onClick={() => setActiveSection('summary')}
            className={`pb-3 px-3 text-xs font-semibold uppercase tracking-wider transition border-b-2 flex items-center gap-1.5 ${
              activeSection === 'summary'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Executive Summary</span>
          </button>
          <button
            onClick={() => setActiveSection('full_notice')}
            className={`pb-3 px-3 text-xs font-semibold uppercase tracking-wider transition border-b-2 flex items-center gap-1.5 ${
              activeSection === 'full_notice'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Full Statutory Notice (DPDP Act)</span>
          </button>
          <button
            onClick={() => setActiveSection('retention')}
            className={`pb-3 px-3 text-xs font-semibold uppercase tracking-wider transition border-b-2 flex items-center gap-1.5 ${
              activeSection === 'retention'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Data Retention & Subprocessors</span>
          </button>
          <button
            onClick={() => setActiveSection('grievance')}
            className={`pb-3 px-3 text-xs font-semibold uppercase tracking-wider transition border-b-2 flex items-center gap-1.5 ${
              activeSection === 'grievance'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Grievance Officer (DPO)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-zinc-300 text-xs sm:text-sm leading-relaxed">
          
          {activeSection === 'summary' && (
            <div className="space-y-6">
              <div className="bg-zinc-800/50 border border-zinc-700/60 rounded-xl p-5 space-y-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Your Privacy at Black Stone Fitness at a Glance
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  We collect only the personal information required to safely manage your gym membership, deliver customized athletic training, issue tax receipts, and keep you notified of membership renewals. We do <strong className="text-white">not</strong> sell your data, do <strong className="text-white">not</strong> run third-party ad networks, and store records in secure cloud databases encrypted at rest.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider text-orange-400">
                    1. What We Collect
                  </h4>
                  <ul className="space-y-1 text-xs text-zinc-400 list-disc list-inside">
                    <li>Full Name, Phone number & WhatsApp contact</li>
                    <li>Date of Birth, Gender & Emergency contact</li>
                    <li>Height, Weight & BMI (Optional, for fitness tracking)</li>
                    <li>Medical history / injury notes (Optional, for coach safety)</li>
                    <li>GST payment transaction references & receipts</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider text-orange-400">
                    2. Why We Collect It (Purpose)
                  </h4>
                  <ul className="space-y-1 text-xs text-zinc-400 list-disc list-inside">
                    <li>Facility access & member digital ID verification</li>
                    <li>Trainer biomechanical coaching & injury prevention</li>
                    <li>Automated WhatsApp GST receipts & renewal alerts</li>
                    <li>Statutory accounting compliance under GST/Tax laws</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider text-orange-400">
                    3. Your Statutory Rights
                  </h4>
                  <p className="text-xs text-zinc-400">
                    Under Sections 11–14 of the DPDP Act 2023, you have the absolute right to:
                  </p>
                  <ul className="space-y-1 text-xs text-zinc-400 list-disc list-inside">
                    <li>Access & download a copy of all your personal data</li>
                    <li>Correct inaccurate or incomplete profile records</li>
                    <li>Request erasure of records after membership expiry</li>
                    <li>Withdraw consent at any time without punitive fee</li>
                    <li>Nominate a representative in case of death/incapacity</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider text-orange-400">
                    4. Grievance Redressal SLA
                  </h4>
                  <p className="text-xs text-zinc-400">
                    Our designated Data Protection Grievance Officer responds to all inquiries within <strong className="text-white">48 hours</strong> and resolves statutory requests within the statutory <strong className="text-white">30-day</strong> period.
                  </p>
                  <div className="pt-1">
                    <button
                      onClick={() => setActiveSection('grievance')}
                      className="text-xs text-orange-400 hover:underline flex items-center gap-1 font-semibold"
                    >
                      View Grievance Officer Details →
                    </button>
                  </div>
                </div>
              </div>

              {onOpenDataRights && (
                <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-orange-300">Exercise Your DPDP Data Rights</h4>
                    <p className="text-[11px] text-zinc-400">Submit a digital request for instant data export, profile correction, or erasure.</p>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenDataRights();
                    }}
                    className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-zinc-950 font-bold text-xs transition"
                  >
                    Open Data Rights Portal
                  </button>
                </div>
              )}
            </div>
          )}

          {activeSection === 'full_notice' && (
            <div className="space-y-6 text-xs text-zinc-300">
              
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 text-orange-400">
                  1. Statutory Framework & Scope
                </h3>
                <p>
                  Black Stone Fitness (“BSF”, “we”, “our”, “us”), located at 52/4 New Kantharaj Urs Rd, Sharadadevi Nagar, Mysuru 570023, Karnataka, functions as a <strong>Data Fiduciary</strong> under the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act, 2023)</strong>. This Privacy Notice describes how we process digital personal data belonging to gym members, prospective leads, and website visitors (“Data Principals”).
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 text-orange-400">
                  2. Categories of Personal Data Processed
                </h3>
                <div className="space-y-2">
                  <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg">
                    <strong className="text-white">A. Identity & Contact Information:</strong> Full name, telephone number, WhatsApp contact, email address, physical address, and emergency contact details.
                  </div>
                  <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg">
                    <strong className="text-white">B. Demographic & Physical Profile Data:</strong> Date of birth, gender, height (cm), weight (kg), body mass index (BMI), blood group, and profile photograph.
                  </div>
                  <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg">
                    <strong className="text-white">C. Health & Injury Self-Assessments:</strong> Voluntary medical disclosures, existing orthopedic injuries, past surgical operations, and doctor-prescribed exercise constraints.
                  </div>
                  <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg">
                    <strong className="text-white">D. Billing & Transaction Data:</strong> Membership package tier, subscription start/expiry dates, transaction reference identifiers, UPI handles, amounts paid/due, and GST tax invoices.
                  </div>
                  <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg">
                    <strong className="text-white">E. Technical & Session Data:</strong> Masked IP address, browser user-agent, session authentication tokens, and granular cookie preferences.
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 text-orange-400">
                  3. Lawful Grounds & Purpose of Processing (Section 4 & Section 6)
                </h3>
                <p className="mb-2">
                  We process your digital personal data exclusively under two lawful grounds recognized under the DPDP Act:
                </p>
                <ul className="space-y-1.5 list-disc list-inside text-zinc-400">
                  <li><strong className="text-zinc-200">Freely Given, Specific, Informed, Unconditional and Clear Consent (Section 6):</strong> Collected through granular, un-ticked opt-in checkboxes at registration and trial booking for transactional WhatsApp notifications, fitness metrics tracking, and marketing communications.</li>
                  <li><strong className="text-zinc-200">Legitimate Uses / Performance of Contract (Section 7):</strong> Fulfilling membership agreements, facility safety management, issuing statutory tax receipts under the Central Goods and Services Tax Act 2017, and responding to medical emergencies.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 text-orange-400">
                  4. Data Principal Rights (Sections 11, 12, 13, and 14)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg">
                    <strong className="text-white">Right to Access (Sec 11):</strong> Right to obtain a summary of personal data being processed and identities of all sub-processors.
                  </div>
                  <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg">
                    <strong className="text-white">Right to Correction & Erasure (Sec 12):</strong> Right to rectify inaccurate data, complete incomplete records, and erase data that is no longer necessary.
                  </div>
                  <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg">
                    <strong className="text-white">Right of Grievance Redressal (Sec 13):</strong> Right to have complaints resolved within 30 days by our designated Grievance Officer.
                  </div>
                  <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg">
                    <strong className="text-white">Right to Nominate (Sec 14):</strong> Right to nominate another individual to exercise your rights in the event of death or incapacity.
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 text-orange-400">
                  5. Withdrawal of Consent (Section 6(4))
                </h3>
                <p>
                  You have the right to withdraw your consent at any time with the same ease as it was given. Upon receiving a withdrawal request, Black Stone Fitness shall cease processing your personal data within 7 business days, unless processing is required by law (e.g. GST tax invoice retention).
                </p>
              </div>

            </div>
          )}

          {activeSection === 'retention' && (
            <div className="space-y-6 text-xs text-zinc-300">
              
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 text-orange-400">
                  Data Retention Schedules
                </h3>
                <p className="mb-4 text-zinc-400">
                  Black Stone Fitness adheres to the data minimization principle. We store personal data only as long as strictly necessary to fulfill the specified purpose or comply with Indian statutory obligations:
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse border border-zinc-800">
                    <thead>
                      <tr className="bg-zinc-950 text-zinc-400 border-b border-zinc-800">
                        <th className="p-3 font-semibold">Data Category</th>
                        <th className="p-3 font-semibold">Retention Period</th>
                        <th className="p-3 font-semibold">Statutory Basis / Disposal Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                      <tr>
                        <td className="p-3 text-white font-medium">Active Member Records</td>
                        <td className="p-3 text-zinc-400">Duration of Active Subscription + 1 Year</td>
                        <td className="p-3 text-zinc-400">Archived securely for renewals; erased upon written request.</td>
                      </tr>
                      <tr>
                        <td className="p-3 text-white font-medium">GST & Financial Receipts</td>
                        <td className="p-3 text-zinc-400">7 Years from Fiscal Year End</td>
                        <td className="p-3 text-zinc-400">Mandatory retention under GST Act & Income Tax Act 1961.</td>
                      </tr>
                      <tr>
                        <td className="p-3 text-white font-medium">Unconverted Trial Enquiries</td>
                        <td className="p-3 text-zinc-400">180 Days from Submission</td>
                        <td className="p-3 text-zinc-400">Automatically purged or anonymized for statistical reporting.</td>
                      </tr>
                      <tr>
                        <td className="p-3 text-white font-medium">Health & Injury Assessments</td>
                        <td className="p-3 text-zinc-400">Subscription Duration only</td>
                        <td className="p-3 text-zinc-400">Permanently deleted 90 days after membership expiration.</td>
                      </tr>
                      <tr>
                        <td className="p-3 text-white font-medium">Consent Audit Logs</td>
                        <td className="p-3 text-zinc-400">3 Years following Consent Withdrawal</td>
                        <td className="p-3 text-zinc-400">Maintained for evidentiary compliance under DPDP Section 6.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 text-orange-400">
                  Authorized Sub-Processors & Infrastructure
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg space-y-1">
                    <strong className="text-white block">Google Cloud Firestore</strong>
                    <span className="text-[11px] text-zinc-400 block">Database Storage & Authentication</span>
                    <span className="text-[10px] font-mono text-emerald-400 block">Encrypted at rest (AES-256) • India/Asia Region</span>
                  </div>
                  <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg space-y-1">
                    <strong className="text-white block">Meta WhatsApp Cloud API</strong>
                    <span className="text-[11px] text-zinc-400 block">Transactional Notifications</span>
                    <span className="text-[10px] font-mono text-emerald-400 block">End-to-End TLS 1.3 in Transit</span>
                  </div>
                  <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg space-y-1">
                    <strong className="text-white block">NPCI / UPI Banking Gateways</strong>
                    <span className="text-[11px] text-zinc-400 block">Payment Processing</span>
                    <span className="text-[10px] font-mono text-emerald-400 block">RBI & PCI-DSS Tier 1 Compliant</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {activeSection === 'grievance' && (
            <div className="space-y-6 text-xs text-zinc-300">
              
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Data Protection Grievance Officer</h3>
                    <p className="text-xs text-zinc-400">Designated pursuant to Section 13(1) of DPDP Act, 2023</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg space-y-1">
                    <span className="text-[11px] text-zinc-500 uppercase font-mono">Officer Name & Title</span>
                    <p className="text-white font-bold text-sm">Mr. Tejas HN</p>
                    <p className="text-xs text-zinc-400">Data Protection Officer & Head of Operations</p>
                  </div>

                  <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg space-y-1">
                    <span className="text-[11px] text-zinc-500 uppercase font-mono">Dedicated Email</span>
                    <p className="text-orange-400 font-mono font-bold text-sm">tejashn12@gmail.com</p>
                    <p className="text-[11px] text-zinc-400">privacy@blackstonefitness.in</p>
                  </div>

                  <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg space-y-1">
                    <span className="text-[11px] text-zinc-500 uppercase font-mono">Helpline & WhatsApp</span>
                    <p className="text-white font-mono font-bold text-sm">+91 98803 97294</p>
                    <p className="text-[11px] text-zinc-400">Monday – Saturday: 9:00 AM – 6:00 PM IST</p>
                  </div>

                  <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg space-y-1">
                    <span className="text-[11px] text-zinc-500 uppercase font-mono">Physical Address for Notices</span>
                    <p className="text-white text-xs leading-relaxed">
                      Black Stone Fitness, 52/4 New, New Kantharaj Urs Rd, Near Sharadadevi Nagar, Mysuru, Karnataka 570023
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-2">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider text-orange-400">
                  Grievance Redressal Procedure & Statutory Timelines
                </h4>
                <ol className="space-y-1.5 list-decimal list-inside text-zinc-400">
                  <li><strong className="text-zinc-200">Acknowledgment:</strong> All written grievances or DSR submissions will be assigned a unique Tracking ID and acknowledged within <strong className="text-white">48 hours</strong>.</li>
                  <li><strong className="text-zinc-200">Verification:</strong> The Grievance Officer will verify your identity via registered phone number OTP or in-person verification.</li>
                  <li><strong className="text-zinc-200">Resolution SLA:</strong> A comprehensive written determination and fulfillment of requested rights will be provided within <strong className="text-white">30 calendar days</strong>.</li>
                  <li><strong className="text-zinc-200">Escalation to DPBI:</strong> If dissatisfied with our internal resolution, you may lodge an appeal with the <strong>Data Protection Board of India (DPBI)</strong> pursuant to Section 13(3) of the Act.</li>
                </ol>
              </div>

            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-zinc-500 flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>DPDP Act 2023 Compliant • Black Stone Fitness Mysuru</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {onOpenDataRights && (
              <button
                onClick={() => {
                  onClose();
                  onOpenDataRights();
                }}
                className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs transition border border-zinc-700"
              >
                Submit Data Request
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-zinc-950 font-bold text-xs transition"
            >
              I Understand
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
