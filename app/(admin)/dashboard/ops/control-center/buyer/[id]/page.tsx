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
  ArrowLeft,
  Building2,
  FileText,
  Truck,
  Wallet,
  MapPin,
  Phone,
  Mail,
  Calendar,
  TrendingUp,
  Package,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ExternalLink,
} from "lucide-react"
import { toast } from "sonner"

// Mock buyer data
function getBuyerData(id: string) {
  const buyers: Record<string, any> = {
    "buyer-001": {
      id: "buyer-001",
      name: "Olam Nigeria",
      status: "active",
      contactPerson: "Chidi Okonkwo",
      email: "c.okonkwo@olam.com",
      phone: "+234 803 456 7890",
      address: "Plot 12, Industrial Estate, Ikeja, Lagos",
      contractsCount: 3,
      totalVolume: 2500,
      deliveredVolume: 1850,
      pendingVolume: 650,
      paymentStatus: "current",
      corridors: ["Kaduna North", "Kaduna Central"],
      contracts: [
        { id: "CON-001", crop: "Maize", volume: 1000, delivered: 750, status: "active", deliveryDate: "2025-02-15" },
        { id: "CON-002", crop: "Soybean", volume: 800, delivered: 600, status: "active", deliveryDate: "2025-03-01" },
        { id: "CON-003", crop: "Sorghum", volume: 700, delivered: 500, status: "active", deliveryDate: "2025-02-28" },
      ],
      deliveries: [
        { id: "DEL-101", date: "2025-01-15", volume: 150, crop: "Maize", status: "verified", corridor: "Kaduna North" },
        { id: "DEL-102", date: "2025-01-18", volume: 200, crop: "Soybean", status: "in_transit", corridor: "Kaduna Central" },
        { id: "DEL-103", date: "2025-01-20", volume: 100, crop: "Maize", status: "pending", corridor: "Kaduna North" },
      ],
      payments: [
        { id: "PAY-001", date: "2025-01-10", amount: 45000000, status: "completed", reference: "TRF/2025/001" },
        { id: "PAY-002", date: "2025-01-05", amount: 32000000, status: "completed", reference: "TRF/2025/002" },
      ],
    },
    "buyer-002": {
      id: "buyer-002",
      name: "Flour Mills of Nigeria",
      status: "active",
      contactPerson: "Adaeze Nwosu",
      email: "a.nwosu@fmn.com",
      phone: "+234 805 123 4567",
      address: "2 Apapa Oshodi Expressway, Lagos",
      contractsCount: 2,
      totalVolume: 1800,
      deliveredVolume: 1200,
      pendingVolume: 600,
      paymentStatus: "current",
      corridors: ["Kaduna North"],
      contracts: [
        { id: "CON-004", crop: "Maize", volume: 1200, delivered: 800, status: "active", deliveryDate: "2025-02-20" },
        { id: "CON-005", crop: "Rice", volume: 600, delivered: 400, status: "active", deliveryDate: "2025-03-15" },
      ],
      deliveries: [
        { id: "DEL-201", date: "2025-01-12", volume: 200, crop: "Maize", status: "verified", corridor: "Kaduna North" },
        { id: "DEL-202", date: "2025-01-16", volume: 150, crop: "Rice", status: "received", corridor: "Kaduna North" },
      ],
      payments: [
        { id: "PAY-003", date: "2025-01-08", amount: 28000000, status: "completed", reference: "TRF/2025/003" },
      ],
    },
    "buyer-003": {
      id: "buyer-003",
      name: "Dangote Farms",
      status: "active",
      contactPerson: "Ibrahim Musa",
      email: "i.musa@dangote.com",
      phone: "+234 807 987 6543",
      address: "Dangote House, Kano",
      contractsCount: 1,
      totalVolume: 1000,
      deliveredVolume: 450,
      pendingVolume: 550,
      paymentStatus: "overdue",
      corridors: ["Kano South"],
      contracts: [
        { id: "CON-006", crop: "Maize", volume: 1000, delivered: 450, status: "active", deliveryDate: "2025-03-01" },
      ],
      deliveries: [
        { id: "DEL-301", date: "2025-01-14", volume: 200, crop: "Maize", status: "verified", corridor: "Kano South" },
        { id: "DEL-302", date: "2025-01-19", volume: 250, crop: "Maize", status: "pending", corridor: "Kano South" },
      ],
      payments: [
        { id: "PAY-004", date: "2024-12-20", amount: 15000000, status: "overdue", reference: "TRF/2024/045" },
      ],
    },
  }
  return buyers[id] || buyers["buyer-001"]
}

