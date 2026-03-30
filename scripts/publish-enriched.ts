import { db } from "../services/db"

async function main() {
  // Count all listings by status
  const total = await db.tool.count()
  const published = await db.tool.count({ where: { publishedAt: { not: null } } })
  const withContent = await db.tool.count({
    where: {
      content: { not: null },
      description: { not: null },
      NOT: { description: "" },
    },
  })
  const drafts = await db.tool.count({ where: { publishedAt: null } })

  console.log("Total listings:", total)
  console.log("Already published:", published)
  console.log("Drafts:", drafts)
  console.log("Have content + description (enriched):", withContent)

  // Publish only enriched listings (have content AND description)
  const result = await db.tool.updateMany({
    where: {
      content: { not: null },
      description: { not: null },
      NOT: { description: "" },
      publishedAt: null,
    },
    data: {
      publishedAt: new Date(),
      status: "Published",
    },
  })

  console.log("\nNewly published:", result.count)

  // Verify
  const nowPublished = await db.tool.count({ where: { publishedAt: { not: null } } })
  const stillDraft = await db.tool.count({ where: { publishedAt: null } })
  console.log("Total now published:", nowPublished)
  console.log("Still draft:", stillDraft)
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())
