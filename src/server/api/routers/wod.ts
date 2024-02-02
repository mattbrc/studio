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
  getLatest: publicProcedure.query(async({ ctx }) => {
    const today = new Date(); // get today's date in UTC
    today.setHours(today.getHours() - 5); // convert to EST
    today.setUTCHours(0, 0, 0, 0); // set date to 0000 UTC time
    const result = await ctx.db.query.wods.findFirst({
      where: (wods, { eq }) => eq(wods.date, today),
      orderBy: (wods, { desc }) => [desc(wods.date)],
    });
    // if (!result) {
    //   throw new TRPCError({
    //     code: 'NOT_FOUND',
    //     message: 'No workout available today'
    //   });
    // }

    return result;
  }),

  getAllPrograms: publicProcedure.query(async ({ ctx }) => {
    const programs = await ctx.db.query.programs.findMany({
      orderBy: (programs, { desc }) => [desc(programs.createdAt)]
    });
    return programs;
  }),

  getRecap: publicProcedure.query(async({ ctx }) => {
    const today = new Date(); // get today's date in UTC
    today.setHours(today.getHours() + 19); // convert to EST
    today.setUTCHours(0, 0, 0, 0); // set date to 0000 UTC time
    const result = await ctx.db.query.wods.findMany({
      where: (wods, { lte }) => lte(wods.date, today),
      orderBy: (wods, { desc }) => [desc(wods.date)],
      limit: 3,
    });

    return result;
  }),

  getLevel: publicProcedure.input(z.object({ count: z.number() })).query(async ({ ctx, input }) => {
    const { count } = input;
    const success = await ctx.db.select({
      requiredWorkouts: levels.requiredWorkouts,
      nextLevelWorkouts: levels.nextLevelWorkouts,
      level: levels.title
    })
    .from(levels)
    .where(sql`${levels.nextLevelWorkouts} > ${count} AND ${levels.requiredWorkouts} <= ${count}`);

    const result = success[0];

    if (result !== undefined) {
      return result
    } else {
      return {
        requiredWorkouts: 0,
        nextLevelWorkouts: 10,
        level: 'Level 1: Cult Novice'
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
      const id = ctx.userId;
      const { workoutId } = input;

      const { success } = await ratelimit.limit(id);
      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS"});

      const existingSubmission = await ctx.db
      .select()
      .from(workoutsLog)
      .where(sql`${workoutsLog.athleteId} = ${id} AND ${workoutsLog.workoutId} = ${workoutId}`)
  
      if (existingSubmission.length !== 0) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Workout has already been submitted'
        });
      }

      const submit = await ctx.db.insert(workoutsLog).values({ athleteId: id, workoutId: workoutId });

      return submit;
    }),
});