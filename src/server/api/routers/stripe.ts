import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { checkoutWithStripe, handleUserSignupOrLogin } from "~/lib/stripe/admin";
 
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";

export const stripeRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  test: publicProcedure.query(async ({ ctx }) => {
    const userId = ctx.userId;
    if (!userId) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    const result = await ctx.db.query.customers.findFirst({
      where: (customers, { eq }) => eq(customers.userId, userId),
    });

    // no subscription found
    if (!result) {
      return null
    }

    return result;
  }),

  getSubscription: publicProcedure.query(async ({ ctx }) => {
    const userId = ctx.userId;
    if (!userId) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    const result = await ctx.db.query.subscriptions.findFirst({
      where: (subscriptions, { eq }) => eq(subscriptions.userId, userId),
    });

    // no subscription found
    if (!result) {
      return null
    }

    const currentTimestamp = Math.floor(Date.now() / 1000); // Current time in Unix timestamp

    if (result.stripeCurrentPeriodEnd < currentTimestamp) {
      return null; // Subscription has expired
    }

    // if active subscription, return subscription details
    return result;
  }),

  createCheckoutSession: privateProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.userId;
    if (!userId) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    // Check if the user already has a Stripe customer ID
    // if not, create a new Stripe customer and store the mapping in DB
    const customerId = await handleUserSignupOrLogin();
    if (!customerId) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    const sessionUrl = await checkoutWithStripe(customerId);

    return sessionUrl;
  }),

});
