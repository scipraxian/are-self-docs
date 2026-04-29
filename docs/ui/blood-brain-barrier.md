---
id: blood-brain-barrier
title: "Blood Brain Barrier"
sidebar_position: 1
---

# Blood Brain Barrier

The Blood Brain Barrier is the gateway to the entire Are-Self system — your root dashboard and entry point into the neurologically-inspired reasoning engine. Just as the biological blood-brain barrier filters what enters the brain to protect it, this dashboard filters and presents the most essential information about your system's health and activity at a glance. When you first open Are-Self, you land here at `/` to see an overview of your identities, available models, active reasoning sessions, and recent spike executions across all brain regions.

## Getting There

The Blood Brain Barrier is your home page. Open Are-Self or navigate directly to `/` from anywhere in the application. You'll see the root dashboard immediately.

## System Overview

![Blood Brain Barrier Dashboard](/img/ui/blood-brain-barrier.png)

At the top of the dashboard sits the **hero banner** — a dark glassmorphic card featuring the "ARE-SELF" logo and the tagline "Why do for yourself what Are-Self can do for you?" This banner establishes the system's identity and sets the tone for what the swarm is for.

## Stats Cards Row

Below the hero banner, three prominent stat cards display real-time system metrics in a horizontal row. These cards give you an instant pulse on the scale and activity of your reasoning engine.

**IDENTITIES** (left card, teal brain icon) shows the number of distinct identities active in your system — the different neural personas or reasoning contexts you've configured. This count updates as you create and manage new identities through the Identity Manager.

**MODELS** (center card, purple lightning bolt icon) displays the total count of language models and reasoning engines available to your system. This represents the collective intelligence pool that powers spike executions and reasoning sessions across all brain regions. With 230 models shown in a typical deployment, you have access to a rich variety of reasoning capabilities.

**SESSIONS** (right card, green chart icon) tallies the number of active and recent reasoning sessions. Each session represents a conversational or analytical context where the system performed structured reasoning. This metric gives you a sense of how intensively your system has been used.

All three stat cards are driven by real-time pub/sub events from the Dendrite message system. When a new spike completes, a new session starts, or an identity is created, these numbers update automatically without requiring a page refresh.

## Latest Activity Section

Below the stats cards, the dashboard splits into two columns to show your most recent system activity.

### Latest Spikes (Left Panel)

The **LATEST SPIKES** panel lists the six most recent spike executions across all brain regions. Each spike entry shows the name of the neuron that fired (e.g., "Frontal Lobe Node", "Temporal Lobe Effector"), a green success indicator dot, and a time ago badge (e.g., "15h ago", "2m ago"). This gives you a quick window into what your brain regions have been executing most recently.

A **"View All →"** link at the top-right of the panel navigates you to the full Spikes dashboard in the CNS (Central Nervous System) region, where you can inspect detailed telemetry, logs, and execution history for every spike.

### Latest Sessions (Right Panel)

The **LATEST SESSIONS** panel shows the six most recent reasoning sessions — the conversational or analytical threads where the system performed complex reasoning. Each session entry is displayed as a teal-bordered card showing the session name (e.g., "Thalamus [Program][Local]"), the time ago it was created, and a turn count badge indicating how many exchanges or reasoning steps occurred (e.g., "1 turns", "5 turns"). Sessions accumulate turns as you interact with them, so this count reflects engagement depth.

A **"View All →"** link at the top-right of the panel takes you to the full Sessions dashboard in the Frontal Lobe region, where you can review detailed reasoning transcripts, outputs, and metrics for each session.

## Navigate Bar

At the bottom of the dashboard, a horizontal **NAVIGATE** section provides quick-access buttons to every major brain region in Are-Self. Each button displays an icon and the region name: **CNS**, **FRONTAL LOBE**, **HIPPOCAMPUS**, **HYPOTHALAMUS**, **IDENTITIES**, **PFC**, **PNS**, and **TEMPORAL LOBE**. Clicking any button instantly navigates you to that region's dashboard or editor.

This navigate bar is your command center for moving between different functional areas of the system without needing to use breadcrumbs or nested menus. It remains visible and consistent across the entire application as a key orientation tool.

## Environment Selector

In the top-right corner of the navbar, the **Environment** dropdown displays your currently active execution context (e.g., "Default Environment ✓"). A settings gear icon next to it lets you switch environments globally. Changing the environment here rescopes all subsequent operations — any pathways you run, spikes you fire, or sessions you initiate will use the selected environment. This is especially useful when managing multiple staging or production deployments simultaneously.

## Real-Time System Monitoring

The Blood Brain Barrier is a living dashboard that updates in real-time through the Dendrite pub/sub event system. The stats cards refresh whenever spike or session events fire, giving you an accurate read on system activity without manual polling. The Latest Spikes and Latest Sessions panels show the six most recent entries, so as new activity occurs, older entries scroll off the bottom. This creates a "stream of consciousness" effect where you can watch your system working in near-real-time.

## Key Concepts

**Blood Brain Barrier**: The root dashboard and entry point to Are-Self, providing a system-wide overview of identities, models, sessions, and spike activity. Like the biological blood-brain barrier that filters substances entering the brain, this dashboard filters and presents the most critical metrics at a glance.

**Stats Cards**: Three real-time metric displays (Identities, Models, Sessions) that give you an instant pulse on the scale and configuration of your reasoning engine. They update via pub/sub events from Dendrite.

**Latest Spikes**: A panel showing the six most recent spike executions across all brain regions, with status indicators and time badges. Provides quick visibility into what neurons have been firing recently.

**Latest Sessions**: A panel showing the six most recent reasoning sessions with turn counts and creation times. Sessions are conversational or analytical contexts where the system performed structured reasoning work.

**Navigate Bar**: A horizontal quick-access menu at the bottom of the dashboard providing one-click navigation to all major brain regions (CNS, Frontal Lobe, Hippocampus, etc.). Keeps you oriented and enables rapid context switching.

**Environment**: The execution context (e.g., "Default Environment") that scopes all operations globally. Changing the environment dropdown rescopes spike firing, session creation, and pathway execution to target a different deployment or configuration.