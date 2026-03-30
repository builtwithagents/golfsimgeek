import { db } from "~/services/db";

async function main() {
  const seStates = [
    "Georgia", "North Carolina", "Tennessee", "Alabama", "South Carolina", "Kentucky"
  ];

  const tools = await db.tool.findMany({
    where: { state: { in: seStates } },
    select: { id: true, name: true, city: true, state: true, stateCode: true, content: true, status: true },
    orderBy: [{ state: "asc" }, { city: "asc" }],
  });

  const enriched = tools.filter(t => t.content && t.content.length >= 200);
  const notEnriched = tools.filter(t => !t.content || t.content.length < 200);

  console.log(`Total SE listings: ${tools.length}`);
  console.log(`Enriched (200+ chars content): ${enriched.length}`);
  console.log(`Not enriched: ${notEnriched.length}`);

  // State breakdown
  const byState = new Map<string, number>();
  for (const t of enriched) {
    const s = t.stateCode || "?";
    byState.set(s, (byState.get(s) || 0) + 1);
  }
  console.log("\nEnriched by state:");
  for (const [s, c] of [...byState.entries()].sort()) {
    console.log(`  ${s}: ${c}`);
  }

  if (notEnriched.length > 0) {
    console.log("\nNot enriched:");
    for (const t of notEnriched) {
      console.log(`  ${t.id} | ${t.name} | ${t.city} | ${t.stateCode} | content=${t.content?.length || 0}`);
    }
  }

  await db.$disconnect();
}

main();
