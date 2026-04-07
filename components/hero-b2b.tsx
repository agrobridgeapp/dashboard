"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function HeroB2B() {
  return (
    <section className="relative min-h-[70vh] sm:min-h-[80vh] lg:min-h-[90vh] flex items-center overflow-hidden">
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
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-24 sm:py-28 sm:pt-32 lg:py-40">
        <div className="max-w-2xl">
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.15] sm:leading-[1.1] tracking-tight mb-4 sm:mb-6">
            Reliable crop supply for institutional buyers
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-white/80 mb-3 sm:mb-4 leading-relaxed">
            Processors and exporters run below capacity because supply is unreliable.
          </p>

          <p className="text-base sm:text-lg lg:text-xl text-white font-semibold mb-3 sm:mb-4">
            AgroBridge fixes that.
          </p>

          <p className="text-sm sm:text-base lg:text-lg text-white/70 mb-6 sm:mb-8 leading-relaxed">
            We coordinate sourcing, aggregation, and logistics — so you get consistent delivery.
          </p>

          {/* Metrics */}
          <div className="flex flex-wrap gap-8 sm:gap-10 mb-8 sm:mb-10">
            <div>
              <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">5,000+</p>
              <p className="text-xs sm:text-sm text-white/60">MT coordinated</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">10,000+</p>
              <p className="text-xs sm:text-sm text-white/60">MT weekly buyer demand</p>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button
              size="lg"
              asChild
              className="w-full sm:w-auto bg-white text-[#0f3d2e] hover:bg-white/90 px-6 sm:px-8 h-12 sm:h-14 text-sm sm:text-base font-semibold rounded-lg shadow-xl hover:shadow-2xl transition-all group"
            >
              <Link href="#contact">
                Discuss Your Supply Needs
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 px-6 sm:px-8 h-12 sm:h-14 text-sm sm:text-base font-medium rounded-lg bg-transparent"
            >
              <Link href="#contact">
                Start a Pilot
              </Link>
            </Button>
          </div>

          <p className="mt-4 sm:mt-6 text-xs sm:text-sm text-white/60">
            For processors, exporters, aggregators, and institutional buyers
          </p>
        </div>
      </div>

      {/* Floating Live Coordination Card — Desktop only */}
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

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-24 lg:h-32 bg-gradient-to-t from-white to-transparent z-10" />
    </section>
  )
}
