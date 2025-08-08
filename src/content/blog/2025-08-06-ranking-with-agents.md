---
title: "Ranking with Agents"
date: 2025-08-06
slug: ranking-with-agents
---

> **TL;DR:** This post explores using a multi-agent systems for ranking tasks. Check out [Arbitron](https://github.com/davidgasquez/arbitron) if you want to see a working implementation of the pattern/ideas.


One of the latest [Kaggle style competitions](https://github.com/deepfunding/) I've [been participating in](/steering-ais) got me thinking about the difficulties involved in collecting accurate and relevant preferences from humans and aggregating them in somewhat consistent rankings or weight distributions.

I did some research around this general issue and, at the same time, [worked on a small tool to explore a potential approach for the competition](https://x.com/davidgasquez/status/1941525990024544418).

> **Can a bunch of LLM Agents be used to rank an arbitrary set of items in a consistent way?**

A couple of weeks later, I had the chance to attend the [Impact Evaluator Research Retreat](https://www.researchretreat.org/ierr-2025/) and, in the first few days, realized the idea was a perfect residency project.

I had the opportunity to explore this idea further and this post explores the main learnings!

<figure style="margin: 1em 0;">
  <img src="https://www.developerweek.com/wp-content/uploads/2024/12/DeveloperWeek-2025-Hackathon_featured.jpg" alt="contest" style="width: 100%; height: auto;" />
  <figcaption style="text-align: center; font-style: italic; color: #666; margin-top: 0.0em; font-size: 0.9em;">Ranking participants in large hackathons is no joke!</figcaption>
</figure>

## Problem

This is the general version of the problem.

> **Given an evaluation criteria and an arbitrary set of items, how can we produce the highest-quality judging results?**

It's a very common problem as you can imagine. You'll encounter it when jurors have to evaluate submissions in large hackathons or humans have to rank LLM responses based on "usefulness".

The naive (and _unfortunately_ the most common) approach is to ask humans to rate each item using a [Likert scale](https://en.wikipedia.org/wiki/Likert_scale) or similar. This has several issues:

- Every juror has a different scale and interpretation of the scale. Your 6 might be my 3.
- Without knowing the entire population, the first ratings are arbitrary as jurors don't have a global view.
- Humans excel at relative judgments, but struggle with absolute judgments. Is this a 7.3 or an 8.6?
- Also, humans are not very consistent. An 8 now could have been a 7 this morning.

As many people have realized long before me, [there are better ways](https://anishathalye.com/designing-a-better-judging-system/) to rank items (e.g. [chocolate](https://medium.com/@florian_32814/ten-kilograms-of-chocolate-75c4fa3492b6)). Let's look at one interesting approach.

## Simplify Decisions with Pairwise Comparisons

This is probably one of the simplest solutions. **Evaluate or rank the items by making jurors do pairwise comparisons between random items**. This helps in several ways:

- Avoid the issues of absolute ratings. Is A better than B? Yes or no?
- Reduce the cognitive load on jurors. They only need to compare two items at a time.
- Allow jurors to focus on the differences between items. Which one is better on the property X?
- Avoid some of the biases of absolute ratings.
- Capture qualitative information better.
- Make it easier to aggregate the results. No need to normalize or standardize ratings across jurors. Once you have the pairwise comparisons, you can use multiple algorithms to derive a ranking or weight distribution.
- Reduce the impact of outliers.

Quite cool! [Pairwise preferences](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3359677) is something that has been explored in the literature, but still feels underused in practice.

## In 2025 you have to use LLMs

So, LLMs can surely help with the judging/ranking process, right? Well, they can, but there are some challenges if you approach this challenge naively (using one LLM to rank all items).

- Loading all candidates/items in one long context will confuse the model.
- Running the same prompt twice will give you inconsistent results.
- Any prompt engineering you do will affect the results.
- The model is exposed to prompt injection.

Another approach is to have multiple agents and allow them to collaborate and talk between each other. I don't have any data to back this up but I think they'll probably lose track of the context and it would be more expensive. The first opinion will be very influential!

We've learned a better way though! What if we could have **multiple LLMs (agents) that are specialized in evaluating items based on different criteria**? Each agent could focus on a specific aspect of the items, and then we could aggregate their results.

That is basically what I set out to explore with [Arbitron](https://github.com/davidgasquez/arbitron) after realizing that using standalone LLMs with long context wasn't ideal for the competition I was working on.

## Arbitron

[Arbitron](https://github.com/davidgasquez/arbitron) is _"a multi-agent consensus ranking system to derive optimal weights through pairwise comparisons"_. Sounds [more complex than it is](https://github.com/davidgasquez/arbitron/blob/main/examples/simple.py). Think of it as a framework to define agents (LLMs in a loop with tools) that evaluate items based on different criteria. The results then get aggregated to produce a final ranking or weight distribution.

```python
import arbitron

movies = [
    arbitron.Item(id="arrival"),
    arbitron.Item(id="blade_runner"),
    arbitron.Item(id="interstellar"),
    arbitron.Item(id="inception"),
    arbitron.Item(id="the_dark_knight"),
    arbitron.Item(id="dune"),
    arbitron.Item(id="the_matrix"),
    arbitron.Item(id="2001_space_odyssey"),
    arbitron.Item(id="the_fifth_element"),
    arbitron.Item(id="the_martian"),
]

agents = [
    arbitron.Agent(
        id="SciFi Purist",
        prompt="Compare based on scientific accuracy and hard sci-fi concepts.",
        model="google-gla:gemini-2.5-flash",
    ),
    arbitron.Agent(
        id="Nolan Fan",
        prompt="Compare based on complex narratives and emotional depth.",
        model="groq:qwen/qwen3-32b",
    ),
    arbitron.Agent(
        id="Critics Choice",
        prompt="Compare based on artistic merit and cinematic excellence.",
        model="openai:gpt-4.1-nano",
    ),
]

description = "Rank the movies based on their soundtrack quality."

comparisons = arbitron.run(description, agents, movies)
ranking = arbitron.rank(comparisons)
```

The previous code will give you a ranking of the movies based on the criteria defined in the `description`! It uses [PydanticAI](https://ai.pydantic.dev/) for the LLM things and [choix](https://github.com/lucasmaystre/choix/) for the ranking algorithms. Some of my favorite features of Arbitron are:

- Supports arbitrary comparisons (text, code, pictures) thanks to multimodal LLMs.
- Customizable agents with unique personas, tools, providers.
- Ranking algorithm independent. Use whichever algorithm you prefer (Elo, Bradley-Terry, etc.).
- [Wisdom of the crowds stability](https://x.com/hwchase17/status/1796269356625875049) and some slight bias reduction as you mix providers and LLMs.
  - The key advantage is reducing single-point bias while maintaining explainability through agent reasoning traces. It's particularly powerful where "correctness" is multifaceted and subjective consensus adds value.
- Access the raw data. Mix it with human comparisons, see the reasoning of why item D lost against item A, ...
  - Reasoning / interpretability gives transparency.
- Cheap and embarrassingly parallelizable.
  - Use cheaper models while preserving quality.
  - Comparing is cheaper and easier than writing (output tokens).
  - Run across providers, machines, ...

### Evaluations

I've done a [couple of local experiments](https://github.com/davidgasquez/arbitron/tree/main/src/arbitron/evals) to evaluate the performance of Arbitron. I compared the [ranking accuracy (Kendall Tau)](https://github.com/davidgasquez/arbitron/blob/main/src/arbitron/evals/scoring.py) of different systems:

- Arbitron with 3 small agents (a.k.a Arbitrinity [^1])
- Arbitron with 10 small agents (a.k.a Arbiten)
- Gemini 2.5 Flash and Pro
- Claude Sonnet 4
- OpenAI o3-high
- ChatGPT (4o)
- Many smaller models
- Arbitron with 3 frontier agents (a.k.a Arbitrinity Max)
- Arbitron with 10 frontier agents (a.k.a Arbiten Max)

The first eval is to make agents choose [which movie was released earlier](https://github.com/davidgasquez/arbitron/blob/main/src/arbitron/evals/movies.py). This should produce a sorted list of movies.

In this simple example, most of the models got things right! The only ones that didn't were ChatGPT, GPT 4.1 and the small models. This type of knowledge is easily available inside the LLMs so they didn't have many problems to retrieve it.

The second eval is trickier. The goal is to [rank Wikipedia articles based on their popularity](https://github.com/davidgasquez/arbitron/blob/main/src/arbitron/evals/wiki.py) (cumulative number of page views since 2007). Now things get interesting as [this data is not common in their corpus](https://en.wikipedia.org/wiki/Wikipedia:Popular_pages).

> 🎮 [Check how you score in the same benchmark](https://davidgasquez.com/experiments/wikigame/)

Here are the scores of the latest run. The higher the Kendall Tau score, the better the ranking.

| Model            | Kendall Tau Score |
| :--------------- | :---------------- |
| Arbitrinity      | 0.2               |
| Arbiten          | 0.15              |
| Gemini 2.5 Pro   | -0.24             |
| Gemini 2.5 Flash | -0.33             |
| Opus             | 0.28              |
| GPT 4.1          | -0.06             |
| GPT o3           | 0.33              |
| Arbitrinity Max  | 0.16              |
| Arbiten Max      | 0.12              |

Even in this simple example with only 10 items (not taking a lot of context), Arbitron usually outperformed single models, except for Opus and o3. Interestingly, having 10 agents didn't seem to improve the results!

Anecdotically, the scores from Arbitron also seemed more consistent across runs ([others have noticed this previously](https://x.com/hwchase17/status/1796269356625875049)). More research is definitely needed!

A few interesting questions are worth still exploring:

- How does it compare to one human?
- How does it compare to a bunch of humans?
- Can we improve human accuracy by adding "agent" comparisons in the mix?

## Learnings

The biggest learning for me has been the improved intuition of why using pairwise comparisons works great in this context. I've also learned many things on the state of the art around using pairwise comparisons when training and evaluating LLMs (a common [approach since 2017](https://arxiv.org/abs/1706.03741)). There is a lot of literature around [aligning LLMs with human judgement using pairwise comparisons](https://arxiv.org/abs/2403.16950) that I wasn't aware of before!

Lots of these ideas are the base of [how RLHF works](https://arxiv.org/html/2505.11864v1#S3) these days. Modern RLHF practices (e.g. [pairwise reranker](https://www.zeroentropy.dev/articles/improving-retrieval-with-elo-scores)) use preference data rather than absolute due to the advantages of pairwise comparisons shared earlier. Chatbot Arena (which ranks all major LLMs) is entirely based on pairwise comparisons. People [building LLMs are relying on this](https://www.oreilly.com/radar/what-we-learned-from-a-year-of-building-with-llms-part-i/).

Another important realization is how much interfaces and UX matters. Both for Humans and LLMs. While doing the evaluations, I could feel how much the prompt design affected results! E.g: there is a strong verbosity bias where longer responses often win.

Finally, this approach is not a silver bullet. Every context will have different requirements and while Arbitron style systems typically get the direction right, the magnitude/weights it comes up with may be noisy.

## Uses

This approach shines where there is some subjectivity to it that is hard to measure (in cases where an objective answer exists, the agents could use a tool and they'll get it). Here are some areas that come to mind:

- Any kind of [Impact Evaluator](https://davidgasquez.com/handbook/impact-evaluators/) that has to attribute weights to every claim.
- Filtering items based on some criteria. E.g: grants proposals, hackathon projects, ...
- Coming up with a custom distribution function on top of the weights. E.g: force or avoid a peanut butter spread.
- Processes where prompt injection is common. Multiple agents from different providers make it much harder to game the system.
- Places where some plurality of opinions is needed. Different agents can represent different values/stakeholders in the evaluation.

## Future

Of course, I have a long list of things I'd like to continue exploring. There are many obvious improvements to the current tool like making it a web app, but also more interesting research questions:

- Is it better to have one contest or many contests with different values?
- How to make it more neutral and transparent?
- How resistant is it to adversarial attacks?
- What if each juror had a "custom research agent" it could trigger to dig into the question without affecting its own context?
- Inspired by DSPy, what if each comparison had a [paraphrasing of the goal description instead of the description itself](https://arxiv.org/abs/2406.11370)?
- Is it better to allow ties where both options may be equally good?
- What is the impact of using a different algorithm like PageRank or TrueSkill?

Overall, it was a very fun project and I'm very happy with the results (not so much with the costs [^2]).

<div style="display: flex; gap: 10px;">
<img src="/images/ranking-agents-claude-max.png" alt="Claude" style="max-width: 350px; max-height: 350px;" />
<img src="/images/ranking-agents-gemini.png" alt="Gemini" style="max-width: 500px; max-height: 350px;" />
</div>

Before wrapping up, I wanted to leave with a meta reflection. Arbitron name was [decided by the tool itself](https://x.com/davidgasquez/status/1942164800487788579/photo/1) after I asked it to rank a bunch of names. I later realized I don't like the name Arbitron. The meta-lesson here being that **sometimes the more important thing is not better mechanisms for the final rank, but better mechanisms for discussing and coordinating what to propose in the first place**.

## Acknowledgements

- [DeepGov](https://www.deepgov.org/) and their use of AI for Democratic Capital Allocation and Governance.
- [Daniel Kronovet](https://kronosapiens.github.io/) for his many writings on the power of pairwise comparisons.
- [Deep Funding Competition](https://github.com/deepfunding/)

[^1]: Naming is not my strong suit.
[^2]: Always set some threshold on your LLM providers!
