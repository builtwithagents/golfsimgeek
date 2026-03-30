import { TruckIcon } from "lucide-react"
import type { Metadata } from "next"
import { ToolCard } from "~/components/web/tools/tool-card"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { Grid } from "~/components/web/ui/grid"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { siteConfig } from "~/config/site"
import { getPageData, getPageMetadata } from "~/lib/pages"
import { findMobileTools } from "~/server/web/tools/queries"

const title = "Mobile Golf Simulator Rentals"
const description = `Browse mobile golf simulator services that bring the experience directly to you. Perfect for events, corporate outings, parties, and more. Find a verified mobile rental near you on ${siteConfig.name}.`

const { url, metadata, breadcrumbs } = getPageData("/mobile", title, description, {
  breadcrumbs: [
    { url: "/locations", title: "Locations" },
    { url: "/mobile", title: "Mobile Simulators" },
  ],
})

export const generateMetadata = (): Metadata => {
  return getPageMetadata({ url, metadata })
}

export default async function MobileSimulatorsPage() {
  const tools = await findMobileTools()

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      <Intro>
        <IntroTitle className="flex items-center gap-3">
          <TruckIcon className="size-8 shrink-0 text-primary" />
          {title}
        </IntroTitle>
        <IntroDescription className="max-w-3xl">{description}</IntroDescription>
      </Intro>

      {tools.length > 0 ? (
        <Grid>
          {tools.map((tool, order) => (
            <ToolCard key={tool.slug} tool={tool} style={{ order }} />
          ))}
        </Grid>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-foreground/20 py-16 text-center text-secondary-foreground">
          <TruckIcon className="size-10 opacity-30" />
          <p className="text-lg font-medium">No mobile simulators listed yet</p>
          <p className="text-sm">Check back soon — we're adding new mobile rental services regularly.</p>
        </div>
      )}
    </>
  )
}
