---
id: central-nervous-system
title: "Central Nervous System — Execution Engine"
description: "Neural pathways, neurons, axons, effectors, spike trains, and the blackboard"
slug: /brain-regions/central-nervous-system
---

# Central Nervous System — Execution Engine

## What It Does

The Central Nervous System is Are-Self's execution engine. Everything that actually *happens* in the system flows through here. A **Neural Pathway** is a directed acyclic graph (DAG) of **Neurons** connected by **Axons**. A **Spike Train** fires through a pathway, creating individual **Spikes** at each neuron that execute their **Effectors**. As the train moves through the graph, all context flows through a shared **blackboard**—a JSON dict that accumulates data, allowing loose coupling between nodes.

## Biological Analogy

In the brain, a neural pathway is a route of electrical activation: neurons fire, signals jump across synapses, and signals cascade through networks. The Central Nervous System models this literally. Neurons are nodes, axons are edges, and spikes are the signal propagating through. Unlike a traditional DAG executor, there's no tight coupling—each neuron reads what it needs from the blackboard and writes its results back, allowing the graph to be flexible and resilient. The spike is the unit of *all* work in Are-Self. If it's not a spike, it didn't happen.

## Key Concepts

- **Neural Pathway**: A DAG template defining neurons, axons, and effectors. Can be reused across multiple spike trains.
- **Neuron**: A node in a pathway. Has an effector (Python callable or Celery task) and optional variable context.
- **Axon**: An edge connecting two neurons, optionally with branching conditions.
- **Effector**: The concrete action executed at a neuron—could be a Celery task, a ReasoningSession launch, an API call, etc.
- **Spike**: A single execution of a neuron within a spike train. Records execution time, logs, blackboard state, and result code.
- **Spike Train**: A single traversal of a pathway. Contains multiple spikes. Has status (pending, running, succeeded, failed).
- **Blackboard**: A JSON dict that persists across the entire spike train. Each effector can read and write to it.

## API Endpoints

### Spike Trains (Execution Runs)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v2/spiketrains/` | List all spike trains |
| `POST` | `/api/v2/spiketrains/` | Create spike train |
| `GET` | `/api/v2/spiketrains/&#123;id&#125;/` | Retrieve spike train details |
| `PATCH` | `/api/v2/spiketrains/&#123;id&#125;/` | Update spike train |
| `DELETE` | `/api/v2/spiketrains/&#123;id&#125;/` | Delete spike train |
| `POST` | `/api/v2/spiketrains/launch/` | **Launch a spike train (HTTP 201)** |
| `POST` | `/api/v2/spiketrains/&#123;id&#125;/stop/` | Graceful stop |
| `POST` | `/api/v2/spiketrains/&#123;id&#125;/terminate/` | Force terminate |
| `GET` | `/api/v2/latest-spikes/` | Latest 10 spike trains |

### Spikes (Neural Firing Events)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v2/spikes/` | List spikes (includes logs and blackboard) |
| `GET` | `/api/v1/spikes/&#123;id&#125;/` | Spike forensics: detailed execution trace |

### Neural Pathways (Graph Templates)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v2/neuralpathways/` | List pathways |
| `POST` | `/api/v2/neuralpathways/` | Create pathway |
| `GET` | `/api/v2/neuralpathways/&#123;id&#125;/` | Retrieve pathway |
| `PATCH` | `/api/v2/neuralpathways/&#123;id&#125;/` | Update pathway |
| `DELETE` | `/api/v2/neuralpathways/&#123;id&#125;/` | Delete pathway |
| `POST` | `/api/v2/neuralpathways/&#123;id&#125;/toggle_favorite/` | Mark as favorite |
| `POST` | `/api/v2/neuralpathways/&#123;id&#125;/launch/` | Launch pathway as spike train (HTTP 201) |
| `GET` | `/api/v2/neuralpathways/&#123;id&#125;/layout/` | Graph layout for canvas editor |
| `GET` | `/api/v2/neuralpathways/&#123;id&#125;/library/` | Effector palette for this pathway |
| `GET` | `/api/v2/pathways-3d/` | 3D visualization data |

### Neurons (Graph Nodes)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v2/neurons/` | List neurons |
| `POST` | `/api/v2/neurons/` | Create neuron |
| `GET` | `/api/v2/neurons/&#123;id&#125;/` | Retrieve neuron |
| `PATCH` | `/api/v2/neurons/&#123;id&#125;/` | Update neuron |
| `DELETE` | `/api/v2/neurons/&#123;id&#125;/` | Delete neuron |
| `GET` | `/api/v1/neurons/&#123;id&#125;/inspector_details/` | Variable context matrix |

### Axons (Graph Edges)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v2/axons/` | List axons |
| `POST` | `/api/v2/axons/` | Create axon |
| `PATCH` | `/api/v2/axons/&#123;id&#125;/` | Update axon |
| `DELETE` | `/api/v2/axons/&#123;id&#125;/` | Delete axon |

### Effectors (Action Definitions)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v2/effectors/` | List available effectors (editor palette) |
| `POST` | `/api/v2/effectors/` | Create effector |
| `PATCH` | `/api/v2/effectors/&#123;id&#125;/` | Update effector |
| `DELETE` | `/api/v2/effectors/&#123;id&#125;/` | Delete effector |

### Node Contexts (Variable Overrides)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v1/node-contexts/` | List node contexts |
| `POST` | `/api/v1/node-contexts/` | Create context |
| `PATCH` | `/api/v1/node-contexts/&#123;id&#125;/` | Update context |

### Logs & Forensics

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v2/spike-logs/` | Merged forensic logs across all spikes |

## How It Connects

- **Temporal Lobe**: Calls the CNS to fetch the canonical pathway and fire a spike train for the current shift.
- **Frontal Lobe**: One effector type is ReasoningSession launch. When a neuron's effector is set to "start reasoning," it triggers the Frontal Lobe.
- **Peripheral Nervous System**: Spikes are Celery tasks. The PNS orchestrates their dispatch and tracks their lifecycle.
- **Synaptic Cleft**: As spikes complete, they fire neurotransmitters (Dopamine on success, Cortisol on failure) to the WebSocket event bus.
- **All other regions**: Every region's 