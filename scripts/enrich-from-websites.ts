import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../.generated/prisma/client"

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY ?? ""

const JUNK_SIGNALS = [
  "bounce house", "inflatable", "jump house", "water slide rental",
  "mini golf", "miniature golf", "putt putt",
  "golf cart", "cart rental", "cart sales", "cart dealer",
  "trailer rental", "dumpster", "porta potty",
  "lawn care", "landscaping", "pressure washing",
  "real estate", "mortgage", "insurance agent",
]

const GOLF_SIM_SIGNALS = [
  "simulator", "sim bay", "trackman", "full swing", "gcquad", "foresight",
  "aboutgolf", "golfzon", "skytrak", "toptracer", "launch monitor",
  "indoor golf", "virtual golf", "golf lounge", "sim lounge",
  "hitting bay", "golf lesson", "swing analysis", "club fitting",
  "golf range", "driving range", "golf center", "golf studio",
]

interface PlaceResult {
  displayName?: { text: string }
  formattedAddress?: string
  nationalPhoneNumber?: string
  websiteUri?: string
  regularOpeningHours?: {
    weekdayDescriptions?: string[]
  }
  reviews?: Array<{ text: { text: string }; rating: number; authorAttribution: { displayName: string } }>
  types?: string[]
  rating?: number
  userRatingCount?: number
  editorialSummary?: { text: string }
}

async function fetchWebsiteText(url: string): Promise<string> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" },
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
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&[a-z]+;/gi, " ")
      .replace(/&#\d+;/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 8000)
  } catch (e: any) {
    console.log(`  [website] Failed: ${e.message}`)
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
        "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.websiteUri,places.regularOpeningHours,places.reviews,places.types,places.rating,places.userRatingCount,places.editorialSummary",
      },
      body: JSON.stringify({ textQuery: `${name} ${city} ${state}` }),
    })
    const data = await res.json()
    return data.places?.[0] || null
  } catch (e: any) {
    console.log(`  [places] Error: ${e.message}`)
    return null
  }
}

function isJunk(websiteText: string, place: PlaceResult | null): { junk: boolean; reason: string } {
  const combined = (websiteText + " " + (place?.types || []).join(" ")).toLowerCase()
  const junkHits = JUNK_SIGNALS.filter(s => combined.includes(s))
  const golfHits = GOLF_SIM_SIGNALS.filter(s => combined.includes(s))

  if (junkHits.length >= 2 && golfHits.length === 0) {
    return { junk: true, reason: `Junk: ${junkHits.join(", ")}` }
  }
  if (junkHits.length >= 1 && golfHits.length === 0 && websiteText.length > 200) {
    return { junk: true, reason: `No golf signals + junk: ${junkHits.join(", ")}` }
  }
  return { junk: false, reason: "" }
}

// Utility to pick from array based on index (deterministic but varied)
function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length]
}

const INTROS = [
  (n: string, c: string, s: string, t: string, b: string) =>
    `${n} is an indoor golf destination in ${c}, ${s}${t}${b}. The facility provides a climate-controlled space to play and practice year-round, with simulators that track every measurable aspect of your swing — from ball speed and launch angle to spin rate and carry distance. Whether you're a competitive player trying to shave strokes or someone who just wants to hit balls with friends on a Tuesday night, the setup here works for both.`,
  (n: string, c: string, s: string, t: string, b: string) =>
    `Located in ${c}, ${s}, ${n} offers year-round golf through high-end simulators${t}${b}. It caters to players of all skill levels — from complete beginners stepping into a bay for the first time to competitive golfers who know their spin loft and are actively trying to fix their over-the-top move. What makes indoor golf useful here is the feedback: every shot produces data you can actually do something with.`,
  (n: string, c: string, s: string, t: string, b: string) =>
    `${n} runs out of ${c}, ${s}, providing indoor simulator sessions${t}${b}. The format is straightforward — you get a private bay, you hit balls, and the technology tells you exactly what happened. Ball flight data is displayed in real time, and the virtual course library lets you play layouts that most golfers will never see in person. It's an efficient way to stay sharp between outdoor rounds or during stretches when weather makes the course unusable.`,
  (n: string, c: string, s: string, t: string, b: string) =>
    `For golfers in the ${c} area, ${n} is a dedicated indoor golf facility${t}${b}. The appeal is practical: ${s} winters don't have to mean four months away from the game. But even beyond weather, there's a case for simulator golf as a training tool in its own right — the data density you get from a single session here would take weeks to accumulate through normal course play.`,
  (n: string, c: string, s: string, t: string, b: string) =>
    `${n} gives ${c}-area golfers a place to play without depending on weather or daylight${t}${b}. The ${s} venue pairs advanced simulator technology with a setting that's more relaxed than a traditional golf environment. You're in a private bay, the data is on the screen, and there's no one behind you rushing your pace. That combination — accurate feedback in a low-pressure space — is why indoor golf has grown as fast as it has.`,
  (n: string, c: string, s: string, t: string, b: string) =>
    `Step inside ${n} in ${c}, ${s} and you'll find a modern indoor golf setup${t}${b}. The simulators deliver precise shot data on every swing, making each session useful whether you're playing a casual round with coworkers or grinding through a practice plan with a specific swing flaw in mind. The versatility is the point — one venue handles recreation, practice, events, and everything in between.`,
  (n: string, c: string, s: string, t: string, b: string) =>
    `${n} has built its reputation in the ${c}, ${s} golf scene by doing the basics well${t}${b}. The bays are set up for accurate ball tracking, the tech is maintained, and the space is designed to keep players comfortable during longer sessions. Some indoor golf venues feel like glorified driving ranges. The better ones — like this — treat simulator golf as its own category, with the equipment and environment to match.`,
  (n: string, c: string, s: string, t: string, b: string) =>
    `If you're looking for indoor golf near ${c}, ${n} is worth putting on your list${t}${b}. The ${s} facility centers its experience around simulator accuracy and a comfortable playing environment. The data matters here — not just as a novelty, but as the core reason serious golfers keep coming back. When you can measure your improvement in concrete numbers from session to session, training has a different quality to it.`,
  (n: string, c: string, s: string, t: string, b: string) =>
    `${n} operates one of the better indoor golf spaces in ${c}, ${s}${t}${b}. The setup is built for golfers who want access to both virtual course play and meaningful practice data year-round. There's a reason the indoor golf category has exploded — simulator technology has gotten accurate enough that the feedback you get in a bay is genuinely useful, not just entertaining. ${n} capitalizes on that with a well-configured space and technology that holds up under scrutiny.`,
  (n: string, c: string, s: string, t: string, b: string) =>
    `Tucked into ${c}, ${s}, ${n} brings golf indoors${t}${b}. It's the kind of spot where you can work through a full 18 holes on a famous course, dial in your wedge distances, or just hit balls with a few friends when the weather doesn't cooperate. The private bay format means your session stays yours — no crowded range stalls, no waiting for the person next to you to finish their pre-shot routine.`,
  (n: string, c: string, s: string, t: string, b: string) =>
    `${n} is a simulator-driven golf venue in ${c}, ${s}${t}${b}. The space is built around shot data and virtual course play for golfers who take the game seriously enough to want real feedback, but don't need the overhead of a full training academy. Casual players are equally welcome — the tech doesn't judge your swing, it just shows you what it did. That honesty, delivered in a comfortable environment, is the core offer.`,
  (n: string, c: string, s: string, t: string, b: string) =>
    `Golf in ${c} doesn't have to stop when the sun goes down or the temperatures drop. ${n}${t}${b} keeps the game going year-round with simulator bays built for both fun and focused practice. The indoor format has its own advantages beyond just weather protection — faster pace of play, instant shot feedback, and the ability to play courses that would otherwise require a plane ticket. ${n} packages all of that into a venue worth visiting.`,
]

