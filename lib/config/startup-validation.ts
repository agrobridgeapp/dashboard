// =====================================================
// STARTUP VALIDATION
// Critical production readiness checks
// Runs before handling any requests
// =====================================================

/**
 * AgroBridge Startup Validation
 *
 * This module performs critical safety checks at application startup.
 * It ensures that production mode is only enabled with proper configuration.
 *
 * Safety Philosophy:
 * - DEMO mode is the safe default (requires zero config)
 * - PRODUCTION mode must be explicitly enabled
 * - Missing production config = immediate crash with clear error
 * - Never silently fall back or continue with incomplete config
 */

const BANNER_WIDTH = 70
const DEMO_BANNER_COLOR = "\x1b[33m" // Yellow
const PROD_BANNER_COLOR = "\x1b[31m" // Red
const RESET_COLOR = "\x1b[0m"

function printBanner(title: string, lines: string[], color: string) {
  const border = "═".repeat(BANNER_WIDTH)

  console.log(`\n${color}╔${border}╗${RESET_COLOR}`)
  console.log(`${color}║${" ".repeat(BANNER_WIDTH)}║${RESET_COLOR}`)

  // Center the title
  const titlePadding = Math.floor((BANNER_WIDTH - title.length) / 2)
  console.log(
    `${color}║${" ".repeat(titlePadding)}${title}${" ".repeat(BANNER_WIDTH - title.length - titlePadding)}║${RESET_COLOR}`,
  )

  console.log(`${color}║${" ".repeat(BANNER_WIDTH)}║${RESET_COLOR}`)
  console.log(`${color}╠${border}╣${RESET_COLOR}`)

  // Print each line
  lines.forEach((line) => {
    const padding = BANNER_WIDTH - line.length
    console.log(`${color}║ ${line}${" ".repeat(padding - 1)}║${RESET_COLOR}`)
  })

  console.log(`${color}║${" ".repeat(BANNER_WIDTH)}║${RESET_COLOR}`)
  console.log(`${color}╚${border}╝${RESET_COLOR}\n`)
}

function validateRepositoryMode() {
  const mode = process.env.REPOSITORY_MODE?.toLowerCase()

  if (mode === "production") {
    // Production mode requires DATABASE_URL
    if (!process.env.DATABASE_URL) {
      printBanner(
        "🚨 PRODUCTION MODE ERROR 🚨",
        [
          "REPOSITORY_MODE is set to 'production'",
          "but DATABASE_URL is missing!",
          "",
          "To fix this error:",
          "  1. Add DATABASE_URL to your environment variables, OR",
          "  2. Remove REPOSITORY_MODE to use demo mode",
          "",
          "AgroBridge cannot start in production mode without a database.",
        ],
        PROD_BANNER_COLOR,
      )
      throw new Error("PRODUCTION MODE: DATABASE_URL is required but not set")
    }

    return "production"
  }

  // Default to demo mode (safe default)
  return "demo"
}

function validateAuthMode() {
  const mode = process.env.AUTH_MODE?.toLowerCase()

  if (mode === "production") {
    // Production auth requires JWT_SECRET
    if (!process.env.JWT_SECRET) {
      printBanner(
        "🚨 PRODUCTION AUTH ERROR 🚨",
        [
          "AUTH_MODE is set to 'production'",
          "but JWT_SECRET is missing!",
          "",
          "To fix this error:",
          "  1. Add JWT_SECRET to your environment variables, OR",
          "  2. Remove AUTH_MODE to use demo auth",
          "",
          "Production authentication requires a secure JWT secret.",
          "Generate one with: openssl rand -base64 32",
        ],
        PROD_BANNER_COLOR,
      )
      throw new Error("PRODUCTION MODE: JWT_SECRET is required but not set")
    }

    if (process.env.JWT_SECRET.length < 32) {
      printBanner(
        "⚠️  WEAK JWT_SECRET WARNING ⚠️",
        [
          "JWT_SECRET is too short (minimum 32 characters).",
          "",
          "This is a CRITICAL SECURITY RISK in production.",
          "Generate a strong secret with: openssl rand -base64 32",
        ],
        PROD_BANNER_COLOR,
      )
      throw new Error("PRODUCTION MODE: JWT_SECRET is too weak (minimum 32 characters)")
    }

    return "production"
  }

  // Default to demo mode (safe default)
  return "demo"
}

function printStartupBanner(repoMode: string, authMode: string) {
  const isFullProduction = repoMode === "production" || authMode === "production"

  if (isFullProduction) {
    // Production mode warning
    const prodServices: string[] = []
    if (repoMode === "production") prodServices.push("Database: PRODUCTION (Neon)")
    else prodServices.push("Database: DEMO (In-Memory)")

    if (authMode === "production") prodServices.push("Auth: PRODUCTION (JWT + bcrypt)")
    else prodServices.push("Auth: DEMO (Mock tokens)")

    printBanner(
      "⚠️  AGROBRIDGE - PRODUCTION MODE  ⚠️",
      [
        "Application is running with production components:",
        "",
        ...prodServices,
        "",
        "⚠️  Real data will be stored and processed.",
        "⚠️  Ensure all security measures are in place.",
        "⚠️  Monitor logs and error tracking carefully.",
      ],
      PROD_BANNER_COLOR,
    )
  } else {
    // Demo mode (default, safe mode)
    printBanner(
      "🎭  AGROBRIDGE - DEMO MODE  🎭",
      [
        "Application is running in SAFE DEMO MODE:",
        "",
        "Database: DEMO (In-Memory Mock Data)",
        "Auth: DEMO (Test accounts with mock tokens)",
        "",
        "✓ No production data at risk",
        "✓ Perfect for development, testing, and demos",
        "✓ Safe to experiment without consequences",
        "",
        "To enable production mode:",
        "  Set REPOSITORY_MODE=production (requires DATABASE_URL)",
        "  Set AUTH_MODE=production (requires JWT_SECRET)",
      ],
      DEMO_BANNER_COLOR,
    )
  }
}

export function validateStartup() {
  console.log("\n🚀 AgroBridge starting up...")
  console.log("⏱️  Running production readiness checks...\n")

  try {
    // Validate repository mode (database)
    const repoMode = validateRepositoryMode()
    console.log(`✓ Repository Mode: ${repoMode.toUpperCase()}`)

    // Validate auth mode
    const authMode = validateAuthMode()
    console.log(`✓ Auth Mode: ${authMode.toUpperCase()}`)

    // Print appropriate startup banner
    printStartupBanner(repoMode, authMode)

    console.log("✓ All startup checks passed")
    console.log("✓ AgroBridge is ready to accept requests\n")

    return {
      repoMode,
      authMode,
      isProduction: repoMode === "production" || authMode === "production",
    }
  } catch (error) {
    console.error("\n❌ Startup validation failed!")
    console.error("❌ AgroBridge cannot start with invalid configuration\n")
    throw error
  }
}
