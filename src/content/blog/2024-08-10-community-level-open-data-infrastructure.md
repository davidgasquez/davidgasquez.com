---
title: "Community Level Open Data Infrastructure"
date: 2024-08-10
slug: community-level-open-data-infrastructure
---

[Inspired by Rufus Pollock](https://github.com/datopian/datahub/issues/1138#issuecomment-2198126846), I decided to write a post about learnings and what I think will be the future of open data infrastructure, more specifically **open data infrastructure at the community level**.

I work as a data engineer in a small to medium sized company and I've been doing data for a while now. A while ago, I [started wondering about how we can make it easier for people to work with open data](https://handbook.davidgasquez.com/Open+Data), at least making it closer to the difficulty I encounter in my day job. Since then, I've worked on a [couple of data portals](/modern-open-data-portals) and been actively participated in various open data communities projects and discussions.

![Data Portal](/images/dataflow.png)

## Learnings

One of the big things going on in the enterprise side is that working with data is becoming cheaper, simpler, and faster than ever. You can run [entire pipelines on GitHub actions](https://github.com/simonw/ca-fires-history), use [DuckDB to analyze gigabytes of information](https://x.com/severo_dev/status/1759537328228348220), run portable code across [many databases](https://ibis-project.org/), and publish [beautiful dashboards with a few lines of code](https://evidence.dev/).

I didn't see much of this being used in the open data ecosystem. It is reasonable as the data field moves quite fast and, honestly, **open data problems are mostly people problems** more than technical ones. However, there are technical solutions that can help streamline the process.

There are two big levels where people work on open data; at the government level covering thousands of datasets, and at the individual level where folks who are passionate about a topic publish a few datasets.

This results on lots of datasets. Specially, disconnected datasets that still requires you to scrape, clean, and join it from all the heterogeneus sources.

What I didn't see much of was open data at the community level, where a group of people who publish data that is useful to their community. Projects like PUDL and OWID are great examples of this.

And in this level, small to medium communities, is where I think the future of open data lies. Here are a few reasons why:

- **You can reuse the same data stack and infrastructure modern small to medium companies use**. This makes it easier to get started and to get help from technical folks that are not used to the traditional Open Data ecosystem tooling.
- The community's datasets probably requires some level of scraping, cleaning, and joining data from some niche data sources. This is hard to do both at the government level (too fine grained) and at the individual level (covers too much).
- If the data is useful the community will share it within itself and spread the word, making people excited about open data.
- You're **working closer to the problem** than say, curating yet another dataset covering economic indicators for all countries.
- There is a lot of **low hanging fruit in terms of data that can be collected and packaged** in a way that is useful for the community.
- With LLMs on the rise, community curated datasets become more important as they won't appear in big data dumps or large datasets collected by big companies.

I'd like to think of these kind of portals as **barefoot data portals**, reusing the term from [Maggie Appleton's Home Cooked Software and Barefoot Developers](https://maggieappleton.com/home-cooked-software).

## Barefoot Data Portals

Barefoot Data Portals are community-driven, lightweight data infrastructure projects that bridge the gap between individual efforts and large-scale government initiatives. These portals are similar to what you would have in a company, but scrappier.

They are basically [a GitHub repository with scripts to collect data from various sources, clean it, and join it, and publish useful datasets and artifacts for that community](https://github.com/datonic/datadex). Ideally, they are also simple to get started with and expose the best practices in data engineering for curating and transforming data.

They try to manage the glue in the simplest way possible and provide the datasets in a format the community will use. For example, pushing data to a Google Sheet, a CSV file, or uploading them to HuggingFace.

Finally, they also get humans excited about the curated datasets showcasing some potential use cases!

The largest impact/value of Barefoot Data Portals is in making the curation and cleaning of the datasets a smoother process and bringing more people into the data collaboration process.

## Future

We've seen a lot of progress in the last few years in terms of tools and infrastructure to work with data. We will probably continue seeing growth in computation capabilities alongside better tools to work with data. One thing I'm excited about is the potential role of WebAssembly compatible modern tooling (like Polars, DuckDB, ...) to make "big data" accessible from anyone's browser.

If you're excited about data engineering and curious about open data, **find a community you're passionate about and start a data portal**. Scrape and clean some data, reach out to a few folks and ask how would they like to consume it and start publishing datasets!

Start a community data portal today - it's an excellent opportunity to learn and contribute to open data!
