---
id: will-it-run
title: "Will It Run?"
sidebar_position: 4
description: "Honest, friendly hardware guidance for Are-Self — what the zygote baseline needs, what more advanced genotypes want, and the free cloud endpoint for anyone whose machine can't keep up."
slug: /will-it-run
---

# Will It Run?

Yes. Almost certainly yes.

That is the short answer, and for almost every person who lands on this page, it is the only answer they need. If you have a computer that was decent five years ago and 16 GB of RAM, **Are-Self will run on it**, for free, locally, privately, on hardware you already own. No credit card. No gaming PC. No cloud account. No subscription.

This page is here for when you want the longer answer — when you want to know *which* models will be comfortable on *your* machine, when you're thinking about adding something more ambitious, or when a friend asks "can my Chromebook do this?" and you want to be able to tell them the truth with a smile.

The truth, up front: **AI should not be locked behind a credit card or a gaming rig**, and this project is built to keep that true. If your local machine can't run what you want, there is always a free cloud endpoint somewhere — we'll show you where to dig.

## The one-minute answer

If you just want to know whether to keep reading:

- **16 GB of RAM, any CPU from the last five years, no graphics card required** → you are fine. The zygote ships to you. Install it and go.
- **8 GB of RAM, older CPU** → probably fine for the very small models; will feel slow. Keep reading the "Tight on memory" section.
- **Chromebook, tablet, phone, or anything where you cannot install Docker and Ollama** → local won't work, but the free cloud endpoint will. Jump to [The free cloud escape hatch](#the-free-cloud-escape-hatch).
- **Laptop with an NVIDIA/AMD/Apple Silicon GPU** → you are in for a treat. Skip to [Growing past the zygote](#growing-past-the-zygote).

That's the whole map. The rest of the page just fills in the territory.

## What the zygote ships with

When you install Are-Self, it loads in stages — `genetic_immutables.json`, then `zygote.json`, then `initial_phenotypes.json`. The zygote is the newly-formed cell: the smallest complete, working Are-Self that exists. Every install starts here. Every kid, every grandparent, every teacher, every engineer, every researcher — same zygote.

We picked the zygote's model set on purpose. The whole thing has to run on a mid-range laptop from the last five years with no graphics card, because that is what the ten-year-old in the Chromebook-and-grandma's-desktop world actually has.

Here is what ships:

| Component | Model | On disk | Memory while running | Needs a GPU? |
|-----------|-------|---------|----------------------|---------------|
| Reasoning (the Frontal Lobe's thinking model) | `llama3.2` (3B parameters) | ~2 GB | ~3 GB RAM | No |
| Embeddings (the Hippocampus's memory) | `nomic-embed-text` | ~500 MB | ~600 MB RAM | No |
| Database + infra (Postgres, Redis, NGINX) | — | ~4 GB | ~2 GB RAM | No |

Add a little headroom for the operating system, the browser, and your own work, and the practical floor is **16 GB of RAM**. That's also the one line you'll see in the [Quick Start](./quick-start) — this page is the deeper explanation underneath it.

You'll want roughly **30 GB of free disk space** for the initial install (Docker images are big, Ollama models aren't tiny, and Are-Self's own data grows over time). A modern SSD is happiest; a spinning hard drive will work but everything feels slow.

**There is no GPU requirement in the zygote.** Ollama does CPU inference just fine at this model size. The tradeoff is speed — a reply the llama3.2 on CPU takes a few seconds to write instead of half a second — but nothing breaks, and nothing costs money. That's the point.

## Growing past the zygote

The zygote is a floor, not a ceiling. Are-Self is designed to get smarter as you give it more hardware — bigger models in the Hypothalamus catalog, richer identity addon stacks, more worker parallelism, longer context windows. Each step up the ladder costs you a little more memory or a little more GPU, and returns a lot more capability.

There's no one "version 2" of Are-Self that needs a better machine. It grows by *genotype* — by which models and identities the Hypothalamus is allowed to reach for — and you choose how far up the ladder to climb.

Here's the rough shape of the ladder. **These are guidelines, not guarantees** — quantization, context length, and what else is on your machine all shift the numbers.

| Model class | Examples | Runs comfortably on | On disk | Helpful to have |
|-------------|----------|--------------------|---------|-----------------|
| **3B–4B** (zygote floor) | `llama3.2`, `phi3`, `gemma2:2b` | 16 GB RAM, no GPU | 2–3 GB | anything modern |
| **7B–8B** (the sweet spot) | `llama3.1:8b`, `mistral:7b`, `qwen2.5:7b` | 16 GB RAM + 8 GB VRAM, or 32 GB RAM CPU-only | 4–5 GB | NVIDIA RTX 3060 / RTX 4060 / Apple M1+ |
| **13B–14B** (smarter reasoning) | `llama3.1:13b`, `qwen2.5:14b`, `mistral-nemo` | 32 GB RAM + 12 GB VRAM | 8–10 GB | NVIDIA RTX 3080 / RTX 4070 / Apple M-series with 16 GB+ unified memory |
| **30B–34B** (heavy lifting) | `mixtral:8x7b`, `qwen2.5:32b`, `command-r` | 48 GB RAM + 24 GB VRAM | 18–22 GB | NVIDIA RTX 3090 / RTX 4090 / Apple M3 Max+ |
| **70B+** (lab-bench territory) | `llama3.1:70b`, `qwen2.5:72b` | 64 GB RAM + 48 GB VRAM, or serious cloud | 40+ GB | RTX 6000 Ada, H100, or the free cloud endpoint below |

If none of those rows describes your machine, you are not alone — most people don't have a 4090 in a drawer. Keep reading.

### Quantization, briefly

When you look at a model like `llama3.1:8b` on Ollama, you'll see little tags after the name — `q4_K_M`, `q5_K_M`, `q8_0`, `fp16`. Those are *quantization levels*. They're the model's idea of whether it needs to remember every fact in high resolution or whether it can squash some of them down to save memory.

- **`q4_K_M`** (the usual default) — very small, ~60% memory of the full model, quality is shockingly good.
- **`q5_K_M` / `q6_K`** — a little bigger, a little sharper.
- **`q8_0`** — nearly full quality, about 50% more memory than `q4_K_M`.
- **`fp16`** — the original. Heaviest. Best quality on the margin.

If you are on a tight machine, stay on `q4_K_M`. If you have headroom, try `q5_K_M`. You'll rarely need to go higher unless you are doing something research-grade.

## The free cloud escape hatch

What if your computer can't do it? What if you're on a Chromebook, or a tablet, or a borrowed library desktop, or a ten-year-old laptop that wheezes?

You still have options. **There is always a free cloud endpoint somewhere if you're willing to dig.** The scipraxian line — AI should not be locked behind a credit card or a gaming rig — is not decorative, it's load-bearing, and this is the part of the page that makes it real.

The documented first stop is **OpenRouter's free tier**. Several providers publish free-tier endpoints through OpenRouter (the roster shifts; check the site), and the Hypothalamus routes through them the exact same way it routes through Ollama — the Frontal Lobe doesn't care which side of the wire the tokens came from.

Setup is short:

1. Make an account at [openrouter.ai](https://openrouter.ai) and generate an API key.
2. Drop the key into your Are-Self environment as `openrouter_api_key` — see the [OpenRouter guide](./openrouter) for the exact steps.
3. In the Hypothalamus's **CATALOG** tab, click **FETCH CATALOG** and filter by "free" — those are the endpoints that cost nothing to call.
4. Set one of them as the routed model for your identity.

You now have a cloud brain on a machine that cannot run a local one. It is slower than a GPU running the same model, faster than a CPU running the same model, and free. Beyond OpenRouter, Google AI Studio, Groq, and several other providers offer generous free tiers too — the pattern is the same, and a little searching turns them up. If you find a good one we haven't listed, let us know in the [Discord](https://discord.gg/nGFFcxxV).

One honest caveat: free-tier cloud endpoints have rate limits, and they are not private the way local Ollama is private — your prompts travel over the internet to someone else's server. If privacy matters to you (it should, for anything involving kids, health, or anything you wouldn't yell across a bus), treat the free cloud as a temporary bridge until you can run locally, not as the destination.

## Learning about model sizes

If you want to keep digging on which models to try:

- **[Ollama's library](https://ollama.com/library)** is the single best place to browse models by size, family, and use case. Every model page shows disk footprint, parameter count, quantization levels, and a little chat playground.
- **The [Hypothalamus](./brain-regions/hypothalamus) docs** explain how Are-Self picks which model to use for which job — it's not random; there's a routing strategy, budgets, and a circuit breaker for when a model misbehaves.
- **The [OpenRouter](./openrouter) guide** covers the full cloud setup, including the free tier and the failover pattern.
- **The [Frontal Lobe](./brain-regions/frontal-lobe) docs** show you what the reasoning engine actually does with whatever model you hand it — useful context for deciding whether you need the big model or not.

And if you are a person who learns better by doing — most people are — just install with the zygote, use it for a week, and *then* decide what to upgrade. The zygote is honestly enough for a lot of real work, and you'll have a much better sense of where the ceiling actually lives for you once you've bumped into it once or twice.

## Machine-shape answers

A few of the most common "can this run on my..." questions, answered straight.

**My five-year-old laptop with 8 GB of RAM.** Tight but doable. Run the zygote's `llama3.2` only, close your browser tabs, and accept that it will feel slow. Consider adding a free cloud endpoint for the jobs your machine won't finish.

**My gaming PC with an RTX 3060 (12 GB VRAM).** Excellent. You're in the 7B–8B sweet spot. Pull `llama3.1:8b` or `qwen2.5:7b` and the whole system will feel snappy.

**My Apple Silicon MacBook (M1/M2/M3) with 16 GB unified memory.** Excellent. Apple's unified memory treats your RAM and VRAM as the same pool, so you get GPU acceleration on every model that fits in 16 GB. 7B models are comfortable; 13B is tight but possible.

**My Apple Silicon MacBook with 32 GB+ unified memory.** You can go to 13B–14B comfortably, and squeak 30B-class in if you quantize hard. Are-Self on this machine is a joy.

**My Chromebook.** Local won't work. Skip to [The free cloud escape hatch](#the-free-cloud-escape-hatch). You can run the full Are-Self UI and backend if the Chromebook is in developer mode and can run Docker, but you'll be routing all inference to the cloud. That's fine — that's what the path is for.

**A Raspberry Pi.** Ollama technically runs on a Pi 5 with 8 GB of RAM, and you can pull `llama3.2` or `phi3`, but the whole Are-Self stack (Postgres, Redis, Celery, Django, Vite) is heavy. It's a fun experiment, not a daily driver. If you want low-power, a small Mac Mini or an N100 mini-PC is a better fit.

**A $400 Windows mini-PC from Amazon.** The Intel N100 / N305 / AMD Ryzen 7000 crowd has become Are-Self's unofficial reference cheap-hardware tier. 16 GB of RAM, good enough CPU for the zygote, silent, under $500 total. Works great.

**A datacenter GPU at work / school.** Lucky you. Pull whatever fits. 70B models that would crush a laptop fly on an A100 or H100. Check your institution's acceptable-use policy first.

## When the answer really is "no"

There's a small category of machines where Are-Self can't run even with the cloud hatch: things that can't install Docker Desktop (Windows 10 Home without virtualization support, very old macOS, locked-down corporate laptops, most tablets and phones). On those, the honest answer is "not locally, not yet." You can still use the storybook, read the docs, watch a demo, and *use* AI at scipraxian's free web endpoints or anywhere else — just not run the swarm engine itself.

If you're in that boat and it bothers you, tell us on [Discord](https://discord.gg/nGFFcxxV) or [open an issue](https://github.com/scipraxian/are-self-api/issues). We care about widening the floor. That's the whole job.

## What's next

- **[Quick Start](./quick-start)** — if you're ready to install, that page has the step-by-step.
- **[OpenRouter](./openrouter)** — if you're taking the cloud route, start there.
- **[Hypothalamus](./brain-regions/hypothalamus)** — if you want to understand how Are-Self picks its model at runtime.
- **[Getting Started](./getting-started)** — once it's running, this page walks you through your first hour.

And remember: the zygote is the floor because the floor is the promise. If your machine can run the floor, Are-Self is for you. If it can't, the cloud hatch is for you. Either way, you are welcome here.
