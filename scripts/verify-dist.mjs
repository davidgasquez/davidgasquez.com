import { access, readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const dist = fileURLToPath(new URL("../dist", import.meta.url));
const machineReadableExtensions = new Set([".json", ".md", ".txt", ".xml"]);

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? listFiles(path) : [path];
    }),
  );

  return files.flat();
}

const files = await listFiles(dist);
const htmlFiles = files.filter((path) => path.endsWith(".html"));
const machineReadableFiles = files.filter((path) => {
  const extension = path.slice(path.lastIndexOf("."));
  return machineReadableExtensions.has(extension) || path.includes("/.well-known/");
});

for (const htmlPath of htmlFiles) {
  await access(htmlPath.replace(/\.html$/, ".md"));
}

for (const path of machineReadableFiles) {
  if ((await readFile(path)).byteLength === 0) throw new Error(`Empty machine-readable file: ${path}`);
}

const homepage = await readFile(join(dist, "index.html"), "utf8");
if (!/<h1\b[^>]*>\s*David Gasquez\s*<\/h1>/i.test(homepage)) {
  throw new Error("Homepage is missing its David Gasquez h1");
}
if (!/<h2\b[^>]*>\s*Posts\s*<\/h2>/i.test(homepage)) {
  throw new Error("Homepage is missing its Posts h2");
}

const personMatch = homepage.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i);
if (!personMatch) throw new Error("Homepage is missing JSON-LD");

const person = JSON.parse(personMatch[1]);
if (person["@context"] !== "https://schema.org" || person["@type"] !== "Person") {
  throw new Error("Homepage JSON-LD does not identify a Schema.org Person");
}
for (const property of ["name", "description", "url", "jobTitle", "email"]) {
  if (typeof person[property] !== "string" || person[property].length === 0) {
    throw new Error(`Homepage Person JSON-LD is missing ${property}`);
  }
}
if (!Array.isArray(person.sameAs) || person.sameAs.length === 0) {
  throw new Error("Homepage Person JSON-LD is missing sameAs profiles");
}

const markdown404 = await readFile(join(dist, "404.md"), "utf8");
for (const recoveryPath of ["/", "/handbook", "/sitemap-index.xml"]) {
  if (!markdown404.includes(`](${recoveryPath})`)) {
    throw new Error(`404.md is missing recovery link ${recoveryPath}`);
  }
}

console.log(
  `Verified ${htmlFiles.length} HTML/Markdown pairs and ${machineReadableFiles.length} machine-readable files.`,
);
