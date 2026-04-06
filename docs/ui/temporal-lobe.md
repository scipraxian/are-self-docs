---
id: temporal-lobe
title: "Temporal Lobe"
sidebar_position: 3
---

# Temporal Lobe

The Temporal Lobe is the orchestration hub for scheduled multi-agent work cycles. Here you manage the Temporal Matrix—a sophisticated scheduling system that coordinates iterations (time-bounded work cycles) composed of sequential execution phases called shifts. Each iteration brings together multiple identity discs to collaborate through structured stages, from initial sifting through analysis, planning, execution, reflection, and rest. This page is where you design iteration templates and launch instances to observe real-time agent collaboration unfold across the reasoning cycle.

## Getting There

Navigate to the Temporal Lobe by clicking the "Temporal Lobe" link in the main navigation. The page loads at `http://localhost:5173/temporal`, displaying the full three-panel layout for managing iterations and coordinating participant schedules.

## Layout Overview

The Temporal Lobe interface is divided into three distinct regions, each serving a specific role in iteration management and participant coordination.

### Left Sidebar: Definitions and Iterations

The left sidebar is the control center for iteration management, divided into two vertical sections. At the very top sits a prominent "+ New Definition" button rendered in teal with full width, inviting you to create new iteration templates. Below this, the **DEFINITIONS** section lists all available iteration blueprints—reusable templates that define the structure and sequencing of shifts. You might see entries like "Standard Agile Sprint" or "Emergency Hotfix Cycle," each representing a different orchestration pattern for your agents.

Beneath the definitions is the **ITERATIONS** section, which displays all iteration instances you've spawned from your definitions. Each iteration appears as a list item showing its name and status. For example, you might see "Gestation Chamber" as a placeholder iteration without a status badge, alongside multiple "Standard Agile Sprint – Waiting" entries (where the currently selected iteration is highlighted with a yellow border) and numerous "Standard Agile Sprint – Finished" entries that appear dimmed to indicate completion. The list is scrollable, allowing you to browse through your entire iteration history.

### Center Panel: Iteration Detail and Shift Management

The center panel is the heart of the interface, displaying the currently selected iteration's full execution structure. At the top, a header shows the iteration name in capitals—for example, "STANDARD AGILE SPRINT"—followed by a timestamp indicating when the iteration was created (e.g., "2026-04-02 20:56").

Below the header, iteration metadata provides essential context. The **Iteration ID** displays a UUID that uniquely identifies this runtime instance. The **Status** field shows the current state (Waiting, Running, or Finished). The **Env** (environment) field displays a teal link to the execution environment, typically "Default Environment."

A row of action buttons follows the metadata. A trash icon allows you to delete the iteration entirely. The "✕ Close Iteration" button removes it from your active view. Most importantly, the "▷ INITIATE" button (rendered in teal) transitions the iteration from Waiting to Running, kicking off the multi-agent orchestration cycle.

The bulk of the center panel displays **shift cards** arranged horizontally, each representing a sequential execution phase. Each card shows a shift number and name—for example, "1. SIFTING" with a yellow border and a turn counter displaying "0 / 20" (indicating zero turns completed out of a maximum of twenty). Within each shift card, you see **participant discs**—visual representations of the identity discs currently slotted into that shift. Each disc shows the participant's name (e.g., "Jessica"), their role in brackets (e.g., "[Program]"), their level ("Lvl 1"), and their accumulated XP ("XP: 0"). A three-dot menu next to each participant allows you to remove them or adjust their configuration.

The first few shifts (Sifting, Pre-Planning) are typically visible in the default viewport. An arrow button (▷) to the right lets you scroll horizontally to reveal additional shifts—Planning, Executing, Post-Execution, and Sleeping—showing the complete execution pipeline. Each shift you scroll through displays the same participant structure, letting you see at a glance who is allocated to each phase.

### Right Panel: Identity Roster

The right panel embeds the Identity Roster directly into the iteration view, facilitating drag-and-drop participant assignment. The roster displays two categories of identities: **ACTIVE DISCS** (currently running in the system) and **BASE IDENTITIES** (the foundational identities from which discs are spawned).

