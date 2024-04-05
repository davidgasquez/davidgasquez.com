---
title: "DuckDB and BigQuery Storage API"
date: 2024-04-05
slug: duckdb-bq-storage
---

BigQuery has a not so well known API, [Storage API](https://cloud.google.com/bigquery/pricing#storage), that let's you grab a result set or table as Arrow datasets. It is cheaper than the standard query costs and integrates with all the rest of the Arrow ecosystem, like DuckDB.

You can test it out with this code:

```python
import duckdb
from google.cloud import bigquery

bqclient = bigquery.Client()

table = bigquery.TableReference.from_string(
    "bigquery-public-data.samples.shakespeare"
)

rows = bqclient.list_rows(table)

shakespeare = rows.to_arrow(create_bqstorage_client=True)
conn = duckdb.connect(":memory:")

conn.sql("""
    select
        word,
        sum(word_count)
    from shakespeare
    group by 1
    order by 2 desc
    limit 10
""")

```

Gives you a result like this:

```markdown
┌─────────┬─────────────────┐
│  word   │ sum(word_count) │
│ varchar │     int128      │
├─────────┼─────────────────┤
│ the     │           25568 │
│ I       │           21028 │
│ and     │           19649 │
│ to      │           17361 │
│ of      │           16438 │
│ a       │           13409 │
│ you     │           12527 │
│ my      │           11291 │
│ in      │           10589 │
│ is      │            8735 │
├─────────┴─────────────────┤
│ 10 rows         2 columns │
└───────────────────────────┘
```

The code is also available as a [Google Colab Notebook](https://colab.research.google.com/drive/1tEHP3Gdyfu8DVftyoACkLp7cIA6heEHr#scrollTo=FdYNGoTFuKIL)!
