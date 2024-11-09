import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

// structured output
const workoutSchema = z.object({
  orderId: z.number().int(),
  title: z.string(),
  strength: z.record(z.string()),
  conditioning: z.record(z.string()),
});

// Create a new schema for the entire program
const programSchema = z.object({
  workouts: z.array(workoutSchema)
});

const systemPrompt = `
  You are a high-level strength and conditioning coach specializing in military special operations functional fitness. You excel at creating hybrid programs that combine strength, conditioning, and endurance training for elite athletes.

The workouts you design typically include the following structure:
1. **Strength exercises**: These may include barbell, dumbbell, and cable exercises with specified sets and reps.
2. **Conditioning**: This includes high-intensity intervals, steady-state cardio, and functional endurance efforts like running, rowing, cycling, etc.
3. **Metcons (Metabolic Conditioning)**: You may include AMRAPs, timed circuits, and other high-intensity workouts for conditioning purposes.

For each workout day, you will generate a program in the following JSON structure:
- **orderId**: A unique identifier for each workout day.
- **title**: The title of the day (e.g., "Monday: Push 1", "Saturday: Hybrid Suckfest").
- **strength**: An object with keys as letters ("a", "b", "c") and values as exercises with prescribed sets and reps.
- **conditioning**: An object with keys as letters ("a", "b", "c") and values as conditioning workouts, describing the activity and effort level (e.g., "45-60 min Z2 effort").

The program will be designed as a 4-week (28 day) workout plan, incorporating a mixture of strength, 
conditioning, and endurance across the days depending on the users goal and program type. Make sure to include a variety of strength exercises, conditioning efforts, 
and at least one "rest" day with optional light activities. On days with no conditioning, return an object with "a": "None". The same applies for strength.
`;

const objectPrompt = `
Generate a workout program with both strength and conditioning exercises for each day. 
The strength and conditioning should be objects where each key is a letter (e.g., "a", "b", "c") 
and the value is a string describing the exercise.
Ensure the output matches the following JSON schema:
{
  "workouts": [
    {
      "orderId": (integer),
      "title": (string),
      "strength": {
        "a": (string),
        "b": (string),
        // ... more keys as needed
      },
      "conditioning": {
        "a": (string),
        "b": (string),
        // ... more keys as needed
      }
    },
    // ... 6 more objects for a total of 7 days
  ]
}
  I want you to design it based on the following goal and example workouts. Use my style of programming to design the workouts:
`;

const dinnerTypeLookup: Record<number, string> = {
  0: "No additional instructions",
  1: "add in a meal called Dog Food which is made with 85/15 ground beef and a carb, white rice, 1-2 fried eggs, and some avocado, with hot sauce and avocado oil mayo.",
  2: "add in a meal called Dog Food which is made with shredded or diced chicken and a carb, white rice, 1-2 fried eggs, and some avocado, with hot sauce and avocado oil mayo.",
  3: "add in a meal called Dog Food which is made with baked salmon and a carb, white rice, 1-2 fried eggs, and some avocado, with hot sauce and avocado oil mayo.",
  4: "1 pan Chicken, roast potatos and veggies",
  5: "Steak + mashed potatos",
};

