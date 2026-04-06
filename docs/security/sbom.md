---
sidebar_position: 5
title: "Software Bill of Materials"
---

# Software Bill of Materials (SBOM)

This document provides a human-readable inventory of all production dependencies in Are-Self, including versions, purposes, licenses, and known CVE status as of April 5, 2026.

For detailed CVE analysis, see [DEPENDENCY_AUDIT.md](../../are-self-api/DEPENDENCY_AUDIT.md) in the API repository.

## Quick Reference

**Total Production Dependencies**: 39 packages
**Total Dev-Only Dependencies**: 14 packages
**CRITICAL CVEs Requiring Patches**: 2 (Django CVE-2025-64459, LiteLLM supply chain incident)
**HIGH CVEs**: 5 (Redis, Playwright, Django, etc.)

## Production Dependencies

### Django Core

| Package | Version | Purpose | License | CVE Status |
|---------|---------|---------|---------|-----------|
| Django | >=6.0.2 | Web framework, ORM, admin interface | BSD-3-Clause | **PATCHED**: CVE-2025-64459 (CRITICAL SQL injection) and CVE-2025-14550 (HIGH) fixed in 6.0.2+ |
| djangorestframework | >=3.15.2 | REST API framework | BSD | CVE-2024-21520 (MEDIUM XSS) patched in 3.15.2+ |
| django-filter | latest | Query parameter filtering for APIs | BSD | No known CVEs |
| django-extensions | >=3.2 | Django admin utilities and management commands | MIT | No known CVEs |
| django-cors-headers | latest | CORS middleware for cross-origin requests | MIT | No known CVEs |
| django-rest-framework-mcp | latest | MCP integration for DRF | MIT | No known CVEs |

### Async & Real-Time

| Package | Version | Purpose | License | CVE Status |
|---------|---------|---------|---------|-----------|
| channels | >=4.0 | WebSocket support for real-time updates | BSD-3-Clause | No known CVEs |
| daphne | >=4.0 | ASGI server for Channels | BSD-3-Clause | No known CVEs |
| asgiref | (via Django) | ASGI synchronization utilities | BSD | Fixed via Django 6.0.2+ update |
| channels-redis | latest | Redis channel layer backend for Channels | BSD-3-Clause | No known CVEs |

### Task Queue & Scheduling

| Package | Version | Purpose | License | CVE Status |
|---------|---------|---------|---------|-----------|
| celery | >=5.3 | Distributed task queue for async work | BSD-3-Clause | No known CVEs |
| django-celery-beat | latest | Periodic task scheduler (PNS metronome) | BSD-3-Clause | No known CVEs |
| django-celery-results | >=2.5 | Store Celery task results in database | MIT | Not affected by CVE-2020-17495 (requires older than 2.4.0) |
| celery-types | >=0.24.0 | Type stubs for Celery (dev use but in prod) | MIT | No known CVEs |

### Database & Storage

| Package | Version | Purpose | License | CVE Status |
|---------|---------|---------|---------|-----------|
| psycopg2-binary | >=2.9.9 | PostgreSQL client library | LGPL-3.0+ | No known CVEs |
| pgvector | >=0.3.2 | PostgreSQL extension for vector embeddings (Hippocampus memory) | PostgreSQL | No known CVEs |

### AI/ML & Language Models

| Package | Version | Purpose | License | CVE Status |
|---------|---------|---------|---------|-----------|
| litellm | >=1.83.0 | LLM routing layer (local Ollama + cloud failover) | MIT | **CRITICAL SUPPLY CHAIN INCIDENT**: Versions 1.82.7-1.82.8 (March 2026) contained malicious code stealing credentials. Pinned to 1.83.0+. CVE-2024-6825 (HIGH RCE) and CVE-2024-8984 (HIGH DoS) fixed in later versions. |
| pydantic | latest | Data validation and settings management | MIT | CVE-2024-3772 (MEDIUM ReDoS) patched in 2.4.0+ |
| piper-tts | latest | Text-to-speech synthesis (local, no GPU) | MIT | Repository archived October 2025 but still functional. Monitor for issues. |

### Utilities & Helpers

