---
title: "Async Batch Requests in Python"
date: 2024-11-12
slug: async-batch-requests-python
---

As a data engineer, one of the most common tasks I perform is getting data from an API. For a long time, I've been using the `requests` library to make these requests.

However, I recently discovered the `httpx` library, which has a built-in support for asynchronous requests. At the same time, I've worked on a couple of projects that required a smarter approach than just making sequential requests. Let's go through an example of doing 100 requests.

## Sequential Requests

Doing 100 sequential requests with the `httpx` library looks like this:

```python
import httpx

data = []

with httpx.Client() as client:
    for i in range(100):
        response = client.get("https://httpbin.org/anything", params={"index": i})
        data.append(response.json())

```

## Async Requests

The same thing can be done asynchronously with `httpx`'s `AsyncClient`:

```python
import httpx
import asyncio


async with httpx.AsyncClient() as client:
    tasks = [client.get("https://httpbin.org/anything", params={"index": i}) for i in range(100)]
    responses = await asyncio.gather(*tasks)

    data = []

    for response in responses:
        data.append(response.json())
```

Now, doing this to a random API might not be super friendly to the API provider. In most cases, APIs have a limit on the number of requests per minute.

## Async Requests with Batching

The easiest way to do this is to use the `httpx.AsyncClient` with a semaphore. This will limit the number of concurrent requests to the API at any given time.

```python
import asyncio
import httpx
from typing import Dict, Any

BASE_URL = "https://httpbin.org/anything"
MAX_BATCH_SIZE = 10
TOTAL_REQUESTS = 100

# Create semaphore once, outside the function
semaphore = asyncio.Semaphore(MAX_BATCH_SIZE)

async def fetch(client: httpx.AsyncClient, index: int) -> Dict[Any, Any]:
    async with semaphore:
        request = httpx.Request("GET", BASE_URL, json={"index": index})
        response = await client.send(request)
        return response.json()

# Setup client and execute requests
limits = httpx.Limits(max_connections=100)
async with httpx.AsyncClient(http2=True, limits=limits) as client:
    print(f"Starting batch of {TOTAL_REQUESTS} requests")
    tasks = [fetch(client, i) for i in range(BATCH_SIZE)]
    results = await asyncio.gather(*tasks)
    print("All requests completed")
```

This works pretty well and might cover most of your use cases. However, there are places where you'll be rate limited by the API provider allowing only a certain number of requests per minute.

## Async Requests with Batching and Rate Limiting

To handle this, we can use the [`aiometer`](https://github.com/florimondmanca/aiometer) library which allows us to limit the number of concurrent requests.

The same 100 requests we did before, but with rate limiting looks like this:

```python
import asyncio
import functools
import random
import aiometer
import httpx

client = httpx.AsyncClient()

async def fetch(client, request):
    response = await client.send(request)
    return response.json()["json"]

requests = [
    httpx.Request("POST", "https://httpbin.org/anything", json={"index": index})
    for index in range(100)
]

data = []

# Send requests, and process responses as they're made available:
async with aiometer.amap(
    functools.partial(fetch, client),
    requests,
    max_at_once=10,  # Limit maximum number of concurrently running tasks.
    max_per_second=5,  # Limit request rate to not overload the server.
) as results:
    async for r in results:
        data.append(r)
```

You can tweak the `max_at_once` and `max_per_second` options to fine-tune concurrency!

## Conclusion

The `httpx` library combined with the `aiometer` library is a great addition to your toolbelt if you're doing a lot of API requests.

I've also made (alongside Cursor) a small and probably buggy Python package, [abatcher](https://github.com/davidgasquez/abatcher), with this functionality abstracted away behind a simple interface.

```python
from abatcher import AsyncHttpBatcher

# Create a batcher with a base URL and optional configuration
api = AsyncHttpBatcher(
    base_url="https://httpbin.org",
    max_concurrent=10,
    max_per_second=5,
    max_connections=50,
    timeout=30,
    retry_attempts=5,
)

# Simple GET request
result = api.get("/get")

print(f"Single request result: {result}")

# Batch of mixed requests
requests = [
    # Simple URL
    "/anything",
    # URL with params
    ("/anything", {"query": "test"}),
    # Full configuration
    {
        "url": "/post",
        "method": "POST",
        "params": {"name": "Test"},
        "headers": {"X-Custom": "value"},
    },
]

results = api.process_batch(requests)

print(f"Batch requests results: {results}")
```

Let me know if you have any feedback!
