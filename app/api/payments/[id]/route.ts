import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const BACKEND_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api").replace(/\/api$/, "")

// GET /api/payments/[id] - Proxy to backend
export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("agrobridge_token")?.value

    const backendRes = await fetch(`${BACKEND_URL}/api/payments/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })

    if (!backendRes.ok) {
      const errorData = await backendRes.json().catch(() => ({}))
      return NextResponse.json(
        { success: false, error: errorData.error || "Payment not found" },
        { status: backendRes.status },
      )
    }

    const data = await backendRes.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error(`[API Payments] GET /${id} error:`, error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
