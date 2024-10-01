import { NextResponse } from 'next/server';
import { generateMealPlan } from '~/lib/ai/nutrition';
import { z } from 'zod';
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { auth } from '@clerk/nextjs/server' 

// Define a schema for the request body
const bodySchema = z.object({
  tdee: z.number(),
  protein: z.number(),
  carbs: z.number(),
  fat: z.number(),
  meals: z.number(),
});
// test

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(0, "1 m"),
  analytics: true,
});

export async function POST(req: Request) {
  try {
    // Parse and validate the request body
    const body = bodySchema.parse(await req.json());
    const { userId }: { userId: string | null } = auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { success } = await ratelimit.limit(userId);
    if (!success) throw new NextResponse('Too many requests', { status: 429 });

    const mealPlan = await generateMealPlan(body);

    return NextResponse.json(mealPlan);
  } catch (error) {
    console.error('Error generating meal plan:', error);
    return NextResponse.json({ error: 'Failed to generate meal plan' }, { status: 500 });
  }
}