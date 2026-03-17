"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function SuperAdminSettings() {
  const [saving, setSaving] = useState(false)
  const [updatingPassword, setUpdatingPassword] = useState(false)

  const handleSaveChanges = async () => {
    setSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSaving(false)
    toast.success("Profile updated successfully")
  }

  const handleUpdatePassword = async () => {
    setUpdatingPassword(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setUpdatingPassword(false)
    toast.success("Password updated successfully")
  }

  return (
    <DashboardLayout role="super_admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your super admin account and preferences</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue="Super Admin" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue="admin@agrobridge.com" />
            </div>
            <Button onClick={handleSaveChanges} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>Manage your password and security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input id="confirm-password" type="password" />
            </div>
            <Button onClick={handleUpdatePassword} disabled={updatingPassword}>
              {updatingPassword ? "Updating..." : "Update Password"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
