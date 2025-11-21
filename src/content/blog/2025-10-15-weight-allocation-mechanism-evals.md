---
title: Weight Allocation Mechanism Evals
date: 2025-10-15
slug: weight-allocation-mechanism-evals
---

There are many folks working on mechanisms that can be boiled down to _"assign weights to items (projects, grant proposals, movies, etc) indicating their relative importance in a [credibly neutral](https://balajis.com/p/credible-neutrality) manner"_. Since there is no ground truth, these mechanisms often [involve human judgment](https://en.wikipedia.org/wiki/Social_choice_theory) (like in participatory budgeting) and can become quite elaborate. They end up having jurors, rounds, multiple parties, algorithms to aggregate scores, and so on. I'm talking about mechanisms like [Quadratic Funding](https://www.wtfisqf.com/), [Deep Funding](https://deepfunding.org/), [Filecoin ProPGF](https://filecoin.io/blog/posts/introducing-fil-propgf-a-new-era-in-community-led-public-goods-funding-for-the-filecoin-ecosystem/)/[RetroPGF](https://retrogrants.io/), and [Gitcoin Grants](https://gitcoin.co). As someone interested in these mechanisms (and a participant in some), I've been wondering about one simple but important question.

**Are these mechanisms assigning weights better than simpler alternatives?** How do we know if their weight distribution is good or bad? Are the final weight distributions _"better"_ than, say, a field expert assigning weights a Sunday morning in less than 10 minutes with a simple heuristic? How much better than random? Well, we don't really know. It is even hard to say what "better" means.

In this post, I explore the idea of having two different mechanisms:

1. A process to assign relative weights to items.
2. A process for choosing the best weight distribution mechanism.

For number one, interesting proposals like [Deep Funding](https://deepfunding.org/) are already working on it. For the second one though, we need more research and development! Fewer knobs and simpler rules leave less space for hidden privilege, so the meta-layer should default to simplicity and only add complexity when it clearly improves credibility or collusion resistance.

## TLDR

We need a meta-mechanism to evaluate and compare mechanisms and not only focus on the weight-setting mechanisms themselves. A simple approach is to use pairwise comparisons from jurors to evaluate how well a weight distribution aligns with their preferences. This framework can be used to measure how close the output of a mechanism is to the preferences of the jurors, optimize and tune the mechanisms themselves, and compare different mechanisms against each other. Always check that any fancy mechanism beats a naive baseline; bad incentives are worse than none.

## Problem Definition

There are a few components to this problem.

- Many items (i) that need to be assigned a relative weight.
- One or more mechanisms (m) that take the items and output a weight distribution (w). That's basically a vector of relative weights to all the items summing to 1 (can be seen as a point on the [simplex](https://en.wikipedia.org/wiki/Simplex)). The mechanisms could be an [ML/AI model](https://cryptopond.xyz/modelfactory/detail/2564617), a [prediction market](https://deep.seer.pm/), a community process, ...
- No objective truth! What you might see is a process to get to some consensus. E.g: using jurors (j) to share their relative importance between a few items.

The simple and ideal setups for this problem are, for example, a local referendum (high _j_ and low _i_) where hundreds of voters assign a collective weight to a tiny option set (Yes / No), or the Hugo Awards, where there are ~5 finalists (_i_) and thousands of ranked ballots (_j_). This, sadly, is not viable if you want to do things like funding open source repositories (many _i_) of an entire ecosystem with only a few "experts" (few _j_). In these areas, we need [ways to scale human judgment](https://vitalik.eth.limo/general/2025/02/28/aihumans.html).

|                        | Low _i_ (few items)                                                     | High _i_ (many items)                                                                |
| ---------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Low _j_ (few jurors)   | Steward heuristic session, kitchen-table consensus, juror-written memo. | Funding open source repos with a tiny panel, expert triage queue, Delphi refinement. |
| High _j_ (many jurors) | Local referendum (Yes/No), Hugo Awards ballots, ranked-choice sprint.   | Deep Funding, Quadratic Funding.                                                     |

## The Meta-Mechanism

We should have a **meta-mechanism** to evaluate and compare mechanisms and not only focus on the weight-setting mechanism itself. We need a way to measure how "fit" a weight distribution is to the sparse preferences of the jurors. With this, we can do a few things:

- Measure how close the output of a mechanism is to the preferences of the jurors (fitness function).
- Optimize and tune the mechanisms themselves to satisfy the jurors' preferences better.
- Compare different mechanisms against each other. A framework in which experiments can be run (e.g like double-blind experiments in science, or product A/B testing). A neutral way to compare the weights coming from different mechanisms.
  - Opening it up so anyone could send their own weight-distribution mechanism.
  - An evolutionary system where diversity can be introduced. There is a fitness function (how close to the jurors' preferences) and mechanisms can evolve over time.
- Keep fast feedback loops: run multiple allocation rules in parallel, include a simple baseline (expert heuristic or random) as a control, and iterate quickly on what actually beats that baseline.
- Make the rules legible and skin-in-the-game: jurors or selectors should feel the consequences of bad calls so incentives stay aligned.

## Pairwise Comparison Meta-Mechanism

Why not **use [pairwise comparisons](https://davidgasquez.com/ranking-with-agents/#simplify-decisions-with-pairwise-comparisons) from jurors to evaluate how well a weight distribution aligns with their preferences**? Have your jurors do pairwise comparisons between random items and then see which weight distribution agrees most with their choices (something similar to the RLHF approach used in LLMs, but applied to these weight distributions).

In experiments like Deep Funding, we already have jurors making pairwise comparisons (the data is being used to train models). Instead of [asking jurors which weight distribution they prefer](https://x.com/seer_pm/status/1977973181723099622), we can use all their pairwise comparisons to evaluate how well a weight distribution aligns with their preferences directly. Comparing weight distributions is not something humans are good at. It's easier to say "I prefer A over B" than "I think A should get 30% and B 20%". Imagine doing that for thousands of items! We need local preferences, not global ones.

Choose your favorite formula for measuring the distance/agreement between the weight vector and the pairwise data. Then pick the closest vector to all jurors' pairwise choices. This way, you use only the observed pairs (so sparsity is fine) while the formula aligns with the question "which vector would the jury choose if they had to choose one?"

There are many valid formulas to choose from. Personally, I think the formula you choose should:

- Use all the information collected. Not just a private subset of the jury comparisons.
- Scale-invariant. Only the relative weights within each pair matter, not the absolute values.
- Avoid producing extreme logits if the data does not support it. A mechanism that outputs (0.99, 0.01) when the jury is very split should be penalized.
- Be robust to noise and outliers in the data.
- No parameters to fit (smoothness, break-point, ...) so it is easy to use/understand and feel more neutral.
- Pair naturally with anti-metrics: if a mechanism produces a sharp split that jurors didn’t actually express, flag and down-rank it.

I'm sure there are a few options there! My hunch is that something simple like [Brier score](https://en.wikipedia.org/wiki/Brier_score) or log-loss on the pairwise comparisons could work well as starting points. Needs more thought and experiments! Multi-armed bandits or genetic search could decide which evaluation formulas to explore next, balancing exploration and exploitation in the meta-layer.

## Conclusion

The key insights are that (1) we don't only need better jury data or weight-setting algorithms, but something to choose the most effective weight-setting mechanism! And, (2) we should use data to choose the best mechanism, not human judgment of the mechanisms themselves. Without this, we might be just optimizing blindly.

With diverse mechanisms, we unlock the possibility of combinations and evolutionary approaches. This could lead to a more robust and adaptable system that can better handle the complexities of real-world decision-making. Permissionless, forkable evaluation infrastructure keeps the system credibly neutral and resistant to capture.

Finally, I think these problems can be mapped to RLHF in some ways worth exploring more. Similar to [how LLMs use pairwise/ELO style rankings when retrieving](https://www.zeroentropy.dev/articles/improving-retrieval-with-elo-scores), there is a body of work around "models ranking things" that probably have some interesting insights for this problem.

Thanks to [Devansh Mehta](https://x.com/TheDevanshMehta/) for the feedback and suggestions on this post!
