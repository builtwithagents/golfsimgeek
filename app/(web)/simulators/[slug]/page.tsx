import { CpuIcon, MapPinIcon } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { cache } from "react"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { findTechBySlug, simulatorTechs } from "~/config/simulator-tech"
import { siteConfig } from "~/config/site"
import { STATE_NAMES } from "~/config/states"
import { getPageData, getPageMetadata } from "~/lib/pages"
import { findToolsByTech } from "~/server/web/simulators/queries"

type Props = { params: Promise<{ slug: string }> }

const getData = cache(async ({ params }: Props) => {
  const { slug } = await params
  const tech = findTechBySlug(slug)

  if (!tech) {
    notFound()
  }

  const tools = await findToolsByTech(slug)

  const title = `${tech.name} Simulators Near You`
  const description = `Find ${tech.name} golf simulator venues across the US. Browse ${tools.length} locations with ${tech.shortName} technology on ${siteConfig.name}.`
  const url = `/simulators/${slug}`

  const data = getPageData(url, title, description, {
    breadcrumbs: [
      { url: "/simulators", title: "Simulators" },
      { url, title: tech.shortName },
    ],
  })

  return { tech, tools, title, description, ...data }
})

export const generateStaticParams = async () => {
  return simulatorTechs.map(t => ({ slug: t.slug }))
}

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  const { url, metadata } = await getData(props)
  return getPageMetadata({ url, metadata })
}

export default async function SimulatorTechPage(props: Props) {
  const { tech, tools, title, breadcrumbs } = await getData(props)

  // Group tools by state for the cross-link section
  const stateGroups = tools.reduce<Record<string, number>>((acc, tool) => {
    if (tool.stateCode) {
      acc[tool.stateCode] = (acc[tool.stateCode] || 0) + 1
    }
    return acc
  }, {})
  const stateLinks = Object.entries(stateGroups)
    .sort((a, b) => b[1] - a[1])
    .map(([code, count]) => ({ code, name: STATE_NAMES[code] ?? code, slug: code.toLowerCase(), count }))

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      <Intro>
        <IntroTitle>
          <CpuIcon className="inline size-8 mr-2 text-primary" />
          {title}
        </IntroTitle>
        <IntroDescription className="max-w-3xl">{tech.description}</IntroDescription>
      </Intro>

      <p className="text-sm text-secondary-foreground mb-6">
        {tools.length} {tools.length === 1 ? "venue" : "venues"} with {tech.shortName}
      </p>

      {/* Browse by state */}
      {stateLinks.length > 1 && (
        <section className="flex flex-col gap-3 mb-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Find {tech.shortName} by State
          </h2>
          <div className="flex flex-wrap gap-2">
            {stateLinks.map(s => (
              <Link
                key={s.slug}
                href={`/states/${s.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors hover:border-primary/50 hover:bg-primary/5"
              >
                <MapPinIcon className="size-3 shrink-0" aria-hidden="true" />
                {s.name}
                <span className="text-xs text-muted-foreground">{s.count}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map(tool => (
          <Link
            key={tool.slug}
            href={`/${tool.slug}`}
            className="flex flex-col gap-2 rounded-lg border border-foreground/10 p-5 transition-colors hover:border-primary/50 hover:bg-primary/5"
          >
            <div className="font-semibold">{tool.name}</div>
            <div className="text-sm text-secondary-foreground">{tool.tagline}</div>
            {tool.city && tool.stateCode && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPinIcon className="size-3 shrink-0" aria-hidden="true" />
                {tool.city}, {tool.stateCode}
              </div>
            )}
            <div className="flex flex-wrap gap-1.5 mt-1">
              {tool.categories?.map(cat => (
                <span
                  key={cat.slug}
                  className="inline-flex items-center rounded-md bg-foreground/5 px-2 py-0.5 text-xs text-secondary-foreground"
                >
                  {cat.name}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
