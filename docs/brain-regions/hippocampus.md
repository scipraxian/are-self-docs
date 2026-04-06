---
id: hippocampus
title: "Hippocampus — Memory"
description: "Engrams, vector embeddings, deduplication, and provenance chains"
slug: /brain-regions/hippocampus
---

# Hippocampus — Memory

## What It Does

The Hippocampus is long-term memory. It stores **Engrams**—vector-embedded snapshots of important facts, conclusions, or learned knowledge. Each engram has a name (a unique hash), a description (the actual fact), tags for categorization, a relevance score, and a 768-dimensional vector embedding. When the Frontal Lobe needs context, it queries the Hippocampus by similarity: "What do I know about this topic?" The Hippocampus searches engrams by vector cosine similarity and returns relevant memories to inject into the next session's prompt.

Engrams are deduplicated automatically. If you try to save an engram ≥90% similar to an existing one, the save is rejected with a pointer to the duplicate. This prevents the LLM from endlessly re-learning the same facts.

## Biological Analogy

In the brain, the hippocampus is critical for **episodic memory formation and consolidation**. It's where short-term experiences become long-term memories. Are-Self's Hippocampus mirrors this: engrams are the consolidation of what the Frontal Lobe learns into permanent, searchable knowledge. Just as the brain deduplicates similar memories (you don't remember every lunch separately, just "I eat lunch"), the Hippocampus rejects duplicate engrams. And just as memories have context (when, where, why), engrams carry full provenance: which session, which turn, which spike.

## Key Concepts

- **Engram**: A vector-embedded fact with name (hash), description, tags, relevance score, and 768-dim embedding.
- **Vector Embedding**: Auto-generated from description and tags using nomic-embed-text via Ollama.
- **Deduplication**: On save, cosine similarity checked against all existing engrams. ≥90% similarity = rejected with duplicate pointer.
- **Provenance Chain**: Every engram links back to the session, turn, spike, and IdentityDisc that created it. Full audit trail.
- **Relevance Score**: A numeric value (0–1) indicating how important the engram is. Used to rank search results.

## API Endpoints

### Engrams (Memory Records)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v2/engrams/` | List engrams (supports ?identity_discs=&#123;id&#125; filter) |
| `POST` | `/api/v2/engrams/` | Create engram (triggers dedup check) |
| `GET` | `/api/v2/engrams/&#123;id&#125;/` | Retrieve engram details |
| `PATCH` | `/api/v2/engrams/&#123;id&#125;/` | Update engram (regenerates embedding) |
| `DELETE` | `/api/v2/engrams/&#123;id&#125;/` | Delete engram |

### Engram Tags (Categorization)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v2/engram_tags/` | List tags |
| `POST` | `/api/v2/engram_tags/` | Create tag |
| `GET` | `/api/v2/engram_tags/&#123;id&#125;/` | Retrieve tag |
| `PATCH` | `/api/v2/engram_tags/&#123;id&#125;/` | Update tag |
| `DELETE` | `/api/v2/engram_tags/&#123;id&#125;/` | Delete tag |

## How It Connects

- **Frontal Lobe**: Calls Hippocampus.read_engram() during prompt assembly to inject relevant memories. Calls save_engram() when the LLM concludes with a new insight.
- **Identity**: Engrams are scoped to IdentityDiscs. Each disc has its own long-term memory.
- **Parietal Lobe**: The `mcp_engram_save`, `mcp_engram_read`, `mcp_engram_search`, and `mcp_engram_update` tools are Parietal Lobe gateway calls to the Hippocampus.
- **Central Nervous System**: Engram saves and reads are logged as side effects of spike execution.
- **Hypothalamus**: The IdentityDisc's vector embedding is used for model selec