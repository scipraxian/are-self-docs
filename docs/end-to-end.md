---
id: end-to-end
title: "End-to-End Walkthrough"
sidebar_position: 3
---

# End-to-End Walkthrough

A clean, successful run through the full tick cycle: **Identity → IdentityDisc → CNS Pathway → SpikeTrain → Frontal Lobe reasoning session → Parietal tool calls → multi-endpoint distribution → PNS monitoring.** Every screenshot below came from a single continuous session on **2026-04-21**.

If you're trying to get your head around what Are-Self actually *is* and what it actually *does*, read this top to bottom before anything else. It's the shortest path from "I installed it" to "oh, that's the whole machine."

---

## 1. Start — BrainView landing page

![Start](/img/ui/e2e-01-start.png)

This is where you land when you open Are-Self. Brain spins in the middle, counters up top tell you what exists in the project (4 Identities, 3 Pathways, 4 Sessions), Latest Spikes and Latest Sessions down the sides give you a live read on what just ran, and the row of buttons at the bottom is the quick nav into every brain region. Nothing to do here yet — we're about to make the parts.

---

## 2. New Identity with Tools

![New Identity with Tools](/img/ui/e2e-02-new-identity.png)

First I created a new Identity, LogDude. Then I gave it only the tools it needs: `mcp_read_record_field`, `mcp_inspect_record`, `mcp_read_record_field`, `mcp_done`.

I also gave it the Normal Chat Addon. Without a history addon, each prompt is devoid of previous turns.

Now I click Spawn (which should be named Forge — sorry about that).

---

## 3. Forged Identity with Compiled Prompt

![Forged Identity with Prompt](/img/ui/e2e-03a-forged-identity.png)

This is the forged IdentityDisc of LogDude. Now we can set the **System Prompt** which says *"Make one tool call to answer the question, then call mcp_done."*

It's really important you start to understand that we are giving the LLM a specific prompt. Without these simple things it will just run tools until it finds something to do — likely looping forever (until it's out of turns).

Note that we don't need to edit the tools because they inherit from the Identity it was forged from (upon forge only).

![Forged Identity with Model Selection Filter](/img/ui/e2e-03b-model-selection.png)

We do however need to set the **Model Selection Filter** — it needs to be a model that supports tool use. I know the local coder does, so I pick that and it resolves through the Hypothalamus to qwen3, which is exactly what we want.

---

## 4. CNS — Pick/Create a Pathway

![CNS Create New](/img/ui/e2e-04-create-pathway.png)

Now to use said IdentityDisc we need to give it something to do. We'll use a simple Neural Pathway to give you an idea of one way we can use the Frontal Lobe. The CNS is where Neural Pathways get built. Here we create a new pathway, Example One.

---

## 5. Edit the Pathway — ReactFlow graph editor

![CNS Edit](/img/ui/e2e-05-edit-pathway.png)

Inside Example One we drag several nodes over — two List Location effectors and one Frontal Lobe effector — and connect them all up. All Pathways start with a Begin Play effector. You can run as many Neurons in parallel as you have Celery workers and/or Neural Terminals to execute them.

Selecting any node gives you a detail view; double-clicking opens the effector editor.

---

## 6. Launched SpikeTrain — parallel execution

![Parallel SpikeTrain](/img/ui/e2e-06-spiketrain.png)

Now we see the executed SpikeTrain. Nodes light up as they run. Nodes that don't run stay grayed out. Errored nodes go red and will either stop the graph or keep flowing, depending on the output axon (wire) choices available. Here I used on-success to run the Frontal Lobe.

---

## 7. Spike Detail — drill in for logs

![Spike Detail panel](/img/ui/e2e-07-spike-detail.png)

Clicking any Spike opens the **Spike Detail** rail with deeper info and action buttons. You can also double-click a Spike to drill in.

---

## 8. Raw Session Logs — application & execution

![Raw Session Log](/img/ui/e2e-08-session-log.png)

This is the Frontal Lobe session log. Not very readable, but really nice to have sometimes. It's important to note that this is a live-streaming log — all log views on all pages are live-streaming unless the Spike has ended. I'll come back to this later.

---

## 9. Frontal Lobe — 3D Graph View

![Frontal Lobe Graph](/img/ui/e2e-09-graph-view.png)

Now we can finally see the actual LLM run across our task. This is the **3D Graph View** of the reasoning session — 3D because once engrams are involved everything starts tying back on itself, and it's also very visceral to be able to see and touch tool calls. In larger LLMs there may be tens of calls per turn, so being able to see them all at a glance matters. Clicking any node gives you more detail. The red nodes are tool calls; the spheres grow in size as the LLM runs, and their color shifts from green to orange — fast to slow. The final diamond node is `mcp_done`, which always has more info.

