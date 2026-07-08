---
title: "Ephemeral Agent Workbenches"
date: 2026-07-08
slug: ephemeral-agent-workbenches
---

When I work with agents, my first instinct is usually to "just prompt" through the task. That is fine for many coding-adjacent tasks, but not everything I do can be easily codified, and I bet the same thing happens to you!

I've explored how to [make agents do subjective work better](/ranking-with-agents), and I think there is another underrated approach to using agents for subjective tasks, or tasks where the goals are fuzzy and you'd like to keep the final call: build local and ephemeral workbenches.

The idea is to have agents produce small pages/apps for the task at hand. For me, the clearest recent example is a grant review workbench I built. Instead of asking a model "_which application is better?_", I got it to build me a workbench to help me better understand the task.

In the workbench, I could see and sort every application, add random tags or notes as I read through them, visualize them on a 2D map to spot duplicates or core applications, etc.

The useful part was the handoff. I could click a button to copy the state and ask my agent to do things like complete the labeling from my manual labels, recluster, add a new field to applications, suggest due diligence questions, etc.

This gave both of us a high-bandwidth way to share state and made the feedback loop faster than chat. Chat alone is a bad interface for this kind of work because too much state stays implicit, or even hidden from you. With the workbench, I could inspect both the applications and the changes the agent wanted to make.

I have also applied this to other messy tasks: sorting and tagging invoices, [closing duplicate issues](https://x.com/badlogicgames/status/2017420406869594226), [understanding a diff](https://plannotator.ai/), exploring random datasets, and curating a reading/listening list. In all of them, I do not want the model making dumb decisions for me. I want a small tool that helps me make sense of the problem, see the state, change it, and bring the useful parts back to the model.

Some things that have worked well for me:

- Start with one simple vanilla HTML file, and grow it when needed.
- Put a short note in the file with the goal and how you want to use it.
- Add save and restore features. Clipboard or URL-encoded data is usually enough.
- Add a similarity map when the task depends on judgment. [Embeddings are still awesome](https://x.com/davidgasquez/status/2067284092727554544).
- Keep it interactive (click, tag, compare, add notes, sort, ...).

So, when facing a larger-than-usual task, I now ask for a small workbench before I ask for the answer or solution. [It also helps me learn](https://www.geoffreylitt.com/2026/07/02/understanding-is-the-new-bottleneck)!
