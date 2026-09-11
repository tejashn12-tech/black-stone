import React, { useState } from 'react';
import { Flame, Zap, Target, Apple, Dumbbell, Info } from 'lucide-react';

export const BmrCalculator: React.FC = () => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<number>(26);
  const [heightCm, setHeightCm] = useState<number>(175);
  const [weightKg, setWeightKg] = useState<number>(74);
  const [activityLevel, setActivityLevel] = useState<number>(1.55); // Moderate by default
  const [fitnessGoal, setFitnessGoal] = useState<'maintenance' | 'fat_loss' | 'muscle_gain'>('muscle_gain');

  // Mifflin-St Jeor Formula
  // BMR Men: (10 × weight in kg) + (6.25 × height in cm) - (5 × age) + 5
  // BMR Women: (10 × weight in kg) + (6.25 × height in cm) - (5 × age) - 161
  const rawBmr = gender === 'male'
    ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
    : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;

  const bmr = Math.round(rawBmr);
  const maintenanceTdee = Math.round(bmr * activityLevel);

  // Calorie adjustments
  const targetCalories = fitnessGoal === 'fat_loss'
    ? Math.round(maintenanceTdee - 450)
    : fitnessGoal === 'muscle_gain'
    ? Math.round(maintenanceTdee + 350)
    : maintenanceTdee;

  // Macro calculation based on fitness goal
  // Protein: 2.0g - 2.2g per kg for athletes
  const proteinGrams = Math.round(weightKg * (fitnessGoal === 'fat_loss' ? 2.2 : 2.0));
  const proteinCalories = proteinGrams * 4;

  // Fat: 25% of calories
  const fatCalories = Math.round(targetCalories * 0.25);
  const fatGrams = Math.round(fatCalories / 9);

  // Remainder: Carbs
  const carbCalories = Math.max(0, targetCalories - (proteinCalories + fatCalories));
  const carbGrams = Math.round(carbCalories / 4);

  const activities = [
    { value: 1.2, label: 'Sedentary', desc: 'Little to no exercise / desk job' },
    { value: 1.375, label: 'Lightly Active', desc: 'Training 1–3 days / week' },
    { value: 1.55, label: 'Moderately Active', desc: 'Weightlifting / HIIT 3–5 days / week' },
    { value: 1.725, label: 'Very Active', desc: 'Hard training / BSF athlete 6–7 days / week' },
    { value: 1.9, label: 'Extremely Active', desc: 'High physical job + 2x daily training' }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md" id="bmr-calculator-widget">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-orange-400/10 text-orange-400 border border-orange-400/20">
              <Flame className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white font-display tracking-wide">
              BSF BMR & TDEE CALORIE ENGINE
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 font-sans-body">
            Calculate your Basal Metabolic Rate and exact daily macronutrient requirements using the gold-standard Mifflin-St Jeor formula.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Gender & Age */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Gender</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center ${
                    gender === 'male'
                      ? 'bg-orange-400/15 text-orange-300 border-orange-400/40'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:bg-zinc-800/50'
                  }`}
                >
                  Male
                </button>
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center ${
                    gender === 'female'
                      ? 'bg-orange-400/15 text-orange-300 border-orange-400/40'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:bg-zinc-800/50'
                  }`}
                >
                  Female
                </button>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Age</label>
                <span className="text-xs font-mono font-bold text-orange-400">{age} yrs</span>
              </div>
              <input
                type="number"
                min={12}
                max={95}
                value={age}
                onChange={e => setAge(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white text-xs font-mono focus:border-orange-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Height and Weight */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3.5 bg-zinc-950/70 border border-zinc-800/80 rounded-2xl space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-zinc-300 uppercase">Height (cm)</label>
                <span className="text-xs font-mono font-bold text-orange-400">{heightCm} cm</span>
              </div>
              <input
                type="range"
                min={130}
                max={215}
                value={heightCm}
                onChange={e => setHeightCm(Number(e.target.value))}
                className="w-full accent-orange-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
              />
            </div>

            <div className="p-3.5 bg-zinc-950/70 border border-zinc-800/80 rounded-2xl space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-zinc-300 uppercase">Weight (kg)</label>
                <span className="text-xs font-mono font-bold text-orange-400">{weightKg} kg</span>
              </div>
              <input
                type="range"
                min={35}
                max={160}
                value={weightKg}
                onChange={e => setWeightKg(Number(e.target.value))}
                className="w-full accent-orange-400 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
              />
            </div>
          </div>

          {/* Activity Level Selector */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Weekly Activity Multiplier
            </label>
            <div className="space-y-2">
              {activities.map(act => (
                <button
                  key={act.value}
                  type="button"
                  onClick={() => setActivityLevel(act.value)}
                  className={`w-full p-3 rounded-xl border text-left transition flex items-center justify-between ${
                    activityLevel === act.value
                      ? 'bg-orange-400/10 text-white border-orange-400/40 shadow-sm'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold block text-white">{act.label}</span>
                    <span className="text-[11px] text-zinc-400">{act.desc}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-orange-400">×{act.value}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Fitness Goal Tabs */}
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Primary Fitness Objective
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'fat_loss', label: 'Fat Loss (-450 kcal)', icon: Target },
                { id: 'maintenance', label: 'Maintenance', icon: Apple },
                { id: 'muscle_gain', label: 'Muscle Gain (+350 kcal)', icon: Dumbbell }
              ].map(g => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setFitnessGoal(g.id as any)}
                  className={`py-2.5 px-2 rounded-xl border text-center text-xs font-bold transition flex flex-col items-center gap-1 ${
                    fitnessGoal === g.id
                      ? 'bg-orange-400 text-black border-orange-400 font-extrabold shadow-md'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:bg-zinc-800/40'
                  }`}
                >
                  <span>{g.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Results Breakdown (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between p-6 bg-gradient-to-b from-zinc-950 to-zinc-900 border border-zinc-800 rounded-2xl space-y-5">
          <div>
            {/* BMR Card */}
            <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase font-bold text-zinc-400">Base Metabolic Rate (BMR)</p>
                <p className="text-xs text-zinc-500">Calories burned in complete rest</p>
              </div>
              <div className="text-right">
                <span className="font-display font-black text-2xl text-orange-400">{bmr}</span>
                <span className="text-[10px] text-zinc-400 ml-1 font-mono">kcal/day</span>
              </div>
            </div>

            {/* Target Calories Hero */}
            <div className="mt-4 p-5 rounded-2xl bg-orange-400/10 border border-orange-400/30 text-center">
              <p className="text-[11px] font-bold text-orange-400 uppercase tracking-widest">
                Target Daily Intake ({fitnessGoal.replace('_', ' ')})
              </p>
              <div className="my-2">
                <span className="font-display font-black text-5xl text-white tracking-tight">
                  {targetCalories}
                </span>
                <span className="text-xs font-bold text-orange-400 ml-2">KCAL / DAY</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Maintenance TDEE: <strong className="text-zinc-200">{maintenanceTdee} kcal</strong>
              </p>
            </div>

            {/* Daily Macronutrient Targets */}
            <div className="mt-5 space-y-2.5">
              <p className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                Recommended Daily Macros
              </p>

              {/* Protein */}
              <div className="p-3 bg-zinc-950/80 border border-zinc-800 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <div>
                    <span className="text-xs font-bold text-white">Protein (4 kcal/g)</span>
                    <p className="text-[10px] text-zinc-400">{Math.round((proteinCalories / targetCalories) * 100)}% of total energy</p>
                  </div>
                </div>
                <span className="font-mono font-bold text-emerald-400 text-sm">{proteinGrams}g</span>
              </div>

              {/* Carbs */}
              <div className="p-3 bg-zinc-950/80 border border-zinc-800 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-400" />
                  <div>
                    <span className="text-xs font-bold text-white">Carbohydrates (4 kcal/g)</span>
                    <p className="text-[10px] text-zinc-400">{Math.round((carbCalories / targetCalories) * 100)}% of total energy</p>
                  </div>
                </div>
                <span className="font-mono font-bold text-orange-400 text-sm">{carbGrams}g</span>
              </div>

              {/* Fats */}
              <div className="p-3 bg-zinc-950/80 border border-zinc-800 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                  <div>
                    <span className="text-xs font-bold text-white">Healthy Fats (9 kcal/g)</span>
                    <p className="text-[10px] text-zinc-400">{Math.round((fatCalories / targetCalories) * 100)}% of total energy</p>
                  </div>
                </div>
                <span className="font-mono font-bold text-sky-400 text-sm">{fatGrams}g</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-800 flex items-center gap-2 text-[11px] text-zinc-500">
            <Info className="w-4 h-4 text-orange-400 shrink-0" />
            <span>Consult BSF Mysuru certified nutrition coaches for custom meal charts and InBody scans.</span>
          </div>
        </div>
      </div>

    </div>
  );
};
