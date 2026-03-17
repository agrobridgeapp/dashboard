import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex min-h-screen">
      <div className="hidden md:block w-64 border-r">
        <Skeleton className="h-full" />
      </div>
      <div className="flex-1 p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
        <Skeleton className="h-[500px] w-full" />
      </div>
    </div>
  )
}
