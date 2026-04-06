---
id: hypothalamus
title: "Hypothalamus"
sidebar_position: 9
---

# Hypothalamus

The **Hypothalamus** is Are-Self's model catalog and routing intelligence UI — where you manage AI models, configure selection routing logic, and set execution budgets. This interface lets you control which models run, when they run, and how much they cost.

## Overview

The Hypothalamus is the control center for model orchestration. It provides:

- **Model Catalog**: Browse available open-source and proprietary LLMs
- **Local Sync**: Pull installed models from your Ollama instance
- **Selection Routing**: Define rules for which model each identity uses
- **Failover Strategy**: Configure graceful degradation when a model fails
- **Budget Management**: Set spending and token limits per identity and period

The interface uses **tabs** for navigation and a **three-panel layout** within the Catalog tab.

---

## Top Bar & Controls

### Model Count

Top-left displays:

**"230 MODELS"** (with lightning icon)

- Shows total models available in the catalog (system-wide count)
- Updates when you sync local or fetch catalog

### Sync & Fetch Buttons

- **SYNC LOCAL** (button): Pull models currently installed in your local Ollama instance
  - Discovers newly installed models
  - Syncs installation status with database
  - Non-destructive; doesn't modify already-synced models
  - Useful after running `ollama pull <model-name>` locally

- **FETCH CATALOG** (button): Update the entire model registry from external sources
  - Fetches latest model metadata from Hugging Face, Ollama Hub, etc.
  - Adds newly released models to the catalog
  - Refreshes pricing and context length information
  - May take 30–60 seconds for large catalogs

### Sort Dropdown

- Default: "Installed First"
- Options:
  - **Installed First**: Installed models at the top, available below
  - **Alphabetical**: A–Z by model name
  - **Newest**: Recently released models first
  - **Largest**: Highest parameter count first
  - **Fastest**: Lowest latency models first (based on benchmarks)
  - **Most Used**: Models used most by your identities

### View Toggle

- **Grid icon**: Switch to card grid view (default)
- **List icon**: Switch to detailed table view

---

## Tab Navigation

Three tabs organize the interface:

### Tab 1: CATALOG (Default)

Browse and manage the model library. (Detailed below.)

### Tab 2: ROUTING

Configure which model each identity uses. (Detailed in Routing section.)

### Tab 3: BUDGETS

Set spending limits and token budgets. (Detailed in Budgets section.)

---

## Catalog Tab (Grid View)

The primary interface for discovering models.

### Left Panel: Filters & Search

Controls for narrowing the model list.

#### Search Input

- Placeholder: "Search models..."
- Searches by model name, provider, and family
- Real-time filtering as you type
- Examples: "gemma", "llama3", "mistral"

#### Status Filter Tabs

Three clickable tabs:

- **ALL** (selected by default): Shows all models
- **Installed**: Shows only locally installed models (status: green dot "● Installed")
- **Available**: Shows models not yet installed but downloadable via Ollama

#### Families Section

Clickable **family chips** with counts, grouped alphabetically:

- **Llama** (21 models): Meta's Llama 2/3 series
- **Gemma** (13 models): Google's lightweight models
- **Phi** (13 models): Microsoft's small models
- **Mistral** (12 models): Mistral AI's models
- **Qwen** (11 models): Alibaba's Qwen series
- **Granite** (11 models): IBM's enterprise models
- **DeepSeek** (8 models): DeepSeek's reasoning models
- **GLM** (8 models): Zhipu's models
- **Command** (5 models): Cohere's command series
- **Nemotron** (5 models): NVIDIA's models
- **Qwen Coder** (5 models): Qwen code-specialized variants
- **Hermes** (4 models): Nous Research's models
- **MiniMax** (4 models): MiniMax's models
- **Nomic Embed** (3 models): Nomic embedding models
- **GPT-OSS** (3 models): Open-source GPT variants
- **Falcon** (3 models): Technology Innovation Institute's models
- **Vicuna** (3 models): Community-fine-tuned models
- **OLMo** (3 models): AI2's open models
- **Mixtral** (3 models): Mistral's mixture-of-experts
- **Devstral** (3 models): Code-specialized variants
- **Kimi** (3 models): Moonshot AI's models
- **WizardLM** (3 models): Evol-Instruct trained models
- **StarCoder 2** (2 models): HuggingFace code models
- **LLaVA** (2 models): Vision-language models
- **Yi** (2 models): 01.AI's models
- **Cogito** (2 models): Cognitive reasoning models
- **Solar** (2 models): Upstage's models
- **BGE** (2 models): BAAI embedding models
- **CodeLlama** (2 models): Meta code-specialized Llama
- *(And more...)*

