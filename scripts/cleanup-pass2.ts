import { db } from "../services/db.js"

async function main() {
  let deleted = 0

  // 1. Delete suspect non-golf-sim businesses
  const suspectNames = [
    "Phalen Park Golf Course",
    "Eagle Hills Golf Course",
    "Oso Beach Municipal Golf Course",
    "Hilly Haven Golf Course",
    "Inkster Valley Golf Course",
    "GOLFTEC Rhode Island",
    "GOLFTEC West Hartford",
    "GOLFTEC North Bethesda",
    "GOLFTEC Tysons Corner",
    "GOLFTEC Westport",
    "GOLFTEC Virginia Beach",
    "Academy Sim Racing",
    "Top Golf Swing Suite @ Hotel 1000",
    "Zero Latency VR JAX",
    "Sector X Virtual Reality",
  ]

  for (const name of suspectNames) {
    const result = await db.tool.deleteMany({ where: { name } })
    if (result.count > 0) {
      console.log("Deleted suspect:", name, `(${result.count})`)
      deleted += result.count
    }
  }

  // 2. Delete the single-char "l" listing
  const lResult = await db.tool.deleteMany({ where: { name: "l" } })
  if (lResult.count > 0) {
    console.log("Deleted bad name: 'l'", `(${lResult.count})`)
    deleted += lResult.count
  }

  // 3. Delete vacation rental listing with no state
  const vacResult = await db.tool.deleteMany({
    where: {
      OR: [
        { name: { contains: "Sleeps 10" } },
        { name: { contains: "Vacation Home" } },
      ],
    },
  })
  if (vacResult.count > 0) {
    console.log("Deleted vacation rentals:", vacResult.count)
    deleted += vacResult.count
  }

  // 4. Deduplicate websites - keep first, delete rest
  const dedupeGroups = [
    // True dupes (same business, same location)
    { keep: "Birdie's Sporting Club", delete: ["X-Golf Brooklyn"] }, // xgolfbrooklyn.com
    { keep: "Golf Performance Studio LLC", delete: ["Golf Performance Studio - Chris Dawkins"] }, // same business
    { keep: "Ace Kids Golf", delete: ["Ace Kids Golf Program"] }, // acekidsgolf.org
    { keep: "GimmeSimulators", delete: ["Ace Indoor Golf"] }, // aceindoorgolf.com - same business rebranded
    { keep: "Sim City Golf LLC", delete: ["Sim City Golf"] }, // simcitygolfclub.com
    { keep: "The Dome", delete: ["Golf Headquarters of Williamsville"] }, // thedomewny.com
    { keep: "WeaverRidge Golf Club", delete: ["Weaver Ridge Clubhouse Restaurant"] }, // same venue
    { keep: "Touchet Golf", delete: ["Touchet Performance Golf"] }, // same business
    { keep: "Golfinity", delete: ["The Range Bar and Grill (at Golfinity)"] }, // same venue
    { keep: "Fore Swing Lounge", delete: ["FORE Golf"] }, // same business
    { keep: "Cle Indoor Golf", delete: ["West Bank Golf Club"] }, // same venue
    { keep: "The City Golf", delete: ["The City Golf - Sherman Oaks", "The City Golf - West LA"] }, // keep main, dedup locations with same URL
  ]

  for (const group of dedupeGroups) {
    for (const name of group.delete) {
      const result = await db.tool.deleteMany({ where: { name } })
      if (result.count > 0) {
        console.log(`Deduped: deleted "${name}" (keeping "${group.keep}")`)
        deleted += result.count
      }
    }
  }

  // 5. Clean up pipe characters in names: "Name | Extra Info" -> "Name - Extra Info"
  const pipeNames = await db.tool.findMany({
    where: { name: { contains: " | " } },
    select: { id: true, name: true },
  })

  let cleaned = 0
  for (const listing of pipeNames) {
    // For "The Back Nine Golf | City, ST" format, simplify to "The Back Nine Golf - City"
    let newName = listing.name
    if (listing.name.startsWith("The Back Nine Golf |")) {
      // Extract just the city part
      const cityPart = listing.name.replace("The Back Nine Golf | ", "").replace(/, [A-Z]{2}.*$/, "").trim()
      newName = `The Back Nine Golf - ${cityPart}`
    } else {
      // For other pipes, just replace with dash
      newName = listing.name.replace(/ \| /g, " - ")
    }

    if (newName !== listing.name) {
      await db.tool.update({ where: { id: listing.id }, data: { name: newName } })
      cleaned++
    }
  }
  console.log(`\nCleaned ${cleaned} names with pipe characters`)

  // 6. Clean up names with address info
  const addressNames = await db.tool.findMany({
    where: {
      name: {
        contains: "6 Commerce Dr",
      },
    },
    select: { id: true, name: true },
  })
  for (const listing of addressNames) {
    const newName = "Village Golf Performance Center"
    await db.tool.update({ where: { id: listing.id }, data: { name: newName } })
    console.log(`Renamed: "${listing.name}" -> "${newName}"`)
  }

  // 7. Clean up "Golf Coach | Wade Fullingim Golf" style names
  const coachNames = await db.tool.findMany({
    where: {
      OR: [
        { name: { startsWith: "Golf Coach" } },
        { name: { contains: "X-Golf at American Family Field" } },
      ],
    },
    select: { id: true, name: true },
  })
  for (const listing of coachNames) {
    let newName = listing.name
    if (listing.name.includes("Wade Fullingim")) {
      newName = "Wade Fullingim Golf"
    } else if (listing.name.includes("American Family Field")) {
      newName = "X-Golf at American Family Field"
    }
    if (newName !== listing.name) {
      await db.tool.update({ where: { id: listing.id }, data: { name: newName } })
      console.log(`Renamed: "${listing.name}" -> "${newName}"`)
    }
  }

  // Final count
  const total = await db.tool.count()
  const published = await db.tool.count({ where: { publishedAt: { not: null } } })
  console.log(`\n=== CLEANUP COMPLETE ===`)
  console.log(`Deleted: ${deleted}`)
  console.log(`Names cleaned: ${cleaned}`)
  console.log(`Remaining: ${published} published / ${total} total`)
}

main().then(() => db.$disconnect())
