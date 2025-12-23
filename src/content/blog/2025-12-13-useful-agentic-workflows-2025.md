---
title: "Useful Agentic Workflows (2025 Edition)"
date: 2025-12-13
slug: useful-agentic-workflows-2025
---

_This is a very early draft_

Last year, I shared [some LLM workflows](useful-llm-tools-2024) I was finding useful. Things have changed a lot. These days, I work in a completely different way, and I do/create many things I wouldn't dare to do before. I've been learning and relying more and more on the "agentic" programming way of working. So, here are some of the ~LLM~ agentic workflows I've found useful for work, data, productivity, and research. Hard to say these will for one year from now, but perhaps they will inspire you to try new things!

## Magical UNIX Pipelines

I mentioned `llm` last year. My usage has only gone up! For any small to medium task that involve text, using [`llm`](https://llm.datasette.io/) with a bunch of custom template is an amazingly simple solution. I've used it to summarize YouTube videos from their transcripts, tag documents automagically, extract structured data from many files, generate additional columns for datasets, caption images, and many more little things.

I've also assigned keyboard shorcuts to the my most common `llm` templated tasks. I have a bunch of scripts that do something like; (1) take wathever is selected, (2) run `llm` with a fixed template (e.g: fix typos, clean format, ...), and (3) replace the selection (or create a new terminal) with the output. I use this workflow like a "[magic text brush](https://github.com/davidgasquez/dotfiles/blob/1bf35de417b122161828260cfda6f397b9311980/scripts/magic-brush)" that I can apply anywhere text can be selected.


## Help Agents Help You

[I've written about this before](https://davidgasquez.com/llm-friendly-projects/#helping-llms-help-you) and is still something I focus on a lot. Call it "context engineering" or whatever, but the idea is to make agents productive. Here are some principles that have worked well for me and that you've probably seen elsewhere:

- [Progressive disclose context](https://www.humanlayer.dev/blog/writing-a-good-claude-md).
- Keep a lean AGENTS.md. Start with the smallest useful rules file + one example.
- Logs aren't just for debugging. They're feedback and context.

Honestly, I think I spend more time tweaking the agent harness (skills, commands, prompts, tests, verification etc.) than working on the projects themselves. Working on these things also helps me understand the problem better. That said, I'm not sure if I'm more efficient, but am having more fun than doing another ETL/dashboard. It's very similar to playing Satisfactory/Factorio. You are not literally programming, but tickles the same part of the brain and has a different experience (visually in gaming, conversation based in LLMs).

### Files as State

For any non obvious task, I keep all kind of things as plain files, and those files in git. Prompts, schemas, experiment logs, results, all live next to the code and not in a chat sidebar. Helps a lot keeping track of what I've tried, and it also helps agents plan their next steps.

Iterate quickly. Game of context management and creating a solid testing feedback loop instead of trying to purely one-shot issues

### Custom Benchmarks

When possible, I set something that acts as the "goodness" metric (tests, a literal ML metric, a custom eval set, ...) and then just prompt the agent a few times while iterating towards better results. At this point it becomes almost like an evolutionary algorithm: generate many candidates, evaluate them, keep the best ones, and repeat. Which brings me to the next point...

I’ll run multiple attempts (sometimes in parallel), compare approaches, and keep what’s best.
Exploit the verify/generate asymmetry

### Asynchronous Disposable Projects

There are many things I want only done once. Write quick scraping scripts, explore random datasets, generate one off reports, etc. For these kinds of tasks, I fire a few Codex/Claude agents in web and then manually go through the results. LLMs are "good enough" machines. They shine when "mostly right" is acceptable and the cost of being wrong is low.

You get to 80% fast, then spend longer on the last 20% than you would have building from scratch - because now you're debugging code you don't fully understand.

### Prototyping

This is also my path from "vibe coding" to "vibe engineering". Rebuild the same thing over and over as I learn what works and what doesn’t.
Breadth > depth here: LLMs are great first-draft machines across many libraries and stacks.
Disposable / "One-off" Software. LLMs allow for the creation of single-use tools ("artifacts") that solve immediate, niche problems.

## Curated Style Guides

A powerful side effect of maintaining a personal knowledge base is that I've been passively curating style guides and useful resources for different kinds of tasks for the last few years. I have notes on [good writing](handbook/writing/), [making checklists](handbook/checklist/). crafting [good commit messages](handbook/git/), and many more [random things](https://davidgasquez.com/handbook/).

That means that when I need the model to produce a specific kind of artifact, I already have a bunch of links to give that I've previously verified and enjoyed.

A recent example was to use `clig.dev` as reference for a small CLI I had to build. The CLI `codex` oneshotted was lovely!

This can be also [packaged as skills](https://agentskills.io/home)!

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
