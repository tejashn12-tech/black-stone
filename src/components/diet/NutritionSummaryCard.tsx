import React from 'react';
import { NutritionMetrics, FitnessGoal } from '../../types/diet';
import {
  Flame,
  Activity,
  Droplets,
  Clock,
  Sparkles,
  ShieldAlert,
  Info,
  Scale
} from 'lucide-react';

interface NutritionSummaryCardProps {
  metrics: NutritionMetrics;
  goal: FitnessGoal;
}

export const NutritionSummaryCard: React.FC<NutritionSummaryCardProps> = ({
  metrics,
  goal
}) => {
  const proteinKcal = metrics.proteinGrams * 4;
  const carbsKcal = metrics.carbsGrams * 4;
  const fatKcal = metrics.fatGrams * 9;
  const totalKcal = proteinKcal + carbsKcal + fatKcal || metrics.dailyCalorieTarget;

  const proteinPct = Math.round((proteinKcal / totalKcal) * 100);
  const carbsPct = Math.round((carbsKcal / totalKcal) * 100);
  const fatPct = Math.round((fatKcal / totalKcal) * 100);

  return (
    <div className="w-full bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden" id="bsf-nutrition-summary-card">
      
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-[10px] font-bold font-mono uppercase tracking-wider">
            <Sparkles className="w-3 h-3" />
            <span>CALCULATED NUTRITION BLUEPRINT</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
            Metabolic & Macronutrient Targets
          </h2>
          <p className="text-xs text-zinc-400">
            Computed using the scientific Mifflin–St Jeor equation and verified athletic activity multipliers.
          </p>
        </div>

        {/* Goal Badge */}
        <div className="px-4 py-2 rounded-2xl bg-zinc-950 border border-orange-500/30 text-orange-400 text-xs font-black uppercase tracking-wider">
          {goal.replace(/_/g, ' ')}
        </div>
      </div>

      {/* Primary Key Metric Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        {/* Daily Target Calories */}
        <div className="p-4 rounded-2xl bg-zinc-950 border border-orange-500/20 relative overflow-hidden">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1 font-bold uppercase tracking-wider">
            <span>Calorie Target</span>
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {metrics.dailyCalorieTarget}
            <span className="text-xs font-normal text-zinc-500 ml-1">kcal</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-orange-400">
            <span>{metrics.calorieDelta >= 0 ? `+${metrics.calorieDelta}` : metrics.calorieDelta} kcal vs TDEE</span>
          </div>
        </div>

        {/* Basal Metabolic Rate (BMR) */}
        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1 font-bold uppercase tracking-wider">
            <span>Mifflin BMR</span>
            <Activity className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {metrics.bmr}
            <span className="text-xs font-normal text-zinc-500 ml-1">kcal</span>
          </div>
          <div className="mt-1 text-[11px] text-zinc-500">
            Basal Resting Burn (Zero activity)
          </div>
        </div>

        {/* Total Daily Energy Expenditure (TDEE) */}
        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1 font-bold uppercase tracking-wider">
            <span>Total TDEE</span>
            <Scale className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {metrics.tdee}
            <span className="text-xs font-normal text-zinc-500 ml-1">kcal</span>
          </div>
          <div className="mt-1 text-[11px] text-zinc-500">
            Maintenance expenditure
          </div>
        </div>

        {/* Daily Hydration */}
        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1 font-bold uppercase tracking-wider">
            <span>Water Target</span>
            <Droplets className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {metrics.hydrationLiters}
            <span className="text-xs font-normal text-zinc-500 ml-1">L</span>
          </div>
          <div className="mt-1 text-[11px] text-cyan-400 font-semibold">
            ≈ {metrics.hydrationGlasses} glasses (250ml)
          </div>
        </div>

      </div>

      {/* Macronutrient Distribution Bar & Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-zinc-400">
          <span>Daily Macronutrient Breakdown</span>
          <span>{proteinPct}% Protein · {carbsPct}% Carbs · {fatPct}% Lipids</span>
        </div>

        {/* Visual Progress Split Bar */}
        <div className="w-full h-3 rounded-full bg-zinc-950 flex overflow-hidden p-0.5 border border-zinc-800">
          <div style={{ width: `${proteinPct}%` }} className="h-full bg-orange-400 rounded-l-full" title={`Protein: ${proteinPct}%`} />
          <div style={{ width: `${carbsPct}%` }} className="h-full bg-emerald-400" title={`Carbohydrates: ${carbsPct}%`} />
          <div style={{ width: `${fatPct}%` }} className="h-full bg-purple-400 rounded-r-full" title={`Fats: ${fatPct}%`} />
        </div>

        {/* 4 Macro Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          
          {/* Protein */}
          <div className="p-3.5 rounded-2xl bg-zinc-950 border border-orange-500/20">
            <div className="text-[10px] font-bold uppercase tracking-wider text-orange-400 mb-0.5">Protein (Muscle)</div>
            <div className="text-xl font-black text-white font-mono">
              {metrics.proteinGrams}g
            </div>
            <div className="text-[10px] text-zinc-500 mt-0.5">
              {proteinKcal} kcal ({proteinPct}%)
            </div>
            <div className="text-[10px] text-orange-400/90 font-medium mt-1">
              Repairs muscle tissue after lifting
            </div>
          </div>

          {/* Carbs */}
          <div className="p-3.5 rounded-2xl bg-zinc-950 border border-emerald-500/20">
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-0.5">Carbs (Energy)</div>
            <div className="text-xl font-black text-white font-mono">
              {metrics.carbsGrams}g
            </div>
            <div className="text-[10px] text-zinc-500 mt-0.5">
              {carbsKcal} kcal ({carbsPct}%)
            </div>
            <div className="text-[10px] text-emerald-400/90 font-medium mt-1">
              Gym stamina & brain fuel
            </div>
          </div>

          {/* Fat */}
          <div className="p-3.5 rounded-2xl bg-zinc-950 border border-purple-500/20">
            <div className="text-[10px] font-bold uppercase tracking-wider text-purple-400 mb-0.5">Healthy Fats</div>
            <div className="text-xl font-black text-white font-mono">
              {metrics.fatGrams}g
            </div>
            <div className="text-[10px] text-zinc-500 mt-0.5">
              {fatKcal} kcal ({fatPct}%)
            </div>
            <div className="text-[10px] text-purple-400/90 font-medium mt-1">
              Joint lubrication & hormone balance
            </div>
          </div>

          {/* Fiber */}
          <div className="p-3.5 rounded-2xl bg-zinc-950 border border-cyan-500/20">
            <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 mb-0.5">Dietary Fiber</div>
            <div className="text-xl font-black text-white font-mono">
              {metrics.fiberGrams}g
            </div>
            <div className="text-[10px] text-zinc-500 mt-0.5">
              Microbiome health
            </div>
            <div className="text-[10px] text-cyan-400/90 font-medium mt-1">
              Smooth digestion & feeling full
            </div>
          </div>

        </div>
      </div>

      {/* BMI and Limitations Card */}
      <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-orange-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-200">
              Body Mass Index: <span className="font-mono text-white text-sm">{metrics.bmi}</span>
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
              metrics.bmiCategory === 'Normal' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
            }`}>
              {metrics.bmiCategory}
            </span>
          </div>
          <span className="text-[11px] text-zinc-500">Suggested frequency: {metrics.suggestedMealFrequency} meals/day</span>
        </div>
        <p className="text-[11px] text-zinc-400 leading-relaxed font-sans-body">
          <span className="text-orange-400 font-bold">Important Limitation:</span> {metrics.bmiLimitationsNotice}
        </p>
      </div>

      {/* Goal & Nutritional Rationale */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500/10 to-zinc-950 border border-orange-500/30 space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-wide">
          <Info className="w-4 h-4" />
          <span>Why This Nutritional Strategy Was Selected For You</span>
        </div>
        <p className="text-xs text-zinc-300 leading-relaxed font-sans-body">
          {metrics.goalRationale}
        </p>
        <p className="text-[11px] text-zinc-400 font-sans-body">
          {metrics.macroRationale}
        </p>
      </div>

    </div>
  );
};
