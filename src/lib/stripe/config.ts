/* eslint-disable @typescript-eslint/ban-ts-comment */
import Stripe from "stripe"

import { env } from "@/env.mjs"

// stripe config
export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  // @ts-ignore
  apiVersion: "2022-11-15",
  typescript: true,
})