import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/**
 * Middleware for protected routes
 * Verifies authentication tokens before allowing access
 * Adds X-AgroBridge-Mode header to all responses
 */
export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Determine app mode
  const repoMode = process.env.REPOSITORY_MODE?.toLowerCase()
  const authMode = process.env.AUTH_MODE?.toLowerCase()
  const appMode = repoMode === "production" || authMode === "production" ? "production" : "demo"

  // Allow public routes
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname === "/" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") || // Allow all auth endpoints
    pathname.startsWith("/api/demo")
  ) {
    const response = NextResponse.next()
    response.headers.set("X-AgroBridge-Mode", appMode)
    return response
  }

  const cookieToken = request.cookies.get("agrobridge_token")?.value
  const headerToken = request.headers.get("authorization")?.replace("Bearer ", "")
  const authToken = cookieToken || headerToken

  // For dashboard routes, allow access if it's a navigation request
  // Client-side auth context will handle redirects if not authenticated
  if (pathname.startsWith("/dashboard")) {
    // If we have a token, verify it
    if (authToken) {
      try {
        const verifyResponse = await fetch(new URL("/api/auth/verify", request.url), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: authToken }),
        })

        const { valid } = await verifyResponse.json()

        if (!valid) {
          console.log("[v0] Middleware: Invalid token, redirecting to login")
          const response = NextResponse.redirect(new URL("/login", request.url))
          response.headers.set("X-AgroBridge-Mode", appMode)
          // Clear invalid cookie
          response.cookies.delete("agrobridge_token")
          return response
        }
      } catch (error) {
        console.error("[v0] Middleware: Token verification failed:", error)
      }
    }

    // Allow dashboard access - client-side auth will handle it
    const response = NextResponse.next()
    response.headers.set("X-AgroBridge-Mode", appMode)
    return response
  }

  if (appMode === "demo" && pathname.startsWith("/api/")) {
    // Allow API access in demo mode for development
    const response = NextResponse.next()
    response.headers.set("X-AgroBridge-Mode", appMode)
    return response
  }

  // For API routes, require authentication
  if (!authToken) {
    console.log("[v0] Middleware: No token found for API route, returning 401")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Verify token for API routes
  try {
    const verifyResponse = await fetch(new URL("/api/auth/verify", request.url), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: authToken }),
    })

    const { valid } = await verifyResponse.json()

    if (!valid) {
      console.log("[v0] Middleware: Invalid token for API route")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const response = NextResponse.next()
    response.headers.set("X-AgroBridge-Mode", appMode)
    return response
  } catch (error) {
    console.error("[v0] Middleware: Token verification failed:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
}
