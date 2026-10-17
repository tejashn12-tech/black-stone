import {
  UserDietProfile,
  NutritionMetrics,
  FitnessGoal,
  ActivityLevel,
  BiologicalSex
} from '../types/diet';

/**
 * Activity Multipliers based on standard documented exercise physiology
 */
export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, { multiplier: number; label: string; description: string }> = {
  sedentary: {
    multiplier: 1.2,
    label: 'Sedentary',
    description: 'Desk work, little or no structured exercise'
  },
  lightly_active: {
    multiplier: 1.375,
    label: 'Lightly Active',
    description: 'Light training or sports 1-3 days per week'
  },
  moderately_active: {
    multiplier: 1.55,
    label: 'Moderately Active',
    description: 'Moderate cardio or weight training 3-5 days per week'
  },
  very_active: {
    multiplier: 1.725,
    label: 'Very Active',
    description: 'Heavy resistance training or intense sports 6-7 days per week'
  },
  extremely_active: {
    multiplier: 1.9,
    label: 'Extremely Active',
    description: 'Twice-a-day training, construction/heavy labour, elite athletics'
  }
};

/**
 * Goal Rationale & Prescription Specifications
 */
export const GOAL_CONFIGS: Record<FitnessGoal, {
  name: string;
  calorieDelta: number; // kcal adjustment relative to TDEE
  proteinGramsPerKg: number;
  fatPercentOfCalories: number; // 0.20 to 0.30
  rationale: string;
}> = {
  strength_training: {
    name: 'Strength Training',
    calorieDelta: 200,
    proteinGramsPerKg: 2.0,
    fatPercentOfCalories: 0.25,
    rationale: 'Caloric surplus with high bioavailable protein (2.0g/kg) primes central nervous recovery, myofibrillar hypertrophy, and maximal force production.'
  },
  muscle_building: {
    name: 'Muscle Building (Hypertrophy)',
    calorieDelta: 300,
    proteinGramsPerKg: 2.1,
    fatPercentOfCalories: 0.25,
    rationale: 'Controlled hypercaloric surplus (+300 kcal) supplies continuous amino acid and carbohydrate substrate required for muscle protein synthesis (MPS).'
  },
  bulking: {
    name: 'Bulking',
    calorieDelta: 450,
    proteinGramsPerKg: 1.9,
    fatPercentOfCalories: 0.28,
    rationale: 'Significant caloric surplus fuels sustained high-volume training and accelerated mass accrual with nutrient-dense complex carbs and healthy fats.'
  },
  lean_bulking: {
    name: 'Lean Bulking',
    calorieDelta: 220,
    proteinGramsPerKg: 2.2,
    fatPercentOfCalories: 0.24,
    rationale: 'Conservative +220 kcal surplus ensures progressive muscle tissue accrual while minimizing unnecessary adipose storage.'
  },
  fat_loss: {
    name: 'Fat Loss',
    calorieDelta: -450,
    proteinGramsPerKg: 2.2,
    fatPercentOfCalories: 0.25,
    rationale: 'Safe 450 kcal deficit creates gradual adipose oxidation while elevated protein (2.2g/kg) and fiber safeguard lean muscle mass.'
  },
  general_weight_management: {
    name: 'General Weight Management',
    calorieDelta: -250,
    proteinGramsPerKg: 1.8,
    fatPercentOfCalories: 0.25,
    rationale: 'Mild, sustainable deficit focuses on steady metabolic adherence, digestive gut microbiome health, and long-term vitality.'
  },
  healthy_weight_gain: {
    name: 'Healthy Weight Gain',
    calorieDelta: 400,
    proteinGramsPerKg: 1.8,
    fatPercentOfCalories: 0.30,
    rationale: 'Energy-dense whole foods (nuts, whole grains, healthy oils, dairy/legumes) promote gradual weight gain without empty junk calories.'
  },
  muscle_maintenance: {
    name: 'Muscle Maintenance',
    calorieDelta: 0,
    proteinGramsPerKg: 1.8,
    fatPercentOfCalories: 0.26,
    rationale: 'Strict isocaloric intake maintains current weight and lean mass while supporting consistent energy during weekly gym workouts.'
  },
  body_recomposition: {
    name: 'Body Recomposition',
    calorieDelta: -100,
    proteinGramsPerKg: 2.3,
    fatPercentOfCalories: 0.23,
    rationale: 'Near-maintenance with elevated protein (2.3g/kg) and strategic workout carbohydrate timing enables simultaneous fat loss and muscle retention.'
  },
  endurance_training: {
    name: 'Endurance Training',
    calorieDelta: 150,
    proteinGramsPerKg: 1.6,
    fatPercentOfCalories: 0.22,
    rationale: 'High carbohydrate proportion (55-60% of daily energy) optimizes muscle glycogen saturation and prolonged aerobic output.'
  },
  sports_performance: {
    name: 'Sports Performance',
    calorieDelta: 200,
    proteinGramsPerKg: 1.9,
    fatPercentOfCalories: 0.25,
    rationale: 'Dynamically balances explosive anaerobic recovery with stamina, cellular hydration, and rapid post-practice glycogen reloading.'
  },
  general_fitness: {
    name: 'General Fitness',
    calorieDelta: 0,
    proteinGramsPerKg: 1.6,
    fatPercentOfCalories: 0.27,
    rationale: 'Harmonious whole-food balance designed for steady energy, cardiovascular fitness, and overall functional longevity.'
  },
  healthy_eating: {
    name: 'Healthy Eating',
    calorieDelta: 0,
    proteinGramsPerKg: 1.5,
    fatPercentOfCalories: 0.28,
    rationale: 'Emphasizes unrefined whole grains, polyphenols, diverse dietary fibers, and micronutrient density over rigid macro counting.'
  },
  improving_recovery: {
    name: 'Improving Recovery',
    calorieDelta: 150,
    proteinGramsPerKg: 2.0,
    fatPercentOfCalories: 0.28,
    rationale: 'Anti-inflammatory foods, adequate baseline energy, high protein, and omega-3 sources assist tissue repair and mitigate systemic soreness.'
  },
  maintaining_current_weight: {
    name: 'Maintaining Current Weight',
    calorieDelta: 0,
    proteinGramsPerKg: 1.7,
    fatPercentOfCalories: 0.26,
    rationale: 'Matches daily energy expenditure exactly, maintaining consistent body composition and daily metabolic equilibrium.'
  },
  custom: {
    name: 'Custom Goal',
    calorieDelta: 0,
    proteinGramsPerKg: 1.8,
    fatPercentOfCalories: 0.25,
    rationale: 'Individualized nutrition protocol tailored specifically to your custom workout rhythm and athletic aspirations.'
  }
};

