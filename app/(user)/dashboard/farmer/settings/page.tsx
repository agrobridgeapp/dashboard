"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth-context"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bell, Shield, CreditCard } from "lucide-react"

export default function FarmerSettingsPage() {
  const { user } = useAuth()
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSaving(false)
  }

  return (
    <DashboardLayout allowedRoles={["farmer"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                      {user?.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline">Change Photo</Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue={user?.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" defaultValue={user?.phone} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" defaultValue={user?.region} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="farmerId">Farmer ID</Label>
                    <Input id="farmerId" defaultValue={user?.farmerId} disabled />
                  </div>
                </div>

                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  {
                    id: "service",
                    label: "Service updates",
                    description: "Updates on your service requests",
                    defaultChecked: true,
                  },
                  {
                    id: "contract",
                    label: "Contract reminders",
                    description: "Delivery and payment reminders",
                    defaultChecked: true,
                  },
                  {
                    id: "weather",
                    label: "Weather alerts",
                    description: "Important weather notifications",
                    defaultChecked: true,
                  },
                  {
                    id: "tips",
                    label: "Farming tips",
                    description: "Seasonal advice and best practices",
                    defaultChecked: false,
                  },
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor={item.id}>{item.label}</Label>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <Switch id={item.id} defaultChecked={item.defaultChecked} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Bank Name</Label>
                    <Input placeholder="Enter bank name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Account Number</Label>
                    <Input placeholder="Enter account number" />
                  </div>
                  <div className="space-y-2">
                    <Label>Account Name</Label>
                    <Input placeholder="Enter account name" />
                  </div>
                </div>
                <Button>Save Bank Details</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Current Password</Label>
                    <Input type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label>New Password</Label>
                    <Input type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirm Password</Label>
                    <Input type="password" />
                  </div>
                </div>
                <Button>Update Password</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
