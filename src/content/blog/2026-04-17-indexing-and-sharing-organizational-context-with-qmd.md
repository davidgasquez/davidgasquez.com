---
title: "Indexing and Sharing Organizational Context with qmd"
date: 2026-04-17
slug: sharing-a-qmd-index-with-a-team
---

Data engineering is mostly context gathering. Tons of moments of going though code, docs, specs, issues, conversations to figure out how stakeholders want active users to be counted. [`qmd`](https://github.com/tobi/qmd) turns that pile of documents into something you can actually query without worrying about setup, which makes it useful for both me and my agents. I wanted to share that indexed knowledge with colleagues without forcing them to run CLI commands like `qmd embed`.

I ended up with a setup I like: **the index is managed declaratively in git, and a daily CI job publishes a SQLite database with the embeddings**.

## Making It Declarative

I wrote a [tiny ~10 line wrapper](https://github.com/davidgasquez/dotfiles/commit/5de0ae7112ecc4c3377083ce3485477dc860894c) so that if the current folder has a `.qmd/` directory, `qmd` points to that local config and index. Within a project, `qmd` only sees that project's index and collections.

That also makes [`index.yml`](https://raw.githubusercontent.com/tobi/qmd/refs/heads/main/example-index.yml) easy to version control. Instead of living in my machine and memory, the index definition lives in the repo.

## Making It Shared

Once I wanted to share this with the team, I had two obvious options.

### 1. Share the `index.yml`

This works for technical folks but is not smooth for everyone else (even in the age of clankers, you need to know the right spells!). Consumers need the source code, need to run `qmd update`, need to run `qmd embed`, and need to keep everything fresh over time. Not great.

### 2. Host an MCP server

The "correct and boring" option. `qmd` supports MCP already, and you can even host MCP servers for free with [Hugging Face Spaces](https://huggingface.co/docs/hub/spaces-mcp-servers).

I decided **not** to go this route. I prefer my infrastructure local-friendly and I don't like managing servers.

## Making It Accessible

Instead, I distribute a prebuilt index, similar to how I [distribute datasets](/barefoot-data-platforms). I put together the [`filecoin-docs-qmd`](https://github.com/davidgasquez/filecoin-docs-qmd) repo to package a curated Filecoin docs index and publish it.

The flow is simple:

1. A curated list of sources lives on GitHub.
2. Every day, a GitHub Action runs `qmd update` and `qmd embed`, compresses the SQLite DB, and publishes it.
3. Users run a small installation script that downloads the latest database (<50MB) and sets up `qmd`.

After that, anyone can do:

```bash
qmd --index filecoin query "how does lotus handle deal onboarding"
```

A good middle ground:

- Source of truth is declarative and version controlled.
- The artifact is self-contained and easy to install.
- UX stays local and CLI-friendly.
- No MCP forced on anyone.

## Making It Smooth

Something I have not gotten to yet: forking `qmd` to support remote indexes. The entire process could be simplified to:

```bash
qmd --index https://awesomedomain.io/qmd.sqlite query "how do we count active users"
```
