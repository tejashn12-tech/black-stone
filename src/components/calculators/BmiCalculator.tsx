import React, { useState } from 'react';
import { Activity, ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight, RefreshCw, Zap } from 'lucide-react';

export const BmiCalculator: React.FC = () => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<number>(26);
  const [heightCm, setHeightCm] = useState<number>(175);
  const [weightKg, setWeightKg] = useState<number>(72);

  // Height unit toggle (cm or ft/in)
  const [unitMode, setUnitMode] = useState<'metric' | 'imperial'>('metric');
  const [feet, setFeet] = useState<number>(5);
  const [inches, setInches] = useState<number>(9);
  const [weightLbs, setWeightLbs] = useState<number>(158);

  // Calculate BMI
  const effectiveHeightM = unitMode === 'metric' ? heightCm / 100 : (feet * 30.48 + inches * 2.54) / 100;
  const effectiveWeightKg = unitMode === 'metric' ? weightKg : weightLbs * 0.453592;

  const bmi = effectiveHeightM > 0 ? parseFloat((effectiveWeightKg / (effectiveHeightM * effectiveHeightM)).toFixed(1)) : 0;

  // Ideal weight range for height (18.5 - 24.9 BMI)
  const minIdealWeightKg = Math.round(18.5 * effectiveHeightM * effectiveHeightM);
  const maxIdealWeightKg = Math.round(24.9 * effectiveHeightM * effectiveHeightM);

  const getBmiCategory = (val: number) => {
    if (val < 18.5) {
      return {
        label: 'Underweight',
        color: 'text-sky-400',
        bgColor: 'bg-sky-500/10 border-sky-500/30',
        gaugePercent: Math.min(25, (val / 18.5) * 25),
        description: 'Below normal body mass index. May benefit from muscle mass building and caloric surplus.',
        advice: 'Focus on progressive resistance training with coach guidance and nutrient-dense protein surplus.'
      };
    } else if (val >= 18.5 && val <= 24.9) {
      return {
        label: 'Normal / Healthy Weight',
        color: 'text-emerald-400',
        bgColor: 'bg-emerald-500/10 border-emerald-500/30',
        gaugePercent: 25 + ((val - 18.5) / 6.4) * 25,
        description: 'Optimal healthy range. Associated with lower cardiovascular risk and high athletic vitality.',
        advice: 'Maintain current body composition with progressive overload, functional HIIT, and balanced macros.'
      };
    } else if (val >= 25.0 && val <= 29.9) {
      return {
        label: 'Overweight',
        color: 'text-orange-400',
        bgColor: 'bg-orange-500/10 border-orange-500/30',
        gaugePercent: 50 + ((val - 25) / 4.9) * 25,
        description: 'Moderate excess mass. Consider whether it represents muscle hypertrophy or adipose tissue.',
        advice: 'Incorporate high-intensity CrossFit metabolic circuits, calorie deficit of 300-500 kcal, and daily hydration.'
      };
    } else {
      return {
        label: 'Obese Range',
        color: 'text-rose-400',
        bgColor: 'bg-rose-500/10 border-rose-500/30',
        gaugePercent: Math.min(100, 75 + ((val - 30) / 10) * 25),
        description: 'Significantly elevated BMI. Structured fitness intervention recommended for long-term health.',
        advice: 'Work 1-on-1 with BSF Certified Personal Trainers for low-impact joint-friendly conditioning and meal restructuring.'
      };
    }
  };

  const category = getBmiCategory(bmi);

  return (
    <div className="w-full max-w-4xl mx-auto bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md" id="bmi-calculator-widget">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-orange-400/10 text-orange-400 border border-orange-400/20">
              <Activity className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white font-display tracking-wide">
              BSF INTERACTIVE BMI CALCULATOR
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 font-sans-body">
            Assess your Body Mass Index score, health category, and customized Black Stone training recommendations.
          </p>
        </div>

        {/* Metric / Imperial toggle */}
        <div className="inline-flex p-1 bg-zinc-950 rounded-xl border border-zinc-800 text-xs font-semibold self-start sm:self-auto">
          <button
            onClick={() => setUnitMode('metric')}
            className={`px-3 py-1.5 rounded-lg transition ${
              unitMode === 'metric' ? 'bg-orange-400 text-black shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Metric (cm / kg)
          </button>
          <button
            onClick={() => setUnitMode('imperial')}
            className={`px-3 py-1.5 rounded-lg transition ${
              unitMode === 'imperial' ? 'bg-orange-400 text-black shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Imperial (ft / lbs)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        {/* Left Inputs Column (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Gender & Age */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Gender</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    gender === 'male'
                      ? 'bg-orange-400/15 text-orange-300 border-orange-400/40 shadow-inner'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:bg-zinc-800/50'
                  }`}
                >
                  <span>Male</span>
                </button>
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    gender === 'female'
                      ? 'bg-orange-400/15 text-orange-300 border-orange-400/40 shadow-inner'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:bg-zinc-800/50'
                  }`}
                >
                  <span>Female</span>
                </button>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Age (Years)</label>
                <span className="text-xs font-mono font-bold text-orange-400">{age} yrs</span>
              </div>
              <input
                type="number"
                min={10}
                max={90}
                value={age}
                onChange={e => setAge(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs font-mono focus:border-orange-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Height Input & Slider */}
          <div className="p-4 bg-zinc-950/70 border border-zinc-800/80 rounded-2xl space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Height</label>
              {unitMode === 'metric' ? (
                <span className="text-sm font-mono font-extrabold text-orange-400">{heightCm} cm ({((heightCm) / 30.48).toFixed(1)} ft)</span>
              ) : (
                <span className="text-sm font-mono font-extrabold text-orange-400">{feet} ft {inches} in</span>
              )}
            </div>

            {unitMode === 'metric' ? (
              <input
                type="range"
                min={120}
                max={220}
                value={heightCm}
                onChange={e => setHeightCm(Number(e.target.value))}
                className="w-full accent-orange-400 cursor-pointer h-2 bg-zinc-800 rounded-lg"
              />
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-[10px] text-zinc-500 uppercase">Feet</label>
                  <input
                    type="number"
                    min={4}
                    max={7}
                    value={feet}
                    onChange={e => setFeet(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 uppercase">Inches</label>
                  <input
                    type="number"
                    min={0}
                    max={11}
                    value={inches}
                    onChange={e => setInches(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-xs font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Weight Input & Slider */}
          <div className="p-4 bg-zinc-950/70 border border-zinc-800/80 rounded-2xl space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Weight</label>
              {unitMode === 'metric' ? (
                <span className="text-sm font-mono font-extrabold text-orange-400">{weightKg} kg ({(weightKg * 2.20462).toFixed(1)} lbs)</span>
              ) : (
                <span className="text-sm font-mono font-extrabold text-orange-400">{weightLbs} lbs ({(weightLbs * 0.453592).toFixed(1)} kg)</span>
              )}
            </div>

            {unitMode === 'metric' ? (
              <input
                type="range"
                min={30}
                max={180}
                value={weightKg}
                onChange={e => setWeightKg(Number(e.target.value))}
                className="w-full accent-orange-400 cursor-pointer h-2 bg-zinc-800 rounded-lg"
              />
            ) : (
              <input
                type="range"
                min={66}
                max={400}
                value={weightLbs}
                onChange={e => setWeightLbs(Number(e.target.value))}
                className="w-full accent-orange-400 cursor-pointer h-2 bg-zinc-800 rounded-lg"
              />
            )}
          </div>
        </div>

        {/* Right Result & Visual Gauge Column (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between p-6 bg-gradient-to-b from-zinc-950 to-zinc-900 border border-zinc-800 rounded-2xl">
          <div className="text-center space-y-2">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Your Body Mass Index</p>
            <div className="flex items-center justify-center">
              <span className="font-display font-black text-6xl text-white tracking-tight">
                {bmi}
              </span>
              <span className="text-xs text-zinc-400 ml-1.5 self-end mb-2 font-mono">kg/m²</span>
            </div>

            {/* Category Pill */}
            <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-bold border mt-1 shadow-md">
              <span className={category.color}>{category.label}</span>
            </div>
          </div>

          {/* Visual Spectrum Gauge */}
          <div className="my-5 space-y-2">
            <div className="relative h-3 w-full bg-zinc-800 rounded-full overflow-hidden flex">
              <div className="h-full w-[25%] bg-sky-500/80" title="Underweight (< 18.5)" />
              <div className="h-full w-[25%] bg-emerald-500/80" title="Normal (18.5 - 24.9)" />
              <div className="h-full w-[25%] bg-orange-500/80" title="Overweight (25 - 29.9)" />
              <div className="h-full w-[25%] bg-rose-500/80" title="Obese (≥ 30)" />
            </div>

            {/* Indicator Needle Marker */}
            <div className="relative w-full h-4">
              <div 
                className="absolute top-0 -ml-2 transition-all duration-300 flex flex-col items-center"
                style={{ left: `${Math.min(96, Math.max(4, category.gaugePercent))}%` }}
              >
                <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[6px] border-b-orange-400" />
                <span className="text-[9px] font-mono font-bold text-orange-400">{bmi}</span>
              </div>
            </div>

            <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
              <span>&lt;18.5</span>
              <span>18.5-24.9</span>
              <span>25-29.9</span>
              <span>30+</span>
            </div>
          </div>

          {/* Healthy Weight Recommendation */}
          <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs space-y-1.5">
            <div className="flex items-center justify-between text-zinc-300">
              <span>Target Normal Range:</span>
              <strong className="text-emerald-400 font-mono">{minIdealWeightKg} kg – {maxIdealWeightKg} kg</strong>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              {category.advice}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
