---
id: security-overview
title: "Security & Responsible Use"
sidebar_position: 1
---

# Security & Responsible Use

Are-Self is an MIT-licensed, open-source AI orchestration framework designed to run entirely on consumer hardware. This document suite outlines its security properties, privacy architecture, responsible AI practices, and the responsibilities that come with deploying an autonomous reasoning system.

## Quick Navigation

This security documentation is organized into five pages:

1. **Security Overview** (this page) — High-level security posture and operator responsibilities
2. **[Data Flow & Privacy Architecture](./data-flow-privacy.md)** — Where data lives, what touches the network, privacy guarantees
3. **[Responsible AI & Safety Policy](./responsible-ai.md)** — Built-in safeguards, what Are-Self does NOT do, age-appropriate considerations
4. **[Incident Response Plan](./incident-response.md)** — CVE response process, dependency monitoring, communication channels
5. **[Software Bill of Materials](./sbom.md)** — Complete dependency inventory with versions, licenses, and CVE status

## The Core Principle

Are-Self is built with **privacy-first architecture by default**:

- All data is stored and processed locally on the operator's machines
- No telemetry collection, no phone-home functionality, no mandatory cloud dependency
- Long-term memories, tool execution logs, and session state live in PostgreSQL with pgvector on the operator's hardware
- The system does not transmit operational data to external services unless explicitly configured to do so

## Dual-Use Acknowledgment

**Are-Self is a powerful autonomous system. We will not pretend otherwise.**

This framework gives AI entities the ability to form long-term memories, execute tools, interact with external systems, manage their own work, and scale across multiple machines. The same capabilities that enable beneficial use cases—research workflows, personalized education, logistics automation—can be misused. We acknowledge this directly rather than pretending the risk doesn't exist.

Dual-use risk is directly tied to **what tools you configure**. Are-Self does not ship with dangerous capabilities. The Parietal Lobe gateway defines what the system can do. If you configure tools that can make unlimited requests, scrape at scale, or interact with APIs without safeguards, then you are creating the potential for misuse. The framework provides guardrails, but the tool set is your choice.

## Architectural Safeguards

Are-Self includes multiple layers of built-in constraints:

- **Focus Economy**: Limits execution per session to prevent runaway loops
- **Parietal Lobe Gateway**: Tool execution is validated and logged; invalid parameters are rejected
- **Hypothalamus Budget Enforcement**: Token budgets per session with hard stops (no silent overages)
- **Circuit Breakers**: Failing endpoints trigger exponential backoff; repeated failures disable the tool
- **Spike Forensics**: Every action leaves a trace in the audit log; full replay and inspection possible

## Operator Responsibility

**MIT license means you own the consequences of how you deploy Are-Self.**

Running an autonomous reasoning system means:

- You choose what tools it can access (tool configuration)
- You choose what data it processes (permissions and network access)
- You choose how it's deployed (local-only vs. network-exposed vs. cloud-integrated)
- You are responsible for what it does

If you expose Are-Self over a network, use standard authentication and authorization controls (API keys, OAuth, mutual TLS), place it behind a firewall, implement rate limiting, and monitor for unexpected behavior. If you connect machines in a swarm, only use trusted networks, implement strong inter-node authentication, and network-segment by trust level.

This is not a black box. It is auditable, instrumentable, and controllable. Understand the system you're deploying. Test it. Monitor it. Have a kill switch.

## For Nonprofits, Churches, and Schools

**Are-Self is purpose-built for organizations serving underprivileged youth.**

The default local-only architecture means:
- No cloud dependencies, no API keys required
- No data transmitted off-site without explicit configuration
- Runs on standard hardware with free local models
- No vendor lock-in or subscription requirements
- Transparent, auditable operation — you can review exactly what the system does

These organizations often operate under tight budgets, limited IT infrastructure, and strict privacy requirements. Are-Self's design respects those constraints.

### Regulatory Alignment

This local-by-default architecture has built-in alignment with:

- **HIPAA**: Protected Health Information never leaves the local network unless explicitly configured
- **COPPA** (Children's Online Privacy Protection): No tracking, no behavioral data collection, no targeted advertising
- **SOC 2 Type I**: Local-only operation eliminates cloud provider dependencies; you control access, encryption, and audit logs
- **GDPR**: Are-Self collects no personal data; what you put into it stays where you put it

Compliance is operator-dependent. The framework provides the foundation, but you must implement access controls, backup procedures, network security, and audit procedures appropriate for your context.

## Reporting Security Issues

If you discover a security vulnerability in Are-Self:

1. **Do not open a public GitHub issue**
2. **Do not discuss it in public channels**
3. **Contact the maintainers privately** at [security contact information to be added by project maintainers]
4. Include:
   - A clear description of the vulnerability
   - Steps to reproduce (if applicable)
   - Potential impact
   - Any suggested fixes (optional but helpful)

We will acknowledge receipt within 48 hours and work toward a fix and responsible disclosure timeline.

### What Constitutes a Security Issue

**Security issues include**:
- Arbitrary code execution or command injection
- Privilege escalation (unprivileged user gaining elevated access)
- Unauthorized access to memory, logs, or configuration
- Denial of service through framework design flaws
- Cryptographic weaknesses
- Bypass of intended constraints (Focus Economy, Hypothalamus budgets, etc.)
- Tool injection or parameter manipulation that bypasses validation

**Not security issues** (but valuable feedback):
- Missing features or capability limitations
- Performance issues or resource usage suggestions
- UI/UX improvements
- Documentation gaps
- Operational concerns that don't involve framework code flaws

## Next Steps

- **Deploying for your organization?** Start with [Data Flow & Privacy Architecture](./data-flow-privacy.md)
- **Evaluating Are-Self's safety practices?** Read [Responsible AI & Safety Policy](./responsible-ai.md)
- **Managing dependencies?** Reference the [Software Bill of Materials](./sbom.md) and [Incident Response Plan](./incident-response.md)
- **Building com