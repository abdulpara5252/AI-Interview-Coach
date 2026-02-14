import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPrivateRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/interview(.*)",
  "/sessions(.*)",
  "/profile(.*)",
  "/onboarding(.*)",
]);

// Routes that should never have auth middleware applied
const isPublicApiRoute = createRouteMatcher([
  "/api/webhook/clerk(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // Never protect webhook routes
  if (isPublicApiRoute(req)) {
    return NextResponse.next();
  }

  // Protect dashboard and other private routes
  if (isPrivateRoute(req)) {
    await auth.protect();
  }

  // Pass pathname to server components so layout can read it
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", req.nextUrl.pathname);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
