---
id: state
title: "Where Are-Self stands"
sidebar_position: 2
---

# Where Are-Self stands

> **FOR MIRA.**
> *(Yes, you. The real you. The one who asks the questions.)*

Are-Self is the box from the doorbell. Not literally — there's no doorbell, the slab isn't real, the cat-warmth was a metaphor. But the idea is real, and it's running. A thinking machine that listens. That thinks with you, not for you. Free. Local. On whatever device your family already has, even if it's fifteen years old, even if your only language isn't one most computers speak.

It's been alive for **16 weeks** — since January 2, 2026. It was released MIT-licensed and public on **April 7**. It is out there. It is not pre-release.

It is also not done. Nothing ever is. That's the honest part. Below is the truth about where the work stands today, what it does well, what it doesn't, and the five ways you can come along if you want.

---

## The two bars

**Core platform** — the part that runs the whole show. Brain regions, tick cycle, reasoning sessions, memory, the MCP server, the things that don't change after the foundation is laid.

`▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▱` ~95%

The last load-bearing piece is the **genome system** — Are-Self's name for installable bundles. Once it lands cleanly, new capabilities ship as bundles instead of changes to core. The unreal-engine bundle is the working proof. After genome lands, this bar stops moving and we call that 1.0.

**Bundles & Curriculum** — the part that grows forever. Bundles other people build. Courses for kids and the grownups who teach them. Papers. Translations. Screenshots. New brain regions when somebody finds one we missed.

`▰▰▰▰▰▰▰▰▰▰▰▱▱▱▱▱▱▱▱▱` ~55%

This bar is supposed to keep moving. It always will.

*Last updated: 2026-04-28.*

---

## What this costs me

Are-Self is free. The work that builds it isn't free for me.

I'm using the most advanced AI tooling I can get my hands on — Anthropic's Claude on the Max plan — because it's the fastest way to bring this mission into being. I could route through OpenRouter's free tier or sit at a local model and save the bill. I won't. Anyone who could use Are-Self today shouldn't wait an extra month while I save myself a coffee.

Current ballpark: roughly **$5–7 a day** in AI tooling, out of my own pocket. In 16 weeks of solo work that has bought:

