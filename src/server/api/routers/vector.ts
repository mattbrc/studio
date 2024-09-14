import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { posts } from "~/server/db/schema";

export const vectorRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

    
  create: publicProcedure
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

  getLatest: publicProcedure.query(async ({ ctx }) => {
    const vectorResult = await ctx.vdb.query.workouts.findFirst({
      orderBy: (workouts, { desc }) => [desc(workouts.createdAt)],
    })

    console.log(vectorResult);
    return vectorResult;
  }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.posts.findMany({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
      limit: 5,
    });
  }),
});