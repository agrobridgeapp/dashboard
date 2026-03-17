// =====================================================
// DEMO API ENDPOINT
// For resetting demo data via HTTP request
// =====================================================

import { NextResponse } from "next/server"
import { resetDemoData, getDemoStore } from "./demo-seed"

export async function POST() {
  try {
    resetDemoData()
    const store = getDemoStore()

    return NextResponse.json({
      success: true,
      message: "Demo data has been reset to seed state",
      timestamp: store.getLastResetAt().toISOString(),
      stats: {
        farmers: store.getFarmers().length,
        contracts: store.getContracts().length,
        deliveries: store.getDeliveries().length,
      },
    })
  } catch (error) {
    console.error("[v0] Failed to reset demo data:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to reset demo data",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  const store = getDemoStore()

  return NextResponse.json({
    lastResetAt: store.getLastResetAt().toISOString(),
    stats: {
      farmers: store.getFarmers().length,
      contracts: store.getContracts().length,
      deliveries: store.getDeliveries().length,
    },
  })
}
