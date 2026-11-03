---
title: "Algorithms for One"
date: 2026-11-03
slug: algorithms-for-one
---

There are many algorithms out there tuned _for you_ but almost none _tuned by you_. The main reason is that we don't own our data, or accessing it is hard enough that we don't bother. Owning our data is what lets us build tools around our lives and choose what matters, instead of hoping our clicks express our preferences.

Once you control your data (by scraping it, using an open network, or requesting a GDPR export), a new world of custom algorithms opens up. Open networks like the AT Protocol make this easier because [agents can read structured public data without scraping an app's interface](https://davidgasquez.com/atproto-agents). This post is not entirely another ad for the AT Protocol, but about any data that should be yours, such as your x.com likes or your Spotify history.

A personal algorithm only needs to satisfy you. It is true that you cannot build an algorithm that competes with the main TikTok algorithm that feeds on billions of interactions. But you can compete on many other dimensions because TikTok serves millions of users and has to cut corners and simplify things to do it. Since your algorithm is only for you, you can throw whatever resources you want at it. For example, if I wanted my own recommendation algorithm for Bluesky posts, I could collect posts from all the feeds I wanted. Because the dataset is small-ish, I could spend as much compute and time per recommendation as I wanted, iterate on richer ranking and labeling (e.g. [using jev](https://typesafe.ai/blog/introducing-system-one-models-and-jev)), and try many algorithms that Bluesky can't afford to run across its entire user base.

Agents make owning or accessing your own data even more useful because you can ask questions the original app never supported, without waiting for its developers to build the feature. You can also build your own app on top of the data. As others have pointed out, Bluesky is just one view into atproto data. When [data lives independently of apps](https://overreacted.io/a-social-filesystem/), you can build another interface around it. These days, agents can easily [connect that data to a custom UI](https://newsletter.squishy.computer/p/agents-want-flexible-schemas) shaped around what you need today. You can change the interface as your needs change and combine data from different places.

Here's a recent example that puts everything together. Andrej Karpathy used Claude to find the videos that commenters recommended again and again across 43 million Hacker News comments, then [built a video browsing site around them](https://x.com/karpathy/status/2116957135661945283). The result is very different from the dopamine-optimized recommendations YouTube throws at you.

The experiment was only possible because someone maintains a Hacker News dataset that people like Andrej can build on. Others used the same dataset to build a different view [focused on books](https://news.ycombinator.com/item?id=50326821). Since the data is open and accessible, [you can do it too](https://www.ssp.sh/brain/querying-hackernews-with-duckdb-directly/).

It's a great case of how an open and accessible dataset encouraged many custom views on top to surface different entities (YouTube videos, books, Wikipedia articles) and recommendation signals. [Many people seem to enjoy these experiences](https://news.ycombinator.com/item?id=50319510).

I want more software that works this way, built on protocols that keep data open and accessible. I want to build apps that grow with my interests. If an app is useful enough for me and open, it will probably be useful to other people too!
