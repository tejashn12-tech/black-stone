import React, { useState } from 'react';
import { BmiCalculator } from './BmiCalculator';
import { BmrCalculator } from './BmrCalculator';
import { Activity, Flame, Dumbbell, Sparkles } from 'lucide-react';

export const CalculatorsHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'bmi' | 'bmr'>('bmi');

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8" id="bsf-calculators-hub">
      
      {/* Top Banner */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-400/10 border border-orange-400/30 text-orange-400 text-xs font-bold font-mono uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>SCIENTIFIC METRIC ASSESSMENT</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white font-display tracking-tight uppercase">
          ATHLETIC HEALTH & CALORIE TOOLS
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 font-sans-body">
          Calculate your exact Body Mass Index, Basal Metabolic Rate, daily energy expenditure, and protein targets.
        </p>
      </div>

      {/* Switcher Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex p-1.5 bg-zinc-900 border border-zinc-800 rounded-2xl gap-2 shadow-xl">
          <button
            onClick={() => setActiveTab('bmi')}
            className={`px-6 py-2.5 rounded-xl text-xs font-extrabold transition flex items-center gap-2 ${
              activeTab === 'bmi'
                ? 'bg-orange-400 text-black shadow-lg shadow-orange-400/20'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>BMI Body Mass Index</span>
          </button>

          <button
            onClick={() => setActiveTab('bmr')}
            className={`px-6 py-2.5 rounded-xl text-xs font-extrabold transition flex items-center gap-2 ${
              activeTab === 'bmr'
                ? 'bg-orange-400 text-black shadow-lg shadow-orange-400/20'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>BMR & TDEE Calorie Engine</span>
          </button>
        </div>
      </div>

      {/* Active Calculator Component */}
      <div className="pt-2">
        {activeTab === 'bmi' ? <BmiCalculator /> : <BmrCalculator />}
      </div>

      {/* Direct Banner to AI Diet Planner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-orange-500/10 via-zinc-900 to-zinc-900 border border-orange-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <div className="text-xs font-bold text-orange-400 uppercase tracking-wider font-mono">
            NEXT-LEVEL ATHLETIC MEAL BLUEPRINT
          </div>
          <h3 className="text-lg font-black text-white uppercase">
            Need an exact 7-Day Meal Plan built for your exact BMR?
          </h3>
          <p className="text-xs text-zinc-400 max-w-xl">
            Our AI Diet Planner calculates your calories, protein, carbs, and fats, generating daily meals, grocery shopping lists, and cultural recipes with strict allergen exclusion.
          </p>
        </div>
        <button
          onClick={() => {
            window.location.hash = '#diet';
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="px-6 py-3 rounded-2xl bg-orange-400 hover:bg-orange-300 text-black font-black text-xs uppercase tracking-wider transition shadow-lg shadow-orange-400/20 flex-shrink-0"
        >
          Launch AI Diet Planner
        </button>
      </div>

    </div>
  );
};
