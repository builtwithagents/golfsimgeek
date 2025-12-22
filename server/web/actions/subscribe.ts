"use server"

import { getTranslations } from "next-intl/server"
import { isRateLimited } from "~/lib/rate-limiter"
import { actionClient } from "~/lib/safe-actions"
import { createNewsletterSchema } from "~/server/web/shared/schema"
import { createResendContact } from "~/services/resend"

/**
 * Subscribe to the newsletter
 * @param input - The newsletter data to subscribe to
 * @returns The newsletter that was subscribed to
 */
export const subscribeToNewsletter = actionClient
  .inputSchema(async () => {
    const t = await getTranslations("schema")
    return createNewsletterSchema(t)
  })
  .action(async ({ parsedInput: { email } }) => {
    // Rate limiting check
    if (await isRateLimited("newsletter")) {
      throw new Error("Too many attempts. Please try again later.")
    }

    // Create a resend contact
    await createResendContact({ email })

    return "You've been subscribed to the newsletter."
  })
