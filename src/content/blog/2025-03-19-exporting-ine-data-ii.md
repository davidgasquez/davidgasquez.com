---
title: "Exporting INE Datasets - Part 2"
date: 2025-03-19
slug: exporting-ine-data-ii
---

A few months ago, I found myself [downloading and converting all Spain's National Institute of Statistics datasets to Parquet](/exporting-ine-data) with the hope of making them easier to access and faster to use. Basically, I did a one time export with a bunch of bash scripts and some `aria2c` magic.

This last week, I've come back to the project with one goal: **automate it somewhere for free** so the [existing HuggingFace dataset](https://huggingface.co/datasets/davidgasquez/ine) is kept up to date and can act as an archive of all the data published by INE.

There are many ways I could've automated this pipeline but wanted to challenge myself adding a big constraint: [make it run on free infrastructure like GitHub Actions](https://bsky.app/profile/davidgasquez.com/post/3lkdroixbgs2s). I also wanted to try out the new Claude 3.7 model and needed a small project for it [^1].

The problem was, **how do you run a script that generates 500GB worth of data for free**? Well, you probably can't [^2]. What you can do instead is optimizing the different steps to make the process more efficient. Let's go through some of the things I did to make the process more efficient.

[^1]: This is the first project I work on end to end with the new Claude 3.7 model and was great! One thing I did to increase it's context was to work on the [documentation export script](https://github.com/davidgasquez/ine-data-exporter/blob/main/scripts/00-export-api-docs.sh) as soon as I picked up the project. One the model can see the docs, things improve a lot!
[^2]: There might be places where you can. I don't know all the infrastructure providers out there but would love to know if you find some!

### Optimizing Stuff

I was using `aria2c` to tackle some classic file downloading optimizations; split the datasets in chunks and download them in parallel, download multiple files in parallel, resume downloads that failed, handle retries, etc.

Something I discovered when revieweing the project was that I assumed `aria2c` was doing all of that, but, upon closer inspection, it was not. Turns out, **INE's servers don't really support range requests**. You can only download the whole file. And some files are larger than 100GBs (e.g: try downloading the `CSV: Separated by ;` file for [Travels, overnight stays and average stay by main features of the trips](https://www.ine.es/jaxiT3/Tabla.htm?t=15797&L=1))!

With that optimization gone, I started thinking on streaming sequential chunks of the remote CSV files into `zstd` compressed Parquet files as I was downloading them. This way, I could keep both memory and disk usage low. While playing with this idea, I discovered that downloading the files via `curl` was slower than using Chrome download manager. Huh! Chrome got to 25MB/s while `curl` was stuck at 8MB/s. How was that possible?

Well, Chrome was using a trick. The trick is to do the requests with an `Accept-Encoding: gzip` header (h/t to [Paco](https://bsky.app/profile/pacognlz.bsky.social) for spotting this). With this setting, the server compresses the file on the fly and the browser decompresses later. By default, `curl` doesn't do that on INE's servers. Why? Because the servers say that they don't support it.

```bash
❯ curl -s -I "https://www.ine.es/jaxiT3/files/t/es/csv_bdsc/10275.csv"
HTTP/1.1 200 OK
Date: Wed, 19 Mar 2025 15:54:50 GMT
Access-Control-Allow-Origin: *
X-UA-Compatible: IE=edge
Expires: Thu, 20 Mar 2025 15:54:51 GMT
Last-Modified: Thu, 11 Feb 2016 08:00:00 GMT
Content-Disposition: attachment;filename=10275.csv
Cache-Control: must-revalidate
Content-Type: text/plain;charset=ISO-8859-15
Content-Language: es
Set-Cookie: INE_WEB_COOKIE=es;Max-Age=31536000;Path=/
Set-Cookie: TS01c34874=018b1b3cc207f3a71c2384b3946af56b9635b0cbca0fcd434be196de4487b2f08570532afad824285c9bf6c945aa16e65408203fa5; Path=/; Domain=.www.ine.es
Transfer-Encoding: chunked
```

If we force the `Accept-Encoding: gzip` header, we get better performance and much lower disk usage. As one could expect, the CSVs contain string columns with repeated values, making compression more effective. With `gzip` the files end up being 8 to 10 times smaller. They still don't fit in the small GitHub Actions runners but it's a good start.

Going one step further, what if we compress the gzipped CSVs into Parquet files direclty? Then, we can iterate through all the datasets and keep only their optimized Parquet files. These final Parquet files are indeed an order of magnitude smaller than the original datasets so disk shouldn't be an isse.

That's exactly what I did. I used `duckdb` to read the compressed remote CSVs and do the transformation to Parquet on the fly using a couple of tricks; a custom `http` secret with the extra headers and a very large row group size to increase compression rates for large datasets. Here is the SQL that downloads the previous _Travels, overnight stays and average stay by main features of the trips_ table:

```sql
CREATE SECRET http (TYPE http, EXTRA_HTTP_HEADERS MAP {'Accept-Encoding': 'gzip'});

COPY (
    FROM read_csv(
        'https://www.ine.es/jaxiT3/files/t/en/csv_bdsc/15797.csv',
        delim=';',
        ignore_errors=true,
        normalize_names=true,
        null_padding=true,
        parallel=true,
        strict_mode=false,
        compression='gzip'
    )
)
TO 'data.parquet' (
    format parquet,
    compression 'zstd',
    parquet_version v2,
    row_group_size 1048576
);
```

It still takes a few minutes though. The original `15797.csv` file weights 37 GBs! But, it doesn't have an impact on memory or disk since DuckDB seems to be smartly ingesting it in batches into its WAL or similar. **The generated `data.parquet` file is only... [9.43 MBs](https://huggingface.co/datasets/davidgasquez/ine/blob/main/tablas/15797/datos.parquet)**!

Now, it was a matter of creating a GitHub Action that looped through all the tables, downloaded them and then pushed to HuggingFace Space. Surprisingly, the first Action I tried took 5 hours 40 minutes to go through the 5030 tables on its first try. Later, I discovered that the remote servers are not very stable and the next 3 runs failed. GitHub doesn't allow you to run an Action for more than 6 hours, and these were taking longer.

This task is "embarrassingly" parallelizable, so, I tried an async approach to it but the Actions runner were still struggling. I decided to try the trick where you [use the GitHub actions `matrix` feature](https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/running-variations-of-jobs-in-a-workflow) to run variations of the same job in parallel.

Added some extra `argparse` codee to the script to allow defining a split and the maximum number of splits that there are. With that, we can now split the 5030 tables into chunks. Each chunk will be processed independently on its own runner. [This worked like a charm](https://github.com/davidgasquez/ine-data-exporter/actions/runs/13951218869).

Finally, I wrote a couple of extra scripts to download the tables' series metadata and generate [simple yet useful READMEs at the folder level](https://huggingface.co/datasets/davidgasquez/ine/blob/main/tablas/15797/README.md). Something fun here is that some of the table's metadata get requests can return a correct (status `200`) response with this ~JSON~ string: `{ "Status: error"}`.

And with that, the project was completed (for now) with success! 🎉

You can [explore the scripts](https://github.com/davidgasquez/ine-data-exporter/tree/main/scripts) and even run them without downloading anything if you have `uv`. Here are the four commands you need to run to get your own copy of INE's datasets. No need to install anything else than `uv`.

```bash
uv run https://raw.githubusercontent.com/davidgasquez/ine-data-exporter/refs/heads/main/scripts/01-export-base-api.py
uv run https://raw.githubusercontent.com/davidgasquez/ine-data-exporter/refs/heads/main/scripts/02-export-datasets.py
uv run https://raw.githubusercontent.com/davidgasquez/ine-data-exporter/refs/heads/main/scripts/03-export-metadata.py
uv run https://raw.githubusercontent.com/davidgasquez/ine-data-exporter/refs/heads/main/scripts/04-generate-readmes.py
```

## Conclusion

It is quite amazing how much things can be optimized by [digging more into how things work](http://johnsalvatier.org/blog/2017/reality-has-a-surprising-amount-of-detail). This was a fun project to coma back too and learned quite a few things about servers, `curl`, async, parquet, ...

Next time, I'd love to generate a `ine.duckdb` database and host it somewhere so people can `ATTACH` to it and start querying right away!

Also, I have this other idea on my mind of creating a frankendataset by joining datasets with the same dimensions. E.g: the table `deceased_by_provice_by_year` containes the same columns (`province, year, value`) as `births_by_provice_by_year` and could be combined into a long dataset like `province, year, indicator, value`. We will see!
