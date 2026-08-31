import type { CollectionEntry } from "astro:content";

export function getHandbookTitle(entry: CollectionEntry<"handbook">): string {
  const frontmatterTitle = entry.data.title?.trim();
  if (frontmatterTitle) return frontmatterTitle;

  const heading = entry.body?.match(/^#\s+(.+)$/m)?.[1].trim();
  if (!heading) throw new Error(`Handbook entry ${entry.id} is missing a title or level-one heading`);

  return heading;
}
