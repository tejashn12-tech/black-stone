import json

# Full exact 60-item cycle from user prompt with exact base variation numbers and target muscles
cycle_data = [
    # 0 to 29 (Block 1)
    {"name": "Chest Press", "cat": "Upper Body", "target": "Chest", "key": "chest", "base_var": 1, "inc": 2},
    {"name": "Quads Lunge", "cat": "Lower Body", "target": "Quads", "key": "quads", "base_var": 1, "inc": 3},
    {"name": "Abs Twist", "cat": "Core", "target": "Abs", "key": "abs", "base_var": 1, "inc": 4},
    {"name": "Cardio High Knees", "cat": "Cardio", "target": "Full Body", "key": "full_body", "base_var": 1, "inc": 6},
    {"name": "Full Body Stretch", "cat": "Flexibility", "target": "Full Body", "key": "full_body", "base_var": 1, "inc": 4},
    {"name": "Back Fly", "cat": "Upper Body", "target": "Back", "key": "back", "base_var": 1, "inc": 2},
    {"name": "Hamstrings Lunge", "cat": "Lower Body", "target": "Hamstrings", "key": "hamstrings", "base_var": 1, "inc": 3},
    {"name": "Obliques Leg Raise", "cat": "Core", "target": "Obliques", "key": "obliques", "base_var": 1, "inc": 4},
    {"name": "Cardio Jumps", "cat": "Cardio", "target": "Legs", "key": "legs", "base_var": 1, "inc": 6},
    {"name": "Upper Body Hold", "cat": "Flexibility", "target": "Upper Body", "key": "upper_body", "base_var": 1, "inc": 4},
    {"name": "Shoulders Extension", "cat": "Upper Body", "target": "Shoulders", "key": "shoulders", "base_var": 1, "inc": 2},
    {"name": "Glutes Lunge", "cat": "Lower Body", "target": "Glutes", "key": "glutes", "base_var": 1, "inc": 3},
    {"name": "Lower Back Crunch", "cat": "Core", "target": "Lower Back", "key": "lower_back", "base_var": 1, "inc": 4},
    {"name": "Cardio Burpee", "cat": "Cardio", "target": "Full Body", "key": "full_body", "base_var": 2, "inc": 6},
    {"name": "Lower Body Rotation", "cat": "Flexibility", "target": "Lower Body", "key": "lower_body", "base_var": 1, "inc": 4},
    {"name": "Biceps Curl", "cat": "Upper Body", "target": "Biceps", "key": "biceps", "base_var": 1, "inc": 2},
    {"name": "Calves Lunge", "cat": "Lower Body", "target": "Calves", "key": "calves", "base_var": 1, "inc": 3},
    {"name": "Abs Plank", "cat": "Core", "target": "Abs", "key": "abs", "base_var": 2, "inc": 4},
    {"name": "Cardio Sprints", "cat": "Cardio", "target": "Legs", "key": "legs", "base_var": 2, "inc": 6},
    {"name": "Full Body Yoga Pose", "cat": "Flexibility", "target": "Full Body", "key": "full_body", "base_var": 2, "inc": 4},
    {"name": "Triceps Raise", "cat": "Upper Body", "target": "Triceps", "key": "triceps", "base_var": 1, "inc": 2},
    {"name": "Quads Lunge", "cat": "Lower Body", "target": "Quads", "key": "quads", "base_var": 2, "inc": 3},
    {"name": "Obliques Twist", "cat": "Core", "target": "Obliques", "key": "obliques", "base_var": 2, "inc": 4},
    {"name": "Cardio High Knees", "cat": "Cardio", "target": "Full Body", "key": "full_body", "base_var": 3, "inc": 6},
    {"name": "Upper Body Stretch", "cat": "Flexibility", "target": "Upper Body", "key": "upper_body", "base_var": 2, "inc": 4},
    {"name": "Forearms Row", "cat": "Upper Body", "target": "Forearms", "key": "forearms", "base_var": 1, "inc": 2},
    {"name": "Hamstrings Lunge", "cat": "Lower Body", "target": "Hamstrings", "key": "hamstrings", "base_var": 2, "inc": 3},
    {"name": "Lower Back Leg Raise", "cat": "Core", "target": "Lower Back", "key": "lower_back", "base_var": 2, "inc": 4},
    {"name": "Cardio Jumps", "cat": "Cardio", "target": "Legs", "key": "legs", "base_var": 3, "inc": 6},
    {"name": "Lower Body Hold", "cat": "Flexibility", "target": "Lower Body", "key": "lower_body", "base_var": 2, "inc": 4},
    
    # 30 to 59 (Block 2)
    {"name": "Chest Press", "cat": "Upper Body", "target": "Chest", "key": "chest", "base_var": 2, "inc": 2},
    {"name": "Glutes Lunge", "cat": "Lower Body", "target": "Glutes", "key": "glutes", "base_var": 2, "inc": 3},
    {"name": "Abs Crunch", "cat": "Core", "target": "Abs", "key": "abs", "base_var": 3, "inc": 4},
    {"name": "Cardio Burpee", "cat": "Cardio", "target": "Full Body", "key": "full_body", "base_var": 4, "inc": 6},
    {"name": "Full Body Rotation", "cat": "Flexibility", "target": "Full Body", "key": "full_body", "base_var": 3, "inc": 4},
    {"name": "Back Fly", "cat": "Upper Body", "target": "Back", "key": "back", "base_var": 2, "inc": 2},
    {"name": "Calves Lunge", "cat": "Lower Body", "target": "Calves", "key": "calves", "base_var": 2, "inc": 3},
    {"name": "Obliques Plank", "cat": "Core", "target": "Obliques", "key": "obliques", "base_var": 3, "inc": 4},
    {"name": "Cardio Sprints", "cat": "Cardio", "target": "Legs", "key": "legs", "base_var": 4, "inc": 6},
    {"name": "Upper Body Yoga Pose", "cat": "Flexibility", "target": "Upper Body", "key": "upper_body", "base_var": 3, "inc": 4},
    {"name": "Shoulders Extension", "cat": "Upper Body", "target": "Shoulders", "key": "shoulders", "base_var": 2, "inc": 2},
    {"name": "Quads Lunge", "cat": "Lower Body", "target": "Quads", "key": "quads", "base_var": 3, "inc": 3},
    {"name": "Lower Back Twist", "cat": "Core", "target": "Lower Back", "key": "lower_back", "base_var": 3, "inc": 4},
    {"name": "Cardio High Knees", "cat": "Cardio", "target": "Full Body", "key": "full_body", "base_var": 5, "inc": 6},
    {"name": "Lower Body Stretch", "cat": "Flexibility", "target": "Lower Body", "key": "lower_body", "base_var": 3, "inc": 4},
    {"name": "Biceps Curl", "cat": "Upper Body", "target": "Biceps", "key": "biceps", "base_var": 2, "inc": 2},
    {"name": "Hamstrings Lunge", "cat": "Lower Body", "target": "Hamstrings", "key": "hamstrings", "base_var": 3, "inc": 3},
    {"name": "Abs Leg Raise", "cat": "Core", "target": "Abs", "key": "abs", "base_var": 4, "inc": 4},
    {"name": "Cardio Jumps", "cat": "Cardio", "target": "Legs", "key": "legs", "base_var": 5, "inc": 6},
    {"name": "Full Body Hold", "cat": "Flexibility", "target": "Full Body", "key": "full_body", "base_var": 4, "inc": 4},
    {"name": "Triceps Raise", "cat": "Upper Body", "target": "Triceps", "key": "triceps", "base_var": 2, "inc": 2},
    {"name": "Glutes Lunge", "cat": "Lower Body", "target": "Glutes", "key": "glutes", "base_var": 3, "inc": 3},
    {"name": "Obliques Crunch", "cat": "Core", "target": "Obliques", "key": "obliques", "base_var": 4, "inc": 4},
    {"name": "Cardio Burpee", "cat": "Cardio", "target": "Full Body", "key": "full_body", "base_var": 6, "inc": 6},
    {"name": "Upper Body Rotation", "cat": "Flexibility", "target": "Upper Body", "key": "upper_body", "base_var": 4, "inc": 4},
    {"name": "Forearms Row", "cat": "Upper Body", "target": "Forearms", "key": "forearms", "base_var": 2, "inc": 2},
    {"name": "Calves Lunge", "cat": "Lower Body", "target": "Calves", "key": "calves", "base_var": 3, "inc": 3},
    {"name": "Lower Back Plank", "cat": "Core", "target": "Lower Back", "key": "lower_back", "base_var": 4, "inc": 4},
    {"name": "Cardio Sprints", "cat": "Cardio", "target": "Legs", "key": "legs", "base_var": 6, "inc": 6},
    {"name": "Lower Body Yoga Pose", "cat": "Flexibility", "target": "Lower Body", "key": "lower_body", "base_var": 4, "inc": 4}
]

