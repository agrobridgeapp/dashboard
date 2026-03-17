"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  User,
  MapPin,
  Phone,
  Calendar,
  Tractor,
  Package,
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"

const request = {
  id: "REQ-001",
  status: "pending",
  farmer: {
    name: "Musa Abdullahi",
    phone: "+234 803 456 7890",
    location: "Zaria, Kaduna",
    farmSize: "5 hectares",
    crops: ["Maize", "Soybean"],
    memberSince: "March 2023",
  },
  service: {
    type: "Plowing",
    category: "mechanization",
    description: "Full land preparation for planting season",
    requestDate: "January 15, 2024",
    preferredDate: "January 20-25, 2024",
    urgency: "normal",
  },
  history: [
    { date: "Jan 15, 2024", event: "Request submitted", status: "completed" },
    { date: "Jan 15, 2024", event: "Under review", status: "completed" },
    { date: "Pending", event: "Partner assignment", status: "pending" },
    { date: "Pending", event: "Service delivery", status: "pending" },
    { date: "Pending", event: "Completion & feedback", status: "pending" },
  ],
}

const availablePartners = [
  { id: 1, name: "AgriMech Services", rating: 4.8, distance: "12 km", available: true },
  { id: 2, name: "Kaduna Tractors Ltd", rating: 4.5, distance: "25 km", available: true },
  { id: 3, name: "FarmPro Equipment", rating: 4.2, distance: "8 km", available: false },
]

export function ServiceRequestDetail() {
  const [selectedPartner, setSelectedPartner] = useState("")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">Request {request.id}</h1>
              <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                {request.status}
              </Badge>
            </div>
            <p className="text-muted-foreground">Submitted {request.service.requestDate}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Assign Partner</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Service Partner</DialogTitle>
                <DialogDescription>
                  Select a partner to fulfill this {request.service.type.toLowerCase()} request
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-3">
                  {availablePartners.map((partner) => (
                    <div
                      key={partner.id}
                      className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedPartner === partner.id.toString()
                          ? "border-primary bg-primary/5"
                          : partner.available
                            ? "hover:border-primary/50"
                            : "opacity-50 cursor-not-allowed"
                      }`}
                      onClick={() => partner.available && setSelectedPartner(partner.id.toString())}
                    >
                      <div>
                        <p className="font-medium">{partner.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {partner.distance} away • Rating: {partner.rating}/5
                        </p>
                      </div>
                      <Badge variant={partner.available ? "default" : "secondary"}>
                        {partner.available ? "Available" : "Busy"}
                      </Badge>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label>Notes for Partner</Label>
                  <Textarea placeholder="Add any special instructions..." />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button disabled={!selectedPartner}>Confirm Assignment</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="details">
            <TabsList>
              <TabsTrigger value="details">Request Details</TabsTrigger>
              <TabsTrigger value="farmer">Farmer Profile</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-4">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Service Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-start gap-3">
                      <Tractor className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Service Type</p>
                        <p className="font-medium">{request.service.type}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Package className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Category</p>
                        <p className="font-medium capitalize">{request.service.category}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Preferred Date</p>
                        <p className="font-medium">{request.service.preferredDate}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Urgency</p>
                        <p className="font-medium capitalize">{request.service.urgency}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Description</p>
                    <p className="text-sm">{request.service.description}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="farmer" className="mt-4">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Farmer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-start gap-3">
                      <User className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p className="font-medium">{request.farmer.name}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{request.farmer.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="font-medium">{request.farmer.location}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Member Since</p>
                        <p className="font-medium">{request.farmer.memberSince}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Farm Details</p>
                    <p className="text-sm">
                      {request.farmer.farmSize} • Crops: {request.farmer.crops.join(", ")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="mt-4">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Request Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {request.history.map((item, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              item.status === "completed"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {item.status === "completed" ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : (
                              <AlertCircle className="h-4 w-4" />
                            )}
                          </div>
                          {index < request.history.length - 1 && <div className="w-0.5 h-full bg-border flex-1 mt-2" />}
                        </div>
                        <div className="pb-6">
                          <p className="font-medium">{item.event}</p>
                          <p className="text-sm text-muted-foreground">{item.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full bg-transparent" variant="outline">
                Contact Farmer
              </Button>
              <Button className="w-full bg-transparent" variant="outline">
                View Farm on Map
              </Button>
              <Button className="w-full bg-transparent" variant="outline">
                Generate Quote
              </Button>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Update Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Cost Estimate</CardTitle>
              <CardDescription>Based on farm size and service type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Plowing (5 ha)</span>
                  <span>₦75,000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Platform fee (5%)</span>
                  <span>₦3,750</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-medium">
                  <span>Total</span>
                  <span>₦78,750</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
