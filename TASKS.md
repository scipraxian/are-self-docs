# Are-Self Docs — Tasks

Documentation site tasks for the Docusaurus deployment at are-self.com.
**Release: April 7, 2026.**

Last updated: April 6, 2026 (end of session 3).

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
- [x] **All 10 UI walkthrough stubs filled** (session 3) — blood-brain-barrier, identity,
  temporal-lobe, prefrontal-cortex, cns-monitor, frontal-lobe, hippocampus, hypothalamus,
  environments, pns. Each has full prose, Getting There, Key Concepts, and screenshot references.
- [x] **Quick Start guide** (`docs/quick-start.md`) — 5-minute install-to-first-spike walkthrough
- [x] **15 screenshots captured** via html2canvas + IBS, placed in `static/img/ui/`
- [x] **Broken links fixed** — contributing.md, getting-started.md, research.md, sbom.md,
  quick-start.md, environments.md, pns.md, hippocampus.md, hypothalamus.md, frontal-lobe.md
- [x] **MDX curly brace escaping** — `{id}`, `{value}`, `{query}` escaped across all brain-regions
  docs and api-reference
- [x] **Truncated config files restored** — package.json, sidebars.js, custom.css,
  index.js, index.module.css (corrupted during session 2, restored from git + manual repair)
- [x] **Corrupted CNS screenshots restored** — 4 files in static/img/ui/ had been overwritten
  with 4789-byte stubs; restored from git HEAD

## Immediate Priority — Do First

- [ ] **Run `npm run build` on Windows and confirm zero broken links.** All known broken
  links have been patched. The sandbox build compiled client+server successfully but could
  not write output files due to sandbox permissions. Build on Windows should pass cleanly.

- [ ] **Compile LaTeX papers to PDF.** `pdflatex` needs the `apa7` document class.
  Easiest path: import paper directories into Overleaf.

## Tier 3 — Research Papers Polish

- [ ] Complete flagship `neuro-mimetic-architecture` paper (has TODO subsections in Evaluation)
- [ ] Flesh out remaining 5 paper drafts beyond outlines
- [ ] Add `.bib` bibliography files to each paper directory
- [ ] Compile all papers to PDF and verify they render correctly

## Tier 4 — Polish

- [ ] Review and update API repo README.md (GitHub landing page)
- [ ] Review and update UI repo README.md (GitHub landing page)
- [ ] Add Are-Self logo to docs site header/favicon
- [ ] Migrate `onBrokenMarkdownLinks` config to `siteConfig.markdown.hooks.onBrokenMarkdownLinks`
  (Docusaurus v4 deprecation warning)

## Tier 5 — Post-Release

- [ ] Migrate API_REFERENCE.md content into structured Docusaurus pages with try-it links
- [ ] Add search (Algolia DocSearch or local search plugin)
- [ ] Add versioning for docs
- [ ] CI/CD pipeline for automated builds and deployment
