import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { StatsOverview } from "@/components/dashboard/stats-overview"
import { ServiceRequestsTable } from "@/components/dashboard/service-requests-table"
import { ActiveJobsMap } from "@/components/dashboard/active-jobs-map"
import { RecentActivity } from "@/components/dashboard/recent-activity"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardSidebar />
      <div className="lg:pl-64">
        <DashboardHeader />
        <main className="p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Operations Dashboard</h1>
            <p className="text-muted-foreground">Manage service requests and monitor field operations</p>
          </div>

          <StatsOverview />

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ServiceRequestsTable />
            </div>
            <div className="space-y-6">
              <ActiveJobsMap />
              <RecentActivity />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
