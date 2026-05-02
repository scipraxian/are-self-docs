---
id: context-windows
title: "Context Windows"
sidebar_position: 2
description: The four-layer prompt architecture — Identify, Context, History, Terminal — and how Are-Self lets you compose a working prompt without writing code.
---

# Context Windows

*The four-layer prompt architecture, and the tools that let you shape it.*

A context window is the only memory an LLM has while it answers a turn. Everything you want the model to know — who it is, what's happening right now, what just happened, what to do next — has to fit inside that window before the model begins generating. On a free local model running on a five-year-old laptop, the window is small, and how you fill it matters more than which model you picked.

Are-Self builds every prompt the same way, in four ordered layers, each owned by composable [Neural Addons](./brain-regions/identity). The layers are **Identify**, **Context**, **History**, and **Terminal**. They run in that order, every turn, for every reasoning session. The whole point of the architecture is to make the window **legible and editable** — so you can see what's in it, why it's there, and what changes if you swap a piece.

This page is about how to do that swapping. Where the levers are. What each one moves.

---

## The four layers, in order

The phases live in [`identity/models.py`](./brain-regions/identity) as an enum:

```python
class IdentityAddonPhase(NameMixin):
    IDENTIFY = 1   # System and Identity
    CONTEXT  = 2   # Telemetry, focus, recall
    HISTORY  = 3   # Recent turns, with eviction
    TERMINAL = 4   # YOUR MOVE
```

Every addon attached to an IdentityDisc declares which phase it runs at. The [Frontal Lobe](./brain-regions/frontal-lobe) sorts by `phase__id` ascending and dispatches each addon's phase hook in turn. Whatever messages each addon returns get appended to the LLM payload in that order. The final payload is the four layers concatenated — Identify first, Terminal last.

### 1. Identify — *the WHO*

> *Phase id 1. Hook: `on_identify(turn)`.*

The character sheet. Who this agent is, the rules it follows, the system_prompt that grounds its voice and its limits.

The canonical addon at this layer is `IdentityInfo`. It renders the IdentityDisc's `system_prompt_template` through Django's template engine — so a template like `You are {{identity_disc.name}}, working in iteration {{iteration.name}}.` resolves at runtime with the full ORM context (the disc, the iteration, the turn number, the reasoning turn itself).

What changes here per turn: very little. This is the immutable layer. Same character, same rules, every turn of a session.

**The user lever:** edit the `system_prompt_template` on the Identity. That template is the system prompt for every Disc forged from that Identity. For per-Disc personality drift, fork the Identity into a new one.

### 2. Context — *the NOW*

> *Phase id 2. Hook: `on_context(turn)`.*

The situation. What's true right this second — current focus pool, deployment environment, memories the [Hippocampus](./brain-regions/hippocampus) thinks are relevant to this turn, time pressure, mid-flight feedback.

This is the layer that changes most aggressively from turn to turn. Each addon contributes its slice — and several of these addons inject *pressure messages* the model can act on:

- **`Focus`** — *Focus Pool: 7 / 10*, level, XP, efficiency bonus on the previous turn. The model can see exactly how much budget it has left, and the level-up notification fires when the pool refills.
- **`Telemetry`** — the L1-cache *monitor*. Measures the actual character size of recent turn payloads and at thresholds injects `[WARNING: CONTEXT PRESSURE RISING]` (>12K chars, suggests `mcp_pass`) or `[CRITICAL WARNING: COGNITIVE OVERLOAD DETECTED]` (>20K chars, mandates `mcp_pass`). Also reports turn-budget remaining, output-footprint efficiency vs target, and previous-turn latency with system-lag warnings. Telemetry is the loop telling the model how full its own head is.
- **`Hippocampus_`** — pulls a memory catalog block from the [Hippocampus](./brain-regions/hippocampus) for this turn. On turn 1 of a session it surfaces the spike's initial relevant catalog; on subsequent turns it surfaces the recent-session catalog. The model gets vector-relevant memories without having to ask for them.
- **`Agile`** — turn-by-turn feedback signals, mid-iteration redirection from the human in the loop.
- **`Deadline`** — countdown context for time-bound work.

**The user lever:** attach or detach Context addons in the [Modifier Garden](./ui/modifier-garden). Detaching `Focus` removes the economy. Detaching `Telemetry` removes the cache-pressure monitor and frees the model from cognitive-load warnings. Detaching `Hippocampus_` runs the session without long-term recall. Each detach changes the agent's *self-awareness* about its own state.

### 3. History — *the THEN*

> *Phase id 3. Hook: `on_history(turn)`.*

What's just happened in this session — and, if the working-memory game is on, what's about to fall out of L1. **History is where Are-Self's active-decay engine lives.** This layer doesn't just replay; it talks to the model about its own forgetting and prompts it to commit what matters to long-term memory before eviction.

