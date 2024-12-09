---
title: "Taking notes with IDEs"
date: 2024-11-28
slug: notetaking-with-ides
---

Back in 2016, I started [building a "Personal Knowledge Base" / Digital Garden](/building-a-pkb) as a way to capture my learnings. At the time, I was using Atom and kept my notes in Markdown files in a GitHub repository. That worked well but didn't realize all the things I was missing until I tried using Obsidian.

Obsidian made it easy to capture my learnings and connect them with other notes. It was a great tool, but I found myself switching contexts too often so I decided to switch back to using an IDE for note-taking. Let me share my setup and what benefits I've found.

## Setup

I'm using [Cursor](https://www.cursor.com/) as my IDE. It's a powerful editor that supports a lot of modern development workflows. To make it work better for note-taking, I've added the following extensions:

- [Markdown All in One](https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one): Adds a lot of functionality to the editor to make it easier to write Markdown.
- [Foam](https://foambubble.github.io/foam/): A personal knowledge management and sharing system inspired by Roam Research, built on Visual Studio Code and GitHub.

The editor opens with a blank terminal and a blank markdown file. I can use the terminal to run commands and the markdown editor to capture my learnings. I have a few small scripts that help me capture things. E.g: parse a YouTube video transcript and add it to my notes or convert websites to Markdown and add them to my notes.

## Benefits

Using a modern IDE to take notes has been a great experience so far. Here are some of the benefits:

- Reusing the same tooling for programming and note-taking.
- AI integration is seamless.
  - I usually **"chat with my notes"** to summarize them, ask questions, etc. You can `@file` or `@folder` to reference a specific note or folder and focus on that.
  - Search can be done semantically. E.g: "Where do I mention something related to the benefits of X?"
  - Where can I add some information about Y?
- Automatic formatting.
- Smoother git integration.

## Conclusion

An IDE can be a great tool for note-taking. It allows you to reuse the same workflows you use for programming. This might not work for everyone. For me, it works great because my notes are mostly summaries of external content or link to interesting things I find online.

Would love to hear more about how other people are taking notes and using AI to make them more useful for themselves! If you have any tips or tricks, please reach out!
