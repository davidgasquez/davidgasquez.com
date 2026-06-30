import { STANDARD_PUBLICATION_URI } from "../../lib/standard-site";

export function GET() {
  return new Response(STANDARD_PUBLICATION_URI, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
  });
}
