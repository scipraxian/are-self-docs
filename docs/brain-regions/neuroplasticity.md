---
id: neuroplasticity
title: "Neuroplasticity — Adding New Abilities"
description: "NeuralModifier modifiers, the genome cascade, and how Are-Self grows new abilities without touching INSTALLED_APPS"
slug: /brain-regions/neuroplasticity
---

# Neuroplasticity — Adding New Abilities

When you learn to ride a bike, your brain doesn't grow a whole new lobe. It rewires. Neurons that were strangers form new synapses. Pathways that didn't exist yesterday are normal today. The brain stays the same shape — it just does more. That's **neuroplasticity**: the brain's ability to learn new tricks without rebuilding itself.

Are-Self works the same way. When you want it to drive Unreal Engine, or talk to a new service, or run a workflow nobody imagined when the system was written, you don't fork the codebase or add a new Django app to `INSTALLED_APPS`. You install a **NeuralModifier** — a self-contained zip of new abilities that hooks into the regions that already exist. The [Central Nervous System](./central-nervous-system) gets new Effector types. [Environments](../ui/environments) get new context variables. The [Parietal Lobe](./parietal-lobe) gets new tools. The brain didn't change shape. It just learned a new skill.

And here's the part that matters: the system can forget the skill too. Every row a modifier owns is tagged with the modifier that brought it in. When you uninstall, the database walks the tags and removes exactly what the modifier added — nothing more, nothing less. The brain forgets cleanly, the way it learned cleanly.

## What a NeuralModifier Is

A NeuralModifier is a single committed file: `neuroplasticity/genomes/<slug>.zip`. The zip *is* the modifier — there's no unzipped source tree anywhere in the repo, no companion folder to keep in sync, no scattered fixtures. Open the archive and you'll find four things at the top level:

- **`manifest.json`** — metadata (slug, version, author, license), declared `entry_modules`, declared `requires:` dependencies.
- **`modifier_data.json`** — every database row this modifier wants to add, in Django's serialized fixture format.
- **`code/`** — a Python package that gets imported at boot to fire registration calls.
- **`README.md`** — the end-user-facing overview.

A fresh clone of Are-Self ships exactly one modifier (`genomes/unreal.zip`), which means a fresh install has exactly one row available to install: the unreal modifier. Everything else arrives later, by invitation.

For the author-facing reference — manifest schema, contribution format, registration surfaces, the unreal modifier as a worked example — see [Writing a NeuralModifier](../modifiers/writing-a-modifier).

## Three directories, three roles

All three live under `neuroplasticity/`. Two are gitignored.

- **`neuroplasticity/genomes/<slug>.zip`** — committed user-facing archives. The catalog the [Modifier Garden](../ui/modifier-garden) UI displays. After the first save-to-archive, a `<slug>.zip.bak` sits next to each live zip — a single rolling backup of the previous version, mtime preserved, so an in-place save never destroys what was there before.
- **`neuroplasticity/grafts/<slug>/`** — the runtime install tree, gitignored. When you install a modifier, its `code/` directory ends up here on `sys.path` so Python imports resolve. When you uninstall, the on-disk cleanup is deferred to the next boot's orphan sweep — Windows file locks won't let `rmtree` succeed while the process that imported the code is still running.
- **`neuroplasticity/operating_room/`** — transient scratch, gitignored. Every install and upgrade extracts into a fresh `tempfile.mkdtemp` here, then nukes it in a `try/finally`. After any operation — success or failure — `operating_room/` is empty.

## The lifecycle — two real states

A NeuralModifier is in one of two live states at any moment.

**AVAILABLE** — the zip exists in `genomes/`, but there is no `NeuralModifier` row in the database. Nothing has been imported, nothing is on `sys.path`, the modifier is just a file sitting there waiting. The catalog endpoint surfaces availability by reading the filesystem; row-absence *is* the AVAILABLE signal.

**INSTALLED** — the manifest validated, the payload deserialized into rows, the code copied to `grafts/<slug>/` and added to `sys.path`, the entry modules imported, the registration calls fired. The modifier is alive.

A third state, **BROKEN**, is a side-branch — fired when a previously-installed modifier's manifest no longer matches its frozen hash, or when an entry module raises on import at boot, or when `manifest.json` itself can't be parsed. BROKEN means "this used to work, now something on disk has drifted, look here." It's not a transition you make on purpose; it's diagnostic.

That's the whole thing. Install adds the row. Uninstall deletes the row. There is no separate enable / disable. (The `NeuralModifierStatus` enum still carries `ENABLED` and `DISABLED` values for historical log-event compatibility, but no new install assigns them. Likewise `DISCOVERED` — its old "found a zip" meaning has been replaced by row-absence, which IS the AVAILABLE signal.)

## The genome cascade — every row knows its modifier

