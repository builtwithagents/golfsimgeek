import { extractSimTech } from "~/lib/extract-sim-tech"
import type { ToolCity } from "~/server/web/tools/payloads"

/** Get the top-rated tools sorted by Google rating */
export function getTopPicks(tools: ToolCity[], limit = 3): ToolCity[] {
  return [...tools]
    .filter(t => t.googleRating && Number(t.googleRating) > 0)
    .sort((a, b) => Number(b.googleRating) - Number(a.googleRating))
    .slice(0, limit)
}

/** Collect all unique sim tech brands found across tools */
function collectSimTech(tools: ToolCity[]): string[] {
  const techs = new Set<string>()
  for (const tool of tools) {
    for (const tech of extractSimTech(tool.content)) {
      techs.add(tech)
    }
  }
  return [...techs]
}

/** Collect price range info across tools */
function collectPriceInfo(tools: ToolCity[]): string | null {
  const prices = tools.map(t => t.priceRange).filter(Boolean) as string[]
  if (prices.length === 0) return null
  if (prices.length === 1) return prices[0]
  return prices.slice(0, 2).join(" to ")
}

/** Check if any tools offer mobile/rental services */
function hasMobileRentals(tools: ToolCity[]): boolean {
  return tools.some(t => t.mobileConfirmed)
}

/** Format a list with commas and "and" */
function formatList(items: string[]): string {
  if (items.length === 0) return ""
  if (items.length === 1) return items[0]
  if (items.length === 2) return `${items[0]} and ${items[1]}`
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`
}

/** Generate a rich intro paragraph for a city page */
export function generateCityIntro(
  city: string,
  stateName: string,
  tools: ToolCity[],
): string {
  const count = tools.length
  const topPicks = getTopPicks(tools)
  const simTechs = collectSimTech(tools)
  const priceInfo = collectPriceInfo(tools)
  const hasMobile = hasMobileRentals(tools)

  const parts: string[] = []

  // Opening sentence
  parts.push(
    `${city}, ${stateName} is home to ${count} golf simulator ${count === 1 ? "venue" : "venues"} offering indoor golf experiences for players of all skill levels.`,
  )

  // Top-rated mention
  if (topPicks.length > 0) {
    const top = topPicks[0]
    const ratingStr = top.googleRating ? ` with a ${Number(top.googleRating).toFixed(1)}-star Google rating` : ""
    parts.push(
      `Among the highest-rated is ${top.name}${ratingStr}.`,
    )
  }

  // Sim tech
  if (simTechs.length > 0) {
    parts.push(
      `Local venues feature simulator technology from ${formatList(simTechs.slice(0, 4))}, giving you access to world-class virtual golf courses and swing analysis.`,
    )
  }

  // Pricing
  if (priceInfo) {
    parts.push(
      `Session pricing typically ranges from ${priceInfo} depending on the venue and time of day.`,
    )
  }

  // Mobile
  if (hasMobile) {
    const mobileCount = tools.filter(t => t.mobileConfirmed).length
    parts.push(
      `${mobileCount} ${mobileCount === 1 ? "provider" : "providers"} in the area also ${mobileCount === 1 ? "offers" : "offer"} mobile golf simulator rentals for corporate events, parties, and private gatherings.`,
    )
  }

  // Closing
  parts.push(
    `Whether you're looking to improve your swing, host a group event, or just enjoy a round of virtual golf, ${city} has options to fit your needs.`,
  )

  return parts.join(" ")
}

