"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  Building2,
  Tractor,
  MapPin,
  Phone,
  Mail,
  Calendar,
  TrendingUp,
  Star,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ExternalLink,
  Pause,
  Play,
  Wallet,
  Wrench,
  Truck,
  Package,
} from "lucide-react"
import { toast } from "sonner"

// Mock partner data
function getPartnerData(id: string) {
  const partners: Record<string, any> = {
    "partner-001": {
      id: "partner-001",
      name: "FarmMech Nigeria Ltd",
      type: "mechanization",
      status: "active",
      contactPerson: "Chief Emeka Obi",
      email: "contact@farmmech.com.ng",
      phone: "+234 803 456 7890",
      address: "15 Industrial Avenue, Kaduna",
      corridors: ["Kaduna North", "Kaduna Central"],
      joinedDate: "2023-01-15",
      activeJobs: 18,
      completedJobs: 245,
      rating: 4.8,
      pendingSettlement: 1250000,
      completedSettlement: 12500000,
      equipment: [
        { type: "Tractor", count: 12, available: 8 },
        { type: "Plough", count: 15, available: 10 },
        { type: "Sprayer", count: 20, available: 14 },
      ],
      recentJobs: [
        { id: "JOB-001", service: "Land Preparation", farmer: "Ibrahim Musa", status: "completed", date: "2025-01-18", amount: 75000 },
        { id: "JOB-002", service: "Ploughing", farmer: "Amina Bello", status: "in_progress", date: "2025-01-20", amount: 60000 },
        { id: "JOB-003", service: "Harrowing", farmer: "Yusuf Abdullahi", status: "pending", date: "2025-01-22", amount: 45000 },
      ],
      performance: {
        avgCompletionTime: "2.3 days",
        onTimeRate: 94,
        customerSatisfaction: 4.8,
      },
    },
    "partner-002": {
      id: "partner-002",
      name: "AgriInputs Plus",
      type: "input_supply",
      status: "active",
      contactPerson: "Mrs. Adaeze Nwankwo",
      email: "info@agriinputsplus.com",
      phone: "+234 805 123 4567",
      address: "Plot 7, Farm Market, Zaria",
      corridors: ["Kaduna North"],
      joinedDate: "2023-04-01",
      activeJobs: 12,
      completedJobs: 178,
      rating: 4.5,
      pendingSettlement: 850000,
      completedSettlement: 8900000,
      inventory: [
        { item: "NPK Fertilizer", stock: 500, unit: "bags" },
        { item: "Urea", stock: 300, unit: "bags" },
        { item: "Herbicide", stock: 200, unit: "liters" },
      ],
      recentJobs: [
        { id: "JOB-004", service: "Fertilizer Delivery", farmer: "Fatima Garba", status: "completed", date: "2025-01-17", amount: 45000 },
        { id: "JOB-005", service: "Seed Supply", farmer: "Mohammed Sani", status: "completed", date: "2025-01-19", amount: 32000 },
      ],
      performance: {
        avgCompletionTime: "1.5 days",
        onTimeRate: 89,
        customerSatisfaction: 4.5,
      },
    },
    "partner-003": {
      id: "partner-003",
      name: "TransAgro Logistics",
      type: "logistics",
      status: "active",
      contactPerson: "Alhaji Musa Danladi",
      email: "operations@transagro.ng",
      phone: "+234 807 987 6543",
      address: "23 Transport Road, Kaduna",
      corridors: ["Kaduna North", "Kaduna Central", "Niger East"],
      joinedDate: "2022-11-01",
      activeJobs: 25,
      completedJobs: 420,
      rating: 4.6,
      pendingSettlement: 2100000,
      completedSettlement: 25000000,
      fleet: [
        { type: "10-ton Truck", count: 8, available: 5 },
        { type: "5-ton Truck", count: 12, available: 8 },
        { type: "Pickup", count: 6, available: 4 },
      ],
      recentJobs: [
        { id: "JOB-006", service: "Crop Transport", farmer: "Multiple", status: "in_progress", date: "2025-01-20", amount: 150000 },
        { id: "JOB-007", service: "Input Delivery", farmer: "Multiple", status: "completed", date: "2025-01-18", amount: 85000 },
      ],
      performance: {
        avgCompletionTime: "1.8 days",
        onTimeRate: 92,
        customerSatisfaction: 4.6,
      },
    },
  }
  return partners[id] || partners["partner-001"]
}

function getPartnerIcon(type: string) {
  switch (type) {
    case "mechanization":
      return <Tractor className="h-5 w-5 text-emerald-600" />
    case "input_supply":
      return <Package className="h-5 w-5 text-blue-600" />
    case "logistics":
      return <Truck className="h-5 w-5 text-purple-600" />
    default:
      return <Wrench className="h-5 w-5 text-slate-600" />
  }
}

