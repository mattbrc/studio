import {
  clerkMiddleware,
  createRouteMatcher
} from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/home/dashboard(.*)',
  '/user/:userId(.*)', // This pattern will match /user/user_id1234 and similar routes
  '/macros/meal-plan(.*)',
]);

// const isPublicRoute = createRouteMatcher(["/","/api/webhooks"]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};