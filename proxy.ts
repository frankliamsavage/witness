import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const publicRoutes = createRouteMatcher([
  "/",
  "/age-gate",
  "/minecraft",
  "/sanctuary",
  "/sanctuary/scrolls/(.*)",
  "/submit-testimony",
  "/marketplace",
  "/the-promise",
  "/book-of-life",
  "/engage",
  "/help",
  "/donate",
  "/profiles",
  "/u/(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/age-verification",
  "/api/webhooks/(.*)",
  "/api/parental-consent/(.*)",
  "/parental-consent/(.*)",
  "/legal",
  "/legal/(.*)",
  "/legal/disclaimer",
  "/legal/cookies",
  "/legal/coppa-terms",
  "/legal/vender-agreement",
  "/privacy",
  "/terms",
  "/support",
  "/report-issue"
]);

export default clerkMiddleware(async (auth, request) => {
  // Handle Clerk authentication
  if (!publicRoutes(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)"],
};