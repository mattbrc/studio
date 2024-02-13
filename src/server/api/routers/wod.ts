import { createTRPCRouter, publicProcedure, privateProcedure } from "~/server/api/trpc";
import { levels, userProgramRelations, userPrograms, wods, workoutsLog } from "~/server/db/schema";
import { z } from "zod";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis"; 
import { TRPCError } from "@trpc/server";
import { eq, sql } from "drizzle-orm";

// Create a new ratelimiter, that allows 3 requests per 1 minute
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  analytics: true,
});

// Define the input schema for the bulk insert procedure
const bulkInsertWodsInput = z.array(z.object({
  date: z.date(),
  title: z.string(),
  strength: z.object({
    // Define the specific structure of the strength field
    a: z.string(),
    b: z.string().optional(),
    c: z.string().optional(),
    d: z.string().optional(),
    e: z.string().optional(),
    f: z.string().optional(),
    g: z.string().optional(),
    h: z.string().optional(),
    i: z.string().optional(),
    j: z.string().optional(),
    k: z.string().optional(),
  }),
  conditioning: z.object({
    // Define the specific structure of the conditioning field
    a: z.string(),
    b: z.string().optional(),
  }),
  program: z.string().optional(),
  notes: z.string().optional(),
}));

export const wodRouter = createTRPCRouter({
  bulkInsertWods: privateProcedure
    .input(bulkInsertWodsInput)
    .mutation(async ({ ctx, input }) => {
      // The input is an array of WOD objects
      const wodsToInsert = input.map(wod => ({
        date: wod.date,
        title: wod.title,
        strength: wod.strength,
        conditioning: wod.conditioning,
        program: wod.program,
        notes: wod.notes,
      }));

      // Perform the bulk insert operation
      const result = await ctx.db.insert(wods).values(wodsToInsert);

      // Return the result of the insert operation
      return result;
    }),

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

  getUserProgram: publicProcedure.query(async ({ ctx }) => {
    const id = ctx.userId;
    if (!id) {
      return
    }
    const result = await ctx.db.query.userPrograms.findFirst({
      where: (userPrograms, { eq }) => eq(userPrograms.userId, id),
      with: {
        program: true
      }
    })
    return result
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

    startProgram: privateProcedure
    .input(z.object({ programId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const id = ctx.userId;
      const { programId } = input;

      const { success } = await ratelimit.limit(id);
      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS"});

      const existingSubmission = await ctx.db
      .select()
      .from(userPrograms)
      .where(sql`${userPrograms.userId} = ${id}`)
  
      // if program exists, update row
      if (existingSubmission.length !== 0) {
        const update = await ctx.db.update(userPrograms).set({ programId: programId }).where(eq(userPrograms.userId, id));
        return update
      }

      // if no program, add new row for userId
      const submit = await ctx.db.insert(userPrograms).values({ userId: id, programId: programId });

      return submit;
    }),
});