import { postRouter } from "~/server/api/routers/post";
import { createTRPCRouter } from "~/server/api/trpc";
import { wodRouter } from "./routers/wod";
import { bookRouter } from "./routers/book";
import { bulkRouter } from "./routers/bulk";
import { stripeRouter } from "./routers/stripe";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  wod: wodRouter,
  book: bookRouter,
  bulk: bulkRouter,
  stripe: stripeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
