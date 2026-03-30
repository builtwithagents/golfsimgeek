import { db } from "../services/db"

async function main() {
  const listings = await db.tool.findMany({
    select: { id: true, name: true, city: true, stateCode: true, content: true, description: true, websiteUrl: true },
  })

  let good = 0
  let thin = 0
  const thinListings: string[] = []

  for (const l of listings) {
    const contentLen = l.content?.length ?? 0
    const descLen = l.description?.length ?? 0

    if (contentLen < 200 || descLen < 20) {
      thin++
      thinListings.push(`  ${l.name} | ${l.city}, ${l.stateCode} | content: ${contentLen} chars, desc: ${descLen} chars`)
    } else {
      good++
    }
  }

  console.log(`Total: ${listings.length}`)
  console.log(`Good quality (content >= 200 chars): ${good}`)
  console.log(`Thin/placeholder: ${thin}`)

  if (thinListings.length > 0) {
    console.log(`\nThin listings:`)
    thinListings.forEach(l => console.log(l))
  }
}

main().catch(console.error).finally(() => db.$disconnect())
