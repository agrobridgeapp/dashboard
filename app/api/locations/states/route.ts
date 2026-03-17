import { NextResponse } from "next/server"

const BACKEND_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api").replace(/\/api$/, "")

// GET /api/locations/states - Proxy to backend
export async function GET() {
  try {
    const backendRes = await fetch(`${BACKEND_URL}/api/locations/states`, {
      headers: { "Content-Type": "application/json" },
    })

    if (!backendRes.ok) {
      const errorData = await backendRes.json().catch(() => ({}))
      return NextResponse.json(
        { success: false, error: errorData.error || "Failed to fetch states" },
        { status: backendRes.status },
      )
    }

    const data = await backendRes.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("[API Locations/States] GET error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
