import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { ServiceRequestDetail } from "@/components/dashboard/service-request-detail"

export default function RequestsPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardSidebar />
      <div className="lg:pl-64">
        <DashboardHeader />
        <main className="p-6">
          <ServiceRequestDetail />
        </main>
      </div>
    </div>
  )
}
