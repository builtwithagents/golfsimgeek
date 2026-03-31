import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { cache, Suspense } from "react"
import type { FAQPage, ItemList, Thing } from "schema-dts"
import { H5 } from "~/components/common/heading"
import { Link } from "~/components/common/link"
import { StarRating } from "~/components/web/listings/star-rating"
import { SimTechBadges } from "~/components/web/listings/sim-tech-badges"
import { StructuredData } from "~/components/web/structured-data"
import { ToolListingSkeleton } from "~/components/web/tools/tool-listing"
import { ToolQuery } from "~/components/web/tools/tool-query"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { siteConfig } from "~/config/site"
import { STATE_NAMES } from "~/config/states"
import type { OpenGraphParams } from "~/lib/opengraph"
import { getPageData, getPageMetadata } from "~/lib/pages"
import { generateRegionFAQs, generateRegionIntro, getTopPicks } from "~/lib/seo-content"
import { findRegionBySlug, findToolsForRegion } from "~/server/web/states/queries"

type Props = PageProps<"/states/[slug]/[region]">

const getData = cache(async ({ params }: Props) => {
  const { slug, region: regionSlug } = await params
  const stateCode = slug.toUpperCase()
  const stateName = STATE_NAMES[stateCode]

  if (!stateName) notFound()

  const regionInfo = await findRegionBySlug(stateCode, regionSlug)
  if (!regionInfo) notFound()

  const tools = await findToolsForRegion(stateCode, regionSlug)

  const year = new Date().getFullYear()
  const topPicks = getTopPicks(tools)
  const intro = generateRegionIntro(regionInfo.region, stateName, tools)
  const faqs = generateRegionFAQs(regionInfo.region, stateName, tools)

  const url = `/states/${slug}/${regionSlug}`
  const title = `Golf Simulators in ${regionInfo.region}, ${stateName} (${year})`
  const description = `Browse ${regionInfo.count} golf simulator venues in the ${regionInfo.region} area.${topPicks[0]?.googleRating ? ` Top-rated: ${topPicks[0].name} (${Number(topPicks[0].googleRating).toFixed(1)} stars).` : ""} Find indoor golf near you on ${siteConfig.name}.`

  // Structured data
  const additionalSchemas: Thing[] = []

  const itemList: ItemList = {
    "@type": "ItemList",
    name: `Golf Simulators in ${regionInfo.region}, ${stateName}`,
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
      { url, title: regionInfo.region },
    ],
    structuredData: additionalSchemas,
  })

  return { regionInfo, tools, stateName, stateCode, topPicks, intro, faqs, ...data }
})

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  const { url, metadata } = await getData(props)
  const ogImage: OpenGraphParams = { title: metadata.title as string, description: metadata.description as string }
  return getPageMetadata({ url, metadata, ogImage })
}

export default async function RegionPage(props: Props) {
  const { regionInfo, tools, stateName, stateCode, metadata, breadcrumbs, structuredData, topPicks, intro, faqs } =
    await getData(props)

  return (
    <>
      <StructuredData data={structuredData} />
      <Breadcrumbs items={breadcrumbs} />

      <Intro>
        <IntroTitle>{metadata.title}</IntroTitle>
        <IntroDescription className="max-w-3xl">{metadata.description}</IntroDescription>
      </Intro>

      {/* Rich intro */}
      <div className="prose prose-neutral dark:prose-invert max-w-3xl">
        <p>{intro}</p>
      </div>

      {/* Top Picks */}
      {topPicks.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">
            Top-Rated in {regionInfo.region}
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

      {/* All venues — paginated */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">
          {regionInfo.region} Golf Simulators ({regionInfo.count})
        </h2>

        <Suspense fallback={<ToolListingSkeleton />}>
          <ToolQuery
            searchParams={props.searchParams}
            where={{ stateCode, regionSlug: regionInfo.regionSlug }}
          />
        </Suspense>
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
    </>
  )
}
