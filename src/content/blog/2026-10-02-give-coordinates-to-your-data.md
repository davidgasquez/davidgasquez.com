---
title: "Give Coordinates to Your Data"
date: 2026-10-02
slug: give-coordinates-to-your-data
---

I think [good old embeddings](https://x.com/davidgasquez/status/2067284092727554544) are still underrated. This is my short post to remind you why giving things coordinates and exploring them manually rocks!

The [intuition behind embeddings](https://vickiboykis.com/what_are_embeddings/) is just to represent things as lists of numbers so useful relationships become easier to compute (different kinds of distances). Nearby things share something we care about. What that "something" is mostly depends on how we learn the coordinates and represent the things. Those embedding coordinates let us build useful features like [finding similar items](https://medium.com/airbnb-engineering/listing-embeddings-for-similar-listing-recommendations-and-real-time-personalization-in-search-601172f7603e), better search, [fuzzy joins](https://x.com/davidgasquez/status/1838129260290019348), duplicate detection, recommendations, [unusual activity queues](https://engineering.grab.com/graph-anomaly-model), and [places where people with different views agree](https://communitynotes.x.com/guide/en/under-the-hood/ranking-notes#matrix-factorization).

These days, people talk mostly about text embeddings because that's what LLMs use. The thing I'd love to remind folks of, including myself, is that you can embed anything! A good embedding and visualization can reveal structure that nobody bothered to write down and is hard to pin down without the [visual clues of the clusters](https://jmlr.org/papers/v22/20-1061.html).

Give your agent the dataset, the fields that matter, and ask for a local embeddings script, a 2D map with UMAP/PaCMAP or whatever, and a [small static explorer](/ephemeral-agent-workbenches) with search, filters, and clickable points. You'll have embeddings to help your agent [find relevant context](/sharing-a-qmd-index-with-a-team) and you'll have a navigable visual neighborhood of points on a map.

I love to do small artifacts to [make these kinds of structures explorable](https://x.com/davidgasquez/status/2021293185050333293). Makes it easy to wander around, inspect the neighbors, and spot what looks wrong!

There you go. Pick a dataset you know well, ask your agent to generate the embeddings and coordinates, and go explore it! You might discover questions you wouldn't have thought about.
