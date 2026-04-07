import { Layers, Scale, Clock } from "lucide-react"

const problems = [
  {
    icon: Layers,
    title: "Fragmented supply",
    description: "Thousands of small producers, no coordination",
  },
  {
    icon: Scale,
    title: "Inconsistent quality",
    description: "Every batch is different",
  },
  {
    icon: Clock,
    title: "Unreliable delivery",
    description: "Timelines constantly shift",
  },
]

export function BuyerProblemSection() {
  return (
    <section id="problem" className="bg-white py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#1c1f23] text-center mb-16">
          Sourcing crops is still broken
        </h2>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 mb-16">
          {problems.map((problem) => (
            <div key={problem.title} className="text-center">
              <div className="w-12 h-12 rounded-xl bg-[#f5f3ee] flex items-center justify-center mx-auto mb-4">
                <problem.icon className="h-6 w-6 text-[#0f3d2e]" />
              </div>
              <h3 className="text-lg font-semibold text-[#1c1f23] mb-2">
                {problem.title}
              </h3>
              <p className="text-[#6b7280]">
                {problem.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-lg text-[#6b7280] mb-2">
            This is not a production problem.
          </p>
          <p className="text-xl font-semibold text-[#1c1f23]">
            {"It's an execution problem."}
          </p>
        </div>
      </div>
    </section>
  )
}
