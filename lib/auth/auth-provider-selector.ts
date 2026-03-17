// =====================================================
// AUTH PROVIDER SELECTOR
// All logins go through the production provider
// =====================================================

import { prodAuthProvider } from "./prod-auth-provider"

export type AuthProvider = "production"

/**
 * Get the production auth provider (always)
 */
export function getAuthProvider(_email: string) {
  return {
    type: "production" as const,
    provider: prodAuthProvider,
  }
}

/**
 * Verify a token using the production provider
 */
export async function verifyToken(token: string) {
  return prodAuthProvider.verifyToken(token)
}
