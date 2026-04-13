---
id: axoplasm
title: "Axoplasm &amp; Cerebrospinal Fluid — How Spike Trains Carry State"
description: "The two-layer shared memory model for neural pathway execution"
slug: /cns/axoplasm
---

# Axoplasm & Cerebrospinal Fluid — How Spike Trains Carry State

In your real brain, the inside of an axon — the part of a neuron that carries signals down to the next neuron — is filled with a thick, gooey substance called **axoplasm**. It's not just empty space. Tiny cargo-delivery trucks called kinesin motors climb up and down the axon carrying vesicles (little packets) filled with neurotransmitters, proteins, and other molecules forward toward the next neuron. That's called **anterograde transport** — "forward delivery." Meanwhile, other molecules get shipped *backward* (retrograde transport) to report on what happened downstream.

Around all the neurons in your brain floats **cerebrospinal fluid**, or **CSF**. It's the bath that surrounds the whole brain and spinal cord. It doesn't flow through individual neurons — it flows *between* them, bathing everything in a shared chemical bath that supplies nutrients and communicates global state to every neuron at once.

Are-Self borrows both concepts for shared memory in spike trains. This document explains how that works.

## Two Layers, One Train

Are-Self's shared memory model has two layers:

### Axoplasm (`Spike.axoplasm`)

Each [spike](../brain-regions/central-nervous-system) carries its own **axoplasm** — a per-spike JSON dict that flows *forward* through the train via **deepcopy** (anterograde transport). Think of it like a little suitcase that each spike hands to the next spike, and the next spike is free to open it, read what's inside, add new stuff, and hand it along.

In the code: `Spike.axoplasm` is a Django `JSONField(default=dict)` in `central_nervous_system/models.py`.

### Cerebrospinal Fluid (`SpikeTrain.cerebrospinal_fluid`)

The [spike train](../brain-regions/central-nervous-system) has its own **cerebrospinal fluid** — a per-train JSON dict set once when the train launches and stays **immutable** for the entire run. It's the background bath that every spike in that train can read from, but nobody modifies it. It's set via the MCP seed at launch time.

In the code: `SpikeTrain.cerebrospinal_fluid` is a Django `JSONField(default=dict)` in `central_nervous_system/models.py`.

## Resolution Rule: Axoplasm Wins

When a spike looks up a key, it checks both layers. The resolution chain from lowest to highest precedence is:

1. **Environment variables** — Static project roots, build paths, and context variables from the active [ProjectEnvironment](../brain-regions/central-nervous-system)
2. **Cerebrospinal Fluid** (`SpikeTrain.cerebrospinal_fluid`) — Train-level defaults, immutable after launch
3. **Axoplasm** (`Spike.axoplasm`) — Spike-level state, wins on collision with CSF
4. **EffectorContext** — Per-effector default key/values
5. **NeuronContext** — Per-neuron overrides from the graph editor (highest precedence)

**The key rule:** Axoplasm beats CSF on the same-key collision. Spike-level state always beats train-level defaults. This keeps the fast, local, per-spike snapshot behavior intact while still letting the train have a global bath.

## How Axoplasm Gets Filled

There are four paths for data to land on a spike's axoplasm:

### 1. Deepcopy from Provenance

This is the default. When `_create_spike_from_node` (`central_nervous_system/central_nervous_system.py`) builds a new spike, the first thing it does is:

```
copy.deepcopy(provenance.axoplasm)
```

If there's no provenance (this is the root spike of the train), it deepcopies the train's cerebrospinal fluid instead. This means the CSF gets promoted to axoplasm at the root, and then each spike in the train carries forward a snapshot.

### 2. Subgraph Entry Layering

When a spike with an `invoked_pathway` delegates to a child [SpikeTrain](../brain-regions/central-nervous-system), the child's root spike starts from a deepcopy of `parent_spike.axoplasm` — *and then* every `NeuronContext` key on the parent neuron is layered on top. This lets a subgraph-calling neuron pre-load its child with per-call parameters without needing a custom effector.

### 3. Effector Write-Back via Stdout Protocol

Native Python effectors and remote agents can emit a line of the form:

```
::axoplasm_set key::value
```

in their execution output. The `NeuromuscularJunction` (`central_nervous_system/effectors/effector_casters/neuromuscular_junction.py`) scans every line with the `AXOPLASM_SET_KEY_REGEX`, pulls the key/value out, sets `spike.axoplasm[key] = value`, strips the line so it doesn't pollute forensics, and fires an `Acetylcholine` neurotransmitter with `activity='axoplasm_updated'` so the UI can flash. That's how a shell script or a remote agent on another machine can participate without importing Are-Self Python.

### 4. Parietal Lobe MCP Tool (`mcp_update_axoplasm`)

