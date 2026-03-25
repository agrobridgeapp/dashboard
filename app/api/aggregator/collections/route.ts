import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const BACKEND_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/api$/, "")

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cookieStore = await cookies()
    const token = cookieStore.get("agrobridge_token")?.value
    const backendRes = await fetch(`${BACKEND_URL}/api/aggregator/collections?${searchParams.toString()}`, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    })
    const data = await backendRes.json()
    return NextResponse.json(data, { status: backendRes.status })
  } catch (error) {
    console.error("[API Aggregator] GET collections error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
