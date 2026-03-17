import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <DashboardLayout role="super_admin">
      <div className="space-y-6">
        <div>
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-5 w-96 mt-2" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
        <Skeleton className="h-96" />
      </div>
    </DashboardLayout>
  )
}
