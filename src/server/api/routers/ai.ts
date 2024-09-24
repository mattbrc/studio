import { z } from "zod";
// import { generateWorkouts } from "~/lib/ai/generate";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { posts } from "~/server/db/schema";

export const aiRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
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
