import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { z } from "zod";
import { generateMealPlan } from "~/lib/ai/nutrition";
// import { generateWorkouts } from "~/lib/ai/generate";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { posts } from "~/server/db/schema";
import { and, eq, gte, count } from "drizzle-orm";
import { mealPlanGenerations } from "~/server/db/schema";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  analytics: true,
});

export const aiRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  generateMealPlan: privateProcedure
    .input(
      z.object({
        tdee: z.number(),
        protein: z.number(),
        carbs: z.number(),
        fat: z.number(),
        meals: z.number(),
        instructions: z.string(),
        breakfastType: z.number().nullable().optional(),
        lunchType: z.number().nullable().optional(),
        dinnerType: z.number().nullable().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { success } = await ratelimit.limit(ctx.userId);
        if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

        // Check the number of generations for the current month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const generationsThisMonth = await ctx.db
          .select({ count: count() })
          .from(mealPlanGenerations)
          .where(
            and(
              eq(mealPlanGenerations.userId, ctx.userId),
              gte(mealPlanGenerations.generatedAt, startOfMonth),
            ),
          )
          .execute();

        if (generationsThisMonth[0] && generationsThisMonth[0].count >= 100) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message:
              "LIMIT: You have reached the maximum number of meal plan generations for this month.",
          });
        }

        // Generate the meal plan
        const mealPlan = await generateMealPlan({
          tdee: input.tdee,
          protein: input.protein,
          carbs: input.carbs,
          fat: input.fat,
          meals: input.meals,
          additionalInstructions: input.instructions,
          breakfastType: input.breakfastType ?? undefined,
          lunchType: input.lunchType ?? undefined,
          dinnerType: input.dinnerType ?? undefined,
        });

        // Record the generation
        await ctx.db.insert(mealPlanGenerations).values({
          userId: ctx.userId,
          mealPlan: mealPlan,
        });

        return {
          mealPlan,
        };
      } catch (error) {
        console.error("Meal plan generation error:", error);
        
        // Handle specific error types
        if (error instanceof TRPCError) throw error;
        
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to generate meal plan",
          // Optional: Add cause for debugging
          cause: error,
        });
      }
    }),

  getMealPlanGenerationsCount: privateProcedure.query(async ({ ctx }) => {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const generationsThisMonth = await ctx.db
      .select({ count: count() })
      .from(mealPlanGenerations)
      .where(
        and(
          eq(mealPlanGenerations.userId, ctx.userId),
          gte(mealPlanGenerations.generatedAt, startOfMonth),
        ),
      )
      .execute();

    return {
      count: generationsThisMonth[0]?.count ?? 0,
      limit: 100,
      remaining: Math.max(100 - (generationsThisMonth[0]?.count ?? 0), 0),
    };
  }),

  // generateWorkouts: publicProcedure
  //   .input(z.object({ text: z.string() }))
  //   .query(async ({ input }) => {
  //     const workouts = await generateWorkouts();
  //     return {
  //       workouts,
  //     };
  //   }),

  // generateWorkout: publicProcedure.query(async () => {
  //   try {
  //     // Call the generateWorkouts function
  //     const workouts = await generateWorkouts();

  //     return workouts;
  //   } catch (error) {
  //     throw new Error('Failed to generate workout program');
  //   }
  // }),

  // create: publicProcedure
  //   .input(z.object({ name: z.string().min(1) }))
  //   .input(z.object({ content: z.string().min(1) }))
  //   .mutation(async ({ ctx, input }) => {
  //     // simulate a slow db call
  //     await new Promise((resolve) => setTimeout(resolve, 1000));

  //     await ctx.db.insert(posts).values({
  //       name: input.name,
  //       content: input.content,
  //     });
  //   }),

  // getLatest: publicProcedure.query(({ ctx }) => {
  //   return ctx.db.query.posts
  //   // return ctx.db.query.posts.findFirst({
  //   //   orderBy: (posts, { desc }) => [desc(posts.createdAt)],
  //   // });
  // }),

  // getAll: publicProcedure.query(({ ctx }) => {
  //   return ctx.db.query.posts.findMany({
  //     orderBy: (posts, { desc }) => [desc(posts.createdAt)],
  //     limit: 5,
  //   });
  // }),
});
