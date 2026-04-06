---
sidebar_position: 3
title: "Responsible AI & Safety Policy"
---

# Responsible AI & Safety Policy

Are-Self is a powerful autonomous reasoning system. This document outlines the built-in safeguards that prevent runaway behavior, the constraints on what the system can do, and the responsibilities that come with deploying autonomous AI.

## Built-In Safeguards

Are-Self includes multiple layers of architectural constraints designed to prevent misuse, resource exhaustion, and harmful outputs:

### 1. Focus Economy

The Focus Economy is a token and execution budget system that prevents runaway sessions:

**How it works**:
- Each reasoning session has a maximum number of reasoning turns (e.g., 10 turns per session)
- Each session has a token budget (e.g., 4,000 tokens) that decrements with each LLM call
- When the budget is exhausted, the session ends and the system rests
- The operator can configure budget limits per session, per hour, per day, and per week

**Why it matters**:
- Prevents infinite loops or runaway reasoning chains
- Gives operators visibility into system behavior — they can see exactly how much reasoning happened and why
- Enforces mandatory rest periods between sessions, allowing humans to review outputs
- Makes resource usage predictable (no surprise GPU burn)

**For schools and nonprofits**:
- Prevents a task from accidentally spinning forever and wasting compute resources
- Allows teachers/staff to monitor how much thinking the system is doing
- Ensures the system can be interrupted or stopped between turns

### 2. Parietal Lobe Gateway (Tool Validation)

All tool execution flows through the Parietal Lobe, which validates every parameter before execution:

**Hallucination Armor**:
- Every tool call is validated against its schema
- Invalid parameters are rejected immediately
- Malicious or nonsensical parameters (e.g., command injection attempts) are caught before execution
- The system cannot execute a tool with invalid input — it fails safely

**Granular Authorization**:
- Each tool has explicitly defined inputs, outputs, and constraints
- The operator can enable/disable tools or constrain their parameters
- Tools cannot be called with parameters outside their schema
- No implicit or unintended tool capabilities

**Execution Logging**:
- Every tool invocation is logged with: what tool, what parameters, what result, when
- The operator can audit exactly what the system did and when
- Logs are stored in PostgreSQL on the operator's hardware
- Full replay of tool execution is possible for debugging

### 3. Hypothalamus Budget Enforcement

Model usage is constrained by strict budgets:

**Token Budgets**:
- Each session has a maximum token allocation (prompt + completion)
- Token counts are checked before and after each LLM call
- When budgets are exceeded, the session terminates
- No silent overages, no "opportunistic" extra usage

**Rate Limiting**:
- Inference calls are rate-limited per session, per hour, per day
- Prevents rapid-fire requests that could overload local Ollama or cloud providers
- Operators can configure limits appropriate for their hardware

**Circuit Breakers**:
- If an endpoint (Ollama, OpenRouter) fails, the system does not hammer it indefinitely
- Failed calls trigger exponential backoff (1s, 2s, 4s, 8s...)
- After repeated failures, the endpoint is disabled for the session
- The system recovers gracefully without cascading failures

### 4. Spike Forensics & Audit Logging

All reasoning and tool execution is auditable:

**Complete Audit Trail**:
- Every reasoning session: when it started, what identity ran it, what task it worked on
- Every tool call: what parameters, what result, what error (if any)
- Every LLM decision: what model, what tokens used, what reasoning path was taken
- Every memory stored: what was learned, when it was learned, by whom

**Replay & Forensics**:
- Operators can replay a session turn-by-turn to understand what happened
- Blackboard state (working memory) is captured at each step
- Tool results are logged in full, allowing inspection of what external systems returned
- If something goes wrong, you can diagnose it completely

**Spike Trains (Execution Pathways)**:
- The system's work is organized as directed acyclic graphs (DAGs) called Spike Trains
- Each spike (step) in the train is logged
- Operators can visualize the execution graph to understand what the system did and why
- Neurons (decision points) in the graph are named and tagged for easy diagnosis

## What Are-Self Does NOT Do

### No Autonomous Internet Access

- The system cannot browse the web, scrape websites, or download files on its own
- All external access is through explicitly configured tools
- Tools must be registered in the Parietal Lobe tool definition registry
- If a tool is not registered, the system cannot use it

