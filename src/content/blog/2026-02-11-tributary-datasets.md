---
title: "Eliciting useful datasets"
date: 2026-02-11
slug: tributary-datasets
---

Open datasets are everywhere. Maintained datasets are rare.

I keep seeing the same pattern in [open data ecosystems](/modern-open-data-portals). A few folks do expensive [curation work](/community-level-open-data-infrastructure), the rest of us [free-ride](/handbook/public-goods-funding/), and eventually the dataset goes stale because data wrangling is time consuming, tedious, and technically demanding. [Spending time curating and maintaining datasets for other people to use doesn't make economic sense, unless you can profit from that](https://davidgasquez.com/handbook/open-data).

This post is about a simple question, and a potential solution. The question is: **Can we design a credibly neutral way to [incentivize](/handbook/incentives/) and elicit useful datasets for tasks with benchmarks?** The solution I came up with is a mechanism I call "Tributary". Let's dive in.

## Mechanism

Tributary is a PoC [mechanism](/handbook/mechanism-design/) that works like a flipped [open source Kaggle-ish competition](/steering-ais). That is:

- Design a benchmarked task with a **hidden test set**.
- Keep the **model fixed** (e.g., Random Forest).
- Let participants submit **data**, not models.
- Reward contributors based on how much their data improves benchmark performance.

So instead of "who trained the best model", the question is **"whose data improved the task you care about the most"**.

Having a fixed model and scoring criteria makes the evaluation objective and reproducible. It works like a benchmark for the most useful data.

This framing is close to [DataPerf Training Set Acquisition](https://www.dataperf.org/training-set-acquisition/acquisition-overview), where the core problem is deciding what data to buy under constraints, then scoring quality on held-out evaluation.

## Credible Neutrality

In this mechanism, [credible neutrality](https://balajis.com/p/credible-neutrality) maps to:

1. **No hand-picked winners** in the rules. If the data improves the score, it gets rewarded.
2. [**Open code and verifiable execution**](/credible-neutral-ai-competitions). Anyone can check the rules and verify the results.
3. **Simple mechanism** before fancy economics.
4. **Slow-changing rules** so people can trust the game.

In practice, this pushes the design toward plain and simple git repositories, public scripts, deterministic evaluation, and auditable artifacts.

## Tributary

I built a minimal prototype, [`tributary`](https://github.com/davidgasquez/tributary), that implements the above mechanism. It has:

- A `public.asc` for encrypting participants' dataset submissions
- An encrypted test set (`data/test.csv.asc`)
- A fixed model (`model.py`)
- A script to evaluate submissions (`evaluate.py`)
- A registry for submissions (`submissions.yaml`)

### Workflow

Say you want to contribute a dataset. You play the game by:

1. Encrypting the dataset you want to train the model with using the public key.
2. Opening a PR adding a URL to `submissions.yaml`. Ideally you point to a [CID](/handbook/ipfs/) (immutable hash of the content).
3. The PR gets merged and `tributary` downloads, decrypts, trains a fixed model, computes score on hidden test set and updates the leaderboard based on the **marginal contribution** of your dataset.

Since we cannot directly verify every row, the mechanism pays for information that improves predictive power or agreement structure. This is an idea that appears in a lot of [peer prediction and information elicitation work](/handbook/mechanism-design/):
   - [Truthful Data Acquisition via Peer Prediction (NeurIPS 2020)](https://proceedings.neurips.cc/paper/2020/file/d35b05a832e2bb91f110d54e34e2da79-Paper.pdf)
   - [Peer Truth Serum (2017)](https://arxiv.org/pdf/1704.05269)
   - [A Market Framework for Eliciting Private Data (NeurIPS 2015)](https://proceedings.neurips.cc/paper/2015/file/7af6266cc52234b5aa339b16695f7fc4-Paper.pdf)

## Conclusion

I don't think this mechanism is perfect and definitely needs more work, but I do think it is a credibly neutral path to test a narrower claim. That is, **given a benchmarked task, can we reward the creation of useful data directly, in public, with rules everyone can audit?**.

Hopefully, something like this can be used in the future to start rewarding the hard work of data curation of open datasets, and to start building a culture of dataset maintenance and stewardship.
