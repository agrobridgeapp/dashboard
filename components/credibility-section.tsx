import { MapPin, Rocket, Shield } from "lucide-react"

const credibilityPoints = [
  {
    icon: Rocket,
    title: "Start Small",
    description:
      "We don't start with big promises. Begin with a focused pilot—one crop, one corridor, one or two deliveries.",
  },
  {
    icon: Shield,
    title: "Prove Execution",
    description: "Execution comes first. We demonstrate reliability before asking you to scale.",
  },
  {
    icon: MapPin,
    title: "Scale Confidently",
    description: "After successful pilots, expand across corridors with a proven execution partner.",
  },
]

export function CredibilitySection() {
  return (
    <section className="py-16 sm:py-20 lg:py-28 bg-neutral-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <p className="text-xs sm:text-sm font-semibold text-primary uppercase tracking-wider mb-2 sm:mb-3">
            Our Approach
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 mb-4 sm:mb-6 leading-tight">
            Start Small. Prove Execution. Scale Confidently.
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-neutral-600 leading-relaxed px-2">
            We focus on what moves trucks, containers, and invoices—not hype. AgroBridge is built for Nigerian and
            regional markets, for real operational constraints.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {credibilityPoints.map((point, index) => (
            <div
              key={index}
              className="text-center p-5 sm:p-6 lg:p-8 bg-white rounded-xl border border-neutral-200 shadow-sm"
            >
              <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <point.icon className="h-5 w-5 sm:h-7 sm:w-7 text-primary" />
              </div>
              <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-neutral-900 mb-2 sm:mb-3">
                {point.title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">{point.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
