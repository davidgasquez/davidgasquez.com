---
title: "Useful Agentic Workflows (2025 Edition)"
date: 2025-12-13
slug: useful-agentic-workflows-2025
---

_This is a very early draft_

More or less one year ago, I shared [some LLM workflows](useful-llm-tools-2024) I was finding useful at the time. Things have changed quite a bit, so, here are some randomly sorted ~LLM~ agentic workflows I've found useful for work, data, productivity, and research!

## Magical UNIX Pipelines

I already mentioned `llm` last year. My usage has only increased. For almost any kind of task that involves text, I've been using the [`llm`](https://llm.datasette.io/) CLI with a bunch of custom templates. I've used it to summarize YouTube videos from their transcripts, tag documents automagically, extract structured data from a large corpus of files, generate additional columns for datasets, and many more little things.

I've assigned keyboard shorcuts to the most common `llm` templated tasks. I have a bunch of scripts that do something like; (1) take wathever is selected, (2) run `llm` with the appropriate template (e.g: fix typos, clean format, ...), and (3) replace the selection (or create a new terminal) with the output. I think of this as "smart text brushes" that I can use anywhere I can select text.

## Files as State

Keep any kind of state in plain files, and those files in git. Prompts, schemas, experiment logs, results, should live next to the code/data and not trapped in a chat sidebars. This helps you keep track of what you've tried, and the agents to plan their next steps.

## Help Agents Help You

[I've written about this before](https://davidgasquez.com/llm-friendly-projects/#helping-llms-help-you).

Keep the prompts minimal! Focus on making easier for the agent to get useful context than "Act as X".

- Progressive disclosure
- Start with the smallest useful rules file + one example.
- When the agent drifts, add one more constraint (or one more tool).
- Avoid giant monolithic prompts.
- Logs aren't just for debugging. They're feedback and context.
- I now spend most of the time on the harness (skills, agents, commands, test setup, verification etc.), both because is funier than doing another ETL and because it really helps. Very similar to playing Satisfactory. You're not programming directly, but feels very close.

## Curated Style Guides

A powerful side effect of maintaining a personal knowledge base is that I've been passively curating style guides and useful resources for different kinds of tasks for the last few years. I have notes on [good writing](handbook/writing/), [making checklists](handbook/checklist/). crafting [good commit messages](handbook/git/), and many more [random things](https://davidgasquez.com/handbook/).

That means that when I need the model to produce a specific kind of artifact, I already have a bunch of links to give that I've previously verified and enjoyed.

A recent example was to use `clig.dev` as reference for a small CLI I had to build. The CLI `codex` oneshotted was lovely!

## Asynchronous Disposable Projects

Write quick scraping scripts.
Explore random datasets.
I’ll run multiple attempts (sometimes in parallel), compare approaches, and keep what’s best.
This is also my path from "vibe coding" to "vibe engineering": rebuild the same thing over and over as I learn what works and what doesn’t.
Breadth > depth here: LLMs are great first-draft machines across many libraries and stacks.
Disposable / "One-off" Software. LLMs allow for the creation of single-use tools ("artifacts") that solve immediate, niche problems.
Small scripts. LLMs are “good enough” machines. They shine when “mostly right” is acceptable and the cost of being wrong is low.
Exploit the verify/generate asymmetry

## Agentic Data Engineering

**Agentic coding** is an initeresting approach for some parts of the boring data engineering tasks. People say you spend **80% of time cleaning data** when working with any dataset. This new approach can automate cleanup scripts, allowing analysts to focus on high-level storytelling and analysis.

### Data Enrichment

Run an LLM against every row to derive a new column (labels, normalization, location resolution, ...).
Cheaper fast models make this viable; verification is still the work.

### Data Cleaning

Data analysts spend most of their time cleaning data.
Agentic coding flips the work: have the agent write the cleanup scripts, you verify the result. [Scrappy Data Cleaning](scrappy-data-cleaning).

### Data Extraction

Converting messy, unstructured documents (like thousands of scanned PDFs or police reports) into structured data (JSON/CSV).

## Useful Principles

- Simple and functional
- Low abstractions, no frameworks
- UNIX philosophy
- One dataset, one folder
- Boring. Pandas, CSV, SQLite, ...
- Small end to end. Easy in data!
- Bring the taste, let them do the cooking.
- Exploit the verify/generate asymmetry

## Curate Benchmarks

When I can, I [turn "good" into a number](https://news.ycombinator.com/item?id=46296725) (test, metric, small eval set) and iterate until it improves.
At that point it becomes evolutionary: generate variants → score → keep winners.
Evolutionary, GEPA, ...

## Better Research

For research, I rely on Markdown files as much as I can. I write some, download related sources also as Markdown (linkweaver) and then produce a "prompt" that I use to gather more information/knowledge and iterate.
Inside that prompt, I keep a list of open questions. This helps the LLM fill out the gaps.
Retrieval + synthesis + verification -> redo initial prompt. Better than "dump everything into chat".

One thing I realized is that there is lots of value only in exploring frameworks and related ideas for a certain task.
  - E.g: observable framework + prompt to replicate the idea, ...

Weaving concepts together:

1. List all the `.md` files in this folder. One file per line.
2. Read `<text>` and extract concepts/phrases that could be expanded using the content of the `.md` files.
3. Read the relevant `.md` files.
4. Update `<text>` augmenting it with insights, notes, and key points from the relevant files.

## Conclusion

Bring your taste + context.
I really enjoy experimenting and learning about different workflows. I used to spend a lot of time tweaking my dotfiles, now, I spent time exploring agentic workflows that iterate on the dotfiles! Using coding agents has been [my hammer](https://en.wikipedia.org/wiki/Law_of_the_instrument) this last year and I've had ton of fun sharpening it.

Finally, there are many awesome folks sharing pragmatic ideas and tools in public! If you're interested in these kind of things, please follow [Simon Willison](https://simonwillison.net/), [Armin Ronacher](https://lucumr.pocoo.org/), [Peter Steinberger](https://steipete.me/), and [Mario Zechner](https://mariozechner.at/).
