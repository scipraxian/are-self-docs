---
id: neuroplasticity
title: "Neuroplasticity — Adding New Abilities"
description: "NeuralModifiers, contribution-based installs, manifest hashing, and how Are-Self grows new abilities without touching INSTALLED_APPS"
slug: /brain-regions/neuroplasticity
---

# Neuroplasticity — Adding New Abilities

When you learn to ride a bike, your brain doesn't grow a whole new lobe. It rewires. Neurons that were strangers form new synapses. Pathways that didn't exist yesterday are normal today. The brain stays the same shape — it just does more. That's **neuroplasticity**: the brain's ability to learn new tricks without rebuilding itself.

Are-Self works the same way. When you want it to drive Unreal Engine, or talk to a new service, or run a workflow nobody imagined when the system was written, you don't fork the codebase or add a new Django app to `INSTALLED_APPS`. You install a **NeuralModifier** — a package of new abilities that hooks into the regions that already exist. The [Central Nervous System](./central-nervous-system) gets new [Effector](./central-nervous-system) types it can fire. [Environments](../ui/environments) get new context variables. The [Parietal Lobe](./parietal-lobe) gets new tools. The brain didn't change shape. It just learned a new skill.

And here's the part that matters: the system can forget the skill too. Every row a modifier added is tagged with a little sticky note saying "this came from me." When you uninstall, Are-Self walks the sticky notes in reverse and removes exactly what the modifier added — nothing more, nothing less. No leftovers. No broken references. The brain forgets cleanly, the way it learned cleanly.

## What a NeuralModifier Is

A NeuralModifier is a bundle with two halves: **data** it wants to add to the database, and **code** it wants to register against Are-Self's existing registries. It's tracked in `neuroplasticity/models.py` by the `NeuralModifier` row — identity fields (`slug`, `version`, `author`, `license`), a cached `manifest_json`, a SHA-256 `manifest_hash` frozen at install time, and a `status` that moves through the lifecycle below.

Bundles live in the codebase at `neuroplasticity/modifier_genome/<slug>/` (committed, versioned, reviewable) and install into `neural_modifiers/<slug>/` at the repo root (gitignored, per-machine). The separation is intentional: the committed tree is the genome — the source material, the same on every checkout. The runtime tree is what's actually plugged in *here*, on *this* machine, right now.

Each bundle ships four things in its genome directory: a `manifest.json` (metadata + entry-module list), a `modifier_data.json` (the Django-serialized rows the bundle contributes), a `code/` directory (the Python package imported at boot), and a `README.md` (the end-user-facing overview). The manifest's `entry_modules` are the Python module paths the loader imports — once at install, again on every boot — to run the bundle's side-effect registration calls.

## The Lifecycle — Five Stages

Every NeuralModifier moves through a lifecycle tracked by the `NeuralModifierStatus` enum. Think of it as the modifier's progress bar:

| Status | What It Means |
|--------|---------------|
| **Discovered** | The `NeuralModifier` row exists but the bundle hasn't been installed yet. Entry point for a freshly-seen bundle, and the state `uninstall_bundle` returns to. |
| **Installed** | The manifest validated, the payload loaded, every contributed row has a `NeuralModifierContribution` pointing at it. Code is on `sys.path`, but the bundle is dormant. |
| **Enabled** | Actively contributing. The modifier's tools, handlers, and parsers are live — the next reasoning session will see them. |
| **Disabled** | Installed but dormant. Rows stay in the database, code stays on `sys.path`, but bundle-contributed Parietal tools drop out of the tool manifest. |
| **Broken** | Manifest hash drift, `modifier_data.json` failed to deserialize, or an entry module raised on import. Terminal — needs human attention. |

The driving transition is **Enabled ↔ Disabled**. Flipping a modifier off doesn't uninstall it. The rows stay, the registration calls still fired at boot, but the Parietal Lobe's per-session tool manifest filters out anything contributed by a non-ENABLED bundle. Flip it back on, start a new reasoning session, and the tools come right back.

