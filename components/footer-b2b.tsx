import Link from "next/link"
import Image from "next/image"
import { Linkedin } from "lucide-react"

export function FooterB2B() {
  return (
    <footer className="bg-[#1C1F23] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 mb-6 sm:mb-8 lg:mb-10">
          {/* Logo & Tagline */}
          <div className="lg:col-span-3">
            <Image
              src="/logo-white.png"
              alt="AgroBridge"
              width={500}
              height={125}
              className="w-[140px] sm:w-[180px] lg:w-[300px] h-auto mb-2 sm:mb-3"
            />
            <p className="text-[#C8CDC8] leading-relaxed text-xs sm:text-sm max-w-xs">
              Building operational infrastructure for African agriculture—one corridor at a time.
            </p>
          </div>

          <div className="lg:col-span-9 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 lg:gap-6">
            <div>
              <h4 className="font-semibold text-xs uppercase tracking-wider text-white mb-2 sm:mb-3 lg:mb-4">
                Platform
              </h4>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                <li>
                  <Link
                    href="#approach"
                    className="text-[#C8CDC8] hover:text-white transition-colors py-1 inline-block"
                  >
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link
                    href="#partners"
                    className="text-[#C8CDC8] hover:text-white transition-colors py-1 inline-block"
                  >
                    Who We Work With
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-[#C8CDC8] hover:text-white transition-colors py-1 inline-block">
                    Partner Login
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-xs uppercase tracking-wider text-white mb-2 sm:mb-3 lg:mb-4">
                For Buyers
              </h4>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                <li>
                  <Link
                    href="/demo/offtaker"
                    className="text-[#C8CDC8] hover:text-white transition-colors py-1 inline-block"
                  >
                    View Demo
                  </Link>
                </li>
                <li>
                  <Link
                    href="/signup/buyer"
                    className="text-[#C8CDC8] hover:text-white transition-colors py-1 inline-block"
                  >
                    Buyer Portal
                  </Link>
                </li>
                <li>
                  <Link
                    href="/signup/partner"
                    className="text-[#C8CDC8] hover:text-white transition-colors py-1 inline-block"
                  >
                    Service Partners
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="text-[#C8CDC8] hover:text-white transition-colors py-1 inline-block">
                    Contact Sales
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-xs uppercase tracking-wider text-white mb-2 sm:mb-3 lg:mb-4">
                Work With Us
              </h4>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                <li>
                  <Link
                    href="/signup/farmer"
                    className="text-[#C8CDC8] hover:text-white transition-colors py-1 inline-block"
                  >
                    For Farmers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/signup/agent"
                    className="text-[#C8CDC8] hover:text-white transition-colors py-1 inline-block"
                  >
                    For Field Agents
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-xs uppercase tracking-wider text-white mb-2 sm:mb-3 lg:mb-4">
                Company
              </h4>
              <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                <li>
                  <Link href="#" className="text-[#C8CDC8] hover:text-white transition-colors py-1 inline-block">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="text-[#C8CDC8] hover:text-white transition-colors py-1 inline-block">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-4 sm:pt-6 border-t border-[#C8CDC8]/20 flex flex-col-reverse sm:flex-row justify-between items-center gap-3 sm:gap-4">
          <p className="text-xs text-[#C8CDC8]/60 text-center sm:text-left">© 2026 AgroBridge. All rights reserved.</p>
          <div className="flex gap-1 sm:gap-2">
            <Link
              href="https://www.linkedin.com/company/agrobridge-app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C8CDC8]/60 hover:text-white transition-colors p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <Linkedin className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
