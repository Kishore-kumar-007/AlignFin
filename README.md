# AlignFin

> "Eligibility tells you what you can get. AlignFin tells you what fits."

AlignFin is an explainable financial product suitability and decision-support platform designed to analyze personal financial profiles against specific financial products. It uses a deterministic engine to assess whether a product fits a person's objective financial capacity, goals, and timeline, producing transparent, evidence-backed reasoning.

## Live Demo

**Production Frontend**: [https://alignfin.netlify.app](https://alignfin.netlify.app)
**Production API**: [https://alignfin-backend.onrender.com](https://alignfin-backend.onrender.com)
**API Documentation**: [https://alignfin-backend.onrender.com/docs](https://alignfin-backend.onrender.com/docs)

## Why AlignFin?

Traditional comparison engines answer the question: *"What product is cheapest or highest-yielding?"* They sort by headline interest rates or historical returns.

However, headline metrics are incomplete. AlignFin shifts the question to: *"Which product fits this person's financial situation, objective, risk capacity, liquidity needs, horizon and constraints — and why?"* 

There is a fundamental distinction between:
- **Eligibility**: Does the bank allow you to take this product?
- **Comparison**: Which product looks best on a billboard?
- **Suitability**: Can your budget handle the actual Total Cost of Borrowing? Does the lock-in period trap the liquidity you need for an upcoming goal? Is the risk aligned with your true emergency buffer?

## Core Capabilities

- **Authenticated User Profiles**: Secure registration, login, and persistence of user financial data.
- **Financial Profile Analysis**: Evaluation of monthly surplus, debt-to-income, and savings buffers.
- **Risk Tolerance vs Risk Capacity**: Checking claimed risk comfort against mathematical risk capacity.
- **Category-Specific Suitability**:
  - **Loan Suitability Analysis**: Amortization, fees, and debt-stress modeling.
  - **Investment Suitability Analysis**: Volatility vs. capacity, lock-ins vs. horizon.
  - **Savings/FD Suitability Analysis**: Emergency liquidity and withdrawal penalties.
- **Goal-Aware Recommendations**: Matching product constraints to user timelines and objectives.
- **Suitability Score & Match Strength**: A transparent, 100-point index with "Not Recommended" boundary outcomes.
- **Scenario Analysis**: Illustrative conservative, base, and optimistic projections.
- **Inflation-Adjusted Purchasing Power**: Highlighting the illustrative drag of inflation on returns.
- **Illustrative Tax Impact**: Basic estimation of tax drag on yields.
- **Product Comparison**: Side-by-side matrices of non-headline costs and tradeoffs.
- **Financial Document Extraction**: Parsing PDFs and text files for product terms.
- **Evidence-Aware Analysis**: Explicit handling of missing disclosures (e.g., hidden fees).
- **Explanations**: Plain-text translation of the mathematical deductions.

## How It Works

```text
  User Profile
       +
  Product Data
       +
Document Evidence
       ↓
Suitability Engine
       ↓
Explainable Recommendation
```

The deterministic suitability engine acts as the absolute source of truth for the recommendation and scoring. 

## Core Design Principle

The recommendation layer is **deterministic and reproducible**. For the same inputs and product data, the core suitability logic follows the exact same rules rather than asking an LLM to make an unconstrained or unpredictable financial decision.

Document intelligence plays a strict, supporting role:
`Document → extraction → structured information → evidence → suitability analysis`

AI/Extraction does not override the deterministic financial calculations; it merely supplies the structured evidence that the math engine requires.

## Product Analysis

- **Loans**: Evaluates the Total Cost of Borrowing (TCOB) over the user's intended horizon, factoring in processing fees, prepayment penalties, EMI affordability, and debt stress.
- **Investments**: Assesses risk alignment against the user's risk capacity, liquidity constraints, statutory lock-ins, expense ratios, and illustrative scenario projections.
- **Savings**: Evaluates emergency liquidity availability, base yield, safety (DICGC), and premature withdrawal considerations.

## Evidence & Transparency

AlignFin operates on a strict evidence model. The most important principle is:

**`NOT_FOUND` does NOT mean ZERO.**

When information is unavailable (e.g., a brochure fails to mention processing fees), the system identifies the missing information and applies a penalty for lack of transparency, rather than inventing a zero-fee assumption. 

AlignFin can surface disclosed non-headline costs such as processing fees, exit loads, prepayment penalties, lock-ins, and withdrawal restrictions. It relies strictly on the evidence supplied in the documentation or product catalog.

## Technology Stack

**Frontend**:
- React
- Vite
- Tailwind CSS
- Recharts
- Lucide

**Backend**:
- Python
- FastAPI
- Pydantic
- SQLAlchemy

**Database**:
- PostgreSQL (Production on Render)
- SQLite (Local development default)

**Authentication**:
- JWT-based authentication
- bcrypt password hashing

**Deployment**:
- Netlify (Frontend)
- Render (Backend)
- Render PostgreSQL (Database)

## Architecture

For a deep dive into the system components, evaluation lifecycle, and mathematical formulation, see:
[Architecture Documentation](docs/architecture.md)

## Limitations

For a transparent overview of data freshness, extraction boundaries, and analytical scope, see:
[Limitations Documentation](docs/limitations.md)

## Getting Started

### Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run backend tests
PYTHONPATH=. pytest tests/ -v

# Start FastAPI server
PYTHONPATH=. uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Repository Structure

```text
AlignFin/
├── backend/
│   ├── app/
│   │   ├── database/       # Database connection and seed catalog
│   │   ├── engine/         # Deterministic FBSI & Category Evaluators
│   │   ├── models/         # Pydantic Schemas & SQLAlchemy Models
│   │   ├── routers/        # FastAPI Endpoints (auth, profile, products, evaluate)
│   │   └── main.py         # Main FastAPI entry point
│   ├── tests/              # Pytest scenario test cases
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/     # UI components (ProfileWizard, SuitabilityCard, etc.)
│   │   ├── pages/          # Top-level route pages
│   │   ├── services/       # REST API client
│   │   └── App.jsx         # Main application coordinator
│   ├── package.json
│   └── vite.config.js
├── docs/
│   ├── architecture.md     # System design and mathematical formulation
│   └── limitations.md      # Known boundaries and analytical constraints
└── README.md
```

## Responsible Use

AlignFin is a decision-support and financial-literacy platform. It is **not** a licensed financial adviser, broker, lender, tax adviser, or legal adviser. 

All illustrative scenarios, scores, and tax/inflation estimates are for educational purposes. Product terms should always be verified directly with the issuing institution before any financial decisions are made.

## Project Background

AlignFin was originally conceived and built as a submission for **HACKNOVA'26**.
