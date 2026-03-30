import { db } from "../services/db"

const REGION_MAP: Record<string, Record<string, { region: string; regionSlug: string }>> = {
  CA: {
    "Santa Rosa": { region: "North Bay", regionSlug: "north-bay" },
    "Tulare": { region: "Central Valley", regionSlug: "central-valley" },
    "Visalia": { region: "Central Valley", regionSlug: "central-valley" },
  },
  IA: {
    "Neola": { region: "Western Iowa", regionSlug: "western-iowa" },
  },
  LA: {
    "Baton Rouge": { region: "Baton Rouge", regionSlug: "baton-rouge" },
  },
  MA: {
    "Needham": { region: "Greater Boston", regionSlug: "greater-boston" },
  },
  MD: {
    "White Marsh": { region: "Baltimore Metro", regionSlug: "baltimore-metro" },
  },
  ME: {
    "Portland": { region: "Southern Maine", regionSlug: "southern-maine" },
  },
  NJ: {
    "Bloomfield": { region: "Northern New Jersey", regionSlug: "northern-new-jersey" },
  },
  NY: {
    "Great Neck Plaza": { region: "Long Island", regionSlug: "long-island" },
    "Hamburg": { region: "Western New York", regionSlug: "western-new-york" },
    "Williamsville": { region: "Western New York", regionSlug: "western-new-york" },
  },
  PA: {
    "Wexford": { region: "Pittsburgh Metro", regionSlug: "pittsburgh-metro" },
  },
  RI: {
    "East Greenwich": { region: "Rhode Island", regionSlug: "rhode-island" },
  },
}

async function main() {
  // Fix listings with known city/state mappings
  let fixed = 0
  for (const [stateCode, cities] of Object.entries(REGION_MAP)) {
    for (const [city, regionData] of Object.entries(cities)) {
      const result = await db.tool.updateMany({
        where: {
          stateCode,
          city,
          region: null,
          publishedAt: { not: null },
        },
        data: {
          region: regionData.region,
          regionSlug: regionData.regionSlug,
        },
      })
      if (result.count > 0) {
        console.log(`Fixed ${result.count}: ${city}, ${stateCode} → ${regionData.region}`)
        fixed += result.count
      }
    }
  }

  // Handle the SkyTrak listing with no state - unpublish it since it's a product, not a venue
  const skytrak = await db.tool.updateMany({
    where: {
      name: { contains: "SkyTrak" },
      stateCode: null,
      publishedAt: { not: null },
    },
    data: {
      publishedAt: null,
      status: "Draft",
    },
  })
  if (skytrak.count > 0) {
    console.log(`Unpublished ${skytrak.count} product listing(s) with no state`)
  }

  // Verify
  const stillMissing = await db.tool.count({
    where: { publishedAt: { not: null }, region: null },
  })
  console.log(`\nFixed: ${fixed}`)
  console.log(`Still missing region: ${stillMissing}`)
}

main().catch(console.error).finally(() => db.$disconnect())
