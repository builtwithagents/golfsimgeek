import { readFileSync, writeFileSync } from "fs"
import { join } from "path"

const VENDORS_FILE = join(import.meta.dirname, "..", "data", "vendors-tagged.json")
const OUTPUT_FILE = join(import.meta.dirname, "..", "data", "vendors-ca-verified.json")

const MOBILE_KEYWORDS = [
  "mobile golf simulator", "mobile simulator", "portable golf simulator", "portable simulator",
  "golf simulator rental", "simulator rental", "rent a golf simulator", "rent a simulator",
  "bring the golf", "bring the simulator", "bring it to you", "we come to you", "comes to you",
  "delivered to your", "deliver to your", "at your location", "at your event", "at your venue",
  "on-site", "onsite", "event rental", "event entertainment", "corporate event",
  "golf simulator trailer", "simulator trailer", "trailer-based", "golf trailer",
  "party rental", "book a simulator", "book our simulator", "hire a golf", "for hire",
  "golf simulator for your event", "golf simulator experience",
  "mobile entertainment", "event packages", "rental packages", "rental rates",
  "book now", "reserve now", "get a quote",
]

const STATIC_VENUE_KEYWORDS = [
  "visit our location", "walk-in", "our facility", "our studio", "come visit",
  "golf lessons", "golf instruction", "golf academy", "golf school",
  "club fitting", "club repair", "pro shop", "golf store",
  "driving range", "mini golf", "miniature golf",
  "golf cart", "golf car", "cart sales", "cart service", "cart rental",
  "event lighting", "lighting company", "dj service",
  "rv rental", "trailer leasing", "truck rental",
  "indoor skydiving", "virtual reality", "vr gaming",
  "batting cage", "sportsplex", "sports complex",
]

type Vendor = {
  name: string
  websiteUrl: string
  city: string | null
  stateCode: string | null
  googleRating: number | null
  reviewCount: number | null
  phone: string | null
  placeId: string
  slug: string
  tagline: string
  description: string
  categories: string[]
  tags: string[]
  searchQuery: string
  searchCity: string
  flaggedForReview: boolean
  excludeReason: string | null
  address: string | null
  zipCode: string | null
}

async function fetchPageText(url: string): Promise<string | null> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; GolfSimGeek/1.0)" },
      redirect: "follow",
    })
    clearTimeout(timeout)
    if (!res.ok) return null
    const html = await res.text()
    // Strip HTML tags and get text
    return html.toLowerCase().replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").slice(0, 50000)
  } catch {
    return null
  }
}

async function main() {
  const allVendors: Vendor[] = JSON.parse(readFileSync(VENDORS_FILE, "utf-8"))

  // Filter to CA with websites, remove obvious non-fits
  const hardExcludes = [
    "golftec", "golf cart", "golfcart", "mini golf", "miniature golf", "putt-putt",
    "k1 speed", "ifly", "u-haul", "uhaul", "pods moving", "rv rental", "mobile kitchen",
    "tesla ev", "game wheelz", "mobile modular", "loadpro", "ameea trailer",
    "trailersplus", "trailers unlimited", "enjoy trailer", "oc trailer",
    "toy hauler", "nationwide mobile", "springline", "spark catering", "video amusement",
    "cyber quest", "bocce", "morgan hill", "orange people", "the apex",
    "a family affair", "standard trailer", "travels and trailer", "a class rv",
    "cart nation", "electric golf car", "resort life", "golf carts by design",
    "golf car central", "jm precision golf", "norm's custom", "vip golf cart",
    "gipson golf", "all cal golf", "jay's mobile cart", "aj golf car",
    "first tee", "ace kids", "subpar", "underground mini", "camelot", "golfland",
    "bucket golf", "ghost golf", "urban putt", "virtual reality", "virtuality",
    "sim racer", "teachme.to", "coastal carts", "brilliant event",
  ]

  const candidates = allVendors.filter(v => {
    if (!v.websiteUrl) return false
    if (v.stateCode !== "CA") return false
    const name = v.name.toLowerCase()
    return !hardExcludes.some(kw => name.includes(kw))
  })

  console.log(`Checking ${candidates.length} websites...\n`)

  const verified: (Vendor & { mobileScore: number; matchedKeywords: string[] })[] = []
  let checked = 0

  for (const vendor of candidates) {
    checked++
    process.stdout.write(`[${checked}/${candidates.length}] ${vendor.name}... `)

    const text = await fetchPageText(vendor.websiteUrl)
    if (!text) {
      console.log("SKIP (unreachable)")
      continue
    }

    // Score based on mobile/rental keywords found
    const matchedMobile: string[] = []
    for (const kw of MOBILE_KEYWORDS) {
      if (text.includes(kw)) matchedMobile.push(kw)
    }

    // Check for static venue indicators
    const matchedStatic: string[] = []
    for (const kw of STATIC_VENUE_KEYWORDS) {
      if (text.includes(kw)) matchedStatic.push(kw)
    }

    const mobileScore = matchedMobile.length - (matchedStatic.length * 0.5)

    if (mobileScore >= 2) {
      console.log(`YES (score: ${mobileScore}, matches: ${matchedMobile.slice(0, 3).join(", ")})`)
      verified.push({ ...vendor, mobileScore, matchedKeywords: matchedMobile })
    } else if (mobileScore >= 1) {
      console.log(`MAYBE (score: ${mobileScore}, matches: ${matchedMobile.join(", ")})`)
      verified.push({ ...vendor, mobileScore, matchedKeywords: matchedMobile })
    } else {
      console.log(`NO (mobile: ${matchedMobile.length}, static: ${matchedStatic.length})`)
    }

    // Small delay to be polite
    await new Promise(r => setTimeout(r, 300))
  }

  // Sort by score descending
  verified.sort((a, b) => b.mobileScore - a.mobileScore)

  writeFileSync(OUTPUT_FILE, JSON.stringify(verified, null, 2))

  console.log(`\n========================================`)
  console.log(`Verified mobile/rental operators: ${verified.length}`)
  console.log(`========================================\n`)

  for (const v of verified) {
    const confidence = v.mobileScore >= 3 ? "HIGH" : v.mobileScore >= 2 ? "MED" : "LOW"
    console.log(`[${confidence}] ${v.name} | ${v.city}, CA`)
    console.log(`       ${v.websiteUrl}`)
    console.log(`       Matches: ${v.matchedKeywords.slice(0, 5).join(", ")}`)
    console.log()
  }
}

main().catch(err => { console.error(err); process.exit(1) })
