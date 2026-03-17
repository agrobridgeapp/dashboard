import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const BACKEND_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api").replace(/\/api$/, "")

// GET /api/service-events - Proxy to backend
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cookieStore = await cookies()
    const token = cookieStore.get("agrobridge_token")?.value

    const backendRes = await fetch(`${BACKEND_URL}/api/service-events?${searchParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!backendRes.ok) {
      const errorData = await backendRes.json().catch(() => ({}))
      return NextResponse.json(
        { success: false, error: errorData.error || "Failed to fetch service events" },
        { status: backendRes.status },
      )
    }

    const data = await backendRes.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("[API ServiceEvents] GET error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/service-events - Proxy to backend
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const cookieStore = await cookies()
    const token = cookieStore.get("agrobridge_token")?.value

    const backendRes = await fetch(`${BACKEND_URL}/api/service-events`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const data = await backendRes.json()

    if (!backendRes.ok) {
      return NextResponse.json(
        { success: false, error: data.error || "Failed to create service event" },
        { status: backendRes.status },
      )
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("[API ServiceEvents] POST error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
