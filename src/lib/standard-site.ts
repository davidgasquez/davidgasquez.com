export const STANDARD_PUBLICATION_URI = "at://did:plc:4z5i7njrld66ew36htufcwry/site.standard.publication/3mo43d2tmt2ov";

const DID = "did:plc:4z5i7njrld66ew36htufcwry";
const PDS = "https://puffball.us-east.host.bsky.network";
const DOCUMENT_COLLECTION = "site.standard.document";

type AtprotoRecord = {
  uri: string;
  value?: {
    site?: unknown;
    path?: unknown;
  };
};

export async function getStandardDocumentUrisByPath() {
  const records = await listRecords(DOCUMENT_COLLECTION);
  const documents = new Map<string, string>();

  for (const record of records) {
    if (record.value?.site !== STANDARD_PUBLICATION_URI) continue;
    if (typeof record.value.path !== "string") {
      throw new Error(`Standard.site document ${record.uri} is missing path`);
    }
    if (documents.has(record.value.path)) {
      throw new Error(`Duplicate Standard.site document path: ${record.value.path}`);
    }

    documents.set(record.value.path, record.uri);
  }

  return documents;
}

async function listRecords(collection: string) {
  const records: AtprotoRecord[] = [];
  let cursor: string | undefined;

  do {
    const url = new URL("/xrpc/com.atproto.repo.listRecords", PDS);
    url.search = new URLSearchParams({
      repo: DID,
      collection,
      limit: "100",
      ...(cursor ? { cursor } : {}),
    }).toString();

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to list ${collection}: ${response.status} ${await response.text()}`);
    }

    const body = (await response.json()) as { records?: AtprotoRecord[]; cursor?: string };
    records.push(...(body.records ?? []));
    cursor = body.cursor;
  } while (cursor);

  return records;
}
