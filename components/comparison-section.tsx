import { ArrowRight } from "lucide-react"

const comparisonItems = [
  {
    feature: "Visibility",
    traditional: "At delivery",
    agrobridge: "6 months ahead",
  },
  {
    feature: "Default Rate",
    traditional: "25-40%",
    agrobridge: "< 8%",
  },
  {
    feature: "Quality Variance",
    traditional: "Unpredictable",
    agrobridge: "92% Grade A/B",
  },
  {
    feature: "Coordination",
    traditional: "100+ calls/week",
    agrobridge: "1 dashboard",
  },
  {
    feature: "Planning",
    traditional: "Reactive",
    agrobridge: "Predictive",
  },
  {
    feature: "Supplier Relations",
    traditional: "Fragmented",
    agrobridge: "Single partner",
  },
]

export function ComparisonSection() {
  return (
    <section className="py-16 sm:py-24 bg-[#f5f5f0]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#1a3a2f] mb-3">The Difference</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
            What You Get With AgroBridge
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Compared to traditional procurement
          </p>
        </div>

        {/* Main Comparison Card - Dark Green Gradient */}
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl overflow-hidden shadow-xl">
            {/* Green Gradient Header/Body */}
            <div className="bg-gradient-to-br from-[#1a3a2f] via-[#2d5a47] to-[#1a3a2f] p-6 sm:p-8 md:p-10">
              <div className="space-y-4 sm:space-y-6">
                {comparisonItems.map((item, index) => (
                  <div
                    key={item.feature}
                    className={`${index !== comparisonItems.length - 1 ? "pb-4 sm:pb-6 border-b border-white/10" : ""}`}
                  >
                    {/* Mobile Layout - Stacked */}
                    <div className="flex flex-col gap-2 sm:hidden">
                      <span className="text-white/80 font-medium text-sm">{item.feature}</span>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-white/40 line-through text-sm">{item.traditional}</span>
                        <ArrowRight className="h-3 w-3 text-white/60 flex-shrink-0" />
                        <span className="text-white font-semibold text-sm">{item.agrobridge}</span>
                      </div>
                    </div>

                    {/* Desktop Layout - Horizontal */}
                    <div className="hidden sm:flex items-center justify-between gap-4">
                      <div className="w-32 sm:w-40 flex-shrink-0">
                        <span className="text-white/80 font-medium text-sm sm:text-base">{item.feature}</span>
                      </div>
                      <div className="flex items-center gap-3 sm:gap-4 flex-1 justify-end">
                        <span className="text-white/40 line-through text-sm sm:text-base">{item.traditional}</span>
                        <ArrowRight className="h-4 w-4 text-white/60 flex-shrink-0" />
                        <span className="text-white font-semibold text-sm sm:text-base">{item.agrobridge}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Tagline */}
            <div className="bg-[#0f2620] py-4 px-6 sm:px-8 text-center">
              <p className="text-white/70 text-sm italic">"Plan procurement with confidence, not guesswork"</p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <a
            href="#contact"
            className="inline-flex items-center justify-center rounded-md bg-[#1a3a2f] px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-medium text-white shadow-lg transition-all hover:bg-[#2d5a47] hover:shadow-xl w-full sm:w-auto max-w-xs sm:max-w-none"
          >
            Start a Conversation
          </a>
        </div>
      </div>
    </section>
  )
}