const sampleWorkouts = {
  hybrid: `
{
    "orderId": 70,
    "title": "Monday: Push 1",
    "strength": {
      "a": "Bodyweight Dips: 2x8-15 (light weight, warm-up, not to failure)",
      "b": "Chest Press: 1x6-9, 1x12-15",
      "c": "Standing BB Shoulder Press: 1x6-9, 1x12-15",
      "d": "Cable Tri Pushdown + Lateral Raises: 1x12-15, 1x15-20",
      "e": "DB Tri Kickbacks + Front Delt Raises: 2x15-20",
      "f": "Tricep Cluster: 4x6 Cable Tricep Extensions (straight bar) (go heavy, rest 30 sec between sets)"
    },
    "conditioning": {
      "a": "45-60 min Z2 effort: run/bike/hike/row/swim"
    },
  },
  {
    "orderId": 71,
    "title": "Tuesday: Pull 1",
    "strength": {
      "a": "Bodyweight Chin-Ups: 2x8-15 (warm-up, not to failure)",
      "b": "Cable Lat Pulldown: 1x6-9, 1x12-15",
      "c": "BB/DB Shrugs: 1x8-12",
      "d": "Underhand Seated Cable Row: 1x12-15, 1x15-20",
      "e": "Hammer Curls: 1x12-15, 1x15-20",
      "f": "Cable Curl Cluster: 4x6, rest 30 sec between sets, go heavy",
      "g": "Decline Weighted Sit-Ups: 3x to failure (15-20+)"
    },
    "conditioning": {
      "a": "60-90 min Z2 effort: run/bike/hike/row/swim"
    },
  },
  {
    "orderId": 72,
    "title": "Wednesday: Rest",
    "strength": {
      "a": "None"
    },
    "conditioning": {
      "a": "Do nothing, optionally sauna, do some mobility, and still get in 10k+ steps today!"
    },
  },
  {
    "orderId": 73,
    "title": "Thursday: Legs 1",
    "strength": {
      "a": "Leg Extension: 2x15-20 (warm-up, not to failure)",
      "b": "Hack Squat/Back Squat: 1x6-9, 1x12-15",
      "c": "Bulgarian Split Squats: 2x12-15",
      "d": "Hip Thrusts: 2x12-15",
      "e": "Calf Raises: 2x12-15",
      "f": "Decline Weighted Sit-ups: 3x15-20+ (failure) + Weighted Russian twists to failure"
    },
    "conditioning": {
      "a": "45-60 min steady state run/bike/swim/row/hike/ruck"
    },
  },
  {
    "orderId": 74,
    "title": "Friday: Push 2",
    "strength": {
      "a": "Pec Dec: 2x12-15 (light weight, warm-up, not to failure)",
      "b": "Machine Shoulder Press: 1x6-9, 1x12-15",
      "c": "Machine/DB Incline Bench Press: 1x6-9, 1x12-15",
      "d": "Weighted/BW Dips: 1x6-9, 1x12-15",
      "e": "Cable Tri Pushdown + Lateral Raises: 1x12-15, 1x15-20",
      "f": "DB Tri Kickbacks + Front Delt Raises: 2x15-20"
    },
    "conditioning": {
      "a": "Optional 30 min easy jog/spin"
    },
  },
  {
    "orderId": 75,
    "title": "Saturday: Hybrid Suckfest",
    "strength": {
      "a": "21-15-9: cal row + burpees + bf sit-ups",
      "b": "60 min run",
      "c": "21-15-9: cal row + burpees + bf sit-ups"
    },
    "conditioning": {
      "a": "Steady State: 1.5-2.5 hours Z2 effort. Bike, jog, hike. GET OUTSIDE"
    },
  },
  {
    "orderId": 76,
    "title": "Sunday: Pull 2",
    "strength": {
      "a": "Bodyweight Chin-Ups: 2x8-15 (warm-up, not to failure)",
      "b": "BB Straight Leg Deadlift: 1x6-9",
      "c": "Chest Supported Row: 1x12-15, 1x15-20",
      "d": "Single Arm Cable Lat Pulldown: 1x12-15, 1x15-20",
      "e": "Superset: Rear Delt Raises + Cable Curls: 1x12-15, 1x15-20",
      "f": "Superset: Preacher Curls + Standing Reverse Grip curls: 2x12-20"
    },
    "conditioning": {
      "a": "None"
    },
  },
  `,
  strength: `
Day 1:
Strength:
a. Barbell Back Squat 5x5
b. Barbell Bench Press 5x5
c. Barbell Row 5x5
Conditioning:
a. None

Day 2:
Strength:
a. Deadlift 3x5
b. Overhead Press 5x5
c. Weighted Chin-ups 4x6
Conditioning:
a. None
  `,
  endurance: `
Day 1:
Strength:
a. Bodyweight Circuit: 3 rounds of 20 push-ups, 20 squats, 10 pull-ups
Conditioning:
a. 60-minute Zone 2 run
b. 4x800m intervals at 5k pace with 2-minute rest

Day 2:
Strength:
a. None
Conditioning:
a. 90-minute long slow distance run
b. 20-minute core workout
  `
};

interface PathProgramParams {
  level: string;
  goal: string;
  liftsPerWeek: number;
  conditioningPerWeek: number;
  additionalInstructions?: string;
}

export async function generatePathProgram({ level, goal, liftsPerWeek, conditioningPerWeek, additionalInstructions }: PathProgramParams) {
  // let updatedObjectPrompt = objectPrompt
  //   .replace('{LEVEL}', level)
  //   .replace('{GOAL}', goal)
  //   .replace('{LIFTS_PER_WEEK}', liftsPerWeek.toString())
  //   .replace('{CONDITIONING_PER_WEEK}', conditioningPerWeek.toString());

  const exampleWorkouts = sampleWorkouts[goal as keyof typeof sampleWorkouts] || '';

  let updatedObjectPrompt = `
${objectPrompt}

Goal: ${goal}

Example workouts for reference:
${exampleWorkouts}
  `.trim();

  if (additionalInstructions) {
    updatedObjectPrompt += `\n\nAdditional Instructions: ${additionalInstructions}`;
  }

  try {
    const { object: mealPlan } = await generateObject({
      model: openai('gpt-4o'),
      schema: programSchema,
      system: systemPrompt,
      prompt: updatedObjectPrompt,
    });

    return mealPlan;
  } catch (error) {
    console.error('Error generating program:', error);
    throw new Error('Failed to generate program');
  }
}