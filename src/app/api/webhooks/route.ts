import { headers } from "next/headers"
import type Stripe from "stripe"
import { api } from "~/trpc/server";
import { stripe } from "@/lib/stripe/config"
import { auth } from '@clerk/nextjs/server';

import { subscriptions } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { env } from "~/env.mjs";

export async function POST(req: Request) {
  console.log("webhook request received");
  const body = await req.text();
  const signature = headers().get("Stripe-Signature")!;
  const userId = auth();

  let event: Stripe.Event;

  const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeWebhookSecret) {
    console.error("Stripe webhook secret is not set");
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

  if (event.type === "checkout.session.completed") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );
    console.log("sub details: ", subscription);
  }

  // if (event.type === "checkout.session.completed") {
  //   // Retrieve the subscription details from Stripe.
  //   const subscription = await stripe.subscriptions.retrieve(
  //     session.subscription as string
  //   );
  //   console.log("sub details from sign up: ", subscription);
  //   // Update the user stripe into in our database.
  //   // await db.user.update({
  //   //   where: {
  //   //     id: session?.metadata?.userId,
  //   //   },
  //   //   data: {
  //   //     stripeSubscriptionId: subscription.id,
  //   //     stripeCustomerId: subscription.customer as string,
  //   //     stripePriceId: subscription.items.data[0].price.id,
  //   //     stripeCurrentPeriodEnd: new Date(
  //   //       subscription.current_period_end * 1000
  //   //     ),
  //   //   },
  //   // });
  // }

  // if (event.type === "invoice.payment_succeeded") {
  //   // Retrieve the subscription details from Stripe.
  //   const subscription = await stripe.subscriptions.retrieve(
  //     session.subscription as string
  //   );
  //   console.log("sub details from payment: ", subscription);
  //   // Update the price id and set the new period end.
  //   // await db.user.update({
  //   //   where: {
  //   //     stripeSubscriptionId: subscription.id,
  //   //   },
  //   //   data: {
  //   //     stripePriceId: subscription.items.data[0].price.id,
  //   //     stripeCurrentPeriodEnd: new Date(
  //   //       subscription.current_period_end * 1000
  //   //     ),
  //   //   },
  //   // });
  // }

  return new Response(null, { status: 200 });
}