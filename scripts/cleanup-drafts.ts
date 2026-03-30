import { db } from "../services/db"

const JUNK_KEYWORDS = [
  "golf cart", "golfcart", "cart sales", "cart rental", "cart service", "cart center",
  "electric golf car", "golf car ", "carts by design", "cart nation",
  "mini golf", "miniature golf", "putt-putt", "putt putt", "puttshack", "puttery",
  "golfland", "ghost golf", "urban putt", "glowing greens", "pirates paradise",
  "jungle golf", "shipwreck golf", "birdie time pub",
  "driving range", "toptracer range",
  "golftec", "teachme.to",
  "golf galaxy", "pga tour superstore", "dick's sporting", "roger dunn",
  "club champion", "true spec golf", "pxg ",
  "golf lesson", "golf instruction", "golf academy", "golf school", "golf defined",
  "golf studio", "putting chateau", "golf path academy",
  "trailer rental", "trailer sales", "trailersplus", "fleet trailer",
  "rv rental", "a class rv", "triple a rv",
  "mobile modular", "mobile kitchen",
  "ifly", "k1 speed", "virtual reality", "vr gaming", "zero latency",
  "sim racing", "sim racer", "academy sim racing",
  "batting cage", "bocce",
  "event rental", "party rental", "party plus", "party pals",
  "arcade", "amusement", "game craze",
  "apartment", "wentworth",
  "golf course", "country club", "golf club",
  "x-golf", "topgolf", "five iron", "bigshots", "drive shack", "popstroke",
]

async function main() {
  const drafts = await db.tool.findMany({
    where: { publishedAt: null },
    select: { id: true, name: true, city: true, stateCode: true, websiteUrl: true, content: true },
  })

  console.log(`Total drafts: ${drafts.length}`)

  const toDelete: string[] = []
  const toKeep: { id: string; name: string; city: string | null; stateCode: string | null }[] = []

  for (const d of drafts) {
    const nameLower = d.name.toLowerCase()
    const isJunk = JUNK_KEYWORDS.some(kw => nameLower.includes(kw))
    const noWebsite = !d.websiteUrl

    if (isJunk || noWebsite) {
      toDelete.push(d.id)
    } else {
      toKeep.push({ id: d.id, name: d.name, city: d.city, stateCode: d.stateCode })
    }
  }

  console.log(`Deleting ${toDelete.length} junk listings`)
  console.log(`Keeping ${toKeep.length} potentially legitimate listings`)

  // Delete junk in batches
  if (toDelete.length > 0) {
    // Delete related records first
    await db.report.deleteMany({ where: { toolId: { in: toDelete } } })
    await db.bookmark.deleteMany({ where: { toolId: { in: toDelete } } })
    await db.lead.deleteMany({ where: { toolId: { in: toDelete } } })
    await db.tool.deleteMany({ where: { id: { in: toDelete } } })
    console.log(`Deleted ${toDelete.length} junk listings`)
  }

  // Print remaining drafts
  console.log(`\nRemaining ${toKeep.length} drafts to review:`)
  for (const k of toKeep) {
    console.log(`  ${k.name} | ${k.city}, ${k.stateCode}`)
  }

  // Final counts
  const totalPublished = await db.tool.count({ where: { publishedAt: { not: null } } })
  const totalDrafts = await db.tool.count({ where: { publishedAt: null } })
  console.log(`\nFinal: ${totalPublished} published, ${totalDrafts} drafts`)
}

main().catch(console.error).finally(() => db.$disconnect())
