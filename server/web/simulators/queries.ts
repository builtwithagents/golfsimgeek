import { cacheLife, cacheTag } from "next/cache"
import { ToolStatus } from "~/.generated/prisma/client"
import { simulatorTechs } from "~/config/simulator-tech"
import { toolManyPayload } from "~/server/web/tools/payloads"
import { db } from "~/services/db"

export const findToolsByTech = async (techSlug: string) => {
  "use cache"

  cacheTag("tools", `tech-${techSlug}`)
  cacheLife("infinite")

  const tech = simulatorTechs.find(t => t.slug === techSlug)
  if (!tech) return []

  // Use the pattern source string for SQL ILIKE
  // Convert regex to simple search term
  const searchTerm = tech.slug === "gcquad" ? "GCQuad" : tech.shortName

  return db.tool.findMany({
    where: {
      status: ToolStatus.Published,
      content: { contains: searchTerm, mode: "insensitive" },
    },
    select: toolManyPayload,
    orderBy: [{ tierPriority: "asc" }, { name: "asc" }],
  })
}

export interface TechWithCount {
  slug: string
  name: string
  shortName: string
  count: number
}

export const findTechsWithCounts = async (): Promise<TechWithCount[]> => {
  "use cache"

  cacheTag("tools", "tech-counts")
  cacheLife("infinite")

  const results: TechWithCount[] = []

  for (const tech of simulatorTechs) {
    const searchTerm = tech.slug === "gcquad" ? "GCQuad" : tech.shortName
    const count = await db.tool.count({
      where: {
        status: ToolStatus.Published,
        content: { contains: searchTerm, mode: "insensitive" },
      },
    })
    if (count > 0) {
      results.push({
        slug: tech.slug,
        name: tech.name,
        shortName: tech.shortName,
        count,
      })
    }
  }

  return results.sort((a, b) => b.count - a.count)
}
