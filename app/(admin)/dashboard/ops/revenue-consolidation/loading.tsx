import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-9 w-96" />
        <Skeleton className="h-5 w-[500px] mt-2" />
      </div>

      <div className="flex gap-4">
        <Skeleton className="h-20 w-64" />
        <Skeleton className="h-20 w-64" />
      </div>

      <Skeleton className="h-[400px] w-full" />
      <Skeleton className="h-[300px] w-full" />
      <Skeleton className="h-[280px] w-full" />
    </div>
  )
}
