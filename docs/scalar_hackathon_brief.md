# Scalar — Voice-First Transaction Logger
## Hackathon Build Brief (micro1 Agentic Workflows Hackathon, Aug 28–30, 2026)

---

## 1. Context: Why This Project Exists

This is being built for the **micro1 Agentic Workflows Hackathon**. The brief for that hackathon is open-ended: pick a real problem you understand, use AI agents to solve it, and prove — with a fair baseline comparison — that your agent solution meaningfully improves how the task is handled today.

Judging criteria (100 pts total):
- Problem & User Value — 15 pts
- Agent Solution & Engineering — 30 pts
- End-to-End Quality — 20 pts
- Measured Improvement — 15 pts
- Reproducibility — 15 pts
- Hot Take / Insights — 5 pts

**This build is scoped strictly for the hackathon submission (a working v1, built in roughly one day).** It is explicitly the seed of a larger long-term product (see Section 7), so code should be clean and modular — but do not build v2 features now. Anything not in Section 4 (Hackathon Scope) is future work and should not be implemented today.

---

## 2. The Problem

### Origin story (why this is real, not invented)
The idea comes from a real, lived bottleneck: a family-run provision shop in Nigeria where sales are tracked manually. This creates recurring problems:
- Sales aren't reliably logged, so daily totals are inconsistent
- Stock depletion goes unnoticed until items run out
- There's no reliable way to reconcile what an employee says they sold against actual cash on hand
- Prices drift over time (market price changes) but the system has no memory of what changed and when

### Who has this problem
Small shop owners and sellers who need to log transactions quickly, hands-free, in the middle of serving customers — but this is not limited to shops. The same pattern applies to anyone doing rapid, repeated, spoken transactions: a market shopper buying many items in one trip and losing track of what was paid for what, a street vendor, a freelancer logging billable time, someone just trying to track personal spending as it happens.

### Why a plain LLM prompt does NOT already solve this
This is important — we are explicitly not claiming "AI can transcribe speech," because frontier speech-to-text and LLMs already do that well. The actual gap is **persistent, evolving memory of items and prices across a session (and over time)**, not a single sentence in isolation.

A one-shot prompt like *"extract item, quantity, and price from this sentence"* has no memory. It will:
- Fail to recognize that "rice," "the rice," and "white rice" spoken at different points refer to the same catalog item — creating duplicate or inconsistent entries
- Never update a price once market rates change — it just re-extracts whatever number was said, with no awareness that this contradicts a previously logged price
- Have no way to flag ambiguity — it will confidently guess, even when it's wrong, because it has no retrieval context to check against

**Our claim**: an agent with retrieval-based memory (RAG) over previously logged items and prices, plus explicit human-in-the-loop confirmation for anything ambiguous, will consolidate and reconcile transactions correctly where a memoryless baseline fragments or silently hallucinates.

---

## 3. Positioning: Global, Not Nigeria-Only

The origin story is Nigerian (a family shop), and that context should be kept in the README and demo as the honest, concrete motivating example — it makes the problem real and specific, which the hackathon explicitly rewards ("who has this problem" must be a clearly defined user).

However, **the product itself must be framed and built as globally applicable, not Nigeria-specific or shop-specific.** Do not hardcode Naira-only logic, Nigerian item names, or anything that reads as a narrow regional tool. Concretely:

- Currency should be a configurable field, not assumed
- The demo/test cases should include at least one non-Nigerian scenario (e.g. a US ice cream vendor logging "two dollars for a cone") alongside the shop scenario, to show the same pipeline generalizing
- Language: for this hackathon build, **use plain English only**. Do not attempt Pidgin/Yoruba/Igbo or code-switched speech — that's a real future direction, but adding it now would eat the entire build day on STT accuracy work instead of the actual differentiator (memory/RAG). Say so explicitly in the README's future work section.
- Use case framing in the README should mention: shop sales, market/personal shopping trips, informal vendors, freelance time/expense logging — one flexible tool, many applications, not "a shop app."

---

## 4. Hackathon Scope (Build This — Nothing More)

### 4.1 Core flow (the agent solution)
1. User speaks a transaction naturally (e.g. "sold two cups of rice for five hundred naira" / "two dollars for an ice cream cone")
2. Audio → **Groq-hosted Whisper Large v3 Turbo** (free tier, already have API access from UnivAI) → transcript
3. Transcript → parsing step extracts: item, quantity, unit price (or total price)
4. **RAG retrieval**: match the extracted item name against a memory store of previously logged items (embeddings or fuzzy/semantic matching — not exact string match), even if phrasing differs slightly from before
5. If a confident match is found: retrieve last known price for that item, log the transaction, show it to the user for a quick confirm/edit before finalizing
6. If no confident match (new item, ambiguous phrasing, or a price that meaningfully contradicts history): **flag it for the user to review/correct** rather than guessing silently
7. When the user corrects or confirms a price, write that correction back into memory so future mentions of that item use the updated price automatically
8. At any point, user can view a running log/total of the session