| Package | Version | Purpose | License | CVE Status |
|---------|---------|---------|---------|-----------|
| requests | >=2.31 | HTTP client for external API calls | Apache 2.0 | No known CVEs |
| psutil | >=5.9 | System and process management (PNS monitoring) | BSD-3-Clause | No known CVEs |
| tenacity | latest | Retry logic for transient failures | Apache 2.0 | No known CVEs |
| html2text | latest | Convert HTML to Markdown/text | LGPL-3.0+ | No known CVEs |
| Markdown | >=3.10 | Markdown parsing and rendering | BSD-3-Clause | No known CVEs |
| aiofiles | latest | Async file I/O operations | Apache 2.0 | No known CVEs |
| watchfiles | >=1.1.1 | File watching for config reload | MIT | No known CVEs |
| colorlog | >=6.7 | Colored logging output to console | MIT | No known CVEs |

### Deprecated / Unmaintained

| Package | Version | Status | Recommendation |
|---------|---------|--------|-----------------|
| pygtail | (in requirements) | Deprecated in tool — **never used** | **Remove before 1.0** — not imported anywhere in production code |

## Dev-Only Dependencies

These dependencies are used during development and testing but are **not shipped with production**:

| Package | Version | Purpose | License | CVE Status |
|---------|---------|---------|---------|-----------|
| pytest | >=9.0.3 | Test runner | MIT | CVE-2025-71176 (MEDIUM, UNIX privilege escalation) patched in 9.0.3+ |
| pytest-django | >=4.11.1 | Django test runner integration | MIT | No known CVEs |
| pytest-asyncio | latest | Async test support | Apache 2.0 | No known CVEs |
| coverage | latest | Code coverage reporting | Apache 2.0 | No known CVEs |
| ruff | >=0.11.5 | Fast Python linter (replaces flake8) | MIT | CVE-2025-4574 (MEDIUM, crossbeam double free) patched in 0.11.5+ |
| isort | >=7.0.0 | Import statement sorting | MIT | No known CVEs |
| yapf | >=0.43.0 | Code formatter | Apache 2.0 | **Candidate for removal** — Are-Self uses Ruff, making yapf redundant |
| black | (implicit via tools) | Code formatter | MIT | No known CVEs |
| django-stubs | >=5.2.8 | Type stubs for Django | MIT | No known CVEs |
| djangorestframework-stubs | latest | Type stubs for DRF | MIT | No known CVEs |
| IPython | >=8.12 | Interactive shell | BSD-3-Clause | CVE-2024-43805 (MEDIUM Jupyter markdown) and CVE-2025-53000 (HIGH nbconvert RCE) in dev use only. Update to latest. |
| Playwright | >=1.55.1 (recommended) | Browser automation (tools in Parietal Lobe) | Apache 2.0 | CVE-2025-59288 (HIGH SSL bypass), CVE-2025-9611 (HIGH DNS rebinding), CVE-2026-2441 (CRITICAL Chromium use-after-free). Update to 1.55.1+. This is a **dev/tool** dependency; update recommended. |

### Candidates for Removal (Before 1.0)

| Package | Reason | Status |
|---------|--------|--------|
| django-htmx | Are-Self migrated to React frontend | Marked deprecated in TASKS.md |
| scapy | Network scanning for PNS auto-discovery — verify if actually used | Listed in TASKS.md as potentially unused |
| yapf | Redundant with Ruff | Listed in TASKS.md as deprecated |

## External Runtime Dependencies (Not in requirements.txt)

These are external services/applications that Are-Self depends on but does not bundle:

### Ollama (LOCAL LLM RUNTIME) — CRITICAL

| Component | Version | Purpose | CVE Status |
|-----------|---------|---------|-----------|
| Ollama | User-installed | Local LLM inference engine | Multiple HIGH/CRITICAL CVEs in recent releases — see DEPENDENCY_AUDIT.md for details |

**Are-Self's dependency on Ollama**:
- Are-Self does not bundle or distribute Ollama
- Users install Ollama independently
- Are-Self talks to Ollama via localhost:11434 by default
- Ollama security updates are the operator's responsibility

