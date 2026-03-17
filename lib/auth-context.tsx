"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { DASHBOARD_ROUTES, type AnyRole } from "./auth/role-constants"

export type UserRole =
  | "super_admin"
  | "ops_admin"
  | "regional_manager"
  | "state_coordinator"
  | "field_agent"
  | "farmer"
  | "partner"
  | "offtaker"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar: string
  region?: string
  phone?: string
  // Role-specific fields
  farmerId?: string
  farmSize?: string
  crops?: string[]
  partnerType?: "input_supplier" | "mechanization"
  companyName?: string
  offtakerType?: string
  tenantType?: "PRODUCTION" | "DEMO"
  onboardingStatus?: "pending" | "complete"
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  loginWithData: (user: User, token: string) => void
  logout: () => void
  isDemo: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const isDemo = user?.tenantType === "DEMO"

  useEffect(() => {
      const storedUser = localStorage.getItem("agrobridge_user")
      const storedToken = localStorage.getItem("agrobridge_token")

      if (storedUser && storedToken) {
        try {
          setUser(JSON.parse(storedUser))
        } catch (error) {
          console.error("Auth: Failed to hydrate user:", error)
          localStorage.removeItem("agrobridge_user")
          localStorage.removeItem("agrobridge_token")
        }
      }
      setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        const errMsg =
          typeof data.error === "string"
            ? data.error
            : data.error?.message || "Login failed"
        return { success: false, error: errMsg }
      }

      const { user: userData, token } = data.data

      setUser(userData)
      localStorage.setItem("agrobridge_user", JSON.stringify(userData))
      localStorage.setItem("agrobridge_token", token)

      // Check onboarding status — if pending, redirect to role-specific onboarding
      const onboardingStatus = userData.onboardingStatus || "complete"
      let redirectPath: string

      if (onboardingStatus === "pending") {
        // Map role to onboarding path
        const onboardingRoutes: Record<string, string> = {
          field_agent: "/onboarding/agent",
          farmer: "/onboarding/farmer",
          partner: "/onboarding/partner",
          offtaker: "/onboarding/offtaker",
        }
        redirectPath = onboardingRoutes[userData.role] || "/onboarding"
      } else {
        redirectPath = DASHBOARD_ROUTES[userData.role as AnyRole] ?? "/login"
      }

      setTimeout(() => {
        router.push(redirectPath)
      }, 100)

      return { success: true }
    } catch (error: any) {
      console.error("[v0] Auth: Login error:", error)
      return { success: false, error: error.message || "Login failed" }
    }
  }

  const loginWithData = (userData: User, token: string) => {
    setUser(userData)
    localStorage.setItem("agrobridge_user", JSON.stringify(userData))
    localStorage.setItem("agrobridge_token", token)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("agrobridge_user")
    localStorage.removeItem("agrobridge_token")

    document.cookie = "agrobridge_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"

    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, isLoading, login, loginWithData, logout, isDemo }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
