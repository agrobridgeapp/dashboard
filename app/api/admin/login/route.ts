import type { NextRequest } from "next/server"
import { createSuccessResponse, createErrorResponse } from "@/lib/api/response-helpers"

const BACKEND_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api").replace(/\/api$/, "")

/**
 * POST /api/admin/login
 * Dedicated admin login route — proxies directly to backend POST /api/admin/login
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return createErrorResponse("Email and password are required", 400, "MISSING_CREDENTIALS")
    }

    console.log("[AdminLogin] Forwarding to backend for:", email)

    let backendRes: Response
    try {
      backendRes = await fetch(`${BACKEND_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
    } catch (err: any) {
      console.error("[AdminLogin] Backend unreachable:", err.message)
      return createErrorResponse("Auth server unavailable", 503, "BACKEND_UNREACHABLE")
    }

    const backendData = await backendRes.json()
    console.log("[AdminLogin] Backend responded:", backendRes.status, JSON.stringify(backendData))

    if (!backendRes.ok || !backendData.success) {
      const errMsg = backendData.error || backendData.message || "Invalid credentials"
      return createErrorResponse(errMsg, 401, "AUTH_FAILED")
    }

    const { user: adminUser, token } = backendData.data

    // Map backend Admin shape → frontend User shape
    const user = {
      id: adminUser.id,
      name: `${adminUser.first_name} ${adminUser.last_name}`,
      email: adminUser.email,
      role: adminUser.role,
      avatar: `${(adminUser.first_name || "?")[0]}${(adminUser.last_name || "")[0]}`.toUpperCase(),
      phone: adminUser.phone ?? undefined,
      tenantType: "PRODUCTION" as const,
      onboardingStatus: "complete" as const,
    }

    console.log("[AdminLogin] SUCCESS:", user.email, user.role)

    const response = createSuccessResponse({ user, token })

    response.cookies.set("agrobridge_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })

    return response
  } catch (error) {
    console.error("[AdminLogin] Internal error:", error)
    return createErrorResponse("Internal server error", 500, "INTERNAL_ERROR")
  }
}
