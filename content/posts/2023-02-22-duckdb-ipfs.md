---
title: "Making DuckDB understand IPFS CID's"
date: 2023-02-22
---

Thanks to `fsspec`, you can query arbitrary filesystems with DuckDB quite easily.

To do so, you need to register a `fsspec` filesystem on DuckDB. Since IPFS has a supported `fsspec` plugin, [`ipfsspec`](https://github.com/fsspec/ipfsspec), we can register it and start to query directly it with SQL.

If you want to follow along, you'll need to install `ipfsspec`,  `duckdb` and `fsspec`. You can do so with:

```bash
pip install git+https://github.com/fsspec/ipfsspec duckdb fsspec
```

Now, let's register the IPFS filesystem on DuckDB:

```python
import duckdb
from ipfsspec import AsyncIPFSFileSystem

ipfs_fs = AsyncIPFSFileSystem()

duckdb.register_filesystem(ipfs_fs)
```

Once the filesystem is registered, you can use CIDs as URIs inside `read_csv_auto` or `read_parquet`!

The [`bafybeif5reawvqtsoybj5fhdl4ghaq3oc7kzepuws26zawkjm4johlv3uq` CID](https://bafybeif5reawvqtsoybj5fhdl4ghaq3oc7kzepuws26zawkjm4johlv3uq.ipfs.w3s.link/) is a CSV file. Querying it is as simple as:

```python
>> cid = 'bafybeif5reawvqtsoybj5fhdl4ghaq3oc7kzepuws26zawkjm4johlv3uq'
>> duckdb.sql(f"select * from read_csv_auto('ipfs://{cid}')")
┌────────┐
│   c    │
│ int64  │
├────────┤
│ 143732 │
└────────┘
```

For Parquet files, you can do the same with `read_parquet`:

```python
>> cid = 'bafkreibnx5q6qwxobozkdm6xt7ktvwciyfvtkgy7fud67w5oyxnf5tch4e'
>> duckdb.sql(f"select * from read_parquet('ipfs://{cid}')")
┌─────────────────────┬───────┬───────────────┐
│       entity        │ year  │ literacy_rate │
│       varchar       │ int32 │    double     │
├─────────────────────┼───────┼───────────────┤
│ Afghanistan         │  2000 │          28.1 │
│ Albania             │  2011 │          96.8 │
│ Algeria             │  2006 │          72.6 │
│ American Samoa      │  1980 │          97.0 │
│ Andorra             │  2011 │         100.0 │
│ Angola              │  2011 │          70.4 │
│ Anguilla            │  1984 │          95.0 │
│ Antigua and Barbuda │  2011 │          99.0 │
│ Argentina           │  2011 │          97.9 │
│ Armenia             │  2011 │          99.6 │
│    ·                │    ·  │            ·  │
│    ·                │    ·  │            ·  │
│    ·                │    ·  │            ·  │
│ Uruguay             │  2010 │          98.1 │
│ Uzbekistan          │  2011 │          99.4 │
│ Vanuatu             │  2011 │          83.2 │
│ Vatican             │  2011 │         100.0 │
│ Venezuela           │  2009 │          95.5 │
│ Vietnam             │  2011 │          93.4 │
│ Wallis and Futuna   │  1969 │          50.0 │
│ Yemen               │  2011 │          65.3 │
│ Zambia              │  2007 │          61.4 │
│ Zimbabwe            │  2011 │          83.6 │
├─────────────────────┴───────┴───────────────┤
│ 215 rows (20 shown)               3 columns │
└─────────────────────────────────────────────┘
```

Voilà!
