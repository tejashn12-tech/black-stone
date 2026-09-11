import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import { Sparkles, Calendar, User, Phone, CheckCircle2, MessageSquare, Dumbbell, Shield, Lock } from 'lucide-react';
import { ReferralSource } from '../../types';
import { PrivacyNoticeModal } from '../common/PrivacyNoticeModal';

interface TrialBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPrivacyNotice?: () => void;
}

export const TrialBookingModal: React.FC<TrialBookingModalProps> = ({ isOpen, onClose, onOpenPrivacyNotice }) => {
  const { addEnquiry, packages, recordConsent } = useGym();
  const [submitted, setSubmitted] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    fitnessGoal: 'Strength & Muscle Hypertrophy',
    preferredTime: 'Morning (6:00 AM - 9:00 AM)',
    preferredDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    referralSource: 'Website' as ReferralSource
  });

  // DPDP Act 2023 - Granular, Unticked by default opt-in checkboxes
  const [consentTrialContact, setConsentTrialContact] = useState(false);
  const [consentWhatsApp, setConsentWhatsApp] = useState(false);
  const [consentPromotions, setConsentPromotions] = useState(false);
  const [consentError, setConsentError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!consentTrialContact) {
      setConsentError('Please confirm your consent to process your contact details for trial pass reservation under DPDP Act 2023.');
      return;
    }
    setConsentError('');

    const pkg = packages[0];

    // Log evidentiary DPDP Consent Record
    recordConsent({
      principalName: formData.name.trim(),
      principalContact: formData.phone.trim(),
      principalType: 'lead',
      purposes: {
        membershipAdministration: consentTrialContact,
        whatsappTransactionalUpdates: consentWhatsApp,
        workoutFitnessGuidance: true,
        promotionsMarketing: consentPromotions,
        healthInjuryConsultation: true
      },
      noticeVersion: 'v2026.1'
    });

    addEnquiry({
      name: formData.name,
      phone: formData.phone,
      whatsapp: formData.phone,
      gender: 'Other',
      fitnessGoal: formData.fitnessGoal,
      referralSource: formData.referralSource,
      preferredPackageId: pkg?.id,
      preferredPackageName: pkg?.name,
      notes: `Free Trial Requested for ${formData.preferredDate} (${formData.preferredTime}) [DPDP Consent Recorded]`,
      status: 'New Lead'
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl my-6">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white text-lg w-8 h-8 flex items-center justify-center rounded-full bg-zinc-800/80 hover:bg-zinc-700"
        >
          ✕
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-2xl font-black text-white font-display">TRIAL WORKOUT RESERVED!</h3>
            <p className="text-sm text-zinc-300 max-w-sm mx-auto font-sans-body">
              Thank you, <strong className="text-orange-400">{formData.name}</strong>! Your 1-Day VIP Workout Pass has been booked for <span className="text-white font-semibold">{formData.preferredDate}</span>.
            </p>
            <p className="text-xs text-zinc-400 font-sans-body">
              Our floor manager in Mysuru will reach out via WhatsApp with entry pass confirmation.
            </p>
          </div>
        ) : (
          <>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-400/10 border border-orange-400/30 text-orange-400 text-xs font-bold font-mono uppercase mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>1-DAY VIP PASS • ZERO COST</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-display tracking-wide">
                CLAIM YOUR FREE TRIAL WORKOUT
              </h2>
              <p className="text-xs text-zinc-400 font-sans-body mt-1">
                Experience Black Stone Fitness Mysuru's heavy iron racks, certified trainers, and world-class atmosphere firsthand.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-zinc-300 uppercase mb-1">Your Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Yashwanth Kumar"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-zinc-300 uppercase mb-1">WhatsApp / Phone Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9845012345"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-400 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-zinc-300 uppercase mb-1">Preferred Date</label>
                  <input
                    type="date"
                    required
                    value={formData.preferredDate}
                    onChange={e => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="w-full px-3.5 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-400 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-300 uppercase mb-1">Preferred Slot</label>
                  <select
                    value={formData.preferredTime}
                    onChange={e => setFormData({ ...formData, preferredTime: e.target.value })}
                    className="w-full px-3.5 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-400 focus:outline-none"
                  >
                    <option>Morning (5:30 AM - 9:00 AM)</option>
                    <option>Mid-Day (11:00 AM - 3:00 PM)</option>
                    <option>Evening (5:00 PM - 8:30 PM)</option>
                    <option>Night (8:30 PM - 10:00 PM)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-zinc-300 uppercase mb-1">Primary Fitness Goal</label>
                <select
                  value={formData.fitnessGoal}
                  onChange={e => setFormData({ ...formData, fitnessGoal: e.target.value })}
                  className="w-full px-3.5 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-orange-400 focus:outline-none"
                >
                  <option>Muscle Hypertrophy & Bodybuilding</option>
                  <option>Weight Loss & Fat Reduction</option>
                  <option>Strength & Powerlifting</option>
                  <option>Athletic Conditioning & Endurance</option>
                  <option>General Health & Posture Correction</option>
                </select>
              </div>

              {/* DPDP Act 2023 Granular Opt-in Consent Section */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-zinc-300 font-bold text-xs">
                    <Shield className="w-3.5 h-3.5 text-orange-400" />
                    <span>Data Privacy Consent (DPDP Act 2023)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenPrivacyNotice ? onOpenPrivacyNotice() : setShowPrivacyModal(true)}
                    className="text-[11px] text-orange-400 hover:underline font-semibold"
                  >
                    Read Privacy Notice
                  </button>
                </div>

                <div className="space-y-2 text-[11px] text-zinc-400">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentTrialContact}
                      onChange={(e) => setConsentTrialContact(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-zinc-700 bg-zinc-900 accent-orange-500 shrink-0"
                    />
                    <span>
                      <strong className="text-zinc-200">Required: </strong>
                      I consent to Black Stone Fitness processing my contact details to schedule my trial workout and assign an athletic coach.
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentWhatsApp}
                      onChange={(e) => setConsentWhatsApp(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-zinc-700 bg-zinc-900 accent-orange-500 shrink-0"
                    />
                    <span>
                      <strong className="text-zinc-200">Optional: </strong>
                      Send my free VIP gym pass and slot reminders via WhatsApp.
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentPromotions}
                      onChange={(e) => setConsentPromotions(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-zinc-700 bg-zinc-900 accent-orange-500 shrink-0"
                    />
                    <span>
                      <strong className="text-zinc-200">Optional: </strong>
                      Receive seasonal discount offers and fitness festival announcements.
                    </span>
                  </label>
                </div>

                {consentError && (
                  <p className="text-[11px] text-rose-400 font-medium">
                    {consentError}
                  </p>
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400 space-y-1">
                <p className="flex items-center gap-1.5 text-zinc-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <span>Includes free InBody body composition scan + trainer consultation.</span>
                </p>
                <p className="flex items-center gap-1.5 text-zinc-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <span>No obligation or credit card required.</span>
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-orange-400 hover:bg-orange-300 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow-xl shadow-orange-400/20 flex items-center justify-center gap-2"
              >
                <Dumbbell className="w-4 h-4" />
                <span>Confirm Free Trial Reservation</span>
              </button>
            </form>
          </>
        )}

        <PrivacyNoticeModal
          isOpen={showPrivacyModal}
          onClose={() => setShowPrivacyModal(false)}
        />

      </div>
    </div>
  );
};
