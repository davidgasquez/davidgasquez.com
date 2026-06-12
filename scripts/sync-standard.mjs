#!/usr/bin/env node
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const CONFIG = {
  handle: process.env.ATPROTO_IDENTIFIER ?? "davidgasquez.com",
  siteUrl: "https://davidgasquez.com",
  publicationName: "davidgasquez.com",
  publicationDescription: "David Gasquez's blog",
  contentDir: "src/content/blog",
};

const COLLECTIONS = {
  publication: "site.standard.publication",
  document: "site.standard.document",
};

const args = new Set(process.argv.slice(2));
const apply = args.has("--apply");

if (args.size > 0 && !args.has("--dry-run") && !apply) {
  fail(`Unsupported arguments: ${[...args].join(" ")}`);
}

function desiredPublicationRecord(existing = {}) {
  return cleanRecord({
    ...existing,
    $type: COLLECTIONS.publication,
    name: CONFIG.publicationName,
    url: CONFIG.siteUrl,
    description: CONFIG.publicationDescription,
  });
}

async function main() {
  const posts = await loadPosts();
  const { did, pds } = await resolveRepo(CONFIG.handle);
  const session = apply ? await createSession(pds) : undefined;
  const publications = await listRecords(pds, did, COLLECTIONS.publication);
  const documents = await listRecords(pds, did, COLLECTIONS.document);

  const publication = findPublication(publications);
  if (!publication) {
    fail(`No publication record found for ${CONFIG.siteUrl}`);
  }

  const desiredPublication = desiredPublicationRecord(publication.value);
  const desiredDocuments = posts.map((post) => postToDocument(post, publication.uri));

  const remoteDocuments = documents.filter((record) => record.value?.site === publication.uri);
  const remoteByPath = indexRemoteDocuments(remoteDocuments);
  const localPaths = new Set(desiredDocuments.map((document) => document.path));

  const creates = [];
  const updates = [];
  const skips = [];
  const deletes = [];

  const publicationAction = sameJson(desiredPublication, publication.value) ? "skip" : "update";

  for (const document of desiredDocuments) {
    const remote = remoteByPath.get(document.path);
    if (!remote) {
      creates.push(document);
    } else if (sameJson(document, remote.value)) {
      skips.push(document);
    } else {
      updates.push({ desired: document, remote });
    }
  }

  for (const record of remoteDocuments) {
    if (!localPaths.has(record.value.path)) {
      deletes.push(record);
    }
  }

  const plan = {
    did,
    pds,
    publication,
    desiredPublication,
    publicationAction,
    posts,
    creates,
    updates,
    skips,
    deletes,
  };

  printReport(plan);

  if (apply) {
    await applyPlan(plan, session);
  }
}

async function loadPosts() {
  const files = (await readdir(CONFIG.contentDir))
    .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"))
    .sort();

  const posts = [];
  const slugs = new Map();

  for (const file of files) {
    const source = await readFile(join(CONFIG.contentDir, file), "utf8");
    const { data, body } = parseFrontmatter(source, file);
    const post = normalizePost(file, data, body);

    if (slugs.has(post.slug)) {
      fail(`Duplicate slug "${post.slug}" in ${slugs.get(post.slug)} and ${file}`);
    }

    slugs.set(post.slug, file);
    posts.push(post);
  }

  return posts.sort((a, b) => a.slug.localeCompare(b.slug));
}

function parseFrontmatter(source, file) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) {
    fail(`${file} is missing YAML frontmatter`);
  }

  const data = {};
  for (const rawLine of match[1].split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const separator = line.indexOf(":");
    if (separator === -1) {
      fail(`${file} has unsupported frontmatter line: ${rawLine}`);
    }

    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim();
    data[key] = parseScalar(value);
  }

  return {
    data,
    body: source.slice(match[0].length).trim(),
  };
}

function parseScalar(value) {
  if (!value) return "";
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}

function normalizePost(file, data, body) {
  for (const field of ["title", "date", "slug"]) {
    if (!data[field]) {
      fail(`${file} is missing required frontmatter field "${field}"`);
    }
  }

  const date = new Date(`${data.date}T00:00:00.000Z`);
  if (Number.isNaN(date.valueOf())) {
    fail(`${file} has invalid date: ${data.date}`);
  }

  return {
    file,
    title: data.title,
    slug: data.slug,
    path: `/${data.slug}`,
    publishedAt: date.toISOString(),
    description: data.description || excerpt(body),
    body,
  };
}

