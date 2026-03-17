"use client"

import type { ReactNode } from "react"
import { useAuth, type UserRole } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { RoleSidebar } from "./role-sidebar"
import { RoleHeader } from "./role-header"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { DASHBOARD_ROUTES } from "@/lib/auth/role-constants"

interface DashboardLayoutProps {
  children: ReactNode
  allowedRoles?: UserRole[]
  role?: UserRole
}

export function DashboardLayout({ children, allowedRoles, role }: DashboardLayoutProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const roles: UserRole[] = allowedRoles || (role ? [role] : [])

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    } else if (!isLoading && user && user.role && roles.length > 0) {
      const hasAccess = user.role === "super_admin" || roles.includes(user.role)

      if (!hasAccess) {
        router.push(DASHBOARD_ROUTES[user.role] ?? "/login")
      }
    }
  }, [user, isLoading, router, roles])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!user || !user.role) return null

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <RoleSidebar role={user.role} className="hidden lg:flex" />

      {/* Mobile Sidebar - Deep Forest Green background */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64 bg-sidebar border-sidebar-border">
          <RoleSidebar role={user.role} onNavigate={() => setSidebarOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="lg:pl-64">
        <RoleHeader user={user} onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
