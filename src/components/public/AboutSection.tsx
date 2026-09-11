import React from 'react';
import {
  ShieldCheck,
  Zap,
  Target,
  Award,
  CheckCircle2,
  Flame,
  Dumbbell,
  HeartPulse
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  const pillars = [
    {
      icon: Dumbbell,
      title: 'Biomechanically Engineered Equipment',
      desc: 'Top-tier plate-loaded machinery, dual cable towers, and competition-spec power racks designed to maximize hyper-trophic tension without joint stress.'
    },
    {
      icon: Award,
      title: 'Elite Certified Trainers',
      desc: 'Our coaches hold CSCS, K11, and ACSM master certifications. Every training routine is tailored to your unique anatomical levers and metabolic rate.'
    },
    {
      icon: HeartPulse,
      title: 'InBody Body Composition Scans',
      desc: 'Regular scientific bioelectrical impedance scans track visceral fat, segmental lean mass, and basal metabolic rate with clinical precision.'
    },
    {
      icon: Flame,
      title: 'No-Distraction Atmosphere',
      desc: 'A dark, electric, focused environment curated with high-energy acoustics, hygienic sanitization, and a brotherhood of athletes pushing limits daily.'
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16" id="about">
      
      {/* Grid: Story + Visual */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Visual Media (5 cols) */}
        <div className="lg:col-span-5 relative">
          <div className="relative rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=80"
              alt="Black Stone Fitness Gym Training Mysuru"
              referrerPolicy="no-referrer"
              className="w-full h-[480px] object-cover hover:scale-105 transition duration-700 filter contrast-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-black/20" />

            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-zinc-950/90 border border-zinc-700/80 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-400/20 border border-orange-400/50 flex items-center justify-center text-orange-400">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-black text-white text-base leading-tight">THE BLACK STONE PHILOSOPHY</h4>
                  <p className="text-[11px] text-zinc-400 font-sans-body">Discipline, Heavy Iron & Uncompromising Work Ethic</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Story Text (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold font-mono text-orange-400 uppercase tracking-widest">
              ABOUT BLACK STONE FITNESS • MYSURU
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-display tracking-tight leading-tight">
              MORE THAN A GYM. <br />
              <span className="text-orange-400">MYSURU'S HOME OF SERIOUS IRON.</span>
            </h2>
          </div>

          <p className="text-sm sm:text-base text-zinc-300 font-sans-body leading-relaxed">
            Founded with an unyielding mission to revolutionize the fitness culture in <strong>Mysuru, Karnataka</strong>, <strong>Black Stone Fitness (BSF)</strong> combines scientific exercise mechanics, Olympic-grade free weights, and a relentless training ethos under one expansive roof.
          </p>

          <p className="text-xs sm:text-sm text-zinc-400 font-sans-body leading-relaxed">
            Whether you are stepping into a weight room for the very first time, aiming to drop 10kg of stubborn body fat, or preparing for state powerlifting championships, our floor is built with the equipment, expertise, and community you need to shatter every plateau.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-800">
            <div className="space-y-1">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">Spacious 8,500 Sq.Ft Floor</span>
              <p className="text-xs text-zinc-400">Dedicated zones for Heavy Iron, Functional Cross-training & Cardio Deck.</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">Custom Nutrition Guidance</span>
              <p className="text-xs text-zinc-400">Macro breakdowns tailored to South Indian & modern dietary preferences.</p>
            </div>
          </div>
        </div>

      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
        {pillars.map((pillar, idx) => {
          const Icon = pillar.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-zinc-900/80 border border-zinc-800 hover:border-orange-400/40 transition duration-300 space-y-3 shadow-xl group"
            >
              <div className="w-12 h-12 rounded-2xl bg-zinc-950 border border-zinc-800 group-hover:border-orange-400/50 flex items-center justify-center text-orange-400 transition">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white font-display tracking-wide">{pillar.title}</h3>
              <p className="text-xs text-zinc-400 font-sans-body leading-relaxed">{pillar.desc}</p>
            </div>
          );
        })}
      </div>

    </section>
  );
};
