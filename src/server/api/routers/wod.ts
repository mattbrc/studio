import { createTRPCRouter, publicProcedure, privateProcedure } from "~/server/api/trpc";
import { levels, userPrograms, workoutsLog, tracks, trackWorkouts } from "~/server/db/schema";
import { z } from "zod";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis"; 
import { TRPCError } from "@trpc/server";
import { eq, sql, and, inArray, asc } from "drizzle-orm";
import { createId } from '@paralleldrive/cuid2';

// Create a new ratelimiter, that allows 5 requests per 1 minute
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "1 m"),
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

    return result;
  }),

  getLatestTrackWorkouts: publicProcedure.query(async ({ ctx }) => {
    const today = new Date();
    today.setHours(today.getHours() - 5); // convert to EST
    today.setUTCHours(0, 0, 0, 0); // set date to 0000 UTC time

    const result = await ctx.db.select().from(trackWorkouts)
      .where(and(
        eq(trackWorkouts.date, today),
        inArray(trackWorkouts.trackId, [1, 2, 3])
      ))
      .orderBy(asc(trackWorkouts.trackId));

    return result;
  }),

  getLatestTrackWeek: publicProcedure.query(async ({ ctx }) => {
    const today = new Date();
    today.setHours(today.getHours() - 5); // convert to EST
    today.setUTCHours(0, 0, 0, 0); // set date to 0000 UTC time

    const result = await ctx.db.select().from(trackWorkouts)
      .where(and(
        eq(trackWorkouts.date, today),
        inArray(trackWorkouts.trackId, [1, 2, 3])
      ))
      .orderBy(asc(trackWorkouts.trackId));

    return result;
  }),

  getAllPrograms: publicProcedure.query(async ({ ctx }) => {
    const programs = await ctx.db.query.programs.findMany({
      // orderBy: (programs, { asc }) => [asc(programs.createdAt)]
      orderBy: (programs, { desc, asc }) => [
        desc(programs.active),
        asc(programs.createdAt)
      ]
    });
    return programs;
  }),

  getAllTracks: publicProcedure.query(async ({ ctx }) => {
    const tracks = await ctx.db.query.tracks.findMany({
      // orderBy: (programs, { asc }) => [asc(programs.createdAt)]
      orderBy: (tracks, { desc, asc }) => [
        desc(tracks.active),
        asc(tracks.createdAt)
      ]
    });
    return tracks;
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

  getUserWorkouts: publicProcedure.query(async ({ ctx }) => {
    const id = ctx.userId
    if (!id) {
      return
    }

    const result = await ctx.db.query.userPrograms.findFirst({
      where: (userPrograms, { eq }) => eq(userPrograms.userId, id),
      columns: {
        currentWorkoutId: true,
      }
    })
    
    if (result) {
      const success = await ctx.db.query.userPrograms.findFirst({
        where: (userPrograms, { eq }) => eq(userPrograms.userId, id),
        with: {
          workouts: {
            limit: 7,
            where: (programWorkouts, { gte }) => gte(programWorkouts.orderId, result?.currentWorkoutId),
            orderBy: (programWorkouts, { asc }) => [asc(programWorkouts.orderId)],
          },
          program: true
        }
      })
      return success
    }
  }),

  // return current wod for user's selected program
  getUserSingleWorkout: publicProcedure.query(async ({ ctx }) => {
    const id = ctx.userId
    if (!id) {
      return
    }

    const result = await ctx.db.query.userPrograms.findFirst({
      where: (userPrograms, { eq }) => eq(userPrograms.userId, id),
      columns: {
        currentWorkoutId: true,
      }
    })
    
    if (result) {
      const success = await ctx.db.query.userPrograms.findFirst({
        where: (userPrograms, { eq }) => eq(userPrograms.userId, id),
        with: {
          workouts: {
            limit: 1,
            where: (programWorkouts, { eq }) => eq(programWorkouts.orderId, result?.currentWorkoutId),
          },
          program: true
        }
      })
      return success
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

  isWodComplete: publicProcedure.query(async ({ ctx }) => {
    const id = ctx.userId;
    const existingSubmission = await ctx.db
    .select()
    .from(workoutsLog)
    .where(sql`${workoutsLog.athleteId} = ${id} AND DATE(${workoutsLog.createdAt}) = CURRENT_DATE AND ${workoutsLog.programId} = 0`);

    if (existingSubmission.length !== 0) {
      return true;
    }

    return false;
  }),

  // submit workout row for WOD (programId = 0)
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
      .where(sql`${workoutsLog.athleteId} = ${id} AND DATE(${workoutsLog.createdAt}) = CURRENT_DATE AND ${workoutsLog.programId} = 0`);
  
      if (existingSubmission.length !== 0) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Workout has already been submitted'
        });
      }

      const submit = await ctx.db.insert(workoutsLog).values({ athleteId: id, workoutId: workoutId, programId: 0 });

      return submit;
    }),

    submitProgramWorkout: privateProcedure
    .input(z.object({ workoutId: z.number().nullish(), programId: z.number().nullish() }))
    .mutation(async ({ ctx, input }) => {
      const id = ctx.userId;
      const { workoutId } = input;
      const { programId } = input;

      const { success } = await ratelimit.limit(id);
      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS"});

      const existingSubmission = await ctx.db
      .select()
      .from(workoutsLog)
      .where(sql`${workoutsLog.athleteId} = ${id} AND DATE(${workoutsLog.createdAt}) = CURRENT_DATE AND ${workoutsLog.workoutId} = ${workoutId}`);
  
      if (existingSubmission.length !== 0) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Workout has already been submitted'
        });
      }

      await ctx.db
        .update(userPrograms)
        .set({ currentWorkoutId: sql`${userPrograms.currentWorkoutId} + 1` })
        .where(eq(userPrograms.userId, id));
      await ctx.db.insert(workoutsLog).values({ athleteId: id, workoutId: workoutId, programId: programId });

      return { success: true};
    }),

    updateWorkoutId: privateProcedure.mutation(async ({ ctx }) => {
      const id = ctx.userId;
      await ctx.db
        .update(userPrograms)
        .set({ currentWorkoutId: sql`${userPrograms.currentWorkoutId} + 1` })
        .where(eq(userPrograms.userId, id));

      return { success: true };
    }),

    getTotalWorkoutsCount: publicProcedure.query(async ({ ctx }) => {
      const success = await ctx.db.select({ 
        count: sql<number>`count(*)`
    }).from(workoutsLog)
      return success[0]?.count
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
        const newUniqueProgramId = createId();
        const update = await ctx.db.update(userPrograms).set({ programId: programId, uniqueProgramId: newUniqueProgramId, currentWorkoutId: 0 }).where(eq(userPrograms.userId, id));
        return update
      }

      // if no program, add new row for userId
      const submit = await ctx.db.insert(userPrograms).values({ userId: id, programId: programId, currentWorkoutId: 0 });

      return submit;
    }),
});