When the [Frontal Lobe](../brain-regions/frontal-lobe) is in the middle of a reasoning loop, it can call the `mcp_update_axoplasm(spike_id, key, value)` tool to write directly to its own currently-running spike's axoplasm. The tool does a targeted `save(update_fields=['axoplasm'])` so it never races with the execution log writer. This is the cleanest way for an LLM to hand a concrete value to the rest of the graph.

## How Axoplasm Gets Read

Reading is governed by one function you should know: `resolve_environment_context` in `central_nervous_system/utils.py`. That function builds the full context dictionary that gets handed to template rendering (for things like `&#123;&#123;prompt&#125;&#125;` or `&#123;&#123;project_root&#125;&#125;`), to the [Frontal Lobe](../brain-regions/frontal-lobe) reasoning session initializer, and to the logic node's gate evaluator.

A few places read the axoplasm directly rather than going through `resolve_environment_context`:

- **Logic Gate neurons** (`pathway_logic_node._handle_gate`): The gate node reads `spike.axoplasm[gate_key]`, compares it against `gate_value` with an `exists` / `equals` / `not_equals` / `gt` / `lt` operator, and returns 200 (SUCCESS axon) or 500 (FAIL axon). This is how a pathway says "if the artist wrote a prompt, go to the image branch; otherwise go to the code branch."

- **Logic Retry neurons** (`_handle_retry`): Retry mode reads `spike.axoplasm['loop_count']`, increments it, and writes it back with `save(update_fields=['axoplasm'])` — and because the next successor spike deepcopies from this one, the counter naturally threads through the loop.

- **Debug neurons** (`central_nervous_system/effectors/effector_casters/debug_node.py`, Effector PK 9): Drop a Debug node into any pathway and it logs `spike.axoplasm.keys()` plus each key/value preview, tagged with a `debug_label` you can set in NeuronContext. This is the first thing to reach for when a value isn't landing where you expect.

- **CNS Spike Forensics UI**: `GET /api/v2/spikes/` and the spike-detail endpoint return the axoplasm field in the serializer, so the CNS Spike Forensics view can show it in the inspector panel next to the execution log and the result code.

## The MCP External Loop

Here's how the whole system talks to Claude Code and other MCP clients:

1. **Claude Code calls `launch_spike_train(pathway_id='...', seed_cerebrospinal_fluid={'prompt': '...'})`**
2. The MCP tool receives the seed dict and stashes it in the train's cerebrospinal_fluid
3. The train fires, and each spike deepcopies the CSF (at the root) or the previous spike's axoplasm
4. Spikes execute, effectors write to axoplasm via stdout protocol or via `mcp_update_axoplasm`
5. The train completes and fires **Dopamine** (success) or **Cortisol** (error)
6. Claude Code's MCP client polls `/api/v2/spiketrains/&#123;id&#125;/` to check status
7. When complete, Claude Code reads the final spike's axoplasm (and the train's cerebrospinal_fluid)
8. Claude Code assembles the results and launches a new train if needed

The CSF is the entry point for external context. The axoplasm is where everything else lives.

## The Internal Loop

Inside a single spike train:

1. **Frontal Lobe node fires.** Its effector runs a reasoning session.
2. **The LLM writes a new prompt** to axoplasm via `mcp_update_axoplasm`
3. **The next node fires** and reads the updated prompt from axoplasm
4. **Logic gate or logic retry node branches** based on axoplasm state
5. **Next spike is created.** It deepcopies the previous spike's axoplasm
6. **Axoplasm beats CSF** — the new prompt the LLM wrote is in axoplasm, so it takes precedence over the CSF seed
7. **The next Frontal Lobe sees the new prompt** and reasons on it

This is how a reasoning loop works: the LLM writes state to axoplasm, the next spike deepcopies it, and the next LLM call sees the updated state. All without tight coupling.

## The Subgraph Gap (Retrograde Transport Not Yet Implemented)

When a neuron calls into a child pathway via `invoked_pathway`, the CNS puts the parent spike to sleep (`DELEGATED` status) and spawns a child spike train that deepcopies the parent's axoplasm into its root. Beautiful — information flows *down* (anterograde). But when that child train finalizes, **nothing from the child's final axoplasm propagates back up to the parent spike.** The parent wakes up with the same dict it went to sleep with. Any work the child did, any values it wrote — none of that reaches the rest of the parent graph.

Today, if you want to return values from a subgraph, the subgraph has to write to an [engram](../brain-regions/hippocampus) in the [Hippocampus](../brain-regions/hippocampus) or send a [Thalamus](../brain-regions/thalamus) message. Retrograde transport — bringing state back up the chain — is on the roadmap.

## Rules of Thumb

If you're writing a new effector or reviewing a PR, follow these:

- **Never mutate axoplasm you received.** Deepcopy happens on spike creation, not on write. If you mutate `spike.axoplasm` you're mutating *this spike's snapshot* (which is fine) — but never reach across to a provenance spike's axoplasm and mutate that.

