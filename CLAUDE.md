# CLAUDE.md — Are-Self Documentation Site

The single source of truth for any AI agent working on the `are-self-docs`
codebase. Read completely before making any changes.

> **Active work lives elsewhere.** See `TASKS.md` for in-progress items
> and the companion repos' TASKS.md for cross-repo threads. `git log` is
> the changelog. Do NOT replay session diaries in this file — when work
> lands, lift the durable rule into the appropriate section below, then
> delete the notes. This file is the *standing reference*.

## What This Is

A Docusaurus 3.x documentation site for **Are-Self**, an open-source
neurologically-inspired AI reasoning engine. Dark-only glassmorphic theme.
Deployed at [are-self.com](https://are-self.com) via GitHub Pages.
**Public release: April 7, 2026.**

**Sister repos** (all under [scipraxian](https://github.com/scipraxian)):

- [are-self-api](https://github.com/scipraxian/are-self-api) — Django 6.x backend (brain regions as Django apps)
- [are-self-ui](https://github.com/scipraxian/are-self-ui) — React/Vite/TypeScript frontend
- [are-self-research](https://github.com/scipraxian/are-self-research) — Academic papers (LaTeX, APA 7th edition)
- [are-self-learn](https://github.com/scipraxian/are-self-learn) — Curriculum layer for kids and the grownups who teach them (launched 2026-04-14). Merged into this site at `/learn/` by the composite deploy.

## Running Locally

```bash
npm install
npm start        # http://localhost:3000
```

After changing `docusaurus.config.js` or `src/pages/index.js`, the dev
server often needs a manual restart (`Ctrl+C` then `npm start`) — hot
reload doesn't always pick up config changes.

## Standing rulings (project-wide)

Rulings that outlive any one task. Do not re-litigate or forget these.

- **`baseUrl` stays `/`.** The site deploys via GitHub Pages to the
  root of `are-self.com` and the Pages workflow depends on that. A
  previous attempt to move it to `/docs/` broke the Pages build. Do
  not change `baseUrl` without also retargeting the deployment.
- **`onBrokenLinks` / `onBrokenMarkdownLinks` are deliberately `'warn'`,
  not `'throw'`.** `/learn/*` paths point at the `are-self-learn`
  sub-site, which is built separately and merged into `build/learn/`
  by the composite deploy workflow. Local and CI docs-only builds
  cannot see those paths. If the Docusaurus v4 migration moves the
  key to `siteConfig.markdown.hooks.onBrokenMarkdownLinks`, keep the
  `'warn'` behavior.
- **`/learn/*` links use `pathname:///learn/…`** (the Docusaurus
  escape hatch), not plain `to='/learn/…'`. React Router would
  otherwise intercept the click, fail to match a registered SPA
  route, and Docusaurus would serve its own 404. Rendered anchors
  need `target: '_self'` too — see the navbar and footer config for
  the pattern. The homepage has an `isLearnLink()` helper that
  renders `/learn/*` as a plain `<a>` for the same reason.
- **Dark-only.** Color mode switch is disabled. Every new component
  must work on the dark background without a light-mode escape hatch.
- **MDX curly-brace escaping.** MDX interprets `{id}` in markdown as
  a JSX expression and crashes pages containing URL patterns like
  `/api/v2/spiketrains/{id}/`. Escape with HTML entities
  (`&#123;id&#125;`) or wrap in a code fence. `{{` and `}}` in
  template examples (e.g. Django context `{{project_root}}`) also
  need entity escaping — already applied across `brain-regions/*.md`,
  `api-reference.md`, and `architecture.md`.
- **`<` + digit is a JSX-tag trap.** Table cells or inline prose
  containing `<` immediately followed by a digit (`<90%`, `<2.4.0`)
  get parsed as HTML tags by MDX. Rewrite as prose — "less than 90%",
  "older than 2.4.0".
- **`a::after` underline is scoped to `.markdown a` only.** Applying
  the animated underline globally produced visual artifacts on
  sidebar menu items, navbar links, buttons, and breadcrumbs.
  Explicit `display: none !important` overrides exist for
  `.menu__link::after`, `.navbar__link::after`, `.button::after`, etc.
- **Verify config-file edits before shipping.** A past write was
  truncated mid-stream and corrupted `package.json`, `sidebars.js`,
  `custom.css`, `src/pages/index.js`, and `src/pages/index.module.css`
  simultaneously — all had to be restored from `git show HEAD:…`.
  After writing any config file, confirm with `npm run build` or at
  minimum check integrity with `wc -l` against git.
- **Service-worker caching.** A prior deploy registered an
  aggressive service worker at `/sw.js` that began intercepting
  `/learn/` navigations and serving the docs site's cached 404.
  `static/sw.js` now contains a self-unregistering script, and
  `src/clientModules/unregisterStaleSW.js` handles visitors whose
  browser hasn't run the SW update check yet. Do not re-register a
  service worker without a full migration plan.
- **Concrete hardware guidance lives at `/will-it-run`, nowhere else.**
  RAM thresholds, GPU/VRAM tables, per-model footprints, "can my
  laptop handle this" answers, quantization trade-offs — all of it
  belongs on a single canonical page (`are-self.com/will-it-run`, or
  its equivalent slug once the page lands in this docs tree). Brain-
  region pages, `architecture.md`, FAQ, storybook, and UI walkthroughs
  must NOT grow their own hardware sections; when they need to gesture
  at requirements they link to `/will-it-run` and move on. The one
  allowed exception is the short install-gating line in
  `quick-start.md` ("16 GB RAM, ~30 GB disk") — that's the floor a
  reader needs *before* they decide to install, not capacity planning,
  and it stays. Do not duplicate it elsewhere.

  When a reader asks a hardware question on any other page, in chat,
  or in an issue, follow the scipraxian posture — remember the
  audience is a curious ten-year-old and a grandparent with a
  five-year-old laptop, not a GPU benchmarker. Answer kindly and in
  one line, never gatekeep, never imply the hardware is the wall. Then
  route them at `/will-it-run` for the full table, and — this part is
  load-bearing — remind them that **there is always a free cloud
  endpoint somewhere if they're willing to dig a little**. OpenRouter's
  free tier is the documented first stop (`/docs/openrouter`); the
  scipraxian line that AI must not be locked behind a credit card or a
  gaming rig holds here too. A ten-year-old with curiosity and a
  working internet connection should never be told "your computer
  isn't good enough" without also being told "and here's how you run
  it anyway."

  Background for the one-line answers (so the agent can respond
  accurately without quoting a spec sheet from memory — route to
  `/will-it-run` for precise numbers):

  - **The zygote baseline** — what `zygote.json` actually ships and
    what the installer pulls — is tuned to run on a mid-range laptop
    from the last five years. 16 GB RAM, no discrete GPU required,
    CPU inference via Ollama with `llama3.2` (~2 GB on disk) for
    reasoning and `nomic-embed-text` (~500 MB) for the Hippocampus's
    768-dim embeddings. That's the floor, it's the floor on purpose,
    and it's the floor the storybook and `/learn/` copy promise.
  - **More advanced genotypes** — larger identities, richer addon
    stacks, bigger catalog entries the user pulls in past the zygote
    — climb the ladder. 7B-class models are happiest with ~8 GB
    VRAM, 14B-class want ~16 GB VRAM, 70B-class want serious iron or
    a cloud fall-back. Quantization (Q4_K_M and friends) shaves those
    numbers. Do not invent specific thresholds in prose; point to
    `/will-it-run`.
  - **The cloud-endpoint escape hatch** — if local is a no-go, the
    user has options. OpenRouter's free-tier models (see
    `/docs/openrouter`) route through the Hypothalamus just like
    Ollama does; the Frontal Lobe doesn't care which side of the
    wire the tokens came from. That's the answer for the kid with a
    Chromebook.

  Where the `/will-it-run` page should learn its numbers from:
  `hypothalamus/` model catalog, the `openrouter.md` doc for the
  cloud tier, and Ollama's own model library page for the on-disk and
  resident footprints. Keep that single page authoritative so the rest
  of the tree can link to it without drift.

## Theme

Dark-only glassmorphic. All styling in `src/css/custom.css`. Key colors:

- Background: `#0a0a0f` → `#1a1a2e` gradient
- Glass panels: `rgba(26, 26, 46, 0.6)` + `backdrop-filter: blur(12px)`
- Border: `rgba(255, 255, 255, 0.1)`
- Accents: teal `#06b6d4`, purple `#a855f7`, amber `#f59e0b`, indigo `#6366f1`
- Text: primary `rgba(255,255,255,0.95)`, secondary `0.7`, tertiary `0.5`

Blockquotes use `var(--text-primary)` for body text (rgba 0.95) for WCAG
AA contrast on the dark panel background. Nested blockquotes shift the
accent border to amber for visual hierarchy.

## Architecture Overview (for context)

Are-Self maps brain regions to Django apps. The tick cycle runs:
PNS → Temporal Lobe → CNS → Frontal Lobe → Parietal / Hippocampus / Hypothalamus.

Key components:

- **CNS** — Central Nervous System: neural pathway graph editor (ReactFlow-based), spike trains
- **Frontal Lobe** — LLM reasoning engine with addon-based prompt assembly
- **Hippocampus** — Vector-embedded memory (pgvector, 768-dim, cosine similarity)
- **Hypothalamus** — Model catalog, routing, budgets, circuit breakers, Ollama + OpenRouter
- **Parietal Lobe** — Tool execution ("hallucination armor")
- **PFC** — Prefrontal Cortex: task/project management
- **PNS** — Peripheral Nervous System: worker fleet discovery/coordination
- **Temporal Lobe** — Scheduled task definitions and iterations
- **Identity** — Agent identity sheets with addon/tool configurations
- **Synaptic Cleft** — Real-time event bus (Django Channels/WebSocket)

CNS Graph Editor node types (UUID constants, not integer PKs): Begin Play,
Gate, Retry, Delay, Frontal Lobe, Debug. Axon ports: FLOW, SUCCESS, FAIL.

**Focus Economy:** agents earn execution budget by saving novel memories
(engrams with less than 90% cosine similarity to existing knowledge).
Prevents infinite loops and degenerate behavior.

## Content Conventions

### Brain-Region Docs (`docs/brain-regions/`)

Write for a curious 10-year-old who's never heard of a hypothalamus. The
biological analogy is the entry point, woven naturally into the
explanation — **never a separate "Biological Analogy" section.**

- Open with real-world biology, woven into the Are-Self explanation
- Every brain-region mention is a `[link](./slug)` — no bare text
- Explain like you're talking to someone excited and curious, not
  reading a spec
- Technical details (field names, method names) are fine, introduced
  through story
- API endpoint tables stay, but push them to the bottom
- End with a "How It Connects" section that links to every related region

**Inline code breadcrumbs, NOT fenced Python blocks.** Code references
go inline in the English prose, where the reader would naturally wonder
"where is that exactly?" — drop in a short inline reference like
`turn.apply_efficiency_bonus()` or `frontal_lobe/synapse_client.py`.
Short controlled bursts. One line. In the flow. NOT a separate section
or teaching moment — a reference.

The Tick Cycle in `architecture.md` is the exception — it uses two full
diagram blocks (English then Python file paths) because it's mapping
the entire system flow.

Hypothalamus and Frontal Lobe docs were rewritten directly against the
codebase with verified technical details. The other nine brain-region
docs were rewritten from prior doc content and may carry small
inaccuracies inherited from earlier agents — spot-check against the
code when touching them.

### UI Walkthrough Pages (`docs/ui/`)

Each page follows the same structure:

1. Frontmatter with `id`, `title`, `sidebar_position`
2. Intro paragraph explaining the page's purpose
3. "Getting There" section with navigation instructions
4. Annotated screenshots with descriptive prose (not bullet lists)
5. Key concepts glossary at the bottom

Images referenced as `/img/ui/filename.png` (Docusaurus static path).
Screenshot file convention: `static/img/ui/` with kebab-case names
matching the walkthrough page (e.g., `cns-dashboard.png`,
`cns-pre-release-editor.png`).

### Sidebar Structure (`sidebars.js`)

Main categories: `intro` → Getting Started → The Brain (architecture +
brain-regions + axoplasm) → UI Walkthrough → OpenRouter → API Reference
→ MCP Server → Security → Storybook → FAQ → Contributing → Style Guide
→ Features → Acknowledgments.

## Screenshot Capture for UI Walkthroughs

**Problem:** The Chrome MCP `save_to_disk` flag stores screenshots in
the extension's in-memory store (accessible to the AI agent but NOT
written to the filesystem). Playwright cannot install browser binaries
in the Cowork sandbox.

**Workaround — html2canvas via JavaScript injection.** Navigate to the
target page in the Chrome MCP tab, then run this via `javascript_tool`:

```javascript
(async function() {
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
  document.head.appendChild(script);

  return new Promise((resolve) => {
    script.onload = async () => {
      try {
        const canvas = await html2canvas(document.body, {
          backgroundColor: '#0a0a0f',
          scale: 1,
          width: window.innerWidth,
          height: window.innerHeight,
        });

        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'FILENAME_HERE.png';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          resolve('Download triggered');
        }, 'image/png');
      } catch(e) {
        resolve('Error: ' + e.message);
      }
    };
    script.onerror = () => resolve('Failed to load html2canvas');
  });
})()
```

This triggers a browser download to the user's Downloads folder. The
user then moves the file to `static/img/ui/`. html2canvas renders the
DOM (not a pixel-perfect browser screenshot) so complex WebGL/canvas
elements may not capture perfectly — for those, Michael uses IBS
(screen capture tool) manually.

**html2canvas CSS `color()` limitation.** Pages using Three.js / React
Three Fiber (Frontal Lobe session detail, Background Canvas) use the
CSS `color()` function which html2canvas 1.4.1 cannot parse. For these
pages, use IBS or browser devtools screenshot instead.

## Site Integration

### Composite Deploy (`.github/workflows/deploy.yml`)

Triggers:

- `push` to `main` on this repo
- `repository_dispatch` type `learn-updated` fired by the
  `are-self-learn` repo when it changes

Steps: checkout both repos → `npm ci && npm run build` on this repo →
`npm ci && npm run build` on `are-self-learn/site` → copy learn build
into `build/learn/` → upload merged artifact → deploy to GitHub Pages.

### `/learn/` Cross-Site Linking

The are-self-learn sub-site is served from `/learn/` on are-self.com.
The docs SPA has no React Router route for it — any `<Link to='/learn/…'>`
gives a client-side 404. Always route cross-site links through
`pathname:///learn/…`:

- **Navbar item:** `href: 'pathname:///learn/'`, `target: '_self'`
- **Footer items:** same pattern
- **Homepage cards:** `src/pages/index.js` has an `isLearnLink()`
  helper that renders `/learn/*` as `<a href=…>` instead of `<Link>`

### Research Cross-Linking

- `docusaurus.config.js` navbar has Research link → `/docs/research`
- Footer has Research Papers link + GitHub (Research) link
- Homepage door "I am a Researcher / Journalist" links to
  `/docs/research`
- `docs/research.md` summarizes all six papers with links to the
  are-self-research repo

## Security Docs

Located in `docs/security/`. Five files plus the landing page:

- `security.md` — landing page
- `security/data-flow-privacy.md` — COPPA/GDPR/HIPAA/FERPA alignment
- `security/responsible-ai.md` — Focus Economy, safety for minors
- `security/incident-response.md` — CVE response process
- `security/sbom.md` — Software bill of materials
- `dependency-audit.md` — sibling page, linked from the Security sidebar

**SBOM trap:** Table cells containing `<` followed by digits will be
interpreted as HTML tags by MDX. Use prose like "older than 2.4.0"
instead of `<2.4.0` (see the Standing Rulings note above).

## Research Papers (are-self-research repo)

All 6 papers have substantial LaTeX outlines in `papers/*/paper.tex`.
The flagship `neuro-mimetic-architecture` paper has the most content
(full draft with TODO evaluation sections).

`pdflatex` is available in the Cowork sandbox at `/usr/bin/pdflatex`.
Compile with:

```bash
cd papers/neuro-mimetic-architecture
pdflatex paper.tex
biber paper        # if biber is available; otherwise skip bibliography
pdflatex paper.tex
pdflatex paper.tex
```

The `apa7` document class is required. If not installed, papers can
also be compiled via [Overleaf](https://overleaf.com) by importing the
paper directory.

## Homepage (`src/pages/index.js`)

- **Hero:** `static/img/hero.png` + title + tagline + two CTAs
  ("Start with the Story" → `/docs/storybook`, "For Developers" →
  `/docs/quick-start`)
- **Six audience doors:** Teacher (→ `/learn/…`), Student
  (→ storybook), Developer (→ quick-start), Curious (→ architecture),
  Researcher/Journalist (→ research), Corporate Trainer (→ `/learn/`)
- **Video section:** embedded YouTube explainer
- **News strip:** three cards (launched are-self-learn, SDCC 2026 on
  the Haunted Space Hotel booth, storybook read tonight)
- **Variables strip:** the twelve scipraxian variables as a quiet band
  linking out to scipraxian.org

Each card has glassmorphic hover effects defined in `index.module.css`.

## Scipraxianism

Are-Self exists inside a philosophy called **Scipraxianism**, co-developed
by Michael Clark ("The Scipraxian") and **Andrew Piper** over many years.
You do not need to master it to work in this repo, but if a design
question touches *why* something is free, local, or shaped the way it
is, the answer usually traces back to scipraxianism. The Creed is
AI-facing (ten binary-numbered assertions at
[scipraxian.org](https://scipraxian.org)). The working layer is the
**Twelve Variables**: Inclusion · Humility · Inquiry · Fulfillment or
Happiness · Religion or Profit · Fun · Fear · Responsibility ·
Perseverance · Perception · Time · Permadeath. The first three are the
kid-scale compression used in the curriculum and the storybook — **do
not mistake the three for the whole philosophy**.

Are-Self is Michael's solo handiwork (though he bounces everything off
Andrew, the way they always have). The sister franchise **Haunted Space
Hotel** is Andrew and Michael jointly — HSH's in-world Factional
Omniarchy of Snohe is the galactic government that adopted
scipraxianism as its official ethical framework. HSH lives at
[hauntedspacehotel.com](https://hauntedspacehotel.com) and is
deliberately kept off the scipraxian GitHub profile.

Full Claude-facing briefing: `are-self-documents/scipraxian/scipraxian-tldr.md`.
Master reference: `are-self-documents/scipraxian/scipraxian.md`.
