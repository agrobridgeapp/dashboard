import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"

export default function Loading() {
  return (
    <DashboardLayout role="super_admin">
      <div className="space-y-6">
        <div className="h-8 w-64 bg-muted animate-pulse rounded" />
        <div className="h-16 bg-muted animate-pulse rounded-lg" />
        <div className="h-96 bg-muted animate-pulse rounded-lg" />
      </div>
    </DashboardLayout>
  )
}
