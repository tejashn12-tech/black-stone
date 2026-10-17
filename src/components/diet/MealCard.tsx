import React, { useState } from 'react';
import { Meal } from '../../types/diet';
import {
  Clock,
  Flame,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Heart,
  ChefHat,
  ArrowRightLeft,
  Coins,
  ShieldCheck,
  Sparkles,
  Info
} from 'lucide-react';

interface MealCardProps {
  meal: Meal;
  dayNumber: number;
  onToggleCompleted: (dayNumber: number, mealId: string) => void;
  onScaleServing: (dayNumber: number, mealId: string, scale: number) => void;
  onReplaceMeal: (dayNumber: number, mealId: string) => void;
  onToggleFavorite: (dayNumber: number, mealId: string) => void;
}

export const MealCard: React.FC<MealCardProps> = ({
  meal,
  dayNumber,
  onToggleCompleted,
  onScaleServing,
  onReplaceMeal,
  onToggleFavorite
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [isPhotoZoomed, setIsPhotoZoomed] = useState(false);

  const slotLabels: Record<string, { label: string; color: string }> = {
    breakfast: { label: 'Breakfast', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
    mid_morning: { label: 'Mid-Morning Snack', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30' },
    lunch: { label: 'Power Lunch', color: 'text-orange-400 bg-orange-500/10 border-orange-500/30' },
    pre_workout: { label: 'Pre-Workout Fuel', color: 'text-red-400 bg-red-500/10 border-red-500/30' },
    post_workout: { label: 'Post-Workout Anabolic', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
    evening_snack: { label: 'Evening Recharge', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
    dinner: { label: 'Recovery Dinner', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' }
  };

  const slotInfo = slotLabels[meal.slot] || { label: meal.slot, color: 'text-orange-400 bg-orange-500/10 border-orange-500/30' };

  const handleReplaceClick = () => {
    setIsSwapping(true);
    setTimeout(() => {
      onReplaceMeal(dayNumber, meal.id);
      setIsSwapping(false);
    }, 250);
  };

  return (
    <div
      className={`rounded-3xl border transition-all duration-300 relative overflow-hidden ${
        meal.isCompleted
          ? 'bg-zinc-900/60 border-emerald-500/40 shadow-lg shadow-emerald-500/5'
          : 'bg-zinc-900/90 border-zinc-800 hover:border-zinc-700 shadow-xl'
      }`}
      id={`bsf-meal-card-${meal.id}`}
    >
      
      {/* Main Flex Layout: Photo on left, Details on right */}
      <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-5 items-stretch">
        
        {/* Meal Photo (Prominent & High Quality) */}
        {meal.imageUrl && (
          <div
            onClick={() => setIsPhotoZoomed(!isPhotoZoomed)}
            className="w-full sm:w-44 h-44 sm:h-auto rounded-2xl overflow-hidden bg-zinc-950 flex-shrink-0 relative group cursor-pointer border border-zinc-800"
            title="Click to zoom meal photo"
          >
            <img
              src={meal.imageUrl}
              alt={meal.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-90 group-hover:opacity-60 transition" />
            
            {/* Overlay Badges */}
            <span className="absolute bottom-2.5 left-2.5 text-[10px] font-mono font-black text-orange-400 bg-black/80 px-2 py-0.5 rounded-md backdrop-blur border border-zinc-800">
              {meal.calories} kcal
            </span>

            <span className="absolute top-2.5 right-2.5 p-1 rounded-md bg-black/60 text-zinc-300 backdrop-blur opacity-0 group-hover:opacity-100 transition text-[9px] font-bold">
              Zoom Photo
            </span>
          </div>
        )}

        {/* Meal Details & Controls */}
        <div className="flex-1 space-y-3.5 flex flex-col justify-between">
          
          {/* Top Row: Slot Tag, Time, Scaler & Actions */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border ${slotInfo.color}`}>
                {slotInfo.label}
              </span>
              <span className="flex items-center gap-1 text-[11px] font-mono text-zinc-400">
                <Clock className="w-3 h-3 text-zinc-500" />
                <span>{meal.timeHint}</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Serving scaler */}
              <div className="inline-flex items-center bg-zinc-950 border border-zinc-800 rounded-xl p-0.5 text-[10px] font-mono">
                {[1.0, 1.25, 1.5, 2.0].map(scale => (
                  <button
                    key={scale}
                    type="button"
                    onClick={() => onScaleServing(dayNumber, meal.id, scale)}
                    className={`px-2 py-0.5 rounded-lg font-bold transition ${
                      (meal.servingScale || 1.0) === scale
                        ? 'bg-orange-400 text-black shadow-sm font-black'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                    title={`Scale serving by ${scale}x`}
                  >
                    {scale}x
                  </button>
                ))}
              </div>

              {/* Favorite button */}
              <button
                type="button"
                onClick={() => onToggleFavorite(dayNumber, meal.id)}
                className={`p-2 rounded-xl border transition ${
                  meal.isFavorite
                    ? 'bg-red-500/20 border-red-500/40 text-red-400'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                }`}
                title={meal.isFavorite ? 'Remove from favorites' : 'Save to favorites'}
              >
                <Heart className={`w-3.5 h-3.5 ${meal.isFavorite ? 'fill-red-400' : ''}`} />
              </button>

              {/* Replace Meal Button */}
              <button
                type="button"
                onClick={handleReplaceClick}
                disabled={isSwapping}
                className="p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-orange-400 hover:border-orange-500/40 transition"
                title="Replace with an alternate meal meeting same macros"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSwapping ? 'animate-spin text-orange-400' : ''}`} />
              </button>
            </div>
          </div>

          {/* Meal Title & Checkbox */}
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <h3 className={`text-base sm:text-lg font-black uppercase tracking-tight transition ${
                meal.isCompleted ? 'text-zinc-400 line-through' : 'text-white'
              }`}>
                {meal.name}
              </h3>
              <p className="text-xs text-zinc-400 font-sans-body line-clamp-2 leading-relaxed">
                {meal.description}
              </p>
            </div>

            {/* Interactive Completion Toggle */}
            <button
              type="button"
              onClick={() => onToggleCompleted(dayNumber, meal.id)}
              className={`p-2 sm:px-3 sm:py-2 rounded-2xl border transition flex items-center gap-1.5 select-none flex-shrink-0 ${
                meal.isCompleted
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
              }`}
              title={meal.isCompleted ? 'Mark as pending' : 'Mark as eaten / completed'}
            >
              {meal.isCompleted ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-[10px] font-black uppercase hidden sm:inline">Eaten</span>
                </>
              ) : (
                <>
                  <Circle className="w-5 h-5" />
                  <span className="text-[10px] font-bold uppercase hidden sm:inline">Mark Eaten</span>
                </>
              )}
            </button>
          </div>

          {/* Easy-to-understand Hand Portion & Price */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-zinc-800/60 text-xs">
            <div className="text-zinc-300 font-medium text-[11px] flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] font-bold uppercase text-zinc-400">
                Portion:
              </span>
              <span>{meal.portionDescription}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-mono">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>≈ ₹{meal.estimatedCostInr}</span>
            </div>
          </div>

          {/* Visual Macro Badges (Explained for easy understanding) */}
          <div className="grid grid-cols-5 gap-2 pt-1">
            <div className="p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-center">
              <div className="text-[9px] uppercase font-bold text-zinc-500">Calories</div>
              <div className="text-xs sm:text-sm font-black text-white font-mono">{meal.calories}</div>
              <div className="text-[8px] text-zinc-500">energy</div>
            </div>
            <div className="p-2 rounded-xl bg-zinc-950 border border-orange-500/20 text-center">
              <div className="text-[9px] uppercase font-bold text-orange-400">Protein</div>
              <div className="text-xs sm:text-sm font-black text-white font-mono">{meal.proteinGrams}g</div>
              <div className="text-[8px] text-orange-400/80 font-bold">muscle</div>
            </div>
            <div className="p-2 rounded-xl bg-zinc-950 border border-emerald-500/20 text-center">
              <div className="text-[9px] uppercase font-bold text-emerald-400">Carbs</div>
              <div className="text-xs sm:text-sm font-black text-white font-mono">{meal.carbsGrams}g</div>
              <div className="text-[8px] text-emerald-400/80 font-bold">fuel</div>
            </div>
            <div className="p-2 rounded-xl bg-zinc-950 border border-purple-500/20 text-center">
              <div className="text-[9px] uppercase font-bold text-purple-400">Lipids</div>
              <div className="text-xs sm:text-sm font-black text-white font-mono">{meal.fatGrams}g</div>
              <div className="text-[8px] text-purple-400/80 font-bold">hormones</div>
            </div>
            <div className="p-2 rounded-xl bg-zinc-950 border border-cyan-500/20 text-center">
              <div className="text-[9px] uppercase font-bold text-cyan-400">Fiber</div>
              <div className="text-xs sm:text-sm font-black text-white font-mono">{meal.fiberGrams}g</div>
              <div className="text-[8px] text-cyan-400/80 font-bold">gut</div>
            </div>
          </div>

        </div>

      </div>

      {/* Expandable Recipe & Substitution Details Toggle */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full py-2.5 px-6 bg-zinc-950/60 hover:bg-zinc-950 border-t border-zinc-800 text-[11px] font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition flex items-center justify-between"
      >
        <span className="flex items-center gap-1.5">
          <ChefHat className="w-3.5 h-3.5 text-orange-400" />
          <span>{isExpanded ? 'Hide Recipe & Cooking Steps' : 'View Ingredients, Cooking Steps & Swaps'}</span>
        </span>
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {/* Expanded Content Drawer */}
      {isExpanded && (
        <div className="p-5 sm:p-6 bg-zinc-950 border-t border-zinc-800/80 space-y-5 animate-in fade-in duration-200">
          
          {/* Ingredients Breakdown */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-zinc-300 flex items-center justify-between">
              <span>Ingredients & Practical Measures</span>
              <span className="text-[10px] text-zinc-500 font-normal">Approx. Local Price</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {meal.ingredients.map((ing, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-zinc-200">{ing.name}</span>
                    <span className="text-zinc-400 ml-1.5 font-mono text-[11px]">({ing.amount})</span>
                  </div>
                  <span className="text-amber-400 font-mono text-[11px]">₹{ing.approxCostInr}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Simple Step-by-Step Cooking Instructions */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-zinc-300">
              Quick Preparation Instructions (3–4 Steps)
            </h4>
            <ol className="space-y-1.5 text-xs text-zinc-400 font-sans-body">
              {meal.prepInstructions.map((step, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-orange-400/20 text-orange-400 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Healthy Substitutions */}
          {meal.substitutions && meal.substitutions.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-1.5">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-orange-400">
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Smart Food Substitutions (Keeps same macros)</span>
              </div>
              <ul className="space-y-1 text-xs text-zinc-400">
                {meal.substitutions.map((sub, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                    <span>{sub}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Allergen Notice */}
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Checked against declared allergies. Excludes harmful triggers.</span>
          </div>

        </div>
      )}

      {/* Photo Zoom Modal */}
      {isPhotoZoomed && meal.imageUrl && (
        <div
          onClick={() => setIsPhotoZoomed(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in"
        >
          <div className="max-w-xl w-full bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <img
              src={meal.imageUrl}
              alt={meal.name}
              referrerPolicy="no-referrer"
              className="w-full h-80 object-cover"
            />
            <div className="p-5 space-y-2">
              <h3 className="text-lg font-black text-white uppercase">{meal.name}</h3>
              <p className="text-xs text-zinc-400">{meal.description}</p>
              <div className="flex items-center justify-between pt-2 border-t border-zinc-800 text-xs font-mono">
                <span className="text-orange-400 font-bold">{meal.calories} kcal</span>
                <span>P: {meal.proteinGrams}g · C: {meal.carbsGrams}g · F: {meal.fatGrams}g</span>
                <button
                  type="button"
                  onClick={() => setIsPhotoZoomed(false)}
                  className="px-3 py-1 bg-zinc-800 text-white rounded-lg text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
