---
title: "Indexing and Sharing Organizational Context with qmd"
date: 2026-04-17
slug: sharing-a-qmd-index-with-a-team
---

I found [`qmd`](https://github.com/tobi/qmd) to be great for turning a pile of docs, repos and other resources into something you can actually query without worring too much about the setup. I wanted to share the experience of having your agent figure something tricky out without having to force folks to run a bunch of CLI commands like `qmd embed`.

I ended up with a setup I like a lot, having **the index managed declaratively in git and publishing daily SQLite databases with the embeddings**.

## Making It Declarative

I wrote a [tiny ~10 line wrapper](https://github.com/davidgasquez/dotfiles/commit/5de0ae7112ecc4c3377083ce3485477dc860894c) that makes that if the current folder has a `.qmd/` directory, it points `qmd` to that local config and local index. Within a project, `qmd` will only see that project index and collections.

That also makes [`index.yml`](https://raw.githubusercontent.com/tobi/qmd/refs/heads/main/example-index.yml) easy to version control and share. Instead of living in my machine and memory, the index definition now lives in the (shared) repo.

## Making It Shared

Once I wanted to share this with the team, I had two obvious options.

### 1. Share the `index.yml`

This works for technical folks but might not be smooth for non technical ones (even in the age of clankers, you need to know the right spells!). Consumers need the source code, they need to run `qmd update`, they need to run `qmd embed`, and they need to keep everything fresh over time! Not great.

### 2. Host an MCP server

This is the "correct and boring" option as `qmd` supports MCP already, and you can even host MCP servers for free with [Hugging Face Spaces](https://huggingface.co/docs/hub/spaces-mcp-servers).

I decided **not** to go that route. I'm honestly not a fan of MCPs, and I prefer all my infrastructure to be more local friendly (I don't like managing servers).

## Making It Accessible

Instead, I decided to distribute a prebuilt index, similar to how I distribute datasets. I put together the [`filecoin-docs-qmd`](https://github.com/davidgasquez/filecoin-docs-qmd) repo to package a curated Filecoin docs index and publish it.

The flow is simple:

1. I keep the curated list of sources on GitHub
2. Every day, a GitHub Actions runs `qmd update` and `qmd embed`, compresses the SQLite DB and publishes it.
3. Users run a small installation script that downloads the latest database (<50MB) and sets up `qmd`

After that, people can just do:

```bash
qmd --index filecoin query "how does lotus handle deal onboarding"
```

This feels like a good middle ground.

- The source of truth is still declarative and version controlled.
- The artifact is self-contained and easy to install.
- The UX stays local and CLI-friendly.
- I don't need to force MCP on anyone.

## Making It Smooth

Something I haven't got to is to fork `qmd` and make it so it supports remote indexes. The entire process could be simplified for users to the following!

```bash
qmd --index https://awesomedomain.io/qmd.sqlite query "how do we count active users"
```
