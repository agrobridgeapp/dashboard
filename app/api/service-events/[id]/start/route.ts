import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const BACKEND_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/api$/, "")

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("agrobridge_token")?.value

    const backendRes = await fetch(`${BACKEND_URL}/api/service-events/${id}/start`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })

    const data = await backendRes.json()
    if (!backendRes.ok) {
      return NextResponse.json({ success: false, error: data.error || "Failed to start" }, { status: backendRes.status })
    }
    return NextResponse.json(data)
  } catch (error) {
    console.error(`[API ServiceEvents] POST /${id}/start error:`, error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
