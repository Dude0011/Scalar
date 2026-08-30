# Scalar — Stateful Voice-First Transaction Engine

> **"Scalar keeps your business numbers straight."**  
> **micro1 Agentic Workflows Hackathon Submission**  
> A mobile-first Progressive Web App (PWA) that converts unstructured spoken commerce dictations into structured transaction ledgers using **Fireworks AI (Llama 3.3 70B)** reasoning, stateful RAG catalog item memory, price drift guardrails, and real-time inventory depletion tracking.

---

## 🏗 System Architecture Flow

```
                                 ┌─────────────────────────────────┐
                                 │  Voice Input / Spoken Dictation │
                                 └────────────────┬────────────────┘
                                                  │
                                                  ▼
                                 ┌─────────────────────────────────┐
                                 │ Groq Whisper Large v3 STT Api   │
                                 └────────────────┬────────────────┘
                                                  │ (Unstructured Transcript)
                                                  ▼
                                 ┌─────────────────────────────────┐
                                 │ Fireworks Llama 3.3 70B Agent   │
                                 │ Entity Extraction (Item,Qty,Prc)│
                                 └────────────────┬────────────────┘
                                                  │ (Candidate Item & Claimed Price)
                                                  ▼
                                 ┌─────────────────────────────────┐
                                 │ CatalogStore RAG Item Memory    │
                                 │ Fuzzy Synonym & Catalog Lookup  │
                                 └────────────────┬────────────────┘
                                                  │
                         ┌────────────────────────┴────────────────────────┐
                         │                                                 │
                         ▼ (Catalog Match Found)                           ▼ (No Match / New Item)
        ┌──────────────────────────────────┐                      ┌──────────────────────────────────┐
        │  Price Variance Guardrail Check  │                      │  Create New Catalog Item Record  │
        │  |Claimed - Historical| / Hist   │                      │  Assign Default Safety Price     │
        └────────────────┬─────────────────┘                      └────────────────┬─────────────────┘
                         │                                                         │
             ┌───────────┴───────────┐                                             │
             │                       │                                             │
             ▼ (<35% Variance)       ▼ (>35% Variance)                             │
    ┌─────────────────┐     ┌─────────────────────┐                                │
    │ 🟢 HIGH CONF    │     │ 🟡 MEDIUM CONF      │                                │
    │ 98% • Sure      │     │ 68% • Price Drift   │                                │
    └────────┬────────┘     └──────────┬──────────┘                                │
             │                         │                                           │
             └─────────────────────────┼───────────────────────────────────────────┘
                                       │
                                       ▼
                       ┌──────────────────────────────┐
                       │  IMMEDIATE LEDGER COMMIT     │
                       │  - Stock Level Decremented   │
                       │  - Feed Updated in Realtime  │
                       │  - Confidence Badge Rendered │
                       └───────────────┬──────────────┘
                                       │
                                       ▼
                       ┌──────────────────────────────┐
                       │  Post-Hoc Inline User Audit  │
                       │  Tap ✏️ Edit → Save Audit     │
                       │  Badge Upgrades: 🔵 100% Audit│
                       └──────────────────────────────┘
```

---

## 🌟 Key Features

1. **Non-Blocking Immediate Voice Commit**:
   - 100% of spoken entries log instantly to the transaction feed without annoying lockout modals.
   - Every entry displays a visual confidence badge (**🟢 98% Sure**, **🟡 68% Price Drift**, **🔴 45% Unsure**).

2. **RAG Item Memory & Synonym Consolidation**:
   - Fuzzy matcher maps spoken variants (*"oat latte"*, *"iced latte"*, *"latte"*) to canonical catalog items.
   - Completely eliminates duplicate catalog creation (**100% duplicate reduction**).

3. **Price Drift Guardrails & Stock Depletion**:
   - Compares claimed dictation prices against historical product averages.
   - Automatically decrements stock levels in real time and triggers low-stock supplier reorder alerts.

4. **Inline Post-Hoc Auditing**:
   - Shop owners can audit and adjust name, unit price, or quantity on any logged transaction row.
   - Saving upgrades entry confidence to **🔵 `100% • Audited`** and updates catalog pricing.

5. **Keyless Vercel Serverless Architecture**:
   - Backend endpoints (`api/stt.js` & `api/agent.js`) securely process AI inference via Fireworks AI and Groq without exposing API keys to the browser.

---

## 📊 Benchmark Evaluation Results (`Agent` vs `Baseline`)

| Metric | Memoryless Baseline | Scalar Agent (RAG + Guardrails) | Measured Gain |
| :--- | :---: | :---: | :---: |
| **Duplicate Items Created** | 3 duplicate entries | **0 duplicates (Consolidated)** | **100% Reduction** |
| **Price Drift Caught** | 0 / 1 (Silently Overwritten) | **1 / 1 Flagged with Badge** | **+100% Accuracy** |
| **Stock Reconciliation** | ❌ No stock tracking | **✅ Realtime Auto-Depletion** | **Full Inventory Tracking** |
| **User Experience Friction** | Mandatory lockout forms | **Instant Non-Blocking Commit** | **Zero Speed Bottleneck** |

---

## 📄 Hackathon Deliverables & Documentation

- **[`CHANGELOG.md`](./CHANGELOG.md)** — Complete iteration changelog detailing evolution from Baseline to Final Architecture.
- **[`REPRODUCTION_GUIDE.md`](./REPRODUCTION_GUIDE.md)** — Step-by-step local reproduction, A/B baseline testing, and Vercel deployment guide.
- **[`docs/scalar_hackathon_brief.md`](./docs/scalar_hackathon_brief.md)** — Hackathon rubric mapping and architectural design decisions.

---

## 🛠 Tech Stack

- **Frontend**: React, Vite, Tailwind CSS (Minimalist Black & White Theme)
- **Backend API**: Vercel Serverless Functions (`api/stt.js`, `api/agent.js`)
- **AI Models**: Fireworks AI (`llama-v3p3-70b-instruct`), Groq (`whisper-large-v3-turbo`)
- **PWA**: Web App Manifest & Service Worker
