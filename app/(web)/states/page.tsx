import { MapPinIcon } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { siteConfig } from "~/config/site"
import { getPageData, getPageMetadata } from "~/lib/pages"
import { findStatesWithCounts } from "~/server/web/states/queries"

const title = "Golf Simulators by State"
const description = `Browse golf simulator venues, mobile rentals, and training studios across every US state. Find the best indoor golf experience near you on ${siteConfig.name}.`

const { url, metadata, breadcrumbs, structuredData } = getPageData(
  "/states",
  title,
  description,
  { breadcrumbs: [{ url: "/states", title: "States" }] },
)

export const generateMetadata = (): Metadata => {
  return getPageMetadata({ url, metadata })
}

export default async function StatesIndexPage() {
  const states = await findStatesWithCounts()

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      <Intro>
        <IntroTitle>{title}</IntroTitle>
        <IntroDescription className="max-w-3xl">{description}</IntroDescription>
      </Intro>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {states.map(state => (
          <Link
            key={state.stateCode}
            href={`/states/${state.slug}`}
            className="flex items-center gap-3 rounded-lg border border-foreground/10 p-4 transition-colors hover:border-primary/50 hover:bg-primary/5"
          >
            <MapPinIcon className="size-5 shrink-0 text-primary" />
            <div className="min-w-0">
              <div className="font-medium truncate">{state.stateName}</div>
              <div className="text-sm text-secondary-foreground">
                {state.count} {state.count === 1 ? "listing" : "listings"}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
