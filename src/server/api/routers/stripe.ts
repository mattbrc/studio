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
