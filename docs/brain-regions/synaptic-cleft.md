---
id: synaptic-cleft
title: "Synaptic Cleft — Real-Time Events"
description: "WebSocket, neurotransmitter types, and the useDendrite hook"
slug: /brain-regions/synaptic-cleft
---

# Synaptic Cleft — Real-Time Events

## What It Does

The Synaptic Cleft is the real-time event bus built on Django Channels (WebSocket). Events are typed as **neurotransmitters**, each carrying a specific kind of signal. The frontend subscribes via the `useDendrite(receptorClass, dendriteId)` React hook. When a signal fires, the hook returns a new ref, triggering a React effect that refetches data. There's **no polling** in the system—all updates flow through the Synaptic Cleft.

## Biological Analogy

In neuroscience, the synaptic cleft is the **gap between two neurons** where neurotransmitters are released and bind to receptors. Are-Self's Synaptic Cleft is the metaphorical space where internal signals become observable events: Dopamine for success, Cortisol for stress, Acetylcholine for data sync, etc. Just as neurons communicate by releasing specific neurotransmitters that bind to specific receptors, Are-Self regions communicate by firing typed signals that the frontend listens for.

## Key Concepts

- **Neurotransmitter**: A typed signal carrying event data (class + id). Each type means something specific.
- **Dopamine**: Success states (task completed, session concluded, spike succeeded).
- **Cortisol**: Errors and halts (spike failed, circuit breaker tripped, focus exhausted).
- **Acetylcholine**: Data sync (model refreshed, new turn recorded, engram saved).
- **Glutamate**: Streaming data (log lines, execution output, token streamed).
- **Norepinephrine**: Alertness/monitoring (worker heartbeats, orchestration narrative).
- **Dendrite Hook**: React hook `useDendrite(receptorClass, dendriteId)` that subscribes to a specific neurotransmitter type.

## API Endpoints

### WebSocket Connection

| Endpoint | Purpose |
|----------|---------|
| `ws://localhost:8000/ws/dendrites/` | Main WebSocket endpoint for real-time signals |

### Signal Publishing (Internal)

Events are published internally by spike executors, the Frontal Lobe, Hypothalamus, etc. The frontend subscribes via WebSocket and receives them in real time.

### Neurotransmitter Types

| Type | Fired When | Payload |
|------|-----------|---------|
| **Dopamine** | Task completed, session concluded, spike succeeded | `{entity_type, entity_id, status}` |
| **Cortisol** | Spike failed, circuit breaker tripped, focus exhausted | `{entity_type, entity_id, error_code, message}` |
| **Acetylcholine** | Model refreshed, turn recorded, engram saved | `{entity_type, entity_id, change_type}` |
| **Glutamate** | Log line appended, output streamed, token generated | `{entity_id, log_line}` or `{entity_id, token_text}` |
| **Norepinephrine** | Worker heartbeat, orchestration narrative, alert | `{worker_id, status}` or `{narrative_text}` |

## How It Connects

- **Frontend (React)**: Uses `useDendrite()` hook to subscribe to neurotransmitters. Refetches data when signals arrive.
- **Central Nervous System**: Fires Dopamine on spike success, Cortisol on spike failure.
- **Frontal Lobe**: Fires Glutamate as tokens stream, Dopamine on session conclusion.
- **Hypothalamus**: Fires Cortisol when circuit breaker triggers.
- **Peripheral Nervous System**: Fires Norepinephrine for worker heartbeats.
- **Hippocampus**: Fires Acetylcholine when engram is saved.
- **All regions**: Any state change can fire a signal. The Synaptic Cleft is the announcement system.

## Example Usage (Frontend)

```javascript
const { data: sessionData, isLoading } = useDendrite(
  'ReasoningSessionTurn',
  sessionId
);

// When a new turn is recorded, the Synaptic Cleft fires Acetylcholine
// The hook returns a new ref, triggering a refetch of session data
```
