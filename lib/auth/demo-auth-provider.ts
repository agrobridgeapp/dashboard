// =====================================================
// DEMO AUTH PROVIDER
// Handles authentication for demo tenants only
// NOT FOR PRODUCTION USE - No real security guarantees
// =====================================================

import type { User } from "@/lib/auth-context"
import { DEMO_USERS, findDemoUser } from "@/lib/demo/demo-users"

export interface DemoAuthResult {
  success: boolean
  user?: User
  token?: string
  error?: string
}

/**
 * Demo Authentication Provider
 *
 * WARNING: This provider is for DEMO purposes only.
 * - Uses plaintext password comparison
 * - Generates simple mock tokens
 * - No encryption or security guarantees
 *
 * DEMO tenants MUST use this provider.
 * PRODUCTION tenants MUST NEVER use this provider.
 */
export class DemoAuthProvider {
  /**
   * Authenticate a demo user
   */
  async login(email: string, password: string): Promise<DemoAuthResult> {
    console.log("[v0] DemoAuth: Login attempt for:", email)

    const demoUser = findDemoUser(email)

    if (!demoUser) {
      console.log("[v0] DemoAuth: No demo user found for:", email)
      return {
        success: false,
        error: "Invalid credentials",
      }
    }

    // Simple plaintext comparison for demo
    if (password !== demoUser.password) {
      console.log("[v0] DemoAuth: Invalid password for:", email)
      return {
        success: false,
        error: "Invalid credentials",
      }
    }

    // Remove sensitive fields
    const { password: _, description: __, ...userData } = demoUser

    // Generate simple demo token
    const token = this.generateDemoToken(userData.id)

    console.log("[v0] DemoAuth: Login successful for:", email)

    return {
      success: true,
      user: userData,
      token,
    }
  }

  /**
   * Verify a demo token
   */
  async verifyToken(token: string): Promise<{ valid: boolean; userId?: string }> {
    // Demo tokens are just "demo-token-{userId}"
    if (!token.startsWith("demo-token-")) {
      return { valid: false }
    }

    const userId = token.replace("demo-token-", "")
    const user = DEMO_USERS.find((u) => u.id === userId)

    return {
      valid: !!user,
      userId: user?.id,
    }
  }

  /**
   * Generate a simple demo token
   * NOT SECURE - For demo purposes only
   */
  private generateDemoToken(userId: string): string {
    return `demo-token-${userId}`
  }

  /**
   * Check if an email belongs to a demo account
   */
  isDemoEmail(email: string): boolean {
    return !!findDemoUser(email)
  }
}

// Singleton instance
export const demoAuthProvider = new DemoAuthProvider()
