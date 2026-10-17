import {
  UserDietProfile,
  NutritionMetrics,
  FullDietPlan,
  DayPlan,
  Meal,
  ShoppingListItem,
  DietaryPreference,
  MealSlotType
} from '../types/diet';
import { MEALS_DATABASE, MealTemplate } from '../data/mealsDatabase';

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DAY_FOCUS_NOTES = [
  'Strength & Metabolic Ignition — High complex carbs and steady amino acid influx',
  'Hypertrophy & Cellular Hydration — Lean protein emphasis with micronutrient greens',
  'Mid-Week Athletic Fuel — Digestive fiber, healthy fats, and sustained glycogen',
  'Power & Neuromuscular Output — High-energy pre/post workout carbohydrate timing',
  'Peak Performance Balance — Anti-inflammatory spices and bioavailable recovery',
  'Weekend High-Volume Fuel — Varied whole food staples and electrolyte replenishers',
  'Regenerative Equilibrium — Gut microbiome restoration and metabolic reset'
];

/**
 * Checks if a meal satisfies the user's dietary preference
 */
function isDietaryCompatible(mealPref: DietaryPreference, userPref: DietaryPreference): boolean {
  if (userPref === 'non_vegetarian') return true;
  if (userPref === 'pescatarian') {
    return mealPref === 'pescatarian' || mealPref === 'eggetarian' || mealPref === 'vegetarian' || mealPref === 'vegan';
  }
  if (userPref === 'eggetarian') {
    return mealPref === 'eggetarian' || mealPref === 'vegetarian' || mealPref === 'vegan';
  }
  if (userPref === 'vegetarian') {
    return mealPref === 'vegetarian' || mealPref === 'vegan';
  }
  if (userPref === 'vegan') {
    return mealPref === 'vegan';
  }
  return true;
}

/**
 * Checks if a meal contains any declared allergen
 */