**Recommended action**: Keep Ollama updated. Check [Ollama releases](https://github.com/ollama/ollama/releases) regularly.

### Docker & Container Images — INFRASTRUCTURE

| Component | Used For | CVE Status |
|-----------|----------|-----------|
| PostgreSQL (Docker image) | Primary database | Operators should keep images updated |
| Redis (Docker image) | Cache and message broker | Multiple HIGH CVEs in Redis versions < 8.3.2. Update Docker Compose config. |

### System Dependencies

| Component | Purpose | Notes |
|-----------|---------|-------|
| Python 3.10+ | Runtime | No known critical CVEs in recent versions |
| PostgreSQL (host or Docker) | Database | Operators maintain this independently |
| Redis (host or Docker) | Cache/broker | Operators maintain this independently |

## License Summary

| License Type | Count | Packages |
|--------------|-------|----------|
| MIT | 15 | LiteLLM, pydantic, Channels, Celery, psutil, django-celery-beat, django-rest-framework-mcp, ruff, isort, IPython, etc. |
| BSD (all variants) | 12 | Django, DRF, daphne, asgiref, Markdown, colorlog, Coverage, django-stubs, Channels, etc. |
| Apache 2.0 | 5 | requests, tenacity, aiofiles, Playwright |
| LGPL 3.0+ | 2 | psycopg2-binary, html2text |
| PostgreSQL | 1 | pgvector |
| Other | 2 | django-extensions (MIT), django-cors-headers (MIT) |

**All licenses are permissive and compatible with MIT-licensed Are-Self**.

## Dependency Graph (High Level)

```
Django 6.0.2+
├── DRF 3.15.2+
├── Channels 4.0+
│   └── daphne, asgiref, channels-redis
├── Celery 5.3+
│   ├── redis 5.0+
│   └── django-celery-beat, django-celery-results
├── Pydantic
├── psycopg2-binary
│   └── pgvector
├── django-filter, django-extensions, django-cors-headers
└── LiteLLM 1.83.0+
    └── (optional) cloud LLM routing

Development Only:
├── pytest, pytest-django, pytest-asyncio, coverage
├── ruff, isort, yapf
├── django-stubs, djangorestframework-stubs
├── IPython
└── Playwright (for browser-based tools)
```

## Version Pinning Strategy

**Production dependencies** are pinned to:
- Exact versions for CRITICAL packages (Django, LiteLLM)
- Minimum versions for HIGH/MEDIUM CVE fixes (e.g., `psycopg2-binary>=2.9.9`)
- Latest/conservative ranges for low-risk packages

**Example**:
```
Django>=6.0.2                   # Pin minimum (includes critical patch)
litellm>=1.83.0                 # Pin minimum (past supply chain incident)
psycopg2-binary>=2.9.9          # Pin minimum
Markdown>=3.10                  # Pin minimum
channels>=4.0                   # Pin minimum
```

**Dev-only dependencies** use looser ranges since they don't ship with production:
```
pytest>=7.0
ruff>=0.11.5
isort>=7.0.0
```

## Future SBOM Improvements

Before Are-Self 1.0, we plan to:

1. **Separate requirements files**:
   - `requirements.txt` (production only)
   - `requirements-dev.txt` (dev tools)

2. **Machine-readable SBOM**:
   - Generate CycloneDX format SBOM
   - Generate SPDX format SBOM
   - Include in release artifacts

3. **Hash verification**:
   - Pin CRITICAL packages with SHA256 hashes
   - Provide `pip install --hash` instructions

4. **Automated monitoring**:
   - Integrate Dependabot or Renovate
   - Auto-generate update PRs
   - Integrate `pip-audit` into CI/CD

5. **Signature verification**:
   - GPG-sign releases
   - Provide signature verification for critical packages

## How to Audit Dependencies Yourself

```bash
# Install pip-audit
pip install pip-audit

# Audit against requirements.txt
pip-audit -r requirements.txt

# Output as JSON for tooling
pip-audit -r requirements.txt --format json --output audit.json

# Audit installed packages directly
pip-audit
```

## Questions About Specific Packages?

- **Security concerns**: See the full audit in [DEPENDENCY_AUDIT.md](../../are-self-api/DEPENDENCY_AUDIT.md)
- **License compliance**: All packages listed here have permissive licenses compatible with MIT
- **Version selection**: See [Incident Response Plan](./incident-response.md) for pinning rationale
- **CVE details**: Check the NVD, GitHub Security Advisories, and package release notes

Thank you for deploying Are-Self responsibly.
