"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// =====================================================
// DEMO MODE TYPES
// =====================================================

export type TenantType = "PRODUCTION" | "DEMO"

export interface DemoTenant {
  id: string
  type: TenantType
  name: string
  description: string
  createdAt: string
  lastResetAt: string
}

export interface DemoConfig {
  isDemo: boolean
  tenant: DemoTenant | null
  // Demo-safe overrides
  disableRealPayments: boolean
  disableNotifications: boolean
  disableExternalIntegrations: boolean
  allowFastForward: boolean
  autoApproveFlows: boolean
}

interface DemoContextType {
  config: DemoConfig
  isDemo: boolean
  tenantName: string
  resetDemoData: () => Promise<void>
  fastForwardStatus: (entityType: string, entityId: string, newStatus: string) => Promise<void>
}

const DEFAULT_DEMO_TENANT: DemoTenant = {
  id: "demo-tenant-001",
  type: "DEMO",
  name: "AgroBridge Demo – Maize Corridor",
  description: "Pre-configured demo environment for sales and investor presentations",
  createdAt: "2024-01-01T00:00:00Z",
  lastResetAt: new Date().toISOString(),
}

const DEFAULT_DEMO_CONFIG: DemoConfig = {
  isDemo: true,
  tenant: DEFAULT_DEMO_TENANT,
  disableRealPayments: true,
  disableNotifications: true,
  disableExternalIntegrations: true,
  allowFastForward: true,
  autoApproveFlows: true,
}

const PRODUCTION_CONFIG: DemoConfig = {
  isDemo: false,
  tenant: null,
  disableRealPayments: false,
  disableNotifications: false,
  disableExternalIntegrations: false,
  allowFastForward: false,
  autoApproveFlows: false,
}

const DemoContext = createContext<DemoContextType | undefined>(undefined)

export function DemoProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<DemoConfig>(PRODUCTION_CONFIG)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Check if user is in a demo tenant based on stored session
    const storedUser = localStorage.getItem("agrobridge_user")
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        // Demo users have email pattern: demo-*@agrobridge.app or demo@agrobridge.app
        const isDemo = user.email?.includes("demo") || user.tenantType === "DEMO"
        setConfig(isDemo ? DEFAULT_DEMO_CONFIG : PRODUCTION_CONFIG)
      } catch (error) {
        console.error("[v0] Failed to parse user from localStorage:", error)
        setConfig(PRODUCTION_CONFIG)
      }
    }
  }, [])

  const effectiveConfig = mounted ? config : PRODUCTION_CONFIG

  const resetDemoData = async () => {
    const { resetDemoData: resetSeed } = await import("@/lib/demo/demo-seed")
    resetSeed()

    // Update last reset timestamp
    const updatedTenant = {
      ...DEFAULT_DEMO_TENANT,
      lastResetAt: new Date().toISOString(),
    }

    setConfig({
      ...config,
      tenant: updatedTenant,
    })

    console.log("[v0] Demo data has been reset to pristine state")
  }

  const fastForwardStatus = async (entityType: string, entityId: string, newStatus: string) => {
    if (!effectiveConfig.isDemo || !effectiveConfig.allowFastForward) return

    // In production, this would call an API to update status
    console.log(`[v0][DEMO] Fast-forwarding ${entityType} ${entityId} to ${newStatus}`)
  }

  return (
    <DemoContext.Provider
      value={{
        config: effectiveConfig,
        isDemo: effectiveConfig.isDemo,
        tenantName: effectiveConfig.tenant?.name || "Production",
        resetDemoData,
        fastForwardStatus,
      }}
    >
      {children}
    </DemoContext.Provider>
  )
}

export function useDemo() {
  const context = useContext(DemoContext)
  if (context === undefined) {
    throw new Error("useDemo must be used within a DemoProvider")
  }
  return context
}

// Hook for checking demo-safe actions
export function useDemoSafe() {
  const { config, isDemo } = useDemo()

  return {
    isDemo,
    canProcessPayment: !config.disableRealPayments || !isDemo,
    canSendNotification: !config.disableNotifications || !isDemo,
    canIntegrateExternal: !config.disableExternalIntegrations || !isDemo,
    canFastForward: config.allowFastForward && isDemo,
    canAutoApprove: config.autoApproveFlows && isDemo,

    // Wrapper for actions that should be mocked in demo
    wrapAction: async <T,>(action: () => Promise<T>, mockResult: T, actionName: string): Promise<T> => {
      if (isDemo) {
        console.log(`[v0][DEMO] Mocking action: ${actionName}`)
        return mockResult
      }
      return action()
    },
  }
}