- **Always save with `update_fields=['axoplasm']`.** The execution log writer and the axoplasm writer run in overlapping code paths. A full `.save()` will clobber log writes. This rule is enforced in `mcp_update_axoplasm` and in the logic retry handler — copy that pattern.

- **Don't put giant objects on the axoplasm.** It gets deepcopied on every successor spike. A 10-megabyte JSON blob copied through a 50-spike train is a 500-megabyte nightmare. For anything large, store it in the [Hippocampus](../brain-regions/hippocampus) or write it to disk and put the path on the axoplasm.

- **Treat keys like a public API.** Gate nodes read them, Debug nodes print them, the `prompt` injection reads `prompt`, the image generator reads `image_gen_endpoint`. Give them clear names and don't rename them without a grep.

- **Use Debug nodes early and often.** The first time a new axoplasm key doesn't land where you expected, drop a Debug node in front of the consumer and read the `AXOPLASM[...]` lines in the worker log. The answer is almost always "the key wasn't there" or "NeuronContext was overriding it."

## How It Connects

- **[Central Nervous System](../brain-regions/central-nervous-system)**: The axoplasm and cerebrospinal fluid are fields on `Spike` and `SpikeTrain`. The CNS is what deepcopies axoplasm forward, hands it to effectors, parses write-back lines, and serves it through the spike serializers to the UI.

- **[Frontal Lobe](../brain-regions/frontal-lobe)**: Reasoning sessions read the axoplasm via `resolve_environment_context` to assemble the `prompt` and other runtime variables, and write to it via the `mcp_update_axoplasm` Parietal tool during the reasoning loop.

- **[Parietal Lobe](../brain-regions/parietal-lobe)**: Hosts the `mcp_update_axoplasm` MCP tool so the reasoning LLM can write to its own spike's axoplasm.

- **[Synaptic Cleft](../brain-regions/synaptic-cleft)**: Every axoplasm write fires an `Acetylcholine` neurotransmitter with `activity='axoplasm_updated'` and a `vesicle` containing the key and value, so the UI can update in real time.

- **[Hippocampus](../brain-regions/hippocampus)**: For anything bigger than a note or longer-lived than a single spike train, axoplasm hands off to the engram store.

---

## Field Reference

| Field | Type | Where | Notes |
|-------|------|-------|-------|
| `Spike.axoplasm` | `JSONField(default=dict)` | `central_nervous_system/models.py` | Per-spike. Deepcopied forward via anterograde transport. The fast, local snapshot layer. |
| `SpikeTrain.cerebrospinal_fluid` | `JSONField(default=dict)` | `central_nervous_system/models.py` | Train-level. Immutable after launch. Set via MCP seed. The global bath layer. |

## Write Paths

| Path | Location | Mechanism |
|------|----------|-----------|
| Effector stdout protocol | `neuromuscular_junction.py` | Lines matching `::axoplasm_set key::value` are parsed, set on `spike.axoplasm`, and stripped from the execution log. |
| Parietal MCP tool | `parietal_lobe/parietal_mcp/mcp_update_axoplasm.py` | `mcp_update_axoplasm(spike_id, key, value)` — direct write with `save(update_fields=['axoplasm'])`. |
| Logic Retry counter | `pathway_logic_node._handle_retry` | Increments `spike.axoplasm['loop_count']` and saves. |
| Subgraph entry layering | `central_nervous_system._create_spike_from_node` | NeuronContext of the parent neuron is layered onto the child train's root spike axoplasm after the deepcopy. |
| CSF to axoplasm at root | `central_nervous_system._create_spike_from_node` | MCP `launch_spike_train`, Celery kickoffs, and tests can pre-load the root spike axoplasm by seeding the train's cerebrospinal_fluid. |

## Read Paths

| Consumer | Location | How it reads |
|----------|----------|--------------|
| Template rendering / `prompt` injection | `central_nervous_system/utils.py::resolve_environment_context` | Merged into `raw_context` after CSF, before EffectorContext, below NeuronContext. |
| Frontal Lobe reasoning objective | `frontal_lobe/frontal_lobe.py::_get_rendered_objective` | Reads `KEY_PROMPT` from the merged `raw_context`. |
| Logic Gate neurons | `pathway_logic_node._handle_gate` | Direct `spike.axoplasm[gate_key]` lookup with operator comparison. |
| Logic Retry neurons | `pathway_logic_node._handle_retry` | Direct read of `spike.axoplasm['loop_count']`. |
| Debug neurons | `effectors/effector_casters/debug_node.py` | Logs keys and value previews at INFO. |
| CNS Spike Forensics UI | `/api/v2/spikes/` serializer | Returned as a field on the Spike resource. |

## Resolution Order (Current)

1. Environment variables (`VariableRenderer.extract_variables`)
2. `SpikeTrain.cerebrospinal_fluid`
3. `Spike.axoplasm` ← wins over CSF
4. `EffectorContext`
5. `NeuronContext` ← highest precedence
