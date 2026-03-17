import { Target, AlertCircle, Users, TrendingUp } from "lucide-react"

const differentiators = [
  {
    icon: Target,
    title: "Predictable Supply",
    description: "No more guesswork. Know what's coming, when, and from where.",
  },
  {
    icon: AlertCircle,
    title: "Reduced Sourcing Risk",
    description: "Early visibility into delays or issues before they become problems.",
  },
  {
    icon: Users,
    title: "One Accountable Partner",
    description: "Deal with AgroBridge, not dozens of farmers, agents, and logistics providers.",
  },
  {
    icon: TrendingUp,
    title: "Easier Scale After Pilots",
    description: "Start small, prove execution, then expand confidently across corridors.",
  },
]

export function WhyDifferentSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <p className="text-xs sm:text-sm font-semibold text-primary uppercase tracking-wider mb-2 sm:mb-3">
            Why Buyers Choose AgroBridge
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 mb-4 sm:mb-6 leading-tight">
            What Buyers Get
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-neutral-600 leading-relaxed px-2">
            We're not a marketplace or a trading platform. We're your execution partner that makes supply predictable.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {differentiators.map((item, index) => (
            <div
              key={index}
              className="flex gap-3 sm:gap-5 p-4 sm:p-6 lg:p-8 bg-neutral-50 rounded-xl border border-neutral-100"
            >
              <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <item.icon className="h-5 w-5 sm:h-7 sm:w-7 text-primary" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-neutral-900 mb-1 sm:mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