### 4.2 Baseline (for comparison — must be built too)
A deliberately simple version representing "how this is handled today with a plain approach":
- Same STT step (Whisper) → one direct LLM prompt: *"extract item, quantity, and price from this sentence"*
- No memory across transactions — every sentence parsed in isolation
- No fuzzy matching — if phrasing differs from a prior mention, treat it as a new/unknown item
- No price history or contradiction-checking — whatever number is said is logged as-is, no flags

### 4.3 Test cases / evaluation
Record 8–10 short spoken clips (English) covering:
- Same item referred to 3 different ways across the session (e.g. "rice," "the rice," "white rice") — tests whether RAG consolidates vs. baseline fragmenting into duplicates
- One case where the price for a previously-logged item changes mid-session (market price update) — tests whether the agent flags/reconciles the contradiction vs. baseline silently overwriting or ignoring it
- One brand-new item never mentioned before — both should log this correctly; sanity check
- One noisy/ambiguous phrasing case (mumbled, unclear quantity) — tests whether the agent flags for review instead of guessing, vs. baseline confidently guessing wrong
- At least one non-Nigerian-currency example (USD) to demonstrate generalization

Run both baseline and agent on the identical clips. Record:
- Whether each system correctly consolidated repeated items vs. created duplicates
- Whether each system caught the price change vs. missed/silently overwrote it
- Whether each system flagged the ambiguous case vs. silently guessed (and whether the guess was right or wrong)

This becomes the "Measured Improvement" evidence — the key metric is **how many ambiguous/contradictory cases the baseline silently got wrong vs. how many the agent correctly flagged for human review.**

### 4.4 Platform
Mobile app (Android, since that's the dev's device). Build with Antigravity IDE. Keep UI simple and clean — functional over polished. Priority order if time runs short:
1. Working baseline
2. Working core agent (RAG + memory + confirm/flag flow) end-to-end
3. Test case recordings + results
4. UI polish
5. Demo video
6. README / changelog / reproduction guide

If time runs out, a working baseline + a partially-working agent with an honest changelog entry about what failed and why is still a submittable, scoreable project — the hackathon explicitly rewards documented failure modes ("Hot Take / Insights").

---

## 5. Technical Notes

- **STT**: Groq API, Whisper Large v3 Turbo model, free tier (already have API access; well within free-tier rate limits for a demo of ~15-20 clips total)
- **RAG / memory**: item catalog with embeddings (or start with simpler fuzzy/semantic string matching if time-constrained, upgrade to vector embeddings only if time allows — don't start with the heaviest version)
- **Price history**: store a running history per item, not just the latest value, so contradictions/changes can be detected and shown to the user
- **LLM for parsing/reasoning**: reuse existing Groq multi-LLM routing setup from UnivAI if convenient
- **Human-in-the-loop**: every ambiguous or low-confidence extraction must surface a confirm/edit UI step before being finalized — never silently commit an uncertain guess

---

## 6. Deliverables Checklist (per hackathon requirements)

1. **Complete solution code + Improvement Changelog** — README explaining the user, the bottleneck, why it's valuable; changelog table (Baseline → Iteration 1 → ... → Final) documenting what was tried, evidence, and decisions/learnings at each step
2. **Reproduction guide** — clean-environment setup steps, exact commands for baseline, agent, and evaluation, expected output, approximate runtime/cost
3. **Solution video** (≤5 min) — problem + baseline first, then one realistic end-to-end execution, final comparison, changelog highlights, one experiment that was tried and removed
4. **Agent trajectories** — representative logs showing agent instructions → tool calls/retrieval → results → any retries or human confirmation steps, for both baseline and agent runs

---

## 7. Explicitly Out of Scope for the Hackathon (Future v2 Work)

Do not build any of this now. Mention briefly in the README's "Future Directions" section only:

- Dedicated wearable hardware (wristwatch, necklace, or clothing tag) with local on-device inference and ambient/always-listening mode
- On-device STT (e.g. Moonshine or whisper.cpp) for offline, battery-efficient operation — hackathon build uses the Groq API instead
- Multi-language / code-switched speech support (Pidgin, Yoruba, Igbo, etc.)
- Credit/debt tracking — logging what a customer bought on credit and reminding about amounts owed
- Notifications/alerts (e.g. low stock, unusual transaction amounts)
- Smartwatch companion app / cross-device sync
- Full inventory management and restock forecasting
- Multi-user / multi-shop support

This is intentional: the person building this plans to continue developing it as a real product after the hackathon. The hackathon build is v1 — a focused proof that the core memory/RAG mechanism actually solves the stated problem better than a memoryless baseline. Everything else is a deliberate, documented next step, not a missing feature.
