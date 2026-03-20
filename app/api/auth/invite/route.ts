import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/api$/, "")

/**
 * GET /api/auth/invite?token=xxx
 * Validate invite token — proxies to backend GET /api/invites?token=xxx
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token")

    if (!token) {
      return NextResponse.json({ success: false, error: "Token is required" }, { status: 400 })
    }

    const backendRes = await fetch(
      `${BACKEND_URL}/api/invites?token=${encodeURIComponent(token)}`,
      { headers: { "Content-Type": "application/json" } },
    )

    if (!backendRes.ok) {
      const errorData = await backendRes.json().catch(() => ({}))
      return NextResponse.json(
        { success: false, error: errorData.error || "Invalid invite token" },
        { status: backendRes.status },
      )
    }

    const data = await backendRes.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("[API Auth/Invite] GET error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

/**
 * POST /api/auth/invite
 * Complete invite: create user account with password.
 * Body: { token, email, password }
 * Proxies to backend POST /api/invites, then sets the auth cookie.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const backendRes = await fetch(`${BACKEND_URL}/api/invites`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    const data = await backendRes.json()

    if (!backendRes.ok) {
      return NextResponse.json(
        { success: false, error: data.error || "Failed to complete registration" },
        { status: backendRes.status },
      )
    }

    const response = NextResponse.json({ ...data, success: true }, { status: 201 })

    // Set the auth cookie on the Next.js side so SSR middleware can read it
    if (data.token) {
      response.cookies.set("agrobridge_token", data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      })
    }

    return response
  } catch (error) {
    console.error("[API Auth/Invite] POST error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
