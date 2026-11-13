import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { createHandbookMarkdown } from "../../lib/handbook-markdown";

export async function getStaticPaths() {
  const handbookEntries = await getCollection("handbook");
  const toMarkdown = createHandbookMarkdown(handbookEntries);

  return handbookEntries.map((entry) => ({
    params: { slug: entry.id },
    props: { body: toMarkdown(entry.body ?? "", entry.id) },
  }));
}

export const GET: APIRoute = ({ props }) => {
  return new Response(props.body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
};
