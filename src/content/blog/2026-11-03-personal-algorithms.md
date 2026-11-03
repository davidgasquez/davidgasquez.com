---
title: "Algorithms for One"
date: 2026-11-03
slug: algorithms-for-one
---

There are many algorithms out there tuned _for you_ but almost none _tuned by you_. The main reason is that we don't own our data, or accessing it is hard enough that we don't bother. Owning our data is what lets us build tools around our lives and choose what matters, instead of hoping our clicks express our preferences.

Once you control your data (by scraping it, using an open network like the AT Protocol, or requesting a GDPR export), a new world of custom algorithms opens up. Open networks like the AT Protocol make this easier because [agents can read structured public data without scraping an app's interface](https://davidgasquez.com/atproto-agents), but I won't repeat those points here. This post is about any data that should be yours, such as your x.com likes or your Spotify history. Agents make that data even more useful because you can ask questions the original app never supported, without waiting for its developers to build the feature.

Your custom-built algorithm can't compete with a TikTok algorithm that feeds on billions of interactions. It can compete on many other dimensions, though, because TikTok serves millions of users and has to cut corners and simplify things to do it.

You only have to build something for yourself, so you can throw whatever resources you want at it. For example, if I wanted my own recommendation algorithm for Bluesky posts, I could collect posts from a few different feeds. Because the dataset is small, I could spend more compute and time per recommendation, iterate on richer ranking and labeling, and try many algorithms that Bluesky can't afford to run across its entire user base. A personal algorithm only needs to satisfy you.

Once you have the data, you can also build your own app on top of it. As others have pointed out, Bluesky is just one view into atproto data. When [data lives independently of apps](https://overreacted.io/a-social-filesystem/), you can build another interface around it. Agents can help [connect that data to a custom UI](https://newsletter.squishy.computer/p/agents-want-flexible-schemas) shaped around what you need today. You can change the interface as your needs change and combine data from different places.

Andrej Karpathy's [HackerTube experiment](https://x.com/karpathy/status/2116957135661945283) is a good example. He used Claude to find the videos that commenters recommended again and again across 43 million Hacker News comments, then built a video browsing site around them. The result is very different from the dopamine-optimized recommendations YouTube throws at you.

The experiment is only possible because someone maintains a Hacker News dataset that people like Andrej can build on. Others used the same dataset to build a different view [focused on books](https://news.ycombinator.com/item?id=50326821). Since the data is open and accessible, [you can too](https://www.ssp.sh/brain/querying-hackernews-with-duckdb-directly/).

The example shows how public data, a different recommendation signal, and a custom interface can combine into an experience [many people enjoyed](https://news.ycombinator.com/item?id=50319510).

I want more software that works this way, built on protocols that keep data open and accessible. I want to build apps that grow with my interests. If an app is useful enough for me and open, it will probably be useful to other people too.
