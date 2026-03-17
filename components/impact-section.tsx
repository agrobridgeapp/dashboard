import { Target, TrendingUp } from "lucide-react"

const impacts = [
  {
    icon: Target,
    title: "Food Security",
    description: "Organizing efficient production to improve regional food security and market access",
  },
  {
    icon: TrendingUp,
    title: "Economic Growth",
    description: "Creating sustainable livelihoods for farmers, partners, and rural communities",
  },
]

export function ImpactSection() {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {impacts.map((impact) => (
            <div key={impact.title} className="text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <impact.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-foreground mb-1 sm:mb-2">{impact.title}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed px-2">{impact.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 sm:mt-12 text-center max-w-3xl mx-auto px-2">
          <p className="text-xs sm:text-sm text-muted-foreground">
            Aligned with UN SDG 1 (No Poverty), SDG 2 (Zero Hunger), SDG 8 (Decent Work), and SDG 9 (Industry &
            Innovation)
          </p>
        </div>
      </div>
    </section>
  )
}
