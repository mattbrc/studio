import { postRouter } from "~/server/api/routers/post";
import { createTRPCRouter } from "~/server/api/trpc";
import { wodRouter } from "./routers/wod";
import { bulkRouter } from "./routers/bulk";
import { stripeRouter } from "./routers/stripe";
import { profileRouter } from "./routers/profile";
import { aiRouter } from "./routers/ai";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  wod: wodRouter,
  bulk: bulkRouter,
  stripe: stripeRouter,
  profile: profileRouter,
  ai: aiRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
