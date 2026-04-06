---
sidebar_position: 99
title: Acknowledgments
---

# Acknowledgments

Are-Self exists because other people built incredible things and gave them away for free. This page is a thank-you to the projects and communities that make this work possible.

## Infrastructure

### Ollama

[Ollama](https://ollama.com) is the runtime that makes local AI accessible. Without Ollama, running language models on consumer hardware would still require a PhD in CUDA configuration. Ollama made it a one-liner. Are-Self's entire local inference stack — every model call, every embedding — runs through Ollama. The project's mission of "AI on hardware you already own" is only possible because Ollama exists.

### LiteLLM

[LiteLLM](https://github.com/BerriAI/litellm) is the routing layer that lets Are-Self talk to any model through a single interface. Local Ollama models, OpenRouter cloud models, any OpenAI-compatible endpoint — LiteLLM normalizes them all. This means Are-Self doesn't lock you into any single provider. Swap models, swap providers, mix local and cloud — LiteLLM handles the translation.

### OpenRouter

[OpenRouter](https://openrouter.ai) provides cloud model access as failover when local hardware isn't enough. Need a larger model for a complex reasoning task? OpenRouter routes to dozens of providers with a single API key. Are-Self uses it as the safety net behind local inference — your data stays local by default, cloud is there when you need it.

## Models

The brain models that power Are-Self's reasoning come from teams doing remarkable work in open-weight AI. These models are free to download, free to run, and getting better every month.

### Google DeepMind — Gemma

[Gemma](https://ai.google.dev/gemma) models bring Google's research to consumer hardware. Gemma 4 (April 2026) introduced strong tool-calling capabilities in a small footprint — exactly what Are-Self needs for autonomous reasoning on modest GPUs.

### Meta — Llama

[Llama](https://llama.meta.com) models changed the game for open-weight AI. The Llama family — from 7B to 70B+ parameters — gives Are-Self a range of options from fast-and-light to deep reasoning. Meta's decision to release these openly moved the entire field forward.

### Mistral AI

[Mistral](https://mistral.ai) builds efficient, capable models that punch well above their size. Mistral and Mixtral models are excellent choices for Are-Self's reasoning tasks, offering strong performance on hardware that doesn't cost a fortune.

### Qwen Team (Alibaba Cloud)

[Qwen](https://github.com/QwenLM/Qwen) models bring multilingual capability and strong coding performance. Qwen2.5 and its variants are solid workhorses in Are-Self's model rotation, especially for tool use and structured output.

### Nomic AI — nomic-embed-text

[nomic-embed-text](https://huggingface.co/nomic-ai/nomic-embed-text-v1.5) is the embedding model that powers Are-Self's memory system. Every Engram — every long-term memory stored in the Hippocampus — is a 768-dimensional vector created by this model running locally through Ollama. Your memories never leave your machine.

## Frameworks

### Django

[Django](https://www.djangoproject.com) is the backbone. Are-Self's entire brain-region architecture is built on Django apps, Django REST Framework, Django Channels, and Celery. Twenty years of battle-tested web framework engineering holds all of this together.

### React

[React](https://react.dev) powers the Are-Self UI — the visual neural pathway editor, real-time monitors, and every interactive element. The component model maps naturally to brain regions, making the interface as modular as the backend.

### Celery & Redis

[Celery](https://docs.celeryq.dev) handles task orchestration — every spike train, every autonomous reasoning step runs as a Celery task. [Redis](https://redis.io) serves as both the message broker and the caching layer. Together, they make the tick cycle tick.

### PostgreSQL & pgvector

[PostgreSQL](https://www.postgresql.org) with [pgvector](https://github.com/pgvector/pgvector) gives Are-Self a brain that remembers. Vector similarity search on Engrams, relational storage for everything else — all in one database, all on your machine.

## Community

### Docusaurus

[Docusaurus](https://docusaurus.io) powers this documentation site. Built by Meta's open-source team, it lets us focus on content rather than infrastructure.

### The Open-Source AI Community

Every person who files a bug report on an open model, writes a tutorial on running local AI, or shares their fine-tuning results makes projects like Are-Self possible. The open-source AI ecosystem is one of the most generous communities in technology. We're proud to be part of it.

---

*Are-Self is MIT licensed. If we missed someone who should be here, [open an issue](https://github.com/scipraxian/are-self-api/issues) and we'll fix it.*
