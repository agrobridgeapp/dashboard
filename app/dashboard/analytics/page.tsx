import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard"

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardSidebar />
      <div className="lg:pl-64">
        <DashboardHeader />
        <main className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Analytics & Reports</h1>
              <p className="text-muted-foreground">Track performance metrics and operational insights</p>
            </div>
          </div>
          <AnalyticsDashboard />
        </main>
      </div>
    </div>
  )
}
