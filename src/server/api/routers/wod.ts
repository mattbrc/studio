import { createTRPCRouter, publicProcedure, privateProcedure } from "~/server/api/trpc";
import { workoutsLog } from "~/server/db/schema";
import { z } from "zod";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis"; 
import { TRPCError } from "@trpc/server";

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

  // getLatestSql: publicProcedure.query(({ ctx }) => {
  //   const result = ctx.db.select().from(wods).where(sql`DATE(date) = CURDATE()`).execute()
  //   return result;
  // }),

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