/**
 * Calculates BMI and returns categorization with scientific limitations notice
 */
export function calculateBMI(weightKg: number, heightCm: number): {
  bmi: number;
  category: 'Underweight' | 'Normal' | 'Overweight' | 'Obese Class I' | 'Obese Class II+';
  limitations: string;
} {
  const heightM = heightCm / 100;
  const bmi = Math.round((weightKg / (heightM * heightM)) * 10) / 10;
  
  let category: 'Underweight' | 'Normal' | 'Overweight' | 'Obese Class I' | 'Obese Class II+';
  if (bmi < 18.5) category = 'Underweight';
  else if (bmi < 25.0) category = 'Normal';
  else if (bmi < 30.0) category = 'Overweight';
  else if (bmi < 35.0) category = 'Obese Class I';
  else category = 'Obese Class II+';

  const limitations =
    'BMI is a population-level screening formula based purely on total body weight and height. It cannot distinguish between lean muscle tissue, bone density, and adipose fat tissue. Muscular resistance-trained athletes often register as Overweight or Obese despite having healthy, low body fat percentages.';

  return { bmi, category, limitations };
}

/**
 * Calculates BMR using the Mifflin-St Jeor Equation
 * Men: 10 * weight(kg) + 6.25 * height(cm) - 5 * age + 5
 * Women: 10 * weight(kg) + 6.25 * height(cm) - 5 * age - 161
 */
export function calculateMifflinStJeorBMR(
  weightKg: number,
  heightCm: number,
  age: number,
  sex: BiologicalSex
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  if (sex === 'male') {
    return Math.round(base + 5);
  } else if (sex === 'female') {
    return Math.round(base - 161);
  } else {
    // For other/neutral, use midpoint average of male and female formula
    return Math.round(base - 78);
  }
}

/**
 * Complete Intelligent Nutrition Calculation Engine
 */
