---
sidebar_position: 2
title: "Data Flow & Privacy Architecture"
---

# Data Flow & Privacy Architecture

Are-Self's privacy model is built on a single principle: **data stays local unless you explicitly configure otherwise**. This page documents where data lives, what touches the network, and the privacy guarantees for users of all ages.

## Data Storage — Everything Local by Default

### PostgreSQL (Long-Term State)

All persistent application state lives in a PostgreSQL database running on the operator's hardware:

- **Reasoning sessions** and turn history
- **Tool execution logs** — every call, every parameter, every result
- **Memories (Engrams)** — the system's learned context from previous interactions
- **Identity definitions** and deployment instances
- **Configuration** — tool definitions, model settings, budget constraints
- **Audit trail** — who did what, when, and why

**Network exposure**: PostgreSQL is not exposed to the network by default. The Docker Compose configuration binds it to `localhost` only.

**Encryption**: PostgreSQL supports encryption at rest via `pgcrypto` and full-disk encryption. Operators are responsible for enabling these features according to their security requirements.

**Backup**: The operator controls backup procedures. Backups stay on the operator's infrastructure unless explicitly configured otherwise.

### pgvector (Vector Embeddings)

The Hippocampus uses pgvector to store semantic embeddings in PostgreSQL:

- **Engrams** (memories) are vectorized using local models or external services (if configured)
- **Vector storage** lives in the same PostgreSQL instance as all other data
- **No extraction or transmission** of vectors occurs unless the operator configures it

Vector embeddings are semantically compressed representations of memory content. They are not personally identifiable information on their own but can be analyzed to infer patterns. They are stored as encrypted/access-controlled data just like the underlying memories.

### Ollama (Local LLM Runtime)

Ollama runs as a local HTTP server on the operator's machine, providing LLM inference:

- **Model files** are stored on the operator's disk
- **Inference happens locally** — prompts and outputs never leave the machine by default
- **No logs** transmitted to Ollama's creators or cloud services
- **No telemetry** unless explicitly configured by the operator

**Network exposure**: Ollama listens on `localhost:11434` by default and is not exposed to the network.

### Redis (Cache & Task Queue)

Redis runs in Docker on the operator's machine:

- **Task queue state** for Celery workers (temporary)
- **Cache** for frequently accessed data
- **WebSocket channel layer** for real-time frontend updates

**Network exposure**: Redis is bound to `localhost` and not exposed to the network.

**Persistence**: Redis is configured for persistence to disk. The operator can enable/disable this.

## Data in Transit — What Leaves the Machine

### Default Behavior: Nothing Leaves

By default, Are-Self does not send operational data to any external service:

- No telemetry about your usage
- No phone-home functionality
- No cloud services required
- No vendor lock-in

### Optional: Cloud LLM Failover via LiteLLM

Are-Self supports optional cloud failover for LLM inference through **LiteLLM**, a routing layer that can direct requests to services like OpenRouter:

**How to enable**: Cloud failover is opt-in. The operator must:
1. Configure API credentials for a cloud LLM provider
2. Explicitly enable cloud routing in the environment configuration
3. Deploy the updated system

**What gets transmitted** (if cloud failover is enabled):
- The current reasoning prompt and context
- Tool call results the system needs from previous steps
- The LLM provider's standard response

**What does NOT get transmitted**:
- Full session history or memories
- Configuration details
- Operator identity or metadata
- Any data beyond what's needed for the current inference request

**Transparency**: When cloud failover is enabled, the configuration makes it clear which models run locally and which route to the cloud. The operator can audit which requests go where.

**Data retention**: Cloud LLM providers (OpenRouter, etc.) have their own data retention policies. Consult their privacy policies if you configure cloud failover.

### Data Flow Diagram (High Level)

