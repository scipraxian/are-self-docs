# Are-Self Docs — Tasks

Documentation site tasks for the Docusaurus deployment at are-self.com.
**Release: April 7, 2026.**

Last updated: April 6, 2026 (end of session 2).

## Completed

- [x] **CNS Editor walkthrough** (`docs/ui/cns-editor.md`) — Full content with 4 real screenshots
- [x] **API Reference crash fix** — MDX curly brace escaping (`{id}` → `&#123;id&#125;`)
- [x] **Hero button visibility** — Added dark-theme styles for `button--secondary` and `button--outline`
- [x] **Sidebar arrow artifacts** — Scoped `a::after` animated underline to `.markdown a` only
- [x] **501(c)(3) claim removed** from `docs/contributing.md`
- [x] **Research docs page** (`docs/research.md`) — Summaries of all 6 papers
- [x] **Research cross-linking** — Navbar, footer, homepage feature cards all link to research
- [x] **Homepage feature cards** — Now clickable links with glassmorphic hover effects
- [x] **are-self-research README** — Complete rewrite with paper table and build instructions
- [x] **All 6 LaTeX paper outlines** seeded in `are-self-research/papers/`
- [x] **Flagship paper draft** (`neuro-mimetic-architecture/paper.tex`) — Most complete
- [x] **Security documentation suite** — 5 docs in `docs/security/`
- [x] **Glassmorphic theme** — Dark-only, custom CSS complete
- [x] **CLAUDE.md** — Created and updated for session continuity
- [x] **Screenshot workflow** — html2canvas workaround documented in CLAUDE.md

## Immediate Priority — Do First

- [ ] **Verify docs site builds cleanly.** After config changes (navbar Research link, homepage
  feature card links), the dev server was showing an error page. Michael needs to restart
  `npm start`. Then verify: (1) Research appears in navbar, (2) homepage feature cards are
  clickable, (3) no build errors. Run `npm run build` to check for broken links.

- [ ] **Compile LaTeX papers to PDF.** Michael asked how to preview them. `pdflatex` is available
  in the sandbox. Compile at minimum the flagship `neuro-mimetic-architecture/paper.tex`.
  The `apa7` document class may need to be installed first. Alternative: Overleaf import.

## Tier 1 — UI Walkthroughs (10 remaining stubs)

All pages at `docs/ui/` except `cns-editor.md` are stubs. Each needs: purpose, how to get there,
panel layout, key interactions, and screenshots at 1280x800 with cropped detail shots.

- [ ] `ui/blood-brain-barrier.md` — Root dashboard: stats cards, latest spikes/sessions, quick nav
- [ ] `ui/identity.md` — Identity ledger: IdentitySheet tabs, addon/tool editors, create/forge/delete
- [ ] `ui/temporal-lobe.md` — Temporal matrix: definitions, iterations, shift columns, drag-drop forging
- [ ] `ui/prefrontal-cortex.md` — PFC board: board/backlog toggle, CRUD, filters, inspector, drill-to-edit
- [ ] `ui/cns-monitor.md` — CNS monitor: live spike train, ghost-to-color, sub-graph drill, forensics
- [ ] `ui/frontal-lobe.md` — Frontal Lobe: session list, 3D graph, chat, reasoning view, tool formatters
- [ ] `ui/hippocampus.md` — Hippocampus: engram browser, search, tag filters, provenance links
- [ ] `ui/hypothalamus.md` — Hypothalamus: model catalog, routing inspector, budgets, model inspector
- [ ] `ui/environments.md` — Environments: CRUD, context variables, inline key creation
- [ ] `ui/pns.md` — PNS fleet: worker cards, heartbeat, xterm monitor, system control

## Tier 2 — Quick Start + Broken Links

- [ ] `docs/quick-start.md` — Currently stub. Write a 5-minute quick start: install, launch, first
  identity, first reasoning session.
- [ ] Fix 6 broken markdown links in `contributing.md` (references to `STYLE_GUIDE.md` and
  `ARCHITECTURE.md`) and `getting-started.md` (references to `README.md` and `ARCHITECTURE.md`).
  These are cross-repo references that need to become either relative doc links or absolute URLs.

## Tier 3 — Research Papers Polish

- [ ] Complete flagship `neuro-mimetic-architecture` paper (has TODO subsections in Evaluation)
- [ ] Flesh out remaining 5 paper drafts beyond outlines
- [ ] Add `.bib` bibliography files to each paper directory
- [ ] Compile all papers to PDF and verify they render correctly

## Tier 4 — Polish

- [ ] Review and update API repo README.md (GitHub landing page)
- [ ] Review and update UI repo README.md (GitHub landing page)
- [ ] Verify Docusaurus sidebar navigation matches actual page structure
- [ ] Test docs site build (`npm run build`) — no warnings, no broken links
- [ ] Add Are-Self logo to docs site header/favicon

## Tier 5 — Post-Release

- [ ] Add screenshots to all UI walkthrough pages (requires running app + html2canvas or IBS)
- [ ] Migrate API_REFERENCE.md content into structured Docusaurus pages with try-it links
- [ ] Add search (Docusaurus Algolia or local search plugin)
- [ ] Version the docs for future releases