Click a family chip to filter by that model family.

### Center Panel: Model Cards

Card-based layout showing each model's key information:

#### Card Structure

Each card displays:

- **Provider Badge** (top-left, teal): "OLLAMA", "OPENAI", "OPENROUTER", "ANTHROPIC", etc.
- **Model Name** (bold, large): e.g., "gemma3:27b", "llama2:70b"
- **Publisher Info** (subtitle): e.g., "Google · Gemma · 27.4B · 131K context"
  - Publisher name
  - Model family
  - Parameter count (billions)
  - Context length (tokens)
- **Status Indicator** (right side):
  - Green dot "● Installed" if locally available
  - Empty/gray if available but not installed
- **Badge**: "Free" or cost indicator (if known)
- **Action Button**:
  - "REMOVE" button (red) for installed models — uninstall from local Ollama
  - "PULL" button (teal) for available models — download to local Ollama

#### Examples

- **gemma3:27b**
  - Provider: OLLAMA
  - Publisher: Google · Gemma · 27.4B · 131K
  - Status: ● Installed
  - Badge: Free
  - Action: REMOVE

- **gemma4:e4b**
  - Provider: OLLAMA
  - Publisher: Google · Gemma · Expert Model · 131K
  - Status: ● Installed
  - Badge: Free
  - Action: REMOVE

- **gemma4:latest**
  - Provider: OLLAMA
  - Publisher: Google · Gemma · Latest Release · 131K
  - Status: ● Installed
  - Badge: Free
  - Action: REMOVE

#### Scrolling & Pagination

- Cards scroll vertically
- Large catalogs paginate (50 models per page)
- Lazy-loading optimizes performance

### Right Panel: Model Inspector (Empty by Default)

When no model is selected:

**"Select a model to inspect."**

When you click a model card, the right panel shows details:

#### Model Header

- **Model Name** (bold)
- **Provider** (badge)
- **Family** (e.g., "Gemma", "Llama")

#### Model Details

- **Parameter Count**: e.g., "27.4 billion"
- **Context Length**: e.g., "131,072 tokens"
- **Release Date**: e.g., "April 2026"
- **License**: e.g., "Apache 2.0"
- **Official URL**: Clickable link to model card

#### Capabilities

Checkbox list of supported features:

- Chat / Instruction following
- Code generation
- Function calling / Tool use
- Vision / Image understanding
- Embeddings
- JSON output
- System prompts

#### Benchmark Scores

Performance metrics:

- **MMLU** (General knowledge): Percentage score
- **HumanEval** (Code): Pass@1 score
- **MT Bench** (Instruction): Rating score
- **Arena Rating** (LLM judge): Elo score

#### Installation & Usage

- **Status**: Installed / Available
- **Size**: Disk space required (e.g., "27.4 GB")
- **Download Link**: If available, link to Ollama Hub or other source
- **Local Path**: If installed, filesystem path
- **First Used**: Timestamp of first usage by identities

#### Linked Identities

List of identity discs currently configured to use this model:

- Click an identity to open its detail in Identity Discs UI
- Shows how many identities depend on this model

#### Remove / Pull Buttons

- **REMOVE** (installed models): Uninstall from Ollama (caution: breaks dependent identities)
- **PULL** (available models): Download to local Ollama

---

## Routing Tab

Configure which model each identity uses and how to handle failures.

### Layout

Similar three-panel structure:

- **Left Panel**: Identity filter and search
- **Center Panel**: Identity list with current routing config
- **Right Panel**: Detailed routing editor for selected identity

### Left Panel: Identity Filters

