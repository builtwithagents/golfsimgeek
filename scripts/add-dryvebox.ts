import { db } from "~/services/db"
import { ToolStatus } from "~/.generated/prisma/client"

const DRYVEBOX_LOCATIONS = [
  {
    placeId: "ChIJF86OwSIrlYAReP8O2fDWrDM",
    name: "Dryvebox Visalia Tulare",
    address: "132 E Kern Ave",
    city: "Tulare",
    state: "CA",
    zip: "93274",
    phone: "(559) 366-7632",
    website: "https://www.dryvebox.com/locations/visalia",
    rating: 5.0,
    reviewCount: 8,
  },
  {
    placeId: "ChIJEWYFSAC3j4ARdcv4RhP0520",
    name: "Dryvebox Mountain View",
    address: "777 E Middlefield Rd",
    city: "Mountain View",
    state: "CA",
    zip: "94043",
    phone: "(602) 730-5590",
    website: "https://www.dryvebox.com",
    rating: null,
    reviewCount: 0,
  },
  {
    placeId: "ChIJi8nvv9VbwoARwVPfXiRXhho",
    name: "Dryvebox Lancaster",
    address: "852 W Lancaster Blvd",
    city: "Lancaster",
    state: "CA",
    zip: "93534",
    phone: "(661) 206-5556",
    website: "https://www.dryvebox.com/locations/lancaster",
    rating: 5.0,
    reviewCount: 6,
  },
  {
    placeId: "ChIJt8ERYXj1UocRKrcY-R6mdhY",
    name: "Dryvebox Salt Lake City",
    address: "154 W 600 S",
    city: "Salt Lake City",
    state: "UT",
    zip: "84101",
    phone: "(801) 598-1511",
    website: "https://www.dryvebox.com/locations/utah",
    rating: 5.0,
    reviewCount: 20,
  },
  {
    placeId: "ChIJmQhk0FyvK4cRrSeLIgrPxek",
    name: "Dryvebox Phoenix",
    address: "2484 E Warner Rd",
    city: "Gilbert",
    state: "AZ",
    zip: "85296",
    phone: "(480) 772-3548",
    website: "https://www.dryvebox.com/locations/phoenix",
    rating: 5.0,
    reviewCount: 1,
  },
  {
    placeId: "ChIJQf2XzFyVwokRMEyhj29y4Uw",
    name: "Dryvebox White Plains",
    address: "701 Dobbs Ferry Rd",
    city: "White Plains",
    state: "NY",
    zip: "10607",
    phone: "(914) 444-2841",
    website: "https://www.dryvebox.com/locations/white-plains",
    rating: 5.0,
    reviewCount: 3,
  },
  {
    placeId: "ChIJTxSD0g17_ogRo_iI5B-OIRw",
    name: "Dryvebox Charleston",
    address: "164 Market St #121",
    city: "Charleston",
    state: "SC",
    zip: "29401",
    phone: null,
    website: "https://www.dryvebox.com/locations/charleston",
    rating: 5.0,
    reviewCount: 1,
  },
  {
    placeId: "ChIJH428Al7xNIgR-PU8fIRvlr8",
    name: "Dryvebox Pittsburgh",
    address: "",
    city: "Pittsburgh",
    state: "PA",
    zip: "15219",
    phone: null,
    website: "https://www.dryvebox.com/locations/pittsburgh",
    rating: 5.0,
    reviewCount: 5,
  },
  {
    placeId: "ChIJz63EBXsP6IkRhqSMJfg3YzQ",
    name: "Dryvebox Fairfield",
    address: "48 Highlawn Rd",
    city: "Fairfield",
    state: "CT",
    zip: "06824",
    phone: "(202) 680-3335",
    website: "https://www.dryvebox.com/locations/fairfield",
    rating: 4.7,
    reviewCount: 12,
  },
  {
    placeId: "ChIJ9d_0cZFzk4cR_kCx_Sc-1Go",
    name: "Dryvebox Omaha",
    address: "29512 285th St",
    city: "Neola",
    state: "IA",
    zip: "51559",
    phone: "(402) 926-1468",
    website: "https://www.dryvebox.com",
    rating: 5.0,
    reviewCount: 2,
  },
]

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

async function main() {
  // Get the "Mobile Rentals" category
  const category = await db.category.findFirst({ where: { slug: "mobile-rentals" } })
  if (!category) {
    console.error("Category 'mobile-rentals' not found. Creating it...")
    const newCat = await db.category.create({
      data: { name: "Mobile Rentals", slug: "mobile-rentals" }
    })
    console.log("Created category:", newCat.id)
  }
  const cat = category || await db.category.findFirstOrThrow({ where: { slug: "mobile-rentals" } })

  const admin = await db.user.findFirstOrThrow({ where: { role: "admin" } })

  for (const loc of DRYVEBOX_LOCATIONS) {
    const slug = slugify(loc.name)
    
    const existing = await db.tool.findFirst({ where: { slug } })
    if (existing) {
      console.log(`SKIP (exists): ${loc.name}`)
      continue
    }

    await db.tool.create({
      data: {
        name: loc.name,
        slug,
        websiteUrl: loc.website,
        description: `Dryvebox brings state-of-the-art TrackMan-powered mobile golf simulators to your events, parties, and corporate gatherings in the ${loc.city} area. With 400+ courses and tour-level accuracy, Dryvebox delivers a premium golf experience anywhere you need it.`,
        content: `Dryvebox is a leading mobile golf simulator company offering TrackMan-powered experiences for events, parties, corporate outings, and more. Their fleet includes custom trailers, indoor enclosures, and putting systems that can be set up at any venue.`,
        tagline: `Mobile golf simulator experiences in ${loc.city}, ${loc.state}`,
        submitterEmail: admin.email,
        owner: { connect: { id: admin.id } },
        phone: loc.phone,
        address: loc.address,
        city: loc.city,
        state: loc.state,
        stateCode: loc.state,
        zipCode: loc.zip,
        placeId: loc.placeId,
        googleRating: loc.rating,
        reviewCount: loc.reviewCount,
        mobileConfirmed: true,
        status: ToolStatus.Published,
        publishedAt: new Date(),
        categories: { connect: { id: cat.id } },
      },
    })
    console.log(`ADDED: ${loc.name} (${loc.city}, ${loc.state})`)
  }

  console.log("\nDone!")
}

main().catch(err => { console.error(err); process.exit(1) })
