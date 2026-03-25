import { NextResponse } from "next/server"

const BACKEND_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/api$/, "")

export async function GET() {
  try {
    const backendRes = await fetch(`${BACKEND_URL}/api/locations/states`, {
      headers: { "Content-Type": "application/json" },
    })
    const data = await backendRes.json()
    return NextResponse.json(data, { status: backendRes.status })
  } catch (error) {
    console.error("[API Geography] GET states error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
