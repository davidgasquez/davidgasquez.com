---
title: "Context Engineering Is a Data Problem"
date: 2026-08-02
slug: context-engineering-is-a-data-problem
---

More than ever, it is clear that all a company wants from you is your data and context. Your [context is their moat](https://x.com/samzliu/status/2080210797465379147).
Each product owning your context makes you use their agent. And I've never seen a good hosted agent.

Organizations need to own their context, and the way to do so effectively already exists.

## Context as Data Infrastructure

Did you notice the [shape of the diagrams](https://storage.googleapis.com/gweb-cloudblog-publish/images/WorkspaceIntelligence.max-2200x2200.png) that every company is adding to their "intelligence" products? I see that and it seems like I'm looking at a Fivetran or dbt product page in 2018. That is because they're the same thing!

Most organizations will need to build and maintain a model-agnostic knowledge base ([aka ontology, company brain, ...](https://x.com/DBredvick/status/2078150905078206789)) for the same reasons they maintain a data warehouse. A curated and normalized layer helps both humans and agents make sense of all the structure that outlives any particular model, harness, tool, or product. Context engineering is [that same work](https://x.com/JoshARosen/status/2084693306722705629): extracting, filtering, curating, modeling, and publishing artifacts to help the organization make better decisions.

For now, it seems there isn't a great set of tools (or [modern context stack](https://x.com/davidgasquez/status/2082895547677954466)) built for this purpose. Something like Fivetran and dbt optimized for the new sources (Slack, Drive) and transformations (transcription, summarization, text extraction from a slide deck, ...).

## The Knowledge Build System

That said, I think there are a few patterns we can adapt and reuse.

Think of the knowledge base as a "compiler" for agents. It transforms raw source materials into representations that are optimized for LLMs. The [shape of ETL/ELT fits here perfectly](https://meltano.com/blog/llm-apps-are-mostly-data-pipelines).

1. Extract all the raw data into a filesystem or database, preserving whatever shape it comes in. E.g., Slack channel's JSON, Google Slides' PDF, ...
2. Transform the raw sources into useful artifacts. Your organization doesn't use Slack the same way as others, so [model that in a way that gets reflected in the final text artifact](https://www.cerebras.ai/blog/how-we-built-our-knowledge-base). Summarize, extract, clean, and do anything else you need to capture what is useful there. There is no universally correct representation of company knowledge in the same way that [there is no correct win rate waiting to be unearthed](https://x.com/bennstancil/status/1428837214545395712).
3. Publish useful artifacts, usually a curated set of text files alongside embeddings for semantic retrieval. Embeddings merely index those files. Useful, expensive, disposable, and optional!

This means a company brain is built, tested, and released like any other data product rather than [prompted into existence by giving your agent access to all the raw sources](https://www.theagilemonkeys.com/community/whitepapers/context-engineering-data-pipelines). After all, connecting Looker to every raw source or copying _every_ table into a data lake never solved analytics, right?

Direct access can still be better than a poorly maintained knowledge base (garbage in, garbage out). But at some point, you need a process to [derive meaning and codify what "truth" means in your context](https://x.com/KSimback/status/2077835543464054890). Otherwise, agents will read the 3 differently defined OKRs and carry on, with a small note at best. Also, context is finite (for now) and has diminishing returns.

In data, once someone figures out how a "key action" is defined, it gets encoded in a `dbt` model that downstream users consume and help evolve. A Knowledge Build System creates [the same durable layer for context](https://www.context.ai/blog/a-filesystem-for-context). Talking, rejecting PRs, and renaming fields are the ways the organization "thinks" and compacts knowledge. Each curated text file at the end is a cached materialized view optimized for something.

In practice, working on this context layer means:

- Thinking about what kinds of questions people will ask and how to [represent knowledge in a way that makes those questions easier to answer](https://www.anthropic.com/engineering/contextual-retrieval).
- Curating and filtering sources to provide the most accurate representation of an entity.
- Building "marts" for different areas. There is no universal package of "company context"; each area, project, and team might need their own subset or combination of sources and modeling.
- Analyzing recurring questions and updating models to help these.
- Fighting something like context debt: accumulated ambiguity, staleness and untraceable interpretation that make agents confidently retrieve the wrong thing.

Ingestion is not the product here. The processes of sense-making, modeling, and coordination are what allow organizational knowledge to compound.
