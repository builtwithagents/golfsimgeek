import { differenceInDays } from "date-fns"
import { type Tool, type ToolTier } from "~/.generated/prisma/browser"
import { submissionsConfig } from "~/config/submissions"
import { tiersConfig } from "~/config/tiers"

type TierCapability = keyof (typeof tiersConfig)[ToolTier]["capabilities"]

/**
 * Check if a tool's tier has a given capability.
 *
 * @param tool - The tool to check.
 * @param capability - The capability to check for.
 * @returns Whether the tool's tier has the capability.
 */
export const hasToolTierCap = (tool: Pick<Tool, "tier">, capability: TierCapability): boolean => {
  return tiersConfig[tool.tier].capabilities[capability]
}

/**
 * Get the priority rank of a tool's tier.
 *
 * @param tool - The tool to check.
 * @returns The numeric priority of the tool's tier.
 */
export const getToolTierRank = (tool: Pick<Tool, "tier">): number => {
  return tiersConfig[tool.tier].priority
}

const maxTierPriority = Math.max(...Object.values(tiersConfig).map(c => c.priority))

/**
 * Check if a tool has the highest tier.
 *
 * @param tool - The tool to check.
 * @returns Whether the tool has the top tier.
 */
export const isToolTopTier = (tool: Pick<Tool, "tier">): boolean => {
  return tiersConfig[tool.tier].priority === maxTierPriority
}

/**
 * Get all tiers that have a given capability.
 *
 * @param capability - The capability to filter by.
 * @returns The list of tiers with the capability.
 */
export const getToolTiersWith = (capability: TierCapability): ToolTier[] => {
  return Object.entries(tiersConfig)
    .filter(([_, config]) => config.capabilities[capability])
    .map(([tier]) => tier as ToolTier)
}

/**
 * Check if a tool is published.
 *
 * @param tool - The tool to check.
 * @returns Whether the tool is published.
 */
export const isToolPublished = (tool: Pick<Tool, "status">) => {
  return ["Published"].includes(tool.status)
}

/**
 * Check if a tool is scheduled.
 *
 * @param tool - The tool to check.
 * @returns Whether the tool is scheduled.
 */
export const isToolScheduled = (tool: Pick<Tool, "status">) => {
  return ["Scheduled"].includes(tool.status)
}

/**
 * Check if a tool is approved (scheduled or published)
 *
 * @param tool - The tool to check.
 * @returns Whether the tool is published.
 */
export const isToolApproved = (tool: Pick<Tool, "status">) => {
  return ["Scheduled", "Published"].includes(tool.status)
}

/**
 * Check if a tool is within the expedite threshold.
 *
 * @param tool - The tool to check.
 * @returns Whether the tool is within the expedite threshold.
 */
export const isToolWithinExpediteThreshold = (tool: Pick<Tool, "publishedAt">) => {
  const threshold = submissionsConfig.expediteThreshold

  return tool.publishedAt && differenceInDays(tool.publishedAt, new Date()) < threshold
}

