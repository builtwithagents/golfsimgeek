/**
 * Create SEO-targeted blog posts for GolfSimGeek
 *
 * Usage:
 *   DATABASE_URL="..." npx tsx scripts/create-blog-posts.ts
 */

import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "~/.generated/prisma/client"

const posts = [
  {
    title: "Best Home Golf Simulators in 2026: Complete Buyer's Guide",
    slug: "best-home-golf-simulators-2026",
    description:
      "Looking for the best home golf simulator? We compare top systems from Trackman, SkyTrak, Garmin, Foresight, and more to help you find the perfect setup for your budget and space.",
    content: `## Why Build a Home Golf Simulator?

A home golf simulator lets you play and practice year-round, regardless of weather. Whether you're looking to improve your swing, play virtual rounds on famous courses, or just have fun with friends, today's simulators deliver a remarkably realistic experience.

The market has exploded in recent years, with options ranging from budget-friendly setups under $1,000 to professional-grade systems exceeding $50,000. This guide breaks down the best options at every price point.

## Best Overall: Garmin Approach R10 + Home Setup

For most golfers, the **Garmin Approach R10** paired with a quality impact screen and projector offers the best balance of accuracy, features, and value. At around $600 for the launch monitor alone, it tracks ball speed, launch angle, spin, and club path with impressive accuracy for its price.

**Pros:**
- Portable — use it at the range or at home
- Tracks 14 data points per shot
- Works with the E6 Connect simulator software
- Budget-friendly entry point

**Cons:**
- Radar-based, so it requires about 8 feet of ball flight
- Less accurate spin readings than camera-based systems
- Subscription needed for some simulator software

**Best for:** Beginners and mid-handicap golfers who want a solid all-around setup without breaking the bank.

## Best Mid-Range: SkyTrak+ Launch Monitor

The **SkyTrak+** is the most popular launch monitor in the $2,000-$3,000 range, and for good reason. It uses photometric (camera-based) technology to deliver accurate ball data, and the upgraded Plus model adds club data and dual-band WiFi.

**Pros:**
- Highly accurate ball data (spin, speed, launch angle)
- New club data in the Plus model
- Large library of courses and practice modes
- Strong community and third-party software support

**Cons:**
- Shot processing can lag slightly
- Best accuracy requires consistent lighting
- Course software requires additional subscriptions

**Best for:** Serious golfers who want reliable data and a wide range of simulator courses.

## Best Premium: Trackman iO

If money is less of a concern, the **Trackman iO** is the gold standard. Used by PGA Tour pros and top club fitters worldwide, Trackman's dual-radar technology delivers the most accurate and comprehensive data available.

**Pros:**
- Industry-leading accuracy for ball and club data
- 30+ data points per swing
- Massive library of virtual courses
- Used by tour professionals and top academies

**Cons:**
- Starting at $20,000+, it's a serious investment
- Requires a dedicated space with proper setup
- Subscription for online features

**Best for:** Low-handicap golfers, teaching professionals, and anyone who wants tour-level data.

## Best Value: Rapsodo MLM2PRO

The **Rapsodo MLM2PRO** has disrupted the market with a sub-$700 launch monitor that punches well above its weight. It combines radar and camera technology for solid accuracy.

**Pros:**
- Under $700 for the launch monitor
- Shot video replay with data overlay
- GPS mode for outdoor range sessions
- Simulator-compatible via E6 Connect

**Cons:**
- Newer to the market with a smaller ecosystem
- Simulator experience not as polished as SkyTrak
- Limited course library compared to competitors

**Best for:** Budget-conscious golfers who want solid data without the big price tag.

## Best Ultra-Premium: Foresight GCQuad

The **Foresight GCQuad** is the preferred choice for elite club fitters and biomechanics labs. Its quad-camera system captures the most precise ball and club data available.

**Pros:**
- Four high-speed cameras for unmatched precision
- Captures face angle, impact location, and more
- Compact, portable form factor
- FSX simulation software is excellent

**Cons:**
- $15,000+ price point
- Putting analysis requires add-on module
- Course library smaller than Trackman's

**Best for:** Club fitters, golf instructors, and players who prioritize data accuracy above all else.

## Choosing Your Simulator Setup

Beyond the launch monitor, you'll need:

1. **Impact screen** ($200-$1,500) — Absorbs ball impact and displays the simulation
2. **Projector** ($500-$2,000) — Short-throw projectors work best for small spaces
3. **Hitting mat** ($100-$600) — Quality turf that protects your joints
4. **Enclosure/net** ($200-$3,000) — Contains errant shots
5. **Computer** ($800-$2,000) — Runs the simulator software

**Total budget ranges:**
- **Budget setup:** $1,500-$3,000 (Garmin R10 or Rapsodo + basic enclosure)
- **Mid-range setup:** $5,000-$10,000 (SkyTrak+ with quality screen and projector)
- **Premium setup:** $20,000-$40,000 (Trackman or GCQuad with dedicated room)

## Space Requirements

Most home simulators need:
- **Width:** 10-12 feet minimum (12-15 feet ideal)
- **Depth:** 15-18 feet (from hitting area to screen)
- **Height:** 9-10 feet (standard ceiling works for most golfers)

Basements, garages, and spare bedrooms are the most common locations. If ceiling height is a concern, consider a hitting net setup instead of a full projector system.

## Our Recommendation

For most golfers building their first home simulator, we recommend the **SkyTrak+** paired with a quality impact screen package. It hits the sweet spot of accuracy, features, and value. Once you outgrow it, the resale market is strong — SkyTrak units hold their value well.

Ready to find a place to try before you buy? [Browse golf simulator locations near you](/browse) on GolfSimGeek.`,
    plainText:
      "Why Build a Home Golf Simulator? A home golf simulator lets you play and practice year-round. The market has options from under $1,000 to over $50,000. Best Overall: Garmin Approach R10. Best Mid-Range: SkyTrak+. Best Premium: Trackman iO. Best Value: Rapsodo MLM2PRO. Best Ultra-Premium: Foresight GCQuad. Guide covers setup requirements, space needs, and budget ranges from $1,500 to $40,000+.",
  },
  {
    title: "Trackman vs SkyTrak: Which Launch Monitor Is Right for You?",
    slug: "trackman-vs-skytrak-comparison",
    description:
      "Trackman vs SkyTrak — we break down accuracy, features, price, and value to help you choose the right golf launch monitor for your home simulator or practice setup.",
    content: `## The Big Question

Trackman and SkyTrak are two of the most popular names in golf launch monitors, but they sit at very different price points. Is Trackman really worth 10x the price? Let's break it down.

## Technology: Radar vs Camera

**Trackman** uses dual-radar technology. Two radar systems track the club through impact and follow the ball all the way to landing. This gives Trackman extremely accurate club AND ball data.

**SkyTrak** uses photometric (camera-based) technology. High-speed cameras capture images of the ball at launch, measuring speed, spin, and launch angle with impressive accuracy for its price.

The key difference: Trackman excels at club data (path, face angle, attack angle, dynamic loft), while SkyTrak's strength is ball data. The SkyTrak+ added club data, but Trackman's club measurements remain more comprehensive.

## Accuracy Comparison

| Metric | Trackman iO | SkyTrak+ |
|--------|-------------|----------|
| Ball Speed | Excellent | Very Good |
| Launch Angle | Excellent | Very Good |
| Total Spin | Excellent | Good |
| Spin Axis | Excellent | Good |
| Carry Distance | Excellent | Very Good |
| Club Speed | Excellent | Good |
| Club Path | Excellent | Fair |
| Face Angle | Excellent | Fair |

For ball data, SkyTrak gets you about 90% of Trackman's accuracy. The gap widens significantly for club data, where Trackman's dual-radar system has a clear technological advantage.

## Features

**Trackman iO:**
- 30+ data parameters
- Virtual Golf — extensive course library with multiplayer
- Combine testing (standardized skill assessments)
- Video integration
- Cloud data storage and analysis
- Tour-level practice modes

**SkyTrak+:**
- 12+ data parameters (expanded from original SkyTrak)
- E6 Connect, WGT, and other simulator platforms
- Skills assessments and challenges
- Practice range with targets
- Shot history and data tracking
- Dual-band WiFi (new in Plus)

## Price Breakdown

| | Trackman iO | SkyTrak+ |
|--|-------------|----------|
| Hardware | $20,000+ | $2,495 |
| Annual Subscription | $1,000+ | $200-$300 |
| Simulator Software | Included | $300-$600/year |
| 5-Year Total Cost | $25,000+ | $4,000-$5,500 |

The price gap is substantial. You could buy 8 SkyTrak+ units for the price of one Trackman.

## Who Should Buy Trackman?

- **Teaching professionals** who need the most accurate club data for lessons
- **Club fitters** who rely on precise club delivery data
- **Serious competitive golfers** (scratch or better) who train daily
- **Commercial facilities** — golf bars, indoor golf lounges, academies
- **Anyone for whom accuracy is the top priority** regardless of budget

## Who Should Buy SkyTrak?

- **Home simulator builders** who want great value
- **Recreational golfers** who play for fun and improvement
- **Mid-to-high handicap golfers** who won't fully utilize Trackman's extra data
- **Budget-conscious golfers** who want the best accuracy per dollar
- **Golfers who primarily want to play virtual rounds**

## The Verdict

For 95% of golfers building a home simulator, **SkyTrak+ is the better buy**. The accuracy is more than sufficient for practice and entertainment, the software ecosystem is robust, and you save $15,000+ that can go toward a better impact screen, projector, or actual rounds of golf.

Trackman wins on pure capability, but it's like buying a Formula 1 car for your daily commute — amazing technology, but overkill for most people's needs.

Want to try both before you decide? [Find a simulator location near you](/browse) where you can experience these systems firsthand.`,
    plainText:
      "Trackman vs SkyTrak comparison. Trackman uses dual-radar technology, SkyTrak uses photometric camera-based technology. Trackman excels at club data, SkyTrak is strong on ball data. Trackman starts at $20,000+, SkyTrak+ is $2,495. For 95% of golfers, SkyTrak+ is the better value. Trackman is best for teaching pros, club fitters, and commercial facilities.",
  },
  {
    title: "How Much Does a Mobile Golf Simulator Rental Cost in 2026?",
    slug: "mobile-golf-simulator-rental-cost",
    description:
      "Planning an event with a mobile golf simulator? Here's what to expect for rental costs, what's included, and tips for getting the best deal on golf simulator rentals.",
    content: `## Mobile Golf Simulator Rental Pricing

Mobile golf simulator rentals have become one of the hottest entertainment options for corporate events, weddings, birthday parties, and fundraisers. But pricing can vary wildly depending on your location, event type, and the simulator setup.

Here's what you can expect to pay in 2026.

## Average Rental Costs

| Rental Duration | Average Cost | Range |
|----------------|-------------|-------|
| 2 hours | $400-$600 | $250-$1,000 |
| 4 hours (half day) | $600-$1,000 | $400-$1,500 |
| Full day (8 hours) | $1,000-$2,000 | $600-$3,000 |
| Multi-day event | $800-$1,500/day | $500-$2,500/day |

Prices vary significantly by market. Expect to pay 20-40% more in major metros like New York, LA, or Chicago compared to smaller cities.

## What's Typically Included

Most mobile golf simulator rental packages include:

- **The simulator unit** — usually enclosed in a trailer, tent, or inflatable structure
- **Launch monitor** — SkyTrak, Trackman, or similar technology
- **Impact screen and projector**
- **Hitting mat and tee**
- **Setup and teardown** — operators typically arrive 1-2 hours early
- **On-site attendant** — someone to run the simulator and assist guests
- **Course selection** — virtual rounds on famous courses
- **Closest-to-the-pin and long drive contests**

## Factors That Affect Price

### 1. Technology Level
Rentals using Trackman or high-end Foresight systems charge more than those with SkyTrak or budget launch monitors. The visual quality and accuracy difference is noticeable but may not matter for casual events.

### 2. Indoor vs Outdoor
Outdoor setups require more equipment (tent/enclosure, generator if no power available) and may cost 15-25% more.

### 3. Number of Simulators
Multi-simulator setups reduce per-unit cost:
- 1 simulator: Full price
- 2 simulators: 10-20% discount per unit
- 3+ simulators: 15-30% discount per unit

### 4. Travel Distance
Most operators include travel within 25-50 miles. Beyond that, expect $1-3 per mile in travel fees.

### 5. Event Type
Corporate events and weddings typically pay premium rates. Birthday parties and casual events may get better pricing, especially on weekdays.

### 6. Time of Year
Peak season (spring and summer) commands higher prices. Off-season (November-February) may offer 10-20% discounts — though that's actually when indoor simulators are most appealing!

## Tips for Getting the Best Deal

1. **Book early** — Popular operators book out weeks or months in advance, especially for weekend events
2. **Ask about weekday rates** — Many operators offer 20-30% off for Tuesday-Thursday events
3. **Bundle services** — Some operators offer packages with golf games, prizes, and branded experiences
4. **Check for package deals** — Half-day rates aren't always exactly half of full-day rates. Sometimes it's worth upgrading
5. **Get multiple quotes** — Prices vary significantly between operators in the same market
6. **Ask about add-ons** — Some include contests and leaderboards free, others charge extra

## What to Ask Before Booking

Before signing a rental agreement, make sure to ask:

- What technology/launch monitor is used?
- Is setup and teardown included in the price?
- Is an on-site operator included?
- What happens in case of rain (for outdoor events)?
- What's the cancellation policy?
- Do you need a specific power source (standard outlet vs generator)?
- What's the space requirement?
- Is insurance/liability coverage included?

## Is It Worth It?

For a 4-hour corporate event with 50+ guests, a mobile golf simulator at $800-$1,200 works out to roughly $16-$24 per person — comparable to bowling, escape rooms, or other group entertainment. The novelty factor and engagement level typically far exceeds traditional event entertainment.

Ready to book? [Find mobile golf simulator rental operators near you](/browse) on GolfSimGeek.`,
    plainText:
      "Mobile golf simulator rental costs in 2026. Average 2-hour rental: $400-$600. Half day: $600-$1,000. Full day: $1,000-$2,000. Prices vary by location, technology, and event type. Most rentals include setup, operator, simulator, and virtual courses. Tips for getting the best deal and questions to ask before booking.",
  },
  {
    title: "Best Golf Simulators Under $5,000 for Your Home Setup",
    slug: "best-golf-simulators-under-5000",
    description:
      "You don't need to spend $20K+ for a great home golf simulator. Here are the best complete simulator packages under $5,000 that deliver real results.",
    content: `## Great Simulators Don't Have to Break the Bank

The golf simulator market has matured to the point where you can build a genuinely impressive home setup for under $5,000. Five years ago, that budget would barely get you a launch monitor. Today, it gets you the whole package.

Here are the best ways to spend $5,000 or less on a home golf simulator.

## Best Complete Package: SkyTrak+ with SwingBay Package

**Total cost: ~$4,500-$4,800**

- SkyTrak+ launch monitor ($2,495)
- SwingBay retractable screen ($1,200)
- Short-throw projector ($500-$700)
- Quality hitting mat ($200-$300)

This is the setup most people should buy. The SkyTrak+ delivers excellent ball data, the SwingBay is a well-regarded retractable screen (great for shared spaces like garages), and a decent short-throw projector ties it all together.

**Why we like it:** Retractable screens are a game-changer for garages where you need the space back. The SkyTrak+ accuracy is hard to beat at this price.

## Best Budget Build: Garmin Approach R10 + DIY Enclosure

**Total cost: ~$1,500-$2,500**

- Garmin Approach R10 ($600)
- Carl's Place impact screen ($300-$500)
- Budget short-throw projector ($300-$500)
- Hitting mat ($100-$200)
- DIY PVC pipe frame ($100-$200)

The Garmin R10 continues to be the best entry-level launch monitor. Paired with a DIY enclosure using Carl's Place materials and a budget projector, you get a fully functional simulator for well under $3,000.

**Why we like it:** Lowest cost of entry for a "real" simulator experience. The R10 is accurate enough for most golfers, and the DIY approach lets you customize to your space.

## Best Mid-Range Value: Rapsodo MLM2PRO + PlayBetter SimStudio

**Total cost: ~$2,500-$3,500**

- Rapsodo MLM2PRO ($700)
- PlayBetter SimStudio package ($1,500-$2,500)

The MLM2PRO has quickly become a fan favorite for its combination of radar and camera technology at a sub-$700 price. PlayBetter's SimStudio packages include a screen, enclosure, projector, and mat — everything you need.

**Why we like it:** The MLM2PRO's shot video feature is genuinely useful for swing analysis. Getting video replay with data overlay at this price is remarkable.

## Best for Small Spaces: Phigolf 2

**Total cost: ~$250**

OK, this isn't a "real" simulator in the traditional sense. The Phigolf 2 is a swing stick with built-in sensors that connects to your phone or TV. But at $250, it's the cheapest way to play virtual golf at home.

**Why we like it:** If you're in an apartment or don't have space for a full setup, the Phigolf 2 scratches the itch. Don't expect data accuracy, but the gameplay is fun.

## Best Net-Only Setup: Garmin R10 + Net Return Pro Series

**Total cost: ~$1,800-$2,200**

- Garmin Approach R10 ($600)
- Net Return Pro Series ($800-$1,000)
- Hitting mat ($150-$300)
- iPad/tablet for data display ($300+)

Not everyone needs a projector and screen. A quality hitting net paired with the R10's data on a tablet gives you fantastic practice without the complexity of a full simulator. The Net Return's automatic ball return is a huge quality-of-life improvement.

**Why we like it:** Simplest setup with the least compromise on practice quality. Focus on your data and swing rather than virtual course graphics.

## What to Prioritize on a Budget

If you're working within a tight budget, here's where to spend and where to save:

**Spend more on:**
- **Launch monitor** — This is the brain of your simulator. Accuracy matters.
- **Hitting mat** — A cheap mat destroys your joints. Buy quality.
- **Impact screen** (if using a projector) — Cheap screens tear and dim quickly.

**Save on:**
- **Projector** — A $500 projector looks 80% as good as a $2,000 one in a dark room
- **Enclosure frame** — DIY PVC works perfectly fine
- **Simulator software** — Start with the free options included with your launch monitor

## Software Options Under $5K Setups

| Software | Cost | Compatible With |
|----------|------|----------------|
| E6 Connect | $300/year | SkyTrak, R10, Rapsodo |
| GSPro | $250/year | SkyTrak, R10, Rapsodo, others |
| Awesome Golf | Free with R10 | Garmin R10 |
| Rapsodo Range | Free with MLM2PRO | Rapsodo MLM2PRO |

GSPro has become the go-to for budget builds thanks to its excellent course library and active modding community.

## Space Requirements

All of these setups need:
- **10+ feet wide** (more is better for comfort)
- **9+ foot ceilings** (8 feet is tight but doable for shorter golfers)
- **12-16 feet deep** (from hitting area to screen/net)

The most common locations: garages, basements, and spare bedrooms.

## Our Top Pick

For most people reading this, the **Garmin R10 + DIY enclosure at ~$2,000** is the sweet spot. It gets you into the game at a reasonable price, and if you love it, you can upgrade individual components over time. Start with a budget projector, upgrade to SkyTrak+ later. Start with a PVC frame, upgrade to a permanent enclosure when you're ready.

Find a simulator location near you to [try different systems before buying](/browse).`,
    plainText:
      "Best golf simulators under $5,000. SkyTrak+ with SwingBay package at $4,500-$4,800 is the best complete package. Garmin R10 with DIY enclosure at $1,500-$2,500 is the best budget build. Rapsodo MLM2PRO at $2,500-$3,500 is the best mid-range value. Guide covers space requirements, software options, and budget prioritization tips.",
  },
  {
    title: "Indoor Golf Near Me: The Complete Guide to Finding Simulator Venues",
    slug: "indoor-golf-near-me-guide",
    description:
      "Looking for indoor golf near you? This guide covers everything from simulator bars and indoor golf lounges to driving ranges with bays — plus how to find the best venues in your area.",
    content: `## The Indoor Golf Boom

Indoor golf has exploded in popularity over the past few years. What started as a niche activity for hardcore golfers has gone mainstream, with simulator bars, indoor lounges, and tech-driven ranges popping up in cities across the country.

Whether you're a serious golfer looking to practice year-round or someone who just wants a fun night out, there's probably an indoor golf venue near you. Here's how to find it and what to expect.

## Types of Indoor Golf Venues

### Simulator Bars & Lounges
Think Topgolf meets your favorite sports bar. These venues combine golf simulators with food, drinks, and a social atmosphere. Examples include Five Iron Golf, X-Golf, and countless independent operators.

**What to expect:**
- Hourly bay rentals ($30-$80/hour)
- Full bar and food menu
- Multiple simulator bays
- Great for groups and dates
- Casual atmosphere — no golf experience needed

### Golf Entertainment Centers
Places like Topgolf, Drive Shack, and BigShots combine hitting bays with dining and entertainment. While not purely "indoor golf," they offer a weather-protected experience.

**What to expect:**
- Per-hour bay pricing ($25-$75/hour, varies by time)
- Restaurant-quality food and drinks
- Large venues with dozens of bays
- Targets and games for all skill levels
- Often outdoors but covered

### Private Simulator Studios
Smaller operations with 1-5 high-end simulators. These focus more on the golf experience and less on the nightlife.

**What to expect:**
- Higher quality simulators (Trackman, GCQuad)
- More serious golf focus
- Lessons and club fitting often available
- Quieter atmosphere
- Hourly rentals ($40-$100/hour)

### Indoor Driving Ranges
Traditional range experience brought indoors. Some use real balls with tracking technology, others use simulators.

**What to expect:**
- Per-bucket or per-hour pricing
- Practice-focused environment
- May offer lessons
- Less social atmosphere

## How to Find Indoor Golf Near You

### 1. Use GolfSimGeek
We maintain the most comprehensive directory of golf simulator venues across the United States. [Browse our directory](/browse) to find locations near you, complete with details on what simulators they use, pricing, and amenities.

### 2. Search by State
We have dedicated pages for every state with golf simulator venues:
- Browse by state to see all venues in your area
- Filter by region within each state
- See which simulators each venue uses

### 3. Google Maps
Search "indoor golf near me" or "golf simulator near me" on Google Maps. Results tend to favor larger venues — for smaller independent operations, GolfSimGeek may have better coverage.

## What to Look For in an Indoor Golf Venue

### Simulator Technology
Not all simulators are created equal. Here's a quick quality ranking:

1. **Trackman** — Tour-level accuracy, best overall experience
2. **Foresight/GCQuad** — Excellent accuracy, great visuals
3. **Full Swing** — Used by Tiger Woods, solid mid-range option
4. **SkyTrak** — Good accuracy, common in smaller venues
5. **Uneekor** — Growing in popularity, good value
6. **aboutGOLF** — Older technology, still functional

### Course Library
The best venues offer hundreds of virtual courses, including famous layouts like Pebble Beach, St Andrews, and Augusta National (via licensed software). Ask what simulator software they run — TruGolf, E6 Connect, and TrackMan Virtual Golf are the top platforms.

### Pricing Structure
Pricing models vary:
- **Per hour, per bay** — Most common. $30-$80/hour with 2-6 players per bay
- **Per person, per hour** — Less common. $15-$30/person/hour
- **Membership** — Monthly fee for regular access. $100-$300/month
- **League play** — Weekly leagues with seasonal fees

### Food & Drink
If you're planning a social outing, check the venue's food and beverage offerings. Many simulator bars serve full dinner menus, craft cocktails, and local beers. Others are BYOB-friendly.

### Group & Event Options
Most venues accommodate:
- Birthday parties
- Corporate events and team building
- Bachelor/bachelorette parties
- Holiday parties
- League nights

Call ahead to ask about group packages — most venues offer discounted rates for large bookings.

## Tips for Your First Visit

1. **Book in advance** — Popular venues fill up, especially on weekends
2. **Wear comfortable clothes** — No need for golf attire, but avoid restrictive clothing
3. **Bring your own clubs** — Most venues provide clubs, but your own are always more comfortable
4. **Arrive a few minutes early** — Setup and introductions eat into your time
5. **Don't worry about skill level** — Most venues cater to all levels, from beginners to low-handicap players
6. **Ask about longest drive and closest to pin contests** — Fun way to add competition

## The Cost of a Typical Outing

For a group of 4 friends spending 2 hours at an indoor golf simulator bar:

| Item | Cost |
|------|------|
| 2-hour bay rental | $80-$160 |
| Food (per person) | $15-$30 |
| Drinks (per person) | $10-$30 |
| **Total for group** | **$180-$360** |
| **Per person** | **$45-$90** |

That's comparable to a round of golf at a decent public course — but with climate control, no lost balls, and a full bar.

## Find Your Local Venue

Ready to try indoor golf? [Browse the GolfSimGeek directory](/browse) to find simulator venues near you. We list hundreds of locations across the United States, with details on simulators, pricing, and amenities.

Can't find a venue listed? [Let us know](/submit) and we'll add it to the directory.`,
    plainText:
      "Guide to finding indoor golf near you. Covers types of venues: simulator bars, entertainment centers, private studios, and indoor ranges. How to evaluate simulator technology, pricing, and amenities. Tips for first visits and typical costs ($45-$90 per person for a group outing). Use GolfSimGeek directory to find venues across the US.",
  },
]

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL!, max: 5 })
  const db = new PrismaClient({ adapter })

  // Get admin user
  const user = await db.user.findFirst({ select: { id: true, name: true } })
  if (!user) {
    console.error("No user found in database")
    process.exit(1)
  }
  console.log(`Using author: ${user.name} (${user.id})`)

  for (const post of posts) {
    // Check if post already exists
    const existing = await db.post.findUnique({ where: { slug: post.slug } })
    if (existing) {
      console.log(`Skipping "${post.title}" — already exists`)
      continue
    }

    const created = await db.post.create({
      data: {
        title: post.title,
        slug: post.slug,
        description: post.description,
        content: post.content,
        plainText: post.plainText,
        status: "Published",
        publishedAt: new Date(),
        authorId: user.id,
      },
    })
    console.log(`Created: "${created.title}" (${created.slug})`)
  }

  console.log("\nDone! All blog posts created.")
  await db.$disconnect()
}

main().catch(console.error)
