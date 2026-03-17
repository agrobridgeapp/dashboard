export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#1B5E3C] border-r-transparent mb-4" />
        <p className="text-neutral-600">Loading demo...</p>
      </div>
    </div>
  )
}
