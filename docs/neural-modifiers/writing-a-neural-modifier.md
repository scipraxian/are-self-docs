---
id: writing-a-neural-modifier
title: "Writing a NeuralModifier"
sidebar_position: 1
---

# Writing a NeuralModifier

A **NeuralModifier** is the unit of extension in Are-Self. If you want the system to drive a tool it doesn't know about, talk to a service it hasn't met, or run a workflow nobody imagined when it was written, you write a modifier. You don't fork the codebase. You don't add a Django app to `INSTALLED_APPS`. You ship a zip.

This page is the author-facing reference. The conceptual overview lives at [Neuroplasticity](../brain-regions/neuroplasticity); the day-to-day operator surface is the [Modifier Garden](../ui/modifier-garden). Both are worth reading first if you haven't.

The unreal-engine modifier (`neuroplasticity/genomes/unreal.zip` in the api repo) is the worked example. Extract it locally — `unzip neuroplasticity/genomes/unreal.zip -d /tmp/unreal_inspect/` — and use it as the reference shape while you're reading along.

## The shape of a modifier

A modifier is a single `.zip` archive. The zip *is* the modifier — there's no unzipped source tree to keep in sync, no companion folder, no scattered fixtures. Open the archive and you'll find four things at the top level:

- **`manifest.json`** — metadata (slug, version, author, license), the list of `entry_modules` the loader imports, and any `requires:` declarations.
- **`modifier_data.json`** — every database row this modifier wants to add, in Django's serialized format.
- **`code/`** — a Python package. Whatever the package is named, it ends up importable on `sys.path` after install.
- **`README.md`** — the end-user-facing overview. What the modifier does, how to use it, who wrote it.

Once installed, the modifier's `code/` directory ends up at `neuroplasticity/grafts/<slug>/` on disk (gitignored, per-machine). The committed archive at `neuroplasticity/genomes/<slug>.zip` is what's portable across checkouts; the runtime install tree is what `sys.path` actually points at.

## The manifest

`manifest.json` is the modifier's identity card. It declares:

- **`slug`** — kebab-case, stable, unique. The filename of the zip is `<slug>.zip`. The runtime install tree is `grafts/<slug>/`. The slug is the modifier's name everywhere.
- **`version`** — semver (`MAJOR.MINOR.PATCH`). The save-to-archive flow patch-bumps this on every save. Validation enforces semver shape on install.
- **`author`**, **`license`** — free-form strings.
- **`entry_modules`** — a list of Python module paths the loader imports at install time and on every boot. These are the modules that call the registration functions described below. For the unreal modifier, the entry module is `are_self_unreal`.
- **`requires`** *(optional)* — declared dependencies on other modifiers or on a minimum Are-Self version. Used by the upgrade flow.

The exact schema can drift — extract `unreal.zip` and read its `manifest.json` for the current authoritative shape.

A SHA-256 hash of the manifest is frozen on the `NeuralModifier` row at install time. On every boot, the on-disk manifest is rehashed and compared; any mismatch flips the modifier to BROKEN. That's tamper detection for free, and it's the reason you should never hand-edit a `manifest.json` on disk after install — uninstall and reinstall instead.

## modifier_data.json — the rows your modifier ships

`modifier_data.json` carries the database rows the modifier wants to add. Format is Django's natural-key-friendly fixture serialization: a JSON array where each entry has `model`, `pk`, and `fields`. The contribution-aware loader walks the array in order and `get_or_create`s each row inside a single transaction.

Two rules matter most:

- **Primary keys are `uuid.uuid4()` random literals.** No UUIDv5, no namespaces, no deterministic seeding. Once a UUID is in the modifier's frozen `modifier_data.json`, it's an opaque value; never regenerate it.
- **Order matters.** Rows that other rows depend on must appear earlier in the file. Effectors before Neurons that reference them; Neurons before Axons that connect them; Pathways before Neurons inside them. The loader doesn't try to re-sort for you.

Every row your modifier ships gets a matching `NeuralModifierContribution` automatically — a generic foreign key from your `NeuralModifier` row to the contributed row, by `ContentType` and UUID. That's the genome cascade that makes uninstall clean.

## The code/ directory

`code/` is a Python package. Its name is up to you — by convention it's `are_self_<slug>` so you can `import` it without colliding with anything in core. The unreal modifier's package is `are_self_unreal`.

The package's `__init__.py` typically re-imports the submodules that carry the registration calls:

```python
from . import handlers       # noqa: F401 — registers native handlers
from . import log_parsers    # noqa: F401 — registers LogParserFactory strategies
```

That way, importing the package for any reason — by the loader, by tests, by another modifier — fires every registration the modifier wanted.

## The three registration surfaces

Your modifier contributes code by calling registration functions that existing brain regions expose. Today there are three.

**Native handlers** — `register_native_handler(slug, callable)` from `central_nervous_system/effectors/effector_casters/neuromuscular_junction.py`. These are the Python callables that run when an Effector's slug resolves to modifier-provided behavior. Pair each handler with an `Effector` row in your `modifier_data.json` whose `slug` matches the registration. The unreal modifier's `update_version_metadata` handler is the canonical example.

**Parietal MCP tools** — `register_parietal_tool(name, coroutine)` from `parietal_lobe/parietal_mcp/gateway.py`. These pair with a `ToolDefinition` row in your `modifier_data.json`: the row describes the tool schema the [Frontal Lobe](../brain-regions/frontal-lobe) hands to the LLM, the coroutine is what actually runs when the LLM calls the tool. Both halves need to ship together — a tool with no coroutine fails at call time, a coroutine with no `ToolDefinition` is invisible to reasoning.

