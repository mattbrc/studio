import { z } from "zod";

import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";
import { posts } from "~/server/db/schema";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  // createSubscription: privateProcedure
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

    // submit workout row for WOD (programId = 0)
  // createSubscription: privateProcedure
  // .input(z.object({ workoutId: z.number() }))
  // .mutation(async ({ ctx, input }) => {
  //   const id = ctx.userId;
  //   const { workoutId } = input;

  //   const { success } = await ratelimit.limit(id);
  //   if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS"});

  //   const existingSubmission = await ctx.db
  //   .select()
  //   .from(workoutsLog)
  //   .where(sql`${workoutsLog.athleteId} = ${id} AND ${workoutsLog.workoutId} = ${workoutId}`)

  //   if (existingSubmission.length !== 0) {
  //     throw new TRPCError({
  //       code: 'CONFLICT',
  //       message: 'Workout has already been submitted'
  //     });
  //   }

  //   const submit = await ctx.db.insert(workoutsLog).values({ athleteId: id, workoutId: workoutId });

  //   return submit;
  // }),

    updateSubscription: privateProcedure
    .input(z.object({ name: z.string().min(1) }))
    .input(z.object({ content: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await ctx.db.insert(posts).values({
        name: input.name,
        content: input.content,
      });
    }),

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.posts.findFirst({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });
  }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.posts.findMany({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
      limit: 5,
    });
  }),
});
