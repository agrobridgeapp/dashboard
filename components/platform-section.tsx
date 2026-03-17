import { Users, Cog, Leaf, Truck } from "lucide-react"
import Image from "next/image"

export function PlatformSection() {
  const steps = [
    {
      icon: Users,
      number: "01",
      title: "We Meet You Where You Are",
      description:
        "Our field agents come to your farm. We map your land, understand your needs, and bring you into a corridor of farmers working together.",
      image: "/african-farmer-registering-mobile-phone-field.jpg",
    },
    {
      icon: Leaf,
      number: "02",
      title: "We Plan Your Season Together",
      description:
        "What crop makes sense? When to plant? What services will you need? We help you plan every step, with realistic expectations and clear timelines.",
      image: "/african-agronomist-planning-crops-map.jpg",
    },
    {
      icon: Cog,
      number: "03",
      title: "We Coordinate Everything",
      description:
        "No more chasing tractors or waiting for fertilizer. Every service is scheduled, tracked, and delivered when you need it—all managed through one platform.",
      image: "/african-tractor-operator-plowing-field.jpg",
    },
    {
      icon: Truck,
      number: "04",
      title: "We Connect You to Buyers",
      description:
        "Before you plant, you know who's buying. Fair prices, clear terms, and guaranteed purchase agreements—so you farm with confidence.",
      image: "/african-farmers-loading-trucks-harvest.jpg",
    },
  ]

  return (
    <section
      id="how-it-works"
      className="py-24 sm:py-32 lg:py-40 bg-gradient-to-b from-secondary/30 via-background to-background"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24">
          <div className="inline-block px-4 py-1.5 bg-primary/10 rounded-full mb-6">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">How We Work</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6">
            From Your First Seed to Market Day
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg sm:text-xl">
            We walk with you through every season, coordinating services and connecting you to markets.
          </p>
        </div>

        <div className="space-y-32">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className={`flex flex-col ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} gap-12 lg:gap-20 items-center`}
            >
              <div className="flex-1 w-full">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-2xl shadow-primary/30">
                    <step.icon className="h-10 w-10 text-white" />
                  </div>
                  <span className="text-7xl sm:text-8xl font-bold text-primary/10">{step.number}</span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-bold text-foreground mb-5">{step.title}</h3>
                <p className="text-muted-foreground text-lg sm:text-xl leading-relaxed">{step.description}</p>
              </div>
              <div className="flex-1 w-full">
                <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl ring-1 ring-border hover:ring-2 hover:ring-primary/30 transition-all group">
                  <Image
                    src={step.image || "/placeholder.svg"}
                    alt={step.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Overlay gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
