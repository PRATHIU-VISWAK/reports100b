import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

// Define route matchers
const publicRoutes = createRouteMatcher(["/"])
const authRoutes = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/reset-password(.*)",
  "/sso-callback(.*)",
  "/verify(.*)"
])
const adminRoutes = createRouteMatcher(["/admin(.*)"])

export default clerkMiddleware(async (auth, request) => {
  // Handle /login redirect
  if (request.nextUrl.pathname === "/login") {
    return Response.redirect(new URL("/sign-in", request.url))
  }

  // Get auth state
  const authObject = await auth()

  // If on auth pages and authenticated, redirect to dashboard
  if (authRoutes(request) && authObject.userId) {
    return Response.redirect(new URL("/dashboard", request.url))
  }

  // If not public or auth route, protect it
  if (!publicRoutes(request) && !authRoutes(request)) {
    if (!authObject.userId) {
      return Response.redirect(new URL("/sign-in", request.url))
    }
  }

  // Check admin routes
  if (adminRoutes(request)) {
    const metadata = authObject.sessionClaims?.metadata as { role?: string } || {}
    const role = metadata.role || "resident"

    if (role !== "admin") {
      return Response.redirect(new URL("/dashboard", request.url))
    }
  }
})

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)", // Skip static files
    "/", // Match root
    "/(api|trpc)(.*)" // Match API routes
  ]
} 