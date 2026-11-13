import type { CollectionEntry } from "astro:content";
import { defineMdastPlugin, markdownToHtml } from "satteri";
import { getHandbookTitle } from "./handbook-title";

function normalize(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function createHandbookMarkdown(entries: CollectionEntry<"handbook">[]) {
  const targets = new Map<string, string>();
  for (const entry of entries) {
    const names = [entry.id, getHandbookTitle(entry)];
    if (entry.filePath) names.push(entry.filePath.split("/").at(-1)!.replace(/\.md$/i, ""));
    for (const name of names) {
      const key = normalize(name);
      const existing = targets.get(key);
      if (existing && existing !== entry.id) throw new Error(`Ambiguous handbook link target: ${name}`);
      targets.set(key, entry.id);
    }
  }

  return (body: string, currentId: string): string => {
    // Satteri positions are UTF-8 byte offsets, not JavaScript string offsets.
    const source = Buffer.from(body);
    const edits: { start: number; end: number; value: string }[] = [];
    const unresolved = new Set<string>();

    function resolve(url: string, wiki: boolean): string | undefined {
      let target = url;
      if (/^https?:\/\//i.test(target)) {
        const absolute = new URL(target);
        if (absolute.origin !== "https://davidgasquez.com") return;
        target = absolute.pathname + absolute.search + absolute.hash;
      }
      if (target === "/handbook" || target === "/handbook/") return "/handbook.md";
      if (target.startsWith("/handbook/")) target = target.slice("/handbook/".length);
      else if (!wiki && !target.startsWith("#") && /^(?:\/|[a-z][a-z0-9+.-]*:)/i.test(target)) return;

      const match = target.match(/^([^?#]*)(\?[^#]*)?(#.*)?$/)!;
      let page: string;
      let fragment: string;
      try {
        page = decodeURIComponent(match[1]).replace(/^\.\//, "").replace(/\.md$/i, "");
        fragment = wiki && match[3] ? `#${normalize(decodeURIComponent(match[3].slice(1)))}` : (match[3] ?? "");
      } catch {
        unresolved.add(url);
        return;
      }
      if (normalize(page) === "readme") return `/handbook.md${match[2] ?? ""}${fragment}`;
      const id = page ? targets.get(normalize(page)) : currentId;
      if (!id) {
        unresolved.add(url);
        return;
      }
      return `/handbook/${id}.md${match[2] ?? ""}${fragment}`;
    }

    function rewrite(node: { url: string; position?: { start: { offset?: number }; end: { offset?: number } } }) {
      const start = node.position?.start.offset;
      const end = node.position?.end.offset;
      if (start === undefined || end === undefined) return;
      const original = source.subarray(start, end).toString();
      const wiki = original.startsWith("[[");
      const url = resolve(node.url, wiki);
      if (wiki) {
        const parts = original.slice(2, -2).split("|");
        const label = (parts.length > 1 ? parts.slice(1).join("|") : parts[0]).replace(/[\\`*_[\]<>]/g, "\\$&");
        // Missing notes become plain text rather than links to nonexistent files.
        edits.push({ start, end, value: url ? `[${label}](${url})` : label });
      } else if (url) {
        // Only edit the destination, preserving the original label and optional title.
        const destinationStart =
          original.startsWith("[") && original.includes("](")
            ? original.lastIndexOf("](") + 2
            : original.indexOf(":") + 1;
        const index = original.indexOf(node.url, destinationStart);
        if (index < 0) {
          unresolved.add(node.url);
          return;
        }
        edits.push({ start, end, value: original.slice(0, index) + url + original.slice(index + node.url.length) });
      }
    }

    markdownToHtml(body, {
      features: { wikilinks: true },
      mdastPlugins: [defineMdastPlugin({ name: "handbook-markdown-links", link: rewrite, definition: rewrite })],
    });

    if (unresolved.size) console.warn(`[handbook/${currentId}.md] Unresolved links: ${[...unresolved].join(", ")}`);
    let result = source;
    for (const edit of edits.sort((a, b) => b.start - a.start)) {
      result = Buffer.concat([result.subarray(0, edit.start), Buffer.from(edit.value), result.subarray(edit.end)]);
    }
    return result.toString();
  };
}
