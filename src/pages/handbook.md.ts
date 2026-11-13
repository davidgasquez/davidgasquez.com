import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { getHandbookTitle } from "../lib/handbook-title";

export const GET: APIRoute = async () => {
  const entries = (await getCollection("handbook"))
    .map((entry) => ({ id: entry.id, title: getHandbookTitle(entry) }))
    .sort((a, b) => a.title.localeCompare(b.title));

  const notes = entries.map(({ id, title }) => {
    const label = title.replace(/[\\`*_[\]<>]/g, "\\$&");
    return `- [${label}](/handbook/${id}.md)`;
  });

  return new Response(
    ["# Handbook", "", "An index of all handbook notes, generated automatically at build time.", "", ...notes, ""].join(
      "\n",
    ),
    {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
      },
    },
  );
};
