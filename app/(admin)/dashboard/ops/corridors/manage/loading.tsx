import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="p-6 space-y-6">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-96" />
      <div className="grid lg:grid-cols-3 gap-6">
        <Skeleton className="h-96" />
        <div className="lg:col-span-2">
          <Skeleton className="h-96" />
        </div>
      </div>
    </div>
  )
}
