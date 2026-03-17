"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Share2, Copy, Check, MessageCircle, Mail, LinkIcon } from "lucide-react"
import { toast } from "sonner"

interface AgentReferralDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  agentId: string
  agentName: string
}

export function AgentReferralDialog({ open, onOpenChange, agentId, agentName }: AgentReferralDialogProps) {
  const [copied, setCopied] = useState(false)

  // Generate unique referral code from agent ID
  const safeAgentId = agentId || "000000"
  const referralCode = `AGR-${safeAgentId.toUpperCase().slice(-6)}`
  const referralLink = `${typeof window !== "undefined" ? window.location.origin : ""}/signup/agent?ref=${referralCode}`

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success("Copied to clipboard!")
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error("Failed to copy")
    }
  }

  const shareViaWhatsApp = () => {
    const message = `Join me as an AgroBridge Field Agent! 🌾\n\nEarn income by helping farmers in your community access better prices, inputs, and advisory services.\n\n✅ Flexible work schedule\n✅ Commission + bonuses\n✅ Training provided\n\nSign up with my referral code: ${referralCode}\n\n${referralLink}`
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank")
  }

  const shareViaSMS = () => {
    const message = `Join AgroBridge as a Field Agent! Use my referral code: ${referralCode}. Sign up: ${referralLink}`
    window.open(`sms:?body=${encodeURIComponent(message)}`, "_blank")
  }

  const shareViaEmail = () => {
    const subject = "Join AgroBridge as a Field Agent"
    const body = `Hi!\n\nI'm inviting you to join AgroBridge as a Field Agent. AgroBridge connects farmers with better markets, inputs, and services.\n\nAs a Field Agent, you can:\n- Earn commission and bonuses\n- Work flexible hours\n- Make a real impact in your community\n- Receive comprehensive training\n\nUse my referral code when signing up: ${referralCode}\n\nSign up here: ${referralLink}\n\nLooking forward to working with you!\n\n${agentName}`
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, "_blank")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Refer New Agents
          </DialogTitle>
          <DialogDescription>
            Share your referral code and earn ₦2,000 bonus when they complete onboarding, plus ₦500/month while they
            remain active.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Referral Code */}
          <div className="space-y-2">
            <Label htmlFor="referralCode">Your Referral Code</Label>
            <div className="flex gap-2">
              <Input id="referralCode" value={referralCode} readOnly className="font-mono text-lg" />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(referralCode)}
                className="shrink-0 bg-transparent"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Referral Link */}
          <div className="space-y-2">
            <Label htmlFor="referralLink">Referral Link</Label>
            <div className="flex gap-2">
              <Input id="referralLink" value={referralLink} readOnly className="text-sm" />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(referralLink)}
                className="shrink-0 bg-transparent"
              >
                {copied ? <Check className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Share Options */}
          <div className="space-y-3">
            <Label>Share Via</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" onClick={shareViaWhatsApp} className="gap-2 bg-transparent">
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </Button>
              <Button variant="outline" onClick={shareViaSMS} className="gap-2 bg-transparent">
                <MessageCircle className="h-4 w-4" />
                SMS
              </Button>
              <Button variant="outline" onClick={shareViaEmail} className="gap-2 bg-transparent">
                <Mail className="h-4 w-4" />
                Email
              </Button>
            </div>
          </div>

          {/* Referral Benefits */}
          <div className="rounded-lg bg-muted p-4 space-y-2">
            <p className="text-sm font-medium">Referral Rewards</p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• ₦2,000 when they complete onboarding</li>
              <li>• ₦500/month while they manage 10+ farmers</li>
              <li>• Help build your team and advance tiers faster</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
