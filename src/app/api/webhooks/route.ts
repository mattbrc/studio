import { headers } from "next/headers";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe/config";

import { db } from "~/server/db";
import { subscriptions } from "~/server/db/schema";

// Stripe webhook handler
// cases:
// - new subscription (handles new users and changes to subscription)
// - payment succeeded (update subscription from monthly sub payament w/ new period end and price ID)
// - canceled subscription: no action needed, period end is already set

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature")!;
  let event: Stripe.Event;

  const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeWebhookSecret) {
    return new Response("Internal Server Error", { status: 500 });
  }

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      stripeWebhookSecret
    );
  } catch (error) {
    return new Response(
      `Webhook Error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
      { status: 400 }
    );
  }

  const session = event.data.object as Stripe.Checkout.Session;

  // new subscription, create new subscription row in db
  if (event.type === "checkout.session.completed") {

    const userRecord = await db.query.customers.findFirst({
      where: (customers, { eq }) => eq(customers.stripeCustomerId, session.customer as string),
    });

    if (!userRecord) {
      return new Response(`User not found for customer ID: ${session.customer as string}`, { status: 404 });
    }
    // return the application user ID from the stripe customer ID mapping
    const userId = userRecord.userId;

    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );
    
    await db.insert(subscriptions).values({
      userId: userId,
      stripeSubscriptionId: session.subscription as string,
      stripeCustomerId: session.customer as string,
      stripePriceId: subscription.id,
      stripeCurrentPeriodEnd: subscription.current_period_end,
    });
  }

  // payment succeeded, update subscription w/ new period end and price ID
  if (event.type === "invoice.payment_succeeded") {
    const userRecord = await db.query.customers.findFirst({
      where: (customers, { eq }) => eq(customers.stripeCustomerId, session.customer as string),
    });

    if (!userRecord) {
      return new Response(`User not found for customer ID: ${session.customer as string}`, { status: 404 });
    }
    // return the application user ID from the stripe customer ID mapping
    const userId = userRecord.userId;


    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );
    // console.log("----------------PAYMENT SUCCEEDED: ----------------");
    // console.log(subscription);
    // console.log("-----------------------------------------------------------");

    await db.insert(subscriptions).values({
      userId: userId,
      stripeSubscriptionId: session.subscription as string,
      stripeCustomerId: session.customer as string,
      stripePriceId: subscription.id,
      stripeCurrentPeriodEnd: subscription.current_period_end,
    }).onDuplicateKeyUpdate({
      set: {
        stripePriceId: subscription.id,
        stripeCurrentPeriodEnd: subscription.current_period_end,
      }
    })
  }
  return new Response(null, { status: 200 });
}