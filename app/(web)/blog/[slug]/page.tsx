import { getReadTime } from "@primoui/utils"
import type { Metadata } from "next"
import { getFormatter, getTranslations } from "next-intl/server"
import Image from "next/image"
import { notFound } from "next/navigation"
import { cache } from "react"
import { Link } from "~/components/common/link"
import { extractHeadingsFromMarkdown, Markdown } from "~/components/web/markdown"
import { Nav } from "~/components/web/nav"
import { PostPreviewAlert } from "~/components/web/posts/post-preview-alert"
import { StructuredData } from "~/components/web/structured-data"
import { TableOfContents } from "~/components/web/table-of-contents"
import { Author } from "~/components/web/ui/author"
import { Breadcrumbs } from "~/components/web/ui/breadcrumbs"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { Section } from "~/components/web/ui/section"
import { blogConfig } from "~/config/blog"
import { STATE_NAMES } from "~/config/states"
import { getPageData, getPageMetadata } from "~/lib/pages"
import { generateArticle } from "~/lib/structured-data"
import { findPost, findPostSlugs } from "~/server/web/posts/queries"

/** Scan post content for state name mentions and return matching state slugs */
function extractMentionedStates(content: string) {
  return Object.entries(STATE_NAMES)
    .filter(([, name]) => content.includes(name))
    .map(([code, name]) => ({ stateCode: code, stateName: name, slug: code.toLowerCase() }))
}

type Props = PageProps<"/blog/[slug]">

// Get page data
const getData = cache(async ({ params }: Props) => {
  const { slug } = await params
  const post = await findPost({ where: { slug } })

  if (!post) {
    notFound()
  }

  const t = await getTranslations()
  const url = `/blog/${post.slug}`

  const data = getPageData(url, post.title, post.description ?? "", {
    breadcrumbs: [
      { url: "/blog", title: t("navigation.blog") },
      { url, title: post.title },
    ],
    structuredData: [generateArticle(url, post)],
  })

  return { post, ...data }
})

export const generateStaticParams = async () => []

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  const { post, url, metadata } = await getData(props)

  const openGraph: Metadata["openGraph"] = {
    type: "article",
    publishedTime: post.publishedAt?.toISOString(),
    modifiedTime: (post.updatedAt ?? post.publishedAt)?.toISOString(),
    authors: post.author?.name,
  }

  const robots = post.status !== "Published" ? { index: false, follow: false } : undefined

  return getPageMetadata({ url, metadata: { ...metadata, openGraph, robots } })
}

export default async function (props: Props) {
  const { post, breadcrumbs, structuredData } = await getData(props)
  const mentionedStates = extractMentionedStates(post.content ?? "")
  const t = await getTranslations()
  const format = await getFormatter()

  const headings = extractHeadingsFromMarkdown(post.content)
  const isUpdated = post.updatedAt > (post.publishedAt ?? post.createdAt)
  const readTime = getReadTime(post.plainText)

  return (
    <>
      <Breadcrumbs items={breadcrumbs} />

      <PostPreviewAlert status={post.status} />

      <Intro>
        <IntroTitle>{post.title}</IntroTitle>
        {post.description && <IntroDescription>{post.description}</IntroDescription>}

        {post.author && (
          <Author
            prefix={t("posts.written_by")}
            note={
              <>
                <time dateTime={post.updatedAt.toISOString()}>
                  {isUpdated && `${t("posts.last_updated")}: `}
                  {format.dateTime(post.updatedAt, { dateStyle: "long" })}
                </time>

                {!!readTime && (
                  <>
                    <span className="px-1.5">&bull;</span>
                    <span>{t("posts.read_time", { count: readTime })}</span>
                  </>
                )}
              </>
            }
            className="mt-4"
            name={post.author.name}
            image={post.author.image ?? ""}
          />
        )}
      </Intro>

      {!!post.content && (
        <>
          <Section>
            <Section.Content>
              {post.imageUrl && (
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  width={1200}
                  height={630}
                  loading="eager"
                  className="w-full h-auto aspect-video object-cover rounded-lg"
                />
              )}

              <Markdown code={post.content} />
            </Section.Content>

            <Section.Sidebar className="max-h-(--sidebar-max-height)">
{blogConfig.tableOfContents.enabled && !!headings.length && (
                <TableOfContents headings={headings} />
              )}
            </Section.Sidebar>
          </Section>

          <Nav title={post.title} className="self-start" />
        </>
      )}

      {/* State cross-links */}
      <section className="border-t pt-8 flex flex-col gap-4">
        <h2 className="text-base font-semibold">Find Golf Simulators Near You</h2>

        {mentionedStates.length > 0 ? (
          <>
            <p className="text-sm text-muted-foreground">Browse venues in states mentioned in this article:</p>
            <div className="flex flex-wrap gap-2">
              {mentionedStates.map(s => (
                <Link
                  key={s.stateCode}
                  href={`/states/${s.slug}`}
                  className="inline-flex items-center rounded-md border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent"
                >
                  {s.stateName}
                </Link>
              ))}
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            Explore our full directory of golf simulator venues{" "}
            <Link href="/states" className="underline underline-offset-4 hover:text-foreground">
              by state
            </Link>{" "}
            or{" "}
            <Link href="/" className="underline underline-offset-4 hover:text-foreground">
              browse top-rated venues
            </Link>{" "}
            near you.
          </p>
        )}
      </section>

      <StructuredData data={structuredData} />
    </>
  )
}
