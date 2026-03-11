import { defineConfig, fontProviders } from "astro/config";
import sitemap from "@astrojs/sitemap";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkWikiLink from "remark-wiki-link";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  site: "https://davidgasquez.com/",
  integrations: [sitemap(), mdx()],
  trailingSlash: "ignore",
  fonts: [
    {
      provider: fontProviders.google(),
      name: "JetBrains Mono",
      cssVariable: "--font-jetbrains-mono",
      weights: [400, 500, 600, 700],
      subsets: ["latin"],
      display: "swap",
      fallbacks: ["monospace"],
    },
  ],
  markdown: {
    remarkPlugins: [
      [
        remarkWikiLink,
        {
          pageResolver: (name) => [name.replace(/ /g, "-").toLowerCase()],
          hrefTemplate: (permalink) => {
            // Since most of our wikilinks are in handbook content,
            // prioritize handbook paths for now
            return `/handbook/${permalink}`;
          },
          wikiLinkClassName: "internal",
          newClassName: "new",
          aliasDivider: "|",
        },
      ],
    ],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "wrap",
        },
      ],
    ],
  },
});
