import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/api$/, "")

// GET /api/locations/lgas?state_id=<id> - Proxy to backend
// Backend expects: GET /api/locations/states/:stateId/lgas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const stateId = searchParams.get("state_id")
    const stateName = searchParams.get("state_name")

    if (!stateId && !stateName) {
      return NextResponse.json(
        { success: false, error: "state_id or state_name query parameter is required" },
        { status: 400 },
      )
    }

    // Backend route: GET /api/locations/states/:stateId/lgas (accepts id or state code)
    const lookupKey = stateId || stateName
    const backendRes = await fetch(`${BACKEND_URL}/api/locations/states/${encodeURIComponent(lookupKey!)}/lgas`, {
      headers: { "Content-Type": "application/json" },
    })

    if (!backendRes.ok) {
      const errorData = await backendRes.json().catch(() => ({}))
      return NextResponse.json(
        { success: false, error: errorData.error || "Failed to fetch LGAs" },
        { status: backendRes.status },
      )
    }

    const data = await backendRes.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("[API Locations/LGAs] GET error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
