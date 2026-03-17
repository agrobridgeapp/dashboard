"use client"

import { AdminAuthGuard } from "@/lib/auth/admin-auth-guard"

/**
 * Admin Route Group Layout
 * All routes under app/(admin)/ are wrapped with AdminAuthGuard.
 * This rejects any non-admin role at the layout level, before
 * individual page guards (allowedRoles) are even evaluated.
 *
 * The route group (admin) is invisible in the URL path, so
 * /dashboard/ops/... and /dashboard/admin/... URLs stay unchanged.
 */
export default function AdminGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminAuthGuard>{children}</AdminAuthGuard>
}