function containsDeclaredAllergen(meal: MealTemplate, profile: UserDietProfile): boolean {
  const userAllergies = new Set(profile.allergies);
  if (profile.customAllergies && profile.customAllergies.length > 0) {
    const customList = profile.customAllergies.map(a => a.toLowerCase().trim());
    for (const ing of meal.ingredients) {
      const ingNameLower = ing.name.toLowerCase();
      if (customList.some(c => ingNameLower.includes(c))) {
        return true;
      }
    }
  }

  // Check standard allergen tags on the meal
  for (const allergen of meal.allergens) {
    if (userAllergies.has(allergen)) {
      return true;
    }
  }

  // Check allergen tags on individual ingredients
  for (const ing of meal.ingredients) {
    for (const allergen of ing.allergens) {
      if (userAllergies.has(allergen)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Checks if meal contains user-disliked foods
 */
function containsDislikedFoods(meal: MealTemplate, dislikedFoods: string[]): boolean {
  if (!dislikedFoods || dislikedFoods.length === 0) return false;
  const lowerDislikes = dislikedFoods.map(d => d.toLowerCase().trim()).filter(Boolean);
  
  const textBlob = `${meal.name} ${meal.description} ${meal.ingredients.map(i => i.name).join(' ')}`.toLowerCase();
  return lowerDislikes.some(dislike => textBlob.includes(dislike));
}

/**
 * Filter available meals database for a specific profile and slot
 */
export function getFilteredMeals(
  slot: MealSlotType,
  profile: UserDietProfile
): MealTemplate[] {
  let candidates = MEALS_DATABASE.filter(m => m.slot === slot);

  // Filter dietary preference
  candidates = candidates.filter(m => isDietaryCompatible(m.dietaryPreference, profile.dietaryPreference));

  // Filter allergens
  candidates = candidates.filter(m => !containsDeclaredAllergen(m, profile));

  // Filter dislikes if possible
  const withoutDislikes = candidates.filter(m => !containsDislikedFoods(m, profile.dislikedFoods));
  if (withoutDislikes.length > 0) {
    candidates = withoutDislikes;
  }

  // Fallback: if all meals in this slot were filtered out (due to strict preferences),
  // pick any compatible meal across other snack/lunch slots and adapt slot name
  if (candidates.length === 0) {
    const allCompatible = MEALS_DATABASE.filter(m =>
      isDietaryCompatible(m.dietaryPreference, profile.dietaryPreference) &&
      !containsDeclaredAllergen(m, profile)
    );
    if (allCompatible.length > 0) {
      return allCompatible;
    }
    return MEALS_DATABASE.filter(m => isDietaryCompatible(m.dietaryPreference, profile.dietaryPreference));
  }

  return candidates;
}

/**
 * Select slots to include based on user's preferred number of meals per day
 */
function getSlotsForMealCount(count: number): MealSlotType[] {
  if (count <= 2) return ['lunch', 'dinner'];
  if (count === 3) return ['breakfast', 'lunch', 'dinner'];
  if (count === 4) return ['breakfast', 'lunch', 'evening_snack', 'dinner'];
  if (count === 5) return ['breakfast', 'mid_morning', 'lunch', 'post_workout', 'dinner'];
  // 6 meals
  return ['breakfast', 'mid_morning', 'lunch', 'pre_workout', 'post_workout', 'dinner'];
}

/**
 * Instantiates an interactive Meal instance from template with scaling
 */
export function createMealInstance(
  template: MealTemplate,
  scale = 1.0,
  slotOverride?: MealSlotType
): Meal {
  const scaledCalories = Math.round(template.calories * scale);
  const scaledProtein = Math.round(template.proteinGrams * scale);
  const scaledCarbs = Math.round(template.carbsGrams * scale);
  const scaledFat = Math.round(template.fatGrams * scale);
  const scaledFiber = Math.round(template.fiberGrams * scale);
  const scaledCost = Math.round(template.estimatedCostInr * scale);

  return {
    id: `${template.id}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    slot: slotOverride || template.slot,
    name: template.name,
    timeHint: template.timeHint,
    description: template.description,
    ingredients: template.ingredients.map(ing => ({
      ...ing,
      approxCostInr: Math.round(ing.approxCostInr * scale)
    })),
    portionDescription: scale === 1.0 ? template.portionDescription : `${template.portionDescription} (scaled ${scale}x)`,
    calories: scaledCalories,
    proteinGrams: scaledProtein,
    carbsGrams: scaledCarbs,
    fatGrams: scaledFat,
    fiberGrams: scaledFiber,
    prepTimeMinutes: template.prepTimeMinutes,
    prepInstructions: [...template.prepInstructions],
    substitutions: [...template.substitutions],
    estimatedCostInr: scaledCost,
    dietaryPreference: template.dietaryPreference,
    allergens: [...template.allergens],
    imageUrl: template.imageUrl,
    servingScale: scale,
    isCompleted: false,
    isFavorite: false
  };
}

/**
 * Generates complete 7-Day Personalized Diet Plan
 */
export function generateFullDietPlan(
  profile: UserDietProfile,
  metrics: NutritionMetrics
): FullDietPlan {
  const slots = getSlotsForMealCount(profile.mealsPerDay || 4);
  const days: DayPlan[] = [];

  for (let d = 0; d < 7; d++) {
    const dayMeals: Meal[] = [];

    for (const slot of slots) {
      const available = getFilteredMeals(slot, profile);
      // Select template cyclically to ensure varied meal plan each day
      const template = available[d % available.length] || available[0];
      
      // Calculate slot calorie weighting
      // Breakfast: 25%, Lunch: 35%, Dinner: 30%, Snacks: 10%
      let targetSlotCalories = metrics.dailyCalorieTarget / slots.length;
      if (slot === 'lunch' || slot === 'dinner') targetSlotCalories *= 1.15;
      if (slot === 'mid_morning' || slot === 'evening_snack' || slot === 'pre_workout') targetSlotCalories *= 0.65;

      const rawRatio = targetSlotCalories / (template.calories || 400);
      // Clamp scale safely between 0.8 and 1.6
      const scale = Math.round(Math.max(0.8, Math.min(1.5, rawRatio)) * 10) / 10;

      const mealInstance = createMealInstance(template, scale, slot);
      dayMeals.push(mealInstance);
    }

    const totalCalories = dayMeals.reduce((acc, m) => acc + m.calories, 0);
    const totalProtein = dayMeals.reduce((acc, m) => acc + m.proteinGrams, 0);
    const totalCarbs = dayMeals.reduce((acc, m) => acc + m.carbsGrams, 0);
    const totalFat = dayMeals.reduce((acc, m) => acc + m.fatGrams, 0);
    const totalFiber = dayMeals.reduce((acc, m) => acc + m.fiberGrams, 0);
    const totalEstimatedCostInr = dayMeals.reduce((acc, m) => acc + m.estimatedCostInr, 0);

    days.push({
      dayNumber: d + 1,
      dayName: DAY_NAMES[d],
      focusNote: DAY_FOCUS_NOTES[d],
      meals: dayMeals,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      totalFiber,
      totalEstimatedCostInr
    });
  }

  const explanation =
    `This 7-day nutrition blueprint is customized for your ${metrics.goalRationale}. Daily targets are calibrated to ${metrics.dailyCalorieTarget} kcal, providing ${metrics.proteinGrams}g protein for tissue synthesis, ${metrics.carbsGrams}g complex carbohydrates for glycogen, and ${metrics.fatGrams}g dietary lipids. Every meal excludes declared allergens (${profile.allergies.length > 0 ? profile.allergies.join(', ') : 'none declared'}) and respects your ${profile.dietaryPreference.replace('_', ' ')} protocol.`;

  return {
    id: `diet-plan-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    profile,
    metrics,
    days,
    explanation,
    aiGenerated: false
  };
}

/**
 * Replaces a single meal within a day plan with another compatible meal
 */
export function replaceSingleMeal(
  plan: FullDietPlan,
  dayNumber: number,
  mealId: string
): FullDietPlan {
  const updatedDays = plan.days.map(day => {
    if (day.dayNumber !== dayNumber) return day;

    const mealIndex = day.meals.findIndex(m => m.id === mealId);
    if (mealIndex === -1) return day;

    const currentMeal = day.meals[mealIndex];
    const available = getFilteredMeals(currentMeal.slot, plan.profile);

    // Pick an alternative template different from current name
    const alternatives = available.filter(t => t.name !== currentMeal.name);
    const newTemplate = alternatives.length > 0
      ? alternatives[Math.floor(Math.random() * alternatives.length)]
      : available[0];

    const newMeal = createMealInstance(newTemplate, currentMeal.servingScale || 1.0, currentMeal.slot);

    const newMeals = [...day.meals];
    newMeals[mealIndex] = newMeal;

    return {
      ...day,
      meals: newMeals,
      totalCalories: newMeals.reduce((acc, m) => acc + m.calories, 0),
      totalProtein: newMeals.reduce((acc, m) => acc + m.proteinGrams, 0),
      totalCarbs: newMeals.reduce((acc, m) => acc + m.carbsGrams, 0),
      totalFat: newMeals.reduce((acc, m) => acc + m.fatGrams, 0),
      totalFiber: newMeals.reduce((acc, m) => acc + m.fiberGrams, 0),
      totalEstimatedCostInr: newMeals.reduce((acc, m) => acc + m.estimatedCostInr, 0)
    };
  });

  return {
    ...plan,
    days: updatedDays,
    updatedAt: new Date().toISOString()
  };
}

/**
 * Scales serving size for a specific meal (e.g. 1.25x or 1.5x)
 */
export function scaleMealServing(
  meal: Meal,
  newScale: number
): Meal {
  const currentScale = meal.servingScale || 1.0;
  const ratio = newScale / currentScale;

  return {
    ...meal,
    servingScale: newScale,
    calories: Math.round(meal.calories * ratio),
    proteinGrams: Math.round(meal.proteinGrams * ratio),
    carbsGrams: Math.round(meal.carbsGrams * ratio),
    fatGrams: Math.round(meal.fatGrams * ratio),
    fiberGrams: Math.round(meal.fiberGrams * ratio),
    estimatedCostInr: Math.round(meal.estimatedCostInr * ratio),
    portionDescription: `${meal.portionDescription.split(' (scaled')[0]} (scaled ${newScale}x)`
  };
}

/**
 * Generates an aggregated, categorized grocery shopping list for the 7-day plan
 */
export function generateCategorizedShoppingList(plan: FullDietPlan): ShoppingListItem[] {
  const itemMap = new Map<string, {
    name: string;
    category: 'produce' | 'protein' | 'dairy' | 'grains' | 'fats' | 'spices_pantry';
    count: number;
    totalCost: number;
  }>();

  for (const day of plan.days) {
    for (const meal of day.meals) {
      for (const ing of meal.ingredients) {
        const key = ing.name.toLowerCase().trim();
        const existing = itemMap.get(key);
        if (existing) {
          existing.count += 1;
          existing.totalCost += ing.approxCostInr;
        } else {
          itemMap.set(key, {
            name: ing.name,
            category: ing.category,
            count: 1,
            totalCost: ing.approxCostInr
          });
        }
      }
    }
  }

  const shoppingList: ShoppingListItem[] = [];
  let index = 1;

  for (const [_, item] of itemMap) {
    shoppingList.push({
      id: `shop-${index++}`,
      name: item.name,
      category: item.category,
      totalQuantity: item.count > 1 ? `approx. ${item.count} servings` : '1 standard pack/serving',
      estimatedCostInr: Math.max(15, Math.round(item.totalCost)),
      isPurchased: false
    });
  }

  // Sort by category
  const order: Record<string, number> = {
    produce: 1,
    protein: 2,
    dairy: 3,
    grains: 4,
    fats: 5,
    spices_pantry: 6
  };

  return shoppingList.sort((a, b) => (order[a.category] || 99) - (order[b.category] || 99));
}
