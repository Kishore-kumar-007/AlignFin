# AlignFin — System Architecture & Technical Specification

## 1. Executive Architecture Overview

AlignFin is an **Explainable Financial Product Suitability Intelligence Engine** designed to solve a fundamental flaw in traditional fintech comparison:
> *Traditional comparison engines answer "What product has the lowest headline rate or highest return?"*  
> *AlignFin answers "Which product is most suitable for this specific individual, and why?"*

```
┌─────────────────────────────────────────────────────────────┐
│                      AlignFin Frontend                      │
│     (React + Vite + Tailwind CSS + Lucide + Recharts)       │
└──────────────────────────────┬──────────────────────────────┘
                               │ JSON REST API
┌──────────────────────────────▼──────────────────────────────┐
│                    FastAPI Backend Router                   │
│   /api/personas | /api/products | /api/evaluate | /api/risk │
└──────────────────────────────┬──────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
┌───────────────────────────────┐   ┌─────────────────────────┐
│     Risk Capacity Engine      │   │ Curated Product Catalog │
│   (Financial Buffer Index)    │   │      (PostgreSQL DB)        │
│  - Monthly Surplus Ratio      │   │  - 12 Loans             │
│  - Emergency Runway (Months)  │   │  - 10 Investments       │
│  - Debt-to-Income (DTI)       │   │  - 8 Savings / FDs      │
└───────────────┬───────────────┘   └────────────┬────────────┘
                │                                │
                └────────────────┬───────────────┘
                                 │
┌────────────────────────────────▼────────────────────────────┐
│            Category-Specific Suitability Engines            │
│  - LoanSuitabilityEvaluator (TCOB, Prepayment Drag, DTI)    │
│  - InvestmentSuitabilityEvaluator (Risk Gap, Lock-in, CAGR) │
│  - SavingsSuitabilityEvaluator (Liquidity, Yield, Safety)   │
└────────────────────────────────┬────────────────────────────┘
                                 │
┌────────────────────────────────▼────────────────────────────┐
│                Dual-Mode Explainability Engine              │
│  - Deterministic Mathematical Reasoning Trace               │
│  - Structured Pros, Cons, and Non-Headline Penalty Flags    │
│  - Optional Async Narrative Synthesis (Gemini API / Local)  │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Mathematical Scoring Methodology

Every product receives a final **Suitability Score $S \in [0, 100]$**:
$$S = \max\left(0, \min\left(100, \sum_{i=1}^5 (w_i \cdot d_i) - \sum \text{Penalties}\right)\right)$$

### 2.1 Financial Buffer & Solvency Index (FBSI)
* **Monthly Surplus ($M_s$)**: $\text{Income} - (\text{Expenses} + \text{Debt EMI})$
* **Surplus Ratio**: $\frac{M_s}{\text{Income}} \times 100\%$
* **Emergency Runway ($R$)**: $\frac{\text{Current Savings}}{\text{Monthly Expenses}}$
* **Classification**:
  * `LOW Capacity`: $R < 3.0 \text{ months}$ OR $\frac{M_s}{\text{Income}} < 15\%$ OR $\text{DTI} > 45\%$.
  * `MODERATE Capacity`: $3.0 \le R < 6.0 \text{ months}$ AND $15\% \le \text{Surplus Ratio} \le 35\%$.
  * `HIGH Capacity`: $R \ge 6.0 \text{ months}$ AND $\text{Surplus Ratio} > 35\%$ AND $\text{DTI} \le 25\%$.

### 2.2 Loan Evaluation & Total Cost of Borrowing (TCOB)
* Monthly EMI calculation:
  $$\text{EMI} = P \cdot r \cdot \frac{(1+r)^N}{(1+r)^N - 1}$$
* Total Cost over Target Horizon $T_u$ (months):
  $$\text{TCOB} = \text{Upfront Fees} + \sum_{t=1}^{\min(T_u, N)} \text{Interest}_t + \mathbb{I}(T_u < N) \cdot (\text{Outstanding Balance} \times \text{Prepayment Penalty \%})$$

---

## 3. Core Hackathon Scenarios Demonstrated

1. **Scenario 1: Headline Rate Trap (Loans)**:
   * Loan A (8.5% headline rate, ₹8,000 upfront fee, 4.5% prepayment penalty, 7-year tenure).
   * Loan B (9.2% headline rate, ₹2,000 upfront fee, 0% prepayment penalty, 3-year tenure).
   * For a user intending a 3-year horizon, Loan B wins in total cost and suitability despite the higher advertised rate.
2. **Scenario 2: Risk Mismatch (Investments)**:
   * User declared "HIGH" risk tolerance, but has only ₹10,000 in savings ($< 0.5$ months runway).
   * AlignFin triggers `RISK MISMATCH`, applies a $-32$ point penalty on high-volatility assets, and protects the user from capital impairment.
3. **Scenario 3: Horizon & Liquidity Balance (Savings/FD)**:
   * Demonstrates how auto-sweep flexi deposits outrank locked term deposits when immediate emergency liquidity is needed.
