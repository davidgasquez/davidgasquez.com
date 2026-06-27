const PUBLICATION_URI = "at://did:plc:4z5i7njrld66ew36htufcwry/site.standard.publication/3mo43d2tmt2ov";

export function GET() {
  return new Response(PUBLICATION_URI, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
    },
  });
}
