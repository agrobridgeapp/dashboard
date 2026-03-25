import { X, Check } from "lucide-react"

export function ModelSection() {
  return (
    <section id="model" className="bg-[#f5f3ee] py-20 lg:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#1c1f23] mb-6">
          Supply corridors, not transactions
        </h2>
        
        <p className="text-lg text-[#6b7280] mb-8">
          Each buyer activates a structured supply corridor:
        </p>
        
        <div className="space-y-3 mb-12">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-[#0f3d2e]" />
            <p className="text-lg text-[#1c1f23]">demand is anchored</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-[#0f3d2e]" />
            <p className="text-lg text-[#1c1f23]">supply is organized</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-[#0f3d2e]" />
            <p className="text-lg text-[#1c1f23]">delivery is repeatable</p>
          </div>
        </div>

        {/* Contrast */}
        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          <div className="p-5 bg-white rounded-xl border border-red-200">
            <div className="flex items-center gap-3">
              <X className="h-5 w-5 text-red-500" />
              <span className="font-medium text-[#1c1f23]">One-off sourcing</span>
            </div>
          </div>
          <div className="p-5 bg-white rounded-xl border border-[#0f3d2e]/30">
            <div className="flex items-center gap-3">
              <Check className="h-5 w-5 text-[#0f3d2e]" />
              <span className="font-medium text-[#1c1f23]">Reliable supply systems</span>
            </div>
          </div>
        </div>

        <p className="text-lg text-[#1c1f23] font-medium text-center">
          Start small. Prove reliability. <span className="text-[#0f3d2e]">Scale supply.</span>
        </p>
      </div>
    </section>
  )
}
