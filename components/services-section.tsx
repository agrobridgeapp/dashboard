"use client"

import { useState } from "react"
import { Sprout, Droplets, Bug, Truck, Warehouse, CreditCard, ChevronRight } from "lucide-react"
import Image from "next/image"

const services = [
  {
    icon: Sprout,
    title: "Land Preparation",
    description:
      "Quality land prep is where good yields begin. We connect you to trusted service providers for tilling, plowing, and getting your soil ready.",
    features: ["Tractor Services", "Soil Testing", "Land Leveling"],
    image: "/african-land-preparation-tractor-field.jpg",
  },
  {
    icon: Droplets,
    title: "Certified Inputs",
    description:
      "The right seeds and fertilizers make all the difference. We source quality inputs and deliver them to your farm at the right time.",
    features: ["Quality Seeds", "Fertilizers", "Crop Protection"],
    image: "/african-farmer-receiving-seeds-fertilizer.jpg",
  },
  {
    icon: Bug,
    title: "Farming Advice",
    description:
      "Our agronomists visit your farm, spot problems early, and give you practical advice on pest control, disease management, and best practices.",
    features: ["Pest Management", "Disease Prevention", "Field Visits"],
    image: "/african-agronomist-advising-farmer-field.jpg",
  },
  {
    icon: Warehouse,
    title: "Harvest & Grading",
    description:
      "When it's time to harvest, we coordinate mechanized services and grade your produce to get you the best prices.",
    features: ["Harvest Machines", "Quality Grading", "Storage Options"],
    image: "/african-farmers-harvesting-crops-together.jpg",
  },
  {
    icon: Truck,
    title: "Market Connection",
    description:
      "You know who's buying before you plant. We link you directly to processors, exporters, and aggregators with transparent pricing.",
    features: ["Pre-contracted Sales", "Fair Pricing", "Buyer Network"],
    image: "/african-market-produce-trading.jpg",
  },
  {
    icon: CreditCard,
    title: "Farm Financing",
    description:
      "Get access to credit for inputs and services, then pay back at harvest. Insurance options protect you from unforeseen losses.",
    features: ["Input Credit", "Crop Insurance", "Pay-at-Harvest"],
    image: "/african-farmer-mobile-payment-banking.jpg",
  },
]

export function ServicesSection() {
  const [activeService, setActiveService] = useState(0)

  return (
    <section id="services" className="py-12 sm:py-16 md:py-24 lg:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <p className="text-primary font-semibold mb-2 sm:mb-3 text-xs sm:text-sm uppercase tracking-wider">
            Our Services
          </p>
          <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4 text-balance">
            Everything Your Farm Needs
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base lg:text-lg">
            From land prep to market day, we coordinate every service so you can focus on farming.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12">
          {/* Mobile: Image shows at top */}
          <div className="lg:hidden">
            <div className="relative aspect-[16/10] rounded-xl overflow-hidden shadow-lg mb-4">
              <Image
                src={services[activeService].image || "/placeholder.svg"}
                alt={services[activeService].title}
                fill
                className="object-cover transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-lg font-bold text-white mb-1">{services[activeService].title}</h3>
                <p className="text-sm text-white/80 line-clamp-2">{services[activeService].description}</p>
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
              {services[activeService].features.map((feature) => (
                <span
                  key={feature}
                  className="flex-shrink-0 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-medium whitespace-nowrap"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>

          {/* Service Tabs */}
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0 lg:space-y-3">
            {services.map((service, index) => (
              <button
                key={service.title}
                onClick={() => setActiveService(index)}
                className={`flex-shrink-0 lg:flex-shrink lg:w-full text-left p-3 sm:p-4 lg:p-6 rounded-xl transition-all duration-300 flex items-center gap-3 lg:gap-4 min-w-[140px] lg:min-w-0 ${
                  activeService === index
                    ? "bg-primary text-white shadow-lg"
                    : "bg-secondary/50 hover:bg-secondary text-foreground"
                }`}
              >
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center shrink-0 ${
                    activeService === index ? "bg-white/20" : "bg-primary/10"
                  }`}
                >
                  <service.icon
                    className={`h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 ${activeService === index ? "text-white" : "text-primary"}`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm sm:text-base lg:text-lg">{service.title}</h3>
                  <p
                    className={`text-sm line-clamp-1 ${
                      activeService === index ? "text-white/80" : "text-muted-foreground"
                    } hidden lg:block`}
                  >
                    {service.description}
                  </p>
                </div>
                <ChevronRight
                  className={`h-4 w-4 lg:h-5 lg:w-5 shrink-0 transition-transform hidden lg:block ${
                    activeService === index ? "rotate-90 text-white" : "text-muted-foreground"
                  }`}
                />
              </button>
            ))}
          </div>

          {/* Desktop: Image and details */}
          <div className="hidden lg:block lg:sticky lg:top-24 h-fit">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl mb-6">
              <Image
                src={services[activeService].image || "/placeholder.svg"}
                alt={services[activeService].title}
                fill
                className="object-cover transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-bold text-white mb-2">{services[activeService].title}</h3>
                <p className="text-base text-white/80 line-clamp-3">{services[activeService].description}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {services[activeService].features.map((feature) => (
                <span key={feature} className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
