const REPRESENTATIONS = ["text/html", "text/markdown"];

function parseAccept(header) {
  return header
    .split(",")
    .map((raw) => {
      const parts = raw
        .trim()
        .split(";")
        .map((part) => part.trim());
      const type = parts[0].toLowerCase();
      if (!type) return null;

      let q = 1;
      for (const parameter of parts.slice(1)) {
        const [name, value] = parameter.split("=").map((part) => part.trim());
        if (name.toLowerCase() !== "q") continue;

        const parsed = Number(value);
        if (!Number.isNaN(parsed)) q = Math.max(0, Math.min(1, parsed));
      }

      const specificity = type === "*/*" ? 0 : type.endsWith("/*") ? 1 : 2;
      return { q, specificity, type };
    })
    .filter(Boolean);
}

function matches(entry, candidate) {
  if (entry.type === "*/*") return true;
  if (entry.type.endsWith("/*")) return candidate.startsWith(entry.type.slice(0, -1));
  return entry.type === candidate;
}

export function preferredType(header, representations = REPRESENTATIONS) {
  if (!header) return representations[0] ?? null;

  const entries = parseAccept(header);
  if (entries.length === 0) return representations[0] ?? null;

  let bestPosition = Infinity;
  let bestQ = -1;
  let bestType = null;

  for (const candidate of representations) {
    let matched = null;
    let matchedPosition = Infinity;

    for (const [position, entry] of entries.entries()) {
      if (!matches(entry, candidate)) continue;
      if (
        matched === null ||
        entry.specificity > matched.specificity ||
        (entry.specificity === matched.specificity && position < matchedPosition)
      ) {
        matched = entry;
        matchedPosition = position;
      }
    }

    if (matched === null || matched.q <= 0) continue;
    if (matched.q > bestQ || (matched.q === bestQ && matchedPosition < bestPosition)) {
      bestPosition = matchedPosition;
      bestQ = matched.q;
      bestType = candidate;
    }
  }

  return bestType;
}

export function markdownPaths(pathname) {
  const clean = pathname.replace(/\/$/, "") || "/";
  if (clean === "/") return ["/index.md"];
  if (clean.endsWith(".html")) return [clean.replace(/\.html$/, ".md")];
  return [`${clean}.md`, `${clean}/index.md`];
}

function isPageRequest(request, pathname) {
  if (request.method !== "GET" && request.method !== "HEAD") return false;
  const lastSegment = pathname.slice(pathname.lastIndexOf("/") + 1);
  return !lastSegment.includes(".") || lastSegment.endsWith(".html");
}

function setVary(headers) {
  const existing = (headers.get("Vary") ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  if (existing.includes("*")) return;

  const other = existing.filter((value) => !["accept", "accept-encoding"].includes(value.toLowerCase()));
  headers.set("Vary", ["Accept", "Accept-Encoding", ...other].join(", "));
}

function notAcceptable(message) {
  const response = new Response(`${message}\n`, {
    status: 406,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
  setVary(response.headers);
  return response;
}

function mutableResponse(response) {
  return new Response(response.body, response);
}

async function findMarkdown(request, env, method) {
  const url = new URL(request.url);

  for (const pathname of markdownPaths(url.pathname)) {
    const markdownUrl = new URL(url);
    markdownUrl.pathname = pathname;
    const response = await env.ASSETS.fetch(new Request(markdownUrl, { headers: request.headers, method }));
    if (response.status === 200) return { pathname, response };
  }

  return null;
}

async function servePage(request, env) {
  const accept = request.headers.get("Accept");
  const chosen = preferredType(accept);

  if (chosen === null && accept) return notAcceptable("Not Acceptable. Available: text/html, text/markdown");

  if (chosen === "text/markdown") {
    const markdown = await findMarkdown(request, env, request.method);

    if (markdown) {
      const response = mutableResponse(markdown.response);
      response.headers.set("Content-Type", "text/markdown; charset=utf-8");
      setVary(response.headers);
      return response;
    }

    if (!preferredType(accept, ["text/html"])) {
      return notAcceptable("Not Acceptable. Markdown representation is unavailable");
    }
  }

  const response = mutableResponse(await env.ASSETS.fetch(request));
  setVary(response.headers);

  if (response.headers.get("Content-Type")?.includes("text/html")) {
    const markdown = await findMarkdown(request, env, "HEAD");

    if (markdown) {
      const alternate = `<${markdown.pathname}>; rel="alternate"; type="text/markdown"`;
      const existing = response.headers.get("Link");
      response.headers.set("Link", existing ? `${existing}, ${alternate}` : alternate);
    }
  }

  return response;
}

export default {
  fetch(request, env) {
    const { pathname } = new URL(request.url);
    return isPageRequest(request, pathname) ? servePage(request, env) : env.ASSETS.fetch(request);
  },
};
