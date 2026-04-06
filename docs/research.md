---
id: research
title: "Research Papers"
sidebar_position: 85
---

# Research Papers

Are-Self is backed by academic research that formalizes the architectural decisions, evaluates the system's behavior, and explores future directions. All papers are open access under CC BY 4.0.

The full LaTeX source for all papers is available in the [are-self-research](https://github.com/scipraxian/are-self-research) repository.

## Published Papers

### Neuro-Mimetic Architecture

**Authors:** Michael Clark

The flagship paper describing Are-Self's brain-region software architecture. Covers the strict mapping between Django applications and neuroanatomical regions, the tick-cycle execution model that drives autonomous operation, the addon-based prompt assembly pipeline, and the Synaptic Cleft real-time event system. Evaluates the architecture's expressiveness across real-world autonomous workflows including code deployment, game build pipelines, and multi-agent reasoning swarms.

### The Focus Economy

**Authors:** Michael Clark

How Are-Self prevents unbounded agent execution without blunt turn limits. The Focus Economy links an agent's execution budget to the novelty of its learning: agents that save new memories (Engrams with low cosine similarity to existing knowledge) earn more reasoning capacity, while agents that loop or produce redundant output are naturally constrained. Formalizes the budget dynamics, analyzes equilibrium properties, and demonstrates effectiveness in preventing degenerate behavior.

### Hippocampus Hypergraph Migration

**Authors:** Samuel Frerichs (University of Pittsburgh at Applied Sciences), Michael Clark

Proposes migrating Are-Self's memory system from flat many-to-many Engram relations to a hypergraph structure with typed relationships (temporal, causal, contradiction, elaboration, generalization). Describes the migration path, backward compatibility with existing vector search, and expected improvements in contextual memory retrieval and knowledge consolidation.

### LLM Testing Harness

**Authors:** Michael Clark

Standard LLM benchmarks (MMLU, HumanEval) do not predict whether a model will function as an autonomous agent. This paper describes a testing harness that evaluates local models within Are-Self's actual execution environment, measuring tool call compliance, multi-turn consistency, focus budget efficiency, memory formation quality, and quantization effects across model families available via Ollama.

### CI/CD Sovereignty

**Authors:** Michael Clark

Are-Self's neural pathway system doubles as a self-hosted CI/CD orchestrator. This paper describes how build, test, and deployment pipelines are implemented as spike trains through the CNS, with AI-assisted failure diagnosis when the Frontal Lobe reasons about build logs. Eliminates cloud CI dependencies while adding intelligent pipeline management.

### Multiplayer Unreal + Autonomous AI

**Authors:** Michael Clark

A case study of building a multiplayer Unreal Engine project with Are-Self as an integral part of the development workflow. Describes how the AI serves as build engineer and project manager, automating shader compilation, save game management, multi-platform testing, and deployment sequencing through neural pathways.

## Contributing Research

We welcome research contributions. If you're interested in writing a paper about Are-Self or extending the existing work, see the [Contributing Guide](./contributing.md) and the [research repository](https://github.com/scipraxian/are-self-research) for the LaTeX template and guidelines.
