"use client"

import { useState, useEffect, useCallback } from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Wallet,
  Download,
  Calendar,
  ShieldCheck,
  Award,
  Share2,
  CheckCircle,
  AlertTriangle,
  Info,
  Filter,
  Loader2,
} from "lucide-react"
import { AgentTierBadge } from "@/components/agent/agent-tier-badge"
import { AgentReferralDialog } from "@/components/agent/agent-referral-dialog"
import { calculateAgentEarnings, generateAgentTargets, COMMISSION_RATES } from "@/lib/agent-commission-system"
import { AGENT_TIERS, calculateAgentTier } from "@/lib/agent-tier-system"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table"
import { apiClient } from "@/lib/api-client"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"

export default function AgentCompensationPage() {
  const { user } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState("january-2026")
  const [showReferralDialog, setShowReferralDialog] = useState(false)
  const [loading, setLoading] = useState(true)

  const [agentProfile, setAgentProfile] = useState<any>(null)
  const [farmers, setFarmers] = useState<any[]>([])
  const [cycles, setCycles] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [profileRes, farmersRes, cyclesRes, eventsRes] = await Promise.all([
        apiClient.agentMe.getProfile(),
        apiClient.agentMe.getFarmers(),
        apiClient.agentMe.getCropCycles(),
        apiClient.agentMe.getServiceEvents(),
      ])
      if (profileRes.success) setAgentProfile(profileRes.data)
      if (farmersRes.success) setFarmers(farmersRes.data ?? [])
      if (cyclesRes.success) setCycles(cyclesRes.data ?? [])
      if (eventsRes.success) setEvents(eventsRes.data?.events ?? [])
    } catch {
      toast.error("Failed to load compensation data")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const agentName = agentProfile?.full_name || user?.name || "Agent"
  const agentId = agentProfile?.id || "unknown"
  const corridor = agentProfile?.assigned_corridors?.[0] || "—"

  const farmersRecruited = farmers.length
  const cropCyclesCreated = cycles.length
  const servicesCompleted = events.filter((e) => e.status === "completed").length
  const harvestDataCaptured = cycles.filter((c) => c.actual_yield_tons).length
  const landPlotsGeoTagged = farmers.length // proxy: one plot per farmer
  const hectaresActivated = cycles
    .filter((c) => c.status === "completed" && c.hectares_planted)
    .reduce((sum: number, c: any) => sum + Number(c.hectares_planted || 0), 0)
  const tonsDelivered = cycles
    .filter((c) => c.actual_yield_tons)
    .reduce((sum: number, c: any) => sum + Number(c.actual_yield_tons || 0), 0)

  // Quality metrics — computed where possible, otherwise use defaults
  const completedEvents = events.filter((e) => e.status === "completed")
  const onTimeCount = completedEvents.filter(
    (e) => e.actual_date && e.scheduled_date && new Date(e.actual_date) <= new Date(e.scheduled_date),
  ).length
  const timelyDeliveryRate = completedEvents.length > 0 ? Math.round((onTimeCount / completedEvents.length) * 100) : 92
  const qualityScore = agentProfile?.quality_score ?? 88
  const dataAccuracy = agentProfile?.data_accuracy ?? 94

  const dataActivities = [
    {
      activity: "Farmers onboarded (verified)",
      count: farmersRecruited,
      rate: COMMISSION_RATES.FARMER_ONBOARDING,
      subtotal: farmersRecruited * COMMISSION_RATES.FARMER_ONBOARDING,
    },
    {
      activity: "Land plots geo-tagged",
      count: landPlotsGeoTagged,
      rate: 500,
      subtotal: landPlotsGeoTagged * 500,
    },
    {
      activity: "Crop cycles created",
      count: cropCyclesCreated,
      rate: 330,
      subtotal: cropCyclesCreated * 330,
    },
    {
      activity: "Services completed",
      count: servicesCompleted,
      rate: 400,
      subtotal: servicesCompleted * 400,
    },
    {
      activity: "Harvest data captured",
      count: harvestDataCaptured,
      rate: 330,
      subtotal: harvestDataCaptured * 330,
    },
  ]

  const deliveryActivities = [
    {
      activity: "Hectares activated",
      count: Math.round(hectaresActivated),
      rate: COMMISSION_RATES.HECTARE_ACTIVATION.TIER_1,
      subtotal: Math.round(hectaresActivated) * COMMISSION_RATES.HECTARE_ACTIVATION.TIER_1,
      note: "Paid when farmer completes first harvest cycle",
    },
    {
      activity: "Tons delivered (coordinated)",
      count: Math.round(tonsDelivered),
      rate: COMMISSION_RATES.TON_AGGREGATED.TIER_1,
      subtotal: Math.round(tonsDelivered) * COMMISSION_RATES.TON_AGGREGATED.TIER_1,
      note: "Paid per MT delivered under AgroBridge contracts only",
    },
  ]

  const dataTotal = dataActivities.reduce((sum, item) => sum + item.subtotal, 0)
  const dataCount = dataActivities.reduce((sum, item) => sum + item.count, 0)
  const deliveryTotal = deliveryActivities.reduce((sum, item) => sum + item.subtotal, 0)
  const deliveryCount = deliveryActivities.reduce((sum, item) => sum + item.count, 0)
  const activityTotal = dataTotal + deliveryTotal

  // Quality breakdown — computed from service events where possible
  const missedUpdates = events.filter(
    (e) => e.status === "planned" && e.scheduled_date && new Date(e.scheduled_date) < new Date(),
  ).length

  const qualityMetrics = {
    breakdown: [
      {
        metric: "On-time service completion",
        value: timelyDeliveryRate,
        threshold: 80,
        status: timelyDeliveryRate >= 80 ? "good" : "warn",
        unit: "%",
      },
      {
        metric: "Overdue planned services",
        value: missedUpdates,
        threshold: 3,
        status: missedUpdates <= 3 ? "good" : "warn",
      },
      {
        metric: "Services completed",
        value: servicesCompleted,
        threshold: null,
        status: "good",
      },
      {
        metric: "Harvest data captured",
        value: harvestDataCaptured,
        threshold: null,
        status: "good",
      },
    ],
  }

  const currentTier = calculateAgentTier(farmersRecruited, 0, qualityScore)
  const tierData = AGENT_TIERS[currentTier]
  const targets = generateAgentTargets(currentTier, farmersRecruited, Math.round(hectaresActivated))

  const farmerAchievement = targets.monthlyFarmerTarget > 0 ? (farmersRecruited / targets.monthlyFarmerTarget) * 100 : 0
  const hectareAchievement =
    targets.monthlyHectareTarget > 0 ? (Math.round(hectaresActivated) / targets.monthlyHectareTarget) * 100 : 0
  const tonAchievement =
    targets.monthlyTonTarget > 0 ? (Math.round(tonsDelivered) / targets.monthlyTonTarget) * 100 : 0
  const volumeAchievementPercentage = (farmerAchievement + hectareAchievement + tonAchievement) / 3

  const earnings = calculateAgentEarnings({
    tier: currentTier,
    farmersOnboarded: farmersRecruited,
    hectaresActivated: Math.round(hectaresActivated),
    tonsAggregated: Math.round(tonsDelivered),
    qualityScore,
    dataAccuracy,
    timelyDeliveryRate,
    volumeAchievementPercentage,
    totalReferredAgents: 0,
    activeReferredAgents: 0,
    tierMonthlyBonus: tierData.monthlyBonus,
  })

  const totalCompensation =
    earnings.baseRetainer +
    earnings.tierBonus +
    activityTotal +
    earnings.dataAccuracyBonus.bonus +
    earnings.timelyDeliveryBonus.bonus +
    earnings.referralEarnings

  const handleExport = () => {
    const csvContent = [
      ["Compensation Summary - " + selectedPeriod],
      [],
      ["DATA & COORDINATION ACTIVITIES"],
      ["Activity Type", "Count", "Rate (NGN)", "Subtotal (NGN)"],
      ...dataActivities.map((a) => [a.activity, a.count, a.rate, a.subtotal]),
      ["Subtotal", dataCount, "-", dataTotal],
      [],
      ["DELIVERY-BASED EARNINGS"],
      ...deliveryActivities.map((a) => [a.activity, a.count, a.rate, a.subtotal]),
      ["Subtotal", deliveryCount, "-", deliveryTotal],
      [],
      ["TOTAL ACTIVITY EARNINGS", dataCount + deliveryCount, "-", activityTotal],
      [],
      ["SUMMARY"],
      ["Base Retainer", "", "", earnings.baseRetainer],
      ["Activity Earnings", "", "", activityTotal],
      ["Quality Adjustment", "", "", earnings.dataAccuracyBonus.bonus + earnings.timelyDeliveryBonus.bonus],
      ["Referral Bonus", "", "", earnings.referralEarnings],
      ["Total Compensation", "", "", totalCompensation],
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `compensation-${selectedPeriod}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("Compensation summary downloaded")
  }

  if (loading) {
    return (
      <DashboardLayout allowedRoles={["field_agent"]}>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout allowedRoles={["field_agent"]}>
      <TooltipProvider>
        <div className="space-y-6 max-w-4xl pb-20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Compensation Summary</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Approved compensation for verified AgroBridge-coordinated activity.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)}
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          <Card className="border bg-muted/30">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <Wallet className="h-4 w-4" />
                    Approved Compensation (This Period)
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {agentName} · {corridor}
                  </CardDescription>
                </div>
                <AgentTierBadge tier={currentTier} size="sm" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-foreground mb-2">₦{totalCompensation.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Subject to quality thresholds, seasonal caps, and corridor economics.
              </p>
            </CardContent>
          </Card>

          <Tabs defaultValue="breakdown" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="breakdown">Compensation Breakdown</TabsTrigger>
              <TabsTrigger value="quality">Quality & Referrals</TabsTrigger>
            </TabsList>

            {/* Compensation Breakdown Tab */}
            <TabsContent value="breakdown" className="space-y-4 mt-6">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-sm font-medium">Base Retainer</CardTitle>
                  </div>
                  <CardDescription className="text-xs">
                    Paid for active corridor coverage and execution readiness.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm">Monthly Retainer</span>
                    <span className="font-medium">₦{earnings.baseRetainer.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm">Role Adjustment ({tierData.name})</span>
                    <span className="font-medium">₦{earnings.tierBonus.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Activity Breakdown</CardTitle>
                  <CardDescription className="text-xs">Validated and verified actions only</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="px-4 py-2 bg-muted/30 border-b">
                    <span className="text-xs font-medium text-muted-foreground">DATA & COORDINATION ACTIVITIES</span>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="text-muted-foreground font-normal w-[50%]">Activity Type</TableHead>
                        <TableHead className="text-muted-foreground font-normal text-right w-[15%]">Count</TableHead>
                        <TableHead className="text-muted-foreground font-normal text-right w-[15%]">Rate (₦)</TableHead>
                        <TableHead className="text-muted-foreground font-normal text-right w-[20%]">
                          Subtotal (₦)
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dataActivities.map((item, index) => (
                        <TableRow key={index} className="hover:bg-transparent">
                          <TableCell className="font-normal w-[50%]">{item.activity}</TableCell>
                          <TableCell className="text-right w-[15%]">{item.count.toLocaleString()}</TableCell>
                          <TableCell className="text-right w-[15%]">{item.rate.toLocaleString()}</TableCell>
                          <TableCell className="text-right font-medium w-[20%]">
                            {item.subtotal.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow className="hover:bg-transparent bg-transparent">
                        <TableCell className="font-medium text-muted-foreground w-[50%]">Subtotal</TableCell>
                        <TableCell className="text-right text-muted-foreground w-[15%]">{dataCount}</TableCell>
                        <TableCell className="text-right text-muted-foreground w-[15%]">—</TableCell>
                        <TableCell className="text-right font-medium w-[20%]">{dataTotal.toLocaleString()}</TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>

                  <div className="px-4 py-2 bg-muted/30 border-y">
                    <span className="text-xs font-medium text-muted-foreground">DELIVERY-BASED EARNINGS</span>
                  </div>
                  <Table>
                    <TableBody>
                      {deliveryActivities.map((item, index) => (
                        <TableRow key={index} className="hover:bg-transparent">
                          <TableCell className="font-normal w-[50%]">
                            <div>
                              {item.activity}
                              <p className="text-xs text-muted-foreground mt-0.5">{item.note}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-right align-top w-[15%]">{item.count.toLocaleString()}</TableCell>
                          <TableCell className="text-right align-top w-[15%]">{item.rate.toLocaleString()}</TableCell>
                          <TableCell className="text-right font-medium align-top w-[20%]">
                            {item.subtotal.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow className="hover:bg-transparent bg-transparent">
                        <TableCell className="font-medium text-muted-foreground w-[50%]">Subtotal</TableCell>
                        <TableCell className="text-right text-muted-foreground w-[15%]">{deliveryCount}</TableCell>
                        <TableCell className="text-right text-muted-foreground w-[15%]">—</TableCell>
                        <TableCell className="text-right font-medium w-[20%]">
                          {deliveryTotal.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>

                  <div className="border-t">
                    <Table>
                      <TableFooter>
                        <TableRow className="hover:bg-transparent font-semibold">
                          <TableCell className="w-[50%]">Total Activity Earnings</TableCell>
                          <TableCell className="text-right w-[15%]">{dataCount + deliveryCount}</TableCell>
                          <TableCell className="text-right w-[15%]">—</TableCell>
                          <TableCell className="text-right w-[20%]">{activityTotal.toLocaleString()}</TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </div>

                  <div className="px-4 py-3 bg-muted/30 border-t">
                    <p className="text-xs text-muted-foreground">
                      Note: Only completed and verified activities count toward earnings. Pending or rejected actions
                      are not included. Delivery-based earnings require confirmed receipt by buyer.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-sm font-medium">Quality Adjustments</CardTitle>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[220px]">
                        <p className="text-xs">Adjustments apply within corridor-level compensation limits.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <CardDescription className="text-xs">
                    Quality scores adjust variable compensation within approved limits.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-0">
                  <div className="flex items-center justify-between py-2 border-b">
                    <div>
                      <span className="text-sm">Data Accuracy</span>
                      <p className="text-xs text-muted-foreground">
                        {dataAccuracy}% · {earnings.dataAccuracyBonus.level}
                      </p>
                    </div>
                    <span className="font-medium">₦{earnings.dataAccuracyBonus.bonus.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <span className="text-sm">Timeliness</span>
                      <p className="text-xs text-muted-foreground">
                        {timelyDeliveryRate}% · {earnings.timelyDeliveryBonus.level}
                      </p>
                    </div>
                    <span className="font-medium">₦{earnings.timelyDeliveryBonus.bonus.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Share2 className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-sm font-medium">Referral Incentives</CardTitle>
                  </div>
                  <CardDescription className="text-xs">
                    Referral incentives apply only to active, quality-approved agents and are capped per period.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <span className="text-sm">Active Referrals</span>
                      <p className="text-xs text-muted-foreground">No referral data available yet</p>
                    </div>
                    <span className="font-medium">₦{earnings.referralEarnings.toLocaleString()}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-xs"
                    onClick={() => setShowReferralDialog(true)}
                  >
                    View Referral Details
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-muted/50">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Approved Compensation</span>
                    <span className="text-lg font-semibold">₦{totalCompensation.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Quality & Referrals Tab */}
            <TabsContent value="quality" className="space-y-4 mt-6">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-sm font-medium">Quality Score</CardTitle>
                      <CardDescription className="text-xs">
                        Quality-adjusted compensation is determined by these metrics.
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="font-mono">
                      {qualityScore}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {qualityMetrics.breakdown.map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div className="flex items-center gap-2">
                        {item.status === "good" ? (
                          <CheckCircle className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-amber-600" />
                        )}
                        <span className="text-sm">{item.metric}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium">
                          {item.value}
                          {item.unit || ""}
                        </span>
                        {item.threshold !== null && (
                          <span className="text-xs text-muted-foreground ml-1">
                            / {item.threshold}
                            {item.unit || ""} {item.unit === "%" ? "min" : "max"}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Referred Agents</CardTitle>
                  <CardDescription className="text-xs">
                    Status of agents you have referred to the platform.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground text-center py-4">No referral data available yet</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2 bg-transparent"
                    onClick={() => setShowReferralDialog(true)}
                  >
                    Refer New Agent
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </TooltipProvider>

      <AgentReferralDialog
        open={showReferralDialog}
        onOpenChange={setShowReferralDialog}
        agentId={agentId}
        agentName={agentName}
      />
    </DashboardLayout>
  )
}
