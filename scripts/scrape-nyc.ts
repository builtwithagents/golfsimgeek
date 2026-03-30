import { db } from "~/services/db"
import { ToolStatus } from "~/.generated/prisma/client"

const API_KEY = "AIzaSyAuY8QnV55QCki4xbjWifeg06N02ahbb60"

const QUERIES = [
  "mobile golf simulator rental",
  "golf simulator rental",
  "golf simulator for events",
  "portable golf simulator rental",
  "golf simulator trailer rental",
  "golf simulator party rental",
  "indoor golf simulator",
]

const CITIES = [
  "Manhattan, NY",
  "Brooklyn, NY",
  "Queens, NY",
  "Bronx, NY",
  "Staten Island, NY",
  "Jersey City, NJ",
  "Hoboken, NJ",
  "Westchester, NY",
  "Long Island, NY",
  "Stamford, CT",
]

const NAME_EXCLUDES = [
  "topgolf", "top golf", "five iron", "x-golf", "xgolf", "golf galaxy",
  "bigshots", "big shots", "drive shack", "popstroke", "pop stroke",
  "country club", "golf club", "golf course", "driving range",
  "dick's sporting", "pga tour superstore", "roger dunn",
  "golf cart", "mini golf", "miniature golf", "putt-putt", "putt putt",
  "golf town", "golftec", "club champion", "true spec",
  "pxg ", "callaway", "taylormade", "titleist",
  "ghost golf", "urban putt", "golfland", "subpar",
]

const TYPE_EXCLUDES = [
  "golf_course", "sporting_goods_store", "department_store",
  "shopping_mall", "shoe_store", "clothing_store",
]

interface Place {
  id: string
  displayName: { text: string }
  formattedAddress: string
  nationalPhoneNumber?: string
  websiteUri?: string
  rating?: number
  userRatingCount?: number
  types: string[]
}

const seen = new Set<string>()
const allPlaces: Place[] = []

async function searchPlaces(query: string, city: string) {
  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": API_KEY,
      "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount,places.types",
    },
    body: JSON.stringify({ textQuery: `${query} in ${city}`, languageCode: "en" }),
  })
  const data = await res.json()
  return (data.places || []) as Place[]
}

function shouldExclude(place: Place): string | null {
  const name = place.displayName.text.toLowerCase()
  for (const kw of NAME_EXCLUDES) {
    if (name.includes(kw)) return `Name contains "${kw}"`
  }
  for (const type of TYPE_EXCLUDES) {
    if (place.types.includes(type)) return `Google type "${type}"`
  }
  if (!place.websiteUri) return "No website"
  return null
}

