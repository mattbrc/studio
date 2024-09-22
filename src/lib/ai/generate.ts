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

// const programSchema = z.array(workoutSchema);

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

The program will be designed for a 7-day hybrid workout plan, incorporating a mixture of strength, 
conditioning, and endurance across the days. Make sure to include a variety of strength exercises, conditioning efforts, 
and at least one "rest" day with optional light activities. On days with no conditioning, return an object with "a": "None". The same applies for strength.
  `;
  const objectPrompt = `
Generate a workout program with both strength and conditioning exercises. 
The strength and conditioning should be objects where each key is a letter (e.g., "a", "b", "c") 
and the value is a string describing the exercise.

Ensure the output matches the following JSON schema:
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
}
You will build a workout program that is 7 days long. 
`

const sampleWorkouts = {
  hybrid: `
Day 1: 
Strength: 
a. Back Squat 5x5
b. Bench Press 4x8
Conditioning: 
a. 5 rounds of 400m run, 15 burpees

Day 2:
Strength:
a. Deadlift 3x5
b. Pull-ups 4x8
Conditioning:
a. 30 min Zone 2 run
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

export async function generateWorkouts(goal: 'hybrid' | 'strength' | 'endurance') {
  const exampleWorkouts = sampleWorkouts[goal] || '';

  const updatedObjectPrompt = `
${objectPrompt}

Goal: ${goal}

Example workouts for reference:
${exampleWorkouts}

Generate a 7-day workout program that aligns with the given goal and takes inspiration from the example workouts provided.
  `.trim();

  try {
    const { object: workouts } = await generateObject({
      model: openai('gpt-4o-mini'),
      schema: workoutSchema,
      system: systemPrompt,
      prompt: updatedObjectPrompt,
    });

    return workouts;
  } catch (error) {
    console.error('Error generating workouts:', error);
    throw new Error('Failed to generate workouts');
  }
}

// generate the object
// export const { object } = await generateObject({
//   model: openai('gpt-4'),
//   schema: workoutSchema,
//   system: systemPrompt,
//   prompt: objectPrompt,
// });

// console.log(JSON.stringify(object, null, 2));