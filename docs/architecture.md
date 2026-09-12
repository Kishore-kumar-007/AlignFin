# AlignFin — System Architecture & Technical Specification

## 1. Executive Architecture Overview

AlignFin is an **Explainable Financial Product Suitability Intelligence Engine** designed to solve a fundamental flaw in traditional fintech comparison:
> *Traditional comparison engines answer "What product has the lowest headline rate or highest return?"*  
> *AlignFin answers "Which product is most suitable for this specific individual, and why?"*

### 1.1 System Components

- **Frontend Application (React/Vite)**: A lightweight, responsive Single Page Application providing user onboarding, dynamic dashboards, suitability cards, and comparison matrices. Uses Tailwind CSS, Recharts, and Lucide.
- **Backend API Router (FastAPI)**: REST endpoints facilitating authentication, persona generation, product catalog retrieval, and document upload parsing.
- **Risk Capacity Engine**: Determines objective financial buffer (DTI, surplus ratio, emergency runway).
- **Category Evaluators**: specialized logic components (Loans, Investments, Savings) translating product constraints against user timelines.
- **Document Intelligence Module**: Extracts text from unstructured brochures and maps disclosures to structured product fields.
- **Explainability Engine**: Translates math deductions into transparent, natural language trace logs.

### 1.2 Production Deployment Architecture

```text
Browser / Client
       ↓ HTTPS
Netlify (React Frontend)
       ↓ REST API
Render (FastAPI Backend)
       ↓ SQLAlchemy
Render (PostgreSQL Database)
```

## 2. Authentication and Profile Flow

AlignFin employs stateless, secure session handling:
1. **Registration/Login**: User supplies credentials. Passwords hashed using bcrypt.
2. **Token Minting**: FastAPI mints a JWT access token valid for API requests.
3. **Profile Creation**: Upon onboarding, the frontend POSTs income, expenses, savings, and horizon data.
4. **Persistence**: The profile is committed to the PostgreSQL `users` table via SQLAlchemy.

## 3. Document Intelligence Flow

The document analysis pipeline maps unstructured brochures to evidence fields required by the suitability engine:

```text
PDF/TXT Upload
       ↓
PyMuPDF Text Extraction
       ↓
Rule-Based Disclosure Regex/Heuristics
       ↓
Structured Product Fields (Fees, Prepayment %, Lock-in)
       ↓
Evidence Items (Missing, Disclosed)
       ↓
Suitability Evaluation
       ↓
Transparent Explanation Log
```

*Note: Document intelligence handles structured extraction only. It does not perform autonomous financial decision-making.*

## 4. Deterministic Suitability Engine Boundary

The core **Financial Buffer & Solvency Index (FBSI)** operates on an absolute **deterministic boundary**. 
No generative AI (LLM) is used to estimate risk scores or rank products. The mathematical engine applies strict algorithms to the inputs (profile + evidence).

### 4.1 Evaluation Lifecycle
1. Request arrives at `/api/evaluate` containing `user_id` and `product_ids`.
2. Backend pulls the latest Profile from the database.
3. Backend pulls the specified Product(s).
4. `RiskCapacityEngine` derives the base financial runway.
5. The specific category evaluator (e.g., `LoanSuitabilityEvaluator`) executes the formula logic.
6. `ExplanationEngine` structures the mathematical trace into readable Markdown summaries.

## 5. Mathematical Scoring Methodology

Every product receives a final **Suitability Score $S \in [0, 100]$**:
$$S = \max\left(0, \min\left(100, \sum_{i=1}^5 (w_i \cdot d_i) - \sum \text{Penalties}\right)\right)$$

### 5.1 Financial Buffer & Solvency Index (FBSI)
* **Monthly Surplus ($M_s$)**: $\text{Income} - (\text{Expenses} + \text{Debt EMI})$
* **Surplus Ratio**: $\frac{M_s}{\text{Income}} \times 100\%$
* **Emergency Runway ($R$)**: $\frac{\text{Current Savings}}{\text{Monthly Expenses}}$
* **Classification**:
  * `LOW Capacity`: $R < 3.0 \text{ months}$ OR $\frac{M_s}{\text{Income}} < 15\%$ OR $\text{DTI} > 45\%$.
  * `MODERATE Capacity`: $3.0 \le R < 6.0 \text{ months}$ AND $15\% \le \text{Surplus Ratio} \le 35\%$.
  * `HIGH Capacity`: $R \ge 6.0 \text{ months}$ AND $\text{Surplus Ratio} > 35\%$ AND $\text{DTI} \le 25\%$.

### 5.2 Category-Specific Evaluation & TCOB
* **Loan Monthly EMI calculation**:
  $$\text{EMI} = P \cdot r \cdot \frac{(1+r)^N}{(1+r)^N - 1}$$
* **Total Cost over Target Horizon $T_u$ (months)**:
  $$\text{TCOB} = \text{Upfront Fees} + \sum_{t=1}^{\min(T_u, N)} \text{Interest}_t + \mathbb{I}(T_u < N) \cdot (\text{Outstanding Balance} \times \text{Prepayment Penalty \%})$$

### 5.3 Error/Missing-Evidence Handling

The engine follows a strict `NOT_FOUND != ZERO` principle. 
If an extracted document or catalog entry lacks a mandatory fee or prepayment penalty disclosure:
- It is NOT assumed to be zero.
- The engine logs a missing evidence warning.
- The product incurs an "Opacity Penalty" impacting its suitability score.