const SIM_DESCRIPTIONS: Record<string, string> = {
  "Trackman": "radar-based tracking trusted by PGA Tour players",
  "Full Swing": "dual-tracking technology used in many high-end commercial setups",
  "GCQuad": "photometric launch monitoring with tour-level accuracy",
  "Foresight Sports": "photometric sensors that capture precise spin and launch data",
  "Golfzon": "a Korean-engineered system with a moving swing platform",
  "SkyTrak": "photometric tracking popular for both commercial and home builds",
  "Toptracer": "the ball-tracing tech seen on professional broadcasts",
  "Uneekor": "overhead launch monitoring with dual optical sensors",
  "FlightScope": "Doppler radar tracking favored by club fitters",
  "E6 Connect": "simulation software with a deep library of virtual courses",
  "TGC 2019": "community-built course library with thousands of layouts",
}

function generateContent(
  name: string, city: string, state: string,
  websiteText: string, place: PlaceResult | null, index: number,
): string {
  const sections: string[] = []
  const wt = websiteText.toLowerCase()

  // Detect features
  const hasBar = /\b(full bar|cocktail|craft beer|wine list|spirits|happy hour|drinks menu)\b/i.test(websiteText)
  const hasDrinks = /\b(beer|drink|wine)\b/i.test(websiteText) && !hasBar
  const hasFood = /\b(food|menu|kitchen|restaurant|appetizer|burger|pizza|wings|snack|grill)\b/i.test(websiteText)
  const hasLeague = /\bleague\b/i.test(websiteText)
  const hasLessons = /\b(lesson|instruction|coaching|coach|pga professional|teaching pro|swing analysis)\b/i.test(websiteText)
  const hasEvents = /\b(event|party|corporate|birthday|bachelor|team building|private room|group booking)\b/i.test(websiteText)
  const hasMembership = /\b(member|membership)\b/i.test(websiteText)
  const hasFitting = /\b(fitting|club fitting|custom fit)\b/i.test(websiteText)
  const hasRental = /\b(mobile rental|portable|come to you|mobile simulator|mobile golf)\b/i.test(websiteText)
  const hasCoworking = /\b(cowork|workspace|office space|meeting room|conference)\b/i.test(websiteText)
  const hasVR = /\b(virtual reality|vr golf|vr experience)\b/i.test(websiteText)

  // Detect sim tech
  const simTechs: string[] = []
  if (/trackman/i.test(websiteText)) simTechs.push("Trackman")
  if (/full swing/i.test(websiteText)) simTechs.push("Full Swing")
  if (/gc\s?quad/i.test(websiteText)) simTechs.push("GCQuad")
  if (/aboutgolf/i.test(websiteText)) simTechs.push("aboutGolf")
  if (/foresight/i.test(websiteText)) simTechs.push("Foresight Sports")
  if (/toptracer/i.test(websiteText)) simTechs.push("Toptracer")
  if (/skytrak/i.test(websiteText)) simTechs.push("SkyTrak")
  if (/golfzon/i.test(websiteText)) simTechs.push("Golfzon")
  if (/uneekor/i.test(websiteText)) simTechs.push("Uneekor")
  if (/flightscope/i.test(websiteText)) simTechs.push("FlightScope")
  if (/e6\s?connect/i.test(websiteText)) simTechs.push("E6 Connect")
  if (/tgc\s?2019/i.test(websiteText)) simTechs.push("TGC 2019")

  // Extract numbers
  const bayMatch = websiteText.match(/(\d+)\s*(?:simulator|sim|bay|suite|hitting bay)/i)
  const bayCount = bayMatch ? parseInt(bayMatch[1]) : null
  const courseMatch = websiteText.match(/(\d+[\+,]?\d*)\s*(?:course|courses)/i)
  const courseCount = courseMatch ? courseMatch[1] : null

  // Price extraction
  const priceMatch = websiteText.match(/\$(\d+)\s*(?:\/|\s*per)\s*(?:hour|hr)/i)
  const pricePerHour = priceMatch ? priceMatch[1] : null

  // Intro
  const techStr = simTechs.length > 0 ? ` powered by ${simTechs.join(" and ")}` : ""
  const bayStr = bayCount && bayCount > 1 ? ` with ${bayCount} simulator bays` : ""
  sections.push(INTROS[index % INTROS.length](name, city, state, techStr, bayStr))

  // Sim tech section — verbose, editorial
  if (simTechs.length > 0 || courseCount) {
    const techHeaders = ["## Simulator Technology", "## The Technology", "## What's Under the Hood", "## Simulator Setup"]
    let s = `${pick(techHeaders, index)}\n\n`
    if (simTechs.length === 1) {
      const tech = simTechs[0]
      const desc = SIM_DESCRIPTIONS[tech as keyof typeof SIM_DESCRIPTIONS]
      const techIntros = [
        `${name} runs on ${tech}${desc ? `, ${desc}` : ""}. `,
        `The simulator setup here is built around ${tech}${desc ? ` — ${desc}` : ""}. `,
        `For ball tracking, ${name} uses ${tech}${desc ? `, which is ${desc}` : ""}. `,
      ]
      s += pick(techIntros, index)
      const techBodyVariants = [
        `Every shot produces a full data printout — ball speed, launch angle, spin rate, carry distance, and more. That level of detail makes it possible to identify what's actually happening in your swing, not just what it feels like. Golfers who've only ever played by feel often find their first simulator session eye-opening.`,
        `The data output covers the metrics that actually matter for improvement: ball speed, launch angle, peak height, spin rate, and carry. Having those numbers on screen after every shot changes how you practice. Instead of guessing why your iron went left, you can see exactly what the face and path were doing.`,
        `Ball speed, launch angle, total spin, smash factor, carry distance — it all shows up after every swing. That volume of feedback compressed into a single session is one of the main reasons simulator golf has become a legitimate practice tool, not just a rainy-day substitute for the real thing.`,
      ]
      s += pick(techBodyVariants, index + 1)
    } else if (simTechs.length > 1) {
      s += `${name} uses ${simTechs.join(" and ")} for ball and club tracking. `
      s += `Between them, the setup delivers comprehensive shot data — ball speed, spin rates, launch angle, face angle at impact, and carry distance. Having multiple systems or a high-spec single unit means the numbers you're seeing are reliable enough to make real decisions about your swing and equipment.`
    }
    if (courseCount) {
      const courseVariants = [
        ` The virtual course library includes ${courseCount} layouts — a mix of famous championship venues, bucket-list destination courses, and more relaxed tracks for when you just want to play without the scorecard pressure.`,
        ` Course options run to ${courseCount} virtual layouts, ranging from iconic tournament venues to accessible designs well-suited for casual rounds or group play.`,
        ` With ${courseCount} courses available, you're not going to run out of options. The library includes well-known championship tracks alongside a solid selection of resort and parkland layouts.`,
      ]
      s += pick(courseVariants, index)
    }
    sections.push(s)
  }

  // Services
  const services: string[] = []
  const lessonPhrasing = [
    "golf lessons backed by real-time data",
    "professional instruction paired with simulator feedback",
    "one-on-one coaching using launch monitor stats",
    "swing coaching informed by shot data",
  ]
  const fittingPhrasing = [
    "club fitting sessions driven by launch monitor numbers",
    "data-backed club fitting to dial in your equipment",
    "custom club fitting with precise ball flight analysis",
  ]
  const leaguePhrasing = [
    "simulator leagues for regular competition",
    "organized league play for competitive golfers",
    "weekly league rounds on the simulators",
  ]
  const eventPhrasing = [
    "private event hosting and group reservations",
    "space for corporate outings, parties, and group bookings",
    "event packages for birthdays, team outings, and more",
  ]
  const rentalPhrasing = [
    "mobile simulator rental for off-site events",
    "portable simulator setups delivered to your location",
    "on-location simulator rental for parties and events",
  ]

  if (hasLessons) services.push(pick(lessonPhrasing, index))
  if (hasFitting) services.push(pick(fittingPhrasing, index))
  if (hasLeague) services.push(pick(leaguePhrasing, index))
  if (hasEvents) services.push(pick(eventPhrasing, index))
  if (hasRental) services.push(pick(rentalPhrasing, index))
  if (hasMembership) services.push("membership options for regulars")
  if (hasCoworking) services.push("shared workspace alongside the golf bays")
  if (hasVR) services.push("VR-based golf experiences")

  if (services.length > 0) {
    const serviceHeaders = ["## What's Available", "## Services", "## What They Offer", "## Beyond Open Play"]
    let s = `${pick(serviceHeaders, index)}\n\n`

    if (hasLessons) {
      const lessonVariants = [
        `${name} offers professional golf instruction using the simulator's data as a teaching tool. The advantage over a traditional outdoor lesson is immediacy — when your instructor can pull up your face angle, spin rate, and attack angle on the screen right after a swing, the feedback loop tightens considerably. You're not relying on feel or video from a difficult angle; you're looking at numbers that tell the exact story of what happened. Players who've struggled to translate outdoor lessons into real improvement often find the data-driven format here more actionable.`,
        `Golf instruction at ${name} is built around the simulator's feedback rather than just the instructor's eye. That means every swing produces measurable data — launch angle, path, face angle, spin — that both you and the instructor can analyze together. The format is particularly effective for players who've been told "you're coming over the top" or "your face is open" without ever having a clear picture of what that actually looks like in numbers.`,
        `Lessons at ${name} combine professional coaching with the kind of shot data most golfers only see in Tour-level fitting sessions. The instructor can track changes in your numbers in real time as you work on a specific fault, rather than waiting until your next round to see if anything improved. It's a more efficient use of an hour than most traditional lesson formats.`,
      ]
      s += pick(lessonVariants, index) + "\n\n"
    }

    if (hasFitting) {
      const fittingVariants = [
        `Club fitting at ${name} uses the simulator's launch monitor data to match equipment to your actual ball flight — not to a generic swing profile. The fitting process measures ball speed, spin, launch angle, and smash factor across different shaft and head combinations, giving you a data-backed reason for any recommended change rather than a sales pitch.`,
        `Custom club fitting here is driven by numbers: ball speed, spin rate, launch angle, and carry distance across multiple shaft and head options. The result is a recommendation grounded in how the ball actually flew off your face, not how it felt or looked from the side. For golfers who've bought equipment based on a hitting bay demo, this kind of rigorous fitting is a meaningful upgrade.`,
      ]
      s += pick(fittingVariants, index) + "\n\n"
    }

    if (hasEvents) {
      const eventVariants = [
        `${name} handles private events and group bookings, which is part of why corporate outings and social gatherings have become a significant part of the indoor golf business model. The private bay format translates naturally to group play — everyone competes on the same virtual course, the scoring is automatic, and you don't need golf experience to have a good time. It's a format that works for team-building events, birthday celebrations, bachelor parties, or any group that wants something more interactive than a dinner reservation.`,
        `Group events are a core part of what ${name} offers. The controlled environment — private bays, automated scoring, no dress code requirement — makes simulator golf one of the better formats for corporate and social gatherings. Guests who've never touched a club and guests who play to a single-digit handicap can share the same bay and both have a legitimate experience.`,
      ]
      s += pick(eventVariants, index) + "\n\n"
    }

    if (hasLeague) {
      const leagueVariants = [
        `Simulator leagues at ${name} give regular players a structured reason to show up consistently. League formats vary — some run stroke play across multiple sessions, others use match play or Stableford — but the appeal is the same: real competition against people at a similar level, tracked over time. It's one of the better ways to stay engaged with the game during months when outdoor play isn't realistic.`,
        `${name} runs organized league play on the simulators, which is worth knowing about if you're someone who plays better with something on the line. League rounds add a competitive layer to what might otherwise be a casual practice session, and the leaderboard format gives you a benchmark to measure improvement against.`,
      ]
      s += pick(leagueVariants, index) + "\n\n"
    }

    if (hasMembership) {
      const memberVariants = [
        `Membership options at ${name} are designed for golfers who plan to visit more than occasionally. The economics usually work out to a meaningful discount on hourly rates — the more you play, the more the math tilts in favor of a membership tier over pay-as-you-go. Members also tend to get priority booking access, which matters during peak evening and weekend hours.`,
        `For frequent visitors, ${name} offers membership plans that reduce the per-session cost and often include booking priority. If you're the type to use a simulator facility weekly during the off-season, the math on a membership versus hourly rates is usually worth running.`,
      ]
      s += pick(memberVariants, index)
    }

    if (pricePerHour && !hasLessons && !hasFitting && !hasEvents) {
      s += `Bay time starts at $${pricePerHour}/hour. Rates may vary by time slot and day of the week.`
    }

    sections.push(s.trimEnd())
  }

  // Food & drink — verbose
  if (hasBar || hasDrinks || hasFood) {
    const foodHeaders = ["## Food & Drinks", "## Food and Drink", "## Drinks & Food", "## The Bar & Kitchen"]
    let s = `${pick(foodHeaders, index)}\n\n`
    if (hasBar && hasFood) {
      const variants = [
        `${name} operates with a full bar and food service running alongside the simulator bays. You can order drinks and a meal without stepping away from your session, which keeps the pace relaxed for groups. The combination of food, drinks, and golf in one space is part of why the indoor golf lounge format has taken off — it turns a practice activity into a social outing. Whether you're there for the golf or the atmosphere, the F&B operation adds a layer that a traditional driving range can't replicate.`,
        `The food and bar program at ${name} is a legitimate part of the experience, not an afterthought. A full drink menu runs alongside the simulator bays, and food service means you're not watching the clock to get out before you get hungry. It's the kind of setup that encourages longer visits — the golf is good, the drinks are right there, and nobody has to leave the bay to place an order.`,
        `${name} combines simulator golf with a full bar and food service, which changes the nature of a visit. You're not just coming to hit balls — you're settling in. Groups tend to stay longer when there's food and drinks built into the experience, and the competitive element of playing a virtual round together gives the social dimension of the outing some structure.`,
      ]
      s += pick(variants, index)
    } else if (hasBar) {
      const variants = [
        `A full bar runs alongside the simulator bays at ${name}. Cocktails, beer, and other options are available during your session, which contributes to the social energy of the space. Indoor golf with a drink in hand is a different experience than grinding through practice drills — it's one of the formats that's genuinely fun for groups who don't all take their golf seriously.`,
        `${name} operates a full bar, which is worth mentioning because it shapes the kind of experience you have here. This isn't a practice facility with a vending machine — the drink service is real, and it makes the space work as a social destination alongside its utility as a golf venue. Groups who want to play some golf and have a good time will find the combination works well.`,
      ]
      s += pick(variants, index)
    } else if (hasFood) {
      const variants = [
        `Food is available during your session at ${name}, so a longer visit doesn't require a detour. The ability to eat without leaving your bay is a practical convenience that most outdoor golf setups can't offer, and it makes the venue more suitable for groups who want to make an afternoon or evening of it rather than just knock out a quick round.`,
        `${name} offers food service alongside the simulator bays. It's a detail that matters more than it sounds — having the option to eat without leaving changes how long people stay and how the visit gets planned. Groups who might otherwise stop after one round often end up booking another bay slot when food and drinks are part of the equation.`,
      ]
      s += pick(variants, index)
    } else {
      s += `Drinks are available during your session at ${name}, adding a social element to what might otherwise feel like a straight practice outing. It's a small detail, but it signals that the venue is set up for relaxed, enjoyable visits — not just grinding repetitions.`
    }
    sections.push(s)
  }

  // Hours
  if (place?.regularOpeningHours?.weekdayDescriptions?.length) {
    let s = "## Hours\n\n"
    s += place.regularOpeningHours.weekdayDescriptions.join("  \n")
    sections.push(s)
  }

  // Reputation from reviews
  if (place?.reviews?.length && place.rating) {
    const reviewText = place.reviews.map(r => r.text?.text || "").join(" ").toLowerCase()
    const themes: string[] = []
    const staffPhrases = ["a friendly and helpful team", "staff that know their stuff", "personnel who go out of their way", "an attentive crew", "responsive service from the staff"]
    const cleanPhrases = ["a well-kept space", "a clean and modern setup", "solid upkeep throughout", "a polished facility", "tidy and well-maintained bays"]
    const funPhrases = ["a great time for groups and solo players alike", "an experience people come back for", "a vibe that keeps customers returning", "sessions that fly by", "entertainment value that delivers"]
    const accuracyPhrases = ["realistic ball flight and data", "simulators that feel true to life", "shot tracking you can trust", "data accuracy that serious golfers appreciate", "reliable readings on every swing"]
    const foodPhrases = ["solid food and drink options", "a menu that adds to the visit", "refreshments that complement the golf", "on-site dining worth trying"]
    const valuePhrases = ["reasonable pricing", "rates that feel fair for the experience", "good value relative to other indoor golf spots", "competitive pricing for the area"]
    const lessonPhrases = ["coaching that produces results", "instruction backed by real data", "lessons that translate to on-course improvement", "teaching pros who leverage the simulator data"]
    const familyPhrases = ["a family-friendly setup", "a space that works for all ages", "an environment kids enjoy too", "activities suited for the whole family"]

    if (/staff|employee|friendly|welcoming|helpful|team/i.test(reviewText)) themes.push(pick(staffPhrases, index))
    if (/clean|maintained|nice|updated|modern|well kept/i.test(reviewText)) themes.push(pick(cleanPhrases, index))
    if (/fun|blast|great time|awesome|amazing|enjoyed/i.test(reviewText)) themes.push(pick(funPhrases, index))
    if (/accurate|realistic|real|like being on the course/i.test(reviewText)) themes.push(pick(accuracyPhrases, index))
    if (/food|drink|beer|menu|cocktail/i.test(reviewText)) themes.push(pick(foodPhrases, index))
    if (/value|price|worth|reasonable|affordable/i.test(reviewText)) themes.push(pick(valuePhrases, index))
    if (/lesson|coach|instructor|improved|better|swing/i.test(reviewText)) themes.push(pick(lessonPhrases, index))
    if (/kid|family|child|son|daughter/i.test(reviewText)) themes.push(pick(familyPhrases, index))

    const repHeaders = ["## What Customers Say", "## Reputation", "## Customer Reviews", "## How It's Rated"]
    let s = `${pick(repHeaders, index)}\n\n`

    const ratingContext = place.rating! >= 4.7
      ? `${name} holds a ${place.rating}-star rating from ${place.userRatingCount} Google reviews — a strong signal in a category where customers aren't shy about leaving feedback when something falls short.`
      : place.rating! >= 4.3
      ? `${name} carries a ${place.rating}-star rating across ${place.userRatingCount} Google reviews, which puts it solidly in the upper range for indoor golf venues.`
      : `${name} has a ${place.rating}-star rating from ${place.userRatingCount} Google reviews.`
    s += ratingContext

    if (themes.length > 0) {
      const themeIntros = [
        ` Recurring themes in the reviews include ${themes.slice(0, 3).join(", ")}. That kind of consistency across multiple reviewers tends to reflect actual operating standards rather than outliers.`,
        ` Across the reviews, customers frequently call out ${themes.slice(0, 3).join(", ")} — a pattern that's useful for setting expectations before your first visit.`,
        ` The review pattern points to ${themes.slice(0, 3).join(", ")} as consistent strengths. When the same things get mentioned repeatedly across independent reviews, it's usually a reliable signal.`,
      ]
      s += pick(themeIntros, index)
    }

    // Pull a specific quote-like observation from review text if available
    const reviewTextFull = place.reviews!.map(r => r.text?.text || "").join(" ")
    if (reviewTextFull.length > 100) {
      const reviewInsights = [
        ` The overall tone of the reviews suggests a venue that takes its operation seriously — the consistent ratings indicate a team that maintains standards visit over visit, not just on good days.`,
        ` Reading through the reviews, the experience seems to hold up across different types of visitors — solo golfers, groups, and beginners all appear in the feedback, which suggests the venue handles a range of use cases well.`,
        ` The volume and consistency of positive reviews is a reasonable indicator that what's advertised matches what you actually experience when you walk in.`,
      ]
      s += pick(reviewInsights, index + 2)
    }

    sections.push(s)
  }

  // Visit info — expanded
  const visitHeaders = ["## Plan Your Visit", "## Getting There", "## Visit Details", "## Location & Contact", "## How to Book"]
  let closing = `${pick(visitHeaders, index)}\n\n`
  closing += `${name} is located in ${city}, ${state}.`
  if (place?.formattedAddress) closing += ` The address is ${place.formattedAddress}.`
  if (place?.nationalPhoneNumber) closing += ` You can reach them by phone at ${place.nationalPhoneNumber}.`

  const closingBodyVariants = [
    ` Booking ahead is recommended, especially for weekend evenings when simulator bays tend to fill up. Their website handles online reservations and has the most current information on pricing, available time slots, and any ongoing promotions.`,
    ` Most visitors book through the website, which shows real-time bay availability. If you're planning a group outing or have specific timing requirements, calling ahead is also a reliable option. Rates and hours are subject to change, so checking the site before your visit is the best way to avoid surprises.`,
    ` The easiest way to secure a bay is through their website's booking system, which shows current availability. For group events or special requests, a phone call or email will typically get a faster, more detailed response than a web form.`,
    ` Walk-ins are sometimes possible during off-peak hours, but given the demand for indoor golf in the ${city} area, reserving in advance is the safer approach. Their website carries the current rate card and booking portal.`,
  ]
  closing += pick(closingBodyVariants, index)
  sections.push(closing)

  // FAQ section — 3-4 questions, heavily varied per listing
  const faqPool: Array<{ q: string; a: string }> = []
  const bayRef = bayCount ? `${bayCount} simulator bays` : "their simulator bays"
  const techRef = simTechs.length > 0 ? simTechs.join(" and ") : "high-end simulators"

  // Booking — 6 variants mixing question and answer phrasing
  const bookingQs = [
    { q: `Do I need a reservation to play at ${name}?`, a: `Reservations are encouraged, particularly for evening and weekend slots when ${bayRef} fill up fast. You can typically book through their website or by phone. Walk-ins may work on slower days, but it's not guaranteed.` },
    { q: `How far in advance should I book at ${name}?`, a: `A few days ahead is usually enough for weekday visits. For Friday and Saturday evenings, booking a week out is safer since ${city}-area golfers tend to pack ${bayRef}. Their site or a quick call will lock in your time.` },
    { q: `Can I just show up at ${name} without booking?`, a: `You can try — if there's an open bay, they'll usually accommodate you. But ${name} is popular enough that walk-in availability isn't reliable, especially after work hours. A reservation takes 30 seconds and removes the guesswork.` },
    { q: `What's the best way to reserve a bay at ${name}?`, a: `Their website handles online bookings, or you can call ahead. If you're planning a group outing or weekend visit to ${name}, don't leave it to chance — reserve early so everyone has a spot.` },
    { q: `Does ${name} take walk-ins?`, a: `They do when space allows, but availability fluctuates. ${city} has enough demand for indoor golf that peak hours fill up. The surest route is booking ahead online, which only takes a minute.` },
    { q: `Is it hard to get a tee time at ${name}?`, a: `Not if you plan ahead. Midweek afternoons tend to be the easiest to grab, while weekend evenings go quickest. Their booking system shows real-time availability so you can pick a slot that works.` },
  ]
  faqPool.push(pick(bookingQs, index))

  // Skill level — 6 variants
  const levelQs = [
    { q: `Is ${name} suitable for someone who's never played golf?`, a: `Completely. The simulators at ${name} show you exactly what your swing is doing, which is helpful when you're starting from scratch. There's no pressure — you can take as many swings as you want without anyone waiting behind you.` },
    { q: `Do I need golf experience to visit ${name}?`, a: `No prior experience needed. Indoor sim golf is actually one of the better ways to pick up the game because ${techRef} gives you instant data on every shot. The staff can get you set up and swinging in minutes.` },
    { q: `Is ${name} only for serious golfers?`, a: `Far from it. The split at most sim facilities is roughly half recreational players and half golfers working on their game. ${name} in ${city} is no different — you'll see friend groups having fun alongside scratch golfers grinding on their swing.` },
    { q: `Can kids play at ${name}?`, a: `Most indoor golf venues welcome younger players, and ${name} is set up for it. The simulators don't care about age or ability — they just track the ball. It can be a surprisingly good way to introduce kids to golf without the formality of a course.` },
    { q: `Will I enjoy ${name} if I'm not a good golfer?`, a: `That's actually when simulator golf is the most fun. There's no lost balls, no slow play, and ${techRef} shows you what happened on every shot so you can see yourself improving in real time. Skill level is irrelevant to having a good time here.` },
    { q: `Is indoor golf at ${name} intimidating for beginners?`, a: `Not at all. The environment at ${name} is low-key compared to showing up at a course for the first time. Staff will walk you through the basics, the simulator handles scoring, and you're in a private bay — nobody's watching your swing.` },
  ]
  faqPool.push(pick(levelQs, index + 1))

  // Pricing — varies based on whether we know the price
  if (pricePerHour) {
    const priceQsKnown = [
      { q: `How much does it cost per hour at ${name}?`, a: `Bay time starts at $${pricePerHour}/hour. Rates typically shift based on the time slot — off-peak hours tend to be cheaper. Group sizes and day of the week can also affect pricing. Their website lists the full rate card.` },
      { q: `What are the rates at ${name}?`, a: `Expect to pay from $${pricePerHour}/hour for a bay. Peak times (evenings, weekends) may cost more. If you're bringing a group, the per-person math usually works out well since a single bay fits multiple players. Check their site for the latest.` },
      { q: `Is ${name} expensive?`, a: `At $${pricePerHour}/hour starting, it's in line with what indoor golf costs across ${state}. When you factor in that a bay holds multiple players, the per-person rate is often less than a round at a public course — and you're out of the weather.` },
    ]
    faqPool.push(pick(priceQsKnown, index + 2))
  } else {
    const priceQsUnknown = [
      { q: `What does it cost to play at ${name}?`, a: `Pricing at ${name} varies by time of day and session length. Indoor golf in the ${city} area generally runs $30–$70/hour per bay, with off-peak and weekday discounts common. Contact them or check their website for their specific rate card.` },
      { q: `How much should I budget for a visit to ${name}?`, a: `Indoor golf pricing depends on when you go and how long you play. A typical session at a ${state} simulator venue runs 1–2 hours per bay. ${name} publishes their rates on their website, and calling ahead can sometimes surface unadvertised deals.` },
      { q: `Are there any deals or specials at ${name}?`, a: `Many indoor golf spots in ${city} run happy hour pricing, weekday specials, or discounted rates for off-peak times. It's worth checking ${name}'s website or social media for current offers before booking.` },
      { q: `Is indoor golf at ${name} cheaper than playing a real course?`, a: `It depends on the course, but when you split a bay among friends, indoor sim golf often comes out ahead — especially in ${state} where green fees can add up. ${name}'s website has their current pricing breakdown.` },
    ]
    faqPool.push(pick(priceQsUnknown, index))
  }

  // Tech question — only if they have known tech, with varied answers
  if (simTechs.length > 0) {
    const techQs = [
      { q: `What type of golf simulators does ${name} have?`, a: `They run ${techRef}. This means every shot produces detailed numbers — ball speed, launch angle, spin rates, carry and total distance. The data is reliable enough for serious practice, and the virtual course play is engaging enough for a casual night out.` },
      { q: `What technology powers the simulators at ${name}?`, a: `${name} uses ${techRef}, which sits in the upper tier of simulator technology. You get precise ball tracking, realistic course rendering, and the kind of data that club fitters and instructors rely on. It's the same tech used in professional settings.` },
      { q: `How accurate are the simulators at ${name}?`, a: `${name} runs ${techRef}, which is well-regarded for accuracy. The ball flight data — spin, speed, angle, distance — is consistent enough that golfers use it to make real swing changes and equipment decisions. It's not a toy.` },
    ]
    faqPool.push(pick(techQs, index + 3))
  }

  // Events — only if detected
  if (hasEvents) {
    const eventQs = [
      { q: `Can I book ${name} for a private party or corporate event?`, a: `Yes — ${name} handles group events regularly. The setup works well for team outings, birthday celebrations, bachelor parties, and client entertainment. Contact them early for weekend dates since event bookings in ${city} fill up.` },
      { q: `What kind of events can ${name} host?`, a: `Everything from corporate team-building to birthday parties to casual group outings. ${bayRef} can be reserved for your group, and the combination of golf, competition, and ${hasBar ? "a full bar" : hasFood ? "food" : "drinks"} makes it a natural fit for events that need to keep people entertained.` },
      { q: `How many people can ${name} accommodate for a group event?`, a: `That depends on how many bays they can dedicate to your group. Each bay typically handles 4–6 players comfortably. Reach out to ${name} directly with your headcount and they'll put together a configuration that works.` },
    ]
    faqPool.push(pick(eventQs, index + 2))
  }

  // Food/drink — only if detected
  if (hasBar || hasFood) {
    const foodQs = [
      { q: `Can I eat and drink while playing at ${name}?`, a: `${hasBar && hasFood ? "Full bar and food service are both available" : hasBar ? "A full bar is available" : hasFood ? "Food is available" : "Drinks are available"} during your session. You don't have to leave your bay to order, which keeps the flow going. It's part of what makes indoor golf more of a social outing than just a practice session.` },
      { q: `Does ${name} have a bar?`, a: `${hasBar ? `Yes, they operate a full bar with cocktails, beer, and more. It's a core part of the experience — most people treat ${name} as equal parts golf and night out.` : hasFood ? `They offer food and beverages during your session, though it may not be a full bar setup. Check with them for the current drink selection.` : `Drinks are available during sessions. Contact ${name} for details on their current beverage options.`}` },
      { q: `What kind of food does ${name} serve?`, a: `${hasFood ? `They have a food menu you can order from during your session. The specifics vary, but indoor golf venues in ${city} typically offer appetizers, sandwiches, and shareable plates — designed for eating between swings.` : `${name} focuses primarily on the golf experience. They may have snacks or beverages available, but for a full meal you might want to eat before or after your session.`}` },
    ]
    faqPool.push(pick(foodQs, index + 1))
  }

  // Lessons — only if detected
  if (hasLessons) {
    const lessonQs = [
      { q: `Does ${name} offer professional golf lessons?`, a: `They do. Instruction at ${name} pairs one-on-one coaching with live simulator data from ${techRef}. The instructor can show you exactly what's happening with your swing — launch angle, face angle, path — and work on fixes in real time. It's a more efficient feedback loop than a traditional lesson at a range.` },
      { q: `How are golf lessons at ${name} different from outdoor lessons?`, a: `The main difference is data. When you're hitting into ${techRef}, the instructor can point to specific numbers rather than relying on feel alone. That tends to speed up improvement because you're not guessing about what changed. ${name} offers this in a climate-controlled environment, so weather is never a factor.` },
      { q: `Can I take a golf lesson at ${name} even if I'm a beginner?`, a: `Absolutely — beginners often benefit the most from simulator-based lessons. The data helps new golfers build good habits from the start rather than ingraining bad ones. ${name}'s instructors work with all skill levels.` },
    ]
    faqPool.push(pick(lessonQs, index))
  }

  // Membership — only if detected
  if (hasMembership) {
    const memberQs = [
      { q: `Is a membership at ${name} worth it?`, a: `If you plan to visit regularly, a membership typically pays for itself within a few sessions through discounted bay rates and priority booking. ${name} offers different tiers depending on how often you play. Contact them for a breakdown of what each level includes.` },
      { q: `What do members get at ${name}?`, a: `Membership perks usually include reduced hourly rates, booking priority (useful for snagging popular weekend slots), and sometimes guest passes or event discounts. ${name} can walk you through their current membership options and pricing.` },
    ]
    faqPool.push(pick(memberQs, index))
  }

  // Clubs/equipment — universal question, always relevant
  const clubQs = [
    { q: `Do I need to bring my own golf clubs to ${name}?`, a: `No — ${name} provides clubs you can use during your session. That said, if you're working on your own game or getting a fitting done, bringing your own set gives you more relevant data. Either way, you're covered.` },
    { q: `Can I use my own clubs at ${name}?`, a: `Yes, and it's encouraged if you want the data to reflect your actual equipment. But if you're coming for fun or don't have clubs, ${name} has loaners available so you can still play a full round.` },
    { q: `Does ${name} rent golf clubs?`, a: `They have clubs available for guest use at no extra charge. You're also welcome to bring your own. If you're there for a fitting or serious practice, your own clubs will give you the most useful data.` },
  ]
  faqPool.push(pick(clubQs, index + 2))

  // Shuffle the pool deterministically based on index to vary ordering
  const shuffled = [...faqPool]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = (index * 7 + i * 13) % (i + 1)
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  // Pick 3-4 FAQs
  const faqCount = Math.min(shuffled.length, index % 3 === 0 ? 4 : 3)
  const faqs = shuffled.slice(0, faqCount)

  let faqSection = "## Frequently Asked Questions\n\n"
  faqs.forEach(faq => {
    faqSection += `**${faq.q}**\n\n${faq.a}\n\n`
  })
  sections.push(faqSection.trim())

  return sections.join("\n\n")
}

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL!, max: 5 })
  const db = new PrismaClient({ adapter })

  const all = await db.tool.findMany({
    where: { status: "Published" },
    select: { id: true, name: true, websiteUrl: true, city: true, state: true, description: true, content: true },
  })

  const thin = all
    .filter(t => !t.content || t.content.length < 500)
    .filter(t => t.websiteUrl && !t.websiteUrl.includes("golfsimgeek.com"))

  // Process all remaining
  const batch = thin
  console.log(`Found ${thin.length} thin listings, processing ${batch.length}\n`)

  let enriched = 0, junked = 0, failed = 0

  for (let i = 0; i < batch.length; i++) {
    const listing = batch[i]
    console.log(`\n${"=".repeat(60)}`)
    console.log(`[${i + 1}/${batch.length}] ${listing.name} — ${listing.city}, ${listing.state}`)
    console.log(`${"=".repeat(60)}`)

    console.log(`  Fetching ${listing.websiteUrl}...`)
    const websiteText = await fetchWebsiteText(listing.websiteUrl!)
    console.log(`  Website: ${websiteText.length} chars`)

    console.log(`  Querying Google Places...`)
    const place = await searchPlace(listing.name, listing.city!, listing.state!)
    if (place) {
      console.log(`  Places: ${place.displayName?.text} — ${place.rating}★ (${place.userRatingCount} reviews)`)
    } else {
      console.log(`  Places: no result`)
    }

    const junkCheck = isJunk(websiteText, place)
    if (junkCheck.junk) {
      console.log(`  JUNK: ${junkCheck.reason} — unpublishing`)
      await db.tool.update({ where: { id: listing.id }, data: { status: "Draft" } })
      junked++
      continue
    }

    const content = generateContent(listing.name, listing.city!, listing.state!, websiteText, place, i)
    console.log(`  Generated: ${content.length} chars\n`)
    console.log(content)
    console.log()

    await db.tool.update({ where: { id: listing.id }, data: { content } })
    console.log(`  ✓ Saved`)
    enriched++

    await new Promise(r => setTimeout(r, 500))
  }

  console.log(`\n${"=".repeat(60)}`)
  console.log(`Done: ${enriched} enriched, ${junked} junked, ${failed} failed`)
  console.log(`${"=".repeat(60)}`)
  await db.$disconnect()
}

main().catch(console.error)