export default function BuyerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const buyerId = params.id as string
  const buyer = getBuyerData(buyerId)

  const deliveryProgress = Math.round((buyer.deliveredVolume / buyer.totalVolume) * 100)

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
              <h1 className="text-2xl font-bold text-foreground">{buyer.name}</h1>
              <Badge
                variant="outline"
                className={
                  buyer.status === "active"
                    ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                    : "bg-slate-100 text-slate-700 border-slate-200"
                }
              >
                {buyer.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Buyer Profile & Activity</p>
          </div>
          <Link href="/dashboard/ops/contracts">
            <Button variant="outline">
              View All Contracts
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{buyer.contractsCount}</p>
                  <p className="text-xs text-muted-foreground">Active Contracts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                  <Package className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{buyer.totalVolume.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total Volume (MT)</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                  <CheckCircle2 className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{buyer.deliveredVolume.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Delivered (MT)</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{buyer.pendingVolume.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Pending (MT)</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className={buyer.paymentStatus === "overdue" ? "border-red-200 bg-red-50" : "border-border/50"}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${buyer.paymentStatus === "overdue" ? "bg-red-100" : "bg-emerald-100"}`}>
                  <Wallet className={`h-5 w-5 ${buyer.paymentStatus === "overdue" ? "text-red-600" : "text-emerald-600"}`} />
                </div>
                <div>
                  <p className={`text-lg font-bold capitalize ${buyer.paymentStatus === "overdue" ? "text-red-700" : ""}`}>
                    {buyer.paymentStatus}
                  </p>
                  <p className="text-xs text-muted-foreground">Payment Status</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Delivery Progress */}
        <Card className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Overall Delivery Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-muted rounded-full h-3">
                <div
                  className="bg-emerald-600 h-3 rounded-full transition-all"
                  style={{ width: `${deliveryProgress}%` }}
                />
              </div>
              <span className="text-sm font-medium">{deliveryProgress}%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {buyer.deliveredVolume.toLocaleString()} MT delivered of {buyer.totalVolume.toLocaleString()} MT contracted
            </p>
          </CardContent>
        </Card>

        {/* Contact & Details */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground w-24">Contact:</span>
                <span className="font-medium">{buyer.contactPerson}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{buyer.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{buyer.email}</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span>{buyer.address}</span>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Coverage</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">Active in corridors:</p>
              <div className="flex flex-wrap gap-2">
                {buyer.corridors.map((corridor: string) => (
                  <Badge key={corridor} variant="secondary">{corridor}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Contracts, Deliveries, Payments */}
        <Tabs defaultValue="contracts" className="space-y-4">
          <TabsList>
            <TabsTrigger value="contracts">Contracts ({buyer.contracts.length})</TabsTrigger>
            <TabsTrigger value="deliveries">Recent Deliveries ({buyer.deliveries.length})</TabsTrigger>
            <TabsTrigger value="payments">Payments ({buyer.payments.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="contracts">
            <Card className="border-border/50">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Contract ID</TableHead>
                      <TableHead>Crop</TableHead>
                      <TableHead className="text-right">Volume (MT)</TableHead>
                      <TableHead className="text-right">Delivered</TableHead>
                      <TableHead className="text-right">Progress</TableHead>
                      <TableHead>Delivery Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {buyer.contracts.map((contract: any) => {
                      const progress = Math.round((contract.delivered / contract.volume) * 100)
                      return (
                        <TableRow key={contract.id}>
                          <TableCell className="font-medium">{contract.id}</TableCell>
                          <TableCell>{contract.crop}</TableCell>
                          <TableCell className="text-right">{contract.volume.toLocaleString()}</TableCell>
                          <TableCell className="text-right">{contract.delivered.toLocaleString()}</TableCell>
                          <TableCell className="text-right">{progress}%</TableCell>
                          <TableCell>{contract.deliveryDate}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-200">
                              {contract.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deliveries">
            <Card className="border-border/50">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Delivery ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Crop</TableHead>
                      <TableHead className="text-right">Volume (MT)</TableHead>
                      <TableHead>Corridor</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {buyer.deliveries.map((delivery: any) => (
                      <TableRow key={delivery.id}>
                        <TableCell className="font-medium">{delivery.id}</TableCell>
                        <TableCell>{delivery.date}</TableCell>
                        <TableCell>{delivery.crop}</TableCell>
                        <TableCell className="text-right">{delivery.volume.toLocaleString()}</TableCell>
                        <TableCell>{delivery.corridor}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              delivery.status === "verified"
                                ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                : delivery.status === "in_transit"
                                ? "bg-blue-100 text-blue-700 border-blue-200"
                                : delivery.status === "received"
                                ? "bg-purple-100 text-purple-700 border-purple-200"
                                : "bg-amber-100 text-amber-700 border-amber-200"
                            }
                          >
                            {delivery.status.replace("_", " ")}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card className="border-border/50">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payment ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Amount (NGN)</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {buyer.payments.map((payment: any) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.id}</TableCell>
                        <TableCell>{payment.date}</TableCell>
                        <TableCell className="text-right">{payment.amount.toLocaleString()}</TableCell>
                        <TableCell>{payment.reference}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              payment.status === "completed"
                                ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                : "bg-red-100 text-red-700 border-red-200"
                            }
                          >
                            {payment.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
