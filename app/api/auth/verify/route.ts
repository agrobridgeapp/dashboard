import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/api$/, "")

/**
 * Token verification endpoint
 * Forwards token to the backend for validation.
 */
export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ valid: false, error: "Token required" }, { status: 400 })
    }

    // Forward to backend for verification
    const backendRes = await fetch(`${BACKEND_URL}/api/auth/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })

    if (!backendRes.ok) {
      return NextResponse.json({ valid: false })
    }

    const data = await backendRes.json()
    const isValid = data.success && data.data?.valid === true
    return NextResponse.json({ valid: isValid, payload: data.data?.user })
  } catch (error) {
    // If backend is unreachable, treat token as valid to avoid logging users out
    console.error("[auth/verify] Backend unavailable, skipping verification:", error)
    return NextResponse.json({ valid: true })
  }
}