MOVEMENT_DETAILS = {
    "Chest Press": {
        "equipment": ["Barbell", "Dumbbell", "Cable", "Machine"],
        "secondaries": ["Triceps", "Front Deltoids", "Core"],
        "instructions": [
            "Lie securely on the flat bench with your feet firmly planted on the floor.",
            "Grip the resistance with hands placed slightly wider than shoulder-width apart.",
            "Retract your scapulae (shoulder blades) and establish a slight natural arch in the lower back.",
            "Inhale as you lower the weight under control until it reaches mid-chest level.",
            "Drive upwards forcefully through the chest while keeping elbows tucked at roughly 45 to 70 degrees.",
            "Squeeze your pectorals tightly at the top without locking your elbows harshly."
        ],
        "safetyTips": [
            "Never bounce the resistance off your sternum or ribcage.",
            "Keep wrists straight and directly stacked over your forearms.",
            "Maintain shoulder blades retracted throughout the entire repetition."
        ],
        "commonMistakes": [
            "Flaring elbows out at 90 degrees which increases shoulder impingement risk.",
            "Lifting the hips or glutes off the bench during the pressing effort.",
            "Cutting the bottom range of motion short."
        ],
        "burnKcal": 480,
        "gifPath": "pectorals/barbell-bench-press.gif"
    },
    "Quads Lunge": {
        "equipment": ["Dumbbell", "Barbell", "Bodyweight", "Kettlebell"],
        "secondaries": ["Glutes", "Hamstrings", "Calves", "Core"],
        "instructions": [
            "Stand tall with feet hip-width apart and shoulders pulled back.",
            "Take a deliberate stride forward with one leg while keeping your torso upright.",
            "Lower your hips straight down until your front thigh is parallel to the floor.",
            "Ensure your back knee hovers just an inch above the ground without slamming.",
            "Push off through the mid-foot and heel of your front foot to return to the starting position.",
            "Alternate legs or finish all prescribed repetitions on one side before switching."
        ],
        "safetyTips": [
            "Keep your front knee aligned directly over your second toe, preventing inward collapse.",
            "Maintain core bracing to avoid forward leaning or lower back hyperextension."
        ],
        "commonMistakes": [
            "Allowing the front heel to lift off the floor.",
            "Taking too short a step, placing excessive shearing force on the front patellar tendon."
        ],
        "burnKcal": 520,
        "gifPath": "quadriceps/dumbbell-lunge.gif"
    },
    "Abs Twist": {
        "equipment": ["Bodyweight", "Medicine Ball", "Dumbbell", "Cable"],
        "secondaries": ["Obliques", "Hip Flexors", "Transverse Abdominis"],
        "instructions": [
            "Sit on a comfortable exercise mat with knees bent and heels lightly touching the floor.",
            "Lean your torso back approximately 45 degrees to engage the entire abdominal wall.",
            "Hold your hands together in front of your chest or hold a resistance weight.",
            "Rotate your ribcage and shoulders smoothly to the right side, touching near your hip.",
            "Pause briefly, then rotate under strict control through center over to the left side.",
            "Continue alternating in a continuous, rhythmical pattern while keeping the core tight."
        ],
        "safetyTips": [
            "Initiate the rotation from the thoracic spine and core, not by jerking your neck or arms.",
            "Keep the lower back neutral without severe rounding."
        ],
        "commonMistakes": [
            "Swinging the arms side-to-side without actually rotating the torso.",
            "Holding your breath during the rotational sequence."
        ],
        "burnKcal": 400,
        "gifPath": "abdominals/seated-russian-twist.gif"
    },
    "Cardio High Knees": {
        "equipment": ["Bodyweight"],
        "secondaries": ["Hip Flexors", "Calves", "Quads", "Cardiovascular System"],
        "instructions": [
            "Stand upright with feet hip-width apart, arms at your sides ready for athletic motion.",
            "Drive your right knee up towards chest level while pumping your left arm forward.",
            "Quickly transition onto the ball of your foot and drive your left knee up to chest height.",
            "Maintain a fast, springy cadence, landing softly on the balls of your feet.",
            "Keep your chest proud and core actively engaged throughout the interval."
        ],
        "safetyTips": [
            "Land softly on the balls of your feet to minimize impact shock on joints.",
            "Maintain an upright athletic posture rather than leaning backward."
        ],
        "commonMistakes": [
            "Leaning back excessively to compensate for hip flexor fatigue.",
            "Letting knees only rise to waist level instead of driving high."
        ],
        "burnKcal": 650,
        "gifPath": "cardio/running.gif"
    },
    "Full Body Stretch": {
        "equipment": ["Bodyweight", "Yoga Mat"],
        "secondaries": ["Spine", "Hamstrings", "Shoulders", "Chest", "Hips"],
        "instructions": [
            "Stand tall or start on the mat, reaching both arms extended fully overhead.",
            "Inhale deeply and lengthen your entire spine from the tailbone to fingertips.",
            "Hinge gently at the hips to fold forward, allowing hamstrings and lower back to elongate.",
            "Hold the comfortable stretch for 20 to 30 seconds while taking slow, diaphragmatic breaths.",
            "Transition into a gentle cobra or child pose to restore full anterior and posterior chain balance."
        ],
        "safetyTips": [
            "Never bounce aggressively in deep stretches; ease into resistance gradually.",
            "Breathe continuously and relax into the stretch."
        ],
        "commonMistakes": [
            "Forcing a joint past its active comfortable range of motion.",
            "Tensing the neck and shoulders instead of relaxing."
        ],
        "burnKcal": 220,
        "gifPath": "flexibility/child-pose.gif"
    },
    "Back Fly": {
        "equipment": ["Dumbbell", "Cable", "Resistance Band", "Machine"],
        "secondaries": ["Rear Deltoids", "Rhomboids", "Trapezius", "Rotator Cuff"],
        "instructions": [
            "Hinge forward at the hips with a flat back and slight knee flexion.",
            "Hold weights below your chest with palms facing each other and elbows slightly bent.",
            "Raise your arms out to the sides in a wide arc until elbows align with your torso.",
            "Squeeze your shoulder blades together firmly at the peak contraction.",
            "Lower the resistance with slow, controlled eccentric tempo to the starting mark."
        ],
        "safetyTips": [
            "Keep your cervical spine neutral by looking at a spot on the floor 3-4 feet ahead.",
            "Avoid rounding the thoracic or lumbar spine under load."
        ],
        "commonMistakes": [
            "Using momentum and swinging the upper body upward.",
            "Bending the elbows into a row instead of maintaining a wide fly angle."
        ],
        "burnKcal": 450,
        "gifPath": "upper-back/dumbbell-reverse-fly.gif"
    },
    "Hamstrings Lunge": {
        "equipment": ["Dumbbell", "Barbell", "Kettlebell", "Bodyweight"],
        "secondaries": ["Glutes", "Adductors", "Calves", "Core"],
        "instructions": [
            "Step forward into a long lunge stance to emphasize posterior chain tension.",
            "Hinge slightly forward from the hips with a flat back to load the front hamstring.",
            "Lower your hips smoothly until the rear knee hovers above the floor.",
            "Drive forcefully through the front heel, focusing tension on the hamstrings and glutes.",
            "Step back to center and alternate legs with high biomechanical precision."
        ],
        "safetyTips": [
            "Keep the front knee tracking directly over the toes.",
            "Maintain active tension in the core to support the lumbar spine."
        ],
        "commonMistakes": [
            "Shifting weight onto the front toes instead of driving through the heel.",
            "Rounding the spine when hinging forward."
        ],
        "burnKcal": 510,
        "gifPath": "hamstrings/dumbbell-romanian-deadlift.gif"
    },
    "Obliques Leg Raise": {
        "equipment": ["Bodyweight", "Captain's Chair", "Pull-up Bar", "Mat"],
        "secondaries": ["Hip Flexors", "Lower Abs", "Serratus Anterior"],
        "instructions": [
            "Lie on your side or suspend yourself from a dip/pull-up station with back supported.",
            "Engage your obliques and raise your legs upward toward the lateral side.",
            "Focus on compressing the lateral abdominal wall and bringing pelvis toward ribcage.",
            "Hold the top contraction for a full second count.",
            "Lower the legs slowly to the start position and repeat for all reps before switching sides."
        ],
        "safetyTips": [
            "Do not swing or kick legs with momentum.",
            "Keep breathing rhythmic; exhale as legs lift."
        ],
        "commonMistakes": [
            "Using swinging momentum rather than muscular contraction.",
            "Arching the lower back excessively during lowering."
        ],
        "burnKcal": 420,
        "gifPath": "abdominals/side-leg-raise.gif"
    },
    "Cardio Jumps": {
        "equipment": ["Bodyweight", "Jump Rope", "Plyo Box"],
        "secondaries": ["Calves", "Quads", "Glutes", "Shoulders"],
        "instructions": [
            "Stand with feet shoulder-width apart, knees slightly softened.",
            "Dip into a shallow quarter squat and load your hips and ankles.",
            "Explode upward off the balls of your feet into a vertical jump.",
            "Absorb the landing softly by bending your knees and rolling from toes to heels.",
            "Immediately rebound into the next jump with consistent rhythm."
        ],
        "safetyTips": [
            "Always land quietly with soft knees to protect joints.",
            "Wear supportive footwear and train on shock-absorbing flooring."
        ],
        "commonMistakes": [
            "Landing stiff-legged with knees locked out.",
            "Letting knees cave inward upon impact."
        ],
        "burnKcal": 620,
        "gifPath": "cardio/jumping-jacks.gif"
    },
    "Upper Body Hold": {
        "equipment": ["Bodyweight", "Yoga Mat", "Pull-up Bar"],
        "secondaries": ["Shoulders", "Chest", "Lats", "Upper Back"],
        "instructions": [
            "Assume a static isometric hold (such as an extended arms plank, hollow body, or dead hang).",
            "Engage your scapular stabilizers, chest, and shoulders simultaneously.",
            "Keep the neck relaxed and maintain smooth, even breathing.",
            "Hold the posture for 30 to 60 seconds with immovable stability.",
            "Release with control and repeat for designated rounds."
        ],
        "safetyTips": [
            "Do not hold your breath during isometric positions.",
            "Discontinue immediately if you experience joint pinching."
        ],
        "commonMistakes": [
            "Allowing the lower back to sag or shoulders to shrug up into the ears.",
            "Losing core engagement."
        ],
        "burnKcal": 300,
        "gifPath": "flexibility/overhead-stretch.gif"
    },
    "Shoulders Extension": {
        "equipment": ["Dumbbell", "Cable", "Barbell", "Resistance Band"],
        "secondaries": ["Lateral Delts", "Anterior Delts", "Upper Traps", "Triceps"],
        "instructions": [
            "Stand upright with dumbbells in hands or cable pulleys at shoulder height.",
            "Raise or press the resistance along the natural scapular plane.",
            "Pause at peak extension with deltoids fully contracted.",
            "Lower with controlled tempo under tension.",
            "Avoid shrugging the trapezius to keep tension centered on the deltoids."
        ],
        "safetyTips": [
            "Do not hyperextend the lower back to push the weight.",
            "Keep a micro-bend in elbows during lateral extensions."
        ],
        "commonMistakes": [
            "Using leg drive on strict isolation movements.",
            "Dropping weights quickly without resisting the eccentric descent."
        ],
        "burnKcal": 440,
        "gifPath": "shoulders/dumbbell-lateral-raise.gif"
    },
    "Glutes Lunge": {
        "equipment": ["Dumbbell", "Barbell", "Kettlebell", "Bodyweight"],
        "secondaries": ["Hamstrings", "Quads", "Core", "Abductors"],
        "instructions": [
            "Take a wide step into a lunge with a noticeable torso forward lean (30 degrees).",
            "This torso angle places maximum stretch and mechanical tension onto the gluteus maximus.",
            "Lower until the back knee grazes the floor.",
            "Drive intensely through the lead heel, squeezing the glute at the top.",
            "Complete all repetitions per leg with steady cadence."
        ],
        "safetyTips": [
            "Maintain spinal neutrality with active abdominal bracing.",
            "Keep the front knee tracked over the second and third toes."
        ],
        "commonMistakes": [
            "Staying too upright which shifts tension to the quads.",
            "Pushing off the rear foot instead of loading the front glute."
        ],
        "burnKcal": 530,
        "gifPath": "glutes/cable-kickback.gif"
    },
    "Lower Back Crunch": {
        "equipment": ["Mat", "Stability Ball", "Hyperextension Bench"],
        "secondaries": ["Erector Spinae", "Glutes", "Hamstrings"],
        "instructions": [
            "Lie face down on a mat in a prone position or secure yourself on a 45-degree hyperextension bench.",
            "Place hands lightly behind ears or extended in front in superman stance.",
            "Contract your lower back and erector spinae to lift your chest and thighs smoothly off the mat.",
            "Hold the top contraction for 1-2 seconds, feeling the deep posterior chain engagement.",
            "Lower slowly back down to the resting position."
        ],
        "safetyTips": [
            "Avoid aggressive hyper-extension or violent jerking of the spine.",
            "Keep the movement slow and controlled."
        ],
        "commonMistakes": [
            "Craning the neck backward.",
            "Holding breath during peak contraction."
        ],
        "burnKcal": 380,
        "gifPath": "lower-back/superman.gif"
    },
    "Cardio Burpee": {
        "equipment": ["Bodyweight"],
        "secondaries": ["Chest", "Quads", "Core", "Shoulders", "Cardiovascular System"],
        "instructions": [
            "Stand with feet shoulder-width apart, arms by sides.",
            "Drop quickly into a squat, placing your palms flat on the ground inside your feet.",
            "Kick your feet back into a full push-up plank position and perform a crisp chest-to-floor push-up.",
            "Press up and immediately jump your feet back forward outside your hands.",
            "Explode vertically into the air, reaching arms overhead with a clap."
        ],
        "safetyTips": [
            "Do not allow your hips to sag in the plank position.",
            "Land softly on the balls of your feet."
        ],
        "commonMistakes": [
            "Skipping the full depth of the push-up or the vertical jump.",
            "Arching lower back when jumping back."
        ],
        "burnKcal": 700,
        "gifPath": "cardio/burpee.gif"
    },
    "Lower Body Rotation": {
        "equipment": ["Bodyweight", "Yoga Mat"],
        "secondaries": ["Hips", "Glutes", "Lower Back", "IT Band"],
        "instructions": [
            "Lie supine on the mat with knees bent at 90 degrees and arms outstretched in a T-shape.",
            "Slowly lower both knees together to the right side until they touch the floor.",
            "Keep both shoulders pinned flat against the mat.",
            "Hold for a breath, engage the obliques, and pull knees back to center.",
            "Lower smoothly to the left side and repeat."
        ],
        "safetyTips": [
            "Ensure movement is gentle and fluid without sudden twisting forces.",
            "Keep upper back and shoulders grounded."
        ],
        "commonMistakes": [
            "Lifting the opposite shoulder off the floor.",
            "Moving too quickly."
        ],
        "burnKcal": 260,
        "gifPath": "flexibility/lower-body-rotation.gif"
    },
    "Biceps Curl": {
        "equipment": ["Dumbbell", "Barbell", "Cable", "EZ Bar"],
        "secondaries": ["Brachialis", "Brachioradialis", "Forearms"],
        "instructions": [
            "Stand with feet shoulder-width apart, holding weights at arm's length with supinated palms.",
            "Keep elbows pinned to your sides throughout the movement.",
            "Curl the weights upward by contracting your biceps until full flexion is achieved.",
            "Squeeze biceps firmly at the top for a 1-second peak contraction.",
            "Lower the weights slowly over a 2 to 3-second negative phase."
        ],
        "safetyTips": [
            "Do not swing the torso or use momentum from hips.",
            "Keep wrists neutral and firm."
        ],
        "commonMistakes": [
            "Letting elbows drift forward excessively during the curl.",
            "Dropping the weights quickly on the way down."
        ],
        "burnKcal": 420,
        "gifPath": "biceps/dumbbell-biceps-curl.gif"
    },
    "Calves Lunge": {
        "equipment": ["Dumbbell", "Bodyweight", "Step Platform", "Machine"],
        "secondaries": ["Gastrocnemius", "Soleus", "Tibialis Anterior"],
        "instructions": [
            "Take a lunge stance with the ball of the front foot elevated on an aerobic step or block.",
            "Lower the heel below the step level into a deep calf stretch.",
            "Drive through the big toe to raise the heel as high as possible into peak plantarflexion.",
            "Pause and squeeze the calf intensely at the top.",
            "Lower with controlled eccentric cadence and repeat."
        ],
        "safetyTips": [
            "Hold onto a sturdy upright or frame for balance.",
            "Avoid bouncing at the bottom of the stretch."
        ],
        "commonMistakes": [
            "Cutting the stretch short at the bottom.",
            "Rolling weight onto outer edges of feet instead of driving through the big toe."
        ],
        "burnKcal": 450,
        "gifPath": "calves/standing-calf-raise.gif"
    },
    "Abs Plank": {
        "equipment": ["Bodyweight", "Yoga Mat"],
        "secondaries": ["Transverse Abdominis", "Glutes", "Shoulders", "Lower Back"],
        "instructions": [
            "Place forearms on the floor with elbows aligned directly beneath shoulders.",
            "Extend legs back with toes tucked under, forming a straight rigid line from heels to head.",
            "Squeeze glutes and brace your abdominal core as if anticipating a punch.",
            "Keep cervical spine neutral by looking down at the mat.",
            "Hold the position for designated duration (30-90 seconds) with continuous diaphragmatic breathing."
        ],
        "safetyTips": [
            "Never allow hips to sag downward into lumbar hyperextension.",
            "Do not pike hips excessively into an inverted V."
        ],
        "commonMistakes": [
            "Holding your breath.",
            "Collapsing shoulder blades together."
        ],
        "burnKcal": 360,
        "gifPath": "abdominals/plank.gif"
    },
    "Cardio Sprints": {
        "equipment": ["Treadmill", "Track", "Bodyweight"],
        "secondaries": ["Hamstrings", "Quads", "Calves", "Glutes", "Cardiovascular System"],
        "instructions": [
            "Begin in an athletic starting stance with slight forward lean.",
            "Drive aggressively through the balls of the feet with maximum arm drive.",
            "Maintain high knee lift and dorsiflexed ankles for efficient force transfer.",
            "Sprint at 90-100% maximal effort for the prescribed distance or interval (15-30 seconds).",
            "Decelerate smoothly and rest before next burst."
        ],
        "safetyTips": [
            "Warm up thoroughly with dynamic drills before all-out sprint intervals.",
            "Maintain upright torso alignment at top speed."
        ],
        "commonMistakes": [
            "Over-striding which puts excessive braking force on hamstrings.",
            "Tensing jaw and shoulders."
        ],
        "burnKcal": 750,
        "gifPath": "cardio/treadmill-sprint.gif"
    },
    "Full Body Yoga Pose": {
        "equipment": ["Yoga Mat", "Bodyweight"],
        "secondaries": ["Whole Body", "Spine", "Core", "Hips", "Shoulders"],
        "instructions": [
            "Transition into a powerful full-body yoga asana (such as Warrior II, Downward-Facing Dog, or Extended Triangle).",
            "Establish solid ground contact through feet and palms.",
            "Lengthen spine, open chest, and engage the bandhas (energy locks / core).",
            "Breathe through the nose in steady, deep Ujjayi cycles.",
            "Hold for 5 deep breaths per side."
        ],
        "safetyTips": [
            "Listen to your body's joint limits and modify depth if needed.",
            "Do not force alignment that causes knee or lower back strain."
        ],
        "commonMistakes": [
            "Shallowing breathing during intense poses.",
            "Collapsing arches of feet."
        ],
        "burnKcal": 280,
        "gifPath": "flexibility/warrior-pose.gif"
    },
    "Triceps Raise": {
        "equipment": ["Cable", "Dumbbell", "Barbell", "Bodyweight"],
        "secondaries": ["Triceps Lateral Head", "Long Head", "Medial Head", "Forearms"],
        "instructions": [
            "Position resistance overhead or at a high cable pulley with elbows tucked near temples.",
            "Extend forearms forcefully by contracting the triceps until arms are fully extended.",
            "Squeeze triceps at peak lockout for a distinct beat.",
            "Lower the resistance behind head or back up slowly, keeping upper arms stationary.",
            "Repeat for all prescribed repetitions with strict form."
        ],
        "safetyTips": [
            "Keep upper arms locked in place without flaring elbows excessively.",
            "Do not arch the lower back when pressing overhead."
        ],
        "commonMistakes": [
            "Using shoulder momentum instead of isolating the elbow extension.",
            "Moving elbows back and forth."
        ],
        "burnKcal": 410,
        "gifPath": "triceps/cable-pushdown.gif"
    },
    "Forearms Row": {
        "equipment": ["Barbell", "Dumbbell", "Cable", "Farmer Handles"],
        "secondaries": ["Wrist Flexors", "Brachioradialis", "Upper Back", "Grip"],
        "instructions": [
            "Hold heavy dumbbells or barbell with an overhand or neutral grip.",
            "Row the resistance up while actively engaging forearm flexors and crushing the grip.",
            "Perform a slight wrist roll at the top of the pull for peak forearm stimulation.",
            "Lower under complete control to full elbow extension.",
            "Repeat with sustained grip intensity."
        ],
        "safetyTips": [
            "Keep wrists in neutral alignment to avoid wrist tendon strain.",
            "Do not let the weight slip from fingertips."
        ],
        "commonMistakes": [
            "Letting wrists bend backwards under heavy load.",
            "Using straps when forearm and grip strength is the targeted goal."
        ],
        "burnKcal": 430,
        "gifPath": "forearms/wrist-curls.gif"
    },
    "Abs Crunch": {
        "equipment": ["Bodyweight", "Mat", "Cable", "Machine"],
        "secondaries": ["Upper Rectus Abdominis", "Transverse Abdominis"],
        "instructions": [
            "Lie on your back with knees bent at 90 degrees and feet flat on the floor.",
            "Place fingertips lightly behind your head with elbows pointing out.",
            "Curl your ribcage down toward your pelvis, lifting your upper back off the floor.",
            "Exhale and contract the abdominal wall intensely for 1 second.",
            "Lower back down slowly, keeping constant tension on the abs."
        ],
        "safetyTips": [
            "Do not yank on your neck with your hands; look up at the ceiling.",
            "Keep the lower back pressed flat into the floor."
        ],
        "commonMistakes": [
            "Pulling the head forward with arms.",
            "Using momentum instead of muscular contraction."
        ],
        "burnKcal": 380,
        "gifPath": "abdominals/crunch.gif"
    },
    "Obliques Plank": {
        "equipment": ["Bodyweight", "Mat"],
        "secondaries": ["Lateral Core", "Gluteus Medius", "Shoulder Stabilizers"],
        "instructions": [
            "Lie on your side with feet stacked and forearm directly beneath your shoulder.",
            "Raise your hips until your body forms a straight diagonal line from head to heels.",
            "Engage your bottom oblique and gluteus medius intensely.",
            "Hold for 30 to 60 seconds per side with steady breathing.",
            "Switch sides and repeat."
        ],
        "safetyTips": [
            "Keep the supporting shoulder active and depressed away from your ear.",
            "Do not allow hips to sag toward the floor."
        ],
        "commonMistakes": [
            "Rotating the upper chest downward toward the floor.",
            "Letting top hip roll backward."
        ],
        "burnKcal": 390,
        "gifPath": "abdominals/side-plank.gif"
    },
    "Obliques Twist": {
        "equipment": ["Cable", "Resistance Band", "Medicine Ball", "Dumbbell"],
        "secondaries": ["Obliques", "Core", "Hips"],
        "instructions": [
            "Stand perpendicular to a cable station or holding a medicine ball at chest level.",
            "Rotate your torso away from the pulley across your body with core engaged.",
            "Pivot on the back foot to transfer power safely through hips.",
            "Squeeze the working oblique at full rotation.",
            "Control the return motion back to starting position."
        ],
        "safetyTips": [
            "Rotate through the thoracic spine and hips, not purely through lumbar vertebrae.",
            "Keep core braced throughout."
        ],
        "commonMistakes": [
            "Swinging purely with the arms.",
            "Moving too rapidly without controlling the eccentric return."
        ],
        "burnKcal": 410,
        "gifPath": "abdominals/russian-twist.gif"
    },
    "Obliques Crunch": {
        "equipment": ["Bodyweight", "Mat"],
        "secondaries": ["Obliques", "Intercostals", "Upper Abs"],
        "instructions": [
            "Lie on your back and drop your knees to one side onto the floor.",
            "Keep your upper chest facing the ceiling with hands supporting head.",
            "Crunch upward, bringing your ribcage toward your hip on the top side.",
            "Squeeze the oblique tightly at the apex.",
            "Lower slowly and repeat for all reps before alternating sides."
        ],
        "safetyTips": [
            "Do not pull on the neck.",
            "Focus on the side contraction."
        ],
        "commonMistakes": [
            "Twisting the neck instead of curling the torso.",
            "Moving too fast without pausing."
        ],
        "burnKcal": 370,
        "gifPath": "abdominals/side-crunch.gif"
    },
    "Lower Back Plank": {
        "equipment": ["Bodyweight", "Mat"],
        "secondaries": ["Erector Spinae", "Glutes", "Hamstrings", "Rear Delts"],
        "instructions": [
            "Sit on the floor with legs extended in front, placing hands on the floor behind hips.",
            "Drive through palms and heels to lift your hips into a reverse plank line.",
            "Engage lower back, glutes, and hamstrings to hold the straight position.",
            "Keep chest open and look upward toward the ceiling.",
            "Hold for 30-45 seconds with calm breaths."
        ],
        "safetyTips": [
            "Do not let hips sag.",
            "Keep wrists comfortable under shoulders."
        ],
        "commonMistakes": [
            "Dropping head back too far.",
            "Losing glute contraction."
        ],
        "burnKcal": 350,
        "gifPath": "lower-back/bird-dog.gif"
    },
    "Lower Back Twist": {
        "equipment": ["Bodyweight", "Mat", "Stick"],
        "secondaries": ["Thoracic Spine", "Erector Spinae", "Obliques"],
        "instructions": [
            "Sit tall on a bench or mat with spine fully upright.",
            "Cross arms over chest or place a light stick across shoulders.",
            "Rotate smoothly to the right, feeling the gentle release and mobility through the back.",
            "Pause for a deep breath, return through center, and rotate to the left.",
            "Maintain tall posture without slouching."
        ],
        "safetyTips": [
            "Perform rotations smoothly without ballistic jerking.",
            "Stop if sharp pinching occurs."
        ],
        "commonMistakes": [
            "Slouching forward during the twist.",
            "Over-rotating beyond comfortable range."
        ],
        "burnKcal": 270,
        "gifPath": "lower-back/torso-twist.gif"
    },
    "Lower Back Leg Raise": {
        "equipment": ["Bodyweight", "Mat", "Bench"],
        "secondaries": ["Glutes", "Hamstrings", "Erector Spinae"],
        "instructions": [
            "Lie face down on a flat bench or mat with hips at the edge.",
            "Hold the bench firmly and lift both straight legs upward behind you.",
            "Squeeze glutes and lower back at the top when legs align with torso.",
            "Hold for 1 second, then lower under control.",
            "Repeat for prescribed repetitions."
        ],
        "safetyTips": [
            "Do not kick violently with momentum.",
            "Keep core engaged to protect the lumbar spine."
        ],
        "commonMistakes": [
            "Swinging legs instead of lifting with muscular tension.",
            "Overarching beyond parallel."
        ],
        "burnKcal": 400,
        "gifPath": "lower-back/reverse-hyper.gif"
    },
    "Abs Leg Raise": {
        "equipment": ["Bodyweight", "Mat", "Pull-up Bar"],
        "secondaries": ["Lower Abs", "Hip Flexors", "Transverse Abdominis"],
        "instructions": [
            "Lie flat on your back on a mat with hands by your sides or under glutes.",
            "Keep legs straight and pressed together.",
            "Engage lower abs and raise legs upward until they are perpendicular to the floor.",
            "Lower legs slowly back down, stopping 2 inches above the floor to maintain tension.",
            "Repeat without resting on the ground between reps."
        ],
        "safetyTips": [
            "Keep lower back glued to the floor; do not let it arch.",
            "Bend knees slightly if experiencing hamstring tightness."
        ],
        "commonMistakes": [
            "Letting lower back lift off the floor during the descent.",
            "Using momentum to swing legs up."
        ],
        "burnKcal": 430,
        "gifPath": "abdominals/lying-leg-raise.gif"
    },
    "Full Body Hold": {
        "equipment": ["Bodyweight", "Mat"],
        "secondaries": ["Core", "Quads", "Glutes", "Shoulders"],
        "instructions": [
            "Assume a hollow-body hold or isometric wall-sit position.",
            "Lock all major muscle groups simultaneously with unwavering tension.",
            "Keep spine supported and breathe deeply into the belly.",
            "Hold for the target duration (30-60s).",
            "Release with controlled grace."
        ],
        "safetyTips": [
            "Maintain steady breathing throughout.",
            "Discontinue if joints ache."
        ],
        "commonMistakes": [
            "Losing tightness in the midsection.",
            "Holding breath."
        ],
        "burnKcal": 340,
        "gifPath": "flexibility/hollow-body-hold.gif"
    },
    "Upper Body Stretch": {
        "equipment": ["Bodyweight", "Towel/Band"],
        "secondaries": ["Chest", "Shoulders", "Triceps", "Lats"],
        "instructions": [
            "Bring one arm across your chest and use your opposite arm to draw it gently closer.",
            "Feel the deep stretch across the posterior deltoid and upper back.",
            "Hold for 25-30 seconds with deep breaths.",
            "Switch arms and repeat, then perform an overhead triceps stretch.",
            "Finish with a doorway pectoral stretch."
        ],
        "safetyTips": [
            "Do not pull on the elbow joint directly.",
            "Keep shoulders relaxed away from ears."
        ],
        "commonMistakes": [
            "Shrugging shoulders upward.",
            "Bouncing in the stretch."
        ],
        "burnKcal": 210,
        "gifPath": "flexibility/shoulder-stretch.gif"
    },
    "Lower Body Stretch": {
        "equipment": ["Bodyweight", "Mat"],
        "secondaries": ["Quads", "Hamstrings", "Calves", "Hip Flexors"],
        "instructions": [
            "Stand on one leg, bend the other knee, and grab your ankle behind you.",
            "Gently draw the heel toward your glute while keeping knees aligned.",
            "Tuck your pelvis under slightly to amplify the rectus femoris stretch.",
            "Hold for 30 seconds per leg.",
            "Follow with a seated forward fold for hamstrings and calves."
        ],
        "safetyTips": [
            "Hold a wall or chair for balance if needed.",
            "Do not twist the knee joint."
        ],
        "commonMistakes": [
            "Letting the bent knee flare out to the side.",
            "Arching lower back."
        ],
        "burnKcal": 220,
        "gifPath": "flexibility/quad-stretch.gif"
    },
    "Upper Body Rotation": {
        "equipment": ["Bodyweight", "Mat"],
        "secondaries": ["Thoracic Spine", "Chest", "Rear Delts"],
        "instructions": [
            "Start on hands and knees in a quadruped position.",
            "Place one hand behind your head with elbow flared.",
            "Rotate your chest and elbow upward toward the ceiling, following with your gaze.",
            "Hold the top thoracic rotation for a breath, then rotate back down.",
            "Perform 8-12 smooth reps per side."
        ],
        "safetyTips": [
            "Keep hips level and steady without swaying.",
            "Rotate through the upper back."
        ],
        "commonMistakes": [
            "Shifting hips side to side.",
            "Moving too rapidly."
        ],
        "burnKcal": 250,
        "gifPath": "flexibility/thoracic-rotation.gif"
    },
    "Lower Body Hold": {
        "equipment": ["Bodyweight"],
        "secondaries": ["Quads", "Glutes", "Calves", "Hips"],
        "instructions": [
            "Lower into a deep, comfortable squat position with feet flat and chest proud.",
            "Use elbows inside knees to gently encourage hip adductor opening.",
            "Keep heels rooted firmly and breathe into the pelvic floor.",
            "Hold for 30-60 seconds to enhance hip and ankle mobility.",
            "Drive through midfoot to stand tall."
        ],
        "safetyTips": [
            "Do not allow knees to collapse inward.",
            "Place a small wedge under heels if ankle mobility is limited."
        ],
        "commonMistakes": [
            "Rising onto toes.",
            "Rounding the spine completely."
        ],
        "burnKcal": 310,
        "gifPath": "flexibility/deep-squat-hold.gif"
    },
    "Upper Body Yoga Pose": {
        "equipment": ["Yoga Mat"],
        "secondaries": ["Shoulders", "Chest", "Upper Spine", "Core"],
        "instructions": [
            "Lie prone on your mat with hands placed under shoulders.",
            "Press through palms to gently lift chest forward and up into Cobra or Upward Dog.",
            "Keep shoulders rolled back and down away from the ears.",
            "Breathe deeply into the heart center for 5 full cycles.",
            "Lower smoothly and push back into Child's Pose."
        ],
        "safetyTips": [
            "Engage glutes and legs to protect the lower back.",
            "Do not crunch the cervical neck."
        ],
        "commonMistakes": [
            "Shrugging shoulders up into the ears.",
            "Over-arching the lumbar spine."
        ],
        "burnKcal": 260,
        "gifPath": "flexibility/cobra-pose.gif"
    },
    "Lower Body Yoga Pose": {
        "equipment": ["Yoga Mat"],
        "secondaries": ["Piriformis", "Glutes", "Hips", "Hamstrings"],
        "instructions": [
            "From Downward Dog, bring your right knee forward behind your right wrist into Pigeon Pose.",
            "Extend the left leg straight behind you with top of foot flat on the mat.",
            "Square your hips forward and slowly walk hands out, folding over your front shin.",
            "Relax your jaw, breathe deeply, and hold for 1 to 2 minutes.",
            "Gently switch sides and repeat."
        ],
        "safetyTips": [
            "Flex the front foot to protect the knee joint.",
            "Place a yoga block or pillow under the hip if it does not reach the mat."
        ],
        "commonMistakes": [
            "Rolling onto the outer hip instead of staying centered.",
            "Forcing knee into pain."
        ],
        "burnKcal": 250,
        "gifPath": "flexibility/pigeon-pose.gif"
    },
    "Full Body Rotation": {
        "equipment": ["Bodyweight"],
        "secondaries": ["Whole Core", "Hips", "Shoulders", "Spine"],
        "instructions": [
            "Stand with feet shoulder-width apart with arms relaxed at your sides.",
            "Gently swing arms and torso from side to side in a flowing, continuous rotation.",
            "Allow your back heel to pivot naturally with each turn to protect knee joints.",
            "Breathe rhythmically as you build gentle momentum through the entire kinetic chain.",
            "Continue for 60 seconds to mobilize the entire body."
        ],
        "safetyTips": [
            "Always pivot on the trailing foot.",
            "Keep movements fluid and effortless."
        ],
        "commonMistakes": [
            "Planting feet rigidly without pivoting ankles and hips.",
            "Tensing up the shoulders."
        ],
        "burnKcal": 270,
        "gifPath": "flexibility/dynamic-torso-rotation.gif"
    }
}

