---
title: "Specializing Pi"
date: 2026-03-11
slug: specializing-pi
---

I've written about [specializing Codex](/specializing-codex) and [Claude Code](/scrappy-data-cleaning) in the past. Here is how to do something similar for [Pi](https://pi.dev/)!

I made a small [profile extension](https://github.com/davidgasquez/dotfiles/blob/main/agents/pi/extensions/profile.ts) so I can launch somewhat contained agents with `pi --profile <name>`.[^install]

A Pi profile in this case is just a [small YAML file](https://github.com/davidgasquez/dotfiles/blob/main/agents/pi/profiles/sam.yaml) with some keys like model, thinking level, system prompt, and an allowlist of skills.

```yaml
model: openai-codex/gpt-5.4
thinking: medium
system: You are SAM, a pragmatic assistant. Concise and useful.
skills:
  - todoist-cli
  - agent-browser
```

When Pi starts, the extension loads that profile, switches to the configured model, replaces the system prompt for the turn, limits which `/skill:*` commands are allowed, and keeps sessions isolated per profile.

That gives me tiny task-specific agents without having to fork Pi or maintain a bunch of wrappers. For loosely defined chores, having `sam` (an assistant with access to my task list, email, ...), `juror`, or other little personas has been surprisingly useful.

[^install]: Install it by copying the extension file to `~/.pi/agent/extensions/` (or `.pi/extensions/` for a project-local setup) and then reloading Pi with `/reload`.
