import { createSuccessResponse, createErrorResponse } from "@/lib/api/response-helpers"

// Mock service requests
const SERVICE_REQUESTS = [
  {
    id: "req-001",
    serviceType: "Fertilizer Application",
    amount: 75000,
    agent: "Chioma Okafor",
    farmer: "Akpan Daniel",
    description: "Urgent need before rains, farmer willing to pay partial upfront",
    createdAt: "4 hours ago",
    status: "pending",
  },
  {
    id: "req-002",
    serviceType: "Plowing",
    amount: 60000,
    agent: "Ibrahim Musa",
    farmer: "Fatima Bello",
    description: "Standard land preparation for new season",
    createdAt: "1 day ago",
    status: "pending",
  },
]

// PATCH /api/service-requests/[id] - Approve or reject service request
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { action, reason } = body

    const request_item = SERVICE_REQUESTS.find((r) => r.id === params.id)

    if (!request_item) {
      return createErrorResponse("Service request not found", 404, "NOT_FOUND")
    }

    if (action === "approve") {
      request_item.status = "approved"
      return createSuccessResponse({
        request: request_item,
        message: `${request_item.serviceType} request has been approved`,
      })
    } else if (action === "reject") {
      request_item.status = "rejected"
      return createSuccessResponse({
        request: request_item,
        message: `${request_item.serviceType} request has been rejected`,
        reason,
      })
    }

    return createErrorResponse("Invalid action", 400, "INVALID_ACTION")
  } catch (error) {
    console.error("[v0] Service request update error:", error)
    return createErrorResponse("Failed to update service request", 500, "INTERNAL_ERROR")
  }
}
