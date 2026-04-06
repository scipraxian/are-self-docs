---
id: hippocampus
title: "Hippocampus"
sidebar_position: 8
---

# Hippocampus

The **Hippocampus** is Are-Self's memory system UI — a searchable, semantic knowledge store where you browse, inspect, and manage *engrams* (extracted facts and learned knowledge). This interface lets you understand what your identities have learned and ensure memory quality.

## Overview

The Hippocampus is the hub for memory management. It provides:

- **Search & discovery** across all learned facts
- **Semantic filtering** using vector embeddings
- **Relevance scoring** to prioritize important knowledge
- **Provenance tracking** to see how memories were created
- **Active/Inactive toggling** to manage memory lifecycle

The interface uses a **three-panel layout** for efficient browsing and editing.

---

## Layout & Components

### Left Panel: Filters & Search

The left panel controls how engrams are discovered and filtered.

#### Search Input

- Placeholder text: "Search engrams..."
- Searches across engram names, descriptions, and tags
- Results update in real-time as you type
- Semantic search: The system converts your query to a vector and finds similar engrams using cosine similarity

#### Status Filter Tabs

Three clickable tabs control which engrams appear in the center list:

- **Active** (green, selected by default): Shows only active engrams — those currently available for reasoning
- **All**: Shows all engrams regardless of active status
- **Inactive**: Shows only deactivated engrams (archived memories no longer in use)

#### Tag Filter Chips

When engrams have tags, clickable **tag chips** appear below the status tabs:

- Each chip shows a tag name with a count (e.g., "Domain: AI Research (42)", "Type: Pattern (15)")
- Click a chip to filter engrams by that tag (AND logic: selecting multiple tags narrows results)
- Tags are multi-select; selecting multiple tags shows only engrams with all selected tags
- Clear a tag by clicking it again

#### Result Count

At the bottom of the left panel:

**"Showing X of Y engrams"**

- X = number matching current filters
- Y = total engrams in the system
- Updates as you filter and search

### Center Panel: Engram List

The center panel displays matching engrams in a **card-based layout**.

#### Empty State

When no engrams match filters:

**"No engrams match the current filters."**

#### Engram Card Structure

Each card (when populated) shows:

- **Name** (bold, top-left): Engram identifier (e.g., "Python List Comprehension", "Customer Retention Strategy")
- **Relevance Score** (top-right, badge): Numeric score 0.0–1.0 (e.g., "0.87" in green for high relevance)
- **Active Status Dot** (left edge): Green dot = active, gray dot = inactive
- **Description** (subtitle): Truncated text snippet from the engram description
- **Tags** (below description): Small chips showing tags (e.g., "Skill", "Technical")
- **Creator Disc** (bottom-left): Identity disc that created the memory (e.g., "Alice#1", "ResearchBot#3")
- **Date** (bottom-right): Creation date (e.g., "Apr 5, 2026")

#### Selection & Highlighting

- Click any card to select it
- Selected card highlights (color shift, shadow emphasis)
- Right panel updates to show the selected engram's details

#### Scrolling

- Cards are vertically scrollable for large memory stores
- Smooth scrolling and lazy-loading optimize performance

### Right Panel: Inspector

The right panel shows detailed information and editing controls for the selected engram.

#### Empty State

When no engram is selected:

**"Select an engram to inspect."**

#### Selected Engram Inspector

When an engram is selected, the panel displays:

##### Header: Engram Name

- **Name Editor** (text input): Editable engram title
- Edit inline to rename
- Changes are saved automatically
- Character limit: 255 characters

##### Description

- **Textarea input**: Full description field
- Supports multi-line text
- Placeholder: "Add description..."
- Auto-saves on blur
- Used in semantic vector generation

##### Relevance Score Slider

- **Range**: 0.0 to 1.0
- **Visual**: Horizontal slider with numeric display
- Higher values = more important memories
- Influences Focus Economy budget allocation
- Edit by dragging or clicking the slider

##### Active Toggle

- **Switch/checkbox**: Toggle engram active status
- Active = available for agent reasoning
- Inactive = archived, no longer used
- Toggling does not delete; memories can be reactivated

##### Tag Management

- **Display**: List of assigned tags with remove buttons (X)
- **Add Tags**:
  - Input field: "Add tag..."
  - Type and press Enter or click Add
  - Can create new tags or assign existing ones
  - Multi-select autocomplete shows popular tags
- **Tag Removal**: Click X on any tag to remove it
- Tags are automatically applied to vector generation

##### Provenance Section (Expandable)

Details about how and where the engram was created:

- **Creator Disc**: Which identity created this memory (e.g., "Alice#1")
- **Linked Sessions**: Reasoning sessions that contributed to this engram (clickable to open in Frontal Lobe)
- **Linked Spikes**: Tasks or requests that triggered learning (clickable to open in Spike view)
- **Linked Turns**: Specific reasoning turns where this engram was generated
- **Linked Tasks**: Tasks that use this knowledge (for task-based filtering)

##### Timestamps

- **Created**: When the engram was first saved
- **Last Modified**: When it was last updated
- **Last Used**: When an agent last retrieved this engram for reasoning

##### Delete Button

- **Danger button** (red): Permanently delete the engram
- Requires confirmation
- Cannot be undone
- Engrams can be reactivated before deletion as a safer alternative

---

## Key Concepts

### Engram

An **Engram** is a single extracted memory or fact:

