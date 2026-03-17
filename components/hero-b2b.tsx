"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, PlayCircle } from "lucide-react"
import Link from "next/link"

export function HeroB2B() {
  return (
    <section className="relative min-h-[70vh] sm:min-h-[80vh] lg:min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/aerial-view-of-organized-agricultural-farmland-wit.jpg')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/95 via-neutral-900/80 to-neutral-900/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-24 sm:py-28 sm:pt-32 lg:py-40">
        <div className="max-w-3xl">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-white leading-[1.15] sm:leading-[1.1] tracking-tight mb-4 sm:mb-6">
            Predictable Agricultural Supply, Without the Chaos
          </h1>

          <p className="text-base sm:text-lg lg:text-2xl text-white/80 mb-3 sm:mb-4 leading-relaxed max-w-2xl">
            AgroBridge coordinates farmers, field operations, and logistics to help buyers source agricultural produce
            reliably — on time, to spec, and at scale.
          </p>

          <p className="text-sm sm:text-base lg:text-lg text-white/60 mb-6 sm:mb-8 lg:mb-10 leading-relaxed max-w-2xl">
            We don't just connect supply and demand. We coordinate execution end-to-end so agricultural trade actually
            works.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button
              size="lg"
              asChild
              className="w-full sm:w-auto bg-white text-neutral-900 hover:bg-neutral-100 px-6 sm:px-8 h-12 sm:h-14 text-sm sm:text-base font-semibold shadow-xl hover:shadow-2xl transition-all group"
            >
              <Link href="#contact">
                Talk to Us About Sourcing
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 px-6 sm:px-8 h-12 sm:h-14 text-sm sm:text-base font-medium bg-transparent"
            >
              <Link href="#approach">
                <PlayCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Explore How It Works
              </Link>
            </Button>
          </div>

          <p className="mt-4 sm:mt-6 text-xs sm:text-sm lg:text-base text-white/70">
            For processors, exporters, aggregators, and institutional buyers
          </p>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-24 lg:h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  )
}
