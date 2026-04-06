---
id: cns-monitor
title: "CNS Monitor"
sidebar_position: 6
---

# CNS Monitor

The CNS Monitor is where you watch **spike trains** execute in real-time. A spike train is a complete execution run of a pathway — from **Begin Play** through all connected nodes, showing you exactly which neurons fired, how long each took, whether they succeeded or failed, and detailed forensic data for every step. The monitor gives you two interconnected views: the **Spike Train Timeline** for browsing historical and in-progress runs, and the **Spike Monitor** for diving deep into the node-by-node graph visualization of a single execution.

## Getting There

From the CNS Graph Editor, click the **play button** next to **Begin Play** (or on any pathway card in the dashboard) to fire a new spike. You'll be taken directly to the Spike Monitor. To browse existing spike trains for a pathway, navigate to **Central Nervous System** in the main menu, find your pathway, and click the **metrics icon** (or look for a "View Timeline" link). Alternatively, visit `/cns/pathway/:pathwayId` directly to land on the Spike Train Timeline.

## Spike Train Timeline

![Spike Train Timeline](/img/ui/cns-monitor.png)

The timeline view shows all spike train executions for a given pathway, helping you track runs over time and spot patterns in success rates, duration trends, and failure modes.

### Layout (Three-Panel)

**Left Panel — Pathway Summary Card**

The left panel displays a summary card for the pathway being monitored.

- **Pathway name** appears at the top (e.g., "Corpus Callosum").
- **▷ Launch New Train** button (teal, prominent) fires a new spike into this pathway. This is a quick way to queue another run without navigating away.
- **✎ Edit Graph** button opens the pathway in the CNS Graph Editor.
- **Statistics table** below shows aggregate metrics:
  - **TOTAL RUNS**: Count of all spike trains ever fired for this pathway.
  - **SUCCESS RATE**: Percentage of trains that completed without failure (e.g., "100%").
  - **AVG DURATION**: Average wall-clock time for a full execution (e.g., "3458m 38s").
  - **LAST RUN**: How long ago the most recent spike train executed (e.g., "15h ago").

This panel provides context at a glance — you can see immediately whether a pathway is stable, fast, and frequently used.

**Center Panel — Train Timeline Entries**

The center panel is a scrollable list of spike train entries, ordered from newest to oldest. Each entry is a compact row showing a complete execution.

Each row displays:

- **Train ID** (e.g., "#F3A0F5") — a unique identifier for this spike train, clickable to jump to the Spike Monitor.
- **Status badge** — a colored label. GREEN "SUCCESS" means all nodes executed and the final spike exited cleanly. RED "FAILED" indicates one or more nodes errored. YELLOW "RUNNING" means the train is currently executing. GRAY "PENDING" means it's queued but not yet started.
- **Duration** — elapsed time from Begin Play to the final node's completion (e.g., "3458m 39s").
- **Spike count** — total number of individual spikes that propagated through the graph (e.g., "11 spikes"). This counts every transition between nodes, so a complex graph with multiple branches can have a high spike count.
- **Time ago** — how long in the past this train ran (e.g., "2h ago").

Below each row is a **horizontal bar visualization** that shows the execution timeline in graphical form. Each spike is rendered as a colored segment, with green indicating success and red indicating failure. Neuron names are visible along the bar (e.g., "FRONTAL LOB...", truncated to fit), giving you a visual sense of which nodes executed and in what order. Hovering over a segment reveals the full neuron name and detailed spike metadata.

Clicking any spike train entry navigates to the **Spike Monitor** for detailed graph-based inspection.

## Spike Monitor

The Spike Monitor is a ReactFlow-powered deep-dive into a single spike train. Here you see the exact nodes that executed, their status in real-time, execution timings, and the axon ports that fired.

### Layout (Three-Panel with Graph)

**Left Panel — Train Metadata & Controls**

The left panel contains metadata, controls, and navigation buttons for the selected spike train.

- **Pathway name** appears at the top (e.g., "Corpus Callosum").
- **Train metadata table** shows:
  - **TRAIN**: The spike train ID (e.g., "#f3a0f543").
  - **STATUS**: Final status of the train (Success, Failed, Running, Pending).
  - **SPIKES**: Total spike count (e.g., "11").
  - **DURATION**: Total wall-clock time for the execution (e.g., "3458m 39s").
