import { Meal, AllergyType, DietaryPreference, MealSlotType } from '../types/diet';

export interface MealTemplate {
  id: string;
  slot: MealSlotType;
  name: string;
  timeHint: string;
  description: string;
  dietaryPreference: DietaryPreference;
  allergens: AllergyType[];
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  fiberGrams: number;
  prepTimeMinutes: number;
  portionDescription: string;
  estimatedCostInr: number;
  imageUrl: string;
  ingredients: {
    name: string;
    amount: string;
    category: 'produce' | 'protein' | 'dairy' | 'grains' | 'fats' | 'spices_pantry';
    approxCostInr: number;
    isVegetarian: boolean;
    isVegan: boolean;
    allergens: AllergyType[];
    substitutions?: string[];
  }[];
  prepInstructions: string[];
  substitutions: string[];
}

export const MEALS_DATABASE: MealTemplate[] = [
  // ==================== BREAKFAST ====================
  {
    id: 'bf-01',
    slot: 'breakfast',
    name: 'Steamed Ragi & Oats Idli with Sambar & Mint Chutney',
    timeHint: '07:30 AM - 08:30 AM',
    description: 'Traditional Karnataka finger-millet (ragi) and oats idlis served with high-protein yellow toor dal sambar and fresh pudina-coconut chutney.',
    dietaryPreference: 'vegan',
    allergens: [],
    calories: 420,
    proteinGrams: 16,
    carbsGrams: 74,
    fatGrams: 6,
    fiberGrams: 11,
    prepTimeMinutes: 20,
    portionDescription: '4 steamed idlis (240g), 1 large bowl sambar (200ml), 2 tbsp mint chutney (30g)',
    estimatedCostInr: 55,
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    ingredients: [
      { name: 'Ragi & Rolled Oats Idli Batter', amount: '200g', category: 'grains', approxCostInr: 25, isVegetarian: true, isVegan: true, allergens: [] },
      { name: 'Toor Dal & Vegetables (Sambar)', amount: '180ml', category: 'protein', approxCostInr: 20, isVegetarian: true, isVegan: true, allergens: [] },
      { name: 'Fresh Mint & Coconut Chutney', amount: '30g', category: 'produce', approxCostInr: 10, isVegetarian: true, isVegan: true, allergens: [] }
    ],
    prepInstructions: [
      'Steam ragi-oats batter in an idli steamer for 10-12 minutes until fluffy and firm.',
      'Simmer cooked toor dal with drumsticks, carrots, tomatoes, and sambar masala.',
      'Grind fresh mint leaves, coriander, a pinch of grated coconut, and green chili with lemon juice.',
      'Serve steaming hot idlis immersed in protein sambar with a dollop of mint chutney.'
    ],
    substitutions: [
      'Replace ragi idli with classic brown rice idlis or quinoa dosas',
      'Add roasted chana powder (sattu) to sambar for +6g additional protein'
    ]
  },
  {
    id: 'bf-02',
    slot: 'breakfast',
    name: 'High-Protein Paneer Bhurji with Multigrain Rotis',
    timeHint: '07:30 AM - 08:30 AM',
    description: 'Crumbled low-fat Malai paneer sautéed with diced onions, juicy tomatoes, turmeric, green chili, and fresh coriander, paired with fibre-rich multigrain rotis.',
    dietaryPreference: 'vegetarian',
    allergens: ['dairy_lactose', 'gluten'],
    calories: 490,
    proteinGrams: 28,
    carbsGrams: 48,
    fatGrams: 20,
    fiberGrams: 8,
    prepTimeMinutes: 15,
    portionDescription: '150g paneer bhurji, 2 medium multigrain rotis (70g)',
    estimatedCostInr: 95,
    imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80',
    ingredients: [
      { name: 'Low-fat Fresh Paneer', amount: '150g', category: 'dairy', approxCostInr: 65, isVegetarian: true, isVegan: false, allergens: ['dairy_lactose'] },
      { name: 'Multigrain Atta (Wheat, Ragi, Chana)', amount: '60g', category: 'grains', approxCostInr: 15, isVegetarian: true, isVegan: true, allergens: ['gluten'] },
      { name: 'Onions, Tomatoes, Green Chillies & Coriander', amount: '100g', category: 'produce', approxCostInr: 10, isVegetarian: true, isVegan: true, allergens: [] },
      { name: 'Cold-pressed Mustard or Olive Oil', amount: '1 tsp (5ml)', category: 'fats', approxCostInr: 5, isVegetarian: true, isVegan: true, allergens: [] }
    ],
    prepInstructions: [
      'Heat oil in a non-stick pan, sauté cumin seeds, chopped onions, tomatoes, and chillies until aromatic.',
      'Add turmeric, garam masala, salt, and crumbled paneer. Toss gently on medium flame for 3-4 minutes.',
      'Roll out multigrain dough and roast rotis evenly on a tawa without excess oil.',
      'Garnish paneer bhurji with fresh coriander and serve hot alongside rotis.'
    ],
    substitutions: [
      'Tofu (150g) makes this 100% vegan and dairy-free without protein loss',
      'Gluten-free jowar or bajra rotis for gluten intolerance'
    ]
  },
  {
    id: 'bf-03',
    slot: 'breakfast',
    name: '3-Egg Masala Omelette with Toasted Brown Bread & Avocado',
    timeHint: '07:30 AM - 08:30 AM',
    description: 'Fluffy whole egg and egg-white scramble seasoned with Indian herbs, diced bell peppers, served with 100% whole grain toasted sourdough and sliced Hass avocado.',
    dietaryPreference: 'eggetarian',
    allergens: ['eggs', 'gluten'],
    calories: 460,
    proteinGrams: 29,
    carbsGrams: 36,
    fatGrams: 21,
    fiberGrams: 7,
    prepTimeMinutes: 12,
    portionDescription: '3-egg scramble/omelette (1 whole + 2 whites), 2 brown bread slices, 40g sliced avocado',
    estimatedCostInr: 80,
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80',
    ingredients: [
      { name: 'Farm Fresh Eggs', amount: '3 eggs (1 whole, 2 whites)', category: 'protein', approxCostInr: 24, isVegetarian: false, isVegan: false, allergens: ['eggs'] },
      { name: '100% Whole Wheat Sourdough Bread', amount: '2 slices (60g)', category: 'grains', approxCostInr: 20, isVegetarian: true, isVegan: true, allergens: ['gluten'] },
      { name: 'Hass Avocado / Nut Seed Butter', amount: '40g', category: 'fats', approxCostInr: 30, isVegetarian: true, isVegan: true, allergens: [] },
      { name: 'Spinach, Bell Peppers & Spices', amount: '60g', category: 'produce', approxCostInr: 6, isVegetarian: true, isVegan: true, allergens: [] }
    ],
    prepInstructions: [
      'Whisk 1 whole egg and 2 egg whites with finely chopped onions, peppers, spinach, salt, and black pepper.',
      'Cook on a preheated skillet with light cooking spray for 2-3 minutes per side.',
      'Toast sourdough bread to golden crispness and spread sliced avocado.',
      'Top with red pepper flakes and microgreens.'
    ],
    substitutions: [
      'Gluten-free millet toast for gluten allergy',
      'Replace avocado with 1 tbsp peanut butter or sunflower seed butter'
    ]
  },
  {
    id: 'bf-04',
    slot: 'breakfast',
    name: 'Mysuru Masala Red Rice Dosa with Soya Keema Filling',
    timeHint: '07:30 AM - 08:30 AM',
    description: 'Crispy red rice & urad dal dosa smeared with garlic-red chili chutney and stuffed with spiced high-protein textured soya mince.',
    dietaryPreference: 'vegan',
    allergens: ['soy'],
    calories: 470,
    proteinGrams: 27,
    carbsGrams: 64,
    fatGrams: 11,
    fiberGrams: 9,
    prepTimeMinutes: 18,
    portionDescription: '2 medium stuffed red rice dosas (180g), 1 cup vegetable sambar (150ml)',
    estimatedCostInr: 60,
    imageUrl: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80',
    ingredients: [
      { name: 'Red Rice & Urad Dal Batter', amount: '160g', category: 'grains', approxCostInr: 20, isVegetarian: true, isVegan: true, allergens: [] },
      { name: 'Textured Soya Granules / Minced Tempeh', amount: '50g (dry)', category: 'protein', approxCostInr: 20, isVegetarian: true, isVegan: true, allergens: ['soy'] },
      { name: 'Mysuru Red Garlic Paste & Onions', amount: '40g', category: 'produce', approxCostInr: 10, isVegetarian: true, isVegan: true, allergens: [] },
      { name: 'Cold-pressed Sesame or Coconut Oil', amount: '1 tsp', category: 'fats', approxCostInr: 10, isVegetarian: true, isVegan: true, allergens: ['sesame'] }
    ],
    prepInstructions: [
      'Rehydrate soya granules in boiling water, squeeze thoroughly, and sauté with onions, cumin, turmeric, and garam masala.',
      'Spread dosa batter on a smoking-hot iron tawa, apply garlic-chili paste evenly.',
      'Spread cooked spiced soya mince down the center, fold crisp dosa.',
      'Serve with vegetable sambar.'
    ],
    substitutions: [
      'Substitute sprouted mung beans or paneer if soy is avoided',
      'Use pure coconut oil instead of sesame for sesame-free preparation'
    ]
  },
  {
    id: 'bf-05',
    slot: 'breakfast',
    name: 'Smoked Chicken Breast Slices on Sourdough with Poached Egg',
    timeHint: '07:30 AM - 08:30 AM',
    description: 'Lean tender chicken breast seasoned with rosemary and black pepper on artisanal sourdough, topped with a soft poached egg and micro arugula.',
    dietaryPreference: 'non_vegetarian',
    allergens: ['eggs', 'gluten'],
    calories: 510,
    proteinGrams: 42,
    carbsGrams: 38,
    fatGrams: 18,
    fiberGrams: 5,
    prepTimeMinutes: 15,
    portionDescription: '120g grilled chicken breast, 1 poached farm egg, 2 sourdough slices',
    estimatedCostInr: 120,
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    ingredients: [
      { name: 'Lean Chicken Breast Fillet', amount: '120g', category: 'protein', approxCostInr: 60, isVegetarian: false, isVegan: false, allergens: [] },
      { name: 'Farm Egg', amount: '1 whole', category: 'protein', approxCostInr: 8, isVegetarian: false, isVegan: false, allergens: ['eggs'] },
      { name: 'Artisan Whole Wheat Sourdough', amount: '2 slices (70g)', category: 'grains', approxCostInr: 25, isVegetarian: true, isVegan: true, allergens: ['gluten'] },
      { name: 'Dijon Mustard & Baby Spinach', amount: '35g', category: 'produce', approxCostInr: 15, isVegetarian: true, isVegan: true, allergens: ['mustard'] },
      { name: 'Cold-pressed Olive Oil', amount: '1 tsp', category: 'fats', approxCostInr: 12, isVegetarian: true, isVegan: true, allergens: [] }
    ],
    prepInstructions: [
      'Pan-sear chicken breast with salt, cracked pepper, and garlic herb oil for 4-5 mins per side until internal temp is 74°C.',
      'Poach egg in gently simmering water with 1 tbsp vinegar for 3 minutes.',
      'Toast sourdough, spread dijon mustard and fresh spinach leaves.',
      'Slice chicken across the grain, arrange on toast, and crown with the runny poached egg.'
    ],
    substitutions: [
      'Canned wild salmon or tuna in spring water for pescatarians',
      'Gluten-free multigrain bread for celiac compatibility'
    ]
  },

  // ==================== MID-MORNING SNACK ====================
  {
    id: 'mm-01',
    slot: 'mid_morning',
    name: 'Sprouted Moong & Black Chickpea Chaat with Pomegranate',
    timeHint: '10:30 AM - 11:15 AM',
    description: 'Crisp steamed sprouted green moong beans and desi kala chana tossed with ruby pomegranate pearls, cucumber, lemon, and chaat spices.',
    dietaryPreference: 'vegan',
    allergens: [],
    calories: 220,
    proteinGrams: 12,
    carbsGrams: 38,
    fatGrams: 2,
    fiberGrams: 9,
    prepTimeMinutes: 8,
    portionDescription: '1 medium bowl (180g)',
    estimatedCostInr: 30,
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    ingredients: [
      { name: 'Sprouted Green Moong & Kala Chana', amount: '120g', category: 'protein', approxCostInr: 15, isVegetarian: true, isVegan: true, allergens: [] },
      { name: 'Pomegranate Seeds & Diced Cucumber', amount: '50g', category: 'produce', approxCostInr: 12, isVegetarian: true, isVegan: true, allergens: [] },
      { name: 'Lime Juice & Rock Salt Chaat Masala', amount: '10g', category: 'spices_pantry', approxCostInr: 3, isVegetarian: true, isVegan: true, allergens: [] }
    ],
    prepInstructions: [
      'Steam sprouted mung beans for 3 minutes (or keep raw if preferred crunchy).',
      'Toss with diced cucumber, onions, fresh coriander, and sweet pomegranate.',
      'Drizzle with freshly squeezed lime juice and sprinkle roasted cumin and black salt (kala namak).'
    ],
    substitutions: [
      'Add boiled edamame for a higher protein punch (+8g protein)',
      'Add roasted pumpkin seeds for crunch and magnesium'
    ]
  },
  {
    id: 'mm-02',
    slot: 'mid_morning',
    name: 'Greek Yogurt Protein Parfait with Chia Seeds & Walnuts',
    timeHint: '10:30 AM - 11:15 AM',
    description: 'Thick, strained unsweetened Greek yogurt layered with omega-rich chia seeds, crushed Kashmiri walnuts, and seasonal blueberries or papaya.',
    dietaryPreference: 'vegetarian',
    allergens: ['dairy_lactose', 'tree_nuts'],
    calories: 260,
    proteinGrams: 18,
    carbsGrams: 22,
    fatGrams: 10,
    fiberGrams: 5,
    prepTimeMinutes: 5,
    portionDescription: '1 cup parfait glass (180g yogurt + toppings)',
    estimatedCostInr: 65,
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80',
    ingredients: [
      { name: 'Unsweetened Greek Yogurt (Epigamia/Milky Mist)', amount: '160g', category: 'dairy', approxCostInr: 45, isVegetarian: true, isVegan: false, allergens: ['dairy_lactose'] },
      { name: 'Chia Seeds', amount: '1 tbsp (10g)', category: 'grains', approxCostInr: 8, isVegetarian: true, isVegan: true, allergens: [] },
      { name: 'Kashmiri Walnuts or Roasted Almonds', amount: '12g', category: 'fats', approxCostInr: 12, isVegetarian: true, isVegan: true, allergens: ['tree_nuts'] }
    ],
    prepInstructions: [
      'Spoon half of chilled Greek yogurt into a glass.',
      'Sprinkle chia seeds and finely chopped berries or papaya.',
      'Top with remaining yogurt and crush raw walnuts over top.'
    ],
    substitutions: [
      'Coconut or almond milk yogurt for vegan / dairy-free',
      'Sunflower and pumpkin seeds for tree-nut allergies'
    ]
  },
  {
    id: 'mm-03',
    slot: 'mid_morning',
    name: 'Karnataka Sattu & Buttermilk Protein Cooler',
    timeHint: '10:30 AM - 11:15 AM',
    description: 'Traditional cooling digestive beverage made with roasted Bengal gram flour (chana sattu), homemade churned curd buttermilk, mint, and roasted jeera.',
    dietaryPreference: 'vegetarian',
    allergens: ['dairy_lactose'],
    calories: 210,
    proteinGrams: 14,
    carbsGrams: 28,
    fatGrams: 4,
    fiberGrams: 6,
    prepTimeMinutes: 5,
    portionDescription: '1 tall glass (350ml)',
    estimatedCostInr: 25,
    imageUrl: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=600&q=80',
    ingredients: [
      { name: 'Roasted Chana Sattu Flour', amount: '35g', category: 'protein', approxCostInr: 12, isVegetarian: true, isVegan: true, allergens: [] },
      { name: 'Fresh Churned Buttermilk (Majjige)', amount: '250ml', category: 'dairy', approxCostInr: 10, isVegetarian: true, isVegan: false, allergens: ['dairy_lactose'] },
      { name: 'Crushed Mint, Ginger & Roasted Jeera', amount: '10g', category: 'spices_pantry', approxCostInr: 3, isVegetarian: true, isVegan: true, allergens: [] }
    ],
    prepInstructions: [
      'Whisk sattu flour with a small splash of buttermilk to avoid lumps.',
      'Pour in remaining chilled buttermilk, grated ginger, mint, and black salt.',
      'Blend or shake vigorously and garnish with roasted cumin powder.'
    ],
    substitutions: [
      'Use chilled coconut water or lemon-water base for 100% vegan / dairy-free'
    ]
  },

  // ==================== LUNCH ====================
  {
    id: 'lu-01',
    slot: 'lunch',
    name: 'Grilled Herb Chicken Breast with Brown Basmati & Steamed Broccoli',
    timeHint: '01:00 PM - 02:00 PM',
    description: 'Juicy, marinated chicken breast seared with garlic and oregano, served with fragrant dehradun brown basmati rice, steamed florets, and light dal gravy.',
    dietaryPreference: 'non_vegetarian',
    allergens: [],
    calories: 580,
    proteinGrams: 48,
    carbsGrams: 62,
    fatGrams: 12,
    fiberGrams: 8,
    prepTimeMinutes: 25,
    portionDescription: '160g chicken breast, 1 cup cooked brown rice (150g), 100g steamed broccoli & carrots',
    estimatedCostInr: 110,
    imageUrl: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=600&q=80',
    ingredients: [
      { name: 'Skinless Chicken Breast', amount: '160g', category: 'protein', approxCostInr: 70, isVegetarian: false, isVegan: false, allergens: [] },
      { name: 'Brown Basmati Rice (Cooked)', amount: '150g', category: 'grains', approxCostInr: 18, isVegetarian: true, isVegan: true, allergens: [] },
      { name: 'Broccoli, French Beans & Carrots', amount: '120g', category: 'produce', approxCostInr: 15, isVegetarian: true, isVegan: true, allergens: [] },
      { name: 'Cold-pressed Olive Oil & Garlic', amount: '1.5 tsp', category: 'fats', approxCostInr: 7, isVegetarian: true, isVegan: true, allergens: [] }
    ],
    prepInstructions: [
      'Marinate chicken breast in lemon juice, minced garlic, oregano, paprika, and a touch of olive oil for 15 minutes.',
      'Grill on medium-high skillet for 6 minutes per side until charred and tender.',
      'Steam broccoli and beans with a pinch of rock salt for 4 minutes to preserve vibrant green vitamins.',
      'Plate with warm brown rice and squeeze fresh lemon wedges.'
    ],
    substitutions: [
      'Replace chicken with grilled white fish fillet (Basa/Rohu/Salmon) for pescatarians',
      'Replace brown rice with foxtail millet or quinoa for low glycemic index'
    ]
  },
  {
    id: 'lu-02',
    slot: 'lunch',
    name: 'Mysuru High-Protein Paneer Dal Khichdi with Cucumber Raita',
    timeHint: '01:00 PM - 02:00 PM',
    description: 'Nutritious slow-cooked blend of split yellow moong dal, brown rice, turmeric, diced paneer cubes, and ghee tadka, served with cooling probiotic cucumber curd.',
    dietaryPreference: 'vegetarian',
    allergens: ['dairy_lactose'],
    calories: 540,
    proteinGrams: 30,
    carbsGrams: 68,
    fatGrams: 15,
    fiberGrams: 9,
    prepTimeMinutes: 22,
    portionDescription: '1 large bowl khichdi (320g), 100g paneer incorporated, 1 katori cucumber raita (120g)',
    estimatedCostInr: 85,
    imageUrl: 'https://images.unsplash.com/photo-1606471191009-63994c53433b?auto=format&fit=crop&w=600&q=80',
    ingredients: [
      { name: 'Split Yellow Moong Dal', amount: '70g', category: 'protein', approxCostInr: 18, isVegetarian: true, isVegan: true, allergens: [] },
      { name: 'Low-fat Paneer Cubes', amount: '100g', category: 'dairy', approxCostInr: 45, isVegetarian: true, isVegan: false, allergens: ['dairy_lactose'] },
      { name: 'Brown Rice / Handpound Rice', amount: '50g', category: 'grains', approxCostInr: 10, isVegetarian: true, isVegan: true, allergens: [] },
      { name: 'Fresh Homemade Curd (Raita)', amount: '100g', category: 'dairy', approxCostInr: 10, isVegetarian: true, isVegan: false, allergens: ['dairy_lactose'] },
      { name: 'Desi Cow Ghee (Tadka)', amount: '1 tsp (5g)', category: 'fats', approxCostInr: 8, isVegetarian: true, isVegan: false, allergens: ['dairy_lactose'] }
    ],
    prepInstructions: [
      'Pressure cook moong dal and brown rice with turmeric, ginger, and pink salt for 3 whistles.',
      'Slightly pan-toss low-fat paneer cubes with cumin seeds and stir into the hot khichdi.',
      'Temper with 1 tsp ghee, hing (asafoetida), and curry leaves.',
      'Serve alongside fresh grated cucumber stirred into chilled curd with roasted cumin.'
    ],
    substitutions: [
      'Tofu (120g) & vegan coconut yogurt for dairy-free and vegan profiles'
    ]
  },
  {
    id: 'lu-03',
    slot: 'lunch',
    name: 'Soya Chunk Curry with Multigrain Phulkas & Green Salad',
    timeHint: '01:00 PM - 02:00 PM',
    description: 'High-protein textured soya chunks simmered in a rich tomato, onion, and roasted coriander gravy, accompanied by 3 warm multigrain phulkas and garden salad.',
    dietaryPreference: 'vegan',
    allergens: ['soy', 'gluten'],
    calories: 520,
    proteinGrams: 36,
    carbsGrams: 70,
    fatGrams: 10,
    fiberGrams: 13,
    prepTimeMinutes: 20,
    portionDescription: '1.5 cups soya curry (250g), 3 phulkas (90g), 1 plate crunchy salad',
    estimatedCostInr: 50,
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80',
    ingredients: [
      { name: 'Textured Soya Chunks (Fortune/Nutrela)', amount: '60g dry', category: 'protein', approxCostInr: 18, isVegetarian: true, isVegan: true, allergens: ['soy'] },
      { name: 'Whole Wheat & Jowar Flour (Phulkas)', amount: '75g', category: 'grains', approxCostInr: 15, isVegetarian: true, isVegan: true, allergens: ['gluten'] },
      { name: 'Tomatoes, Onions, Ginger & Garam Masala', amount: '150g', category: 'produce', approxCostInr: 12, isVegetarian: true, isVegan: true, allergens: [] },
      { name: 'Pressed Mustard Oil', amount: '1 tsp', category: 'fats', approxCostInr: 5, isVegetarian: true, isVegan: true, allergens: [] }
    ],
    prepInstructions: [
      'Boil soya chunks in salted water for 5 minutes, rinse thoroughly in cold water, and squeeze out excess water.',
      'Prepare gravy by sautéing onions, ginger-garlic paste, tomato puree, coriander powder, and garam masala until oil separates.',
      'Add squeezed soya chunks, simmer with 1 cup water for 8 minutes to absorb flavors.',
      'Puff whole wheat-jowar phulkas on an open flame without oil. Serve with cucumber-radish salad.'
    ],
    substitutions: [
      'Chickpeas / Kabuli chana (150g cooked) if soy allergy is present',
      'Jowar / Ragi rotis for gluten-sensitive users'
    ]
  },
  {
    id: 'lu-04',
    slot: 'lunch',
    name: 'Coastal Mangalorean Fish Curry with Boiled Kerala Rice',
    timeHint: '01:00 PM - 02:00 PM',
    description: 'Fresh local white fish steaks poached in a tangy coconut-kokum curry with curry leaves, served over traditional unpolished red matta boiled rice.',
    dietaryPreference: 'pescatarian',
    allergens: ['fish'],
    calories: 560,
    proteinGrams: 42,
    carbsGrams: 65,
    fatGrams: 14,
    fiberGrams: 6,
    prepTimeMinutes: 25,
    portionDescription: '180g fish steak, 1 bowl fish curry gravy (150ml), 1 cup cooked red matta rice (150g)',
    estimatedCostInr: 135,
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80',
    ingredients: [
      { name: 'Fresh Surmai (Kingfish) or Basa Fillet', amount: '180g', category: 'protein', approxCostInr: 95, isVegetarian: false, isVegan: false, allergens: ['fish'] },
      { name: 'Kerala Red Matta Rice', amount: '60g raw (150g cooked)', category: 'grains', approxCostInr: 15, isVegetarian: true, isVegan: true, allergens: [] },
      { name: 'Light Coconut Milk & Kokum Petals', amount: '60ml', category: 'produce', approxCostInr: 18, isVegetarian: true, isVegan: true, allergens: [] },
      { name: 'Curry Leaves, Green Chillies & Fenugreek', amount: '20g', category: 'spices_pantry', approxCostInr: 7, isVegetarian: true, isVegan: true, allergens: [] }
    ],
    prepInstructions: [
      'Soak kokum petals in warm water. Marinate fish with turmeric, salt, and chili powder.',
      'Sauté fenugreek seeds, curry leaves, ginger, and green chilies in a clay pot.',
      'Add light coconut milk, kokum extract, and simmer gently.',
      'Slide fish pieces into simmering gravy; cook on low heat for 7-8 minutes. Serve over hot red rice.'
    ],
    substitutions: [
      'Paneer or tofu can be simmered in the same tangy kokum coconut gravy for vegetarians'
    ]
  },

  // ==================== PRE-WORKOUT ====================
  {
    id: 'pre-01',
    slot: 'pre_workout',
    name: 'Mysuru Banana & Black Coffee Energy Fuel',
    timeHint: '45-60 min before workout',
    description: 'Fast-digesting natural fruit sugars paired with pure roasted Mysore filter coffee for neuromuscular alertness and sustained glycogen delivery.',
    dietaryPreference: 'vegan',
    allergens: [],
    calories: 160,
    proteinGrams: 2,
    carbsGrams: 38,
    fatGrams: 0.5,
    fiberGrams: 4,
    prepTimeMinutes: 3,
    portionDescription: '1 large robusta/yelakki banana (130g), 1 cup black unsweetened coffee (180ml)',
    estimatedCostInr: 15,
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    ingredients: [
      { name: 'Fresh Mysuru Yelakki / Robusta Banana', amount: '1 large (130g)', category: 'produce', approxCostInr: 10, isVegetarian: true, isVegan: true, allergens: [] },
      { name: 'Unsweetened Black Filter Coffee', amount: '180ml', category: 'spices_pantry', approxCostInr: 5, isVegetarian: true, isVegan: true, allergens: [] }
    ],
    prepInstructions: [
      'Brew fresh dark roast coffee without dairy milk or added refined sugars.',
      'Peel and eat ripe banana 45 minutes prior to gym training session.'
    ],
    substitutions: [
      '2 Medjool dates (45g) instead of banana',
      'Matcha or green tea for users sensitive to dark roast coffee'
    ]
  },
  {
    id: 'pre-02',
    slot: 'pre_workout',
    name: 'Rice Cakes with Peanut / Almond Butter & Honey',
    timeHint: '45 min before workout',
    description: 'Crisp puffed brown rice cakes spread with wholesome single-ingredient nut butter and a touch of wild forest honey.',
    dietaryPreference: 'vegetarian',
    allergens: ['peanuts'],
    calories: 210,
    proteinGrams: 7,
    carbsGrams: 29,
    fatGrams: 8,
    fiberGrams: 3,
    prepTimeMinutes: 2,
    portionDescription: '2 brown rice cakes (20g), 1 tbsp peanut butter (16g), 1 tsp honey',
    estimatedCostInr: 30,
    imageUrl: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=600&q=80',
    ingredients: [
      { name: 'Puffed Brown Rice Cakes', amount: '2 cakes (20g)', category: 'grains', approxCostInr: 14, isVegetarian: true, isVegan: true, allergens: [] },
      { name: '100% Roasted Peanut Butter (Unsweetened)', amount: '16g', category: 'fats', approxCostInr: 12, isVegetarian: true, isVegan: true, allergens: ['peanuts'] },
      { name: 'Wild Forest Honey', amount: '1 tsp (7g)', category: 'spices_pantry', approxCostInr: 4, isVegetarian: true, isVegan: false, allergens: [] }
    ],
    prepInstructions: [
      'Spread peanut butter evenly across puffed rice cakes.',
      'Drizzle pure honey and consume 45 minutes prior to resistance training.'
    ],
    substitutions: [
      'Sunflower seed butter or tahini for peanut and tree-nut allergies',
      'Maple syrup or date syrup for vegan profile'
    ]
  },

  // ==================== POST-WORKOUT ====================
  {
    id: 'post-01',
    slot: 'post_workout',
    name: 'Whey Isolate Protein Shake with Tender Coconut Water',
    timeHint: 'Within 45 min post-workout',
    description: 'Ultra-filtered cold-pressed whey isolate blended into natural electrolyte-rich fresh tender coconut water for immediate muscle protein synthesis and glycogen rehydration.',
    dietaryPreference: 'vegetarian',
    allergens: ['dairy_lactose'],
    calories: 210,
    proteinGrams: 28,
    carbsGrams: 18,
    fatGrams: 1,
    fiberGrams: 1,
    prepTimeMinutes: 3,
    portionDescription: '1 scoop whey isolate (32g), 250ml fresh tender coconut water',
    estimatedCostInr: 85,
    imageUrl: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=80',
    ingredients: [
      { name: 'Whey Protein Isolate (Unflavored or Vanilla)', amount: '1 scoop (32g)', category: 'protein', approxCostInr: 60, isVegetarian: true, isVegan: false, allergens: ['dairy_lactose'] },
      { name: 'Fresh Tender Coconut Water', amount: '250ml', category: 'produce', approxCostInr: 25, isVegetarian: true, isVegan: true, allergens: [] }
    ],
    prepInstructions: [
      'Pour fresh coconut water into shaker bottle.',
      'Add 1 rounded scoop of whey isolate.',
      'Shake vigorously for 20 seconds and drink chilled immediately after training.'
    ],
    substitutions: [
      'Fermented Pea & Brown Rice Protein (Plant Protein) for vegan / dairy-free athletes'
    ]
  },
  {
    id: 'post-02',
    slot: 'post_workout',
    name: '4 Boiled Egg Whites & Sweet Potato Chaat',
    timeHint: 'Within 45 min post-workout',
    description: 'Steamed yellow sweet potato cubes tossed with pink salt and roasted cumin, paired with 4 hard-boiled egg whites for pure natural protein.',
    dietaryPreference: 'eggetarian',
    allergens: ['eggs'],
    calories: 250,
    proteinGrams: 20,
    carbsGrams: 36,
    fatGrams: 1,
    fiberGrams: 5,
    prepTimeMinutes: 10,
    portionDescription: '4 boiled egg whites, 150g roasted/steamed sweet potato',
    estimatedCostInr: 40,
    imageUrl: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80',
    ingredients: [
      { name: 'Farm Egg Whites', amount: '4 whites', category: 'protein', approxCostInr: 28, isVegetarian: false, isVegan: false, allergens: ['eggs'] },
      { name: 'Steamed Sweet Potato (Rattallu)', amount: '150g', category: 'grains', approxCostInr: 10, isVegetarian: true, isVegan: true, allergens: [] },
      { name: 'Chaat Masala & Lime Juice', amount: '5g', category: 'spices_pantry', approxCostInr: 2, isVegetarian: true, isVegan: true, allergens: [] }
    ],
    prepInstructions: [
      'Peel and dice boiled sweet potato into bite-sized cubes.',
      'Toss with lime juice, black salt, and coriander.',
      'Slice boiled egg whites and sprinkle with a dash of cracked black pepper.'
    ],
    substitutions: [
      'Boiled chickpeas (120g) or tofu slabs (100g) for vegetarian/vegan post-workout'
    ]
  },

  // ==================== EVENING SNACK ====================
  {
    id: 'ev-01',
    slot: 'evening_snack',
    name: 'Roasted Masala Makhana (Foxnuts) with Green Tea',
    timeHint: '05:00 PM - 05:45 PM',
    description: 'Crispy popped lotus seeds dry-roasted with a drop of ghee, turmeric, and pink Himalayan rock salt, accompanied by antioxidant green tea.',
    dietaryPreference: 'vegetarian',
    allergens: ['dairy_lactose'],
    calories: 170,
    proteinGrams: 6,
    carbsGrams: 26,
    fatGrams: 4,
    fiberGrams: 4,
    prepTimeMinutes: 6,
    portionDescription: '1 medium bowl makhana (35g), 1 cup green tea (200ml)',
    estimatedCostInr: 30,
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
    ingredients: [
      { name: 'Foxnuts / Phool Makhana', amount: '35g', category: 'grains', approxCostInr: 22, isVegetarian: true, isVegan: true, allergens: [] },
      { name: 'Cow Ghee / Cold Pressed Coconut Oil', amount: '1/2 tsp (2.5g)', category: 'fats', approxCostInr: 4, isVegetarian: true, isVegan: false, allergens: ['dairy_lactose'] },
      { name: 'Green Tea Leaves / Bag', amount: '1 bag', category: 'spices_pantry', approxCostInr: 4, isVegetarian: true, isVegan: true, allergens: [] }
    ],
    prepInstructions: [
      'Heat ghee or coconut oil in a kadai on low heat.',
      'Add makhana and slow roast for 4-5 minutes until ultra-crunchy.',
      'Dust with turmeric, black pepper, and rock salt.',
      'Brew loose leaf green tea for 3 minutes without sugar.'
    ],
    substitutions: [
      'Use pure virgin coconut oil for 100% vegan roasted makhana',
      'Roasted chana (Bengal gram) if makhana is unavailable'
    ]
  },
  {
    id: 'ev-02',
    slot: 'evening_snack',
    name: 'Boiled Kala Chana Sundal with Fresh Coconut Gratings',
    timeHint: '05:00 PM - 05:45 PM',
    description: 'Karnataka temple-style tempered brown chickpeas tossed with mustard seeds, curry leaves, hing, green chili, and fresh coconut.',
    dietaryPreference: 'vegan',
    allergens: ['mustard'],
    calories: 210,
    proteinGrams: 10,
    carbsGrams: 32,
    fatGrams: 4.5,
    fiberGrams: 8,
    prepTimeMinutes: 10,
    portionDescription: '1 katori sundal (150g)',
    estimatedCostInr: 25,
    imageUrl: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=600&q=80',
    ingredients: [
      { name: 'Boiled Desi Kala Chana', amount: '120g', category: 'protein', approxCostInr: 15, isVegetarian: true, isVegan: true, allergens: [] },
      { name: 'Grated Fresh Coconut', amount: '1.5 tbsp (15g)', category: 'produce', approxCostInr: 6, isVegetarian: true, isVegan: true, allergens: [] },
      { name: 'Mustard Seeds, Hing, Curry Leaves', amount: '5g', category: 'spices_pantry', approxCostInr: 4, isVegetarian: true, isVegan: true, allergens: ['mustard'] }
    ],
    prepInstructions: [
      'Heat 1/2 tsp oil, crackle mustard seeds, urad dal, curry leaves, and green chillies.',
      'Add cooked soft kala chana and salt. Toss on high flame for 2 minutes.',
      'Turn off heat and fold in fresh grated coconut.'
    ],
    substitutions: [
      'Omit mustard seeds for mustard-allergy compatibility'
    ]
  },

  // ==================== DINNER ====================
  {
    id: 'di-01',
    slot: 'dinner',
    name: 'Tawa Grilled Tofu & Vegetable Stir-Fry with Quinoa',
    timeHint: '08:00 PM - 09:00 PM',
    description: 'Cubed firm organic tofu seared with colorful bell peppers, zucchini, and mushrooms, seasoned with sesame-ginger soy glaze and fluffy tri-color quinoa.',
    dietaryPreference: 'vegan',
    allergens: ['soy', 'sesame'],
    calories: 460,
    proteinGrams: 32,
    carbsGrams: 48,
    fatGrams: 15,
    fiberGrams: 9,
    prepTimeMinutes: 20,
    portionDescription: '160g tofu stir-fry, 1 cup cooked quinoa (130g)',
    estimatedCostInr: 90,
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
    ingredients: [
      { name: 'Firm Organic Tofu', amount: '160g', category: 'protein', approxCostInr: 50, isVegetarian: true, isVegan: true, allergens: ['soy'] },
      { name: 'Tri-color Quinoa (Cooked)', amount: '130g', category: 'grains', approxCostInr: 22, isVegetarian: true, isVegan: true, allergens: [] },
      { name: 'Bell Peppers, Zucchini & Button Mushrooms', amount: '140g', category: 'produce', approxCostInr: 14, isVegetarian: true, isVegan: true, allergens: [] },
      { name: 'Toasted Sesame Oil & Tamari/Soy Sauce', amount: '1 tsp', category: 'fats', approxCostInr: 4, isVegetarian: true, isVegan: true, allergens: ['soy', 'sesame'] }
    ],
    prepInstructions: [
      'Press moisture from tofu block with a clean kitchen towel, cube into 1-inch squares.',
      'Sear tofu cubes on hot cast iron until golden on all sides.',
      'Toss in sliced bell peppers, zucchini, and mushrooms on high flame for 3 minutes.',
      'Deglaze with low-sodium tamari, grated ginger, and serve alongside warm fluffy quinoa.'
    ],
    substitutions: [
      'Low-fat paneer (150g) for vegetarian profile without soy',
      'Brown rice or ragi mudde as an affordable, local grain substitute'
    ]
  },
  {
    id: 'di-02',
    slot: 'dinner',
    name: 'Slow-Simmered Yellow Moong Dal with Jowar Roti & Bhindi Sabzi',
    timeHint: '08:00 PM - 09:00 PM',
    description: 'Comforting Mysore-style split yellow moong dal tempered with cumin and garlic, served with 2 handmade gluten-free jowar (sorghum) rotis and dry spiced okra.',
    dietaryPreference: 'vegan',
    allergens: [],
    calories: 440,
    proteinGrams: 22,
    carbsGrams: 68,
    fatGrams: 8,
    fiberGrams: 12,
    prepTimeMinutes: 22,
    portionDescription: '1 large bowl dal (200ml), 2 jowar rotis (70g), 1 katori bhindi sabzi (100g)',
    estimatedCostInr: 50,
    imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
    ingredients: [
      { name: 'Split Yellow Moong Dal', amount: '60g raw', category: 'protein', approxCostInr: 16, isVegetarian: true, isVegan: true, allergens: [] },
      { name: 'Jowar (Sorghum) Flour', amount: '60g', category: 'grains', approxCostInr: 12, isVegetarian: true, isVegan: true, allergens: [] },
      { name: 'Fresh Bhindi (Okra) & Spices', amount: '100g', category: 'produce', approxCostInr: 16, isVegetarian: true, isVegan: true, allergens: [] },
      { name: 'Cold-pressed Sesame or Peanut Oil', amount: '1 tsp', category: 'fats', approxCostInr: 6, isVegetarian: true, isVegan: true, allergens: [] }
    ],
    prepInstructions: [
      'Pressure cook moong dal with turmeric and green chilies. Temper with garlic and cumin in 1 tsp oil.',
      'Sauté sliced okra with amchur (dry mango powder), coriander, and chili until tender and non-sticky.',
      'Knead jowar flour with warm water and pat out rotis by hand. Cook on a hot tawa with a splash of water.'
    ],
    substitutions: [
      'Ragi roti or whole wheat phulka if jowar is not preferred'
    ]
  },
  {
    id: 'di-03',
    slot: 'dinner',
    name: 'Pan-Seared White Fish / Salmon with Roasted Sweet Potatoes & Asparagus',
    timeHint: '08:00 PM - 09:00 PM',
    description: 'Flaky omega-3 rich fish fillet pan-seared with lemon, rosemary, garlic, accompanied by caramelized sweet potato wedges and grilled asparagus spears.',
    dietaryPreference: 'pescatarian',
    allergens: ['fish'],
    calories: 520,
    proteinGrams: 42,
    carbsGrams: 44,
    fatGrams: 16,
    fiberGrams: 7,
    prepTimeMinutes: 20,
    portionDescription: '170g fish fillet, 140g roasted sweet potato, 80g asparagus/green beans',
    estimatedCostInr: 140,
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80',
    ingredients: [
      { name: 'Fresh Basa, Rohu or Salmon Fillet', amount: '170g', category: 'protein', approxCostInr: 90, isVegetarian: false, isVegan: false, allergens: ['fish'] },
      { name: 'Sweet Potato Wedges', amount: '140g', category: 'grains', approxCostInr: 12, isVegetarian: true, isVegan: true, allergens: [] },
      { name: 'Asparagus or French Green Beans', amount: '80g', category: 'produce', approxCostInr: 25, isVegetarian: true, isVegan: true, allergens: [] },
      { name: 'Extra Virgin Olive Oil', amount: '1 tbsp (12ml)', category: 'fats', approxCostInr: 13, isVegetarian: true, isVegan: true, allergens: [] }
    ],
    prepInstructions: [
      'Toss sweet potato wedges with half olive oil, salt, and smoked paprika. Air fry or roast at 200°C for 18 mins.',
      'Heat remaining olive oil in skillet. Place seasoned fish skin-side down; sear for 4 minutes, flip and cook 3 minutes.',
      'Sauté beans/asparagus in the pan juices with a squeeze of fresh lemon.'
    ],
    substitutions: [
      'Grilled chicken breast (160g) for non-vegetarian preferences',
      'Grilled low-fat paneer steak (150g) for vegetarians'
    ]
  },
  {
    id: 'di-04',
    slot: 'dinner',
    name: 'Slow-Cooked Chicken Methi Masala with Hand-Rolled Ragi Rotis',
    timeHint: '08:00 PM - 09:00 PM',
    description: 'Tender chicken breast chunks cooked with iron-rich fresh fenugreek (methi) leaves, onion-tomato masala, and served with 2 calcium-packed Karnataka ragi rotis.',
    dietaryPreference: 'non_vegetarian',
    allergens: [],
    calories: 540,
    proteinGrams: 46,
    carbsGrams: 52,
    fatGrams: 14,
    fiberGrams: 10,
    prepTimeMinutes: 25,
    portionDescription: '1.5 cups chicken methi curry (220g), 2 ragi rotis (80g)',
    estimatedCostInr: 115,
    imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80',
    ingredients: [
      { name: 'Skinless Chicken Breast Fillet', amount: '160g', category: 'protein', approxCostInr: 70, isVegetarian: false, isVegan: false, allergens: [] },
      { name: 'Fresh Methi (Fenugreek) Leaves & Onions', amount: '120g', category: 'produce', approxCostInr: 15, isVegetarian: true, isVegan: true, allergens: [] },
      { name: 'Ragi (Finger Millet) Flour', amount: '65g', category: 'grains', approxCostInr: 12, isVegetarian: true, isVegan: true, allergens: [] },
      { name: 'Cold-pressed Groundnut or Olive Oil', amount: '1.5 tsp', category: 'fats', approxCostInr: 8, isVegetarian: true, isVegan: true, allergens: [] }
    ],
    prepInstructions: [
      'Sauté chopped methi leaves until wilted to remove bitterness. Add onions, ginger-garlic, tomatoes, and spices.',
      'Add cubed chicken breast and simmer covered for 12 minutes until succulent.',
      'Mix ragi flour with boiling water, knead smooth dough, and flatten into soft rotis.',
      'Serve warm with a squeeze of lemon.'
    ],
    substitutions: [
      'Replace chicken with 150g firm paneer or soya chunks for vegetarian/vegan adaptation'
    ]
  }
];
