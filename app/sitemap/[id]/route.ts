import { NextResponse } from "next/server"
import { siteConfig } from "~/config/site"
import { findCategorySlugs } from "~/server/web/categories/queries"
import { findPostSlugs } from "~/server/web/posts/queries"
import { findStatesWithCounts, findCitiesForState, findRegionsForState } from "~/server/web/states/queries"
import { findTagSlugs } from "~/server/web/tags/queries"
import { findToolSlugs } from "~/server/web/tools/queries"

export const sitemaps = ["pages", "tools", "categories", "tags", "posts", "states", "simulators"] as const

type SitemapEntry = {
  url: string
  lastModified?: Date
  changeFrequency?: "daily" | "weekly" | "monthly"
  priority?: number
}

const buildSitemapXML = (entries: SitemapEntry[]) => {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>'
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'

  for (const entry of entries) {
    xml += "<url>"
    xml += `<loc>${entry.url}</loc>`
    if (entry.lastModified) {
      xml += `<lastmod>${entry.lastModified.toISOString().split("T")[0]}</lastmod>`
    }
    if (entry.changeFrequency) {
      xml += `<changefreq>${entry.changeFrequency}</changefreq>`
    }
    if (entry.priority) {
      xml += `<priority>${entry.priority}</priority>`
    }
    xml += "</url>"
  }

  xml += "</urlset>"
  return xml
}

export async function generateStaticParams() {
  return sitemaps.map(id => ({ id }))
}

export async function GET(_: Request, { params }: RouteContext<"/sitemap/[id]">) {
  const { id } = await params
  const siteUrl = siteConfig.url

  let entries: SitemapEntry[] = []

  switch (id) {
    case "pages": {
      const pages = [
        `${siteUrl}/`,
        `${siteUrl}/about`,
        `${siteUrl}/categories`,
        `${siteUrl}/tags`,
        `${siteUrl}/blog`,
        `${siteUrl}/advertise`,
        `${siteUrl}/submit`,
        `${siteUrl}/states`,
        `${siteUrl}/simulators`,
      ]

      entries = pages.map(url => ({
        url,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.8,
      }))
      break
    }

    case "tools": {
      const tools = await findToolSlugs({})

      entries = tools.map(tool => ({
        url: `${siteUrl}/${tool.slug}`,
        lastModified: tool.updatedAt,
        changeFrequency: "daily",
        priority: 0.8,
      }))
      break
    }

    case "categories": {
      const categories = await findCategorySlugs({})

      entries = categories.map(category => ({
        url: `${siteUrl}/categories/${category.slug}`,
        lastModified: category.updatedAt,
        changeFrequency: "weekly",
        priority: 0.7,
      }))
      break
    }

    case "tags": {
      const tags = await findTagSlugs({})

      entries = tags.map(tag => ({
        url: `${siteUrl}/tags/${tag.slug}`,
        lastModified: tag.updatedAt,
        changeFrequency: "weekly",
        priority: 0.6,
      }))
      break
    }

    case "posts": {
      const posts = await findPostSlugs({})

      entries = posts.map(post => ({
        url: `${siteUrl}/blog/${post.slug}`,
        lastModified: post.updatedAt,
        changeFrequency: "monthly",
        priority: 0.7,
      }))
      break
    }

    case "simulators": {
      const techSlugs = ["trackman", "full-swing", "gcquad", "foresight", "golfzon", "uneekor", "flightscope", "skytrak", "toptracer", "aboutgolf"]
      entries = [
        { url: `${siteUrl}/simulators`, changeFrequency: "weekly", priority: 0.8 },
        ...techSlugs.map(slug => ({ url: `${siteUrl}/simulators/${slug}`, changeFrequency: "weekly" as const, priority: 0.7 })),
      ]
      break
    }

    case "states": {
      const states = await findStatesWithCounts()

      // State pages
      for (const state of states) {
        entries.push({
          url: `${siteUrl}/states/${state.slug}`,
          changeFrequency: "weekly",
          priority: 0.6,
        })

        // City pages for each state
        const cities = await findCitiesForState(state.stateCode)
        for (const city of cities) {
          entries.push({
            url: `${siteUrl}/states/${state.slug}/city/${city.citySlug}`,
            changeFrequency: "weekly",
            priority: 0.5,
          })
        }

        // Region pages for each state
        const regions = await findRegionsForState(state.stateCode)
        for (const region of regions) {
          entries.push({
            url: `${siteUrl}/states/${state.slug}/${region.regionSlug}`,
            changeFrequency: "weekly",
            priority: 0.5,
          })
        }
      }
      break
    }
  }

  const xml = buildSitemapXML(entries)

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Content-Length": Buffer.byteLength(xml).toString(),
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=3600",
    },
  })
}
