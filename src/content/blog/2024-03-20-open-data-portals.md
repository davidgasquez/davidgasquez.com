---
title: "Building Open Data Portals in 2024"
date: 2024-03-20
slug: modern-open-data-portals
---

If you look into the [Open Data ecosystem](https://davidgasquez.com/handbook/open-data) you'll realize tools and approaches we use there are different from the ones we use at the data teams of small to medium companies.

I'm sure [these differences are there for many reasons](https://en.wiktionary.org/wiki/Chesterton%27s_fence), the main one being that open data is not a technological problem to begin with. That said, I wanted to explore the idea of **building open data portals** using some of the tools, libraries, frameworks, and ideas I've been using and loving in the last few years.

## The Pattern

The gist of the idea I experimented with is:

1. Rely on open source tools (Python, DuckDB, Dagster, dbt) and formats (Parquet, Arrow).
2. Use declarative and stateless transformations tracked in git.
3. Split the workload in two phases; **build and serve** ¹.
   1. Build in your laptop, in GitHub Actions, or in a big server.
   2. Publish artifacts as static files.
      - Datasets as [Parquet files somewhere](https://www.robinlinacre.com/parquet_api/).
      - Documentation (catalog, reports, dashboards) as static websites.

The result of following these ideas is [Datadex](https://github.com/davidgasquez/datadex), an open-source, serverless, and local-first Data Platform that aims to improve how small to medium communities collaborate on Open Data. It is not a new tool itself, only a pattern showing an opinionated bridge between some of the existing ones (DuckDB, Dagster, dbt, Quarto, Evidence.dev, ...).

This pattern turned out to work very well and I've been even using it in a couple of production ready Data Portals ([1](https://github.com/davidgasquez/filecoin-data-portal), [2](https://github.com/davidgasquez/gitcoin-grants-data-portal)) since then (both public and private). Let's take a look at some of the benefits.

## Benefits

- The resulting Data Portals are lean. **You can run them end to end on your laptop or on top of GH actions**! (or any other CI/CD tool) as they're both performant and self-contained.
  - A `make run` will get you a bunch of files locally that you can put wherever you need and use with any tool you want.
- Infrastructure costs is... almost nothing. The **artifacts are static files**, so you can host them on S3, GH Pages, or any other static file hosting service in a very cheap way.
  - This pattern assumes the **data workloads are heterogeneous** (huge workload on load + transform, then sporadic queries on mostly aggregated and small data). This workload benefits from splitting into a "build" phase (big machine) and serve phase (small or no machine).
  - The same way [you probably don't have big data](https://motherduck.com/blog/big-data-is-dead/), you probably don't need the database for your weekly report being idle 90% of the time. Pulling all the data every day might be cheaper than maintaining a stateful database all day online with heterogeneous workloads.
  - Instead of relying on backend databases, it **relies on the frontend (JS/WASM) querying static assets** (data APIs). There is also the option to pre-render the frontend at build time and embed the static charts into the website...
- Open Data Portals usually offer datasets, this approach is also adds code (pipeline) and live documentation (readme, notebooks, reports) to the mix.
- **Anyone can reproduce the pipeline** and the artifacts locally or remotely (with Docker and Development Containers). This is a big win for reproducibility and transparency.
- The **transformations are modularized**. You can reuse other people's datasets or import their transformations (`from xxx.assets import yyy`).

## What's Next?

I'm planning to continue exploring this pattern and building more portals with it in the next few months. There are a few things I'd like to figure out, like building incremental models or how to best surface the available datasets and transformations to the users.

I'm also looking for other projects that are following a similar approach to learn from them. Here are a few that have inspired me:

- [PUDL](https://github.com/catalyst-cooperative/pudl/), a project that is doing following a similar approach but focusing on the US energy sector.
- [Source Cooperative](https://source.coop/), a data publishing utility for folks to share data products using standard HTTP methods.
- [PyCode.org](https://py-code.org/), a project to make it easy to analyze the Python ecosystem by providing of all the code ever published to PyPI via git, parquet datasets with file metadata, and a set of tools to help analyze the data.
- This overall pattern is similar to what Simon Willison calls [baked data](https://simonwillison.net/2021/Jul/28/baked-data/) or the [Splitgraph DDN](https://www.splitgraph.com/connect/query). At the same time, projects like [Evidence](https://evidence.dev/) and [Observable Framework](https://observablehq.com/) are also exploring similar ideas.

If you're working on something similar or have any feedback, I'd love to hear from you!

¹ Or as [Jake Thomas](https://www.linkedin.com/feed/update/urn:li:activity:7185534737313112065?commentUrn=urn%3Ali%3Acomment%3A%28activity%3A7185534737313112065%2C7186004090596859904%29&dashCommentUrn=urn%3Ali%3Afsd_comment%3A%287186004090596859904%2Curn%3Ali%3Aactivity%3A7185534737313112065%29) puts it:

  1. Build the thing using generalized tools
  2. Serve the thing using specialized tools for a particular workload

You can tune and fiddle with basically everything this way - cost, performance, availability, etc.
