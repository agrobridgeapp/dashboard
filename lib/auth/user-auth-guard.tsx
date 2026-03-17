"use client"

import type { ReactNode } from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { isUserRole } from "@/lib/auth/role-constants"

/**
 * UserAuthGuard - Route group-level guard for (user) routes.
 * Rejects any user whose role is NOT in USER_ROLES.
 * Admin users who accidentally land here get redirected to the admin login.
 */
export function UserAuthGuard({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login")
    } else if (!isLoading && user && !isUserRole(user.role)) {
      // Admin user trying to access user portal - redirect to admin login
      router.replace("/login/admin?error=unauthorized")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading portal...</p>
        </div>
      </div>
    )
  }

  if (!user || !isUserRole(user.role)) {
    return null
  }

  return <>{children}</>
}