Five management commands drive the full state machine: `build_modifier <slug>` (install — the name is historical; there's no separate packaging step, the bundle source *is* the distributable artifact), `enable_modifier <slug>`, `disable_modifier <slug>`, `uninstall_modifier <slug>`, and `list_modifiers` for a read-only dump of every row with its status, version, and contribution count.

## Contributions — The Uninstall Manifest

Here's the clever bit. When a modifier installs, every row it adds to the database gets a partner row in the `neuroplasticity_neuralmodifiercontribution` table. That partner row is three things: a foreign key to the `NeuralModifier`, a `ContentType` naming the kind of model that was created (an [Effector](./central-nervous-system), an [Executable](../ui/environments), a `ToolDefinition`, whatever), and a `UUIDField` pointing at the specific row. That's a Django generic foreign key — one sticky note that can point at any model in the system, as long as the model uses UUID primary keys.

And every model a modifier could ever contribute to *does* use UUID primary keys. That's not an accident — it's the whole point of the immutability directive. Effectors, Neurons, Axons, Executables, ContextVariables, ToolDefinitions, NeuralPathways, the entire [Hypothalamus](./hypothalamus) model catalog — all UUID. Which means one generic foreign key reaches any of them.

When you uninstall, `loader.uninstall_bundle` walks `modifier.contributions.order_by('-created')` — **reverse** install order — pulls each target through the GFK, and deletes it. Reverse order is load-bearing: intra-bundle child rows unwind before their parents, so Django's PROTECT constraints never trip on the bundle's own graph. Orphaned contributions (where the target was already deleted out from under by other code) are still counted in the event log, and the contribution rows themselves are still removed, so the bundle cleans up after itself even in degraded states.

This design has a consequence worth saying out loud: **`INSTALLED_APPS` is never mutated at runtime**. Contributions are data, not Django apps. Installing a modifier doesn't reach into Django settings, doesn't reload the app registry, doesn't restart workers. It just writes rows. Uninstalling just deletes rows. The whole system stays stable because the only thing that ever changes is the database — and databases are good at change.

## The Three Registration Surfaces

Data is half the story. The other half is code, and bundles contribute code by calling registration functions that existing regions expose. Today there are three such surfaces:

- **Native handlers** in `central_nervous_system/effectors/effector_casters/neuromuscular_junction.py` — `register_native_handler(slug, callable)` / `unregister_native_handler(slug)`. These are the Python callables that run when an Effector's slug resolves to bundle-provided behavior (the Unreal bundle's `update_version_metadata` is the canonical example).
- **Parietal MCP tools** in `parietal_lobe/parietal_mcp/gateway.py` — `register_parietal_tool(name, coroutine)` / `unregister_parietal_tool(name)`. These pair with a contributed `ToolDefinition` row: the row describes the tool schema the [Frontal Lobe](./frontal-lobe) hands to the LLM, the coroutine is what actually runs when the LLM calls the tool.
- **Log parser strategies** in `occipital_lobe/log_parser.py` — `LogParserFactory.register(log_type, strategy_cls)`. These let a bundle teach the [Occipital Lobe](./occipital-lobe) how to make sense of a new flavor of log output.

All three are module-level registries that `boot_bundles()` exercises by importing each bundle's entry modules on every `AppConfig.ready` pass. Because the loader pops the entry module out of `sys.modules` and re-imports it, registration code runs more than once in the life of the process. The convention is **unregister-then-register** — unregister the slug first (idempotent, no-op if it wasn't there), then register. That keeps repeat imports from raising on duplicate registration.

A bundle's `code/<package>/__init__.py` typically re-imports the submodules that carry the registration calls:

```python
from . import handlers       # noqa: F401 — registers native handlers
from . import log_parsers    # noqa: F401 — registers LogParserFactory strategies
```

Importing the package for any reason — by the loader, by tests, by another bundle — lands every registration the bundle wanted.

## ENABLED vs DISABLED — What Actually Changes

The lifecycle table says DISABLED bundles are "dormant," which is accurate but thin. The concrete mechanism: `ParietalLobe._fetch_tools` queries `ToolDefinition` with an `Exists(...)` subquery against `NeuralModifierContribution`, and excludes any tool whose contribution row points at a non-ENABLED modifier. Core tools — `ToolDefinition` rows with no contribution row pointing at them — pass through untouched. The filter lives at the query layer, so there's no cache to invalidate; the next reasoning session picks up the current state on its next call to `build_tool_schemas`.

Native handlers and log parsers don't participate in gating today. They're registered at boot and stay registered until the process restarts; DISABLED affects which tools the LLM sees in its tool manifest, not which handlers the NMJ will dispatch to or which parsers Occipital can use. Uninstall is the clean severance: it walks the contributions, deletes the DB rows (including `ToolDefinition`s), and on the next boot the bundle's entry modules aren't imported, so nothing re-registers.

The upshot: **disable to stop reasoning from using a bundle's tools**; **uninstall to remove the bundle entirely**.

## The Manifest Hash

