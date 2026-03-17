import { ClipboardList, Settings, Eye, RefreshCw } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: ClipboardList,
    title: "Buyer Demand",
    description:
      "Buyers share crop requirements, volumes, timelines, and quality specifications. We understand exactly what you need before coordinating supply.",
    image: "/screenshot-planning-interest-form.png",
  },
  {
    number: "02",
    icon: Settings,
    title: "Coordinated Supply",
    description:
      "AgroBridge coordinates farmers, field teams, aggregation, and logistics across priority corridors. Every activity is planned and tracked.",
    image: "/screenshot-corridor-management.png",
  },
  {
    number: "03",
    icon: Eye,
    title: "Visibility & Execution",
    description:
      "Buyers get visibility into delivery status while AgroBridge manages execution behind the scenes. You see progress without managing the chaos.",
    image: "/screenshot-contracts-tracking.png",
  },
  {
    number: "04",
    icon: RefreshCw,
    title: "Delivery & Repeat",
    description:
      "Successful deliveries turn into repeat trade and scalable supply corridors. Start with a pilot, prove execution, then scale confidently.",
    image: "/screenshot-deliveries-confirmation.png",
  },
]

export function HowItWorksSection() {
  return (
    <section id="approach" className="py-16 sm:py-20 lg:py-28 bg-neutral-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-10 sm:mb-16">
          <p className="text-xs sm:text-sm font-semibold text-primary uppercase tracking-wider mb-2 sm:mb-3">
            How It Works
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 mb-4 sm:mb-6 leading-tight">
            AgroBridge Is Your Execution Partner
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-neutral-600 leading-relaxed">
            We act as the coordination layer between farmers and buyers. You deal with one accountable partner, not
            dozens of moving parts.
          </p>
        </div>

        <div className="space-y-10 sm:space-y-16 lg:space-y-24">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex flex-col ${index % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"} gap-6 sm:gap-8 lg:gap-16 items-center`}
            >
              {/* Content */}
              <div className="flex-1 w-full">
                <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4 lg:mb-6">
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary/20">{step.number}</span>
                  <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <step.icon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-neutral-900 mb-2 sm:mb-3 lg:mb-4">
                  {step.title}
                </h3>
                <p className="text-sm sm:text-base lg:text-lg text-neutral-600 leading-relaxed">{step.description}</p>
              </div>

              {/* Screenshot - Updated styling for product screenshots with subtle shadow and border */}
              <div className="flex-1 w-full">
                <div className="aspect-[3/2] rounded-xl lg:rounded-2xl overflow-hidden bg-neutral-100 shadow-xl border border-neutral-200/50">
                  <img
                    src={step.image || "/placeholder.svg"}
                    alt={`${step.title} - AgroBridge product interface`}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
