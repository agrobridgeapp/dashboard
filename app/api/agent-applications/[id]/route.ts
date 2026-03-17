import { createSuccessResponse, createErrorResponse } from "@/lib/api/response-helpers"

// Mock data - in production this would be in a database
const AGENT_APPLICATIONS = [
  {
    id: "app-001",
    name: "Fatima Abubakar",
    location: "Kaduna • Igabi",
    experience: "3 years",
    appliedDate: "2025-01-15",
    status: "pending_review",
  },
  {
    id: "app-002",
    name: "Emmanuel Obi",
    location: "Enugu • Enugu East",
    experience: "5 years",
    appliedDate: "2025-01-14",
    status: "pending_interview",
  },
]

// PATCH /api/agent-applications/[id] - Update application status
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { action, reason } = body

    const application = AGENT_APPLICATIONS.find((app) => app.id === params.id)

    if (!application) {
      return createErrorResponse("Application not found", 404, "NOT_FOUND")
    }

    if (action === "approve") {
      application.status = "approved"
      return createSuccessResponse({
        application,
        message: `${application.name}'s application has been approved`,
      })
    } else if (action === "reject") {
      application.status = "rejected"
      return createSuccessResponse({
        application,
        message: `${application.name}'s application has been rejected`,
        reason,
      })
    } else if (action === "contact") {
      return createSuccessResponse({
        message: `Contact initiated with ${application.name}`,
      })
    }

    return createErrorResponse("Invalid action", 400, "INVALID_ACTION")
  } catch (error) {
    console.error("[v0] Agent application update error:", error)
    return createErrorResponse("Failed to update application", 500, "INTERNAL_ERROR")
  }
}
