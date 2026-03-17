import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api").replace(/\/api$/, "")

/**
 * POST /api/auth/signup
 * Creates a new user account (offtaker, partner, etc.).
 * Proxies to backend POST /api/auth/signup and shapes the response
 * to match the frontend User type.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, firstName, lastName, role, phone } = body

    if (!email || !password || !firstName || !lastName || !role) {
      return NextResponse.json(
        { success: false, error: "email, password, firstName, lastName, and role are required" },
        { status: 400 }
      )
    }

    let backendRes: Response
    try {
      backendRes = await fetch(`${BACKEND_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, firstName, lastName, role, phone }),
      })
    } catch (err: any) {
      console.error("[API Signup] Backend unreachable:", err.message)
      return NextResponse.json({ success: false, error: "Auth server unavailable" }, { status: 503 })
    }

    const data = await backendRes.json()

    if (!backendRes.ok || !data.success) {
      const errMsg = data.error || data.message || "Signup failed"
      return NextResponse.json({ success: false, error: errMsg }, { status: backendRes.status })
    }

    const { user: rawUser, token } = data.data

    // Shape to match frontend User type
    const user = {
      id: rawUser.id,
      name: `${rawUser.first_name} ${rawUser.last_name}`,
      email: rawUser.email,
      role: rawUser.role,
      avatar: `${(rawUser.first_name || "?")[0]}${(rawUser.last_name || "")[0]}`.toUpperCase(),
      phone: rawUser.phone ?? undefined,
      tenantType: "PRODUCTION" as const,
      onboardingStatus: "complete" as const,
    }

    const response = NextResponse.json({ success: true, user, token }, { status: 201 })

    response.cookies.set("agrobridge_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })

    return response
  } catch (error) {
    console.error("[API Signup] Internal error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
