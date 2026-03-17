import { Factory, Ship, Warehouse, Building2, Users } from "lucide-react"

const partners = [
  {
    icon: Factory,
    title: "Processors & FMCGs",
    description:
      "Source raw materials with predictable quality, volume, and timelines — without managing dozens of suppliers.",
  },
  {
    icon: Ship,
    title: "Export Buyers & Traders",
    description: "Execute exports with confidence through on-ground coordination, aggregation, and delivery support.",
  },
  {
    icon: Warehouse,
    title: "SME Buyers & Aggregators",
    description: "Access structured supply and execution support without building a large operations team.",
  },
  {
    icon: Building2,
    title: "Anchor Buyers",
    description: "Secure long-term supply corridors through coordinated farmer networks and repeatable execution.",
  },
]

export function WhoWeWorkWithSection() {
  return (
    <section id="partners" className="py-16 sm:py-20 lg:py-28 bg-neutral-900 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-10 sm:mb-16">
          <p className="text-xs sm:text-sm font-semibold text-primary uppercase tracking-wider mb-2 sm:mb-3">
            Who We Work With
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            Built for Buyers Who Need Reliability
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-neutral-400 leading-relaxed">
            AgroBridge partners with organizations that need predictable, coordinated agricultural supply at scale.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-10 sm:mb-16">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="p-4 sm:p-5 lg:p-6 bg-neutral-800/50 rounded-lg sm:rounded-xl border border-neutral-700 hover:border-neutral-600 transition-colors"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-3 sm:mb-5">
                <partner.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-white mb-1 sm:mb-2">{partner.title}</h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed hidden sm:block">
                {partner.description}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-start gap-3 sm:gap-4 p-4 sm:p-6 bg-neutral-800/30 rounded-lg sm:rounded-xl border border-neutral-700">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-semibold text-white mb-1">
              Supporting Farmers Through Structured Demand
            </h4>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              AgroBridge helps farmers access predictable demand from buyers, coordinated support through field agents,
              and clear quality and delivery expectations. This creates more stable income and repeat market access.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
