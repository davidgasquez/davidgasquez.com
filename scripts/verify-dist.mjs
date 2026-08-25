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

console.log(
  `Verified ${htmlFiles.length} HTML/Markdown pairs and ${machineReadableFiles.length} machine-readable files.`,
);
