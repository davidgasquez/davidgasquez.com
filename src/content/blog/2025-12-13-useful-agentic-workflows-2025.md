---
title: "Useful Agentic Workflows (2025 Edition)"
date: 2025-12-13
slug: useful-agentic-workflows-2025
---

Last year, I shared [some LLM workflows](useful-llm-tools-2024) I was finding useful. Things have changed a lot in this space! These days, I work in a completely different way, and I do/create many things I wouldn't dare to do before. I've been learning and relying more and more on the "agentic" programming way of coding and working with computers overall. So, here are some of the ~LLM~ agentic workflows I've found useful for work, data, productivity, and research. Hard to say these will be here next year. Hopefully they will inspire you to try new things!

## Magical UNIX Pipelines

I mentioned [`llm`](https://llm.datasette.io/) in last [year's post](useful-llm-tools-2024). My usage has only increased! For any small to medium task that involve text, I use [`llm`](https://llm.datasette.io/) with a custom template. It is amazingly simple and effective.

I've used it to summarize and interrogate YouTube videos, tag documents automagically, extract structured data from many files, generate additional columns for datasets, caption images, and many more little things.

The most "unique" way I'm using might be what I call "magic brushes". I've assigned keyboard shorcuts to the most common `llm` templated tasks I rely upon. I have a bunch of scripts that do something like; (1) take wathever is selected, (2) run `llm` with a fixed template (e.g: fix typos, clean format, ...), and (3) replace the selection, create a new terminal, or add to the clipboard the processed output. These are really "[magic text brushes](https://github.com/davidgasquez/dotfiles/blob/1bf35de417b122161828260cfda6f397b9311980/scripts/magic-brush)" that I can apply anywhere text can be selected!

## Help Agents Help You

[I've written about this before](https://davidgasquez.com/llm-friendly-projects/#helping-llms-help-you) and is still something I'm iterating. The goal is to make agents productive in wathever they're doing.

### Files as State

For any non obvious task, I keep all kind of things as plain files, and those files in git. Prompts, schemas, experiment logs, results, all live next to the code and not in a chat sidebar. Helps a lot keeping track of what I've tried, and it also helps agents plan their next steps.

I usually have a lean `AGENTS.md`, a `CONTEXT.md` and perhaps a few `PLAN_` files. I rely a lot on [progressive disclosure of context](https://www.humanlayer.dev/blog/writing-a-good-claude-md) so not everything is dumped at once.

### Custom Benchmarks

When starting with a project, I define something to acts as the "goodness" metric. Some tests, a ML metric like AUC, or anything that can be used to verify. Then, I just prompt the agent get something working and repeat. Even going as far as starting from scratch. The goal is to **exploit the verify/generate asymmetry that happens in some tasks**.

Looks similar to a "manual evolutionary algorithm" where I'm generating many project candidates, evaluating them, keeping the things I like, and repeating the process. Which brings me to the next point...

### Asynchronous Disposable Projects

I'll often run multiple attempts (sometimes in parallel), and learn what do I like and what do I keep while watching the agents figure out the task. I'll take the learnings and make them part of the next prompt or context.

For things I want only done once like writing a quick scraping script, explore a random datasets, generate one off reports, etc, I've setup an [empty `labs`](https://github.com/davidgasquez/labs) repository. I fire a few asynchronous Codex/Claude agents on the repository, forget about them for a while and then review the results and continue elsewhere.

I try perhaps 2 or 3 different ideas per day on that repository. Surprisingly, most of them work! Having a sandboxed repository with an LLM in a loop with internet access is very powerful. Makes learning about that weird API/dataset very fast.

### Prototyping

The approach I use makes me ending up rebuilding the same thing over and over as I figure out what works (and I like) and what doesn't. This breadth-first prototyping is amazing for exploration and learning. I used to spend tons of time researching, reading docs, trying out frameworks, ... now I just have the agent try all of them and see what sparks joy in me.

Another big takeaway is that there is lots of value in exloring different frameworks and common ideas/patterns for a certain task, and then weaving something together that works for you from scratch. A recent personal example has been replacing some [evidence.dev](https://evidence.dev/) and [Observable Framworks](https://observablehq.com/framework/) dashboards with a static Astro site. I took away a couple of "patterns" I liked and had the agent build something from scratch that worked for me better than the frameworks could.

## Curated Style Guides

A powerful side effect of [maintaining a personal knowledge base](building-a-pkb) is that I've been passively curating style guides and useful resources for different kinds of tasks for the last few years. I have notes on [good writing](handbook/writing/), [making checklists](handbook/checklist/). crafting [good commit messages](handbook/git/), and many more [random things](/handbook).

That means that when I need the model to produce a specific kind of artifact, I already have a bunch of links to give that I've previously verified and enjoyed.

A recently pointed Codex to `clig.dev` as reference for a small CLI I had to build and oneshotted a lovely CLI!

I'm now thinking about packaging the handbook [as a skills](https://agentskills.io/home) so it can discover and use my handbook notes.

## Agentic Data Engineering

Folks always say you spend **80% of time cleaning data** when working with any dataset. Well, now it might be different! I've used some agentic engineering techniques to automate cleanup scripts, making me able to focus more on charting/design and deeper analysis. I've shared before how I do [scrappy data cleaning](scrappy-data-cleaning) with Claude Code inline mode and how I'm [specializing Codex](specializing-codex) for different data tasks. Overall, you can use these techniques for a few different data tasks.

### Data Enrichment

You can run an LLM against every row of a dataset to derive a new column (labels, normalization, location resolution, ...). This is something `llm` with a cheap/local model makes viable.

You can also convert messy, unstructured documents (like many `text` fields out there) into structured data (JSON/CSV) or derive useful categories/labels from them. Again, `llm` or Codex work well for these kind of tasks.

### Data Cleaning

Make your agent write cleanup scripts while you focus on verifying the result and writting data tests.

## Agentic Research

For research tasks, I rely on Markdown files as much as I can. Basically, I do the same approach as when working on other projects.

I write a small document to act as the prompt and context, download related sources as Markdown files, and do a few initial runs to learn what I want and how to guide the agent better.

Inside that prompt, there is usually a list of open questions. This helps the LLM fill out the gaps you have.

## Conclusion

For the projects I'm working on, I think I spend more time tweaking the agent harnesses (skills, commands, prompts, tests, verification etc.) than working on the projects themselves. Working on harnesses clearly help me understand the problem better, but I'm not sure if I'm ultimately more efficient.

What I'm sure is that I'm having more fun. I like working on this better than another ETL, dashboard, or data request. It's similar to playing Satisfactory/Factorio. I'm not literally programming, but tickles the same part of the brain and has a different experience (visually in gaming, conversation based in LLMs).

I still have the _agency_ to bring my taste, context, and knowledge into the process, while letting the agents take care of the parts I _mostly_ know how to do. Removing this friction has made me more curious and "playful" when approaching problems.

I've always enjoyed tinkering. I used to spend a lot of time tweaking my dotfiles, now, I spend time exploring agentic workflows that iterate on the dotfiles! Using coding agents has been [my hammer](https://en.wikipedia.org/wiki/Law_of_the_instrument) this last year and I've had ton of fun sharpening it.

If you're interested in these kind of things, please follow [Simon Willison](https://simonwillison.net/), [Armin Ronacher](https://lucumr.pocoo.org/), [Peter Steinberger](https://steipete.me/), and [Mario Zechner](https://mariozechner.at/).
