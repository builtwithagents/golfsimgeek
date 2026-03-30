import { MapPinIcon } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { cache } from "react"
import { ToolCard } from "~/components/web/tools/tool-card"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { Grid } from "~/components/web/ui/grid"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { siteConfig } from "~/config/site"
import { STATE_SEO_CONTENT } from "~/config/state-seo"
import { STATE_NAMES } from "~/config/states"
import { getPageData, getPageMetadata } from "~/lib/pages"
import {
  findCitiesForState,
  findRegionsForState,
  findStateByCode,
  findToolsForState,
} from "~/server/web/states/queries"

type Props = { params: Promise<{ slug: string }> }

const getData = cache(async ({ params }: Props) => {
  const { slug } = await params
  const stateCode = slug.toUpperCase()
  const stateName = STATE_NAMES[stateCode]

  if (!stateName) notFound()

  const state = await findStateByCode(stateCode)
  if (!state) notFound()

  const [regions, tools, cities] = await Promise.all([
    findRegionsForState(stateCode),
    findToolsForState(stateCode),
    findCitiesForState(stateCode),
  ])

  const seo = STATE_SEO_CONTENT[stateCode]
  const url = `/states/${slug}`
  const title = seo?.heading ?? `Golf Simulators in ${stateName}`
  const description =
    seo?.description ??
    `Explore ${state.count} golf simulator venues, mobile rentals, and training studios in ${stateName}. Find the best indoor golf experience near you on ${siteConfig.name}.`

  const data = getPageData(url, title, description, {
    breadcrumbs: [
      { url: "/states", title: "States" },
      { url, title: stateName },
    ],
  })

  return { state, regions, tools, cities, seo, ...data }
})

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  const { url, metadata } = await getData(props)
  return getPageMetadata({ url, metadata })
}

export default async function StatePage(props: Props) {
  const { state, regions, tools, cities, metadata, breadcrumbs } = await getData(props)

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      <Intro>
        <IntroTitle>{metadata.title}</IntroTitle>
        <IntroDescription className="max-w-3xl">{metadata.description}</IntroDescription>
      </Intro>

      {/* Region tiles */}
      {regions.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Regions in {state.stateName}</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {regions.map(r => (
              <Link
                key={r.regionSlug}
                href={`/states/${state.stateCode.toLowerCase()}/${r.regionSlug}`}
                className="flex items-center gap-3 rounded-lg border border-foreground/10 p-3 transition-colors hover:border-primary/50 hover:bg-primary/5"
              >
                <MapPinIcon className="size-4 shrink-0 text-primary" />
                <div className="min-w-0">
                  <div className="font-medium truncate text-sm">{r.region}</div>
                  <div className="text-xs text-secondary-foreground">
                    {r.count} {r.count === 1 ? "listing" : "listings"}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* City pages */}
      {cities.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Cities in {state.stateName}</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {cities.map(c => (
              <Link
                key={c.citySlug}
                href={`/states/${state.stateCode.toLowerCase()}/city/${c.citySlug}`}
                className="flex items-center gap-3 rounded-lg border border-foreground/10 p-3 transition-colors hover:border-primary/50 hover:bg-primary/5"
              >
                <MapPinIcon className="size-4 shrink-0 text-primary" />
                <div className="min-w-0">
                  <div className="font-medium truncate text-sm">{c.city}</div>
                  <div className="text-xs text-secondary-foreground">
                    {c.count} {c.count === 1 ? "listing" : "listings"}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* All listings */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">
          All Golf Simulators in {state.stateName} ({state.count})
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
