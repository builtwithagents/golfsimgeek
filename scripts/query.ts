import { db } from "../lib/db"

async function main() {
  const states = await db.tool.groupBy({
    by: ["stateCode"],
    _count: { id: true },
    where: { status: "Published", stateCode: { not: null } },
    orderBy: { _count: { id: "desc" } },
  })
  console.log("Listings by state:")
  states.forEach(s => console.log(s.stateCode + ": " + s._count.id))
  console.log("Total states:", states.length)
  const total = states.reduce((sum, s) => sum + s._count.id, 0)
  console.log("Total published listings:", total)

  const regions = await db.tool.groupBy({
    by: ["stateCode", "region"],
    _count: { id: true },
    where: { status: "Published", region: { not: null } },
  })
  console.log("\nListings with regions assigned:", regions.length)

  await db.$disconnect()
}
main()
