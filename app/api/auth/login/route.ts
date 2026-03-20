import type { NextRequest } from "next/server"
import { loginSchema } from "@/lib/validation/schemas"
import { validateRequest, isValidationError } from "@/lib/validation/middleware"
import { createSuccessResponse, createErrorResponse } from "@/lib/api/response-helpers"

const BACKEND_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/api$/, "")

export async function POST(request: NextRequest) {
  try {
    const validatedData = await validateRequest(request, loginSchema)

    if (isValidationError(validatedData)) {
      return validatedData
    }

    const { email, password } = validatedData
    console.log("[API Login] Request for:", email, "→ backend:", `${BACKEND_URL}/api/auth/login`)

    // Forward to backend auth login
    let backendRes: Response
    try {
      backendRes = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
    } catch (fetchErr: any) {
      console.error("[API Login] Could not reach backend:", fetchErr.message)
      return createErrorResponse("Could not reach auth server", 503, "BACKEND_UNREACHABLE")
    }

    const backendData = await backendRes.json()
    console.log("[API Login] Backend status:", backendRes.status, "| body:", JSON.stringify(backendData))

    if (!backendRes.ok || !backendData.success) {
      // Backend sendError returns { success: false, error: "..." }
      const errMsg = backendData.error || backendData.message || "Invalid credentials"
      console.log("[API Login] FAIL —", errMsg)
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

    console.log("[API Login] SUCCESS — user:", user.email, "role:", user.role)

    const response = createSuccessResponse({ user, token })

    response.cookies.set("agrobridge_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    return response
  } catch (error) {
    console.error("[API Login] Internal error:", error)
    return createErrorResponse("Internal server error", 500, "INTERNAL_ERROR")
  }
}
