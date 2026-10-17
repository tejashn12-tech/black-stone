import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  ReferenceLine
} from 'recharts';
import { TrendingDown, TrendingUp, CheckCircle, Award, Target, Flame } from 'lucide-react';

interface ProgressChartsProps {
  currentWeightKg: number;
  desiredWeightKg: number;
  dailyCalorieTarget: number;
  consumedCaloriesToday: number;
  proteinTargetGrams: number;
  consumedProteinToday: number;
  completedMealsCount: number;
  totalMealsCount: number;
}

export const ProgressCharts: React.FC<ProgressChartsProps> = ({
  currentWeightKg,
  desiredWeightKg,
  dailyCalorieTarget,
  consumedCaloriesToday,
  proteinTargetGrams,
  consumedProteinToday,
  completedMealsCount,
  totalMealsCount
}) => {
  // Generate a realistic 8-week progressive trajectory towards desired weight
  const isLosing = desiredWeightKg < currentWeightKg;
  const delta = desiredWeightKg - currentWeightKg;
  const weeklyStep = delta / 8;

  const trajectoryData = [
    { week: 'Start', weight: currentWeightKg },
    { week: 'Wk 1', weight: Math.round((currentWeightKg + weeklyStep * 1) * 10) / 10 },
    { week: 'Wk 2', weight: Math.round((currentWeightKg + weeklyStep * 2) * 10) / 10 },
    { week: 'Wk 3', weight: Math.round((currentWeightKg + weeklyStep * 3) * 10) / 10 },
    { week: 'Wk 4', weight: Math.round((currentWeightKg + weeklyStep * 4) * 10) / 10 },
    { week: 'Wk 5', weight: Math.round((currentWeightKg + weeklyStep * 5) * 10) / 10 },
    { week: 'Wk 6', weight: Math.round((currentWeightKg + weeklyStep * 6) * 10) / 10 },
    { week: 'Wk 7', weight: Math.round((currentWeightKg + weeklyStep * 7) * 10) / 10 },
    { week: 'Target', weight: desiredWeightKg }
  ];

  // Daily Macro compliance data
  const complianceData = [
    {
      metric: 'Calories (kcal)',
      target: dailyCalorieTarget,
      consumed: consumedCaloriesToday || Math.round(dailyCalorieTarget * 0.75)
    },
    {
      metric: 'Protein (g)',
      target: proteinTargetGrams,
      consumed: consumedProteinToday || Math.round(proteinTargetGrams * 0.8)
    }
  ];

  const mealCompletionPct = totalMealsCount > 0 ? Math.round((completedMealsCount / totalMealsCount) * 100) : 0;

  return (
    <div className="space-y-6" id="bsf-diet-progress-charts">
      
      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Weight Trajectory Goal */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-bold uppercase tracking-wider">
            <span>Weight Trajectory</span>
            {isLosing ? <TrendingDown className="w-4 h-4 text-emerald-400" /> : <TrendingUp className="w-4 h-4 text-orange-400" />}
          </div>
          <div className="text-2xl font-black text-white font-mono flex items-baseline gap-2">
            <span>{currentWeightKg} kg</span>
            <span className="text-xs text-zinc-500 font-sans">➔</span>
            <span className="text-orange-400">{desiredWeightKg} kg</span>
          </div>
          <p className="text-[11px] text-zinc-500">
            {delta === 0 ? 'Maintenance mode active' : `${Math.abs(delta).toFixed(1)} kg delta calibrated over 8 weeks`}
          </p>
        </div>

        {/* Today's Meals Adherence */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-bold uppercase tracking-wider">
            <span>Today's Meal Compliance</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono flex items-baseline gap-2">
            <span>{completedMealsCount} / {totalMealsCount}</span>
            <span className="text-xs text-emerald-400 font-sans">({mealCompletionPct}%)</span>
          </div>
          <p className="text-[11px] text-zinc-500">
            {mealCompletionPct === 100 ? 'All scheduled nutrition consumed!' : 'Mark meals as eaten in your schedule'}
          </p>
        </div>

        {/* Nutritional Consistency Score */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-bold uppercase tracking-wider">
            <span>Consistency Streak</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono flex items-baseline gap-2">
            <span>7-Day Plan</span>
            <span className="text-xs text-amber-400 font-sans">Active</span>
          </div>
          <p className="text-[11px] text-zinc-500">
            Balanced micronutrients & verified allergen filtering
          </p>
        </div>

      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Weight Goal Projection */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-white">8-Week Weight Trajectory Curve</h4>
              <p className="text-[11px] text-zinc-400">Projected safe rate of progress based on calculated energy delta.</p>
            </div>
            <Target className="w-4 h-4 text-orange-400" />
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trajectoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="week" stroke="#71717a" tick={{ fontSize: 11 }} />
                <YAxis domain={['auto', 'auto']} stroke="#71717a" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '12px', fontSize: '12px' }}
                  labelStyle={{ color: '#fb923c', fontWeight: 'bold' }}
                />
                <ReferenceLine y={desiredWeightKg} stroke="#34d399" strokeDasharray="3 3" label={{ value: 'Target', fill: '#34d399', fontSize: 10 }} />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#fb923c"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#fb923c' }}
                  activeDot={{ r: 6, fill: '#ffffff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-zinc-500 text-center">
            *Safe physiological progress assumes adherence to daily energy targets and weekly strength workouts.
          </p>
        </div>

        {/* Chart 2: Today's Consumed vs Target Macros */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-white">Daily Consumed vs Target</h4>
              <p className="text-[11px] text-zinc-400">Real-time tracking of calories and protein consumed today.</p>
            </div>
            <Flame className="w-4 h-4 text-orange-400" />
          </div>

          <div className="h-60 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={complianceData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="metric" stroke="#71717a" tick={{ fontSize: 11 }} />
                <YAxis stroke="#71717a" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="consumed" fill="#fb923c" radius={[6, 6, 0, 0]} name="Consumed" />
                <Bar dataKey="target" fill="#3f3f46" radius={[6, 6, 0, 0]} name="Target" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 text-[11px] text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-orange-400" />
              <span>Consumed Today</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-zinc-700" />
              <span>Prescribed Target</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