exercises = []

for i in range(1, 1001):
    ex_id = f"EX-{i:04d}"
    idx = (i - 1) % 60
    round_num = (i - 1) // 60
    
    item_info = cycle_data[idx]
    base_name = item_info["name"]
    category_display = item_info["cat"]
    target_muscle = item_info["target"]
    target_key = item_info["key"]
    base_var = item_info["base_var"]
    inc = item_info["inc"]
    
    var_num = base_var + (round_num * inc)
    full_name = f"Variation {var_num}: {base_name}"
    cat_key = category_display.lower().replace(" ", "_")
    
    details = MOVEMENT_DETAILS[base_name]
    eq_list = details["equipment"]
    chosen_equipment = eq_list[(var_num - 1) % len(eq_list)]
    
    if var_num % 3 == 1:
        difficulty = "Beginner"
    elif var_num % 3 == 2:
        difficulty = "Intermediate"
    else:
        difficulty = "Advanced"
        
    slug_name = full_name.lower().replace(":", "").replace(" ", "-")
    prompt_gif_url = f"https://images.fitness-assets.example.com/exercises/{slug_name}.gif"
    
    gif_path = details["gifPath"]
    cdn_gif_url = f"https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/{gif_path}"
    cdn_thumb_url = f"https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@main/{gif_path.replace('.gif', '.thumb.webp')}"
    
    exercise_obj = {
        "id": ex_id,
        "name": full_name,
        "category": cat_key,
        "categoryDisplay": category_display,
        "targetMuscle": target_muscle,
        "targetMuscleKey": target_key,
        "targetMuscles": [target_muscle],
        "secondaryMuscles": details["secondaries"],
        "difficulty": difficulty,
        "equipment": chosen_equipment,
        "instructions": details["instructions"],
        "safetyTips": details["safetyTips"],
        "commonMistakes": details["commonMistakes"],
        "imageUrl": cdn_thumb_url,
        "gifUrl": prompt_gif_url,
        "mirrorGifUrl": cdn_gif_url,
        "caloriesBurnEstimatePerHour": details["burnKcal"] + ((var_num * 7) % 50)
    }
    
    exercises.append(exercise_obj)

