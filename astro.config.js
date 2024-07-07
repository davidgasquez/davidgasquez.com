import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  site: "https://davidgasquez.github.io/",
  integrations: [tailwind(), sitemap(), mdx()],
  trailingSlash: "ignore",
  markdown: {
    rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, {
      behavior: "wrap"
    }]]
  }
});