- **Search**: Find identities by name
- **Status**: Active, Paused, Archived filters
- **Role**: Filter by identity role (Analyst, Agent, Coach, etc.)

### Center Panel: Identity Routing List

Each identity card shows:

- **Identity Name** (e.g., "Alice#1", "ResearchBot#3")
- **Current Model** (e.g., "gemma3:27b")
- **Failover Chain** (e.g., "gemma3:27b → mistral:7b → ollama:fallback")
- **Status**: Active/inactive indicator

Click an identity to open the routing editor.

### Right Panel: Routing Editor (for Selected Identity)

#### Selection Filter Configuration

- **Preferred Model**: Dropdown select primary model (e.g., "gemma3:27b")
- **Fallback Models**: Ordered list of backup models to use if primary fails
  - Drag-to-reorder
  - Click + to add alternatives
  - Click X to remove fallbacks

#### Failover Strategy

- **Retry Policy**:
  - Max retries (0–10)
  - Delay between retries (ms)
  - Retry on: rate limit, timeout, error
- **Degradation**:
  - If primary fails, automatically try fallback
  - Log fallback event
  - Optionally alert user on fallback

#### Required Capabilities Filter

Checkboxes to enforce model requirements:

- Must support function calling
- Must support vision
- Must support JSON output
- Must support embeddings
- Custom capability text

Only models with all selected capabilities can be routed.

#### Banned Providers

- Checkboxes to exclude providers (e.g., "Do not use OpenAI", "Do not use OpenRouter")
- Useful for privacy or cost policies

#### Preferred Categories/Tags/Roles

- Prefer high-speed models
- Prefer small models (cost-conscious)
- Prefer high-quality models (accuracy-focused)
- Prefer open-source only
- Prefer models specialized in code/math/reasoning

#### Save & Preview

- **Save** button: Commit routing changes
- **Preview** button: Show which model would be selected for next request (tests the filter logic)

---

## Budgets Tab

Set spending and token allocation limits.

### Layout

Similar to Routing: three-panel structure with identity list and budget editor.

### Left Panel: Identity Filters

- **Search**: Find identities
- **Status**: Active, paused, over-budget filters
- **Budget Status**: On track, warning, exceeded

### Center Panel: Identity Budget List

Each identity card shows:

- **Identity Name**
- **Period**: e.g., "Monthly" (e.g., "April 2026")
- **Tokens Used / Budget**: e.g., "1.2M / 5M tokens" (progress bar)
- **Cost Used / Budget**: e.g., "$12.50 / $100" (progress bar)
- **Days Remaining**: e.g., "18 days left in period"

Click an identity to open the budget editor.

### Right Panel: Budget Editor (for Selected Identity)

#### Period Configuration

- **Budget Period**: Dropdown select
  - Per Request (single API call)
  - Per Hour
  - Per Day
  - Per Month
  - Per Year
  - Custom (start/end dates)

#### Token Budget

- **Input Tokens Limit**: Max tokens for prompts per period (e.g., 5,000,000)
- **Output Tokens Limit**: Max tokens for completions per period (e.g., 2,000,000)
- **Total Token Limit**: Combined budget (e.g., 10,000,000)
- **Slider** or **numeric input** for each

#### Cost Budget (if using paid models)

- **Spend Cap per Request**: Max cost per single API call (e.g., $5.00)
- **Spend Cap per Period**: Total budget for the entire period (e.g., $1,000)
- **Slider** or **currency input** for each

#### Warning Thresholds

- **Token warning at**: Trigger notification when X% of token budget consumed (e.g., 80%)
- **Cost warning at**: Trigger notification when X% of cost budget consumed (e.g., 80%)
- Notifications sent to admin

#### Budget Overrun Behavior

Radio buttons for what happens when identity hits budget:

- **Hard Stop**: Deny all new requests until period resets
- **Soft Stop**: Send warning, allow one more request, then block
- **Queue**: Queue requests until next period / budget refresh
- **Manual Review**: Pause and notify admin for approval

#### Monthly Reset vs. Cumulative

- **Reset**: Budget resets at period start (e.g., 1st of month)
- **Cumulative**: Budget never resets; historical total tracked

#### Current Period Status

