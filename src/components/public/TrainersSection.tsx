import React from 'react';
import { useGym } from '../../context/GymContext';
import { Award, Star, Phone, MessageSquare, Instagram, ShieldCheck } from 'lucide-react';

interface TrainersSectionProps {
  onOpenTrialModal: () => void;
}

export const TrainersSection: React.FC<TrainersSectionProps> = ({ onOpenTrialModal }) => {
  const { trainers } = useGym();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12" id="trainers">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold font-mono text-orange-400 uppercase tracking-widest">
          MASTER COACHES & NUTRITION SPECIALISTS
        </span>
        <h2 className="text-3xl sm:text-5xl font-black text-white font-display tracking-tight uppercase">
          GUIDED BY MYSURU'S ELITE FITNESS MINDS
        </h2>
        <p className="text-sm text-zinc-400 font-sans-body">
          Our coaches don't just count reps. They engineer periodized progressive overload protocols and precision nutritional plans calibrated to your lifestyle.
        </p>
      </div>

      {/* Trainers Cards Grid */}
      {trainers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trainers.map(t => (
            <div
              key={t.id}
              className="group bg-zinc-900/90 border border-zinc-800 rounded-3xl overflow-hidden hover:border-orange-400/50 transition duration-300 shadow-xl flex flex-col justify-between"
            >
              <div>
                {/* Photo */}
                <div className="relative h-64 overflow-hidden bg-zinc-950">
                  <img
                    src={t.photoUrl}
                    alt={t.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-black/30" />

                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 bg-black/80 rounded-full border border-orange-400/40 text-orange-400 text-xs font-bold font-mono">
                    <Star className="w-3.5 h-3.5 fill-orange-400" />
                    <span>{t.rating}</span>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-xl font-black text-white font-display leading-tight">{t.name}</h3>
                    <p className="text-xs text-orange-400 font-medium">{t.role}</p>
                  </div>
                </div>

                {/* Bio & Details */}
                <div className="p-5 space-y-3.5 text-xs font-sans-body">
                  <p className="text-zinc-300 leading-relaxed line-clamp-3">{t.bio}</p>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Specializations</span>
                    <div className="flex flex-wrap gap-1">
                      {t.specialization.map((spec, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-300">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
                    <span className="text-orange-400 font-bold font-mono">{t.experienceYears} Years Exp</span>
                    <span className="truncate max-w-[150px]">{t.certifications[0]}</span>
                  </div>
                </div>
              </div>

              {/* Footer Action */}
              <div className="p-4 bg-zinc-950/80 border-t border-zinc-800 flex items-center justify-between">
                <a
                  href={`https://wa.me/91${t.phone}?text=Hi%20Coach%20${encodeURIComponent(t.name)},%20I%20saw%20your%20profile%20on%20the%20Black%20Stone%20Fitness%20website%20and%20would%20like%20to%20know%20about%20Personal%20Training.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Enquire Personal Training</span>
                </a>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="p-10 rounded-3xl bg-zinc-900/60 border border-zinc-800 text-center space-y-4 max-w-2xl mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-orange-400/10 border border-orange-400/20 text-orange-400 flex items-center justify-center mx-auto">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-white font-display uppercase">Coaching Roster Updating</h3>
          <p className="text-xs text-zinc-400 font-sans-body leading-relaxed">
            Our certified trainer roster and personal training coaches are currently being updated. Visit Black Stone Fitness in Mysuru for an in-person orientation and form assessment.
          </p>
          <div className="pt-2">
            <button
              onClick={onOpenTrialModal}
              className="px-6 py-3 bg-orange-400 hover:bg-orange-300 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition"
            >
              Meet Coaches on Free Trial Day
            </button>
          </div>
        </div>
      )}

    </section>
  );
};
