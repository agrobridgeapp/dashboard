// =====================================================
// ROLE CLASSIFICATION - Single Source of Truth
// Admin = internal staff (ops, supervisory, management)
// User  = external users (agents, farmers, partners, buyers)
// =====================================================

export const ADMIN_ROLES = [
  "super_admin",
  "ops_admin",
  "regional_manager",
  "state_coordinator",
] as const

export const USER_ROLES = [
  "field_agent",
  "farmer",
  "partner",
  "offtaker",
  "aggregator",
] as const

export type AdminRole = (typeof ADMIN_ROLES)[number]
export type UserRole = (typeof USER_ROLES)[number]
export type AnyRole = AdminRole | UserRole

export function isAdminRole(role: string): role is AdminRole {
  return (ADMIN_ROLES as readonly string[]).includes(role)
}

export function isUserRole(role: string): role is UserRole {
  return (USER_ROLES as readonly string[]).includes(role)
}

/** Dashboard route for each role */
export const DASHBOARD_ROUTES: Record<AnyRole, string> = {
  super_admin: "/dashboard/admin",
  ops_admin: "/dashboard/ops",
  regional_manager: "/dashboard/regional",
  state_coordinator: "/dashboard/coordinator",
  field_agent: "/dashboard/agent",
  farmer: "/dashboard/farmer",
  partner: "/dashboard/partner",
  offtaker: "/dashboard/offtaker",
  aggregator: "/dashboard/aggregator",
}
