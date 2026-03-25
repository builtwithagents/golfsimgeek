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
  })

  console.log("Created users")

  // Create categories for golf simulator directory
  await db.category.createMany({
    data: [
      {
        name: "Mobile Golf Simulator",
        slug: "mobile-golf-simulator",
        label: "Mobile Golf Simulators",
        description: "Portable golf simulator setups that come to your location for events, parties, and corporate gatherings.",
      },
      {
        name: "Event Rental",
        slug: "event-rental",
        label: "Event Rentals",
        description: "Golf simulator rental services for weddings, fundraisers, trade shows, and special events.",
      },
      {
        name: "Corporate Entertainment",
        slug: "corporate-entertainment",
        label: "Corporate Entertainment",
        description: "Golf simulator services for corporate events, team building, client entertainment, and office parties.",
      },
      {
        name: "Party Rental",
        slug: "party-rental",
        label: "Party Rentals",
        description: "Golf simulator rentals for birthday parties, bachelor parties, holiday parties, and private gatherings.",
      },
      {
        name: "Tournament Setup",
        slug: "tournament-setup",
        label: "Tournament Setups",
        description: "Golf simulator services for virtual tournaments, charity events, and competitive golf experiences.",
      },
      {
        name: "Trailer-Based Simulator",
        slug: "trailer-based-simulator",
        label: "Trailer-Based Simulators",
        description: "Golf simulators built into trailers for easy transport and setup at any outdoor location.",
      },
    ],
  })

  console.log("Created categories")

  // Create tags
  await db.tag.createMany({
    data: [
      { name: "Trackman", slug: "trackman" },
      { name: "Full Swing", slug: "full-swing" },
      { name: "Foresight", slug: "foresight" },
      { name: "SkyTrak", slug: "skytrak" },
      { name: "Uneekor", slug: "uneekor" },
      { name: "FlightScope", slug: "flightscope" },
      { name: "Trailer", slug: "trailer" },
      { name: "Indoor Setup", slug: "indoor-setup" },
      { name: "Outdoor Setup", slug: "outdoor-setup" },
      { name: "Multi-Bay", slug: "multi-bay" },
      { name: "Corporate", slug: "corporate" },
      { name: "Wedding", slug: "wedding" },
      { name: "Fundraiser", slug: "fundraiser" },
      { name: "Birthday Party", slug: "birthday-party" },
      { name: "Bachelor Party", slug: "bachelor-party" },
      { name: "Trade Show", slug: "trade-show" },
      { name: "Team Building", slug: "team-building" },
    ],
  })

  console.log("Created tags")

  // Create a sample vendor
  const admin = await db.user.findFirstOrThrow({ where: { email: ADMIN_EMAIL } })

  await db.tool.create({
    data: {
      name: "Example Mobile Golf Sim",
      slug: "example-mobile-golf-sim",
      websiteUrl: "https://golfsimgeek.com",
      tagline: "Premium mobile golf simulator rental for events and parties",
      description: "This is a sample listing to demonstrate the directory. Replace with real vendors after running the scraper.",
      content: "This is a sample listing to demonstrate the GolfSimGeek directory. Run the Google Places scraper to populate with real mobile golf simulator rental businesses.",
      faviconUrl: "https://www.google.com/s2/favicons?sz=128&domain_url=https://golfsimgeek.com",
      status: ToolStatus.Published,
      publishedAt: new Date(),
      city: "Los Angeles",
      state: "California",
      stateCode: "CA",
      categories: { connect: [{ slug: "mobile-golf-simulator" }, { slug: "event-rental" }] },
      tags: { connect: [{ slug: "trackman" }, { slug: "corporate" }] },
      owner: { connect: { email: ADMIN_EMAIL } },
    },
  })

  console.log("Created sample vendor")

  // Create a blog post
  const blogContent = `Mobile golf simulators are transforming event entertainment across the United States. Whether you're planning a corporate team-building event, a fundraiser, or a birthday party, a mobile golf simulator adds a unique and engaging experience that appeals to golfers and non-golfers alike.

## What is a Mobile Golf Simulator?

A mobile golf simulator is a portable setup that uses launch monitor technology, a hitting screen, and projection to create a realistic golf experience anywhere. Many operators use trailer-based setups that can be parked at your venue, while others bring indoor enclosures that can be set up in a conference room, warehouse, or backyard.

## Finding the Right Vendor

When searching for a mobile golf simulator rental, consider these factors:

- **Technology**: Look for vendors using premium launch monitors like Trackman, Foresight, or Full Swing
- **Setup options**: Some vendors specialize in trailer setups (great for outdoor events), while others offer indoor enclosures
- **Service area**: Most mobile operators cover a specific metro area or region
- **Event experience**: The best vendors provide an attendant, custom branding options, and tournament scoring

## Why GolfSimGeek?

GolfSimGeek is the first comprehensive directory dedicated specifically to mobile golf simulator rental businesses. We verify every listing and focus exclusively on operators who bring the simulator to you.`

  await db.post.create({
    data: {
      title: "The Complete Guide to Mobile Golf Simulator Rentals",
      slug: "guide-to-mobile-golf-simulator-rentals",
      description: "Everything you need to know about renting a mobile golf simulator for your next event, party, or corporate gathering.",
      content: blogContent,
      plainText: blogContent,
      imageUrl: "/content/boilerplate.webp",
      status: PostStatus.Published,
      publishedAt: new Date(),
      authorId: admin.id,
    },
  })

  console.log("Created blog post")
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