Under ACTIVE DISCS, you see entries like "Jessica [Program] [Lvl...]", "Steve [Program] [Lvl...]", and "Thalamus [Program]...", each with associated metadata. Under BASE IDENTITIES, you see the base forms—"Jessica", "Steve", "Thalamus"—marked with star icons to denote their foundational status. Each identity or disc in the roster has a gear icon for configuration options and a drag handle, making them ready to be dragged into shift slots within the center panel.

## Core Interactions

### Creating and Using Iteration Definitions

Iteration definitions are reusable blueprints that encode the structure of your work cycles. Click the "+ New Definition" button to create a new blueprint, specifying the shifts and their parameters. Definitions act as templates; when you want to run an actual iteration, you spawn a new instance from a definition. This separation allows you to reuse complex orchestration patterns across multiple execution cycles without rebuilding the structure each time.

### Launching an Iteration

Once you have an iteration instance in Waiting status, click the "▷ INITIATE" button to transition it to Running. This action broadcasts the iteration to all participating agents and begins the shift sequence. The agents will progress through the shifts sequentially: Sifting, Pre-Planning, Planning, Executing, Post-Execution, and Sleeping, with each shift advancing only when its predecessor completes or timeout conditions are met.

### Assigning Participants to Shifts

Participant assignment is fluid and visual. Drag an identity disc from the Identity Roster on the right directly into a shift card on the center panel. The participant will be added to that shift with their allocated turn limit. You can drag the same identity into multiple shifts if they should participate across the entire execution pipeline. Use the three-dot menu on any participant disc within a shift to remove them or modify their turn limit—the number of reasoning turns they are allowed during that shift.

### Navigating Shifts

The shift cards are displayed horizontally with only the first few visible by default. Use the arrow button (▷) on the right side of the shift row to scroll and reveal the remaining shifts. This allows you to see the full execution pipeline and understand the complete journey each participant takes through the iteration.

### Monitoring Turn Limits

Each shift displays a turn counter (e.g., "0 / 20") showing how many turns have been consumed out of the maximum allocated for that shift. As agents work through the iteration, this counter increments in real-time via Dendrite updates, allowing you to track resource consumption and adjust constraints if needed.

## Key Concepts

**Temporal Matrix:** The overarching scheduling system that orchestrates multi-agent work cycles. It coordinates iterations, shifts, participants, and turn limits to ensure structured, sequential reasoning and collaboration among identity discs.

**Iteration:** A runtime instance of a work cycle. Each iteration has a lifecycle—it begins in Waiting status (ready to launch), transitions to Running when initiated, and concludes in Finished status once all shifts complete. Iterations are spawned from iteration definitions.

**Iteration Definition:** A reusable blueprint or template that encodes the structure of an iteration, including the shifts to execute and their sequencing. Definitions allow you to standardize orchestration patterns and avoid rebuilding complex workflows.

**Shift:** A sequential execution phase within an iteration. There are six standard shift types that execute in order: Sifting (initial information gathering), Pre-Planning (preparing for work), Planning (strategic coordination), Executing (active reasoning and task execution), Post-Execution (reflection and cleanup), and Sleeping (standby mode). Each shift has its own set of participant allocations and turn limits.

**Participant:** An identity disc that is allocated to execute within a specific shift of an iteration. Participants are drawn from the Identity Roster and linked to shifts via the IterationShiftParticipant relationship.

**Turn Limit:** The maximum number of reasoning turns a participant is allowed during a specific shift. This constraint prevents runaway computation and ensures bounded resource consumption. The turn counter in each shift card shows real-time progress against this limit.

**Sifting:** The first shift, where participants gather and review information, constraints, and context needed for the upcoming work.

**Pre-Planning:** The second shift, where participants prepare strategies, identify risks, and set up the groundwork for detailed planning.

**Planning:** The third shift, where participants develop detailed action plans, allocate resources, and finalize the approach.

**Executing:** The fourth shift, where participants actively reason, perform tasks, and produce the core deliverables of the iteration.

**Post-Execution:** The fifth shift, where participants reflect on outcomes, document results, and identify lessons learned.

**Sleeping:** The sixth shift, where participants enter a standby state, allowing the system to consolidate state or transition to the next iteration phase.

---

![Temporal Lobe](/img/ui/temporal-lobe.png)