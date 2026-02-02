---
title: "Barefoot Data Platforms"
date: 2026-02-02
slug: barefoot-data-platforms
---

I've been maintaining an [open source and local-first data platform for the Filecoin ecosystem for the last 4 years](https://github.com/davidgasquez/filecoin-data-portal). This has been an interesting experience as it is not a classic data platform. It comes with some fun [constraints and principles](https://github.com/davidgasquez/filecoin-data-portal?tab=readme-ov-file#-key-features). This is something I already wrote about; [patterns](https://datadex.datonic.io/) and [related ideas](/modern-open-data-portals) that [make these platforms work at the community level](/community-level-open-data-infrastructure).

The Filecoin Data Portal has been free to run, verifiable, and publishes static datasets and dashboards updated daily for years now. This is great, but I wonder if we can make it even simpler. Do we need Dagster and `dbt` in the age of ~~clankers~~ agents? Frameworks are useful. They also add complexity and cognitive load, especially for small teams or individuals that might not be aware of all the best practices and patterns to use them effectively.

Given the recent advances in "agentic coding", I think we are going to see people mostly interacting with code through them. Frameworks might become less relevant, especially as agents can write all the boilerplate code for you.

So, I set myself up to build [a simple data platform](https://github.com/davidgasquez/barefoot-data-platform). One without any framework. One with strong opinions and principles that uses simple scripts and some ad hoc glue code.

I'm inspired by two ideas:

1. [You can build simple software that works](https://shittycodingagent.ai/). "There are many shitty data platforms, but this one is mine".
2. [Maggie Appleton's Home Cooked Software and Barefoot Developers](https://maggieappleton.com/home-cooked-software). Most data platforms don't need to be as complex as professional industrial ones, they can be home-cooked.

## A Barefoot Data Platform

What does a minimal and opinionated data platform look like?

**Minimalism** here is achieved via low abstraction and no frameworks. You write your sloppy scripts. These scripts are assets, and these assets depend on each other. That's it.

I wanted to use Makefiles but (1) they're not aware of tables inside a database and (2) need to be updated on their own when you add new assets.

The opinion side of things matters less as long as you're consistent and have them written down so agents pick them up.

In my case, I went with:

- Classic functional, declarative, independent, composable, and idempotent transformations
- Co-located assets, metadata, and documentation so assets have everything needed to be understood and reproduced in the same file
- One storage layer. DuckDB or SQLite, Parquet files, or whatever you want as long as you define a `materialize` function.
- Many automated checks (`ruff` with all the rules enabled, `ty`, data tests, `prek` hooks, ...)

I said this in the past:

> The largest impact of Barefoot Data Portals is in **making curation, cleaning and joining datasets a smoother process** thus bringing more people into the collaboration process.

I would also add another property that can be very impactful: The simpler the stack, the more people can build pipelines with a prompt.

## What's next?

I've been migrating the Filecoin Data Portal to something like the ["Barefoot Data Platform"](https://github.com/davidgasquez/barefoot-data-platform). Surprisingly, it works quite well. Designing a codebase for agents really pays off. Especially for small-to-medium platforms (this one had less than 200 assets), I think it might be a great alternative.

I spent a few days thinking how I wanted it to look, and then implemented it in a couple of hours while cooking a delicious banana bread.

I don't think 22-year-old David could have built it. There are a few years of painful experience behind these few lines of code.
