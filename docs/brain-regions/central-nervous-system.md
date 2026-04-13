---
id: central-nervous-system
title: "Central Nervous System — Execution Engine"
description: "Neural pathways, neurons, axons, effectors, spike trains, and the axoplasm"
slug: /brain-regions/central-nervous-system
---

# Central Nervous System — Execution Engine

In your real brain, the [Central Nervous System](./central-nervous-system) is the command center. It's where signals travel *really* fast, jumping from neuron to neuron in lightning-quick chains. When you touch something hot, your [Central Nervous System](./central-nervous-system) doesn't stop to think — it fires a signal down your spinal cord to your hand saying "MOVE NOW," and your hand pulls away before you even realize what happened. It's the fast path. The "just do it" system.

Are-Self's CNS (`central_nervous_system/central_nervous_system.py`) works the same way. It's the execution engine — the part where everything that *actually happens* in the system flows through. Nothing gets done without the CNS. It's where work happens.

## How It Works: Spikes and Pathways

Imagine you're building a machine out of dominoes. First, you lay out the dominoes in a pattern — that pattern is your **Neural Pathway**. Each domino is a **Neuron**. The space between dominoes is an **Axon**. Then you flick the first domino. That's your **Spike** — the signal that travels through the whole pathway, knocking over each neuron as it goes.

Here's the thing that makes Are-Self clever: as each domino falls (each neuron executes), it carries forward a snapshot of what's been written down so far. That snapshot lives in the **axoplasm** — a JSON dict that flows through each spike via deepcopy (just like cargo being carried down a real neuron's axon). Each neuron reads what it needs from the axoplasm and writes its results back. At the train level, there's also **cerebrospinal fluid** — a shared bath set once at launch that surrounds the whole run. Dominoes can be flexible about what they do based on what's in the axoplasm or the CSF. No domino has to be tightly connected to the next one. They just all trust the shared memory.

A single spike is a single execution at one neuron. But one execution can have lots of spikes (imagine knocking down 50 dominoes). All those spikes together, following one pathway from start to finish, make up a **Spike Train**. The spike train tracks its own status: is it running? Did it succeed? Did something break?

## The Building Blocks

- **Neural Pathway**: A directed acyclic graph (DAG) — basically a flowchart with no loops — that defines all the neurons, axons, and what each neuron should do. You can reuse the same pathway for many different spike trains.

- **Neuron**: A node (a stop) in your pathway. Every neuron has a job to do — its **Effector** — which could be anything: a Python function, a task sent to Celery (a worker queue), launching the [Frontal Lobe](./frontal-lobe) to think through something, calling an API, whatever.

- **Axon**: An edge (a connection) between two neurons. Can have branching conditions — "only go this way if X happened."

- **Effector**: The actual thing that gets executed at a neuron. The concrete action. Effectors have a `distribution_mode` — `LOCAL_SERVER`, `ALL_ONLINE_AGENTS`, `ONE_AVAILABLE_AGENT`, or `SPECIFIC_TARGETS` — which determines where the work runs. Built-in effector types include `BEGIN_PLAY`, `FRONTAL_LOBE`, `LOGIC_GATE`, `LOGIC_RETRY`, `LOGIC_DELAY`, and `DEBUG`.

- **Spike**: One single execution event at a neuron, recorded with timestamps, logs, what was on the axoplasm when it ran, and whether it succeeded or failed.

- **Spike Train**: A complete traversal of a pathway — one journey through all the connected neurons. Contains many spikes. Has a status (pending, running, succeeded, failed). The graph dispatch is driven by `CNS.dispatch_next_wave()`, which follows axon types — `TYPE_FLOW`, `TYPE_SUCCESS`, `TYPE_FAILURE` — to decide which neuron fires next.

- **Axoplasm**: Per-spike JSON dict that flows forward via deepcopy (anterograde transport). Each spike carries its own snapshot.

- **Cerebrospinal Fluid**: Per-train JSON dict, immutable after launch. The bath that surrounds the whole run, set via MCP seed at launch time.

## How the [Synaptic Cleft](./synaptic-cleft) Stays Informed

When spikes finish executing, they fire **neurotransmitters** through the [Synaptic Cleft](./synaptic-cleft) — signals that tell the rest of the system what happened. Success? That's Dopamine: a "yay, we did it!" signal. Failure? That's Cortisol: a "uh oh, something went wrong" signal. The [Synaptic Cleft](./synaptic-cleft) broadcasts these signals to WebSockets so the frontend stays in sync in real time.

## What's the Golden Rule?

Here's the most important thing about the [Central Nervous System](./central-nervous-system): **If it's not a spike, it didn't happen.** Everything that matters is recorded as a spike. Every spike has a record. You can look back at every single one and see what it did, what the axoplasm looked like, what errors came up. Forensics. Full traceability. That's what makes the system trustworthy.

## How It Connects

- **[Temporal Lobe](./temporal-lobe)**: Calls the [Central Nervous System](./central-nervous-system) to fetch a pathway and fire off a spike train for the current shift. Basically says "okay, go run this workflow."

- **[Frontal Lobe](./frontal-lobe)**: One type of effector is `FRONTAL_LOBE` — when a neuron's job is set to reasoning, the `NeuroMuscularJunction` dispatches to `run_frontal_lobe()` and the [Frontal Lobe](./frontal-lobe) wakes up and thinks.

- **[Peripheral Nervous System](./peripheral-nervous-system)**: Spikes are actually Celery tasks (workers that do real work). The [Peripheral Nervous System](./peripheral-nervous-system) orchestrates dispatching them and tracks their lifecycle.

- **[Synaptic Cleft](./synaptic-cleft)**: As spikes complete, they fire neurotransmitters (Dopamine for success, Cortisol for failure) to the WebSocket event bus, keeping everyone on the network informed.

- **[Thalamus](./thalamus)**, **[Parietal Lobe](./parietal-lobe)**, **[Temporal Lobe](./temporal-lobe)**, **[Prefrontal Cortex](./prefrontal-cortex)**, **[Identity](./identity)**: Every region can have effectors that run inside spike trains. Any region's code can be called as a neuron's job.

---

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
| `GET` | `/api/v2/spikes/` | List spikes (includes logs and axoplasm) |
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
