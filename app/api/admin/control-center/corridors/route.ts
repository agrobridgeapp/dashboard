import { NextResponse } from "next/server"
import { cookies } from "next/headers"

const BACKEND_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api").replace(/\/api$/, "")

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("agrobridge_token")?.value

    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const backendRes = await fetch(`${BACKEND_URL}/api/admin/control-center/corridors`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!backendRes.ok) {
      const errorData = await backendRes.json().catch(() => ({}))
      return NextResponse.json(
        { success: false, error: errorData.error || "Failed to fetch corridors" },
        { status: backendRes.status }
      )
    }

    const data = await backendRes.json()
    return NextResponse.json(data.data)
  } catch (error) {
    console.error("[api/admin/control-center/corridors] GET error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
