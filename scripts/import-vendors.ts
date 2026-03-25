/**
 * Import scraped vendors into the GolfSimGeek database.
 *
 * Reads vendors-tagged.json and imports them into Supabase via Prisma.
 * Handles deduplication, category/tag connections, and state name mapping.
 *
 * All vendors are imported as Draft status for manual review before going live.
 *
 * Usage:
 *   SKIP_ENV_VALIDATION=1 npx tsx scripts/import-vendors.ts
 *
 * Options:
 *   IMPORT_LIMIT     - Max vendors to import (default: all)
 *   IMPORT_DRY_RUN   - Set to "true" to preview without writing to DB
 */

import { readFileSync, existsSync } from "fs"
import { join } from "path"

const DRY_RUN = process.env.IMPORT_DRY_RUN === "true"
const LIMIT = process.env.IMPORT_LIMIT ? parseInt(process.env.IMPORT_LIMIT) : undefined

const VENDORS_FILE = join(import.meta.dirname, "..", "data", "vendors-tagged.json")

// State code to full name mapping
const STATE_NAMES: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia",
  HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
  KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri",
  MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey",
  NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio",
  OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
  SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont",
  VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
  DC: "District of Columbia",
}

type TaggedVendor = {
  name: string
  slug: string
  websiteUrl: string
  tagline: string
  description: string
  phone: string | null
  city: string | null
  state: string | null
  stateCode: string | null
  zipCode: string | null
  address: string | null
  googleRating: number | null
  reviewCount: number | null
  placeId: string
  categories: string[]
  tags: string[]
  flaggedForReview: boolean
  excludeReason: string | null
}

async function main() {
  console.log("Starting vendor import\n")

  if (!existsSync(VENDORS_FILE)) {
    console.error(`Vendor file not found: ${VENDORS_FILE}`)
    console.error("Run the scraper first: GOOGLE_PLACES_API_KEY=... npx tsx scripts/scrape-google-places.ts")
    process.exit(1)
  }

  // Dynamic import to avoid env validation issues
  const { db } = await import("~/services/db")

  const allVendors: TaggedVendor[] = JSON.parse(readFileSync(VENDORS_FILE, "utf-8"))
  const vendors = LIMIT ? allVendors.slice(0, LIMIT) : allVendors

  console.log(`Loaded ${allVendors.length} vendors, importing ${vendors.length}\n`)

  // Get existing categories and tags from DB
  const [existingCategories, existingTags, existingSlugs, existingPlaceIds] = await Promise.all([
    db.category.findMany({ select: { slug: true } }),
    db.tag.findMany({ select: { slug: true } }),
    db.tool.findMany({ select: { slug: true } }),
    db.tool.findMany({ where: { placeId: { not: null } }, select: { placeId: true } }),
  ])

  const validCategories = new Set(existingCategories.map(c => c.slug))
  const validTags = new Set(existingTags.map(t => t.slug))
  const existingSlugSet = new Set(existingSlugs.map(t => t.slug))
  const existingPlaceIdSet = new Set(existingPlaceIds.map(t => t.placeId))

  let imported = 0
  let skipped = 0
  let errors = 0
  let filtered = 0

  for (const vendor of vendors) {
    // Skip if place ID already exists (dedup)
    if (vendor.placeId && existingPlaceIdSet.has(vendor.placeId)) {
      skipped++
      continue
    }

    // Skip if slug already exists
    if (existingSlugSet.has(vendor.slug)) {
      skipped++
      continue
    }

    // Filter to valid categories and tags
    const categories = vendor.categories.filter(c => validCategories.has(c))
    const tags = vendor.tags.filter(t => validTags.has(t))

    // Map state code to full name
    const state = vendor.stateCode ? STATE_NAMES[vendor.stateCode] || null : null

    if (DRY_RUN) {
      console.log(`  [DRY RUN] Would import: ${vendor.name} (${vendor.city}, ${vendor.stateCode}) — ${categories.length} cats, ${tags.length} tags${vendor.flaggedForReview ? " [FLAGGED]" : ""}`)
      imported++
      continue
    }

    try {
      await db.tool.create({
        data: {
          name: vendor.name,
          slug: vendor.slug,
          websiteUrl: vendor.websiteUrl || "https://golfsimgeek.com",
          tagline: vendor.tagline,
          description: vendor.description,
          content: vendor.description,
          faviconUrl: vendor.websiteUrl
            ? `https://www.google.com/s2/favicons?sz=128&domain_url=${vendor.websiteUrl}`
            : null,
          phone: vendor.phone,
          contactEmail: null,
          city: vendor.city,
          state,
          stateCode: vendor.stateCode,
          zipCode: vendor.zipCode,
          address: vendor.address,
          placeId: vendor.placeId,
          googleRating: vendor.googleRating,
          reviewCount: vendor.reviewCount,
          mobileConfirmed: false,
          // All vendors start as Draft for manual review
          status: "Draft",
          categories: categories.length > 0
            ? { connect: categories.map(slug => ({ slug })) }
            : undefined,
          tags: tags.length > 0
            ? { connect: tags.map(slug => ({ slug })) }
            : undefined,
        },
      })

      existingSlugSet.add(vendor.slug)
      if (vendor.placeId) existingPlaceIdSet.add(vendor.placeId)
      imported++

      if (vendor.flaggedForReview) {
        console.log(`  IMPORTED (FLAGGED): ${vendor.name} — ${vendor.excludeReason}`)
      } else {
        console.log(`  Imported: ${vendor.name} (${vendor.city}, ${vendor.stateCode})`)
      }
    } catch (err) {
      console.error(`  Error importing ${vendor.name}:`, err)
      errors++
    }
  }

  console.log(`\nImport Summary:`)
  console.log(`   Imported:  ${imported}`)
  console.log(`   Skipped:   ${skipped} (already exists)`)
  console.log(`   Filtered:  ${filtered}`)
  console.log(`   Errors:    ${errors}`)
  console.log(`   Total:     ${vendors.length}`)
  console.log(`\nAll vendors imported as Draft status. Use the admin UI to review and approve.`)
}

main().catch(err => {
  console.error("Fatal error:", err)
  process.exit(1)
})
