---
id: intro
title: What is Are-Self?
sidebar_position: 1
slug: /
---

# What is Are-Self?

**Autonomous AI reasoning on hardware you already own.**

Are-Self lets small, free, local language models work together as a swarm — reasoning autonomously, using tools, forming memories, and managing their own work. It runs on consumer hardware via Ollama, with cloud models as optional failover.

The architecture is modeled after the human brain. Each component maps to a real brain region and does what that region actually does. This isn't a metaphor for marketing — it's a design principle that makes the system teachable, debuggable, and honest about what each piece is responsible for.

## Why This Exists

AI shouldn't require a credit card or a computer science degree. Are-Self is built so that a student with a laptop and curiosity can run an AI reasoning swarm — for free, locally, privately. The models are free. The software is MIT licensed. The hardware is whatever you have.

## How It Works

You create AI personas (**Identities**), give them tools and personality, deploy them into work cycles (**Iterations**), assign them tasks, and let them reason autonomously. They select their own models, call tools, form memories, and learn from experience. You watch it happen in real time.

The system compensates for small models' limitations — short context windows, poor instruction following — with mechanical structure rather than raw capability. A 7B parameter model can do real work when the architecture handles the hard parts.

## The Brain at a Glance

| Region | What It Does |
|--------|-------------|
| **Identity** | Create AI personas with tools, personality, and budget |
| **Temporal Lobe** | Set up work cycles with shifts and participants |
| **Prefrontal Cortex** | Assign and manage tasks (epics, stories, tasks) |
| **Hypothalamus** | Model catalog, pricing, selection, circuit breakers |
| **Central Nervous System** | Execution engine — pathways, spike trains, neurons |
| **Frontal Lobe** | Reasoning sessions — watch AI think in real time |
| **Hippocampus** | Memory — vector-embedded facts that persist across sessions |
| **Parietal Lobe** | Tool execution gateway (server-side) |
| **Peripheral Nervous System** | Worker fleet monitoring |
| **Thalamus** | Chat interface — talk to the system from any page |

## Stack

- **Backend:** Django 6.x, Daphne (ASGI), Celery 5.x, Redis, PostgreSQL + pgvector
- **Frontend:** React, Vite, TypeScript
- **LLM Providers:** Ollama (local), OpenRouter (cloud failover), via LiteLLM
- **Embeddings:** nomic-embed-text (768-dim, runs locally via Ollama)
- **Real-time:** Django Channels (WebSocket) with typed neurotransmitter events

## Lic