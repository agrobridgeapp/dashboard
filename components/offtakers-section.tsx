"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { TrendingUp, Shield, Truck, FileText, BarChart3 } from "lucide-react"

const benefits = [
  {
    icon: TrendingUp,
    title: "Know What's Coming",
    description: "See projected volumes by corridor and crop cycle before harvest begins",
  },
  {
    icon: Shield,
    title: "Quality You Can Trust",
    description: "Every harvest is graded and verified by our field agents",
  },
  {
    icon: Truck,
    title: "Delivery on Schedule",
    description: "We coordinate logistics so your supply arrives when you need it",
  },
  {
    icon: FileText,
    title: "Clear Agreements",
    description: "Digital contracts with transparent terms and real-time fulfillment tracking",
  },
  {
    icon: BarChart3,
    title: "Plan Ahead",
    description: "Forecast your supply needs and optimize procurement with real data",
  },
]

const buyerTypes = [
  {
    title: "Food Processors",
    description: "Get consistent volumes of graded produce for your processing operations",
    crops: ["Maize", "Soybean", "Rice", "Cassava"],
  },
  {
    title: "Exporters",
    description: "Source export-grade commodities with full traceability and documentation",
    crops: ["Sesame", "Cashew", "Cocoa", "Ginger"],
  },
  {
    title: "Aggregators",
    description: "Scale your sourcing with access to organized farmer corridors and coordinated logistics",
    crops: ["All Crops", "Multiple Corridors"],
  },
  {
    title: "Retailers",
    description: "Get fresh produce delivered to your distribution centers on time",
    crops: ["Vegetables", "Fruits", "Tubers"],
  },
]

export function OfftakersSection() {
  return (
    <section id="offtakers" className="py-20 md:py-32 bg-gradient-to-b from-secondary/20 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            For Buyers
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            Source Agricultural Products with Confidence
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Access organized farmer corridors producing quality crops. Get predictable supply, transparent pricing, and
            end-to-end visibility.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6 mb-16">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-background rounded-xl p-6 border border-border hover:border-primary/40 hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <benefit.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>

        {/* Buyer Types */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {buyerTypes.map((type, index) => (
            <div
              key={index}
              className="bg-background rounded-xl p-6 border border-border hover:border-primary/50 transition-all group"
            >
              <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                {type.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">{type.description}</p>
              <div className="flex flex-wrap gap-2">
                {type.crops.map((crop, cropIndex) => (
                  <span
                    key={cropIndex}
                    className="px-2 py-1 rounded-md bg-muted text-xs font-medium text-muted-foreground"
                  >
                    {crop}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* How It Works for Buyers */}
        <div className="bg-background rounded-2xl border border-border p-8 md:p-12 mb-16">
          <h3 className="text-2xl font-bold text-center mb-10">How Buying Works</h3>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Register", desc: "Create your buyer profile and specify your sourcing needs" },
              { step: "02", title: "Browse Supply", desc: "View available crops, corridors, and projected volumes" },
              { step: "03", title: "Contract", desc: "Lock in volumes, pricing, and delivery schedules" },
              { step: "04", title: "Receive", desc: "Get quality-verified produce delivered to your facility" },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-primary">{item.step}</span>
                </div>
                <h4 className="font-semibold text-foreground mb-2">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="relative rounded-2xl overflow-hidden shadow-xl">
          <Image src="/african-farmers-harvest-celebration.jpg" alt="Harvest" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 to-primary/75" />
          <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-white">
              <h3 className="text-2xl md:text-3xl font-bold mb-2 text-balance">Ready to Secure Reliable Supply?</h3>
              <p className="text-white/90 max-w-lg">
                Join food processors, exporters, and aggregators sourcing quality agricultural products through
                AgroBridge.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" variant="secondary" asChild className="shadow-xl">
                <Link href="/signup/buyer">Register as Buyer</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/40 text-white hover:bg-white/20 bg-white/10 backdrop-blur-sm"
                asChild
              >
                <Link href="/login">View Available Supply</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
