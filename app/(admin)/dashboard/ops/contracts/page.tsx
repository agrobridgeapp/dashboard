"use client"

import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { ContractsOverview } from "@/components/contracts/contracts-overview"

export default function OpsContractsPage() {
  return (
    <DashboardLayout allowedRoles={["ops_admin"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Contract Management</h1>
          <p className="text-muted-foreground">
            Manage offtake contracts, track deliveries, and monitor yield fulfilment
          </p>
        </div>
        <ContractsOverview />
      </div>
    </DashboardLayout>
  )
}
