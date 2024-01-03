import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
// import { wods } from "~/server/db/schema";

export const wodRouter = createTRPCRouter({
  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.wods.findFirst({
      orderBy: (wods, { desc }) => [desc(wods.date)],
    });
  }),
});
