import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { FarmersDirectory } from "@/components/farmers/farmers-directory"

export default function FarmersPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardSidebar />
      <div className="lg:pl-64">
        <DashboardHeader />
        <main className="p-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Farmer Directory</h1>
            <p className="text-muted-foreground">Manage registered farmers and their profiles</p>
          </div>
          <FarmersDirectory />
        </main>
      </div>
    </div>
  )
}
