---
id: prefrontal-cortex
title: "Prefrontal Cortex"
sidebar_position: 4
---

# Prefrontal Cortex

The Prefrontal Cortex (PFC) is Are-Self's project management hub — a dynamic kanban board for organizing and tracking the entire hierarchy of work, from high-level strategic epics down through tactical stories and concrete tasks. It's where execution planning happens: you can filter, prioritize, assign, and drag cards between status columns to move work through your pipeline.

## Getting There

Navigate to **Prefrontal Cortex** from the main menu, or visit `/pfc` directly. You'll land on the kanban board view with filter controls at the top.

## Filter Bar

![Filter Bar at the Top of the PFC](/img/ui/prefrontal-cortex.png)

The filter bar sits prominently across the top of the page and gives you precise control over what you see on the board.

**View Toggle** (left side) switches between two layouts: **BOARD** (grid/kanban icon, active by default) shows a horizontal scrollable kanban with status columns, and **BACKLOG** (list icon) shows a flat list view. Use Board view for drag-and-drop workflow management; switch to Backlog when you need to review everything in a linear list.

**Filter Dropdowns** (center-right) narrow the board by four dimensions: **All Statuses** ✓, **All Priorities** ✓, **All Epics** ✓, and **All Assignees** ✓. Each dropdown is a toggle-select menu — click to expand, check or uncheck items, and the board re-filters in real-time. A checkmark indicates the filter is active. For example, selecting only "P1" under Priorities shows only high-priority work; selecting "FEATURE" under Epics shows only tasks belonging to that epic.

The filter state is reflected in the URL as query parameters (`?status=Z&priority=P&epic=Y&assignee=A`), so you can share filtered views with teammates.

## Board View (Kanban)

The main canvas is a horizontally scrollable kanban board with eight status columns. Each column represents a phase in your workflow and displays a count badge showing how many cards are in that status.

**Columns** (left to right):
- **NEEDS REFINEMENT** — New items pending clarification or specification. Cards here are rough drafts awaiting acceptance criteria or details.
- **BACKLOG** — Refined items that are ready but not yet selected for work. The team's inventory of approved work waiting for capacity.
- **SELECTED FOR DEVELOPMENT** — Work items pulled into the current sprint or milestone. Cards here are committed and have assignees.
- **IN PROGRESS** — Work actively being executed. Cards are assigned and visible progress is being made.
- **IN REVIEW** — Completed work awaiting feedback, testing, or approval before moving to Done.
- **BLOCKED BY USER** — Work paused due to external dependencies, decisions, or waiting on input. The card includes a reason and what's needed to unblock.
- **DONE** — Completed and approved work. Historical record of what's been shipped.
- **WILL NOT DO** — Items explicitly rejected or de-prioritized. Archived decisions to avoid re-discussing the same work.

A right arrow (▷) at the far right edge indicates additional columns are available — scroll horizontally to see them all.

## Card Design and Hierarchy

Each card represents a work item in the PFC hierarchy: Epic, Story, or Task. The card layout is consistent across all columns.

**Card Header** shows a colored type badge — **[EPIC]** (broadest scope), **[STORY]** (mid-level), or **[TASK]** (concrete unit). The color coding makes hierarchy instantly recognizable at a glance.

**Card Title** is the name of the work item. Titles are concise and capture the essence of the work — e.g., "Design User Interface", "Develop Backend Logic", "Integrate Payment Processing".

**Priority Indicator** (right side of card) uses stacked chevrons: one chevron = P4 (low), two = P3, three = P2, four = P1 (critical). Chevrons are color-coded (red for P1, amber for P2/P3, muted for P4), so you spot urgent work instantly.

**Assignee Badge** displays the person or IdentityDisc responsible for the work. If unassigned, it shows "Unassigned" with a neutral icon. Hover over an assignee badge to see their full name or details.

**Drag-and-Drop**: Cards are fully draggable. Click and hold a card, then drag it left or right to move it to another status column. Drop to instantly update the item's status. The system saves the change immediately via the Dendrite event stream.

**Click to Select**: Click any card to open the **PFC Inspector** (right panel) and edit full details.

## Example: The Current Sprint

The screenshot shows a board in active use during sprint planning. The **SELECTED FOR DEVELOPMENT** column (second column from the left) has two stories: "Design User Interface" and "Develop Backend Logic", both currently unassigned. You might click on "Design User Interface" to open the inspector and assign it to a team member, or drag it to **IN PROGRESS** once work begins.

## PFC Inspector (Right Panel)

When you click a card, the right panel opens showing the **PFC Inspector** — a full-featured item editor.

**Status Control** at the top mirrors the kanban columns. You can click a status to move the item without dragging, which is helpful on small screens or for quick bulk operations.

**Priority Selector** lets you set P1 through P4. Click to toggle or cycle through priorities.

**Assignee Dropdown** shows available team members and IdentityDiscs. Select one to assign ownership. Clear the selection to mark unassigned.

