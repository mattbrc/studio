import Stripe from "stripe"

import { env } from "@/env.mjs"

// export const stripe = new Stripe(env.STRIPE_API_KEY, {
//   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//   // @ts-ignore
//   apiVersion: "2022-11-15",
//   typescript: true,
// })