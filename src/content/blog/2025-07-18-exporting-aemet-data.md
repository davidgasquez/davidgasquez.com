---
title: "Exporting AEMET Datasets"
date: 2025-07-18
slug: exporting-aemet-data
---

In the same vein as my [previous little battles exporting INE's datasets](/exporting-ine-data-ii), I've spent some time this weekend exploring and trying to export some AEMET (Spanish State Meteorological Agency) datasets. I was interested specifically in archiving the historical daily weather across all stations and keeping that up to date.

This is a small post to share how that went and some learnings around AEMET APIs and how I developed the project (LLMs, uv, ...). Code and data are open and available on [GitHub](https://github.com/datania/aemet) and [HuggingFace](https://huggingface.co/datasets/datania/aemet).

![Weather forecast in Spain](https://s1.ppllstatics.com/surinenglish/www/multimedia/2025/06/16/weather-forecast-spain-16-june-kzwB--1200x840@Diario%20Sur.jpg)

## AEMET API

My goal here was to build a small script to export all the historical daily weather data for all stations in Spain on a schedule. Every time it runs, it would export all the data. I was curious if historical weather data changes much at all. Also, it is a great way to catch corrections or backfills on AEMET's side.

The [AEMET OpenData API](https://opendata.aemet.es/dist/index.html) is quite a standard REST API and easy to understand. You only need an API Key to start making requests. The API provides a wide range of endpoints. The two endpoints I focused on are under the `valores-climatologicos` section, which provides historical weather data and station metadata.

1. `api/valores/climatologicos/diarios/datos/fechaini/{fechaIniStr}/fechafin/{fechaFinStr}/todasestaciones` provides all the daily weather data for all stations within a specified date range.
2. `api/valores/climatologicos/inventarioestaciones/todasestaciones` provides all the stations and their metadata.

This looked easy, but there was something else I discovered when doing the first API call. The responses are not direct but require another call! This is how the process looks like; you do a first call to get the URL to the actual data

```bash
$ curl -X 'GET' \
  'https://opendata.aemet.es/opendata/api/valores/climatologicos/inventarioestaciones/todasestaciones' \
  -H 'accept: application/json' \
  -H 'api_key: ${AEMET_API_KEY}'
{
  "descripcion" : "exito",
  "estado" : 200,
  "datos" : "https://opendata.aemet.es/opendata/sh/b775b280",
  "metadatos" : "https://opendata.aemet.es/opendata/sh/0556af7a"
}
```

And then you do a second call to get the data.

```bash
$ curl https://opendata.aemet.es/opendata/sh/b775b280
[ {
  "latitud" : "394924N",
  "provincia" : "ILLES BALEARS",
  "altitud" : "490",
  "indicativo" : "B013X",
  "nombre" : "ESCORCA, LLUC",
  "indsinop" : "08304",
  "longitud" : "025309E"
},
.
.
.
]
```

I did that and then hit another issue. I kept getting [429 error](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/429). Turns out, [the API is rate limited to 50 requests per minute](https://opendata.aemet.es/centrodedescargas/docs/FAQs170621.pdf)! If getting each day's data takes 2 requests, that means we can only retrieve 25 days per minute. AEMET data starts around 1920, so there are slightly fewer than 40,000 days of data. Doing 25 days per minute would take ~26 hours to retrieve all data if nothing fails. Much longer than the maximum time we get on GitHub Actions runners (6 hours), where I wanted to schedule this.

While I kept thinking about a potential solution to that, I [finished the script and made it a small CLI](https://github.com/datania/aemet) that takes two dates and runs the API calls for that range. Simple and easy to use!

So, how does one distribute the workload so every week or so we export all the dates? Doing a GitHub Actions matrix wouldn't work because it'll consume API calls from the same API key. We need to go with a serial approach, and for that, I went with a modulo based distribution across years. That is, export around 4000 days per job and choose the years based on the job number. [First job takes the first 4000 days, second job takes the next 4000 days](https://github.com/datania/aemet/actions), and so on. Also, export the more recent 60 days in the same job so we always have the latest data.

With this, we have a simple setup that will take care of exporting 4000 historical days alongside the latest 60 days, every day. I don't expect historical data to change, but it's great to know that I'll be able to see the `diff` if it does!

To make seeing the `diff` easy, the simplest thing is to keep everything as JSON and rely on [HuggingFace Datasets](https://huggingface.co/datasets/datania/aemet) to version the data. Each run will commit new and updated data to the dataset, and we'll get a log of the changes.

[![datania/aemet - GitHub](https://gh-card.dev/repos/datania/aemet.svg)](https://github.com/datania/aemet)

## Process

This is probably the most interesting part and the main reason I'm writing this blog post. Even though I used _"I"_ when talking about the project and code, I mostly took care of prompting an LLM. Claude Code has been the author of the script and GitHub Actions. I've probably written less than 2% of all code!

The main "how to be better with Claude Code" learnings here have been:

- Always start with plan mode.
- [Have a `/simplify` command ready to use](https://github.com/davidgasquez/dotfiles/blob/main/claude/commands/simplify.md), and run it in a clean session once you finish a task.
- To polish things up, share some resources with it and ask for ideas to improve the code. In this case, I shared the awesome [Command Line Interface Guidelines](https://clig.dev/) website and asked to improve the CLI. It did a great job!

Nothing new overall, but it was great to have a small greenfield weekend project to debug these workflows.

Speaking of workflows, another interesting one I'm adopting is making the projects [one `uvx` command away](https://koaning.io/posts/uvx-pattern-for-two-tiers-of-open-work/). Since `aemet` is a CLI, you can start using it (if you have `uv` installed) with a single command!

```bash
uvx "git+https://github.com/datania/aemet"
```

This will create a temporary virtual environment with the project installed and run the `aemet` command.

## Conclusion

Doing small projects like this is an amazing way to experiment with new approaches. For me, it has been really fun to play with tools like Claude Code and try to figure out better ways of working with them. At the end of the weekend, I have a silly CLI that exports AEMET data to HuggingFace Datasets and a couple of patterns to steal away for future projects.
