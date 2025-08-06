---
title: "Scrappy Data Cleaning"
date: 2025-08-05
slug: scrappy-data-cleaning
---

While working on a small analysis over highly unstructed data at work, I came up with a very hacky but effective and cheap way to clean and process messy data. There is almost no code involved. The main downside is that requires a Claude Code subscription for it to be cost effective!

The core idea is that you can replace arbitrary chunks of scripts with Claude Code inline mode with custom instructions.

## Process

The process is as follows.

1. Put all the unstructured data into folders. One per user, one per project, or wathever makes sense for your use case.
2. Write a bash script that loops over the folders.
3. Call Claude Code inline mode with a custom system prompt to clean and process the data inside the folder. For me, that looked like `echo "$input_prompt" | claude -p --append-system-prompt "$SYSTEM_PROMPT" > "$output_file"`
4. Profit!

The `$input_prompt` is basically a concat of all the files' content in the folder, with a simple instruction like _"Extract key information from the following content"_.

The `$SYSTEM_PROMPT` I ended up using was similar to:

```md
Extract key information from the data and output only the cleaned and structured Markdown.

Use this structure:

# [Project Name]

**Category:** [Extract from Project Category field or similar]
**Funding Request:** [Extract funding amount]
**Applicant:** [Extract applicant name]

## Project Description
[Extract and clean project description, preserve original wording]

## Funding Use
[Extract funding needs and use details]

## Impact
[Extract expected impact on ecosystem]

## Team & Contact
[Extract team info and contact details]

## Tags
[Assign one or multiple tags to the project from this list: TOOL, COMMUNITY, SECURITY]

---

Output the formatted markdown text directly, don't create any files. The output will be redirected to a file."
```

With this setup, you have the power of Claude Code as the processor with the flexibility and "exactness" of a simple looping bash script (e.g: the folders will be processed).

In the old times, I would have written a Python script using `transformers` library to do the processing/cleaning. These days, inlining Claude Code (or `llm`) is just so much easier and faster.
