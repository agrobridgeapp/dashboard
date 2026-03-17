"use client"

import type { ReactNode } from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { isAdminRole } from "@/lib/auth/role-constants"

/**
 * AdminAuthGuard - Route group-level guard for (admin) routes.
 * Rejects any user whose role is NOT in ADMIN_ROLES.
 * This is the first layer of defense; individual pages
 * retain their own allowedRoles checks as defense-in-depth.
 */
export function AdminAuthGuard({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login/admin")
    } else if (!isLoading && user && !isAdminRole(user.role)) {
      // User has a valid session but is NOT an admin role.
      // Redirect them to the user login with an error.
      router.replace("/login?error=unauthorized")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading admin portal...</p>
        </div>
      </div>
    )
  }

  if (!user || !isAdminRole(user.role)) {
    return null
  }

  return <>{children}</>
}