export function calculateNutritionMetrics(profile: UserDietProfile): NutritionMetrics {
  const {
    weightKg,
    heightCm,
    age,
    sex,
    activityLevel,
    primaryGoal,
    mealsPerDay
  } = profile;

  // 1. BMI
  const { bmi, category: bmiCategory, limitations: bmiLimitationsNotice } = calculateBMI(weightKg, heightCm);

  // 2. BMR (Mifflin-St Jeor)
  const bmr = calculateMifflinStJeorBMR(weightKg, heightCm, age, sex);

  // 3. TDEE
  const actConfig = ACTIVITY_MULTIPLIERS[activityLevel] || ACTIVITY_MULTIPLIERS.moderately_active;
  const tdee = Math.round(bmr * actConfig.multiplier);

  // 4. Goal Adjustment
  const goalConfig = GOAL_CONFIGS[primaryGoal] || GOAL_CONFIGS.general_fitness;
  let targetCalories = tdee + goalConfig.calorieDelta;

  // Safe Floor Enforcement: Never recommend extreme starvation diets
  const minSafeFloor = sex === 'female' ? 1250 : 1500;
  if (targetCalories < minSafeFloor) {
    targetCalories = minSafeFloor;
  }

  // Round target calories to nearest 10 for clean user experience
  targetCalories = Math.round(targetCalories / 10) * 10;
  const calorieDelta = targetCalories - tdee;

  // 5. Macronutrient Calculation
  // Protein: based on grams per kg bodyweight
  let targetProteinGrams = Math.round(weightKg * goalConfig.proteinGramsPerKg);
  // Cap protein safely between 1.2g/kg and 2.5g/kg
  targetProteinGrams = Math.max(Math.round(weightKg * 1.2), Math.min(Math.round(weightKg * 2.5), targetProteinGrams));
  const proteinCalories = targetProteinGrams * 4;

  // Fat: percentage of total calories
  const fatCalories = targetCalories * goalConfig.fatPercentOfCalories;
  const targetFatGrams = Math.max(35, Math.round(fatCalories / 9)); // Min 35g for hormone health

  // Carbs: Remaining calories allocated to carbohydrates
  const remainingCalories = Math.max(0, targetCalories - proteinCalories - (targetFatGrams * 9));
  const targetCarbsGrams = Math.round(remainingCalories / 4);

  // Fiber: 14g per 1000 kcal, or minimum 28g for men, 25g for women
  const calculatedFiber = Math.round((targetCalories / 1000) * 14);
  const minFiber = sex === 'female' ? 25 : 30;
  const targetFiberGrams = Math.max(minFiber, Math.min(45, calculatedFiber));

  // 6. Hydration Guidance: 35ml per kg bodyweight + 750ml for training days
  const baseHydrationMl = weightKg * 35;
  const workoutBonusMl = profile.workoutFrequencyPerWeek >= 3 ? 750 : 400;
  const hydrationLiters = Math.round(((baseHydrationMl + workoutBonusMl) / 1000) * 10) / 10;
  const hydrationGlasses = Math.round((hydrationLiters * 1000) / 250); // 250ml glass equivalent

  // 7. Meal frequency recommendation
  const suggestedMealFrequency = Math.max(2, Math.min(6, mealsPerDay || 4));

  // 8. Rationale
  const macroRationale =
    `Target: ${targetCalories} kcal/day (${calorieDelta >= 0 ? '+' : ''}${calorieDelta} kcal vs TDEE ${tdee} kcal). Protein set at ${goalConfig.proteinGramsPerKg}g/kg (${targetProteinGrams}g) to support athletic muscular recovery. Dietary fat set at ${Math.round(goalConfig.fatPercentOfCalories * 100)}% (${targetFatGrams}g) for steroid hormone balance, and complex carbohydrates (${targetCarbsGrams}g) allocated for glycogen reloading.`;

  const safetyNotice =
    'NOTICE: This intelligent nutrition plan provides evidence-based nutritional guidelines for athletic training and general health. It does not constitute individual medical diagnosis or disease treatment. Always consult a physician or registered clinical dietitian if you have metabolic conditions, are pregnant, or are taking prescription medications.';

  return {
    bmi,
    bmiCategory,
    bmiLimitationsNotice,
    bmr,
    tdee,
    dailyCalorieTarget: targetCalories,
    calorieDelta,
    proteinGrams: targetProteinGrams,
    carbsGrams: targetCarbsGrams,
    fatGrams: targetFatGrams,
    fiberGrams: targetFiberGrams,
    hydrationLiters,
    hydrationGlasses,
    suggestedMealFrequency,
    goalRationale: goalConfig.rationale,
    macroRationale,
    safetyNotice
  };
}
