import { Button } from "@/components/ui/button"
import { ArrowRight, Phone, Mail, MapPin } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/african-farmers-working-field-sunset.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/90 to-primary/80" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - CTA Content */}
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6 text-balance">
              Let's Grow African Agriculture Together
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-lg leading-relaxed">
              Whether you're a farmer seeking better support, a partner ready to serve organized corridors, or a buyer
              looking for reliable supply—there's a place for you on AgroBridge.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" variant="secondary" asChild className="px-8 py-6 text-lg shadow-xl">
                <Link href="/signup/farmer">
                  Register as Farmer
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="px-8 py-6 text-lg bg-white/10 backdrop-blur-sm border-white/40 text-white hover:bg-white/20"
              >
                <Link href="/signup/partner">Become a Partner</Link>
              </Button>
            </div>
            <div className="mt-4">
              <Link
                href="/signup/agent"
                className="text-white/80 hover:text-white underline text-sm font-medium transition-colors"
              >
                Looking to join as a Field Agent? Apply here →
              </Link>
            </div>
          </div>

          {/* Right - Contact Info Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/30 shadow-2xl">
            <h3 className="text-xl font-semibold text-white mb-6">Get in Touch</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-white/90">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-white/70">Call us</p>
                  <p className="font-medium text-white">+234 916 491 3269</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-white/90">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-white/70">Email us</p>
                  <p className="font-medium text-white">hello@agrobridge.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-white/90">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-white/70">Visit us</p>
                  <p className="font-medium text-white">Lagos, Nigeria</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
