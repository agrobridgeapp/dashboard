import Link from "next/link"
import Image from "next/image"
import { Facebook, Linkedin, Instagram, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <Image src="/logo.svg" alt="AgroBridge" width={150} height={36} className="h-9 w-auto invert mb-4" />
            <p className="text-sm text-background/60 max-w-xs mb-6">
              Coordinated agriculture that delivers predictable supply through seamless service orchestration. From
              seeds to market.
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              {[
                { icon: Facebook, href: "#" },
                { icon: Linkedin, href: "https://www.linkedin.com/company/agrobridge-app/" },
                { icon: Instagram, href: "#" },
                { icon: Youtube, href: "#" },
              ].map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  target={social.href.startsWith("http") ? "_blank" : undefined}
                  rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-3 text-sm text-background/60">
              <li>
                <Link href="/signup/farmer" className="hover:text-background transition-colors">
                  Farmer Registration
                </Link>
              </li>
              <li>
                <Link href="/signup/partner" className="hover:text-background transition-colors">
                  Partner Onboarding
                </Link>
              </li>
              <li>
                <Link href="/signup/buyer" className="hover:text-background transition-colors">
                  Buyer Registration
                </Link>
              </li>
              <li>
                <Link href="/signup/agent" className="hover:text-background transition-colors">
                  Field Agent Application
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-background transition-colors">
                  Operations Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-3 text-sm text-background/60">
              <li>
                <Link href="#services" className="hover:text-background transition-colors">
                  Land Preparation
                </Link>
              </li>
              <li>
                <Link href="#services" className="hover:text-background transition-colors">
                  Input Supply
                </Link>
              </li>
              <li>
                <Link href="#services" className="hover:text-background transition-colors">
                  Crop Advisory
                </Link>
              </li>
              <li>
                <Link href="#services" className="hover:text-background transition-colors">
                  Harvest & Market
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-background/60">
              <li>
                <Link href="#" className="hover:text-background transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-background transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-background transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-background transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Download App Banner */}
        <div className="bg-background/5 rounded-2xl p-6 md:p-8 mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Download the AgroBridge App</h3>
            <p className="text-sm text-background/60">
              Access services, track operations, and manage your farm from anywhere.
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              href="#"
              className="px-6 py-3 bg-background text-foreground rounded-lg font-medium text-sm hover:bg-background/90 transition-colors"
            >
              App Store
            </Link>
            <Link
              href="#"
              className="px-6 py-3 bg-background text-foreground rounded-lg font-medium text-sm hover:bg-background/90 transition-colors"
            >
              Play Store
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-background/60">© 2026 AgroBridge. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-background/60">
            <Link href="#" className="hover:text-background transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-background transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-background transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
