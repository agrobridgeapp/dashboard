import { createSuccessResponse, createErrorResponse } from "@/lib/api/response-helpers"

const DATA_QUALITY_ISSUES = [
  {
    id: "DQ-001",
    type: "missing",
    entityType: "service",
    entityId: "SVC-1234",
    description: "Service marked complete but no completion date recorded",
    severity: "high",
    detected: "2 hours ago",
    status: "active",
  },
  {
    id: "DQ-002",
    type: "suspicious",
    entityType: "yield",
    entityId: "YIELD-5678",
    description: "Yield variance of 65% seems abnormally high",
    severity: "medium",
    detected: "1 day ago",
    status: "active",
  },
]

// PATCH /api/data-quality/[id] - Review or resolve issue
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { action, resolution } = body

    console.log("[v0] Data quality API: Received request for ID:", id)
    console.log("[v0] Data quality API: Action:", action)

    const issue = DATA_QUALITY_ISSUES.find((i) => i.id === id)

    if (!issue) {
      console.error("[v0] Data quality API: Issue not found for ID:", id)
      console.log(
        "[v0] Available issue IDs:",
        DATA_QUALITY_ISSUES.map((i) => i.id),
      )
      return createErrorResponse("Issue not found", 404, "NOT_FOUND")
    }

    if (action === "resolve") {
      issue.status = "resolved"
      console.log("[v0] Data quality API: Issue resolved:", issue.id)
      return createSuccessResponse({
        issue,
        message: `Issue ${issue.id} has been resolved`,
        resolution,
      })
    } else if (action === "assign") {
      console.log("[v0] Data quality API: Issue assigned to team:", issue.id)
      return createSuccessResponse({
        issue,
        message: `Issue ${issue.id} has been assigned to the team`,
      })
    } else if (action === "false_positive") {
      issue.status = "closed"
      console.log("[v0] Data quality API: Issue marked as false positive:", issue.id)
      return createSuccessResponse({
        issue,
        message: `Issue ${issue.id} has been marked as a false positive`,
      })
    } else if (action === "review") {
      console.log("[v0] Data quality API: Opening review for:", issue.id)
      return createSuccessResponse({
        issue,
        message: `Opened detailed review for issue ${issue.id}`,
      })
    }

    return createErrorResponse("Invalid action", 400, "INVALID_ACTION")
  } catch (error) {
    console.error("[v0] Data quality update error:", error)
    return createErrorResponse("Failed to update issue", 500, "INTERNAL_ERROR")
  }
}
