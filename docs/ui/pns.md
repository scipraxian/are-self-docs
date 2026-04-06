---
id: pns
title: "Peripheral Nervous System"
sidebar_position: 11
---

# Peripheral Nervous System

The Peripheral Nervous System (PNS) page monitors and controls the Celery worker fleet — the distributed execution backbone of Are-Self. From here, you can view worker health, restart workers, manage the system heartbeat, and coordinate distributed spike execution across your network.

![Peripheral Nervous System UI](/img/ui/pns.png)

## Overview

The PNS is Are-Self's execution distribution layer. Instead of running all spikes on a single machine, the PNS routes spike trains to multiple Celery workers across your network. Each worker is a **Nerve Terminal** — a remote agent that:

- Executes spike trains in isolation
- Reports health metrics and telemetry
- Sends lifecycle events (launch, crash, reconnect, etc.)
- Maintains a queue of active tasks

The PNS page provides real-time visibility and control over this distributed system.

## System Control Section

At the top of the page, you'll find system-level controls:

### Active Workers

The **Active Workers** indicator shows:
- Green status dot (● = workers are connected and running)
- Count badge (e.g., "● 1" = 1 active worker)

This gives you an at-a-glance sense of your worker fleet health.

### RESTART WORKERS

The **RESTART WORKERS** button (teal/green, full-width) sends a restart signal to all connected Celery workers. This is useful when:

- You've deployed new code and need workers to reload
- A worker is in a degraded state and needs a clean restart
- You're rolling out environment changes

After clicking, workers will gracefully shutdown and restart, picking up any code or configuration changes.

### Shutdown System

The **Shutdown System** button (red text, full-width) triggers a full system shutdown. Use with caution — this will:

- Terminate all active Celery workers
- Stop all in-flight spike executions
- Bring down the entire distributed system

Only use this when you need a complete shutdown (e.g., maintenance, emergency stop).

## Heartbeat Monitor

The **Heartbeat** section displays the health of the worker polling system:

- **Status dot**: Green (running) or gray (stopped)
- **Label**: "HEARTBEAT RUNNING" or "HEARTBEAT STOPPED"
- **PID**: The process ID of the heartbeat monitor (when running)
- **START button**: Click to toggle the heartbeat monitor on/off

The heartbeat continuously polls the Celery worker status at regular intervals, updating the worker cards below in real-time. If the heartbeat is stopped, worker information becomes stale.

## Worker Cards

Below the system controls, you'll see a grid of **Worker Cards** — one for each connected Celery worker:

### Worker Card Layout

Each card displays:

**Header**
- Green status dot (● = worker online)
- Hostname (e.g., "celery@MikeDesktop2024")

**Statistics**
- **ACTIVE**: Number of tasks currently executing on this worker
- **COMPLETED**: Total tasks completed since worker startup
- **Load Average**: System load (CPU utilization)
- **PID**: Process ID of the worker
- **Prefetch Count**: Number of pre-fetched tasks waiting to execute
- **Current Task**: Name of the spike train currently executing (if any)
- **Concurrency**: Maximum concurrent tasks this worker can run
- **CPU User/Sys**: CPU usage breakdown

**Log Output Area**
- Recent log lines from the worker (last 5 lines)
- "No log output yet" when the worker is fresh or idle

**Selection Hint**
- Bottom of card: "Shift+click to select"

### Multiple Workers

If you have multiple workers connected, the cards appear in a grid layout. Each worker is independently updated via the Dendrite event system (CeleryWorker events).

### Real-Time Updates

Worker cards update automatically as the heartbeat polls for new telemetry. You'll see:
- Task counts change as spike trains execute
- Log output update with new worker messages
- Status dot change if a worker goes offline

## PNS Monitor

For deeper inspection of worker behavior, navigate to the **PNS Monitor** view:

- Access via `/pns/monitor`
- Provides historical graphs, metrics, and detailed worker analytics
- Shows task distribution, execution trends, and worker capacity planning

## Distribution Modes

The PNS enables multiple distribution modes for spike execution:

- **Local Server**: Run spike on the primary server (no worker overhead)
- **All Online Agents**: Distribute spike across all connected workers for parallelization
- **One Available**: Route spike to the first available worker (load-balanced)
- **Specific Targets**: Route spike to named workers (e.g., GPU-enabled agents for ML workloads)

When you create a neural pathway in the CNS Editor, you can specify which distribution mode to use. The PNS handles the routing.

## Architecture

The PNS is built on:

**NerveTerminal**
- A registered remote agent on your network
- Identified by hostname, IP address, port, and version
- Hosts a Celery worker process

**NerveTerminalTelemetry**
- Periodic health snapshots (CPU, memory, storage, task counts)
- Sent by each worker at regular heartbeat intervals
- Used to populate the worker cards

**NerveTerminalEvent**
- Lifecycle events emitted by workers:
  - **Launch**: Worker process started
  - **Kill**: Worker gracefully shutdown
  - **Crash**: Worker terminated unexpectedly
  - **Disconnect**: Network connection lost
  - **Reconnect**: Worker rejoined the cluster
  - **Update**: Worker version or configuration changed
- Visible in the System Activity log and worker card history

## Common Workflows

### Monitoring Worker Health

1. Open the PNS page
2. Check the **Active Workers** count
3. Review each **Worker Card**:
   - Look for high COMPLETED counts (busy workers)
   - Check CPU User/Sys for bottlenecks
   - Review log output for errors or warnings

### Deploying Code Changes

1. Click **RESTART WORKERS**
2. Wait for all workers to reconnect (status dots turn green)
3. Verify in the System Activity log that all workers restarted successfully
4. Resume spike execution

### Scaling Your System

1. Deploy new Celery workers on additional machines (follow deployment docs)
2. Workers automatically register with the PNS when they connect
3. New worker cards appear in the grid
4. The PNS automatically load-balances spike execution across the expanded fleet

### Troubleshooting Worker Issues

If a worker goes offline:

1. Check the **NerveTerminalEvent** log for crash/disconnect events
2. SSH into the worker machine and check Celery logs
3. Restart the Celery process (or use **RESTART WORKERS**)
4. The worker will reconnect and resume execution

## Related Pages

- **[Central Nervous System (CNS)](/docs/ui/cns-editor)**: Create and manage neural pathways with distribution modes
- **[CNS Monitor](/docs/ui/cns-monitor)**: Monitor spike execution across the PNS fleet
- **[Environments](/docs/ui/environments)**: Configure environment-specific executables and variables
- **[Blood Brain Barrier](/docs/ui/blood-brain-barrier)**: Dashboard showing latest spikes and system status