---
title: Collaborative Dependency Graphs
date: 2026-03-12
slug: collaborative-dependency-graphs
---

We do not mostly need better allocators for the last step of [public goods funding](/handbook/public-goods-funding/). We need better [coordination](/handbook/coordination/) around what depends on what. A good dependency graph should be a shared pool of contestable, versioned, provenance-rich claims that many groups can turn into their own trusted views.

Current dependency graphs usually fail in the same way. One actor publishes a graph, it goes stale, it mostly captures code, and nobody can tell which edges are well-supported, disputed, or simply missing. If the source graph is bad, better allocation [mechanisms](/handbook/mechanism-design/) downstream will not save us.

## Claims, not facts

Instead of storing _"project A depends on project B"_ as a fact, store it as an assertion.

A minimal claim might look like this:

```json
{
  "relation": "depends_on",
  "source": "github.com/acme/app",
  "target": "pkg:npm/react",
  "scope": "app@v1.4.0"
}
```

And an attestation on top of it:

```json
{
  "claim": "claim:123",
  "stance": "challenge",
  "issuer": "did:plc:bob"
}
```

The point is simple: the edge and the disagreement are separate objects. A maintainer can publish a claim, a bot can extract one, and other people can support, narrow, or challenge it without overwriting anything. That is a better default for [resolving disagreement](/handbook/resolving-disagreement/).

## Borrow what already works

We do not need to invent this from scratch.

- [Wikibase](https://www.mediawiki.org/wiki/Wikibase/DataModel/Primer) already models statements with qualifiers, references, and ranks.
- [W3C PROV](https://www.w3.org/TR/prov-overview/) treats provenance as a first-class object.
- [AT Protocol moderation](https://atproto.com/guides/moderation) separates the shared data layer from trust overlays, using free-standing signed labels published by third parties.
- [Nanopublications](https://nanopub.net/guidelines/working_draft/) show how small assertions can carry attribution and provenance.
- [Data on the Web Best Practices](https://www.w3.org/TR/dwbp/) pushes durable identifiers, resolvable identifiers, versioning, and reuse.

The components exist. We mostly need to compose them.

## A shared claim graph, many curated views

The important thing is not to build one canonical dependency graph. Build a shared [knowledge graph](/handbook/knowledge-graphs/) of claims, then let different communities derive different views from it.

A dependency graph is not the database. It is a query plus a trust policy.

In that model, the base object is a claim, and agreement or disagreement lives in separate attestations. You do not overwrite an edge; you add signed context around it.

Imagine a repository that uses a library, implements a standard, and was heavily shaped by a paper:

- `github.com/acme/chat` depends on `pkg:npm/ws`
- `github.com/acme/chat` implements `RFC 6455`
- `github.com/acme/chat` was influenced by a paper with DOI `10.xxxx/abcd`

A maintainer-focused view may only include self-declared and reviewed software dependencies. A researcher-focused view may also include papers and standards. A funder may want a stricter view that only includes edges with multiple attestations. Same underlying claim pool, different derived graphs.

That is a more [plural](/handbook/plurality/) design. It avoids turning one imperfect graph into a single source of truth for everyone.

## How it stays current

The graph should be maintained locally, claim by claim, not globally. That is as much a [governance](/handbook/governance/) problem as a technical one, and it only works if entities have stable identifiers with explicit merge and split rules.

A simple loop could be:

1. Maintainers self-declare important edges.
2. Bots scan manifests, citations, references, issue trackers, and release notes to suggest candidate claims.
3. Reviewers publish attestations that support, refine, or challenge claims.
4. New versions create new claims instead of overwriting history.
5. Curators publish trust overlays and ranked views for their communities, more like a [decentralized protocol](/handbook/decentralized-protocols/) than a single database.

Humans are good at ambiguity, incentives, and boundary cases. Machines are good at harvesting candidate edges. That division of labor seems much more realistic than expecting either side to do everything.

A challenge process matters too. If self-declaration is enough to move money, people will game it. Claims should be easy to propose, but also easy to contest. A good default is soft schema plus strong validation: keep the core vocabulary small, let messy claims in, and publish constraint violations, public diffs, and bot behavior instead of pretending bad data will disappear on its own. Whether that contest process uses review queues, reputation, staking, or markets is an [incentives](/handbook/incentives/) question, not the foundation.

## Why this matters for funding

Overall, funding should be downstream as there are really three layers here:

1. **Graph layer:** claims about relationships.
2. **Policy layer:** which issuers, evidence types, and scopes you trust.
3. **Funding layer:** the formula that turns a chosen view into allocations.

That separation is useful. It prevents _"the graph says so, therefore money flows so"_. Communities can argue about whether an edge is supported without collapsing that argument into one hard binding allocation rule, and any downstream score should be traceable back to cited claims and recomputable from a public snapshot.

With this approach we are not forcing one final answer, but helping groups find legible areas of agreement and disagreement.

## Open questions

A few hard problems remain:

- How do we prevent spam without making contribution too hard?
- What is the right balance between bot extraction and human review?
- How do we model non-code dependencies without endless ontology fights?
- When should a query return a graph, and when should it force a DAG projection?
- What should challengers or curators have at stake when they make bad calls?

## Conclusion

We do not need a perfect canonical map of interdependence. We need a shared, contestable substrate of claims about dependencies, with good provenance, durable identifiers, and versioning. Then different communities can derive their own views, trust their own curators, and plug those views into funding or coordination mechanisms.

Better coordination starts upstream, with better legible artifacts.

---

*Implementation note for a small POC: keep the graph as a derived view and store only a few append-only record types in Git — `entity`, `claim`, `attestation`, `evidence`, and optional `label` — as small YAML files. Make `claim` the core unit (`subject`, `relation`, `object`, `qualifiers`, `evidence`, `issuer`, `createdAt`, `status`, `supersedes`), let `attestation` support, refine, or challenge claims, keep the relation set tiny (`dependsOn`, `uses`, `cites`, `implements`, `derivedFrom`, `maintainedBy`, `funds`), and generate each dependency graph by filtering those records through a trust policy and query. A first repo could just be directories of YAML plus a simple script that materializes a view.*
