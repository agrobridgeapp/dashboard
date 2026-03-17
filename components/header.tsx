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
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
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
        scrolled ? "bg-[#F5F3EE]/95 backdrop-blur-md border-b border-[#C8CDC8] shadow-sm" : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-18">
          <Link href="/" className="flex items-center -ml-1 sm:-ml-2 lg:-ml-3">
            <Image
              src={scrolled ? "/logo.png" : "/logo-white.png"}
              alt="AgroBridge"
              width={300}
              height={75}
              className="w-[140px] sm:w-[180px] lg:w-[240px] h-auto"
              priority
            />
          </Link>

          <div className="hidden md:flex items-center gap-6 lg:gap-10">
            <Link
              href="#problem"
              className={`text-sm lg:text-base font-semibold transition-colors ${scrolled ? "text-[#1C1F23] hover:text-[#1C1F23]/80" : "text-white hover:text-white/90"}`}
            >
              The Problem
            </Link>
            <Link
              href="#approach"
              className={`text-sm lg:text-base font-semibold transition-colors ${scrolled ? "text-[#1C1F23] hover:text-[#1C1F23]/80" : "text-white hover:text-white/90"}`}
            >
              Our Approach
            </Link>
            <Link
              href="#partners"
              className={`text-sm lg:text-base font-semibold transition-colors ${scrolled ? "text-[#1C1F23] hover:text-[#1C1F23]/80" : "text-white hover:text-white/90"}`}
            >
              Who We Work With
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            <Button
              variant="ghost"
              asChild
              className={`text-sm lg:text-base ${scrolled ? "text-[#1C1F23] hover:text-[#1C1F23]" : "text-white hover:text-white/90"}`}
            >
              <Link href="/login">Log in</Link>
            </Button>
            <Button
              asChild
              className={`text-sm lg:text-base px-4 lg:px-6 py-2 lg:py-2.5 ${
                scrolled
                  ? "bg-[#0F3D2E] text-[#F5F3EE] hover:bg-[#0F3D2E]/90"
                  : "bg-white text-[#0F3D2E] hover:bg-white/90"
              }`}
            >
              <Link href="#contact">Discuss Supply</Link>
            </Button>
          </div>

          <button
            className={`md:hidden p-3 -mr-2 min-w-[44px] min-h-[44px] flex items-center justify-center ${scrolled ? "text-[#1C1F23]" : "text-white"}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-16 bg-white z-40 overflow-y-auto">
            <div className="flex flex-col p-6 space-y-2">
              <Link
                href="#problem"
                className="text-lg text-[#1C1F23] font-medium py-4 px-2 border-b border-[#C8CDC8]/50 active:bg-[#F5F3EE] rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                The Problem
              </Link>
              <Link
                href="#approach"
                className="text-lg text-[#1C1F23] font-medium py-4 px-2 border-b border-[#C8CDC8]/50 active:bg-[#F5F3EE] rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Our Approach
              </Link>
              <Link
                href="#partners"
                className="text-lg text-[#1C1F23] font-medium py-4 px-2 border-b border-[#C8CDC8]/50 active:bg-[#F5F3EE] rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Who We Work With
              </Link>

              <div className="flex flex-col gap-3 pt-6 mt-4">
                <Button
                  variant="outline"
                  asChild
                  className="w-full h-12 text-base bg-transparent"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Link href="/login">Log in</Link>
                </Button>
                <Button
                  asChild
                  className="w-full h-12 text-base bg-[#0F3D2E] text-[#F5F3EE] hover:bg-[#0F3D2E]/90"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Link href="#contact">Discuss Supply</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
