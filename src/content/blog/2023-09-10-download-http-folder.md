---
title: "Downloading HTTP Folders Fast"
date: 2023-09-10
slug: fast-http-folder-download
---

I've been looking for ways to download a bunch of files recursively via HTTP. The first thing I tried, `wget`, worked reasonably well. You can do something similar to the following snippet to get a copy of the files in your local machine:

```bash
wget -r -np -nH https://example.com/files/
```

I was curious if there were any other tools better suited for the job (e.g: parallelization) so started looking for new and shiny things written in"Rust" and "Go". Nothing came up.

After a while, I discovered an almost older than me package, `lftp`, that does the `wget` thing, but in parallel and with some nice configuration options! You can get the same result, only faster, with the following command:

```bash
lftp -c 'mirror --parallel=100 https://example.com/files/ ;exit'
```

Always impressed by random old UNIX tools that not only work, but are the best at what they do.
