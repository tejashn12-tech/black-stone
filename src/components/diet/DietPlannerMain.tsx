import React, { useState, useEffect } from 'react';
import {
  UserDietProfile,
  FullDietPlan,
  Meal,
  ShoppingListItem
} from '../../types/diet';
import { calculateNutritionMetrics } from '../../services/nutritionCalculator';
import {
  generateFullDietPlan,
  replaceSingleMeal,
  scaleMealServing,
  generateCategorizedShoppingList
} from '../../services/dietPlanGenerator';
import { exportDietPlanToPdf } from '../../services/dietPdfExporter';

import { DietProfileForm } from './DietProfileForm';
import { NutritionSummaryCard } from './NutritionSummaryCard';
import { MealCard } from './MealCard';
import { WaterTracker } from './WaterTracker';
import { ProgressCharts } from './ProgressCharts';
import { GroceryShoppingModal } from './GroceryShoppingModal';
import { FavoriteMealsModal } from './FavoriteMealsModal';
import { PrintableVisualPlanModal } from './PrintableVisualPlanModal';

import {
  Flame,
  Sparkles,
  Calendar,
  FileDown,
  ShoppingCart,
  Heart,
  Settings,
  RefreshCw,
  Droplets,
  TrendingUp,
  Apple,
  CheckCircle2,
  Clock,
  Printer,
  ChevronRight,
  ShieldCheck,
  Camera,
  Eye,
  Info,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const DietPlannerMain: React.FC = () => {
  // Load saved profile or initialize default
  const [profile, setProfile] = useState<UserDietProfile | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('bsf_user_diet_profile');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return null;
  });

  // Load saved plan or initialize
  const [dietPlan, setDietPlan] = useState<FullDietPlan | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('bsf_current_diet_plan');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return null;
  });

  // State management
  const [activeDayNumber, setActiveDayNumber] = useState<number>(1);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(!dietPlan);
  const [isShoppingListOpen, setIsShoppingListOpen] = useState<boolean>(false);
  const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState<boolean>(false);
  const [isVisualPrintModalOpen, setIsVisualPrintModalOpen] = useState<boolean>(false);
  const [isPdfDownloading, setIsPdfDownloading] = useState<boolean>(false);
  const [pdfProgressText, setPdfProgressText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'meals' | 'metrics' | 'habits'>('meals');

  // Favorites stored in local storage
  const [favorites, setFavorites] = useState<Meal[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('bsf_diet_favorites');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return [];
  });

  // Persist diet plan changes
  useEffect(() => {
    if (dietPlan && typeof window !== 'undefined') {
      localStorage.setItem('bsf_current_diet_plan', JSON.stringify(dietPlan));
    }
  }, [dietPlan]);

  // Persist profile
  useEffect(() => {
    if (profile && typeof window !== 'undefined') {
      localStorage.setItem('bsf_user_diet_profile', JSON.stringify(profile));
    }
  }, [profile]);

  // Persist favorites
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bsf_diet_favorites', JSON.stringify(favorites));
    }
  }, [favorites]);

  // Handle Profile Form Submission (Generate new 7-Day Plan)
  const handleGeneratePlan = async (newProfile: UserDietProfile) => {
    setIsLoading(true);
    setProfile(newProfile);

    try {
      // First attempt server-side generator (which runs Gemini if configured)
      const res = await fetch('/api/diet/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProfile)
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.dietPlan) {
          setDietPlan(data.dietPlan);
          setIsFormOpen(false);
          setIsLoading(false);
          setActiveDayNumber(1);
          triggerSuccessConfetti();
          return;
        }
      }
    } catch (err) {
      // Fallback seamlessly to local deterministic client engine
    }

    // Client-side fallback: calculate metrics and generate 7-day plan
    const metrics = calculateNutritionMetrics(newProfile);
    const plan = generateFullDietPlan(newProfile, metrics);
    setDietPlan(plan);
    setIsFormOpen(false);
    setIsLoading(false);
    setActiveDayNumber(1);
    triggerSuccessConfetti();
  };

  const triggerSuccessConfetti = () => {
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}
  };

  // Regenerate Current Plan
  const handleRegeneratePlan = () => {
    if (!profile) {
      setIsFormOpen(true);
      return;
    }
    handleGeneratePlan(profile);
  };

  // Download PDF with photos embedded
  const handleDownloadPdf = async () => {
    if (!dietPlan) return;
    setIsPdfDownloading(true);
    setPdfProgressText('Loading food photos and building PDF...');
    try {
      await exportDietPlanToPdf(dietPlan, (text) => setPdfProgressText(text));
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setIsPdfDownloading(false);
      setTimeout(() => setPdfProgressText(null), 1500);
    }
  };

  // Toggle meal completed
  const handleToggleCompleted = (dayNumber: number, mealId: string) => {
    if (!dietPlan) return;
    const updatedDays = dietPlan.days.map(d => {
      if (d.dayNumber !== dayNumber) return d;
      return {
        ...d,
        meals: d.meals.map(m => (m.id === mealId ? { ...m, isCompleted: !m.isCompleted } : m))
      };
    });
    setDietPlan({
      ...dietPlan,
      days: updatedDays
    });
  };

  // Scale meal serving size
  const handleScaleServing = (dayNumber: number, mealId: string, scale: number) => {
    if (!dietPlan) return;
    const updatedDays = dietPlan.days.map(d => {
      if (d.dayNumber !== dayNumber) return d;
      const updatedMeals = d.meals.map(m => (m.id === mealId ? scaleMealServing(m, scale) : m));
      return {
        ...d,
        meals: updatedMeals,
        totalCalories: updatedMeals.reduce((acc, x) => acc + x.calories, 0),
        totalProtein: updatedMeals.reduce((acc, x) => acc + x.proteinGrams, 0),
        totalCarbs: updatedMeals.reduce((acc, x) => acc + x.carbsGrams, 0),
        totalFat: updatedMeals.reduce((acc, x) => acc + x.fatGrams, 0),
        totalFiber: updatedMeals.reduce((acc, x) => acc + x.fiberGrams, 0),
        totalEstimatedCostInr: updatedMeals.reduce((acc, x) => acc + x.estimatedCostInr, 0)
      };
    });
    setDietPlan({
      ...dietPlan,
      days: updatedDays
    });
  };

  // Replace single meal
  const handleReplaceMeal = (dayNumber: number, mealId: string) => {
    if (!dietPlan) return;
    const updated = replaceSingleMeal(dietPlan, dayNumber, mealId);
    setDietPlan(updated);
  };

  // Toggle favorite
  const handleToggleFavorite = (dayNumber: number, mealId: string) => {
    if (!dietPlan) return;
    let targetMeal: Meal | undefined;
    const updatedDays = dietPlan.days.map(d => {
      if (d.dayNumber !== dayNumber) return d;
      return {
        ...d,
        meals: d.meals.map(m => {
          if (m.id === mealId) {
            targetMeal = m;
            return { ...m, isFavorite: !m.isFavorite };
          }
          return m;
        })
      };
    });
    setDietPlan({ ...dietPlan, days: updatedDays });

    if (targetMeal) {
      const exists = favorites.some(f => f.id === targetMeal!.id || f.name === targetMeal!.name);
      if (exists) {
        setFavorites(prev => prev.filter(f => f.id !== targetMeal!.id && f.name !== targetMeal!.name));
      } else {
        setFavorites(prev => [...prev, { ...targetMeal!, isFavorite: true }]);
      }
    }
  };

  const currentDay = dietPlan?.days.find(d => d.dayNumber === activeDayNumber) || dietPlan?.days[0];

  // Calculate day completion & consumed macros
  const dayMeals = currentDay?.meals || [];
  const completedMeals = dayMeals.filter(m => m.isCompleted);
  const consumedCalories = completedMeals.reduce((acc, m) => acc + m.calories, 0);
  const consumedProtein = completedMeals.reduce((acc, m) => acc + m.proteinGrams, 0);
  const consumedCarbs = completedMeals.reduce((acc, m) => acc + m.carbsGrams, 0);
  const consumedFat = completedMeals.reduce((acc, m) => acc + m.fatGrams, 0);

  const calorieTarget = dietPlan?.metrics.dailyCalorieTarget || 2200;
  const caloriePct = Math.min(100, Math.round((consumedCalories / calorieTarget) * 100));

  const shoppingList = dietPlan ? generateCategorizedShoppingList(dietPlan) : [];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8" id="bsf-diet-planner-app">
      
      {/* Top Banner & Control Header */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold font-mono uppercase tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>BSF ATHLETIC NUTRITION & MACRO SYSTEM</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white font-display tracking-tight uppercase">
              AI DIET PLANNER & NUTRITION ENGINE
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 font-sans-body max-w-2xl leading-relaxed">
              Personalized 7-day high-performance nutrition blueprints tailored for Mysuru athletes and global fitness enthusiasts. Mifflin–St Jeor verified calculations, allergen filtering, and real-time meal compliance.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            {dietPlan && (
              <>
                <button
                  type="button"
                  onClick={() => setIsShoppingListOpen(true)}
                  className="px-4 py-2.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-zinc-200 hover:text-white hover:border-zinc-700 text-xs font-bold uppercase tracking-wider transition flex items-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4 text-orange-400" />
                  <span>Grocery List ({shoppingList.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsFavoritesModalOpen(true)}
                  className="px-4 py-2.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-zinc-200 hover:text-white hover:border-zinc-700 text-xs font-bold uppercase tracking-wider transition flex items-center gap-2"
                >
                  <Heart className="w-4 h-4 text-red-400" />
                  <span>Favorites ({favorites.length})</span>
                </button>

                {/* Download PDF with Photos button */}
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={isPdfDownloading}
                  className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500/20 to-zinc-950 border border-orange-500/40 text-orange-300 hover:text-white hover:border-orange-400 text-xs font-bold uppercase tracking-wider transition flex items-center gap-2 shadow-md shadow-orange-500/10"
                  title="Download complete 7-day meal plan PDF with all meal photos embedded"
                >
                  <Camera className="w-4 h-4 text-orange-400" />
                  <span>{isPdfDownloading ? 'Building PDF with Photos...' : 'PDF (With Photos)'}</span>
                </button>

                {/* Print Illustrated Plan */}
                <button
                  type="button"
                  onClick={() => setIsVisualPrintModalOpen(true)}
                  className="px-4 py-2.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-zinc-200 hover:text-white hover:border-zinc-700 text-xs font-bold uppercase tracking-wider transition flex items-center gap-2"
                  title="Open full-bleed printable view with high-res photos"
                >
                  <Printer className="w-4 h-4 text-cyan-400" />
                  <span>Print Blueprint</span>
                </button>

                <button
                  type="button"
                  onClick={handleRegeneratePlan}
                  disabled={isLoading}
                  className="px-4 py-2.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-zinc-200 hover:text-orange-400 text-xs font-bold uppercase tracking-wider transition flex items-center gap-2"
                  title="Regenerate all 7 days with alternate meals"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-orange-400' : ''}`} />
                  <span className="hidden sm:inline">Regenerate</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="px-5 py-2.5 rounded-2xl bg-orange-400 hover:bg-orange-300 text-black font-black text-xs uppercase tracking-wider transition shadow-lg shadow-orange-400/20 flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              <span>{isFormOpen ? 'Close Settings' : 'Edit Profile / Stats'}</span>
            </button>
          </div>
        </div>

        {/* Quick Athlete Stats Bar when Plan is Active */}
        {dietPlan && !isFormOpen && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-6 border-t border-zinc-800/80 text-xs">
            <div>
              <span className="text-[10px] text-zinc-500 font-bold uppercase">Athlete Weight</span>
              <div className="font-mono text-white font-bold">{dietPlan.profile.weightKg} kg ➔ <span className="text-orange-400">{dietPlan.profile.desiredWeightKg} kg</span></div>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 font-bold uppercase">Primary Goal</span>
              <div className="font-bold text-orange-400 capitalize">{dietPlan.profile.primaryGoal.replace(/_/g, ' ')}</div>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 font-bold uppercase">Daily Calories</span>
              <div className="font-mono text-white font-bold">{dietPlan.metrics.dailyCalorieTarget} kcal/day</div>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 font-bold uppercase">Protein Target</span>
              <div className="font-mono text-emerald-400 font-bold">{dietPlan.metrics.proteinGrams}g / day</div>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 font-bold uppercase">Diet Protocol</span>
              <div className="font-bold text-zinc-300 capitalize">{dietPlan.profile.dietaryPreference.replace(/_/g, ' ')}</div>
            </div>
          </div>
        )}

        {/* Easy Understanding Visual Guide Banner (Photos & Hand Portions) */}
        {dietPlan && !isFormOpen && (
          <div className="mt-6 pt-6 border-t border-zinc-800/80 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400">
                <Sparkles className="w-4 h-4" />
                <span>How To Understand & Follow Your Meal Plan Easily (Photos & Hand Portions)</span>
              </div>
              <span className="text-[11px] text-zinc-500 font-mono">No Food Weighing Scale Required</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Card 1: Photo Guides */}
              <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-1">
                <div className="flex items-center gap-2 text-white font-bold text-xs uppercase">
                  <span className="text-base">📸</span>
                  <span>Food Photos</span>
                </div>
                <p className="text-[11px] text-zinc-400 font-sans-body leading-relaxed">
                  Every meal includes an authentic photo of the dish. Click on any photo to zoom in and preview preparation.
                </p>
              </div>

              {/* Card 2: Hand Portions */}
              <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-1">
                <div className="flex items-center gap-2 text-white font-bold text-xs uppercase">
                  <span className="text-base">✋</span>
                  <span>Hand Size Portions</span>
                </div>
                <p className="text-[11px] text-zinc-400 font-sans-body leading-relaxed">
                  <strong>Palm</strong> = 120-150g Protein (Chicken/Paneer). <strong>Fist</strong> = 1 cup Carbs/Rice. <strong>Thumb</strong> = 1 tbsp Ghee/Oil.
                </p>
              </div>

              {/* Card 3: Color Badges */}
              <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-1">
                <div className="flex items-center gap-2 text-white font-bold text-xs uppercase">
                  <span className="text-base">🎨</span>
                  <span>Color Macro Badges</span>
                </div>
                <p className="text-[11px] text-zinc-400 font-sans-body leading-relaxed">
                  <span className="text-orange-400 font-bold">Orange</span> is Protein for muscles. <span className="text-emerald-400 font-bold">Green</span> is Carbs for workout fuel. <span className="text-purple-400 font-bold">Purple</span> is healthy Fats.
                </p>
              </div>

              {/* Card 4: Daily Tracking */}
              <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-1">
                <div className="flex items-center gap-2 text-white font-bold text-xs uppercase">
                  <span className="text-base">✅</span>
                  <span>One-Tap Eaten Tracker</span>
                </div>
                <p className="text-[11px] text-zinc-400 font-sans-body leading-relaxed">
                  Tap "Mark Eaten" on each meal as you finish it to watch your daily nutrition progress bar fill up in real time!
                </p>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Profile Form (Collapsible or Initial State) */}
      {isFormOpen ? (
        <DietProfileForm
          initialProfile={profile}
          onSubmit={handleGeneratePlan}
          isLoading={isLoading}
          onCancel={dietPlan ? () => setIsFormOpen(false) : undefined}
        />
      ) : dietPlan ? (
        <>
          {/* Main Dashboard Navigation Tabs */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('meals')}
                className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition flex items-center gap-2 ${
                  activeTab === 'meals'
                    ? 'bg-orange-400 text-black shadow-lg shadow-orange-400/20'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>7-Day Meal Schedule</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('metrics')}
                className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition flex items-center gap-2 ${
                  activeTab === 'metrics'
                    ? 'bg-orange-400 text-black shadow-lg shadow-orange-400/20'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <Flame className="w-4 h-4" />
                <span>Nutrition & BMR Blueprint</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('habits')}
                className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition flex items-center gap-2 ${
                  activeTab === 'habits'
                    ? 'bg-orange-400 text-black shadow-lg shadow-orange-400/20'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>Progress & Habits</span>
              </button>
            </div>

            <span className="text-[11px] font-mono text-zinc-500 hidden md:inline">
              Verified Mifflin-St Jeor Algorithm
            </span>
          </div>

          {/* Tab 1: 7-Day Meal Schedule */}
          {activeTab === 'meals' && (
            <div className="space-y-6">
              
              {/* Day Selector (Days 1 to 7) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
                {dietPlan.days.map(day => {
                  const isCurrent = day.dayNumber === activeDayNumber;
                  const dayCompletedCount = day.meals.filter(m => m.isCompleted).length;
                  const allDone = dayCompletedCount === day.meals.length && day.meals.length > 0;

                  return (
                    <button
                      key={day.dayNumber}
                      type="button"
                      onClick={() => setActiveDayNumber(day.dayNumber)}
                      className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between ${
                        isCurrent
                          ? 'bg-orange-500/10 border-orange-400 text-white shadow-lg shadow-orange-500/10'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase">Day {day.dayNumber}</span>
                        {allDone ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <span className="text-[10px] font-mono text-zinc-500">{dayCompletedCount}/{day.meals.length}</span>
                        )}
                      </div>
                      <div className={`text-xs font-black uppercase ${isCurrent ? 'text-orange-400' : 'text-zinc-300'}`}>
                        {day.dayName}
                      </div>
                      <div className="text-[10px] text-zinc-500 font-mono mt-1">
                        {day.totalCalories} kcal
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Day Focus Header & Real-time Consumed vs Target Bar */}
              {currentDay && (
                <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-orange-400 font-bold uppercase">Day {currentDay.dayNumber} Schedule</span>
                        <span className="text-zinc-600">·</span>
                        <span className="text-xs text-zinc-400">{currentDay.meals.length} prescribed meals</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight mt-0.5">
                        {currentDay.dayName}: {currentDay.focusNote}
                      </h3>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-[10px] uppercase font-bold text-zinc-500">Day Cost Estimate</div>
                        <div className="text-sm font-black font-mono text-amber-400">₹{currentDay.totalEstimatedCostInr}</div>
                      </div>
                    </div>
                  </div>

                  {/* Real-time Consumed Progress Tracker */}
                  <div className="space-y-2 pt-2 border-t border-zinc-800">
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-zinc-400">
                      <span>Consumed Today: <span className="font-mono text-white">{consumedCalories}</span> / {calorieTarget} kcal ({caloriePct}%)</span>
                      <span>Protein: <span className="font-mono text-emerald-400">{consumedProtein}g</span> / {dietPlan.metrics.proteinGrams}g</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-zinc-950 border border-zinc-800 overflow-hidden p-0.5">
                      <div
                        style={{ width: `${caloriePct}%` }}
                        className="h-full bg-gradient-to-r from-orange-400 to-amber-400 rounded-full transition-all duration-300"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Scheduled Meal Cards */}
              <div className="space-y-4">
                {currentDay?.meals.map(meal => (
                  <MealCard
                    key={meal.id}
                    meal={meal}
                    dayNumber={activeDayNumber}
                    onToggleCompleted={handleToggleCompleted}
                    onScaleServing={handleScaleServing}
                    onReplaceMeal={handleReplaceMeal}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>

              {/* Water Tracker Widget */}
              <div className="pt-2">
                <WaterTracker targetLiters={dietPlan.metrics.hydrationLiters} />
              </div>

            </div>
          )}

          {/* Tab 2: Nutrition & BMR Blueprint */}
          {activeTab === 'metrics' && (
            <div className="space-y-6">
              <NutritionSummaryCard
                metrics={dietPlan.metrics}
                goal={dietPlan.profile.primaryGoal}
              />

              {/* AI Coach Notes if available */}
              {dietPlan.explanation && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-400">
                    <Sparkles className="w-4 h-4" />
                    <span>Head Sports Nutritionist Blueprint Notes</span>
                  </div>
                  <div className="text-xs sm:text-sm text-zinc-300 font-sans-body whitespace-pre-line leading-relaxed">
                    {dietPlan.explanation}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Progress & Habits */}
          {activeTab === 'habits' && (
            <div className="space-y-6">
              <ProgressCharts
                currentWeightKg={dietPlan.profile.weightKg}
                desiredWeightKg={dietPlan.profile.desiredWeightKg}
                dailyCalorieTarget={dietPlan.metrics.dailyCalorieTarget}
                consumedCaloriesToday={consumedCalories}
                proteinTargetGrams={dietPlan.metrics.proteinGrams}
                consumedProteinToday={consumedProtein}
                completedMealsCount={completedMeals.length}
                totalMealsCount={dayMeals.length}
              />
              <WaterTracker targetLiters={dietPlan.metrics.hydrationLiters} />
            </div>
          )}

        </>
      ) : (
        /* Empty State */
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center mx-auto">
            <Apple className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black uppercase text-white tracking-wide">
            Build Your Personalized Nutrition Blueprint
          </h2>
          <p className="text-xs text-zinc-400 max-w-md mx-auto">
            Get an exact 7-day meal plan with calorie and macro calculations customized to your athletic goals.
          </p>
          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            className="px-6 py-3 bg-orange-400 text-black font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-orange-400/20"
          >
            Start Nutrition Questionnaire
          </button>
        </div>
      )}

      {/* Grocery Shopping Modal */}
      <GroceryShoppingModal
        isOpen={isShoppingListOpen}
        onClose={() => setIsShoppingListOpen(false)}
        items={shoppingList}
      />

      {/* Favorite Meals Modal */}
      <FavoriteMealsModal
        isOpen={isFavoritesModalOpen}
        onClose={() => setIsFavoritesModalOpen(false)}
        favorites={favorites}
        onRemoveFavorite={mealId => setFavorites(prev => prev.filter(f => f.id !== mealId))}
      />

      {/* Printable Illustrated Plan Modal (High Res Photos & Print) */}
      {dietPlan && (
        <PrintableVisualPlanModal
          isOpen={isVisualPrintModalOpen}
          onClose={() => setIsVisualPrintModalOpen(false)}
          plan={dietPlan}
          onDownloadPdf={handleDownloadPdf}
          isDownloading={isPdfDownloading}
        />
      )}

      {/* PDF Generation Floating Progress Toast */}
      {pdfProgressText && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-zinc-950 border border-orange-500/50 shadow-2xl flex items-center gap-3 text-xs text-white animate-in slide-in-from-bottom-4 backdrop-blur-xl">
          <div className="w-5 h-5 border-2 border-orange-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
          <div className="space-y-0.5">
            <div className="font-bold text-orange-400 uppercase tracking-wide text-[10px]">Photo PDF Engine</div>
            <div className="font-mono text-zinc-300">{pdfProgressText}</div>
          </div>
        </div>
      )}

    </div>
  );
};
