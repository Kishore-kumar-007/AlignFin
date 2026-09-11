# AlignFin — Explainable Financial Product Suitability Intelligence

> **“Eligibility tells you what you can get. AlignFin tells you what fits.”**

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite%20%2B%20Tailwind-61DAFB.svg)](https://vitejs.dev)
[![Python](https://img.shields.io/badge/Python-3.14%20%2F%203.11-3776AB.svg)](https://python.org)
[![Tests](https://img.shields.io/badge/Tests-9%20Passed-success.svg)]()
[![Event](https://img.shields.io/badge/Hackathon-HACKNOVA'26%20(24H)-orange.svg)]()

AlignFin is a decision-support and financial-literacy intelligence platform designed for **HACKNOVA’26 (Domain: Finance & Fintech, Problem Statement: PS-08)**.

---

## 💡 The Core Problem & Differentiation

Traditional financial comparison engines (BankBazaar, Paisabazaar, Policybazaar) answer:
* *"Which loan has the lowest headline interest rate?"*
* *"Which mutual fund advertised the highest historical return?"*

**AlignFin answers:**
* *"Which product is more suitable FOR THIS SPECIFIC PERSON, and why?"*
* *"What non-headline costs (upfront fees, prepayment penalties, exit loads, lock-ins) create hidden traps over the user's intended timeline?"*
* *"Does the user's objective financial capacity support the risk they claim to tolerate?"*

---

## 🚀 3 Killer Demo Scenarios Tested & Built-in

| Scenario | Persona & Circumstances | Traditional Advice (Flawed) | AlignFin Intelligence Output |
|---|---|---|---|
| **1. Headline Rate Trap (Loans)** | **Rohan (24 yrs, ₹35k income, ₹2L loan, 3-yr horizon)** | Picks **Loan A (8.5%)** because 8.5% < 9.2%. | **Loan B (9.2%) wins with 88/100 score!** Exposes ₹8k upfront fee + 4.5% prepayment foreclosure penalty on Loan A that costs more over 3 years. |
| **2. Risk Mismatch (Investments)** | **Aarav (22 yrs, ₹25k income, ₹23k expenses, only ₹10k savings, claims 'HIGH' risk)** | Recommends speculative crypto/smallcap equity. | **Flags CRITICAL RISK MISMATCH!** Detects $<0.5$ mo emergency buffer, heavily penalizes volatile assets (-32 pts), and prioritizes capital preservation. |
| **3. 5-Year Horizon (Wealth)** | **Priya (28 yrs, ₹65k income, ₹2.5L savings, 5-yr goal)** | Recommends rigid 5-year locked FDs or 80C products. | Recommends dynamic **Balanced Advantage Hybrid Funds** (12.2% CAGR, low fee, open liquidity) avoiding rigid statutory lock-in traps. |

---

## 🏗️ Technical Architecture & Scoring Formula

AlignFin employs a **Deterministic Financial Buffer & Solvency Index (FBSI)** with zero mathematical hallucination:

$$\text{Suitability Score } S = \max\left(0, \min\left(100, \sum_{i=1}^5 (w_i \cdot d_i) - \sum \text{Penalties}\right)\right)$$

### Key Components:
1. **Risk Capacity Engine (`risk_engine.py`)**: Computes Monthly Surplus Ratio, Debt-to-Income (DTI), and Emergency Runway (Months).
2. **Loan Suitability Engine (`loan_evaluator.py`)**: Models Amortization, Total Cost of Borrowing (TCOB) over user horizon, prepayment penalty drag, and DTI stress.
3. **Investment Suitability Engine (`investment_evaluator.py`)**: Compares Volatility vs Capacity, Lock-in vs Horizon, and Net Compound Yield after expense ratio drag.
4. **Savings Evaluator (`savings_evaluator.py`)**: Evaluates instant emergency liquidity, DICGC safety, and premature withdrawal penalties.
5. **Dual-Mode Explainability Engine (`explanation_engine.py`)**: Generates transparent, inspectable mathematical breakdowns and natural-language reasoning traces.

---

## ⚡ Quick Start & Run Instructions

### 1. Backend Setup & Startup
```bash
# Navigate to backend and create venv
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run backend test suite (9 automated unit & scenario tests)
PYTHONPATH=. pytest tests/ -v

# Start FastAPI server on port 8000
PYTHONPATH=. uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Frontend Setup & Startup
```bash
# Navigate to frontend
cd frontend
npm install
npm run dev -- --host 0.0.0.0
```
Open **`http://localhost:5173`** in your browser.

---

## 📁 Repository Structure

```
AlignFin/
├── backend/
│   ├── app/
│   │   ├── database/       # PostgreSQL DB and 30-product seed catalog
│   │   ├── engine/         # Deterministic FBSI & Category Evaluators
│   │   ├── models/         # Pydantic Schemas (UserProfile, Product, Results)
│   │   ├── routers/        # FastAPI Endpoints (/personas, /products, /evaluate)
│   │   └── main.py         # Main FastAPI entry point with CORS
│   ├── tests/              # 9 comprehensive pytest scenario test cases
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/     # ProfileWizard, SuitabilityCard, ComparisonView, ExplainabilityDrawer, CatalogExplorer
│   │   ├── services/       # REST API client
│   │   ├── App.jsx         # Main state & UI coordinator
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── docs/
│   ├── architecture.md     # Mathematical formulation and architecture diagrams
    ├── demo-script.md      # Live demo scenarios and talking points
    └── limitations.md      # Known limitations and technical boundaries
└── README.md
```

---

## 🏆 Hackathon Defense Highlights

* **100% Deterministic Core**: No black-box random rankings or LLM hallucinations for scores.
* **Separation of Concerns**: Product catalog decoupled in PostgreSQL; easily swap prototype data with live open-banking feeds.
* **Inspectable Explainability**: Every single score deduction is displayed with exact formulas and weights.
* **Multi-Device Ready**: Designed for cross-laptop/mobile testing during hackathon presentations.
