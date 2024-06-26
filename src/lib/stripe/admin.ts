import { auth } from "@clerk/nextjs/server";
import { stripe } from "@/lib/stripe/config";
import { db } from "~/server/db";
import { customers } from "~/server/db/schema";

export async function handleUserSignupOrLogin() {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  // Check if the user already has a Stripe customer ID
  const userRecord = await db.query.customers.findFirst({
    where: (customers, { eq }) => eq(customers.userId, userId),
  });

  if (!userRecord) {
    // Create a new Stripe customer
    const customer = await stripe.customers.create({
      metadata: {
        clerkUserId: userId,
      },
    });

    // Store the mapping in DB
    await db.insert(customers).values({
      userId: userId,
      stripeCustomerId: customer.id,
    });

    return customer.id;
  }

  // If user already has a Stripe customer ID, return it
  return userRecord.stripeCustomerId;
}

// Create a new checkout session for a user 
export async function checkoutWithStripe(customerId: string, priceId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_NODE_ENV === "production" ? "https://app.acidgambit.com" : "http://localhost:3000";
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${baseUrl}/home`,
    cancel_url: `${baseUrl}/home`,
  });
  console.log("session URL: ", session.url);
  return session.url;
}

export async function createBillingPortal(customerId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_NODE_ENV === "production" ? "https://app.acidgambit.com" : "http://localhost:3000";
  const portal = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${baseUrl}/home`,
  });
  return portal.url;
}