import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { cache } from "react"
import { ToolCard } from "~/components/web/tools/tool-card"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { Grid } from "~/components/web/ui/grid"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { siteConfig } from "~/config/site"
import { STATE_NAMES } from "~/config/states"
import { getPageData, getPageMetadata } from "~/lib/pages"
import { findCityBySlug, findToolsForCity } from "~/server/web/states/queries"

type Props = { params: Promise<{ slug: string; city: string }> }

const getData = cache(async ({ params }: Props) => {
  const { slug, city: citySlug } = await params
  const stateCode = slug.toUpperCase()
  const stateName = STATE_NAMES[stateCode]

  if (!stateName) notFound()

  const cityInfo = await findCityBySlug(stateCode, citySlug)
  if (!cityInfo) notFound()

  const tools = await findToolsForCity(stateCode, citySlug)

  const url = `/states/${slug}/city/${citySlug}`
  const title = `Golf Simulators in ${cityInfo.city}, ${stateName}`
  const description = `Find ${cityInfo.count} golf simulator venues, indoor golf lounges, and mobile rentals in ${cityInfo.city}, ${stateName}. Compare options and book your session on ${siteConfig.name}.`

  const data = getPageData(url, title, description, {
    breadcrumbs: [
      { url: "/states", title: "States" },
      { url: `/states/${slug}`, title: stateName },
      { url, title: cityInfo.city },
    ],
  })

  return { cityInfo, tools, stateName, stateCode, ...data }
})

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  const { url, metadata } = await getData(props)
  return getPageMetadata({ url, metadata })
}

export default async function CityPage(props: Props) {
  const { cityInfo, tools, stateName, metadata, breadcrumbs } = await getData(props)

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      <Intro>
        <IntroTitle>{metadata.title}</IntroTitle>
        <IntroDescription className="max-w-3xl">{metadata.description}</IntroDescription>
      </Intro>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">
          Golf Simulators in {cityInfo.city} ({cityInfo.count})
        </h2>
        <Grid>
          {tools.map((tool, order) => (
            <ToolCard key={tool.slug} tool={tool} style={{ order }} />
          ))}
        </Grid>
      </section>
    </>
  )
}
