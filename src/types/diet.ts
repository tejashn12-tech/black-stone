export type BiologicalSex = 'male' | 'female' | 'other';

export type ActivityLevel =
  | 'sedentary'        // Little or no exercise (x1.2)
  | 'lightly_active'   // Exercise 1-3 days/week (x1.375)
  | 'moderately_active'// Moderate exercise 3-5 days/week (x1.55)
  | 'very_active'      // Hard exercise 6-7 days/week (x1.725)
  | 'extremely_active';// Very hard exercise, physical job or 2x training (x1.9)

export type DietaryPreference =
  | 'vegetarian'
  | 'vegan'
  | 'eggetarian'
  | 'non_vegetarian'
  | 'pescatarian';

export type AllergyType =
  | 'peanuts'
  | 'tree_nuts'
  | 'dairy_lactose'
  | 'gluten'
  | 'shellfish'
  | 'soy'
  | 'eggs'
  | 'fish'
  | 'sesame'
  | 'mustard';

export type FitnessGoal =
  | 'strength_training'
  | 'muscle_building'
  | 'bulking'
  | 'lean_bulking'
  | 'fat_loss'
  | 'general_weight_management'
  | 'healthy_weight_gain'
  | 'muscle_maintenance'
  | 'body_recomposition'
  | 'endurance_training'
  | 'sports_performance'
  | 'general_fitness'
  | 'healthy_eating'
  | 'improving_recovery'
  | 'maintaining_current_weight'
  | 'custom';

export type BudgetTier = 'economy' | 'moderate' | 'premium';

export type RegionPreference =
  | 'south_india_mysuru'
  | 'north_india'
  | 'pan_india'
  | 'mediterranean'
  | 'global_western'
  | 'east_asian';

export type WorkoutType =
  | 'weightlifting'
  | 'cardio'
  | 'sports'
  | 'mixed_training'
  | 'calisthenics'
  | 'crossfit'
  | 'other';

export interface UserDietProfile {
  age: number;
  sex: BiologicalSex;
  heightCm: number;
  weightKg: number;
  desiredWeightKg: number;
  activityLevel: ActivityLevel;
  dietaryPreference: DietaryPreference;
  allergies: AllergyType[];
  customAllergies?: string[];
  dislikedFoods: string[];
  mealsPerDay: number; // 2 to 6
  budget: BudgetTier;
  region: RegionPreference;
  
  // Goals
  goals: FitnessGoal[];
  primaryGoal: FitnessGoal;
  customGoalText?: string;
  
  // Preferences
  workoutFrequencyPerWeek: number; // 1-7
  workoutType: WorkoutType;
  preferredMealTimings: 'standard' | 'early_riser' | 'intermittent_16_8' | 'late_shift';
  cookingTimeAvailableMinutes: number; // 15, 30, 60, 120
  foodsAvailableAtHome?: string[];
  medicalRestrictionsNoticeAcknowledged: boolean;
  preferredLanguage: 'en' | 'kn' | 'hi';
  remindersEnabled: boolean;
}

export interface NutritionMetrics {
  bmi: number;
  bmiCategory: 'Underweight' | 'Normal' | 'Overweight' | 'Obese Class I' | 'Obese Class II+';
  bmiLimitationsNotice: string;
  
  bmr: number; // Mifflin-St Jeor (kcal)
  tdee: number; // Total Daily Energy Expenditure (kcal)
  dailyCalorieTarget: number; // Goal-adjusted daily target
  calorieDelta: number; // Surplus (+) or Deficit (-)
  
  // Daily Macros in grams
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  fiberGrams: number;
  
  // Hydration
  hydrationLiters: number;
  hydrationGlasses: number; // 250ml glasses
  
  // Structure
  suggestedMealFrequency: number;
  
  // Rationale
  goalRationale: string;
  macroRationale: string;
  safetyNotice: string;
}

export type MealSlotType =
  | 'breakfast'
  | 'mid_morning'
  | 'lunch'
  | 'pre_workout'
  | 'post_workout'
  | 'evening_snack'
  | 'dinner';

export interface Ingredient {
  name: string;
  amount: string; // e.g. "150g", "2 pieces", "1 cup (240ml)"
  category: 'produce' | 'protein' | 'dairy' | 'grains' | 'fats' | 'spices_pantry';
  approxCostInr: number;
  isVegetarian: boolean;
  isVegan: boolean;
  allergens: AllergyType[];
  substitutions?: string[];
}

export interface Meal {
  id: string;
  slot: MealSlotType;
  name: string;
  timeHint: string; // e.g. "07:30 AM - 08:30 AM"
  description: string;
  ingredients: Ingredient[];
  portionDescription: string;
  
  // Nutrition per serving
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  fiberGrams: number;
  
  prepTimeMinutes: number;
  prepInstructions: string[];
  substitutions: string[];
  estimatedCostInr: number;
  dietaryPreference: DietaryPreference;
  allergens: AllergyType[];
  imageUrl?: string;
  
  // Interactive state
  servingScale?: number; // 1.0, 1.25, 1.5, 2.0
  isCompleted?: boolean;
  isFavorite?: boolean;
}

export interface DayPlan {
  dayNumber: number; // 1 to 7
  dayName: string; // Monday, Tuesday, etc.
  focusNote: string;
  meals: Meal[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
  totalEstimatedCostInr: number;
}

export interface FullDietPlan {
  id: string;
  createdAt: string;
  updatedAt: string;
  profile: UserDietProfile;
  metrics: NutritionMetrics;
  days: DayPlan[];
  explanation: string;
  aiGenerated: boolean;
  modelUsed?: string;
}

export interface ShoppingListItem {
  id: string;
  name: string;
  category: 'produce' | 'protein' | 'dairy' | 'grains' | 'fats' | 'spices_pantry';
  totalQuantity: string;
  estimatedCostInr: number;
  isPurchased: boolean;
}

export interface WeightLogEntry {
  date: string;
  weightKg: number;
  caloriesConsumed?: number;
  waterIntakeLiters?: number;
  mealsCompletedCount?: number;
  totalMealsCount?: number;
}