export default function PartnerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const partnerId = params.id as string
  const partner = getPartnerData(partnerId)
  
  const [actionDialogOpen, setActionDialogOpen] = useState(false)
  const [actionType, setActionType] = useState<"suspend" | "reactivate" | "">("")
  const [actionReason, setActionReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handlePartnerAction = (action: "suspend" | "reactivate") => {
    setActionType(action)
    setActionDialogOpen(true)
  }

  const handleSubmitAction = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      toast.success(`Partner ${actionType === "suspend" ? "suspended" : "reactivated"} successfully`)
      setIsSubmitting(false)
      setActionDialogOpen(false)
      setActionReason("")
    }, 1000)
  }

  return (
    <DashboardLayout allowedRoles={["ops_admin", "super_admin"]}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <Building2 className="h-6 w-6 text-emerald-700" />
              <h1 className="text-2xl font-bold text-foreground">{partner.name}</h1>
              <Badge
                variant="outline"
                className={
                  partner.status === "active"
                    ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                    : partner.status === "suspended"
                    ? "bg-red-100 text-red-700 border-red-200"
                    : "bg-slate-100 text-slate-700 border-slate-200"
                }
              >
                {partner.status}
              </Badge>
              <Badge variant="secondary" className="capitalize">
                {partner.type.replace("_", " ")}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Service Partner Profile</p>
          </div>
          <div className="flex gap-2">
            {partner.status === "active" ? (
              <Button variant="outline" className="text-amber-600 border-amber-300 bg-transparent" onClick={() => handlePartnerAction("suspend")}>
                <Pause className="h-4 w-4 mr-2" />
                Suspend Partner
              </Button>
            ) : partner.status === "suspended" ? (
              <Button variant="outline" className="text-emerald-600 border-emerald-300 bg-transparent" onClick={() => handlePartnerAction("reactivate")}>
                <Play className="h-4 w-4 mr-2" />
                Reactivate Partner
              </Button>
            ) : null}
            <Link href="/dashboard/ops/partners">
              <Button variant="outline">
                All Partners
                <ExternalLink className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-6">
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{partner.activeJobs}</p>
                  <p className="text-xs text-muted-foreground">Active Jobs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{partner.completedJobs}</p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
                  <Star className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{partner.rating}</p>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{partner.performance.onTimeRate}%</p>
                  <p className="text-xs text-muted-foreground">On-Time Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
                  <Wallet className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-lg font-bold">NGN {(partner.pendingSettlement / 1000000).toFixed(2)}M</p>
                  <p className="text-xs text-muted-foreground">Pending Settlement</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                  <Wallet className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-lg font-bold">NGN {(partner.completedSettlement / 1000000).toFixed(1)}M</p>
                  <p className="text-xs text-muted-foreground">Total Settled</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact & Coverage */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground w-24">Contact:</span>
                <span className="font-medium">{partner.contactPerson}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{partner.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{partner.email}</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span>{partner.address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Partner since {partner.joinedDate}</span>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Coverage & Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Active in corridors:</p>
                <div className="flex flex-wrap gap-2">
                  {partner.corridors.map((corridor: string) => (
                    <Badge key={corridor} variant="secondary">{corridor}</Badge>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center pt-2 border-t">
                <div>
                  <p className="text-lg font-bold">{partner.performance.avgCompletionTime}</p>
                  <p className="text-xs text-muted-foreground">Avg. Completion</p>
                </div>
                <div>
                  <p className="text-lg font-bold">{partner.performance.onTimeRate}%</p>
                  <p className="text-xs text-muted-foreground">On-Time</p>
                </div>
                <div>
                  <p className="text-lg font-bold">{partner.performance.customerSatisfaction}</p>
                  <p className="text-xs text-muted-foreground">Satisfaction</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="jobs" className="space-y-4">
          <TabsList>
            <TabsTrigger value="jobs">Recent Jobs ({partner.recentJobs.length})</TabsTrigger>
            <TabsTrigger value="resources">
              {partner.type === "mechanization" ? "Equipment" : partner.type === "logistics" ? "Fleet" : "Inventory"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="jobs">
            <Card className="border-border/50">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job ID</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Farmer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Amount (NGN)</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {partner.recentJobs.map((job: any) => (
                      <TableRow key={job.id}>
                        <TableCell className="font-medium">{job.id}</TableCell>
                        <TableCell>{job.service}</TableCell>
                        <TableCell>{job.farmer}</TableCell>
                        <TableCell>{job.date}</TableCell>
                        <TableCell className="text-right">{job.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              job.status === "completed"
                                ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                : job.status === "in_progress"
                                ? "bg-blue-100 text-blue-700 border-blue-200"
                                : "bg-amber-100 text-amber-700 border-amber-200"
                            }
                          >
                            {job.status.replace("_", " ")}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources">
            <Card className="border-border/50">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{partner.type === "input_supply" ? "Item" : "Type"}</TableHead>
                      <TableHead className="text-right">{partner.type === "input_supply" ? "Stock" : "Total"}</TableHead>
                      <TableHead className="text-right">{partner.type === "input_supply" ? "Unit" : "Available"}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(partner.equipment || partner.fleet || partner.inventory || []).map((item: any, idx: number) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{item.type || item.item}</TableCell>
                        <TableCell className="text-right">{item.count || item.stock}</TableCell>
                        <TableCell className="text-right">{item.available || item.unit}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Action Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "suspend" ? "Suspend Partner" : "Reactivate Partner"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "suspend"
                ? "This will suspend the partner and prevent new job assignments."
                : "This will reactivate the partner and allow new job assignments."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                placeholder={actionType === "suspend" ? "Explain why this partner is being suspended..." : "Explain why this partner is being reactivated..."}
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmitAction}
              disabled={isSubmitting || !actionReason}
              className={actionType === "suspend" ? "bg-red-600 hover:bg-red-700" : "bg-emerald-600 hover:bg-emerald-700"}
            >
              {isSubmitting ? "Processing..." : actionType === "suspend" ? "Suspend Partner" : "Reactivate Partner"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
