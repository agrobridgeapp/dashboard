import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/api$/, "")

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const stateId = searchParams.get("state_id")

    // Route to the appropriate backend endpoint
    const url = stateId
      ? `${BACKEND_URL}/api/locations/states/${stateId}/lgas`
      : `${BACKEND_URL}/api/locations/states`

    const backendRes = await fetch(url, {
      headers: { "Content-Type": "application/json" },
    })
    const data = await backendRes.json()
    return NextResponse.json(data, { status: backendRes.status })
  } catch (error) {
    console.error("[API Geography] GET lgas error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
