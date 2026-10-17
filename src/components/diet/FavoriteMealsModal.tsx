import React from 'react';
import { Meal } from '../../types/diet';
import { Heart, X, ChefHat, Flame, Coins, Clock } from 'lucide-react';

interface FavoriteMealsModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: Meal[];
  onRemoveFavorite: (mealId: string) => void;
}

export const FavoriteMealsModal: React.FC<FavoriteMealsModalProps> = ({
  isOpen,
  onClose,
  favorites,
  onRemoveFavorite
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20">
              <Heart className="w-5 h-5 fill-red-400" />
            </div>
            <div>
              <h2 className="text-lg font-black uppercase tracking-wide text-white">
                Saved Favorite Meals & Recipes
              </h2>
              <p className="text-xs text-zinc-400">{favorites.length} saved recipes in your athletic cookbook</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {favorites.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-600 flex items-center justify-center mx-auto">
                <Heart className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-zinc-300">No favorite meals saved yet</h4>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Tap the heart icon on any meal card in your 7-day schedule to bookmark your top high-protein recipes.
              </p>
            </div>
          ) : (
            favorites.map(meal => (
              <div
                key={meal.id}
                className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3 relative group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400">
                      {meal.slot.replace(/_/g, ' ')}
                    </span>
                    <h3 className="text-sm font-black text-white uppercase mt-0.5">{meal.name}</h3>
                    <p className="text-xs text-zinc-400 font-sans-body mt-1">{meal.description}</p>
                  </div>
                  <button
                    onClick={() => onRemoveFavorite(meal.id)}
                    className="p-2 text-red-400 hover:text-red-300 transition"
                    title="Remove from favorites"
                  >
                    <Heart className="w-4 h-4 fill-red-400" />
                  </button>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono text-zinc-300 border-t border-zinc-800/60 pt-2.5">
                  <span className="flex items-center gap-1 text-orange-400 font-bold">
                    <Flame className="w-3.5 h-3.5" />
                    {meal.calories} kcal
                  </span>
                  <span>P: {meal.proteinGrams}g</span>
                  <span>C: {meal.carbsGrams}g</span>
                  <span>F: {meal.fatGrams}g</span>
                  <span className="ml-auto text-amber-400">₹{meal.estimatedCostInr}</span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
