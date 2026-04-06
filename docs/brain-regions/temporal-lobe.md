---
id: temporal-lobe
title: "Temporal Lobe — Scheduling"
description: "Iterations, shifts, the metronome, and work cycles"
slug: /brain-regions/temporal-lobe
---

# Temporal Lobe — Scheduling

## What It Does

The Temporal Lobe is the system's calendar and scheduler. It divides work into **Iterations** (distinct execution cycles, like sprints) and **Shifts** (phases within an iteration). An iteration might be: Sifting → Pre-Planning → Planning → Executing → Post-Execution → Sleeping. Each shift has a turn limit and assigned IdentityDiscs. The temporal lobe wakes the current shift, tracks which phase you're in, and signals when it's time to move to the next.

## Biological Analogy

In the brain, the temporal lobe is involved in **time perception** and **episodic memory**—your sense of "this happened, then that happened." Are-Self's Temporal Lobe similarly orchestrates the *sequence* of work. It answers: "What phase are we in? Who's supposed to act now? Have they used their turn budget?" It's the metronome that keeps the heartbeat regular, advancing the system through discrete, named phases like a theater production running through acts and scenes.

## Key Concepts

- **Iteration Definition**: A blueprint template defining a sequence of shift definitions (columns) with turn counts and metadata. Think of it as a production schedule.
- **Iteration**: A *live instance* of an Iteration Definition, bound to an Environment. Tracks current shift, turns consumed, and state.
- **Shift Definition**: The blueprint for a phase: name, turn limit, expected identity type (e.g., "PM", "Worker").
- **Shift**: The live instance. Knows which IdentityDiscs are participating, how many turns have been used, and when to close.
- **Metronome**: The heartbeat trigger (Celery Beat) that ticks N seconds, fires the PNS, which calls the Temporal Lobe to advance iterations and spikes.

## API Endpoints

### Iterations (Live Instances)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v2/iterations/` | List all iterations |
| `POST` | `/api/v2/iterations/` | Create live iteration from definition |
| `GET` | `/api/v2/iterations/{id}/` | Retrieve iteration state |
| `PATCH` | `/api/v2/iterations/{id}/` | Update iteration metadata |
| `DELETE` | `/api/v2/iterations/{id}/` | Delete iteration |

### Iteration Definitions (Blueprints)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v2/iteration-definitions/` | List templates |
| `POST` | `/api/v2/iteration-definitions/` | Create definition template |
| `GET` | `/api/v2/iteration-definitions/{id}/` | Retrieve definition |
| `PATCH` | `/api/v2/iteration-definitions/{id}/` | Update definition |
| `DELETE` | `/api/v2/iteration-definitions/{id}/` | Delete definition |

### Shift Definitions & Shifts

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v2/iteration-shift-definitions/` | List shift templates |
| `POST` | `/api/v2/iteration-shift-definitions/` | Create shift definition |
| `GET` | `/api/v2/shifts/` | List live shift instances |
| `POST` | `/api/v2/shifts/` | Create shift instance |
| `GET` | `/api/v2/shifts/{id}/` | Retrieve shift state |
| `PATCH` | `/api/v2/shifts/{id}/` | Update shift |
| `DELETE` | `/api/v2/shifts/{id}/` | Delete shift |

### Visualization

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v2/temporal_lobe/graph_data/` | 3D visual graph of iteration and shift structure |

## How It Connects

- **Peripheral Nervous System**: The PNS heartbeat (Celery Beat) ticks and calls the Temporal Lobe to advance iterations.
- **Central Nervous System**: The Temporal Lobe signals the CNS to fire spike trains for the current shift's active participants.
- **Identity**: Shift columns contain assigned IdentityDiscs. The shift knows who should act next.
- **Prefrontal Cortex**: Tasks are scoped to shifts. During Executing shift, worker identities pick up assigned tasks.
- **Frontal Lobe**: When a spike fires for a shift, it launches a Reasoning Session in the Frontal Lobe for that identity.
