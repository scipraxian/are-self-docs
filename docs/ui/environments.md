---
id: environments
title: "Environments"
sidebar_position: 10
---

# Environments

The Environments page manages **workspace contexts** — project configurations that scope which tools, variables, and settings are active in your Are-Self workspace. Each environment represents a distinct execution context, such as a game project, a Python script environment, or a web development setup.

![Environments UI](/img/ui/environments.png)

## Overview

An **Environment** is a named collection of:
- **Type**: The technology stack (Unreal 5.6.1, ReactJS, Python, etc.)
- **Status**: Whether the environment is Online or Offline
- **Context Variables**: Key-value pairs that define paths, config values, and other runtime settings
- **Executables**: Tools and scripts registered for this environment

When you switch the active environment via the navbar dropdown, all tools, variables, and settings change scope to that environment. This allows you to work seamlessly across multiple projects without manual reconfiguration.

## Interface Layout

The Environments page uses a three-panel layout:

### Left Panel: Environment List

The left sidebar displays all configured environments:

- **"+ New Environment"** button at the top (dashed border) for creating new environments
- Environment entries showing:
  - Environment name
  - Type and Status (e.g., "ReactJS Online" or "Unreal 5.6.1 Online")
  - Active environment highlighted with a yellow left border and "ACTIVE" badge

**Example environments:**
- Are-Self-UI (ReactJS Online)
- Default Environment (Unreal 5.6.1 Online, ACTIVE)
- HSH Python (Unreal 5.6.1 Online)

### Center Panel: Detail View

When you select an environment, the center panel displays its configuration:

#### Header Section
- Environment name with "✓ ACTIVE ENVIRONMENT" badge (green) if currently active
- Option to set as the active environment

#### Configuration Form

**NAME**
- Text input for the environment name (e.g., "Default Environment")

**DESCRIPTION**
- Text area for notes about the environment (e.g., "Default UE Environment")

**TYPE**
- Dropdown selector for the environment type (Unreal 5.6.1, ReactJS, Python, etc.)

**STATUS**
- Dropdown selector for Online/Offline status

**AVAILABLE**
- Checkbox to include/exclude this environment from the active dropdown

#### Context Variables Section

The **CONTEXT VARIABLES** section contains key-value pairs scoped to this environment:

- **"+ Add Variable"** button (top right) to add new variables
- Table with KEY and VALUE columns
- Delete (×) buttons for each variable row
- Scrollable list if many variables exist

**Example variables:**
- `project_name` = "HSHVacancy"
- `project_root` = "C:\Users\micha\Documents\Unreal Projects\HSHVacanc..."
- `engine_path` = "C:\Program Files\Epic Games\UE_5.6.1"
- `config_file` = "/path/to/config.ini"

### Right Panel

The right panel is reserved for advanced settings or future expansion (not visible in current layout).

## Creating a New Environment

1. Click **"+ New Environment"** in the left panel
2. Fill in the form fields:
   - **NAME**: Give your environment a descriptive name (e.g., "My Game Project")
   - **DESCRIPTION**: Add context (e.g., "Development build for testing")
   - **TYPE**: Select from available environment types
   - **STATUS**: Set to Online or Offline
   - **AVAILABLE**: Check to make it visible in the navbar dropdown
3. Click **"+ Add Variable"** to define context variables for your project:
   - Enter KEY (e.g., `project_root`)
   - Enter VALUE (e.g., `/path/to/my/project`)
4. Save your environment

## Managing Environments

### Switching Environments

Click an environment in the left panel to view and edit it. To make it the active environment:
- Click the **"Set as Active"** button if not already active
- Or use the environment dropdown in the navbar to switch quickly

The active environment is highlighted in the list and displays an "ACTIVE ENVIRONMENT" badge in the detail view.

### Context Variables

Context variables are scoped to their environment and are available to executables and spike trains running in that context.

**Common use cases:**
- Project paths (e.g., `project_root`, `source_dir`, `build_dir`)
- Configuration files (e.g., `config_file`, `settings_path`)
- External tool paths (e.g., `engine_path`, `compiler_path`)
- API keys or credentials (scoped to environment)
- Runtime parameters (e.g., `debug_level`, `output_format`)

**To add a variable:**
1. Click **"+ Add Variable"** in the Context Variables section
2. Enter the KEY (variable name)
3. Enter the VALUE (variable content)
4. The variable is immediately available to executables in this environment

**To remove a variable:**
- Click the **×** button next to the variable row

### Making Environments Available

If you check the **AVAILABLE** checkbox, the environment appears in the navbar dropdown and can be selected as the active environment. Uncheck it to hide the environment (useful for archival or temporary contexts).

### Deleting Environments

Click the **"Delete environment"** button at the bottom of the detail view to remove an environment. This action cannot be undone.

## Architecture

Under the hood, environments are composed of:

- **ProjectEnvironment**: The workspace context entity storing name, description, and availability
- **ProjectEnvironmentType**: The classification of the environment (Unreal, ReactJS, Python, etc.)
- **ProjectEnvironmentStatus**: The operational status (Online or Offline)
- **ContextVariable**: Key-value pairs scoped to an environment
- **Executable**: Tools and scripts registered to run in this environment (managed via the API or Executable management UI)

When a spike train executes in a specific environment, it has access to:
- All context variables defined in that environment
- All executables registered for that environment type
- The environment's configuration (type, status, paths)

## Related Pages

- **[Identity Ledger](/docs/ui/identity)**: Manage identities that operate within environments
- **[CNS Editor](/docs/ui/cns-editor)**: Create neural pathways that execute in specific environments
- **[Hypothalamus](/docs/ui/hypothalamus)**: Model routing configured per identity and environment