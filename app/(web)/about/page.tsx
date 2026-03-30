import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { cache } from "react"
import { Link } from "~/components/common/link"
import { Prose } from "~/components/common/prose"
import { ExternalLink } from "~/components/web/external-link"
import { StructuredData } from "~/components/web/structured-data"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { linksConfig } from "~/config/links"
import { siteConfig } from "~/config/site"
import { getPageData, getPageMetadata } from "~/lib/pages"
import { generateAboutPage } from "~/lib/structured-data"

// I18n page namespace
const namespace = "pages.about"

// Get page data
const getData = cache(async () => {
  const t = await getTranslations()
  const url = "/about"
  const title = t(`${namespace}.title`)
  const description = t(`${namespace}.description`, { siteName: siteConfig.name })

  return getPageData(url, title, description, {
    breadcrumbs: [{ url, title }],
    structuredData: [generateAboutPage(url, title, description)],
  })
})

export const generateMetadata = async (): Promise<Metadata> => {
  const { url, metadata } = await getData()
  return getPageMetadata({ url, metadata })
}

export default async function () {
  const { metadata, structuredData } = await getData()

  return (
    <>
      <Intro>
        <IntroTitle>{metadata.title}</IntroTitle>
        <IntroDescription>{metadata.description}</IntroDescription>
      </Intro>

      <Prose>
        <h2>What is {siteConfig.name}?</h2>

        <p>
          <Link href="/">{siteConfig.name}</Link> is the most comprehensive directory of{" "}
          <strong>golf simulator venues, mobile rentals, and training studios</strong> in the United
          States. Whether you are looking for a place to play a virtual round, rent a mobile
          simulator for your next corporate event, or find a studio with tour-level technology for
          serious practice, GolfSimGeek helps you find it.
        </p>

        <p>
          We also publish expert reviews, setup guides, cost breakdowns, and comparisons of the most
          popular golf simulator brands including TrackMan, Foresight Sports, SkyTrak, Full Swing,
          and more.
        </p>

        <h2>Our Mission</h2>

        <p>
          Indoor golf is booming, but finding the right simulator experience near you can be
          surprisingly difficult. GolfSimGeek was built to solve that problem — giving golfers a
          single place to discover, compare, and connect with golf simulator businesses across every
          US state.
        </p>

        <p>
          For business owners, we offer free listings with the option to upgrade for premium
          placement and verified badges. If you operate a golf simulator business,{" "}
          <Link href="/submit">submit your listing</Link> today.
        </p>
      </Prose>

      <StructuredData data={structuredData} />
    </>
  )
}
