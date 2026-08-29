# Scalar — Stateful Voice-First Transaction Engine

> **micro1 Agentic Workflows Hackathon Submission**  
> A mobile-first Progressive Web App (PWA) that converts unstructured spoken commerce dictations into structured transaction ledgers using **Fireworks AI (Llama 3.3 70B)** reasoning, RAG catalog item memory, price drift guardrails, and real-time inventory depletion tracking.

---

## 🌟 Key Features

1. **Voice-First Dictation Engine**:
   - Tap-to-record & Ambient continuous stream modes.
   - Converts noisy spoken sales (e.g., *"Sold two croissants for nine dollars"*) into verified ledger transactions.

2. **RAG Item Memory & Synonym Consolidation**:
   - Fuzzy matcher maps spoken variants (*"oat latte"*, *"iced latte"*, *"latte"*) to canonical catalog items.
   - Prevents duplicate inventory item creation.

3. **Price Drift & Inventory Depletion Safeguards**:
   - Flags price anomalies (>15% variance from historical average) via a **Human-in-the-Loop (HitL)** review card.
   - Automatically decrements product stock levels in real time and triggers low-stock reorder warnings.

4. **Relative Human Timestamps ("5 mins ago")**:
   - Helps shop owners immediately identify transaction intervals to prevent accidental duplicate entries.

5. **Vercel Serverless Architecture**:
   - Direct backend serverless endpoints (`api/stt.js` & `api/agent.js`) securely process AI inference without exposing API keys to the client.

6. **Instant Mobile PWA**:
   - Native mobile experience with "Add to Home Screen" support on Chrome Android and iOS.

---

## 🚀 Quick Start & Deployment

### Vercel Deployment

1. **Push Repository to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Scalar - Stateful Voice Logger PWA"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/Scalar.git
   git push -u origin main
   ```

2. **Import into Vercel**:
   - Connect your GitHub repository at [vercel.com/new](https://vercel.com/new).

3. **Set Environment Variables in Vercel Settings**:
   - `FIREWORKS_API_KEY`: Your Fireworks AI API key.
   - `GROQ_API_KEY`: Your Groq API key (optional for STT).

---

## 📊 Benchmark Evaluation Results (`npm run eval`)

| Metric | Memoryless Baseline | Scalar Agent (RAG + Guardrails) | Measured Gain |
| :--- | :---: | :---: | :---: |
| **Duplicate Items Created** | 3 duplicate entries | **0 duplicates (Consolidated)** | **100% Reduction** |
| **Price Drift Caught** | 0 / 1 (Silently Overwritten) | **1 / 1 Flagged for Review** | **+100% Accuracy** |
| **Human-in-the-Loop Safeguards** | 0 Flags (Silent Hallucination) | **Human Safeguard Flagged** | **Full Safety** |

---

## 🛠 Tech Stack

- **Frontend**: React, Vite, Tailwind CSS (Black & White Stark Minimalist Theme)
- **Backend API**: Vercel Serverless Functions (`api/stt.js`, `api/agent.js`)
- **AI Models**: Fireworks AI (`llama-v3p3-70b-instruct`), Groq (`whisper-large-v3-turbo`)
- **PWA**: Web App Manifest & Service Worker

---

## 📄 Documentation

Additional project details and architecture documentation can be found in the [`docs/`](./docs) folder:
- [`docs/scalar_hackathon_brief.md`](./docs/scalar_hackathon_brief.md) — Comprehensive technical brief and rubric mapping.
