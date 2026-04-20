# Are-Self Docs — Tasks

Documentation site tasks for the Docusaurus deployment at are-self.com.
**Released: April 7, 2026.** Curriculum migrated to
[`are-self-learn`](https://github.com/scipraxian/are-self-learn) on
April 14, 2026 and is now merged into the site at `/learn/` via the
composite GitHub Pages deploy.

Last updated: April 19, 2026.

> **Curriculum planning lives elsewhere.** The `are-self-learn` repo
> owns all curriculum work (course catalog, tag taxonomy, frontmatter
> schema, linter, worksheets). Its `PLAN.md` is the memory layer. If
> a task here touches curriculum, cross-reference that repo first.

## Open

### Polish

- [ ] **Migrate `onBrokenMarkdownLinks` config** to
  `siteConfig.markdown.hooks.onBrokenMarkdownLinks` (Docusaurus v4
  deprecation warning). Note: the setting is deliberately `'warn'`,
  not `'throw'`, because `/learn/*` paths don't resolve in a docs-only
  build — the learn sub-site is merged in at deploy time. Keep that
  behavior when moving the key.
- [ ] **Compile LaTeX papers to PDF** (lives in `are-self-research`,
  tracked here because the docs site cross-links to them). `pdflatex`
  needs the `apa7` document class; easiest path is Overleaf import.
- [ ] **Review/update the API and UI repo READMEs** (GitHub landing
  pages — not this repo, tracked here because the docs site links to
  them).

### Post-release backlog

- [ ] Migrate `api-reference.md` content into structured Docusaurus
  pages with try-it links.
- [ ] Add versioning for docs.
- [ ] CI/CD polish — the deploy workflow exists; revisit for preview
  builds, cache hit-rates, and build-time reporting once we have real
  traffic signal.
- [ ] Research papers polish: complete flagship
  `neuro-mimetic-architecture` paper (Evaluation TODOs), flesh out the
  remaining five paper drafts, add `.bib` files, verify PDF output.

## Completed

### Release-day (April 7, 2026)

- [x] **GitHub Actions deploy workflow** — `.github/workflows/deploy.yml`
  builds both `are-self-docs` and `are-self-learn` and deploys the
  merged tree to GitHub Pages. Triggers on push to `main` and on
  `repository_dispatch: [learn-updated]` from the learn repo.
- [x] **OpenRouter documentation** — `docs/openrouter.md`, linked from
  the sidebar; Hypothalamus docs cross-reference it.
- [x] **FAQ page** — `docs/faq.md`, linked from the sidebar.
- [x] **Homepage visual refresh** — hero image, six audience "doors"
  (Teacher, Student, Developer, Curious, Researcher/Journalist,
  Corporate Trainer), embedded YouTube explainer, news strip, twelve-
  variables scipraxian strip.
- [x] **Blockquote color contrast** — blockquote text uses
  `var(--text-primary)` (rgba 0.95). WCAG AA cleared.

### Site integration

- [x] **are-self-learn merged at `/learn/`** — navbar "Learn" item,
  footer "Learn" column (All Courses, Glossary, Storybook, GitHub),
  two homepage doors (Teacher, Corporate Trainer), news-strip feature
  card. Uses `pathname:///learn/` to bypass React Router for real
  navigations into the sub-site.
- [x] **Service-worker unregister** — `static/sw.js` self-unregisters;
  `src/clientModules/unregisterStaleSW.js` handles visitors whose
  browser hasn't run the SW update check yet. (A prior deploy had
  intercepted `/learn/` nav and served the docs site's cached 404.)
- [x] **Local search** — `@easyops-cn/docusaurus-search-local` builds
  a Lunr index at build time; navbar search box with keyboard shortcut.
- [x] **Storybook page** — `docs/storybook.md` (Chapters 1–7 +
  Epilogue, author notes stripped). Sidebar-registered. `/docs/storybook`
  is the "Start with the Story" entry point on the homepage.
- [x] **Curriculum migrated out** — `docs/curriculum/` removed; all
  curriculum content lives in `are-self-learn` and renders at `/learn/`.

### Content

- [x] **All 11 brain-region docs rewritten** kid-friendly, biology-first,
  with inline code breadcrumbs: hypothalamus, frontal-lobe,
  central-nervous-system, hippocampus, identity, parietal-lobe,
  peripheral-nervous-system, prefrontal-cortex, synaptic-cleft,
  temporal-lobe, thalamus. Hypothalamus and frontal-lobe were rewritten
  against the actual codebase; the other nine inherited content from
  the previous agent's text and may carry small inaccuracies worth
  spot-checking.
- [x] **Additional brain-region pages** — occipital-lobe and
  neuroplasticity (not in the original eleven).
- [x] **All 11 UI walkthrough pages** — cns-editor (full walkthrough
  with 4 real screenshots) plus the ten follow-on pages
  (blood-brain-barrier, identity, temporal-lobe, prefrontal-cortex,
  cns-monitor, frontal-lobe, hippocampus, hypothalamus, environments,
  pns). Each has intro, "Getting There," annotated panels, and Key
  Concepts glossary.
- [x] **Quick Start guide** — `docs/quick-start.md`.
- [x] **MCP server docs** — `docs/mcp-server.md`.
- [x] **Axoplasm docs** — `docs/axoplasm.md`.
- [x] **Dependency audit page** — `docs/dependency-audit.md`.
- [x] **Architecture page rewrite** — `docs/architecture.md` kid-friendly
  tone, every brain-region mention is a link, escaped `{{`/`}}` templates
  for MDX, Data Flow Principles completed.
- [x] **Research docs page** — `docs/research.md` summarizes all six
  papers; navbar, footer, and homepage all cross-link to it.
- [x] **Research cross-linking** — navbar, footer (Research Papers +
  GitHub), homepage door.
- [x] **Security documentation suite** — five docs in `docs/security/`.
- [x] **`are-self-research` README** — complete rewrite with paper
  table and build instructions.
- [x] **All six LaTeX paper outlines seeded** in
  `are-self-research/papers/`.
- [x] **Flagship paper draft** — `neuro-mimetic-architecture/paper.tex`
  is the most complete (Evaluation section still has TODOs).
- [x] **15 screenshots captured** (html2canvas + IBS) in
  `static/img/ui/`.
- [x] **501(c)(3) claim removed** from `docs/contributing.md`.

### Theme & platform

- [x] **Glassmorphic dark-only theme** in `src/css/custom.css`.
- [x] **Logo + favicon** — `static/img/logo.png`, `static/img/favicon.ico`.
- [x] **Hero button visibility** — dark-theme styles for
  `button--secondary` and `button--outline`.
- [x] **`a::after` animated underline scoped to `.markdown a`** —
  previously applied globally, caused artifacts on sidebar/navbar/buttons.
- [x] **MDX curly-brace escaping** — `{id}`, `{value}`, `{query}`
  escaped to HTML entities across brain-regions, api-reference, and
  architecture. `<` + digit pattern rewritten as prose.
- [x] **Truncated config files restored** — package.json, sidebars.js,
  custom.css, index.js, index.module.css (had been corrupted by an
  interrupted write; restored from git + manual repair).
- [x] **Corrupted CNS screenshots restored** — four `static/img/ui/`
  files had been overwritten with 4,789-byte stubs; restored from
  `git show HEAD:…`.
- [x] **Broken-link sweep** — patched in contributing, getting-started,
  research, sbom, quick-start, environments, pns, hippocampus,
  hypothalamus, frontal-lobe.
