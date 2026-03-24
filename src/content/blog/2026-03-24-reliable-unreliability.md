---
title: "Reliable unreliability"
date: 2026-03-24
slug: reliable-unreliability
---

[Agentic engineering](/handbook/agentic-engineering/) is mostly about building reliable [systems](/handbook/systems/) around unreliable components (like your friendly coding agent).

A good analogy I like is how early computers were powerful, but not trustworthy enough to be used "raw". Hardware failed, bits flipped, and storage was noisy. Engineers had to build systems around the machine to make things more predictable. And, they came up with a bunch of interesting ideas!

- [Error correction codes](https://en.wikipedia.org/wiki/Error_correction_code)
- [Redundancy](<https://en.wikipedia.org/wiki/Redundancy_(engineering)>)
- [Checksums](https://en.wikipedia.org/wiki/Checksum)
- [Validation layers](<https://en.wikipedia.org/wiki/Defense_in_depth_(computing)>)
- [Retry logic](https://en.wikipedia.org/wiki/Automatic_repeat_request)

With these, even though reliability was not a property of the machine/computer, it **became a property of the system**.

This is something close to where we are with ["Agentic Engineering"](/handbook/agentic-engineering/).

As you've probably experienced, a coding agent can be fluent, useful, and very wrong at the same time! The key is to, like the early programmers did, treat agents as noisy components instead of trying to get the perfect/bigger one.

I had this intuition while [building a multi-agent ranking system](/ranking-with-agents/). Given some fuzzy evaluation criteria and a set of items, could a bunch of agents produce a reasonable ranking?

The obvious design was to put every item in a long context, ask one strong model to rank everything, and hope prompt engineering would carry the rest. That did not work. Models got confused by long contexts, rankings were inconsistent across runs, and prompt changes altered the results too much. Here, you can see models sound confident while still being noisy, biased, or unstable underneath.

The fix was not just "use a better model" but to redesign the system around the noise.

Instead of one judge, I used multiple agents making [pairwise comparisons](/handbook/pairwise-comparisons/). Each comparison is much smaller than a full ranking task (A or B). That reduces cognitive load for humans and context size for models. It also makes aggregation easier and more flexible. Once you collect enough pairwise preferences, you can derive rankings with explicit algorithms instead of trusting one giant sloppy answer.

Turns out, that architecture worked much better! In this case:

1. Keep context small and relevant. Asking for one pairwise judgment is often more reliable than asking for a full ordered list. Long contexts do not just cost more. They also make models worse.

2. Diversity improves reliability. Try things multiple times from multiple angles to get to some stable result.

3. Design for [modular components](/handbook/modularity/). Splitting the process into voting and aggregating the votes made both parts of the pipeline simpler and easier to evaluate.

The leaps I got were not from swapping to stronger models alone. Better models helped, but the real improvements came from environment design: isolated modules, useful glue code, clearer knowledge boundaries, proper validations, ... which is [another way of saying](/handbook/agentic-engineering/) that you should constrain the problem, narrow responsibilities, make failures visible, add recovery paths, and never trust a component just because it usually works!

**Make unreliability reliable again**.
