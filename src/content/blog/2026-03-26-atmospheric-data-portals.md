---
title: "Atmospheric Data Portals"
date: 2026-03-26
slug: atmospheric-data-portals
---

> _I wrote this quickly more as a sketch for people already familiar with `atproto` and the open data discovery challenges than a fully self-contained post._

This post can be seen as a continuation of my [Open Data](https://davidgasquez.com/handbook/open-data) wranglings. Check them out if you are interested in some ideas to solve issues at earlier stages of the Open Data pipeline.

- [Building Open Data Portals](/modern-open-data-portals)
- [Community Level Open Data Infrastructure](/community-level-open-data-infrastructure)
- [Barefoot Data Platforms](/barefoot-data-platforms)

In the last couple of days, I've come across two interesting projects that are working on making "datasets discoverable" using the AT Protocol: [Matadisco](https://matadisco.org/) and [`atdata`](https://github.com/forecast-bio/atdata). This is something I've [been thinking about for a while](https://github.com/orgs/datonic/discussions/42#discussioncomment-11303328), and I wanted to write down some thoughts and ideas!

The [AT Protocol](https://atproto.com/) has a real chance to improve the main issue these projects point to: **finding useful data is hard**. A big part of the difficulty comes from the current state of things: isolated portals, weird APIs, lack of reputation and usage signals, ... Turns out, data discovery is also a [people problem](/community-level-open-data-infrastructure)! And the best ~[hammer](https://en.wikipedia.org/wiki/Law_of_the_instrument)~ protocol we have for this kind of social problem is indeed the AT Protocol.

The beauty of designing data portals on top of `atproto` is that we get packaging and indexing at the same time, relatively for free. Until now, [data package managers](https://github.com/datonic/hub/blob/main/notes/related-projects.md) have had to deal with both on their own [^1].

So, how would I do it? Here are some ideas I haven't seen in these projects and think are interesting.

- Take inspiration from existing flexible standards like [Data Package](https://datapackage.org/standard/data-package/), [Croissant](https://github.com/mlcommons/croissant), and GEO ones for the core fields. Start with the smallest shared lexicon while leaving room for specialized extensions (sidecars?).
- Split datasets from "snapshots". Say, `io.datonic.dataset` holds long-term properties like `description` and points to `io.datonic.dataset.release` or `io.datonic.dataset.snapshot`, which point to the actual resources.
- Add an optional [DASL-CID field](https://dasl.ing/cid.html) for resources so we "pin" the bytes.
- Core lexicon should be as agnostic as possible! That means:
  - Storage agnostic
    - Datasets can have multiple snapshots with different `URI`s. These can be mirrors, updates, forks, partitions of the dataset... They can also be produced by anyone, so I can back up some dataset on IPFS and provide that back.
    - Snapshots point to "resources", which are `URI`s and perhaps an extra `CID`. E.g., `s3://owid/2021-04-25-covid_19.csv`
  - Format agnostic
    - Don't force specific formats. Use `URI`s and optional `MIME` types and let consumers figure things out. It is better than asking people to migrate to a specific format.
    - You can publics multiple "snapshots" of the dataset with multiple formats.
- I'd keep anything related to schemas optional, as you can enforce them on specific file formats (e.g., Parquet vs. CSV).
- Bootstrap the catalog. There are many [open indexes and organizations](https://github.com/datonic/hub/blob/main/notes/related-projects.md#indexes). Crawl them!
- Integrate with external repositories. E.g., a service [that creates `JSON-LD` files](https://developers.google.com/search/docs/appearance/structured-data/dataset) from the datasets it sees appearing on the Atmosphere so [Google Datasets picks them up](https://datasetsearch.research.google.com/). The same cron job could push data into Hugging Face or any other tool that people are already using in their fields.
- Convince and work with high quality organizations doing something like this! I'd [definitely collaborate with `source.coop` for example](https://source.coop/harvard-lil/gov-data).

Basically, whatever comes out of this should fit existing storage, files, and publishing habits and not require migration into a blessed stack (programming laguage, platform, ...). It should allow anyone to mirror, fix, annotate, and republish datasets.

There are many interesting ideas to follow up too! Curating datasets into collections, reputation, or simple things like linking datasets. I'm very excited to continue these discussions and see where we go! For now, I think starting with something like this would be enough to see some interesting atmospheric data portals pop up.

[^1]: For example, Hugging Face Datasets offers a git-repo-like space for you to put the data and a [metadata file](https://huggingface.co/docs/hub/datasets-manual-configuration). Since they own that space, they can search across all their datasets. Easy, but not open or decentralized. On the other hand, you have the [Data Package spec](https://datapackage.org/standard/data-package/), used by organizations like OWID and maintained by a more neutral actor. The issue there is discovery. The [best you can do today is search GitHub](https://github.com/search?q=path%3A**%2Fdatapackage.json&type=code). [There are many more examples here](https://davidgasquez.com/handbook/data-package-manager).
