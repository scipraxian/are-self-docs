---
id: frontal-lobe
title: "Frontal Lobe — Reasoning"
description: "Reasoning sessions, the while-True loop, turns, tool calling, and focus economy"
slug: /brain-regions/frontal-lobe
---

# Frontal Lobe — Reasoning

## What It Does

The Frontal Lobe is where thinking happens. A **Reasoning Session** is a `while True` loop: assemble a prompt (identity + addons + history + terminal), call the LLM, parse tool calls, dispatch to the Parietal Lobe, record the turn, repeat. The loop breaks when the LLM calls `mcp_done` (to conclude) or `mcp_respond_to_user` with `yield_turn=True` (to pause for human input). Each iteration of the loop is a **Reasoning Turn** with full telemetry: token counts, inference time, model used, tool calls made.

Sessions have a **Focus economy**—a budget that decreases with each turn and tool call. When focus runs out, the session must conclude. Novel memory formation (engrams saved in the Hippocampus) grants focus back, incentivizing the LLM to learn.

## Biological Analogy

The prefrontal cortex in the brain is your "executive function"—your ability to plan, reason, and sustain attention. Are-Self's Frontal Lobe mirrors this perfectly. It maintains *sustained reasoning over multiple turns*, assembles context dynamically, and manages cognitive load (focus). Just as your working memory has limits, the Frontal Lobe has a focus budget. Just as you learn to sustain attention longer on important tasks, the Frontal Lobe can regain focus by forming new memories (engrams).

## Key Concepts

- **Reasoning Session**: A stateful LLM conversation tied to a spike, identity, and iteration. Can be paused and resumed.
- **Reasoning Turn**: One round of LLM inference + tool dispatch. Records all telemetry (tokens, time, model, tools called).
- **Focus Budget**: A numeric budget decreasing with each turn and tool call. Novel engram saves grant focus back. When focus reaches zero, the session must conclude.
- **Terminal**: The chat interface injecting human messages. Sessions wait for terminal input when they call `yield_turn=True`.
- **Tool Calling**: The LLM calls one of the Parietal Lobe's tools (via MCP). The gateway validates, executes, and returns results.

## API Endpoints

### Reasoning Sessions

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v2/reasoning_sessions/` | List sessions (lightweight) |
| `POST` | `/api/v2/reasoning_sessions/` | Create session |
| `GET` | `/api/v2/reasoning_sessions/&#123;id&#125;/` | Retrieve session (full payload) |
| `PATCH` | `/api/v2/reasoning_sessions/&#123;id&#125;/` | Update session metadata |
| `DELETE` | `/api/v2/reasoning_sessions/&#123;id&#125;/` | Delete session |
| `GET` | `/api/v2/reasoning_sessions/&#123;id&#125;/graph_data/` | Complete graph (turns, engrams, conclusion) |
| `POST` | `/api/v2/reasoning_sessions/&#123;id&#125;/rerun/` | Restart originating spike train |
| `POST` | `/api/v2/reasoning_sessions/&#123;id&#125;/attention_required/` | Pause and signal human input needed |
| `POST` | `/api/v2/reasoning_sessions/&#123;id&#125;/resume/` | Inject human message and wake |
| `GET` | `/api/v2/reasoning_sessions/&#123;id&#125;/messages/` | Chat pipeline for UI |
| `GET` | `/api/v2/reasoning_sessions/&#123;id&#125;/summary_dump/` | Forensic text dump |
| `GET` | `/api/v2/reasoning_sessions/&#123;id&#125;/narrative_dump/` | Compact human-readable briefing |
| `GET` | `/api/v2/latest-sessions/` | Latest 10 sessions |

### Reasoning Turns (Conversation Rounds)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v2/reasoning_turns/` | List turns |
| `POST` | `/api/v2/reasoning_turns/` | Create turn |
| `GET` | `/api/v2/reasoning_turns/&#123;id&#125;/` | Retrieve turn (includes tool calls) |
| `PATCH` | `/api/v2/reasoning_turns/&#123;id&#125;/` | Update turn |
| `DELETE` | `/api/v2/reasoning_turns/&#123;id&#125;/` | Delete turn |

## How It Connects

- **Identity**: Loads the IdentityDisc's prompt template and renders it with Django template syntax.
- **Hypothalamus**: Requests model selection before each LLM call, respecting budget constraints.
- **Parietal Lobe**: Calls out to tools; receives results and parses them back into the reasoning loop.
- **Hippocampus**: Reads relevant engrams during prompt assembly (HISTORY addon phase); saves new engrams as the LLM concludes.
- **Central Nervous System**: Reasoning sessions are spike effectors. When a spike fires with a "reason" effector, it launches one here.
- **Thalamus**: When a session yields with `yield_turn=True`, the Thalamus relay captures human input and resumes the session.
- **Synaptic Cleft**: Fires Dopami