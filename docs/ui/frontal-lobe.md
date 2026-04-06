---
id: frontal-lobe
title: "Frontal Lobe"
sidebar_position: 7
---

# Frontal Lobe

The **Frontal Lobe** is Are-Self's reasoning engine UI — where you view, inspect, and manage AI reasoning sessions, also called *cognitive threads*. This interface lets you observe how your identities think through problems, visualize reasoning networks, and intervene when needed.

## Overview

The Frontal Lobe operates in two modes:

1. **Index View** (`/frontal`) — Browse all active reasoning sessions
2. **Session Detail View** (`/frontal/:sessionId`) — Deep-dive into a specific session's reasoning process

Both modes use a **three-panel layout** for efficient navigation and inspection.

---

## Index View

When you first navigate to `/frontal`, you enter the session browsing interface.

### Left Panel: Cognitive Threads

The **Cognitive Threads** list displays all reasoning sessions in your system, organized by most recent:

- **Session ID**: Unique identifier (e.g., "4F81BAF9", "763E69A3", "C21AFCCE")
- **Status Badge**: Current session state (e.g., "Maxed Out" in purple)
- **Timestamp**: When the session started (e.g., "4/5/2026, 5:24:14 PM")
- **Scrollable**: Sessions are vertically scrollable for large session counts

Each session is selectable and serves as your entry point to detailed inspection.

### Center Panel: Empty State

Until you select a session, the center panel displays:

**"Select a Cognitive Thread to engage the Cortex."**

This placeholder indicates you need to choose a session from the left panel to continue.

### Right Panel: Telemetry Placeholder

The right panel shows:

**"Cortical Telemetry — select a node for details."**

This placeholder informs you that telemetry details will appear once you navigate to a session detail view.

---

## Session Detail View

![Frontal Lobe — Session Detail with Graph, Chat, and Parietal tabs](/img/ui/frontal-lobe-session.png)

When you click a session from the list, the interface transitions to detailed inspection at `/frontal/:sessionId`.

### Left Panel: Highlighted Session Selection

The **Cognitive Threads** list remains visible, but now shows the selected session **highlighted**, allowing you to switch between sessions without navigation.

### Center Panel: Three Mode Tabs

Below the session ID, three tabs let you view the reasoning process from different perspectives:

#### Tab 1: GRAPH (Network Icon)

Shows a **3D neural network visualization** of the reasoning process using the `ReasoningGraph3D` component.

- Each node represents a reasoning turn (LLM call within the session)
- Edges connect related reasoning steps
- Hover over nodes to see turn summaries
- Click nodes to select them (telemetry appears in right panel)
- Provides intuitive understanding of reasoning flow and dependencies

#### Tab 2: CHAT (Message Icon)

Displays a **conversation interface** (`SessionChat` component) where you can:

- View the full conversation history
- See turns labeled with input/output tokens
- Review tool calls and their results
- Monitor real-time reasoning as it happens (if session is active)
- Inspect prompt/response pairs in detail

#### Tab 3: PARIETAL (Arrow Icon)

Reveals **execution telemetry** from the Parietal Lobe:

- Detailed metrics on tool execution
- Function call arguments and return values
- Performance timings for each operation
- Error logs and validation results
- Provides diagnostic insight for debugging agent behavior

### Status Badge & Stats Row

Below the tabs, a compact row displays:

- **Status Badge**: e.g., "MAXED OUT" (purple), "ACTIVE" (green), "COMPLETED" (blue)
- **Level**: "LVL 1" (agent/identity tier)
- **Focus**: "FOCUS 10/10" (current execution budget)
- **Experience**: "XP 0" (session points earned)

### Center Panel Bottom: Action Buttons

Three action buttons allow direct intervention:

- **MANUAL OVERRIDE** (chat icon, teal): Pause the session and inject a manual message or redirect reasoning
- **REBOOT CORTEX** (refresh icon, red): Force-restart the reasoning engine and clear the current execution path
- **DUMP DATA** (download icon, teal): Export the full session record, including all turns, prompts, tokens, and conclusions as a JSON file

### Right Panel: SESSION OVERVIEW

Comprehensive session metadata and insights:

#### Header

- **Session ID**: Display with copy button (e.g., "4F81BAF9")
- **Status Badge**: Inline status indicator matching the center panel badge

#### Stats Section

- **TURNS**: Total number of LLM calls in this session (e.g., "1")
- **TOTAL DURATION**: Elapsed time in seconds (e.g., "0.00s")
- **Started**: Human-readable timestamp of session creation

#### Expandable Sections

Each section is collapsible/expandable with a colored left border:

##### CONCLUSION SUMMARY (Green Border)

Displays the reasoning conclusion or summary:

- If available: The final reasoning result or answer derived from the cognitive process
- If unavailable: "No summary available" placeholder
- Useful for quickly understanding session outcomes

##### PARIETAL LOBE ACTIONS (Purple Border)

Lists all tool invocations within the session:

- Tool name and arguments
- Validation status (passed/failed)
- Execution duration
- Return value or error
- Helps verify tool execution integrity

##### ENGRAMS (Green Border)

Shows memories created during this session:

- Engram name and relevance score
- Tags applied to the memory
- Creation timestamp
- Links to engrams added to long-term memory
- Part of the Focus Economy system

