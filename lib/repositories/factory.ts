// =====================================================
// REPOSITORY FACTORY
// Provides repository instances based on configuration
// =====================================================

import type { IFarmerRepository, IContractRepository, IDeliveryRepository, IUserRepository } from "./interfaces"

// Mock implementations (default)
import { MockFarmerRepository, MockContractRepository, MockDeliveryRepository, MockUserRepository } from "./mock"

// Prisma implementations (production - legacy, used for farmers/contracts/deliveries)
import {
  PrismaFarmerRepository,
  PrismaContractRepository,
  PrismaDeliveryRepository,
} from "./prisma"

// Neon implementation (production - new, for users)
// Lazy-loaded at runtime only in production mode to avoid bundling @neondatabase/serverless
// when running in demo/development mode (the default).

type RepositoryMode = "demo" | "production"

let isInitialized = false
let currentMode: RepositoryMode | null = null

/**
 * Get the repository mode from environment with HARD SAFETY GUARDS
 *
 * SAFETY RULES:
 * 1. Demo mode is the DEFAULT (no env var needed)
 * 2. Production mode MUST be explicitly set with REPOSITORY_MODE="production"
 * 3. Production mode REQUIRES DATABASE_URL or throws error
 * 4. Never silently fall back to production
 */
function getRepositoryMode(): RepositoryMode {
  const envMode = process.env.REPOSITORY_MODE?.toLowerCase()

  // EXPLICIT production mode - must have DATABASE_URL
  if (envMode === "production") {
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "❌ REPOSITORY_MODE is set to 'production' but DATABASE_URL is missing!\n" +
          "   Either:\n" +
          "   1. Set DATABASE_URL environment variable, or\n" +
          "   2. Remove REPOSITORY_MODE to use demo mode",
      )
    }
    return "production"
  }

  // DEFAULT to demo mode (safe for development/testing)
  // This includes: undefined, "demo", "mock", or any other value
  return "demo"
}

/**
 * Initialize repository system and log startup mode
 */
function initializeRepositories(): void {
  if (isInitialized) return

  currentMode = getRepositoryMode()

  if (currentMode === "demo") {
    console.warn(
      "\n" +
        "┌─────────────────────────────────────────────────┐\n" +
        "│  🎭 DEMO MODE ACTIVE                            │\n" +
        "│                                                 │\n" +
        "│  Using mock data (no database required)        │\n" +
        "│  All changes are temporary and in-memory       │\n" +
        "│                                                 │\n" +
        "│  To enable production mode:                    │\n" +
        "│  Set REPOSITORY_MODE=production                │\n" +
        "└─────────────────────────────────────────────────┘\n",
    )
  } else {
    console.warn(
      "\n" +
        "┌─────────────────────────────────────────────────┐\n" +
        "│  🚀 PRODUCTION MODE ACTIVE                      │\n" +
        "│                                                 │\n" +
        "│  Connected to PostgreSQL database              │\n" +
        "│  All data persists in: " +
        (process.env.DATABASE_URL?.substring(0, 30) || "").padEnd(20) +
        "│\n" +
        "│                                                 │\n" +
        "│  CAUTION: Changes affect production data       │\n" +
        "└─────────────────────────────────────────────────┘\n",
    )
  }

  isInitialized = true
}

// Singleton instances
let farmerRepository: IFarmerRepository | null = null
let contractRepository: IContractRepository | null = null
let deliveryRepository: IDeliveryRepository | null = null
let userRepository: IUserRepository | null = null

/**
 * Get the farmer repository instance
 */
export function getFarmerRepository(): IFarmerRepository {
  initializeRepositories()

  if (!farmerRepository) {
    farmerRepository = currentMode === "production" ? new PrismaFarmerRepository() : new MockFarmerRepository()
  }
  return farmerRepository
}

/**
 * Get the contract repository instance
 */
export function getContractRepository(): IContractRepository {
  initializeRepositories()

  if (!contractRepository) {
    contractRepository = currentMode === "production" ? new PrismaContractRepository() : new MockContractRepository()
  }
  return contractRepository
}

/**
 * Get the delivery repository instance
 */
export function getDeliveryRepository(): IDeliveryRepository {
  initializeRepositories()

  if (!deliveryRepository) {
    deliveryRepository = currentMode === "production" ? new PrismaDeliveryRepository() : new MockDeliveryRepository()
  }
  return deliveryRepository
}

/**
 * Get the user repository instance
 */
export async function getUserRepository(): Promise<IUserRepository> {
  initializeRepositories()

  if (!userRepository) {
    if (currentMode === "production") {
      const { NeonUserRepository } = await import("./neon/neon-user-repository")
      userRepository = new NeonUserRepository()
    } else {
      userRepository = new MockUserRepository()
    }
  }
  return userRepository
}

/**
 * Get the current repository mode
 */
export function getCurrentMode(): RepositoryMode {
  initializeRepositories()
  return currentMode!
}

/**
 * Reset all repository instances (for testing)
 */
export function resetRepositories(): void {
  farmerRepository = null
  contractRepository = null
  deliveryRepository = null
  userRepository = null
  isInitialized = false
  currentMode = null
}
