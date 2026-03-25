/**
 * Google Places API (New) Scraper for GolfSimGeek
 *
 * Searches for mobile golf simulator rental businesses across the US.
 * Uses the new Places API endpoints (places.googleapis.com/v1/)
 *
 * Usage:
 *   GOOGLE_PLACES_API_KEY=your_key npx tsx scripts/scrape-google-places.ts
 *
 * Options (env vars):
 *   GOOGLE_PLACES_API_KEY  - Required
 *   SCRAPE_QUERIES         - Comma-separated queries (default: golf sim queries)
 *   SCRAPE_CITIES          - Comma-separated cities (default: top 50 US metros)
 *   SCRAPE_LIMIT_METROS    - Limit number of metros for testing (e.g., 3)
 */

import { writeFileSync, mkdirSync, existsSync, readFileSync } from "fs"
import { join } from "path"

const API_KEY = process.env.GOOGLE_PLACES_API_KEY
if (!API_KEY) {
  console.error("Set GOOGLE_PLACES_API_KEY env var")
  process.exit(1)
}

// Output files
const OUTPUT_DIR = join(import.meta.dirname, "..", "data")
const RAW_FILE = join(OUTPUT_DIR, "places-raw.json")
const VENDORS_FILE = join(OUTPUT_DIR, "vendors-tagged.json")

// --- CONFIG ---
const DEFAULT_QUERIES = [
  "mobile golf simulator rental",
  "golf simulator rental",
  "golf simulator for hire",
  "golf simulator event rental",
  "portable golf simulator rental",
  "golf simulator trailer rental",
]

const QUERIES = process.env.SCRAPE_QUERIES
  ? process.env.SCRAPE_QUERIES.split(",").map(s => s.trim())
  : DEFAULT_QUERIES

const TOP_50_METROS = [
  "New York, NY", "Los Angeles, CA", "Chicago, IL", "Dallas, TX", "Houston, TX",
  "Washington, DC", "Philadelphia, PA", "Miami, FL", "Atlanta, GA", "Boston, MA",
  "Phoenix, AZ", "San Francisco, CA", "Riverside, CA", "Detroit, MI", "Seattle, WA",
  "Minneapolis, MN", "San Diego, CA", "Tampa, FL", "Denver, CO", "Baltimore, MD",
  "St. Louis, MO", "Orlando, FL", "Charlotte, NC", "San Antonio, TX", "Portland, OR",
  "Sacramento, CA", "Pittsburgh, PA", "Austin, TX", "Las Vegas, NV", "Cincinnati, OH",
  "Kansas City, MO", "Columbus, OH", "Indianapolis, IN", "Cleveland, OH", "San Jose, CA",
  "Nashville, TN", "Virginia Beach, VA", "Providence, RI", "Jacksonville, FL", "Milwaukee, WI",
  "Oklahoma City, OK", "Raleigh, NC", "Memphis, TN", "Richmond, VA", "Louisville, KY",
  "New Orleans, LA", "Salt Lake City, UT", "Hartford, CT", "Buffalo, NY", "Birmingham, AL",
]

const SCRAPE_LIMIT = process.env.SCRAPE_LIMIT_METROS
  ? parseInt(process.env.SCRAPE_LIMIT_METROS)
  : undefined

const CITIES = process.env.SCRAPE_CITIES
  ? process.env.SCRAPE_CITIES.split(",").map(s => s.trim())
  : SCRAPE_LIMIT ? TOP_50_METROS.slice(0, SCRAPE_LIMIT) : TOP_50_METROS

// --- EXCLUSION FILTERS ---
const EXCLUDED_NAME_KEYWORDS = [
  "topgolf", "five iron", "x-golf", "golf galaxy", "bigshots", "big shots",
  "drive shack", "popstroke", "country club", "golf club", "golf course",
  "driving range", "pga tour", "callaway", "dick's sporting",
  "golf town", "roger dunn", "golf mart",
]

const EXCLUDED_TYPES = [
  "golf_course", "golf_club", "country_club", "sporting_goods_store",
]

// --- TYPES ---
type PlaceResult = {
  id: string
  displayName?: { text: string }
  formattedAddress?: string
  nationalPhoneNumber?: string
  websiteUri?: string
  rating?: number
  userRatingCount?: number
  businessStatus?: string
  types?: string[]
  primaryType?: string
  primaryTypeDisplayName?: { text: string }
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
  searchQuery: string
  searchCity: string
  flaggedForReview: boolean
  excludeReason: string | null
}

// --- HELPERS ---
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80)
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function extractAddress(formatted: string) {
  const parts = formatted.replace(/, USA$/, "").split(",").map(s => s.trim())
  if (parts.length >= 3) {
    const stateZip = parts[parts.length - 1]
    const stateMatch = stateZip.match(/^([A-Z]{2})\s*(\d{5})?/)
    return {
      address: formatted.replace(/, USA$/, ""),
      city: parts[parts.length - 2],
      stateCode: stateMatch?.[1] || null,
      zipCode: stateMatch?.[2] || null,
    }
  }
  return { address: formatted, city: null, stateCode: null, zipCode: null }
}

