import { satteri, satteriHeadingIdsPlugin } from "@astrojs/markdown-satteri";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig, fontProviders } from "astro/config";
import { fileURLToPath } from "node:url";
import { defineHastPlugin, defineMdastPlugin } from "satteri";

function handbookSlug(name) {
  return name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isHandbookContent(ctx) {
  return ctx.fileURL ? fileURLToPath(ctx.fileURL).includes("/src/content/handbook/") : false;
}

function isLocalHandbookLink(url) {
  return (
    !url.startsWith("#") &&
    !url.startsWith("/") &&
    !url.startsWith("./") &&
    !url.startsWith("../") &&
    !/^[a-z][a-z0-9+.-]*:/i.test(url)
  );
}

function decodeHandbookLinkTarget(value) {
  try {
    return decodeURIComponent(value);
  } catch (error) {
    throw new Error(`Invalid handbook link target: ${value}`, { cause: error });
  }
}

function handbookUrl(url) {
  const [rawPage, rawHash] = url.split("#", 2);
  const page = decodeHandbookLinkTarget(rawPage);
  const hash = rawHash ? decodeHandbookLinkTarget(rawHash) : undefined;
  return `/handbook/${handbookSlug(page)}${hash ? `#${handbookSlug(hash)}` : ""}`;
}

const handbookWikiLinks = defineMdastPlugin({
  name: "handbook-wiki-links",
  link(node, ctx) {
    if (!isHandbookContent(ctx) || !isLocalHandbookLink(node.url)) return;

    ctx.setProperty(node, "url", handbookUrl(node.url));
    ctx.setProperty(node, "data", {
      hProperties: {
        className: ["internal"],
      },
    });
  },
});

const normalizeHandbookLinks = defineHastPlugin({
  name: "normalize-handbook-links",
  element: {
    filter: ["a"],
    visit(node, ctx) {
      const href = node.properties?.href;
      if (!isHandbookContent(ctx) || typeof href !== "string" || !isLocalHandbookLink(href)) return;

      const className = node.properties.className;
      const classes = Array.isArray(className)
        ? className
        : typeof className === "string"
          ? className.split(/\s+/).filter(Boolean)
          : [];

      ctx.setProperty(node, "href", handbookUrl(href));
      ctx.setProperty(node, "className", classes.includes("internal") ? classes : [...classes, "internal"]);
    },
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
      hastPlugins: [satteriHeadingIdsPlugin(), normalizeHandbookLinks, autolinkHeadings],
    }),
  },
});
