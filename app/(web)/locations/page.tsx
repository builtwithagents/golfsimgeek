import { MapPinIcon, TruckIcon } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { siteConfig } from "~/config/site"
import { getPageData, getPageMetadata } from "~/lib/pages"

const title = "Find a Golf Simulator"
const description = `Browse fixed golf simulator venues by state or find a mobile simulator rental that comes to you. Discover the best indoor golf experiences on ${siteConfig.name}.`

const { url, metadata, breadcrumbs } = getPageData("/locations", title, description, {
  breadcrumbs: [{ url: "/locations", title: "Locations" }],
})

export const generateMetadata = (): Metadata => {
  return getPageMetadata({ url, metadata })
}

const categories = [
  {
    href: "/states",
    icon: MapPinIcon,
    title: "Simulator Locations",
    description:
      "Browse the full directory of fixed golf simulator venues across every US state. Find a venue near you with our map-ready state-by-state guide.",
    cta: "Browse by State",
  },
  {
    href: "/mobile",
    icon: TruckIcon,
    title: "Mobile Simulators",
    description:
      "Find mobile golf simulator rentals that bring the experience to you. Perfect for events, parties, corporate outings, and backyard fun.",
    cta: "View Mobile Rentals",
  },
]

export default function LocationsPage() {
  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      <Intro>
        <IntroTitle>{title}</IntroTitle>
        <IntroDescription className="max-w-2xl">{description}</IntroDescription>
      </Intro>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {categories.map(({ href, icon: Icon, title: cardTitle, description: cardDesc, cta }) => (
          <Link
            key={href}
            href={href}
            className="group flex flex-col gap-5 rounded-xl border border-foreground/10 p-8 transition-colors hover:border-primary/50 hover:bg-primary/5"
          >
            <div className="flex items-center gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                <Icon className="size-6" />
              </div>
              <h2 className="text-xl font-semibold">{cardTitle}</h2>
            </div>

            <p className="text-secondary-foreground leading-relaxed">{cardDesc}</p>

            <span className="mt-auto text-sm font-medium text-primary transition-colors group-hover:underline">
              {cta} →
            </span>
          </Link>
        ))}
      </div>
    </>
  )
}
