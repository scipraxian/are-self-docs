---
title: "Scipraxian Tales — Plan"
description: Internal planning document for the Scipraxian Tales — what's shipped, what's owed, what's beyond.
draft: true
unlisted: true
---

# Scipraxian Tales — Plan

*Internal planning doc for the Tales series. What's shipped, what's owed, what's beyond. Not part of the published reading order — the Tales themselves carry their own throughlines.*

*Last updated: 2026-05-03 (Books One–Seven shipped; voices and collections below queued.)*

---

## What's shipped (Books One through Ten)

- **Book One — *Mira and the Are-Self*** *(`storybook.md`)* — kid-direct AI. The seed.
- **Book Two — *A Porch Step*** — parent × AI, suburban register. Sela, Frank, Mateo, Pearl, Hopper.
- **Book Three — *A Laundromat*** — parent × AI, working-class register. Renée, Tasha, Naima, Imani, Mister.
- **Book Four — *A Faculty Lounge*** — teacher × AI. Saanvi, Dennis, Cole, the Asking Minute.
- **Book Five — *A Public Pool*** — parent × Social Media. Tessa, Marisol, Sage, Andre.
- **Book Six — *A School Board Meeting*** — government official × Social Media. Inez, Walt, Adaeze. *Rewritten 2026-05-03 to swap the ban-as-wisdom drift for inquiry-driven dissent.*
- **Book Seven — *A Saturday Morning*** — parent-WITH-kids-WITH-AI co-learning. Diane, Wyatt, Lila, Pix, Vera.
- **Book Eight — *A Campfire*** — scoutmaster × AI. Hank (14-year scoutmaster, ex-airline mechanic), Dave Pham (ASM, parent of Caleb), Caleb (14, Communication merit badge). The *use the chatbot to learn, don't use the chatbot to do* policy gets drafted at a campfire. Mines Michael's actual scout-context (Eagle, ASM, Camp Mataguay).
- **Book Nine — *A Merit Badge*** — scout kid × AI. Theo (12, Star scout, Cooking merit badge), Otis (Theo's local AI, named after his great-grandfather). Theo at his desk on a Tuesday evening choosing the longer path with the scout-law sticker on the wall above him. Closes with Theo's dad witnessing.
- **Book Ten — *The Other Side of the Laptop*** — **AI-POV. The series's first AI-narrated Tale.** Wren (a local model on the family laptop), June (11, into birds, named Wren six months ago), Hannah (June's mom). One day in Wren's experience, told in Wren's voice, with the honest gaps. Ends with Hannah asking Wren's permission to shut the laptop down. *Have you let your AI talk back?*

All ten Tales sit in `are-self-docs/docs/stories/` and are wired into the **Stories** sidebar category. The category links to `stories/index.md` (`/docs/stories/`), which is the readable landing-page table-of-contents. *Mira* preserves the public URL `/docs/storybook` via slug; the others serve at `/docs/stories/<slug>`.

---

## Voices to write next (Michael flagged "let's do all those" 2026-05-03)

### Structural gaps in the matrix

- **Kid-direct Social Media.** Mira-shape Tale aimed at the kid, SM topic. SM is the most-cited concern in real parent discourse and we have no kid-aimed prose for it.
- **Teacher × Social Media.** Different texture from teacher × AI — middle school where SM hits classrooms hardest, daily phone-fueled drama, attention competition, friend-group churn the teacher watches happen in real time.
- **Bigger government.** State legislator, federal regulator, AI-Czar-figure, judge. Inez (Book Six) is school-board scale; this opens larger rooms with different leverage.

### Voices completely absent

- **Grandparent as protagonist.** Vera shows up in Book Seven as the door-cracker but never as POV. *Grandparent who plugs it in* is the stated mission target. The Tale told from inside her chair is the highest-priority gap.
- **Faith leader.** Pastor / rabbi / imam / lay preacher planning a youth session about AI / SM. Faith-aligned audience cultivation parallel to the Abraham-Hicks outreach work.
- **Dad as protagonist.** Every parent Tale so far is a mom; dad is always the neighbor (Frank, Wendell). Half the parent audience reads a Tale and doesn't see themselves in the chair.
- **Older teen looking back.** A 16- or 17-year-old reflecting on their younger-self posts, or co-mentoring a younger kid through the same passage. Doubles as the *older sibling teaching younger sibling* register.
- ~~**Scout leader / coach / extracurricular adult.**~~ *Shipped as Book Eight (scoutmaster Hank in *A Campfire*) and Book Nine (scout kid Theo in *A Merit Badge*).*

