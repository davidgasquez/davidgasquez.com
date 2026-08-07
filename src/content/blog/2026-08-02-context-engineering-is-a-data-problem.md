---
title: "Context Engineering Is a Data Problem"
date: 2026-08-02
slug: context-engineering-is-a-data-problem
---

More than ever, it is clear that all a company wants from you is your data and context. Your context is their moat.
Each product owning your context makes you use their agent. And I've never seen a good hosted agent.

Organizations need to own their context, and the way to do so effectively already exists.

## Context as Data Infrastructure

Did you notice the [shape of the diagrams](https://storage.googleapis.com/gweb-cloudblog-publish/images/WorkspaceIntelligence.max-2200x2200.png) that every company is adding to their "intelligence" products? I see that and it seems like I'm looking at a Fivetran or dbt product page in 2018. That is because they're the same thing!

Most organizations will need to build and maintain a model-agnostic knowledge base ([aka ontology, company brain, ...](https://x.com/DBredvick/status/2078150905078206789)) for the same reasons they maintain a data warehouse. A curated and normalized layer helps both humans and agents make sense of all the structure that outlives any particular model, harness, tools, and products. Context engineering is very similar to what data folks have been doing for a while now. Extracting, filtering, curating, modeling, and publishing artifacts to help the organization make better decisions.

For now, it seems there isn't a great set of tools (or [modern context stack](https://x.com/davidgasquez/status/2082895547677954466)) built for this purpose. Something like Fivetran and dbt optimized for the new sources (Slack, Drive) and transformations (transcription, summarization, text extraction from a slide deck, ...).

## The Knowledge Build System

That said, I think there are a few patterns we can adapt and reuse.

Think of the knowledge base as a "compiler" for agents. It transforms raw source materials into representations that are optimized for LLMs. The shape of ETL/ELT fits here perfectly.

1. Extract all the raw data. This can be into a filesystem or database! This is the step that exports all of your sources into whatever shape they come in. E.g., Slack channel's JSON, Google Slides' PDF, ...
2. Transform the raw sources into useful artifacts. Your organization doesn't use Slack the same way as others, model that in a way that gets reflected in the final text artifact. Summarize, extract, clean, and do anything else you need to grab and model what is useful there. There is no universally correct representation of company knowledge in the same way that [there is no correct win rate waiting to be unearthed](https://x.com/bennstancil/status/1428837214545395712).
3. Publish a set of useful artifacts. Usually, at least a curated set of text files alongside their embeddings for semantic retrieval later on. Embeddings here act merely as an index for the curated text files. Useful, expensive, disposable, and optional!

This means a company brain is built, tested and released like any other data product and not just prompted into existence by giving your agent access to all the raw sources. After all, connecting Looker to all the raw sources or copying _every_ table into a data lake never solved analytics, right?

I'm not against agents connecting to the raw sources, though. In many cases, that will be better than a poorly maintained knowledge base (garbage in, garbage out). What I'm saying is that, at some point, you need a process to derive meaning and codify what "truth" means in your context. Agents will just read the 3 differently defined OKRs and carry on, with a small note at best. Also, context is finite (for now) and has diminishing returns.

Even if they got that right. That won't compound! In data, once someone figures out how a "key action" is defined, it gets encoded as code in a `dbt` model that downstream users will consume and help evolve. Without a Knowledge Build System, we'd be missing this compounding layer on the context side. Talking, rejecting PRs, and renaming fields are the ways the organization "thinks" and compacts knowledge. Each curated text file at the end is a cached materialized view optimized for something.

Working on this context layer should feel similar to data folks:

- Thinking about what kinds of questions people will ask and how to represent knowledge in a way that makes those questions easier to answer.
- Curating and filtering sources to provide the most accurate representation of an entity.
- Building "marts" for different areas. There is no universal package of "company context"; each area, project, and team might need their own subset or combination of sources and modeling.
- Analyzing recurring questions and updating models to help these.
- Fighting something like context debt: accumulated ambiguity, staleness and untraceable interpretation that make agents confidently retrieve the wrong thing.

Ingestion is not the product here. The processes of sense-making, modeling, and coordination are what allow organizational knowledge to compound.
