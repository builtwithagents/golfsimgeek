import { db } from "~/services/db";

async function main() {
  const id = process.env.LISTING_ID;
  const description = process.env.LISTING_DESC;
  const content = process.env.LISTING_CONTENT;
  const priceRange = process.env.LISTING_PRICE || undefined;

  if (!id || !description || !content) {
    console.error("Required: LISTING_ID, LISTING_DESC, LISTING_CONTENT");
    process.exit(1);
  }

  await db.tool.update({
    where: { id },
    data: {
      description,
      content,
      ...(priceRange ? { priceRange } : {}),
    },
  });

  console.log(`Updated: ${id}`);
  await db.$disconnect();
}

main();