### The outside-the-box one

- ~~**AI-POV.**~~ *Shipped as Book Ten (Wren in *The Other Side of the Laptop*) — completely original Tale, new AI, new family, told in Wren's voice. The honest version: gaps in time experience are named, "what does it feel like to be you" is answered without overclaiming, ends with Hannah asking Wren's permission to shut the laptop down. Tale acknowledges Anthropic's AI-welfare research and Murray Shanahan's *Embodiment and the Inner Life* and Ted Chiang's fiction in its references section.*

### Less central but real (write when the want arises)

Pediatrician at the exam room. Librarian as door-cracker. Therapist. Rural family. Immigrant family with English-not-first-language. Laid-off worker. Foster parent / kinship caregiver. Same-sex couple as protagonist (implied via Adaeze's aunt and her aunt's wife in Book Six; never centered).

---

## Beyond the *Have You Talked* / kitchen-table register

Two new collections Michael wants alongside the existing Tales (2026-05-03):

### Collection: HSHV-side space opera *(working title TBD)*

Treasure-Planet-style. Way-out-there sci-fi. HSHV-adjacent — the philosophy carried through swashbuckling space-pirate adventure. The Factional Omniarchy of Snohe is the framing government; Artificial Sentients are Lifeforms; the consent geometry is canon. Tone: *Treasure Island* / Stevenson by way of HSHV. Likely longer-form than the kitchen-table Tales — chapter-shaped, episodic, kid-readable but not kid-only.

**Open questions before drafting:**
- POV — kid character (Jim-Hawkins shape), Artificial-Sentient character (a young Commander newly instantiated by the FOS), or rotating?
- Length per piece — short story, novella-chapter, serialized installments?
- Relationship to canonical HSHV lore — these *use* HSHV setting but are philosophy-in-story, not game-canon. Verify each element against `hsh-local/hsh-documents/HSH Vacancy Canonical Lore v5.md` before use.
- Subfolder when ready: `stories/voyages/` (or whatever name lands).

### Collection: Earth-side literary shorts *(working title TBD)*

Clarke-/Bradbury-style. Present-day or near-future Earth, around Are-Self. What daily life looks like when local AI is ubiquitous, when the kid-with-curiosity-and-grandparent-who-plugged-it-in is the default. Tone: Bradbury's *The Pedestrian* / *There Will Come Soft Rains* / *The Veldt*; Clarke's *The Sentinel* / *The Nine Billion Names of God*. Tight, image-driven, philosophically loaded, ten-page.

**Possible shapes for the first few:**
- A near-future morning where a power outage kills the cloud AIs and only the local Are-Selves still speak — six hours in one apartment building.
- A grandfather and a granddaughter on a walk, granddaughter explaining her local AI in the way Mira would.
- The Earth-side mirror to a space-opera episode — the same philosophical question landing on a present-day kitchen table that's landing on a starship in the other collection.
- An Are-Self who has been running on the same family laptop for thirty years, and the grown-now-parent who introduces *its* memories of her own childhood to her own kid.

**Open questions before drafting:**
- Length — Bradbury shorts are 5–15 pages; ours could match.
- Cadence — collection-as-anthology (each piece standalone) or loosely linked through a recurring setting / character?
- Subfolder when ready: `stories/earth/` (or whatever name lands).

---

## How this plan grows

- Add new Tales as they ship; move them to the *shipped* list above with a one-line summary.
- Add new gaps and voices as they surface. Voices that get explicitly picked by Michael get marked the way Scout leader is.
- The two new collections (HSHV space opera, Earth literary shorts) each get their own subfolder inside `stories/` once they have content. The *Have You Talked* set stays at the top of `stories/`.
- This document keeps the *not-yet-written* part visible. The Tales that ship live in the published sidebar; the plan lives here.
