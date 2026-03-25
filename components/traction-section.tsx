export function TractionSection() {
  return (
    <section id="traction" className="bg-[#f5f3ee] py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#1c1f23] text-center mb-16">
          Already in motion
        </h2>

        {/* Large metric display */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-12 sm:gap-20 mb-16">
          <div className="text-center">
            <p className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#0f3d2e]">
              5,000+
            </p>
            <p className="text-base text-[#6b7280] mt-2">MT coordinated</p>
          </div>
          <div className="hidden sm:block w-px h-20 bg-[#c8cdc8]" />
          <div className="text-center">
            <p className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#0f3d2e]">
              10,000+
            </p>
            <p className="text-base text-[#6b7280] mt-2">MT weekly demand</p>
          </div>
        </div>

        <div className="text-center max-w-xl mx-auto">
          <p className="text-lg text-[#6b7280] mb-2">
            Demand is not the problem. Execution is.
          </p>
          <p className="text-xl font-semibold text-[#1c1f23]">
            AgroBridge closes that gap.
          </p>
        </div>
      </div>
    </section>
  )
}
