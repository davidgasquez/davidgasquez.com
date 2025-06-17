---
title: LLM Friendly Projects
date: 2025-05-24
slug: llm-friendly-projects
---

Everyone who is using LLMs and "Agents" (a.k.a. LLMs using tools in a loop) to code is trying to figure out what works and what doesn't.
This is far from trivial given the stochastic nature of these continuously evolving beasts.
Being a good programmer doesn't make anyone a good LLM user automatically!

I wanted to share a few things that I've been doing and you can do to make your projects a better place for today's LLMs.
Many of these ideas, I've picked up from [other](https://simonwillison.net/2025/Mar/11/using-llms-for-code/) [people](https://antirez.com/news/140) [sharing](https://minimaxir.com/2025/05/llm-use/) their experiences.

The TLDR of this post is really simple.
**You can make LLMs work better in your project by making the project more Human Friendly**.
Clear documentation, communicating with specificity, keeping a log of experiments, adopting sane standards, writing clear and typed code, ...

That is not new though. So, let me share what I've been doing specifically for our new shiny hammers, the LLMs.

## Helping LLMs Help You

Before jumping into project structure specifics, let's go over a non-exhaustive list of things that make LLMs happy:

- Giving them proper context.
- Using simple and specific prompts.
- Describing small problems with clarity and boundaries.
- Making things easy to run and test (Makefile, Docker, ...).
- Using well-known frameworks that appear in their training data.

With these basic ideas in mind, let's see what we can do to make the most out of the current LLMs' capabilities.

## Project Structure

Pick any of your current projects or start a new one. These tips should work for any project!

- Have a concise `README.md` file that explains the project and the quickest way to get started (e.g., `make setup && make run`).
- Create a detailed `CONTRIBUTING.md` file to cover how to contribute to the project. Some processes worth including:
  - How to set up the development environment
  - How to run the tests
  - How to run tasks
  - Project's commit guidelines and code style
  - Location of the relevant documentation (architecture, API design, ...)
- Soft-link your favorite LLM/Agent rules file (`CLAUDE.md`, `.cursor/rules.mdc`, `AGENTS.md`, ...) to `CONTRIBUTING.md`. If you use Cursor and your peers prefer to use Cline, with this approach, you have a common file for the rules! It also works with potential human collaborators, of course! You can `.gitignore` these soft-links to keep the repo clean.
- Create a folder that's listed in `.gitignore` to add external resources. For me, this is the place where I clone other relevant repositories, export interesting posts as Markdown, add temporary notes, and do many other things. Having files locally makes it easy to `@reference.md` them.
- Maintain [great documentation](https://davidgasquez.com/handbook/documentation). This is crucial to make LLMs effective. Besides the standard advice, I've found these extra steps help agents considerably:
  - Add a `log` folder where you add things you've tried and how they turned out.
  - Split the docs into small files with clear instructions and boundaries!
  - A `STATUS.md` file to keep track of the current status of the project, what's next, and relevant things to keep in mind. I don't really do this much as I tend to keep things on GitHub Issues. It's still useful in some projects where you want to underscore what should be next and the current issues.
  - Include relevant and important external API docs.
- Create `Makefile`s as the entry point for the main tasks: setup, build, test, run, clean. Having a Docker image ready also helps the agent know more about the environment it is running on.
- Use type hints if your language can do that, add docstrings, rely on data models (e.g., Pydantic), ...
- Be liberal with logging. Be verbose and `print` / `log` anything interesting!
- Adopt configuration as code when possible. For an LLM, it's easier to change a parameter in a YAML file than via a CLI command.

### Machine Learning Projects

Since I've been doing Machine Learning projects recently ([Kaggle-style competitions](https://davidgasquez.com/steering-ais/)), I've developed a few extra things I do [^1] on those projects.

- Document the features you're currently using and potential features you'd like to explore.
- Keep track of open questions and EDA tasks you'd like to explore.
- Maintain a `DATA_DICTIONARY.md` or similar with the terms you're using. Context is king.
- Rely on a functional pipeline style and modular feature engineering. **Use "micro pipeline" scripts to generate features**. If your dataset has granularity at the "user" level, create different scripts for different kinds of features that generate the `feature_name.csv` files. You can join them all later. This is one of the things I use a lot. Almost all the features I've added to my projects start like "Write a script that computes the user's [...]. Save as `feature_name.csv` with `user, feature_name` as headers."
- Track experiments. I'm bad at this one as I haven't figured out a simple enough way to do this reliably. Ideally, keep track of input features, model parameters, preprocessing, postprocessing, local evaluation, and remote evaluation.
- Have a temporary folder (listed in `.gitignore`) for the LLM to write small scripts and experiments. Here is where you'd have things like `inspect_csv.py` or other useful scripts that can give the LLMs context on the actual data (e.g., check columns, stats, ...)

## Conclusion

The beauty of optimizing for LLMs is that you're really optimizing for clarity, structure, and good practices that benefit everyone. Your future self will thank you, your collaborators will understand your work faster, and your AI coding assistants will be infinitely more helpful.

You can start by picking and implementing one or two of these ideas. Hopefully, your projects get friendlier with or without LLMs in the mix.

---
[^1]: It's not relevant to the project setup but worth sharing if you're working on ML competitions.
Since LLMs are useful when exploiting the asymmetry between coming up with an answer and verifying the answer, you can use that to create something like a **genetic algorithm on top of LLMs that iteratively improves the model**.
Basically, instruct them to improve the evaluation metric in a loop. Write an initial prompt.
The fitness function is the scoring function.
You let a bunch of LLM runs generate features, run the model, and score the model.
Generate the next population prompt with an LLM by combining the best approaches and ideas.
