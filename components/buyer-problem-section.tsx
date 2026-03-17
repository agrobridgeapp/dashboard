import { AlertTriangle, Eye, DollarSign, TrendingDown, Package } from "lucide-react"

const problems = [
  {
    icon: TrendingDown,
    title: "Fragmented Farmer Supply",
    description: "Production is scattered across thousands of smallholders with no coordination or aggregation.",
  },
  {
    icon: Package,
    title: "Inconsistent Quality",
    description: "Without standards enforcement at source, quality varies unpredictably across deliveries.",
  },
  {
    icon: AlertTriangle,
    title: "Missed Delivery Timelines",
    description: "Poor coordination between production and logistics leads to delayed or failed deliveries.",
  },
  {
    icon: DollarSign,
    title: "High Coordination Costs",
    description: "Managing dozens of suppliers, agents, and logistics partners is expensive and inefficient.",
  },
  {
    icon: Eye,
    title: "Poor Ground Visibility",
    description: "No insight into what's happening on farms until produce arrives—or doesn't.",
  },
]

export function BuyerProblemSection() {
  return (
    <section id="problem" className="py-20 lg:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12 sm:mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">The Problem</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 mb-4 sm:mb-6 leading-tight">
            Why Agricultural Sourcing Breaks Down
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 leading-relaxed">
            Most buyers struggle with the same challenges. As volumes increase, these problems compound—making reliable
            sourcing nearly impossible without the right infrastructure.
          </p>
        </div>

        {/* Problems Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="p-5 sm:p-6 lg:p-8 bg-neutral-50 rounded-lg sm:rounded-xl border border-neutral-100 hover:border-neutral-200 hover:shadow-sm transition-all"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg bg-red-50 flex items-center justify-center mb-4 sm:mb-5">
                <problem.icon className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-neutral-900 mb-2">{problem.title}</h3>
              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">{problem.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