print("Exact check:")
print("1:", exercises[0]["id"], exercises[0]["name"])
print("4:", exercises[3]["id"], exercises[3]["name"])
print("14:", exercises[13]["id"], exercises[13]["name"])
print("100:", exercises[99]["id"], exercises[99]["name"])
print("994:", exercises[993]["id"], exercises[993]["name"])
print("999:", exercises[998]["id"], exercises[998]["name"])
print("1000:", exercises[999]["id"], exercises[999]["name"])

muscle_groups_meta = [
    {"id": "all", "name": "All Muscles", "count": 1000, "category": "All"},
    {"id": "chest", "name": "Chest (Pectorals)", "count": sum(1 for e in exercises if e["targetMuscleKey"] == "chest"), "category": "Upper Body"},
    {"id": "back", "name": "Back & Lats", "count": sum(1 for e in exercises if e["targetMuscleKey"] == "back"), "category": "Upper Body"},
    {"id": "shoulders", "name": "Shoulders (Deltoids)", "count": sum(1 for e in exercises if e["targetMuscleKey"] == "shoulders"), "category": "Upper Body"},
    {"id": "biceps", "name": "Biceps", "count": sum(1 for e in exercises if e["targetMuscleKey"] == "biceps"), "category": "Upper Body"},
    {"id": "triceps", "name": "Triceps", "count": sum(1 for e in exercises if e["targetMuscleKey"] == "triceps"), "category": "Upper Body"},
    {"id": "forearms", "name": "Forearms & Grip", "count": sum(1 for e in exercises if e["targetMuscleKey"] == "forearms"), "category": "Upper Body"},
    {"id": "quads", "name": "Quadriceps", "count": sum(1 for e in exercises if e["targetMuscleKey"] == "quads"), "category": "Lower Body"},
    {"id": "hamstrings", "name": "Hamstrings", "count": sum(1 for e in exercises if e["targetMuscleKey"] == "hamstrings"), "category": "Lower Body"},
    {"id": "glutes", "name": "Glutes", "count": sum(1 for e in exercises if e["targetMuscleKey"] == "glutes"), "category": "Lower Body"},
    {"id": "calves", "name": "Calves", "count": sum(1 for e in exercises if e["targetMuscleKey"] == "calves"), "category": "Lower Body"},
    {"id": "legs", "name": "Legs & Plyometrics", "count": sum(1 for e in exercises if e["targetMuscleKey"] == "legs"), "category": "Cardio / Legs"},
    {"id": "abs", "name": "Abs (Rectus Abdominis)", "count": sum(1 for e in exercises if e["targetMuscleKey"] == "abs"), "category": "Core"},
    {"id": "obliques", "name": "Obliques (Lateral Core)", "count": sum(1 for e in exercises if e["targetMuscleKey"] == "obliques"), "category": "Core"},
    {"id": "lower_back", "name": "Lower Back & Spine", "count": sum(1 for e in exercises if e["targetMuscleKey"] == "lower_back"), "category": "Core"},
    {"id": "full_body", "name": "Full Body Dynamic", "count": sum(1 for e in exercises if e["targetMuscleKey"] == "full_body"), "category": "Full Body"},
    {"id": "upper_body", "name": "Upper Body Mobility", "count": sum(1 for e in exercises if e["targetMuscleKey"] == "upper_body"), "category": "Flexibility"},
    {"id": "lower_body", "name": "Lower Body Mobility", "count": sum(1 for e in exercises if e["targetMuscleKey"] == "lower_body"), "category": "Flexibility"}
]

ts_content = f'''import {{ Exercise }} from '../types';

export interface TargetMuscleGroup {{
  id: string;
  name: string;
  count: number;
  category: string;
}}

export const EXERCISE_CATEGORIES = [
  {{ id: 'all', name: 'All Categories' }},
  {{ id: 'upper_body', name: 'Upper Body' }},
  {{ id: 'lower_body', name: 'Lower Body' }},
  {{ id: 'core', name: 'Core & Abs' }},
  {{ id: 'cardio', name: 'Cardio & HIIT' }},
  {{ id: 'flexibility', name: 'Flexibility & Yoga' }}
];

export const TARGET_MUSCLE_GROUPS: TargetMuscleGroup[] = {json.dumps(muscle_groups_meta, indent=2)};

export const INITIAL_EXERCISES: (Exercise & {{ mirrorGifUrl?: string }})[] = {json.dumps(exercises, indent=2)};
'''

with open('src/data/exercisesData.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)

print("src/data/exercisesData.ts updated with all 1,000 exact prompt exercises!")
