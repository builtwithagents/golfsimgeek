"use server"

import { checkUrlAvailability } from "~/lib/http"
import { adminActionClient } from "~/lib/safe-actions"
import { adSchema } from "~/server/admin/ads/schema"
import { idSchema, idsSchema } from "~/server/admin/shared/schema"

export const upsertAd = adminActionClient
  .inputSchema(adSchema)
  .action(async ({ parsedInput: { id, ...input }, ctx: { db, revalidate } }) => {
    const isUrlAvailable = await checkUrlAvailability(input.websiteUrl)

    if (!isUrlAvailable) {
      throw new Error("Website URL is not accessible. Please check the URL and try again.")
    }

    const ad = id
      ? await db.ad.update({
          where: { id },
          data: input,
        })
      : await db.ad.create({
          data: input,
        })

    revalidate({
      paths: ["/admin/ads"],
      tags: ["ads"],
    })

    return ad
  })

export const duplicateAd = adminActionClient
  .inputSchema(idSchema)
  .action(async ({ parsedInput: { id }, ctx: { db, revalidate } }) => {
    const ad = await db.ad.findUnique({
      where: { id },
    })

    if (!ad) {
      throw new Error("Ad not found")
    }

    const newAd = await db.ad.create({
      data: {
        name: `${ad.name} (Copy)`,
        email: ad.email,
        description: ad.description,
        websiteUrl: ad.websiteUrl,
        faviconUrl: ad.faviconUrl,
        bannerUrl: ad.bannerUrl,
        buttonLabel: ad.buttonLabel,
        type: ad.type,
        startsAt: ad.startsAt,
        endsAt: ad.endsAt,
      },
    })

    revalidate({
      paths: ["/admin/ads"],
      tags: ["ads"],
    })

    return newAd
  })

export const deleteAds = adminActionClient
  .inputSchema(idsSchema)
  .action(async ({ parsedInput: { ids }, ctx: { db, revalidate } }) => {
    await db.ad.deleteMany({
      where: { id: { in: ids } },
    })

    revalidate({
      paths: ["/admin/ads"],
      tags: ["ads"],
    })

    return true
  })
