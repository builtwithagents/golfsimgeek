import { db } from "~/services/db";
import { readFileSync } from "fs";
import { join } from "path";

async function main() {
  const idsFile = process.env.IDS_FILE || join(import.meta.dirname, "..", "data", "se-delete-ids.json");
  const ids: string[] = JSON.parse(readFileSync(idsFile, "utf-8"));

  console.log(`Deleting ${ids.length} listings...`);

  let deleted = 0;
  let errors = 0;

  for (const id of ids) {
    try {
      await db.tool.delete({ where: { id } });
      deleted++;
    } catch (err: any) {
      if (err.code === "P2025") {
        // Record not found, already deleted
        deleted++;
      } else {
        console.error(`  Error deleting ${id}:`, err.message);
        errors++;
      }
    }
  }

  console.log(`\nDeleted: ${deleted}, Errors: ${errors}`);
  await db.$disconnect();
}

main();
