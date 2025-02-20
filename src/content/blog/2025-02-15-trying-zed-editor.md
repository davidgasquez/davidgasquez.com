---
title: "Trying Zed Editor"
date: 2025-02-15
slug: trying-zed-editor
---

I used to spend afternoons testing new distros and configuring them. I jumped to the next one as soon as I got bored, until I settled on **Arch Linux**, btw.
These days, **I'm doing the same thing with LLMs and IDEs**.

For the last while, I've been using Cursor. It's been a great experience, specifically due to its LLM integrations.
At the same time, I'd love to support one of the open source (code, models, ...) and more customizable IDEs, like VS Code or Zed.
For now, it's been hard to justify using anything but Cursor due to how far I feel it is (for my use cases and skills¹).

These are some of the **killer features** that I've become dependent on:

- Smart Inline Editing / Jumping
- Cursor Agent
- Development Containers
- Jupyter Notebook integration
- PKM Extensions
- Codebase/Context Awareness

¹ I know you can probably make a better Cursor with `vim` or `emacs`, `aider`, ...

## Trying Zed

Zed has recently released a new feature that made it more appealing to me; their customized and open source inline editing and edit prediction Model, **[Zeta](https://zed.dev/blog/edit-prediction)**. Zed feels very great, snappy and clean, so I decided to give it a try.

Another big reason is that [Block](https://block.xyz/) recently released **[_Codename Goose_](https://block.github.io/goose/)**, a tool that allows you to run **LLMs with MCP support** from the CLI or GUI. With this tool and [some custom instructions](https://github.com/davidgasquez/dotfiles/blob/main/goose/.goosehints), I should be able to replace Cursor Agent.

I started setting up some [keybindings to make it easy to run Goose](https://github.com/davidgasquez/dotfiles/blob/85489a4149cc01b375ee979075fb535d709e0324/zed/keymap.json), tweaking the `settings.json` with my preferences, and configuring the `python` language server.

After using it for an afternoon, I was impressed by the speed and smoothness of the editor. I opened Cursor by chance and it *felt* slower than ever, even on smaller projects / files. Another thing I loved is the customizable inline editing feature. In Zed, you can provide context to the inline editing via the chat!

That said, after spending some more time with Zed, **I'm going back to Cursor**. I'd love to write down what it is that makes me go back to Cursor so I remember to check these things later.

I've noticed Zed is lacking the following features:

- **Lack of Jupyter Notebook support**. You can use the REPL but it's not the same. That said, it might be a feature and not a bug and finally make me do the jump to [Marimo](https://marimo.io/)!
- **No Agent mode**. Jumping into Goose is a couple of steps more of friction than using Cursor Agent.
- **The inline editing feature seems less powerful** than Cursor's. A few times, the suggestions were not what I wanted and got lost really badly.
- **Pylance support**. Even though I love the experience of using Zed to write Python (like their suggestions and code peeking tools), I'm not sure I can give up on Pylance (e.g: auto import, etc).
- **Chat with Search**. Haven't used it much on Cursor, but has been useful for quick questions.

I'm sure Zed will get these features eventually, and I'll be there to give it a try. For now, **back to Cursor**.
