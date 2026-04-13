# TICKET: Multi-language Translation for Are-Self Docs

> **Scope note:** This ticket is deliberately carved out as a standalone file — **it is OUT OF SCOPE for the current release**. It lives here so it can be planned, estimated, and scheduled independently of the current docs push. Do not roll this into `TASKS.md` until it is greenlit.

**Status:** backlog / unscheduled
**Owner:** _unassigned_
**Created:** 2026-04-10
**Related repo:** `are-self-docs` (Docusaurus)
**Depends on:** English docs frozen enough to be worth translating (i.e. don't start until the English ship is stable)

---

## Goal

Ship the Are-Self documentation site in multiple languages, using Docusaurus's native i18n system, with a translation workflow that lives in GitHub so community contributors can submit translations via pull requests — the same way the React, Vite, Next.js, and Vue docs do it.

## Why this is a separate ticket

Translating docs is a rabbit hole. It touches tooling, content freeze policy, contributor workflow, CI, the navbar, the sidebar, routing, and SEO. None of that belongs in the current release scope. This file exists so none of it sneaks in by accident.

---

## How GitHub / Docusaurus actually do "multiple languages"

GitHub itself doesn't have a built-in "translate this repo" feature. What projects actually do is one of these patterns — in descending order of how well they fit Are-Self:

### Pattern A — Docusaurus native i18n (**recommended**)

Docusaurus has first-class internationalization. It is already configured in `docusaurus.config.js`, just stubbed to `['en']`:

```js
i18n: {
  defaultLocale: 'en',
  locales: ['en'],
},
```

The workflow looks like this:

1. Add locales to the config (e.g. `['en', 'es', 'fr', 'de', 'ja', 'zh-Hans', 'pt-BR']`).
2. Run `npx docusaurus write-translations --locale <locale>` for each new locale. This scaffolds a `i18n/<locale>/` directory containing:
   - `docusaurus-plugin-content-docs/current/` — mirrored markdown files (translators edit these)
   - `docusaurus-theme-classic/navbar.json`, `footer.json` — UI chrome strings
   - `code.json` — React component strings
3. Translators edit the mirrored markdown under `i18n/<locale>/...`. File paths mirror `docs/` exactly.
4. Build per locale with `npm run build -- --locale <locale>`. Docusaurus serves each locale at `/<locale>/...` or a subdomain, configurable.
5. Add a locale dropdown to the navbar via `navbar.items` with `type: 'localeDropdown'`.

**Deployment:** GitHub Pages / Cloudflare Pages / Vercel all handle this cleanly — one build step per locale, one site output with subpaths.

### Pattern B — Crowdin / Weblate / Lokalise integration

Big docs sites (React, Vue, Electron) pair Docusaurus i18n with **Crowdin**, which syncs translations to and from GitHub automatically:

- Translators work in Crowdin's web UI (no git required — huge for reach).
- A GitHub Action pulls approved translations back into `i18n/<locale>/` on a schedule or webhook.
- Contributors who *do* know git can still PR directly.

Crowdin is free for open-source projects. This is how the React docs (`react.dev`) run. If we want actual community translation momentum, this is the answer. Weblate and Lokalise are alternatives; Crowdin has the biggest OSS foothold.

### Pattern C — Manual PR-based translation

Lowest tech, lowest reach: translators fork the repo, edit files under `i18n/<locale>/`, open a PR. Cheap to set up, painful to scale past 2–3 languages. Good as a **bootstrap** step while deciding on Pattern B.

### Patterns to reject

- **Google Translate widget** — auto-translates at runtime. Looks bad, SEO-hostile, bad for technical terms, hallucinates code. No.
- **Separate repo per language** — fragments the community, doubles maintenance, drifts out of sync. No.
- **LLM auto-translation committed to `main`** — tempting but nobody wants to be the maintainer reviewing AI Spanish for accuracy. Fine as a **first draft** feeding into human review via Pattern B. Not fine as the finished state.

---

## Proposed phased plan

### Phase 0 — decision + freeze (unscheduled)
- [ ] Confirm the English docs are stable enough to translate against. Rough signal: fewer than ~1 structural change per week landing in `docs/`.
- [ ] Pick launch locales. Suggested starter set based on likely audience for a local-first AI tool: **Spanish (`es`), Simplified Chinese (`zh-Hans`), Japanese (`ja`), German (`de`), French (`fr`), Brazilian Portuguese (`pt-BR`)**. Ship with whichever subset actually has a volunteer translator lined up — do not ship empty locales.
- [ ] Decide: Crowdin integration now (Pattern B) or manual PRs first (Pattern C) with Crowdin later.

### Phase 1 — Docusaurus i18n scaffolding
- [ ] Update `i18n.locales` in `docusaurus.config.js`.
- [ ] Run `npx docusaurus write-translations --locale <locale>` for each locale.
- [ ] Add `localeDropdown` item to navbar config.
- [ ] Verify `npm run build -- --locale <locale>` succeeds for every locale.
- [ ] Verify English build still works (regression check).
- [ ] Deploy a preview with one translated page to confirm routing, sitemap, and hreflang tags are correct.

### Phase 2 — contributor workflow
- [ ] Write `CONTRIBUTING-i18n.md` under `are-self-docs/` explaining how to translate, how file paths mirror `docs/`, what tone and terminology to preserve (e.g. do-not-translate list: "Are-Self", "Frontal Lobe", "scipraxian", model names, code identifiers).
- [ ] Create a GitHub issue template for "Translation: <language>" with a checklist of pages.
- [ ] Add a `translation` label + a tracking meta-issue per language.
- [ ] Decide a "what counts as translated" bar (100% of Getting Started? 100% of everything? Partial is okay as long as fallback to English works — which Docusaurus does by default).

### Phase 3 — Crowdin (only if Phase 2 proves demand)
- [ ] Create Crowdin open-source project.
- [ ] Wire Crowdin GitHub Action for bidirectional sync to `i18n/<locale>/`.
- [ ] Document the Crowdin workflow in `CONTRIBUTING-i18n.md`.
- [ ] Tag a first translation drive in the Discord + GitHub Discussions.

### Phase 4 — SEO and discoverability
- [ ] Confirm Docusaurus is emitting `hreflang` alternates per locale.
- [ ] Submit `sitemap.xml` per locale to Search Console.
- [ ] Add `og:locale` and `og:locale:alternate` to page metadata.
- [ ] Verify locale dropdown preserves current page path when switching languages.

---

## Open questions

- **Do we translate the API reference?** drf-spectacular output is auto-generated from Python docstrings. Translating it means translating docstrings, which isn't really a thing. Proposal: translate narrative docs only; leave the API reference English-only with a note at the top of each translated page.
- **Do we translate blog posts?** Proposal: no, at least not initially. Announcements are time-sensitive and translation lag defeats the point.
- **Do we translate UI walkthrough screenshots?** Screenshots with English UI text cannot be auto-translated. Proposal: leave screenshots English, add translated captions underneath. Revisit if Are-Self itself gets UI localization.
- **Is the are-self-api README / TASKS / CONTRIBUTING in scope?** Proposal: no. Repo meta-files stay English. Only the `are-self-docs` site ships in multiple languages.

---

## Out of scope for this ticket (explicitly)

- Localizing the Are-Self **application** UI. That is a separate, much larger ticket and belongs under `are-self-ui`.
- Localizing model outputs. That's a model capability question, not a docs question.
- Right-to-left (RTL) language support (Arabic, Hebrew). Docusaurus supports it but it needs theme review. Separate follow-up ticket if/when an RTL translator volunteers.

---

## Success criteria

- [ ] A visitor to `are-self.com/es/docs/intro` sees Spanish docs with a working locale dropdown.
- [ ] A first-time contributor can figure out how to submit a translation without asking in Discord.
- [ ] The English build is unaffected by i18n infrastructure.
- [ ] Untranslated pages gracefully fall back to English instead of 404-ing.
- [ ] Adding a new locale is a single config change + scaffold command, not a rewrite.

---

_End of ticket. Anything bigger than this goes in a follow-up ticket. Anything smaller goes in `TASKS.md` once this ticket is greenlit._
