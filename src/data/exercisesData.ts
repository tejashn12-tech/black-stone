import { Exercise } from '../types';

export interface TargetMuscleGroup {
  id: string;
  name: string;
  count: number;
  category: string;
  description?: string;
}

export const TARGET_MUSCLE_GROUPS: TargetMuscleGroup[] = [
  { id: 'all', name: 'All Muscle Groups', count: 1000, category: 'All' },
  { id: 'chest', name: 'Chest (Pectorals)', count: 0, category: 'Upper Body', description: 'Upper, mid, and lower pectoral development' },
  { id: 'back', name: 'Back & Lats', count: 0, category: 'Upper Body', description: 'Latissimus dorsi, rhomboids, upper back and traps' },
  { id: 'shoulders', name: 'Shoulders (Delts)', count: 0, category: 'Upper Body', description: 'Anterior, lateral, and posterior deltoids' },
  { id: 'biceps', name: 'Biceps', count: 0, category: 'Arms', description: 'Short and long heads of biceps, brachialis' },
  { id: 'triceps', name: 'Triceps', count: 0, category: 'Arms', description: 'Lateral, long, and medial triceps heads' },
  { id: 'forearms', name: 'Forearms & Grip', count: 0, category: 'Arms', description: 'Flexor and extensor wrist muscle groups' },
  { id: 'quads', name: 'Quadriceps', count: 0, category: 'Legs', description: 'Rectus femoris, vastus lateralis, vastus medialis' },
  { id: 'hamstrings', name: 'Hamstrings', count: 0, category: 'Legs', description: 'Biceps femoris, semitendinosus, posterior chain' },
  { id: 'glutes', name: 'Glutes', count: 0, category: 'Legs', description: 'Gluteus maximus, medius, and hip abduction' },
  { id: 'calves', name: 'Calves', count: 0, category: 'Legs', description: 'Gastrocnemius and soleus development' },
  { id: 'abs', name: 'Abs & Core', count: 0, category: 'Core', description: 'Rectus abdominis, obliques, and transverse core' },
  { id: 'lower_back', name: 'Lower Back', count: 0, category: 'Back', description: 'Erector spinae and posterior structural support' },
  { id: 'full_body', name: 'Full Body & Cardio', count: 0, category: 'Cardio', description: 'Compound kinetic chains and conditioning' }
];

export const EXERCISE_CATEGORIES = [
  { id: 'all', label: 'All Categories', count: 1000 },
  { id: 'chest', label: 'Chest', count: 0 },
  { id: 'back', label: 'Back', count: 0 },
  { id: 'shoulders', label: 'Shoulders', count: 0 },
  { id: 'biceps', label: 'Biceps', count: 0 },
  { id: 'triceps', label: 'Triceps', count: 0 },
  { id: 'forearms', label: 'Forearms', count: 0 },
  { id: 'quads', label: 'Quadriceps', count: 0 },
  { id: 'hamstrings', label: 'Hamstrings', count: 0 },
  { id: 'glutes', label: 'Glutes', count: 0 },
  { id: 'calves', label: 'Calves', count: 0 },
  { id: 'abs', label: 'Abs & Core', count: 0 },
  { id: 'lower_back', label: 'Lower Back', count: 0 },
  { id: 'full_body', label: 'Full Body & Cardio', count: 0 }
];

