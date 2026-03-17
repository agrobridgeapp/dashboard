"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/lib/auth-context"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bell, Shield, Building2, CreditCard } from "lucide-react"
import { toast } from "sonner"

export default function PartnerSettingsPage() {
  const { user } = useAuth()
  const [saving, setSaving] = useState(false)
  const [savingBank, setSavingBank] = useState(false)
  const [updatingPassword, setUpdatingPassword] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSaving(false)
    toast.success("Profile updated successfully")
  }

  const handleSaveBankDetails = async () => {
    setSavingBank(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSavingBank(false)
    toast.success("Bank details saved successfully")
  }

  const handleUpdatePassword = async () => {
    setUpdatingPassword(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setUpdatingPassword(false)
    toast.success("Password updated successfully")
  }

  const handleUploadLogo = () => {
    toast.info("Logo upload dialog would open here")
  }

  return (
    <DashboardLayout allowedRoles={["partner"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your business profile and preferences</p>
        </div>

        <Tabs defaultValue="business" className="space-y-6">
          <TabsList>
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="business">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Business Profile
                </CardTitle>
                <CardDescription>Update your business information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                      {user?.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" onClick={handleUploadLogo}>
                    Upload Logo
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input id="company" defaultValue={user?.companyName} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Partner Type</Label>
                    <Input id="type" defaultValue="Input Supplier" disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Business Email</Label>
                    <Input id="email" type="email" defaultValue={user?.email} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Business Phone</Label>
                    <Input id="phone" defaultValue={user?.phone} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Business Address</Label>
                    <Textarea id="address" placeholder="Enter your business address" rows={2} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="description">Business Description</Label>
                    <Textarea id="description" placeholder="Describe your services..." rows={3} />
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
                    id: "new-jobs",
                    label: "New job assignments",
                    description: "When new jobs are assigned",
                    defaultChecked: true,
                  },
                  {
                    id: "payments",
                    label: "Payment notifications",
                    description: "When payments are processed",
                    defaultChecked: true,
                  },
                  {
                    id: "reminders",
                    label: "Job reminders",
                    description: "Reminders for scheduled jobs",
                    defaultChecked: true,
                  },
                  {
                    id: "ratings",
                    label: "Rating notifications",
                    description: "When farmers rate your service",
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
                <CardDescription>Manage your payment details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
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
                  <div className="space-y-2">
                    <Label>BVN (Optional)</Label>
                    <Input placeholder="Enter BVN" />
                  </div>
                </div>
                <Button onClick={handleSaveBankDetails} disabled={savingBank}>
                  {savingBank ? "Saving..." : "Save Bank Details"}
                </Button>
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
                <Button onClick={handleUpdatePassword} disabled={updatingPassword}>
                  {updatingPassword ? "Updating..." : "Update Password"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
