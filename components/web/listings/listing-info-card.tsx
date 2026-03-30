import { ClockIcon, CpuIcon, DollarSignIcon, MapPinIcon, PhoneIcon } from "lucide-react"
import { extractHoursToday, extractSimTech } from "~/lib/extract-sim-tech"
import type { ToolOne } from "~/server/web/tools/payloads"

interface ListingInfoCardProps {
  tool: ToolOne
  className?: string
}

export function ListingInfoCard({ tool, className }: ListingInfoCardProps) {
  // If the full address already contains city/state/zip, just use it as-is
  const fullAddr = tool.address || ""
  const cityStateInAddr = tool.city && fullAddr.toLowerCase().includes(tool.city.toLowerCase())
  const address = cityStateInAddr
    ? fullAddr
    : [tool.address, tool.city, tool.stateCode, tool.zipCode].filter(Boolean).join(", ")
  const simTechs = extractSimTech(tool.content)
  const hoursToday = extractHoursToday(tool.content)

  const hasInfo = address || tool.phone || tool.priceRange || hoursToday || simTechs.length > 0

  if (!hasInfo) return null

  return (
    <div className={`rounded-lg border bg-card p-4 space-y-3 text-sm ${className ?? ""}`}>
      <h3 className="font-semibold text-base">Quick Info</h3>

      {address && (
        <div className="flex items-start gap-2.5">
          <MapPinIcon className="size-4 mt-0.5 shrink-0 text-muted-foreground" />
          <span>{address}</span>
        </div>
      )}

      {tool.phone && (
        <div className="flex items-center gap-2.5">
          <PhoneIcon className="size-4 shrink-0 text-muted-foreground" />
          <a href={`tel:${tool.phone}`} className="hover:underline">{tool.phone}</a>
        </div>
      )}

      {hoursToday && (
        <div className="flex items-center gap-2.5">
          <ClockIcon className="size-4 shrink-0 text-muted-foreground" />
          <span>Today: {hoursToday}</span>
        </div>
      )}

      {tool.priceRange && (
        <div className="flex items-center gap-2.5">
          <DollarSignIcon className="size-4 shrink-0 text-muted-foreground" />
          <span>{tool.priceRange}</span>
        </div>
      )}

      {simTechs.length > 0 && (
        <div className="flex items-start gap-2.5">
          <CpuIcon className="size-4 mt-0.5 shrink-0 text-muted-foreground" />
          <div className="flex flex-wrap gap-1.5">
            {simTechs.map(tech => (
              <span key={tech} className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
