import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Flame,
  ShieldCheck,
  Award,
  Users,
  Clock,
  Dumbbell,
  CheckCircle2,
  MapPin
} from 'lucide-react';

interface HeroSectionProps {
  onOpenTrialModal: () => void;
  onExplorePlans: () => void;
  onExploreExercises: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenTrialModal,
  onExplorePlans,
  onExploreExercises
}) => {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-zinc-950" id="bsf-hero-section">
      
      {/* Dynamic Background Texture & Ambience */}
      <div className="absolute inset-0 z-0">
        {/* Cinematic fitness atmosphere background */}
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=2000&q=80"
          alt="Black Stone Fitness Gym Floor"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-25 filter grayscale contrast-125 brightness-75 scale-105 animate-pulse duration-[12000ms]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-zinc-950/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.08),transparent_65%)]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
        
        {/* Mysore Location & Status Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-700/80 text-xs text-zinc-300 backdrop-blur-md shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-500">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <MapPin className="w-3.5 h-3.5 text-orange-400" />
          <span className="font-semibold text-white">MYSURU'S PREMIER GYM & TRAINING HUB</span>
          <span className="text-zinc-500">•</span>
          <span className="text-orange-400 font-mono font-bold">5:30 AM — 10:00 PM</span>
        </div>

        {/* Main Brand Statement */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white font-display tracking-tight leading-[0.92] uppercase">
            FORGE UNSTOPPABLE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-200 to-orange-500">
              STRENGTH & POWER
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-zinc-300 font-sans-body font-normal leading-relaxed pt-2">
            Mysuru's hardcore fitness institution built for serious lifters, bodybuilding purists, and everyday athletes seeking undeniable physical transformation.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={onOpenTrialModal}
            className="w-full sm:w-auto px-8 py-4 bg-orange-400 hover:bg-orange-300 text-black font-black text-sm uppercase tracking-wider rounded-2xl transition-all duration-300 shadow-xl shadow-orange-400/25 hover:shadow-orange-400/40 hover:scale-105 flex items-center justify-center gap-2.5 group"
          >
            <Sparkles className="w-4 h-4" />
            <span>Book Free 1-Day Trial</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </button>

          <button
            onClick={onExplorePlans}
            className="w-full sm:w-auto px-8 py-4 bg-zinc-900/90 hover:bg-zinc-800 text-white border border-zinc-700 hover:border-orange-400/50 font-bold text-sm uppercase tracking-wider rounded-2xl transition duration-300 flex items-center justify-center gap-2"
          >
            <span>Explore Membership Plans</span>
          </button>

          <button
            onClick={onExploreExercises}
            className="w-full sm:w-auto px-6 py-4 bg-zinc-900/40 hover:bg-zinc-900 text-zinc-400 hover:text-orange-400 border border-zinc-800 rounded-2xl text-xs font-bold uppercase transition flex items-center justify-center gap-1.5"
          >
            <Dumbbell className="w-4 h-4" />
            <span>1,000 Exercises</span>
          </button>
        </div>

        {/* Highlight Metrics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-zinc-800/80 max-w-4xl mx-auto">
          
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur">
            <span className="font-display font-black text-3xl sm:text-4xl text-white">8,500+</span>
            <p className="text-xs text-zinc-400 font-sans-body mt-0.5">Sq. Ft. Hardcore Facility</p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur">
            <span className="font-display font-black text-3xl sm:text-4xl text-orange-400">1,000</span>
            <p className="text-xs text-zinc-400 font-sans-body mt-0.5">Exercises & Guides</p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur">
            <span className="font-display font-black text-3xl sm:text-4xl text-white">100%</span>
            <p className="text-xs text-zinc-400 font-sans-body mt-0.5">Certified K11 & CSCS Coaches</p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur">
            <span className="font-display font-black text-3xl sm:text-4xl text-emerald-400">4.9 ★</span>
            <p className="text-xs text-zinc-400 font-sans-body mt-0.5">Mysuru's Top Rated Gym</p>
          </div>

        </div>

      </div>

    </section>
  );
};
