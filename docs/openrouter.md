---
id: openrouter
title: "OpenRouter Integration"
sidebar_position: 11
---

# OpenRouter Integration

OpenRouter is a cloud failover option for Are-Self's Hypothalamus. When your local Ollama models aren't available or you need a specific proprietary model (Claude, GPT, Gemini), the Hypothalamus can route requests to OpenRouter's cloud APIs. This guide covers setup and usage.

## What Is OpenRouter?

OpenRouter is a unified API gateway to commercial LLM providers: OpenAI, Anthropic (Claude), Google Gemini, Meta, and others. Instead of managing separate API keys for each provider, you get a single OpenRouter key and access to hundreds of models.

## Why Use OpenRouter with Are-Self?

Are-Self's philosophy is **local-first and free**. Your primary path is Ollama: free, private, runs on your hardware.

OpenRouter becomes useful when:

- **Model unavailable locally**: You need Claude 3.5 or GPT-4, which Ollama doesn't host
- **Hardware constraint**: Your machine can't run large models (e.g., 70B parameters)
- **Failover safety**: Primary Ollama model fails; fall back to cloud
- **Budget allows**: You have money for cloud inference (unlike free Ollama)

**For kids with no money**: Set up Ollama only. Skip OpenRouter entirely. Ollama is sufficient for learning, reasoning, and coding tasks.

## Prerequisites

To use OpenRouter:

