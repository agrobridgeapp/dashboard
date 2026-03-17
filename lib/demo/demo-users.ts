// =====================================================
// DEMO USERS - Preconfigured accounts for demo tenants
// =====================================================

import type { User } from "@/lib/auth-context"

export interface DemoUser extends User {
  password: string
  tenantType: "DEMO"
  description: string
}

export const DEMO_USERS: DemoUser[] = [
  // Demo Buyer / Offtaker
  {
    id: "demo-offtaker-001",
    name: "Sarah Johnson",
    email: "demo-buyer@agrobridge.app",
    password: "demo123",
    role: "offtaker",
    avatar: "SJ",
    region: "Lagos",
    phone: "+234 800 000 0001",
    offtakerType: "processor",
    companyName: "Golden Foods Nigeria Ltd",
    tenantType: "DEMO",
    description: "Demo Buyer account for showcasing offtaker portal features",
  },

  // Demo Ops Manager
  {
    id: "demo-ops-001",
    name: "Michael Adebayo",
    email: "demo-ops@agrobridge.app",
    password: "demo123",
    role: "ops_admin",
    avatar: "MA",
    region: "Kaduna",
    phone: "+234 800 000 0002",
    tenantType: "DEMO",
    description: "Demo Operations Manager for platform administration demos",
  },

  // Demo Field Agent
  {
    id: "demo-agent-001",
    name: "Blessing Okonkwo",
    email: "demo-agent@agrobridge.app",
    password: "demo123",
    role: "field_agent",
    avatar: "BO",
    region: "Zaria District",
    phone: "+234 800 000 0003",
    tenantType: "DEMO",
    description: "Demo Field Agent for farmer coordination demos",
  },

  // Demo Partner (Service Provider)
  {
    id: "demo-partner-001",
    name: "AgriPro Services",
    email: "demo-partner@agrobridge.app",
    password: "demo123",
    role: "partner",
    avatar: "AP",
    region: "Kaduna",
    phone: "+234 800 000 0004",
    partnerType: "mechanization",
    companyName: "AgriPro Mechanization Services",
    tenantType: "DEMO",
    description: "Demo Partner account for service provider demos",
  },

  // Demo Admin
  {
    id: "demo-admin-001",
    name: "Admin Demo",
    email: "demo-admin@agrobridge.app",
    password: "demo123",
    role: "super_admin",
    avatar: "AD",
    region: "Platform Wide",
    phone: "+234 800 000 0005",
    tenantType: "DEMO",
    description: "Demo Super Admin for full platform administration",
  },

  // Demo Farmer
  {
    id: "demo-farmer-001",
    name: "Musa Ibrahim",
    email: "demo-farmer@agrobridge.app",
    password: "demo123",
    role: "farmer",
    avatar: "MI",
    region: "Zaria, Kaduna",
    phone: "+234 800 000 0006",
    farmerId: "farmer-demo-001",
    farmSize: "8.5 hectares",
    crops: ["maize", "soybean"],
    tenantType: "DEMO",
    description: "Demo Farmer account for farmer portal demos",
  },

  // Demo Coordinator
  {
    id: "demo-coordinator-001",
    name: "Grace Adeleke",
    email: "demo-coordinator@agrobridge.app",
    password: "demo123",
    role: "state_coordinator",
    avatar: "GA",
    region: "Kaduna State",
    phone: "+234 800 000 0007",
    tenantType: "DEMO",
    description: "Demo State Coordinator for regional coordination demos",
  },

  // Universal demo account (cycles through roles)
  {
    id: "demo-universal-001",
    name: "Demo User",
    email: "demo@agrobridge.app",
    password: "password",
    role: "ops_admin",
    avatar: "DU",
    region: "All Regions",
    phone: "+234 800 000 0000",
    tenantType: "DEMO",
    description: "Universal demo account with ops admin access",
  },
]

// Helper to find demo user by email
export function findDemoUser(email: string): DemoUser | undefined {
  return DEMO_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase())
}

// Helper to check if an email is a demo account
export function isDemoEmail(email: string): boolean {
  return email.toLowerCase().includes("demo")
}

// Get all demo credentials for display
export function getDemoCredentials(): { role: string; email: string; password: string }[] {
  return DEMO_USERS.filter((u) => u.email !== "demo@agrobridge.app").map((u) => ({
    role: u.role.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    email: u.email,
    password: u.password,
  }))
}