### No Arbitrary Code Execution

- The system cannot execute shell commands unless a tool explicitly grants that capability
- It cannot install packages, modify system configuration, or access the filesystem outside of designated directories
- Code execution is sandboxed: only registered tools can take actions outside the Python process

### No Autonomous Purchases or Payments

- The system cannot submit payment forms, authorize transactions, or access financial systems
- It cannot interact with cryptocurrency wallets or cryptocurrency exchanges
- If a tool for financial transactions exists, the operator must explicitly register it, and the system still cannot execute it without explicit tool definition

### No Data Exfiltration

- The system cannot transmit data to external services without explicitly configured tools
- No telemetry, no crash reporting, no analytics
- Memories and session state are stored locally in PostgreSQL
- The only data that leaves the machine is what the operator intentionally configures (e.g., cloud LLM failover)

### No Autonomous Scraping or Crawling

- The system cannot make unlimited requests to external services
- Rate limiting and circuit breakers prevent hammering remote endpoints
- If web scraping capability is needed, the operator must explicitly register a scraping tool with rate-limiting constraints
- Using scraping tools without respecting terms of service or laws is the operator's responsibility

### No Deception or Manipulation

- The system does not generate deepfakes, synthetic media, or misleading content by default
- Image/video generation tools are not included in the base release
- Text generation is transparent — the system does not disguise its output as human-written
- The system cannot impersonate humans, other identities, or systems without explicit tool registration

### No Unconstrained LLM Usage

- The system cannot make unbounded LLM calls
- Token budgets enforce maximum usage per session
- Rate limiting prevents rapid-fire inference requests
- The operator can monitor and cap total usage to manage compute resources

## Constraints on AI Behavior

### Model Selection & Routing

Are-Self uses the Hypothalamus to select models based on task requirements:

- Small, fast models for simple tasks (e.g., Llama 2 7B for classification)
- Larger, more capable models for reasoning tasks
- Fallback to local models if cloud providers are unavailable
- Automatic downgrade if the system makes an error or gets confused

**Operator control**:
- You can restrict which models are available
- You can disable certain models entirely
- You can configure fallback strategies
- You can rate-limit inference to manage costs

### Prompt Constraints

The system's reasoning is constrained by:

- **Identity**: A predefined persona with instructions on how to behave
- **Task Focus**: Each session focuses on a single task or objective
- **Conversation History**: Limited to a sliding window (last 6 turns by default) to prevent context creep
- **System Instructions**: Built-in safeguards in the system prompt that override user requests

### Tool Permission Model

Tools are grouped by risk level:

- **Low-risk tools**: Read-only file access, local database queries, simple transformations
- **Medium-risk tools**: API calls to external services, file writes in designated directories
- **High-risk tools**: Web scraping, code execution, system administration commands

Operators can:
- Enable/disable tools at the identity level
- Constrain tool parameters (e.g., max requests per minute for API tools)
- Audit tool usage
- Add human approval gates for high-risk tools (planned feature)

## Age-Appropriate Considerations

Are-Self's default configuration is designed to be safe for children and young teenagers:

### No Exposure to Harmful Content

- The system does not search the internet or access external websites by default
- No tool is configured to fetch or display potentially harmful content
- If external content access is needed, the operator must explicitly register and configure such tools

### Safe Conversation Defaults

- The system is configured with a helpful, educational persona by default
- The system cannot be prompted into providing harmful information (system constraints override user prompts)
- Conversations focus on constructive tasks: learning, problem-solving, creative projects

### Limited Identity Manipulation

- Children cannot easily switch identities or personas that circumvent safeguards
- The identity system is operator-controlled, not user-controlled
- Each identity has documented capabilities and constraints

### Transparent AI Behavior

- The system clearly indicates when it's using external resources
- Tool calls and results are logged and auditable
- Children can understand what the system did and why
- The system does not hide its reasoning or create an illusion of sentience

### Parental/Staff Oversight

- The operator (parent, teacher, or staff member) maintains full visibility
- All sessions, memories, and tool calls are auditable
- The operator can review what the system learned and did
- Kill switches and manual overrides are available
- Network access can be restricted to local-only

## Misuse Prevention

### Deliberate Misuse

