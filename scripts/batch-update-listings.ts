import { db } from "~/services/db";
import { readFileSync } from "fs";
import { join } from "path";

type ListingUpdate = {
  id: string;
  description: string;
  content: string;
  priceRange?: string;
  delete?: boolean;
};

async function main() {
  const file = process.env.UPDATES_FILE || join(import.meta.dirname, "..", "data", "se-updates.json");
  const updates: ListingUpdate[] = JSON.parse(readFileSync(file, "utf-8"));

  console.log(`Processing ${updates.length} listing updates...`);

  let updated = 0;
  let deleted = 0;
  let errors = 0;

  for (const update of updates) {
    try {
      if (update.delete) {
        await db.tool.delete({ where: { id: update.id } });
        deleted++;
        console.log(`  Deleted: ${update.id}`);
      } else {
        await db.tool.update({
          where: { id: update.id },
          data: {
            description: update.description,
            content: update.content,
            ...(update.priceRange ? { priceRange: update.priceRange } : {}),
          },
        });
        updated++;
        console.log(`  Updated: ${update.id}`);
      }
    } catch (err: any) {
      console.error(`  Error (${update.id}): ${err.message}`);
      errors++;
    }
  }

  console.log(`\nSummary: Updated=${updated}, Deleted=${deleted}, Errors=${errors}`);
  await db.$disconnect();
}

main();
