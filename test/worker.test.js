import assert from "node:assert/strict";
import test from "node:test";
import worker, { markdownPaths, preferredType } from "../src/worker.js";

function assets() {
  const bodies = new Map([
    ["/", ["<h1>Home</h1>", "text/html; charset=utf-8"]],
    ["/about", ["<h1>About</h1>", "text/html; charset=utf-8"]],
    ["/index.md", ["# Home\n", "text/markdown"]],
    ["/about.md", ["# About\n", "text/markdown"]],
    [
      "/404.md",
      [
        "# Not found\n\nTry [home](/), [the handbook](/handbook), or [the sitemap](/sitemap-index.xml).\n",
        "text/markdown",
      ],
    ],
    ["/experiments/demo/", ["<h1>Demo</h1>", "text/html; charset=utf-8"]],
    ["/experiments/demo/index.md", ["# Demo\n", "text/markdown"]],
    ["/robots.txt", ["User-agent: *\n", "text/plain"]],
  ]);

  return {
    async fetch(input) {
      const request = input instanceof Request ? input : new Request(input);
      const entry = bodies.get(new URL(request.url).pathname);
      if (!entry) return new Response("Missing", { status: 404, headers: { "Content-Type": "text/html" } });
      return new Response(request.method === "HEAD" ? null : entry[0], {
        headers: { "Content-Type": entry[1] },
      });
    },
  };
}

function request(path = "/", accept) {
  const headers = accept ? { Accept: accept } : undefined;
  return worker.fetch(new Request(`https://example.com${path}`, { headers }), { ASSETS: assets() });
}

function assertNegotiated(response, contentType) {
  assert.equal(response.headers.get("Content-Type"), contentType);
  assert.equal(response.headers.get("Vary"), "Accept, Accept-Encoding");
}

test("preferredType honors quality, specificity, explicit rejection, and client order", () => {
  assert.equal(preferredType("text/markdown, text/html"), "text/markdown");
  assert.equal(preferredType("text/markdown;q=0.2, text/html;q=0.8"), "text/html");
  assert.equal(preferredType("text/html;q=0, */*;q=1"), "text/markdown");
  assert.equal(preferredType("text/markdown;q=0, text/html;q=0"), null);
});

test("markdownPaths maps file and directory-style HTML URLs", () => {
  assert.deepEqual(markdownPaths("/"), ["/index.md"]);
  assert.deepEqual(markdownPaths("/about"), ["/about.md", "/about/index.md"]);
  assert.deepEqual(markdownPaths("/about/"), ["/about.md", "/about/index.md"]);
  assert.deepEqual(markdownPaths("/about.html"), ["/about.md"]);
});

test("serves HTML by default with cache variation and an alternate link", async () => {
  const response = await request("/about");

  assertNegotiated(response, "text/html; charset=utf-8");
  assert.equal(response.headers.get("Link"), '</about.md>; rel="alternate"; type="text/markdown"');
  assert.equal(await response.text(), "<h1>About</h1>");
});

test("serves Markdown from the same URL when requested", async () => {
  const response = await request("/about", "text/markdown");

  assertNegotiated(response, "text/markdown; charset=utf-8");
  assert.equal(await response.text(), "# About\n");
});

test("serves Markdown for directory-style pages", async () => {
  const response = await request("/experiments/demo/", "text/markdown");

  assertNegotiated(response, "text/markdown; charset=utf-8");
  assert.equal(await response.text(), "# Demo\n");
});

test("returns 406 when no page representation is acceptable", async () => {
  const response = await request("/about", "application/pdf");

  assert.equal(response.status, 406);
  assertNegotiated(response, "text/plain; charset=utf-8");
});

test("returns a recoverable Markdown 404 for a missing page", async () => {
  const response = await request("/missing", "text/markdown");

  assert.equal(response.status, 404);
  assertNegotiated(response, "text/markdown; charset=utf-8");
  const body = await response.text();
  assert.match(body, /\/handbook/);
  assert.match(body, /\/sitemap-index\.xml/);
});

test("passes machine-readable files through without page negotiation", async () => {
  const response = await request("/robots.txt", "application/pdf");

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("Content-Type"), "text/plain");
  assert.equal(response.headers.get("Vary"), null);
});
