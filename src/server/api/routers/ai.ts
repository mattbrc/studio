import { TRPCError } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { z } from "zod";
import { generateMealPlan } from "~/lib/ai/nutrition";
import { generatePathProgram } from "~/lib/ai/path";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { pathGenerations, userPathProgram } from "~/server/db/schema";
import { and, eq, gte, count, sql, desc } from "drizzle-orm";
import { mealPlanGenerations } from "~/server/db/schema";
import { createId } from "@paralleldrive/cuid2";
import { revalidatePath } from "next/cache";

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

  generatePathProgram: privateProcedure
    .input(
      z.object({
        goal: z.string(),
        volume: z.string(),
        split: z.string(),
        instructions: z.string(),
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

        const pathProgram = await generatePathProgram({
          // phase: input.phase,
          split: input.split,
          goal: input.goal,
          volume: input.volume,
          additionalInstructions: input.instructions,
        });

        // Record the generation
        const result = await ctx.db.insert(pathGenerations).values({
          userId: ctx.userId,
          program: pathProgram,
        }).$returningId();

        return {
          pathProgram,
          generationId: result[0]?.id,
        };
      } catch (error) {
        console.error("Path program generation error:", error);
        
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

  getPathGenerationsCount: privateProcedure.query(async ({ ctx }) => {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const generationsThisMonth = await ctx.db
      .select({ count: count() })
      .from(pathGenerations)
      .where(
        and(
          eq(pathGenerations.userId, ctx.userId),
          gte(pathGenerations.generatedAt, startOfMonth),
        ),
      )
      .execute();

    return {
      count: generationsThisMonth[0]?.count ?? 0,
      limit: 100,
      remaining: Math.max(100 - (generationsThisMonth[0]?.count ?? 0), 0),
    };
  }),

  startPathProgram: privateProcedure
    .input(z.object({ pathId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const id = ctx.userId;
      const { pathId } = input;

      const { success } = await ratelimit.limit(id);
      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS"});

      const existingSubmission = await ctx.db
      .select()
      .from(userPathProgram)
      .where(sql`${userPathProgram.userId} = ${id}`)
  
      // if program exists, update row
      if (existingSubmission.length !== 0) {
        const update = await ctx.db.update(userPathProgram).set({ pathId: pathId, currentWorkoutId: 0, active: true }).where(eq(userPathProgram.userId, id));
        return update
      }

      // if no program, add new row for userId
      const submit = await ctx.db.insert(userPathProgram).values({ userId: id, pathId: pathId, currentWorkoutId: 0, active: true });

      // Add revalidation after DB operations
      revalidatePath("/home");
      
      return submit;
    }),

  getUserPathProgram: privateProcedure.query(async ({ ctx }) => {
    const id = ctx.userId;
    const pathProgram = await ctx.db.select().from(userPathProgram).where(eq(userPathProgram.userId, id));
    return pathProgram;
  }),

  getUserPathDetails: publicProcedure.query(async ({ ctx }) => {
    const id = ctx.userId
    if (!id) {
      return
    }

    const result = await ctx.db.query.userPathProgram.findFirst({
      where: (userPathProgram, { eq }) => eq(userPathProgram.userId, id),
      columns: {
        currentWorkoutId: true,
      }
    })
    
    if (result) {
      const success = await ctx.db.query.userPathProgram.findFirst({
        where: (userPathProgram, { eq }) => eq(userPathProgram.userId, id),
        with: {
          program: true
        }
      })
      return success
    }
  }),

  submitPathWorkout: privateProcedure
    .input(z.object({ workoutId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { workoutId } = input;
      const newWorkoutId = workoutId + 1;
      const result = await ctx.db.update(userPathProgram).set({ currentWorkoutId: newWorkoutId }).where(eq(userPathProgram.userId, ctx.userId));
      return result;
    }),

  removePathProgram: privateProcedure.mutation(async ({ ctx }) => {
    const result = await ctx.db.update(userPathProgram).set({ active: false }).where(eq(userPathProgram.userId, ctx.userId));
    return result;
  }),

  getLatestPathPrograms: privateProcedure.query(async ({ ctx }) => {
    const latestPrograms = await ctx.db
      .select()
      .from(pathGenerations)
      .where(eq(pathGenerations.userId, ctx.userId))
      .orderBy(desc(pathGenerations.generatedAt))
      .limit(5);

    return latestPrograms;
  }),

});
