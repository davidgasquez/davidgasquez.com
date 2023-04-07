---
title: "On Blockchain Data Pipelines"
date: 2023-04-07
draft: false
cover:
    image: https://images.unsplash.com/photo-1599985853214-25355023ef15?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80
    caption: "Photo by kili wei on Unsplash"
---

I've spent the last few months working on indexing and [building data pipelines for the Filecoin blockchain](https://github.com/filecoin-project/filet). While it's been a great and exciting learning experience, I've realized the space can learn a few things from the so called Modern Data ecosystem.

The main thing I'd love to explore is how, as a community, we're building the same pipelines over and over and not collaborating on them. Let's start with a bit of context.

## Existing Projects

If you do a bit of browsing, you'll find many companies and tools building ETLs for different blockchains. I compiled this non-exhaustive list of tools to index chains and companies providing the final datasets. I'm sure I missed a few, so please [let me know](https://twitter.com/davidgasquez) if you know of any other projects!

- [Dune](https://dune.com/)
- [Flipside](https://flipsidecrypto.xyz/)
- [Bitquery](https://github.com/bitquery/explorer)
- [Tokenflow](https://docs.tokenflow.live/)
- [Trueblocks](https://trueblocks.io/)
- [Indexed.xyz](https://github.com/indexed-xyz)
- [Nansen](https://www.nansen.ai/)
- [Blockchain ETL](https://github.com/blockchain-etl)
- [Mars](https://github.com/deepeth/mars)
- [Algoran Indexer](https://github.com/algorand/indexer)
- [Tezos Indexer](https://github.com/baking-bad/tzkt)
- [db3](https://github.com/db3-teams/db3)
- [IceFireDB](https://www.icefiredb.xyz/icefiredb_docs/)
- [Apollo](https://github.com/chainbound/apollo)
- [Ether SQL](https://github.com/analyseether/ether_sql)
- [Spec](https://github.com/spec-dev)
- [Transpose](https://www.transpose.io/)
- [Allium](https://twitter.com/alliumlabs)
- [Cosmos ETL](https://github.com/bizzyvinci/cosmos-etl)
- [Kyve](https://www.kyve.network/)
- [Token Terminal](https://tokenterminal.com/)
- [Probably Nothing Labs](https://www.probablynothinglabs.xyz/)
- [Space And Time](https://www.spaceandtime.io/)
- [Digital Assets Examples](https://github.com/aws-samples/digital-assets-examples)
- [Luabase](https://github.com/luabase)

After compiling the list, I realized that only a few of these projects are open. **We can read the source code of the chains we use, but can't read the code of their data pipelines?** That's a bit weird. Specially when the data world is moving towards the other direction³!

As the folks from [OpenDataCommunity](https://opendatacommunity.org/) pointed out, the data layer is, currently, mostly centralized² and closed source. Properties that don't represent the open spirit of the movement.

On the other hand, projects like [Airbyte](https://airbyte.com/), [Estuary's Flow](https://github.com/estuary/flow), [Meltano](https://meltano.com/), [Cloudquery](https://github.com/cloudquery/cloudquery), and many others from the [MDS](https://www.moderndatastack.xyz/), are not only building tools to extract, transform, and load data, but also working on standards and protocols. And the community is building on top of them. This makes possible to have an end to end data pipeline in matter of minutes.
    1. Connect an [Stripe source](https://github.com/singer-io/tap-stripe) to your warehouse. A few clicks.
    2. Import the data. Some extra clicks.
    3. Add a [dbt Package](https://hub.getdbt.com/fivetran/stripe/latest/) to your project.
    4. Done. You've gone from zero to a somewhat complex report of your Stripe subscriptions!

So, my questions are:

- **Where is the `tap-ethereum` connector?**
- **Where is the `dbt-ethereum` package for people to collaborate¹?**

Personally, I think projects like TrueBlocks and Bacalhau hold the key to open the data layer a bit more⁴ but won't be possible without a community and standards we can all agree upon and share.

Let me know what you think!

---

¹ I know Dune has the spells dbt package and is awesome. I wish they did something similar for their pipelines.

² Centralization makes working with data a less painful job!

³ And the blockchains data is such a [great candidate for the open data movement](https://publish.obsidian.md/davidgasquez/Open+Data). **Chain data is open, verifiable and immutable! All great properties for open data.**

⁴ Bacalhau indexes the chain with TrueBlocks, puts the data into Parquet files on IPFS and you query it from anywhere using DuckDB!
