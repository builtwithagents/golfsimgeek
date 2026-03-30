import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../.generated/prisma/client"

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY ?? ""

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length]
}

interface PlaceResult {
  displayName?: { text: string }
  formattedAddress?: string
  nationalPhoneNumber?: string
  websiteUri?: string
  regularOpeningHours?: { weekdayDescriptions?: string[] }
  reviews?: Array<{ text: { text: string }; rating: number }>
  types?: string[]
  rating?: number
  userRatingCount?: number
}

async function fetchWebsiteText(url: string): Promise<string> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" },
      redirect: "follow",
    })
    clearTimeout(timeout)
    if (!res.ok) return ""
    const html = await res.text()
    return html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<nav[\s\S]*?<\/nav>/gi, " ")
      .replace(/<footer[\s\S]*?<\/footer>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&[a-z]+;/gi, " ")
      .replace(/&#\d+;/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 6000)
  } catch {
    return ""
  }
}

async function searchPlace(name: string, city: string, state: string): Promise<PlaceResult | null> {
  try {
    const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_API_KEY,
        "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.websiteUri,places.reviews,places.types,places.rating,places.userRatingCount",
      },
      body: JSON.stringify({ textQuery: `${name} ${city} ${state}` }),
    })
    const data = await res.json()
    return data.places?.[0] || null
  } catch {
    return null
  }
}

