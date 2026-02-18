---
title: "Useful LLM workflows (2024 Edition)"
date: 2024-12-13
slug: useful-llm-tools-2024
---

Since ChatGPT came out, I've been relying on LLMs for a lot of things. They've made me more productive and saved me a lot of time. More importantly, they've reduced the friction for doing interesting and small things (scripts, one off plots, etc). Wanted to share what tools I'm using and how I'm using them.

## Cursor

I reluctantly moved from VS Code to Cursor in June 2024. Once I tried Cursor, I realized it was better if I wanted to use and interact with LLMs. In terms of configuration, I don't rely on anything advanced. Here are a few things I've done to make it more useful for me.

- Adding Rules for AI [^1] prompt.
- Indexed lots of external documentation sites.
- Use notepads to describe the environment and project goals. For example, in these notepads I'll specify that Cursor should use `uv` to manage the Python environment.
- I wrote a post on how some of the [Cursor features are useful for note-taking](/notetaking-with-ides).

## LLM CLI

This is my favorite tool. I've been using the [`llm` CLI](https://llm.datasette.io/en/stable/) command for all sorts of things. It is very powerful as you can interact with it in a terminal, piping commands and using the output as input for other commands. Some things I've done with it:

- I've create lots of templates to do small things like:
  - Autogenerate git commit messages following the Conventional Commits specification.
  - Suggest an emoji from any input.
  - Craft medium-length bash commands (`grep` this `awk` that `sed` and `sort` it).
- Interrogate repositories using [`files-to-prompt`](https://github.com/simonw/files-to-prompt) or [`copychat`](https://github.com/jlowin/copychat).
- Ask [questions to any website](https://github.com/davidgasquez/dotfiles/blob/bb9df4a369dbaef95ca0c35642de491c7dd41269/shell/zshrc#L50-L73) using [markitdown](https://github.com/microsoft/markitdown).
- Ask [questions about any Youtube video](https://github.com/davidgasquez/dotfiles/blob/bb9df4a369dbaef95ca0c35642de491c7dd41269/shell/zshrc#L75-L99) using [yt-dlp](https://github.com/yt-dlp/yt-dlp)!

## Open Interpreter

I rely on [Open Interpreter](https://github.com/openinterpreter/open-interpreter) when I find that `llm` is not enough. Open Interpreter has a feedback loop that allows it to run code and get results. The trick I've found very useful is to **teach it to use `uvx` / `npx` / `docker` to run things** and **[Jina AI](https://jina.ai/) to search / summarize websites**. These are the instructions I've used to teach it:

```
Be concise.
Think step-by-step.
Be proactive and anticipate my needs.
Ask me to provide docs to the relevant packages or tools if needed.
Ask me to provide more context when needed.
Suggest solutions that I didn't think about.
Treat me as an expert in all subject matter.
Gather information before acting. Rely on `man` pages and `--help` commands. Don't truncate or grep them.
You can run Python packages with `uv tool run` (also known as `uvx`). E.g: `uvx package-name`. Use the `--help` command to learn more about the packages (e.g: `uvx package-name --help`).
Don't install anything with pip. Use `uvx` to run the packages instead.
You can add dependencies via `--with` flag. E.g: `uvx --with required-package package-name COMMAND`.
Don't check if the Python package is installed. Just run the package with `uvx`.
You can use jina.ai to do things.
The documentation is available at https://docs.jina.ai/ and can be read with curl (e.g: curl https://docs.jina.ai/).
Before running any jina.ai commands, first check the documentation.
The JINA API key is available in environment as `JINA_API_KEY`.
You can search the web with `curl https://s.jina.ai/search?q=query` (before doing this, check the jina.ai documentation with `curl https://docs.jina.ai/`).
You can run any npm package with `npx` (e.g: `npx package-name`).
You can run any docker command with `docker` (e.g: `docker run -d -p 8080:8080 image-name`).
First try solving the problem with existing CLI tools. If you don't know any CLI tool, write a small CLI with Python to perform the task.
```

With these instructions, I've used Open Interpreter to do one thing that would have taken me a while to figure out: **Downloading a Spotify playlist and converting it to a single file**. It'll just search or use existing Python/Node packages with `uvx` / `npx` and iteratively learn more about them (`--help`) to do the task.

---

[^1]: This is how my Cursor Rules for AI looks like.

    ```
    Be concise.
    Think step-by-step.
    Be proactive and anticipate my needs.
    Ask me to provide docs to the relevant packages or tools if needed.
    Ask me to provide more context when needed.
    Suggest solutions that I didn't think about.
    Treat me as an expert in all subject matter.
    Gather information before acting. Rely on `man` pages and `--help` commands. Don't truncate or grep them.
    ```
