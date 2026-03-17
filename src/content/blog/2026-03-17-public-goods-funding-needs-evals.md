---
title: Public Goods Funding Needs Evals, Not Just Mechanisms
date: 2026-03-20
slug: public-goods-funding-needs-evals
---

Public goods funding may no longer be bottlenecked by mechanism design. It may be bottlenecked by evaluation.

There are many interesting funding experiments right now: RetroPGF, ProPGF, quadratic rounds, expert juries, ML competitions, prediction markets, and hybrids.

Experimentation is great. We should to try many things!

But most of these are not experiments in the scientific sense. They are mechanism deployments with weak feedback loops.

We change jury setups, prompts, aggregation rules, market structures, and eligibility criteria, then stare at the final allocation.

**An allocation is not evidence that the mechanism works.**

## The Missing Layer

Public goods funding does not just need better allocation mechanisms. It needs **mechanism evals**.

There are two problems here:

1. **How do we assign weights to projects?**
2. **How do we tell whether one weight-assignment process is better than another?**

Most of the attention has gone to the first problem.

The missing layer is the second one.

A clever ranking, polished dashboard, or plausible-looking distribution is not evidence. It is only an output.

## The Ground Truth

Public goods funding has no single objective truth. Values are plural. Impact is fuzzy. Metrics get gamed. That does **not** make evaluation impossible. Current mechanisms are being evluated, just on vibes. If they weren't we could be using `random`!

The right question is not:

> Is this the correct allocation?

It is:

> Does this mechanism beat simpler alternatives on the metrics/values we care about?

If your mechanism cannot reliably outperform equal split, random, a simple rubric, or one informed expert with a spreadsheet, then the extra complexity is not progress.

**Complexity should be treated as a cost that must be justified by measurable gains.**

## What should be evaluated

Be explicit about the object of evaluation.

You can evaluate at least three things:

1. **The output** — the final ranking, weight vector, or allocation.
2. **The mechanism** — the process that produced it.
3. **The full process** — including transparency, reproducibility, cost, gaming resistance, and legitimacy.

That distinction matters.

A mechanism might produce a decent allocation once and still be a bad institution: too fragile, too opaque, too expensive, too easy to game, or too hard to explain.

Also, not all mechanisms are doing the same job. Some are trying to summarize retrospective judgment. Others are trying to predict future value. They should not be evaluated as if they were solving the same task.

## A basic standard

Every public goods funding round should come with a minimum eval pack.

### 1. Define "better" before looking at results

Better on what axis?

- agreement with holdout judgments?
- retrospective fit?
- stability across reruns?
- robustness to noisy evaluators?
- legitimacy with participants?
- cost per unit of improvement?

If you cannot say what success means in advance, you are not running an experiment.

### 2. Publish a baseline pack

At minimum:

- **equal split**
- **random allocation**
- **expert-in-an-afternoon**
- **simple public rubric**
- **previous round**
- **direct pairwise aggregation** if pairwise data exists

No mechanism should be discussed without its baselines.

### 3. Compare mechanisms blind where possible

Do not ask people whether they like “the Deep Funding output” or “the expert allocation.”

Show them allocation A and allocation B without labels. Ask which one looks better, which one looks most wrong, and why.

Tools like [PGF Arena](/pgf-arena/) are useful because they make this kind of comparison easier.

### 4. Separate training from testing

If a mechanism uses pairwise data, expert labels, or past rounds to tune itself, evaluate it on held-out judgments or later review.

Otherwise you are grading homework with the answer key still attached.

### 5. Do error analysis

Do not stop at leaderboard scores.

Look at where the mechanism failed:

- where it strongly disagreed with evaluators
- where it produced obviously weird weights
- where baselines beat it
- where results were unstable under small changes

Then label the failure modes: noisy raters, missing context, popularity bias, aggregation artifacts, gaming, overconfidence.

That is how mechanism design should improve.

## The real product

The most important output of a funding round may not be the final allocation.

It may be the **learning loop**:

**specify → collect → score → analyze errors → update → rerun**

That means the real public good is not just funding decisions. It is also:

- benchmark sets
- open scoring scripts
- public round data
- reproducible comparisons
- forkable evaluation tools

Open eval infrastructure is itself a public good.

Without it, rounds stay one-off governance rituals.

With it, rounds can become cumulative learning.

## Prove It

My view is simple.

**If a funding mechanism is complex, expensive, opaque, or hard to explain, it should have to earn its place through evals.**

Not by sounding sophisticated.
Not by producing a neat chart.
Not by being more legible to insiders.

By beating boring baselines on transparent tests.

Public goods funding does need experimentation.

But the field may not need more mechanisms right now. It may need shared evals for the ones we already have.
