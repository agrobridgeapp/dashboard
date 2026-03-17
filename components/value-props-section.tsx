import { Users, TrendingUp, Package, Shield } from "lucide-react"
import { Card } from "@/components/ui/card"

const valueProps = [
  {
    icon: Users,
    title: "For Farmers",
    tagline: "Your Success is Our Success",
    benefits: [
      "Access to quality inputs at fair prices",
      "Expert advice from agronomists throughout your season",
      "Guaranteed markets before you plant",
      "Transparent pricing and timely payments",
      "Join a community of farmers growing together",
    ],
  },
  {
    icon: Package,
    title: "For Service Partners",
    tagline: "Consistent Work, Fair Pay",
    benefits: [
      "Regular, predictable demand for your services",
      "Organized schedules across multiple farms",
      "On-time payment for completed work",
      "Access to a growing farmer network",
      "Technology support for service delivery",
    ],
  },
  {
    icon: TrendingUp,
    title: "For Buyers",
    tagline: "Quality You Can Count On",
    benefits: [
      "Consistent supply of quality produce",
      "Organized corridors for efficient collection",
      "Transparent tracking from farm to warehouse",
      "Reduced transaction costs",
      "Direct relationships with farmer groups",
    ],
  },
  {
    icon: Shield,
    title: "For Investors & Financiers",
    tagline: "Impact with Returns",
    benefits: [
      "Data-driven visibility into operations",
      "Reduced risk through corridor organization",
      "Verified farmer profiles and performance",
      "Transparent monitoring and reporting",
      "Contributing to food security and job creation",
    ],
  },
]

export function ValuePropsSection() {
  return (
    <section className="py-24 sm:py-32 lg:py-40 bg-gradient-to-b from-background to-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-block px-4 py-1.5 bg-primary/10 rounded-full mb-6">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Who We Serve</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6">
            Creating Value Across the Agricultural Ecosystem
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg sm:text-xl">
            We don't just support farmers—we enable everyone in the agriculture value chain to thrive together.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
          {valueProps.map((prop, index) => (
            <Card
              key={prop.title}
              className="group p-10 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 border-2 hover:border-primary/20 bg-card"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Decorative background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative">
                <div className="flex items-start gap-5 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shrink-0 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                    <prop.icon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">{prop.title}</h3>
                    <p className="text-primary font-semibold text-lg">{prop.tagline}</p>
                  </div>
                </div>
                <ul className="space-y-4">
                  {prop.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0 group-hover:scale-125 transition-transform" />
                      <span className="text-muted-foreground text-base">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
