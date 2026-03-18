---
title: Public Goods Funding Needs Evals
date: 2026-03-20
slug: public-goods-funding-needs-evals
---

There are many interesting [funding](https://gitcoin.co/) experiments happening these days: RetroPGF, ProPGF, quadratic rounds, expert juries, ML competitions, prediction markets, and anything in between.

Experimentation is great. We should to try many things!

The point I made in the past is that [we need an evaluation layer for these experiments](/weight-allocation-mechanism-evals), otherwise we’re just running them on vibes and hoping they work. We change jury setups, aggregation rules, market structures, and eligibility criteria, then... just stare at the final allocation and move on. Most of the attention has gone into designing mechanism while almost none has gone into how do we tell they even work at all.

## The Missing Ground Truth

Values are plural. Impact can be fuzzy. Metrics get gamed. That does **not** make evaluation impossible. In fact, current mechanisms are being evaluated one way or another! [Without explicit evaluations mechanisms get judged anyway, just through opaque social processes that reward confidence, aesthetics, and insider legitimacy over evidence](https://www.jofreeman.com/joreen/tyranny.htm).

> Do these mechanisms beat simpler or cheaper alternatives on the metrics/values we care about?

## Evaluating Mechanism

A mechanism might produce a decent allocation and still be a bad fit. Mechanism can be too opaque, too expensive, too easy to game, or too hard to explain. Each implementation will require diferent tradeoffs. Having an evaluation layer makes these explicit so the community can take better decissions.

How does that look like?

**specify → collect → score → analyze errors → update → rerun**

### 1. Define "bettet"

What metric will be used to compare mechanisms?

- Agreement with holdout judgments?
- Retrospective impact to a set of KPIs?
- Stability across reruns?
- Robustness to noisy evaluators?
- Legitimacy with participants?
- Cost per unit of improvement?

### 2. Publish a Baseline

No mechanism should be discussed without a baseline alternative to compare against. 

- Equal split
- Random allocation
- Quick expert allocation
- Simple agent based allocation

### 3. Compare Blindly 

Do not ask people whether they like "the Deep Funding output" or "the expert allocation". Show _allocation A_ and _allocation B_ without labels. Ask which one looks better, which one looks most wrong, and why. Apps like [PGF Arena](/pgf-arena/) can make this kind of comparison easier.

### 4. Analyze Errors

Do not stop at leaderboard scores. Look at where the mechanism failed:

- Where it strongly disagreed with evaluators
- Where it produced obviously weird weights
- Where baselines beat it
- Where results were unstable under small changes

Then label the failure modes: noisy raters, confussing category, missing context, popularity bias, aggregation artifacts, gaming, overconfidence.

## Conclusion

With a principled approach, the output of a round is not only final allocation anymore. It is also the **cumulative learnings** the scientific method enables!

Public goods funding does need experimentation. It may not need more mechanisms until we know how well the ones we already have work.