Note that Manual Override lets you continue a session AND inject during a running session.
Reboot stops the session and tries again, attaching to the same origin Spike.
Dump Data is a convenience function to dump a run and go over it with a Large LLM.
Access DB should take you to the Django admin where you can pull raw data.

---

## 10. Frontal Lobe — Chat View

![Frontal Lobe Chat](/img/ui/e2e-10-chat-view.png)

The Chat tab is for looking at the run more like you'd be used to seeing. Still shows more data than a typical chat would.

---

## 11. Frontal Lobe — Parietal View

![Frontal Lobe Parietal](/img/ui/e2e-11-parietal-view.png)

This is the super helpful Parietal view — just the tools that were called, in order. This has been essential for tool development.

---

## 12. Spike Set — select multiple Spikes to compare

![Spike Set 2 spikes](/img/ui/e2e-12-spike-set.png)

Here I've selected two Spikes to compare. You can compare N Spikes at a time — it's all about real estate, CPU, and bandwidth, not capabilities. Also important to mention that Spikes can be from multiple Trains.

---

## 13. Parallel Live Streams — supporting N endpoints

![Parallel Live Streams](/img/ui/e2e-13-parallel-streams.png)

Here we see those two Spikes side-by-side — we call it a Spike Set.

This is the infrastructure that generalizes to **N endpoints** — when the Distribution Mode isn't Local Server but Neural Terminals, this view becomes an N-column grid of live-streaming terminals.

---

## 14. List Location — Effector & Executable config

![List Location Effector](/img/ui/e2e-14-effector-config.png)

A Neural Pathway has Neurons. Pathways become Trains, Neurons become Spikes — but what are Spikes? Spikes "run" Effectors. Effectors are configurations of Computer Operating System Executables like Python or Powershell. In this case we're using the Powershell Executable from the List Location Effector.

A quick brief on the fields you're seeing:

- **Full Command** — renders the resolved command-line.
- **Name** — `List Location`.
- **Effector Type** — `Local Server (Default)`.
- **Executable** — `Windows Powershell Command` (a catalog dropdown).
- **Executable Arguments** — `ls`.
- **Distribution Mode** — `Local Server (Default)`.
- **Effector Arguments** — empty table with **+ Add Argument** and **Save Executable**.
- Below: **Effector Arguments** list and **Context Action** row.

This is the data-row that the ReactFlow node references; editing here changes what every neuron in every pathway does with this Effector.

---

## 15. Distribution Mode — the fan-out selector

![Distribution Mode](/img/ui/e2e-15-distribution-mode.png)

So where do the Effectors run? That's a super important question. They run either locally or on a Neural Terminal. You choose which here, but you can ALSO change the Distribution Mode on a single Neuron. Note that Neurons WILL multi-execute — if you say ALL, you'll get multiple Spikes from one Neuron. Just a heads up.

---

## 16. PNS — Nerve Terminal endpoint

![PNS Nerve Terminal](/img/ui/e2e-16-pns-terminal.png)

If you DO have Neural Terminals, this is where they show up — the Peripheral Nervous System. You also have control over the heartbeat here, and we give you a CPU/GPU graph so you can keep an eye on your resources before, during, and after a run. If you want CPU data from a remote machine, use a Neuron with the proper Distribution Mode, then watch that Spike here.

---

## What this walkthrough proves

Reading top-to-bottom, the run exercises every layer of the tick cycle without a stumble:

1. **Identity authoring → forging** — a persona with tools, addons, and model routing is compiled into a live IdentityDisc (sections 2–3).
2. **Pathway authoring → execution** — a ReactFlow graph becomes a running SpikeTrain with correct parallel fan-out and convergence (sections 4–6).
3. **Forensics at every depth** — spike detail, raw session logs, reasoning graph, chat reconstruction, and parietal tool-call ledger are all available for the same session without leaving the app (sections 7–11).
4. **Distribution topology** — the effector and the distribution mode selector expose the substrate for scaling from Local Server to N-endpoint fleet waves; the spike-set comparison view is the N-up terminal that makes that scale legible (sections 12–15).
5. **PNS telemetry** — a real Nerve Terminal endpoint is registered and reporting, closing the loop (section 16).

One identity, one pathway, one train, four spikes, **48.9 seconds**, clean SUCCESS top to bottom. Date stamp: **2026-04-21, 9:01:11 AM**.
