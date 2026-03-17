"use client"

import { use, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, MapPin, Phone, Mail, Calendar, Tractor, CheckCircle, Clock, User } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

const requestData = {
  id: "REQ-001",
  farmer: {
    name: "Musa Abdullahi",
    phone: "+2349164913269",
    email: "musa@example.com",
    location: "Zaria, Kaduna",
    farmSize: "5 hectares",
    crops: ["Maize", "Sorghum"],
    joinedDate: "March 2023",
  },
  service: "Plowing",
  type: "mechanization",
  status: "pending",
  urgency: "normal",
  requestDate: "January 15, 2024",
  notes: "Need plowing before the rainy season starts. Prefer morning hours.",
  timeline: [
    { date: "Jan 15, 2024", event: "Request submitted", status: "completed" },
    { date: "Jan 15, 2024", event: "Request reviewed", status: "completed" },
    { date: "Pending", event: "Partner assigned", status: "pending" },
    { date: "Pending", event: "Service delivered", status: "pending" },
  ],
}

export default function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [assignPartnerOpen, setAssignPartnerOpen] = useState(false)
  const [updateStatusOpen, setUpdateStatusOpen] = useState(false)
  const { toast } = useToast()

  const handleAssignPartner = () => {
    toast({
      title: "Partner Assigned",
      description: "The service partner has been notified and will contact the farmer.",
    })
    setAssignPartnerOpen(false)
  }

  const handleUpdateStatus = () => {
    toast({
      title: "Status Updated",
      description: "The request status has been updated successfully.",
    })
    setUpdateStatusOpen(false)
  }

  const handleCancelRequest = () => {
    toast({
      title: "Request Cancelled",
      description: "The service request has been cancelled.",
      variant: "destructive",
    })
    router.back()
  }

  return (
    <DashboardLayout allowedRoles={["ops_admin"]}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">Request {resolvedParams.id}</h1>
            <p className="text-muted-foreground">Service request details</p>
          </div>
          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
            {requestData.status}
          </Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Request Details */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Request Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Tractor className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Service Type</p>
                      <p className="font-medium">{requestData.service}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Request Date</p>
                      <p className="font-medium">{requestData.requestDate}</p>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-2">Notes</p>
                  <p className="text-sm">{requestData.notes}</p>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {requestData.timeline.map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${item.status === "completed" ? "bg-emerald-100 text-emerald-600" : "bg-muted text-muted-foreground"}`}
                      >
                        {item.status === "completed" ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Clock className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.event}</p>
                        <p className="text-sm text-muted-foreground">{item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Farmer Profile */}
          <div className="space-y-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Farmer Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14">
                    <AvatarFallback className="bg-primary text-primary-foreground">MA</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{requestData.farmer.name}</p>
                    <p className="text-sm text-muted-foreground">Member since {requestData.farmer.joinedDate}</p>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {requestData.farmer.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {requestData.farmer.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {requestData.farmer.email}
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Farm Size</span>
                    <span className="font-medium">{requestData.farmer.farmSize}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Crops</span>
                    <span className="font-medium">{requestData.farmer.crops.join(", ")}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button className="flex-1" size="sm">
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" onClick={() => setAssignPartnerOpen(true)}>
                  Assign Partner
                </Button>
                <Button variant="outline" className="w-full bg-transparent" onClick={() => setUpdateStatusOpen(true)}>
                  Update Status
                </Button>
                <Button
                  variant="outline"
                  className="w-full text-red-600 hover:text-red-700 bg-transparent"
                  onClick={handleCancelRequest}
                >
                  Cancel Request
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Assign Partner Dialog */}
      <Dialog open={assignPartnerOpen} onOpenChange={setAssignPartnerOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Service Partner</DialogTitle>
            <DialogDescription>Select a partner to fulfill this service request</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Service Partner</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select partner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="partner-1">Agro Mechanization Ltd</SelectItem>
                  <SelectItem value="partner-2">Northern Farm Services</SelectItem>
                  <SelectItem value="partner-3">Kaduna Agri Solutions</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Preferred Date</Label>
              <input type="date" className="w-full h-10 px-3 rounded-md border border-input bg-background" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignPartnerOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignPartner}>Assign Partner</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={updateStatusOpen} onOpenChange={setUpdateStatusOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Request Status</DialogTitle>
            <DialogDescription>Change the status of this service request</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>New Status</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Notes (Optional)</Label>
              <textarea
                className="w-full min-h-[80px] px-3 py-2 text-sm rounded-md border border-input bg-background"
                placeholder="Add any notes about this status change..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpdateStatusOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStatus}>Update Status</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
