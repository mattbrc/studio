import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { wods } from "~/server/db/schema";

export const wodRouter = createTRPCRouter({
  // hello: publicProcedure
  //   .input(z.object({ text: z.string() }))
  //   .query(({ input }) => {
  //     return {
  //       greeting: `Hello ${input.text}`,
  //     };
  //   }),

  // create: publicProcedure
  //   .input(z.object({ name: z.string().min(1) }))
  //   .input(z.object({ content: z.string().min(1) }))
  //   .mutation(async ({ ctx, input }) => {
  //     // simulate a slow db call
  //     await new Promise((resolve) => setTimeout(resolve, 1000));

  //     await ctx.db.insert(wods).values({
  //       name: input.name,
  //       content: input.content,
  //     });
  //   }),

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.wods.findFirst({
      orderBy: (wods, { desc }) => [desc(wods.date)],
    });
  }),

  // getAll: publicProcedure.query(({ ctx }) => {
  //   return ctx.db.query.posts.findMany({
  //     orderBy: (wods, { desc }) => [desc(wods.date)],
  //     limit: 5,
  //   });
  // }),
});
