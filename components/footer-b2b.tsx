import Link from "next/link"
import Image from "next/image"
import { Linkedin, Instagram, Facebook } from "lucide-react"

export function FooterB2B() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Platform */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Platform</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="#approach" className="text-gray-400 hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="#for" className="text-gray-400 hover:text-white transition-colors">
                  Who It's For
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-gray-400 hover:text-white transition-colors">
                  Log In
                </Link>
              </li>
            </ul>
          </div>

          {/* Buyers */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">For Buyers</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/demo/offtaker" className="text-gray-400 hover:text-white transition-colors">
                  View Demo
                </Link>
              </li>
              <li>
                <Link href="/signup/buyer" className="text-gray-400 hover:text-white transition-colors">
                  Request Access
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact Sales
                </Link>
              </li>
            </ul>
          </div>

          {/* Partners */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Partners</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/signup/aggregator" className="text-gray-400 hover:text-white transition-colors">
                  Aggregators
                </Link>
              </li>
              <li>
                <Link href="/signup/agent" className="text-gray-400 hover:text-white transition-colors">
                  Field Agents
                </Link>
              </li>
              <li>
                <Link href="/signup/farmer" className="text-gray-400 hover:text-white transition-colors">
                  Farmers
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-5">
            <Image
              src="/logo-white.png"
              alt="AgroBridge"
              width={180}
              height={42}
              className="h-8 w-auto object-contain brightness-0 invert"
            />
            <span className="text-sm text-gray-400">© 2026 AgroBridge</span>
          </div>
          
          <div className="flex gap-4">
            <Link
              href="https://x.com/agrobridge_app?s=21&t=P2nf9wcfm9g__YknohoSWA"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Follow us on X"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </Link>
            <Link
              href="https://www.instagram.com/agrobridge_app?igsh=MWJmcGNmdjAxYTdrOA=="
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Follow us on Instagram"
            >
              <Instagram className="h-5 w-5" />
            </Link>
            <Link
              href="https://www.facebook.com/people/AgroBridge-App/61588478357639/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Follow us on Facebook"
            >
              <Facebook className="h-5 w-5" />
            </Link>
            <Link
              href="https://www.linkedin.com/company/agrobridge-app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Follow us on LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
