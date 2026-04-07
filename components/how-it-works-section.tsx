import { ClipboardList, Network, Activity, Truck } from "lucide-react"

const steps = [
  {
    number: "01",
    title: "Demand",
    description: "Define crop, volume, schedule",
    icon: ClipboardList,
  },
  {
    number: "02",
    title: "Coordination",
    description: "Supply activated across corridors",
    icon: Network,
  },
  {
    number: "03",
    title: "Tracking",
    description: "Execution monitored in real time",
    icon: Activity,
  },
  {
    number: "04",
    title: "Delivery",
    description: "Reliable, repeatable supply",
    icon: Truck,
  },
]

export function HowItWorksSection() {
  return (
    <section id="approach" className="bg-white py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#1c1f23] text-center mb-16">
          How it works
        </h2>

        {/* Horizontal step flow with proper connectors */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 mb-16">
          {steps.map((step, index) => (
            <div key={step.number} className="relative flex flex-col items-center text-center">
              {/* Icon circle */}
              <div className="relative z-10 w-16 h-16 rounded-full bg-[#0f3d2e]/5 flex items-center justify-center mb-6">
                <step.icon className="w-7 h-7 text-[#0f3d2e]" />
              </div>
              
              {/* Connector line - appears after icon on desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[calc(50%+32px)] w-[calc(100%-64px)] h-px bg-[#e5e7eb]" />
              )}
              
              <span className="text-xs font-medium text-[#0f3d2e] tracking-wider uppercase mb-2">
                Step {step.number}
              </span>
              <h3 className="text-lg font-semibold text-[#1c1f23] mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-[#6b7280] max-w-[200px]">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <p className="text-lg text-[#6b7280] text-center">
          Then it repeats. <span className="font-semibold text-[#1c1f23]">Predictably.</span>
        </p>
      </div>
    </section>
  )
}
