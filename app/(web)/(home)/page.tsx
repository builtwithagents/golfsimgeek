import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { cache, Suspense } from "react"
import { Hero } from "~/app/(web)/(home)/hero"
import { StructuredData } from "~/components/web/structured-data"
import { ToolListingSkeleton } from "~/components/web/tools/tool-listing"
import { ToolQuery } from "~/components/web/tools/tool-query"
import { siteConfig } from "~/config/site"
import { getPageData } from "~/lib/pages"
import { findStatesWithCounts } from "~/server/web/states/queries"

// Get page data
const getData = cache(async () => {
  const t = await getTranslations()
  const title = `${siteConfig.name} - ${t("brand.tagline")}`
  const description = t("brand.description")

  return getPageData(siteConfig.url, title, description)
})

export default async function (props: PageProps<"/">) {
  const { structuredData } = await getData()
  const states = await findStatesWithCounts()

  return (
    <>
      <Hero />

      {/* Browse by State */}
      {states.length > 0 && (
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Browse by State
            </h2>
            <Link href="/states" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              View all →
            </Link>
          </div>

          <div className="flex flex-wrap gap-2">
            {states.slice(0, 24).map(s => (
              <Link
                key={s.slug}
                href={`/states/${s.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors hover:border-primary/50 hover:bg-primary/5"
              >
                {s.stateName}
                <span className="text-xs text-muted-foreground">{s.count}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Suspense fallback={<ToolListingSkeleton />}>
        <ToolQuery
          searchParams={props.searchParams}
          overrideParams={{ sort: "googleRating.desc" }}
          where={{ googleRating: { not: null } }}
          options={{ enableFilters: true }}
          ad="Tools"
          name="Top-Rated Golf Simulator Venues"
        />
      </Suspense>

      <StructuredData data={structuredData} />
    </>
  )
}
