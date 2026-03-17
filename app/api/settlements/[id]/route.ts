import { createSuccessResponse, createErrorResponse } from "@/lib/api/response-helpers"

// PATCH /api/settlements/[id] - Approve settlement or trigger disbursement
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { action } = body

    const farmerId = params.id

    if (action === "approve") {
      return createSuccessResponse({
        message: `Settlement approved for farmer ${farmerId}`,
        farmerId,
        status: "approved",
      })
    } else if (action === "disburse") {
      return createSuccessResponse({
        message: `Payment disbursed to farmer ${farmerId}`,
        farmerId,
        status: "disbursed",
        disbursedAt: new Date().toISOString(),
      })
    }

    return createErrorResponse("Invalid action", 400, "INVALID_ACTION")
  } catch (error) {
    console.error("[v0] Settlement update error:", error)
    return createErrorResponse("Failed to update settlement", 500, "INTERNAL_ERROR")
  }
}
