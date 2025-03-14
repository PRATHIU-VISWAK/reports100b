import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// This example protects all routes including api/trpc routes
export default clerkMiddleware({
  publicRoutes: ["/", "/api/webhooks/clerk"],
  ignoredRoutes: ["/api/webhooks/clerk"],
  afterAuth(auth, req) {
    // Handle auth logic after Clerk authenticates the request
    if (!auth.userId && !auth.isPublicRoute) {
      const signInUrl = new URL('/sign-in', req.url)
      signInUrl.searchParams.set('redirect_url', req.url)
      return Response.redirect(signInUrl)
    }

    // Get the role from public metadata
    const role = auth.sessionClaims?.public_metadata?.role as string || "resident"

    // Check admin routes
    if (req.nextUrl.pathname.startsWith('/admin') && role !== 'admin') {
      const dashboardUrl = new URL('/dashboard', req.url)
      return Response.redirect(dashboardUrl)
    }

    // Check dashboard redirect for admins
    if (req.nextUrl.pathname === '/dashboard' && role === 'admin') {
      const adminDashboardUrl = new URL('/admin/dashboard', req.url)
      return Response.redirect(adminDashboardUrl)
    }

    return null // Allow the request to proceed
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};