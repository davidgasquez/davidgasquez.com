---
title: "Adapting Kaggle Notebooks to Codespaces"
date: 2023-01-15
draft: false
---

For the last few years, I've been a pretty heavy user of Google Collab. Every time I wanted to play with a new package or idea, I created a new Jupyter Notebook.

Recently though, I've become a big fan of VS Code, and specially GitHub Copilot. Even though there is a way to [run Copilot in Colab](https://copilot.naklecha.com/), is not really the same flow as running it in VS Code.

To overcome this, I created a shiny GitHub Repository, `datalab`, that contains all the boilerplate needed to run the official Kaggle Docker image in GitHub Codespaces or Devcontainers.

[![davidgasquez/datalab - GitHub](https://gh-card.dev/repos/davidgasquez/datalab.svg)](https://github.com/davidgasquez/datalab)

This way, I can use Copilot to write my code, and run it in a Kaggle Notebook.

### Extra: Running Notebooks on the browser

With the [`joyceerhl.vscode-pyodide` extension](https://marketplace.visualstudio.com/items?itemName=joyceerhl.vscode-pyodide), you can simply go to [`github.dev`](https://github.dev/davidgasquez/datalab/blob/main/notebooks/2023-03-14-Pyodide.ipynb) and run some notebooks using Pyodide.

![Pyodide](https://user-images.githubusercontent.com/1682202/225039651-0dcf1fdb-3ebb-4640-9ecd-d7fb81ade9bb.png)
