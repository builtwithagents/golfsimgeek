import { ToolStatus, PostStatus } from "~/.generated/prisma/client"
import { db } from "~/services/db"

const ADMIN_EMAIL = "admin@golfsimgeek.com"
const USER_EMAIL = "user@golfsimgeek.com"

async function main() {
  console.log("Starting seeding...")

  await db.user.createMany({
    data: [
      {
        name: "Admin User",
        email: ADMIN_EMAIL,
        emailVerified: true,
        role: "admin",
      },
      {
        name: "User",
        email: USER_EMAIL,
        emailVerified: true,
        role: "user",
      },
    ],
    skipDuplicates: true,
  })

  console.log("Created users")

  // Categories covering the full golf simulator space
  await db.category.createMany({
    skipDuplicates: true,
    data: [
      {
        name: "Mobile Rental",
        slug: "mobile-rental",
        label: "Mobile Rentals",
        description: "Mobile golf simulator rental businesses that bring the experience to your event, party, or venue.",
      },
      {
        name: "Home Simulator",
        slug: "home-simulator",
        label: "Home Simulators",
        description: "Complete golf simulator packages designed for home use — garage, basement, or dedicated sim rooms.",
      },
      {
        name: "Launch Monitor",
        slug: "launch-monitor",
        label: "Launch Monitors",
        description: "Golf launch monitors and radar/camera systems that track ball flight, swing data, and shot metrics.",
      },
      {
        name: "Simulator Software",
        slug: "simulator-software",
        label: "Simulator Software",
        description: "Golf simulation software platforms with virtual courses, practice modes, and multiplayer features.",
      },
      {
        name: "Enclosure & Screen",
        slug: "enclosure-screen",
        label: "Enclosures & Screens",
        description: "Impact screens, retractable enclosures, and hitting bays for golf simulator setups.",
      },
      {
        name: "Projector & Display",
        slug: "projector-display",
        label: "Projectors & Displays",
        description: "Short-throw projectors, displays, and mounting solutions optimized for golf simulators.",
      },
      {
        name: "Accessories",
        slug: "accessories",
        label: "Accessories",
        description: "Hitting mats, turf, netting, lighting, and other accessories for golf simulator setups.",
      },
      {
        name: "Commercial Simulator",
        slug: "commercial-simulator",
        label: "Commercial Simulators",
        description: "Commercial-grade golf simulator systems for entertainment venues, bars, and golf facilities.",
      },
    ],
  })

  console.log("Created categories")

  // Tags covering brands, features, and use cases
  await db.tag.createMany({
    skipDuplicates: true,
    data: [
      // Brands
      { name: "Trackman", slug: "trackman" },
      { name: "Foresight Sports", slug: "foresight-sports" },
      { name: "SkyTrak", slug: "skytrak" },
      { name: "Garmin Approach", slug: "garmin-approach" },
      { name: "Bushnell Launch Pro", slug: "bushnell-launch-pro" },
      { name: "Uneekor", slug: "uneekor" },
      { name: "FlightScope", slug: "flightscope" },
      { name: "Full Swing", slug: "full-swing" },
      { name: "Rapsodo", slug: "rapsodo" },
      { name: "TruGolf", slug: "trugolf" },
      { name: "Golfzon", slug: "golfzon" },
      { name: "OptiShot", slug: "optishot" },
      { name: "Mevo Plus", slug: "mevo-plus" },
      // Software
      { name: "E6 Connect", slug: "e6-connect" },
      { name: "GSPro", slug: "gspro" },
      { name: "TGC 2019", slug: "tgc-2019" },
      { name: "Awesome Golf", slug: "awesome-golf" },
      // Setup types
      { name: "Garage Setup", slug: "garage-setup" },
      { name: "Basement Setup", slug: "basement-setup" },
      { name: "Dedicated Room", slug: "dedicated-room" },
      { name: "Outdoor Setup", slug: "outdoor-setup" },
      { name: "Portable", slug: "portable" },
      { name: "Trailer", slug: "trailer" },
      // Use cases
      { name: "Corporate Event", slug: "corporate-event" },
      { name: "Wedding", slug: "wedding" },
      { name: "Party", slug: "party" },
      { name: "Trade Show", slug: "trade-show" },
      { name: "Fundraiser", slug: "fundraiser" },
      // Price tiers
      { name: "Budget", slug: "budget" },
      { name: "Mid-Range", slug: "mid-range" },
      { name: "Premium", slug: "premium" },
      // Tech types
      { name: "Radar-Based", slug: "radar-based" },
      { name: "Camera-Based", slug: "camera-based" },
      { name: "Photometric", slug: "photometric" },
    ],
  })

  console.log("Created tags")

  // Create a sample listing
  const admin = await db.user.findFirstOrThrow({ where: { email: ADMIN_EMAIL } })

  const existingTool = await db.tool.findFirst({ where: { slug: "skytrak-plus-home-package" } })
  if (!existingTool) {
    await db.tool.create({
      data: {
        name: "SkyTrak+ Home Package",
        slug: "skytrak-plus-home-package",
        websiteUrl: "https://www.skytrakgolf.com",
        tagline: "Photometric launch monitor with complete home simulator package",
        description: "The SkyTrak+ delivers professional-grade accuracy with photometric camera technology. This home package includes the launch monitor, hitting mat, impact screen, enclosure, and projector — everything needed for a turnkey home golf simulator.",
        content: "The SkyTrak+ is one of the most popular home golf simulator launch monitors on the market, offering excellent accuracy at a mid-range price point. It uses photometric (camera-based) technology to capture ball data at launch, providing reliable spin rates, launch angle, and ball speed measurements.\n\n## What's Included\n\n- SkyTrak+ Launch Monitor\n- Practice hitting mat\n- Impact screen\n- Basic enclosure frame\n- Short-throw projector\n\n## Key Specs\n\n- Camera-based measurement\n- Club data via optional metallic dots\n- WiFi and USB connectivity\n- Compatible with E6 Connect, GSPro, TGC 2019, and more",
        faviconUrl: "https://www.google.com/s2/favicons?sz=128&domain_url=https://www.skytrakgolf.com",
        status: ToolStatus.Published,
        publishedAt: new Date(),
        categories: { connect: [{ slug: "home-simulator" }, { slug: "launch-monitor" }] },
        tags: { connect: [{ slug: "skytrak" }, { slug: "photometric" }, { slug: "mid-range" }] },
        owner: { connect: { email: ADMIN_EMAIL } },
      },
    })
    console.log("Created sample listing")
  }

  // Create a blog post
  const existingPost = await db.post.findFirst({ where: { slug: "best-golf-simulators-for-home" } })
  if (!existingPost) {
    const blogContent = `Looking for the best golf simulator for your home? Whether you're setting up in a garage, basement, or dedicated sim room, the right simulator depends on your budget, space, and what you want out of the experience.

## What to Consider

Before buying, measure your space. Most home golf simulators need at least 10 feet of ceiling height, 12 feet of depth behind the ball, and 10 feet of width. A garage or basement with 9-foot ceilings can work with certain setups but limits your club selection.

## Budget Tiers

**Under $1,000** — Entry-level options like the OptiShot 2 or Rapsodo MLM2PRO give you basic simulation without breaking the bank. Great for practice, but limited course play.

**$1,000–$5,000** — The sweet spot. SkyTrak, Garmin Approach R10, and FlightScope Mevo+ deliver solid accuracy with full simulation software compatibility.

**$5,000–$15,000** — Premium accuracy from Foresight GCQuad, Uneekor EYE XO2, and Bushnell Launch Pro. These are the launch monitors used by tour pros and club fitters.

**$15,000+** — Full commercial systems from Trackman, Full Swing, and Golfzon. Complete packages with everything built in.

## Our Recommendation

For most home users, the **SkyTrak+** or **Garmin Approach R10** offer the best balance of accuracy, software compatibility, and value. Pair either with GSPro software and a basic enclosure for under $3,000 total.`

    await db.post.create({
      data: {
        title: "Best Golf Simulators for Home in 2026: Complete Buyer's Guide",
        slug: "best-golf-simulators-for-home",
        description: "Compare the best home golf simulators across every budget — from entry-level to tour-grade. Setup tips, space requirements, and our top picks.",
        content: blogContent,
        plainText: blogContent,
        imageUrl: "/content/boilerplate.webp",
        status: PostStatus.Published,
        publishedAt: new Date(),
        authorId: admin.id,
      },
    })
    console.log("Created blog post")
  }

  console.log("Seeding completed!")
}

main()
  .catch(e => {
    console.error("Error during seeding:", e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
