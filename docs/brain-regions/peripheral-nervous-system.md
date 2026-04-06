---
id: peripheral-nervous-system
title: "Peripheral Nervous System — Fleet"
description: "Workers, Celery Beat heartbeat, nerve terminals, and system control"
slug: /brain-regions/peripheral-nervous-system
---

# Peripheral Nervous System — Fleet

## What It Does

The Peripheral Nervous System is fleet management and the system's heartbeat. It monitors **Celery workers** via in-process signals (`task_prerun`, `task_postrun`, `worker_ready`) that fire **Norepinephrine** signals through the Synaptic Cleft. The frontend displays worker cards showing real-time status (tasks running, queue depth, health). **Celery Beat** is the PNS heartbeat—the metronome that ticks every N seconds and triggers the tick cycle. When beat fires, it calls the Temporal Lobe to advance iterations and spike trains.

## Biological Analogy

The peripheral nervous system in physiology connects the **central nervous system to the body**—it carries motor commands out and sensory signals back. It also includes the **autonomic nervous system**, which runs the heartbeat. Are-Self's Peripheral Nervous System mirrors this: it orchestrates distributed workers (Celery), maintains the heartbeat (Celery Beat), and carries real-time status signals (Norepinephrine) back to monitoring systems.

## Key Concepts

- **Celery Worker**: A background task processor. Executes spikes and other async work.
- **Celery Beat**: The scheduler that ticks every N seconds, triggering the Temporal Lobe.
- **Heartbeat**: Each beat tick signals the Temporal Lobe to advance the iteration and fire spike trains.
- **Nerve Terminal**: Worker connections to the system. Tracked in a registry for health monitoring.
- **Norepinephrine**: A neurotransmitter signal for alertness and monitoring (worker heartbeats, orchestration narrative).

## API Endpoints

### Worker Management

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v2/celery-workers/` | List active Celery workers |
| `POST` | `/api/v2/celery-workers/` | Register worker |
| `GET` | `/api/v2/celery-workers/{id}/` | Retrieve worker status |

### Heartbeat & Beat Control

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v2/beat/` | Celery Beat status |
| `POST` | `/api/v2/beat/start/` | Start the metronome |
| `POST` | `/api/v2/beat/stop/` | Stop the metronome |
| `POST` | `/api/v2/beat/pause/` | Pause without fully stopping |

### System Control

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v2/system-control/` | System state (running, paused, stopped) |
| `POST` | `/api/v2/system-control/restart/` | Soft restart |
| `POST` | `/api/v2/system-control/emergency-stop/` | Hard stop all spikes |

### Nerve Terminal Registry

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v2/nerve_terminal_registry/` | List nerve terminals (worker connections) |
| `POST` | `/api/v2/nerve_terminal_registry/` | Register terminal |
| `DELETE` | `/api/v2/nerve_terminal_registry/{id}/` | Deregister terminal |

## How It Connects

- **Temporal Lobe**: Celery Beat calls the Temporal Lobe's trigger_temporal_metronomes() to advance iterations.
- **Central Nervous System**: The Celery Beat cycle launches spike trains through the CNS.
- **Synaptic Cleft**: Worker signals (startup, task completion) fire Norepinephrine to the WebSocket bus.
- **All regions**: All spike execution happens through Celery workers managed by the PNS.
