import { z } from "zod"
import { NextResponse } from "next/server"

export interface ValidationError {
  error: {
    code: "VALIDATION_ERROR"
    message: string
    details: Array<{
      field: string
      message: string
    }>
  }
}

export function createValidationError(errors: z.ZodError): NextResponse<ValidationError> {
  const details = errors.errors.map((err) => ({
    field: err.path.join("."),
    message: err.message,
  }))

  return NextResponse.json(
    {
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid request payload",
        details,
      },
    },
    { status: 400 },
  )
}

export async function validateRequest<T>(request: Request, schema: z.ZodSchema<T>): Promise<T | NextResponse> {
  try {
    const body = await request.json()

    // Validate and parse the request body
    const validated = schema.parse(body)

    return validated
  } catch (error) {
    if (error instanceof z.ZodError) {
      return createValidationError(error)
    }

    // Handle JSON parsing errors
    return NextResponse.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid JSON payload",
          details: [{ field: "body", message: "Request body must be valid JSON" }],
        },
      },
      { status: 400 },
    )
  }
}

export function isValidationError(response: unknown): response is NextResponse {
  return response instanceof NextResponse
}

// Rate limiting placeholder - structure only, no enforcement
export interface RateLimitConfig {
  maxRequests: number
  windowMs: number
  keyPrefix: string
}

export class RateLimiter {
  private config: RateLimitConfig

  constructor(config: RateLimitConfig) {
    this.config = config
  }

  // Placeholder for rate limiting logic
  // In production, this would use Redis or similar
  async check(key: string): Promise<{ allowed: boolean; remaining: number }> {
    // For now, always allow requests
    return {
      allowed: true,
      remaining: this.config.maxRequests,
    }
  }
}

// Pre-configured rate limiters for different endpoint types
export const authRateLimiter = new RateLimiter({
  maxRequests: 5,
  windowMs: 60 * 1000, // 1 minute
  keyPrefix: "auth",
})

export const apiRateLimiter = new RateLimiter({
  maxRequests: 100,
  windowMs: 60 * 1000, // 1 minute
  keyPrefix: "api",
})
