"use client"

import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Smartphone } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F5F3EE]">
      <Header />
      <main className="container mx-auto px-4 py-6 pt-20 sm:py-8 sm:pt-24">
        {/* Header Section - Smaller text and spacing on mobile */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex justify-center mb-3 sm:mb-4">
            <Image src="/logo.png" alt="AgroBridge" width={200} height={48} className="h-12 sm:h-14 w-auto" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-3">
            Welcome to AgroBridge
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            Choose how you want to access the platform
          </p>
        </div>

        {/* Single App Card - Centered */}
        <div className="flex justify-center mb-8 sm:mb-12">
          <Card className="group border-2 border-border/50 hover:border-primary/50 hover:shadow-lg transition-all duration-300 overflow-hidden w-full max-w-sm">
            <CardContent className="p-0">
              <div className="relative h-36 sm:h-48 bg-gradient-to-br from-[#0F3D2E] to-[#1a5c45] flex items-center justify-center">
                <div className="text-center">
                  <div className="bg-white/10 backdrop-blur-sm p-3 sm:p-4 rounded-2xl inline-block mb-2 sm:mb-3">
                    <Smartphone className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">AgroBridge App</h2>
                  <p className="text-white/80 text-xs sm:text-sm mt-1">For Partners & Stakeholders</p>
                </div>
              </div>
              <div className="p-4 sm:p-6">
                <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                  Access for buyers, farmers, field agents, and service partners to manage operations, track deliveries,
                  and grow revenue.
                </p>
                <div className="hidden sm:block space-y-2 mb-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>Buyers</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>Field Agents</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>Service Partners</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>Farmers</span>
                  </div>
                </div>
                <Button asChild className="w-full" size="lg">
                  <Link href="/login/app">
                    Continue to App
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trust Indicators - hidden until real data is available */}
      </main>
    </div>
  )
}
