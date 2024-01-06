import { createTRPCRouter, publicProcedure, privateProcedure } from "~/server/api/trpc";
import { levels, workoutsLog } from "~/server/db/schema";
import { z } from "zod";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis"; 
import { TRPCError } from "@trpc/server";
import { sql } from "drizzle-orm";

// Create a new ratelimiter, that allows 3 requests per 1 minute
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  analytics: true,
});

export const wodRouter = createTRPCRouter({
  getLatest: publicProcedure.query(({ ctx }) => {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    return ctx.db.query.wods.findFirst({
      where: (wods, { eq }) => eq(wods.date, today),
      orderBy: (wods, { desc }) => [desc(wods.date)],
    });
  }),

  getLevel: publicProcedure.input(z.object({ count: z.number() })).query(async ({ ctx, input }) => {
    const { count } = input;
    const success = await ctx.db.select({
      requiredWorkouts: levels.requiredWorkouts,
      nextLevelWorkouts: levels.nextLevelWorkouts,
      level: levels.title
    })
    .from(levels)
    .where(sql`${levels.nextLevelWorkouts} > ${count} AND ${levels.requiredWorkouts} < ${count}`);

    const result = success[0];
    if (result !== undefined) {
      return result
    } else {
      return {
        requiredWorkouts: 0,
        nextLevelWorkouts: 10,
        level: 'level 1'
      };
    }
  }),

  getWodCount: publicProcedure.query(async ({ ctx }) => {
    const athleteId = ctx.userId;
    const success = await ctx.db.select({ 
      userId: workoutsLog.athleteId,
      count: sql<number>`count(${workoutsLog.athleteId})`.mapWith(Number)
  }).from(workoutsLog)
    .where(sql`${workoutsLog.athleteId} = ${athleteId}`);
    const result = success[0]?.count
    if (result !== undefined) {
      return result
    } else {
      return 0
    }
  }),

  submitWod: privateProcedure
    .input(z.object({ workoutId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const athleteId = ctx.userId;
      const { workoutId } = input;

      const { success } = await ratelimit.limit(athleteId);
      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS"});

      const existingSubmission = await ctx.db.query.workoutsLog.findFirst({
        where: (wodLog, { eq }) => eq(wodLog.athleteId, athleteId) && eq(wodLog.workoutId, workoutId),
      });
  
      if (existingSubmission) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Workout has already been submitted'
        });
      }

      const submit = await ctx.db.insert(workoutsLog).values({ athleteId: athleteId, workoutId: workoutId });

      return submit;
    }),
});