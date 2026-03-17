import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AGENT_TIERS, type AgentTierKey, getNextTierRequirements, calculateTierProgress } from "@/lib/agent-tier-system"
import { AgentTierBadge } from "./agent-tier-badge"
import { Users, UserPlus, Target, ArrowRight, CheckCircle } from "lucide-react"

interface AgentTierProgressProps {
  currentTier: AgentTierKey
  activeFarmers: number
  totalReferrals: number
  qualityScore: number
}

export function AgentTierProgress({
  currentTier,
  activeFarmers,
  totalReferrals,
  qualityScore,
}: AgentTierProgressProps) {
  const nextTier = getNextTierRequirements(currentTier)
  const progress = calculateTierProgress(activeFarmers, totalReferrals, qualityScore, currentTier)
  const currentTierData = AGENT_TIERS[currentTier]

  if (!nextTier) {
    return (
      <Card className="border border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Current Role</CardTitle>
              <CardDescription className="mt-1">You have reached the highest responsibility level</CardDescription>
            </div>
            <AgentTierBadge tier={currentTier} size="lg" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-lg bg-muted/50 border">
            <p className="text-sm text-muted-foreground mb-3">Role Benefits:</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Monthly Bonus</p>
                <p className="text-lg font-bold">₦{currentTierData.monthlyBonus.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Quarterly Bonus</p>
                <p className="text-lg font-bold">₦{currentTierData.quarterlyBonus.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const farmerProgress = Math.min((activeFarmers / nextTier.tier.minFarmers) * 100, 100)
  const referralProgress = Math.min((totalReferrals / nextTier.tier.minReferrals) * 100, 100)
  const qualityProgress = Math.min((qualityScore / nextTier.tier.minQualityScore) * 100, 100)

  return (
    <Card className="border border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Role Progression</CardTitle>
            <CardDescription>Progress toward increased responsibility</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <AgentTierBadge tier={currentTier} />
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <AgentTierBadge tier={nextTier.key} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progress to {nextTier.tier.name}</span>
            <span className="text-sm font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Individual Requirements */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Farmers Covered</span>
              </div>
              <div className="flex items-center gap-2">
                {farmerProgress >= 100 ? (
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                ) : (
                  <span className="text-sm font-medium">
                    {activeFarmers}/{nextTier.tier.minFarmers}
                  </span>
                )}
              </div>
            </div>
            <Progress value={farmerProgress} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Agents Supported</span>
              </div>
              <div className="flex items-center gap-2">
                {referralProgress >= 100 ? (
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                ) : (
                  <span className="text-sm font-medium">
                    {totalReferrals}/{nextTier.tier.minReferrals}
                  </span>
                )}
              </div>
            </div>
            <Progress value={referralProgress} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Quality Score</span>
              </div>
              <div className="flex items-center gap-2">
                {qualityProgress >= 100 ? (
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                ) : (
                  <span className="text-sm font-medium">
                    {qualityScore}/{nextTier.tier.minQualityScore}
                  </span>
                )}
              </div>
            </div>
            <Progress value={qualityProgress} className="h-2" />
          </div>
        </div>

        {/* Next Role Benefits - reframed from "Unlock" */}
        <div className="p-4 rounded-lg border bg-muted/50">
          <p className="text-sm font-medium mb-3">{nextTier.tier.name} Benefits:</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Monthly Bonus</p>
              <p className="text-base font-medium">₦{nextTier.tier.monthlyBonus.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Quarterly Bonus</p>
              <p className="text-base font-medium">₦{nextTier.tier.quarterlyBonus.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
