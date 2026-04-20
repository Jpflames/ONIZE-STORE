import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isProtectedRoute = createRouteMatcher(["/user(.*)"]);

/** Parses comma-separated admin emails from an env var into a lowercase array. */
function parseAdminEmails(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();

  // Protect user routes
  if (isProtectedRoute(req) && !userId) {
    const signInUrl = new URL("/signin", req.url);
    signInUrl.searchParams.set("redirect_url", req.url);
    return NextResponse.redirect(signInUrl);
  }

  // Protect admin routes — auth check only.
  // Email-based admin check is intentionally deferred to app/admin/layout.tsx
  // which uses currentUser() for guaranteed email access.
  // Clerk does NOT include email in sessionClaims by default, so checking it
  // here would incorrectly block real admins.
  if (isAdminRoute(req)) {
    if (!userId) {
      const signInUrl = new URL("/signin", req.url);
      signInUrl.searchParams.set("redirect_url", req.url);
      return NextResponse.redirect(signInUrl);
    }

    // Best-effort: only block if email IS present in claims AND is not admin.
    // If email is absent (Clerk default JWT), let through — layout.tsx guards.
    const adminEmails = parseAdminEmails(process.env.ADMIN_EMAIL);
    const userEmail =
      ((sessionClaims as Record<string, unknown>)?.email as string) ??
      ((sessionClaims as Record<string, unknown>)?.primaryEmail as string) ??
      "";

    if (
      userEmail &&
      adminEmails.length &&
      !adminEmails.includes(userEmail.toLowerCase())
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