function parseAddress(formatted: string) {
  const parts = formatted.replace(", USA", "").split(", ")
  const lastPart = parts[parts.length - 1] || ""
  const stateZip = lastPart.match(/^([A-Z]{2})\s*(\d{5})?/)
  return {
    address: parts[0] || "",
    city: parts.length >= 3 ? parts[parts.length - 2] : "",
    state: stateZip ? stateZip[1] : "",
    zip: stateZip ? stateZip[2] || "" : "",
  }
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

const MOBILE_KEYWORDS = [
  "mobile golf simulator", "mobile simulator", "portable golf simulator",
  "golf simulator rental", "simulator rental", "rent a golf simulator",
  "bring the golf", "bring the simulator", "we come to you", "comes to you",
  "at your location", "at your event", "at your venue",
  "on-site", "onsite", "event rental", "corporate event",
  "golf simulator trailer", "simulator trailer",
  "party rental", "book a simulator", "book our simulator",
  "golf simulator experience", "event packages", "rental packages",
  "book now", "reserve now", "get a quote",
  "indoor golf", "golf simulator", "trackman", "foresight", "full swing",
  "aboutgolf", "golfzon", "skytrak", "uneekor",
]

async function main() {
  console.log("Searching NYC metro for golf simulator businesses...\n")
  let searchCount = 0
  const totalSearches = CITIES.length * QUERIES.length

  for (const city of CITIES) {
    for (const query of QUERIES) {
      searchCount++
      process.stdout.write(`  [${searchCount}/${totalSearches}] "${query}" in ${city}... `)
      const places = await searchPlaces(query, city)
      let newCount = 0
      for (const p of places) {
        if (!seen.has(p.id)) {
          seen.add(p.id)
          allPlaces.push(p)
          newCount++
        }
      }
      console.log(`${newCount} new (${allPlaces.length} total)`)
      await new Promise(r => setTimeout(r, 200))
    }
    console.log()
  }

  console.log(`\nTotal unique places: ${allPlaces.length}`)
  console.log("\nFiltering...\n")

  const kept: Place[] = []
  for (const p of allPlaces) {
    const reason = shouldExclude(p)
    if (reason) {
      console.log(`  EXCLUDED: ${p.displayName.text} — ${reason}`)
    } else {
      console.log(`  KEPT: ${p.displayName.text} | ${p.websiteUri}`)
      kept.push(p)
    }
  }

  console.log(`\nKept ${kept.length} out of ${allPlaces.length} total\n`)
  console.log("Checking websites for simulator signals...\n")

  const verified: (Place & { score: number })[] = []
  let checkCount = 0

  for (const p of kept) {
    checkCount++
    process.stdout.write(`  [${checkCount}/${kept.length}] ${p.displayName.text}... `)
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 6000)
      const res = await fetch(p.websiteUri!, {
        signal: controller.signal,
        headers: { "User-Agent": "Mozilla/5.0 (compatible; GolfSimGeek/1.0)" },
        redirect: "follow",
      })
      clearTimeout(timeout)
      if (!res.ok) { console.log("SKIP (unreachable)"); continue }
      const html = await res.text()
      const text = html.toLowerCase().replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").slice(0, 50000)

      let score = 0
      const matches: string[] = []
      for (const kw of MOBILE_KEYWORDS) {
        if (text.includes(kw)) { score++; matches.push(kw) }
      }

      if (score >= 2) {
        console.log(`YES (score: ${score}) — ${matches.slice(0, 4).join(", ")}`)
        verified.push({ ...p, score })
      } else {
        console.log(`NO (score: ${score})`)
      }
    } catch {
      console.log("SKIP (error)")
    }
    await new Promise(r => setTimeout(r, 300))
  }

  console.log(`\n========================================`)
  console.log(`Verified: ${verified.length} businesses`)
  console.log(`========================================\n`)

  const cat = await db.category.findFirst({ where: { slug: "mobile-rentals" } })
    || await db.category.create({ data: { name: "Mobile Rentals", slug: "mobile-rentals" } })
  const admin = await db.user.findFirstOrThrow({ where: { role: "admin" } })

  let added = 0, skipped = 0

  for (const p of verified) {
    const slug = slugify(p.displayName.text)
    const existing = await db.tool.findFirst({ where: { OR: [{ slug }, { placeId: p.id }] } })
    if (existing) { console.log(`SKIP (exists): ${p.displayName.text}`); skipped++; continue }

    const addr = parseAddress(p.formattedAddress)
    await db.tool.create({
      data: {
        name: p.displayName.text,
        slug,
        websiteUrl: p.websiteUri!,
        description: `${p.displayName.text} offers golf simulator experiences in the ${addr.city || "NYC metro"} area.`,
        tagline: `Golf simulator in ${addr.city || "NYC"}, ${addr.state || "NY"}`,
        content: "",
        submitterEmail: admin.email,
        owner: { connect: { id: admin.id } },
        phone: p.nationalPhoneNumber || null,
        address: addr.address,
        city: addr.city,
        state: addr.state,
        stateCode: addr.state,
        zipCode: addr.zip,
        placeId: p.id,
        googleRating: p.rating || null,
        reviewCount: p.userRatingCount || 0,
        mobileConfirmed: false,
        status: ToolStatus.Published,
        publishedAt: new Date(),
        categories: { connect: { id: cat.id } },
      },
    })
    console.log(`ADDED: ${p.displayName.text} (${addr.city}, ${addr.state})`)
    added++
  }

  console.log(`\nDone! Added: ${added}, Skipped: ${skipped}`)
  
  const newListings = await db.tool.findMany({
    where: { content: "", status: "Published" },
    select: { id: true, name: true, websiteUrl: true, city: true, stateCode: true }
  })
  console.log("\n=== LISTINGS NEEDING ENRICHMENT ===")
  console.log(JSON.stringify(newListings, null, 2))
}

main().catch(err => { console.error(err); process.exit(1) })
