---
title: Collaborative Dependency Graphs
date: 2026-03-12
slug: collaborative-dependency-graphs
---

**TLDR: We do not mostly need better funding allocations for on [public goods funding](/handbook/public-goods-funding/) but better mechanisms for discussing and [coordinating](/handbook/coordination/) what to propose and how we get to consensus in a reliable way.**

In the mechanisms I've been participating, the "source"/"map" has been in the shape of a graph of projects, or list of dependencies. This graph alway comes from one entity and is been "fixed" from the start. We need better around what depends on what. **A good dependency graph should be a shared pool of contestable, versioned, provenance-rich claims that many groups can turn into their own trusted views**.

Current dependency graphs usually fail in the same way. One actor publishes a graph, it goes stale, it mostly captures code, and nobody can tell which edges are well-supported, disputed, or simply missing. If the source graph is bad, better allocation [mechanisms](/handbook/mechanism-design/) downstream will not save us. 

This is more important now as we keep adding more AI into our processes. We need to make these contraptions legible for humans and machines!

What follows is my initial proposal. Making something like a dependency tree legible is a lot more of a governance/consensus finding process (ontology fights, automation spam, ...) than a technical one, so you shouldn't listen to me seriously, I'm just sharing the idea.

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

The point is simple: the **edge and the disagreement are separate objects**. A maintainer can publish a claim, a bot can extract one, and other people can support, narrow, or challenge it without overwriting anything. That is a better default for [resolving disagreement](/handbook/resolving-disagreement/).

<figure>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 180" role="img" aria-labelledby="claims-title claims-desc" style="width:100%;height:auto;display:block;margin:1.5rem auto;">
  <title id="claims-title">Claims and attestations are separate objects</title>
  <desc id="claims-desc">A repository node points to a package node with a dependsOn claim, while a separate challenge attestation points to that claim.</desc>
  <rect x="1.5" y="1.5" width="717" height="177" rx="18" fill="#111111" stroke="rgba(255,255,255,0.10)" stroke-width="1.5" />

  <rect x="58" y="56" width="190" height="58" rx="14" fill="rgba(202,138,4,0.08)" stroke="#ca8a04" stroke-width="2" />
  <text x="78" y="92" fill="#f5f5f5" font-size="17" font-family="JetBrains Mono, monospace">acme/app repo</text>

  <rect x="472" y="56" width="190" height="58" rx="14" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.16)" stroke-width="2" />
  <text x="492" y="92" fill="#f5f5f5" font-size="17" font-family="JetBrains Mono, monospace">pkg:npm react</text>

  <path d="M248 85 C 320 85, 400 85, 472 85" fill="none" stroke="rgba(245,245,245,0.55)" stroke-width="2.5" />
  <text x="289" y="66" fill="#9ca3af" font-size="16" font-family="JetBrains Mono, monospace">claim: dependsOn</text>

  <rect x="293" y="108" width="134" height="34" rx="17" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.14)" stroke-width="1.5" />
  <text x="321" y="130" fill="#f5f5f5" font-size="15" font-family="JetBrains Mono, monospace">challenge</text>
  <path d="M360 108 C 360 96, 360 92, 360 85" fill="none" stroke="rgba(156,163,175,0.75)" stroke-width="2" stroke-dasharray="5 5" />
</svg>
<figcaption style="font-size: 0.9rem;"><em>The edge is one object, support or challenge lives next to it, not inside it.</em></figcaption>
</figure>

## Borrow what already works

We do not need to invent this from scratch.

- [Wikibase](https://www.mediawiki.org/wiki/Wikibase/DataModel/Primer) already models statements with qualifiers, references, and ranks.
- [W3C PROV](https://www.w3.org/TR/prov-overview/) treats provenance as a first-class object.
- [AT Protocol moderation](https://atproto.com/guides/moderation) separates the shared data layer from trust overlays, using free-standing signed labels published by third parties. One underlying object space, but many competing trust overlays!
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

With this approach we are not forcing one final answer, but **helping groups find legible areas of agreement and disagreement**.

## Open questions

A few hard problems remain:

- What is the right balance between bot extraction and human review?
- How do we model non-code dependencies without endless ontology fights?
- What should challengers or curators have at stake when they make bad calls?
- How would a market-like mechanism that dynamically discovers and validates edges look like?
- Should curators of "views"/"materializations"/"projections" earn some percentage of the funding for their services? 

## Conclusion

We do not need a perfect canonical map of interdependence. We need a shared, contestable substrate of claims about dependencies, with good provenance, durable identifiers, and versioning. Then different communities can derive their own views, trust their own curators, and plug those views into funding or coordination mechanisms.

Better allocation mechanisms (like Deep Funding) won’t help if the underlying layer is not credible neutral. **Better coordination starts upstream, with better legible artifacts.**

---

*How could a POC look like? Keep the graph as a derived view and store only a few append-only record types in Git — `entity`, `claim`, `attestation`, `evidence`, and optional `label` — as small YAML files. Make `claim` the core unit (`subject`, `relation`, `object`, `qualifiers`, `evidence`, `issuer`, `createdAt`, `status`, `supersedes`), let `attestation` support, refine, or challenge claims, keep the relation set tiny (`dependsOn`, `uses`, `cites`, `implements`, `derivedFrom`, `maintainedBy`, `funds`), and generate each dependency graph by filtering those records through a trust policy and query. A first repo could just be directories of YAML plus a simple script that materializes a view.*
