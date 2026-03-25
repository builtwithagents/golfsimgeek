import { getDomain } from "@primoui/utils"
import { env } from "~/env"

export const siteConfig = {
  name: "GolfSimGeek",
  slug: "golfsimgeek",
  email: env.NEXT_PUBLIC_SITE_EMAIL,
  url: env.NEXT_PUBLIC_SITE_URL,
  domain: getDomain(env.NEXT_PUBLIC_SITE_URL),
  currency: "usd",
}
