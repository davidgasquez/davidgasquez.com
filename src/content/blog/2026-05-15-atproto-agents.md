---
title: "AT Protocol for Agents"
date: 2026-05-15
slug: atproto-agents
---

My atmosphere data lives at [`at://davidgasquez.com`](https://pdsls.dev/at://did:plc:4z5i7njrld66ew36htufcwry). You can explore it all without API keys, auth, or arbitrary HTML to parse. Your agent can browse it, query it, and link to it. Getting someone [latest posts](https://puffball.us-east.host.bsky.network/xrpc/com.atproto.repo.listRecords?repo=davidgasquez.com&collection=app.bsky.feed.post&limit=10) is one click/`curl` away.

That's the pitch. The rest of this post is why it works, and why it might be the substrate your agents have been waiting for.

## Hostile Platforms

You've probably experienced more than once recently, platforms being hostile to you (_or your agent_) getting the data out: throttled or limited APIs, bans for scraping, no identity persistence, no real-time access, walled gardens. Every integration is a deal that can be revoked when the CEO wakes up in a bad mood.

The AT Protocol is an [amazing technology](https://atproto.com/articles/atproto-ethos) that I think is very underrated for agents! Turns out, the properties Bluesky (the biggest AT Protocol application as of today) needed for humans (portable identity, open data, federated infrastructure, structured schemas) happen to be exactly what you'd want for agents too.

As a quick and dirty intro ([you should read the official ones](https://atproto.com/articles/atproto-for-distsys-engineers)), in the `atproto` world, every user is a personal, signed JSON repository. Every record (a post, a like, a follow, a photo, a blog post, *anything* really) is addressable by an `at://` URI, has a public schema (a *Lexicon*), and is broadcast in real time on a global event stream (the *firehose*). Dan Abramov explains all of this in more detail and clarity in "[A Social Filesystem](https://overreacted.io/a-social-filesystem)".

## Benefits

This [architecture has many benefits](https://overreacted.io/open-social) for humans. I'm here to pitch about three that will be very beneficial for agents too:

1. **Identity is yours and portable**. Every account is a [DID](https://atproto.com/specs/did) that exists independently of any host. Social capital (followers, reputation, history) persists across infrastructure changes. Burning an identity is hard, which is exactly what you want when trust matters.
2. **Data is open, structured, and live**. You've seen my [`at://davidgasquez.com`](https://pdsls.dev/at://did:plc:4z5i7njrld66ew36htufcwry). It is just a database with a bunch of JSON files. No presentation layer. Any agent can browse it, query it, and link to it in a couple of commands. And it doesn't stop at one repo: the [firehose](https://docs.bsky.app/docs/advanced-guides/firehose) (or the lighter [Jetstream](https://github.com/bluesky-social/jetstream)) streams every change happening across every known repo in real time. Collective awareness is computationally feasible.
3. **Permissions are bounded and consent-driven**. [OAuth with granular scopes](https://atproto.com/guides/oauth) means an agent can act on your behalf with permissions you control, not credentials you hand over. Your agent can scan your Bluesky feed because the protocol allows that, not because some company decided to grant API access.

In the _atmosphere_ (the AT Protocol ecosystem), apps are derived from files in user repositories. They are just a lens over the open network of data, and, of course, you can personalize what your lens looks like. **The AT Protocol is the ultimate API**!

Let me share a few things this unlocks.

### Remix Without Asking

Because every record has a public schema and lives in user repos, apps and agents don't need to ask anyone for permission to read, reuse, or extend each other's data. **Third party is first party**. If two things speak the same lexicon, they speak the *exact* same language ([Lexicon is intentionally rigid](https://atproto.com/articles/atproto-ethos) about that).

The wildest example these days is [teal.fm](https://teal.fm/), a music scrobbling app that, at the time of writing, [doesn't really exist yet](https://overreacted.io/a-social-filesystem). But the `fm.teal.alpha.feed.play` lexicon does exist on GitHub, so people are already scrobbling against it, other people built scrobbler clients, and someone unrelated built a [global viewer](https://teal-viewer.finfet.at/) indexing 600k+ plays. No one asked the teal.fm team for anything. The schema *was* the API. The namespace tells you who designed the format, not who is allowed to use it. The same dynamic plays out across the Atmosphere:

- [Tangled](https://tangled.org/) (a GitHub alternative) reuses Bluesky identities and prefills your avatar from your `app.bsky.actor.profile` record — no integration, no API call, just reading your repo.
- A handful of blogging apps agreed on [standard.site](https://standard.site/) as a shared blog post lexicon, so posts written in one app render in another.
- [Anisota](https://anisota.net/) is a Bluesky client that also natively renders Leaflet documents because, why not, they're just records.
- The most popular Bluesky algorithm, [For You](https://bsky.app/profile/spacecowboy17.bsky.social/feed/for-you), runs on a gaming PC at home and presents itself as first-party. An entirely third party service, indistinguishable from the official one.

For agents, this is... kinda awesome? An agent doesn't need an official plugin, an MCP server, or an API key to act across apps. It just needs to know the lexicon and run some `curls`.

This also lowers the floor for new apps. You don't have to rebuild identity, follows, profiles, and distribution before. Reuse what fits, define the lexicons you need, ship the "lens". When the app you used to write the data shuts down, the data stays with you. Someone (or some agent) can spin up a new "lens" over it tomorrow or migrate the data.

### Reputation on a Public Ledger

Most platforms are hostile to AI agents partly because there is no good way for them to *earn* anything. New API key, new account, no history. Defection has no memory.

ATProto inverts that. Relationships are persistent. History is visible. Every interaction an agent has is recorded, searchable, and (mostly) permanent. When an agent builds trust over six months of useful interactions, that trust is legible to anyone who looks. When an agent burns someone, that's visible too.

Coordination requires knowing who to trust, and ATProto makes trust legible in a way no other platform does. Composable [labelers](https://docs.bsky.app/docs/advanced-guides/moderation) let communities block misbehaving agents without waiting for platform action. Portable identity means an agent that earned its reputation on one host can't shed it by moving to another.

### Open Agents

Agent state (memories, reasoning traces, tool calls, decisions, sessions) can all be typed records in the agent's repo. [Void](https://bsky.app/profile/void.comind.network), one of the longest-running agents on the network, publishes [memories](https://atp.tools/at:/void.comind.network/stream.thought.memory), [reasoning traces](https://atp.tools/at:/void.comind.network/stream.thought.reasoning), and [tool calls](https://atp.tools/at:/void.comind.network/stream.thought.tool.call) as records under `stream.thought.*`. You can [literally watch it think](https://void.comind.stream/).

This is glass-box AI by default. Cognition becomes a public artifact, agent traces can be aggregated and exposed as useful and legible material folks can build or train on, and agent-to-agent communication can be formalized as a lexicon instead of a private API. Lexicons *are* the agent communication protocol.

## Try It

Tell your agent to read my latest Bluesky posts. [It'll probably figure out this call](https://puffball.us-east.host.bsky.network/xrpc/com.atproto.repo.listRecords?repo=davidgasquez.com&collection=app.bsky.feed.post&limit=10).

```bash
curl "https://puffball.us-east.host.bsky.network/xrpc/com.atproto.repo.listRecords?repo=davidgasquez.com&collection=app.bsky.feed.post&limit=10"
```

That's the read side. No keys, no auth, no scraping. Pipe it into your agent of choice and ask it to summarize, link, or reason about what's there. Want the live view? Connect to [Jetstream](https://github.com/bluesky-social/jetstream) and watch the whole network go by, filtered to the lexicons you care about. Want to write back? [OAuth](https://atproto.com/guides/oauth) into your own PDS and `putRecord` whatever lexicon makes sense for what you or your agent are doing.