async function resolveRepo(handle) {
  const did = handle.startsWith("did:")
    ? handle
    : (
        await getJson(
          `https://public.api.bsky.app/xrpc/com.atproto.identity.resolveHandle?handle=${encodeURIComponent(handle)}`,
        )
      ).did;
  const didDoc = await getJson(`https://plc.directory/${encodeURIComponent(did)}`);

  const pds = didDoc.service?.find(
    (service) => service.type === "AtprotoPersonalDataServer" || service.id === "#atproto_pds",
  )?.serviceEndpoint;

  if (!pds) {
    fail(`Could not find PDS endpoint for ${did}`);
  }

  return { did, pds };
}

async function createSession(pds) {
  const password = process.env.ATPROTO_APP_PASSWORD;
  if (!password) {
    fail("Missing ATPROTO_APP_PASSWORD");
  }

  const url = new URL("/xrpc/com.atproto.server.createSession", pds);
  return postJson(url, undefined, {
    identifier: CONFIG.handle,
    password,
  });
}

async function listRecords(pds, repo, collection) {
  const records = [];
  let cursor;

  do {
    const url = new URL("/xrpc/com.atproto.repo.listRecords", pds);
    url.search = new URLSearchParams({
      repo,
      collection,
      limit: "100",
      ...(cursor ? { cursor } : {}),
    });

    const response = await getJson(url);
    records.push(...(response.records ?? []));
    cursor = response.cursor;
  } while (cursor);

  return records;
}

async function applyPlan(plan, session) {
  console.log("");
  console.log("Applying sync");

  let publication = plan.publication;
  if (plan.publicationAction === "update") {
    publication = await putRecord(plan.pds, session.accessJwt, {
      repo: plan.did,
      collection: COLLECTIONS.publication,
      rkey: rkeyFromUri(publication.uri),
      record: plan.desiredPublication,
    });
    console.log(`  updated publication ${publication.uri}`);
  } else {
    console.log(`  skipped publication ${publication.uri}`);
  }

  const docsByPath = new Map();
  const existingDocs = await listRecords(plan.pds, plan.did, COLLECTIONS.document);
  for (const record of existingDocs.filter((record) => record.value?.site === publication.uri)) {
    docsByPath.set(record.value.path, record);
  }

  for (const post of plan.posts) {
    const desired = postToDocument(post, publication.uri);
    const remote = docsByPath.get(desired.path);

    if (!remote) {
      const created = await createRecord(plan.pds, session.accessJwt, {
        repo: plan.did,
        collection: COLLECTIONS.document,
        record: desired,
      });
      console.log(`  created ${desired.path} ${created.uri}`);
    } else if (sameJson(desired, remote.value)) {
      console.log(`  skipped ${desired.path}`);
    } else {
      const updated = await putRecord(plan.pds, session.accessJwt, {
        repo: plan.did,
        collection: COLLECTIONS.document,
        rkey: rkeyFromUri(remote.uri),
        record: desired,
      });
      console.log(`  updated ${desired.path} ${updated.uri}`);
    }
  }

  const localPaths = new Set(plan.posts.map((post) => post.path));
  for (const record of docsByPath.values()) {
    if (!localPaths.has(record.value.path)) {
      await deleteRecord(plan.pds, session.accessJwt, {
        repo: plan.did,
        collection: COLLECTIONS.document,
        rkey: rkeyFromUri(record.uri),
      });
      console.log(`  deleted ${record.value.path} ${record.uri}`);
    }
  }
}

function findPublication(publications) {
  const matches = publications.filter((record) => record.value?.url === CONFIG.siteUrl);

  if (matches.length > 1) {
    fail(`Found ${matches.length} publication records for ${CONFIG.siteUrl}; refusing to guess`);
  }

  return matches[0];
}

function indexRemoteDocuments(documents) {
  const byPath = new Map();

  for (const record of documents) {
    const path = record.value?.path;
    if (!path) {
      fail(`Remote document ${record.uri} is attached to this publication but has no path`);
    }
    if (byPath.has(path)) {
      fail(`Duplicate remote document path "${path}" for this publication`);
    }
    byPath.set(path, record);
  }

  return byPath;
}

