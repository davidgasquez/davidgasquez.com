---
title: "Using MongoDB Change Streams to replicate data into BigQuery"
date: 2019-01-03
draft: false
url: /posts/mongodb-changestreams-bq
cover:
    image: https://miro.medium.com/v2/resize:fit:4800/0*lvnw5cWvVpkLEu5s
    caption: "Photo by Quinten de Graaf on Unsplash"
---

### _Learnings and challenges we faced while building a MongoDB to BigQuery data pipeline using MongoDB Change Streams_

Before jumping into the technical details, it’s good to review why we decided to build this pipeline. We had two main reasons to develop it:

1. Querying MongoDB for analytics is not efficient at a certain scale.
2. We don’t have all the data in MongoDB (e.g. Stripe billing information).
3. Data Pipeline as a Service vendors are quite expensive at a certain scale. And, usually, don’t offer a way of replicating deleted records as soft deletes (e.g. using a `deleted_at` field).

## Replicating Schemaless Data

One of the first things we noticed when working with this MongoDB database is that some collections had a tricky schema. The documents had nested documents inside and some of them were also arrays.

Usually, a nested document represents a one to one relationship and an array is a one to many. Luckily Big Query offers support both for [repeated and nested fields](https://cloud.google.com/bigquery/docs/nested-repeated).

The most common way of replicating MongoDB data based on our research is to use a timestamp field inside the collection. That field is typically named updated_at and gets updated each time a record is inserted or updated. This method is easy to implement with a batch approach and it only requires querying the desired collection. When applying it to our data and collections we found two main issues:

1. Not all the collections we wanted to replicate had this field. Without `updated_at`, how could we knew which records were updated to replicate them?
2. This method doesn’t keep track of deleted records. We simply remove them from the original collection and will never be updated in our Big Query table.

Luckily, MongoDB keeps a logs of all the changes that were applied to the collection in the `oplog`. Since MongoDB 3.6, you can query them using the [Change Streams API](https://www.mongodb.com/docs/manual/changeStreams/). With that, we could be alerted of each change (including delete operations) in the collections.

Our goal then was to build a pipeline that could move of all the change events records returned by MongoDD Change Streams into a Big Query table with the latest state for each record.

## Building the Pipeline

Our first approach was to create a change streams table in Big Query for each collection we wanted to replicate and infer the schema from all the change stream events of that collection. That turns out to be quite tricky. If a new field was added in a record, the pipeline should be smart enough to modify the Big Query table before inserting the record.

Since we wanted to have the data as soon as possible in Big Query we moved to another approach. Dump all the change streams events into BigQuery as a JSON blob. We can then use tools like [dbt](https://www.getdbt.com/) to extract, cast and transform the raw JSON data into a proper SQL table. This, of course, has some downsides but allowed us to have an end to end pipeline really soon.

The pipeline has the following components:

1. A service running in Kubernetes ([`carden`](https://github.com/bufferapp/carden)) that reads the MongoDB Change Stream for each collection and pushes it to a simple Big Query table (appending all the records).
2. A dbt cronjob that reads the source table with the raw data incrementally and materializes a query into a new table. This table contains the latest state for each row that changes since the last run. This is a sample of how the dbt SQL looks like in production.

{{< gist davidgasquez 958559e5ac2cc8e4ec3abf66be7927fc >}}

With these two steps we have **data flowing from MongoDB to Big Query in real time**. We also keep track of deletions and we have all the changes that took place in the collections we’re replicating (useful for some kind of analysis that require information about the changes over a period of time).

Since we don’t have any data before the date we started the MongoDB Change Streams crawling service we’re missing lots of records. To solve this we decided to backfill creating fake change events. We dumped the MongoDB collections and made a simple script that wrapped the documents as insertions. These records were sent into the same BigQuery table. Now, running the same dbt model give us the final table with all the backfilled records.

The main drawback we found is that we need to write all the extraction in SQL. That means lots of extra SQL code and some extra processing. At the moment it’s not too hard to handle using dbt. Another small one is that BigQuery doesn’t natively support [extracting all the elements of an array encoded in the JSON](https://stackoverflow.com/questions/52120182/bigquery-json-extract-all-elements-from-an-array).

## Conclusion

For us the pros (iteration time, ease of changes, simple pipeline) outweigh the cons. Since we’re just starting with this pipelines is really useful to have everything working end to end and iterate fast! Having the BigQuery append-only change streams table severs us as a separation. In the future we’re planning on moving to Apache Beam and Cloud Dataflow but that’s for another post!

Hope you’ve found these insights interesting! You can find me on Twitter as [@davidgasquez](https://twitter.com/davidgasquez). Don’t hesitate on reaching out if you have any question.
