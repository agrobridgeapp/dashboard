const comparisonItems = [
  { traditional: "Reactive sourcing", agrobridge: "Planned supply" },
  { traditional: "Fragmented network", agrobridge: "Coordinated system" },
  { traditional: "Low visibility", agrobridge: "Full visibility" },
  { traditional: "Inconsistent delivery", agrobridge: "Predictable delivery" },
]

export function ComparisonSection() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#1c1f23] text-center mb-16">
          A better way to source supply
        </h2>

        {/* Comparison Table */}
        <div className="bg-white rounded-xl border border-[#c8cdc8]/50 overflow-hidden mb-12">
          {/* Header */}
          <div className="grid grid-cols-2 bg-[#1c1f23]">
            <div className="p-4 text-white font-medium text-center">
              Traditional
            </div>
            <div className="p-4 text-white font-medium text-center border-l border-white/20">
              AgroBridge
            </div>
          </div>

          {/* Rows */}
          {comparisonItems.map((item, index) => (
            <div
              key={index}
              className={`grid grid-cols-2 ${index !== comparisonItems.length - 1 ? "border-b border-[#c8cdc8]/30" : ""}`}
            >
              <div className="p-4 text-[#6b7280] text-center">
                {item.traditional}
              </div>
              <div className="p-4 text-[#0f3d2e] font-medium text-center border-l border-[#c8cdc8]/30">
                {item.agrobridge}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-lg text-[#6b7280]">
            Traders move crops.
          </p>
          <p className="text-xl font-semibold text-[#1c1f23]">
            AgroBridge <span className="text-[#0f3d2e]">coordinates supply</span>.
          </p>
        </div>
      </div>
    </section>
  )
}
