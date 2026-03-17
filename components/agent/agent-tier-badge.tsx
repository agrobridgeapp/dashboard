import { Badge } from "@/components/ui/badge"
import { AGENT_TIERS, type AgentTierKey } from "@/lib/agent-tier-system"

interface AgentTierBadgeProps {
  tier: AgentTierKey
  size?: "sm" | "md" | "lg"
  showIcon?: boolean
}

export function AgentTierBadge({ tier, size = "md", showIcon = false }: AgentTierBadgeProps) {
  const tierData = AGENT_TIERS[tier] ||
    AGENT_TIERS.agent || {
      name: "Agent",
      color: "text-gray-700",
      bgColor: "bg-gray-100",
      borderColor: "border-gray-300",
    }

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-2",
  }

  return (
    <Badge
      variant="secondary"
      className={`${tierData.color} ${tierData.bgColor} border ${tierData.borderColor} ${sizeClasses[size]} font-medium`}
    >
      {tierData.name}
    </Badge>
  )
}
