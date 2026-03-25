const benefits = [
  "factories run at full capacity",
  "procurement becomes easier",
  "costs stabilize",
  "growth becomes possible",
]

export function WhyThisMattersSection() {
  return (
    <section id="why" className="bg-white py-20 lg:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#1c1f23] text-center mb-16">
          When supply becomes predictable
        </h2>

        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="p-5 bg-[#f5f3ee] rounded-xl"
            >
              <p className="text-lg text-[#1c1f23]">{benefit}</p>
            </div>
          ))}
        </div>

        <p className="text-xl font-semibold text-[#1c1f23] text-center">
          This is agricultural infrastructure.
        </p>
      </div>
    </section>
  )
}
