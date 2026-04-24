---
title: "Growing My Own Data Platform"
date: 2026-04-22
slug: growing-my-own-data-platform
---

It has been a couple of months since I wrote about [Barefoot Data Platforms](/barefoot-data-platforms). Since then, I've been applying those ideas to a [real data platform](https://github.com/davidgasquez/filecoin-data-portal) I've been rebuilding from scratch. I've learned a lot about what makes these platforms work well, especially with agents.

## Building It

As a quick overview, the entire orchestration engine ([`fdp`](https://github.com/davidgasquez/filecoin-data-portal/tree/main/fdp)) is ~700 lines of Python. Assets are plain `.sql` or `.py` files with [ugly but useful metadata in comments](https://github.com/davidgasquez/filecoin-data-portal/blob/b95ee0f8c29c56f9a89527e1427f996a8cdaf3f6/assets/main/clients.sql#L1-L34). No decorators, no registration, no config files. You can drop a file in `assets/`, and the next run picks it up, resolves dependencies, and materializes it! Delete the file, and it's gone too.

This minimalist, low-abstraction, filesystem-based data platform is a great fit for agents:

- **Assets are self-contained**. Metadata, docs, dependencies, and tests live in the same file. Keeping things up to date is trivial, especially with `fdp check` and other custom linters.
- **Schemas are the API**. Technical debt stays contained inside asset paths. Treat the output schema as the contract so the internals can be messy when needed.
- **The whole platform fits in a context window**. Agents can operate and evolve the entire orchestration layer (`fdp`) reliably. Same thing for the DAG (`assets/` folder)! If you can fit a column's full lineage in context, changing it with an agent becomes smooth and less error-prone.
- **Search before write**. The repo and useful context (external docs, repositories, APIs, ...) are indexed with [`qmd`](/sharing-a-qmd-index-with-a-team). Agents see the actual domain knowledge before writing, so they hallucinate business logic less often.

The DX feedback loop is tight. Change an asset, `make check` catches type and lint issues, materialize it, and `fdp test` catches data issues. Agents are able to self-correct quite [reliably](/reliable-unreliability).

Inspired by [Pi](https://pi.dev), I see this as a compelling **self-modifying** data platform. When I wanted to publish tables to Google Sheets, I asked the agent to build `fdp publish gsheet`. It read the existing R2 publish target, understood the pattern, and wrote the new one. The platform is growing to be exactly what I need, all within the context window of today's agents!

This domain is not rocket science, so I'm convinced I can keep the `fdp` code small and have extensions for the different concepts. The kernel should only discover assets, resolve dependencies, execute assets, materialize results, run checks, and introspect. Everything outside the kernel belongs in userland, including adapters for Python, SQL, Bash, notebooks, and external tools, targets/materializers for tables, views, files, APIs, and sinks, publishers for GSheets, R2, APIs, etc.

## Serving the Data

I also spent quite a while thinking about the end-user/stakeholder experience. Up until recently, users were redirected to a website with documentation on the Parquet files and a few examples and use cases (e.g., how to consume them from a public spreadsheet). This clearly created friction and only a handful relied on the public sheets or files.

Taking inspiration from [Tempo's agent-focused docs UX](https://docs.tempo.xyz/guide/getting-funds), I made a [`SKILL.md`](https://filecoindataportal.xyz/SKILL.md) (auto-generated from live data and published alongside the datasets) that lists every available dataset with columns and descriptions, points to the Parquet files, and teaches agents how to query and visualize them. Anyone can open Codex, Pi, Claude, or any other agent and say:

> Read https://filecoindataportal.xyz/SKILL.md and tell me which providers onboarded the most data last week

Nothing else is required. The agent reads the skill, fetches the Parquet file with whatever tools the user has (`duckdb`, JavaScript, ...), runs the query, and answers. People have been doing exactly this with different agents and it works better than I expected.

Users shouldn't blindly trust the agent's responses, but now they have something to poke with quick data requests that force them to be specific and clear. I can then be notified after a session with the clarified questions and agent output.

## Conclusion

I'm very happy with this iteration and approach so far. It is both fast to iterate on and to work with. No major downsides for now, but I'm sure something will pop up!

As for the future, I'll probably keep expanding the different resources (e.g., [`fdp` can run SQL files on BigQuery](https://github.com/davidgasquez/filecoin-data-portal/blob/main/assets/raw/verified_registry_claims.sql#L4)) and continue thinking about the minimal kernel I need for this platform.
