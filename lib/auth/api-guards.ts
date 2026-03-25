import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth/auth-provider-selector"
import { isAdminRole, isUserRole } from "@/lib/auth/role-constants"

/**
 * Extract and verify the bearer token from a request.
 * Checks Authorization header first, then cookie.
 */
async function extractUser(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  const token =
    authHeader?.replace("Bearer ", "") ||
    request.cookies.get("agrobridge_token")?.value

  if (!token) return null

  const result = await verifyToken(token)
  if (!result.valid || !result.payload) return null

  return result.payload as { id: string; email: string; role: string }
}

/**
 * Wrap an API route handler to require an admin role.
 * Returns 401 if no valid token, 403 if user is not an admin.
 */
export function requireAdminRole(
  handler: (
    request: NextRequest,
    user: { id: string; email: string; role: string }
  ) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    const user = await extractUser(request)
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }
    if (!isAdminRole(user.role)) {
      return NextResponse.json({ error: "Forbidden: admin access required" }, { status: 403 })
    }
    return handler(request, user)
  }
}

/**
 * Wrap an API route handler to require a user role.
 * Returns 401 if no valid token, 403 if user is not a user role.
 */
export function requireUserRole(
  handler: (
    request: NextRequest,
    user: { id: string; email: string; role: string }
  ) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    const user = await extractUser(request)
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }
    if (!isUserRole(user.role)) {
      return NextResponse.json({ error: "Forbidden: user access required" }, { status: 403 })
    }
    return handler(request, user)
  }
}
