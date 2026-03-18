import { type ToolTier } from "~/.generated/prisma/browser"

type TierCapabilities = {
  doFollow: boolean
  featuredPlacement: boolean
}

type TierConfig = {
  label: string
  priority: number
  capabilities: TierCapabilities
}

// Single source of truth for tier capabilities.
// NOTE: If you add a new tier here, also update the `tierPriority` generated column
// in the database migration (see prisma/migrations).
export const tiersConfig: Record<ToolTier, TierConfig> = {
  Free: {
    label: "Free Listing",
    priority: 0,
    capabilities: { doFollow: false, featuredPlacement: false },
  },
  Standard: {
    label: "Standard Listing",
    priority: 1,
    capabilities: { doFollow: true, featuredPlacement: false },
  },
  Premium: {
    label: "Premium Listing",
    priority: 2,
    capabilities: { doFollow: true, featuredPlacement: true },
  },
}
