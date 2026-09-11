import React from 'react';
import { BSFLogo } from '../common/BSFLogo';
import {
  MapPin,
  Phone,
  MessageSquare,
  Instagram,
  ShieldCheck,
  Heart,
  Dumbbell,
  Calculator,
  ArrowUp
} from 'lucide-react';

interface FooterProps {
  onOpenAdminLogin: () => void;
  onOpenTrialModal: () => void;
  onNavigateSection: (sectionId: string) => void;
  onSetView: (view: 'home' | 'exercises' | 'calculators') => void;
  onOpenPrivacyNotice?: () => void;
  onOpenTerms?: () => void;
  onOpenDataRights?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAdminLogin,
  onOpenTrialModal,
  onNavigateSection,
  onSetView,
  onOpenPrivacyNotice,
  onOpenTerms,
  onOpenDataRights
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 text-zinc-400 text-xs font-sans-body" id="bsf-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Col 1 & 2: Brand Story */}
          <div className="lg:col-span-2 space-y-4">
            <BSFLogo size="md" />
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Black Stone Fitness (BSF) is Mysuru’s premier high-performance strength and bodybuilding destination. Dedicated to scientific biomechanics, hardcore free weights, and undeniable athletic results.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-orange-400 hover:border-orange-400/40 transition"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>

              <a
                href="https://wa.me/919880397294?text=Hi%20Black%20Stone%20Fitness%20Mysuru,%20I%20would%20like%20to%20know%20more%20about%20gym%20memberships."
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 hover:border-emerald-400/40 transition"
                aria-label="WhatsApp"
              >
                <MessageSquare className="w-4 h-4" />
              </a>

              <a
                href="tel:9880397294"
                className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition"
                aria-label="Phone"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider font-display">QUICK ACCESS</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => {
                    onSetView('home');
                    onNavigateSection('about');
                  }}
                  className="hover:text-orange-400 transition"
                >
                  About Black Stone
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSetView('home');
                    onNavigateSection('amenities');
                  }}
                  className="hover:text-orange-400 transition"
                >
                  Gym Facilities & Machinery
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSetView('home');
                    onNavigateSection('pricing');
                  }}
                  className="hover:text-orange-400 transition"
                >
                  Membership Pricing
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSetView('home');
                    onNavigateSection('trainers');
                  }}
                  className="hover:text-orange-400 transition"
                >
                  Certified Coaches Roster
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSetView('home');
                    onNavigateSection('transformations');
                  }}
                  className="hover:text-orange-400 transition"
                >
                  Member Transformations
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Interactive Tools */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider font-display">ATHLETE TOOLS</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => {
                    onSetView('exercises');
                    scrollToTop();
                  }}
                  className="hover:text-orange-400 transition flex items-center gap-1.5 text-orange-400 font-semibold"
                >
                  <Dumbbell className="w-3.5 h-3.5" />
                  <span>Exercises</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSetView('calculators');
                    scrollToTop();
                  }}
                  className="hover:text-orange-400 transition flex items-center gap-1.5"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>BMI & BMR Calculators</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTrialModal}
                  className="hover:text-orange-400 transition"
                >
                  Free 1-Day Trial Pass
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSetView('home');
                    scrollToTop();
                    setTimeout(() => onNavigateSection('pricing'), 50);
                  }}
                  className="hover:text-orange-400 transition"
                >
                  Membership Pricing Plans
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSetView('home');
                    scrollToTop();
                    setTimeout(() => onNavigateSection('trainers'), 50);
                  }}
                  className="hover:text-orange-400 transition"
                >
                  Certified Trainers & Coaches
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Facility Info & DPDP Grievance */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider font-display">MYSURU FACILITY & PRIVACY</h4>
            <div className="space-y-2 text-zinc-400">
              <p className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                <span>52/4 New, New Kantharaj Urs Rd, Near Sharadadevi Nagar, Basaveshwaranagar, Sharadadevi Nagar, Mysuru 570023</span>
              </p>
              <p className="font-mono text-zinc-300">
                Mon-Sat: 5:30 AM – 10:00 PM <br />
                Sunday: 6:00 AM – 1:00 PM
              </p>
              <div className="pt-2 border-t border-zinc-900 space-y-1">
                <span className="text-[10px] text-zinc-500 font-mono uppercase block">DPDP Grievance Redressal Officer</span>
                <p className="text-white text-xs font-semibold">Mr. Tejas HN (DPO)</p>
                <p className="text-[11px] text-orange-400 font-mono">privacy@blackstonefitness.in</p>
                <p className="text-[11px] text-zinc-400 font-mono">+91 98803 97294</p>
              </div>
            </div>
          </div>

        </div>

        {/* DPDP Compliance and Legal Strip */}
        <div className="pt-6 border-t border-zinc-900 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-4 text-zinc-400">
            <button
              onClick={onOpenPrivacyNotice}
              className="hover:text-orange-400 transition underline underline-offset-4 decoration-zinc-700"
            >
              Privacy Notice (DPDP Act 2023)
            </button>
            <button
              onClick={onOpenTerms}
              className="hover:text-orange-400 transition underline underline-offset-4 decoration-zinc-700"
            >
              Terms of Service
            </button>
            <button
              onClick={onOpenDataRights}
              className="hover:text-orange-400 transition underline underline-offset-4 decoration-zinc-700 text-orange-400 font-medium"
            >
              Exercise Data Rights (Access / Erase / Nominate)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              DPDP Act (India) Compliant
            </span>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-4 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-zinc-500 text-[11px] text-center sm:text-left">
            © {new Date().getFullYear()} Black Stone Fitness (BSF) Mysuru. All Rights Reserved. Built for champions.
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenAdminLogin}
              className="text-[11px] text-zinc-500 hover:text-orange-400 transition flex items-center gap-1 font-mono"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Staff / Owner Admin Login</span>
            </button>

            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition border border-zinc-800"
              title="Back to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
