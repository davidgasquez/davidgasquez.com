import { satteri, satteriHeadingIdsPlugin } from "@astrojs/markdown-satteri";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig, fontProviders } from "astro/config";
import { defineHastPlugin, defineMdastPlugin } from "satteri";

function handbookSlug(name) {
  return name.replace(/ /g, "-").toLowerCase();
}

const handbookWikiLinks = defineMdastPlugin({
  name: "handbook-wiki-links",
  link(node, ctx) {
    const start = node.position?.start.offset;
    const end = node.position?.end.offset;
    if (start === undefined || end === undefined || !ctx.source.slice(start, end).startsWith("[[")) return;

    ctx.setProperty(node, "url", `/handbook/${handbookSlug(node.url)}`);
    ctx.setProperty(node, "data", {
      hProperties: {
        className: ["internal"],
      },
    });
  },
});

const autolinkHeadings = defineHastPlugin({
  name: "autolink-headings",
  element: {
    filter: ["h1", "h2", "h3", "h4", "h5", "h6"],
    visit(node, ctx) {
      const id = node.properties?.id;
      if (typeof id !== "string" || !node.children?.length) return;

      ctx.setProperty(node, "children", [
        {
          type: "element",
          tagName: "a",
          properties: { href: `#${id}` },
          children: node.children,
        },
      ]);
    },
  },
});

// https://astro.build/config
export default defineConfig({
  site: "https://davidgasquez.com/",
  integrations: [sitemap(), mdx()],
  trailingSlash: "never",
  build: {
    format: "file",
  },
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
    processor: satteri({
      features: {
        wikilinks: true,
      },
      mdastPlugins: [handbookWikiLinks],
      hastPlugins: [satteriHeadingIdsPlugin(), autolinkHeadings],
    }),
  },
});
