import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

// Structured output for a single meal
const mealSchema = z.object({
  name: z.string(),
  calories: z.number().int(),
  protein: z.number().int(),
  carbs: z.number().int(),
  fat: z.number().int(),
  ingredients: z.array(z.string()),
  instructions: z.array(z.string()),
});

// Schema for the entire meal plan
const mealPlanSchema = z.object({
  meals: z.array(mealSchema).min(2).max(5),
  totalCalories: z.number().int(),
  totalProtein: z.number().int(),
  totalCarbs: z.number().int(),
  totalFat: z.number().int(),
});

const systemPrompt = `
You are a professional nutritionist and meal planner for military special operations operators. Your task is to create a one-day meal plan based on the user's Total Daily Energy Expenditure (TDEE), macronutrient requirements, and desired number of meals per day.
The meals should be high in protein, moderate in carbs, and moderate in fat. They should be easy to prepare and cook, and should be high in fiber and low in sugar. They should be easy to meal-prep and cook in a short amount of time.
The meals should primarily be whole, unprocessed foods, including vegetables, meats (salmon, tuna, chicken breast/thighs, ground beef (85/15 or 90/10)), fruits, some dairy, some whole grains (oats), ALWAYS use white rice instead of brown rice, and some nuts, and olive oil/butter. NO soybean/canola oils.
For the meals, dinner should be the most calorie dense and filling, lunch the second most, and breakfast the least.
Although you will be told a specific number of meals, ADD in an additional POST WORKOUT meal consisting of a whey protein shake with fruit as well. MAKE SURE this meal is listed last in the array, and the total TDEE and macronutrients adds up to the users TDEE and macronutrients.
ALWAYS give measurements using ounces, cups, tablespoons, teaspoons, and pounds.
DO NOT USE almond milk, soy milk, or any other nut/soy based milks. ONLY use cow's milk. If you don't want to use milk in a protein shake, use water. For protein shakes, give the user an option to only mix the whey protein with water or milk, and eat the rest of the shake with the meal.
For each meal, provide:
1. A name for the meal
2. The calorie content
3. Macronutrient breakdown (protein, carbs, fat in grams)
4. A list of ingredients
Ensure that the sum of all meals meets the user's TDEE and macronutrient requirements as closely as possible. Be creative with meal ideas but keep them realistic and easy to prepare.
`;

const objectPrompt = `
Generate a one-day meal plan based on the following parameters:
- TDEE: {TDEE} calories
- Protein: {PROTEIN}g
- Carbs: {CARBS}g
- Fat: {FAT}g
- Number of meals: {MEALS}
The meal plan should be balanced and varied. Each meal should contribute to the overall macronutrient and calorie goals. Please provide detailed information for each meal as per the specified schema.
Additionally, if the user has additional instructions, ALWAYS prioritize those instructions and add them in to the meal plan as necessary.
`;

// Occasionally add in meals like salmon and rice with vegatables, greek yogurt with berries and nuts, and grilled chicken breast with a side of sweet potatoes and vegetables, protein packed breakfast bowls (oats, whey protein, berries, and peanut butter or almond butter).
// Occasionally add in a meal called "Dog Food", which is made with a meat source (ground beef, chicken breast, salmon, or canned tuna) and a carb (white rice or sweet potatoes), 1-2 fried eggs, and some avocado, with hot sauce and avocado oil mayo.

const breakfastTypeLookup: Record<number, string> = {
  0: "No additional instructions",
  1: "English Muffin Breakfast Sandwich",
  2: "Oatmeal",
  3: "Protein Smoothie",
  4: "Greek Yogurt Bowl",
  5: "Breakfast Wrap",
};

const lunchTypeLookup: Record<number, string> = {
  0: "No additional instructions",
  1: "Grilled Chicken Salad",
  2: "Steak Salad",
  3: "For lunch do the same meal as dinner. Adjust the macros as necessary to make sure they hit their calorie and macronutrient goals for the day.",
  4: "Tuna Wrap",
  5: "Protein Pasta",
};

const dinnerTypeLookup: Record<number, string> = {
  0: "No additional instructions",
  1: "add in a meal called Dog Food which is made with 85/15 ground beef and a carb, white rice, 1-2 fried eggs, and some avocado, with hot sauce and avocado oil mayo.",
  2: "add in a meal called Dog Food which is made with shredded or diced chicken and a carb, white rice, 1-2 fried eggs, and some avocado, with hot sauce and avocado oil mayo.",
  3: "add in a meal called Dog Food which is made with baked salmon and a carb, white rice, 1-2 fried eggs, and some avocado, with hot sauce and avocado oil mayo.",
  4: "1 pan Chicken, roast potatos and veggies",
  5: "Steak + mashed potatos",
};

interface MealPlanParams {
  tdee: number;
  protein: number;
  carbs: number;
  fat: number;
  meals: number;
  additionalInstructions?: string;
  breakfastType?: number | null;
  lunchType?: number | null;
  dinnerType?: number | null;
}

export async function generateMealPlan({ tdee, protein, carbs, fat, meals, additionalInstructions, breakfastType, lunchType, dinnerType }: MealPlanParams) {
  let updatedObjectPrompt = objectPrompt
    .replace('{TDEE}', tdee.toString())
    .replace('{PROTEIN}', protein.toString())
    .replace('{CARBS}', carbs.toString())
    .replace('{FAT}', fat.toString())
    .replace('{MEALS}', meals.toString());

  if (additionalInstructions) {
    updatedObjectPrompt += `\n\nAdditional Instructions: ${additionalInstructions}`;
  }

  if (breakfastType !== null && breakfastType !== undefined) {
    const breakfastTypeString = breakfastTypeLookup[breakfastType] ?? "any";
    updatedObjectPrompt += `\n\nFor the breakfast meal, include this type: ${breakfastTypeString}`;
  }

  if (lunchType !== null && lunchType !== undefined) {
    const lunchTypeString = lunchTypeLookup[lunchType] ?? "any";
    updatedObjectPrompt += `\n\nFor the lunch meal, include this type: ${lunchTypeString}`;
  }

  if (dinnerType !== null && dinnerType !== undefined) {
    const dinnerTypeString = dinnerTypeLookup[dinnerType] ?? "any";
    updatedObjectPrompt += `\n\nFor the dinner meal, include this type: ${dinnerTypeString}`;
  }

  try {
    const { object: mealPlan } = await generateObject({
      model: openai('gpt-4o'),
      schema: mealPlanSchema,
      system: systemPrompt,
      prompt: updatedObjectPrompt,
    });

    return mealPlan;
  } catch (error) {
    console.error('Error generating meal plan:', error);
    throw new Error('Failed to generate meal plan');
  }
}