**Expandable Details** below those controls include:
- Description / Acceptance Criteria
- Comments thread
- Links to parent epic or child tasks
- Estimated effort (if applicable)
- Metadata tags or labels

**Real-Time Updates**: Changes made in the inspector are saved immediately and broadcast to other users via Dendrite events (PFCEpic, PFCStory, PFCTask).

## Backlog View

Toggle to **Backlog** view to see items as a flat, sortable list instead of kanban columns. This view is useful for:
- Bulk re-prioritization
- Sprint planning when you want to compare all items side-by-side
- Exporting or reporting on the full backlog
- Deep work-in-progress analysis without the kanban layout

The backlog respects all active filters (status, priority, epic, assignee), so you can, for example, filter to "P1 + Unassigned" to see critical work that needs owners.

## The Three-Tier Hierarchy

Understanding the hierarchy is key to using PFC effectively.

**Epics** are high-level strategic directives — the "what we're building" or "what capability we're enabling". Examples: "Authentication System", "Mobile App Launch", "Data Warehouse Migration". Epics typically span weeks or months and aren't done until all their child stories are complete.

**Stories** are strategies or use cases under an epic — the "how we'll deliver it". A story is a concrete capability from the user's or system's perspective. Example: "Allow users to sign up with email", "Support offline mode on mobile", "Replicate schema to warehouse". Stories are typically done in 1–3 sprints.

**Tasks** are tactics or implementation units under a story — the actual "what gets built". Tasks are often auto-generated by AI (see Frontal Lobe reasoning), and they're the most granular. Example: "Write OAuth provider integration", "Build React Native offline sync module", "Set up Postgres replication". Tasks usually fit in a single sprint and can be tracked to completion by one person.

**Filtering by Epic**: Use the "All Epics" dropdown to filter the board to a single epic, seeing only its child stories and tasks. This focuses your view on one workstream.

## Creating and Editing Items

You can create new items directly in the PFC via the dashboard (not shown in the kanban view) or by right-clicking a column header. When you create an item, you specify:
- **Type** (Epic, Story, Task)
- **Title**
- **Parent** (if it's a Story under an Epic, or a Task under a Story)
- **Status** (defaults to "NEEDS REFINEMENT")
- **Priority** (defaults to P3)
- **Assignee** (optional)

Once created, the item appears in its status column, and you can drag it, edit it, or delete it like any card.

## Real-Time Collaboration

The PFC is powered by Dendrite, Are-Self's real-time event system. When any team member moves a card, changes a priority, or assigns work, the board updates live for everyone else. You might see a card slide from "IN PROGRESS" to "IN REVIEW" while you're looking at the board — that's another user moving it. Simultaneous edits in the inspector are also synchronized, so conflicting changes are handled gracefully.

## URL-Driven State

The PFC board state is encoded in the URL. For example:
```
/pfc?selected=story-42&epic=FEATURE&status=IN_PROGRESS&priority=P1&assignee=alice
```

This URL pre-filters the board to show only P1 items in the epic "FEATURE" that are "IN PROGRESS" and assigned to Alice, and pre-selects the inspector on story-42. You can bookmark or share these URLs for quick team check-ins ("Here's today's P1 in-progress work").

## Key Concepts

**Prefrontal Cortex (PFC)**: Are-Self's project and task management interface. Combines kanban-style workflow visualization with a hierarchical task taxonomy, enabling both strategic planning and tactical execution tracking.

**Epic**: The top level of the hierarchy. A large, strategic initiative or feature area. Epics take weeks or months to complete and contain multiple stories.

**Story**: The middle level. A cohesive piece of user-facing or system-facing functionality that delivers value. Stories belong to an epic and contain tasks.

**Task**: The bottom level. A concrete unit of work, often AI-generated, that represents a specific implementation or testing action. Tasks belong to a story and are typically completed by one person in one sprint.

**Board View**: The default kanban layout showing eight status columns and draggable cards. Ideal for workflow visualization and status updates.

**Backlog View**: An alternative flat-list layout showing all items in a sortable table. Useful for planning, bulk operations, and detailed analysis.

**Status Column**: One of eight phases a work item moves through: Needs Refinement, Backlog, Selected for Development, In Progress, In Review, Blocked by User, Done, Will Not Do.

**Priority**: A P1–P4 scale indicating urgency or importance. P1 is highest priority; P4 is lowest. Displayed as stacked chevrons on cards.

**Assignee**: The person or IdentityDisc responsible for executing a work item. An item can be assigned to one owner, or left unassigned.

**Inspector**: The right-side detail panel that opens when you click a card. Allows editing of status, priority, assignee, description, comments, and other metadata.

**Drag-and-Drop**: Moving a card from one status column to another, instantly updating the item's status in the system.

**Dendrite Events**: Real-time synchronization layer. The PFC listens to PFCEpic, PFCStory, and PFCTask events and updates the board in real-time when other users make changes.