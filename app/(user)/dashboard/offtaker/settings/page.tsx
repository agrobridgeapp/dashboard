"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Building2, Bell, Shield, FileText, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { apiClient } from "@/lib/api-client"

type CollectionCenter = { id: string; name: string; address: string }

export default function OfftakerSettingsPage() {
  const [saving, setSaving] = useState(false)
  const [profileLoading, setProfileLoading] = useState(true)
  const [companyName, setCompanyName] = useState("")
  const [registrationNumber, setRegistrationNumber] = useState("")
  const [businessType, setBusinessType] = useState("")
  const [annualVolume, setAnnualVolume] = useState("")
  const [businessAddress, setBusinessAddress] = useState("")
  const [paymentTerms, setPaymentTerms] = useState("")
  const [qualityGrade, setQualityGrade] = useState("")
  const [standardTerms, setStandardTerms] = useState("")
  const [savingContracts, setSavingContracts] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [savingPassword, setSavingPassword] = useState(false)

  const [addCenterOpen, setAddCenterOpen] = useState(false)
  const [editCenterOpen, setEditCenterOpen] = useState(false)
  const [centers, setCenters] = useState<CollectionCenter[]>([])
  const [centersLoading, setCentersLoading] = useState(true)
  const [selectedCenter, setSelectedCenter] = useState<CollectionCenter | null>(null)
  const [addName, setAddName] = useState("")
  const [addAddress, setAddAddress] = useState("")
  const [addSubmitting, setAddSubmitting] = useState(false)
  const [editName, setEditName] = useState("")
  const [editAddress, setEditAddress] = useState("")
  const [editSubmitting, setEditSubmitting] = useState(false)

  useEffect(() => {
    apiClient.profile.get()
      .then((res: any) => {
        const d = res.data ?? {}
        setCompanyName(d.company_name ?? "")
        setRegistrationNumber(d.rc_number ?? "")
        setBusinessType(d.business_type ?? "")
        setAnnualVolume(d.annual_volume_mt != null ? String(d.annual_volume_mt) : "")
        setBusinessAddress(d.address ?? "")
        setPaymentTerms(d.payment_terms ?? "")
        setQualityGrade(d.quality_grade ?? "")
        setStandardTerms(d.standard_terms ?? "")
      })
      .catch(() => {})
      .finally(() => setProfileLoading(false))
  }, [])

  useEffect(() => {
    apiClient.collectionCenters.list()
      .then((res: any) => setCenters(res.data ?? []))
      .catch(() => toast.error("Failed to load collection centers"))
      .finally(() => setCentersLoading(false))
  }, [])

  const handleSaveCompanyInfo = async () => {
    setSaving(true)
    try {
      await apiClient.profile.update({
        company_name: companyName,
        rc_number: registrationNumber,
        business_type: businessType,
        annual_volume_mt: annualVolume ? Number(annualVolume) : null,
        address: businessAddress,
      })
      toast.success("Company information saved")
    } catch {
      toast.error("Failed to save company information")
    } finally {
      setSaving(false)
    }
  }

  const handleSaveContractDefaults = async () => {
    setSavingContracts(true)
    try {
      await apiClient.profile.update({
        payment_terms: paymentTerms,
        quality_grade: qualityGrade,
        standard_terms: standardTerms,
      })
      toast.success("Contract defaults saved")
    } catch {
      toast.error("Failed to save contract defaults")
    } finally {
      setSavingContracts(false)
    }
  }

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields")
      return
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters")
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match")
      return
    }
    setSavingPassword(true)
    try {
      await apiClient.auth.changePassword(currentPassword, newPassword)
      toast.success("Password updated successfully")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err: any) {
      toast.error(err?.message || "Failed to update password")
    } finally {
      setSavingPassword(false)
    }
  }

  const handleSave = async (message: string) => {
    setSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setSaving(false)
    toast.success(message)
  }

  const handleEditCenter = (center: CollectionCenter) => {
    setSelectedCenter(center)
    setEditName(center.name)
    setEditAddress(center.address)
    setEditCenterOpen(true)
  }

  const handleAddCenter = async () => {
    if (!addName.trim() || !addAddress.trim()) return
    setAddSubmitting(true)
    try {
      const res: any = await apiClient.collectionCenters.create({ name: addName.trim(), address: addAddress.trim() })
      setCenters((prev) => [...prev, res.data])
      setAddName("")
      setAddAddress("")
      setAddCenterOpen(false)
      toast.success("Collection center added")
    } catch {
      toast.error("Failed to add collection center")
    } finally {
      setAddSubmitting(false)
    }
  }

  const handleUpdateCenter = async () => {
    if (!selectedCenter || !editName.trim() || !editAddress.trim()) return
    setEditSubmitting(true)
    try {
      const res: any = await apiClient.collectionCenters.update(selectedCenter.id, { name: editName.trim(), address: editAddress.trim() })
      setCenters((prev) => prev.map((c) => (c.id === selectedCenter.id ? res.data : c)))
      setEditCenterOpen(false)
      toast.success("Collection center updated")
    } catch {
      toast.error("Failed to update collection center")
    } finally {
      setEditSubmitting(false)
    }
  }

  const handleDeleteCenter = async (id: string) => {
    try {
      await apiClient.collectionCenters.delete(id)
      setCenters((prev) => prev.filter((c) => c.id !== id))
      toast.success("Collection center removed")
    } catch {
      toast.error("Failed to remove collection center")
    }
  }

  return (
    <DashboardLayout role="offtaker">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your company profile and preferences</p>
        </div>

        <Tabs defaultValue="company">
          <TabsList>
            <TabsTrigger value="company" className="gap-2">
              <Building2 className="h-4 w-4" />
              Company
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="contracts" className="gap-2">
              <FileText className="h-4 w-4" />
              Contracts
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="company" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>Update your company details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {profileLoading ? (
                  <p className="text-sm text-muted-foreground">Loading...</p>
                ) : (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Company Name</Label>
                        <Input
                          placeholder="Enter company name"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Registration Number</Label>
                        <Input
                          placeholder="e.g. RC-123456"
                          value={registrationNumber}
                          onChange={(e) => setRegistrationNumber(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Business Type</Label>
                        <Select value={businessType} onValueChange={setBusinessType}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select business type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="processor">Food Processor</SelectItem>
                            <SelectItem value="exporter">Exporter</SelectItem>
                            <SelectItem value="retailer">Retailer</SelectItem>
                            <SelectItem value="wholesaler">Wholesaler</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Annual Volume Capacity (MT)</Label>
                        <Input
                          type="number"
                          placeholder="e.g. 5000"
                          value={annualVolume}
                          onChange={(e) => setAnnualVolume(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Business Address</Label>
                      <Textarea
                        placeholder="Enter business address"
                        value={businessAddress}
                        onChange={(e) => setBusinessAddress(e.target.value)}
                      />
                    </div>
                    <Button
                      className="bg-[#1B5E3C] hover:bg-[#154a30]"
                      onClick={handleSaveCompanyInfo}
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Collection Centers</CardTitle>
                <CardDescription>Manage your delivery locations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {centersLoading ? (
                  <p className="text-sm text-muted-foreground">Loading...</p>
                ) : centers.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No collection centers added yet.</p>
                ) : (
                  centers.map((center) => (
                    <div key={center.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <p className="font-medium">{center.name}</p>
                        <p className="text-sm text-muted-foreground">{center.address}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditCenter(center)}>
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteCenter(center.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
                <Dialog open={addCenterOpen} onOpenChange={setAddCenterOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">Add Collection Center</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Collection Center</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Center Name</Label>
                        <Input
                          placeholder="e.g., Lagos Depot"
                          value={addName}
                          onChange={(e) => setAddName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Address</Label>
                        <Textarea
                          placeholder="Full address"
                          rows={2}
                          value={addAddress}
                          onChange={(e) => setAddAddress(e.target.value)}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setAddCenterOpen(false)}>
                          Cancel
                        </Button>
                        <Button
                          className="bg-[#1B5E3C] hover:bg-[#154a30]"
                          onClick={handleAddCenter}
                          disabled={addSubmitting || !addName.trim() || !addAddress.trim()}
                        >
                          {addSubmitting ? "Adding..." : "Add Center"}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Configure how you receive updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  {
                    title: "New Deliveries",
                    description: "Get notified when deliveries are scheduled",
                  },
                  {
                    title: "Delivery Arrivals",
                    description: "Alerts when produce arrives at collection centers",
                  },
                  {
                    title: "Contract Milestones",
                    description: "Updates on contract fulfilment progress",
                  },
                  {
                    title: "Quality Alerts",
                    description: "Notifications about quality issues",
                  },
                  {
                    title: "Market Price Updates",
                    description: "Weekly commodity price reports",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <Switch defaultChecked={i < 4} />
                  </div>
                ))}
                <Button
                  className="bg-[#1B5E3C] hover:bg-[#154a30]"
                  onClick={() => handleSave("Notification preferences saved")}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Preferences"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contracts" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Contract Defaults</CardTitle>
                <CardDescription>Set default values for new contracts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {profileLoading ? (
                  <p className="text-sm text-muted-foreground">Loading...</p>
                ) : (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Default Payment Terms</Label>
                        <Select value={paymentTerms} onValueChange={setPaymentTerms}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment terms" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="immediate">Immediate</SelectItem>
                            <SelectItem value="7">7 days</SelectItem>
                            <SelectItem value="14">14 days</SelectItem>
                            <SelectItem value="30">30 days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Minimum Quality Grade</Label>
                        <Select value={qualityGrade} onValueChange={setQualityGrade}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select quality grade" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="a">Grade A Only</SelectItem>
                            <SelectItem value="b">Grade B and above</SelectItem>
                            <SelectItem value="c">Grade C and above</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Standard Terms & Conditions</Label>
                      <Textarea
                        rows={4}
                        placeholder="Enter your standard contract terms and conditions"
                        value={standardTerms}
                        onChange={(e) => setStandardTerms(e.target.value)}
                      />
                    </div>
                    <Button
                      className="bg-[#1B5E3C] hover:bg-[#154a30]"
                      onClick={handleSaveContractDefaults}
                      disabled={savingContracts}
                    >
                      {savingContracts ? "Saving..." : "Save Defaults"}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your account password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Current Password</Label>
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Confirm New Password</Label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <Button
                  className="bg-[#1B5E3C] hover:bg-[#154a30]"
                  onClick={handleChangePassword}
                  disabled={savingPassword}
                >
                  {savingPassword ? "Updating..." : "Update Password"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>Add an extra layer of security</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enable 2FA</p>
                    <p className="text-sm text-muted-foreground">Require verification code on login</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={editCenterOpen} onOpenChange={setEditCenterOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Collection Center</DialogTitle>
            </DialogHeader>
            {selectedCenter && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Center Name</Label>
                  <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Textarea value={editAddress} onChange={(e) => setEditAddress(e.target.value)} rows={2} />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setEditCenterOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    className="bg-[#1B5E3C] hover:bg-[#154a30]"
                    onClick={handleUpdateCenter}
                    disabled={editSubmitting || !editName.trim() || !editAddress.trim()}
                  >
                    {editSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