Every install freezes a SHA-256 of the manifest on the `NeuralModifier.manifest_hash` field. Every boot, `boot_bundles()` rehashes the on-disk `manifest.json` and compares. If they don't match, the bundle is flipped to BROKEN, a `HASH_MISMATCH` event row is written with the expected + actual hashes, and the bundle's entry modules are **not** imported. The rest of the system keeps booting.

That's tamper detection for free. If someone edits the committed bundle to add a new effector, the hash changes, and the system notices. If a bad actor swaps files on a running machine, the hash changes, and the system notices. If you hand-edit the manifest during development, the hash changes, and the system notices — that's a good reminder to uninstall and reinstall before trusting the result.

The same BROKEN transition fires on other failure modes: `manifest.json` missing on disk, an entry module raising on import, `modifier_data.json` failing to deserialize. All of them produce an event row with enough detail to diagnose (hash values, traceback strings, whatever), and none of them take the system down.

## The Installation Log

Every install, uninstall, enable, disable, and load attempt writes to `NeuralModifierInstallationLog`. That log owns its own `installation_manifest` — a frozen snapshot of the manifest as it looked at the moment of the event — so you can compare what *is* against what *was* even if the files on disk have drifted since.

Each log row has child `NeuralModifierInstallationEvent` rows typed by the `NeuralModifierInstallationEventType` enum:

| Event | Fires When |
|-------|-----------|
| **Install** | A modifier moved from Discovered to Installed. |
| **Uninstall** | All the contributions were walked and deleted. |
| **Enable** | A bundle was flipped to ENABLED. |
| **Disable** | A bundle was flipped to DISABLED. |
| **Load Failed** | The manifest or payload couldn't be parsed, or contribution creation blew up mid-transaction. |
| **Hash Mismatch** | The on-disk manifest no longer matches the stored hash. |

Each event carries a JSON `event_data` blob with whatever detail the reporter thought was worth keeping — stack traces on Load Failed, hash pairs on Hash Mismatch, contribution + entry-module counts on Install, orphan counts on Uninstall. The log is append-only. Nothing gets edited; new rows just keep arriving.

## Why the Registry Keeps Integer PKs

You might notice that `NeuralModifier`, `NeuralModifierStatus`, and the installation log tables themselves use integer primary keys, not UUIDs. That's on purpose. The immutability directive says *anything a NeuralModifier could ever contribute to* uses UUIDs. The neuroplasticity registry is one level up — it's the thing that *owns* the contributions. It's core infrastructure, never extended by bundles, so integer PKs are fine here. You install modifiers; modifiers don't install neuroplasticity.

## The Four Fixture Tiers and Where Modifiers Fit

Are-Self's core fixtures load in four biological tiers — `genetic_immutables.json` → `zygote.json` → `initial_phenotypes.json` → `petri_dish.json`. The first three are for everyone (install, Docker, production); the last is test-only. The neuroplasticity app follows the same convention: it ships a `genetic_immutables.json` that seeds the five statuses and six event types, and nothing in the other tiers — the registry is empty at first boot. A fresh install has zero installed modifiers; modifiers arrive later, by invitation.

A NeuralModifier bundle's own fixture-like payload — the Effectors, Executables, NeuralPathways, ToolDefinitions it wants to contribute — ships *inside* the bundle as `modifier_data.json`, not as part of the core tiers. On install, the contribution-aware loader walks the payload, creates each row via Django's deserializer, and writes the matching `NeuralModifierContribution` in the same transaction so the uninstall manifest is always consistent with the install.

## The First Bundle — Unreal Engine

Unreal is the reference bundle and the proving ground for every design choice above. It ships the build, stage, deploy, and shader-compile pathways that drive an Unreal Engine 5 project end-to-end: six UE executables (`UNREAL_CMD`, `UNREAL_AUTOMATION_TOOL`, `UNREAL_STAGING`, `UNREAL_RELEASE_TEST`, `UNREAL_SHADER_TOOL`, `VERSION_HANDLER`) with their argument and switch definitions, a default UE Environment with its ContextVariables, fourteen UE-named NeuralPathways with their full Neuron / Axon / NeuronContext / EffectorContext / EffectorArgumentAssignment closure, the `update_version_metadata` native handler, the `mcp_run_unreal_diagnostic_parser` Parietal tool, and UE log parser strategies for build and run output.

