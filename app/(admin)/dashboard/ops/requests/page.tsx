"use client"

import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { OpsServiceRequestsTable } from "@/components/dashboard/ops/ops-service-requests-table"

export default function OpsRequestsPage() {
  return (
    <DashboardLayout allowedRoles={["ops_admin"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Service Requests</h1>
          <p className="text-muted-foreground">Manage and track all service requests across corridors</p>
        </div>
        <OpsServiceRequestsTable />
      </div>
    </DashboardLayout>
  )
}
