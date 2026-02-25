import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export async function getStaticPaths() {
  const handbookEntries = await getCollection("handbook");

  return handbookEntries.map((entry) => ({
    params: { slug: entry.id },
    props: { body: entry.body },
  }));
}

export const GET: APIRoute = ({ props }) => {
  return new Response(props.body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
};
