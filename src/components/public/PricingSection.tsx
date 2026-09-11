import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import { MembershipPackage } from '../../types';
import { CheckCircle2, Sparkles, Zap, ArrowRight, ShieldCheck, Flame } from 'lucide-react';

interface PricingSectionProps {
  onSelectPlan: (pkg: MembershipPackage) => void;
  onOpenTrialModal: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onSelectPlan, onOpenTrialModal }) => {
  const { packages } = useGym();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12" id="pricing">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold font-mono text-orange-400 uppercase tracking-widest">
          TRANSPARENT MEMBERSHIP PLANS • ZERO HIDDEN CHARGES
        </span>
        <h2 className="text-3xl sm:text-5xl font-black text-white font-display tracking-tight uppercase">
          INVEST IN YOUR STRENGTH & LONGEVITY
        </h2>
        <p className="text-sm text-zinc-400 font-sans-body">
          Select the membership duration that matches your fitness aspirations. All plans include full floor access, digital entry pass, and complimentary locker facilities.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      {packages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {packages.map(pkg => {
            const monthlyEquiv = Math.round(pkg.price / (pkg.durationMonths || 1));
            return (
              <div
                key={pkg.id}
                className={`relative rounded-3xl p-6 sm:p-7 transition-all duration-300 flex flex-col justify-between ${
                  pkg.popular
                    ? 'bg-zinc-900 border-2 border-orange-400 shadow-2xl shadow-orange-400/10 scale-105 z-10'
                    : 'bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 shadow-xl'
                }`}
              >
                {/* Badge */}
                {pkg.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 bg-orange-400 text-black text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                    {pkg.badge}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                    <h3 className="text-lg font-black text-white font-display uppercase tracking-wide">
                      {pkg.name}
                    </h3>
                    <span className="text-xs font-mono font-bold text-zinc-400">
                      {pkg.durationMonths} {pkg.durationMonths === 1 ? 'Month' : 'Months'}
                    </span>
                  </div>

                  <div className="my-6">
                    <div className="flex items-baseline gap-2">
                      <span className="font-display font-black text-3xl sm:text-4xl text-white">
                        ₹{pkg.price.toLocaleString('en-IN')}
                      </span>
                      {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                        <span className="text-xs font-mono text-zinc-500 line-through">
                          ₹{pkg.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-orange-400 font-mono mt-1 font-semibold">
                      ≈ ₹{monthlyEquiv.toLocaleString('en-IN')} / month
                    </p>
                    <p className="text-xs text-zinc-400 mt-2 font-sans-body leading-relaxed">
                      {pkg.description}
                    </p>
                  </div>

                  {/* Features Checkpoints */}
                  <div className="space-y-2.5 py-4 border-t border-zinc-800/80 text-xs font-sans-body">
                    {pkg.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-zinc-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-6">
                  <button
                    onClick={() => onSelectPlan(pkg)}
                    className={`w-full py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 ${
                      pkg.popular
                        ? 'bg-orange-400 hover:bg-orange-300 text-black shadow-lg shadow-orange-400/20'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700'
                    }`}
                  >
                    <span>Enroll in {pkg.name.split(' ')[0]} Plan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-10 rounded-3xl bg-zinc-900/60 border border-zinc-800 text-center space-y-4 max-w-2xl mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-orange-400/10 border border-orange-400/20 text-orange-400 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-white font-display uppercase">Membership Plans Updating</h3>
          <p className="text-xs text-zinc-400 font-sans-body leading-relaxed">
            Our customized membership packages and seasonal offers are currently being updated by gym administration. Please visit our front desk in Sharadadevi Nagar, Mysuru, or book a free trial below.
          </p>
          <div className="pt-2">
            <button
              onClick={onOpenTrialModal}
              className="px-6 py-3 bg-orange-400 hover:bg-orange-300 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition"
            >
              Book Complimentary Day Pass
            </button>
          </div>
        </div>
      )}

      {/* Trial CTA Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-900 border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div className="space-y-1">
          <h3 className="text-xl font-black text-white font-display">WANT TO TEST DRIVE THE GYM FIRST?</h3>
          <p className="text-xs text-zinc-400 font-sans-body">
            Book a complimentary 1-day pass. Workout with zero pressure and consult with our master trainers in Mysuru.
          </p>
        </div>
        <button
          onClick={onOpenTrialModal}
          className="px-6 py-3.5 bg-orange-400 hover:bg-orange-300 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-orange-400/20 whitespace-nowrap"
        >
          Book 1-Day Free Trial
        </button>
      </div>

    </section>
  );
};
