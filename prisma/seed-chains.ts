import { ToolStatus } from "~/.generated/prisma/client"
import { db } from "~/services/db"

async function main() {
  console.log("Seeding chains...")

  // Create the Chains category
  await db.category.upsert({
    where: { slug: "chain" },
    update: {},
    create: {
      name: "Chain",
      slug: "chain",
      label: "Golf Simulator Chains",
      description:
        "Multi-location golf simulator venue chains — upscale indoor golf bars, entertainment centers, and simulator lounges with locations across the US.",
    },
  })
  console.log("Created Chains category")

  // Create chain-specific tags
  const chainTags = [
    { name: "Five Iron Golf", slug: "five-iron-golf" },
    { name: "X-Golf", slug: "x-golf" },
    { name: "Topgolf Swing Suite", slug: "topgolf-swing-suite" },
    { name: "BigShots Golf", slug: "bigshots-golf" },
    { name: "Drive Shack", slug: "drive-shack" },
    { name: "Puttery", slug: "puttery" },
    { name: "Puttshack", slug: "puttshack" },
    { name: "Golfzon Social", slug: "golfzon-social" },
    { name: "Bar & Lounge", slug: "bar-lounge" },
    { name: "Indoor Golf", slug: "indoor-golf" },
    { name: "Entertainment Venue", slug: "entertainment-venue" },
    { name: "Mini Golf", slug: "mini-golf" },
  ]

  for (const tag of chainTags) {
    await db.tag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: tag,
    })
  }
  console.log("Created chain tags")

  const chains = [
    {
      name: "Five Iron Golf",
      slug: "five-iron-golf",
      websiteUrl: "https://fiveirongolf.com",
      faviconUrl: "https://www.google.com/s2/favicons?sz=128&domain_url=https://fiveirongolf.com",
      tagline: "Upscale urban golf simulators with a full bar — 32 venues across 13 states",
      description:
        "Five Iron Golf is the premier urban golf simulator chain, combining TrackMan-powered simulators with a vibrant bar and social scene. With 32 locations across major US cities and international expansion underway, it's the go-to destination for serious golfers and beginners alike.",
      content: `Five Iron Golf has redefined what it means to play golf in the city. Founded in 2017, the brand has grown into the largest urban golf simulator chain in the US, with 32 venues spanning 13 states and locations internationally.

## What to Expect

Walk into any Five Iron location and you'll find a sleek, modern space built around high-end TrackMan simulators, a full-service bar, and an energy that feels more like a trendy sports bar than a driving range. Each bay fits up to 6 players, making it ideal for groups, corporate outings, and date nights.

## Simulator Technology

Five Iron runs **TrackMan** simulators — the same technology used by PGA Tour players and club fitters worldwide. You get:

- Accurate ball flight and club data
- Access to real virtual courses worldwide
- Swing analysis and shot metrics
- Practice mode, course play, and mini-games

## Pricing

Pricing varies by market and time of day:
- **Off-peak:** $45–$65/hour
- **Peak (evenings/weekends):** $70–$95+/hour in major markets like NYC
- Memberships available for frequent players with discounted hourly rates

## Food & Beverage

Every location features a full bar with cocktails, beer, wine, and non-alcoholic options. Food menus vary by location but typically include elevated bar bites — think flatbreads, sliders, wings, and shareables.

## Locations

Five Iron has a strong presence in:
- **New York City** (Flatiron, Grand Central, Herald Square, Upper East Side, Long Island City)
- **Chicago**
- **Boston**
- **Nashville**
- **Philadelphia**
- **Washington D.C.**
- **Pittsburgh**
- **Minneapolis**
- And expanding nationally and internationally

## PGA Instruction

Most Five Iron locations offer PGA-certified golf instruction, from beginner clinics to advanced swing coaching sessions.

## Private Events

Five Iron is a popular corporate event and private party venue. Most locations have private bays that can be reserved for groups of 10–50+.`,
      priceRange: "$45–$95/hr",
      tags: ["five-iron-golf", "trackman", "bar-lounge", "indoor-golf", "entertainment-venue", "premium"],
    },
    {
      name: "X-Golf",
      slug: "x-golf",
      websiteUrl: "https://playxgolf.com",
      faviconUrl: "https://www.google.com/s2/favicons?sz=128&domain_url=https://playxgolf.com",
      tagline: "140+ franchise locations with leagues, lessons, and simulator bays nationwide",
      description:
        "X-Golf is one of the largest and fastest-growing indoor golf simulator franchises in the US, with 140+ locations offering simulator bays, leagues, lessons, and sports bar amenities. A great option for dedicated golfers looking for a local sim spot.",
      content: `X-Golf has expanded rapidly to become one of the most accessible indoor golf simulator chains in America. With 140+ franchise locations coast to coast, there's likely an X-Golf near you.

## The X-Golf Experience

X-Golf venues are designed with the committed golfer in mind. Each location typically features 7–12 simulator bays, a sports bar, and a full calendar of leagues and events. The atmosphere skews slightly more serious than entertainment-first chains — this is a place people go to actually improve their game, not just have a night out.

## Simulator Technology

X-Golf uses its own proprietary simulator technology featuring:

- Accurate ball tracking with camera-based systems
- 100+ virtual golf courses
- Full swing analysis and ball flight data
- Practice ranges, putting greens, and game modes

## Pricing

- **Walk-in:** $45–$70/hour (up to 6 players per bay)
- **Members:** As low as $19/hour
- Membership tiers available monthly or annually
- Packages for lessons and coaching

## Leagues & Events

X-Golf is known for its robust league programs:

- Weekly competitive leagues (handicap and scratch)
- Seasonal tournaments with prizes
- Corporate league options
- Junior golf programs at select locations

## Locations

X-Golf has franchises in virtually every major metro area across the US including:

- Texas (Dallas, Houston, Austin, San Antonio)
- Florida (Miami, Tampa, Orlando, Jacksonville)
- Colorado (Denver, Fort Collins, Boulder)
- New York (Brooklyn, Long Island, Westchester)
- Illinois, Ohio, Michigan, Wisconsin, and many more

Use the [location finder on their website](https://playxgolf.com/locations/) to find the nearest X-Golf.

## Lessons & Instruction

Most X-Golf locations offer PGA-certified instruction with simulator-based feedback, making it easy to track improvement over time.`,
      priceRange: "$45–$70/hr",
      tags: ["x-golf", "camera-based", "bar-lounge", "indoor-golf", "entertainment-venue", "mid-range"],
    },
    {
      name: "Topgolf Swing Suite",
      slug: "topgolf-swing-suite",
      websiteUrl: "https://swingsuite.topgolf.com",
      faviconUrl: "https://www.google.com/s2/favicons?sz=128&domain_url=https://topgolf.com",
      tagline: "Topgolf's simulator format inside hotels, restaurants, and entertainment venues — 30+ locations",
      description:
        "Topgolf Swing Suite brings the Topgolf brand into a compact, climate-controlled simulator format. Found inside hotels, resorts, and entertainment venues across the US, Swing Suite offers premium golf games, full F&B service, and a polished Topgolf experience without the outdoor range.",
      content: `Topgolf Swing Suite is the indoor simulator arm of Topgolf — the world's largest golf entertainment brand. While traditional Topgolf locations feature outdoor hitting bays, Swing Suite brings that same energy indoors through a modular simulator concept deployed inside hotels, resorts, restaurants, and entertainment venues.

## What is Topgolf Swing Suite?

Rather than operating standalone locations, Swing Suite is a venue-within-a-venue concept. You'll find Swing Suite bays inside Marriott hotels, bowling alleys, movie theaters, and other entertainment properties. Each bay is a self-contained simulator suite with:

- **Full Swing** or **Toptracer Range** simulator technology
- Stadium-style seating for groups
- In-bay food and beverage ordering
- Climate-controlled environment year-round

## Games & Modes

Swing Suite offers a variety of Topgolf-branded games beyond standard golf:

- **Topgolf** (the signature target-based game)
- **Baseball Batting Practice**
- **Hockey Shootout**
- **Zombie Dodgeball**
- **Bowl** (virtual bowling)

This makes it a great option for mixed groups where not everyone is a golfer.

## Pricing

Pricing is set by the host venue and varies significantly:
- **Typical range:** $20–$60/hour per bay
- Some venues charge per game rather than per hour
- F&B minimums may apply during peak times

## Where to Find Swing Suite

Swing Suite has 30+ locations including:

- Seattle / Renton, WA
- Phoenix, AZ
- Atlanta, GA
- Chicago, IL
- Indianapolis, IN
- Baltimore, MD
- Charlotte, NC
- Houston, TX
- Myrtle Beach, SC
- Fort Myers, FL

Check the [Swing Suite location finder](https://swingsuite.topgolf.com/locations) for the most current list.

## Best For

Swing Suite is ideal for groups that want a premium, all-inclusive entertainment experience — especially mixed groups of golfers and non-golfers where variety in games is a plus.`,
      priceRange: "$20–$60/hr",
      tags: ["topgolf-swing-suite", "bar-lounge", "indoor-golf", "entertainment-venue", "mid-range"],
    },
    {
      name: "BigShots Golf",
      slug: "bigshots-golf",
      websiteUrl: "https://bigshotsgolf.com",
      faviconUrl: "https://www.google.com/s2/favicons?sz=128&domain_url=https://bigshotsgolf.com",
      tagline: "Two-story TrackMan hitting bays with chef-driven food and full bar — 10 locations",
      description:
        "BigShots Golf is a premium golf entertainment concept featuring two-story climate-controlled hitting bays powered by TrackMan Range technology, paired with chef-driven food and full bar service. Now part of the Topgolf Callaway family with ~10 locations and growing.",
      content: `BigShots Golf offers a premium twist on the golf entertainment venue format. Instead of enclosed simulator bays, BigShots features **open, two-story hitting bays** with a range-style setup — but powered by TrackMan Range technology, so every shot is tracked and scored in real time.

## The BigShots Format

BigShots is a hybrid between an outdoor driving range and an indoor simulator venue. Their signature two-story bay design features:

- Open hitting bays (not fully enclosed like simulator bays)
- Climate-controlled environment year-round
- **TrackMan Range** technology for shot tracking
- Stadium-style seating within each bay
- Multiple digital game modes

## TrackMan Range Technology

Unlike traditional simulators that display virtual courses on a screen, BigShots uses TrackMan Range to:

- Track every shot in real time
- Display ball flight, distance, and accuracy on in-bay screens
- Score players on target-based games
- Provide swing data and club metrics

## Games Available

- **BigShots Classic** (target-based accuracy game)
- **Land Grab** (team-based territory game)
- **Closest to the Pin** contests
- Standard free practice mode

## Food & Beverage

BigShots venues feature chef-driven menus with elevated bar food — shareable appetizers, sandwiches, flatbreads, and entrees — plus full bar service with craft cocktails, local beers, and wine.

## Locations

BigShots has approximately 10 locations including:

- Akron, OH
- Bryan, TX
- Fort Worth, TX
- Springfield, MO
- St. George, UT
- Vero Beach, FL
- Grand Prairie, TX (opening)
- Kansas City, MO (opening)

BigShots is now owned and operated by **Topgolf Callaway Brands**, which acquired the chain and is actively growing the footprint.

## Pricing

Premium pricing, typically set per bay per hour. Expect similar pricing to Topgolf's main venues.`,
      priceRange: "Premium",
      tags: ["bigshots-golf", "trackman", "bar-lounge", "indoor-golf", "entertainment-venue", "premium"],
    },
    {
      name: "Drive Shack",
      slug: "drive-shack",
      websiteUrl: "https://www.driveshack.com",
      faviconUrl: "https://www.google.com/s2/favicons?sz=128&domain_url=https://driveshack.com",
      tagline: "Augmented reality golf range with chef-inspired food, bars, and arcade — 3 locations",
      description:
        "Drive Shack is a premium golf entertainment destination combining augmented reality golf games with chef-inspired cuisine, multiple full bars, lounge areas, and a retro arcade. Currently operating in Orlando, West Palm Beach, and Richmond.",
      content: `Drive Shack is a large-format, premium golf entertainment venue built around augmented reality (AR) golf technology. Think Topgolf meets upscale restaurant meets arcade — spread across a multi-level venue with serious food and cocktail programs.

## The Drive Shack Experience

Drive Shack venues are big. Most span multiple floors with 50–80 hitting bays, multiple bar areas, a full-service restaurant, private event spaces, and an arcade section. The vibe is upscale entertainment destination rather than neighborhood golf bar.

## AR Golf Technology

Drive Shack uses **augmented reality** overlays on a live driving range view, rather than virtual course simulation. This means:

- You hit real golf balls into a real net/targets
- AR graphics overlay your shot on screen in real time
- Multiple game modes track accuracy and distance
- Leaderboards and in-bay scoring throughout

## Game Modes

- **Drive Shack Classic** — accuracy and distance scoring
- **Last Man Standing** — elimination game
- **Closest to the Pin** — head-to-head contests
- **Free Practice** — open range with shot data

## Food & Beverage

Drive Shack takes the F&B seriously with chef-inspired menus featuring elevated comfort food, shareable plates, and signature cocktails. Multiple bar stations throughout the venue mean you're never far from a drink.

## Arcade

Each Drive Shack location includes a **retro arcade** section with classic and modern games — adding to the appeal for mixed groups and families.

## Locations

Drive Shack currently operates 3 venues:

- **Orlando, FL** (Lake Nona)
- **West Palm Beach, FL**
- **Richmond, VA**

## Events & Private Parties

Drive Shack is a popular corporate event and private party venue. Private bays and event spaces can accommodate groups of all sizes.`,
      priceRange: "Mid–Premium",
      tags: ["drive-shack", "bar-lounge", "indoor-golf", "entertainment-venue", "mid-range"],
    },
    {
      name: "Puttery",
      slug: "puttery",
      websiteUrl: "https://www.puttery.com",
      faviconUrl: "https://www.google.com/s2/favicons?sz=128&domain_url=https://puttery.com",
      tagline: "Tech-infused indoor mini golf with craft cocktails and full kitchen — 11+ locations",
      description:
        "Puttery is an upscale indoor mini golf and entertainment concept from Drive Shack Inc., featuring multiple themed 9-hole courses, full-service kitchen, and sophisticated cocktail program. With 11+ locations across the US and growing, it's one of the hottest entertainment venue concepts in the country.",
      content: `Puttery is redefining mini golf as a legitimate night-out destination for adults. Operated by Drive Shack Inc., Puttery venues are 18,000–24,000 sq ft entertainment complexes built around themed indoor mini golf courses with integrated food and bar service.

## The Puttery Experience

Puttery isn't your childhood mini golf. Each venue features:

- **2–4 themed 9-hole courses** per location, each with unique design and decor
- Technology-integrated scoring and leaderboards
- Full-service kitchen with elevated food menu
- Sophisticated cocktail program and full bar
- Lounge areas throughout for socializing between holes

## Technology & Design

Puttery integrates digital technology throughout the experience:

- App-based scoring and real-time leaderboards
- Interactive course elements and lighting
- Themed environments (jungle, space, disco, etc. vary by location)
- Digital displays and ambient effects

## Food & Beverage

The F&B program sets Puttery apart from typical mini golf venues:

- Full-service kitchen with shareable plates, tacos, flatbreads, and desserts
- Craft cocktails, signature drinks, and extensive wine/beer list
- Server-to-table ordering throughout the venue
- Happy hour specials and event packages

## Locations

Puttery has 11+ locations including:

- **Dallas, TX** (original flagship)
- **Houston, TX**
- **Chicago, IL**
- **New York City, NY**
- **Washington D.C.**
- **Miami, FL**
- **Charlotte, NC**
- **Minneapolis, MN**
- **Kansas City, MO**
- **Pittsburgh, PA**
- Additional locations opening nationwide

## Pricing

Mid-range pricing typically charged per round per person, with F&B ordered separately. Happy hour and off-peak discounts available.

## Best For

Puttery is ideal for date nights, birthday parties, bachelorette groups, and corporate team outings. It's not a simulator venue — no ball tracking or swing data — but it's a premium entertainment experience in the golf-adjacent space.`,
      priceRange: "Mid-Range",
      tags: ["puttery", "mini-golf", "bar-lounge", "entertainment-venue", "mid-range"],
    },
    {
      name: "Puttshack",
      slug: "puttshack",
      websiteUrl: "https://www.puttshack.com",
      faviconUrl: "https://www.google.com/s2/favicons?sz=128&domain_url=https://puttshack.com",
      tagline: "RFID-powered tech mini golf with automatic scoring and upscale bar — US expanding",
      description:
        "Puttshack is a premium tech-infused mini golf concept from the founders of Topgolf, featuring RFID-chipped golf balls with automatic scoring, fun course designs, and a full upscale bar and food program. Originally from the UK, Puttshack is expanding rapidly across the US.",
      content: `Puttshack was founded by the same team behind Topgolf — and it shows. The concept applies the same formula of technology + food & drink + entertainment to mini golf, creating an experience that's a step above traditional indoor putting venues.

## The Puttshack Concept

Puttshack centers around **Trackaball™ technology** — their proprietary RFID system embedded in every golf ball. This eliminates manual scorekeeping entirely:

- Ball automatically records where it goes
- Score is tracked in real time on in-bay screens
- Leaderboard updates live throughout the round
- Digital challenges unlock bonuses and penalties mid-round

## The Courses

Each Puttshack location features multiple 9-hole courses with:

- Whimsical, imaginative hole designs
- Interactive elements (moving obstacles, target bonuses, etc.)
- Signature **Challenge Holes** — special holes with dynamic digital elements
- Competitive or relaxed play modes

## Food & Beverage

Puttshack takes its bar program seriously:

- Full cocktail menu with signature drinks
- Shareable plates, flatbreads, and snacks
- Table service throughout the venue
- Premium ingredients and presentation

## US Locations

Puttshack launched in the UK (4 London locations) before entering the US market:

- **Boston, MA** (Seaport District)
- **Chicago, IL** (River North)
- **Atlanta, GA**
- **Pittsburgh, PA**
- **Addison, TX** (Dallas area)
- **Houston, TX**
- Additional locations in development

## Pricing

Mid-range pricing charged per person per round, separate from food and beverage spend.

## Best For

Puttshack works exceptionally well for groups — the automatic scoring removes friction and keeps everyone engaged. Great for date nights, group outings, and corporate events.`,
      priceRange: "Mid-Range",
      tags: ["puttshack", "mini-golf", "bar-lounge", "entertainment-venue", "mid-range"],
    },
    {
      name: "Golfzon Social",
      slug: "golfzon-social",
      websiteUrl: "https://golfzon.com",
      faviconUrl: "https://www.google.com/s2/favicons?sz=128&domain_url=https://golfzon.com",
      tagline: "Korean-engineered simulators with moving tee platforms in an upscale venue concept",
      description:
        "Golfzon Social is the venue concept built around Golfzon's world-leading Korean simulator technology — featuring moving tee plates, slope simulation, and some of the most realistic sim golf available. Operated through Troon partnerships and David Leadbetter-branded locations.",
      content: `Golfzon is the world leader in golf simulator technology, based in South Korea, with millions of simulator rounds played annually in Korea alone. In the US, Golfzon technology powers both individual venue installations and the growing **Golfzon Social** venue concept.

## Why Golfzon Stands Out

Golfzon simulators are known for a feature no other consumer simulator chain offers: **moving tee plates**. The platform your feet stand on actually tilts and rotates to simulate the lie of the ball — uphill, downhill, and side-hill lies are physically recreated under your feet.

This makes Golfzon one of the most immersive and realistic simulator experiences available anywhere.

## Technology Features

- **Moving Tee Plate** — tilts to simulate real course slopes and lies
- **Dual cameras** + infrared sensors for ball and club tracking
- **200+ courses** including major championship venues
- Handicap index integration and competitive play modes
- Multiplayer online tournaments with players worldwide

## Golfzon Social Venue Format

Golfzon Social venues are operated in partnership with **Troon** (the world's largest golf management company) and feature:

- Premium simulator bays with Golfzon's top-tier Vision hardware
- Upscale food and beverage service
- PGA instruction integration (some locations with David Leadbetter branding)
- Private event and corporate outing packages

## Locations

Golfzon Social venues are growing across the US, with Troon managing operations at golf clubs and standalone locations. Find current locations at [golfzon.com](https://golfzon.com).

## Pricing

Premium pricing commensurate with the technology quality — expect to pay at the higher end of the simulator venue spectrum.

## Best For

Golfzon is ideal for serious golfers who want the most realistic simulator experience possible, especially those who play a lot of course-specific golf and want accurate lie simulation.`,
      priceRange: "Premium",
      tags: ["golfzon-social", "golfzon", "camera-based", "bar-lounge", "indoor-golf", "entertainment-venue", "premium"],
    },
  ]

  let created = 0
  let skipped = 0

  for (const chain of chains) {
    const existing = await db.tool.findFirst({ where: { slug: chain.slug } })
    if (existing) {
      console.log(`  Skipping ${chain.name} (already exists)`)
      skipped++
      continue
    }

    // Build tag connect array (only connect tags that exist)
    const tagConnects = []
    for (const tagSlug of chain.tags) {
      const tag = await db.tag.findFirst({ where: { slug: tagSlug } })
      if (tag) tagConnects.push({ slug: tagSlug })
    }

    await db.tool.create({
      data: {
        name: chain.name,
        slug: chain.slug,
        websiteUrl: chain.websiteUrl,
        faviconUrl: chain.faviconUrl,
        tagline: chain.tagline,
        description: chain.description,
        content: chain.content,
        priceRange: chain.priceRange,
        status: ToolStatus.Published,
        publishedAt: new Date(),
        categories: { connect: [{ slug: "chain" }] },
        tags: { connect: tagConnects },
      },
    })

    console.log(`  ✓ Created ${chain.name}`)
    created++
  }

  console.log(`\nDone! Created ${created} chains, skipped ${skipped}.`)
}

main()
  .catch(e => {
    console.error("Error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
