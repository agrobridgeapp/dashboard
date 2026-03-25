const buyers = [
  "Food processors",
  "Exporters",
  "Feed mills",
]

export function WhoThisIsForSection() {
  return (
    <section id="for" className="bg-[#f5f3ee] py-20 lg:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#1c1f23] text-center mb-12">
          Built for institutional buyers
        </h2>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {buyers.map((buyer) => (
            <div
              key={buyer}
              className="px-6 py-3 bg-white rounded-lg border border-[#c8cdc8]/30 shadow-sm"
            >
              <p className="text-lg font-medium text-[#1c1f23]">{buyer}</p>
            </div>
          ))}
        </div>

        <p className="text-lg text-[#6b7280] text-center">
          If supply reliability matters, <span className="font-medium text-[#1c1f23]">this is for you</span>.
        </p>
      </div>
    </section>
  )
}
