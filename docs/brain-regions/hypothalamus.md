---
id: hypothalamus
title: "Hypothalamus — Model Selection"
description: "Model catalog, routing, pricing, circuit breakers, and failover strategies"
slug: /brain-regions/hypothalamus
---

# Hypothalamus — Model Selection

## What It Does

The Hypothalamus is the system's routing intelligence. It maintains a **catalog** of available AI models synced from Ollama and OpenRouter, each with metadata: pricing, capabilities, health status, and embeddings. When the Frontal Lobe needs an LLM, it asks the Hypothalamus to select the best model. Selection uses **vector similarity** between the IdentityDisc's embedding and model embeddings, filtered by budget constraints and **circuit breaker** status. Circuit breakers track model failures with scar-tissue logic: each failure increases the cooldown period, preventing the system from hammering broken endpoints.

Budget constraints are per-IdentityDisc and per-period (daily, monthly, etc.). The Hypothalamus enforces token-cost ceilings and spend limits.

## Biological Analogy

The hypothalamus in neuroscience is the body's **homeostatic control center**—it monitors temperature, hunger, stress hormones, and adjusts behavior to maintain balance. Are-Self's Hypothalamus similarly maintains system **balance**: it routes requests to healthy models, prevents overspending, and adapts when providers fail. Just as the body avoids a food that made you sick (scar tissue), the Hypothalamus avoids models that have failed, with the avoidance intensifying the more they fail.

## Key Concepts

- **AI Model Catalog**: List of available models with embeddings, pricing, families (Claude, GPT), categories (reasoning, embedding).
- **Model Selection**: Vector-similarity match between IdentityDisc embedding and model embedding, filtered by budget and health.
- **Circuit Breaker**: Tracks model failures. Each failure increases cooldown. Model is avoided until cooldown expires.
- **Scar Tissue Logic**: After each failure, cooldown = cooldown * multiplier (e.g., 2x). Gradual recovery as time passes.
- **Budget Constraint**: Per-IdentityDisc token or cost limit. Enforced before model call.
- **Failover Strategy**: Priority list of model candidates if primary fails.

## API Endpoints

### AI Models & Catalog

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v2/ai-models/` | List available models |
| `POST` | `/api/v2/ai-models/` | Create model |
| `PATCH` | `/api/v2/ai-models/{id}/` | Update model |
| `DELETE` | `/api/v2/ai-models/{id}/` | Delete model |
| `GET` | `/api/v2/model-categories/` | List model categories (e.g., "reasoning") |
| `POST` | `/api/v2/model-categories/` | Create category |
| `GET` | `/api/v2/model-families/` | List model families (Claude, GPT, etc.) |
| `POST` | `/api/v2/model-families/` | Create family |

### Providers & Routing

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v2/llm-providers/` | List LLM provider configurations |
| `POST` | `/api/v2/llm-providers/` | Create provider |
| `PATCH` | `/api/v2/llm-providers/{id}/` | Update provider |
| `DELETE` | `/api/v2/llm-providers/{id}/` | Delete provider |
| `GET` | `/api/v2/model-providers/` | List model-to-provider associations |
| `POST` | `/api/v2/model-providers/` | Create association |

### Pricing & Budget

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v2/model-pricing/` | List pricing configurations |
| `POST` | `/api/v2/model-pricing/` | Create pricing tier |
| `PATCH` | `/api/v2/model-pricing/{id}/` | Update pricing |
| `GET` | `/api/v2/budget-periods/` | List budget period types (daily, monthly) |
| `POST` | `/api/v2/budget-periods/` | Create period |

### Circuit Breakers & Failover

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v2/failover-strategies/` | List failover strategies |
| `POST` | `/api/v2/failover-strategies/` | Create failover strategy |
| `PATCH` | `/api/v2/failover-strategies/{id}/` | Update strategy |
| `GET` | `/api/v2/failover-types/` | List failover types |
| `POST` | `/api/v2/failover-types/` | Create type |

### Selection & Matching

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v2/selection-filters/` | List model selection filters |
| `POST` | `/api/v2/selection-filters/` | Create filter |
| `PATCH` | `/api/v2/selection-filters/{id}/` | Update filter |

### Usage Tracking

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v2/usage-records/` | List usage records |
| `POST` | `/api/v2/usage-records/` | Create usage record |
| `GET` | `/api/v2/sync-status/` | Sync status (Ollama/OpenRouter sync) |
| `GET` | `/api/v2/sync-logs/` | Sync operation logs |

## How It Connects

- **Frontal Lobe**: Calls Hypothalamus.select_model() before each LLM inference, passing the IdentityDisc.
- **Identity**: Uses the IdentityDisc's vector embedding for model matching.
- **Central Nervous System**: Model selection is a spike side-effect; failures trigger Cortisol signals.
- **Parietal Lobe**: Tool execution cost is tracked as usage against IdentityDisc's budget.
- **Synaptic Cleft**: Circuit breaker transitions (model entering cooldown) fire Cortisol signals.
