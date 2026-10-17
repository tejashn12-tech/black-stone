import React, { useState } from 'react';
import {
  UserDietProfile,
  FitnessGoal,
  DietaryPreference,
  AllergyType,
  ActivityLevel,
  BudgetTier,
  RegionPreference,
  WorkoutType
} from '../../types/diet';
import {
  Flame,
  Dumbbell,
  Scale,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Apple,
  Clock,
  Coins,
  Globe2,
  HeartPulse,
  Info
} from 'lucide-react';

interface DietProfileFormProps {
  initialProfile?: UserDietProfile | null;
  onSubmit: (profile: UserDietProfile) => void;
  isLoading: boolean;
  onCancel?: () => void;
}

const ALL_GOALS: { id: FitnessGoal; label: string; desc: string }[] = [
  { id: 'strength_training', label: '1. Strength Training', desc: 'Maximal neuromuscular power & progressive overload' },
  { id: 'muscle_building', label: '2. Muscle Building', desc: 'Hypertrophic surplus & muscle protein synthesis' },
  { id: 'bulking', label: '3. Bulking', desc: 'Accelerated mass accrual with nutrient density' },
  { id: 'lean_bulking', label: '4. Lean Bulking', desc: 'Targeted tissue gain with minimal fat accrual' },
  { id: 'fat_loss', label: '5. Fat Loss', desc: 'Controlled deficit with lean mass preservation' },
  { id: 'general_weight_management', label: '6. General Weight Management', desc: 'Sustainable habit building & balanced metabolism' },
  { id: 'healthy_weight_gain', label: '7. Healthy Weight Gain', desc: 'Wholesome caloric density without empty calories' },
  { id: 'muscle_maintenance', label: '8. Muscle Maintenance', desc: 'Isocaloric preservation of muscular framework' },
  { id: 'body_recomposition', label: '9. Body Recomposition', desc: 'Simultaneous adipose loss & lean tissue synthesis' },
  { id: 'endurance_training', label: '10. Endurance Training', desc: 'Glycogen loading, stamina & aerobic recovery' },
  { id: 'sports_performance', label: '11. Sports Performance', desc: 'Agility, anaerobic bursts & athletic energy' },
  { id: 'general_fitness', label: '12. General Fitness', desc: 'Whole-body cardiovascular health & longevity' },
  { id: 'healthy_eating', label: '13. Healthy Eating', desc: 'Digestive vitality, anti-inflammatory whole foods' },
  { id: 'improving_recovery', label: '14. Improving Recovery', desc: 'Tissue repair, sleep quality & soreness reduction' },
  { id: 'maintaining_current_weight', label: '15. Maintaining Current Weight', desc: 'Exact TDEE energy equilibrium' }
];

const ALLERGEN_OPTIONS: { id: AllergyType; label: string }[] = [
  { id: 'peanuts', label: 'Peanuts' },
  { id: 'tree_nuts', label: 'Tree Nuts (Almonds, Walnuts)' },
  { id: 'dairy_lactose', label: 'Dairy / Lactose' },
  { id: 'gluten', label: 'Gluten (Wheat, Barley)' },
  { id: 'soy', label: 'Soy / Soya' },
  { id: 'eggs', label: 'Eggs' },
  { id: 'fish', label: 'Fish' },
  { id: 'shellfish', label: 'Shellfish / Prawns' },
  { id: 'sesame', label: 'Sesame' },
  { id: 'mustard', label: 'Mustard' }
];

