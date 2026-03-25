import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const BACKEND_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/api$/, "")

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("agrobridge_token")?.value
    const backendRes = await fetch(`${BACKEND_URL}/api/supply-orders/${id}/allocations`, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    })
    const data = await backendRes.json()
    return NextResponse.json(data, { status: backendRes.status })
  } catch (error) {
    console.error("[API] GET allocations error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const body = await request.json()
    const cookieStore = await cookies()
    const token = cookieStore.get("agrobridge_token")?.value
    const backendRes = await fetch(`${BACKEND_URL}/api/supply-orders/${id}/allocations`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    const data = await backendRes.json()
    return NextResponse.json(data, { status: backendRes.status })
  } catch (error) {
    console.error("[API] POST allocation error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const { searchParams } = new URL(request.url)
    const cookieStore = await cookies()
    const token = cookieStore.get("agrobridge_token")?.value
    const backendRes = await fetch(
      `${BACKEND_URL}/api/supply-orders/${id}/allocations?${searchParams.toString()}`,
      { method: "DELETE", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
    )
    const data = await backendRes.json()
    return NextResponse.json(data, { status: backendRes.status })
  } catch (error) {
    console.error("[API] DELETE allocation error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
