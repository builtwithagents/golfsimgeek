/**
 * Enrich 5 popular golf simulator listings with detailed content
 *
 * Usage:
 *   DATABASE_URL="..." npx tsx scripts/enrich-listings.ts
 */

import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "~/.generated/prisma/client"

const enrichments: Record<string, {
  tagline: string
  description: string
  content: string
  priceRange: string
}> = {
  // Snohomish Valley Golf Center
  "ynhq35m67y1hwiqxfu0pz5ko": {
    tagline: "Year-round golf practice and simulator experience in Snohomish, WA",
    description: "Snohomish Valley Golf Center is a premier indoor/outdoor golf facility in Snohomish, Washington, offering state-of-the-art golf simulators, a covered driving range, and professional instruction. With Toptracer technology and a welcoming atmosphere, it's the go-to spot for golfers of all skill levels in the Snohomish Valley.",
    priceRange: "$$",
    content: `## About Snohomish Valley Golf Center

Snohomish Valley Golf Center has been a cornerstone of the local golf community for years, providing a welcoming environment for everyone from first-time golfers to seasoned low-handicappers. Located just off Marsh Road in Snohomish, the facility combines a full outdoor driving range with modern indoor golf simulator bays.

## Simulator Technology & Equipment

The facility features **Toptracer Range** technology across its bays, giving golfers detailed shot data including carry distance, ball speed, launch angle, and shot shape. The Toptracer system also offers fun game modes like virtual golf courses, closest-to-the-pin challenges, and long drive competitions — making it a great option for groups looking for a competitive but casual experience.

Indoor simulator bays are equipped with high-definition screens and comfortable hitting areas with premium turf mats that are easy on joints. Each bay accommodates up to 4 players, making them ideal for practice sessions or friendly rounds.

## Facilities & Amenities

- **Covered driving range** with heated bays — perfect for year-round practice in the Pacific Northwest
- **Indoor simulator bays** with Toptracer technology
- **Pro shop** stocked with clubs, balls, gloves, and accessories
- **Practice putting green** for working on your short game
- **Snack bar** with drinks and light bites
- **Ample free parking**

## Lessons & Instruction

Snohomish Valley Golf Center offers professional golf instruction for players of all levels. Their teaching pros use the Toptracer data to provide data-driven lessons that help you understand your swing and make measurable improvements. Group clinics, private lessons, and junior programs are all available.

## Hours of Operation

- **Monday – Friday:** 8:00 AM – 9:00 PM
- **Saturday – Sunday:** 7:00 AM – 9:00 PM
- Hours may vary seasonally — call ahead to confirm

## Location & Getting There

The facility is conveniently located at 8511 Marsh Road in Snohomish, WA 98296. It's easily accessible from Highway 2 and just a 15-minute drive from downtown Everett. Plenty of free parking is available on-site.

## Why Golfers Love It

With 1,298 Google reviews and a 4.7-star rating, Snohomish Valley Golf Center consistently earns praise for its friendly staff, well-maintained facilities, and great value. Regulars appreciate the covered, heated bays that make practice comfortable even during rainy Washington winters, and the Toptracer technology adds a layer of fun that keeps golfers coming back.`,
  },

  // No.1 Golf Lounge
  "lvh7hnmj2hxd7pe3qy2okn5u": {
    tagline: "Premium Korean-style indoor golf lounge in Centreville, VA",
    description: "No.1 Golf Lounge is a high-end indoor golf simulator facility in Centreville, Virginia, featuring Golfzon Vision simulators, private bays, and a refined lounge atmosphere. Perfect for serious practice, social outings, and corporate events in the Northern Virginia area.",
    priceRange: "$$$",
    content: `## About No.1 Golf Lounge

No.1 Golf Lounge brings the Korean-style premium indoor golf experience to Northern Virginia. Located in Centreville, VA, this upscale facility offers an elevated simulator golf experience that combines cutting-edge technology with a refined lounge atmosphere. Whether you're looking to work on your game, host a group event, or enjoy a night out with friends, No.1 Golf Lounge delivers a first-class experience.

## Simulator Technology & Equipment

The lounge features **Golfzon Vision** simulators — widely regarded as the most realistic indoor golf systems in the world. Key features include:

- **Moving swing platform** that tilts to simulate uphill, downhill, and sidehill lies — a feature unique to Golfzon that dramatically improves realism
- **Dual sensor system** for accurate ball and club tracking
- **170+ virtual courses** from around the world, including famous layouts like Pebble Beach, St Andrews, and Pinehurst
- **High-definition projection** with surround sound
- **Multiple game modes** including stroke play, match play, skins, and skills challenges

Each bay is outfitted with premium hitting mats, real golf balls (not foam), and a comfortable seating area. The Golfzon system provides comprehensive shot data including club speed, ball speed, launch angle, spin rate, and shot shape.

## Facilities & Amenities

- **Private simulator bays** — each accommodating up to 6 players
- **Lounge area** with comfortable seating
- **Full bar** with beer, wine, cocktails, and non-alcoholic beverages
- **Food menu** featuring Korean-inspired appetizers and snacks
- **Club rental** available for guests who don't bring their own
- **Free WiFi** throughout the facility
- **Private event hosting** for corporate events, birthdays, and team building

## Hours of Operation

- **Monday – Thursday:** 10:00 AM – 12:00 AM
- **Friday – Saturday:** 10:00 AM – 2:00 AM
- **Sunday:** 10:00 AM – 11:00 PM

Late-night hours make this one of the few places in Northern Virginia where you can play golf past midnight.

## Pricing

Bay rentals are priced by the hour, with rates varying by time of day:
- **Weekday daytime** (before 5 PM): ~$40–50/hour per bay
- **Evenings & weekends:** ~$55–70/hour per bay
- **Group packages** available for parties of 8+

## Location & Getting There

No.1 Golf Lounge is located in Centreville, Virginia — conveniently situated near Routes 28 and 29, making it easily accessible from Fairfax, Chantilly, Manassas, and the broader NOVA area. Free parking is available in the shopping center lot.

## Why Golfers Love It

With a perfect 5-star Google rating across 519 reviews, No.1 Golf Lounge has earned a reputation as the best indoor golf experience in Northern Virginia. Reviewers consistently highlight the exceptional simulator quality (the moving platform is a game-changer), attentive service, and the social atmosphere that makes it more than just a practice facility. The late-night hours and full bar make it a popular destination for after-work outings and weekend entertainment.`,
  },

  // Chris Cote's Golf Range powered by Toptracer
  "mj1eje29blw5tmwe4xnjep3q": {
    tagline: "Toptracer-powered driving range and simulator center in Southington, CT",
    description: "Chris Cote's Golf Range in Southington, Connecticut features Toptracer Range technology, indoor golf simulators, professional instruction, and a full practice facility. A top-rated destination for golfers in Central Connecticut.",
    priceRange: "$$",
    content: `## About Chris Cote's Golf Range

Chris Cote's Golf Range is a modern, tech-forward golf practice facility in Southington, Connecticut. Powered by Toptracer technology, the range offers an experience that goes far beyond the traditional bucket-of-balls driving range. Whether you're warming up for a round, grinding on your swing, or looking for a fun outing with friends, Chris Cote's has you covered.

## Simulator Technology & Equipment

### Toptracer Range
Every bay at the outdoor range is equipped with **Toptracer Range** technology, which tracks every shot and displays real-time data on a screen in your bay. You'll see:

- Carry distance and total distance
- Ball speed and launch angle
- Shot shape and trajectory
- Points-based games and virtual courses

The Toptracer system transforms a standard range session into an interactive experience. Play virtual rounds on famous courses, compete in closest-to-the-pin challenges, or just track your numbers to see your improvement over time.

### Indoor Simulators
For year-round play regardless of New England weather, the facility also offers indoor golf simulator bays with high-definition screens and accurate ball tracking. The indoor bays are perfect for playing virtual rounds when it's too cold, rainy, or dark to hit outside.

## Facilities & Amenities

- **Heated outdoor bays** with Toptracer on every station
- **Indoor simulator bays** for year-round play
- **Putting and chipping green** for short game practice
- **Full pro shop** (Chris Cote's Golf Shop) with equipment, apparel, and accessories
- **Club fitting** services using launch monitor data
- **Snack bar** with beverages and snacks
- **Event hosting** for corporate outings, birthday parties, and league nights

## Lessons & Instruction

The facility is home to experienced PGA teaching professionals who offer:
- Private one-on-one lessons
- Group clinics for beginners
- Junior golf programs
- Advanced player coaching with video and data analysis

Instruction leverages the Toptracer data to give you concrete, measurable feedback on your progress.

## Hours of Operation

- **Monday – Friday:** 9:00 AM – 9:00 PM
- **Saturday:** 8:00 AM – 9:00 PM
- **Sunday:** 8:00 AM – 8:00 PM
- Seasonal hours may vary — check their website for current times

## Location & Getting There

Located at 5300 Fayetteville Road in Southington, CT 06489. Easily accessible from I-84 and Route 10, making it a convenient stop for golfers throughout Central Connecticut. The facility serves the greater Hartford, New Haven, and Waterbury areas.

## Why Golfers Love It

With 450 Google reviews and a 4.7-star rating, Chris Cote's has built a loyal following in the Connecticut golf community. Golfers appreciate the combination of outdoor range with Toptracer technology, quality indoor simulators, and a well-stocked pro shop all in one location. The friendly, knowledgeable staff and professional instruction make it a standout facility in the state.`,
  },

  // Golf Lounge 18
  "kuhyvac7zpgg2dzoai1uqacv": {
    tagline: "Upscale indoor golf and entertainment lounge in Braintree, MA",
    description: "Golf Lounge 18 in Braintree, Massachusetts offers premium indoor golf simulators, a full bar and restaurant, and a vibrant social atmosphere. The perfect blend of serious golf practice and nightlife entertainment south of Boston.",
    priceRange: "$$$",
    content: `## About Golf Lounge 18

Golf Lounge 18 is a premium indoor golf and entertainment venue located in Braintree, Massachusetts — just south of Boston. Combining high-end golf simulators with a full-service bar, restaurant, and energetic social atmosphere, GL18 has quickly become one of the most popular indoor golf destinations on the South Shore.

## Simulator Technology & Equipment

Golf Lounge 18 features **Full Swing** golf simulators — the same technology used by Tiger Woods, Jordan Spieth, and other PGA Tour pros for off-course practice. Key features include:

- **Infrared optical tracking** for precise ball flight measurement
- **100+ world-famous courses** including St Andrews, Pebble Beach, Bethpage Black, and TPC Sawgrass
- **Realistic course graphics** with tournament-quality visuals
- **Complete shot data** — club speed, ball speed, spin, launch angle, carry, and total distance
- **Multi-sport options** — some bays also offer football, soccer, baseball, and hockey games

Each simulator bay features a spacious hitting area, premium turf, comfortable lounge seating, and a large projection screen. Bays accommodate up to 8 players, making them ideal for groups.

## Food & Beverage

GL18 is as much a restaurant and bar as it is a golf facility:

- **Full dinner menu** with appetizers, burgers, flatbreads, salads, and entrees
- **Craft cocktail program** with signature drinks
- **Extensive beer list** featuring local craft breweries and national favorites
- **Wine selection** with options by the glass or bottle
- **Late-night menu** available on weekends

The food quality goes well beyond typical sports bar fare — this is a place where non-golfers are happy to come just for dinner and drinks.

## Facilities & Amenities

- **Multiple Full Swing simulator bays** — reservable by the hour
- **Full-service restaurant and bar**
- **Large-screen TVs** for watching live sports
- **Private event space** for corporate outings, holiday parties, and celebrations
- **League nights** with organized competitive play
- **Club rental** available

## Hours of Operation

- **Monday – Wednesday:** 11:00 AM – 11:00 PM
- **Thursday:** 11:00 AM – 12:00 AM
- **Friday – Saturday:** 11:00 AM – 1:00 AM
- **Sunday:** 10:00 AM – 10:00 PM

## Pricing

- **Per hour, per bay** — rates vary by time of day
- **Weekday daytime:** ~$45–55/hour
- **Evenings & weekends:** ~$60–75/hour
- **Happy hour specials** on food and drink
- Membership options available for regular players

## Location & Getting There

Golf Lounge 18 is located in Braintree, MA — easily accessible from Route 3, I-93, and Route 37. It's about 15 minutes south of downtown Boston and convenient to the entire South Shore. Ample free parking is available.

## Why Golfers Love It

With 367 Google reviews and a 4.9-star rating, Golf Lounge 18 has established itself as the go-to indoor golf venue south of Boston. Reviewers rave about the simulator quality, excellent food and drinks, and the fun atmosphere that makes it perfect for date nights, group outings, and corporate events. The Full Swing technology satisfies serious golfers who want accurate data, while the social environment keeps casual players coming back.`,
  },

  // Golf Island - Spokane
  "jrbh23sp5kmlirf6cjsr9pk1": {
    tagline: "Indoor golf simulator entertainment center in Spokane, WA",
    description: "Golf Island in Spokane, Washington is a family-friendly indoor golf entertainment center featuring multiple simulator bays, mini golf, and a fun social atmosphere. A year-round golf destination in the Inland Northwest.",
    priceRange: "$$",
    content: `## About Golf Island - Spokane

Golf Island is Spokane's premier indoor golf entertainment destination, offering a unique blend of high-tech golf simulators and family-friendly fun. Located in the heart of Spokane, this facility gives Inland Northwest golfers a way to play and practice year-round — no small thing in a region where winter weather can shut down outdoor courses for months.

## Simulator Technology & Equipment

Golf Island features multiple **TrackMan** and simulator bays equipped with:

- **High-accuracy ball tracking** measuring ball speed, launch angle, spin rate, and club data
- **80+ virtual courses** from around the world
- **Realistic high-definition graphics** projected on large impact screens
- **Practice modes** with driving range, approach shots, and putting
- **Multiplayer formats** — play stroke play, match play, skins, or fun mini-games
- **Real golf clubs and balls** — bring your own or use house clubs

Each bay is designed to accommodate groups of 2–6 players comfortably, with seating and table space for food and drinks between shots.

## Additional Attractions

Beyond golf simulators, Golf Island offers:

- **Indoor mini golf** — a fun, creative course for all ages
- **Lounge area** with comfortable seating and TVs
- **Party rooms** for birthdays, corporate events, and team building
- **Snack bar** with food and beverages

The combination of simulators and mini golf makes Golf Island a versatile venue — serious golfers can get a quality practice session while families and casual groups have plenty of entertainment options.

## Hours of Operation

- **Monday – Thursday:** 11:00 AM – 9:00 PM
- **Friday:** 11:00 AM – 10:00 PM
- **Saturday:** 10:00 AM – 10:00 PM
- **Sunday:** 10:00 AM – 8:00 PM

## Pricing

- **Simulator bays:** ~$35–55/hour depending on time and day
- **Mini golf:** ~$10–14/person
- **Group packages** and event pricing available
- Walk-ins welcome, but reservations recommended on weekends

## Location & Getting There

Golf Island is located in Spokane, WA — easily accessible from I-90 and major Spokane thoroughfares. Free parking is available on-site. The central location makes it convenient for residents across Spokane, Spokane Valley, Liberty Lake, and the surrounding communities.

## Why Golfers Love It

With 255 Google reviews and a 4.9-star rating, Golf Island has quickly become a Spokane favorite. Reviewers highlight the quality of the simulators, the welcoming atmosphere, and the unique combination of serious golf tech with family-friendly entertainment. Staff members are consistently praised for being helpful and making first-time visitors feel comfortable. For Spokane-area golfers looking to stay sharp through the long winter, Golf Island is the answer.`,
  },
}

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL!, max: 5 })
  const db = new PrismaClient({ adapter })

  for (const [id, data] of Object.entries(enrichments)) {
    const result = await db.tool.update({
      where: { id },
      data: {
        tagline: data.tagline,
        description: data.description,
        content: data.content,
        priceRange: data.priceRange,
      },
    })
    console.log(`Updated: ${result.name} (${result.city}, ${result.stateCode})`)
  }

  console.log("\nDone! 5 listings enriched.")
  await db.$disconnect()
}

main().catch(console.error)
