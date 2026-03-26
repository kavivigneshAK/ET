# 🟢 IPO X-RAY: GenAI Forensic Platform

> **A Cyberpunk-inspired, Bloomberg-terminal styled Financial Intelligence platform that leverages Google Gemini 2.5 Pro/Flash to autonomously extract, parse, and analyze massive IPO Red Herring Prospectus (RHP) PDF documents.**

![IPO X-Ray Dashboard Architecture](https://images.unsplash.com/photo-1642543492481-44e81e3914a1?q=80&w=2000&auto=format&fit=crop) *(Cyberpunk/Financial aesthetic placeholder)*

## 🚀 Features

* **Secure RHP PDF Ingestion:** Natively drag-and-drop massive SEBI RHP PDF filers directly into the ingestion engine.
* **Algorithmic Risk Scoring:** Calculates composite risk metrics (0-100) based on Working Capital Stress, Valuations, Promoter Quality, and Related Party Transactions (RPT).
* **Live JSON Generative Extraction:** Natively coerces the Gemini LLM to strictly output complex nested JSON arrays to populate the React views without traditional NLP parsing heuristics.
* **Bloomberg-Tier Dashboard:** Premium Data Intelligence UI with live re-filtering, Framer Motion toast registries, and responsive glass-card architecture.
* **A4 PDF Export Pipeline:** Implements structural `html2canvas` mapping to flawlessly flatten and export the interactive DOM graphics into standard secure PDF client reports. 

---

## 💻 Tech Stack

**Backend (Python + AI Engine)**
* **FastAPI**: Enterprise-grade HTTP multiplexing and CORS boundaries
* **Motor**: Asynchronous, non-blocking MongoDB native database drivers
* **Pydantic**: Deeply enforced payload schemas and structural validation 
* **Google Generative AI**: Gemini 2.5 Pro/Flash 1M+ token window for heavy document OCR

**Frontend (React 18)**
* **Vite + React + TypeScript**: Blazing fast module bundling 
* **Tailwind CSS + Framer Motion**: Deep UI glass-morphism matrix and structural animations
* **Recharts**: D3.js powered responsive data visualizations
* **Axios**: Asynchronous network fetching

---

## 🛠 Local Deployment

### 1. Database Initialization
Ensure you have a live, unauthenticated **MongoDB** instance running on your host machine at `mongodb://localhost:27017` 
The system will natively target the `ipo_xray_db` space. 

### 2. Backend Boot Sequence
Open a terminal in the project root:

```bash
# Initialize a secure virtual environment
python3 -m venv venv
source venv/bin/activate

# Install AI networking dependencies
pip install -r requirements.txt

# Rename the secure environment file and inject your LIVE Gemini API Key
mv .env.example .env
# Edit .env and paste your key into GEMINI_API_KEY=

# Start the Uvicorn Asynchronous Engine
uvicorn main:app --reload
```
*The host API will spin up dynamically on `http://127.0.0.1:8000`*

### 3. Frontend Execution
Open a secondary terminal targeting the React sub-directory:
```bash
cd ipo-xray-ui

# Hydrate the Node environment 
npm install

# Launch the Vite Hot-Module bundler
npm run dev
```

*The Intelligence Dashboard will deploy locally on `http://localhost:5173`*

---

## 🔒 Security & Architecture Notes
- Target datasets never breach local scope until exclusively triggered by the `/analyze/` pipeline executing straight into the Google GenAI Cloud.
- `user_id` authentication state is structurally mocked for localized demonstration; the FastAPI engine will natively auto-provision dummy users upon identifying empty Mongo relationships to prevent halting the AI upload execution. 
- API Keys are completely scrubbed from tracked elements via dynamic `.gitignore` matrices. 

*Disclaimer: This platform serves as a strictly analytical demonstration of applied GenAI engineering and should NOT be construed as registered SEBI financial advice.*