- **Tokens Used**: X of Y tokens (progress bar)
- **Cost Used**: $X of $Y (progress bar)
- **Requests This Period**: Count
- **Average Cost Per Request**: $X
- **Days Until Reset**: N days (if applicable)

#### Save & Alert Configuration

- **Save** button: Commit budget changes
- **Email On Overrun**: Checkbox to send alert to admin email
- **Webhook**: Optional endpoint to POST overrun events

---

## Workflow Examples

### Install a New Local Model

1. Navigate to `/hypothalamus` and select the **CATALOG** tab (grid view)
2. Use **SYNC LOCAL** if you've already downloaded via Ollama CLI
   - Or use the search to find a model (e.g., "mistral")
3. Click the model card for "mistral:7b"
4. In the right panel, click **PULL** to start downloading
5. Wait for download to complete
6. Model status changes to "● Installed"
7. Now available for use in routing

### Configure Routing for an Identity

1. Open the **ROUTING** tab
2. Search for your identity (e.g., "Alice#1") in the left panel
3. Click the identity card in the center
4. In the right panel routing editor:
   - Set **Preferred Model** to "gemma3:27b"
   - Add fallback models: "mistral:7b" → "llama2:70b"
   - Check **Require: Function Calling** (if needed)
   - Click **Save**
5. Next time Alice#1 reasons, it will use gemma3:27b, falling back to Mistral if needed

### Set Monthly Token Budget

1. Open the **BUDGETS** tab
2. Search for identity "ResearchBot#3"
3. Click its budget card
4. In the right panel:
   - Set **Period** to "Per Month"
   - Set **Input Tokens Limit** to "10,000,000"
   - Set **Output Tokens Limit** to "5,000,000"
   - Set **Token Warning** to "80%"
   - Leave **Overrun Behavior** on "Hard Stop"
   - Click **Save**
5. Bot now has 15M total tokens per month; gets warned at 12M

### Handle Model Failure with Failover

1. Configure routing for identity "Analyst#2" with fallback chain: preferred → mistral → llama2
2. Start a reasoning session
3. If primary model API fails:
   - System retries (if enabled)
   - Falls back to Mistral
   - Logs the failover event
   - Session continues with new model
4. Monitor in Frontal Lobe if you want details on model switches

### Enforce Privacy Policy with Banned Providers

1. Open **ROUTING** tab
2. Select identity "Internal-Analysis#1"
3. In the routing editor:
   - Check **Banned Providers**: "OpenAI", "OpenRouter"
   - Only local Ollama models can be used
   - Click **Save**
4. This identity will never use external paid APIs

### Monitor Model Adoption

1. Open **CATALOG** tab in grid view
2. Sort by **Most Used** (dropdown)
3. Top cards show most popular models
4. Click a frequently-used model (e.g., "gemma3:27b")
5. In right panel, check **Linked Identities** section
6. See which identities rely on this model
7. Useful for assessing impact before removing a model

### Sync Ollama After Local Install

1. You install a new model locally: `ollama pull mistral`
2. Open **CATALOG** tab
3. Click **SYNC LOCAL** button
4. System discovers newly installed Mistral
5. "mistral:latest" now appears in catalog with "● Installed" status
6. Available for immediate use in routing and reasoning

---

## Technical Notes

- Model metadata comes from Ollama Hub, Hugging Face, and internal cache
- Catalog sync and fetch operations are asynchronous; progress bar shows completion
- Vector embeddings for models are pre-computed for similarity matching in routing
- Failover decisions are made at request time, not configuration time (allows dynamic model availability)
- Budget tracking is precise to individual token; partial-token rounding is handled server-side
- Cost calculations assume per-token pricing from model provider metadata
- Routing filters are evaluated left-to-right; first match wins
- Prefer/banned lists use tag-based matching; a model can have multiple tags

---

## See Also

- [Frontal Lobe](../ui/frontal-lobe.md) — View reasoning using these models
- [Hippocampus](../ui/hippocampus.md) — Memory system affected by model choice
- [Identity Discs](./identity) — Manage identities that are routed
- [Parietal Lobe](../brain-regions/parietal-lobe) — Tool execution may use different models