- **LAUNCH NEW TRAIN** button (teal border) queues another execution of this pathway.
- **Edit Graph** button opens the pathway definition in the editor.
- **Back to Timeline** button returns to the Spike Train Timeline without losing your place.
- **☑ Auto-pan to active node** checkbox (enabled by default). When checked, the graph view automatically pans and centers to follow the currently-executing node during a live run. Uncheck this if you want to manually explore the graph while execution is in progress.

**Center Panel — ReactFlow Graph Visualization**

The center panel is a full-viewport ReactFlow canvas showing the pathway as a directed acyclic graph of neuron nodes and axon wire connections. This is the same visual representation you see in the editor, but now annotated with real execution data.

**Nodes and Status Colors**

Each neuron node appears as a dark glass card. The **border color** of the card indicates the node's status in this spike train:

- **GREEN border** = the node executed successfully (spike exited via SUCCESS port).
- **RED border** = the node failed (spike exited via FAIL port).
- **YELLOW border** = the node is currently executing (live status, only visible during an in-progress run).
- **GHOST/GRAY border** = the node did not execute in this train (spike never reached it, or the pathway's logic skipped it).

The special **Begin Play** entry node appears with a darker reddish-brown background, marking it as the pathway entry point. It has no inputs — spikes originate here.

Each node displays:

- **Node name** (e.g., "Frontal Lobe Node").
- **Type badge** — a colored label (e.g., "FRONTAL") indicating the neuron type.
- **Execution time** — how long this node took to complete, shown in milliseconds (e.g., "250ms"). This is only present for nodes that executed.
- **Axon ports** along the right edge (color-coded):
  - **INPUT** (left side, blue triangle) — where the spike enters.
  - **FLOW** (right side, blue dot) — unconditional exit, always fires on completion.
  - **SUCCESS** (right side, green dot) — fires only on successful completion.
  - **FAIL** (right side, red dot) — fires only on failure.

**Wiring and Connections**

Colored axon wires connect nodes following the pathway definition. The wire from a node's output port to a downstream node's input port shows the execution path. In a live run, wires animate to highlight the current propagation flow.

**Graph Controls**

- **Scroll wheel**: Zoom in and out.
- **Click-drag on empty space**: Pan around the canvas.
- **Zoom buttons** (+/−) in the bottom-left corner for granular zoom control.
- **Fit-to-view button** (also bottom-left) auto-zooms to show the entire graph.
- **Lock button** (bottom-left) toggles between interactive and locked modes. In locked mode, you can still pan and zoom, but cannot drag nodes.
- **Minimap** (bottom-right corner) shows a bird's-eye view of the entire graph and helps you navigate large pathways.

**Right Panel — CNSMetaPill (Node Details)**

When you click a neuron node on the canvas, the right panel reveals detailed metadata about that node in this specific spike train.

The **CNSMetaPill** displays:

- **Node name** and **type**.
- **Execution status** (Success, Failed, Running, Pending, or Unrun).
- **Duration** — exact wall-clock milliseconds for execution.
- **Spike count** — how many spikes were generated within this node's execution (useful for nodes that create branches).
- **Input/Output port summary** — which ports the spike entered and exited.
- **Hostname** — the machine that executed this node's effector.
- **Result code** — the numeric exit code or status returned by the underlying Celery task.
- **Environment** — which environment variable set was in scope.
- **Timestamps** — created at, started at, completed at, modified at.

If no node is selected, the panel shows "Click a node to inspect its properties."

## Spike Forensics

To investigate a single spike in extreme detail, click an individual spike segment in the Spike Train Timeline's bar visualization, or click a node in the Spike Monitor and then select a spike ID. This navigates you to `/cns/spike/:spikeId`, the **Spike Forensics** view.

**Spike Forensics displays:**

- **Spike metadata** — the spike ID, associated spike train ID, neuron that generated it, status (Success, Failed, etc.), and duration.
- **Hostname** — which worker executed this spike.
- **Result code** — numeric exit code.
- **Application logs** — stdout/stderr output from the underlying Celery task, displayed in a terminal-style pane.
- **Execution logs** — additional structured logs (timestamps, log levels, messages) for deep debugging.
- **Timeline** — when the spike was created, started, completed, and last modified.

This view is invaluable when a single step in an otherwise successful pathway fails, or when you need to inspect what a node actually did (its command output, return value, etc.).

## Real-Time Monitoring

When a spike train is in the **RUNNING** state, the Spike Monitor updates in real-time.

- **Node borders animate** as execution moves through the graph. A node's border transitions from gray (unrun) → yellow (running) → green (success) or red (failure).
- **Execution times appear** in each node as it completes.
- **Auto-pan** (if enabled) automatically centers the view on the currently-active node, so you never lose sight of where execution is.
- **The left panel's status** updates to show the latest spike count and duration.

This real-time visualization is powerful for troubleshooting — you can see exactly where a pathway stalls or fails, and immediately jump to Spike Forensics to see what went wrong.

## Common Workflows

**Monitoring a Deployment**

You've queued a Pre-Release pathway run. Open the Spike Monitor and enable **Auto-pan to active node**. Watch as the graph lights up in sequence: Begin Play → Version Metadata → Backup SaveGames → Pre-Release Build → Pre-Release Run. If any node turns red, click it to see the failure reason in the CNSMetaPill, then jump to Spike Forensics to see the actual error logs.

**Comparing Two Runs**

Open the Spike Train Timeline. Find two trains of interest (one successful, one failed). Click the failed one to open its Spike Monitor, note which node(s) are red. Then use **Back to Timeline** and click the successful train to compare the execution graph side-by-side. Are the node timings different? Did the successful run take a different path through a Gate? This comparison is crucial for understanding intermittent failures.

**Debugging a Complex Pathway**

A pathway with many branches (conditionals, retries) has high spike counts. Open the Spike Monitor, zoom in on a specific region using the graph controls, and carefully trace the axon wires to see exactly which ports fired in which order. Click nodes to inspect their exact duration and result code in the CNSMetaPill.

**Finding Performance Bottlenecks**

Open the Spike Train Timeline and scan the bar visualizations for segments that are visibly wider than others (indicating longer execution time). Click that train to open the Spike Monitor, then click the slow node to see its duration in milliseconds. Compare to other runs. If a node that usually takes 100ms is now taking 5000ms, that's your bottleneck — jump to Spike Forensics to see if it's waiting on an external API, hitting resource limits, or something else.

## Key Concepts

**Spike Train**: A complete execution of a pathway from Begin Play through all connected nodes. Each spike train has a unique ID, a final status (Success, Failed, Running, Pending), and a total spike count and duration. Spike trains are the unit of observability for pathway execution.

**Spike**: An individual unit of propagation through the graph. When a node completes, it generates spike(s) that exit via one or more axon ports (FLOW, SUCCESS, or FAIL) and travel to downstream nodes. A complex pathway can generate many spikes within a single train.

**Spike Monitor**: The graph-based visualization of a single spike train, showing neuron nodes with their status colors, axon connections, and real-time execution progress.

**Spike Train Timeline**: The chronological list of all spike trains for a pathway, with status badges, durations, spike counts, and bar visualizations of execution flow.

**Spike Forensics**: The deep-dive detail view for a single spike, showing metadata, application logs, execution logs, and exact timestamps. Used for debugging failures and understanding node behavior.

**Auto-pan**: A toggle that automatically centers the Spike Monitor's graph view on the currently-executing node during a live run. Useful for following execution flow without manual navigation.

**Neuron Status**: The execution outcome for a single node within a spike train:
- **Success** (green border) — node executed and exited via SUCCESS port.
- **Failed** (red border) — node encountered an error and exited via FAIL port.
- **Running** (yellow border) — node is currently executing.
- **Unrun/Pending** (gray border) — node did not execute in this train.

**Begin Play**: The entry point of a pathway, where every spike train starts. Begin Play is a special node that has no inputs and always fires, initiating execution.

**Axon Ports**: The color-coded connection points on each neuron node:
- **INPUT** (blue) — where a spike enters.
- **FLOW** (blue) — unconditional exit.
- **SUCCESS** (green) — success-only exit.
- **FAIL** (red) — failure-only exit.
