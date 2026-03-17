import { NextResponse } from "next/server"
import { getAppMode } from "@/lib/config/app-mode"

/**
 * API Response Helpers
 *
 * Standardized response creators that automatically add
 * AgroBridge mode headers and consistent formatting
 */

export function createApiResponse<T>(data: T, status = 200): NextResponse<T> {
  const response = NextResponse.json(data, { status })

  response.headers.set("X-AgroBridge-Mode", getAppMode())

  return response
}

export function createSuccessResponse<T>(data: T, status = 200): NextResponse<{ success: true; data: T }> {
  return createApiResponse({ success: true, data }, status)
}

export function createErrorResponse(
  message: string,
  status = 500,
  code?: string,
): NextResponse<{ success: false; error: { message: string; code?: string } }> {
  return createApiResponse(
    {
      success: false,
      error: {
        message,
        ...(code && { code }),
      },
    },
    status,
  )
}
