---
title: "Growing My Own Data Platform"
date: 2026-04-22
slug: growing-my-own-data-platform
---

It has been a few months since I wrote about [Barefoot Data Platforms](/barefoot-data-platforms). Since then, I've been applying those ideas into a [real data platform](https://github.com/davidgasquez/filecoin-data-portal) I rebuilt from scratch. Learned a lot about what makes these platforms work well, especially with agents.

## Building It

The entire orchestration engine ([`fdp`](https://github.com/davidgasquez/filecoin-data-portal/tree/main/fdp)) is ~700 lines of Python. Assets are plain `.sql` or `.py` files with [ugly but useful metadata in comments](https://github.com/davidgasquez/filecoin-data-portal/blob/b95ee0f8c29c56f9a89527e1427f996a8cdaf3f6/assets/main/clients.sql#L1-L34). No decorators, no registration, no config files. Drop a file in `assets/`, and the next run picks it up, resolves dependencies, and materializes it! Delete the file, and it's gone too!

This minimalism makes data pipelines a great fit for agents:

- **Assets are self-contained**. Metadata, docs, dependencies, and tests live in the same file. An agent can't accidentally separate them.
- **Schemas are the API**. Technical debt stays contained inside assets path. Treat the output schema as the contract so the internals can be messy when needed.
- **The whole platform fits in a context window**. Agents can operate and evolve the entire orchestration layer (`fdp`) reliably. Same for the DAG! If you can fit a column's full lineage in context, changing it with an agent becomes smooth.
- **Search before write**. The repo is indexed with [`qmd`](/sharing-a-qmd-index-with-a-team) (including external Filecoin docs). Agents query domain knowledge before hallucinating business logic.

The feedback loop is tight. `make check` catches type and lint issues, `fdp test` catches data issues. Agents self-correct. [Reliable unreliability](/reliable-unreliability) at work.

Inspired by [Pi](pi.dev), I see this as a compelling **self-modifying** data platform. When I wanted to publish tables to Google Sheets, I asked the agent to build `fdp publish gsheet`. It read the existing R2 publish target, understood the pattern, and wrote the new one. The platform is growing to be exactly what I need, all within the context window of today's agents!

## Serving the Data

Up until recently, users were redirected to a website with documentation on the Parquet files and a few example uses. Even though it might be simple for me, this created lots of friction.

Taking inspiration from [Tempo docs agent UX](https://docs.tempo.xyz/guide/getting-funds), I made a [`SKILL.md`](https://filecoindataportal.xyz/SKILL.md) (auto-generated from live data and published alongside the datasets) that lists every available dataset with columns and descriptions, points to the Parquet files, and teaches agents how to query and visualize them. Anyone can open Codex, Pi, Claude, or any other agent and say:

> Read https://filecoindataportal.xyz/SKILL.md and tell me which providers onboarded more data last week

Nothing else is required. The agent reads the skill, fetches the Parquet file with wathever tools the users has (`duckdb`, Javascript, ...), runs the query, and answers. People have been doing exactly this with different agents and it works better than I expected.

Users shouldn't blindly trust the agent's responses, but now they have something to poke with quick data requests that forces them to be specific and clear. I can then be notified after a session with the clarified questions and agent output.
