import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { PartnersDirectory } from "@/components/partners/partners-directory"

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardSidebar />
      <div className="lg:pl-64">
        <DashboardHeader />
        <main className="p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Partner Network</h1>
            <p className="text-muted-foreground">Manage service providers and buyers</p>
          </div>
          <PartnersDirectory />
        </main>
      </div>
    </div>
  )
}
