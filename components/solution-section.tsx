import { Target, Users, Package, Truck } from "lucide-react"

const cards = [
  {
    icon: Target,
    title: "Demand planning",
  },
  {
    icon: Users,
    title: "Supply coordination",
  },
  {
    icon: Package,
    title: "Aggregation",
  },
  {
    icon: Truck,
    title: "Logistics execution",
  },
]

export function SolutionSection() {
  return (
    <section id="solution" className="bg-[#f5f3ee] py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#1c1f23] text-center mb-4">
          We make supply predictable
        </h2>
        
        <p className="text-lg text-[#6b7280] text-center mb-16 max-w-2xl mx-auto">
          AgroBridge coordinates everything required to fulfill buyer demand — end-to-end.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-white p-6 rounded-xl border border-[#c8cdc8]/30 shadow-sm"
            >
              <div className="w-10 h-10 rounded-lg bg-[#0f3d2e]/10 flex items-center justify-center mb-4">
                <card.icon className="h-5 w-5 text-[#0f3d2e]" />
              </div>
              <h3 className="text-base font-semibold text-[#1c1f23]">
                {card.title}
              </h3>
            </div>
          ))}
        </div>

        <p className="text-lg sm:text-xl font-medium text-[#1c1f23] text-center">
          You define demand. <span className="text-[#0f3d2e]">We handle execution.</span>
        </p>
      </div>
    </section>
  )
}
