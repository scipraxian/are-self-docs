# Are-Self Documentation

The official documentation site for [Are-Self](https://github.com/scipraxian/are-self-api), deployed at [are-self.com](https://are-self.com).

Built with [Docusaurus](https://docusaurus.io/).

## Local Development

```bash
npm install
npm start
```

Opens at `http://localhost:3000`. Changes are reflected live.

## Build

```bash
npm run build
```

Generates static content into the `build` directory.

## Deployment

Deployed automatically via GitHub Pages on push to `main`.

To deploy manually:

```bash
GIT_USER=scipraxian npm run deploy
```

## Structure

```
docs/
  intro.md              # Landing page content
  getting-started.md    # Installation and first run
  architecture.md       # The brain — how it all connects
  api-reference.md      # Every endpoint, organized by brain region
  security.md           # Security posture and responsible use
  dependency-audit.md   # CVE audit of all dependencies
  contributing.md       # How to contribute
  brain-regions/        # Deep dives per brain region
  ui/                   # Screenshot-driven UI walkthroughs
  acknowledgments.md    # Shoutouts — Ollama, LiteLLM, OpenRouter, model creators
```

Content is migrated from the `are-self-api` and `are-self-ui` repos. The source of truth for
documentation is this repo; the code repos contain developer-focused docs (CLAUDE.md, STYLE_GUIDE.md).
