import { CpuIcon } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { siteConfig } from "~/config/site"
import { getPageData, getPageMetadata } from "~/lib/pages"
import { findTechsWithCounts } from "~/server/web/simulators/queries"

const title = "Golf Simulators by Technology"
const description = `Compare golf simulator technologies and find venues near you that use Trackman, Full Swing, Foresight, Golfzon, and more. Browse ${siteConfig.name}'s directory by simulator brand.`

const { url, metadata, breadcrumbs } = getPageData(
  "/simulators",
  title,
  description,
  { breadcrumbs: [{ url: "/simulators", title: "Simulators" }] },
)

export const generateMetadata = (): Metadata => {
  return getPageMetadata({ url, metadata })
}

export default async function SimulatorsIndexPage() {
  const techs = await findTechsWithCounts()

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      <Intro>
        <IntroTitle>{title}</IntroTitle>
        <IntroDescription className="max-w-3xl">{description}</IntroDescription>
      </Intro>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {techs.map(tech => (
          <Link
            key={tech.slug}
            href={`/simulators/${tech.slug}`}
            className="flex flex-col gap-3 rounded-lg border border-foreground/10 p-5 transition-colors hover:border-primary/50 hover:bg-primary/5"
          >
            <div className="flex items-center gap-3">
              <CpuIcon className="size-6 shrink-0 text-primary" />
              <div className="font-semibold text-lg">{tech.shortName}</div>
            </div>
            <div className="text-sm text-secondary-foreground">
              {tech.count} {tech.count === 1 ? "venue" : "venues"} nationwide
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
