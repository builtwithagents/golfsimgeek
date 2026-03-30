import { MapPinIcon } from "lucide-react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { cache } from "react"
import type { FAQPage, ItemList, Thing } from "schema-dts"
import { H5 } from "~/components/common/heading"
import { Link } from "~/components/common/link"
import { StarRating } from "~/components/web/listings/star-rating"
import { SimTechBadges } from "~/components/web/listings/sim-tech-badges"
import { StructuredData } from "~/components/web/structured-data"
import { ToolCard } from "~/components/web/tools/tool-card"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { Grid } from "~/components/web/ui/grid"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { siteConfig } from "~/config/site"
import { STATE_NAMES } from "~/config/states"
import { getPageData, getPageMetadata } from "~/lib/pages"
import { generateCityFAQs, generateCityIntro, getTopPicks } from "~/lib/seo-content"
import { findCityBySlug, findNearbyCities, findToolsForCity } from "~/server/web/states/queries"

type Props = { params: Promise<{ slug: string; city: string }> }

const getData = cache(async ({ params }: Props) => {
  const { slug, city: citySlug } = await params
  const stateCode = slug.toUpperCase()
  const stateName = STATE_NAMES[stateCode]

  if (!stateName) notFound()

  const cityInfo = await findCityBySlug(stateCode, citySlug)
  if (!cityInfo) notFound()

  const [tools, nearbyCities] = await Promise.all([
    findToolsForCity(stateCode, citySlug),
    findNearbyCities(stateCode, cityInfo.city),
  ])

  const year = new Date().getFullYear()
  const topPicks = getTopPicks(tools)
  const intro = generateCityIntro(cityInfo.city, stateName, tools)
  const faqs = generateCityFAQs(cityInfo.city, stateName, tools)

  const url = `/states/${slug}/city/${citySlug}`
  const title = `Golf Simulators in ${cityInfo.city}, ${stateName} - Top ${cityInfo.count} Venues (${year})`

  // Build data-rich meta description
  const topVenue = topPicks[0]
  const descParts = [`Find ${cityInfo.count} golf simulator venues in ${cityInfo.city}, ${stateName}.`]
  if (topVenue?.googleRating) {
    descParts.push(`Top-rated: ${topVenue.name} (${Number(topVenue.googleRating).toFixed(1)} stars).`)
  }
  descParts.push(`Compare pricing, reviews, and book your session.`)
  const description = descParts.join(" ")

  // Structured data: ItemList + FAQPage
  const additionalSchemas: Thing[] = []

  const itemList: ItemList = {
    "@type": "ItemList",
    name: `Golf Simulators in ${cityInfo.city}, ${stateName}`,
    numberOfItems: tools.length,
    itemListElement: tools.slice(0, 10).map((tool, i) => ({
      "@type": "ListItem" as const,
      position: i + 1,
      name: tool.name,
      url: `${siteConfig.url}/${tool.slug}`,
    })),
  }
  additionalSchemas.push(itemList)

  if (faqs.length > 0) {
    const faqSchema: FAQPage = {
      "@type": "FAQPage",
      mainEntity: faqs.map(faq => ({
        "@type": "Question" as const,
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer" as const,
          text: faq.answer,
        },
      })),
    }
    additionalSchemas.push(faqSchema)
  }

  const data = getPageData(url, title, description, {
    breadcrumbs: [
      { url: "/states", title: "States" },
      { url: `/states/${slug}`, title: stateName },
      { url, title: cityInfo.city },
    ],
    structuredData: additionalSchemas,
  })

  return { cityInfo, tools, stateName, stateCode, topPicks, intro, faqs, nearbyCities, slug, ...data }
})

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  const { url, metadata } = await getData(props)
  return getPageMetadata({ url, metadata })
}

export default async function CityPage(props: Props) {
  const { cityInfo, tools, stateName, metadata, breadcrumbs, structuredData, topPicks, intro, faqs, nearbyCities, slug } =
    await getData(props)

  return (
    <>
      <StructuredData data={structuredData} />
      <Breadcrumbs items={breadcrumbs} />

      <Intro>
        <IntroTitle>{metadata.title}</IntroTitle>
        <IntroDescription className="max-w-3xl">{metadata.description}</IntroDescription>
      </Intro>

      {/* Rich intro paragraph */}
      <div className="prose prose-neutral dark:prose-invert max-w-3xl">
        <p>{intro}</p>
      </div>

      {/* Top Picks */}
      {topPicks.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">
            Top-Rated in {cityInfo.city}
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topPicks.map(tool => (
              <Link
                key={tool.slug}
                href={`/${tool.slug}`}
                className="flex flex-col gap-3 rounded-lg border bg-card p-4 transition-colors hover:bg-accent"
              >
                <H5 as="h3" className="truncate">{tool.name}</H5>

                {tool.googleRating && (
                  <StarRating
                    rating={Number(tool.googleRating)}
                    reviewCount={tool.reviewCount}
                  />
                )}

                {tool.priceRange && (
                  <p className="text-sm text-muted-foreground">{tool.priceRange}</p>
                )}

                <SimTechBadges content={tool.content} />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* All venues */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">
          All Golf Simulators in {cityInfo.city} ({cityInfo.count})
        </h2>
        <Grid>
          {tools.map((tool, order) => (
            <ToolCard key={tool.slug} tool={tool} style={{ order }} />
          ))}
        </Grid>
      </section>

      {/* FAQ Section */}
      {faqs.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Frequently Asked Questions</h2>
          <div className="flex flex-col gap-6">
            {faqs.map(faq => (
              <div key={faq.question}>
                <h3 className="font-medium">{faq.question}</h3>
                <p className="mt-1 text-secondary-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Nearby Cities */}
      {nearbyCities.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">
            Golf Simulators in Nearby {stateName} Cities
          </h2>
          <div className="flex flex-wrap gap-2">
            {nearbyCities.map(c => (
              <Link
                key={c.citySlug}
                href={`/states/${slug}/city/${c.citySlug}`}
                className="inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm transition-colors hover:bg-accent"
              >
                <MapPinIcon className="size-3.5 text-muted-foreground" />
                {c.city} ({c.count})
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
