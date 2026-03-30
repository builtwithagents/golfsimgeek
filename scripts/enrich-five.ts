import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../.generated/prisma/client"

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY ?? ""

interface PlaceDetails {
  name?: string
  formatted_address?: string
  formatted_phone_number?: string
  website?: string
  opening_hours?: { weekday_text?: string[] }
  reviews?: Array<{ text: string; rating: number; author_name: string }>
  types?: string[]
  rating?: number
  user_ratings_total?: number
  price_level?: number
  editorial_summary?: { overview: string }
}

async function fetchWebsiteText(url: string): Promise<string> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; GolfSimGeek/1.0)" },
    })
    clearTimeout(timeout)
    const html = await res.text()
    // Strip HTML tags, scripts, styles
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&#\d+;/g, " ")
      .replace(/\s+/g, " ")
      .trim()
    return text.slice(0, 5000) // Cap at 5000 chars
  } catch (e: any) {
    console.log(`  [website] Failed to fetch: ${e.message}`)
    return ""
  }
}

async function searchPlace(name: string, city: string, state: string): Promise<PlaceDetails | null> {
  try {
    const query = encodeURIComponent(`${name} ${city} ${state}`)
    const searchUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${query}&inputtype=textquery&fields=place_id&key=${GOOGLE_API_KEY}`
    const searchRes = await fetch(searchUrl)
    const searchData = await searchRes.json()

    if (!searchData.candidates?.length) {
      console.log(`  [places] No results found`)
      return null
    }

    const placeId = searchData.candidates[0].place_id
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,website,opening_hours,reviews,types,rating,user_ratings_total,price_level,editorial_summary&key=${GOOGLE_API_KEY}`
    const detailsRes = await fetch(detailsUrl)
    const detailsData = await detailsRes.json()

    return detailsData.result || null
  } catch (e: any) {
    console.log(`  [places] API error: ${e.message}`)
    return null
  }
}

