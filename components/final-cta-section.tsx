import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function FinalCTASection() {
  return (
    <section id="cta" className="py-16 sm:py-20 lg:py-28 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 mb-4 sm:mb-6 leading-tight">
          Looking for Reliable Agricultural Supply?
        </h2>
        <p className="text-sm sm:text-base lg:text-lg text-neutral-600 mb-6 sm:mb-8 lg:mb-10 max-w-2xl mx-auto leading-relaxed">
          Let's start with a pilot and build from there. If you're a processor, exporter, or institutional buyer, we'd
          like to understand your sourcing needs.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Button
            size="lg"
            asChild
            className="bg-primary text-white hover:bg-primary/90 px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all group"
          >
            <Link href="#contact">
              Discuss Your Sourcing Needs
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
            className="border-neutral-300 text-neutral-700 hover:bg-neutral-50 px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base font-medium bg-transparent"
          >
            <Link href="/signup/partner">Become a Service Partner</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
