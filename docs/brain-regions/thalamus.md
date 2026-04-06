---
id: thalamus
title: "Thalamus — Chat Interface"
description: "Standing sessions, human-AI relay, and the chat bubble"
slug: /brain-regions/thalamus
---

# Thalamus — Chat Interface

## What It Does

The Thalamus is the sensory relay—it translates between internal reasoning (Frontal Lobe) and the chat UI. A **standing session** is an ongoing conversation thread with a standing AI identity. The Thalamus chat bubble appears on every page, letting you inject messages, ask questions, and get real-time status. Messages are relayed to the Frontal Lobe's reasoning session via the `/api/v2/thalamus/interact/` endpoint. Responses stream back via WebSocket. It's the human-facing surface of the entire system.

## Biological Analogy

The thalamus in neuroscience is the **sensory relay station**—it receives sensory signals and relays them to the cortex for processing. Are-Self's Thalamus similarly **relays human input** (chat messages) to the reasoning system, and **relays reasoning output** back to humans via the chat UI. It's a bidirectional interface: human → LLM and LLM → human.

## Key Concepts

- **Standing Session**: A persistent chat thread with an AI identity. Stays "alive" across page refreshes and interactions.
- **Human-AI Relay**: Messages flow human → Thalamus → Frontal Lobe; responses flow Frontal Lobe → Thalamus → chat UI.
- **Chat Bubble**: The always-present UI widget on every page for quick interactions.
- **Real-Time Streaming**: Responses stream back to the UI via WebSocket as the Frontal Lobe generates them.

## API Endpoints

### Thalamus Chat Relay

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/api/v2/thalamus/interact/` | Inject message into standing session |
| `GET` | `/api/v2/thalamus/standing-sessions/` | List standing sessions |
| `POST` | `/api/v2/thalamus/standing-sessions/` | Create standing session |
| `GET` | `/api/v2/thalamus/standing-sessions/&#123;id&#125;/` | Retrieve session details |

## How It Connects

- **Frontal Lobe**: When the Thalamus receives a message via `/interact/`, it injects it into the Frontal Lobe's reasoning session via `mcp_respond_to_user` or session resume.
- **Synaptic Cleft**: Streaming responses flow via WebSocket (Norepinephrine, Glutamate for logs).
- **Identity**: Standing sessions are tied to IdentityDiscs.
- **All regions**: The Thalamus is the human's window into the entire system—when something happens anywhere, the huma