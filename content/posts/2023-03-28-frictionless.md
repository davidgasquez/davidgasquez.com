---
title: "Thoughts on the Frictionless Standard"
date: 2023-03-28
permalink: /frictionless-standard
---

So far I've enjoyed a lot [playing with Frictionless](https://github.com/davidgasquez/datalab/blob/main/notebooks/2023-03-14-Packaging%20Open%20Datasets.ipynb) and learning more about the internal design and specs.

### Pros

- The minimal implementation (simple JSON) is super lightweight and flexible enought! If the modern data tooling understood them, it could help a lot with the interoperability.
- Human and machine readable!
- I can package someone else open datasets without moving the data and add them to the Fricitonless ecosystem.

### Cons

- The specs can be confusing at some levels. Missing some examples through the specs.
- Would be cool if it integrated with things like `fsspec` to read/write in lots of places ([already considering](https://github.com/frictionlessdata/framework/issues/1462)) and [Arrow as the backend](https://arrow.apache.org/docs/python/dataset.html) to allow smarter data handling/quering and reduce the surface layer of Frictionless (IO is `fsspec`, data is Arrow, frictionless is just mapping).
- As far as I understand, there is no way to keep track of the dataset state over time. If the data files are on git, it could be [recovered](https://simonwillison.net/2021/Dec/7/git-history/) but it would be awesome if the protocol had this in mind from the start and made it simple to keep the history for the user. That's one of the coolest things from [ODF](https://docs.kamu.dev/odf/). Even if you're only thinking about files and doing updates in place, the protocol is taking care of saving things properly without you having to think about it. I highly recommend [this talk from the founder](https://youtu.be/ZQ-MdKj3BjU) on the topic.

Overall I think Frictionless is right in many abstractions and would like to continue using and learning about it.

PS: The situation reminds me of Data Engineering a while back. We had the [Singer Specs](https://github.com/singer-io/getting-started) and people started to build tooling/connectors around it. Over time it got a lot of traction and larger products like [Meltano](https://hub.meltano.com/singer/spec/) started to spawn around it. Nowadays, thanks to the specs you have a wide variety of ways to "use" these specs (e.g: [Alto](https://github.com/z3z1ma/alto)). All of this to say that, from my point of view, the missing part on Frictionless now is the integration with the broader data ecosystem. The specs are there and are very helpful, we need more tooling/bridges for people to use it.
