import { createSuccessResponse, createErrorResponse } from "@/lib/api/response-helpers"

// Mock review data
const PENDING_REVIEWS = [
  {
    id: "REV001",
    type: "Farmer Registration",
    farmer: "Chidi Amadi",
    agent: "John Okafor",
    location: "Enugu, Nsukka",
    date: "2024-01-18",
    description: "New farmer registration with 2.5 hectares maize farm",
    status: "pending",
  },
  {
    id: "REV002",
    type: "Yield Capture",
    farmer: "Emmanuel Obi",
    agent: "Mary Eze",
    location: "Enugu, Udi",
    date: "2024-01-18",
    description: "Harvest yield: 3,200 kg maize (expected: 3,000 kg)",
    status: "pending",
  },
]

// PATCH /api/reviews/[id] - Approve or reject review
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { action, feedback } = body

    const review = PENDING_REVIEWS.find((r) => r.id === params.id)

    if (!review) {
      return createErrorResponse("Review not found", 404, "NOT_FOUND")
    }

    if (action === "approve") {
      review.status = "approved"
      return createSuccessResponse({
        review,
        message: `${review.type} for ${review.farmer} has been approved`,
      })
    } else if (action === "reject") {
      review.status = "rejected"
      return createSuccessResponse({
        review,
        message: `${review.type} for ${review.farmer} has been rejected`,
        feedback,
      })
    }

    return createErrorResponse("Invalid action", 400, "INVALID_ACTION")
  } catch (error) {
    console.error("[v0] Review update error:", error)
    return createErrorResponse("Failed to update review", 500, "INTERNAL_ERROR")
  }
}
