import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function FinalCTASection() {
  return (
    <section id="cta" className="bg-[#1c1f23] py-20 lg:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Fix your supply problem
        </h2>
        <p className="text-lg text-white/70 mb-10">
          Tell us what you need. We'll structure how to deliver it.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            size="lg"
            asChild
            className="bg-white text-[#1c1f23] hover:bg-white/90 px-6 h-12 text-base font-medium rounded-lg group"
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
    </section>
  )
}