**Log parser strategies** — `LogParserFactory.register(log_type, strategy_cls)` from `occipital_lobe/log_parser.py`. These let your modifier teach the [Occipital Lobe](../brain-regions/occipital-lobe) how to make sense of a new flavor of log output.

All three follow the **unregister-then-register** convention. The loader pops your entry module out of `sys.modules` and re-imports it, which means registration code runs more than once in the life of the process. Each register call should `unregister(slug)` first (idempotent — no-op if the slug wasn't there) so repeat imports don't raise on duplicate registration.

## URL routes — the optional fourth surface

If your modifier's package exports a `V2_GENOME_ROUTER` (a DRF `routers.SimpleRouter()` with viewsets registered), Are-Self's V2 URL conf will auto-discover it at module-import time. The discovery loop walks installed modifiers, ensures each one's `code/` is on `sys.path`, imports its `urls` module, and lifts its `V2_GENOME_ROUTER` into the core router.

The shape your modifier's `urls.py` should follow:

```python
from rest_framework import routers
from . import views

V2_GENOME_ROUTER = routers.SimpleRouter()
V2_GENOME_ROUTER.register(r'<your-prefix>', views.YourViewSet, basename='your-prefix')
```

Prefix collisions refuse loudly. Missing `urls.py` is fine. A broken `urls.py` (one that raises on import) fails loudly with the import error preserved. NeuralModifiers without route contributions just don't ship a `urls.py`.

## Lifecycle from your point of view

**Install.** A user installs your modifier through the [Modifier Garden](../ui/modifier-garden) or `POST /api/v2/neural-modifiers/catalog/<slug>/install/`. The loader: extracts the zip into `neuroplasticity/operating_room/<tempdir>/`, validates the manifest, copies `code/` to `grafts/<slug>/`, deserializes `modifier_data.json` into rows tagged with your modifier's `genome`, imports your entry modules to fire registration, then nukes the operating-room tempdir. A coordinated process restart cycles the Celery worker and Daphne child so `sys.path` updates take effect.

**Use.** Once installed, your handlers are wired up, your tools are in the manifest the LLM sees, your log parsers are registered, your URL routes (if any) are mounted. Just like core.

**Save.** If you've made edits in `grafts/<slug>/code/` and want them committed back to the catalog, the save-to-archive flow re-zips the live grafts directory and the modifier's owned rows into `genomes/<slug>.zip`, semver-patch-bumping the version, copying the previous `<slug>.zip` to `<slug>.zip.bak` first. Save refuses to write a zip without findable entry modules. The staged zip is re-opened to verify validity before the catalog `os.replace` lands. Round-trip from edit-in-place to committed archive is one call.

**Uninstall.** The genome cascade walks every `GenomeOwnedMixin` model and deletes rows whose `genome` matches your modifier. INCUBATOR-owned rows (core) are never touched. Your `NeuralModifier` row is deleted last. Disk cleanup of `grafts/<slug>/` is deferred to the next boot's orphan sweep. Another process restart cycles the workers.

## The acceptance test — round-trip

A modifier that can't round-trip isn't ready. The acceptance shape:

1. **Install cleanly** from a fresh state. Manifest validates. Rows deserialize. Entry modules import without raising. Registration calls land. No errors in the install log.
2. **Behave correctly** while installed. Your handlers run when their effectors fire. Your tools appear in reasoning sessions and execute when called. Your log parsers attach to log sessions of your declared type.
3. **Uninstall and leave zero leftover rows.** The genome cascade reaches every row your modifier owns. The contribution log shows `contributions_unresolved: 0` — every contribution was reachable and deleted.
4. **Reinstall after uninstall** and end up in the same state as step 1. No leftover state, no half-installed remnants.

The unreal modifier's round-trip is exercised by `neuroplasticity/tests/test_install_unreal_bundle.py` in the api repo (six scenarios). Cribbing that test shape for your own modifier is the recommended starting point.

## Common pitfalls

- **`unregister` calls that aren't idempotent.** If your `unregister_native_handler` raises when the slug isn't already registered, repeat imports will fail. The contract is: unregister is a no-op when the target isn't there.
- **Re-using UUIDs across modifiers.** Don't. Each modifier's `modifier_data.json` should contain UUIDs that exist nowhere else. Collisions break the genome cascade.
- **Hand-editing `manifest.json` on disk.** The hash check at boot will flip the modifier to BROKEN. Edit the source you're authoring against, save through the save-to-archive flow, let it bump the version and freeze a fresh hash.
- **Forgetting to ship the `ToolDefinition` for a Parietal tool.** A registered coroutine with no DB row is invisible to reasoning sessions. Both halves ship together.
- **Importing core models at module top-level in `code/`.** If your import order is wrong relative to Django's app loading, you'll get `AppRegistryNotReady`. Move ORM access inside functions, not module scope.
- **Leaving the modifier's `requires:` empty when you depend on something.** The upgrade flow uses `requires:` to refuse unsafe upgrades. Declare what you need.

## Where the conventions live

The authoritative reference for the manifest schema, the contribution format, and the registration call signatures lives in two places: the api repo's `neuroplasticity/genomes/unreal.zip` (extract and read its README + `manifest.json`), and `are-self-api/CLAUDE.md` (the Standing Rulings section, which is updated as conventions evolve).

If you find a gap — something this page doesn't cover that you needed to know — open an issue or a PR. NeuralModifier authors are the people who will encounter the missing pieces first.