export const INITIAL_EXERCISES: Exercise[] = [
  {
    "id": "EX-0001",
    "name": "Neck Side Stretch",
    "category": "shoulders",
    "categoryDisplay": "Shoulder Delts",
    "targetMuscle": "Shoulders",
    "targetMuscleKey": "shoulders",
    "targetMuscles": [
      "Levator Scapulae",
      "Upper Trapezius"
    ],
    "secondaryMuscles": [
      "Neck Stabilizers",
      "Rhomboids"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your shoulders.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your shoulders vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the shoulders throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the shoulders."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/levator-scapulae/neck-side-stretch.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/levator-scapulae/neck-side-stretch.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/levator-scapulae/neck-side-stretch.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0002",
    "name": "Side Push Neck Stretch",
    "category": "shoulders",
    "categoryDisplay": "Shoulder Delts",
    "targetMuscle": "Shoulders",
    "targetMuscleKey": "shoulders",
    "targetMuscles": [
      "Levator Scapulae",
      "Upper Trapezius"
    ],
    "secondaryMuscles": [
      "Neck Stabilizers",
      "Rhomboids"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your shoulders.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your shoulders vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the shoulders throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the shoulders."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/levator-scapulae/side-push-neck-stretch.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/levator-scapulae/side-push-neck-stretch.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/levator-scapulae/side-push-neck-stretch.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0003",
    "name": "Lever Seated Hip Abduction",
    "category": "glutes",
    "categoryDisplay": "Glutes & Hip Drive",
    "targetMuscle": "Glutes",
    "targetMuscleKey": "glutes",
    "targetMuscles": [
      "Gluteus Medius",
      "Tensor Fasciae Latae"
    ],
    "secondaryMuscles": [
      "Gluteus Maximus",
      "Core",
      "Hips"
    ],
    "difficulty": "Beginner",
    "equipment": "Machine",
    "instructions": [
      "Set up in a solid, stable base position utilizing machine. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your glutes.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your glutes vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the glutes throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the glutes."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/abductors/lever-seated-hip-abduction.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/abductors/lever-seated-hip-abduction.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/abductors/lever-seated-hip-abduction.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0004",
    "name": "Resistance Band Seated Hip Abduction",
    "category": "glutes",
    "categoryDisplay": "Glutes & Hip Drive",
    "targetMuscle": "Glutes",
    "targetMuscleKey": "glutes",
    "targetMuscles": [
      "Gluteus Medius",
      "Tensor Fasciae Latae"
    ],
    "secondaryMuscles": [
      "Gluteus Maximus",
      "Core",
      "Hips"
    ],
    "difficulty": "Beginner",
    "equipment": "Resistance Band",
    "instructions": [
      "Set up in a solid, stable base position utilizing resistance band. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your glutes.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your glutes vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the glutes throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the glutes."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/abductors/resistance-band-seated-hip-abduction.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/abductors/resistance-band-seated-hip-abduction.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/abductors/resistance-band-seated-hip-abduction.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0005",
    "name": "Side Bridge Hip Abduction",
    "category": "glutes",
    "categoryDisplay": "Glutes & Hip Drive",
    "targetMuscle": "Glutes",
    "targetMuscleKey": "glutes",
    "targetMuscles": [
      "Gluteus Medius",
      "Tensor Fasciae Latae"
    ],
    "secondaryMuscles": [
      "Gluteus Maximus",
      "Core",
      "Hips"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your glutes.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your glutes vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the glutes throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the glutes."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/abductors/side-bridge-hip-abduction.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/abductors/side-bridge-hip-abduction.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/abductors/side-bridge-hip-abduction.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0006",
    "name": "Side Hip Abduction",
    "category": "glutes",
    "categoryDisplay": "Glutes & Hip Drive",
    "targetMuscle": "Glutes",
    "targetMuscleKey": "glutes",
    "targetMuscles": [
      "Gluteus Medius",
      "Tensor Fasciae Latae"
    ],
    "secondaryMuscles": [
      "Gluteus Maximus",
      "Core",
      "Hips"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your glutes.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your glutes vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the glutes throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the glutes."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/abductors/side-hip-abduction.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/abductors/side-hip-abduction.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/abductors/side-hip-abduction.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0007",
    "name": "Barbell Incline Shoulder Raise",
    "category": "chest",
    "categoryDisplay": "Chest Strength",
    "targetMuscle": "Chest",
    "targetMuscleKey": "chest",
    "targetMuscles": [
      "Serratus Anterior",
      "Intercostals"
    ],
    "secondaryMuscles": [
      "Rectus Abdominis",
      "Obliques",
      "Pectorals"
    ],
    "difficulty": "Intermediate",
    "equipment": "Barbell",
    "instructions": [
      "Lie back on an Incline Bench. Using a medium width grip (a grip that is slightly wider than shoulder width), lift the bar from the rack and hold it straight over you with your arms straight. This will be your starting position.",
      "While keeping the arms straight, lift the bar by protracting your shoulder blades, raising the shoulders from the bench as you breathe out.",
      "Bring back the bar to the starting position as you breathe in.",
      "Repeat for the recommended amount of repetitions."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the chest throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the chest."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/serratus-anterior/barbell-incline-shoulder-raise.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/serratus-anterior/barbell-incline-shoulder-raise.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/serratus-anterior/barbell-incline-shoulder-raise.gif",
    "caloriesBurnEstimatePerHour": 390
  },
  {
    "id": "EX-0008",
    "name": "Dumbbell Incline Shoulder Raise",
    "category": "chest",
    "categoryDisplay": "Chest Strength",
    "targetMuscle": "Chest",
    "targetMuscleKey": "chest",
    "targetMuscles": [
      "Serratus Anterior",
      "Intercostals"
    ],
    "secondaryMuscles": [
      "Rectus Abdominis",
      "Obliques",
      "Pectorals"
    ],
    "difficulty": "Intermediate",
    "equipment": "Dumbbell",
    "instructions": [
      "Sit on an Incline Bench while holding a dumbbell on each hand on top of your thighs.",
      "Lift your legs up to kick the weights to your shoulders and lean back. Position the dumbbells above your shoulders with your arms extended. The arms should be perpendicular to the floor with your palms facing forward and knuckles pointing towards the ceiling. This will be your starting position.",
      "While keeping the arms straight and locked, lift the dumbbells by raising the shoulders from the bench as you breathe out.",
      "Bring back the dumbbells to the starting position as you breathe in.",
      "Repeat for the recommended amount of repetitions."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the chest throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the chest."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/serratus-anterior/dumbbell-incline-shoulder-raise.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/serratus-anterior/dumbbell-incline-shoulder-raise.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/serratus-anterior/dumbbell-incline-shoulder-raise.gif",
    "caloriesBurnEstimatePerHour": 390
  },
  {
    "id": "EX-0009",
    "name": "Incline Scapula Push Up",
    "category": "chest",
    "categoryDisplay": "Chest Strength",
    "targetMuscle": "Chest",
    "targetMuscleKey": "chest",
    "targetMuscles": [
      "Serratus Anterior",
      "Intercostals"
    ],
    "secondaryMuscles": [
      "Rectus Abdominis",
      "Obliques",
      "Pectorals"
    ],
    "difficulty": "Intermediate",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your chest.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your chest vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the chest throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the chest."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/serratus-anterior/incline-scapula-push-up.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/serratus-anterior/incline-scapula-push-up.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/serratus-anterior/incline-scapula-push-up.gif",
    "caloriesBurnEstimatePerHour": 390
  },
  {
    "id": "EX-0010",
    "name": "Scapula Push Up",
    "category": "chest",
    "categoryDisplay": "Chest Strength",
    "targetMuscle": "Chest",
    "targetMuscleKey": "chest",
    "targetMuscles": [
      "Serratus Anterior",
      "Intercostals"
    ],
    "secondaryMuscles": [
      "Rectus Abdominis",
      "Obliques",
      "Pectorals"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your chest.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your chest vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the chest throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the chest."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/serratus-anterior/scapula-push-up.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/serratus-anterior/scapula-push-up.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/serratus-anterior/scapula-push-up.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0011",
    "name": "Assisted Side Lying Adductor Stretch",
    "category": "quads",
    "categoryDisplay": "Quadriceps Power",
    "targetMuscle": "Quadriceps",
    "targetMuscleKey": "quads",
    "targetMuscles": [
      "Adductor Longus",
      "Gracilis",
      "Inner Thighs"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Hamstrings",
      "Core"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your quadriceps.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your quadriceps vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the quadriceps throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the quadriceps."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/adductors/assisted-side-lying-adductor-stretch.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/adductors/assisted-side-lying-adductor-stretch.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/adductors/assisted-side-lying-adductor-stretch.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0012",
    "name": "Butterfly Yoga Pose",
    "category": "quads",
    "categoryDisplay": "Quadriceps Power",
    "targetMuscle": "Quadriceps",
    "targetMuscleKey": "quads",
    "targetMuscles": [
      "Adductor Longus",
      "Gracilis",
      "Inner Thighs"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Hamstrings",
      "Core"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your quadriceps.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your quadriceps vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the quadriceps throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the quadriceps."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/adductors/butterfly-yoga-pose.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/adductors/butterfly-yoga-pose.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/adductors/butterfly-yoga-pose.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0013",
    "name": "Cable Hip Adduction",
    "category": "quads",
    "categoryDisplay": "Quadriceps Power",
    "targetMuscle": "Quadriceps",
    "targetMuscleKey": "quads",
    "targetMuscles": [
      "Adductor Longus",
      "Gracilis",
      "Inner Thighs"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Hamstrings",
      "Core"
    ],
    "difficulty": "Intermediate",
    "equipment": "Cable",
    "instructions": [
      "Stand in front of a low pulley facing forward with one leg next to the pulley and the other one away.",
      "Attach the ankle cuff to the cable and also to the ankle of the leg that is next to the pulley.",
      "Now step out and away from the stack with a wide stance and grasp the bar of the pulley system.",
      "Stand on the foot that does not have the ankle cuff (the far foot) and allow the leg with the cuff to be pulled towards the low pulley. This will be your starting position.",
      "Now perform the movement by moving the leg with the ankle cuff in front of the far leg by using the inner thighs to abduct the hip. Breathe out during this portion of the movement.",
      "Slowly return to the starting position as you breathe in.",
      "Repeat for the recommended amount of repetitions and then repeat the same movement with the opposite leg."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the quadriceps throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the quadriceps."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/adductors/cable-hip-adduction.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/adductors/cable-hip-adduction.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/adductors/cable-hip-adduction.gif",
    "caloriesBurnEstimatePerHour": 390
  },
  {
    "id": "EX-0014",
    "name": "Lever Seated Hip Adduction",
    "category": "quads",
    "categoryDisplay": "Quadriceps Power",
    "targetMuscle": "Quadriceps",
    "targetMuscleKey": "quads",
    "targetMuscles": [
      "Adductor Longus",
      "Gracilis",
      "Inner Thighs"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Hamstrings",
      "Core"
    ],
    "difficulty": "Beginner",
    "equipment": "Machine",
    "instructions": [
      "Set up in a solid, stable base position utilizing machine. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your quadriceps.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your quadriceps vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the quadriceps throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the quadriceps."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/adductors/lever-seated-hip-adduction.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/adductors/lever-seated-hip-adduction.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/adductors/lever-seated-hip-adduction.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0015",
    "name": "Side Lying Hip Adduction Male",
    "category": "quads",
    "categoryDisplay": "Quadriceps Power",
    "targetMuscle": "Quadriceps",
    "targetMuscleKey": "quads",
    "targetMuscles": [
      "Adductor Longus",
      "Gracilis",
      "Inner Thighs"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Hamstrings",
      "Core"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your quadriceps.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your quadriceps vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the quadriceps throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the quadriceps."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/adductors/side-lying-hip-adduction-male.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/adductors/side-lying-hip-adduction-male.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/adductors/side-lying-hip-adduction-male.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0016",
    "name": "Band Shrug",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Upper Trapezius",
      "Levator Scapulae"
    ],
    "secondaryMuscles": [
      "Forearms",
      "Upper Back",
      "Neck"
    ],
    "difficulty": "Beginner",
    "equipment": "Resistance Band",
    "instructions": [
      "Set up in a solid, stable base position utilizing resistance band. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/traps/band-shrug.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/traps/band-shrug.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/traps/band-shrug.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0017",
    "name": "Barbell Shrug",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Upper Trapezius",
      "Levator Scapulae"
    ],
    "secondaryMuscles": [
      "Forearms",
      "Upper Back",
      "Neck"
    ],
    "difficulty": "Intermediate",
    "equipment": "Barbell",
    "instructions": [
      "Stand up straight with your feet at shoulder width as you hold a barbell with both hands in front of you using a pronated grip (palms facing the thighs). Tip: Your hands should be a little wider than shoulder width apart. You can use wrist wraps for this exercise for a better grip. This will be your starting position.",
      "Raise your shoulders up as far as you can go as you breathe out and hold the contraction for a second. Tip: Refrain from trying to lift the barbell by using your biceps.",
      "Slowly return to the starting position as you breathe in.",
      "Repeat for the recommended amount of repetitions."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/traps/barbell-shrug.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/traps/barbell-shrug.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/traps/barbell-shrug.gif",
    "caloriesBurnEstimatePerHour": 390
  },
  {
    "id": "EX-0018",
    "name": "Cable Shrug",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Upper Trapezius",
      "Levator Scapulae"
    ],
    "secondaryMuscles": [
      "Forearms",
      "Upper Back",
      "Neck"
    ],
    "difficulty": "Intermediate",
    "equipment": "Cable",
    "instructions": [
      "Set up in a solid, stable base position utilizing cable. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/traps/cable-shrug.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/traps/cable-shrug.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/traps/cable-shrug.gif",
    "caloriesBurnEstimatePerHour": 390
  },
  {
    "id": "EX-0019",
    "name": "Dumbbell Decline Shrug V 2",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Upper Trapezius",
      "Levator Scapulae"
    ],
    "secondaryMuscles": [
      "Forearms",
      "Upper Back",
      "Neck"
    ],
    "difficulty": "Intermediate",
    "equipment": "Dumbbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing dumbbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/traps/dumbbell-decline-shrug-v-2.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/traps/dumbbell-decline-shrug-v-2.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/traps/dumbbell-decline-shrug-v-2.gif",
    "caloriesBurnEstimatePerHour": 390
  },
  {
    "id": "EX-0020",
    "name": "Dumbbell Decline Shrug",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Upper Trapezius",
      "Levator Scapulae"
    ],
    "secondaryMuscles": [
      "Forearms",
      "Upper Back",
      "Neck"
    ],
    "difficulty": "Intermediate",
    "equipment": "Dumbbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing dumbbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/traps/dumbbell-decline-shrug.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/traps/dumbbell-decline-shrug.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/traps/dumbbell-decline-shrug.gif",
    "caloriesBurnEstimatePerHour": 390
  },
  {
    "id": "EX-0021",
    "name": "Dumbbell Incline Shrug",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Upper Trapezius",
      "Levator Scapulae"
    ],
    "secondaryMuscles": [
      "Forearms",
      "Upper Back",
      "Neck"
    ],
    "difficulty": "Intermediate",
    "equipment": "Dumbbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing dumbbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/traps/dumbbell-incline-shrug.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/traps/dumbbell-incline-shrug.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/traps/dumbbell-incline-shrug.gif",
    "caloriesBurnEstimatePerHour": 390
  },
  {
    "id": "EX-0022",
    "name": "Dumbbell Shrug",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Upper Trapezius",
      "Levator Scapulae"
    ],
    "secondaryMuscles": [
      "Forearms",
      "Upper Back",
      "Neck"
    ],
    "difficulty": "Intermediate",
    "equipment": "Dumbbell",
    "instructions": [
      "Stand erect with a dumbbell on each hand (palms facing your torso), arms extended on the sides.",
      "Lift the dumbbells by elevating the shoulders as high as possible while you exhale. Hold the contraction at the top for a second. Tip: The arms should remain extended at all times. Refrain from using the biceps to help lift the dumbbells. Only the shoulders should be moving up and down.",
      "Lower the dumbbells back to the original position.",
      "Repeat for the recommended amount of repetitions."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/traps/dumbbell-shrug.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/traps/dumbbell-shrug.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/traps/dumbbell-shrug.gif",
    "caloriesBurnEstimatePerHour": 390
  },
  {
    "id": "EX-0023",
    "name": "Kettlebell Sumo High Pull",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Upper Trapezius",
      "Levator Scapulae"
    ],
    "secondaryMuscles": [
      "Forearms",
      "Upper Back",
      "Neck"
    ],
    "difficulty": "Intermediate",
    "equipment": "Kettlebell",
    "instructions": [
      "Set up in a solid, stable base position utilizing kettlebell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/traps/kettlebell-sumo-high-pull.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/traps/kettlebell-sumo-high-pull.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/traps/kettlebell-sumo-high-pull.gif",
    "caloriesBurnEstimatePerHour": 390
  },
  {
    "id": "EX-0024",
    "name": "Lever Gripless Shrug V 2",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Upper Trapezius",
      "Levator Scapulae"
    ],
    "secondaryMuscles": [
      "Forearms",
      "Upper Back",
      "Neck"
    ],
    "difficulty": "Beginner",
    "equipment": "Machine",
    "instructions": [
      "Set up in a solid, stable base position utilizing machine. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/traps/lever-gripless-shrug-v-2.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/traps/lever-gripless-shrug-v-2.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/traps/lever-gripless-shrug-v-2.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0025",
    "name": "Lever Gripless Shrug",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Upper Trapezius",
      "Levator Scapulae"
    ],
    "secondaryMuscles": [
      "Forearms",
      "Upper Back",
      "Neck"
    ],
    "difficulty": "Beginner",
    "equipment": "Machine",
    "instructions": [
      "Set up in a solid, stable base position utilizing machine. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/traps/lever-gripless-shrug.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/traps/lever-gripless-shrug.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/traps/lever-gripless-shrug.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0026",
    "name": "Lever Shrug",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Upper Trapezius",
      "Levator Scapulae"
    ],
    "secondaryMuscles": [
      "Forearms",
      "Upper Back",
      "Neck"
    ],
    "difficulty": "Beginner",
    "equipment": "Machine",
    "instructions": [
      "Set up in a solid, stable base position utilizing machine. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/traps/lever-shrug.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/traps/lever-shrug.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/traps/lever-shrug.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0027",
    "name": "Back Extension On Exercise Ball",
    "category": "lower_back",
    "categoryDisplay": "Lower Back & Spinal Erectors",
    "targetMuscle": "Lower Back",
    "targetMuscleKey": "lower_back",
    "targetMuscles": [
      "Erector Spinae",
      "Thoracolumbar Fascia"
    ],
    "secondaryMuscles": [
      "Gluteus Maximus",
      "Hamstrings",
      "Core"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your lower back.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your lower back vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the lower back throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the lower back."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/spine/back-extension-on-exercise-ball.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/spine/back-extension-on-exercise-ball.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/spine/back-extension-on-exercise-ball.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0028",
    "name": "Band Straight Leg Deadlift",
    "category": "lower_back",
    "categoryDisplay": "Lower Back & Spinal Erectors",
    "targetMuscle": "Lower Back",
    "targetMuscleKey": "lower_back",
    "targetMuscles": [
      "Erector Spinae",
      "Thoracolumbar Fascia"
    ],
    "secondaryMuscles": [
      "Gluteus Maximus",
      "Hamstrings",
      "Core"
    ],
    "difficulty": "Intermediate",
    "equipment": "Barbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing barbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your lower back.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your lower back vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the lower back throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the lower back."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/spine/band-straight-leg-deadlift.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/spine/band-straight-leg-deadlift.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/spine/band-straight-leg-deadlift.gif",
    "caloriesBurnEstimatePerHour": 520
  },
  {
    "id": "EX-0029",
    "name": "Exercise Ball Back Extension With Arms Extended",
    "category": "lower_back",
    "categoryDisplay": "Lower Back & Spinal Erectors",
    "targetMuscle": "Lower Back",
    "targetMuscleKey": "lower_back",
    "targetMuscles": [
      "Erector Spinae",
      "Thoracolumbar Fascia"
    ],
    "secondaryMuscles": [
      "Gluteus Maximus",
      "Hamstrings",
      "Core"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your lower back.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your lower back vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the lower back throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the lower back."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/spine/exercise-ball-back-extension-with-arms-extended.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/spine/exercise-ball-back-extension-with-arms-extended.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/spine/exercise-ball-back-extension-with-arms-extended.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0030",
    "name": "Exercise Ball Back Extension With Hands Behind Head",
    "category": "lower_back",
    "categoryDisplay": "Lower Back & Spinal Erectors",
    "targetMuscle": "Lower Back",
    "targetMuscleKey": "lower_back",
    "targetMuscles": [
      "Erector Spinae",
      "Thoracolumbar Fascia"
    ],
    "secondaryMuscles": [
      "Gluteus Maximus",
      "Hamstrings",
      "Core"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your lower back.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your lower back vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the lower back throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the lower back."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/spine/exercise-ball-back-extension-with-hands-behind-head.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/spine/exercise-ball-back-extension-with-hands-behind-head.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/spine/exercise-ball-back-extension-with-hands-behind-head.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0031",
    "name": "Exercise Ball Back Extension With Knees Off Ground",
    "category": "lower_back",
    "categoryDisplay": "Lower Back & Spinal Erectors",
    "targetMuscle": "Lower Back",
    "targetMuscleKey": "lower_back",
    "targetMuscles": [
      "Erector Spinae",
      "Thoracolumbar Fascia"
    ],
    "secondaryMuscles": [
      "Gluteus Maximus",
      "Hamstrings",
      "Core"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your lower back.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your lower back vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the lower back throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the lower back."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/spine/exercise-ball-back-extension-with-knees-off-ground.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/spine/exercise-ball-back-extension-with-knees-off-ground.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/spine/exercise-ball-back-extension-with-knees-off-ground.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0032",
    "name": "Exercise Ball Back Extension With Rotation",
    "category": "lower_back",
    "categoryDisplay": "Lower Back & Spinal Erectors",
    "targetMuscle": "Lower Back",
    "targetMuscleKey": "lower_back",
    "targetMuscles": [
      "Erector Spinae",
      "Thoracolumbar Fascia"
    ],
    "secondaryMuscles": [
      "Gluteus Maximus",
      "Hamstrings",
      "Core"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your lower back.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your lower back vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the lower back throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the lower back."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/spine/exercise-ball-back-extension-with-rotation.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/spine/exercise-ball-back-extension-with-rotation.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/spine/exercise-ball-back-extension-with-rotation.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0033",
    "name": "Exercise Ball Hug",
    "category": "lower_back",
    "categoryDisplay": "Lower Back & Spinal Erectors",
    "targetMuscle": "Lower Back",
    "targetMuscleKey": "lower_back",
    "targetMuscles": [
      "Erector Spinae",
      "Thoracolumbar Fascia"
    ],
    "secondaryMuscles": [
      "Gluteus Maximus",
      "Hamstrings",
      "Core"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your lower back.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your lower back vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the lower back throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the lower back."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/spine/exercise-ball-hug.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/spine/exercise-ball-hug.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/spine/exercise-ball-hug.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0034",
    "name": "Exercise Ball Prone Leg Raise",
    "category": "lower_back",
    "categoryDisplay": "Lower Back & Spinal Erectors",
    "targetMuscle": "Lower Back",
    "targetMuscleKey": "lower_back",
    "targetMuscles": [
      "Erector Spinae",
      "Thoracolumbar Fascia"
    ],
    "secondaryMuscles": [
      "Gluteus Maximus",
      "Hamstrings",
      "Core"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your lower back.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your lower back vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the lower back throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the lower back."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/spine/exercise-ball-prone-leg-raise.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/spine/exercise-ball-prone-leg-raise.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/spine/exercise-ball-prone-leg-raise.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0035",
    "name": "Hyperextension On Bench",
    "category": "lower_back",
    "categoryDisplay": "Lower Back & Spinal Erectors",
    "targetMuscle": "Lower Back",
    "targetMuscleKey": "lower_back",
    "targetMuscles": [
      "Erector Spinae",
      "Thoracolumbar Fascia"
    ],
    "secondaryMuscles": [
      "Gluteus Maximus",
      "Hamstrings",
      "Core"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your lower back.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your lower back vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the lower back throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the lower back."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/spine/hyperextension-on-bench.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/spine/hyperextension-on-bench.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/spine/hyperextension-on-bench.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0036",
    "name": "Hyperextension",
    "category": "lower_back",
    "categoryDisplay": "Lower Back & Spinal Erectors",
    "targetMuscle": "Lower Back",
    "targetMuscleKey": "lower_back",
    "targetMuscles": [
      "Erector Spinae",
      "Thoracolumbar Fascia"
    ],
    "secondaryMuscles": [
      "Gluteus Maximus",
      "Hamstrings",
      "Core"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your lower back.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your lower back vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the lower back throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the lower back."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/spine/hyperextension.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/spine/hyperextension.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/spine/hyperextension.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0037",
    "name": "Lever Back Extension",
    "category": "lower_back",
    "categoryDisplay": "Lower Back & Spinal Erectors",
    "targetMuscle": "Lower Back",
    "targetMuscleKey": "lower_back",
    "targetMuscles": [
      "Erector Spinae",
      "Thoracolumbar Fascia"
    ],
    "secondaryMuscles": [
      "Gluteus Maximus",
      "Hamstrings",
      "Core"
    ],
    "difficulty": "Beginner",
    "equipment": "Machine",
    "instructions": [
      "Set up in a solid, stable base position utilizing machine. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your lower back.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your lower back vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the lower back throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the lower back."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/spine/lever-back-extension.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/spine/lever-back-extension.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/spine/lever-back-extension.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0038",
    "name": "Lower Back Curl",
    "category": "lower_back",
    "categoryDisplay": "Lower Back & Spinal Erectors",
    "targetMuscle": "Lower Back",
    "targetMuscleKey": "lower_back",
    "targetMuscles": [
      "Erector Spinae",
      "Thoracolumbar Fascia"
    ],
    "secondaryMuscles": [
      "Gluteus Maximus",
      "Hamstrings",
      "Core"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your lower back.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your lower back vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the lower back throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the lower back."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/spine/lower-back-curl.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/spine/lower-back-curl.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/spine/lower-back-curl.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0039",
    "name": "Roller Back Stretch",
    "category": "lower_back",
    "categoryDisplay": "Lower Back & Spinal Erectors",
    "targetMuscle": "Lower Back",
    "targetMuscleKey": "lower_back",
    "targetMuscles": [
      "Erector Spinae",
      "Thoracolumbar Fascia"
    ],
    "secondaryMuscles": [
      "Gluteus Maximus",
      "Hamstrings",
      "Core"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your lower back.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your lower back vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the lower back throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the lower back."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/spine/roller-back-stretch.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/spine/roller-back-stretch.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/spine/roller-back-stretch.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0040",
    "name": "Sphinx",
    "category": "lower_back",
    "categoryDisplay": "Lower Back & Spinal Erectors",
    "targetMuscle": "Lower Back",
    "targetMuscleKey": "lower_back",
    "targetMuscles": [
      "Erector Spinae",
      "Thoracolumbar Fascia"
    ],
    "secondaryMuscles": [
      "Gluteus Maximus",
      "Hamstrings",
      "Core"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your lower back.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your lower back vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the lower back throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the lower back."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/spine/sphinx.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/spine/sphinx.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/spine/sphinx.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0041",
    "name": "Assisted Prone Hamstring",
    "category": "hamstrings",
    "categoryDisplay": "Hamstrings & Posterior Chain",
    "targetMuscle": "Hamstrings",
    "targetMuscleKey": "hamstrings",
    "targetMuscles": [
      "Biceps Femoris",
      "Semitendinosus",
      "Semimembranosus"
    ],
    "secondaryMuscles": [
      "Gluteus Maximus",
      "Lower Back",
      "Calves"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your hamstrings.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your hamstrings vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the hamstrings throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the hamstrings."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/assisted-prone-hamstring.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/assisted-prone-hamstring.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/assisted-prone-hamstring.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0042",
    "name": "Barbell Good Morning",
    "category": "hamstrings",
    "categoryDisplay": "Hamstrings & Posterior Chain",
    "targetMuscle": "Hamstrings",
    "targetMuscleKey": "hamstrings",
    "targetMuscles": [
      "Biceps Femoris",
      "Semitendinosus",
      "Semimembranosus"
    ],
    "secondaryMuscles": [
      "Gluteus Maximus",
      "Lower Back",
      "Calves"
    ],
    "difficulty": "Intermediate",
    "equipment": "Barbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing barbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your hamstrings.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your hamstrings vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the hamstrings throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the hamstrings."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/barbell-good-morning.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/barbell-good-morning.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/barbell-good-morning.gif",
    "caloriesBurnEstimatePerHour": 390
  },
  {
    "id": "EX-0043",
    "name": "Barbell Straight Leg Deadlift",
    "category": "hamstrings",
    "categoryDisplay": "Hamstrings & Posterior Chain",
    "targetMuscle": "Hamstrings",
    "targetMuscleKey": "hamstrings",
    "targetMuscles": [
      "Biceps Femoris",
      "Semitendinosus",
      "Semimembranosus"
    ],
    "secondaryMuscles": [
      "Gluteus Maximus",
      "Lower Back",
      "Calves"
    ],
    "difficulty": "Intermediate",
    "equipment": "Barbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing barbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your hamstrings.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your hamstrings vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the hamstrings throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the hamstrings."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/barbell-straight-leg-deadlift.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/barbell-straight-leg-deadlift.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/barbell-straight-leg-deadlift.gif",
    "caloriesBurnEstimatePerHour": 520
  },
  {
    "id": "EX-0044",
    "name": "Cable Assisted Inverse Leg Curl",
    "category": "hamstrings",
    "categoryDisplay": "Hamstrings & Posterior Chain",
    "targetMuscle": "Hamstrings",
    "targetMuscleKey": "hamstrings",
    "targetMuscles": [
      "Biceps Femoris",
      "Semitendinosus",
      "Semimembranosus"
    ],
    "secondaryMuscles": [
      "Gluteus Maximus",
      "Lower Back",
      "Calves"
    ],
    "difficulty": "Beginner",
    "equipment": "Cable",
    "instructions": [
      "Set up in a solid, stable base position utilizing cable. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your hamstrings.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your hamstrings vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the hamstrings throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the hamstrings."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/cable-assisted-inverse-leg-curl.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/cable-assisted-inverse-leg-curl.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/cable-assisted-inverse-leg-curl.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0045",
    "name": "Dumbbell Lying Femoral",
    "category": "hamstrings",
    "categoryDisplay": "Hamstrings & Posterior Chain",
    "targetMuscle": "Hamstrings",
    "targetMuscleKey": "hamstrings",
    "targetMuscles": [
      "Biceps Femoris",
      "Semitendinosus",
      "Semimembranosus"
    ],
    "secondaryMuscles": [
      "Gluteus Maximus",
      "Lower Back",
      "Calves"
    ],
    "difficulty": "Intermediate",
    "equipment": "Dumbbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing dumbbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your hamstrings.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your hamstrings vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the hamstrings throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the hamstrings."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/dumbbell-lying-femoral.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/dumbbell-lying-femoral.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/dumbbell-lying-femoral.gif",
    "caloriesBurnEstimatePerHour": 390
  },
  {
    "id": "EX-0046",
    "name": "Exercise Ball Seated Hamstring Stretch",
    "category": "hamstrings",
    "categoryDisplay": "Hamstrings & Posterior Chain",
    "targetMuscle": "Hamstrings",
    "targetMuscleKey": "hamstrings",
    "targetMuscles": [
      "Biceps Femoris",
      "Semitendinosus",
      "Semimembranosus"
    ],
    "secondaryMuscles": [
      "Gluteus Maximus",
      "Lower Back",
      "Calves"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your hamstrings.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your hamstrings vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the hamstrings throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the hamstrings."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/exercise-ball-seated-hamstring-stretch.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/exercise-ball-seated-hamstring-stretch.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/exercise-ball-seated-hamstring-stretch.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0047",
    "name": "Glute Ham Raise",
    "category": "hamstrings",
    "categoryDisplay": "Hamstrings & Posterior Chain",
    "targetMuscle": "Hamstrings",
    "targetMuscleKey": "hamstrings",
    "targetMuscles": [
      "Biceps Femoris",
      "Semitendinosus",
      "Semimembranosus"
    ],
    "secondaryMuscles": [
      "Gluteus Maximus",
      "Lower Back",
      "Calves"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Begin by adjusting the equipment to fit your body. Place your feet against the footplate in between the rollers as you lie facedown. Your knees should be just behind the pad.",
      "Start from the bottom of the movement. Keep your back arched as you begin the movement by flexing the knees. Drive your toes into the foot plate as you do so. Keep your upper body straight, and continue until your body is upright.",
      "Return to the starting position, keeping your descent under control."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the hamstrings throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the hamstrings."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/glute-ham-raise.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/glute-ham-raise.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/glute-ham-raise.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0048",
    "name": "Hamstring Stretch",
    "category": "hamstrings",
    "categoryDisplay": "Hamstrings & Posterior Chain",
    "targetMuscle": "Hamstrings",
    "targetMuscleKey": "hamstrings",
    "targetMuscles": [
      "Biceps Femoris",
      "Semitendinosus",
      "Semimembranosus"
    ],
    "secondaryMuscles": [
      "Gluteus Maximus",
      "Lower Back",
      "Calves"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Lie on your back with one leg extended above you, with the hip at ninety degrees. Keep the other leg flat on the floor.",
      "Loop a belt, band, or rope over the ball of your foot. This will be your starting position.",
      "Pull on the belt to create tension in the calves and hamstrings. Hold this stretch for 10-30 seconds, and repeat with the other leg."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the hamstrings throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the hamstrings."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/hamstring-stretch.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/hamstring-stretch.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/hamstring-stretch.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0049",
    "name": "Inverse Leg Curl Bench Support",
    "category": "hamstrings",
    "categoryDisplay": "Hamstrings & Posterior Chain",
    "targetMuscle": "Hamstrings",
    "targetMuscleKey": "hamstrings",
    "targetMuscles": [
      "Biceps Femoris",
      "Semitendinosus",
      "Semimembranosus"
    ],
    "secondaryMuscles": [
      "Gluteus Maximus",
      "Lower Back",
      "Calves"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your hamstrings.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your hamstrings vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the hamstrings throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the hamstrings."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/inverse-leg-curl-bench-support.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/inverse-leg-curl-bench-support.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/inverse-leg-curl-bench-support.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0050",
    "name": "Inverse Leg Curl On Pull Up Cable Machine",
    "category": "hamstrings",
    "categoryDisplay": "Hamstrings & Posterior Chain",
    "targetMuscle": "Hamstrings",
    "targetMuscleKey": "hamstrings",
    "targetMuscles": [
      "Biceps Femoris",
      "Semitendinosus",
      "Semimembranosus"
    ],
    "secondaryMuscles": [
      "Gluteus Maximus",
      "Lower Back",
      "Calves"
    ],
    "difficulty": "Beginner",
    "equipment": "Cable",
    "instructions": [
      "Set up in a solid, stable base position utilizing cable. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your hamstrings.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your hamstrings vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the hamstrings throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the hamstrings."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/inverse-leg-curl-on-pull-up-cable-machine.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/inverse-leg-curl-on-pull-up-cable-machine.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/inverse-leg-curl-on-pull-up-cable-machine.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0051",
    "name": "Kettlebell Hang Clean",
    "category": "hamstrings",
    "categoryDisplay": "Hamstrings & Posterior Chain",
    "targetMuscle": "Hamstrings",
    "targetMuscleKey": "hamstrings",
    "targetMuscles": [
      "Biceps Femoris",
      "Semitendinosus",
      "Semimembranosus"
    ],
    "secondaryMuscles": [
      "Gluteus Maximus",
      "Lower Back",
      "Calves"
    ],
    "difficulty": "Intermediate",
    "equipment": "Kettlebell",
    "instructions": [
      "Place kettlebell between your feet. To get in the starting position, push your butt back and look straight ahead.",
      "Clean kettlebell to your shoulder. Clean the kettlebell to your shoulders by extending through the legs and hips as you raise the kettlebell towards your shoulder. The wrist should rotate as you do so.",
      "Lower kettlebell to a hanging position between your legs while keeping the hamstrings loaded. Keep your head up at all times."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the hamstrings throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the hamstrings."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/kettlebell-hang-clean.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/kettlebell-hang-clean.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/kettlebell-hang-clean.gif",
    "caloriesBurnEstimatePerHour": 520
  },
  {
    "id": "EX-0052",
    "name": "Kick Out Sit",
    "category": "hamstrings",
    "categoryDisplay": "Hamstrings & Posterior Chain",
    "targetMuscle": "Hamstrings",
    "targetMuscleKey": "hamstrings",
    "targetMuscles": [
      "Biceps Femoris",
      "Semitendinosus",
      "Semimembranosus"
    ],
    "secondaryMuscles": [
      "Gluteus Maximus",
      "Lower Back",
      "Calves"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your hamstrings.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your hamstrings vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the hamstrings throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the hamstrings."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/kick-out-sit.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/kick-out-sit.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/kick-out-sit.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0053",
    "name": "Leg Up Hamstring Stretch",
    "category": "hamstrings",
    "categoryDisplay": "Hamstrings & Posterior Chain",
    "targetMuscle": "Hamstrings",
    "targetMuscleKey": "hamstrings",
    "targetMuscles": [
      "Biceps Femoris",
      "Semitendinosus",
      "Semimembranosus"
    ],
    "secondaryMuscles": [
      "Gluteus Maximus",
      "Lower Back",
      "Calves"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Lie flat on your back, bend one knee, and put that foot flat on the floor to stabilize your spine.",
      "Extend the other leg in the air. If you're tight, you wont be able to straighten it. That's okay. Extend the knee so that the sole of the lifted foot faces the ceiling (or as close as you can get it).",
      "Slowly straighten the legs as much as possible and then pull the leg toward your nose. Switch sides."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the hamstrings throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the hamstrings."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/leg-up-hamstring-stretch.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/leg-up-hamstring-stretch.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/leg-up-hamstring-stretch.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0054",
    "name": "Lever Kneeling Leg Curl",
    "category": "hamstrings",
    "categoryDisplay": "Hamstrings & Posterior Chain",
    "targetMuscle": "Hamstrings",
    "targetMuscleKey": "hamstrings",
    "targetMuscles": [
      "Biceps Femoris",
      "Semitendinosus",
      "Semimembranosus"
    ],
    "secondaryMuscles": [
      "Gluteus Maximus",
      "Lower Back",
      "Calves"
    ],
    "difficulty": "Beginner",
    "equipment": "Machine",
    "instructions": [
      "Set up in a solid, stable base position utilizing machine. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your hamstrings.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your hamstrings vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the hamstrings throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the hamstrings."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/lever-kneeling-leg-curl.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/lever-kneeling-leg-curl.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/lever-kneeling-leg-curl.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0055",
    "name": "Lever Lying Leg Curl",
    "category": "hamstrings",
    "categoryDisplay": "Hamstrings & Posterior Chain",
    "targetMuscle": "Hamstrings",
    "targetMuscleKey": "hamstrings",
    "targetMuscles": [
      "Biceps Femoris",
      "Semitendinosus",
      "Semimembranosus"
    ],
    "secondaryMuscles": [
      "Gluteus Maximus",
      "Lower Back",
      "Calves"
    ],
    "difficulty": "Beginner",
    "equipment": "Machine",
    "instructions": [
      "Set up in a solid, stable base position utilizing machine. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your hamstrings.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your hamstrings vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the hamstrings throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the hamstrings."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/lever-lying-leg-curl.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/lever-lying-leg-curl.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/lever-lying-leg-curl.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0056",
    "name": "Lever Lying Two One Leg Curl",
    "category": "hamstrings",
    "categoryDisplay": "Hamstrings & Posterior Chain",
    "targetMuscle": "Hamstrings",
    "targetMuscleKey": "hamstrings",
    "targetMuscles": [
      "Biceps Femoris",
      "Semitendinosus",
      "Semimembranosus"
    ],
    "secondaryMuscles": [
      "Gluteus Maximus",
      "Lower Back",
      "Calves"
    ],
    "difficulty": "Beginner",
    "equipment": "Machine",
    "instructions": [
      "Set up in a solid, stable base position utilizing machine. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your hamstrings.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your hamstrings vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the hamstrings throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the hamstrings."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/lever-lying-two-one-leg-curl.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/lever-lying-two-one-leg-curl.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/lever-lying-two-one-leg-curl.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0057",
    "name": "Lever Seated Leg Curl",
    "category": "hamstrings",
    "categoryDisplay": "Hamstrings & Posterior Chain",
    "targetMuscle": "Hamstrings",
    "targetMuscleKey": "hamstrings",
    "targetMuscles": [
      "Biceps Femoris",
      "Semitendinosus",
      "Semimembranosus"
    ],
    "secondaryMuscles": [
      "Gluteus Maximus",
      "Lower Back",
      "Calves"
    ],
    "difficulty": "Beginner",
    "equipment": "Machine",
    "instructions": [
      "Set up in a solid, stable base position utilizing machine. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your hamstrings.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your hamstrings vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the hamstrings throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the hamstrings."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/lever-seated-leg-curl.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/lever-seated-leg-curl.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/lever-seated-leg-curl.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0058",
    "name": "Power Clean",
    "category": "hamstrings",
    "categoryDisplay": "Hamstrings & Posterior Chain",
    "targetMuscle": "Hamstrings",
    "targetMuscleKey": "hamstrings",
    "targetMuscles": [
      "Biceps Femoris",
      "Semitendinosus",
      "Semimembranosus"
    ],
    "secondaryMuscles": [
      "Gluteus Maximus",
      "Lower Back",
      "Calves"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Stand with your feet slightly wider than shoulder width apart and toes pointing out slightly.",
      "Squat down and grasp bar with a closed, pronated grip. Your hands should be slightly wider than shoulder width apart outside knees with elbows fully extended.",
      "Place the bar about 1 inch in front of your shins and over the balls of your feet.",
      "Your back should be flat or slightly arched, your chest held up and out and your shoulder blades should be retracted.",
      "Keep your head in a neutral position (in line with vertebral column and not tilted or rotated) with your eyes focused straight ahead. Inhale during this phase.",
      "Lift the bar from the floor by forcefully extending the hips and the knees as you exhale. Tip: The upper torso should maintain the same angle. Do not bend at the waist yet and do not let the hips rise before the shoulders (this would have the effect of pushing the glutes in the air and stretching the hamstrings.",
      "Keep elbows fully extended with the head in a neutral position and the shoulders over the bar.",
      "As the bar raises keep it as close to the shins as possible.",
      "As the bar passes the knees, thrust your hips forward and slightly bend the knees to avoid locking them. Tip: At this point your thighs should be against the bar.",
      "Keep the back flat or slightly arched, elbows fully extended and your head neutral. Tip: You will hold your breath until the next phase.",
      "Inhale and then forcefully and quickly extend your hips and knees and stand on your toes.",
      "Keep the bar as close to your body as possible. Tip: Your back should be flat with the elbows pointed out to the sides and your head in a neutral position. Also, keep your shoulders over the bar and arms straight as long as possible.",
      "When your lower body joints are fully extended, shrug the shoulders upward rapidly without letting the elbows flex yet. Exhale during this portion of the movement.",
      "As the shoulders reach their highest elevation flex your elbows to begin pulling your body under the bar.",
      "Continue to pull the arms as high and as long as possible. Tip: Due to the explosive nature of this phase, your torso will be erect or with an arched back, your head will be tilted back slightly and your feet may lose contact with the floor.",
      "After the lower body has fully extended and the bar reaches near maximal height, pull your body under the bar and rotate the arms around and under the bar.",
      "Simultaneously, flex the hips and knees into a quarter squat position.",
      "Once the arms are under the bar, inhale and then lift your elbows to position the upper arms parallel to the floor. Rack the bar across the front of your collar bones and front shoulder muscles.",
      "Catch the bar with an erect and tight torso, a neutral head position and flat feet. Exhale during this movement.",
      "Stand up by extending the hips and knees to a fully erect position.",
      "Lower the bar by gradually reducing the muscular tension of the arms to allow a controlled descent of the bar to the thighs. Inhale during this movement.",
      "Simultaneously flex the hips and knees to cushion the impact of the bar on the thighs.",
      "Squat down with the elbows fully extended until the bar touches the floor.",
      "Start over at Phase 1 and repeat for the recommended amount of repetitions."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the hamstrings throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the hamstrings."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/power-clean.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/power-clean.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/power-clean.gif",
    "caloriesBurnEstimatePerHour": 420
  },
  {
    "id": "EX-0059",
    "name": "Reclining Big Toe Pose With Rope",
    "category": "hamstrings",
    "categoryDisplay": "Hamstrings & Posterior Chain",
    "targetMuscle": "Hamstrings",
    "targetMuscleKey": "hamstrings",
    "targetMuscles": [
      "Biceps Femoris",
      "Semitendinosus",
      "Semimembranosus"
    ],
    "secondaryMuscles": [
      "Gluteus Maximus",
      "Lower Back",
      "Calves"
    ],
    "difficulty": "Intermediate",
    "equipment": "Cable",
    "instructions": [
      "Set up in a solid, stable base position utilizing cable. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your hamstrings.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your hamstrings vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the hamstrings throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the hamstrings."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/reclining-big-toe-pose-with-rope.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/reclining-big-toe-pose-with-rope.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/reclining-big-toe-pose-with-rope.gif",
    "caloriesBurnEstimatePerHour": 390
  },
  {
    "id": "EX-0060",
    "name": "Runners Stretch",
    "category": "hamstrings",
    "categoryDisplay": "Hamstrings & Posterior Chain",
    "targetMuscle": "Hamstrings",
    "targetMuscleKey": "hamstrings",
    "targetMuscles": [
      "Biceps Femoris",
      "Semitendinosus",
      "Semimembranosus"
    ],
    "secondaryMuscles": [
      "Gluteus Maximus",
      "Lower Back",
      "Calves"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "It's easiest to get into this stretch if you start standing up, put one leg behind you, and slowly lower your torso down to the floor.",
      "Keep the front heel on the floor (if it lifts up, scoot your other leg further back).",
      "Place your hands on either side of your front leg. To get more out of this stretch, push your butt up toward the ceiling, and then gradually lower it back toward the floor. You'll Stretch the hip flexor of the back leg and the hamstring and buttocks of the front."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the hamstrings throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the hamstrings."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/runners-stretch.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/runners-stretch.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/runners-stretch.gif",
    "caloriesBurnEstimatePerHour": 420
  },
  {
    "id": "EX-0061",
    "name": "Seated Wide Angle Pose Sequence",
    "category": "hamstrings",
    "categoryDisplay": "Hamstrings & Posterior Chain",
    "targetMuscle": "Hamstrings",
    "targetMuscleKey": "hamstrings",
    "targetMuscles": [
      "Biceps Femoris",
      "Semitendinosus",
      "Semimembranosus"
    ],
    "secondaryMuscles": [
      "Gluteus Maximus",
      "Lower Back",
      "Calves"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your hamstrings.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your hamstrings vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the hamstrings throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the hamstrings."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/seated-wide-angle-pose-sequence.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/seated-wide-angle-pose-sequence.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/hamstrings/seated-wide-angle-pose-sequence.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0062",
    "name": "Astride Jumps Male",
    "category": "full_body",
    "categoryDisplay": "Conditioning & Full Body",
    "targetMuscle": "Full Body",
    "targetMuscleKey": "full_body",
    "targetMuscles": [
      "Cardiovascular System",
      "Full Body Kinetic Chain"
    ],
    "secondaryMuscles": [
      "Quadriceps",
      "Calves",
      "Core"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your full body.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your full body vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the full body throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the full body."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/astride-jumps-male.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/astride-jumps-male.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/astride-jumps-male.gif",
    "caloriesBurnEstimatePerHour": 500
  },
  {
    "id": "EX-0063",
    "name": "Back And Forth Step",
    "category": "full_body",
    "categoryDisplay": "Conditioning & Full Body",
    "targetMuscle": "Full Body",
    "targetMuscleKey": "full_body",
    "targetMuscles": [
      "Cardiovascular System",
      "Full Body Kinetic Chain"
    ],
    "secondaryMuscles": [
      "Quadriceps",
      "Calves",
      "Core"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your full body.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your full body vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the full body throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the full body."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/back-and-forth-step.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/back-and-forth-step.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/back-and-forth-step.gif",
    "caloriesBurnEstimatePerHour": 390
  },
  {
    "id": "EX-0064",
    "name": "Bear Crawl",
    "category": "full_body",
    "categoryDisplay": "Conditioning & Full Body",
    "targetMuscle": "Full Body",
    "targetMuscleKey": "full_body",
    "targetMuscles": [
      "Cardiovascular System",
      "Full Body Kinetic Chain"
    ],
    "secondaryMuscles": [
      "Quadriceps",
      "Calves",
      "Core"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your full body.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your full body vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the full body throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the full body."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/bear-crawl.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/bear-crawl.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/bear-crawl.gif",
    "caloriesBurnEstimatePerHour": 390
  },
  {
    "id": "EX-0065",
    "name": "Burpee",
    "category": "full_body",
    "categoryDisplay": "Conditioning & Full Body",
    "targetMuscle": "Full Body",
    "targetMuscleKey": "full_body",
    "targetMuscles": [
      "Cardiovascular System",
      "Full Body Kinetic Chain"
    ],
    "secondaryMuscles": [
      "Quadriceps",
      "Calves",
      "Core"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your full body.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your full body vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the full body throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the full body."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/burpee.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/burpee.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/burpee.gif",
    "caloriesBurnEstimatePerHour": 500
  },
  {
    "id": "EX-0066",
    "name": "Cycle Cross Trainer",
    "category": "full_body",
    "categoryDisplay": "Conditioning & Full Body",
    "targetMuscle": "Full Body",
    "targetMuscleKey": "full_body",
    "targetMuscles": [
      "Cardiovascular System",
      "Full Body Kinetic Chain"
    ],
    "secondaryMuscles": [
      "Quadriceps",
      "Calves",
      "Core"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your full body.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your full body vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the full body throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the full body."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/cycle-cross-trainer.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/cycle-cross-trainer.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/cycle-cross-trainer.gif",
    "caloriesBurnEstimatePerHour": 390
  },
  {
    "id": "EX-0067",
    "name": "Dumbbell Burpee",
    "category": "full_body",
    "categoryDisplay": "Conditioning & Full Body",
    "targetMuscle": "Full Body",
    "targetMuscleKey": "full_body",
    "targetMuscles": [
      "Cardiovascular System",
      "Full Body Kinetic Chain"
    ],
    "secondaryMuscles": [
      "Quadriceps",
      "Calves",
      "Core"
    ],
    "difficulty": "Intermediate",
    "equipment": "Dumbbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing dumbbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your full body.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your full body vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the full body throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the full body."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/dumbbell-burpee.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/dumbbell-burpee.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/dumbbell-burpee.gif",
    "caloriesBurnEstimatePerHour": 600
  },
  {
    "id": "EX-0068",
    "name": "Half Knee Bends Male",
    "category": "full_body",
    "categoryDisplay": "Conditioning & Full Body",
    "targetMuscle": "Full Body",
    "targetMuscleKey": "full_body",
    "targetMuscles": [
      "Cardiovascular System",
      "Full Body Kinetic Chain"
    ],
    "secondaryMuscles": [
      "Quadriceps",
      "Calves",
      "Core"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your full body.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your full body vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the full body throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the full body."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/half-knee-bends-male.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/half-knee-bends-male.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/half-knee-bends-male.gif",
    "caloriesBurnEstimatePerHour": 390
  },
  {
    "id": "EX-0069",
    "name": "High Knee Against Wall",
    "category": "full_body",
    "categoryDisplay": "Conditioning & Full Body",
    "targetMuscle": "Full Body",
    "targetMuscleKey": "full_body",
    "targetMuscles": [
      "Cardiovascular System",
      "Full Body Kinetic Chain"
    ],
    "secondaryMuscles": [
      "Quadriceps",
      "Calves",
      "Core"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your full body.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your full body vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the full body throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the full body."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/high-knee-against-wall.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/high-knee-against-wall.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/high-knee-against-wall.gif",
    "caloriesBurnEstimatePerHour": 390
  },
  {
    "id": "EX-0070",
    "name": "Jack Burpee",
    "category": "full_body",
    "categoryDisplay": "Conditioning & Full Body",
    "targetMuscle": "Full Body",
    "targetMuscleKey": "full_body",
    "targetMuscles": [
      "Cardiovascular System",
      "Full Body Kinetic Chain"
    ],
    "secondaryMuscles": [
      "Quadriceps",
      "Calves",
      "Core"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your full body.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your full body vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the full body throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the full body."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/jack-burpee.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/jack-burpee.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/jack-burpee.gif",
    "caloriesBurnEstimatePerHour": 500
  },
  {
    "id": "EX-0071",
    "name": "Jack Jump Male",
    "category": "full_body",
    "categoryDisplay": "Conditioning & Full Body",
    "targetMuscle": "Full Body",
    "targetMuscleKey": "full_body",
    "targetMuscles": [
      "Cardiovascular System",
      "Full Body Kinetic Chain"
    ],
    "secondaryMuscles": [
      "Quadriceps",
      "Calves",
      "Core"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your full body.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your full body vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the full body throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the full body."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/jack-jump-male.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/jack-jump-male.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/jack-jump-male.gif",
    "caloriesBurnEstimatePerHour": 500
  },
  {
    "id": "EX-0072",
    "name": "Jump Rope",
    "category": "full_body",
    "categoryDisplay": "Conditioning & Full Body",
    "targetMuscle": "Full Body",
    "targetMuscleKey": "full_body",
    "targetMuscles": [
      "Cardiovascular System",
      "Full Body Kinetic Chain"
    ],
    "secondaryMuscles": [
      "Quadriceps",
      "Calves",
      "Core"
    ],
    "difficulty": "Intermediate",
    "equipment": "Cable",
    "instructions": [
      "Set up in a solid, stable base position utilizing cable. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your full body.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your full body vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the full body throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the full body."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/jump-rope.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/jump-rope.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/jump-rope.gif",
    "caloriesBurnEstimatePerHour": 600
  },
  {
    "id": "EX-0073",
    "name": "Mountain Climber",
    "category": "full_body",
    "categoryDisplay": "Conditioning & Full Body",
    "targetMuscle": "Full Body",
    "targetMuscleKey": "full_body",
    "targetMuscles": [
      "Cardiovascular System",
      "Full Body Kinetic Chain"
    ],
    "secondaryMuscles": [
      "Quadriceps",
      "Calves",
      "Core"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your full body.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your full body vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the full body throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the full body."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/mountain-climber.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/mountain-climber.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/mountain-climber.gif",
    "caloriesBurnEstimatePerHour": 390
  },
  {
    "id": "EX-0074",
    "name": "Push To Run",
    "category": "full_body",
    "categoryDisplay": "Conditioning & Full Body",
    "targetMuscle": "Full Body",
    "targetMuscleKey": "full_body",
    "targetMuscles": [
      "Cardiovascular System",
      "Full Body Kinetic Chain"
    ],
    "secondaryMuscles": [
      "Quadriceps",
      "Calves",
      "Core"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your full body.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your full body vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the full body throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the full body."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/push-to-run.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/push-to-run.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/push-to-run.gif",
    "caloriesBurnEstimatePerHour": 500
  },
  {
    "id": "EX-0075",
    "name": "Run Equipment",
    "category": "full_body",
    "categoryDisplay": "Conditioning & Full Body",
    "targetMuscle": "Full Body",
    "targetMuscleKey": "full_body",
    "targetMuscles": [
      "Cardiovascular System",
      "Full Body Kinetic Chain"
    ],
    "secondaryMuscles": [
      "Quadriceps",
      "Calves",
      "Core"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your full body.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your full body vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the full body throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the full body."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/run-equipment.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/run-equipment.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/run-equipment.gif",
    "caloriesBurnEstimatePerHour": 500
  },
  {
    "id": "EX-0076",
    "name": "Run",
    "category": "full_body",
    "categoryDisplay": "Conditioning & Full Body",
    "targetMuscle": "Full Body",
    "targetMuscleKey": "full_body",
    "targetMuscles": [
      "Cardiovascular System",
      "Full Body Kinetic Chain"
    ],
    "secondaryMuscles": [
      "Quadriceps",
      "Calves",
      "Core"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your full body.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your full body vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the full body throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the full body."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/run.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/run.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/run.gif",
    "caloriesBurnEstimatePerHour": 500
  },
  {
    "id": "EX-0077",
    "name": "Scissor Jumps Male",
    "category": "full_body",
    "categoryDisplay": "Conditioning & Full Body",
    "targetMuscle": "Full Body",
    "targetMuscleKey": "full_body",
    "targetMuscles": [
      "Cardiovascular System",
      "Full Body Kinetic Chain"
    ],
    "secondaryMuscles": [
      "Quadriceps",
      "Calves",
      "Core"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your full body.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your full body vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the full body throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the full body."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/scissor-jumps-male.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/scissor-jumps-male.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/scissor-jumps-male.gif",
    "caloriesBurnEstimatePerHour": 500
  },
  {
    "id": "EX-0078",
    "name": "Semi Squat Jump Male",
    "category": "full_body",
    "categoryDisplay": "Conditioning & Full Body",
    "targetMuscle": "Full Body",
    "targetMuscleKey": "full_body",
    "targetMuscles": [
      "Cardiovascular System",
      "Full Body Kinetic Chain"
    ],
    "secondaryMuscles": [
      "Quadriceps",
      "Calves",
      "Core"
    ],
    "difficulty": "Intermediate",
    "equipment": "Barbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing barbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your full body.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your full body vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the full body throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the full body."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/semi-squat-jump-male.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/semi-squat-jump-male.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/semi-squat-jump-male.gif",
    "caloriesBurnEstimatePerHour": 600
  },
  {
    "id": "EX-0079",
    "name": "Short Stride Run",
    "category": "full_body",
    "categoryDisplay": "Conditioning & Full Body",
    "targetMuscle": "Full Body",
    "targetMuscleKey": "full_body",
    "targetMuscles": [
      "Cardiovascular System",
      "Full Body Kinetic Chain"
    ],
    "secondaryMuscles": [
      "Quadriceps",
      "Calves",
      "Core"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your full body.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your full body vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the full body throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the full body."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/short-stride-run.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/short-stride-run.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/short-stride-run.gif",
    "caloriesBurnEstimatePerHour": 500
  },
  {
    "id": "EX-0080",
    "name": "Skater Hops",
    "category": "full_body",
    "categoryDisplay": "Conditioning & Full Body",
    "targetMuscle": "Full Body",
    "targetMuscleKey": "full_body",
    "targetMuscles": [
      "Cardiovascular System",
      "Full Body Kinetic Chain"
    ],
    "secondaryMuscles": [
      "Quadriceps",
      "Calves",
      "Core"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your full body.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your full body vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the full body throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the full body."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/skater-hops.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/skater-hops.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/skater-hops.gif",
    "caloriesBurnEstimatePerHour": 390
  },
  {
    "id": "EX-0081",
    "name": "Ski Step",
    "category": "full_body",
    "categoryDisplay": "Conditioning & Full Body",
    "targetMuscle": "Full Body",
    "targetMuscleKey": "full_body",
    "targetMuscles": [
      "Cardiovascular System",
      "Full Body Kinetic Chain"
    ],
    "secondaryMuscles": [
      "Quadriceps",
      "Calves",
      "Core"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your full body.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your full body vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the full body throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the full body."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/ski-step.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/ski-step.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/ski-step.gif",
    "caloriesBurnEstimatePerHour": 390
  },
  {
    "id": "EX-0082",
    "name": "Star Jump Male",
    "category": "full_body",
    "categoryDisplay": "Conditioning & Full Body",
    "targetMuscle": "Full Body",
    "targetMuscleKey": "full_body",
    "targetMuscles": [
      "Cardiovascular System",
      "Full Body Kinetic Chain"
    ],
    "secondaryMuscles": [
      "Quadriceps",
      "Calves",
      "Core"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your full body.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your full body vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the full body throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the full body."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/star-jump-male.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/star-jump-male.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/star-jump-male.gif",
    "caloriesBurnEstimatePerHour": 500
  },
  {
    "id": "EX-0083",
    "name": "Stationary Bike Run V 3",
    "category": "full_body",
    "categoryDisplay": "Conditioning & Full Body",
    "targetMuscle": "Full Body",
    "targetMuscleKey": "full_body",
    "targetMuscles": [
      "Cardiovascular System",
      "Full Body Kinetic Chain"
    ],
    "secondaryMuscles": [
      "Quadriceps",
      "Calves",
      "Core"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your full body.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your full body vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the full body throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the full body."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/stationary-bike-run-v-3.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/stationary-bike-run-v-3.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/cardio/stationary-bike-run-v-3.gif",
    "caloriesBurnEstimatePerHour": 500
  },
  {
    "id": "EX-0084",
    "name": "Band Reverse Wrist Curl",
    "category": "forearms",
    "categoryDisplay": "Forearms & Grip",
    "targetMuscle": "Forearms",
    "targetMuscleKey": "forearms",
    "targetMuscles": [
      "Wrist Flexors",
      "Brachioradialis",
      "Wrist Extensors"
    ],
    "secondaryMuscles": [
      "Grip",
      "Biceps"
    ],
    "difficulty": "Beginner",
    "equipment": "Resistance Band",
    "instructions": [
      "Set up in a solid, stable base position utilizing resistance band. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your forearms.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your forearms vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the forearms throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the forearms."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/band-reverse-wrist-curl.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/band-reverse-wrist-curl.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/band-reverse-wrist-curl.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0085",
    "name": "Band Wrist Curl",
    "category": "forearms",
    "categoryDisplay": "Forearms & Grip",
    "targetMuscle": "Forearms",
    "targetMuscleKey": "forearms",
    "targetMuscles": [
      "Wrist Flexors",
      "Brachioradialis",
      "Wrist Extensors"
    ],
    "secondaryMuscles": [
      "Grip",
      "Biceps"
    ],
    "difficulty": "Beginner",
    "equipment": "Resistance Band",
    "instructions": [
      "Set up in a solid, stable base position utilizing resistance band. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your forearms.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your forearms vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the forearms throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the forearms."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/band-wrist-curl.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/band-wrist-curl.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/band-wrist-curl.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0086",
    "name": "Barbell Palms Down Wrist Curl Over A Bench",
    "category": "forearms",
    "categoryDisplay": "Forearms & Grip",
    "targetMuscle": "Forearms",
    "targetMuscleKey": "forearms",
    "targetMuscles": [
      "Wrist Flexors",
      "Brachioradialis",
      "Wrist Extensors"
    ],
    "secondaryMuscles": [
      "Grip",
      "Biceps"
    ],
    "difficulty": "Intermediate",
    "equipment": "Barbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing barbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your forearms.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your forearms vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the forearms throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the forearms."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/barbell-palms-down-wrist-curl-over-a-bench.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/barbell-palms-down-wrist-curl-over-a-bench.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/barbell-palms-down-wrist-curl-over-a-bench.gif",
    "caloriesBurnEstimatePerHour": 390
  },
  {
    "id": "EX-0087",
    "name": "Barbell Palms Up Wrist Curl Over A Bench",
    "category": "forearms",
    "categoryDisplay": "Forearms & Grip",
    "targetMuscle": "Forearms",
    "targetMuscleKey": "forearms",
    "targetMuscles": [
      "Wrist Flexors",
      "Brachioradialis",
      "Wrist Extensors"
    ],
    "secondaryMuscles": [
      "Grip",
      "Biceps"
    ],
    "difficulty": "Intermediate",
    "equipment": "Barbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing barbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your forearms.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your forearms vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the forearms throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the forearms."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/barbell-palms-up-wrist-curl-over-a-bench.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/barbell-palms-up-wrist-curl-over-a-bench.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/barbell-palms-up-wrist-curl-over-a-bench.gif",
    "caloriesBurnEstimatePerHour": 390
  },
  {
    "id": "EX-0088",
    "name": "Barbell Revers Wrist Curl V 2",
    "category": "forearms",
    "categoryDisplay": "Forearms & Grip",
    "targetMuscle": "Forearms",
    "targetMuscleKey": "forearms",
    "targetMuscles": [
      "Wrist Flexors",
      "Brachioradialis",
      "Wrist Extensors"
    ],
    "secondaryMuscles": [
      "Grip",
      "Biceps"
    ],
    "difficulty": "Intermediate",
    "equipment": "Barbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing barbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your forearms.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your forearms vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the forearms throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the forearms."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/barbell-revers-wrist-curl-v-2.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/barbell-revers-wrist-curl-v-2.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/barbell-revers-wrist-curl-v-2.gif",
    "caloriesBurnEstimatePerHour": 390
  },
  {
    "id": "EX-0089",
    "name": "Barbell Reverse Wrist Curl",
    "category": "forearms",
    "categoryDisplay": "Forearms & Grip",
    "targetMuscle": "Forearms",
    "targetMuscleKey": "forearms",
    "targetMuscles": [
      "Wrist Flexors",
      "Brachioradialis",
      "Wrist Extensors"
    ],
    "secondaryMuscles": [
      "Grip",
      "Biceps"
    ],
    "difficulty": "Intermediate",
    "equipment": "Barbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing barbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your forearms.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your forearms vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the forearms throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the forearms."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/barbell-reverse-wrist-curl.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/barbell-reverse-wrist-curl.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/barbell-reverse-wrist-curl.gif",
    "caloriesBurnEstimatePerHour": 390
  },
  {
    "id": "EX-0090",
    "name": "Barbell Standing Back Wrist Curl",
    "category": "forearms",
    "categoryDisplay": "Forearms & Grip",
    "targetMuscle": "Forearms",
    "targetMuscleKey": "forearms",
    "targetMuscles": [
      "Wrist Flexors",
      "Brachioradialis",
      "Wrist Extensors"
    ],
    "secondaryMuscles": [
      "Grip",
      "Biceps"
    ],
    "difficulty": "Intermediate",
    "equipment": "Barbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing barbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your forearms.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your forearms vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the forearms throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the forearms."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/barbell-standing-back-wrist-curl.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/barbell-standing-back-wrist-curl.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/barbell-standing-back-wrist-curl.gif",
    "caloriesBurnEstimatePerHour": 390
  },
  {
    "id": "EX-0091",
    "name": "Barbell Wrist Curl V 2",
    "category": "forearms",
    "categoryDisplay": "Forearms & Grip",
    "targetMuscle": "Forearms",
    "targetMuscleKey": "forearms",
    "targetMuscles": [
      "Wrist Flexors",
      "Brachioradialis",
      "Wrist Extensors"
    ],
    "secondaryMuscles": [
      "Grip",
      "Biceps"
    ],
    "difficulty": "Intermediate",
    "equipment": "Barbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing barbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your forearms.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your forearms vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the forearms throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the forearms."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/barbell-wrist-curl-v-2.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/barbell-wrist-curl-v-2.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/barbell-wrist-curl-v-2.gif",
    "caloriesBurnEstimatePerHour": 390
  },
  {
    "id": "EX-0092",
    "name": "Barbell Wrist Curl",
    "category": "forearms",
    "categoryDisplay": "Forearms & Grip",
    "targetMuscle": "Forearms",
    "targetMuscleKey": "forearms",
    "targetMuscles": [
      "Wrist Flexors",
      "Brachioradialis",
      "Wrist Extensors"
    ],
    "secondaryMuscles": [
      "Grip",
      "Biceps"
    ],
    "difficulty": "Intermediate",
    "equipment": "Barbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing barbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your forearms.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your forearms vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the forearms throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the forearms."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/barbell-wrist-curl.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/barbell-wrist-curl.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/barbell-wrist-curl.gif",
    "caloriesBurnEstimatePerHour": 390
  },
  {
    "id": "EX-0093",
    "name": "Cable Reverse Wrist Curl",
    "category": "forearms",
    "categoryDisplay": "Forearms & Grip",
    "targetMuscle": "Forearms",
    "targetMuscleKey": "forearms",
    "targetMuscles": [
      "Wrist Flexors",
      "Brachioradialis",
      "Wrist Extensors"
    ],
    "secondaryMuscles": [
      "Grip",
      "Biceps"
    ],
    "difficulty": "Beginner",
    "equipment": "Cable",
    "instructions": [
      "Set up in a solid, stable base position utilizing cable. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your forearms.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your forearms vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the forearms throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the forearms."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/cable-reverse-wrist-curl.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/cable-reverse-wrist-curl.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/cable-reverse-wrist-curl.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0094",
    "name": "Cable Standing Back Wrist Curl",
    "category": "forearms",
    "categoryDisplay": "Forearms & Grip",
    "targetMuscle": "Forearms",
    "targetMuscleKey": "forearms",
    "targetMuscles": [
      "Wrist Flexors",
      "Brachioradialis",
      "Wrist Extensors"
    ],
    "secondaryMuscles": [
      "Grip",
      "Biceps"
    ],
    "difficulty": "Beginner",
    "equipment": "Cable",
    "instructions": [
      "Set up in a solid, stable base position utilizing cable. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your forearms.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your forearms vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the forearms throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the forearms."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/cable-standing-back-wrist-curl.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/cable-standing-back-wrist-curl.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/cable-standing-back-wrist-curl.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0095",
    "name": "Cable Wrist Curl",
    "category": "forearms",
    "categoryDisplay": "Forearms & Grip",
    "targetMuscle": "Forearms",
    "targetMuscleKey": "forearms",
    "targetMuscles": [
      "Wrist Flexors",
      "Brachioradialis",
      "Wrist Extensors"
    ],
    "secondaryMuscles": [
      "Grip",
      "Biceps"
    ],
    "difficulty": "Beginner",
    "equipment": "Cable",
    "instructions": [
      "Start out by placing a flat bench in front of a low pulley cable that has a straight bar attachment.",
      "Use your arms to grab the cable bar with a narrow to shoulder width supinated grip (palms up) and bring them up so that your forearms are resting against the top of your thighs. Your wrists should be hanging just beyond your knees.",
      "Start out by curling your wrist upwards and exhaling. Keep the contraction for a second.",
      "Slowly lower your wrists back down to the starting position while inhaling.",
      "Your forearms should be stationary as your wrist is the only movement needed to perform this exercise.",
      "Repeat for the recommended amount of repetitions."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the forearms throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the forearms."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/cable-wrist-curl.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/cable-wrist-curl.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/cable-wrist-curl.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0096",
    "name": "Dumbbell Finger Curls",
    "category": "forearms",
    "categoryDisplay": "Forearms & Grip",
    "targetMuscle": "Forearms",
    "targetMuscleKey": "forearms",
    "targetMuscles": [
      "Wrist Flexors",
      "Brachioradialis",
      "Wrist Extensors"
    ],
    "secondaryMuscles": [
      "Grip",
      "Biceps"
    ],
    "difficulty": "Beginner",
    "equipment": "Dumbbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing dumbbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your forearms.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your forearms vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the forearms throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the forearms."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/dumbbell-finger-curls.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/dumbbell-finger-curls.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/dumbbell-finger-curls.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0097",
    "name": "Dumbbell Lying Pronation On Floor",
    "category": "forearms",
    "categoryDisplay": "Forearms & Grip",
    "targetMuscle": "Forearms",
    "targetMuscleKey": "forearms",
    "targetMuscles": [
      "Wrist Flexors",
      "Brachioradialis",
      "Wrist Extensors"
    ],
    "secondaryMuscles": [
      "Grip",
      "Biceps"
    ],
    "difficulty": "Intermediate",
    "equipment": "Dumbbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing dumbbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your forearms.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your forearms vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the forearms throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the forearms."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/dumbbell-lying-pronation-on-floor.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/dumbbell-lying-pronation-on-floor.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/dumbbell-lying-pronation-on-floor.gif",
    "caloriesBurnEstimatePerHour": 390
  },
  {
    "id": "EX-0098",
    "name": "Dumbbell Lying Pronation",
    "category": "forearms",
    "categoryDisplay": "Forearms & Grip",
    "targetMuscle": "Forearms",
    "targetMuscleKey": "forearms",
    "targetMuscles": [
      "Wrist Flexors",
      "Brachioradialis",
      "Wrist Extensors"
    ],
    "secondaryMuscles": [
      "Grip",
      "Biceps"
    ],
    "difficulty": "Intermediate",
    "equipment": "Dumbbell",
    "instructions": [
      "Lie on a flat bench face down with one arm holding a dumbbell and the other hand on top of the bench folded so that you can rest your head on it.",
      "Bend the elbows of the arm holding the dumbbell so that it creates a 90-degree angle between the upper arm and the forearm.",
      "Now raise the upper arm so that the forearm is perpendicular to the floor and the upper arm is perpendicular to your torso. Tip: The upper arm should be parallel to the floor and also creating a 90-degree angle with your torso. This will be your starting position.",
      "As you breathe out, externally rotate your forearm so that the dumbbell is lifted forward as you maintain the 90 degree angle bend between the upper arms and the forearm. You will continue this external rotation until the forearm is parallel to the floor. At this point you will hold the contraction for a second.",
      "As you breathe in, slowly go back to the starting position.",
      "Repeat for the recommended amount of repetitions."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the forearms throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the forearms."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/dumbbell-lying-pronation.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/dumbbell-lying-pronation.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/dumbbell-lying-pronation.gif",
    "caloriesBurnEstimatePerHour": 390
  },
  {
    "id": "EX-0099",
    "name": "Dumbbell Lying Supination On Floor",
    "category": "forearms",
    "categoryDisplay": "Forearms & Grip",
    "targetMuscle": "Forearms",
    "targetMuscleKey": "forearms",
    "targetMuscles": [
      "Wrist Flexors",
      "Brachioradialis",
      "Wrist Extensors"
    ],
    "secondaryMuscles": [
      "Grip",
      "Biceps"
    ],
    "difficulty": "Intermediate",
    "equipment": "Dumbbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing dumbbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your forearms.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your forearms vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the forearms throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the forearms."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/dumbbell-lying-supination-on-floor.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/dumbbell-lying-supination-on-floor.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/dumbbell-lying-supination-on-floor.gif",
    "caloriesBurnEstimatePerHour": 390
  },
  {
    "id": "EX-0100",
    "name": "Dumbbell Lying Supination",
    "category": "forearms",
    "categoryDisplay": "Forearms & Grip",
    "targetMuscle": "Forearms",
    "targetMuscleKey": "forearms",
    "targetMuscles": [
      "Wrist Flexors",
      "Brachioradialis",
      "Wrist Extensors"
    ],
    "secondaryMuscles": [
      "Grip",
      "Biceps"
    ],
    "difficulty": "Intermediate",
    "equipment": "Dumbbell",
    "instructions": [
      "Lie sideways on a flat bench with one arm holding a dumbbell and the other hand on top of the bench folded so that you can rest your head on it.",
      "Bend the elbows of the arm holding the dumbbell so that it creates a 90-degree angle between the upper arm and the forearm.",
      "Now raise the upper arm so that the forearm is parallel to the floor and perpendicular to your torso (Tip: So the forearm will be directly in front of you). The upper arm will be stationary by your torso and should be parallel to the floor (aligned with your torso at all times). This will be your starting position.",
      "As you breathe out, externally rotate your forearm so that the dumbbell is lifted up in a semicircle motion as you maintain the 90 degree angle bend between the upper arms and the forearm. You will continue this external rotation until the forearm is perpendicular to the floor and the torso pointing towards the ceiling. At this point you will hold the contraction for a second.",
      "As you breathe in, slowly go back to the starting position.",
      "Repeat for the recommended amount of repetitions and then switch to the other arm."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the forearms throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the forearms."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/dumbbell-lying-supination.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/dumbbell-lying-supination.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/dumbbell-lying-supination.gif",
    "caloriesBurnEstimatePerHour": 390
  },
  {
    "id": "EX-0101",
    "name": "Dumbbell One Arm Reverse Wrist Curl",
    "category": "forearms",
    "categoryDisplay": "Forearms & Grip",
    "targetMuscle": "Forearms",
    "targetMuscleKey": "forearms",
    "targetMuscles": [
      "Wrist Flexors",
      "Brachioradialis",
      "Wrist Extensors"
    ],
    "secondaryMuscles": [
      "Grip",
      "Biceps"
    ],
    "difficulty": "Advanced",
    "equipment": "Dumbbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing dumbbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your forearms.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your forearms vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the forearms throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the forearms."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/dumbbell-one-arm-reverse-wrist-curl.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/dumbbell-one-arm-reverse-wrist-curl.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/dumbbell-one-arm-reverse-wrist-curl.gif",
    "caloriesBurnEstimatePerHour": 460
  },
  {
    "id": "EX-0102",
    "name": "Dumbbell One Arm Seated Neutral Wrist Curl",
    "category": "forearms",
    "categoryDisplay": "Forearms & Grip",
    "targetMuscle": "Forearms",
    "targetMuscleKey": "forearms",
    "targetMuscles": [
      "Wrist Flexors",
      "Brachioradialis",
      "Wrist Extensors"
    ],
    "secondaryMuscles": [
      "Grip",
      "Biceps"
    ],
    "difficulty": "Advanced",
    "equipment": "Dumbbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing dumbbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your forearms.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your forearms vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the forearms throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the forearms."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/dumbbell-one-arm-seated-neutral-wrist-curl.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/dumbbell-one-arm-seated-neutral-wrist-curl.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/dumbbell-one-arm-seated-neutral-wrist-curl.gif",
    "caloriesBurnEstimatePerHour": 460
  },
  {
    "id": "EX-0103",
    "name": "Dumbbell One Arm Wrist Curl",
    "category": "forearms",
    "categoryDisplay": "Forearms & Grip",
    "targetMuscle": "Forearms",
    "targetMuscleKey": "forearms",
    "targetMuscles": [
      "Wrist Flexors",
      "Brachioradialis",
      "Wrist Extensors"
    ],
    "secondaryMuscles": [
      "Grip",
      "Biceps"
    ],
    "difficulty": "Advanced",
    "equipment": "Dumbbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing dumbbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your forearms.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your forearms vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the forearms throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the forearms."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/dumbbell-one-arm-wrist-curl.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/dumbbell-one-arm-wrist-curl.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/dumbbell-one-arm-wrist-curl.gif",
    "caloriesBurnEstimatePerHour": 460
  },
  {
    "id": "EX-0104",
    "name": "Dumbbell Over Bench One Arm Reverse Wrist Curl",
    "category": "forearms",
    "categoryDisplay": "Forearms & Grip",
    "targetMuscle": "Forearms",
    "targetMuscleKey": "forearms",
    "targetMuscles": [
      "Wrist Flexors",
      "Brachioradialis",
      "Wrist Extensors"
    ],
    "secondaryMuscles": [
      "Grip",
      "Biceps"
    ],
    "difficulty": "Advanced",
    "equipment": "Dumbbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing dumbbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your forearms.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your forearms vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the forearms throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the forearms."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/dumbbell-over-bench-one-arm-reverse-wrist-curl.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/dumbbell-over-bench-one-arm-reverse-wrist-curl.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/dumbbell-over-bench-one-arm-reverse-wrist-curl.gif",
    "caloriesBurnEstimatePerHour": 460
  },
  {
    "id": "EX-0105",
    "name": "Dumbbell Over Bench One Arm Wrist Curl",
    "category": "forearms",
    "categoryDisplay": "Forearms & Grip",
    "targetMuscle": "Forearms",
    "targetMuscleKey": "forearms",
    "targetMuscles": [
      "Wrist Flexors",
      "Brachioradialis",
      "Wrist Extensors"
    ],
    "secondaryMuscles": [
      "Grip",
      "Biceps"
    ],
    "difficulty": "Advanced",
    "equipment": "Dumbbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing dumbbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your forearms.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your forearms vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the forearms throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the forearms."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/dumbbell-over-bench-one-arm-wrist-curl.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/dumbbell-over-bench-one-arm-wrist-curl.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/dumbbell-over-bench-one-arm-wrist-curl.gif",
    "caloriesBurnEstimatePerHour": 460
  },
  {
    "id": "EX-0106",
    "name": "Dumbbell Over Bench Revers Wrist Curl",
    "category": "forearms",
    "categoryDisplay": "Forearms & Grip",
    "targetMuscle": "Forearms",
    "targetMuscleKey": "forearms",
    "targetMuscles": [
      "Wrist Flexors",
      "Brachioradialis",
      "Wrist Extensors"
    ],
    "secondaryMuscles": [
      "Grip",
      "Biceps"
    ],
    "difficulty": "Beginner",
    "equipment": "Dumbbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing dumbbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your forearms.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your forearms vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the forearms throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the forearms."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/dumbbell-over-bench-revers-wrist-curl.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/dumbbell-over-bench-revers-wrist-curl.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/dumbbell-over-bench-revers-wrist-curl.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0107",
    "name": "Dumbbell Over Bench Wrist Curl",
    "category": "forearms",
    "categoryDisplay": "Forearms & Grip",
    "targetMuscle": "Forearms",
    "targetMuscleKey": "forearms",
    "targetMuscles": [
      "Wrist Flexors",
      "Brachioradialis",
      "Wrist Extensors"
    ],
    "secondaryMuscles": [
      "Grip",
      "Biceps"
    ],
    "difficulty": "Beginner",
    "equipment": "Dumbbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing dumbbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your forearms.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your forearms vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the forearms throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the forearms."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/dumbbell-over-bench-wrist-curl.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/dumbbell-over-bench-wrist-curl.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/dumbbell-over-bench-wrist-curl.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0108",
    "name": "Dumbbell Reverse Wrist Curl",
    "category": "forearms",
    "categoryDisplay": "Forearms & Grip",
    "targetMuscle": "Forearms",
    "targetMuscleKey": "forearms",
    "targetMuscles": [
      "Wrist Flexors",
      "Brachioradialis",
      "Wrist Extensors"
    ],
    "secondaryMuscles": [
      "Grip",
      "Biceps"
    ],
    "difficulty": "Beginner",
    "equipment": "Dumbbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing dumbbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your forearms.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your forearms vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the forearms throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the forearms."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/dumbbell-reverse-wrist-curl.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/dumbbell-reverse-wrist-curl.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/dumbbell-reverse-wrist-curl.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0109",
    "name": "Dumbbell Seated One Arm Rotate",
    "category": "forearms",
    "categoryDisplay": "Forearms & Grip",
    "targetMuscle": "Forearms",
    "targetMuscleKey": "forearms",
    "targetMuscles": [
      "Wrist Flexors",
      "Brachioradialis",
      "Wrist Extensors"
    ],
    "secondaryMuscles": [
      "Grip",
      "Biceps"
    ],
    "difficulty": "Advanced",
    "equipment": "Dumbbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing dumbbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your forearms.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your forearms vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the forearms throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the forearms."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/dumbbell-seated-one-arm-rotate.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/dumbbell-seated-one-arm-rotate.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/dumbbell-seated-one-arm-rotate.gif",
    "caloriesBurnEstimatePerHour": 460
  },
  {
    "id": "EX-0110",
    "name": "Dumbbell Seated Palms Up Wrist Curl",
    "category": "forearms",
    "categoryDisplay": "Forearms & Grip",
    "targetMuscle": "Forearms",
    "targetMuscleKey": "forearms",
    "targetMuscles": [
      "Wrist Flexors",
      "Brachioradialis",
      "Wrist Extensors"
    ],
    "secondaryMuscles": [
      "Grip",
      "Biceps"
    ],
    "difficulty": "Beginner",
    "equipment": "Dumbbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing dumbbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your forearms.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your forearms vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the forearms throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the forearms."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/dumbbell-seated-palms-up-wrist-curl.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/dumbbell-seated-palms-up-wrist-curl.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/dumbbell-seated-palms-up-wrist-curl.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0111",
    "name": "Finger Curls",
    "category": "forearms",
    "categoryDisplay": "Forearms & Grip",
    "targetMuscle": "Forearms",
    "targetMuscleKey": "forearms",
    "targetMuscles": [
      "Wrist Flexors",
      "Brachioradialis",
      "Wrist Extensors"
    ],
    "secondaryMuscles": [
      "Grip",
      "Biceps"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Hold a barbell with both hands and your palms facing up; hands spaced about shoulder width.",
      "Place your feet flat on the floor, at a distance that is slightly wider than shoulder width apart. This will be your starting position.",
      "Lower the bar as far as possible by extending the fingers. Allowing the bar to roll down the hands, catch the bar with the final joint in the fingers.",
      "Now curl bar up as high as possible by closing your hands while exhaling. Hold the contraction at the top."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the forearms throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the forearms."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/finger-curls.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/finger-curls.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/forearms/finger-curls.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0112",
    "name": "All Fours Squad Stretch",
    "category": "quads",
    "categoryDisplay": "Quadriceps Power",
    "targetMuscle": "Quadriceps",
    "targetMuscleKey": "quads",
    "targetMuscles": [
      "Rectus Femoris",
      "Vastus Lateralis",
      "Vastus Medialis"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Calves",
      "Core"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your quadriceps.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your quadriceps vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the quadriceps throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the quadriceps."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/all-fours-squad-stretch.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/all-fours-squad-stretch.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/all-fours-squad-stretch.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0113",
    "name": "Assisted Prone Lying Quads Stretch",
    "category": "quads",
    "categoryDisplay": "Quadriceps Power",
    "targetMuscle": "Quadriceps",
    "targetMuscleKey": "quads",
    "targetMuscles": [
      "Rectus Femoris",
      "Vastus Lateralis",
      "Vastus Medialis"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Calves",
      "Core"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your quadriceps.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your quadriceps vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the quadriceps throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the quadriceps."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/assisted-prone-lying-quads-stretch.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/assisted-prone-lying-quads-stretch.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/assisted-prone-lying-quads-stretch.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0114",
    "name": "Backward Jump",
    "category": "quads",
    "categoryDisplay": "Quadriceps Power",
    "targetMuscle": "Quadriceps",
    "targetMuscleKey": "quads",
    "targetMuscles": [
      "Rectus Femoris",
      "Vastus Lateralis",
      "Vastus Medialis"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Calves",
      "Core"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your quadriceps.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your quadriceps vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the quadriceps throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the quadriceps."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/backward-jump.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/backward-jump.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/backward-jump.gif",
    "caloriesBurnEstimatePerHour": 420
  },
  {
    "id": "EX-0115",
    "name": "Balance Board",
    "category": "quads",
    "categoryDisplay": "Quadriceps Power",
    "targetMuscle": "Quadriceps",
    "targetMuscleKey": "quads",
    "targetMuscles": [
      "Rectus Femoris",
      "Vastus Lateralis",
      "Vastus Medialis"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Calves",
      "Core"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Place a balance board in front of you.",
      "Stand up on it and try to balance yourself.",
      "Hold the balance for as long as desired."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the quadriceps throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the quadriceps."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/balance-board.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/balance-board.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/balance-board.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0116",
    "name": "Band One Arm Single Leg Split Squat",
    "category": "quads",
    "categoryDisplay": "Quadriceps Power",
    "targetMuscle": "Quadriceps",
    "targetMuscleKey": "quads",
    "targetMuscles": [
      "Rectus Femoris",
      "Vastus Lateralis",
      "Vastus Medialis"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Calves",
      "Core"
    ],
    "difficulty": "Advanced",
    "equipment": "Barbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing barbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your quadriceps.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your quadriceps vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the quadriceps throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the quadriceps."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/band-one-arm-single-leg-split-squat.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/band-one-arm-single-leg-split-squat.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/band-one-arm-single-leg-split-squat.gif",
    "caloriesBurnEstimatePerHour": 620
  },
  {
    "id": "EX-0117",
    "name": "Band Single Leg Split Squat",
    "category": "quads",
    "categoryDisplay": "Quadriceps Power",
    "targetMuscle": "Quadriceps",
    "targetMuscleKey": "quads",
    "targetMuscles": [
      "Rectus Femoris",
      "Vastus Lateralis",
      "Vastus Medialis"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Calves",
      "Core"
    ],
    "difficulty": "Intermediate",
    "equipment": "Barbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing barbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your quadriceps.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your quadriceps vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the quadriceps throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the quadriceps."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/band-single-leg-split-squat.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/band-single-leg-split-squat.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/band-single-leg-split-squat.gif",
    "caloriesBurnEstimatePerHour": 520
  },
  {
    "id": "EX-0118",
    "name": "Barbell Bench Front Squat",
    "category": "quads",
    "categoryDisplay": "Quadriceps Power",
    "targetMuscle": "Quadriceps",
    "targetMuscleKey": "quads",
    "targetMuscles": [
      "Rectus Femoris",
      "Vastus Lateralis",
      "Vastus Medialis"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Calves",
      "Core"
    ],
    "difficulty": "Intermediate",
    "equipment": "Barbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing barbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your quadriceps.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your quadriceps vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the quadriceps throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the quadriceps."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/barbell-bench-front-squat.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/barbell-bench-front-squat.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/barbell-bench-front-squat.gif",
    "caloriesBurnEstimatePerHour": 520
  },
  {
    "id": "EX-0119",
    "name": "Barbell Bench Squat",
    "category": "quads",
    "categoryDisplay": "Quadriceps Power",
    "targetMuscle": "Quadriceps",
    "targetMuscleKey": "quads",
    "targetMuscles": [
      "Rectus Femoris",
      "Vastus Lateralis",
      "Vastus Medialis"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Calves",
      "Core"
    ],
    "difficulty": "Intermediate",
    "equipment": "Barbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing barbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your quadriceps.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your quadriceps vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the quadriceps throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the quadriceps."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/barbell-bench-squat.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/barbell-bench-squat.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/barbell-bench-squat.gif",
    "caloriesBurnEstimatePerHour": 520
  },
  {
    "id": "EX-0120",
    "name": "Barbell Clean And Press",
    "category": "quads",
    "categoryDisplay": "Quadriceps Power",
    "targetMuscle": "Quadriceps",
    "targetMuscleKey": "quads",
    "targetMuscles": [
      "Rectus Femoris",
      "Vastus Lateralis",
      "Vastus Medialis"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Calves",
      "Core"
    ],
    "difficulty": "Intermediate",
    "equipment": "Barbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing barbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your quadriceps.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your quadriceps vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the quadriceps throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the quadriceps."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/barbell-clean-and-press.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/barbell-clean-and-press.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/barbell-clean-and-press.gif",
    "caloriesBurnEstimatePerHour": 520
  },
  {
    "id": "EX-0121",
    "name": "Barbell One Leg Squat",
    "category": "quads",
    "categoryDisplay": "Quadriceps Power",
    "targetMuscle": "Quadriceps",
    "targetMuscleKey": "quads",
    "targetMuscles": [
      "Rectus Femoris",
      "Vastus Lateralis",
      "Vastus Medialis"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Calves",
      "Core"
    ],
    "difficulty": "Intermediate",
    "equipment": "Barbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing barbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your quadriceps.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your quadriceps vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the quadriceps throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the quadriceps."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/barbell-one-leg-squat.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/barbell-one-leg-squat.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/barbell-one-leg-squat.gif",
    "caloriesBurnEstimatePerHour": 520
  },
  {
    "id": "EX-0122",
    "name": "Barbell Overhead Squat",
    "category": "quads",
    "categoryDisplay": "Quadriceps Power",
    "targetMuscle": "Quadriceps",
    "targetMuscleKey": "quads",
    "targetMuscles": [
      "Rectus Femoris",
      "Vastus Lateralis",
      "Vastus Medialis"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Calves",
      "Core"
    ],
    "difficulty": "Advanced",
    "equipment": "Barbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing barbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your quadriceps.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your quadriceps vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the quadriceps throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the quadriceps."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/barbell-overhead-squat.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/barbell-overhead-squat.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/barbell-overhead-squat.gif",
    "caloriesBurnEstimatePerHour": 620
  },
  {
    "id": "EX-0123",
    "name": "Barbell Side Split Squat V 2",
    "category": "quads",
    "categoryDisplay": "Quadriceps Power",
    "targetMuscle": "Quadriceps",
    "targetMuscleKey": "quads",
    "targetMuscles": [
      "Rectus Femoris",
      "Vastus Lateralis",
      "Vastus Medialis"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Calves",
      "Core"
    ],
    "difficulty": "Intermediate",
    "equipment": "Barbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing barbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your quadriceps.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your quadriceps vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the quadriceps throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the quadriceps."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/barbell-side-split-squat-v-2.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/barbell-side-split-squat-v-2.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/barbell-side-split-squat-v-2.gif",
    "caloriesBurnEstimatePerHour": 520
  },
  {
    "id": "EX-0124",
    "name": "Barbell Side Split Squat",
    "category": "quads",
    "categoryDisplay": "Quadriceps Power",
    "targetMuscle": "Quadriceps",
    "targetMuscleKey": "quads",
    "targetMuscles": [
      "Rectus Femoris",
      "Vastus Lateralis",
      "Vastus Medialis"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Calves",
      "Core"
    ],
    "difficulty": "Intermediate",
    "equipment": "Barbell",
    "instructions": [
      "Stand up straight while holding a barbell placed on the back of your shoulders (slightly below the neck). Your feet should be placed wide apart with the foot of the lead leg angled out to the side. This will be your starting position.",
      "Lower your body towards the side of your angled foot by bending the knee and hip of your lead leg and while keeping the opposite leg only slightly bent. Breathe in as you lower your body.",
      "Return to the starting position by extending the hip and knee of the lead leg. Breathe out as you perform this movement.",
      "After performing the recommended amount of reps, repeat the movement with the opposite leg."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the quadriceps throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the quadriceps."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/barbell-side-split-squat.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/barbell-side-split-squat.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/barbell-side-split-squat.gif",
    "caloriesBurnEstimatePerHour": 520
  },
  {
    "id": "EX-0125",
    "name": "Barbell Single Leg Split Squat",
    "category": "quads",
    "categoryDisplay": "Quadriceps Power",
    "targetMuscle": "Quadriceps",
    "targetMuscleKey": "quads",
    "targetMuscles": [
      "Rectus Femoris",
      "Vastus Lateralis",
      "Vastus Medialis"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Calves",
      "Core"
    ],
    "difficulty": "Intermediate",
    "equipment": "Barbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing barbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your quadriceps.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your quadriceps vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the quadriceps throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the quadriceps."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/barbell-single-leg-split-squat.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/barbell-single-leg-split-squat.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/barbell-single-leg-split-squat.gif",
    "caloriesBurnEstimatePerHour": 520
  },
  {
    "id": "EX-0126",
    "name": "Barbell Split Squat V 2",
    "category": "quads",
    "categoryDisplay": "Quadriceps Power",
    "targetMuscle": "Quadriceps",
    "targetMuscleKey": "quads",
    "targetMuscles": [
      "Rectus Femoris",
      "Vastus Lateralis",
      "Vastus Medialis"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Calves",
      "Core"
    ],
    "difficulty": "Intermediate",
    "equipment": "Barbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing barbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your quadriceps.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your quadriceps vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the quadriceps throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the quadriceps."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/barbell-split-squat-v-2.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/barbell-split-squat-v-2.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/barbell-split-squat-v-2.gif",
    "caloriesBurnEstimatePerHour": 520
  },
  {
    "id": "EX-0127",
    "name": "Barbell Squat Jump Step Rear Lunge",
    "category": "quads",
    "categoryDisplay": "Quadriceps Power",
    "targetMuscle": "Quadriceps",
    "targetMuscleKey": "quads",
    "targetMuscles": [
      "Rectus Femoris",
      "Vastus Lateralis",
      "Vastus Medialis"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Calves",
      "Core"
    ],
    "difficulty": "Intermediate",
    "equipment": "Barbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing barbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your quadriceps.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your quadriceps vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the quadriceps throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the quadriceps."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/barbell-squat-jump-step-rear-lunge.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/barbell-squat-jump-step-rear-lunge.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/barbell-squat-jump-step-rear-lunge.gif",
    "caloriesBurnEstimatePerHour": 520
  },
  {
    "id": "EX-0128",
    "name": "Barbell Squat On Knees",
    "category": "quads",
    "categoryDisplay": "Quadriceps Power",
    "targetMuscle": "Quadriceps",
    "targetMuscleKey": "quads",
    "targetMuscles": [
      "Rectus Femoris",
      "Vastus Lateralis",
      "Vastus Medialis"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Calves",
      "Core"
    ],
    "difficulty": "Intermediate",
    "equipment": "Barbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing barbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your quadriceps.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your quadriceps vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the quadriceps throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the quadriceps."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/barbell-squat-on-knees.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/barbell-squat-on-knees.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/barbell-squat-on-knees.gif",
    "caloriesBurnEstimatePerHour": 520
  },
  {
    "id": "EX-0129",
    "name": "Barbell Wide Squat",
    "category": "quads",
    "categoryDisplay": "Quadriceps Power",
    "targetMuscle": "Quadriceps",
    "targetMuscleKey": "quads",
    "targetMuscles": [
      "Rectus Femoris",
      "Vastus Lateralis",
      "Vastus Medialis"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Calves",
      "Core"
    ],
    "difficulty": "Intermediate",
    "equipment": "Barbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing barbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your quadriceps.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your quadriceps vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the quadriceps throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the quadriceps."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/barbell-wide-squat.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/barbell-wide-squat.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/barbell-wide-squat.gif",
    "caloriesBurnEstimatePerHour": 520
  },
  {
    "id": "EX-0130",
    "name": "Chair Leg Extended Stretch",
    "category": "quads",
    "categoryDisplay": "Quadriceps Power",
    "targetMuscle": "Quadriceps",
    "targetMuscleKey": "quads",
    "targetMuscles": [
      "Rectus Femoris",
      "Vastus Lateralis",
      "Vastus Medialis"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Calves",
      "Core"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Sit upright in a chair and grip the seat on the sides.",
      "Raise one leg, extending the knee, flexing the ankle as you do so.",
      "Slowly move that leg outward as far as you can, and then back to the center and down.",
      "Repeat for your other leg."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the quadriceps throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the quadriceps."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/chair-leg-extended-stretch.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/chair-leg-extended-stretch.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/chair-leg-extended-stretch.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0131",
    "name": "Dumbbell Goblet Squat",
    "category": "quads",
    "categoryDisplay": "Quadriceps Power",
    "targetMuscle": "Quadriceps",
    "targetMuscleKey": "quads",
    "targetMuscles": [
      "Rectus Femoris",
      "Vastus Lateralis",
      "Vastus Medialis"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Calves",
      "Core"
    ],
    "difficulty": "Intermediate",
    "equipment": "Dumbbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing dumbbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your quadriceps.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your quadriceps vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the quadriceps throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the quadriceps."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/dumbbell-goblet-squat.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/dumbbell-goblet-squat.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/dumbbell-goblet-squat.gif",
    "caloriesBurnEstimatePerHour": 520
  },
  {
    "id": "EX-0132",
    "name": "Dumbbell Single Leg Split Squat",
    "category": "quads",
    "categoryDisplay": "Quadriceps Power",
    "targetMuscle": "Quadriceps",
    "targetMuscleKey": "quads",
    "targetMuscles": [
      "Rectus Femoris",
      "Vastus Lateralis",
      "Vastus Medialis"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Calves",
      "Core"
    ],
    "difficulty": "Intermediate",
    "equipment": "Dumbbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing dumbbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your quadriceps.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your quadriceps vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the quadriceps throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the quadriceps."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/dumbbell-single-leg-split-squat.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/dumbbell-single-leg-split-squat.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/dumbbell-single-leg-split-squat.gif",
    "caloriesBurnEstimatePerHour": 520
  },
  {
    "id": "EX-0133",
    "name": "Dumbbell Step Up Lunge",
    "category": "quads",
    "categoryDisplay": "Quadriceps Power",
    "targetMuscle": "Quadriceps",
    "targetMuscleKey": "quads",
    "targetMuscles": [
      "Rectus Femoris",
      "Vastus Lateralis",
      "Vastus Medialis"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Calves",
      "Core"
    ],
    "difficulty": "Intermediate",
    "equipment": "Dumbbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing dumbbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your quadriceps.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your quadriceps vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the quadriceps throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the quadriceps."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/dumbbell-step-up-lunge.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/dumbbell-step-up-lunge.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/dumbbell-step-up-lunge.gif",
    "caloriesBurnEstimatePerHour": 520
  },
  {
    "id": "EX-0134",
    "name": "Dumbbell Step Up Split Squat",
    "category": "quads",
    "categoryDisplay": "Quadriceps Power",
    "targetMuscle": "Quadriceps",
    "targetMuscleKey": "quads",
    "targetMuscles": [
      "Rectus Femoris",
      "Vastus Lateralis",
      "Vastus Medialis"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Calves",
      "Core"
    ],
    "difficulty": "Intermediate",
    "equipment": "Dumbbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing dumbbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your quadriceps.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your quadriceps vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the quadriceps throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the quadriceps."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/dumbbell-step-up-split-squat.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/dumbbell-step-up-split-squat.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/dumbbell-step-up-split-squat.gif",
    "caloriesBurnEstimatePerHour": 520
  },
  {
    "id": "EX-0135",
    "name": "Dumbbell Supported Squat",
    "category": "quads",
    "categoryDisplay": "Quadriceps Power",
    "targetMuscle": "Quadriceps",
    "targetMuscleKey": "quads",
    "targetMuscles": [
      "Rectus Femoris",
      "Vastus Lateralis",
      "Vastus Medialis"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Calves",
      "Core"
    ],
    "difficulty": "Intermediate",
    "equipment": "Dumbbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing dumbbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your quadriceps.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your quadriceps vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the quadriceps throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the quadriceps."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/dumbbell-supported-squat.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/dumbbell-supported-squat.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/dumbbell-supported-squat.gif",
    "caloriesBurnEstimatePerHour": 520
  },
  {
    "id": "EX-0136",
    "name": "Farmers Walk",
    "category": "quads",
    "categoryDisplay": "Quadriceps Power",
    "targetMuscle": "Quadriceps",
    "targetMuscleKey": "quads",
    "targetMuscles": [
      "Rectus Femoris",
      "Vastus Lateralis",
      "Vastus Medialis"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Calves",
      "Core"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "There are various implements that can be used for the farmers walk. These can also be performed with heavy dumbbells or short bars if these implements aren't available. Begin by standing between the implements.",
      "After gripping the handles, lift them up by driving through your heels, keeping your back straight and your head up.",
      "Walk taking short, quick steps, and don't forget to breathe. Move for a given distance, typically 50-100 feet, as fast as possible."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the quadriceps throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the quadriceps."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/farmers-walk.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/farmers-walk.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/farmers-walk.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0137",
    "name": "Forward Jump",
    "category": "quads",
    "categoryDisplay": "Quadriceps Power",
    "targetMuscle": "Quadriceps",
    "targetMuscleKey": "quads",
    "targetMuscles": [
      "Rectus Femoris",
      "Vastus Lateralis",
      "Vastus Medialis"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Calves",
      "Core"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your quadriceps.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your quadriceps vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the quadriceps throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the quadriceps."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/forward-jump.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/forward-jump.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/forward-jump.gif",
    "caloriesBurnEstimatePerHour": 420
  },
  {
    "id": "EX-0138",
    "name": "Intermediate Hip Flexor And Quad Stretch",
    "category": "quads",
    "categoryDisplay": "Quadriceps Power",
    "targetMuscle": "Quadriceps",
    "targetMuscleKey": "quads",
    "targetMuscles": [
      "Rectus Femoris",
      "Vastus Lateralis",
      "Vastus Medialis"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Calves",
      "Core"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your quadriceps.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your quadriceps vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the quadriceps throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the quadriceps."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/intermediate-hip-flexor-and-quad-stretch.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/intermediate-hip-flexor-and-quad-stretch.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/intermediate-hip-flexor-and-quad-stretch.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0139",
    "name": "Lever Alternate Leg Press",
    "category": "quads",
    "categoryDisplay": "Quadriceps Power",
    "targetMuscle": "Quadriceps",
    "targetMuscleKey": "quads",
    "targetMuscles": [
      "Rectus Femoris",
      "Vastus Lateralis",
      "Vastus Medialis"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Calves",
      "Core"
    ],
    "difficulty": "Beginner",
    "equipment": "Machine",
    "instructions": [
      "Set up in a solid, stable base position utilizing machine. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your quadriceps.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your quadriceps vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the quadriceps throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the quadriceps."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/lever-alternate-leg-press.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/lever-alternate-leg-press.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/lever-alternate-leg-press.gif",
    "caloriesBurnEstimatePerHour": 420
  },
  {
    "id": "EX-0140",
    "name": "Lever Leg Extension",
    "category": "quads",
    "categoryDisplay": "Quadriceps Power",
    "targetMuscle": "Quadriceps",
    "targetMuscleKey": "quads",
    "targetMuscles": [
      "Rectus Femoris",
      "Vastus Lateralis",
      "Vastus Medialis"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Calves",
      "Core"
    ],
    "difficulty": "Beginner",
    "equipment": "Machine",
    "instructions": [
      "Set up in a solid, stable base position utilizing machine. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your quadriceps.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your quadriceps vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the quadriceps throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the quadriceps."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/lever-leg-extension.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/lever-leg-extension.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/lever-leg-extension.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0141",
    "name": "Lying Side Quads Stretch",
    "category": "quads",
    "categoryDisplay": "Quadriceps Power",
    "targetMuscle": "Quadriceps",
    "targetMuscleKey": "quads",
    "targetMuscles": [
      "Rectus Femoris",
      "Vastus Lateralis",
      "Vastus Medialis"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Calves",
      "Core"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your quadriceps.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your quadriceps vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the quadriceps throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the quadriceps."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/lying-side-quads-stretch.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/lying-side-quads-stretch.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/lying-side-quads-stretch.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0142",
    "name": "Quads",
    "category": "quads",
    "categoryDisplay": "Quadriceps Power",
    "targetMuscle": "Quadriceps",
    "targetMuscleKey": "quads",
    "targetMuscles": [
      "Rectus Femoris",
      "Vastus Lateralis",
      "Vastus Medialis"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Calves",
      "Core"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your quadriceps.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your quadriceps vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the quadriceps throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the quadriceps."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/quads.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/quads.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/quads.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0143",
    "name": "Quick Feet V 2",
    "category": "quads",
    "categoryDisplay": "Quadriceps Power",
    "targetMuscle": "Quadriceps",
    "targetMuscleKey": "quads",
    "targetMuscles": [
      "Rectus Femoris",
      "Vastus Lateralis",
      "Vastus Medialis"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Calves",
      "Core"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your quadriceps.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your quadriceps vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the quadriceps throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the quadriceps."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/quick-feet-v-2.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/quick-feet-v-2.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/quick-feet-v-2.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0144",
    "name": "Resistance Band Leg Extension",
    "category": "quads",
    "categoryDisplay": "Quadriceps Power",
    "targetMuscle": "Quadriceps",
    "targetMuscleKey": "quads",
    "targetMuscles": [
      "Rectus Femoris",
      "Vastus Lateralis",
      "Vastus Medialis"
    ],
    "secondaryMuscles": [
      "Glutes",
      "Calves",
      "Core"
    ],
    "difficulty": "Beginner",
    "equipment": "Resistance Band",
    "instructions": [
      "Set up in a solid, stable base position utilizing resistance band. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your quadriceps.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your quadriceps vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the quadriceps throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the quadriceps."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/resistance-band-leg-extension.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/resistance-band-leg-extension.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/quads/resistance-band-leg-extension.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0145",
    "name": "Ankle Circles",
    "category": "calves",
    "categoryDisplay": "Calves & Lower Leg",
    "targetMuscle": "Calves",
    "targetMuscleKey": "calves",
    "targetMuscles": [
      "Gastrocnemius (Lateral & Medial)",
      "Soleus"
    ],
    "secondaryMuscles": [
      "Tibialis Anterior",
      "Ankles"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Use a sturdy object like a squat rack to hold yourself.",
      "Lift the right leg in the air (just around 2 inches from the floor) and perform a circular motion with the big toe. Pretend that you are drawing a big circle with it. Tip: One circle equals 1 repetition. Breathe normally as you perform the movement.",
      "When you are done with the right foot, then repeat with the left leg."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the calves throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the calves."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/ankle-circles.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/ankle-circles.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/ankle-circles.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0146",
    "name": "Assisted Lying Calves Stretch",
    "category": "calves",
    "categoryDisplay": "Calves & Lower Leg",
    "targetMuscle": "Calves",
    "targetMuscleKey": "calves",
    "targetMuscles": [
      "Gastrocnemius (Lateral & Medial)",
      "Soleus"
    ],
    "secondaryMuscles": [
      "Tibialis Anterior",
      "Ankles"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your calves.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your calves vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the calves throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the calves."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/assisted-lying-calves-stretch.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/assisted-lying-calves-stretch.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/assisted-lying-calves-stretch.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0147",
    "name": "Band Single Leg Calf Raise",
    "category": "calves",
    "categoryDisplay": "Calves & Lower Leg",
    "targetMuscle": "Calves",
    "targetMuscleKey": "calves",
    "targetMuscles": [
      "Gastrocnemius (Lateral & Medial)",
      "Soleus"
    ],
    "secondaryMuscles": [
      "Tibialis Anterior",
      "Ankles"
    ],
    "difficulty": "Beginner",
    "equipment": "Resistance Band",
    "instructions": [
      "Set up in a solid, stable base position utilizing resistance band. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your calves.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your calves vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the calves throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the calves."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/band-single-leg-calf-raise.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/band-single-leg-calf-raise.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/band-single-leg-calf-raise.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0148",
    "name": "Band Single Leg Reverse Calf Raise",
    "category": "calves",
    "categoryDisplay": "Calves & Lower Leg",
    "targetMuscle": "Calves",
    "targetMuscleKey": "calves",
    "targetMuscles": [
      "Gastrocnemius (Lateral & Medial)",
      "Soleus"
    ],
    "secondaryMuscles": [
      "Tibialis Anterior",
      "Ankles"
    ],
    "difficulty": "Beginner",
    "equipment": "Resistance Band",
    "instructions": [
      "Set up in a solid, stable base position utilizing resistance band. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your calves.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your calves vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the calves throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the calves."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/band-single-leg-reverse-calf-raise.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/band-single-leg-reverse-calf-raise.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/band-single-leg-reverse-calf-raise.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0149",
    "name": "Band Two Legs Calf Raise Band Under Both Legs V 2",
    "category": "calves",
    "categoryDisplay": "Calves & Lower Leg",
    "targetMuscle": "Calves",
    "targetMuscleKey": "calves",
    "targetMuscles": [
      "Gastrocnemius (Lateral & Medial)",
      "Soleus"
    ],
    "secondaryMuscles": [
      "Tibialis Anterior",
      "Ankles"
    ],
    "difficulty": "Beginner",
    "equipment": "Resistance Band",
    "instructions": [
      "Set up in a solid, stable base position utilizing resistance band. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your calves.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your calves vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the calves throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the calves."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/band-two-legs-calf-raise-band-under-both-legs-v-2.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/band-two-legs-calf-raise-band-under-both-legs-v-2.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/band-two-legs-calf-raise-band-under-both-legs-v-2.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0150",
    "name": "Barbell Floor Calf Raise",
    "category": "calves",
    "categoryDisplay": "Calves & Lower Leg",
    "targetMuscle": "Calves",
    "targetMuscleKey": "calves",
    "targetMuscles": [
      "Gastrocnemius (Lateral & Medial)",
      "Soleus"
    ],
    "secondaryMuscles": [
      "Tibialis Anterior",
      "Ankles"
    ],
    "difficulty": "Intermediate",
    "equipment": "Barbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing barbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your calves.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your calves vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the calves throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the calves."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/barbell-floor-calf-raise.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/barbell-floor-calf-raise.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/barbell-floor-calf-raise.gif",
    "caloriesBurnEstimatePerHour": 390
  },
  {
    "id": "EX-0151",
    "name": "Barbell Seated Calf Raise 1371",
    "category": "calves",
    "categoryDisplay": "Calves & Lower Leg",
    "targetMuscle": "Calves",
    "targetMuscleKey": "calves",
    "targetMuscles": [
      "Gastrocnemius (Lateral & Medial)",
      "Soleus"
    ],
    "secondaryMuscles": [
      "Tibialis Anterior",
      "Ankles"
    ],
    "difficulty": "Intermediate",
    "equipment": "Barbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing barbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your calves.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your calves vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the calves throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the calves."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/barbell-seated-calf-raise-1371.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/barbell-seated-calf-raise-1371.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/barbell-seated-calf-raise-1371.gif",
    "caloriesBurnEstimatePerHour": 390
  },
  {
    "id": "EX-0152",
    "name": "Barbell Seated Calf Raise",
    "category": "calves",
    "categoryDisplay": "Calves & Lower Leg",
    "targetMuscle": "Calves",
    "targetMuscleKey": "calves",
    "targetMuscles": [
      "Gastrocnemius (Lateral & Medial)",
      "Soleus"
    ],
    "secondaryMuscles": [
      "Tibialis Anterior",
      "Ankles"
    ],
    "difficulty": "Intermediate",
    "equipment": "Barbell",
    "instructions": [
      "Place a block about 12 inches in front of a flat bench.",
      "Sit on the bench and place the ball of your feet on the block.",
      "Have someone place a barbell over your upper thighs about 3 inches above your knees and hold it there. This will be your starting position.",
      "Raise up on your toes as high as possible as you squeeze the calves and as you breathe out.",
      "After a second contraction, slowly go back to the starting position. Tip: To get maximum benefit stretch your calves as far as you can.",
      "Repeat for the recommended amount of repetitions."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the calves throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the calves."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/barbell-seated-calf-raise.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/barbell-seated-calf-raise.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/barbell-seated-calf-raise.gif",
    "caloriesBurnEstimatePerHour": 390
  },
  {
    "id": "EX-0153",
    "name": "Barbell Standing Calf Raise",
    "category": "calves",
    "categoryDisplay": "Calves & Lower Leg",
    "targetMuscle": "Calves",
    "targetMuscleKey": "calves",
    "targetMuscles": [
      "Gastrocnemius (Lateral & Medial)",
      "Soleus"
    ],
    "secondaryMuscles": [
      "Tibialis Anterior",
      "Ankles"
    ],
    "difficulty": "Intermediate",
    "equipment": "Barbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing barbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your calves.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your calves vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the calves throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the calves."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/barbell-standing-calf-raise.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/barbell-standing-calf-raise.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/barbell-standing-calf-raise.gif",
    "caloriesBurnEstimatePerHour": 390
  },
  {
    "id": "EX-0154",
    "name": "Barbell Standing Leg Calf Raise",
    "category": "calves",
    "categoryDisplay": "Calves & Lower Leg",
    "targetMuscle": "Calves",
    "targetMuscleKey": "calves",
    "targetMuscles": [
      "Gastrocnemius (Lateral & Medial)",
      "Soleus"
    ],
    "secondaryMuscles": [
      "Tibialis Anterior",
      "Ankles"
    ],
    "difficulty": "Intermediate",
    "equipment": "Barbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing barbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your calves.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your calves vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the calves throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the calves."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/barbell-standing-leg-calf-raise.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/barbell-standing-leg-calf-raise.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/barbell-standing-leg-calf-raise.gif",
    "caloriesBurnEstimatePerHour": 390
  },
  {
    "id": "EX-0155",
    "name": "Barbell Standing Rocking Leg Calf Raise",
    "category": "calves",
    "categoryDisplay": "Calves & Lower Leg",
    "targetMuscle": "Calves",
    "targetMuscleKey": "calves",
    "targetMuscles": [
      "Gastrocnemius (Lateral & Medial)",
      "Soleus"
    ],
    "secondaryMuscles": [
      "Tibialis Anterior",
      "Ankles"
    ],
    "difficulty": "Intermediate",
    "equipment": "Barbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing barbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your calves.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your calves vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the calves throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the calves."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/barbell-standing-rocking-leg-calf-raise.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/barbell-standing-rocking-leg-calf-raise.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/barbell-standing-rocking-leg-calf-raise.gif",
    "caloriesBurnEstimatePerHour": 390
  },
  {
    "id": "EX-0156",
    "name": "Bodyweight Standing Calf Raise",
    "category": "calves",
    "categoryDisplay": "Calves & Lower Leg",
    "targetMuscle": "Calves",
    "targetMuscleKey": "calves",
    "targetMuscles": [
      "Gastrocnemius (Lateral & Medial)",
      "Soleus"
    ],
    "secondaryMuscles": [
      "Tibialis Anterior",
      "Ankles"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your calves.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your calves vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the calves throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the calves."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/bodyweight-standing-calf-raise.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/bodyweight-standing-calf-raise.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/bodyweight-standing-calf-raise.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0157",
    "name": "Box Jump Down With One Leg Stabilization",
    "category": "calves",
    "categoryDisplay": "Calves & Lower Leg",
    "targetMuscle": "Calves",
    "targetMuscleKey": "calves",
    "targetMuscles": [
      "Gastrocnemius (Lateral & Medial)",
      "Soleus"
    ],
    "secondaryMuscles": [
      "Tibialis Anterior",
      "Ankles"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your calves.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your calves vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the calves throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the calves."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/box-jump-down-with-one-leg-stabilization.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/box-jump-down-with-one-leg-stabilization.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/box-jump-down-with-one-leg-stabilization.gif",
    "caloriesBurnEstimatePerHour": 420
  },
  {
    "id": "EX-0158",
    "name": "Cable Standing Calf Raise",
    "category": "calves",
    "categoryDisplay": "Calves & Lower Leg",
    "targetMuscle": "Calves",
    "targetMuscleKey": "calves",
    "targetMuscles": [
      "Gastrocnemius (Lateral & Medial)",
      "Soleus"
    ],
    "secondaryMuscles": [
      "Tibialis Anterior",
      "Ankles"
    ],
    "difficulty": "Beginner",
    "equipment": "Cable",
    "instructions": [
      "Set up in a solid, stable base position utilizing cable. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your calves.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your calves vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the calves throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the calves."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/cable-standing-calf-raise.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/cable-standing-calf-raise.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/cable-standing-calf-raise.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0159",
    "name": "Cable Standing One Leg Calf Raise",
    "category": "calves",
    "categoryDisplay": "Calves & Lower Leg",
    "targetMuscle": "Calves",
    "targetMuscleKey": "calves",
    "targetMuscles": [
      "Gastrocnemius (Lateral & Medial)",
      "Soleus"
    ],
    "secondaryMuscles": [
      "Tibialis Anterior",
      "Ankles"
    ],
    "difficulty": "Beginner",
    "equipment": "Cable",
    "instructions": [
      "Set up in a solid, stable base position utilizing cable. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your calves.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your calves vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the calves throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the calves."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/cable-standing-one-leg-calf-raise.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/cable-standing-one-leg-calf-raise.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/cable-standing-one-leg-calf-raise.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0160",
    "name": "Calf Push Stretch With Hands Against Wall",
    "category": "calves",
    "categoryDisplay": "Calves & Lower Leg",
    "targetMuscle": "Calves",
    "targetMuscleKey": "calves",
    "targetMuscles": [
      "Gastrocnemius (Lateral & Medial)",
      "Soleus"
    ],
    "secondaryMuscles": [
      "Tibialis Anterior",
      "Ankles"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your calves.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your calves vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the calves throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the calves."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/calf-push-stretch-with-hands-against-wall.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/calf-push-stretch-with-hands-against-wall.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/calf-push-stretch-with-hands-against-wall.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0161",
    "name": "Calf Stretch With Hands Against Wall",
    "category": "calves",
    "categoryDisplay": "Calves & Lower Leg",
    "targetMuscle": "Calves",
    "targetMuscleKey": "calves",
    "targetMuscles": [
      "Gastrocnemius (Lateral & Medial)",
      "Soleus"
    ],
    "secondaryMuscles": [
      "Tibialis Anterior",
      "Ankles"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your calves.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your calves vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the calves throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the calves."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/calf-stretch-with-hands-against-wall.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/calf-stretch-with-hands-against-wall.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/calf-stretch-with-hands-against-wall.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0162",
    "name": "Calf Stretch With Rope",
    "category": "calves",
    "categoryDisplay": "Calves & Lower Leg",
    "targetMuscle": "Calves",
    "targetMuscleKey": "calves",
    "targetMuscles": [
      "Gastrocnemius (Lateral & Medial)",
      "Soleus"
    ],
    "secondaryMuscles": [
      "Tibialis Anterior",
      "Ankles"
    ],
    "difficulty": "Beginner",
    "equipment": "Cable",
    "instructions": [
      "Set up in a solid, stable base position utilizing cable. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your calves.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your calves vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the calves throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the calves."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/calf-stretch-with-rope.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/calf-stretch-with-rope.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/calf-stretch-with-rope.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0163",
    "name": "Circles Knee Stretch",
    "category": "calves",
    "categoryDisplay": "Calves & Lower Leg",
    "targetMuscle": "Calves",
    "targetMuscleKey": "calves",
    "targetMuscles": [
      "Gastrocnemius (Lateral & Medial)",
      "Soleus"
    ],
    "secondaryMuscles": [
      "Tibialis Anterior",
      "Ankles"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your calves.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your calves vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the calves throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the calves."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/circles-knee-stretch.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/circles-knee-stretch.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/circles-knee-stretch.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0164",
    "name": "Donkey Calf Raise",
    "category": "calves",
    "categoryDisplay": "Calves & Lower Leg",
    "targetMuscle": "Calves",
    "targetMuscleKey": "calves",
    "targetMuscles": [
      "Gastrocnemius (Lateral & Medial)",
      "Soleus"
    ],
    "secondaryMuscles": [
      "Tibialis Anterior",
      "Ankles"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your calves.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your calves vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the calves throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the calves."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/donkey-calf-raise.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/donkey-calf-raise.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/donkey-calf-raise.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0165",
    "name": "Dumbbell Seated Calf Raise",
    "category": "calves",
    "categoryDisplay": "Calves & Lower Leg",
    "targetMuscle": "Calves",
    "targetMuscleKey": "calves",
    "targetMuscles": [
      "Gastrocnemius (Lateral & Medial)",
      "Soleus"
    ],
    "secondaryMuscles": [
      "Tibialis Anterior",
      "Ankles"
    ],
    "difficulty": "Beginner",
    "equipment": "Dumbbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing dumbbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your calves.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your calves vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the calves throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the calves."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/dumbbell-seated-calf-raise.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/dumbbell-seated-calf-raise.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/dumbbell-seated-calf-raise.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0166",
    "name": "Dumbbell Seated One Leg Calf Raise Hammer Grip",
    "category": "calves",
    "categoryDisplay": "Calves & Lower Leg",
    "targetMuscle": "Calves",
    "targetMuscleKey": "calves",
    "targetMuscles": [
      "Gastrocnemius (Lateral & Medial)",
      "Soleus"
    ],
    "secondaryMuscles": [
      "Tibialis Anterior",
      "Ankles"
    ],
    "difficulty": "Beginner",
    "equipment": "Dumbbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing dumbbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your calves.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your calves vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the calves throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the calves."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/dumbbell-seated-one-leg-calf-raise-hammer-grip.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/dumbbell-seated-one-leg-calf-raise-hammer-grip.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/dumbbell-seated-one-leg-calf-raise-hammer-grip.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0167",
    "name": "Dumbbell Seated One Leg Calf Raise Palm Up",
    "category": "calves",
    "categoryDisplay": "Calves & Lower Leg",
    "targetMuscle": "Calves",
    "targetMuscleKey": "calves",
    "targetMuscles": [
      "Gastrocnemius (Lateral & Medial)",
      "Soleus"
    ],
    "secondaryMuscles": [
      "Tibialis Anterior",
      "Ankles"
    ],
    "difficulty": "Beginner",
    "equipment": "Dumbbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing dumbbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your calves.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your calves vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the calves throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the calves."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/dumbbell-seated-one-leg-calf-raise-palm-up.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/dumbbell-seated-one-leg-calf-raise-palm-up.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/dumbbell-seated-one-leg-calf-raise-palm-up.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0168",
    "name": "Dumbbell Seated One Leg Calf Raise",
    "category": "calves",
    "categoryDisplay": "Calves & Lower Leg",
    "targetMuscle": "Calves",
    "targetMuscleKey": "calves",
    "targetMuscles": [
      "Gastrocnemius (Lateral & Medial)",
      "Soleus"
    ],
    "secondaryMuscles": [
      "Tibialis Anterior",
      "Ankles"
    ],
    "difficulty": "Beginner",
    "equipment": "Dumbbell",
    "instructions": [
      "Place a block on the floor about 12 inches from a flat bench.",
      "Sit on a flat bench and place a dumbbell on your upper left thigh about 3 inches above your knee.",
      "Now place the ball of your left foot on the block. This will be your starting position.",
      "Raise your toes up as high as possible as you exhale and you contract your calf muscle. Hold the contraction for a second.",
      "Slowly return to the starting position, stretching as far down as possible.",
      "Repeat for your prescribed number of repetitions and then repeat with the right leg."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the calves throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the calves."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/dumbbell-seated-one-leg-calf-raise.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/dumbbell-seated-one-leg-calf-raise.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/dumbbell-seated-one-leg-calf-raise.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0169",
    "name": "Dumbbell Single Leg Calf Raise",
    "category": "calves",
    "categoryDisplay": "Calves & Lower Leg",
    "targetMuscle": "Calves",
    "targetMuscleKey": "calves",
    "targetMuscles": [
      "Gastrocnemius (Lateral & Medial)",
      "Soleus"
    ],
    "secondaryMuscles": [
      "Tibialis Anterior",
      "Ankles"
    ],
    "difficulty": "Beginner",
    "equipment": "Dumbbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing dumbbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your calves.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your calves vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the calves throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the calves."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/dumbbell-single-leg-calf-raise.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/dumbbell-single-leg-calf-raise.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/dumbbell-single-leg-calf-raise.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0170",
    "name": "Dumbbell Standing Calf Raise",
    "category": "calves",
    "categoryDisplay": "Calves & Lower Leg",
    "targetMuscle": "Calves",
    "targetMuscleKey": "calves",
    "targetMuscles": [
      "Gastrocnemius (Lateral & Medial)",
      "Soleus"
    ],
    "secondaryMuscles": [
      "Tibialis Anterior",
      "Ankles"
    ],
    "difficulty": "Beginner",
    "equipment": "Dumbbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing dumbbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your calves.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your calves vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the calves throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the calves."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/dumbbell-standing-calf-raise.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/dumbbell-standing-calf-raise.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/dumbbell-standing-calf-raise.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0171",
    "name": "Exercise Ball On The Wall Calf Raise Tennis Ball Between Ankles",
    "category": "calves",
    "categoryDisplay": "Calves & Lower Leg",
    "targetMuscle": "Calves",
    "targetMuscleKey": "calves",
    "targetMuscles": [
      "Gastrocnemius (Lateral & Medial)",
      "Soleus"
    ],
    "secondaryMuscles": [
      "Tibialis Anterior",
      "Ankles"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your calves.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your calves vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the calves throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the calves."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/exercise-ball-on-the-wall-calf-raise-tennis-ball-between-ankles.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/exercise-ball-on-the-wall-calf-raise-tennis-ball-between-ankles.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/exercise-ball-on-the-wall-calf-raise-tennis-ball-between-ankles.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0172",
    "name": "Exercise Ball On The Wall Calf Raise Tennis Ball Between Knees",
    "category": "calves",
    "categoryDisplay": "Calves & Lower Leg",
    "targetMuscle": "Calves",
    "targetMuscleKey": "calves",
    "targetMuscles": [
      "Gastrocnemius (Lateral & Medial)",
      "Soleus"
    ],
    "secondaryMuscles": [
      "Tibialis Anterior",
      "Ankles"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your calves.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your calves vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the calves throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the calves."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/exercise-ball-on-the-wall-calf-raise-tennis-ball-between-knees.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/exercise-ball-on-the-wall-calf-raise-tennis-ball-between-knees.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/exercise-ball-on-the-wall-calf-raise-tennis-ball-between-knees.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0173",
    "name": "Exercise Ball On The Wall Calf Raise",
    "category": "calves",
    "categoryDisplay": "Calves & Lower Leg",
    "targetMuscle": "Calves",
    "targetMuscleKey": "calves",
    "targetMuscles": [
      "Gastrocnemius (Lateral & Medial)",
      "Soleus"
    ],
    "secondaryMuscles": [
      "Tibialis Anterior",
      "Ankles"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your calves.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your calves vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the calves throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the calves."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/exercise-ball-on-the-wall-calf-raise.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/exercise-ball-on-the-wall-calf-raise.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/exercise-ball-on-the-wall-calf-raise.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0174",
    "name": "Hack Calf Raise",
    "category": "calves",
    "categoryDisplay": "Calves & Lower Leg",
    "targetMuscle": "Calves",
    "targetMuscleKey": "calves",
    "targetMuscles": [
      "Gastrocnemius (Lateral & Medial)",
      "Soleus"
    ],
    "secondaryMuscles": [
      "Tibialis Anterior",
      "Ankles"
    ],
    "difficulty": "Beginner",
    "equipment": "Machine",
    "instructions": [
      "Set up in a solid, stable base position utilizing machine. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your calves.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your calves vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the calves throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the calves."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/hack-calf-raise.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/hack-calf-raise.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/hack-calf-raise.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0175",
    "name": "Hack One Leg Calf Raise",
    "category": "calves",
    "categoryDisplay": "Calves & Lower Leg",
    "targetMuscle": "Calves",
    "targetMuscleKey": "calves",
    "targetMuscles": [
      "Gastrocnemius (Lateral & Medial)",
      "Soleus"
    ],
    "secondaryMuscles": [
      "Tibialis Anterior",
      "Ankles"
    ],
    "difficulty": "Beginner",
    "equipment": "Machine",
    "instructions": [
      "Set up in a solid, stable base position utilizing machine. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your calves.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your calves vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the calves throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the calves."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/hack-one-leg-calf-raise.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/hack-one-leg-calf-raise.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/hack-one-leg-calf-raise.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0176",
    "name": "Lever Calf Press",
    "category": "calves",
    "categoryDisplay": "Calves & Lower Leg",
    "targetMuscle": "Calves",
    "targetMuscleKey": "calves",
    "targetMuscles": [
      "Gastrocnemius (Lateral & Medial)",
      "Soleus"
    ],
    "secondaryMuscles": [
      "Tibialis Anterior",
      "Ankles"
    ],
    "difficulty": "Beginner",
    "equipment": "Machine",
    "instructions": [
      "Set up in a solid, stable base position utilizing machine. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your calves.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your calves vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the calves throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the calves."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/lever-calf-press.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/lever-calf-press.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/lever-calf-press.gif",
    "caloriesBurnEstimatePerHour": 420
  },
  {
    "id": "EX-0177",
    "name": "Lever Donkey Calf Raise",
    "category": "calves",
    "categoryDisplay": "Calves & Lower Leg",
    "targetMuscle": "Calves",
    "targetMuscleKey": "calves",
    "targetMuscles": [
      "Gastrocnemius (Lateral & Medial)",
      "Soleus"
    ],
    "secondaryMuscles": [
      "Tibialis Anterior",
      "Ankles"
    ],
    "difficulty": "Beginner",
    "equipment": "Machine",
    "instructions": [
      "Set up in a solid, stable base position utilizing machine. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your calves.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your calves vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the calves throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the calves."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/lever-donkey-calf-raise.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/lever-donkey-calf-raise.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/lever-donkey-calf-raise.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0178",
    "name": "Lever Rotary Calf",
    "category": "calves",
    "categoryDisplay": "Calves & Lower Leg",
    "targetMuscle": "Calves",
    "targetMuscleKey": "calves",
    "targetMuscles": [
      "Gastrocnemius (Lateral & Medial)",
      "Soleus"
    ],
    "secondaryMuscles": [
      "Tibialis Anterior",
      "Ankles"
    ],
    "difficulty": "Beginner",
    "equipment": "Machine",
    "instructions": [
      "Set up in a solid, stable base position utilizing machine. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your calves.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your calves vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the calves throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the calves."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/lever-rotary-calf.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/lever-rotary-calf.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/lever-rotary-calf.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0179",
    "name": "Lever Seated Calf Press",
    "category": "calves",
    "categoryDisplay": "Calves & Lower Leg",
    "targetMuscle": "Calves",
    "targetMuscleKey": "calves",
    "targetMuscles": [
      "Gastrocnemius (Lateral & Medial)",
      "Soleus"
    ],
    "secondaryMuscles": [
      "Tibialis Anterior",
      "Ankles"
    ],
    "difficulty": "Beginner",
    "equipment": "Machine",
    "instructions": [
      "Set up in a solid, stable base position utilizing machine. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your calves.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your calves vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the calves throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the calves."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/lever-seated-calf-press.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/lever-seated-calf-press.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/lever-seated-calf-press.gif",
    "caloriesBurnEstimatePerHour": 420
  },
  {
    "id": "EX-0180",
    "name": "Lever Seated Calf Raise",
    "category": "calves",
    "categoryDisplay": "Calves & Lower Leg",
    "targetMuscle": "Calves",
    "targetMuscleKey": "calves",
    "targetMuscles": [
      "Gastrocnemius (Lateral & Medial)",
      "Soleus"
    ],
    "secondaryMuscles": [
      "Tibialis Anterior",
      "Ankles"
    ],
    "difficulty": "Beginner",
    "equipment": "Machine",
    "instructions": [
      "Set up in a solid, stable base position utilizing machine. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your calves.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your calves vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the calves throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the calves."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/lever-seated-calf-raise.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/lever-seated-calf-raise.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/lever-seated-calf-raise.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0181",
    "name": "Lever Seated Squat Calf Raise On Leg Press Machine",
    "category": "calves",
    "categoryDisplay": "Calves & Lower Leg",
    "targetMuscle": "Calves",
    "targetMuscleKey": "calves",
    "targetMuscles": [
      "Gastrocnemius (Lateral & Medial)",
      "Soleus"
    ],
    "secondaryMuscles": [
      "Tibialis Anterior",
      "Ankles"
    ],
    "difficulty": "Intermediate",
    "equipment": "Machine",
    "instructions": [
      "Set up in a solid, stable base position utilizing machine. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your calves.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your calves vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the calves throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the calves."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/lever-seated-squat-calf-raise-on-leg-press-machine.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/lever-seated-squat-calf-raise-on-leg-press-machine.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/lever-seated-squat-calf-raise-on-leg-press-machine.gif",
    "caloriesBurnEstimatePerHour": 520
  },
  {
    "id": "EX-0182",
    "name": "Lever Standing Calf Raise",
    "category": "calves",
    "categoryDisplay": "Calves & Lower Leg",
    "targetMuscle": "Calves",
    "targetMuscleKey": "calves",
    "targetMuscles": [
      "Gastrocnemius (Lateral & Medial)",
      "Soleus"
    ],
    "secondaryMuscles": [
      "Tibialis Anterior",
      "Ankles"
    ],
    "difficulty": "Beginner",
    "equipment": "Machine",
    "instructions": [
      "Set up in a solid, stable base position utilizing machine. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your calves.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your calves vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the calves throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the calves."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/lever-standing-calf-raise.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/lever-standing-calf-raise.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/lever-standing-calf-raise.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0183",
    "name": "One Leg Donkey Calf Raise",
    "category": "calves",
    "categoryDisplay": "Calves & Lower Leg",
    "targetMuscle": "Calves",
    "targetMuscleKey": "calves",
    "targetMuscles": [
      "Gastrocnemius (Lateral & Medial)",
      "Soleus"
    ],
    "secondaryMuscles": [
      "Tibialis Anterior",
      "Ankles"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your calves.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your calves vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the calves throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the calves."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/one-leg-donkey-calf-raise.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/one-leg-donkey-calf-raise.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/one-leg-donkey-calf-raise.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0184",
    "name": "One Leg Floor Calf Raise",
    "category": "calves",
    "categoryDisplay": "Calves & Lower Leg",
    "targetMuscle": "Calves",
    "targetMuscleKey": "calves",
    "targetMuscles": [
      "Gastrocnemius (Lateral & Medial)",
      "Soleus"
    ],
    "secondaryMuscles": [
      "Tibialis Anterior",
      "Ankles"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your calves.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your calves vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the calves throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the calves."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/one-leg-floor-calf-raise.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/one-leg-floor-calf-raise.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/one-leg-floor-calf-raise.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0185",
    "name": "Peroneals Stretch",
    "category": "calves",
    "categoryDisplay": "Calves & Lower Leg",
    "targetMuscle": "Calves",
    "targetMuscleKey": "calves",
    "targetMuscles": [
      "Gastrocnemius (Lateral & Medial)",
      "Soleus"
    ],
    "secondaryMuscles": [
      "Tibialis Anterior",
      "Ankles"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your calves.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your calves vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the calves throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the calves."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/peroneals-stretch.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/peroneals-stretch.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/peroneals-stretch.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0186",
    "name": "Posterior Tibialis Stretch",
    "category": "calves",
    "categoryDisplay": "Calves & Lower Leg",
    "targetMuscle": "Calves",
    "targetMuscleKey": "calves",
    "targetMuscles": [
      "Gastrocnemius (Lateral & Medial)",
      "Soleus"
    ],
    "secondaryMuscles": [
      "Tibialis Anterior",
      "Ankles"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your calves.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your calves vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the calves throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the calves."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/posterior-tibialis-stretch.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/posterior-tibialis-stretch.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/posterior-tibialis-stretch.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0187",
    "name": "Seated Calf Stretch Male",
    "category": "calves",
    "categoryDisplay": "Calves & Lower Leg",
    "targetMuscle": "Calves",
    "targetMuscleKey": "calves",
    "targetMuscles": [
      "Gastrocnemius (Lateral & Medial)",
      "Soleus"
    ],
    "secondaryMuscles": [
      "Tibialis Anterior",
      "Ankles"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your calves.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your calves vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the calves throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the calves."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/seated-calf-stretch-male.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/seated-calf-stretch-male.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/seated-calf-stretch-male.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0188",
    "name": "Single Leg Calf Raise On A Dumbbell",
    "category": "calves",
    "categoryDisplay": "Calves & Lower Leg",
    "targetMuscle": "Calves",
    "targetMuscleKey": "calves",
    "targetMuscles": [
      "Gastrocnemius (Lateral & Medial)",
      "Soleus"
    ],
    "secondaryMuscles": [
      "Tibialis Anterior",
      "Ankles"
    ],
    "difficulty": "Beginner",
    "equipment": "Dumbbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing dumbbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your calves.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your calves vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the calves throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the calves."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/single-leg-calf-raise-on-a-dumbbell.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/single-leg-calf-raise-on-a-dumbbell.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/single-leg-calf-raise-on-a-dumbbell.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0189",
    "name": "Sled 45° Degree Calf Press",
    "category": "calves",
    "categoryDisplay": "Calves & Lower Leg",
    "targetMuscle": "Calves",
    "targetMuscleKey": "calves",
    "targetMuscles": [
      "Gastrocnemius (Lateral & Medial)",
      "Soleus"
    ],
    "secondaryMuscles": [
      "Tibialis Anterior",
      "Ankles"
    ],
    "difficulty": "Beginner",
    "equipment": "Machine",
    "instructions": [
      "Set up in a solid, stable base position utilizing machine. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your calves.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your calves vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the calves throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the calves."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/sled-45-calf-press.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/sled-45-calf-press.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/calves/sled-45-calf-press.gif",
    "caloriesBurnEstimatePerHour": 420
  },
  {
    "id": "EX-0190",
    "name": "Alternate Lateral Pulldown",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Rear Deltoid",
      "Rhomboids"
    ],
    "difficulty": "Intermediate",
    "equipment": "Cable",
    "instructions": [
      "Set up in a solid, stable base position utilizing cable. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/alternate-lateral-pulldown.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/alternate-lateral-pulldown.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/alternate-lateral-pulldown.gif",
    "caloriesBurnEstimatePerHour": 520
  },
  {
    "id": "EX-0191",
    "name": "Archer Pull Up",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Rear Deltoid",
      "Rhomboids"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/archer-pull-up.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/archer-pull-up.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/archer-pull-up.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0192",
    "name": "Assisted Parallel Close Grip Pull Up",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Rear Deltoid",
      "Rhomboids"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/assisted-parallel-close-grip-pull-up.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/assisted-parallel-close-grip-pull-up.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/assisted-parallel-close-grip-pull-up.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0193",
    "name": "Assisted Pull Up",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Rear Deltoid",
      "Rhomboids"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/assisted-pull-up.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/assisted-pull-up.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/assisted-pull-up.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0194",
    "name": "Assisted Standing Chin Up",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Rear Deltoid",
      "Rhomboids"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/assisted-standing-chin-up.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/assisted-standing-chin-up.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/assisted-standing-chin-up.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0195",
    "name": "Assisted Standing Pull Up",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Rear Deltoid",
      "Rhomboids"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/assisted-standing-pull-up.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/assisted-standing-pull-up.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/assisted-standing-pull-up.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0196",
    "name": "Back Pec Stretch",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Rear Deltoid",
      "Rhomboids"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/back-pec-stretch.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/back-pec-stretch.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/back-pec-stretch.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0197",
    "name": "Band Assisted Pull Up",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Rear Deltoid",
      "Rhomboids"
    ],
    "difficulty": "Beginner",
    "equipment": "Resistance Band",
    "instructions": [
      "Choke the band around the center of the pullup bar. You can use different bands to provide varying levels of assistance.",
      "Pull the end of the band down, and place one bent knee into the loop, ensuring it won't slip out. Take a medium to wide grip on the bar. This will be your starting position.",
      "Pull yourself upward by contracting the lats as you flex the elbow. The elbow should be driven to your side. Pull to the front, attempting to get your chin over the bar. Avoid swinging or jerking movements.",
      "After a brief pause, return to the starting position."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/band-assisted-pull-up.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/band-assisted-pull-up.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/band-assisted-pull-up.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0198",
    "name": "Band Close Grip Pulldown",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Rear Deltoid",
      "Rhomboids"
    ],
    "difficulty": "Intermediate",
    "equipment": "Cable",
    "instructions": [
      "Set up in a solid, stable base position utilizing cable. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/band-close-grip-pulldown.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/band-close-grip-pulldown.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/band-close-grip-pulldown.gif",
    "caloriesBurnEstimatePerHour": 520
  },
  {
    "id": "EX-0199",
    "name": "Band Fixed Back Close Grip Pulldown",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Rear Deltoid",
      "Rhomboids"
    ],
    "difficulty": "Intermediate",
    "equipment": "Cable",
    "instructions": [
      "Set up in a solid, stable base position utilizing cable. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/band-fixed-back-close-grip-pulldown.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/band-fixed-back-close-grip-pulldown.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/band-fixed-back-close-grip-pulldown.gif",
    "caloriesBurnEstimatePerHour": 520
  },
  {
    "id": "EX-0200",
    "name": "Band Fixed Back Underhand Pulldown",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Rear Deltoid",
      "Rhomboids"
    ],
    "difficulty": "Intermediate",
    "equipment": "Cable",
    "instructions": [
      "Set up in a solid, stable base position utilizing cable. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/band-fixed-back-underhand-pulldown.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/band-fixed-back-underhand-pulldown.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/band-fixed-back-underhand-pulldown.gif",
    "caloriesBurnEstimatePerHour": 520
  },
  {
    "id": "EX-0201",
    "name": "Band Kneeling One Arm Pulldown",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Rear Deltoid",
      "Rhomboids"
    ],
    "difficulty": "Advanced",
    "equipment": "Cable",
    "instructions": [
      "Set up in a solid, stable base position utilizing cable. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/band-kneeling-one-arm-pulldown.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/band-kneeling-one-arm-pulldown.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/band-kneeling-one-arm-pulldown.gif",
    "caloriesBurnEstimatePerHour": 620
  },
  {
    "id": "EX-0202",
    "name": "Band Underhand Pulldown",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Rear Deltoid",
      "Rhomboids"
    ],
    "difficulty": "Intermediate",
    "equipment": "Cable",
    "instructions": [
      "Set up in a solid, stable base position utilizing cable. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/band-underhand-pulldown.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/band-underhand-pulldown.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/band-underhand-pulldown.gif",
    "caloriesBurnEstimatePerHour": 520
  },
  {
    "id": "EX-0203",
    "name": "Barbell Bent Arm Pullover",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Rear Deltoid",
      "Rhomboids"
    ],
    "difficulty": "Intermediate",
    "equipment": "Barbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing barbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/barbell-bent-arm-pullover.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/barbell-bent-arm-pullover.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/barbell-bent-arm-pullover.gif",
    "caloriesBurnEstimatePerHour": 390
  },
  {
    "id": "EX-0204",
    "name": "Barbell Decline Bent Arm Pullover",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Rear Deltoid",
      "Rhomboids"
    ],
    "difficulty": "Intermediate",
    "equipment": "Barbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing barbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/barbell-decline-bent-arm-pullover.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/barbell-decline-bent-arm-pullover.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/barbell-decline-bent-arm-pullover.gif",
    "caloriesBurnEstimatePerHour": 390
  },
  {
    "id": "EX-0205",
    "name": "Barbell Decline Wide Grip Pullover",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Rear Deltoid",
      "Rhomboids"
    ],
    "difficulty": "Intermediate",
    "equipment": "Barbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing barbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/barbell-decline-wide-grip-pullover.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/barbell-decline-wide-grip-pullover.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/barbell-decline-wide-grip-pullover.gif",
    "caloriesBurnEstimatePerHour": 390
  },
  {
    "id": "EX-0206",
    "name": "Barbell Pullover To Press",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Rear Deltoid",
      "Rhomboids"
    ],
    "difficulty": "Intermediate",
    "equipment": "Barbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing barbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/barbell-pullover-to-press.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/barbell-pullover-to-press.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/barbell-pullover-to-press.gif",
    "caloriesBurnEstimatePerHour": 520
  },
  {
    "id": "EX-0207",
    "name": "Barbell Pullover",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Rear Deltoid",
      "Rhomboids"
    ],
    "difficulty": "Intermediate",
    "equipment": "Barbell",
    "instructions": [
      "Set up in a solid, stable base position utilizing barbell. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/barbell-pullover.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/barbell-pullover.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/barbell-pullover.gif",
    "caloriesBurnEstimatePerHour": 390
  },
  {
    "id": "EX-0208",
    "name": "Bench Pull Ups",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Rear Deltoid",
      "Rhomboids"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/bench-pull-ups.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/bench-pull-ups.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/bench-pull-ups.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0209",
    "name": "Cable Bar Lateral Pulldown",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Rear Deltoid",
      "Rhomboids"
    ],
    "difficulty": "Intermediate",
    "equipment": "Cable",
    "instructions": [
      "Set up in a solid, stable base position utilizing cable. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-bar-lateral-pulldown.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-bar-lateral-pulldown.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-bar-lateral-pulldown.gif",
    "caloriesBurnEstimatePerHour": 520
  },
  {
    "id": "EX-0210",
    "name": "Cable Cross Over Lateral Pulldown",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Rear Deltoid",
      "Rhomboids"
    ],
    "difficulty": "Intermediate",
    "equipment": "Cable",
    "instructions": [
      "Set up in a solid, stable base position utilizing cable. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-cross-over-lateral-pulldown.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-cross-over-lateral-pulldown.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-cross-over-lateral-pulldown.gif",
    "caloriesBurnEstimatePerHour": 520
  },
  {
    "id": "EX-0211",
    "name": "Cable Incline Pushdown",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Rear Deltoid",
      "Rhomboids"
    ],
    "difficulty": "Intermediate",
    "equipment": "Cable",
    "instructions": [
      "Lie on incline an bench facing away from a high pulley machine that has a straight bar attachment on it.",
      "Grasp the straight bar attachment overhead with a pronated (overhand; palms down) shoulder width grip and extend your arms in front of you. The bar should be around 2 inches away from your upper thighs. This will be your starting position.",
      "Keeping the upper arms stationary, lift your arms back in a semi circle until the bar is straight over your head. Breathe in during this portion of the movement.",
      "Slowly go back to the starting position using your lats and hold the contraction once you reach the starting position. Breathe out during the execution of this movement.",
      "Repeat for the recommended amount of repetitions."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-incline-pushdown.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-incline-pushdown.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-incline-pushdown.gif",
    "caloriesBurnEstimatePerHour": 390
  },
  {
    "id": "EX-0212",
    "name": "Cable Lat Pulldown Full Range Of Motion",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Rear Deltoid",
      "Rhomboids"
    ],
    "difficulty": "Intermediate",
    "equipment": "Cable",
    "instructions": [
      "Set up in a solid, stable base position utilizing cable. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-lat-pulldown-full-range-of-motion.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-lat-pulldown-full-range-of-motion.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-lat-pulldown-full-range-of-motion.gif",
    "caloriesBurnEstimatePerHour": 520
  },
  {
    "id": "EX-0213",
    "name": "Cable Lateral Pulldown With Rope Attachment",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Rear Deltoid",
      "Rhomboids"
    ],
    "difficulty": "Intermediate",
    "equipment": "Cable",
    "instructions": [
      "Set up in a solid, stable base position utilizing cable. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-lateral-pulldown-with-rope-attachment.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-lateral-pulldown-with-rope-attachment.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-lateral-pulldown-with-rope-attachment.gif",
    "caloriesBurnEstimatePerHour": 520
  },
  {
    "id": "EX-0214",
    "name": "Cable Lateral Pulldown With V Bar",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Rear Deltoid",
      "Rhomboids"
    ],
    "difficulty": "Intermediate",
    "equipment": "Cable",
    "instructions": [
      "Set up in a solid, stable base position utilizing cable. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-lateral-pulldown-with-v-bar.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-lateral-pulldown-with-v-bar.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-lateral-pulldown-with-v-bar.gif",
    "caloriesBurnEstimatePerHour": 520
  },
  {
    "id": "EX-0215",
    "name": "Cable Lying Extension Pullover With Rope Attachment",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Rear Deltoid",
      "Rhomboids"
    ],
    "difficulty": "Intermediate",
    "equipment": "Cable",
    "instructions": [
      "Set up in a solid, stable base position utilizing cable. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-lying-extension-pullover-with-rope-attachment.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-lying-extension-pullover-with-rope-attachment.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-lying-extension-pullover-with-rope-attachment.gif",
    "caloriesBurnEstimatePerHour": 390
  },
  {
    "id": "EX-0216",
    "name": "Cable One Arm Pulldown",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Rear Deltoid",
      "Rhomboids"
    ],
    "difficulty": "Advanced",
    "equipment": "Cable",
    "instructions": [
      "Set up in a solid, stable base position utilizing cable. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-one-arm-pulldown.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-one-arm-pulldown.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-one-arm-pulldown.gif",
    "caloriesBurnEstimatePerHour": 620
  },
  {
    "id": "EX-0217",
    "name": "Cable Pulldown Pro Lat Bar",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Rear Deltoid",
      "Rhomboids"
    ],
    "difficulty": "Intermediate",
    "equipment": "Cable",
    "instructions": [
      "Set up in a solid, stable base position utilizing cable. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-pulldown-pro-lat-bar.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-pulldown-pro-lat-bar.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-pulldown-pro-lat-bar.gif",
    "caloriesBurnEstimatePerHour": 520
  },
  {
    "id": "EX-0218",
    "name": "Cable Pulldown",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Rear Deltoid",
      "Rhomboids"
    ],
    "difficulty": "Intermediate",
    "equipment": "Cable",
    "instructions": [
      "Set up in a solid, stable base position utilizing cable. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-pulldown.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-pulldown.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-pulldown.gif",
    "caloriesBurnEstimatePerHour": 520
  },
  {
    "id": "EX-0219",
    "name": "Cable Pushdown Straight Arm V 2",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Rear Deltoid",
      "Rhomboids"
    ],
    "difficulty": "Intermediate",
    "equipment": "Cable",
    "instructions": [
      "Set up in a solid, stable base position utilizing cable. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-pushdown-straight-arm-v-2.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-pushdown-straight-arm-v-2.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-pushdown-straight-arm-v-2.gif",
    "caloriesBurnEstimatePerHour": 390
  },
  {
    "id": "EX-0220",
    "name": "Cable Rear Pulldown",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Rear Deltoid",
      "Rhomboids"
    ],
    "difficulty": "Intermediate",
    "equipment": "Cable",
    "instructions": [
      "Set up in a solid, stable base position utilizing cable. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-rear-pulldown.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-rear-pulldown.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-rear-pulldown.gif",
    "caloriesBurnEstimatePerHour": 520
  },
  {
    "id": "EX-0221",
    "name": "Cable Seated High Row V Bar",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Rear Deltoid",
      "Rhomboids"
    ],
    "difficulty": "Intermediate",
    "equipment": "Cable",
    "instructions": [
      "Set up in a solid, stable base position utilizing cable. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-seated-high-row-v-bar.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-seated-high-row-v-bar.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-seated-high-row-v-bar.gif",
    "caloriesBurnEstimatePerHour": 520
  },
  {
    "id": "EX-0222",
    "name": "Cable Squat Row With Rope Attachment",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Rear Deltoid",
      "Rhomboids"
    ],
    "difficulty": "Intermediate",
    "equipment": "Cable",
    "instructions": [
      "Set up in a solid, stable base position utilizing cable. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-squat-row-with-rope-attachment.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-squat-row-with-rope-attachment.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-squat-row-with-rope-attachment.gif",
    "caloriesBurnEstimatePerHour": 520
  },
  {
    "id": "EX-0223",
    "name": "Cable Straight Arm Pulldown With Rope",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Rear Deltoid",
      "Rhomboids"
    ],
    "difficulty": "Intermediate",
    "equipment": "Cable",
    "instructions": [
      "Set up in a solid, stable base position utilizing cable. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-straight-arm-pulldown-with-rope.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-straight-arm-pulldown-with-rope.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-straight-arm-pulldown-with-rope.gif",
    "caloriesBurnEstimatePerHour": 520
  },
  {
    "id": "EX-0224",
    "name": "Cable Straight Arm Pulldown",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Rear Deltoid",
      "Rhomboids"
    ],
    "difficulty": "Intermediate",
    "equipment": "Cable",
    "instructions": [
      "Set up in a solid, stable base position utilizing cable. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-straight-arm-pulldown.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-straight-arm-pulldown.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-straight-arm-pulldown.gif",
    "caloriesBurnEstimatePerHour": 520
  },
  {
    "id": "EX-0225",
    "name": "Cable Thibaudeau Kayak Row",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Rear Deltoid",
      "Rhomboids"
    ],
    "difficulty": "Intermediate",
    "equipment": "Cable",
    "instructions": [
      "Set up in a solid, stable base position utilizing cable. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-thibaudeau-kayak-row.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-thibaudeau-kayak-row.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-thibaudeau-kayak-row.gif",
    "caloriesBurnEstimatePerHour": 520
  },
  {
    "id": "EX-0226",
    "name": "Cable Twisting Pull",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Rear Deltoid",
      "Rhomboids"
    ],
    "difficulty": "Intermediate",
    "equipment": "Cable",
    "instructions": [
      "Set up in a solid, stable base position utilizing cable. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-twisting-pull.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-twisting-pull.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-twisting-pull.gif",
    "caloriesBurnEstimatePerHour": 390
  },
  {
    "id": "EX-0227",
    "name": "Cable Underhand Pulldown",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Rear Deltoid",
      "Rhomboids"
    ],
    "difficulty": "Intermediate",
    "equipment": "Cable",
    "instructions": [
      "Set up in a solid, stable base position utilizing cable. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-underhand-pulldown.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-underhand-pulldown.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-underhand-pulldown.gif",
    "caloriesBurnEstimatePerHour": 520
  },
  {
    "id": "EX-0228",
    "name": "Cable Wide Grip Rear Pulldown Behind Neck",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Rear Deltoid",
      "Rhomboids"
    ],
    "difficulty": "Intermediate",
    "equipment": "Cable",
    "instructions": [
      "Set up in a solid, stable base position utilizing cable. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-wide-grip-rear-pulldown-behind-neck.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-wide-grip-rear-pulldown-behind-neck.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/cable-wide-grip-rear-pulldown-behind-neck.gif",
    "caloriesBurnEstimatePerHour": 520
  },
  {
    "id": "EX-0229",
    "name": "Chin Up",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Rear Deltoid",
      "Rhomboids"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Grab the pull-up bar with the palms facing your torso and a grip closer than the shoulder width.",
      "As you have both arms extended in front of you holding the bar at the chosen grip width, keep your torso as straight as possible while creating a curvature on your lower back and sticking your chest out. This is your starting position. Tip: Keeping the torso as straight as possible maximizes biceps stimulation while minimizing back involvement.",
      "As you breathe out, pull your torso up until your head is around the level of the pull-up bar. Concentrate on using the biceps muscles in order to perform the movement. Keep the elbows close to your body. Tip: The upper torso should remain stationary as it moves through space and only the arms should move. The forearms should do no other work other than hold the bar.",
      "After a second of squeezing the biceps in the contracted position, slowly lower your torso back to the starting position; when your arms are fully extended. Breathe in as you perform this portion of the movement.",
      "Repeat this motion for the prescribed amount of repetitions."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/chin-up.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/chin-up.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/chin-up.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0230",
    "name": "Close Grip Chin Up",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Rear Deltoid",
      "Rhomboids"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/close-grip-chin-up.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/close-grip-chin-up.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/close-grip-chin-up.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0231",
    "name": "Exercise Ball Alternating Arm Ups",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Rear Deltoid",
      "Rhomboids"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/exercise-ball-alternating-arm-ups.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/exercise-ball-alternating-arm-ups.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/exercise-ball-alternating-arm-ups.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0232",
    "name": "Exercise Ball Lat Stretch",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Rear Deltoid",
      "Rhomboids"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/exercise-ball-lat-stretch.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/exercise-ball-lat-stretch.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/exercise-ball-lat-stretch.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0233",
    "name": "Exercise Ball Lower Back Stretch Pyramid",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Rear Deltoid",
      "Rhomboids"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/exercise-ball-lower-back-stretch-pyramid.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/exercise-ball-lower-back-stretch-pyramid.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/exercise-ball-lower-back-stretch-pyramid.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0234",
    "name": "Exercise Ball Lying Side Lat Stretch",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Rear Deltoid",
      "Rhomboids"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/exercise-ball-lying-side-lat-stretch.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/exercise-ball-lying-side-lat-stretch.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/exercise-ball-lying-side-lat-stretch.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0235",
    "name": "EZ Bar Lying Bent Arms Pullover",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Rear Deltoid",
      "Rhomboids"
    ],
    "difficulty": "Intermediate",
    "equipment": "EZ Bar",
    "instructions": [
      "Set up in a solid, stable base position utilizing ez bar. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/ez-bar-lying-bent-arms-pullover.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/ez-bar-lying-bent-arms-pullover.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/ez-bar-lying-bent-arms-pullover.gif",
    "caloriesBurnEstimatePerHour": 390
  },
  {
    "id": "EX-0236",
    "name": "Gironda Sternum Chin",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Rear Deltoid",
      "Rhomboids"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/gironda-sternum-chin.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/gironda-sternum-chin.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/gironda-sternum-chin.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0237",
    "name": "Kipping Muscle Up",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Rear Deltoid",
      "Rhomboids"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Grip the rings using a false grip, with the base of your palms on top of the rings.",
      "Begin with a movement swinging your legs backward slightly.",
      "Counter that movement by swinging your legs forward and up, jerking your chin and chest back, pulling yourself up with both arms as you do so. As you reach the top position of the pull-up, pull the rings to your armpits as you roll your shoulders forward, allowing your elbows to move straight back behind you. This puts you into the proper position to continue into the dip portion of the movement.",
      "Maintaining control and stability, extend through the elbow to complete the motion.",
      "Use care when lowering yourself to the ground."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/kipping-muscle-up.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/kipping-muscle-up.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/kipping-muscle-up.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0238",
    "name": "Kneeling Lat Stretch",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Rear Deltoid",
      "Rhomboids"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/kneeling-lat-stretch.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/kneeling-lat-stretch.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/kneeling-lat-stretch.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0239",
    "name": "L Pull Up",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Rear Deltoid",
      "Rhomboids"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/l-pull-up.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/l-pull-up.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/l-pull-up.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0240",
    "name": "Lever Assisted Chin Up",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Rear Deltoid",
      "Rhomboids"
    ],
    "difficulty": "Beginner",
    "equipment": "Machine",
    "instructions": [
      "Set up in a solid, stable base position utilizing machine. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/lever-assisted-chin-up.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/lever-assisted-chin-up.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/lever-assisted-chin-up.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0241",
    "name": "Lever Front Pulldown",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Rear Deltoid",
      "Rhomboids"
    ],
    "difficulty": "Intermediate",
    "equipment": "Cable",
    "instructions": [
      "Set up in a solid, stable base position utilizing cable. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/lever-front-pulldown.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/lever-front-pulldown.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/lever-front-pulldown.gif",
    "caloriesBurnEstimatePerHour": 520
  },
  {
    "id": "EX-0242",
    "name": "Lever One Arm Lateral Wide Pulldown",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Rear Deltoid",
      "Rhomboids"
    ],
    "difficulty": "Advanced",
    "equipment": "Cable",
    "instructions": [
      "Set up in a solid, stable base position utilizing cable. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/lever-one-arm-lateral-wide-pulldown.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/lever-one-arm-lateral-wide-pulldown.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/lever-one-arm-lateral-wide-pulldown.gif",
    "caloriesBurnEstimatePerHour": 620
  },
  {
    "id": "EX-0243",
    "name": "Lever Pullover",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Rear Deltoid",
      "Rhomboids"
    ],
    "difficulty": "Beginner",
    "equipment": "Machine",
    "instructions": [
      "Set up in a solid, stable base position utilizing machine. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/lever-pullover.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/lever-pullover.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/lever-pullover.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0244",
    "name": "Lever Reverse Grip Lateral Pulldown",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Rear Deltoid",
      "Rhomboids"
    ],
    "difficulty": "Intermediate",
    "equipment": "Cable",
    "instructions": [
      "Set up in a solid, stable base position utilizing cable. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/lever-reverse-grip-lateral-pulldown.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/lever-reverse-grip-lateral-pulldown.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/lever-reverse-grip-lateral-pulldown.gif",
    "caloriesBurnEstimatePerHour": 520
  },
  {
    "id": "EX-0245",
    "name": "Medicine Ball Catch And Overhead Throw",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Rear Deltoid",
      "Rhomboids"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/medicine-ball-catch-and-overhead-throw.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/medicine-ball-catch-and-overhead-throw.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/medicine-ball-catch-and-overhead-throw.gif",
    "caloriesBurnEstimatePerHour": 420
  },
  {
    "id": "EX-0246",
    "name": "Mixed Grip Chin Up",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Rear Deltoid",
      "Rhomboids"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/mixed-grip-chin-up.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/mixed-grip-chin-up.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/mixed-grip-chin-up.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0247",
    "name": "Muscle Up On Vertical Bar",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Rear Deltoid",
      "Rhomboids"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Set up in a solid, stable base position utilizing bodyweight. Engage your core and establish neutral spine alignment.",
      "Initiate the eccentric (lowering) phase under strict control, feeling the stretch across your back & lats.",
      "Pause briefly at the bottom active stretch position without letting momentum take over or collapsing your joints.",
      "Drive powerfully through the concentric phase, squeezing your back & lats vigorously at peak contraction.",
      "Inhale during the controlled lowering phase and exhale forcefully through the exertion drive."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/muscle-up-on-vertical-bar.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/muscle-up-on-vertical-bar.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/muscle-up-on-vertical-bar.gif",
    "caloriesBurnEstimatePerHour": 310
  },
  {
    "id": "EX-0248",
    "name": "Muscle Up",
    "category": "back",
    "categoryDisplay": "Back & Lats",
    "targetMuscle": "Back & Lats",
    "targetMuscleKey": "back",
    "targetMuscles": [
      "Latissimus Dorsi",
      "Teres Major"
    ],
    "secondaryMuscles": [
      "Biceps Brachii",
      "Rear Deltoid",
      "Rhomboids"
    ],
    "difficulty": "Beginner",
    "equipment": "Bodyweight",
    "instructions": [
      "Grip the rings using a false grip, with the base of your palms on top of the rings. Initiate a pull up by pulling the elbows down to your side, flexing the elbows.",
      "As you reach the top position of the pull-up, pull the rings to your armpits as you roll your shoulders forward, allowing your elbows to move straight back behind you. This puts you into the proper position to continue into the dip portion of the movement.",
      "Maintaining control and stability, extend through the elbow to complete the motion.",
      "Use care when lowering yourself to the ground."
    ],
    "safetyTips": [
      "Maintain continuous mechanical tension on the back & lats throughout the entire range of motion.",
      "Avoid jerking or swinging weights—prioritize pristine joint alignment and posture.",
      "Focus on an explosive 1-second concentric drive followed by a disciplined 2-3 second eccentric stretch."
    ],
    "commonMistakes": [
      "Using excessive weight that compromises full range of motion and form discipline.",
      "Hyperextending joints or flaring elbows/knees past safe structural angles.",
      "Rushing through reps and losing active mind-muscle connection with the back & lats."
    ],
    "imageUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/muscle-up.gif",
    "gifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/muscle-up.gif",
    "mirrorGifUrl": "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/lats/muscle-up.gif",
    "caloriesBurnEstimatePerHour": 320
  }
];
