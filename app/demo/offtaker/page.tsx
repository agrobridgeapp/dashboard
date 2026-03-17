"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"
import {
  CheckCircle2,
  Play,
  TrendingUp,
  Shield,
  FileText,
  Truck,
  ChevronLeft,
  ChevronRight,
  Home,
  Map,
  Phone,
  Wheat,
  MapPin,
  Clock,
  AlertTriangle,
  Package,
  ShieldCheck,
  Calendar,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"

function SupplyNetworkDemo() {
  const corridorData = [
    {
      corridor: "Kaduna Central",
      crop: "Maize",
      hectares: 2840,
      expectedVolume: 4260,
      harvestReadiness: 78,
      status: "on-track",
    },
    {
      corridor: "Kano South",
      crop: "Soybean",
      hectares: 1920,
      expectedVolume: 1920,
      harvestReadiness: 65,
      status: "on-track",
    },
    {
      corridor: "Plateau East",
      crop: "Maize",
      hectares: 1680,
      expectedVolume: 2520,
      harvestReadiness: 82,
      status: "on-track",
    },
    {
      corridor: "Niger West",
      crop: "Rice",
      hectares: 1460,
      expectedVolume: 2190,
      harvestReadiness: 45,
      status: "at-risk",
    },
  ]

  const totalHectares = corridorData.reduce((sum, c) => sum + c.hectares, 0)
  const totalExpectedVolume = corridorData.reduce((sum, c) => sum + c.expectedVolume, 0)
  const avgReadiness = Math.round(corridorData.reduce((sum, c) => sum + c.harvestReadiness, 0) / corridorData.length)

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className="border-b bg-muted/30 px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-red-400" />
          <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-yellow-400" />
          <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-green-400" />
        </div>
        <span className="text-[10px] sm:text-xs text-muted-foreground font-mono hidden sm:block">corridors</span>
      </div>

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <Card className="border-border/50">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Map className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#1B5E3C]" />
                <span className="text-[10px] sm:text-xs text-muted-foreground">Active Corridors</span>
              </div>
              <p className="mt-1.5 sm:mt-2 text-xl sm:text-2xl font-bold">{corridorData.length}</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Wheat className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#1B5E3C]" />
                <span className="text-[10px] sm:text-xs text-muted-foreground">Total Hectares</span>
              </div>
              <p className="mt-1.5 sm:mt-2 text-xl sm:text-2xl font-bold">{totalHectares.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#1B5E3C]" />
                <span className="text-[10px] sm:text-xs text-muted-foreground">Expected Volume</span>
              </div>
              <p className="mt-1.5 sm:mt-2 text-xl sm:text-2xl font-bold">{totalExpectedVolume.toLocaleString()} MT</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm sm:text-base">AgroBridge-Coordinated Corridors</h3>
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 text-[10px] sm:text-xs">
              Live Data
            </Badge>
          </div>
          {corridorData.map((corridor) => (
            <div
              key={corridor.corridor}
              className="rounded-lg border p-3 sm:p-4 hover:border-[#1B5E3C]/30 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="rounded-lg bg-[#1B5E3C]/10 p-1.5 sm:p-2">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-[#1B5E3C]" />
                  </div>
                  <div>
                    <p className="font-medium text-sm sm:text-base">{corridor.corridor}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {corridor.crop} • {corridor.hectares.toLocaleString()} ha
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm ml-9 sm:ml-0">
                  <div className="text-center">
                    <p className="font-semibold">{corridor.expectedVolume.toLocaleString()}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Expected MT</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">{corridor.harvestReadiness}%</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Readiness</p>
                  </div>
                  <Badge
                    className={`text-[10px] sm:text-xs ${corridor.status === "on-track" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
                  >
                    {corridor.status === "on-track" ? "On Track" : "At Risk"}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-lg bg-[#1B5E3C]/5 border border-[#1B5E3C]/20 p-3 sm:p-4">
          <div className="flex items-start gap-2 sm:gap-3">
            <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-[#1B5E3C] mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-[#1B5E3C] text-sm sm:text-base">AgroBridge-Coordinated Supply Only</p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
                All supply shown is already under AgroBridge coordination with verified service delivery. You see
                corridor-level aggregates—no individual farmer details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ContractManagementDemo() {
  const contracts = [
    {
      id: "AB-2026-0147",
      crop: "Maize",
      corridor: "Kaduna Central",
      season: "2025/26 Dry",
      contracted: 850,
      delivered: 722,
      remaining: 128,
      deliveryWindow: "Feb 15 - Mar 15",
      status: "on-track",
    },
    {
      id: "AB-2026-0152",
      crop: "Soybean",
      corridor: "Kano South",
      season: "2025/26 Dry",
      contracted: 420,
      delivered: 315,
      remaining: 105,
      deliveryWindow: "Mar 1 - Mar 30",
      status: "on-track",
    },
    {
      id: "AB-2026-0156",
      crop: "Rice",
      corridor: "Niger West",
      season: "2025/26 Dry",
      contracted: 300,
      delivered: 95,
      remaining: 205,
      deliveryWindow: "Feb 10 - Feb 28",
      status: "at-risk",
    },
  ]

  const totalContracted = contracts.reduce((sum, c) => sum + c.contracted, 0)
  const totalDelivered = contracts.reduce((sum, c) => sum + c.delivered, 0)

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className="border-b bg-muted/30 px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-red-400" />
          <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-yellow-400" />
          <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-green-400" />
        </div>
        <span className="text-[10px] sm:text-xs text-muted-foreground font-mono hidden sm:block">contracts</span>
      </div>

      <div className="p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm sm:text-base">AgroBridge Contracts</h3>
            <p className="text-xs text-muted-foreground">
              {contracts.length} active • {totalDelivered.toLocaleString()} / {totalContracted.toLocaleString()} MT
              delivered
            </p>
          </div>
          <Badge variant="secondary" className="bg-[#1B5E3C]/10 text-[#1B5E3C] text-[10px] sm:text-xs">
            Read Only
          </Badge>
        </div>

        {contracts.map((contract) => {
          const progress = Math.round((contract.delivered / contract.contracted) * 100)
          return (
            <div key={contract.id} className="rounded-lg border p-3 sm:p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="rounded-lg bg-amber-100 p-1.5 sm:p-2">
                    <Wheat className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm sm:text-base">{contract.crop}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {contract.corridor} • {contract.season}
                    </p>
                  </div>
                </div>
                <Badge
                  className={`text-[10px] sm:text-xs ${contract.status === "on-track" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}
                >
                  {contract.status === "on-track" ? "On Track" : "At Risk"}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Delivery Progress</span>
                  <span className="font-medium">
                    {contract.delivered} / {contract.contracted} MT ({progress}%)
                  </span>
                </div>
                <Progress value={progress} className="h-1.5 sm:h-2" />
                <div className="flex justify-between text-[10px] sm:text-xs text-muted-foreground pt-1">
                  <span className="flex items-center gap-1">
                    <Package className="h-3 w-3" />
                    {contract.remaining} MT remaining
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {contract.deliveryWindow}
                  </span>
                </div>
              </div>
            </div>
          )
        })}

        <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 sm:p-4">
          <div className="flex items-start gap-2 sm:gap-3">
            <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-amber-800 text-sm sm:text-base">Risk Alert: Niger West Corridor</p>
              <p className="text-xs sm:text-sm text-amber-700 mt-0.5 sm:mt-1">
                Rice delivery behind schedule due to delayed harvest. AgroBridge ops team is coordinating accelerated
                aggregation to meet window.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function DeliveryTrackingDemo() {
  const deliveries = [
    {
      id: "DEL-4827",
      corridor: "Kaduna Central",
      crop: "Maize",
      quantity: 42,
      status: "in-transit",
      eta: "Today, 2:30 PM",
      location: "En route to facility",
    },
    {
      id: "DEL-4826",
      corridor: "Kano South",
      crop: "Soybean",
      quantity: 38,
      status: "scheduled",
      eta: "Tomorrow, 9:00 AM",
      location: "Aggregation complete",
    },
    {
      id: "DEL-4825",
      corridor: "Plateau East",
      crop: "Maize",
      quantity: 25,
      status: "delivered",
      eta: "Received",
      location: "Your Facility",
      receivedAt: "Today, 10:15 AM",
    },
    {
      id: "DEL-4824",
      corridor: "Kaduna Central",
      crop: "Maize",
      quantity: 51,
      status: "delivered",
      eta: "Received",
      location: "Your Facility",
      receivedAt: "Yesterday, 4:30 PM",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-transit":
        return "bg-blue-100 text-blue-700"
      case "scheduled":
        return "bg-purple-100 text-purple-700"
      case "delivered":
        return "bg-emerald-100 text-emerald-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const todayDelivered = deliveries.filter((d) => d.status === "delivered").reduce((sum, d) => sum + d.quantity, 0)
  const todayInProgress = deliveries.filter((d) => d.status !== "delivered").reduce((sum, d) => sum + d.quantity, 0)

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className="border-b bg-muted/30 px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-red-400" />
          <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-yellow-400" />
          <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-green-400" />
        </div>
        <span className="text-[10px] sm:text-xs text-muted-foreground font-mono hidden sm:block">deliveries</span>
      </div>

      <div className="p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm sm:text-base">Delivery Schedule</h3>
            <p className="text-xs text-muted-foreground">
              {todayDelivered} MT received • {todayInProgress} MT scheduled
            </p>
          </div>
          <Badge variant="secondary" className="text-[10px] sm:text-xs bg-blue-100 text-blue-700">
            {deliveries.filter((d) => d.status !== "delivered").length} Upcoming
          </Badge>
        </div>

        {deliveries.map((delivery) => (
          <div key={delivery.id} className="rounded-lg border p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <div
                  className={`rounded-lg p-1.5 sm:p-2 ${delivery.status === "delivered" ? "bg-emerald-100" : delivery.status === "scheduled" ? "bg-purple-100" : "bg-blue-100"}`}
                >
                  {delivery.status === "delivered" ? (
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                  ) : (
                    <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-sm sm:text-base">{delivery.corridor}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {delivery.crop} • {delivery.quantity} MT
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end sm:text-right gap-2 ml-9 sm:ml-0">
                <Badge className={`text-[10px] sm:text-xs ${getStatusColor(delivery.status)}`}>
                  {delivery.status === "in-transit"
                    ? "In Transit"
                    : delivery.status === "scheduled"
                      ? "Scheduled"
                      : "Received"}
                </Badge>
              </div>
            </div>
            <div className="mt-2 sm:mt-3 flex items-center justify-between text-xs sm:text-sm text-muted-foreground ml-9 sm:ml-0">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                {delivery.status === "delivered" && delivery.receivedAt ? delivery.receivedAt : delivery.eta}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                {delivery.location}
              </span>
            </div>
          </div>
        ))}

        <p className="text-xs text-muted-foreground text-center pt-2">
          Once delivered, use "Confirm Received" to log receipt. Confirmed deliveries cannot be edited.
        </p>
      </div>
    </div>
  )
}

function SupplyAssuranceDemo() {
  const assuranceMetrics = [
    { label: "AgroBridge Fulfilment Rate", value: "87%", trend: "+3% vs last season" },
    { label: "On-Track Corridors", value: "3/4", trend: "1 needs attention" },
    { label: "Avg. Service Completion", value: "94%", trend: "Across all corridors" },
  ]

  const comparisonData = [
    { metric: "Visibility", traditional: "At delivery", agrobridge: "6 months ahead" },
    { metric: "Default Rate", traditional: "25-40%", agrobridge: "< 8%" },
    { metric: "Quality Variance", traditional: "Unpredictable", agrobridge: "92% Grade A/B" },
    { metric: "Coordination", traditional: "100+ calls/week", agrobridge: "1 dashboard" },
    { metric: "Planning", traditional: "Reactive", agrobridge: "Predictive" },
  ]

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className="border-b bg-muted/30 px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-red-400" />
          <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-yellow-400" />
          <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-green-400" />
        </div>
        <span className="text-[10px] sm:text-xs text-muted-foreground font-mono hidden sm:block">supply-assurance</span>
      </div>

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {assuranceMetrics.map((metric) => (
            <Card key={metric.label} className="border-border/50">
              <CardContent className="p-2.5 sm:p-4">
                <span className="text-[9px] sm:text-xs text-muted-foreground">{metric.label}</span>
                <p className="text-lg sm:text-2xl font-bold text-[#1B5E3C] mt-1">{metric.value}</p>
                <p className="text-[9px] sm:text-xs text-muted-foreground">{metric.trend}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* What You Get With AgroBridge - matching the dashboard style */}
        <div className="rounded-xl overflow-hidden">
          <div className="bg-gradient-to-br from-[#1B5E3C] to-[#0F3D2E] p-4 sm:p-6 text-white">
            <h4 className="font-semibold text-sm sm:text-base mb-1">What You Get With AgroBridge</h4>
            <p className="text-xs sm:text-sm text-white/70 mb-4">Compared to traditional procurement</p>

            <div className="space-y-3">
              {comparisonData.map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4 py-2 border-b border-white/10 last:border-0"
                >
                  <span className="text-white/90 text-xs sm:text-sm font-medium">{item.metric}</span>
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <span className="text-white/50 line-through">{item.traditional}</span>
                    <ArrowRight className="h-3 w-3 text-white/50" />
                    <span className="font-semibold text-white">{item.agrobridge}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#0F3D2E] px-4 sm:px-6 py-3 text-center">
            <p className="text-xs sm:text-sm text-white/80 italic">"Plan procurement with confidence, not guesswork"</p>
          </div>
        </div>

        <div className="rounded-lg bg-[#1B5E3C]/5 border border-[#1B5E3C]/20 p-3 sm:p-4">
          <div className="flex items-start gap-2 sm:gap-3">
            <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-[#1B5E3C] mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-[#1B5E3C] text-sm sm:text-base">Your Reliability Monitor</p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
                This dashboard shows only AgroBridge-coordinated supply. All metrics are updated daily based on actual
                field execution data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const demoSteps = [
  {
    id: 1,
    title: "Corridor Visibility",
    subtitle: "See your AgroBridge-coordinated supply at a glance",
    description:
      "View aggregated supply data across corridors under AgroBridge coordination. Track expected volumes, harvest readiness, and execution status—all without exposing individual farmer details. See only what's relevant: supply you can actually rely on.",
    icon: Map,
    component: SupplyNetworkDemo,
  },
  {
    id: 2,
    title: "Contract Status",
    subtitle: "Track contracted volumes and delivery progress",
    description:
      "Monitor your active AgroBridge contracts with real-time delivery progress. See contracted vs delivered volumes, remaining quantities, and delivery windows. Receive proactive alerts when any corridor is at risk so you can plan accordingly.",
    icon: FileText,
    component: ContractManagementDemo,
  },
  {
    id: 3,
    title: "Delivery Schedule",
    subtitle: "Know what's arriving and when",
    description:
      "Track scheduled and in-transit deliveries to your facility. See corridor, crop, volume, and expected arrival time for each delivery. Confirm receipt when deliveries arrive to maintain accurate fulfilment records.",
    icon: Truck,
    component: DeliveryTrackingDemo,
  },
  {
    id: 4,
    title: "Supply Assurance",
    subtitle: "Confidence metrics that matter",
    description:
      "Understand the reliability of your AgroBridge supply with clear assurance metrics. See fulfilment rates, service completion, and harvest readiness—all the signals that tell you whether your supply is on track. Compare what you get vs. traditional procurement chaos.",
    icon: ShieldCheck,
    component: SupplyAssuranceDemo,
  },
]

export default function OfftakerDemo() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const handleNext = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStartDemo = () => {
    setIsPlaying(true)
    setCurrentStep(0)
  }

  const currentDemoStep = demoSteps[currentStep]
  const CurrentStepIcon = currentDemoStep.icon
  const DemoComponent = currentDemoStep.component

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <Link href="/" className="flex items-center">
                <Image
                  src="/logo.png"
                  alt="AgroBridge"
                  width={300}
                  height={75}
                  className="w-[120px] sm:w-[160px] lg:w-[180px] h-auto"
                />
              </Link>
              <Badge variant="outline" className="border-[#0F3D2E]/30 text-[#0F3D2E] text-[10px] sm:text-xs">
                Buyer Demo
              </Badge>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild className="sm:hidden">
                <Link href="/">
                  <Home className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="sm" className="bg-[#0F3D2E] hover:bg-[#0F3D2E]/90 text-xs sm:text-sm h-8 sm:h-9" asChild>
                <Link href="/#contact">
                  <span className="hidden sm:inline">Request Access</span>
                  <span className="sm:hidden">Access</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Before Demo Starts */}
      {!isPlaying && (
        <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10 sm:mb-16">
              <Badge className="mb-3 sm:mb-4 bg-[#1B5E3C]/10 text-[#1B5E3C] border-[#1B5E3C]/20 text-xs">
                Interactive Product Demo
              </Badge>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-4 sm:mb-6 text-balance leading-tight">
                Predictable Agricultural Supply, <span className="text-[#1B5E3C]">Without the Chaos</span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto text-pretty">
                See how buyers use AgroBridge to get visibility into coordinated supply, track contract fulfilment, and
                plan procurement with confidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-[#1B5E3C] hover:bg-[#154a30] px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg group"
                  onClick={handleStartDemo}
                >
                  <Play className="mr-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform" />
                  Start Interactive Demo
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg bg-transparent"
                  asChild
                >
                  <Link href="/#contact">
                    <Phone className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Schedule a Call
                  </Link>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 mb-10 sm:mb-16">
              {[
                { value: "87%+", label: "Fulfilment Rate", sublabel: "AgroBridge average" },
                { value: "< 8%", label: "Default Rate", sublabel: "vs 25-40% traditional" },
                { value: "92%", label: "Quality Grade A/B", sublabel: "Graded at source" },
                { value: "6 mo", label: "Advance Visibility", sublabel: "Before harvest" },
              ].map((stat, i) => (
                <Card key={i} className="border-border/50 text-center">
                  <CardContent className="p-4 sm:p-6">
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#1B5E3C]">{stat.value}</p>
                    <p className="font-medium text-xs sm:text-sm mt-1">{stat.label}</p>
                    <p className="text-[10px] sm:text-sm text-muted-foreground">{stat.sublabel}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Preview Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {demoSteps.map((step, i) => {
                const StepIcon = step.icon
                return (
                  <Card
                    key={step.id}
                    className="border-border/50 hover:border-[#1B5E3C]/30 transition-colors cursor-pointer group"
                    onClick={() => {
                      setIsPlaying(true)
                      setCurrentStep(i)
                    }}
                  >
                    <CardContent className="p-3 sm:p-5">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <div className="rounded-lg bg-[#1B5E3C]/10 p-1.5 sm:p-2 group-hover:bg-[#1B5E3C]/20 transition-colors">
                          <StepIcon className="h-4 w-4 sm:h-5 sm:w-5 text-[#1B5E3C]" />
                        </div>
                        <span className="text-[10px] sm:text-xs text-muted-foreground">Step {i + 1}</span>
                      </div>
                      <h3 className="font-semibold text-sm sm:text-base mb-0.5 sm:mb-1">{step.title}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{step.subtitle}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Demo Player */}
      {isPlaying && (
        <section className="py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-4 sm:mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs sm:text-sm text-muted-foreground">
                  Step {currentStep + 1} of {demoSteps.length}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsPlaying(false)}
                  className="text-xs sm:text-sm h-8"
                >
                  Exit Demo
                </Button>
              </div>
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#1B5E3C] transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / demoSteps.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Step Navigation */}
            <div className="flex gap-2 mb-4 sm:mb-6 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
              {demoSteps.map((step, i) => {
                const StepIcon = step.icon
                return (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(i)}
                    className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg border whitespace-nowrap transition-all text-xs sm:text-sm ${
                      currentStep === i
                        ? "border-[#1B5E3C] bg-[#1B5E3C]/10 text-[#1B5E3C]"
                        : "border-border hover:border-[#1B5E3C]/30"
                    }`}
                  >
                    <StepIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="font-medium hidden sm:inline">{step.title}</span>
                    <span className="font-medium sm:hidden">Step {i + 1}</span>
                    {i < currentStep && <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-500" />}
                  </button>
                )
              })}
            </div>

            {/* Main Content */}
            <div className="flex flex-col lg:grid lg:grid-cols-5 gap-6 sm:gap-8">
              {/* Description Panel */}
              <div className="lg:col-span-2 space-y-4 sm:space-y-6 order-2 lg:order-1">
                <div>
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <div className="rounded-xl bg-[#1B5E3C]/10 p-2 sm:p-3">
                      <CurrentStepIcon className="h-5 w-5 sm:h-6 sm:w-6 text-[#1B5E3C]" />
                    </div>
                    <Badge variant="secondary" className="text-[10px] sm:text-xs">
                      Step {currentStep + 1}
                    </Badge>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">{currentDemoStep.title}</h2>
                  <p className="text-sm sm:text-base text-muted-foreground">{currentDemoStep.subtitle}</p>
                </div>

                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {currentDemoStep.description}
                </p>

                {/* Navigation Buttons */}
                <div className="flex gap-3 pt-2 sm:pt-4">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                    className="flex-1 bg-transparent text-xs sm:text-sm h-9 sm:h-10"
                  >
                    <ChevronLeft className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Previous
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={currentStep === demoSteps.length - 1}
                    className="flex-1 bg-[#1B5E3C] hover:bg-[#154a30] text-xs sm:text-sm h-9 sm:h-10"
                  >
                    Next
                    <ChevronRight className="ml-1.5 sm:ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </Button>
                </div>

                {currentStep === demoSteps.length - 1 && (
                  <Card className="bg-[#1B5E3C]/5 border-[#1B5E3C]/20">
                    <CardContent className="p-3 sm:p-4">
                      <h4 className="font-semibold text-[#1B5E3C] mb-1.5 sm:mb-2 text-sm sm:text-base">
                        Ready to see it in action?
                      </h4>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
                        Schedule a call to discuss how AgroBridge can help with your supply needs.
                      </p>
                      <Button
                        size="sm"
                        className="w-full bg-[#1B5E3C] hover:bg-[#154a30] text-xs sm:text-sm h-8 sm:h-9"
                        asChild
                      >
                        <Link href="/#contact">
                          <Phone className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          Schedule a Call
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Demo Component */}
              <div className="lg:col-span-3 order-1 lg:order-2">
                <DemoComponent />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer CTA */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 border-t bg-muted/30">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Ready to secure reliable supply?</h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
            Join buyers who use AgroBridge to get predictable supply with full visibility and quality assurance.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button size="lg" className="bg-[#1B5E3C] hover:bg-[#154a30] text-sm sm:text-base h-10 sm:h-11" asChild>
              <Link href="/#contact">
                <Phone className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Discuss Your Supply Needs
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-sm sm:text-base h-10 sm:h-11 bg-transparent" asChild>
              <Link href="/">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
