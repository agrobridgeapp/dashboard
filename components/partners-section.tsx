import { Button } from "@/components/ui/button"
import { Tractor, Package, Truck, Warehouse, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function PartnersSection() {
  const partnerTypes = [
    {
      icon: Tractor,
      title: "Machinery Providers",
      description: "Equipment operators for land preparation, planting, and harvesting operations.",
      count: "50+",
    },
    {
      icon: Package,
      title: "Input Suppliers",
      description: "Verified suppliers of seeds, fertilizers, and crop protection products.",
      count: "30+",
    },
    {
      icon: Truck,
      title: "Logistics Partners",
      description: "Transport services for inputs delivery and harvest collection.",
      count: "25+",
    },
    {
      icon: Warehouse,
      title: "Buyers",
      description: "Anchor buyers committed to purchasing farmer produce at fair prices.",
      count: "5+",
    },
  ]

  const investors = [
    { name: "AgriVentures", logo: "/agriventures-investment-fund-logo.jpg" },
    { name: "GreenCapital", logo: "/green-capital-sustainable-fund-logo.jpg" },
    { name: "FarmFund", logo: "/farm-fund-agriculture-investment-logo.jpg" },
    { name: "AgroPartners", logo: "/agro-partners-venture-capital-logo.jpg" },
  ]

  return (
    <section id="partners" className="py-20 md:py-28 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Partner Types */}
        <div className="text-center mb-16">
          <p className="text-primary font-semibold mb-3">PARTNER NETWORK</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            Join Our Growing Ecosystem
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Service partners are the backbone of AgroBridge. Join our network to access consistent demand and
            streamlined operations.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {partnerTypes.map((partner) => (
            <div
              key={partner.title}
              className="bg-background rounded-2xl p-6 text-center hover:shadow-lg transition-shadow border border-border"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <partner.icon className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-primary mb-1">{partner.count}</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{partner.title}</h3>
              <p className="text-sm text-muted-foreground">{partner.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mb-8">
          <Button size="lg" asChild className="px-8">
            <Link href="/signup/partner">
              Become a Partner
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>

        {/* Investors Section */}
        <div className="mt-20 pt-16 border-t border-border">
          <div className="text-center mb-10">
            <p className="text-muted-foreground font-medium mb-2">BACKED BY</p>
            <h3 className="text-2xl font-bold text-foreground">Our Investors & Partners</h3>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60">
            {investors.map((investor) => (
              <div key={investor.name} className="grayscale hover:grayscale-0 transition-all">
                <Image
                  src={investor.logo || "/placeholder.svg"}
                  alt={investor.name}
                  width={120}
                  height={60}
                  className="h-12 w-auto"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
