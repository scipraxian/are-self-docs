---
id: prefrontal-cortex
title: "Prefrontal Cortex — Planning"
description: "Epics, stories, tasks, Definition of Ready, and work organization"
slug: /brain-regions/prefrontal-cortex
---

# Prefrontal Cortex — Planning

## What It Does

The Prefrontal Cortex is project management. Work is organized as a hierarchy: **Epics** (large initiatives) → **Stories** (features) → **Tasks** (concrete work units). Each level can have status tracking, comments, full-detail views, and assignees (IdentityDiscs). Tasks are scoped to shifts, so worker identities pick them up during the Executing shift. The **Definition of Ready** ensures tasks meet quality standards before execution.

## Biological Analogy

The prefrontal cortex in neuroscience handles **goal-directed behavior**, **planning**, and **hierarchical decision-making**. Are-Self's Prefrontal Cortex similarly manages **goal hierarchies** (Epic → Story → Task) and ensures **readiness** before execution. Just as you mentally decompose a large goal into steps before acting, the Prefrontal Cortex structures work hierarchically.

## Key Concepts

- **Epic**: A large strategic initiative. Usually assigned to a PM identity.
- **Story**: A user-facing feature or capability. Maps to one or more tasks.
- **Task**: Concrete work unit with clear success criteria. Assigned to worker identities, scoped to shifts.
- **Definition of Ready**: Criteria that a task must meet before it's available for execution (e.g., "has acceptance criteria", "assigned to identity disc").
- **Status Tracking**: Epic/story/task status (open, in-progress, blocked, done, etc.).

## API Endpoints

### Epics

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v2/pfc-epics/` | List epics (lightweight) |
| `POST` | `/api/v2/pfc-epics/` | Create epic |
| `GET` | `/api/v2/pfc-epics/{id}/` | Retrieve epic (lightweight) |
| `GET` | `/api/v2/pfc-epics/{id}/full/` | Retrieve epic (full details) |
| `PATCH` | `/api/v2/pfc-epics/{id}/` | Update epic |
| `DELETE` | `/api/v2/pfc-epics/{id}/` | Delete epic |

### Stories

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v2/pfc-stories/` | List stories (lightweight) |
| `POST` | `/api/v2/pfc-stories/` | Create story |
| `GET` | `/api/v2/pfc-stories/{id}/` | Retrieve story (lightweight) |
| `GET` | `/api/v2/pfc-stories/{id}/full/` | Retrieve story (full details) |
| `PATCH` | `/api/v2/pfc-stories/{id}/` | Update story |
| `DELETE` | `/api/v2/pfc-stories/{id}/` | Delete story |

### Tasks

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v2/pfc-tasks/` | List tasks (lightweight) |
| `POST` | `/api/v2/pfc-tasks/` | Create task |
| `GET` | `/api/v2/pfc-tasks/{id}/` | Retrieve task (lightweight) |
| `GET` | `/api/v2/pfc-tasks/{id}/full/` | Retrieve task (full details) |
| `PATCH` | `/api/v2/pfc-tasks/{id}/` | Update task |
| `DELETE` | `/api/v2/pfc-tasks/{id}/` | Delete task |

## How It Connects

- **Temporal Lobe**: Tasks are scoped to shifts. During the Executing shift, worker identities query the Prefrontal Cortex for tasks in "ready" status.
- **Identity**: Epics and tasks are assigned to IdentityDiscs.
- **Frontal Lobe**: When a reasoning session starts in a worker context, it fetches assigned tasks from the Prefrontal Cortex to populate the reasoning goal.
- **Central Nervous System**: Task state changes can trigger spike trains.
