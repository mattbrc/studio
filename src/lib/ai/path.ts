import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';
import { programReferences } from './pathReference';
import type { ProgramType } from './pathReference';


const workoutSchema = z.object({
  orderId: z.number().int(),
  title: z.string(),
  strength: z.record(z.string()),
  conditioning: z.record(z.string()),
});


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
    // ... and more objects for a total of 28 days (4 weeks)
  ]
}
  ALWAYS ENSURE THE ORDERID STARTS AT 0. The volume of the program is {VOLUME}.
  I want you to design it based on the following goal, example workouts, and split for weightlifting. Use my style of programming to design the workouts:
`;

interface PathProgramParams {
  split: string;
  goal: string;
  volume: string;
  additionalInstructions?: string;
}

const splitLookup: Record<string, string> = {
  "ppl": "Use a push/pull/legs split for weightlifting.",
  "upper-lower": "Use an upper/lower split for weightlifting.",
  "full-body": "Use a full body split for weightlifting.",
};
const volumeLookup: Record<string, string> = {
  "Balanced": "Balanced. Include 3-4 strength workouts, 3-4 conditioning workouts, and 1 high intensity session (intervals or metcons).",
  "Low": "Low. Include 2-3 strength workouts, 2-3 conditioning workouts, and 1 high intensity session (intervals or metcons).",
  "High": "High. Include 3-5 strength workouts, 4-5 conditioning workouts, and 2 high intensity sessions (intervals or metcons).",
  "Savage": "Savage. Include 3-5 strength workouts, 5-6 conditioning workouts, and 2 high intensity sessions (intervals or metcons).",
};
export async function generatePathProgram({ split, goal, volume, additionalInstructions }: PathProgramParams) {
  // building context for the program
  let updatedObjectPrompt = objectPrompt
    .replace('{VOLUME}', volumeLookup[volume] ?? "Balanced")

  const exampleWorkouts = programReferences[goal as ProgramType]?.sample || '';
  const metconRef = programReferences.metcons?.sample || '';

  updatedObjectPrompt = `
${objectPrompt}

Goal: ${goal}

Example workouts for reference:
${exampleWorkouts}
When adding metcons, feel free to use the following at random in the program you generate:
${metconRef}
  `.trim();

  if (additionalInstructions) {
    updatedObjectPrompt += `\n\nAdditional Instructions: ${additionalInstructions}`;
  }

  if (split !== null && split !== undefined) {
    const splitString = splitLookup[split] ?? "any";
    updatedObjectPrompt += `\n\nFor the weightlifting split, include this type: ${splitString}`;
  }

  try {
    console.log(updatedObjectPrompt);
    const { object: mealPlan } = await generateObject({
      model: openai('gpt-4o-mini'),
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