- ~51,000 lines of Python with ~14,000 lines of matching tests
- Eleven brain regions wired and shipping
- The genome / Modifier Garden installable-bundle system
- An MCP server with 14 tools
- Twelve courses drafted in [`are-self-learn`](https://github.com/scipraxian/are-self-learn), ten complete
- Six research papers seeded, one in active draft
- The [Mira storybook](/docs/storybook)
- This documentation site you're reading
- The Walk-with-Frith daily dev-log series

If you want to underwrite some of that bill, the door is in [How to come along](#how-to-come-along). The work happens either way. Every dollar you put in is a dollar I don't have to, which means more keyboard hours toward what's next.

---

## What works today

**For the kid (or the grandparent helping the kid):**

- **Installs on a 16 GB laptop.** No credit card. No GPU. CPU inference via Ollama with `llama3.2` for thinking and `nomic-embed-text` for memory.
- **Cloud fallback** if local won't work — OpenRouter's free tier, documented at [/docs/openrouter](/docs/openrouter). The Chromebook kid is welcome here.
- **Mira and the Are-Self** — the storybook. Free to read. Free to print. [/docs/storybook](/docs/storybook).
- **Twelve courses drafted** in [`are-self-learn`](https://github.com/scipraxian/are-self-learn) — 4th grade through high school biology, intro Python, AI cost management, an Experience Master / agile course. Two more queued.

**For the developer:**

- **Eleven brain regions wired and shipping.** Tick cycle runs end-to-end: PNS → Temporal → CNS → Frontal → tools/memory/models. ~51,000 lines of Python, ~14,000 lines of tests.
- **MCP server at `/mcp`** — 14 tools across 6 brain regions. Connects to Claude Desktop, Cowork, Claude Code as a custom MCP. Speaks standard Streamable HTTP.
- **CNS graph editor** — ReactFlow-based, custom node components for the canonical effectors, drag-drop building of neural pathways.
- **Brain-mesh 3D background**, glassmorphic dark theme, URL-driven everything (F5 returns you exactly where you were).
- **Real ZeroSSL cert for `local.are-self.com`** so MCP clients on your machine talk HTTPS to your local stack.

**For the researcher:**

- **Six papers** in [`are-self-research`](https://github.com/scipraxian/are-self-research). The flagship — *neuro-mimetic AI architecture* — is the most complete. Evaluation section still has TODOs; if you want to push back on it, the LaTeX is there.

---

## What's not done

The genome system is the one in motion right now. The Modifier Garden UI installs and uninstalls bundles cleanly; install-time validation and the marketplace polish are landing in days, not weeks.

A few things I know are broken:

- **Session chat** — typing into the chat window of a running reasoning session sometimes doesn't deliver or persist. Two bugs, both queued.
- **Some pages render an empty inspector panel** until something is clicked. Not broken, but not pretty.
- **A handful of TypeScript build warnings** that don't affect users but block a clean `npm run build` until the next CNS UUID-migration sweep.

A few things are planned, not started:

- A bundle marketplace once the genome system is past 1.0.
- The remaining eleven courses still need the v1.5 rubric pattern rolled out (HS Biology is the reference implementation).
- More UI walkthrough screenshots.

This list is honest. It's not a roadmap. It's a status.

---

## How to come along

I'm building this either way. If you want to come along, here are the five real doors. I am Switzerland. I work with the people doing the work; I am not becoming any of them.

**1. Write curriculum.** Eleven of twelve courses still need the v1.5 three-file rubric pattern rolled out. If you teach — kids, college, corporate, whatever — run a course. I'll support you. I'm working through them in order regardless.

**2. Write papers.** The flagship has open Evaluation sections. The other five are seeded outlines. If you push back on the flagship, coauthor a section, or add a paper, the repo is [`are-self-research`](https://github.com/scipraxian/are-self-research).

**3. Write code.** Bundles are how Are-Self extends. The `unreal/` bundle is the example pattern — manifest, code, fixtures, the lot. Pick a `TASKS.md` item or write a bundle for the thing you wish existed.

**4. Find a 501(c)(3) to deploy Are-Self.** I'll never become a 501(c)(3) myself — that's not my role. But I'll absolutely work with one. If you know one that wants to put free AI in front of kids who don't have it, introduce us.

**5. Throw money at me.** If you want to underwrite the cloud-fallback that lets a Chromebook kid run Are-Self, here's how. The work happens either way. The bill goes down for the kid who didn't have to pay it.

- **GitHub Sponsors** — [github.com/sponsors/scipraxian](https://github.com/sponsors/scipraxian)
- **Ko-fi** — [ko-fi.com/scipraxian](https://ko-fi.com/scipraxian)
- **Buy Me a Coffee** — [buymeacoffee.com/scipraxian](https://buymeacoffee.com/scipraxian)
- **Patreon** — [patreon.com/scipraxian](https://patreon.com/scipraxian)

More endpoints as I add them. Shrug. Feel empowered.

---

## Recently shipped

*Hand-curated until the dev-log feed is wired. Latest first.*

- **2026-04-28 — Begin Play protection.** Hardening pass on the canonical Begin Play effector now that the genome cascade runs through it.
- **2026-04-27 — `mark-for-plasticity` merged into main.** The final lifecycle check on the unreal genome passed; canonical-genome cascade rework ("everything has genome = now") landed; genome serializers wired across most viewsets so the frontend can read bundle ownership directly.
- **2026-04-26 — Cascade puzzle solved.** Every bundle-extensible model now defaults to a non-null genome (the INCUBATOR), which collapses what used to be a tangle of cascade rules into one clean invariant.
- **2026-04-25 — First end-to-end successful surgery.** Full install / lifecycle / uninstall round-trip on the unreal bundle.
- **2026-04-25 — Genome router discovery wired.** Bundles can now ship URL routes via `V2_GENOME_ROUTER`; core auto-discovers them at boot.
- **2026-04-24 — Walk with Frith, episode 1.** Daily-ish dev-log video series, outdoor, no script.
- **2026-04-22 — Opening statement v2.** Updated framing pass on what Are-Self is for. Posted to YouTube and Facebook.
- **2026-04-19 — Modifier Garden scaffolding.** Front-end install/uninstall flow against the bundle registry.
- **2026-04-18 — ReasoningTurnDigest cutover.** Frontend now consumes a slim digest stream instead of the full graph_data blob; engrams and conclusion nodes back on the 3D reasoning graph.
- **2026-04-14 — `are-self-learn` launched.** Curriculum repo split out, twelve courses planned, ten drafted.
- **2026-04-07 — Public release.** MIT-licensed, all four repos under [scipraxian](https://github.com/scipraxian).

---

## Where to find more

- The story — [Mira and the Are-Self](/docs/storybook) (Book One of the Scipraxian Tales)
- The philosophy — [scipraxian.org](https://scipraxian.org) — the Creed, the Twelve Variables
- The sister vehicle — [hauntedspacehotel.com](https://hauntedspacehotel.com) (with Andrew Piper)
- Source — [github.com/scipraxian](https://github.com/scipraxian) — five repos, all MIT
- The dev log — Walk with Frith on YouTube and Facebook

---

*Welcome to the story. We saved you a seat at the table.*