If an operator intentionally configures Are-Self for harmful purposes:

- **Scraping at scale**: Register a web scraping tool with rate limiting; the operator is responsible for respecting terms of service
- **Spam campaigns**: Register a messaging tool; the operator is responsible for not using it for spam
- **Resource exhaustion**: Configure unlimited token budgets and no rate limiting; the operator is responsible for not DoSing remote services

**The point**: Are-Self provides safeguards and makes harmful configurations explicit. But MIT license means the operator is ultimately responsible for their deployment.

### Accidental Misuse

Arc-Self includes guardrails to prevent accidental misuse:

- **Runaway loops**: Focus Economy prevents infinite execution
- **Resource exhaustion**: Token and rate-limit budgets are enforced by default
- **Tool parameter injection**: Parietal Lobe validates all parameters
- **Unintended data access**: Tools must be explicitly registered; access is not implicit

## Responsible AI in Educational Settings

### Best Practices for Schools & Nonprofits

**For Teachers & Staff**:
1. Define clear educational objectives for each AI session
2. Review AI-generated content before showing it to students
3. Monitor tool usage — ensure the AI is not accessing inappropriate external resources
4. Use the audit logs to understand what the system learned and did
5. Implement age-appropriate safeguards (no external internet access unless needed)
6. Discuss AI capabilities and limitations with students
7. Maintain human oversight — AI assistance, not replacement of instruction

**For Students**:
1. Understand what the AI can and cannot do
2. Use the AI as a learning tool, not a replacement for learning
3. Verify AI-generated information against reliable sources
4. Give the AI clear, specific tasks (not vague or harmful requests)
5. Understand that your conversations are logged and auditable
6. Respect the operator's policies on tool usage and data access

**For Parents**:
1. Understand that Are-Self is running on school/nonprofit infrastructure, not the cloud
2. Understand what data is collected and how it's used
3. Request access to audit logs if you have concerns
4. Discuss AI literacy with your child (what it can do, what it can't)
5. Know that the system cannot autonomously access the internet or make purchases

### Curriculum Integration Ideas

- **Writing & Language Arts**: Use Are-Self as a writing tutor, editor, or brainstorming partner
- **Math & Problem Solving**: Use as a tutor for concept explanation and practice problem generation
- **Science**: Use as a lab partner to help design experiments or analyze data
- **Social Studies & History**: Use as a research assistant to explore topics
- **Creative Projects**: Use to brainstorm ideas, generate outlines, or provide feedback
- **Coding & Computer Science**: Use as a tutor for explaining concepts (not as code generation)

In all cases, emphasize that Are-Self is a tool for learning, not a replacement for thinking.

## Supply Chain & Dependency Security

Are-Self's dependencies are regularly audited for security vulnerabilities:

- **Before each release**: All dependencies are scanned for known CVEs
- **Version pinning**: All production dependencies are pinned to specific, verified versions
- **Hash verification**: Critical dependencies are verified by SHA256 hash
- **Incident response**: If a dependency has a vulnerability, Are-Self's version pins are updated and a security advisory is issued

See the [Software Bill of Materials](./sbom.md) and [Incident Response Plan](./incident-response.md) for details.

## Operator Obligations Summary

When you deploy Are-Self, you commit to:

1. **Understanding the system**: Read the documentation. Know what it can and cannot do.
2. **Configuring safely**: Only register tools that are appropriate for your use case. Constrain parameters. Implement rate limiting.
3. **Monitoring actively**: Review audit logs regularly. Watch for unexpected behavior. Respond to anomalies.
4. **Complying with laws**: If using web scraping, ensure you respect robots.txt and terms of service. If processing personal data, comply with COPPA, GDPR, FERPA, etc.
5. **Securing your deployment**: Use network segmentation, authentication, and encryption appropriate for your data and users.
6. **Maintaining transparency**: If working with minors, parents should understand how their data is used. If in a workplace, employees should know what's being automated.
7. **Testing before production**: Validate that the system behaves as expected in your specific configuration before relying on it.
8. **Having a kill switch**: Maintain the ability to pause or shut down the system immediately if something goes wrong.

## Final Note

Are-Self is designed to be safe by default and responsible by design. But ultimate responsibility rests with the operator.

The system will not prevent you from misu