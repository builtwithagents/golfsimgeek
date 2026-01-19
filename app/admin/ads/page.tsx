import { Suspense } from "react"
import { AdTable } from "~/app/admin/ads/_components/ad-table"
import { DataTableSkeleton } from "~/components/data-table/data-table-skeleton"
import { findAds } from "~/server/admin/ads/queries"
import { adTableParamsCache } from "~/server/admin/ads/schema"

export default async function ({ searchParams }: PageProps<"/admin/ads">) {
  const search = adTableParamsCache.parse(await searchParams)
  const adsPromise = findAds(search)

  return (
    <Suspense fallback={<DataTableSkeleton title="Ads" />}>
      <AdTable adsPromise={adsPromise} />
    </Suspense>
  )
}
