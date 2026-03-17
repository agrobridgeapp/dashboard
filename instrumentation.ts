// =====================================================
// INSTRUMENTATION
// Next.js startup hooks
// Runs before any requests are handled
// =====================================================

export async function register() {
  // Only run startup validation on server
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { validateStartup } = await import("./lib/config/startup-validation")
    validateStartup()
  }
}
