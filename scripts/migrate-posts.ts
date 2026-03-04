/**
 * Migration script: MDX blog posts → Database
 *
 * Reads markdown files from `content/posts/` directory, parses frontmatter,
 * and inserts them into the database as Post records.
 *
 * Usage:
 *   SKIP_ENV_VALIDATION=1 bun run scripts/migrate-posts.ts
 *
 * Requirements:
 *   - `content/posts/` directory with .md/.mdx files
 *   - A user in the database to assign as author (defaults to first admin)
 *   - DATABASE_URL environment variable set
 */

import { readdir, readFile } from "node:fs/promises"
import { basename, extname, join } from "node:path"
import { PostStatus } from "~/.generated/prisma/client"
import { db } from "~/services/db"

const POSTS_DIR = join(import.meta.dirname, "../content/posts")

type Frontmatter = {
  title: string
  description?: string
  image?: string
  publishedAt?: string
  updatedAt?: string
  author?: {
    name: string
    image?: string
    url?: string
  }
}

/**
 * Parse YAML-like frontmatter from markdown content.
 * Handles simple key-value pairs and nested objects (author).
 */
function parseFrontmatter(content: string): { data: Frontmatter; content: string } {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)

  if (!match) {
    throw new Error("No frontmatter found")
  }

  const frontmatterStr = match[1]
  const body = content.slice(match[0].length).trim()
  const data: Record<string, unknown> = {}

  let currentObject: Record<string, string> | null = null
  let currentKey: string | null = null

  for (const line of frontmatterStr.split("\n")) {
    // Nested property (starts with spaces)
    if (currentKey && /^\s{2,}\w/.test(line)) {
      const nestedMatch = line.match(/^\s+(\w+):\s*"?(.+?)"?\s*$/)

      if (nestedMatch) {
        if (!currentObject) currentObject = {}
        currentObject[nestedMatch[1]] = nestedMatch[2].replace(/^["']|["']$/g, "")
      }

      continue
    }

    // Save any accumulated nested object
    if (currentKey && currentObject) {
      data[currentKey] = currentObject
      currentObject = null
      currentKey = null
    }

    // Top-level key-value
    const kvMatch = line.match(/^(\w+):\s*(.*)$/)

    if (kvMatch) {
      const [, key, rawValue] = kvMatch
      const value = rawValue.replace(/^["']|["']$/g, "").trim()

      if (!value) {
        // Start of a nested object
        currentKey = key
        currentObject = {}
      } else {
        data[key] = value
      }
    }
  }

  // Save last nested object
  if (currentKey && currentObject) {
    data[currentKey] = currentObject
  }

  return { data: data as Frontmatter, content: body }
}

/**
 * Strip markdown formatting to produce plain text for search and read time.
 */
function stripMarkdown(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, "") // code blocks
    .replace(/`([^`]+)`/g, "$1") // inline code
    .replace(/(\*\*|__)(.*?)\1/g, "$2") // bold
    .replace(/(\*|_)(.*?)\1/g, "$2") // italic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // links
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1") // images
    .replace(/~~(.*?)~~/g, "$1") // strikethrough
    .replace(/<[^>]+>/g, "") // HTML/JSX tags
    .replace(/^#{1,6}\s+/gm, "") // heading markers
    .replace(/^[-*+]\s+/gm, "") // list markers
    .replace(/^\d+\.\s+/gm, "") // ordered list markers
    .replace(/^>\s+/gm, "") // blockquotes
    .replace(/^---$/gm, "") // horizontal rules
    .replace(/\n{3,}/g, "\n\n") // excess newlines
    .trim()
}

async function main() {
  console.log("Starting blog post migration...")

  // Find the admin user to assign as author
  const admin = await db.user.findFirst({
    where: { role: "admin" },
    select: { id: true, email: true },
  })

  if (!admin) {
    console.error("No admin user found. Please create an admin user first.")
    process.exit(1)
  }

  console.log(`Using author: ${admin.email}`)

  // Read all markdown files
  let files: string[]

  try {
    const entries = await readdir(POSTS_DIR)
    files = entries.filter(f => [".md", ".mdx"].includes(extname(f)))
  } catch {
    console.error(`No posts directory found at: ${POSTS_DIR}`)
    console.error("Make sure content/posts/ exists with your markdown files.")
    process.exit(1)
  }

  if (files.length === 0) {
    console.log("No markdown files found in content/posts/")
    process.exit(0)
  }

  console.log(`Found ${files.length} post(s) to migrate\n`)

  let migrated = 0
  let skipped = 0

  for (const file of files) {
    const slug = basename(file, extname(file))
    const filePath = join(POSTS_DIR, file)

    // Check if post already exists
    const existing = await db.post.findUnique({
      where: { slug },
      select: { id: true },
    })

    if (existing) {
      console.log(`  Skipped: "${slug}" (already exists)`)
      skipped++
      continue
    }

    const raw = await readFile(filePath, "utf-8")
    const { data, content } = parseFrontmatter(raw)

    if (!data.title) {
      console.log(`  Skipped: "${file}" (missing title)`)
      skipped++
      continue
    }

    const plainText = stripMarkdown(content)

    await db.post.create({
      data: {
        title: data.title,
        slug,
        description: data.description,
        content,
        plainText,
        imageUrl: data.image,
        status: PostStatus.Published,
        publishedAt: data.publishedAt ? new Date(data.publishedAt) : new Date(),
        authorId: admin.id,
      },
    })

    console.log(`  Migrated: "${data.title}"`)
    migrated++
  }

  console.log(`\nMigration complete: ${migrated} migrated, ${skipped} skipped`)
}

main()
  .catch(e => {
    console.error("Migration failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
