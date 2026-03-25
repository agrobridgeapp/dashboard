"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Package, Truck, Warehouse, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function AggregatorOnboardingPage() {
  const { user, updateOnboardingStatus } = useAuth()
  const router = useRouter()

  // Auto-complete onboarding for aggregators (their profile was collected during registration)
  useEffect(() => {
    if (user?.role === "aggregator" && user?.onboardingStatus === "pending") {
      // Mark onboarding complete after a short delay to show the welcome screen
      const timer = setTimeout(() => {
        updateOnboardingStatus("complete")
        router.push("/dashboard/aggregator")
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [user, updateOnboardingStatus, router])

  const handleContinue = async () => {
    await updateOnboardingStatus("complete")
    router.push("/dashboard/aggregator")
  }

  return (
    <div className="min-h-screen bg-[#F5F3EE]">
      <Header />
      <main className="container mx-auto px-4 py-12 pt-24">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <CardHeader className="pb-4">
              <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="h-8 w-8 text-amber-600" />
              </div>
              <CardTitle className="text-2xl">Welcome to AgroBridge, {user?.name?.split(" ")[0] || "Aggregator"}!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                Your account has been verified. You are now part of the AgroBridge aggregator network.
                Here is what you can do:
              </p>

              <div className="grid sm:grid-cols-3 gap-4 text-left">
                <div className="bg-muted/50 rounded-lg p-4">
                  <Package className="h-6 w-6 text-amber-600 mb-2" />
                  <h3 className="font-semibold text-sm mb-1">Receive Orders</h3>
                  <p className="text-xs text-muted-foreground">Get supply orders matched to your capacity and location</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <Truck className="h-6 w-6 text-amber-600 mb-2" />
                  <h3 className="font-semibold text-sm mb-1">Track Collections</h3>
                  <p className="text-xs text-muted-foreground">Log collections from farmers and monitor progress</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <Warehouse className="h-6 w-6 text-amber-600 mb-2" />
                  <h3 className="font-semibold text-sm mb-1">Coordinate Delivery</h3>
                  <p className="text-xs text-muted-foreground">Mark orders ready and coordinate final delivery</p>
                </div>
              </div>

              <Button onClick={handleContinue} size="lg" className="w-full sm:w-auto">
                Go to Dashboard
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>

              <p className="text-xs text-muted-foreground">
                You will be redirected automatically in a few seconds...
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