- Represents a discrete piece of learned knowledge
- Contains name, description, and metadata
- Assigned a **768-dimensional vector embedding** for semantic retrieval
- Linked to the identity, session, and spike that created it
- Can be active (in-use) or inactive (archived)

### Vector Embedding

Each engram is embedded into vector space:

- Generated from **name + description + tags** concatenated and passed to an embedding model (Ollama)
- Results in a 768-dimension dense vector
- Allows semantic similarity searches (not just keyword matching)
- Updated when description or tags change

### Cosine Similarity

The metric used to measure memory novelty and semantic distance:

- Values range from -1 to +1, typically 0 to 1 in practice
- 1.0 = identical vectors
- 0.0 = orthogonal (completely unrelated)
- 0.9+ = highly similar engrams
- Used to determine if a new fact is novel or redundant with existing knowledge

### Relevance Score

A 0.0–1.0 numeric score indicating memory importance:

- Set manually in the inspector (slider)
- Influences how heavily the memory weights in retrieval
- Used by the Focus Economy to allocate budget
- High scores = agent earns more budget when saving
- Reflects domain criticality and utility

### Provenance Tracking

Complete lineage of an engram:

- **Creator**: Which identity disc learned this
- **Session**: Reasoning session where it was created
- **Turn**: Specific LLM call that generated it
- **Spike**: User task/request that triggered learning
- **Related Discs/Tasks**: Any other entities linked to the memory
- Provides full audit trail and context

### Focus Economy Integration

Are-Self's budget system ties to engram novelty:

- When an agent saves a new engram, the system checks cosine similarity to existing memories
- **Novelty threshold**: 0.9 (if similarity < 0.9, the engram is considered novel)
- Novel engrams grant execution budget to the identity
- Higher relevance scores = more budget earned
- Inactive engrams don't grant budget

### Active / Inactive Status

Engrams have a lifecycle:

- **Active**: Available for agent retrieval and use in reasoning
- **Inactive**: Archived, no longer in the active memory pool
- Toggling status is reversible (unlike deletion)
- Useful for pruning obsolete knowledge without losing it
- Inactive engrams still consume storage but not computation

---

## Workflow Examples

### Search for Learned Knowledge

1. Navigate to `/hippocampus` to open the memory system
2. In the left panel, type a query into "Search engrams..." (e.g., "customer retention")
3. The center panel filters engrams using semantic similarity
4. Results show cards matching your query semantically (even if keywords don't exactly match)
5. Click a card to read its full description and metadata

### Filter by Tag

1. Open the Hippocampus
2. Leave search blank, or search within a topic
3. Click a tag chip (e.g., "Technical") to filter by that tag
4. The center panel narrows to only engrams with that tag
5. Click additional tags to apply AND filtering (all tags must be present)
6. Remove a tag by clicking it again

### Review & Adjust Relevance Scores

1. Search or filter to find relevant engrams
2. Click an engram card to open the inspector
3. Review the current **Relevance Score** slider value
4. Adjust the slider if the importance assessment was incorrect
5. Leave the panel and the change saves automatically
6. High-relevance engrams contribute more to budget allocation

### Investigate Engram Provenance

1. Click an engram in the center list
2. In the right panel, locate the **Provenance** section
3. Expand the section to view:
   - Creator disc name and avatar
   - Linked sessions (click to jump to Frontal Lobe)
   - Linked spikes (click to view the task)
   - Specific turns where this was learned
4. This shows you exactly when and how this knowledge was created

### Archive Obsolete Memories

1. Search or filter to find outdated engrams (e.g., "Old API Version")
2. Click an engram to select it
3. In the right panel, toggle **Active** to OFF
4. The engram becomes inactive and no longer available to agents
5. The card in the center list updates (status dot becomes gray)
6. If you need it later, toggle it back to active
7. Alternative: Click **Delete** if you never need it again

### Create or Manage Tags

1. Click an engram to open the inspector
2. In the **Tag Management** section, type a new tag in "Add tag..."
3. Press Enter or click Add
4. The tag appears as a chip in the inspector and on the card
5. Tags are created on-the-fly or selected from popular existing tags
6. Remove a tag by clicking its X button
7. Tags are searchable via filter chips

### Monitor Memory Growth

1. Open the Hippocampus
2. Check the **Result Count** at the bottom of the left panel
3. "Showing X of Y engrams" shows total memory store size
4. Filter by status (Active vs. All) to see active knowledge vs. archived
5. Use tag filters to understand knowledge distribution (e.g., "Skill" = 45 engrams, "Domain" = 23 engrams)
6. This helps you assess learning productivity and focus areas

---

## Technical Notes

- Vector embeddings are 768 dimensions (generated via Ollama embedding model)
- Cosine similarity threshold for novelty detection is 0.9 (hardcoded)
- Semantic search is performed server-side for scalability
- Engrams are immutable once created; modifications update metadata but preserve creation timestamp
- Inactive engrams are excluded from vector similarity searches (performance optimization)
- Tag filters use AND logic; OR logic is not yet supported
- Pagination: Large memory stores load in pages (50 engrams per page by default)

---

## See Also

- [Frontal Lobe](../ui/frontal-lobe.md) — Reasoning sessions that create engrams
- [Hypothalamus](../ui/hypothalamus.md) — Budget configuration and Focus Economy
- [Identity Discs](./identity) — Manage identities that learn
- [Spikes](./cns-monitor) — Tasks that trigger learning