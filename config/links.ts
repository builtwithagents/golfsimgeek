import { siteConfig } from "~/config/site"

export const linksConfig = {
  author: "https://www.golfsimgeek.com",
  builtWith: "https://dirstarter.com",
  feeds: [
    { title: "RSS » Tools", url: `${siteConfig.url}/rss/tools.xml` },
    { title: "RSS » Blog Posts", url: `${siteConfig.url}/rss/posts.xml` },
  ],
}