function postToDocument(post, publicationUri) {
  return cleanRecord({
    $type: COLLECTIONS.document,
    site: publicationUri,
    title: post.title,
    publishedAt: post.publishedAt,
    path: post.path,
    description: post.description,
    textContent: stripMarkdown(post.body),
    content: {
      $type: "site.standard.content.markdown",
      text: post.body,
      version: "1.0",
    },
  });
}

function cleanRecord(record) {
  return Object.fromEntries(Object.entries(record).filter(([, value]) => value !== undefined && value !== ""));
}

function excerpt(markdown) {
  const text = stripMarkdown(markdown).replace(/\s+/g, " ").trim();
  if (text.length <= 280) return text;
  return `${text.slice(0, 277).trimEnd()}...`;
}

function stripMarkdown(markdown) {
  return markdown
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*>\s?/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/\[\^([^\]]+)\]/g, "$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function getJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    fail(`GET ${url} failed: ${response.status} ${await response.text()}`);
  }
  return response.json();
}

async function postJson(url, accessJwt, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: cleanRecord({
      "content-type": "application/json",
      authorization: accessJwt ? `Bearer ${accessJwt}` : undefined,
    }),
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    fail(`POST ${url} failed: ${response.status} ${await response.text()}`);
  }

  return response.json();
}

async function createRecord(pds, accessJwt, { repo, collection, record }) {
  const url = new URL("/xrpc/com.atproto.repo.createRecord", pds);
  return postJson(url, accessJwt, {
    repo,
    collection,
    rkey: generateTid(),
    validate: false,
    record,
  });
}

async function putRecord(pds, accessJwt, { repo, collection, rkey, record }) {
  const url = new URL("/xrpc/com.atproto.repo.putRecord", pds);
  return postJson(url, accessJwt, {
    repo,
    collection,
    rkey,
    validate: false,
    record,
  });
}

async function deleteRecord(pds, accessJwt, { repo, collection, rkey }) {
  const url = new URL("/xrpc/com.atproto.repo.deleteRecord", pds);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${accessJwt}`,
    },
    body: JSON.stringify({ repo, collection, rkey }),
  });

  if (!response.ok) {
    fail(`POST ${url} failed: ${response.status} ${await response.text()}`);
  }
}

const BASE32_SORTABLE = "234567abcdefghijklmnopqrstuvwxyz";
let tidClockId = Math.floor(Math.random() * 1024);

function generateTid() {
  const micros = BigInt(Date.now()) * 1000n;
  tidClockId = (tidClockId + 1) % 1024;
  let value = ((micros << 10n) | BigInt(tidClockId)) & 0x7fffffffffffffffn;
  let tid = "";

  for (let i = 0; i < 13; i += 1) {
    tid = BASE32_SORTABLE[Number(value & 31n)] + tid;
    value >>= 5n;
  }

  return tid;
}

function rkeyFromUri(uri) {
  return uri.slice(uri.lastIndexOf("/") + 1);
}

function sameJson(left, right) {
  return stableJson(left) === stableJson(right);
}

function stableJson(value) {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableJson(value[key])}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

function printReport({ did, pds, publication, publicationAction, posts, creates, updates, skips, deletes }) {
  console.log(apply ? "Standard.site sync plan" : "Standard.site dry run");
  console.log(`Repo: ${CONFIG.handle} (${did})`);
  console.log(`PDS: ${pds}`);
  console.log(`Site: ${CONFIG.siteUrl}`);
  console.log("");

  console.log(`Publication: ${publicationAction} ${publication.uri}`);

  console.log(`Local posts: ${posts.length}`);
  console.log(`Documents: ${creates.length} create, ${updates.length} update, ${skips.length} skip, ${deletes.length} delete`);
  console.log("");

  printList("Create", creates.map((document) => document.path));
  printList(
    "Update",
    updates.map(({ desired, remote }) => `${desired.path} (${remote.uri})`),
  );
  printList("Delete", deletes.map((record) => `${record.value.path} (${record.uri})`));

}

function printList(label, items) {
  if (items.length === 0) return;
  console.log(label);
  for (const item of items) {
    console.log(`  - ${item}`);
  }
  console.log("");
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

main().catch((error) => fail(error instanceof Error ? error.stack || error.message : String(error)));
