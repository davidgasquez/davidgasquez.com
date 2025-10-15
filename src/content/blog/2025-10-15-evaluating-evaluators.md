---
title: Evaluating Evaluators
date: 2025-10-15
slug: evaluating-evaluators
---

I've been [recently thinking about mechanisms that, given an arbitrary set of items (projects, grant proposals, movies), assign relative weights to them](https://davidgasquez.com/ranking-with-agents/) in a [credible neutral](https://balajis.com/p/credible-neutrality) way.

These mechanisms act on areas where there is no ground truth available and preferences are sparse/heterogeneous. Think of distributing grants, ranking projects, etc. They often involve humans and can be quite elaborate / time-consuming. They end up having jurors, rounds, multiple parties, algorithms to aggregate scores, and so on.

As someone interested in these mechanisms (and a participant in some), I've been wondering about one simple but important question.

**Are these mechanisms better than simpler alternatives?**

While all of the current complexities might be necessary (to keep things decentralized, credible neutral, ...), there haven't been many attempts to scientifically evaluate them or even establish a baseline to benchmark against. **How do we know if their weight distribution is good or bad**? Are the final weight distributions _"better"_ than, say, a field expert assigning weights a Sunday morning in less than 10 minutes with a simple heuristic? Better than random? Well, we don't really know. It is even hard to say what "better" means.

Here are some concrete examples of mechanisms that can be boiled down to _"given a set of items, produce a weight distribution vector according to certain criteria"_. These mechanisms optimize for properties like fairness (if A is more of "something important" than B, it should get a higher weight), credibility (the process is transparent, simple, hard to game, ...), and reliability (the results are consistent and trustworthy).

