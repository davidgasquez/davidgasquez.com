---
title: "Indexing and Sharing Organizational Context with qmd"
date: 2026-04-17
slug: sharing-a-qmd-index-with-a-team
---

Data engineering is mostly context gathering. It involves tons of time spent going through code, docs, specs, issues, and conversations to figure out how stakeholders want active users to be counted. [`qmd`](https://github.com/tobi/qmd) turns that pile of documents into something you can actually query without worrying about low-level technical details (embeddings, rerankers, ...), which makes it useful for both me and my agents.

Sharing only `qmd`'s `index.yml` still makes every consumer fetch the sources, run `qmd update` and `qmd embed`, and take responsibility for keeping everything fresh. Hosting `qmd`'s MCP server avoids that work, but introduces a service to deploy and operate.

My goal was to share that indexed knowledge with colleagues without forcing them to run CLI commands like `qmd embed`.

To explore this problem, I ended up building [a way](https://github.com/davidgasquez/filoscope) to **manage the corpus declaratively in Git and distribute a prebuilt SQLite index**.

## Tracking Sources

Each Filoscope collection is a small YAML file (similar to what you'd put in `qmd`'s `index.yml`) describing where its content comes from, what it means, and which files belong in the index:

```yaml
source: github:filecoin-project/lotus
context: Go implementation of the Filecoin Lotus node, miner, worker, and gateway.
pattern: "**/*.{md,go,sh,toml,json,yml,yaml}"
```

Filenames become collection names. Running `filoscope sync` invokes a bundled [connector](https://github.com/davidgasquez/filoscope/tree/main/connectors), which in this case materializes a GitHub repository into one folder per collection and generates the qmd configuration named `filoscope`.

The generated folders, qmd config, and SQLite database are derived state. The [collection manifests](https://github.com/davidgasquez/filoscope/tree/main/collections) and connectors are the only source of truth for the corpus.

## Updating Embeddings

A [daily GitHub Action](https://github.com/davidgasquez/filoscope/blob/main/.github/workflows/build-index.yml):

1. Pulls the latest published index so unchanged documents keep their embeddings.
2. Syncs every declared collection.
3. Runs `qmd update`, `qmd embed`, and `qmd cleanup` (on CPU!).
4. Validates the database and publishes it as a compressed GitHub release artifact.

The resulting SQLite file contains the documents, full-text index, and vectors. Building it centrally means consumers do not need the source repositories or the compute required to embed them.

## Sharing the Index

I published a small [`SKILL.md`](https://github.com/davidgasquez/filoscope/blob/main/SKILL.md), so the main user-facing interface of `filoscope` can be a prompt:

```text
Read https://raw.githubusercontent.com/davidgasquez/filoscope/refs/heads/main/SKILL.md and tell me how Filecoin Pay Rails work
```

The skill tells the agent to pull the current artifact with `npx filoscope pull`. The command checks the latest release tag, downloads and validates the database only when the tag changes, and installs it as `~/.cache/qmd/filoscope.sqlite`.

`filoscope` bundles `qmd`, which remains responsible for search and retrieval, so users can invoke both through `npx`.

```bash
npx --package filoscope qmd --index filoscope query \
  "how do storage providers prove storage over time"
```

## Conclusion

This low-cost setup turns out to be a flexible and modular way of sharing packaged knowledge with agents and fellow humans! Thanks to `qmd`, the job of `filoscope` is stitching things together and writing boring unstructured data pipelines. Overall, I think this is a good approach for public, read-only knowledge bases that need to be curated by a community! You get easy-to-access resources with no maintenance or servers needed.
