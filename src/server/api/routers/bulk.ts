import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { programWorkouts, trackWorkouts, wods } from "~/server/db/schema";
import { z } from "zod";

// Define the input schema for the bulk insert procedure into Wods table
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
}));

// Define the input schema for the bulk insert procedure into programWorkouts table
const bulkInsertProgramWorkoutsInput = z.array(z.object({
  orderId: z.number(),
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
  programId: z.number(),
}));

// Define the input schema for the bulk insert procedure into Wods table
const bulkInsertTracksInput = z.array(z.object({
  trackId: z.number(),
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
  week: z.number(),
  block: z.number(),
}));

export const bulkRouter = createTRPCRouter({
  // bulkInsertWods: privateProcedure
  //   .input(bulkInsertWodsInput)
  //   .mutation(async ({ ctx, input }) => {
  //     // The input is an array of WOD objects
  //     const wodsToInsert = input.map(wod => ({
  //       date: wod.date,
  //       title: wod.title,
  //       strength: wod.strength,
  //       conditioning: wod.conditioning,
  //     }));

  //     // Perform the bulk insert operation
  //     const result = await ctx.db.insert(wods).values(wodsToInsert);

  //     // Return the result of the insert operation
  //     return result;
  //   }),

    bulkInsertWods: privateProcedure
    .input(bulkInsertWodsInput)
    .mutation(async ({ ctx, input }) => {
      // The input is an array of WOD objects
      const workoutsToInsert = input.map(workout => ({
        date: workout.date,
        title: workout.title,
        strength: workout.strength,
        conditioning: workout.conditioning,
      }));

      // Perform the bulk insert operation
      const result = await ctx.db.insert(wods).values(workoutsToInsert);

      // Return the result of the insert operation
      return result;
    }),

    bulkInsertTracks: privateProcedure
    .input(bulkInsertTracksInput)
    .mutation(async ({ ctx, input }) => {
      // The input is an array of WOD objects
      const workoutsToInsert = input.map(workout => ({
        trackId: workout.trackId,
        date: workout.date,
        title: workout.title,
        strength: workout.strength,
        conditioning: workout.conditioning,
        week: workout.week,
        block: workout.block,
      }));

      // Insert
      const result = await ctx.db.insert(trackWorkouts).values(workoutsToInsert);

      return result;
    }),

    bulkInsertProgramWorkouts: privateProcedure
    .input(bulkInsertProgramWorkoutsInput)
    .mutation(async ({ ctx, input }) => {
      // The input is an array of WOD objects
      const workoutsToInsert = input.map(workout => ({
        orderId: workout.orderId,
        title: workout.title,
        strength: workout.strength,
        conditioning: workout.conditioning,
        programId: workout.programId
      }));

      // Perform the bulk insert operation
      const result = await ctx.db.insert(programWorkouts).values(workoutsToInsert);

      // Return the result of the insert operation
      return result;
    }),
});