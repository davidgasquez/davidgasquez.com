---
title: "Gitcoin Data Portal"
date: 2023-09-11
slug: gitcoin-data
---

Last week, I went on a rabbit hole after coming across [RegenData.xyz](https://gov.gitcoin.co/t/regendata-xyz-our-sybil-resistant-future-q3-2023-and-beyond/16474), an initiative to collect and surface grants data. I wanted to explore the idea of a fully local and open data portal.

If you don't like prose that much, [code is available at GitHub](https://github.com/davidgasquez/gitcoin-grants-data-portal). Check it out!

At Protocol Labs, I've done something similar with the [Filecoin Data Portal](https://github.com/davidgasquez/filecoin-data-portal); an open source and local friendly data hub for Filecoin data (chain and off chain). Think of Dune, but in your laptop! This portal at the same time was based in the [ideas I started exploring with Datadex a while back](https://github.com/davidgasquez/datadex). Turns out that chain data is such a great fit for testing things that might work in the the larger "open data movement". [Chain data is useful/needed, open, and, immutable](https://davidgasquez.github.io/blockchain-data-pipelines/)! All great properties for this kind of approach.

Gitcoin Grant data is being exposed via the [Indexer Grants Stack Data API](https://indexer-grants-stack.gitcoin.co/data/), so, the work was mostly porting things out and dealing with the nitty gritty of the data!

## Exploring the Data

Before jumping into the portal itself, I wanted to see the kind of data exposed and which format/schemas were available. That means downloading the entire indexed dataset to my laptop. [The fastets solution I found was to use `lftp`](https://davidgasquez.github.io/fast-http-folder-download/). In this case, the command was:

```bash
lftp -c 'mirror --parallel=200 https://indexer-grants-stack.gitcoin.co/data/1/ ;exit'
```

Is not the fastest thing in the world as it has to paginate through all the folders, but will download all the JSONs to your machine!

Then, I joined the JSONs locally (doing ugly things like `cat */rounds/*/votes.json | jq .[] -c > round_votes.json`) and started running SQL queries on top of them with DuckDB.

These steps alone give you the ability to query all Gitcoin Grant data with SQL in your laptop. Easy and fast!

The two main takeaways (which could probably derived from the Allo Indexer repository) I came up are:

- Data exposed in the indexer is very denormalized. Makes sense as the goal was to provide an API at multiple levels. I suspect we can rebuild most of the JSON files from the rawest ones. For example, there are some tricky `contributors/*` folders with lots of subfolders which might not be needed at all.
- When doing random queries, I came across lots of "test data". We should filter it out downstream but I have no idea how to spot them.

## The Data Portal

Since I already worked on the Filecoin Data Portal, I went with the same approach, reuse the Datadex ideas and stack.

> [Gitcoin Data Portal Repository in Github](https://github.com/davidgasquez/gitcoin-grants-data-portal)

The first thing was to create the [relevant Dagster assets](https://github.com/davidgasquez/gitcoin-grants-data-portal/blob/main/ggdp/assets.py). These act as the _extract_ and _load_ part of the pipeline and are [later transformed by `dbt` with SQL queries](https://github.com/davidgasquez/gitcoin-grants-data-portal/blob/main/dbt/models/round_votes.sql). Data is finally exposed via [Parquet files](https://www.robinlinacre.com/parquet_api/) on top of IPFS. A [notebook is rendered as the project website with each push](https://bafybeieaztvldk23xghlpmzjz5ppry5jrd6bi2kag6q73huckhfrlrabby.ipfs.dweb.link/) too.

All of the avobe unlocks some interesting properties relevant to Gitcoin and decentralized data in general:

- Data is open end to end. You can see the raw data, the transformations, and the final data. You can run the transformations yourself or rely on others. It also plays well with the existing ecosystem (SQL, Python, ...) by using open standards and sharing data in open formats.
- The project runs on a laptop, a server, a CI runner (that's the way is working right now) or a even decentralized compute network like [Bacalhau](https://www.bacalhau.org/). It even works in GitHub Codespaces so you don't even need to setup anything locally!
- Data is stored in IPFS. In theory, the more people runs the portal, the more distributed the generated parquet files on IPFS files will be!
- Anyonce can clone and edit things! You're not blocked by any API rate limits, or closed data like in Dune. Git features like branching, merging, pull requests, ... are available because all the data is transformed declaratively as code.
- Every commit generates a complete database (`dbt.duckdb`) with all the tables aswell as parquet files for all. These get pushed to IPFS. This means that we can always go back in time and see the data as it was at that point in time. For every commit, we'll have the data as it was at that point in time.
- So, data, both raw and processed, is already out there! You can always re-derive it but getting started is as easy as pasting [a SQL query in your browser](https://shell.duckdb.org/) or doing `pd.read_parquet(ipfs_gateway_url)` in a Notebook. Every commit will also publish website to act as the entrypoint of the project. Could be used to generate reports/dahsboards, or as documentation.
- The portal enables all the cool things data engineers want; typing, tests, materialized views, dev branches, ...

Pretty cool, right?

### Example

The easiest thing you can do right now is explore [the generated website with some query examples](https://bafybeieaztvldk23xghlpmzjz5ppry5jrd6bi2kag6q73huckhfrlrabby.ipfs.dweb.link/). You can reproduce them by running the following query (computing the top rounds by votes) in [shell.duckdb.org](https://shell.duckdb.org/).

```sql
select
    round_id,
    count(id)
from read_parquet('https://bafybeieaztvldk23xghlpmzjz5ppry5jrd6bi2kag6q73huckhfrlrabby.ipfs.w3s.link/round_votes.parquet')
group by 1 order by 2 desc limit 10;
```

![DuckDB Example](https://user-images.githubusercontent.com/1682202/267361009-a416610e-3905-4399-adac-5d395975c2e5.png)

### Next Steps

The main thing I'd love to explore next is how to remove the Allo Indexing data alltogether and read everything from on-chain sources. Not sure how efficient can that be, but it would be a great experiment!

---

That's all for now. Reach out if you have any feedback or ideas!
