import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";
import { userProfiles } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const profileRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  upsertUserProfile: privateProcedure
    .input(z.object({
      instagram: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      goal: z.string().optional(),
      isPublic: z.boolean(),
    }))
    .mutation(async ({ ctx, input }) => {
      const existingProfile = await ctx.db.query.userProfiles.findFirst({
        where: (profile, { eq }) => eq(profile.userId, ctx.userId),
      });

      if (existingProfile) {
        // Update existing profile
        return ctx.db.update(userProfiles)
          .set({
            instagram: input.instagram ?? existingProfile.instagram,
            city: input.city ?? existingProfile.city,
            state: input.state ?? existingProfile.state,
            goal: input.goal ?? existingProfile.goal,
            isPublic: input.isPublic,
          })
          .where(eq(userProfiles.userId, ctx.userId));
      } else {
        // Insert new profile
        return ctx.db.insert(userProfiles)
          .values({
            userId: ctx.userId,
            instagram: input.instagram ?? null,
            city: input.city ?? null,
            state: input.state ?? null,
            goal: input.goal ?? null,
            isPublic: input.isPublic,
          });
      }
    }),

  updateUserProfile: privateProcedure
    .input(z.object({
      gender: z.string(),
      weight: z.number(),
      height: z.number(),
      age: z.number(),
      activityFactor: z.number(),
      bmr: z.number(),
      tdee: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      const existingProfile = await ctx.db.query.userProfiles.findFirst({
        where: (profile, { eq }) => eq(profile.userId, ctx.userId),
      });

      if (!existingProfile) {
        // Create a new profile if one doesn't exist
        return ctx.db.insert(userProfiles)
          .values({
            userId: ctx.userId,
            gender: input.gender,
            weight: input.weight,
            height: input.height,
            age: input.age,
            activityFactor: input.activityFactor,
            bmr: input.bmr,
            tdee: input.tdee,
            isPublic: false, // Set a default value for isPublic
          });
      }

      // Update existing profile
      return ctx.db.update(userProfiles)
        .set({
          gender: input.gender,
          weight: input.weight,
          height: input.height,
          age: input.age,
          activityFactor: input.activityFactor,
          bmr: input.bmr,
          tdee: input.tdee,
        })
        .where(eq(userProfiles.userId, ctx.userId));
    }),

  getUserMacros: privateProcedure.query(async ({ ctx }) => {
    const id = ctx.userId;
    if (!id) {
      return
    }
    return ctx.db.query.userProfiles.findFirst({
      where: (userProfiles, { eq }) => eq(userProfiles.userId, id),
    });
  }),

  getUserProfile: publicProcedure.query(({ ctx }) => {
    const id = ctx.userId;
    if (!id) {
      return
    }
    return ctx.db.query.userProfiles.findFirst({
      where: (userProfiles, { eq }) => eq(userProfiles.userId, id),
      orderBy: (userProfiles, { desc }) => [desc(userProfiles.createdAt)],
    });
  }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.posts.findMany({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
      limit: 5,
    });
  }),
});