Every row a modifier could contribute to has a `genome` foreign key on it. Effectors, Neurons, Axons, Pathways, ContextVariables, ToolDefinitions, the entire [Hypothalamus](./hypothalamus) catalog — all of them carry a `GenomeOwnedMixin` that points at the `NeuralModifier` row that brought them in. The default value is the **INCUBATOR** — Are-Self's canonical "this came from core, not from a modifier" genome — so every row in the database has a real genome value. None are null. None are ambiguous.

That's the engine of clean uninstall. To remove a modifier, the loader walks every model with `GenomeOwnedMixin` and deletes rows whose `genome` matches the target. INCUBATOR-owned rows — the ones core ships — are never touched, because the cascade only matches the modifier being removed. You can't accidentally remove core by uninstalling a modifier. The default value protects core by construction.

The cascade is also **additive, not exclusive**. A modifier can reach rows that another modifier owns, and the cascade walker just steps through them as transit. Cross-modifier references are a feature; a modifier that builds on another modifier's contributions is a normal shape. Refusal only kicks in when the cascade's *starting point* is canonical-owned (you can't, for example, mark a core Pathway as a modifier's), not when it passes through one along the way.

## The three registration surfaces

Data is half the story. The other half is code, and modifiers contribute code by calling registration functions that existing regions expose. Today there are three such surfaces:

- **Native handlers** in `central_nervous_system/effectors/effector_casters/neuromuscular_junction.py` — `register_native_handler(slug, callable)` / `unregister_native_handler(slug)`. These are the Python callables that run when an Effector's slug resolves to modifier-provided behavior. The Unreal modifier's `update_version_metadata` is the canonical example.
- **Parietal MCP tools** in `parietal_lobe/parietal_mcp/gateway.py` — `register_parietal_tool(name, coroutine)` / `unregister_parietal_tool(name)`. These pair with a contributed `ToolDefinition` row: the row describes the tool schema the [Frontal Lobe](./frontal-lobe) hands to the LLM, the coroutine is what actually runs when the LLM calls it.
- **Log parser strategies** in `occipital_lobe/log_parser.py` — `LogParserFactory.register(log_type, strategy_cls)`. These let a modifier teach the [Occipital Lobe](./occipital-lobe) how to make sense of a new flavor of log output.

All three are module-level registries that the boot hook exercises by importing each modifier's entry modules on every `AppConfig.ready` pass. The convention is **unregister-then-register** — unregister the slug first (idempotent, no-op if nothing's there), then register. That keeps repeat imports from raising on duplicate registration.

## URL routes — the optional fourth surface

A modifier can also ship URL routes. If the modifier's package exports a `V2_GENOME_ROUTER` (a DRF `routers.SimpleRouter()` with viewsets registered), the V2 URL conf auto-discovers it at module-import time: iterate installed modifiers, ensure each one's `code/` is on `sys.path`, import its `urls` module, lift its `V2_GENOME_ROUTER` into the core router. Prefix collisions refuse loudly. Missing `urls.py` is fine. Broken `urls.py` fails loudly. NeuralModifiers without route contributions don't ship a `urls.py` at all.

## Install, uninstall, save — and a system restart

Install, uninstall, and the catalog-install action all trigger a coordinated process restart. The autonomic nervous system shuts the Celery worker down to drain in-flight tasks, spawns a fresh worker process, then touches `config/__init__.py` so Django's autoreloader cycles the Daphne child cleanly. The reason is that adding or removing code from `sys.path` only takes full effect across a restart — Python's module cache won't unload mid-process. Install / uninstall / save IS a restart, by design.

Saving a modifier is a separate operation worth naming. The `save_bundle_to_archive` flow re-zips the current `grafts/<slug>/code/` directory and the modifier's owned rows back into `genomes/<slug>.zip`, semver-patch-bumping the version, copying the existing zip to `<slug>.zip.bak` first. It refuses to write a zip without findable entry modules, and re-opens the staged zip to verify validity before the catalog `os.replace` lands. Round-trip from edit-in-place to committed archive is one call.

## The supported surfaces

Two surfaces drive a modifier through its lifecycle. Both go through the same backend.

- **The [Modifier Garden](../ui/modifier-garden) UI** at `/modifiers`. Browser-driven. Status pills, install/uninstall buttons, manifest viewer, event log. The path of least resistance for everyday use.
- **The HTTP API** at `/api/v2/neural-modifiers/...`. Same operations, scriptable. See [API Reference](../api-reference) for endpoints.

The five legacy management commands (`enable_modifier`, `disable_modifier`, `list_modifiers`, `uninstall_modifier`, `upgrade_modifier`) remain in the codebase as deprecation stubs that raise `CommandError` if invoked. They predate the Garden and the HTTP API, and they're kept around so old scripts fail loudly rather than silently doing the wrong thing.

## The manifest hash