function shouldExclude(place: PlaceResult): { exclude: boolean; reason: string | null; flagForReview: boolean } {
  const name = (place.displayName?.text || "").toLowerCase()
  const types = place.types || []

  // Check excluded name keywords
  for (const keyword of EXCLUDED_NAME_KEYWORDS) {
    if (name.includes(keyword)) {
      return { exclude: true, reason: `Name contains "${keyword}"`, flagForReview: false }
    }
  }

  // Check excluded Google types
  for (const excludedType of EXCLUDED_TYPES) {
    if (types.includes(excludedType)) {
      return { exclude: true, reason: `Google type "${excludedType}"`, flagForReview: false }
    }
  }

  // Flag high-review permanent venues for manual review (100+ reviews suggests a permanent venue)
  if ((place.userRatingCount || 0) >= 100) {
    return { exclude: false, reason: "100+ reviews — possible permanent venue", flagForReview: true }
  }

  // Flag if no website AND no phone (likely dead listing)
  if (!place.websiteUri && !place.nationalPhoneNumber) {
    return { exclude: true, reason: "No website and no phone", flagForReview: false }
  }

  return { exclude: false, reason: null, flagForReview: false }
}

function autoTag(name: string, types: string[], query: string): { tags: string[]; categories: string[] } {
  const searchText = [name, ...types, query].join(" ").toLowerCase()
  const tags: string[] = []
  const categories: string[] = []

  // Tags based on technology keywords
  if (searchText.includes("trackman")) tags.push("trackman")
  if (searchText.includes("full swing")) tags.push("full-swing")
  if (searchText.includes("foresight")) tags.push("foresight")
  if (searchText.includes("skytrak")) tags.push("skytrak")
  if (searchText.includes("uneekor")) tags.push("uneekor")
  if (searchText.includes("flightscope")) tags.push("flightscope")

  // Tags based on setup type
  if (searchText.includes("trailer")) tags.push("trailer")
  if (searchText.includes("indoor")) tags.push("indoor-setup")
  if (searchText.includes("outdoor")) tags.push("outdoor-setup")

  // Tags based on event type
  if (searchText.includes("corporate") || searchText.includes("team building")) tags.push("corporate")
  if (searchText.includes("wedding")) tags.push("wedding")
  if (searchText.includes("fundrais")) tags.push("fundraiser")
  if (searchText.includes("birthday")) tags.push("birthday-party")
  if (searchText.includes("bachelor")) tags.push("bachelor-party")
  if (searchText.includes("trade show")) tags.push("trade-show")

  // Categories
  if (searchText.includes("mobile") || searchText.includes("portable")) {
    categories.push("mobile-golf-simulator")
  }
  if (searchText.includes("trailer")) {
    categories.push("trailer-based-simulator")
  }
  if (searchText.includes("event") || searchText.includes("rental")) {
    categories.push("event-rental")
  }
  if (searchText.includes("corporate") || searchText.includes("team")) {
    categories.push("corporate-entertainment")
  }
  if (searchText.includes("party") || searchText.includes("birthday") || searchText.includes("bachelor")) {
    categories.push("party-rental")
  }
  if (searchText.includes("tournament")) {
    categories.push("tournament-setup")
  }

  // Default category if nothing matched
  if (categories.length === 0) {
    categories.push("mobile-golf-simulator", "event-rental")
  }

  return { tags: [...new Set(tags)], categories: [...new Set(categories)] }
}

// --- GOOGLE PLACES API (NEW) ---
const PLACES_API_BASE = "https://places.googleapis.com/v1/places:searchText"

async function searchPlaces(query: string, city: string, pageToken?: string): Promise<{ places: PlaceResult[]; nextPageToken?: string }> {
  const fullQuery = `${query} in ${city}`

  const body: Record<string, unknown> = {
    textQuery: fullQuery,
    languageCode: "en",
    regionCode: "US",
    maxResultCount: 20,
  }

  if (pageToken) {
    body.pageToken = pageToken
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": API_KEY!,
    "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount,places.businessStatus,places.types,places.primaryType,places.primaryTypeDisplayName,nextPageToken",
  }

  const res = await fetch(PLACES_API_BASE, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  })

  const data = await res.json() as { places?: PlaceResult[]; nextPageToken?: string; error?: { message: string; status: string } }

  if (data.error) {
    console.error(`  API error: ${data.error.status} - ${data.error.message}`)
    return { places: [] }
  }

  return {
    places: data.places || [],
    nextPageToken: data.nextPageToken,
  }
}

