"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function HeroB2B() {
  return (
    <section className="relative min-h-[90vh] flex items-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/grain-warehouse-with-trucks-loading-agricultural-c.jpg"
          alt="Agricultural supply coordination"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f3d2e]/95 via-[#0f3d2e]/85 to-[#0f3d2e]/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="max-w-2xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6">
            Reliable crop supply for institutional buyers
          </h1>
          
          <p className="text-lg sm:text-xl text-white/80 mb-4 leading-relaxed">
            Processors and exporters run below capacity because supply is unreliable.
          </p>
          
          <p className="text-lg sm:text-xl text-white font-semibold mb-4">
            AgroBridge fixes that.
          </p>
          
          <p className="text-base sm:text-lg text-white/70 mb-8 leading-relaxed">
            We coordinate sourcing, aggregation, and logistics — so you get consistent delivery.
          </p>

          {/* Metrics */}
          <div className="flex flex-wrap gap-10 mb-10">
            <div>
              <p className="text-4xl sm:text-5xl font-bold text-white">5,000+</p>
              <p className="text-sm text-white/60">MT coordinated</p>
            </div>
            <div>
              <p className="text-4xl sm:text-5xl font-bold text-white">10,000+</p>
              <p className="text-sm text-white/60">MT weekly buyer demand</p>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              size="lg"
              asChild
              className="bg-white text-[#0f3d2e] hover:bg-white/90 px-6 h-12 text-base font-semibold rounded-lg group"
            >
              <Link href="#contact">
                Discuss Your Supply Needs
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white/30 text-white hover:bg-white/10 px-6 h-12 text-base font-medium rounded-lg"
            >
              <Link href="#contact">
                Start a Pilot
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Floating Stats Card - Desktop only */}
      <div className="hidden lg:block absolute right-8 xl:right-16 bottom-16 z-10">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 w-72">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-white/80 font-medium">Live Coordination</span>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-white/60">Maize - Kaduna</span>
                <span className="text-white font-medium">850 MT</span>
              </div>
              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full" style={{ width: "75%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-white/60">Sorghum - Kano</span>
                <span className="text-white font-medium">420 MT</span>
              </div>
              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full" style={{ width: "60%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-white/60">Soybeans - Zaria</span>
                <span className="text-white font-medium">280 MT</span>
              </div>
              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full" style={{ width: "45%" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
