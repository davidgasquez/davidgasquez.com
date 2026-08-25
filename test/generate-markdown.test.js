import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { generateMarkdownAssets, htmlToMarkdown } from "../scripts/generate-markdown.mjs";

test("htmlToMarkdown extracts main content and preserves GFM tables", () => {
  const markdown = htmlToMarkdown(`
    <html><head><title>Page title</title></head><body>
      <nav>Navigation noise</nav>
      <main><table><thead><tr><th>Name</th></tr></thead><tbody><tr><td>David</td></tr></tbody></table></main>
      <script>noise()</script>
    </body></html>
  `);

  assert.match(markdown, /^# Page title/m);
  assert.match(markdown, /\| Name\s+\|/);
  assert.doesNotMatch(markdown, /Navigation noise|noise\(\)/);
});

test("generateMarkdownAssets adds missing variants without replacing authored Markdown", async () => {
  const directory = await mkdtemp(join(tmpdir(), "markdown-assets-"));

  try {
    await mkdir(join(directory, "nested"));
    await writeFile(join(directory, "index.html"), "<html><body><main><h1>Home</h1></main></body></html>");
    await writeFile(join(directory, "nested", "page.html"), "<html><body><main><h1>Page</h1></main></body></html>");
    await writeFile(join(directory, "nested", "page.md"), "# Authored\n");

    assert.deepEqual(await generateMarkdownAssets(directory), { generated: 1, total: 2 });
    assert.equal(await readFile(join(directory, "index.md"), "utf8"), "# Home\n");
    assert.equal(await readFile(join(directory, "nested", "page.md"), "utf8"), "# Authored\n");
  } finally {
    await rm(directory, { recursive: true });
  }
});
