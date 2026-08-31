import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { getHandbookTitle } from "../../lib/handbook-title";
import { renderSocialImage, socialImageName } from "../../lib/social-image";

export async function getStaticPaths() {
  const [blogEntries, handbookEntries] = await Promise.all([getCollection("blog"), getCollection("handbook")]);

  return [
    ...blogEntries.map((entry) => ({
      params: { slug: socialImageName("blog", entry.id, entry.data.title) },
      props: { title: entry.data.title },
    })),
    ...handbookEntries.map((entry) => {
      const title = getHandbookTitle(entry);
      return {
        params: { slug: socialImageName("handbook", entry.id, title) },
        props: { title },
      };
    }),
  ];
}

export const GET: APIRoute = async ({ props }) => {
  const { title } = props;
  if (typeof title !== "string") throw new Error("Social image route requires a string title prop");

  const image = await renderSocialImage(title);
  return new Response(new Uint8Array(image), {
    headers: { "Content-Type": "image/png" },
  });
};