export const DietProfileForm: React.FC<DietProfileFormProps> = ({
  initialProfile,
  onSubmit,
  isLoading,
  onCancel
}) => {
  // Unit Toggles
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>('cm');
  const [heightFeet, setHeightFeet] = useState<number>(5);
  const [heightInches, setHeightInches] = useState<number>(9);
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');

  // Basic stats
  const [age, setAge] = useState<number>(initialProfile?.age || 27);
  const [sex, setSex] = useState<'male' | 'female' | 'other'>(initialProfile?.sex || 'male');
  const [heightCm, setHeightCm] = useState<number>(initialProfile?.heightCm || 175);
  const [weightKg, setWeightKg] = useState<number>(initialProfile?.weightKg || 72);
  const [desiredWeightKg, setDesiredWeightKg] = useState<number>(initialProfile?.desiredWeightKg || 68);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(initialProfile?.activityLevel || 'moderately_active');
  const [dietaryPreference, setDietaryPreference] = useState<DietaryPreference>(initialProfile?.dietaryPreference || 'vegetarian');
  
  // Allergies & Dislikes
  const [allergies, setAllergies] = useState<AllergyType[]>(initialProfile?.allergies || []);
  const [customAllergyInput, setCustomAllergyInput] = useState('');
  const [customAllergies, setCustomAllergies] = useState<string[]>(initialProfile?.customAllergies || []);
  const [dislikeInput, setDislikeInput] = useState('');
  const [dislikedFoods, setDislikedFoods] = useState<string[]>(initialProfile?.dislikedFoods || ['bitter gourd']);
  
  // Schedule & Environment
  const [mealsPerDay, setMealsPerDay] = useState<number>(initialProfile?.mealsPerDay || 4);
  const [budget, setBudget] = useState<BudgetTier>(initialProfile?.budget || 'moderate');
  const [region, setRegion] = useState<RegionPreference>(initialProfile?.region || 'south_india_mysuru');
  
  // Goals
  const [selectedGoals, setSelectedGoals] = useState<FitnessGoal[]>(initialProfile?.goals || ['muscle_building']);
  const [primaryGoal, setPrimaryGoal] = useState<FitnessGoal>(initialProfile?.primaryGoal || 'muscle_building');
  const [customGoalText, setCustomGoalText] = useState(initialProfile?.customGoalText || '');
  
  // Additional Preferences
  const [workoutFrequencyPerWeek, setWorkoutFrequencyPerWeek] = useState<number>(initialProfile?.workoutFrequencyPerWeek || 5);
  const [workoutType, setWorkoutType] = useState<WorkoutType>(initialProfile?.workoutType || 'weightlifting');
  const [preferredMealTimings, setPreferredMealTimings] = useState<'standard' | 'early_riser' | 'intermittent_16_8' | 'late_shift'>(
    initialProfile?.preferredMealTimings || 'standard'
  );
  const [cookingTimeAvailableMinutes, setCookingTimeAvailableMinutes] = useState<number>(
    initialProfile?.cookingTimeAvailableMinutes || 30
  );
  const [preferredLanguage, setPreferredLanguage] = useState<'en' | 'kn' | 'hi'>(initialProfile?.preferredLanguage || 'en');
  const [remindersEnabled, setRemindersEnabled] = useState<boolean>(initialProfile?.remindersEnabled ?? true);
  const [medicalNoticeAcknowledged, setMedicalNoticeAcknowledged] = useState<boolean>(
    initialProfile?.medicalRestrictionsNoticeAcknowledged || false
  );

  const [formError, setFormError] = useState<string | null>(null);

  // Sync feet/inches to cm if in 'ft' mode
  const handleFeetChange = (ft: number, inch: number) => {
    setHeightFeet(ft);
    setHeightInches(inch);
    const cm = Math.round((ft * 12 + inch) * 2.54);
    setHeightCm(cm);
  };

  // Toggle goal selection
  const handleToggleGoal = (goal: FitnessGoal) => {
    let updated: FitnessGoal[];
    if (selectedGoals.includes(goal)) {
      if (selectedGoals.length === 1) return; // Must have at least 1 goal
      updated = selectedGoals.filter(g => g !== goal);
      if (primaryGoal === goal) {
        setPrimaryGoal(updated[0]);
      }
    } else {
      updated = [...selectedGoals, goal];
    }
    setSelectedGoals(updated);
  };

  // Toggle allergy
  const handleToggleAllergy = (allergy: AllergyType) => {
    setAllergies(prev =>
      prev.includes(allergy) ? prev.filter(a => a !== allergy) : [...prev, allergy]
    );
  };

  // Add custom allergy tag
  const handleAddCustomAllergy = () => {
    if (!customAllergyInput.trim()) return;
    if (!customAllergies.includes(customAllergyInput.trim())) {
      setCustomAllergies(prev => [...prev, customAllergyInput.trim()]);
    }
    setCustomAllergyInput('');
  };

  // Add disliked food tag
  const handleAddDislikedFood = () => {
    if (!dislikeInput.trim()) return;
    if (!dislikedFoods.includes(dislikeInput.trim())) {
      setDislikedFoods(prev => [...prev, dislikeInput.trim()]);
    }
    setDislikeInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medicalNoticeAcknowledged) {
      setFormError('Please review and acknowledge the nutritional guidance safety notice to proceed.');
      return;
    }
    if (age < 14 || age > 95) {
      setFormError('Please enter a valid age between 14 and 95.');
      return;
    }
    if (weightKg < 35 || weightKg > 250) {
      setFormError('Please enter a valid weight between 35kg and 250kg.');
      return;
    }
    setFormError(null);

    const profile: UserDietProfile = {
      age,
      sex,
      heightCm,
      weightKg,
      desiredWeightKg,
      activityLevel,
      dietaryPreference,
      allergies,
      customAllergies,
      dislikedFoods,
      mealsPerDay,
      budget,
      region,
      goals: selectedGoals,
      primaryGoal,
      customGoalText: selectedGoals.includes('custom') ? customGoalText : undefined,
      workoutFrequencyPerWeek,
      workoutType,
      preferredMealTimings,
      cookingTimeAvailableMinutes,
      preferredLanguage,
      remindersEnabled,
      medicalRestrictionsNoticeAcknowledged: true
    };

    onSubmit(profile);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto space-y-8 text-zinc-100" id="bsf-diet-profile-form">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-orange-500/10 via-zinc-900 to-zinc-900 border border-orange-500/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold font-mono uppercase tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>BSF INTELLIGENT NUTRITION ENGINE</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white font-display tracking-tight uppercase">
              ATHLETE NUTRITION PROFILE
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 font-sans-body max-w-xl">
              Tell us your physiological parameters, workout intensity, cultural food preferences, and goals. We build your scientifically calculated 7-day blueprint.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={preferredLanguage}
              onChange={e => setPreferredLanguage(e.target.value as any)}
              className="bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-orange-400"
            >
              <option value="en">English (Global)</option>
              <option value="kn">ಕನ್ನಡ (Kannada - Mysuru)</option>
              <option value="hi">हिन्दी (Hindi)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error alert if any */}
      {formError && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/40 text-red-400 text-xs sm:text-sm flex items-center gap-3 animate-in fade-in">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* Section 1: Basic Information */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
          <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black uppercase tracking-wide text-white">1. Physiological Metrics</h3>
            <p className="text-xs text-zinc-400">Accurate bio-metrics are required to calculate Mifflin-St Jeor BMR and exact TDEE.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          
          {/* Age */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Age (Years)</label>
            <input
              type="number"
              min={14}
              max={95}
              value={age}
              onChange={e => setAge(parseInt(e.target.value) || 0)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm font-semibold focus:outline-none focus:border-orange-400 transition"
              required
            />
          </div>

          {/* Biological Sex */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Biological Sex (for BMR)</label>
            <div className="grid grid-cols-3 gap-2">
              {(['male', 'female', 'other'] as const).map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSex(s)}
                  className={`py-3 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition capitalize ${
                    sex === s
                      ? 'bg-orange-400 text-black shadow-lg shadow-orange-400/20 font-black'
                      : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Height with cm / ft toggle */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Height</label>
              <div className="inline-flex text-[10px] bg-zinc-800 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => setHeightUnit('cm')}
                  className={`px-2 py-0.5 rounded font-bold transition ${heightUnit === 'cm' ? 'bg-orange-400 text-black' : 'text-zinc-400'}`}
                >
                  CM
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setHeightUnit('ft');
                    const totalInches = heightCm / 2.54;
                    setHeightFeet(Math.floor(totalInches / 12));
                    setHeightInches(Math.round(totalInches % 12));
                  }}
                  className={`px-2 py-0.5 rounded font-bold transition ${heightUnit === 'ft' ? 'bg-orange-400 text-black' : 'text-zinc-400'}`}
                >
                  FT / IN
                </button>
              </div>
            </div>

            {heightUnit === 'cm' ? (
              <div className="relative">
                <input
                  type="number"
                  min={120}
                  max={240}
                  value={heightCm}
                  onChange={e => setHeightCm(parseInt(e.target.value) || 0)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm font-semibold focus:outline-none focus:border-orange-400 transition"
                  required
                />
                <span className="absolute right-4 top-3.5 text-xs text-zinc-500 font-mono">cm</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <input
                    type="number"
                    min={4}
                    max={7}
                    value={heightFeet}
                    onChange={e => handleFeetChange(parseInt(e.target.value) || 0, heightInches)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm font-semibold focus:outline-none focus:border-orange-400 transition"
                  />
                  <span className="absolute right-3 top-3.5 text-xs text-zinc-500 font-mono">ft</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    max={11}
                    value={heightInches}
                    onChange={e => handleFeetChange(heightFeet, parseInt(e.target.value) || 0)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm font-semibold focus:outline-none focus:border-orange-400 transition"
                  />
                  <span className="absolute right-3 top-3.5 text-xs text-zinc-500 font-mono">in</span>
                </div>
              </div>
            )}
          </div>

          {/* Current Weight */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Current Weight</label>
              <div className="inline-flex text-[10px] bg-zinc-800 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => setWeightUnit('kg')}
                  className={`px-2 py-0.5 rounded font-bold transition ${weightUnit === 'kg' ? 'bg-orange-400 text-black' : 'text-zinc-400'}`}
                >
                  KG
                </button>
                <button
                  type="button"
                  onClick={() => setWeightUnit('lbs')}
                  className={`px-2 py-0.5 rounded font-bold transition ${weightUnit === 'lbs' ? 'bg-orange-400 text-black' : 'text-zinc-400'}`}
                >
                  LBS
                </button>
              </div>
            </div>
            <div className="relative">
              <input
                type="number"
                step="0.5"
                min={35}
                max={250}
                value={weightUnit === 'kg' ? weightKg : Math.round(weightKg * 2.20462)}
                onChange={e => {
                  const val = parseFloat(e.target.value) || 0;
                  setWeightKg(weightUnit === 'kg' ? val : Math.round((val / 2.20462) * 10) / 10);
                }}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm font-semibold focus:outline-none focus:border-orange-400 transition"
                required
              />
              <span className="absolute right-4 top-3.5 text-xs text-zinc-500 font-mono">{weightUnit}</span>
            </div>
          </div>

          {/* Desired Weight */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Desired Goal Weight</label>
            <div className="relative">
              <input
                type="number"
                step="0.5"
                min={35}
                max={250}
                value={weightUnit === 'kg' ? desiredWeightKg : Math.round(desiredWeightKg * 2.20462)}
                onChange={e => {
                  const val = parseFloat(e.target.value) || 0;
                  setDesiredWeightKg(weightUnit === 'kg' ? val : Math.round((val / 2.20462) * 10) / 10);
                }}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm font-semibold focus:outline-none focus:border-orange-400 transition"
                required
              />
              <span className="absolute right-4 top-3.5 text-xs text-zinc-500 font-mono">{weightUnit}</span>
            </div>
          </div>

          {/* Activity Level */}
          <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Activity Level</label>
            <select
              value={activityLevel}
              onChange={e => setActivityLevel(e.target.value as ActivityLevel)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs font-semibold focus:outline-none focus:border-orange-400 transition"
            >
              <option value="sedentary">Sedentary (Desk Job, 0-1 days/wk)</option>
              <option value="lightly_active">Lightly Active (1-3 days/wk workout)</option>
              <option value="moderately_active">Moderately Active (3-5 days/wk training)</option>
              <option value="very_active">Very Active (6-7 days/wk heavy training)</option>
              <option value="extremely_active">Extremely Active (Twice daily / Heavy labor)</option>
            </select>
          </div>

        </div>
      </div>

      {/* Section 2: Dietary Preferences & Allergies */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Apple className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black uppercase tracking-wide text-white">2. Dietary Preference & Allergen Safety</h3>
            <p className="text-xs text-zinc-400">Strict allergen filtering guarantees excluded items are never recommended.</p>
          </div>
        </div>

        {/* Dietary Preference Cards */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Dietary Protocol</label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {[
              { id: 'vegetarian', label: 'Vegetarian', desc: 'Plant foods + dairy' },
              { id: 'vegan', label: '100% Vegan', desc: 'Strictly plant-based' },
              { id: 'eggetarian', label: 'Eggetarian', desc: 'Veg + whole eggs' },
              { id: 'non_vegetarian', label: 'Non-Vegetarian', desc: 'Chicken, fish, eggs, meat' },
              { id: 'pescatarian', label: 'Pescatarian', desc: 'Veg + fish / seafood' }
            ].map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => setDietaryPreference(p.id as DietaryPreference)}
                className={`p-3 rounded-2xl text-left border transition flex flex-col justify-between ${
                  dietaryPreference === p.id
                    ? 'bg-orange-500/10 border-orange-400 text-white shadow-lg shadow-orange-500/10'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className={`text-xs font-black uppercase tracking-wide ${dietaryPreference === p.id ? 'text-orange-400' : 'text-zinc-300'}`}>
                    {p.label}
                  </span>
                  {dietaryPreference === p.id && <CheckCircle2 className="w-3.5 h-3.5 text-orange-400" />}
                </div>
                <span className="text-[10px] text-zinc-500">{p.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Allergies Multiselect */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Food Allergies & Intolerances (Declared Exclusions)</label>
            <span className="text-[11px] text-zinc-500">Filtered automatically from all recipes</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {ALLERGEN_OPTIONS.map(a => {
              const isSelected = allergies.includes(a.id);
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => handleToggleAllergy(a.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-red-500/20 border-red-500/50 text-red-300'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />}
                  <span>{a.label}</span>
                </button>
              );
            })}
          </div>

          {/* Custom Allergy Add */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="text"
              placeholder="Add other allergen (e.g. mushrooms, pineapple, MSG)..."
              value={customAllergyInput}
              onChange={e => setCustomAllergyInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustomAllergy(); } }}
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-orange-400"
            />
            <button
              type="button"
              onClick={handleAddCustomAllergy}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold rounded-xl text-zinc-200 transition"
            >
              Add Allergen
            </button>
          </div>
          {customAllergies.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {customAllergies.map(ca => (
                <span key={ca} className="px-2.5 py-1 rounded-lg bg-red-950 border border-red-800 text-red-300 text-[11px] font-mono flex items-center gap-1">
                  {ca}
                  <button type="button" onClick={() => setCustomAllergies(prev => prev.filter(x => x !== ca))} className="hover:text-white">×</button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Disliked Foods */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Foods You Dislike (Excluded where possible)</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="e.g. bitter gourd, raw onion, eggplant, coriander..."
              value={dislikeInput}
              onChange={e => setDislikeInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddDislikedFood(); } }}
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-orange-400"
            />
            <button
              type="button"
              onClick={handleAddDislikedFood}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold rounded-xl text-zinc-200 transition"
            >
              Add Dislike
            </button>
          </div>
          {dislikedFoods.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {dislikedFoods.map(d => (
                <span key={d} className="px-2.5 py-1 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 text-[11px] flex items-center gap-1.5">
                  <span>{d}</span>
                  <button type="button" onClick={() => setDislikedFoods(prev => prev.filter(x => x !== d))} className="hover:text-red-400 font-bold">×</button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Schedule & Environment Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          
          {/* Meals Per Day */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Meals Per Day</label>
            <div className="grid grid-cols-5 gap-1.5">
              {[2, 3, 4, 5, 6].map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setMealsPerDay(num)}
                  className={`py-2 rounded-xl text-xs font-bold transition ${
                    mealsPerDay === num
                      ? 'bg-orange-400 text-black font-black shadow-md'
                      : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Daily Budget */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Food Budget</label>
            <select
              value={budget}
              onChange={e => setBudget(e.target.value as BudgetTier)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-400"
            >
              <option value="economy">Economy / Student Friendly (₹150 - ₹250/day)</option>
              <option value="moderate">Balanced Athlete (₹250 - ₹450/day)</option>
              <option value="premium">Premium / Organic / Imported (₹500+/day)</option>
            </select>
          </div>

          {/* Country / Region */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Regional Cuisine Availability</label>
            <select
              value={region}
              onChange={e => setRegion(e.target.value as RegionPreference)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-400"
            >
              <option value="south_india_mysuru">South India / Mysuru & Karnataka Local</option>
              <option value="north_india">North Indian Staples (Roti, Dal, Paneer)</option>
              <option value="pan_india">Pan-Indian Mixed Athletic Diet</option>
              <option value="global_western">Global Fitness (Oats, Eggs, Salads, Quinoa)</option>
              <option value="mediterranean">Mediterranean & Olive Oil Focus</option>
            </select>
          </div>

        </div>

      </div>

      {/* Section 3: Fitness & Health Goals */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
          <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
            <Dumbbell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black uppercase tracking-wide text-white">3. Fitness & Health Objectives</h3>
            <p className="text-xs text-zinc-400">Select one or more goals. If you pick multiple, set the primary priority below.</p>
          </div>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ALL_GOALS.map(goal => {
            const isSelected = selectedGoals.includes(goal.id);
            const isPrimary = primaryGoal === goal.id;
            return (
              <div
                key={goal.id}
                onClick={() => handleToggleGoal(goal.id)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-orange-500/10 border-orange-400 text-white shadow-lg shadow-orange-500/10'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className={`text-xs font-black uppercase tracking-wide ${isSelected ? 'text-orange-400' : 'text-zinc-300'}`}>
                    {goal.label}
                  </span>
                  {isSelected && (
                    <span className="p-0.5 rounded-full bg-orange-400 text-black">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-zinc-500 line-clamp-2">{goal.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Priority Selector when multiple goals selected */}
        {selectedGoals.length > 1 && (
          <div className="p-4 rounded-2xl bg-zinc-950 border border-orange-500/30 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-wide">
              <Info className="w-4 h-4" />
              <span>Priority Goal Alignment (Resolves Calorie & Macro Conflicts)</span>
            </div>
            <p className="text-xs text-zinc-400">
              You selected {selectedGoals.length} goals. Which one is your absolute #1 priority for daily caloric calculations?
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {selectedGoals.map(g => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setPrimaryGoal(g)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                    primaryGoal === g
                      ? 'bg-orange-400 text-black shadow-lg shadow-orange-400/20'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white'
                  }`}
                >
                  {g.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Custom Goal text input if custom selected */}
        {selectedGoals.includes('custom') && (
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Describe Your Personal Objective</label>
            <input
              type="text"
              placeholder="e.g. Marathon training while keeping bench press above 100kg..."
              value={customGoalText}
              onChange={e => setCustomGoalText(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-orange-400"
            />
          </div>
        )}

      </div>

      {/* Section 4: Training Preferences & Schedule */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black uppercase tracking-wide text-white">4. Workout Rhythm & Kitchen Logistics</h3>
            <p className="text-xs text-zinc-400">Fine-tune meal prep times, gym frequencies, and hydration timings.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Workouts per week */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Gym Days / Week</label>
            <select
              value={workoutFrequencyPerWeek}
              onChange={e => setWorkoutFrequencyPerWeek(parseInt(e.target.value) || 4)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-orange-400"
            >
              <option value={1}>1 Day / Week (Maintenance)</option>
              <option value={2}>2 Days / Week (Light)</option>
              <option value={3}>3 Days / Week (Full Body Split)</option>
              <option value={4}>4 Days / Week (Upper/Lower Split)</option>
              <option value={5}>5 Days / Week (Push/Pull/Legs)</option>
              <option value={6}>6 Days / Week (Athletic Volume)</option>
              <option value={7}>7 Days / Week (High Frequency)</option>
            </select>
          </div>

          {/* Workout Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Workout Modality</label>
            <select
              value={workoutType}
              onChange={e => setWorkoutType(e.target.value as WorkoutType)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-orange-400"
            >
              <option value="weightlifting">Weightlifting / Bodybuilding</option>
              <option value="cardio">Cardio / Running / Cycling</option>
              <option value="sports">Competitive Sports / Football / Cricket</option>
              <option value="mixed_training">Mixed Functional Training</option>
              <option value="crossfit">CrossFit / HIIT</option>
              <option value="calisthenics">Calisthenics & Bodyweight</option>
            </select>
          </div>

          {/* Meal Timing */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Preferred Meal Timings</label>
            <select
              value={preferredMealTimings}
              onChange={e => setPreferredMealTimings(e.target.value as any)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-orange-400"
            >
              <option value="standard">Standard Daytime (8am - 9pm)</option>
              <option value="early_riser">Early Riser (6am - 7:30pm)</option>
              <option value="intermittent_16_8">Intermittent Fasting 16:8 (12pm - 8pm)</option>
              <option value="late_shift">Late Shift / Night Owl</option>
            </select>
          </div>

          {/* Cooking Time Available */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Cooking Time Available</label>
            <select
              value={cookingTimeAvailableMinutes}
              onChange={e => setCookingTimeAvailableMinutes(parseInt(e.target.value) || 30)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-orange-400"
            >
              <option value={15}>Under 15 Mins (Quick Assembly)</option>
              <option value={30}>30 Mins (Standard Cook)</option>
              <option value={60}>60 Mins (Meal Prep Lover)</option>
              <option value={120}>Unlimited / Chef at Home</option>
            </select>
          </div>

        </div>

        {/* Reminders Toggle */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-white uppercase tracking-wider">Hydration & Meal Timing Prompts</div>
            <p className="text-[11px] text-zinc-500">Show non-intrusive in-app hydration pacing and post-workout fuel reminders.</p>
          </div>
          <button
            type="button"
            onClick={() => setRemindersEnabled(!remindersEnabled)}
            className={`w-12 h-6 rounded-full transition relative p-0.5 ${remindersEnabled ? 'bg-orange-400' : 'bg-zinc-800'}`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-black transition transform ${
                remindersEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

      </div>

      {/* Safety Notice & Medical Disclaimer */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-start gap-3">
          <HeartPulse className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-zinc-200">
              General Nutritional Guidance & Clinical Disclaimer
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans-body">
              This intelligent diet planner utilizes recognized, documented metabolic equations (Mifflin–St Jeor and validated TDEE multipliers) to offer evidence-based athletic nutrition guidelines. <strong>It does not provide individual clinical medical diagnosis, disease treatment, or eating disorder prescription.</strong> Always consult a qualified physician or registered clinical dietitian if you have underlying medical conditions, renal disease, diabetes, or are pregnant.
            </p>
            <label className="flex items-center gap-3 pt-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={medicalNoticeAcknowledged}
                onChange={e => setMedicalNoticeAcknowledged(e.target.checked)}
                className="w-4 h-4 rounded border-zinc-700 text-orange-500 focus:ring-orange-400 bg-zinc-950"
              />
              <span className="text-xs font-bold text-zinc-300 hover:text-white">
                I understand this is general fitness nutrition guidance and confirm I am in good health to pursue this program.
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold text-xs uppercase tracking-wider hover:bg-zinc-800 transition"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-orange-400 hover:bg-orange-300 text-black font-black text-xs uppercase tracking-wider transition shadow-xl shadow-orange-400/20 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              <span>Calculating & Synthesizing Diet Blueprint...</span>
            </>
          ) : (
            <>
              <Flame className="w-4 h-4" />
              <span>Generate My 7-Day Nutrition Blueprint</span>
            </>
          )}
        </button>
      </div>

    </form>
  );
};
