---
id: modifier-garden
title: "Modifier Garden"
sidebar_position: 12
---

# Modifier Garden

The Modifier Garden is where you install, uninstall, and inspect **NeuralModifiers** — the installable bundles Are-Self uses to grow new abilities without changing core. Every bundle that's been added to the catalog shows up here. You can browse what's available, install one, watch its lifecycle events, drill into its manifest, and remove it cleanly when you don't want it anymore. If a bundle were a houseplant, this is the windowsill.

## Getting There

Open the hamburger menu and click **Neuroplasticity / Modifiers**, or visit `/modifiers` directly. You'll land on the Modifier Garden roster.

## Modifier Garden Roster

*Screenshot pending — capture the `/modifiers` page once the dev server has a bundle in each state and add it as `static/img/ui/modifier-garden-roster.png`.*

The Garden uses the standard three-panel layout. The breadcrumb at the top reads `ARE-SELF > Modifier Garden`.

**Left panel — Filters and install** is where you narrow the catalog and bring new bundles in. A prominent **+ INSTALL FROM ZIP** button at the top lets you upload a `.zip` archive directly; it gets persisted into the catalog and the install runs against the uploaded copy. Below that, status-filter chips let you scope the table to a particular lifecycle state — **Available** (the zip is on disk but no DB row exists yet), **Installed** (rows exist, code is on `sys.path`, the bundle is alive), or **Broken** (a previously-working bundle's manifest hash drifted at boot, or an entry module raised on import). A search box at the bottom of the left panel filters the visible rows by slug or display name.

**Center panel — Bundle table** is the scannable list of every NeuralModifier the system knows about. Columns: **Slug** (the bundle's stable identifier, kebab-case), **Name** (the human-readable name from `manifest.json`), **Version** (semver, bumped on every save-to-archive), **Status** (a colored pill — green for INSTALLED, gray for AVAILABLE, amber for BROKEN), **Contributions** (how many database rows the bundle currently owns; zero for AVAILABLE), **Last event** (the most recent install / uninstall / hash-mismatch event, with a timestamp), and **Actions** (a per-row install or uninstall button depending on the current state). The table is sortable by any column; clicking a row opens it in the inspector.

**Right panel — Inspector** is empty until you select a bundle. Once a row is selected, this panel populates with the bundle's manifest details and recent installation events.

## Inspecting a Bundle

Clicking any row in the table opens its detail in the right panel.

The inspector header shows the bundle's name, version, and current status pill. Below that, a **Manifest** accordion expands to show the parsed `manifest.json` — the bundle's slug, version, author, license, declared `requires:` dependencies, and the list of `entry_modules` that the loader imports at install and on every boot. The frozen `manifest_hash` (SHA-256) is shown alongside; on every boot, the on-disk manifest is rehashed and compared, and any mismatch flips the bundle to BROKEN.

A **Recent events** accordion lists the bundle's lifecycle log in reverse chronological order. Each event row shows the event type — **Install**, **Uninstall**, **Load Failed**, **Hash Mismatch** — plus a timestamp, and an expandable JSON payload with the relevant detail (contribution count on INSTALL, resolved-vs-orphan counts on UNINSTALL, traceback on LOAD_FAILED, expected-vs-actual hashes on HASH_MISMATCH). The log is append-only; nothing here gets edited, only added.

For deeper inspection, the inspector includes a **View full detail** link that navigates to `/modifiers/<slug>` — a dedicated page with the complete manifest dump and full installation history.

## Installing a Bundle

There are two ways to bring a bundle in.

**Already in the catalog (AVAILABLE).** A bundle whose zip lives at `neuroplasticity/genomes/<slug>.zip` but has no database row shows up in the table with status AVAILABLE and an **Install** button in the Actions column. Clicking it sends a request to install the catalog-resident zip; the bundle moves through the lifecycle and lands at INSTALLED. The system performs a coordinated process restart as part of the install — install requires the bundle's `code/` directory to enter `sys.path`, which only takes full effect across a restart, so install **is** a restart by design. The page briefly shows a "rebooting" state, then the bundle reappears in INSTALLED.

**Not yet in the catalog.** Click **+ INSTALL FROM ZIP** in the left panel and select a `.zip` archive on your machine. The upload is multipart; the server saves the zip into the catalog (so it's there for next time), then runs the same install pipeline. Same restart, same outcome.

## Uninstalling a Bundle

Click the **Uninstall** button on an INSTALLED row. A confirmation dialog opens that does NOT just say "are you sure" — it shows the **impact** of the uninstall: every Django model that has rows owned by this bundle, with counts. For the unreal bundle that's typically dozens of rows across Effectors, NeuralPathways, ToolDefinitions, ContextVariables, and the unreal-specific Executables. Read the impact, confirm, and the uninstall fires.

The uninstall walks every `GenomeOwnedMixin` model and deletes rows whose `genome` foreign key matches the target bundle. INCUBATOR-owned rows (core) are never touched — the cascade only reaches what the bundle actually owns. The bundle's `NeuralModifier` row itself is deleted last, leaving the bundle in AVAILABLE state (the zip on disk, no DB row). Disk cleanup of `grafts/<slug>/` happens on the next boot's orphan sweep — Windows file locks won't let `rmtree` succeed while the importing process is still running, so the cleanup is deferred to the freshly-spawned post-restart process.

Uninstall also triggers a process restart, for the same reason install does: removing code from `sys.path` only takes full effect across a restart.

## The BROKEN State

A bundle flips to BROKEN under three conditions, all at boot:

- **Manifest hash drift.** The on-disk `manifest.json` no longer matches the SHA-256 stored on the `NeuralModifier` row. Someone — or something — edited the manifest after install.
- **Manifest missing.** The zip's `manifest.json` can't be found or parsed.
- **Entry module raised.** One of the manifest's `entry_modules` raised an exception during the boot import.

A BROKEN bundle's row still exists, but its registration calls didn't fire — its tools don't appear in any reasoning session, its native handlers aren't wired up. The Garden surfaces BROKEN with an amber pill and the inspector's event log shows the diagnostic detail. Recovery is **uninstall the broken bundle, then reinstall** — there's no in-place repair flow.

## Key Concepts

**NeuralModifier**: An installable bundle of new abilities. Ships as a single `.zip` at `neuroplasticity/genomes/<slug>.zip`. Contains a `manifest.json`, a `modifier_data.json` (Django-serialized rows), a `code/` directory (Python package), and a `README.md`.

**Lifecycle states**: AVAILABLE (zip on disk, no DB row), INSTALLED (rows exist, code on `sys.path`, alive), BROKEN (was installed, something drifted at boot).

**Genome cascade**: Every database row that could be contributed by a bundle carries a `genome` foreign key. Core rows point at INCUBATOR; bundle rows point at their bundle's `NeuralModifier` row. Uninstall walks this foreign key and removes only what the target bundle owns.

**Contribution count**: How many database rows currently point at this bundle's `genome`. Zero for AVAILABLE bundles. Bumps up at install, drops to zero at uninstall.

**Manifest hash**: A SHA-256 of the bundle's `manifest.json`, frozen on the `NeuralModifier` row at install time. Re-checked on every boot. Mismatch flips the bundle to BROKEN.

**Entry module**: A Python module path listed in the manifest's `entry_modules`. The loader imports each entry module at install and on every boot to run the bundle's registration calls. The unreal bundle's entry module is `are_self_unreal`.

**Process restart**: install / uninstall / catalog-install actions trigger a coordinated restart — the Celery worker is shut down to drain in-flight tasks, a fresh worker is spawned, and Django's autoreloader cycles the Daphne child. The Garden's "rebooting" state surfaces this in the UI.

**INCUBATOR**: The canonical "core, not from any bundle" genome. Default value of `genome` on every `GenomeOwnedMixin` model. Protects core from ever being cascade-deleted by an uninstall.
