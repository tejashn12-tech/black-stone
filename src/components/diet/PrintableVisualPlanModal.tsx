import React from 'react';
import { FullDietPlan } from '../../types/diet';
import {
  Printer,
  X,
  Sparkles,
  Flame,
  CheckCircle2,
  Clock,
  Scale,
  Droplets,
  Coins,
  ShieldCheck,
  FileDown
} from 'lucide-react';

interface PrintableVisualPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: FullDietPlan;
  onDownloadPdf: () => void;
  isDownloading: boolean;
}

export const PrintableVisualPlanModal: React.FC<PrintableVisualPlanModalProps> = ({
  isOpen,
  onClose,
  plan,
  onDownloadPdf,
  isDownloading
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-5xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Top Control Bar (Hidden during print) */}
        <div className="p-4 sm:p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/80 print:hidden">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black uppercase tracking-wide text-white">
                Illustrated 7-Day Athletic Diet Blueprint
              </h2>
              <p className="text-xs text-zinc-400">
                Print or export high-resolution PDF with meal photos, macros & portion guides
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onDownloadPdf}
              disabled={isDownloading}
              className="px-4 py-2 bg-zinc-900 border border-zinc-700 hover:border-orange-400 text-zinc-200 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5"
            >
              <FileDown className="w-4 h-4 text-emerald-400" />
              <span>{isDownloading ? 'Generating...' : 'Download PDF'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-orange-400 hover:bg-orange-300 text-black rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center gap-1.5 shadow-lg shadow-orange-400/20"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Scroll Area */}
        <div className="p-4 sm:p-8 overflow-y-auto space-y-8 flex-1 bg-zinc-900/40 print:bg-white print:text-black print:p-0 print:overflow-visible">
          
          {/* Printable Header */}
          <div className="border-b border-zinc-800 print:border-zinc-300 pb-6 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-mono font-bold text-orange-400 uppercase tracking-widest">
                  BLACK STONE FITNESS (BSF) MYSURU
                </span>
                <h1 className="text-2xl sm:text-4xl font-black text-white print:text-black uppercase tracking-tight">
                  ATHLETE NUTRITION BLUEPRINT
                </h1>
              </div>
              <div className="text-right text-xs font-mono text-zinc-400 print:text-zinc-600">
                <div>Date: {new Date().toLocaleDateString('en-IN')}</div>
                <div className="text-orange-400 font-bold uppercase">{plan.profile.primaryGoal.replace(/_/g, ' ')}</div>
              </div>
            </div>
            
            <p className="text-xs text-zinc-400 print:text-zinc-700 font-sans-body max-w-3xl leading-relaxed">
              {plan.explanation}
            </p>
          </div>

          {/* Quick Athlete Key Metrics Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-zinc-950 border border-zinc-800 print:bg-zinc-100 print:border-zinc-300">
            <div>
              <span className="text-[10px] font-bold uppercase text-zinc-500 print:text-zinc-600">Daily Target Energy</span>
              <div className="text-xl sm:text-2xl font-black text-orange-400 print:text-orange-600 font-mono">
                {plan.metrics.dailyCalorieTarget} <span className="text-xs font-normal">kcal</span>
              </div>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-zinc-500 print:text-zinc-600">Protein Target</span>
              <div className="text-xl sm:text-2xl font-black text-white print:text-black font-mono">
                {plan.metrics.proteinGrams}g <span className="text-xs font-normal text-emerald-400">(tissue)</span>
              </div>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-zinc-500 print:text-zinc-600">Carbohydrates</span>
              <div className="text-xl sm:text-2xl font-black text-white print:text-black font-mono">
                {plan.metrics.carbsGrams}g <span className="text-xs font-normal text-emerald-400">(glycogen)</span>
              </div>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-zinc-500 print:text-zinc-600">Healthy Fats</span>
              <div className="text-xl sm:text-2xl font-black text-white print:text-black font-mono">
                {plan.metrics.fatGrams}g <span className="text-xs font-normal text-purple-400">(lipids)</span>
              </div>
            </div>
          </div>

          {/* Easy Hand-Portion Reference Bar */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-zinc-950 to-zinc-950 border border-amber-500/30 print:bg-amber-50 print:border-amber-300">
            <h4 className="text-xs font-black uppercase text-amber-400 print:text-amber-800 tracking-wider mb-1">
              EASY HAND-PORTION VISUAL GUIDE (NO FOOD SCALE NEEDED)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-zinc-300 print:text-zinc-800 font-sans-body">
              <div><strong className="text-white print:text-black">✋ Palm Size:</strong> Protein (~120-150g)</div>
              <div><strong className="text-white print:text-black">✊ Fist Size:</strong> Carbs / Rice / Oats (1 cup)</div>
              <div><strong className="text-white print:text-black">🤲 Cupped Hand:</strong> Snacks / Dal / Nuts (30g)</div>
              <div><strong className="text-white print:text-black">👍 Thumb Size:</strong> Ghee / Olive Oil (1 tbsp)</div>
            </div>
          </div>

          {/* 7 Days Section */}
          <div className="space-y-8">
            {plan.days.map(day => (
              <div
                key={day.dayNumber}
                className="space-y-4 border border-zinc-800 print:border-zinc-300 rounded-3xl p-4 sm:p-6 bg-zinc-950/60 print:bg-white print:break-inside-avoid"
              >
                {/* Day Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 print:border-zinc-300 pb-3">
                  <div>
                    <span className="text-xs font-mono font-bold text-orange-400 uppercase">DAY {day.dayNumber}</span>
                    <h3 className="text-lg font-black text-white print:text-black uppercase">
                      {day.dayName}: {day.focusNote}
                    </h3>
                  </div>
                  <div className="text-xs font-mono text-zinc-400 print:text-zinc-700 font-bold">
                    Total: {day.totalCalories} kcal · P: {day.totalProtein}g · C: {day.totalCarbs}g · F: {day.totalFat}g
                  </div>
                </div>

                {/* Meals with Photos */}
                <div className="grid grid-cols-1 gap-3">
                  {day.meals.map(meal => (
                    <div
                      key={meal.id}
                      className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 print:bg-zinc-50 print:border-zinc-200 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                    >
                      {/* Photo Thumbnail */}
                      <div className="w-full sm:w-28 sm:h-24 h-40 rounded-xl overflow-hidden bg-zinc-950 flex-shrink-0 relative border border-zinc-800 print:border-zinc-300">
                        {meal.imageUrl ? (
                          <img
                            src={meal.imageUrl}
                            alt={meal.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-600 text-[10px] font-bold">
                            NO PHOTO
                          </div>
                        )}
                        <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-mono font-bold text-orange-400 uppercase">
                          {meal.slot.replace(/_/g, ' ')}
                        </span>
                      </div>

                      {/* Meal Details */}
                      <div className="flex-1 space-y-1.5 w-full">
                        <div className="flex flex-wrap items-center justify-between gap-1">
                          <h4 className="text-sm font-black text-white print:text-black uppercase">
                            {meal.name}
                          </h4>
                          <span className="text-xs font-mono text-amber-400 print:text-amber-700 font-bold">
                            ≈ ₹{meal.estimatedCostInr}
                          </span>
                        </div>

                        <p className="text-xs text-zinc-400 print:text-zinc-600 font-sans-body line-clamp-1">
                          {meal.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-xs pt-1 border-t border-zinc-800/60 print:border-zinc-200">
                          <span className="font-mono font-black text-orange-400 print:text-orange-600">
                            {meal.calories} kcal
                          </span>
                          <span className="text-zinc-400 print:text-zinc-700 font-mono">
                            Protein: {meal.proteinGrams}g
                          </span>
                          <span className="text-zinc-400 print:text-zinc-700 font-mono">
                            Carbs: {meal.carbsGrams}g
                          </span>
                          <span className="text-zinc-400 print:text-zinc-700 font-mono">
                            Fat: {meal.fatGrams}g
                          </span>
                          <span className="text-zinc-500 print:text-zinc-600 ml-auto text-[11px]">
                            {meal.timeHint}
                          </span>
                        </div>

                        <div className="text-[11px] text-zinc-400 print:text-zinc-700 font-medium">
                          <span className="text-zinc-500 font-bold uppercase text-[10px] mr-1">Portion:</span>
                          {meal.portionDescription}
                        </div>
                      </div>

                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>

          {/* Safety Notice Footer */}
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 print:bg-zinc-100 print:border-zinc-300 text-[11px] text-zinc-500 print:text-zinc-700 space-y-1">
            <div className="font-bold uppercase text-zinc-400 print:text-zinc-800">Clinical & Safety Disclaimer</div>
            <p>
              This personalized diet plan is provided for fitness conditioning and sports performance. Consult a certified clinical nutritionist or physician for medical diet therapy.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
