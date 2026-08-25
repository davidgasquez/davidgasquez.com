import { readdir } from "node:fs/promises";
import { basename, dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const baseUrl = new URL(process.env.SITE_URL ?? "http://127.0.0.1:8787");
const dist = fileURLToPath(new URL("../dist", import.meta.url));
const machineReadableExtensions = new Set([".json", ".md", ".txt", ".xml"]);
const expectedContentTypes = new Map([
  [".json", "application/json"],
  [".md", "text/markdown"],
  [".txt", "text/plain"],
  [".xml", "application/xml"],
]);

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const file = join(directory, entry.name);
      return entry.isDirectory() ? listFiles(file) : [file];
    }),
  );

  return files.flat();
}

function urlPath(file) {
  return `/${relative(dist, file).split(sep).join("/")}`;
}

function pagePath(file) {
  const filePath = urlPath(file);
  if (filePath === "/index.html") return "/";
  if (basename(file) === "index.html") return `${urlPath(dirname(file))}/`;
  return filePath.replace(/\.html$/, "");
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertVary(response, endpoint) {
  const vary = (response.headers.get("Vary") ?? "")
    .toLowerCase()
    .split(",")
    .map((value) => value.trim());
  assert(vary.includes("accept"), `${endpoint}: Vary is missing Accept`);
  assert(vary.includes("accept-encoding"), `${endpoint}: Vary is missing Accept-Encoding`);
}

async function verifyPage(endpoint) {
  const html = await fetch(new URL(endpoint, baseUrl), { headers: { Accept: "text/html" } });
  assert(html.status === 200, `${endpoint}: HTML returned ${html.status}`);
  assert(html.headers.get("Content-Type")?.includes("text/html"), `${endpoint}: HTML Content-Type is invalid`);
  assert(html.headers.get("Link")?.includes('type="text/markdown"'), `${endpoint}: Markdown Link is missing`);
  assertVary(html, endpoint);

  const markdown = await fetch(new URL(endpoint, baseUrl), { headers: { Accept: "text/markdown" } });
  assert(markdown.status === 200, `${endpoint}: Markdown returned ${markdown.status}`);
  assert(
    markdown.headers.get("Content-Type") === "text/markdown; charset=utf-8",
    `${endpoint}: Markdown Content-Type is invalid`,
  );
  assertVary(markdown, endpoint);
  assert((await markdown.text()).trim(), `${endpoint}: Markdown body is empty`);
}

async function verifyMachineFile(file) {
  const endpoint = urlPath(file);
  const response = await fetch(new URL(endpoint, baseUrl));
  assert(response.status === 200, `${endpoint}: machine-readable file returned ${response.status}`);
  const extension = file.slice(file.lastIndexOf("."));
  const expectedContentType = expectedContentTypes.get(extension);
  if (expectedContentType) {
    assert(
      response.headers.get("Content-Type")?.includes(expectedContentType),
      `${endpoint}: expected ${expectedContentType}, got ${response.headers.get("Content-Type") ?? "none"}`,
    );
  }
  assert((await response.arrayBuffer()).byteLength > 0, `${endpoint}: machine-readable file is empty`);
}

async function inBatches(items, verify, size = 20) {
  for (let index = 0; index < items.length; index += size) {
    await Promise.all(items.slice(index, index + size).map(verify));
  }
}

const files = await listFiles(dist);
const pages = files.filter((file) => file.endsWith(".html")).map(pagePath);
const machineReadableFiles = files.filter((file) => {
  const extension = file.slice(file.lastIndexOf("."));
  return machineReadableExtensions.has(extension) || file.includes(`${sep}.well-known${sep}`);
});

await inBatches(pages, verifyPage);
await inBatches(machineReadableFiles, verifyMachineFile);

const notAcceptable = await fetch(baseUrl, { headers: { Accept: "application/pdf" } });
assert(notAcceptable.status === 406, `Unsupported media type returned ${notAcceptable.status}`);
assertVary(notAcceptable, "/");

const missing = await fetch(new URL("/__agent_readiness_missing_page__", baseUrl), {
  headers: { Accept: "text/markdown" },
});
assert(missing.status === 404, `Missing Markdown page returned ${missing.status}`);
assert(
  missing.headers.get("Content-Type") === "text/markdown; charset=utf-8",
  "Missing Markdown page Content-Type is invalid",
);
assertVary(missing, "/__agent_readiness_missing_page__");
const missingBody = await missing.text();
assert(missingBody.includes("/handbook"), "404 Markdown is missing its handbook recovery link");
assert(missingBody.includes("/sitemap-index.xml"), "404 Markdown is missing its sitemap recovery link");

const qualityPreference = await fetch(baseUrl, {
  headers: { Accept: "text/markdown;q=0.2, text/html;q=0.8" },
});
assert(qualityPreference.headers.get("Content-Type")?.includes("text/html"), "q-values did not prefer HTML");

console.log(`Verified ${pages.length} negotiated pages and ${machineReadableFiles.length} machine-readable endpoints.`);