##### TOKEN BUDGET (Amber/Yellow Border)

Detailed token consumption:

- **INPUT TOKENS**: Count of tokens consumed from prompts
- **OUTPUT TOKENS**: Count of tokens generated in responses
- **TOTAL TOKENS**: Sum of input + output
- **Budget Remaining**: Tokens available before hitting session limit
- Visualized as a progress bar for quick assessment

---

## Key Concepts

### Cognitive Thread (Reasoning Session)

A **Cognitive Thread** is a single, continuous reasoning process tied to an IdentityDisc and a Spike (task/request). It contains one or more ReasoningTurns and produces a conclusion.

### Reasoning Session

A structured record containing:

- IdentityDisc reference (which agent is reasoning)
- Spike reference (what problem to solve)
- Array of ReasoningTurns
- Conclusion and metadata
- Token budget consumption
- Status and timestamps

### Reasoning Turn

An individual **LLM API call** within a session:

- Includes prompt, completion, tokens
- May invoke tools via Parietal Lobe
- Can succeed, fail, or require retry
- Contributes to overall reasoning chain

### Statuses

Sessions can be in one of several states:

| Status | Meaning |
|--------|---------|
| **Pending** | Queued but not yet started |
| **Active** | Currently executing |
| **Paused** | Manually stopped, awaiting intervention |
| **Completed** | Finished successfully |
| **Maxed Out** | Reached turn or token limit |
| **Error** | Encountered an unrecoverable error |
| **Attention Required** | Needs manual review or intervention |
| **Stopped** | User-initiated termination |

### Maxed Out

When a session status shows "Maxed Out," it means the session has exhausted its allocated turns or tokens and cannot continue reasoning. The identity may retry with a fresh session, or you may manually override with new instructions.

### Focus Economy

Are-Self uses a **Focus Economy** to manage agent execution budget:

- Agents earn execution budget by **saving novel engrams** (memories with significant new knowledge)
- Novel engrams are those with less than 90% cosine similarity to existing memories
- Higher relevance scores grant more budget
- Reasoning sessions that contribute unique insights get extended execution time
- This incentivizes efficient, knowledge-creating reasoning over token-burning loops

### Graph View

The **Graph View** visualizes the reasoning network in 3D:

- Nodes = reasoning turns
- Edges = logical dependencies
- Node size/color = turn complexity or duration
- Interactive exploration reveals patterns in reasoning chains

### Manual Override

Manually inject a new instruction or constraint into a paused session without restarting:

- Redirects the reasoning process
- Useful for correcting off-track reasoning
- Preserves context and prior turns
- Counts as a new turn in the reasoning chain

### Cortical Telemetry

Detailed metrics from tool execution and LLM behavior:

- Extracted from the Parietal Lobe (execution layer)
- Includes timing, arguments, validation results
- Essential for debugging agent behavior
- Displayed per-node in graph and per-turn in chat views

---

## Workflow Examples

### Inspect a Completed Reasoning Session

1. Navigate to `/frontal` to view the session list
2. Click on a session (e.g., "4F81BAF9") to open its detail view
3. The **GRAPH** tab appears by default — review the reasoning network
4. Click any node to see its telemetry in the right panel
5. Switch to **CHAT** to read the full conversation
6. Check the **TOKEN BUDGET** section to see token usage
7. Review **CONCLUSION SUMMARY** to understand the outcome

### Monitor an Active Session

1. Open a session that is currently executing (status: "ACTIVE")
2. The **CHAT** tab updates in real-time as new turns arrive
3. Watch the **FOCUS** stat update as the session consumes budget
4. If reasoning diverges, click **MANUAL OVERRIDE** to inject a correction
5. Return to the **GRAPH** tab to see the updated network

### Handle a Maxed Out Session

1. Open a session with status "Maxed Out"
2. Review **CONCLUSION SUMMARY** and **ENGRAMS** to assess progress
3. If incomplete, click **MANUAL OVERRIDE** to extend with new instructions
4. Alternatively, click **REBOOT CORTEX** to restart reasoning from scratch
5. Export data with **DUMP DATA** before rebooting if you want a record

### Debug Tool Execution

1. Open the problematic session
2. Switch to the **PARIETAL** tab to see tool telemetry
3. Locate failed tool calls in the **PARIETAL LOBE ACTIONS** section (right panel)
4. Check argument values and error messages
5. Use **MANUAL OVERRIDE** if a retry is needed, or rethink the Parietal Lobe tool definitions

---

## Technical Notes

- Sessions are persisted in the Are-Self database and survive server restarts
- Token budgets are hard limits; sessions cannot exceed them without manual override
- The 3D graph may lag with very large sessions (100+ turns); use the CHAT tab for large sessions
- Engram novelty is determined via cosine similarity; check the Hippocampus UI for embedding details
- Focus Economy budgets reset per identity per period; see Hypothalamus for budget configuration

---

## See Also

- [Parietal Lobe](../brain-regions/parietal-lobe) — Tool execution and validation
- [Hippocampus](../ui/hippocampus.md) — Memory system and engrams
- [Hypothalamus](../ui/hypothalamus.md) — Model routing and budgets
- [Identity Discs](./identity) — Agent configuration