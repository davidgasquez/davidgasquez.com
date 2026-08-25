import { access, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";

const turndown = new TurndownService({
  bulletListMarker: "-",
  codeBlockStyle: "fenced",
  headingStyle: "atx",
});

turndown.use(gfm);
turndown.remove(["button", "noscript", "script", "style", "svg"]);

function firstMatch(html, patterns) {
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return match[1];
  }

  throw new Error("HTML document has no <main> or <body> content");
}

export function htmlToMarkdown(html) {
  const content = firstMatch(html, [
    /<main\b[^>]*class="[^"]*\bhandbook-main\b[^"]*"[^>]*>([\s\S]*?)<\/main>/i,
    /<main\b[^>]*>([\s\S]*?)<\/main>/i,
    /<body\b[^>]*>([\s\S]*?)<\/body>/i,
  ]);
  const title = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1];
  const document = title && !/<h1\b/i.test(content) ? `<h1>${title}</h1>${content}` : content;

  return `${turndown.turndown(document).trim()}\n`;
}

async function listHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? listHtmlFiles(path) : [path];
    }),
  );

  return files.flat().filter((path) => path.endsWith(".html"));
}

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

export async function generateMarkdownAssets(directory) {
  const htmlFiles = await listHtmlFiles(directory);
  let generated = 0;

  for (const htmlPath of htmlFiles) {
    const markdownPath = htmlPath.replace(/\.html$/, ".md");
    if (await exists(markdownPath)) continue;

    const html = await readFile(htmlPath, "utf8");
    await mkdir(dirname(markdownPath), { recursive: true });
    await writeFile(markdownPath, htmlToMarkdown(html));
    generated += 1;
  }

  return { generated, total: htmlFiles.length };
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  const result = await generateMarkdownAssets(fileURLToPath(new URL("../dist", import.meta.url)));
  console.log(`Generated ${result.generated} Markdown variants for ${result.total} HTML pages.`);
}
