---
id: identity
title: "Identity — Personas"
description: "Persona templates, identity discs, addons, tools, and vector embeddings"
slug: /brain-regions/identity
---

# Identity — Personas

## What It Does

The Identity region is like your company's HR department combined with a costume shop. It stores **templates** for AI personas—system prompts, enabled tools, and personality traits. When you need to actually *use* a persona, the Identity region **forges** it into an **IdentityDisc**, a living, leveled instance that accumulates experience (XP), success/failure records, and memories. One Identity template can spawn dozens of Discs, each learning on their own journey.

## Biological Analogy

In neuroscience, the **prefrontal cortex** maintains your stable sense of self—your values, your voice, your personality. But that self doesn't exist in a vacuum. You're actually *instances* of patterns: you at work, you at home, you in a crisis. The Identity region mirrors this. The **Identity template** is your core self-model. The **IdentityDisc** is an instantiation of that self, activated in a specific context, accumulating specific memories and scars. When you sleep, you consolidate those IdentityDisc memories back into your sense of self.

## Key Concepts

- **Identity Template**: A blueprint containing a Django-templatable system prompt, default tools, and personality metadata. Immutable once created (fork it to modify).
- **IdentityDisc**: A stateful instance of an Identity with level, XP, success/failure counters, and a vector embedding (768-dim, nomic-embed-text). The actual working agent.
- **Vector Embedding**: Auto-generated from the disc's prompt, type, and tags. Used by the Hypothalamus for model selection matching.
- **Addons**: Pluggable context-injection layers that inject text into the reasoning prompt at known phases (HISTORY, TOOLS, MEMORY).
- **Tool Binding**: Each Identity specifies which tools it has access to, enforced via the ParietalMCP gateway.

## API Endpoints

### Identity Templates

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v2/identities/` | List all identity templates |
| `POST` | `/api/v2/identities/` | Create new identity template |
| `GET` | `/api/v2/identities/{id}/` | Retrieve template details |
| `PATCH` | `/api/v2/identities/{id}/` | Update template |
| `DELETE` | `/api/v2/identities/{id}/` | Delete template |

### Identity Discs (Instances)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v2/identity-discs/` | List all discs (stateful instances) |
| `POST` | `/api/v2/identity-discs/` | Forge new disc from template |
| `GET` | `/api/v2/identity-discs/{id}/` | Retrieve disc with level, XP, stats |
| `PATCH` | `/api/v2/identity-discs/{id}/` | Update disc metadata |
| `DELETE` | `/api/v2/identity-discs/{id}/` | Delete disc |
| `GET` | `/api/v2/identity-discs/{id}/model-preview/` | Preview current model selection for this disc |

### Addons & Extensions

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v2/identity_addons/` | List available addons |
| `POST` | `/api/v2/identity_addons/` | Create addon |
| `GET` | `/api/v2/identity_addons/{id}/` | Retrieve addon |
| `PATCH` | `/api/v2/identity_addons/{id}/` | Update addon |
| `DELETE` | `/api/v2/identity_addons/{id}/` | Delete addon |

### Tags & Types

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v2/identity_tags/` | List available tags |
| `POST` | `/api/v2/identity_tags/` | Create tag |
| `GET` | `/api/v2/identity_types/` | List identity types |
| `POST` | `/api/v2/identity_types/` | Create type |

### Budgets

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v2/identity-budgets/` | List token/cost budgets |
| `POST` | `/api/v2/identity-budgets/` | Create budget constraint |
| `PATCH` | `/api/v2/identity-budgets/{id}/` | Update budget |

## How It Connects

- **Hypothalamus**: Requests the IdentityDisc's vector embedding to match against model embeddings for intelligent routing.
- **Frontal Lobe**: Loads the IdentityDisc's system prompt and addons during reasoning session setup.
- **Parietal Lobe**: Respects the IdentityDisc's tool binding—only tools linked to the disc are available.
- **Temporal Lobe**: Assigns IdentityDiscs to specific shift columns during iteration design.
- **Prefrontal Cortex**: Links tasks and stories to IdentityDiscs as assignees.