// --- MAIN ---
async function main() {
  console.log("Starting Google Places scraper for GolfSimGeek\n")
  console.log(`Queries: ${QUERIES.join(", ")}`)
  console.log(`Cities: ${CITIES.length} metros\n`)

  mkdirSync(OUTPUT_DIR, { recursive: true })

  // Load existing data if resuming
  let allPlaces: Map<string, PlaceResult & { searchQuery: string; searchCity: string }> = new Map()
  if (existsSync(RAW_FILE)) {
    const existing = JSON.parse(readFileSync(RAW_FILE, "utf-8")) as (PlaceResult & { searchQuery: string; searchCity: string })[]
    for (const place of existing) {
      allPlaces.set(place.id, place)
    }
    console.log(`Loaded ${allPlaces.size} existing places from cache\n`)
  }

  // Phase 1: Search
  let searchCount = 0
  for (const city of CITIES) {
    console.log(`\n${city}`)

    for (const query of QUERIES) {
      console.log(`  Searching: "${query}" in ${city}`)

      let pageToken: string | undefined
      let totalForQuery = 0

      for (let page = 0; page < 3; page++) {
        const result = await searchPlaces(query, city, pageToken)
        searchCount++

        for (const place of result.places) {
          if (!allPlaces.has(place.id)) {
            allPlaces.set(place.id, { ...place, searchQuery: query, searchCity: city })
            totalForQuery++
          }
        }

        pageToken = result.nextPageToken
        if (!pageToken) break

        await sleep(500)
      }

      console.log(`     Found ${totalForQuery} new places`)
      await sleep(300)
    }
  }

  writeFileSync(RAW_FILE, JSON.stringify([...allPlaces.values()], null, 2))
  console.log(`\nSearch complete: ${allPlaces.size} unique places found (${searchCount} API calls)\n`)

  // Phase 2: Filter, process, and auto-tag
  console.log("Processing, filtering, and auto-tagging...\n")

  const seenSlugs = new Set<string>()
  const vendors: TaggedVendor[] = []
  let excludedCount = 0
  let flaggedCount = 0

  for (const place of allPlaces.values()) {
    if (place.businessStatus === "CLOSED_PERMANENTLY") {
      excludedCount++
      continue
    }

    const name = place.displayName?.text || ""
    if (!name) {
      excludedCount++
      continue
    }

    const { exclude, reason, flagForReview } = shouldExclude(place)

    if (exclude) {
      console.log(`  EXCLUDED: ${name} — ${reason}`)
      excludedCount++
      continue
    }

    if (flagForReview) {
      flaggedCount++
    }

    const addr = extractAddress(place.formattedAddress || "")
    const { tags, categories } = autoTag(name, place.types || [], place.searchQuery)

    let slug = slugify(name)
    if (seenSlugs.has(slug)) {
      slug = `${slug}-${addr.city ? slugify(addr.city) : place.id.slice(-6)}`
    }
    if (seenSlugs.has(slug)) continue
    seenSlugs.add(slug)

    vendors.push({
      name,
      slug,
      websiteUrl: place.websiteUri || "",
      tagline: `${name} — mobile golf simulator rental in ${addr.city || "your area"}, ${addr.stateCode || ""}`.trim(),
      description: `${name} provides mobile golf simulator rental services in the ${addr.city || place.searchCity} area.${place.rating ? ` Rated ${place.rating}/5 by ${place.userRatingCount || 0} customers on Google.` : ""}`,
      phone: place.nationalPhoneNumber || null,
      city: addr.city,
      state: null,
      stateCode: addr.stateCode,
      zipCode: addr.zipCode,
      address: addr.address,
      googleRating: place.rating || null,
      reviewCount: place.userRatingCount || null,
      placeId: place.id,
      categories,
      tags,
      searchQuery: place.searchQuery,
      searchCity: place.searchCity,
      flaggedForReview: flagForReview,
      excludeReason: reason,
    })
  }

  writeFileSync(VENDORS_FILE, JSON.stringify(vendors, null, 2))

  // Stats
  const withWebsite = vendors.filter(v => v.websiteUrl).length
  const withPhone = vendors.filter(v => v.phone).length
  const flagged = vendors.filter(v => v.flaggedForReview).length

  console.log(`\nFinal Results:`)
  console.log(`   Raw places found:    ${allPlaces.size}`)
  console.log(`   Excluded:            ${excludedCount}`)
  console.log(`   Vendors kept:        ${vendors.length}`)
  console.log(`   With website:        ${withWebsite} (${vendors.length ? Math.round(withWebsite / vendors.length * 100) : 0}%)`)
  console.log(`   With phone:          ${withPhone} (${vendors.length ? Math.round(withPhone / vendors.length * 100) : 0}%)`)
  console.log(`   Flagged for review:  ${flagged}`)
  console.log(`\nSaved to:`)
  console.log(`   Raw data:     ${RAW_FILE}`)
  console.log(`   Tagged data:  ${VENDORS_FILE}`)
  console.log(`\nNext step: Run 'npx tsx scripts/import-vendors.ts' to import into database`)
}

main().catch(err => {
  console.error("Fatal error:", err)
  process.exit(1)
})
