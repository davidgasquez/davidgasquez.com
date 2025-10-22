---
title: "Specializing Codex"
date: 2025-10-22
slug: specializing-codex
---

I've been using [Claude Code to take care of scrappy data cleaning tasks](/scrappy-data-cleaning) for a while. These days though, I'm using [Codex](https://github.com/openai/codex) as my coding agent. Similar to what I did with Claude, I've been "fine-tuning" Codex CLI to work on a few different vaguely defined tasks like classification, voting, filtering, or ranking.

The pattern in this post works surprisingly well when you have the following conditions:

- Loosely defined open-ended tasks. e.g., tagging tweets with a set of predefined labels, extracting structured information from a GitHub issue, ...
- Powerful agentic capabilities. Doing the task requires something more than a simple [`llm` call](https://github.com/simonw/llm) or [PydanticAI](https://ai.pydantic.dev/) script. e.g., using `gh api` CLI to get the number of stars of a repository.
- [Structured outputs](https://github.com/openai/codex/blob/main/docs/exec.md#structured-output). You need a response in a certain shape! This is something `codex exec` can do that `claude` couldn't and is really powerful. e.g., return exactly `True` or `False` and nothing else.
- Save money! Unlike `llm` or other tools/libraries that require an `OPENAI_API_KEY`, Codex can use your ChatGPT subscription, making things "free".

Let's walk through an example of how everything fits together. We'll be building a very silly command, `chooser`, that compares two GitHub repositories and returns which one is friendlier to new users.

## How

Since we want an isolated `codex exec` experience, the first thing to do is to create a folder to act as the new agent home.

```bash
mkdir ~/.chooser
```

Once the folder is there, sign up with your ChatGPT subscription by running `CODEX_HOME=~/.chooser codex`.

Now, add an `AGENTS.md` file there to be used as the "persona" or "instructions" prompt across all calls. Here is mine.

```md
# Chooser

Choose which project is friendlier to new users. Take into account DX and repository activity.

## Skills

- **GitHub Stats**. Use `gh api` to explore repository stats, descriptions, and any other metadata that can help you decide if the answer is not clear.
- **GitHub Readme**. You can read any repository README with `gh api repos/$USER/$REPOSITORY/readme --jq '.content' | base64 --decode`.
```

You can also add a [configuration file (`config.toml`)](https://github.com/openai/codex/blob/main/docs/config.md) to fix parameters like `model_reasoning_effort` or `model`.

If your task can be mapped to a [structured output file](https://github.com/openai/codex/blob/main/docs/exec.md#structured-output), create a `schema.json` relevant to the task. This is the one I used for `chooser`.

```json
{
  "type": "object",
    "properties": {
      "winner": {
        "type": "string",
            "enum": [
              "item_a",
                "item_b"
            ]
        }
    },
    "required": [
      "winner"
    ],
    "additionalProperties": false
}
```

Finally, we can call a `codex exec` to tie things up.

```bash
CODEX_HOME=~/.chooser codex exec --full-auto --output-schema schema.json """
  Which project is friendlier to new users? Check contributor diversity.
  <item_a>Flask</item_a>
  <item_b>Django</item_b>
"""
```

In my case, codex took around 2 minutes (reasoning set to medium), used the `gh` CLI to do a bunch of calls, did a couple of web searches, and returned `{"winner":"item_b"}`. Yay! 🎉

To wrap things up, I created a bash script to make a better interface to it. I wanted to be able to run `chooser ItemA ItemB` and get the JSON. No extra logs or context. Here is the script. Place it in `~/.local/bin` and call it from anywhere!

```bash
#!/usr/bin/env bash
set -euo pipefail

export CODEX_HOME=~/.chooser

if (( $# < 2 )); then
  echo "Usage: ${0##*/} ITEM_A ITEM_B" >&2
  exit 1
fi

item_a="$1"
item_b="$2"
shift 2

prompt=$(cat <<EOF
Which project is friendlier to new users?
<options>
<item_a>${item_a}</item_a>
<item_b>${item_b}</item_b>
</options>
EOF
)

codex_args=(
  exec
  -m gpt-5
  -c model_reasoning_effort="medium"
  -c model_verbosity="low"
  --output-schema schema.json
  --full-auto
  --skip-git-repo-check
)

if (( $# > 0 )); then
  codex_args+=("$@")
fi

codex "${codex_args[@]}" "$prompt" 2>/dev/null
```

I created yet another script, this time in Python to act as the orchestrator. From my tests, you can call up to 500 `chooser` instances at once without being rate-limited. Quite wild taking into account that is GPT-5 with thinking!

## Conclusion

I've done more than 10,000 invocations of `chooser` and friends for loosely defined tasks and am really happy with the results I'm getting. The main drawback I would note is that the "fine-tuned" command still has the [`codex` system prompt](https://github.com/openai/codex/blob/bac7acaa7c3476361859905f708eba82c53abf68/codex-rs/core/gpt_5_codex_prompt.md). One could fork and update it but my hunch is that doesn't work if you are using the ChatGPT subscription.

I'm not sure how much I would have spent using plain OpenAI API calls, but having this pattern at hand makes experimenting a bit less scary for me. Also, I don't need to worry about model costs, just check if it fits that time window usage limits quota!