The two canonical addons sit at opposite ends of the working-memory spectrum:

- **`RiverOfSix`** — the L1-cache eviction engine. Keeps the last six turns and applies age-based decay with explicit pressure messages appended to tool-result content:
  - **Age 2** (turns ≥ 2 old): `[SYSTEM WARNING: L1 Cache decay beginning.]`
  - **Age 3** (turns ≥ 3 old): `[SYSTEM CRITICAL: L1 EVICTION IMMINENT ON NEXT TURN. FINAL CHANCE TO SAVE TO ENGRAMS.]`
  - **Age 4+**: tool_calls blocks stripped from older assistant messages, tool-result messages drop entirely. Only natural-language assistant content survives.

  The warnings are the system *talking to the model* about its own memory pressure. They prompt the model to call `mcp_engram_save` and commit important context to long-term [Hippocampus](./brain-regions/hippocampus) storage before eviction. That commit-to-engram pressure is the engine that drives the [Focus economy](./brain-regions/frontal-lobe) — saving novel engrams earns Focus, so each warning is also a Focus opportunity. The whole memory architecture turns on this loop.

- **`NormalChat`** — the way every LLM app you've used works by default: every message, every tool call, every piece of additional context, passed in full on every turn. It feels *normal* because it is — most LLM systems do exactly this. On a short session it's fine.

  Where it bites is the long run, and especially the **swarm** run. Full replay grows linearly with turn count, and on a local machine the cost is not just "the context window fills up" — it's actual RAM hyperextension on your laptop, turn after turn. Multiply by a swarm of agents coordinating across machines and the conventional approach falls over fast. NormalChat is the baseline `RiverOfSix` is built against — the demonstration of *why* the working-memory game exists. Useful for short sessions, for debugging the L1 game by comparison, or when you have the context budget and genuinely want every detail preserved.

**The user lever:** the History addon you attach IS the working-memory model of the agent. `RiverOfSix` imposes the decay-and-save pressure that shapes behavior toward engram-saving and into the Hippocampus's long-term memory. `NormalChat` removes that pressure. A custom HISTORY handler is a [NeuralModifier](./neural-modifiers/writing-a-neural-modifier) — ship your own decay schedule, your own eviction warnings, your own commit-to-memory urgency.

### 4. Terminal — *the WHAT NEXT*

> *Phase id 4. Hook: `on_terminal(turn)`.*

The closing instruction. The last thing the model reads before it generates.

This layer is small and load-bearing. The canonical addon is `YourMove`, and its entire contribution is:

> *"YOUR MOVE:*
> *1. Address the current context or user request.*
> *2. You may use your available tools if data or actions are required.*
> *3. If no tools are needed, simply provide your response natively."*

Three lines. Tells the model: the runway above is everything you need; here is what we want from you. The other Terminal addon, `Prompt`, injects the rendered NeuronContext prompt — the actual "what should this spike accomplish" question — so it lands at the end, primed for the model to act on directly.

**The user lever:** the TERMINAL layer is where you tune the *instruction shape*. A different YourMove text — different priorities, different output format requests, different escape hatches — produces a measurably different turn behavior on the same model.

---

## How dispatch works

Every turn, the [Frontal Lobe](./brain-regions/frontal-lobe) does this in `_build_turn_payload`:

```python
active_addons = (
    self.session.identity_disc.addons
    .select_related('phase')
    .order_by('phase__id')
)
for addon_model in active_addons:
    addon_messages = dispatch_phase(addon_model, turn_record)
    if addon_messages:
        all_messages.extend(addon_messages)
```

That's the whole engine. Phase id is the sort key. Order is a property of the layer, not of when you clicked "attach." A CONTEXT addon attached after a TERMINAL addon still runs before it, every time.

The assembled payload is logged by role at the bottom of every turn — you can read what actually went into the model in `frontal_lobe.py`'s live log block. The window is not a black box; it is a thing you can inspect.

---

## The active-memory dialogue

The conventional LLM session passes everything every turn — every message, every tool call, every scrap of context — and lets the model and the runtime fend for themselves. That's the `NormalChat` shape, and it's how most LLM apps work. Are-Self's four-layer architecture is what lets you do something different: **take active control of the context window**, deciding turn-by-turn what survives, what fades, and what gets committed to long-term memory before the rest is let go.

Are-Self isn't doing static prompt assembly. It's doing **active memory management with the model as a participant.** Several of the addons above don't just supply context — they inject *pressure messages* the model is expected to act on:

