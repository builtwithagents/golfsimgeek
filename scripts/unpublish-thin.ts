import { db } from "../services/db"

async function main() {
  // Unpublish listings with thin content (< 200 chars)
  const result = await db.tool.updateMany({
    where: {
      OR: [
        { content: null },
        { description: null },
        { description: "" },
      ],
    },
    data: {
      publishedAt: null,
      status: "Draft",
    },
  })
  console.log("Unpublished (null content/desc):", result.count)

  // For the rest, find thin ones by content length
  const allPublished = await db.tool.findMany({
    where: { publishedAt: { not: null } },
    select: { id: true, name: true, content: true },
  })

  const thinIds: string[] = []
  for (const l of allPublished) {
    if ((l.content?.length ?? 0) < 200) {
      thinIds.push(l.id)
    }
  }

  if (thinIds.length > 0) {
    const result2 = await db.tool.updateMany({
      where: { id: { in: thinIds } },
      data: {
        publishedAt: null,
        status: "Draft",
      },
    })
    console.log("Unpublished (thin content):", result2.count)
  }

  const finalPublished = await db.tool.count({ where: { publishedAt: { not: null } } })
  const finalDraft = await db.tool.count({ where: { publishedAt: null } })
  console.log("\nFinal published:", finalPublished)
  console.log("Final draft:", finalDraft)
}

main().catch(console.error).finally(() => db.$disconnect())
