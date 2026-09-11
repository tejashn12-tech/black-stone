import React, { useState } from 'react';
import {
  Dumbbell,
  Zap,
  Activity,
  Heart,
  Wind,
  Shield,
  Layers,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const AmenitiesSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const amenities = [
    {
      title: 'Heavy Strength & Powerlifting Zone',
      subtitle: 'Calibrated Competition Spec Gear',
      image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1000&q=80',
      description: 'Olympic power racks, Texas deadlift bars, rogue bumper plates, and cast-iron dumbbells up to 60kg for high-volume hypertrophy and strength progression.',
      features: ['6 Dedicated Power Racks', 'Olympic Weightlifting Platforms', 'Dumbbells 2.5kg to 60kg', 'Competition Deadlift Bars']
    },
    {
      title: 'Biomechanic Cable & Plate-Loaded Machinery',
      subtitle: 'Targeted Isolation & Safety',
      image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1000&q=80',
      description: 'Hammer Strength Iso-lateral chest presses, seated leg curls, hack squats, dual cable crossover columns, and pendulum squats.',
      features: ['Hammer Strength Iso-Lateral Stations', 'Dual Pulley Functional Trainers', 'Hack Squat & Belt Squat Machine', 'Seated Preacher & Spider Curl Rigs']
    },
    {
      title: 'High-Performance Cardio Deck',
      subtitle: 'Endurance & Fat Oxidation',
      image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=1000&q=80',
      description: 'Curved self-powered sprint treadmills, StairMasters, concept2 rowers, assault air bikes, and spin bikes with live heart rate telemetry monitoring.',
      features: ['StairMaster Climbers', 'Curved Assault Speedboards', 'Concept2 Air Rowers & SkiErgs', 'Keiser Spin Bikes with RPM Sensors']
    },
    {
      title: 'Steam, Shower & Luxury Lockers',
      subtitle: 'Post-Workout Recovery & Hygiene',
      image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1000&q=80',
      description: 'Eucalyptus aromatic steam rooms, pristine showers with heated water, secure digital smart lockers, and hygienic grooming vanity stations.',
      features: ['Aromatic Steam Bath Cabin', 'High-Pressure Hot Water Showers', 'Secure Digital RFID Access Lockers', 'Clean Towels & Hygiene Essentials']
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12" id="amenities">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold font-mono text-orange-400 uppercase tracking-widest">
          WORLD-CLASS AMENITIES • BUILT TO TRANSFORM
        </span>
        <h2 className="text-3xl sm:text-5xl font-black text-white font-display tracking-tight uppercase">
          ENGINEERED FOR PEAK ATHLETIC OUTPUT
        </h2>
        <p className="text-sm text-zinc-400 font-sans-body">
          Every single machine, barbell, and cable angle at Black Stone Fitness Mysuru has been hand-selected for optimal biomechanics and maximum muscle engagement.
        </p>
      </div>

      {/* Tabs / Switcher */}
      <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-zinc-900/90 border border-zinc-800 rounded-2xl max-w-3xl mx-auto">
        {amenities.map((item, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(idx)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === idx
                ? 'bg-orange-400 text-black shadow-lg shadow-orange-400/20 font-extrabold'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            {item.title.split('&')[0]}
          </button>
        ))}
      </div>

      {/* Active Amenity Display Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl">
        
        {/* Media (6 cols) */}
        <div className="lg:col-span-6 relative rounded-2xl overflow-hidden aspect-[4/3] bg-zinc-950 border border-zinc-700/60 shadow-xl">
          <img
            src={amenities[activeTab].image}
            alt={amenities[activeTab].title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover filter contrast-110 hover:scale-105 transition duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-orange-400 bg-black/80 px-2.5 py-1 rounded backdrop-blur">
              {amenities[activeTab].subtitle}
            </span>
          </div>
        </div>

        {/* Content (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-white font-display uppercase tracking-wide">
              {amenities[activeTab].title}
            </h3>
            <p className="text-sm text-zinc-300 font-sans-body mt-2 leading-relaxed">
              {amenities[activeTab].description}
            </p>
          </div>

          {/* Key Feature check items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {amenities[activeTab].features.map((f, i) => (
              <div key={i} className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs text-zinc-200">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </section>
  );
};
