"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

export interface LocationValue {
  stateId: string
  stateName: string
  lgaId: string
  lgaName: string
  communityId?: string
  communityName?: string
}

interface LocationRow {
  id: string
  name: string
}

interface NigeriaLocationSelectProps {
  value: LocationValue
  onChange: (value: LocationValue) => void
  showCommunity?: boolean
  /** When true, allows free-text community entry if no DB communities exist for the LGA */
  allowNewCommunity?: boolean
  requiredFields?: ("state" | "lga" | "community")[]
  disabled?: boolean
  className?: string
}

export function NigeriaLocationSelect({
  value,
  onChange,
  showCommunity = true,
  allowNewCommunity = true,
  requiredFields = ["state", "lga"],
  disabled = false,
  className = "",
}: NigeriaLocationSelectProps) {
  const [states, setStates] = useState<LocationRow[]>([])
  const [lgas, setLgas] = useState<LocationRow[]>([])
  const [communities, setCommunities] = useState<LocationRow[]>([])

  const [loadingStates, setLoadingStates] = useState(true)
  const [loadingLgas, setLoadingLgas] = useState(false)
  const [loadingCommunities, setLoadingCommunities] = useState(false)

  const [communityInputMode, setCommunityInputMode] = useState<"select" | "text">("select")
  const [freeTextCommunity, setFreeTextCommunity] = useState("")

  const isRequired = (field: "state" | "lga" | "community") => requiredFields.includes(field)

  // Load all states on mount
  useEffect(() => {
    setLoadingStates(true)
    fetch("/api/locations/states")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setStates(res.data || [])
      })
      .catch(() => {})
      .finally(() => setLoadingStates(false))
  }, [])

  // Load LGAs when state changes
  useEffect(() => {
    if (!value.stateId) {
      setLgas([])
      setCommunities([])
      return
    }
    setLoadingLgas(true)
    setLgas([])
    setCommunities([])
    fetch(`/api/locations/lgas?state_id=${value.stateId}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setLgas(res.data)
      })
      .catch(() => {})
      .finally(() => setLoadingLgas(false))
  }, [value.stateId])

  // Load communities when LGA changes
  useEffect(() => {
    if (!showCommunity || !value.lgaId) {
      setCommunities([])
      return
    }
    setLoadingCommunities(true)
    setCommunities([])
    fetch(`/api/locations/communities?lga_id=${value.lgaId}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          setCommunities(res.data)
          // If no communities exist in DB, fall back to free-text input
          if (res.data.length === 0 && allowNewCommunity) {
            setCommunityInputMode("text")
          } else {
            setCommunityInputMode("select")
          }
        }
      })
      .catch(() => {
        if (allowNewCommunity) setCommunityInputMode("text")
      })
      .finally(() => setLoadingCommunities(false))
  }, [value.lgaId, showCommunity, allowNewCommunity])

  const handleStateChange = (stateId: string) => {
    const state = states.find((s) => s.id === stateId)
    onChange({
      stateId,
      stateName: state?.name ?? "",
      lgaId: "",
      lgaName: "",
      communityId: undefined,
      communityName: undefined,
    })
    setFreeTextCommunity("")
  }

  const handleLgaChange = (lgaId: string) => {
    const lga = lgas.find((l) => l.id === lgaId)
    onChange({
      ...value,
      lgaId,
      lgaName: lga?.name ?? "",
      communityId: undefined,
      communityName: undefined,
    })
    setFreeTextCommunity("")
  }

  const handleCommunityChange = (communityId: string) => {
    const community = communities.find((c) => c.id === communityId)
    onChange({ ...value, communityId, communityName: community?.name ?? "" })
  }

  const handleFreeTextCommunity = (text: string) => {
    setFreeTextCommunity(text)
    onChange({ ...value, communityId: undefined, communityName: text })
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* State */}
      <div className="space-y-2">
        <Label htmlFor="loc-state">
          State {isRequired("state") && <span className="text-destructive">*</span>}
        </Label>
        {loadingStates ? (
          <div className="flex items-center gap-2 h-10 px-3 border rounded-md text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading states...
          </div>
        ) : (
          <Select value={value.stateId} onValueChange={handleStateChange} disabled={disabled}>
            <SelectTrigger id="loc-state">
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {states.map((state) => (
                <SelectItem key={state.id} value={state.id}>
                  {state.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* LGA */}
      <div className="space-y-2">
        <Label htmlFor="loc-lga">
          Local Government Area {isRequired("lga") && <span className="text-destructive">*</span>}
        </Label>
        {loadingLgas ? (
          <div className="flex items-center gap-2 h-10 px-3 border rounded-md text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading LGAs...
          </div>
        ) : (
          <Select
            value={value.lgaId}
            onValueChange={handleLgaChange}
            disabled={disabled || !value.stateId || lgas.length === 0}
          >
            <SelectTrigger id="loc-lga">
              <SelectValue placeholder={value.stateId ? "Select LGA" : "Select a state first"} />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {lgas.map((lga) => (
                <SelectItem key={lga.id} value={lga.id}>
                  {lga.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Community */}
      {showCommunity && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="loc-community">
              Community / Village {isRequired("community") && <span className="text-destructive">*</span>}
            </Label>
            {allowNewCommunity && value.lgaId && communities.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setCommunityInputMode(communityInputMode === "select" ? "text" : "select")
                  if (communityInputMode === "select") {
                    onChange({ ...value, communityId: undefined, communityName: freeTextCommunity })
                  }
                }}
                className="text-xs text-primary hover:underline"
              >
                {communityInputMode === "select" ? "Not listed? Type manually" : "Pick from list"}
              </button>
            )}
          </div>

          {loadingCommunities ? (
            <div className="flex items-center gap-2 h-10 px-3 border rounded-md text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading communities...
            </div>
          ) : communityInputMode === "select" && communities.length > 0 ? (
            <Select
              value={value.communityId ?? ""}
              onValueChange={handleCommunityChange}
              disabled={disabled || !value.lgaId}
            >
              <SelectTrigger id="loc-community">
                <SelectValue placeholder={value.lgaId ? "Select community" : "Select an LGA first"} />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {communities.map((community) => (
                  <SelectItem key={community.id} value={community.id}>
                    {community.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              id="loc-community"
              placeholder={value.lgaId ? "Enter community or village name" : "Select an LGA first"}
              value={freeTextCommunity || value.communityName || ""}
              onChange={(e) => handleFreeTextCommunity(e.target.value)}
              disabled={disabled || !value.lgaId}
            />
          )}
        </div>
      )}
    </div>
  )
}