| Pressure | Where | What it tells the model |
|---|---|---|
| `[SYSTEM WARNING: L1 Cache decay beginning]` | `RiverOfSix`, age 2 | This memory is starting to fade. |
| `[SYSTEM CRITICAL: L1 EVICTION IMMINENT...FINAL CHANCE TO SAVE TO ENGRAMS]` | `RiverOfSix`, age 3 | Save to long-term memory now. |
| `[WARNING: CONTEXT PRESSURE RISING]` | `Telemetry`, >12K chars | Consider `mcp_pass` to flush. |
| `[CRITICAL WARNING: COGNITIVE OVERLOAD DETECTED]` | `Telemetry`, >20K chars | You **must** `mcp_pass` before pulling more. |
| `INEFFICIENT (XP PENALTY)` | `Telemetry`, output too long | Tighten your output. |
| `Effector Fizzled! Insufficient Focus` | `Focus`, on tool dispatch | You can't afford that tool — save engrams to refill Focus. |

The model isn't reading a passive context window; it's in an ongoing loop with the system about its own state. `RiverOfSix` decay + `Telemetry` cache pressure + `Hippocampus_` engram recall + the [Focus economy](./brain-regions/frontal-lobe) form one integrated working-memory architecture. Detaching any of them changes the conversation, sometimes radically. This is what makes a 7B model behave like it's been *taught to manage itself*, instead of just stuffing tokens into a window.

## Why the four layers are working

**Composition replaces code.** Most prompt-tweaking in other systems lives in a single mega-template that engineers fork when they need a new shape. Are-Self splits the work into four named slots, each owned by an independently-attachable addon. To change how an agent thinks for a given workflow, you compose addons in the [Modifier Garden](./ui/modifier-garden) — no fork, no Python, no redeploy.

**Small models can do real work.** A 7B-class model with a 4K context window can't read a 4K-token mega-prompt and reliably find the instruction inside. The same 7B model reading four labeled regions in a known order — character → situation → history → instruction — has a much easier time. Phase separation is mechanical structure that compensates for instruction-following weakness. This is the core reason Are-Self runs comfortably on hardware most projects gate behind cloud APIs.

**The window is debuggable.** When the agent does something surprising, the four layers let you isolate the cause. Was the wrong identity loaded (IDENTIFY)? Was a stale memory recalled (CONTEXT)? Did History eviction drop a key turn (HISTORY)? Was the YourMove text steering the model away from tools (TERMINAL)? Each is a separate thing to check, in a known place. Compare to a black-box mega-prompt where the whole window is one unsearchable wall of text.

**Layers age differently.** Identify rarely changes; Context changes every turn; History changes every turn but with eviction; Terminal stays small and stable. Caching and incremental rebuild become natural — only re-render what actually changed. The architecture *invites* the optimizations the runtime will eventually need.

**It scales with the addon catalog.** Every new behavior the [Neuroplasticity](./brain-regions/neuroplasticity) story enables — a new memory shape, a new pacing rhythm, a new pre-execution check — slots into one of the four phases. The four are enough; if a sixth phase becomes necessary, it's a real architectural decision, not a casual one.

---

## The levers, summarized

| Want to change… | Layer | Where to do it |
|---|---|---|
| Who the agent is | IDENTIFY | Edit `system_prompt_template` on the [Identity](./brain-regions/identity) |
| What memories it sees this turn | CONTEXT | Attach/detach `Hippocampus` in [Modifier Garden](./ui/modifier-garden) |
| Whether the Focus economy is in play | CONTEXT | Attach/detach `Focus` in Modifier Garden |
| How much history it carries | HISTORY | Swap `RiverOfSix` ↔ `NormalChat` ↔ a custom modifier's History handler |
| The closing instruction | TERMINAL | Customize / replace `YourMove` via a NeuralModifier |
| A brand-new behavior at any layer | any | [Write a NeuralModifier](./neural-modifiers/writing-a-neural-modifier) |

---

## How it connects

- [Identity](./brain-regions/identity) — defines the IdentityDisc the prompt is built around. The `system_prompt_template` is the IDENTIFY layer's heart.
- [Frontal Lobe](./brain-regions/frontal-lobe) — assembles and dispatches the four-layer payload to the model.
- [Hippocampus](./brain-regions/hippocampus) — supplies vector-recalled memories at the CONTEXT layer.
- [Modifier Garden](./ui/modifier-garden) — the user-facing tool to attach addons and re-shape the prompt by composition.
- [Writing a NeuralModifier](./neural-modifiers/writing-a-neural-modifier) — how to ship a new addon that contributes at any of the four layers.

The window is small. The four-layer architecture turns it from a thing you stuff into a thing you *manage* — big enough to do real work, small enough that a curious ten-year-old can read what's in it, structured enough that a swarm of agents can run for hours without bringing the laptop down.
