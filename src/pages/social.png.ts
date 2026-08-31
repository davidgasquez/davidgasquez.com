import type { APIRoute } from "astro";
import { renderSocialImage } from "../lib/social-image";

export const GET: APIRoute = async () => {
  const image = await renderSocialImage("Data engineering for open networks and public goods");

  return new Response(new Uint8Array(image), {
    headers: { "Content-Type": "image/png" },
  });
};
