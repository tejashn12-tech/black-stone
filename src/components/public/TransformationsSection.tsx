import React from 'react';
import { Sparkles, Trophy, Star, CheckCircle2, TrendingUp } from 'lucide-react';

export const TransformationsSection: React.FC = () => {
  const stories = [
    {
      name: 'Aditya Rao',
      profession: 'Software Engineer, Mysuru',
      program: '12-Month Hypertrophy & Fat Loss',
      stat1: '-14 kg Fat',
      stat2: '+6 kg Lean Muscle',
      duration: '8 Months',
      quote: 'BSF transformed my sedentary lifestyle. The coaches corrected my deadlift form on day 1, and the heavy atmosphere kept me disciplined even after 10-hour workdays.',
      image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Pooja Hegde',
      profession: 'Dentist, Vijayanagar Mysuru',
      program: 'Functional Strength & Core Conditioning',
      stat1: '-9 kg Fat',
      stat2: '100kg Deadlift PB',
      duration: '6 Months',
      quote: 'The women-friendly and focused environment at Black Stone Fitness gave me the confidence to lift heavy without any hesitation. Best gym in Mysuru by far.',
      image: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&w=600&q=80'
    },
    {
      name: 'Chetan Gowda',
      profession: 'Entrepreneur, Saraswathipuram',
      program: 'Powerbuilding & Athletic Conditioning',
      stat1: '160kg Squat',
      stat2: '+8 kg Muscle Mass',
      duration: '10 Months',
      quote: 'If you are serious about genuine physical strength, you belong at Black Stone. No crowded selfie takers, just pure hardcore machinery and passionate lifters.',
      image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=600&q=80'
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12" id="transformations">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold font-mono text-orange-400 uppercase tracking-widest">
          PROVEN RESULTS • REAL MYSURU ATHLETES
        </span>
        <h2 className="text-3xl sm:text-5xl font-black text-white font-display tracking-tight uppercase">
          EVIDENCE OF UNCOMPROMISING DISCIPLINE
        </h2>
        <p className="text-sm text-zinc-400 font-sans-body">
          Witness real transformations from members who committed to the Black Stone training philosophy and achieved world-class body compositions.
        </p>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stories.map((s, idx) => (
          <div
            key={idx}
            className="bg-zinc-900/90 border border-zinc-800 rounded-3xl overflow-hidden hover:border-orange-400/40 transition duration-300 shadow-xl flex flex-col justify-between"
          >
            <div>
              {/* Image with Stats Overlay */}
              <div className="relative h-56 overflow-hidden bg-zinc-950">
                <img
                  src={s.image}
                  alt={s.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-black/30" />

                {/* Stat pills */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 bg-orange-400 text-black font-extrabold text-[11px] rounded-lg shadow font-mono">
                    {s.stat1}
                  </span>
                  <span className="px-2.5 py-1 bg-emerald-500 text-black font-extrabold text-[11px] rounded-lg shadow font-mono">
                    {s.stat2}
                  </span>
                </div>
              </div>

              {/* Story Body */}
              <div className="p-6 space-y-4 text-xs font-sans-body">
                <div>
                  <h3 className="font-bold text-white text-lg font-display tracking-wide">{s.name}</h3>
                  <p className="text-[11px] text-orange-400 font-medium">{s.profession}</p>
                  <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{s.program} • {s.duration}</p>
                </div>

                <p className="text-zinc-300 italic leading-relaxed">
                  "{s.quote}"
                </p>
              </div>
            </div>

            <div className="p-4 bg-zinc-950/80 border-t border-zinc-800 flex items-center justify-between text-[11px]">
              <span className="text-zinc-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Verified BSF Member
              </span>
              <div className="flex text-orange-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-orange-400" />
                ))}
              </div>
            </div>

          </div>
        ))}
      </div>

    </section>
  );
};
