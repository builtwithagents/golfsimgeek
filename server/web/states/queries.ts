import { cacheLife, cacheTag } from "next/cache"
import { ToolStatus } from "~/.generated/prisma/client"
import { toolManyPayload } from "~/server/web/tools/payloads"
import { db } from "~/services/db"

/** Get all states with listing counts, sorted by count desc */
export const findStatesWithCounts = async () => {
  "use cache"
  cacheTag("states")
  cacheLife("infinite")

  const results = await db.tool.groupBy({
    by: ["stateCode", "state"],
    _count: { id: true },
    where: { status: ToolStatus.Published, stateCode: { not: null } },
    orderBy: { _count: { id: "desc" } },
  })

  return results
    .filter(r => r.stateCode && r.state)
    .map(r => ({
      stateCode: r.stateCode!,
      stateName: r.state!,
      count: r._count.id,
      slug: r.stateCode!.toLowerCase(),
    }))
}

/** Get regions for a specific state with listing counts */
export const findRegionsForState = async (stateCode: string) => {
  "use cache"
  cacheTag("states", `state-${stateCode}`)
  cacheLife("infinite")

  const results = await db.tool.groupBy({
    by: ["region", "regionSlug"],
    _count: { id: true },
    where: {
      status: ToolStatus.Published,
      stateCode,
      region: { not: null },
    },
    orderBy: { _count: { id: "desc" } },
  })

  return results
    .filter(r => r.region && r.regionSlug)
    .map(r => ({
      region: r.region!,
      regionSlug: r.regionSlug!,
      count: r._count.id,
    }))
}

/** Get tools for a state, optionally filtered by region */
export const findToolsForState = async (stateCode: string, regionSlug?: string) => {
  "use cache"
  cacheTag("states", `state-${stateCode}`)
  cacheLife("infinite")

  return db.tool.findMany({
    where: {
      status: ToolStatus.Published,
      stateCode,
      ...(regionSlug && { regionSlug }),
    },
    select: toolManyPayload,
    orderBy: [{ tierPriority: "asc" }, { name: "asc" }],
  })
}

/** Get state info (name + count) by state code */
export const findStateByCode = async (stateCode: string) => {
  "use cache"
  cacheTag("states", `state-${stateCode}`)
  cacheLife("infinite")

  const result = await db.tool.groupBy({
    by: ["stateCode", "state"],
    _count: { id: true },
    where: { status: ToolStatus.Published, stateCode },
  })

  if (!result.length || !result[0].state) return null

  return {
    stateCode: result[0].stateCode!,
    stateName: result[0].state!,
    count: result[0]._count.id,
  }
}

/** Get cities for a state with listing counts (min 2 listings) */
export const findCitiesForState = async (stateCode: string) => {
  "use cache"
  cacheTag("states", `state-${stateCode}`)
  cacheLife("infinite")

  const results = await db.tool.groupBy({
    by: ["city"],
    _count: { id: true },
    where: {
      status: ToolStatus.Published,
      stateCode,
      city: { not: null },
    },
    orderBy: { _count: { id: "desc" } },
  })

  return results
    .filter(r => r.city && r._count.id >= 2)
    .map(r => ({
      city: r.city!,
      citySlug: r.city!.toLowerCase().replace(/\s+/g, "-"),
      count: r._count.id,
    }))
}

/** Get city info by state code and city slug */
export const findCityBySlug = async (stateCode: string, citySlug: string) => {
  "use cache"
  cacheTag("states", `state-${stateCode}`)
  cacheLife("infinite")

  const cityName = citySlug.replace(/-/g, " ")

  const result = await db.tool.groupBy({
    by: ["city"],
    _count: { id: true },
    where: {
      status: ToolStatus.Published,
      stateCode,
      city: { mode: "insensitive", equals: cityName },
    },
  })

  if (!result.length || !result[0].city) return null

  return {
    city: result[0].city!,
    citySlug,
    count: result[0]._count.id,
  }
}

/** Get tools for a specific city */
export const findToolsForCity = async (stateCode: string, citySlug: string) => {
  "use cache"
  cacheTag("states", `state-${stateCode}`)
  cacheLife("infinite")

  const cityName = citySlug.replace(/-/g, " ")

  return db.tool.findMany({
    where: {
      status: ToolStatus.Published,
      stateCode,
      city: { mode: "insensitive", equals: cityName },
    },
    select: toolManyPayload,
    orderBy: [{ tierPriority: "asc" }, { name: "asc" }],
  })
}

/** Get region info by state code and region slug */
export const findRegionBySlug = async (stateCode: string, regionSlug: string) => {
  "use cache"
  cacheTag("states", `state-${stateCode}`)
  cacheLife("infinite")

  const result = await db.tool.groupBy({
    by: ["region", "regionSlug"],
    _count: { id: true },
    where: { status: ToolStatus.Published, stateCode, regionSlug },
  })

  if (!result.length || !result[0].region) return null

  return {
    region: result[0].region!,
    regionSlug: result[0].regionSlug!,
    count: result[0]._count.id,
  }
}