```
┌─────────────────────────────────────────────────────────────┐
│                   Operator's Hardware                        │
│                                                             │
│  ┌──────────────┐      ┌──────────────┐                   │
│  │   Frontend   │──┬──▶│  Are-Self    │                   │
│  │   (React)    │  │   │   Django     │                   │
│  └──────────────┘  │   │   Backend    │                   │
│                    │   └──────┬───────┘                   │
│  ┌──────────────┐  │          │                            │
│  │   Ollama     │  │   ┌──────▼──────┐                    │
│  │ (Local LLM)  │◀─┤   │ PostgreSQL  │                    │
│  └──────────────┘  │   │  + pgvector │                    │
│                    │   └──────┬──────┘                     │
│  ┌──────────────┐  │          │                            │
│  │    Redis     │◀─┘   ┌──────▼──────┐                    │
│  │  (Cache)     │      │    Celery   │                    │
│  └──────────────┘      │   Workers   │                    │
│                        └─────────────┘                     │
│                                                             │
│              All local. Nothing leaves.                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ (Only if explicitly configured)
                            │
                    ┌───────▼────────┐
                    │   Cloud LLM    │
                    │   Provider     │
                    │ (OpenRouter)   │
                    └────────────────┘
```

## Privacy for Minors

Are-Self is designed with children and young teenagers in mind. Privacy protections for minors are built in:

### No User Accounts Required

- No registration process
- No login credentials
- No "create an account" step
- Children do not provide email addresses, usernames, or passwords

The system runs on the operator's hardware. The operator controls who can access it (via network/firewall rules), not the software.

### No Personal Information Collection

Are-Self does not collect:
- Real names
- Ages
- Email addresses
- IP addresses (beyond local network logs)
- Location data
- Device identifiers
- Behavioral profiles
- Browsing history
- Biometric data

If a child interacts with Are-Self through the chat interface, their conversation is stored locally in PostgreSQL on the operator's hardware. It is not transmitted, sold, or shared with third parties unless the operator explicitly configures cloud failover (and even then, only the immediate context for the LLM call is sent — full conversation history is not).

### COPPA Compliance (US)

The Children's Online Privacy Protection Act (COPPA) restricts online data collection from children under 13. Are-Self's default architecture:

- Does NOT collect personal information from children without parental consent (because it doesn't collect personal information at all)
- Does NOT use behavioral data for targeted advertising (there is no advertising)
- Does NOT build profiles of child users
- Does NOT transmit data to third parties (unless the operator configures cloud failover)

Operators deploying Are-Self in schools or youth programs should:
1. Ensure parental consent is obtained if required by local regulations
2. Monitor tool configurations to ensure no tools transmit sensitive data
3. Implement network access controls appropriate for a youth audience
4. Review any cloud failover configuration before enabling it

### Data Lifespan for Educational Use

In educational settings, Are-Self stores:
- Reasoning sessions and interactions
- Tool execution logs
- Learned memories (Engrams)

The operator controls data retention. Best practices:
- Delete sessions at the end of the academic year or term
- Export and archive sensitive conversations if required by institutional policy
- Run PostgreSQL backups on encrypted, access-controlled storage
- Limit tool access to educational resources (no external APIs without explicit approval)

## Network Security Considerations

### Default: Air-Gapped Deployment

The default Are-Self deployment is air-gapped:
- Not exposed to the network
- Not accessible from the internet
- Accessible only on the local machine or local network

### Network Deployment

If you expose Are-Self over a network:

**Authentication & Authorization**:
- Require API keys, OAuth, or mutual TLS for all external access
- Implement role-based access control (RBAC)
- Do not allow anonymous access

**Network Segmentation**:
- Place Are-Self behind a firewall
- Restrict ingress to trusted IPs
- Restrict egress to necessary endpoints (Ollama, Redis, PostgreSQL, and optional cloud LLM provider)
- Do not expose PostgreSQL, Redis, or Ollama directly to the network

**Rate Limiting**:
- Enforce rate limits at the network level (reverse proxy, WAF)
- Monitor for unusual request patterns (potential DoS, brute force)
- Alert on repeated failed authentication attempts

**Encryption in Transit**:
- Use TLS 1.2+ for all external communication
- Verify TLS certificates
- Use mutual TLS (mTLS) for machine-to-machine communication

### Peripheral Nervous System (Swarm) Security

When connecting multiple Are-Self instances in a swarm:

- Only connect machines on trusted, private networks
- Implement mutual TLS between nodes
- Do not expose inter-node communication to the internet
- Network-segment swarms by trust level and function
- Monitor inter-node communication for anomalies

## Regulatory Alignment

### HIPAA (Health Insurance Portability & Accountability Act)

**Applicable if**: Using Are-Self in healthcare or life sciences settings.

**Are-Self's alignment**:
- Local-only architecture means Protected Health Information (PHI) never leaves your infrastructure unless explicitly configured
- No cloud dependencies on non-HIPAA-compliant services
- Support for encrypted-at-rest storage (PostgreSQL pgcrypto)
- Audit logging of all data access

**Operator responsibilities**:
- Run PostgreSQL on HIPAA-compliant infrastructure
- Implement access controls (who can view PHI)
- Maintain audit logs and conduct regular reviews
- Encrypt data in transit (TLS)
- Implement data backup and disaster recovery procedures
- Train staff on PHI handling
- Do not enable cloud failover unless the provider is HIPAA-covered

### COPPA (Children's Online Privacy Protection Act)

**Applicable if**: Using Are-Self with children under 13.

**Are-Self's alignment**:
- No personal information collection
- No behavioral profiling or targeted advertising
- No third-party data sharing by default

**Operator responsibilities**:
- Obtain parental consent if required by local law
- Implement appropriate access controls for a youth audience
- Monitor tool configurations to prevent data transmission
- Document your privacy practices in a publicly available policy

### GDPR (General Data Protection Regulation)

**Applicable if**: Operating in the EU or with EU residents.

**Are-Self's alignment**:
- Framework collects no personal data
- Support for local-only storage (no cloud vendor dependencies)
- Full operator control over data retention

**Operator responsibilities** (if you store personal data):
- Implement data protection impact assessments (DPIA)
- Document your lawful basis for processing personal data
- Implement data minimization (collect only what you need)
- Provide individuals with access to their data upon request
- Implement data deletion procedures
- If enabling cloud failover, ensure the provider has appropriate Data Processing Agreements (DPA)

### FERPA (Family Educational Rights and Privacy Act)

**Applicable if**: Using Are-Self in K-12 schools.

**Are-Self's alignment**:
- Local storage means education records stay on school infrastructure
- No third-party data sharing by default
- Operator controls access to student data

**Operator responsibilities**:
- Implement access controls so only authorized school staff can view student data
- Document your data handling procedures
- Do not enable cloud failover unless the provider has a Business Associate Agreement (BAA)
- Delete records according to your school's record retention schedule

## Data Subject Rights

If you are processing personal data using Are-Self, you must support:

- **Right to Access**: Individuals can request a copy of their data
- **Right to Deletion**: Individuals can request deletion of their data
- **Right to Rectification**: Individuals can request correction of inaccurate data
- **Right to Data Portability**: Individuals can request their data in a portable format

Because Are-Self stores data in PostgreSQL, you can fulfill these rights by:
1. Querying the database for the individual's data
2. Exporting as JSON or CSV
3. Deleting records from PostgreSQL
4. Providing exports to the individual

## Operators' Privacy Checklist

Before deploying Are-Self:

- [ ] Review the default local-only configuration
- [ ] Document your data retention and deletion procedures
- [ ] Implement appropriate access controls (authentication, authorization, network segmentation)
- [ ] Determine if cloud failover is necessary (and if so, vet the provider)
- [ ] If working with minors, verify compliance with COPPA, FERPA, or local youth privacy laws
- [ ] If storing health information, ensure HIPAA-compliant infrastructure
- [ ] If in the EU, document GDPR lawful basis and implement data protection procedures
- [ ] Test backup and disaster recovery procedures
- [ ] Document your privacy practices and share with users/parents if required
- [ ] Monitor tool configurations to prevent unintended data transmission
- [ ] Regularly audit database access and query logs

## Summary

**Are-Self's default posture is privacy by design**:
- All data stored locall