function generateFAQs(
  name: string, city: string, state: string,
  websiteText: string, place: PlaceResult | null, index: number,
): string {
  const wt = websiteText.toLowerCase()

  // Detect features from website text
  const hasBar = /\b(full bar|cocktail|craft beer|wine list|spirits|happy hour)\b/i.test(websiteText)
  const hasFood = /\b(food|menu|kitchen|restaurant|appetizer|burger|pizza|wings|grill)\b/i.test(websiteText)
  const hasLessons = /\b(lesson|instruction|coaching|coach|pga professional|teaching pro|swing analysis)\b/i.test(websiteText)
  const hasEvents = /\b(event|party|corporate|birthday|bachelor|team building|private room)\b/i.test(websiteText)
  const hasMembership = /\b(member|membership)\b/i.test(websiteText)

  // Detect sim tech
  const simTechs: string[] = []
  if (/trackman/i.test(websiteText)) simTechs.push("Trackman")
  if (/full swing/i.test(websiteText)) simTechs.push("Full Swing")
  if (/gc\s?quad/i.test(websiteText)) simTechs.push("GCQuad")
  if (/foresight/i.test(websiteText)) simTechs.push("Foresight Sports")
  if (/toptracer/i.test(websiteText)) simTechs.push("Toptracer")
  if (/skytrak/i.test(websiteText)) simTechs.push("SkyTrak")
  if (/golfzon/i.test(websiteText)) simTechs.push("Golfzon")
  if (/uneekor/i.test(websiteText)) simTechs.push("Uneekor")
  if (/flightscope/i.test(websiteText)) simTechs.push("FlightScope")

  const bayMatch = websiteText.match(/(\d+)\s*(?:simulator|sim|bay|suite|hitting bay)/i)
  const bayCount = bayMatch ? parseInt(bayMatch[1]) : null
  const priceMatch = websiteText.match(/\$(\d+)\s*(?:\/|\s*per)\s*(?:hour|hr)/i)
  const pricePerHour = priceMatch ? priceMatch[1] : null

  const bayRef = bayCount ? `${bayCount} simulator bays` : "their simulator bays"
  const techRef = simTechs.length > 0 ? simTechs.join(" and ") : "high-end simulators"

  const faqPool: Array<{ q: string; a: string }> = []

  // Booking
  const bookingQs = [
    { q: `Do I need a reservation to play at ${name}?`, a: `Reservations are encouraged, particularly for evening and weekend slots when ${bayRef} fill up fast. You can typically book through their website or by phone. Walk-ins may work on slower days, but it's not guaranteed.` },
    { q: `How far in advance should I book at ${name}?`, a: `A few days ahead is usually enough for weekday visits. For Friday and Saturday evenings, booking a week out is safer since ${city}-area golfers tend to pack ${bayRef}. Their site or a quick call will lock in your time.` },
    { q: `Can I just show up at ${name} without booking?`, a: `You can try — if there's an open bay, they'll usually accommodate you. But ${name} is popular enough that walk-in availability isn't reliable, especially after work hours. A reservation takes 30 seconds and removes the guesswork.` },
    { q: `What's the best way to reserve a bay at ${name}?`, a: `Their website handles online bookings, or you can call ahead. If you're planning a group outing or weekend visit to ${name}, don't leave it to chance — reserve early so everyone has a spot.` },
    { q: `Does ${name} take walk-ins?`, a: `They do when space allows, but availability fluctuates. ${city} has enough demand for indoor golf that peak hours fill up. The surest route is booking ahead online, which only takes a minute.` },
    { q: `Is it hard to get a tee time at ${name}?`, a: `Not if you plan ahead. Midweek afternoons tend to be the easiest to grab, while weekend evenings go quickest. Their booking system shows real-time availability so you can pick a slot that works.` },
  ]
  faqPool.push(pick(bookingQs, index))

  // Skill level
  const levelQs = [
    { q: `Is ${name} suitable for someone who's never played golf?`, a: `Completely. The simulators at ${name} show you exactly what your swing is doing, which is helpful when you're starting from scratch. There's no pressure — you can take as many swings as you want without anyone waiting behind you.` },
    { q: `Do I need golf experience to visit ${name}?`, a: `No prior experience needed. Indoor sim golf is actually one of the better ways to pick up the game because ${techRef} gives you instant data on every shot. The staff can get you set up and swinging in minutes.` },
    { q: `Is ${name} only for serious golfers?`, a: `Far from it. The split at most sim facilities is roughly half recreational players and half golfers working on their game. ${name} in ${city} is no different — you'll see friend groups having fun alongside scratch golfers grinding on their swing.` },
    { q: `Will I enjoy ${name} if I'm not a good golfer?`, a: `That's actually when simulator golf is the most fun. There's no lost balls, no slow play, and ${techRef} shows you what happened on every shot so you can see yourself improving in real time. Skill level is irrelevant to having a good time here.` },
    { q: `Is indoor golf at ${name} intimidating for beginners?`, a: `Not at all. The environment at ${name} is low-key compared to showing up at a course for the first time. Staff will walk you through the basics, the simulator handles scoring, and you're in a private bay — nobody's watching your swing.` },
    { q: `Can kids play at ${name}?`, a: `Most indoor golf venues welcome younger players, and ${name} is set up for it. The simulators don't care about age or ability — they just track the ball. It can be a surprisingly good way to introduce kids to golf without the formality of a course.` },
  ]
  faqPool.push(pick(levelQs, index + 1))

  // Pricing
  if (pricePerHour) {
    const priceQs = [
      { q: `How much does it cost per hour at ${name}?`, a: `Bay time starts at $${pricePerHour}/hour. Rates typically shift based on the time slot — off-peak hours tend to be cheaper. Group sizes and day of the week can also affect pricing. Their website lists the full rate card.` },
      { q: `What are the rates at ${name}?`, a: `Expect to pay from $${pricePerHour}/hour for a bay. Peak times (evenings, weekends) may cost more. If you're bringing a group, the per-person math usually works out well since a single bay fits multiple players. Check their site for the latest.` },
      { q: `Is ${name} expensive?`, a: `At $${pricePerHour}/hour starting, it's in line with what indoor golf costs across ${state}. When you factor in that a bay holds multiple players, the per-person rate is often less than a round at a public course — and you're out of the weather.` },
    ]
    faqPool.push(pick(priceQs, index + 2))
  } else {
    const priceQs = [
      { q: `What does it cost to play at ${name}?`, a: `Pricing at ${name} varies by time of day and session length. Indoor golf in the ${city} area generally runs $30–$70/hour per bay, with off-peak and weekday discounts common. Contact them or check their website for their specific rate card.` },
      { q: `How much should I budget for a visit to ${name}?`, a: `Indoor golf pricing depends on when you go and how long you play. A typical session at a ${state} simulator venue runs 1–2 hours per bay. ${name} publishes their rates on their website, and calling ahead can sometimes surface unadvertised deals.` },
      { q: `Is indoor golf at ${name} cheaper than playing a real course?`, a: `It depends on the course, but when you split a bay among friends, indoor sim golf often comes out ahead — especially in ${state} where green fees can add up. ${name}'s website has their current pricing breakdown.` },
    ]
    faqPool.push(pick(priceQs, index))
  }

  // Tech
  if (simTechs.length > 0) {
    const techQs = [
      { q: `What type of golf simulators does ${name} have?`, a: `They run ${techRef}. This means every shot produces detailed numbers — ball speed, launch angle, spin rates, carry and total distance. The data is reliable enough for serious practice, and the virtual course play is engaging enough for a casual night out.` },
      { q: `What technology powers the simulators at ${name}?`, a: `${name} uses ${techRef}, which sits in the upper tier of simulator technology. You get precise ball tracking, realistic course rendering, and the kind of data that club fitters and instructors rely on.` },
      { q: `How accurate are the simulators at ${name}?`, a: `${name} runs ${techRef}, which is well-regarded for accuracy. The ball flight data — spin, speed, angle, distance — is consistent enough that golfers use it to make real swing changes and equipment decisions.` },
    ]
    faqPool.push(pick(techQs, index + 3))
  }

  // Events
  if (hasEvents) {
    const eventQs = [
      { q: `Can I book ${name} for a private party or corporate event?`, a: `Yes — ${name} handles group events regularly. The setup works well for team outings, birthday celebrations, bachelor parties, and client entertainment. Contact them early for weekend dates since event bookings in ${city} fill up.` },
      { q: `What kind of events can ${name} host?`, a: `Everything from corporate team-building to birthday parties to casual group outings. ${bayRef} can be reserved for your group, and the combination of golf, competition, and ${hasBar ? "a full bar" : hasFood ? "food" : "drinks"} makes it a natural fit.` },
      { q: `How many people can ${name} accommodate for a group event?`, a: `That depends on how many bays they can dedicate to your group. Each bay typically handles 4–6 players comfortably. Reach out to ${name} directly with your headcount and they'll put together a configuration that works.` },
    ]
    faqPool.push(pick(eventQs, index + 2))
  }

  // Food/drink
  if (hasBar || hasFood) {
    const foodQs = [
      { q: `Can I eat and drink while playing at ${name}?`, a: `${hasBar && hasFood ? "Full bar and food service are both available" : hasBar ? "A full bar is available" : "Food is available"} during your session. You don't have to leave your bay to order, which keeps the flow going.` },
      { q: `Does ${name} have a bar?`, a: `${hasBar ? `Yes, they operate a full bar with cocktails, beer, and more. Most people treat ${name} as equal parts golf and social outing.` : `They offer beverages during your session. Check with them for the current drink selection.`}` },
    ]
    faqPool.push(pick(foodQs, index + 1))
  }

  // Lessons
  if (hasLessons) {
    const lessonQs = [
      { q: `Does ${name} offer professional golf lessons?`, a: `They do. Instruction at ${name} pairs coaching with live simulator data from ${techRef}. The instructor can show you exactly what's happening with your swing and work on fixes in real time — a more efficient feedback loop than a traditional lesson.` },
      { q: `How are golf lessons at ${name} different from outdoor lessons?`, a: `The main difference is data. When you're hitting into ${techRef}, the instructor points to specific numbers rather than relying on feel alone. That tends to speed up improvement because you're not guessing about what changed.` },
    ]
    faqPool.push(pick(lessonQs, index))
  }

  // Membership
  if (hasMembership) {
    const memberQs = [
      { q: `Is a membership at ${name} worth it?`, a: `If you plan to visit regularly, a membership typically pays for itself within a few sessions through discounted bay rates and priority booking. Contact them for a breakdown of what each level includes.` },
      { q: `What do members get at ${name}?`, a: `Membership perks usually include reduced hourly rates, booking priority for popular weekend slots, and sometimes guest passes or event discounts. ${name} can walk you through their current options.` },
    ]
    faqPool.push(pick(memberQs, index))
  }

  // Equipment — always relevant
  const clubQs = [
    { q: `Do I need to bring my own golf clubs to ${name}?`, a: `No — ${name} provides clubs you can use during your session. That said, if you're working on your own game or getting a fitting done, bringing your own set gives you more relevant data. Either way, you're covered.` },
    { q: `Can I use my own clubs at ${name}?`, a: `Yes, and it's encouraged if you want the data to reflect your actual equipment. But if you're coming for fun or don't have clubs, ${name} has loaners available so you can still play a full round.` },
    { q: `Does ${name} rent golf clubs?`, a: `They have clubs available for guest use at no extra charge. You're also welcome to bring your own. If you're there for serious practice, your own clubs will give you the most useful data.` },
  ]
  faqPool.push(pick(clubQs, index + 2))

  // Shuffle deterministically
  const shuffled = [...faqPool]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = (index * 7 + i * 13) % (i + 1)
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  const faqCount = Math.min(shuffled.length, index % 3 === 0 ? 4 : 3)
  const faqs = shuffled.slice(0, faqCount)

  let faqSection = "## Frequently Asked Questions\n\n"
  faqs.forEach(faq => {
    faqSection += `**${faq.q}**\n\n${faq.a}\n\n`
  })
  return faqSection.trim()
}

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL!, max: 5 })
  const db = new PrismaClient({ adapter })

  const all = await db.tool.findMany({
    where: { status: "Published" },
    select: { id: true, name: true, websiteUrl: true, city: true, state: true, content: true },
  })

  // Find listings missing FAQ section
  const missing = all.filter(t => t.content && !t.content.includes("Frequently Asked Questions"))
  console.log(`Found ${missing.length} listings missing FAQs\n`)

  let updated = 0, failed = 0

  for (let i = 0; i < missing.length; i++) {
    const listing = missing[i]
    console.log(`[${i + 1}/${missing.length}] ${listing.name}`)

    // Fetch website + places data for FAQ context
    const websiteText = listing.websiteUrl && !listing.websiteUrl.includes("golfsimgeek.com")
      ? await fetchWebsiteText(listing.websiteUrl)
      : ""
    const place = await searchPlace(listing.name, listing.city!, listing.state!)

    const faqBlock = generateFAQs(listing.name, listing.city!, listing.state!, websiteText, place, i)
    const newContent = listing.content + "\n\n" + faqBlock

    await db.tool.update({ where: { id: listing.id }, data: { content: newContent } })
    console.log(`  ✓ Added ${faqBlock.split("**").length - 1} FAQs`)
    updated++

    await new Promise(r => setTimeout(r, 400))
  }

  console.log(`\nDone: ${updated} updated, ${failed} failed`)
  await db.$disconnect()
}

main().catch(console.error)
