import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="p-4 space-y-4">
      <div>
        <Skeleton className="h-6 w-32 mb-1" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="grid grid-cols-4 gap-2">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-16" />
        ))}
      </div>
      <Skeleton className="h-10 w-full" />
      <div className="flex gap-2">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-8 w-20" />
        ))}
      </div>
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-36" />
        ))}
      </div>
    </div>
  )
}