/** Generate FAQ Q&A pairs for a city page */
export function generateCityFAQs(
  city: string,
  stateName: string,
  tools: ToolCity[],
): { question: string; answer: string }[] {
  const faqs: { question: string; answer: string }[] = []
  const simTechs = collectSimTech(tools)
  const priceInfo = collectPriceInfo(tools)
  const hasMobile = hasMobileRentals(tools)
  const topPicks = getTopPicks(tools)

  // Q1: Count
  const topNames = tools.slice(0, 3).map(t => t.name)
  faqs.push({
    question: `How many golf simulator venues are in ${city}, ${stateName}?`,
    answer: `There are ${tools.length} golf simulator venues in ${city}, ${stateName}, including ${formatList(topNames)}. Each offers indoor golf with different simulator technology and pricing options.`,
  })

  // Q2: Technology
  if (simTechs.length > 0) {
    faqs.push({
      question: `What golf simulator technology is available in ${city}?`,
      answer: `${city} venues use simulator technology from ${formatList(simTechs)}, offering features like ball tracking, swing analysis, and virtual courses from around the world.`,
    })
  }

  // Q3: Pricing
  if (priceInfo) {
    faqs.push({
      question: `How much does a golf simulator session cost in ${city}?`,
      answer: `Golf simulator session pricing in ${city} typically ranges from ${priceInfo}. Prices vary by venue, time of day, and group size. Many venues also offer memberships and package deals.`,
    })
  }

  // Q4: Top rated
  if (topPicks.length > 0) {
    const top = topPicks[0]
    const ratingStr = top.googleRating ? `${Number(top.googleRating).toFixed(1)} stars` : "highly rated"
    faqs.push({
      question: `What is the best golf simulator venue in ${city}?`,
      answer: `Based on Google reviews, ${top.name} is the top-rated golf simulator venue in ${city} with ${ratingStr}${top.reviewCount ? ` from ${top.reviewCount} reviews` : ""}. ${topPicks.length > 1 ? `Other highly rated options include ${formatList(topPicks.slice(1).map(t => t.name))}.` : ""}`,
    })
  }

  // Q5: Mobile (conditional)
  if (hasMobile) {
    const mobileTools = tools.filter(t => t.mobileConfirmed)
    faqs.push({
      question: `Can I rent a mobile golf simulator in ${city}?`,
      answer: `Yes, ${mobileTools.length} ${mobileTools.length === 1 ? "provider" : "providers"} in the ${city} area ${mobileTools.length === 1 ? "offers" : "offer"} mobile golf simulator rentals. ${formatList(mobileTools.map(t => t.name))} can bring simulators to your location for corporate events, parties, and other gatherings.`,
    })
  }

  return faqs
}

/** Generate intro for a region page */
export function generateRegionIntro(
  region: string,
  stateName: string,
  tools: ToolCity[],
): string {
  const count = tools.length
  const topPicks = getTopPicks(tools)
  const simTechs = collectSimTech(tools)

  const parts: string[] = []

  parts.push(
    `The ${region} area in ${stateName} has ${count} golf simulator ${count === 1 ? "venue" : "venues"} for indoor golf enthusiasts.`,
  )

  if (topPicks.length > 0) {
    const top = topPicks[0]
    const ratingStr = top.googleRating ? ` (${Number(top.googleRating).toFixed(1)} stars)` : ""
    parts.push(`Top-rated venues include ${top.name}${ratingStr}.`)
  }

  if (simTechs.length > 0) {
    parts.push(
      `Simulator technology in the area includes ${formatList(simTechs.slice(0, 4))}.`,
    )
  }

  parts.push(
    `Browse all venues below to find the best indoor golf experience in the ${region} region.`,
  )

  return parts.join(" ")
}

/** Generate FAQ Q&A pairs for a region page */
export function generateRegionFAQs(
  region: string,
  stateName: string,
  tools: ToolCity[],
): { question: string; answer: string }[] {
  const faqs: { question: string; answer: string }[] = []
  const simTechs = collectSimTech(tools)
  const topPicks = getTopPicks(tools)

  faqs.push({
    question: `How many golf simulator venues are in the ${region} area?`,
    answer: `There are ${tools.length} golf simulator venues in the ${region} area of ${stateName}. Browse all options above to compare features, pricing, and reviews.`,
  })

  if (simTechs.length > 0) {
    faqs.push({
      question: `What simulator brands are used in ${region}?`,
      answer: `Venues in the ${region} area feature technology from ${formatList(simTechs)}, providing realistic virtual golf experiences with ball tracking and swing analysis.`,
    })
  }

  if (topPicks.length > 0) {
    const top = topPicks[0]
    const ratingStr = top.googleRating ? ` with ${Number(top.googleRating).toFixed(1)} stars` : ""
    faqs.push({
      question: `What is the highest-rated golf simulator venue in ${region}?`,
      answer: `${top.name} is the top-rated venue in the ${region} area${ratingStr}${top.reviewCount ? ` based on ${top.reviewCount} Google reviews` : ""}.`,
    })
  }

  return faqs
}
