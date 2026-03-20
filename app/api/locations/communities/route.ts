import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const BACKEND_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/api$/, "")

// GET /api/locations/communities?lga_id=<id> - Proxy to backend
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    if (!searchParams.get("lga_id")) {
      return NextResponse.json(
        { success: false, error: "lga_id query parameter is required" },
        { status: 400 },
      )
    }

    const backendRes = await fetch(
      `${BACKEND_URL}/api/locations/communities?${searchParams.toString()}`,
      { headers: { "Content-Type": "application/json" } },
    )

    if (!backendRes.ok) {
      const errorData = await backendRes.json().catch(() => ({}))
      return NextResponse.json(
        { success: false, error: errorData.error || "Failed to fetch communities" },
        { status: backendRes.status },
      )
    }

    const data = await backendRes.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("[API Locations/Communities] GET error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/locations/communities - Proxy to backend (requires auth)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const cookieStore = await cookies()
    const token = cookieStore.get("agrobridge_token")?.value

    const backendRes = await fetch(`${BACKEND_URL}/api/locations/communities`, {
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
        { success: false, error: data.error || "Failed to create community" },
        { status: backendRes.status },
      )
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("[API Locations/Communities] POST error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
