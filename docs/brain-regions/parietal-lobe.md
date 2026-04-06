---
id: parietal-lobe
title: "Parietal Lobe — Tools"
description: "Tool definitions, ParietalMCP gateway, hallucination armor, and tool types"
slug: /brain-regions/parietal-lobe
---

# Parietal Lobe — Tools

## What It Does

The Parietal Lobe is the system's hands—it executes tools on behalf of the Frontal Lobe. Tool definitions live in the database as `ToolDefinition` records with typed parameters. When the LLM calls a tool, the **ParietalMCP gateway** dynamically imports and executes the matching Python function from the `parietal_lobe/mcp_*.py` module. Each function receives `session_id` and `turn_id` automatically injected by the gateway.

The gateway includes **hallucination armor**—validation that the tool name exists, parameters match their declared types, and required fields are present. LLMs hallucinate tool calls frequently; the Parietal Lobe catches these errors and returns feedback.

## Biological Analogy

The parietal lobe in neuroscience integrates **sensory and motor information**—it's involved in **coordinated movement and tool use**. Are-Self's Parietal Lobe similarly handles **tool invocation**—the motor commands that let the system act on the world. Just as your brain validates that your hand can reach an object before you reach, the Parietal Lobe validates that a tool exists and has the right parameters before executing it.

## Key Concepts

- **Tool Definition**: A database record defining a tool name, description, typed parameters, and return type.
- **ParietalMCP Gateway**: The validation and dispatch layer. Checks tool existence, parameter types, required fields, then calls the Python handler.
- **Hallucination Armor**: Validation layer catching LLM errors (wrong tool name, missing required params, type mismatch).
- **Tool Handler**: Python functions in `parietal_lobe/mcp_*.py` that implement actual tool logic.
- **Built-in Tools**: `mcp_respond_to_user`, `mcp_done`, `mcp_engram_save/read/search/update`.

## API Endpoints

### Tool Definitions

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v2/tool-definitions/` | List tool definitions |
| `POST` | `/api/v2/tool-definitions/` | Create tool |
| `GET` | `/api/v2/tool-definitions/{id}/` | Retrieve tool definition |
| `PATCH` | `/api/v2/tool-definitions/{id}/` | Update tool |
| `DELETE` | `/api/v2/tool-definitions/{id}/` | Delete tool |
| `GET` | `/api/v2/tool-parameters/` | List tool parameters |
| `POST` | `/api/v2/tool-parameters/` | Create parameter |
| `PATCH` | `/api/v2/tool-parameters/{id}/` | Update parameter |

### Tool Calls & Execution

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/v2/tool-calls/` | List all tool calls (audit trail) |
| `POST` | `/api/v2/tool-calls/` | Record tool call |
| `GET` | `/api/v2/tool-calls/{id}/` | Retrieve tool call details |

## How It Connects

- **Frontal Lobe**: When the LLM outputs a tool call, the reasoning loop sends it to the Parietal Lobe. The gateway validates, executes, and returns the result to the loop.
- **Hippocampus**: The `mcp_engram_save/read/search/update` tools are Parietal Lobe handlers that call the Hippocampus.
- **Central Nervous System**: Tool execution is a side effect of spike execution. Failures trigger Cortisol signals.
- **Identity**: Identities bind to specific tools. The ParietalMCP gateway checks the IdentityDisc's tool permissions before executing.
- **Synaptic Cleft**: Tool success/failure fires Dopamine or Cortisol respectively.
