---
title: "LLMing for free"
date: 2024-12-20
slug: llming-for-free
---

You can use the awesome `llm` tool for free with one of the best models available today!
In this small post, I'll show you how to do it in a few easy steps.

We'll setup `llm` with the new Gemini models from Google. These are currently [Top #1 and #2 in LLM arena benchmarks](https://lmarena.ai/).

## Install `llm`

I recommend installing `llm` using the `uv tool install` command from [`uv`](https://github.com/astral-sh/uv). Since we'll be using Gemini models, we need to install the Gemini plugin too.

```bash
uv tool install --with llm-gemini llm
```

Now you should have the command `llm` available in your CLI.

## Configuring `llm`

This step is easy. Go to [Google AI Studio](https://aistudio.google.com/) and grab an API key from the big blue `Get API key`. Then, run this command so `llm` asks you about the keys.

```bash
llm keys set gemini
```

Once the key is set, you're done! You should be able to run something like this with your preferred prompt.

```bash
llm -m gemini-2.0-flash-exp "Count to 10"
```

## Using `llm`

The most straightforward way of using `llm` is as shown before. To make things smoother, let's set a default model. There are many models (you can list them with `llm models`). Here are two that make a perfect default models given the ones available today: `gemini-2.0-flash-exp` or `gemini-2.0-flash-thinking-exp-1219`.

```bash
llm models default gemini-2.0-flash-exp
```

That's it! You can now use `llm` directly without any flags.

```bash
llm "Count to 10"
```

Speaking of flags though, there are a few interesting ones you should know.

- `-s` to set the system prompt to use.
  ```bash
  cat README.md | llm -s "You are an emoji suggester"
  ```
- `-a` to attach images, audio, or videos to the prompt.
  ```bash
  llm "Which cat is this one?" -a "https://upload.wikimedia.org/wikipedia/commons/2/25/Siam_lilacpoint.jpg"
  ```
- `-o` to pass some key value options to the model. [The Gemini models options](https://github.com/simonw/llm-gemini?tab=readme-ov-file#usage) are `code_execution` and `json_object`.
  ```bash
  llm 'use python to sum the first 50 prime numbers' -o code_execution 1
  ```

---

There are many more ways to use `llm`. I've [written about some of them previously](useful-llm-tools-2024) and am sure you'll find some other interesting uses.
Enjoy LLMing for free while it lasts!
