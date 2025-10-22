---
title: "Specializing Codex"
date: 2025-10-22
slug: specializing-codex
---

A while back I wrote about [how I was using Claude Code to do some scrappy data cleaning](/scrappy-data-cleaning). That was ages ago in LLM time and I am now using [Codex](https://github.com/openai/codex). This post is me sharing how I "fine-tuned" `codex` to work on a few different tasks (classification, voting, ...) over a large set of items.

The main motivation behind using Codex or Claude Code for these kinds of tasks and not more minimal tools like [`llm`](https://github.com/simonw/llm) or [PydanticAI](https://ai.pydantic.dev/) is simple: **reuse my existing OpenAI/Claude subscription and avoid spending more money on AI stuff**. Also, they come with great tools and DX!

## How

Customizing `codex` for a specific task is a bit trickier than [customizing Claude Code](/scrappy-data-cleaning). For `codex`, we have to create a new folder and set that up as the `CODEX_HOME`. Let's see an example. Here are the steps you need to do if you want a new CLI that takes two options and chooses one based on custom criteria.

1. Create a new folder (`chooser`).
2. Add a custom `AGENTS.md`, [`config.toml`](https://github.com/openai/codex/blob/main/docs/config.md) to the previous folder.
3. Set `CODEX_HOME` environment variable pointing to that folder. Run `codex` to authenticate with ChatGPT interactively.
4. Create a [structured output file](https://github.com/openai/codex/blob/main/docs/exec.md#structured-output) relevant to the task.
5. Wrap the [`codex exec` command](https://github.com/openai/codex/blob/main/docs/exec.md) and flags in a custom script or alias. Redirect `stderr` with ` 2>/dev/null`.
6. You can now run `chooser ItemA ItemB` and get your `{"winner":"item_b"}` or similar. Profit!

Here are all the files that will get you to a `chooser` style CLI.

### `AGENTS.md`

```md
# Chooser

Choose which project is friendlier to new users. Take into account DX and repository activity.

## Skills

- **GitHub Stats**. Use `gh api` to explore repository stats, descriptions, and any other metadata that can help you decide if the answer is not clear.
- **GitHub Readme**. You can read any repository README with `gh api repos/$USER/$REPOSITORY/readme --jq '.content' | base64 --decode`.
```

### `schema.json`

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

### `chooser`

```bash
#!/usr/bin/env bash
set -euo pipefail

export CODEX_HOME=chooser

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
  --disable web_search_request
  --output-schema schema.json
  --full-auto
  --skip-git-repo-check
)

if (( $# > 0 )); then
  codex_args+=("$@")
fi

codex "${codex_args[@]}" "$prompt" 2>/dev/null
```

## Conclusion

I've used this pattern to run more than 10,000 invocations for classification style tasks using GPT-5 with medium reasoning efforts. Not sure how expensive these calls would have been using plain OpenAI API calls, but this makes experimenting more "safe" for me. I don't need to worry about choosing the best model, just if it fits my usage limits quota of the day!
