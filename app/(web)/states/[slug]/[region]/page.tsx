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
import { findRegionBySlug, findToolsForState } from "~/server/web/states/queries"

type Props = { params: Promise<{ slug: string; region: string }> }

const getData = cache(async ({ params }: Props) => {
  const { slug, region: regionSlug } = await params
  const stateCode = slug.toUpperCase()
  const stateName = STATE_NAMES[stateCode]

  if (!stateName) notFound()

  const regionInfo = await findRegionBySlug(stateCode, regionSlug)
  if (!regionInfo) notFound()

  const tools = await findToolsForState(stateCode, regionSlug)

  const url = `/states/${slug}/${regionSlug}`
  const title = `Golf Simulators in ${regionInfo.region}, ${stateName}`
  const description = `Browse ${regionInfo.count} golf simulator venues and mobile rentals in the ${regionInfo.region} area. Find indoor golf near you on ${siteConfig.name}.`

  const data = getPageData(url, title, description, {
    breadcrumbs: [
      { url: "/states", title: "States" },
      { url: `/states/${slug}`, title: stateName },
      { url, title: regionInfo.region },
    ],
  })

  return { regionInfo, tools, stateName, stateCode, ...data }
})

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  const { url, metadata } = await getData(props)
  return getPageMetadata({ url, metadata })
}

export default async function RegionPage(props: Props) {
  const { regionInfo, tools, stateName, metadata, breadcrumbs } = await getData(props)

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      <Intro>
        <IntroTitle>{metadata.title}</IntroTitle>
        <IntroDescription className="max-w-3xl">{metadata.description}</IntroDescription>
      </Intro>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">
          {regionInfo.region} Golf Simulators ({regionInfo.count})
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
