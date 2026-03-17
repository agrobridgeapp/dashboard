/**
 * Application Mode Detection
 *
 * Centralized mode detection for demo vs production
 * Used for API headers, logging, and UI indicators
 */

export type AppMode = "demo" | "production"

export function getAppMode(): AppMode {
  const repoMode = process.env.REPOSITORY_MODE?.toLowerCase()
  const authMode = process.env.AUTH_MODE?.toLowerCase()

  // If either system is in production mode, the app is in production
  if (repoMode === "production" || authMode === "production") {
    return "production"
  }

  return "demo"
}

export function isDemoMode(): boolean {
  return getAppMode() === "demo"
}

export function isProductionMode(): boolean {
  return getAppMode() === "production"
}
