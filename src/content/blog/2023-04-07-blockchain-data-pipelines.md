---
title: "On Blockchain Data Pipelines"
date: 2023-04-07
slug: blockchain-data-pipelines
---

I've spent the last few months working on indexing and [building data pipelines for the Filecoin blockchain](https://github.com/filecoin-project/filet). While it's been a great and exciting learning experience, I've realized the space can learn a few things from the so called Modern Data ecosystem.

The main thing I'd love to explore is how, as a community, we're building the same pipelines over and over and not collaborating on them. Let's start with a bit of context.

## Existing Projects

If you do a bit of browsing, you'll find many companies and tools building ETLs for different blockchains. I compiled this non-exhaustive list of tools to index chains and companies providing the final datasets. I'm sure I missed a few, so please [let me know](https://twitter.com/davidgasquez) if you know of any other projects!

### Companies

- [Nansen](https://www.nansen.ai/)
- [Tokenflow](https://docs.tokenflow.live/)
- [BitQuery](https://bitquery.io/) ([GitHub](https://github.com/bitquery/explorer))
- [Coherent](https://coherent.xyz/) ([GitHub](https://github.com/coherentopensource))
- [Transpose](https://www.transpose.io/) ([GitHub](https://github.com/TransposeData))
- [Covalent](https://www.covalenthq.com/) ([GitHub](https://github.com/covalenthq))
- [Indexed.xyz](https://github.com/indexed-xyz)
- [Footprint](https://www.footprint.network/) ([GitHub](https://github.com/footprintanalytics))
- [Sentio](https://www.sentio.xyz/) ([GitHub](https://github.com/sentioxyz))
- [GeniiData](https://geniidata.com/)
- [Allium](https://twitter.com/alliumlabs)
- [Kyve](https://www.kyve.network/)
- [Token Terminal](https://tokenterminal.com/)
- [Probably Nothing Labs](https://www.probablynothinglabs.xyz/)
- [Space And Time](https://www.spaceandtime.io/)
- [Credmark](https://credmark.com/) ([GitHub](https://github.com/credmark))

### Tools

- [Trueblocks](https://trueblocks.io/)
- [Blockchain ETL](https://github.com/blockchain-etl)
- [Mars](https://github.com/deepeth/mars)
- [Algoran Indexer](https://github.com/algorand/indexer)
- [Tezos Indexer](https://github.com/baking-bad/tzkt)
- [db3](https://github.com/db3-teams/db3)
- [IceFireDB](https://www.icefiredb.xyz/icefiredb_docs/)
- [Apollo](https://github.com/chainbound/apollo)
- [Ether SQL](https://github.com/analyseether/ether_sql)
- [Spec](https://github.com/spec-dev)
- [Cosmos ETL](https://github.com/bizzyvinci/cosmos-etl)
- [Luabase](https://github.com/luabase)
- [Digital Assets Examples](https://github.com/aws-samples/digital-assets-examples)

## The Problem

After [compiling the list](https://publish.obsidian.md/davidgasquez/Web3#Blockchain+Indexing+Projects), I realized that only a few of these projects are open. **We can read the source code of the chains we use, but can't read the code of their data pipelines?** That's a bit weird. Specially when the data world is moving towards the other direction [^1]!

As the folks from [OpenDataCommunity](https://opendatacommunity.org/) pointed out, the data layer is, currently, mostly centralized [^2] and closed source. Properties that don't represent the open spirit of the movement.

On the other hand, projects like [Airbyte](https://airbyte.com/), [Estuary's Flow](https://github.com/estuary/flow), [Meltano](https://meltano.com/), [Cloudquery](https://github.com/cloudquery/cloudquery), and many others from the [MDS](https://www.moderndatastack.xyz/), are not only building tools to extract, transform, and load data, but also working on standards and protocols. And the community is building on top of them. This makes possible to have an end to end data pipeline in matter of minutes.

1. Connect an [Stripe source](https://github.com/singer-io/tap-stripe) to your warehouse. A few clicks.
2. Import the data. Some extra clicks.
3. Add a [dbt Package](https://hub.getdbt.com/fivetran/stripe/latest/) to your project.
4. Done. You've gone from zero to a somewhat complex report of your Stripe subscriptions!

Wouldn't it be great if we could do the same with blockchain data? **Add the `tap-ethereum` connector, install the `dbt-ethereum` package and start to collaborate! [^3]**

Personally, I think projects like [Trueblocks](https://trueblocks.io/), [Kamu](https://kamu.dev), and [Bacalhau](https://bacalhau.org/) hold the key to open the data layer a bit more [^4] but won't be possible without a community and standards we can all agree upon and share.

[^1]: And the blockchains data is such a [great candidate for the open data movement](https://publish.obsidian.md/davidgasquez/Open+Data). **Chain data is open, verifiable and immutable! All great properties for open data.**

[^2]: And I totally get it. Centralization makes working with data a less painful job!

[^3]: Dune has [the spellbook](https://github.com/duneanalytics/spellbook) and is awesome. I wish they did something similar for their pipelines though.

[^4]: [Bacalhau](https://www.bacalhau.org/) indexes the chain with [Trueblocks](https://trueblocks.io/), puts the data into Parquet files on IPFS and you query it from anywhere using DuckDB!
