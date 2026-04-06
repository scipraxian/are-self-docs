---
id: identity
title: "Identity Ledger"
sidebar_position: 2
---

# Identity Ledger

The Identity Ledger is where you manage AI personas — both base templates (Identities) and their active instances (Identity Discs). An Identity is the immutable archetype that defines a persona's core characteristics, while an Identity Disc is a live, stateful instantiation of that archetype that earns experience, accumulates memories, and adapts through interaction. Think of Identities as blueprints and Discs as the running instances that evolve over time.

## Getting There

Navigate to **Identity** from the main menu, or visit `/identity` directly. You'll land on the Identity Roster dashboard where all your Identities and active Discs are visible.

## Identity Roster Dashboard

![Identity Roster](/img/ui/identity-roster.png)

The Identity Ledger uses a three-panel layout to organize personas and their operational data.

**Left panel — Identity Roster** is your control hub. A prominent **+ CREATE IDENTITY** button spans the full width at the top, allowing you to mint new base Identities. Below that, the roster is split into two sections. The **ACTIVE DISCS** section lists all currently-running disc instances. Each disc shows its name (e.g., "Jessica [Program] [Lvl 1]"), a green status dot indicating it is online and ready, a gear icon for accessing its settings, and an XP count below its name showing accumulated experience. A drag handle (six dots) on the left of each item lets you reorder both sections. The **BASE IDENTITIES** section lists every Identity template you've created (e.g., "Jessica", "Steve", "Thalamus"), each with a star icon for marking favorites. These base templates are read-only definitions that serve as factories for spawning new Discs; they do not accumulate state or experience themselves.

**Center panel** displays a placeholder message — "Select an identity from the roster to view synaptic data." — when no Identity or Disc is selected. Clicking any item in the roster populates this panel with detailed information.

**Right panel** remains empty during roster view but activates when you drill into an Identity or Disc to show inspection and editing controls.

The breadcrumb at the top reads `ARE-SELF > Identity Ledger`, anchoring your location in the system.

## Viewing a Base Identity

Clicking a base Identity template in the roster (such as "Jessica") shows its core definition in the center panel. The header displays the Identity name in all caps along with its Neural ID (a UUID), and indicates that it is a base template. Base Identities are archetypes — they are not mutable through the UI and serve only as starting points for creating new Discs. If you need to modify the underlying persona definition, you would typically do so through the system configuration or by creating a new Identity with different parameters.

## Inspecting an Identity Disc

Clicking an active Disc in the roster (such as "Jessica [Program] [Lvl 1]") opens its detail view. The header prominently displays the disc name (e.g., "JESSICA [PROGRAM]") along with its Neural ID, Type (e.g., "DISC [PM]" where PM indicates Persona Manager), and associated model information. An **EDIT MODE** button with a gear icon appears in the top-right, allowing you to modify the disc's configuration.

### Telemetry Tab

The **TELEMETRY** tab displays real-time metrics about the disc's operational state and performance. This is your window into how well the disc is functioning and how much experience it has accumulated.

The **ACTIVE DISC TELEMETRY** section presents three key stat cards. **EXPERIENCE LEVEL** shows the disc's current level (e.g., "Lvl 1") and total experience points earned (e.g., "0 XP"). As the disc completes tasks and interactions, this counter increments. The **STATUS** card indicates whether the disc is online and ready for deployment (shown in green) or offline. The **EXPERIENCE RECORD** card breaks down the disc's track record as a series: Successes, Failures, and Time Elapsed. For a freshly-spawned disc, all counters read zero; mature discs show their cumulative history.

Below the telemetry stats, the **SYSTEM PROMPT FORMULATION** section displays the configured system prompt that defines the disc's persona behavior, or notes "No system prompt configured." if one has not been assigned. This is the text that sets the disc's tone, role, and operational guidelines.

The **COMPILED NEURAL PROMPT (TURN 1)** section shows the assembled prompt that the disc actually receives when engaged. This is the result of combining the base system prompt with context, memories, and any neural addons. For a new disc, you might see something like "Identity Disc: Jessica [Program]" as the assembled prompt basis.

### Loadout Tab

The **LOADOUT** tab is where you configure the disc's tooling, model routing, and behavioral addons — everything that governs what the disc can do and how it reasons.