- [Deep Funding](https://deepfunding.org/). A machine learning competition with the goal of assigning weights to projects in the Ethereum ecosystem based on their impact on the ecosystem.
- [Filecoin ProPGF](https://filecoin.io/blog/posts/introducing-fil-propgf-a-new-era-in-community-led-public-goods-funding-for-the-filecoin-ecosystem/). A grant program to fund public goods in the Filecoin ecosystem where jurors assign weights to grant proposals based on multiple criteria.
- [Filecoin RetroPGF](https://retrogrants.io/). Similar to ProPGF but with a retrospective approach, where the goal is to reward projects that have already delivered value to the ecosystem.
- [Gitcoin Grants](https://gitcoin.co). Allocates funds to open source projects based on multiple mechanisms.

The process of _assigning weights to items_, as with many other human processes without ground truth, is inherently noisy and subjective. In areas with objective and clear metrics, we wouldn't need any of this! Sadly, we don't have that in many important areas and we need mechanisms to aggregate subjective opinions into a [collective decision](https://en.wikipedia.org/wiki/Social_choice_theory).

### Context

This is the definition of the problem at hand. We have a few components.

- Many items (i) that need to be assigned a relative weight.
- One or more mechanisms (m) that take the items and output a weight distribution (w). That's basically a vector of relative weights to all the items summing to 1 (can be seen as a point on the [simplex](https://en.wikipedia.org/wiki/Simplex)).
- No objective truth! You might have a process to get to some consensus. E.g: using jurors (j) to share the relative importance between a few items.

The simple and ideal setups for this problem are, for example, a local referendum where hundreds of voters (_j_) assign a collective weight to a tiny option set (Yes / No), or the Hugo Awards (~5 finalists and thousands of ranked ballots). This, sadly, is not viable if you want to fund open source repositories of an entire ecosystem. In these areas, we need [ways to scale human judgment](https://vitalik.eth.limo/general/2025/02/28/aihumans.html).

## The Meta-Mechanism

I think we should have a **meta-mechanism** to evaluate and compare these weight-setting mechanisms. This mechanism goal would be to **evaluate and compare weight distributions**. Basically a way to measure how "fit" a weight distribution is to the sparse preferences of the jurors. We would get a few interesting benefits from this.

1. Measure how close the output of a mechanism is to the preferences of the jurors (fitness function).
2. Optimize and tune the mechanisms themselves to satisfy the jurors' preferences better.
3. Compare different mechanisms against each other. A framework in which experiments can be run (e.g like double-blind experiments in science, or product A/B testing). A neutral way to compare the weights coming from different mechanisms.
  1. Opening it up so anyone could send their own weight-distribution mechanism.
  2. An evolutionary system where diversity can be introduced. There is a fitness function (how close to the jurors' preferences) and mechanisms can evolve over time.

Right now, most projects are focusing their resources on the "weight setting" mechanism itself. I worry this results in blind optimization, where the wrong thing keeps getting better. We need to step back and evaluate the mechanisms themselves.

We would then have two separate processes.

1. A process to assign relative weights to items.
2. A process for choosing the best weight distribution mechanism.

For number one, interesting proposals like [Deep Funding](https://deepfunding.org/) are already working on it. For the second one though, there is not much happening!

So, here is an idea of how to evaluate weight distributions that I think is simple and effective: **use pairwise comparisons from jurors to evaluate how well a weight distribution aligns with their preferences**.

Treat each weight vector as producing a score (or ranking) over the items, then pick the vector whose scores agree most with the jurors' pairwise choices. It uses only the observed pairs (so sparsity is fine), it's scale‑invariant, and it aligns exactly with the question "which weight vector agrees most with the jurors?".

In places like [Deep Funding](https://deepfunding.org/), we already have the pairwise comparisons so we can use them to select the mechanism that maximizes the number of satisfied comparisons ([Kendall distance](https://en.wikipedia.org/wiki/Kendall_tau_distance)) or even create a convex combination of mechanisms that maximizes the pairwise log-likelihood without any extra data collection. This is somewhat similar to the RLHF (Reinforcement Learning with Human Feedback) approach used in training models like ChatGPT, but applied to these weight distributions.

## Conclusion

The key insight is that we don't only need better jury data or weight-setting algorithms, but something to choose the most effective weight-setting mechanism! Without this, we are just optimizing blind.

With diverse mechanisms, you can also unblock the possibility of combinations and evolutionary approaches. This could lead to a more robust and adaptable system that can better handle the complexities of real-world decision-making.

---

## Meta-Mechanism Example

Here’s a tiny, concrete walk‑through using **popular GitHub repos as the items** and juror **pairwise choices** as the only data produced by ChatGPT!

### Goal

Pick the weight vector (w) (i.e., a mechanism’s output) that **agrees with jurors’ pairwise preferences most often**.

**Score(w)** = fraction of observed pairs ((a \succ b)) where (w_a > w_b).
(Equivalently, minimize Kendall disagreements on the observed pairs.)


### Setup

**Items (repos):**

* **L** = `torvalds/linux`
* **K** = `kubernetes/kubernetes`
* **R** = `facebook/react`
* **T** = `tensorflow/tensorflow`

**Observed juror pairwise preferences (sparse subset of all pairs):**

1. **L ≻ K**
2. **K ≻ R**
3. **R ≻ T**
4. **L ≻ R**

*(Only 4 comparisons; in practice you might have many more, but they can still be sparse.)*

**Three candidate mechanisms (each outputs a normalized weight vector):**

* **A (Expert‑style):** L 0.36, K 0.34, R 0.20, T 0.10
* **B (Alt heuristic):** R 0.35, L 0.30, K 0.20, T 0.15
* **C (Another method):** K 0.35, L 0.33, R 0.19, T 0.13

---

## Scoring by pairwise agreement

| Observed pair | A (0.36/0.34/0.20/0.10) | B (0.30/0.20/0.35/0.15) | C (0.33/0.35/0.19/0.13) |
| ------------- | ----------------------- | ----------------------- | ----------------------- |
| **L ≻ K**     | ✓ (0.36>0.34)           | ✓ (0.30>0.20)           | ✗ (0.33>0.35)           |
| **K ≻ R**     | ✓ (0.34>0.20)           | ✗ (0.20>0.35)           | ✓ (0.35>0.19)           |
| **R ≻ T**     | ✓ (0.20>0.10)           | ✓ (0.35>0.15)           | ✓ (0.19>0.13)           |
| **L ≻ R**     | ✓ (0.36>0.20)           | ✗ (0.30>0.35)           | ✓ (0.33>0.19)           |

**Totals**

* **A:** 4/4 correct (Kendall disagreements = 0)
* **B:** 2/4 correct (disagreements = 2)
* **C:** 3/4 correct (disagreements = 1)

**Winner:** **Mechanism A** — its weight ordering matches all observed juror choices.

---

## Why this works

* It’s **scale‑invariant** (only compares (w_a>w_b)).
* It’s naturally **sparse‑friendly** (uses only the pairs you have).
* It gives a **neutral yardstick** to compare mechanisms.
