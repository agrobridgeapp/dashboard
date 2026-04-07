"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState, useEffect } from "react"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileMenuOpen])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-white border-b border-gray-200 shadow-sm" 
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-24 lg:h-28">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo-white.png"
              alt="AgroBridge"
              width={220}
              height={52}
              className={`h-10 lg:h-12 w-auto object-contain transition-all ${scrolled ? "" : "brightness-0 invert"}`}
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#problem"
              className={`text-sm font-medium transition-colors ${
                scrolled ? "text-gray-600 hover:text-gray-900" : "text-white/80 hover:text-white"
              }`}
            >
              Problem
            </Link>
            <Link
              href="#approach"
              className={`text-sm font-medium transition-colors ${
                scrolled ? "text-gray-600 hover:text-gray-900" : "text-white/80 hover:text-white"
              }`}
            >
              How It Works
            </Link>
            <Link
              href="#for"
              className={`text-sm font-medium transition-colors ${
                scrolled ? "text-gray-600 hover:text-gray-900" : "text-white/80 hover:text-white"
              }`}
            >
              Who It's For
            </Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              asChild 
              className={`transition-colors ${
                scrolled ? "text-gray-600 hover:text-gray-900" : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <Link href="/login">Log in</Link>
            </Button>
            <Button 
              size="sm" 
              asChild 
              className={`transition-colors ${
                scrolled 
                  ? "bg-[#0f3d2e] hover:bg-[#0a2d21] text-white" 
                  : "bg-white text-[#0f3d2e] hover:bg-white/90"
              }`}
            >
              <Link href="#contact">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-2 transition-colors ${scrolled ? "text-gray-600" : "text-white"}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-16 lg:top-20 bg-white z-40">
            <div className="flex flex-col p-6">
              <Link
                href="#problem"
                className="py-3 text-gray-600 hover:text-gray-900 border-b border-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                Problem
              </Link>
              <Link
                href="#approach"
                className="py-3 text-gray-600 hover:text-gray-900 border-b border-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="#for"
                className="py-3 text-gray-600 hover:text-gray-900 border-b border-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                Who It's For
              </Link>

              <div className="flex flex-col gap-3 mt-6">
                <Button variant="outline" asChild className="w-full" onClick={() => setMobileMenuOpen(false)}>
                  <Link href="/login">Log in</Link>
                </Button>
                <Button asChild className="w-full bg-[#0f3d2e] hover:bg-[#0a2d21] text-white" onClick={() => setMobileMenuOpen(false)}>
                  <Link href="#contact">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
