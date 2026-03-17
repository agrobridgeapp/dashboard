"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

const slides = [
  {
    image: "/african-farmer-smiling-in-maize-field-sunrise.jpg",
    title: "Farming Together, Growing Together",
    subtitle: "Connecting African farmers to the resources and markets they deserve",
  },
  {
    image: "/african-woman-farmer-inspecting-crops-tablet.jpg",
    title: "Your Farm, Our Support",
    subtitle: "Every service you need, coordinated from planting to harvest",
  },
  {
    image: "/african-farmers-group-harvesting-together.jpg",
    title: "Building Stronger Corridors",
    subtitle: "When farmers unite, prosperity follows",
  },
]

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-black to-primary/5">
      {/* Background Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${slide.image})` }} />
          <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/60 to-primary/30" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-full text-white text-sm font-medium mb-6 animate-fade-in">
              <Sparkles className="h-4 w-4" />
              <span>1,228+ farmers already growing with us</span>
            </div>

            {/* Animated subtitle */}
            <div className="overflow-hidden mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <p className="text-primary-foreground/80 font-medium text-lg sm:text-xl tracking-wide">
                {slides[currentSlide].subtitle}
              </p>
            </div>

            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6 sm:mb-8 animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              {slides[currentSlide].title}
            </h1>

            <p
              className="text-lg sm:text-xl text-white/90 mb-8 sm:mb-10 max-w-2xl leading-relaxed animate-fade-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              We organize farmers into corridors, coordinate every service they need, and connect them directly to
              buyers. From one hectare to thousands—everyone grows together.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 mb-12 animate-fade-in-up"
              style={{ animationDelay: "0.4s" }}
            >
              <Button
                size="lg"
                asChild
                className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg font-semibold shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all group"
              >
                <Link href="/signup/farmer">
                  Join as Farmer
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-2 border-white/50 text-white hover:bg-white hover:text-primary px-8 py-6 text-lg font-semibold bg-white/10 backdrop-blur-sm transition-all"
              >
                <Link href="/signup/partner">Service Partner</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-2 border-white/50 text-white hover:bg-white hover:text-primary px-8 py-6 text-lg font-semibold bg-white/10 backdrop-blur-sm transition-all"
              >
                <Link href="/signup/agent">Field Agent</Link>
              </Button>
            </div>

            <div className="flex gap-3 animate-fade-in" style={{ animationDelay: "0.5s" }}>
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentSlide ? "w-12 bg-primary" : "w-8 bg-white/40 hover:bg-white/60"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20 pb-8 sm:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="flex flex-wrap gap-3 justify-center sm:justify-start animate-fade-in"
            style={{ animationDelay: "0.6s" }}
          >
            {[
              { label: "Land Prep", href: "#services" },
              { label: "Quality Inputs", href: "#services" },
              { label: "Expert Advice", href: "#services" },
              { label: "Harvest Support", href: "#services" },
              { label: "Market Access", href: "#services" },
              { label: "Farm Finance", href: "#services" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="px-5 py-2.5 bg-white/15 backdrop-blur-lg border border-white/30 rounded-full text-white text-sm font-medium hover:bg-white/25 hover:border-white/50 hover:scale-105 transition-all duration-200"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