Source lives at `neuroplasticity/modifier_genome/unreal/`, with `manifest.json` describing the bundle, `modifier_data.json` shipping the rows, and `code/are_self_unreal/` carrying the Python package whose entry module exercises all three registration surfaces at boot. The generic log-merge utilities that used to live in the old `ue_tools/` app moved to `occipital_lobe/` during the extraction, and the log parser was split into a generic core plus Unreal-specific strategies registered through `LogParserFactory` — a pattern every future bundle will echo. Core owns the framework; the modifier owns the flavor.

## Writing a Bundle

There's an author-facing README at `neuroplasticity/modifier_genome/README.md` that covers the end-to-end path: directory layout, manifest schema, the `modifier_data.json` contribution format (including the `uuid.uuid4()` PK rule and the ordering invariants the serializer relies on), entry-module conventions for the three registration surfaces, the build / enable / disable / uninstall lifecycle from the author's perspective, and a checklist. The Unreal bundle is the worked example it points at.

The acceptance test for any bundle is the round-trip: install cleanly, behave correctly while enabled, disable and re-enable without data loss, uninstall and leave zero leftover rows. A bundle that can't round-trip isn't ready.

## What's Landed, What's Left

**Landed.** The models (`NeuralModifier`, `NeuralModifierContribution`, `NeuralModifierInstallationLog`, `NeuralModifierInstallationEvent`, plus the two enum tables), the contribution-aware loader with transactional install/uninstall, the five management commands, the `AppConfig.ready()` boot hook with hash-drift verification, all three registration surfaces (`register_native_handler`, `register_parietal_tool`, `LogParserFactory.register`) with collision detection and unregister pairs, Parietal tool-set gating on ENABLED state, the Unreal bundle's manifest / `modifier_data.json` / entry-module code for handlers and log parsers, and the bundle-author README. Twenty-plus tests across lifecycle, registration, and tool-set gating are green.

**Left.** Finish moving the last Unreal-specific rows out of core fixtures so core-only test runs pass without any UE assumptions. Add explicit end-to-end tests for the full set of BROKEN transitions (hash mismatch, manifest missing, `code/` missing, deserialization failure). Surface uninstall orphan counts into the event data. And design + build the upgrade / version / dependency model — semver, `requires:` in the manifest, a UUID-diff-based upgrade path that preserves unchanged contributions while adding and removing deltas. The backend is close.

**Frontend.** The Modifier Garden — install, uninstall, enable, disable, and inspect bundles from a browser instead of the terminal — is a separate track tracked in `NEURAL_MODIFIER_COMPLETION_PLAN.md`. Minimum shippable set is a list view with install/uninstall buttons, enable/disable toggles, row-level bundle attribution in existing editors, and a tool-picker that handles soft-lookup when a bundle is uninstalled. There's no REST API for neuroplasticity yet; install is a backend concern until the Garden ships.

## How It Connects

- **[Central Nervous System](./central-nervous-system)**: The biggest customer. Modifiers ship new Effector types, new EffectorContexts, new NeuralPathways, and new Axons — all UUID-keyed so contribution GFKs can reach them. Native handlers register through `neuromuscular_junction` so bundle-provided Python callables can back those effectors.
- **[Environments](../ui/environments)**: Modifiers routinely ship new ContextVariables so their effectors can resolve paths and settings from the active environment.
- **[Parietal Lobe](./parietal-lobe)**: New `ToolDefinition`s and their parameters ride along in a bundle's `modifier_data.json`; paired MCP coroutines register through `register_parietal_tool`. The Parietal Lobe filters bundle-contributed tools out of each session's tool manifest unless the bundle is ENABLED — this is the concrete behavior behind the Enabled ↔ Disabled transition.
- **[Occipital Lobe](./occipital-lobe)**: Log parser strategies register through `LogParserFactory` so bundles can teach the system to read a new flavor of log output.
- **[Hypothalamus](./hypothalamus)**: The entire model catalog is UUID-keyed, so a modifier could theoretically ship new model families, providers, or failover strategies — though in practice the catalog syncs from Ollama and OpenRouter, not from bundles.
- **[Temporal Lobe](./temporal-lobe)**: IterationDefinitions and IterationShiftDefinitions are UUID-keyed and contributable. A modifier focused on a specific workflow shape (say, a game-dev cadence) could ship its own definitions.
- **[Identity](./identity)**: IdentityAddons are UUID-keyed. A modifier could ship new addon phases specific to its domain — though the addon's underlying Python function still has to live somewhere the bundle loads as importable code.
- **[Synaptic Cleft](./synaptic-cleft)**: Install, uninstall, enable, and disable events are candidates for real-time broadcast so UIs can reflect modifier state without polling.
