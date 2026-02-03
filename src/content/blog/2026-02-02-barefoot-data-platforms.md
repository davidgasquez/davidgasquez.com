---
title: "Barefoot Data Platforms"
date: 2026-02-02
slug: barefoot-data-platforms
---

I've been maintaining an [open source and local-first data platform for the Filecoin ecosystem](https://github.com/davidgasquez/filecoin-data-portal) while keeping some fun [constraints and principles](https://github.com/davidgasquez/filecoin-data-portal?tab=readme-ov-file#-key-features). I previously wrote about the [pattern](https://datadex.datonic.io/), [related ideas](/modern-open-data-portals), and why I think this [makes these platforms work very well at the community level](/community-level-open-data-infrastructure).

Recently, I've been pondering two things. **Can these be simpler?** and, **do we really need Dagster and dbt in the age of ~~clankers~~ agents**? Don't get me wrong, these frameworks are useful and you should definitely use them. In this post I'm exploring how a platform could look like without them.

You might have noticed "agents" are here, and I think people will mostly be interacting with code through them. This makes frameworks less relevant, especially when agents can write tons of boilerplate fast and correctly.

Before jumping into the details, I wanted to share a couple of ideas that have inspired me to take this approach:

1. [You can build simple software that works very well](https://shittycodingagent.ai/). There are many shitty data platforms, but this one is mine.
2. [Maggie Appleton's Home Cooked Software and Barefoot Developers](https://maggieappleton.com/home-cooked-software). Most data platforms don't need to be as complex as professional industrial ones, they can be home-cooked.

In the past, I [wrote](/community-level-open-data-infrastructure) about the impact of having an opinionated data stack with the right frameworks and tools:

> The largest impact [...] is in **making curation, cleaning and joining datasets a smoother process** thus bringing more people into the collaboration process.

I now believe making the stack simpler will add another key property: **The simpler the stack, the more people can build pipelines with a prompt**.

## A Barefoot Data Platform

So, how does [a minimal and opinionated data platform look like](https://github.com/davidgasquez/barefoot-data-platform)? **Minimalism** for me here means low abstraction and no frameworks. You write your scripts. These scripts are *assets*, and these assets depend on each other [^1]. That's it. The opinion side of things is the interesting part. Here are the key ideas of the [Barefoot Data Platform](https://github.com/davidgasquez/barefoot-data-platform) I built:

- Classic functional, declarative, independent, composable, and idempotent transformations
- Co-located assets, metadata, and documentation so assets have everything needed to be understood and reproduced in the same file
- One storage layer. DuckDB or SQLite, Parquet files, or whatever you want as long as you define a `materialize` function
- Many automated checks (`ruff` with all the rules enabled, `ty`, data tests, `prek` hooks, custom `bdp check`, ...) for the agents

### Assets

Assets are files with some metadata and some optional magic (e.g. automated dataframe materialization, automated table creation from `select *` statements, ...). With all the magic enabled, a Python asset might look like this:

```python
# asset.name = base_numbers
# asset.schema = raw
import polars as pl

def base_numbers() -> pl.DataFrame:
    return pl.DataFrame({"value": [1, 2, 3]})
```

The dataframe will be materialized by the framework. The metadata at the top defines the asset name, schema, and dependencies.

A SQL one might look like this:

```sql
-- asset.name = filtered_numbers
-- asset.schema = raw
-- asset.depends = raw.base_numbers
select
    value * 2 as double_value
from raw.base_numbers
where value >= 2
```

Finally, you can also have plain bash assets that do whatever you want and are completely responsible for their own materialization and side-effects.

## Do they work?

I've been migrating the Filecoin Data Portal to something like the ["Barefoot Data Platform"](https://github.com/davidgasquez/barefoot-data-platform) and, surprisingly, it is working quite well. Especially for agents.

- The codebase is small and simple
- Agents can iterate the assets on isolated scripts
- All the checks are automated and enforced

Probably something that doesn't scale a lot but, for small-to-medium data platforms (this one had less than 200 assets), I think it might be a solid alternative!

Finally, I wanted to talk a bit about building this. I spent a few days thinking how I wanted it to look, and then implemented it in a couple of hours while cooking a delicious banana bread. This is fascinating to me. It is something I couldn't have done a few months ago. What a time to be a software developer! That said, I don't think 22-year-old David could have built it. There are a few years of painful experience behind these few lines of code.

[^1]: I really wanted to use Makefiles but they have two issues. One, Makefiles are not aware of tables inside a database, only files. Two, they need to be updated and kept in sync so the metadata lives outside the asset.
