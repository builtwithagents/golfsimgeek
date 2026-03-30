import { db } from "~/services/db";

async function main() {
  // 1. Count published listings by stateCode
  const publishedListings = await db.tool.findMany({
    where: { status: "Published" },
    select: { id: true, name: true, city: true, state: true, stateCode: true, region: true, regionSlug: true },
    orderBy: [{ stateCode: "asc" }, { city: "asc" }],
  });

  console.log(`\n=== Total Published Listings: ${publishedListings.length} ===\n`);

  // 1. Count by stateCode
  const byState = new Map<string, number>();
  for (const t of publishedListings) {
    const s = t.stateCode || "(none)";
    byState.set(s, (byState.get(s) || 0) + 1);
  }
  console.log("--- Published listings by stateCode ---");
  for (const [s, c] of [...byState.entries()].sort()) {
    console.log(`  ${s}: ${c}`);
  }

  // 2. Region assigned vs not
  const withRegion = publishedListings.filter(t => t.region && t.region.length > 0);
  const withoutRegion = publishedListings.filter(t => !t.region || t.region.length === 0);
  console.log(`\n--- Region assignment ---`);
  console.log(`  With region:    ${withRegion.length}`);
  console.log(`  Without region: ${withoutRegion.length}`);

  // 3. Distinct regions per state
  const regionsByState = new Map<string, Set<string>>();
  for (const t of withRegion) {
    const s = t.stateCode || "(none)";
    if (!regionsByState.has(s)) regionsByState.set(s, new Set());
    regionsByState.get(s)!.add(t.region!);
  }
  console.log(`\n--- Distinct regions per state ---`);
  for (const [s, regions] of [...regionsByState.entries()].sort()) {
    const sorted = [...regions].sort();
    console.log(`  ${s}: ${sorted.join(", ")}`);
  }

  // 4. Cities without a region assigned (grouped by state)
  const noRegionByState = new Map<string, string[]>();
  for (const t of withoutRegion) {
    const s = t.stateCode || "(none)";
    if (!noRegionByState.has(s)) noRegionByState.set(s, []);
    const label = t.city ? `${t.city} (${t.name})` : `(no city) (${t.name})`;
    noRegionByState.get(s)!.push(label);
  }
  console.log(`\n--- Cities without a region assigned (${withoutRegion.length} listings) ---`);
  if (noRegionByState.size === 0) {
    console.log("  All published listings have a region assigned.");
  } else {
    for (const [s, cities] of [...noRegionByState.entries()].sort()) {
      console.log(`  ${s}:`);
      for (const c of cities) {
        console.log(`    - ${c}`);
      }
    }
  }

  await db.$disconnect();
}

main();
