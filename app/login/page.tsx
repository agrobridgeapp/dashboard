"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tractor, Leaf, ShoppingCart, ArrowRight, TrendingUp, Users, CheckCircle2, ArrowLeft } from "lucide-react"

interface UserRole {
  id: string
  title: string
  subtitle: string
  icon: React.ComponentType<{ className?: string }>
  image: string
  benefits: string[]
  revenueHighlight?: string
  color: string
  loginPath: string
  registerPath?: string
}

const userRoles: UserRole[] = [
  {
    id: "offtaker",
    title: "Buyer",
    subtitle: "Traders, processors & exporters",
    icon: ShoppingCart,
    image: "/grain-warehouse-with-trucks-loading-agricultural-c.jpg",
    benefits: [
      "Guaranteed supply from verified farmers",
      "Real-time visibility into your pipeline",
      "92%+ fulfilment confidence scores",
    ],
    revenueHighlight: "Reduce costs by 15-25%",
    color: "bg-emerald-500",
    loginPath: "/login/offtaker",
    registerPath: "/signup/buyer",
  },
  {
    id: "agent",
    title: "Field Agent",
    subtitle: "Agricultural extension workers",
    icon: Users,
    image: "/agricultural-field-agent-with-tablet-visiting-farm.jpg",
    benefits: [
      "Earn per farmer you onboard",
      "Commission on every hectare serviced",
      "Performance bonuses & tier upgrades",
    ],
    revenueHighlight: "Earn N150K - N500K+/month",
    color: "bg-blue-500",
    loginPath: "/login/agent",
    registerPath: "/signup/agent",
  },
  {
    id: "partner",
    title: "Service Partner",
    subtitle: "Tractor owners, input dealers, sprayers",
    icon: Tractor,
    image: "/tractor-plowing-agricultural-field-with-farmer-wat.jpg",
    benefits: [
      "Steady stream of job requests",
      "Guaranteed payments on completion",
      "Fleet & inventory management tools",
    ],
    revenueHighlight: "2-3x more jobs per season",
    color: "bg-orange-500",
    loginPath: "/login/partner",
    registerPath: "/signup/partner",
  },
  {
    id: "farmer",
    title: "Farmer",
    subtitle: "Smallholder & commercial farmers",
    icon: Leaf,
    image: "/african-smallholder-farmer-harvesting-maize-crops-.jpg",
    benefits: [
      "Access quality inputs on credit",
      "Guaranteed market for your harvest",
      "Fair prices locked before planting",
    ],
    revenueHighlight: "Increase yields by 40-60%",
    color: "bg-green-600",
    loginPath: "/login/farmer",
    registerPath: "/signup/farmer",
  },
]

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F5F3EE] flex flex-col">
      {/* Header Bar - Made sticky, reduced height on mobile */}
      <header className="bg-white border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back</span>
          </Link>

          <Image
            src="/logo.png"
            alt="AgroBridge"
            width={500}
            height={120}
            className="h-16 sm:h-20 md:h-24 w-auto"
            priority
          />

          <Link href="/" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
            Website
          </Link>
        </div>
      </header>

      {/* Main Content - Reduced padding on mobile */}
      <main className="flex-1 container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Header Section - More compact on mobile */}
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-1 sm:mb-2">Choose Your Role</h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
            Select how you interact with AgroBridge
          </p>
        </div>

        {/* Role Selection Grid - 1 col mobile, 2 col tablet, 4 col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-6xl mx-auto">
          {userRoles.map((role) => {
            const Icon = role.icon

            return (
              <Card
                key={role.id}
                className="group transition-all duration-300 overflow-hidden border border-border/50 hover:border-primary/50 hover:shadow-lg"
              >
                <CardContent className="p-0">
                  {/* Image Section - Shorter on mobile */}
                  <div className="relative h-24 sm:h-28 overflow-hidden">
                    <Image
                      src={role.image || "/placeholder.svg"}
                      alt={role.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Icon Badge */}
                    <div
                      className={`absolute top-2 sm:top-3 left-2 sm:left-3 ${role.color} p-1.5 sm:p-2 rounded-lg shadow-lg`}
                    >
                      <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                    </div>

                    {/* Revenue Highlight */}
                    {role.revenueHighlight && (
                      <div className="absolute bottom-2 left-2 right-2">
                        <Badge className="bg-white/95 text-foreground hover:bg-white/95 font-medium text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 w-full justify-center">
                          <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1 text-green-600 shrink-0" />
                          <span className="truncate">{role.revenueHighlight}</span>
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Content Section - Tighter padding on mobile */}
                  <div className="p-3 sm:p-4">
                    <div className="mb-2 sm:mb-3">
                      <h3 className="text-sm sm:text-base font-bold text-foreground mb-0.5">{role.title}</h3>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">{role.subtitle}</p>
                    </div>

                    {/* Benefits List - Hidden on mobile, shown on larger screens */}
                    <ul className="hidden sm:block space-y-1.5 mb-4">
                      {role.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                          <CheckCircle2 className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                          <span className="leading-tight">{benefit}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-1.5 sm:gap-2">
                      <Button asChild size="sm" className="w-full h-8 sm:h-9 text-xs sm:text-sm">
                        <Link href={role.loginPath}>
                          Sign In
                          <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 ml-1.5" />
                        </Link>
                      </Button>
                      {role.registerPath && (
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="w-full h-7 sm:h-8 text-xs sm:text-sm text-primary hover:text-primary hover:bg-primary/10"
                        >
                          <Link href={role.registerPath}>Register</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </main>

      {/* Footer - Smaller text on mobile */}
      <footer className="py-3 sm:py-4 text-center text-[10px] sm:text-xs text-muted-foreground border-t border-border/30 bg-white">
        <p>
          Looking for internal operations?{" "}
          <Link href="/login/admin" className="text-primary hover:underline font-medium">
            Staff Login
          </Link>
        </p>
      </footer>
    </div>
  )
}