function generateContent(
  name: string,
  city: string,
  state: string,
  websiteText: string,
  place: PlaceDetails | null,
): string {
  const sections: string[] = []

  // Intro - written originally based on facts gathered
  const placeTypes = place?.types?.filter(t => !t.startsWith("point_of_interest") && !t.startsWith("establishment")) || []
  const hasBar = websiteText.toLowerCase().includes("bar") || websiteText.toLowerCase().includes("drink") || websiteText.toLowerCase().includes("cocktail") || websiteText.toLowerCase().includes("beer")
  const hasFood = websiteText.toLowerCase().includes("food") || websiteText.toLowerCase().includes("menu") || websiteText.toLowerCase().includes("kitchen") || websiteText.toLowerCase().includes("restaurant")
  const hasLeague = websiteText.toLowerCase().includes("league")
  const hasLessons = websiteText.toLowerCase().includes("lesson") || websiteText.toLowerCase().includes("instruction") || websiteText.toLowerCase().includes("coaching")
  const hasEvents = websiteText.toLowerCase().includes("event") || websiteText.toLowerCase().includes("party") || websiteText.toLowerCase().includes("corporate") || websiteText.toLowerCase().includes("birthday")
  const hasMembership = websiteText.toLowerCase().includes("member") || websiteText.toLowerCase().includes("membership")
  const hasTrackman = websiteText.toLowerCase().includes("trackman")
  const hasFullSwing = websiteText.toLowerCase().includes("full swing")
  const hasGCQuad = websiteText.toLowerCase().includes("gcquad") || websiteText.toLowerCase().includes("gc quad")
  const hasAboutX = websiteText.toLowerCase().includes("aboutgolf") || websiteText.toLowerCase().includes("about golf")
  const hasForesight = websiteText.toLowerCase().includes("foresight")
  const hasToptracer = websiteText.toLowerCase().includes("toptracer")
  const hasSkytrak = websiteText.toLowerCase().includes("skytrak")
  const hasGolfzon = websiteText.toLowerCase().includes("golfzon")
  const hasFitting = websiteText.toLowerCase().includes("fitting") || websiteText.toLowerCase().includes("club fitting")
  const hasRental = websiteText.toLowerCase().includes("rental") || websiteText.toLowerCase().includes("mobile")

  // Determine simulator tech
  const simTechs: string[] = []
  if (hasTrackman) simTechs.push("Trackman")
  if (hasFullSwing) simTechs.push("Full Swing")
  if (hasGCQuad) simTechs.push("GCQuad")
  if (hasAboutX) simTechs.push("aboutGolf")
  if (hasForesight) simTechs.push("Foresight Sports")
  if (hasToptracer) simTechs.push("Toptracer")
  if (hasSkytrak) simTechs.push("SkyTrak")
  if (hasGolfzon) simTechs.push("Golfzon")

  // Extract bay/simulator count from website text
  const bayMatch = websiteText.match(/(\d+)\s*(?:simulator|sim|bay|suite|hitting)/i)
  const bayCount = bayMatch ? parseInt(bayMatch[1]) : null

  // Extract courses count
  const courseMatch = websiteText.match(/(\d+[\+,]?\d*)\s*(?:course|courses)/i)
  const courseCount = courseMatch ? courseMatch[1] : null

  // Build intro paragraph
  let intro = `${name} brings indoor golf to ${city}, ${state}`
  if (simTechs.length > 0) {
    intro += `, featuring ${simTechs.join(" and ")} simulator technology`
  }
  if (bayCount && bayCount > 1) {
    intro += ` across ${bayCount} hitting bays`
  }
  intro += `. Whether you're a seasoned player looking to sharpen your game year-round or a newcomer curious about the sport, this venue provides a comfortable, climate-controlled environment to play and practice.`
  sections.push(intro)

  // Simulator tech section
  if (simTechs.length > 0 || courseCount) {
    let techSection = "## Simulator Technology & Courses\n\n"
    if (simTechs.length > 0) {
      techSection += `The facility runs on ${simTechs.join(", ")} — among the most accurate launch monitor systems available today. Ball flight, spin rates, and club data are tracked in real time, giving players detailed feedback on every swing.`
    }
    if (courseCount) {
      techSection += ` Golfers can choose from ${courseCount} virtual courses, including famous championship layouts from around the world.`
    }
    sections.push(techSection)
  }

  // What's available section
  const offerings: string[] = []
  if (hasLessons) offerings.push("professional instruction and swing analysis")
  if (hasFitting) offerings.push("custom club fitting sessions")
  if (hasLeague) offerings.push("competitive simulator leagues")
  if (hasEvents) offerings.push("private event hosting for corporate outings and parties")
  if (hasRental) offerings.push("mobile simulator rental for off-site events")
  if (hasMembership) offerings.push("membership packages for regular players")

  if (offerings.length > 0) {
    let offerSection = "## What's Available\n\n"
    offerSection += `Beyond casual rounds, ${name} offers ${offerings.join(", ")}. `
    if (hasLessons) {
      offerSection += `Their coaching staff uses simulator data to provide targeted feedback, making lessons more productive than traditional range sessions.`
    }
    sections.push(offerSection)
  }

  // Food & drink section
  if (hasBar || hasFood) {
    let fbSection = "## Food & Drinks\n\n"
    if (hasBar && hasFood) {
      fbSection += `The venue doubles as a social destination with a full bar and food menu. Grab a drink and a bite between holes — it's one of the perks of playing indoors.`
    } else if (hasBar) {
      fbSection += `A full bar keeps the atmosphere lively. Order a cold beer or cocktail and enjoy your round at a relaxed pace — no foursome breathing down your neck.`
    } else {
      fbSection += `Food is available on-site, so you can fuel up without leaving the facility.`
    }
    sections.push(fbSection)
  }

  // Hours section from Google
  if (place?.opening_hours?.weekday_text?.length) {
    let hoursSection = "## Hours\n\n"
    hoursSection += place.opening_hours.weekday_text.join("  \n")
    sections.push(hoursSection)
  }

  // Reviews section — summarize themes, never quote directly
  if (place?.reviews?.length) {
    const avgRating = place.rating || 0
    const totalReviews = place.user_ratings_total || 0
    let reviewSection = "## What Golfers Are Saying\n\n"

    // Analyze review themes
    const reviewText = place.reviews.map(r => r.text).join(" ").toLowerCase()
    const themes: string[] = []
    if (reviewText.includes("staff") || reviewText.includes("friendly") || reviewText.includes("helpful")) themes.push("welcoming staff")
    if (reviewText.includes("clean") || reviewText.includes("nice") || reviewText.includes("well maintained")) themes.push("a well-maintained space")
    if (reviewText.includes("fun") || reviewText.includes("great time") || reviewText.includes("blast")) themes.push("an enjoyable atmosphere")
    if (reviewText.includes("accurate") || reviewText.includes("realistic")) themes.push("realistic simulator accuracy")
    if (reviewText.includes("food") || reviewText.includes("drink") || reviewText.includes("beer")) themes.push("solid food and drink options")
    if (reviewText.includes("price") || reviewText.includes("value") || reviewText.includes("worth")) themes.push("good value for money")

    if (avgRating >= 4.0) {
      reviewSection += `With a ${avgRating}-star average from ${totalReviews} reviews, ${name} has built a strong reputation. `
    }
    if (themes.length > 0) {
      reviewSection += `Visitors frequently highlight ${themes.slice(0, 3).join(", ")}.`
    }
    sections.push(reviewSection)
  }

  // Closing
  let closing = "## Visit " + name + "\n\n"
  closing += `Located in ${city}, ${state}, ${name} is a solid choice for anyone looking to play golf indoors`
  if (hasEvents) closing += ", host a memorable event"
  if (hasLessons) closing += ", or take their game to the next level with professional coaching"
  closing += `. Check their website or give them a call to book your session.`
  sections.push(closing)

  return sections.join("\n\n")
}

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL!, max: 5 })
  const db = new PrismaClient({ adapter })

  const listings = [
    { id: "arz3pbtohnxwdny42y9hn24q", name: "Golf 360", website: "http://www.golf360academy.com/", city: "Manchester", state: "New Hampshire" },
    { id: "bi2x2dmkdgidjdom2zqci9jl", name: "Bounce-n-Jump-a-rama", website: "https://bouncenjumparama.com/", city: "Milwaukee", state: "Wisconsin" },
    { id: "cfq45etg2rr52s2np12knv5g", name: "The Green Room", website: "http://www.thegreenroomne.com/", city: "Norfolk", state: "Nebraska" },
    { id: "cvu1x3ztpuzpm03kpoxcadza", name: "Clubhouse Work & Golf", website: "https://clubhouseworkandgolf.com/", city: "Greenwood Village", state: "Colorado" },
    { id: "difkvp2u68ig64nok6dmkckh", name: "Hoboken Game Lounge", website: "https://playhoboken.com/", city: "Hoboken", state: "New Jersey" },
  ]

  for (const listing of listings) {
    console.log(`\n========================================`)
    console.log(`[${listings.indexOf(listing) + 1}/5] ${listing.name} — ${listing.city}, ${listing.state}`)
    console.log(`========================================`)

    // Step 1: Scrape website
    console.log(`  Fetching ${listing.website}...`)
    const websiteText = await fetchWebsiteText(listing.website)
    console.log(`  Website text: ${websiteText.length} chars`)
    if (websiteText.length > 0) {
      console.log(`  Preview: ${websiteText.slice(0, 200)}...`)
    }

    // Step 2: Google Places details
    console.log(`  Searching Google Places...`)
    const place = await searchPlace(listing.name, listing.city, listing.state)
    if (place) {
      console.log(`  Found: ${place.name} — ${place.rating}★ (${place.user_ratings_total} reviews)`)
      if (place.opening_hours?.weekday_text) console.log(`  Hours: ${place.opening_hours.weekday_text[0]}...`)
      if (place.reviews?.length) console.log(`  Reviews: ${place.reviews.length} loaded`)
    } else {
      console.log(`  No Places result`)
    }

    // Step 3: Generate original content
    console.log(`  Generating content...`)
    const content = generateContent(listing.name, listing.city, listing.state, websiteText, place)
    console.log(`  Content length: ${content.length} chars`)
    console.log(`\n--- GENERATED CONTENT ---`)
    console.log(content)
    console.log(`--- END ---\n`)

    // Step 4: Update DB
    await db.tool.update({
      where: { id: listing.id },
      data: { content },
    })
    console.log(`  ✓ Saved to database`)
  }

  await db.$disconnect()
  console.log(`\nDone! 5 listings enriched.`)
}

main().catch(console.error)
