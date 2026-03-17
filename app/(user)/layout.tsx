"use client"

import { UserAuthGuard } from "@/lib/auth/user-auth-guard"

/**
 * User Route Group Layout
 * All routes under app/(user)/ are wrapped with UserAuthGuard.
 * This rejects any admin role at the layout level, before
 * individual page guards (allowedRoles) are even evaluated.
 *
 * The route group (user) is invisible in the URL path, so
 * /dashboard/agent/... and /dashboard/farmer/... URLs stay unchanged.
 */
export default function UserGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <UserAuthGuard>{children}</UserAuthGuard>
}
