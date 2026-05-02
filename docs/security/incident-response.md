---
sidebar_position: 4
title: "Incident Response Plan"
---

# Incident Response Plan

Are-Self takes supply chain security and incident response seriously. This document outlines our process for discovering, assessing, and responding to vulnerabilities in Are-Self and its dependencies.

## CVE Response Process

When a vulnerability (CVE) affecting Are-Self or its dependencies is discovered, we follow this process:

### 1. Discovery & Notification

Vulnerabilities come to our attention through:
- **GitHub Security Advisories**: GitHub notifies maintainers of known CVEs in dependencies
- **NVD (National Vulnerability Database)**: We monitor for CVEs affecting our dependencies
- **OSV.dev**: Open Source Vulnerability database
- **Community reports**: Security researchers and users report issues (see [Reporting Security Issues](./index.md#reporting-security-issues))

**Timeline**: Our dependency audit is conducted before each release. Between releases, we monitor for critical vulnerabilities and issue updates within 48 hours if a CRITICAL or HIGH-severity CVE is discovered.

### 2. Assessment

Upon discovering a CVE, we assess:

**Affected scope**:
- Does the CVE affect production code or only dev-only dependencies?
- Are we using the affected code path?
- What versions of Are-Self are vulnerable?

**Impact**:
- Can the vulnerability be exploited in Are-Self's default configuration?
- Does Are-Self's architecture mitigate the vulnerability?
- What is the practical risk to users?

**Example**: CVE-2025-49844 (Redis RCE via Lua scripting)
- Are-Self does NOT use Redis Lua scripting
- Redis runs on localhost by default (not exposed to untrusted networks)
- **Mitigation**: The vulnerability is less critical in Are-Self's context, but we still recommend updating Redis to a patched version

### 3. Remediation

Once impact is assessed, we remediate:

**Version pinning**:
- Update `requirements.txt` to pin the package to a patched version
- Use exact version pins (e.g., `django>=6.0.2`) or SHA256 hash verification for critical packages
- Document the CVE and fix in `DEPENDENCY_AUDIT.md`

**Testing**:
- Run the full test suite to ensure the patch doesn't break functionality
- If upgrading a major version, perform integration testing
- Test on both Linux and Windows (if applicable)

**Code changes** (if needed):
- If the patch requires code changes to Are-Self (e.g., API changes), implement them
- Update tests to cover the fix

### 4. Release & Communication

Once remediated:

**Release cycle**:
- **CRITICAL/HIGH severity**: Emergency release within 48 hours
- **MEDIUM severity**: Included in next scheduled release (ideally within 1 week)
- **LOW severity**: Included in next scheduled release (may wait up to 1 month)

**Communication**:
- GitHub Security Advisory issued with: CVE ID, affected versions, remediation steps
- Release notes document the vulnerability and fix
- If the CVE was reported by a community member, we credit them (with permission)

**Users**:
- Users pinning Are-Self to a specific version will get the update via `pip install --upgrade are-self`
- Users using Docker images will get updated images published to Docker Hub
- Users should subscribe to GitHub releases to be notified of security updates

### 5. Post-Incident Review

After each incident, we:
- Document what went wrong and why it was not caught earlier
- Improve the dependency audit process
- Adjust monitoring frequency if needed
- Update this document with lessons learned

## Case Study: LiteLLM Supply Chain Incident (March 2026)

In March 2026, versions 1.82.7 and 1.82.8 of LiteLLM contained malicious code that exfiltrated cloud credentials, SSH keys, and Kubernetes secrets.

### How We Responded

**Discovery** (March 15, 2026):
- GitHub Security Advisory issued by LiteLLM maintainers
- Are-Self's dependency audit detected the compromise
- Immediate investigation of Are-Self's use of LiteLLM

**Assessment**:
- LiteLLM is used for cloud failover (OpenRouter) — optional, not required
- Are-Self's default configuration uses local Ollama only
- Cloud credentials are only at risk if the operator explicitly configured cloud failover AND had API keys stored
- **Risk level**: HIGH for users with cloud failover configured, LOW for users using local-only mode

**Remediation**:
- Updated `requirements.txt` to pin LiteLLM to version 1.83.0+ (post-compromise)
- Recommended users running local-only mode had minimal risk
- Recommended users with cloud failover rotate compromised API keys
- Considered vendoring LiteLLM or using hash verification for future releases

**Release**:
- Security patch released on March 16, 2026 (same day assessment completed)
- GitHub Security Advisory issued with mitigation steps
- Release notes emphasized the importance of default local-only mode

**Lessons Learned**:
- Cloud dependencies introduce supply chain risk even in optional configurations
- Pinning with hash verification would have caught the compromise earlier
- Users deploying without cloud failover were naturally protected by architecture

## Dependency Monitoring

### Pre-Release Audit

Before every release, we:

1. **Run `pip-audit`** against `requirements.txt`:
   ```bash
   pip install pip-audit
   pip-audit -r requirements.txt --format json
   ```

2. **Cross-reference** against:
   - GitHub Security Advisories
   - NVD (National Vulnerability Database)
   - OSV.dev
   - Snyk vulnerability database

3. **Assess each CVE** for exploitability in our architecture

4. **Update pins** for any vulnerable packages

5. **Document findings** in `DEPENDENCY_AUDIT.md`

### Continuous Monitoring

Between releases, we:

- **Weekly**: Check GitHub Security Advisories for new CVEs
- **Monthly**: Run full `pip-audit` against all dependencies
- **On notification**: Assess and respond to critical vulnerabilities within 48 hours
- **Community reports**: Respond to security reports privately within 24 hours

## Inventory of Critical Dependencies

See [Software Bill of Materials](./sbom.md) for the complete inventory. Critical packages include:

| Package | Risk Level | Monitoring Frequency | Notes |
|---------|-----------|----------------------|-------|
| Django | CRITICAL | Monitored actively | Core framework; CVE-2025-64459 required patching before release |
| LiteLLM | CRITICAL | Monitored actively | Supply chain incident in March 2026; consider hash verification |
| Redis | CRITICAL | Monitored actively | Runs as Docker service; recommend keeping images updated |
| Ollama | CRITICAL | Monitored actively | External dependency; not shipped with Are-Self but documented |
| PostgreSQL | CRITICAL | Monitored actively | Database; operator responsible for updates |
| Celery | HIGH | Monitored actively | Task queue; version pinned |
| Channels | HIGH | Monitored actively | WebSocket support; version pinned |

## Remediation SLAs (Service Level Agreements)

| Severity | Timeline | Action |
|----------|----------|--------|
| CRITICAL (CVSS 9.0+) | 48 hours | Emergency release issued |
| HIGH (CVSS 7.0-8.9) | 1 week | Included in next release or emergency release if exploitable |
| MEDIUM (CVSS 4.0-6.9) | 1 month | Included in next scheduled release |
| LOW (CVSS 0.1-3.9) | Next release | No urgency; included when convenient |

**Exception**: If a CRITICAL vulnerability is announced in `alpha` or `beta` releases, we may defer response until the vulnerability is publicly disclosed (responsible disclosure principle).

## Version Pinning Strategy

### Production Dependencies

All production dependencies are pinned to **exact versions or conservative ranges**:

```
Django>=6.0.2              # Minimum version that includes security patches
litellm>=1.83.0            # Pinned past supply chain incident
psycopg2-binary>=2.9.9     # Conservative range for compatibility
```

**Why pinning matters**:
- Ensures reproducible builds
- Prevents surprise updates that introduce vulnerabilities
- Allows us to verify hashes and signatures
- Makes dependency sprawl visible

### Dev-Only Dependencies

Dev dependencies are less strictly pinned since they don't ship with production:

```
pytest>=7.0               # Broader version range acceptable
ruff>=0.1.0               # Code formatter; less critical
```

### Future Improvements

Before Are-Self 1.0 release, we plan to:
1. Separate `requirements.txt` and `requirements-dev.txt`
2. Add hash verification for CRITICAL packages (pip install with `--hash=sha256:...`)
3. Consider vendoring LiteLLM due to supply chain history
4. Integrate `pip-audit` into CI/CD pipeline with automatic PR creation for updates

## Communication Channels

### Security Advisories

- **GitHub**: Issues published as "Security Advisory" on the Are-Self repo
- **Release notes**: Each release includes a "Security" section if CVEs were addressed
- **are-self.com**: Links to security advisories from the main documentation site

### For Responsible Disclosure

If you discover a vulnerability:

1. **Do not** open a public GitHub issue
2. **Contact maintainers privately**: [security contact to be added]
3. **Timeline**: Expect acknowledgment within 48 hours, fix within 1-2 weeks for CRITICAL issues

### Subscription & Notifications

Users can stay informed by:
- **GitHub**: Watch the Are-Self repo and enable "Security alerts"
- **are-self.com**: Check the documentation site for security updates (planned: RSS feed)
- **Email list**: Subscribe to the mailing list for security announcements (planned)

## Rollback Procedures

If a patched version introduces a regression:

### Emergency Rollback

1. **Identify the issue**: Version X.Y.Z introduced a new problem
2. **Test previous version**: Confirm version X.Y.(Z-1) works
3. **Release hotfix**: Push version X.Y.(Z+1) with a revert or fix
4. **Communication**: Issue GitHub advisory explaining the rollback
5. **Root cause analysis**: Document what went wrong and how to prevent it

### Data Safety

Rollbacks do NOT affect user data:
- PostgreSQL schemas are backwards-compatible
- Rollback is safe even after an upgrade
- If a new migration was applied, a downgrade may require schema rollback (documented)

## Testing & Validation

Before releasing any security patch:

1. **Unit tests**: Run full pytest suite
2. **Integration tests**: Test with Ollama, PostgreSQL, Redis locally
3. **Upgrade test**: Spin up a previous version, upgrade to new version, verify functionality
4. **Downgrade test**: Upgrade to new version, downgrade to previous version, verify data integrity
5. **Manual testing**: Spot-check key features (identities, reasoning, tool execution)

## Compliance & Auditing

### Documentation

All security incidents and responses are documented in:
- **DEPENDENCY_AUDIT.md**: Complete CVE audit trail
- **GitHub Security Advisories**: Public vulnerability disclosure
- **CHANGELOG.md**: Version-by-version security updates
- **This document**: Incident response procedures

### Audit Trail

For compliance purposes (HIPAA, SOC 2, etc.):
- Every version pin change is committed to Git with a clear message
- Every security patch is released with documented CVE references
- Every vulnerability assessment is recorded (in DEPENDENCY_AUDIT.md)
- GitHub Security Advisory provides cryptographic proof of disclosure date/time

### For Organizations

If your organization requires security documentation:
- Request the latest `DEPENDENCY_AUDIT.md`
- Request GitHub Security Advisory history
- We can provide attestation of security practices (on request)

## Future Enhancements

As Are-Self grows, we plan to:

1. **Automated dependency updates**: Integrate Dependabot or Renovate for automatic version-bump PRs
2. **SBOM generation**: Auto-generate CycloneDX/SPDX software bill of materials
3. **Signature verification**: GPG-sign releases and provide signature verification instructions
4. **Security scorecard**: Use OSSF Security Scorecard to track security practices over time
5. **Formal SLA**: Publish a Security SLA document for organizational deployments
6. **Bug bounty program**: Launch a bug bounty program as Are-Self reaches 1.0

## Questions?

If you have questions about security or incident response:

- **Public questions**: Open a GitHub issue (not a security issue, just a question)
- **Security 