---
title: "Scrappy Data Cleaning"
date: 2025-08-05
slug: scrappy-data-cleaning
---

While working on a small analysis over highly unstructed data at work, I came up with a very hacky but effective and cheap way to clean and process messy data. There is almost no code involved. The main downside is that requires a Claude Code subscription for it to be cost effective!

The core idea is that you can **replace arbitrary chunks of scripts with Claude Code inline mode with custom instructions**.

## Process

The process is as follows.

1. Put all the unstructured data into folders. One per user, one per project, or wathever makes sense for your use case.
2. Write a bash script that loops over the folders.
3. Call Claude Code inline mode with a custom system prompt to clean and process the data inside the folder.
4. Profit!

## Example

This is how my latest Claude Code call looked:

```bash
echo "$input_prompt" | claude -p --append-system-prompt "$SYSTEM_PROMPT" > "$output_file"
```

The `$input_prompt` is basically a [concat of all the files](https://github.com/simonw/files-to-prompt)' content in the folder, with a simple instruction like _"Extract key information from the following content"_.

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

Output the formatted markdown text directly, don't create any files. The output will be redirected to a file.
```

In this setup specifically, Claude Code took care of cleaning very messy data for 40 projects. The important thing is that **it wasn't done in one Claude Code session**, as it would have lost track of which folders and files were processed. Instead, I used the **bash script to loop through each folder and call an inline instance of Claude Code** with the specific system prompt for that folder's content.

## Conclusion

In the old times, I would have written a Python script using `transformers` library to do the processing/cleaning. These days, inlining Claude Code (or `llm`) is just so much easier and faster. That's it.