1. **OpenRouter Account**: Sign up at [openrouter.ai](https://openrouter.ai)
2. **API Key**: Generate an API key in your OpenRouter account dashboard
3. **Are-Self Running**: Backend and Hypothalamus synced (see [Quick Start](/docs/quick-start))

## Configuration

### Set the API Key

Store your OpenRouter API key as an environment variable or context variable in your Are-Self environment:

**Option A: Environment Variable**

```bash
export OPENROUTER_API_KEY="your-openrouter-key-here"
```

Then restart the Are-Self backend.

**Option B: Context Variable (via UI)**

1. Navigate to **Environments** in the sidebar
2. Select your active environment
3. Click **"+ Add Variable"**
4. Enter:
   - **KEY**: `openrouter_api_key`
   - **VALUE**: Your OpenRouter API key (paste from dashboard)
5. Save

The Hypothalamus reads this variable at sync time.

## Sync the OpenRouter Catalog

Once your API key is set, sync OpenRouter's model catalog into the Hypothalamus:

### Via UI

1. Open **Hypothalamus** (sidebar)
2. Select the **CATALOG** tab
3. Click **FETCH CATALOG** button (or **SYNC REMOTE**)
4. Wait 30–60 seconds for the remote catalog to fetch
5. OpenRouter models now appear in the catalog with "OPENROUTER" provider badges
6. Models are searchable and filterable like Ollama models

### Via API

Send a POST request to trigger the sync:

```bash
curl -X POST http://localhost:8000/api/v2/sync-status/sync-remote/ \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -H "Content-Type: application/json"
```

Monitor sync progress in **Sync Logs** (Hypothalamus UI).

## How Failover Works

The Hypothalamus uses a **failover strategy** to choose models at request time:

1. **Primary**: Route to preferred local Ollama model (free, fast)
2. **Fallback**: If Ollama model fails (timeout, offline), try OpenRouter model (paid, reliable)
3. **Circuit Breaker**: Track failures with exponential backoff; avoid repeatedly hammering a broken endpoint

### Configure Failover for an Identity

1. Open **Hypothalamus** → **ROUTING** tab
2. Select your identity (e.g., "Developer Agent")
3. In the routing editor:
   - **Preferred Model**: "mistral:7b" (local Ollama)
   - **Fallback Models**: Add "claude-3.5-sonnet" (OpenRouter)
   - Click **Save**

Now your identity tries Mistral locally first; if it fails, silently routes to Claude on OpenRouter.

### Banned Providers (Privacy)

If you want to ensure an identity **never uses OpenRouter** (local-only policy):

1. Open **ROUTING** tab
2. Select identity
3. In routing editor, check **Banned Providers**: "OpenRouter"
4. Save

This identity will only use Ollama models, even if they fail. Useful for sensitive work.

## Budget Constraints

### Why Budget Matters

OpenRouter models incur per-token costs. Ollama is free but local. The Hypothalamus enforces budget limits per identity to prevent runaway cloud spending.

### Set a Cloud Budget

1. Open **Hypothalamus** → **BUDGETS** tab
2. Select your identity
3. Configure:
   - **Period**: "Per Month" (or your preferred window)
   - **Spend Cap per Period**: e.g., "$10" (daily limit) or "$50" (monthly)
   - **Spend Cap per Request**: e.g., "$2" (max per single call)
   - **Warning Threshold**: Notify admin at 80% spent
   - **Overrun Behavior**: "Hard Stop" (block new requests) or "Soft Stop" (warn, allow one more, block)
4. Save

When the identity hits its budget, the Hypothalamus blocks further cloud requests until the period resets. Ollama requests are unaffected (always free).

## Example: Local Ollama with Cloud Fallback

This is the recommended setup for most users:

### Setup Steps

1. **Install Ollama**: `ollama pull mistral:7b`
2. **Sync Local Models**: Hypothalamus → CATALOG → "SYNC LOCAL"
3. **Get OpenRouter Key**: Sign up, copy API key
4. **Set Context Variable**: Environments → add `openrouter_api_key`
5. **Sync Remote Catalog**: Hypothalamus → "FETCH CATALOG"
6. **Configure Routing**:
   - Preferred: "mistral:7b" (local, free)
   - Fallback: "claude-3.5-sonnet" (OpenRouter, \$0.003/1K input tokens)
7. **Set Budget**: \$20/month spend cap
8. **Fire Spike Train**: Identity tries Mistral first. If offline, silently uses Claude.

### Cost Estimate

If you use Mistral 95% of the time and fallback to Claude 5%:

- Mistral 95% × $0 = $0
- Claude 5% × $0.003/1K tokens = ~$0.15/month (for 10K output tokens)
- **Total: Nearly free** (Ollama dominates usage)

If Ollama is offline and everything routes to Claude:

- 100K input tokens + 50K output tokens ≈ $0.50
- **Monthly with 30 days of full Claude usage: ~$15**

Set your budget accordingly.

## Troubleshooting

### Sync Fails / OpenRouter Not Connecting

- **Check API Key**: Verify `openrouter_api_key` is set and valid
- **Test Connectivity**: `curl https://openrouter.ai/api/v1/models` (public endpoint, no auth needed)
- **Check Logs**: View Hypothalamus sync logs for error details
- **Rate Limits**: OpenRouter may rate-limit large catalog syncs; try again in 5 minutes

### Fallback Not Triggering

- **Verify Routing**: Open ROUTING tab; confirm fallback model is listed
- **Test Primary Offline**: Stop Ollama locally (`ollama serve` ctrl+c); make a request
- **Check Budget**: If identity hit its cloud budget, fallback is blocked (check BUDGETS tab)
- **Provider Banned**: Verify "Banned Providers" doesn't include OpenRouter

### Unexpected Cloud Charges

- **Review Budgets**: Check BUDGETS tab for spend cap settings
- **Inspect Usage**: View usage records in API reference
- **Check Failover**: Ensure primary Ollama is healthy; recurring fallback indicates a problem
- **Disable Fallback**: Remove OpenRouter from failover chain if not needed

## See Also

- [Hypothalamus — Model Selection](/docs/brain-regions/hypothalamus) — Deep dive into routing, budgets, and circuit breakers
- [Hypothalamus UI](/docs/ui/hypothalamus) — Manage models and failover via dashboard
- [Quick Start](/docs/quick-start) — Get Ollama up and running (free, no API keys)
- [Security](/docs/security) — Privacy and responsible AI usage
