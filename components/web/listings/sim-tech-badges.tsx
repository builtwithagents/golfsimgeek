import { CpuIcon } from "lucide-react"
import { extractSimTech } from "~/lib/extract-sim-tech"

interface SimTechBadgesProps {
  content: string | null
  className?: string
}

export function SimTechBadges({ content, className }: SimTechBadgesProps) {
  const techs = extractSimTech(content)
  if (techs.length === 0) return null

  return (
    <div className={`flex items-center gap-2 flex-wrap ${className ?? ""}`}>
      <CpuIcon className="size-4 text-muted-foreground shrink-0" />
      {techs.map(tech => (
        <span
          key={tech}
          className="inline-flex items-center rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary"
        >
          {tech}
        </span>
      ))}
    </div>
  )
}
