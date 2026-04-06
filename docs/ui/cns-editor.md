---
id: cns-editor
title: "CNS Graph Editor"
sidebar_position: 5
---

# CNS Graph Editor

The CNS (Central Nervous System) Graph Editor is where you design and manage **neural pathways** — automated workflows that chain together effectors into executable graphs. Each pathway is a directed acyclic graph of neuron nodes connected by axon wires, and the editor gives you a visual canvas to build, connect, and run them.

## Getting There

Navigate to **Central Nervous System** from the main menu, or visit `/cns` directly. You'll land on the pathway dashboard.

## Pathway Dashboard

![CNS Pathway Dashboard](/img/ui/cns-dashboard.png)

The dashboard is split into two regions.

**Left sidebar** lists every pathway in your environment, organized by category. Starred pathways (marked with a colored star) pin to the top under a **Starred** section. Below that, pathways are grouped under their categories — Corpus Callosum, Pre-Release, Agent, Neural Pathways, and so on. Each row shows the pathway name with play and edit buttons beside it. A search/filter box at the top lets you narrow the list by name. An **Environment** dropdown at the very top scopes everything to the active environment.

**Main area** shows sparkline cards for recently-run pathways. Each card displays the pathway name, last run status (SUCCESS in green, FAIL in red), elapsed time, how long ago it ran, a miniature sparkline of recent execution times, and aggregate stats (average duration, total runs, fail count). Cards with no data yet show a placeholder. Each card also has its own play and edit shortcuts in the top-right corner.

## Opening the Graph Editor

Click the **edit icon** (pencil) next to any pathway in the sidebar, or on a sparkline card. The breadcrumb updates to show the path: `Central Nervous System > [Pathway Name] > Edit`.

## Editor Layout

![Pre-Release Pathway in the Graph Editor](/img/ui/cns-pre-release-editor.png)

The editor has three panels.

### Effector Palette (Left)

![Effector Palette Detail](/img/ui/cns-effector-palette.png)

The palette lists every available neuron type you can drag onto the canvas, grouped by role.

**Logic** nodes (teal/amber/blue accent dots) handle control flow. **Gate** evaluates a condition and routes the spike down the true or false branch. **Retry** wraps a downstream subgraph and re-executes it on failure, up to a configurable retry count. **Delay** pauses execution for a specified duration before passing the spike along.

**Reasoning** nodes (purple accent) invoke AI capabilities. **Frontal Lobe Node** sends the current spike context to a Frontal Lobe reasoning session and returns the result.

**Effectors** (no accent, listed below the divider) are the concrete task executors. These are the workhorses — things like "Staging: Build Game", "Compile PSO Cache", "Pre-Release Build", "Deploy", "Version Metadata", and any custom effectors you define through the Effector Editor API. Each effector maps to a Django-backed task that Celery can execute.

A **search box** at the top of the palette filters the list as you type. The **X** button closes the palette to give more canvas space.

### Graph Canvas (Center)

The canvas is a ReactFlow-powered interactive graph. Neuron nodes sit on the canvas as dark glass cards, and colored axon wires connect them.

Each neuron node shows its **name** (e.g., "Backup SaveGames (Prerelease -> Cache)"), a **PK number** in the top-right corner for quick reference, an **ENV badge** showing which environment command it executes, and its **axon ports** along the right edge.

Every neuron node has up to four port types, color-coded for instant recognition. **INPUT** (left side, blue) is where the spike enters the node. **FLOW** (right side, blue dot) fires unconditionally after the node completes, regardless of success or failure — use this for "always do next" chains. **SUCCESS** (right side, green dot) fires only when the node completes successfully. **FAIL** (right side, red dot) fires only on failure — route this to error handlers, retry logic, or alerts.

Wire connections between ports define the execution graph. Drag from an output port to an input port to connect nodes. The canvas supports zoom (scroll wheel), pan (click-drag on empty space), and a minimap in the bottom-right corner. Zoom controls (+/−) and a fit-to-view button sit in the bottom-left.

### Telemetry Override (Right)

The right panel shows **Telemetry Override**. Click any neuron node on the canvas to inspect and override its properties here — things like timeout values, retry counts, environment variable overrides, or debug flags. When no node is selected, it displays the prompt "Select a neuron to inspect its properties."

## Example: A Complex Pathway

The **Pre-Release** pathway demonstrates a real-world multi-step automation. Five nodes chain together in sequence: **Begin Play** kicks off the process, flowing into **Version Metadata** which stamps the build, then **Backup SaveGames (Prerelease -> Cache)** safeguards player data. On success, **Pre-Release Build** compiles the release, and finally **Pre-Release Run** executes the test suite. Each node's FLOW/SUCCESS/FAIL ports give you fine-grained control over what happens when any step succeeds or fails.

## Example: A Simple Pathway

![Engage Temporal Lobe — a 2-node pathway](/img/ui/cns-temporal-lobe-pathway.png)

Not every pathway needs to be complex. The **Engage Temporal Lobe** pathway is just two nodes: **Begin Play** connects to a **Temporal Lobe Effector** that triggers temporal matrix processing. The FLOW/SUCCESS/FAIL ports on the Temporal Lobe Effector show the three possible outcomes, but in this simple case only FLOW is wired.

## Running a Pathway

You can run a pathway directly from the editor. The **Begin Play** node (the entry point, shown with a darker reddish-brown background) has play and stop buttons in its header bar. Click play to fire a spike into the graph. Execution propagates through each node following the axon wires, and you can watch progress in real-time on the [CNS Monitor](./cns-monitor.md).

You can also trigger runs from the dashboard — every sparkline card and sidebar row has a play button.

## Key Concepts

**Pathway**: A named, saveable graph of connected neuron nodes. Pathways belong to an environment and can be starred for quick access.

**Neuron Node**: A single unit of work in the graph. Could be a logic node (Gate, Retry, Delay), a reasoning node (Frontal Lobe), or a concrete effector.

**Effector**: The Django model behind a neuron node. Effectors define what actually happens — the shell command, API call, or Celery task that executes when a spike reaches the node.

**Spike**: The unit of execution that flows through a pathway. When you "run" a pathway, you fire a spike into the Begin Play node, and it propagates through the graph following axon connections.

**Axon Ports**: The colored connection points on each node (INPUT, FLOW, SUCCESS, FAIL) that determine how spikes route through the graph.

**Environment**: The execution context (e.g., "Default Environment", "Staging", "Production") that scopes which effectors and variables are active.
