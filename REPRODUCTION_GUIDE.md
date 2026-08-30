# Scalar — Reproduction & Verification Guide

> **micro1 Agentic Workflows Hackathon Deliverable**  
> Step-by-step instructions to run, verify, and test Scalar locally or in production.

---

## 🛠 1. Local Development Setup

### Prerequisites
- Node.js (v18.x or higher)
- npm (v9.x or higher)
- Git

### Clone & Install
```bash
git clone https://github.com/Dude0011/Scalar.git
cd Scalar
npm install
```

### Run Dev Server
```bash
npm run dev
```
Open **`http://localhost:5173/`** in your browser.

---

## 🧪 2. How to Benchmark: Agent (RAG) vs Baseline

Scalar includes a built-in A/B mode toggle in the top header:

1. **Step 1: Setup Demo Store Data**
   - Click the **✨ (Sparkles)** icon in the header to open setup.
   - Click **"Populate with Demo Data & Launch"**.
   - This seeds 4 items (*Artisan Croissant $4.50, Oat Milk Latte $5.50, Organic Espresso Beans $16.00, Avocado Toast $11.00*).

2. **Step 2: Test Baseline Mode (Memoryless)**
   - Click the header mode button to toggle to **`Baseline`** (amber badge).
   - Enter/speak: *"Sold 2 croissants for 9 dollars"*.
   - **Result**: Baseline logs raw string `"sold 2 croissants for 9 dollars"`. Stock is **NOT** decremented, catalog is **NOT** queried, and no confidence score is computed.

3. **Step 3: Test Scalar Agent Mode (Stateful RAG)**
   - Click header mode button to toggle to **`Agent (RAG)`** (blue badge).
   - Enter/speak: *"Sold 2 croissants for 9 dollars"*.
   - **Result**:
     - Auto-matches canonical catalog item **`Artisan Croissant`**.
     - Calculates 0% price variance against historical $4.50/unit price.
     - Logs immediately with **🟢 `98% • Sure`** confidence badge.
     - Auto-decrements stock from `30` to `28`.

4. **Step 4: Test Price Drift Detection**
   - In **`Agent (RAG)`** mode, enter/speak: *"Sold 1 croissant for 20 dollars"*.
   - **Result**:
     - Matches `Artisan Croissant`.
     - Calculates 344% price variance ($20.00 vs $4.50).
     - Logs immediately with **🟡 `68% • Price Drift`** warning badge.

5. **Step 5: Test Inline Post-Audit**
   - On the logged price drift row, click the **✏️ (Pencil icon)**.
   - Adjust price to `$4.50` and click **"Save Audit Update"**.
   - **Result**: Badge immediately upgrades to **🔵 `100% • Audited`** and updates ledger total in real time.

---

## 🚀 3. Production Deployment (Vercel Serverless)

Scalar uses Vercel Serverless Functions (`api/stt.js` and `api/agent.js`) for keyless, secure client-side AI inference.

### Environment Variables
Configure these in your Vercel Dashboard under **Settings → Environment Variables**:

| Variable Name | Purpose | Required |
| :--- | :--- | :---: |
| `FIREWORKS_API_KEY` | Fireworks AI API Key (Llama 3.3 70B reasoning) | **Yes** |
| `GROQ_API_KEY` | Groq API Key (Whisper Large v3 Turbo STT) | **Optional** |

### Deploy Command
```bash
git push origin main
```
Vercel automatically builds and deploys serverless functions and Vite frontend.