The **CORE IDENTITY** section displays the disc's immutable foundation. Its **Callsign** is the nickname or identifier used when referencing the disc in logs and UI (e.g., "Jessica"). The **Hypothalamus Route** shows which LLM model or reasoning engine the disc uses. A refresh icon next to it lets you cycle through available models without editing other settings. The **Model Selection Filter** narrows which models are compatible with the disc's profile (e.g., "Local Coder" might restrict the disc to models optimized for code generation). **Budget Allocation** indicates the resource quota assigned to the disc — this controls how much computational overhead the disc can consume during reasoning and inference.

A **MODEL ROUTING CONFIGURATION** section with a gear icon provides access to fine-tune which specific models route to the disc under different conditions, allowing load-balancing or model specialization based on task type.

The **ENABLED TOOLS** section displays all MCP (Model Context Protocol) tools available to the disc as teal-colored chips. These are the concrete capabilities the disc can invoke — `mcp_inspect_record`, `mcp_read_record_field`, `mcp_search_record_field`, `mcp_query_model`, `mcp_engram_search`, `mcp_engram_save`, `mcp_done`, `mcp_engram_read`, `mcp_engram_update`, `mcp_internet_query`, `mcp_browser_read`, `mcp_pass`, `mcp_ticket`, `mcp_fs`, and `mcp_git`. Each tool grants the disc a specific capability, such as querying records, managing memory engrams, running searches, or executing file system and git operations. A gear icon next to the tools section opens a manager where you can enable or disable tools on a per-disc basis, tailoring the disc's capabilities to its intended role.

Below that, the **NEURAL ADDONS** section (if populated) shows any behavioral enhancements or specialized modules that modify how the disc thinks or acts. Addons can inject instructions at different phases of prompt assembly — Identify (initial persona setup), Context (background knowledge), History (past interactions), and Terminal (final reasoning stage) — giving you granular control over the disc's behavior without rewriting its core system prompt.

## Creating a New Identity Disc

To spawn a new disc from an existing Identity template, click **+ CREATE IDENTITY** at the top of the left panel. This opens a creation workflow where you select a base Identity (e.g., "Jessica"), assign it a Callsign, choose its model routing, select its type (PM or Worker), and configure its initial loadout of tools and addons. Once created, the new disc appears in the **ACTIVE DISCS** section and is immediately ready for use.

## Editing a Disc's Configuration

Click the gear icon next to any active Disc in the roster, or click the **EDIT MODE** button in a disc's detail view, to enter edit mode. In edit mode, you can modify the disc's system prompt, adjust its neural addons, enable or disable tools, change its model routing, and tweak its budget allocation. Changes are typically persisted immediately upon save, and the disc's behavior adapts to reflect the new configuration on its next invocation.

## Key Concepts

**Identity**: An immutable base template that defines the core persona — a blueprint for creating instantiated Discs. Identities are read-only and do not accumulate experience or state.

**Identity Disc**: A live, stateful instance of an Identity. Each Disc earns experience points (XP), accumulates memories, and can be configured with different tools and addons. Discs have types (e.g., PM for Persona Manager, Worker for task execution) and can be online or offline.

**Callsign**: The nickname or short identifier for a Disc, used in logs and UI references to distinguish it from other Discs spawned from the same Identity template.

**Loadout**: The collection of tools, model routing, addons, and budget constraints that define what a Disc can do and how it reasons. The loadout is mutable and can be adjusted without recreating the Disc.

**Neural Addon**: A behavioral module that modifies how a Disc thinks or acts by injecting instructions at specific phases of prompt assembly (Identify, Context, History, Terminal). Addons allow fine-grained customization of Disc behavior.

**Enabled Tools**: MCP tools that grant a Disc specific capabilities, such as record inspection, memory search, internet queries, or file system operations. Tools can be individually enabled or disabled per Disc to scope its permissions.

**Hypothalamus Route**: The LLM model or reasoning engine assigned to a Disc. The route determines which model processes the Disc's inferences and reasoning tasks, allowing you to route different Discs to different models based on capability or load.

**Experience Level**: A numeric measure of a Disc's maturity and usage. Discs earn XP through successful interactions; the level increments at certain thresholds, and the experience record tracks successes, failures, and elapsed time.

**Focus Economy**: The resource-allocation framework that governs computational overhead per Disc. Budget allocation constrains how much reasoning and inference a Disc can consume, enforcing efficiency and cost control across your system.