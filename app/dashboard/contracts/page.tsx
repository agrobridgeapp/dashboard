import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { ContractsOverview } from "@/components/contracts/contracts-overview"

export default function ContractsPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardSidebar />
      <div className="lg:pl-64">
        <DashboardHeader />
        <main className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Contract Management</h1>
              <p className="text-muted-foreground">Track offtake agreements and fulfilment progress</p>
            </div>
          </div>
          <ContractsOverview />
        </main>
      </div>
    </div>
  )
}
