import { CircleCheckIcon, CircleDashedIcon, CircleDotDashedIcon, CircleDotIcon } from "lucide-react"
import type { ComponentProps, ReactNode } from "react"
import { ToolStatus } from "~/.generated/prisma/browser"
import { Badge } from "~/components/common/badge"

/**
 * Badge variant props for each ToolStatus — used in admin table cells.
 */
export const toolStatusBadgeProps: Record<ToolStatus, ComponentProps<typeof Badge>> = {
  [ToolStatus.Draft]: { variant: "soft" },
  [ToolStatus.Pending]: { variant: "warning" },
  [ToolStatus.Scheduled]: { variant: "info" },
  [ToolStatus.Published]: { variant: "success" },
}

/**
 * Icon element for each ToolStatus — shared between admin and dashboard tables.
 */
export const toolStatusIcon: Record<ToolStatus, ReactNode> = {
  [ToolStatus.Published]: <CircleCheckIcon className="text-green-500" />,
  [ToolStatus.Scheduled]: <CircleDotIcon className="text-blue-500" />,
  [ToolStatus.Pending]: <CircleDotDashedIcon className="text-yellow-500" />,
  [ToolStatus.Draft]: <CircleDashedIcon className="text-gray-500" />,
}