Every install freezes a SHA-256 of the manifest on the `NeuralModifier.manifest_hash` field. Every boot, the boot hook rehashes the on-disk `manifest.json` and compares. If they don't match, the modifier is flipped to BROKEN, a `HASH_MISMATCH` event row is written with the expected and actual hashes, and the modifier's entry modules are not imported. The rest of the system keeps booting.

That's tamper detection for free. If someone edits the committed modifier to add a new effector, the hash changes, and the system notices. If a bad actor swaps files on a running machine, the hash changes, and the system notices. If you hand-edit the manifest during development, the hash changes, and the system notices — that's a good reminder to uninstall and reinstall (or save through the proper flow, which freezes a fresh hash) before trusting the result.

## The installation log

Every install and uninstall writes to `NeuralModifierInstallationLog`. Each log row carries a frozen snapshot of the manifest as it looked at the moment of the event, plus child `NeuralModifierInstallationEvent` rows typed by event kind:

| Event | Fires When |
|-------|-----------|
| **Install** | A modifier moved from AVAILABLE to INSTALLED. |
| **Uninstall** | The genome cascade walked, every owned row was deleted, the `NeuralModifier` row was removed. |
| **Load Failed** | The manifest or payload couldn't be parsed, or contribution creation blew up mid-transaction. The modifier's row is then deleted (no leftover BROKEN stub from a failed fresh install). |
| **Hash Mismatch** | The on-disk manifest no longer matches the stored hash. NeuralModifier flips to BROKEN. |

Each event carries a JSON `event_data` blob with whatever detail the reporter thought was worth keeping — stack traces on Load Failed, hash pairs on Hash Mismatch, contribution + entry-module counts on Install, `contributions_resolved` / `contributions_unresolved` / `orphaned_ids` counts on Uninstall. The log is append-only.

## Why the registry keeps integer PKs

You might notice that `NeuralModifier`, `NeuralModifierStatus`, and the installation log tables themselves use integer primary keys, not UUIDs. That's on purpose. The immutability directive says *anything a NeuralModifier could ever contribute to* uses UUIDs. The neuroplasticity registry is one level up — it's the thing that *owns* the contributions. It's core infrastructure, never extended by modifiers, so integer PKs are fine here. You install modifiers; modifiers don't install neuroplasticity.

## What's landed, what's left

**Landed.** The full lifecycle (`AVAILABLE → INSTALLED → AVAILABLE`), the genome cascade with `GenomeOwnedMixin` and the INCUBATOR default, all three registration surfaces, the V2 URL discovery loop, the save-to-archive flow with rolling `.bak`, the system-restart pattern on install / uninstall, the [Modifier Garden](../ui/modifier-garden) UI (list, install, uninstall, inspector with manifest + event log, impact-preview confirmation dialog), the HTTP API at `/api/v2/neural-modifiers/...`, the boot-time hash-drift verification, semver-validating upgrade flow with `requires:` dependencies, and the Unreal modifier as the round-trip proof. The `mark-for-plasticity` branch merged to main on 2026-04-27, carrying all of the above.

**Left.** A few polish items: row-provenance chips on existing editors (so a Hypothalamus model card shows which modifier owns it), modifier marketplace search inside the Garden, install-time manifest validation surfaced into the upload UI, and a deeper inspector. None are blocking.

## How It Connects

- **[Central Nervous System](./central-nervous-system)**: The biggest customer. NeuralModifiers ship new Effector types, NeuralPathways, and Axons — all carry `GenomeOwnedMixin`. Native handlers register through `neuromuscular_junction` so modifier-provided Python callables can back those effectors.
- **[Environments](../ui/environments)**: NeuralModifiers routinely ship new ContextVariables so their effectors can resolve paths and settings from the active environment.
- **[Parietal Lobe](./parietal-lobe)**: New `ToolDefinition`s and their parameters ride along in a modifier's `modifier_data.json`; paired MCP coroutines register through `register_parietal_tool`.
- **[Occipital Lobe](./occipital-lobe)**: Log parser strategies register through `LogParserFactory` so modifiers can teach the system to read a new flavor of log output.
- **[Hypothalamus](./hypothalamus)**: The entire model catalog is `GenomeOwnedMixin`-backed, so a modifier could ship new model families, providers, or failover strategies — though in practice the catalog syncs from Ollama and OpenRouter, not from modifiers.
- **[Temporal Lobe](./temporal-lobe)**: `IterationDefinition`s and `IterationShiftDefinition`s are modifier-extensible. A modifier focused on a specific cadence could ship its own.
- **[Identity](./identity)**: `IdentityAddon`s are modifier-extensible. A modifier could ship new addon phases specific to its domain — though the addon's underlying Python function still has to live in code the modifier ships.
- **[Synaptic Cleft](./synaptic-cleft)**: Install and uninstall events broadcast Acetylcholine with `receptor_class='NeuralModifier'` so the [Modifier Garden](../ui/modifier-garden) UI reflects state changes without polling.
