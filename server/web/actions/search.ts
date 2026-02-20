"use server"

import { z } from "zod"
import { ToolStatus, ToolTier } from "~/.generated/prisma/client"
import { getServerSession } from "~/lib/auth"
import { actionClient } from "~/lib/safe-actions"
import { findCategories } from "~/server/web/categories/queries"
import { findTags } from "~/server/web/tags/queries"
import { findTools } from "~/server/web/tools/queries"

export const searchItems = actionClient
  .inputSchema(z.object({ query: z.string() }))
  .action(async ({ parsedInput: { query } }) => {
    const session = await getServerSession()

    const [tools, categories, tags] = await Promise.all([
      findTools({
        where: {
          status: session?.user.role === "admin" ? undefined : ToolStatus.Published,
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { tagline: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        },
        take: 10,
      }),

      findCategories({
        where: { name: { contains: query, mode: "insensitive" } },
        take: 10,
      }),

      findTags({
        where: { name: { contains: query, mode: "insensitive" } },
        take: 10,
      }),
    ])

    return { tools, categories, tags }
  })

export const findFeaturedTools = actionClient.action(async () => {
  return findTools({ where: { tier: ToolTier.Premium } })
})
