# AlignFin — 3-Minute Live Hackathon Demo Script

This script provides a structured 3-to-5 minute demonstration flow for judges and evaluators.

---

## ⏱️ Timeline Summary

* **0:00 - 0:45**: Problem Statement & The "Headline Rate Trap"
* **0:45 - 1:45**: User Profile, Risk Capacity & Suitability Leaderboard
* **1:45 - 2:30**: Side-by-Side Comparison & Detailed Analysis
* **2:30 - 3:15**: Document Intelligence (Check a Financial Document)
* **3:15 - 3:30**: Technical Architecture & Wrap-Up

---

## 🎬 Detailed Script Walkthrough

### 1. Introduction (0:00 - 0:45)
> *"Hello judges! Today, financial comparison aggregators answer one simple question: 'Which loan has the lowest headline interest rate?' or 'Which fund advertises the highest historical CAGR?'*
>
> *The problem is that headline rates lie. A loan advertising 8.5% can actually cost thousands of rupees more than a 9.2% loan once processing fees and early closure penalties are factored in.
>
> *Welcome to **AlignFin**. Eligibility tells you what you can get; AlignFin tells you what actually fits."*

---

### 2. User Profile & Suitability Engine (0:45 - 1:45)
> *"Let me show you how it works live on our production app at `alignfin.netlify.app`.*
>
> *Here, our user has a monthly income of ₹35,000, expenses of ₹25,000, and intends a 3-year repayment timeline.
>
> *Notice how our **Suitability Leaderboard** ranks options. Instead of blindly sorting by advertised rate, AlignFin evaluates 5 financial dimensions and surfaces clear match levels: **Strong match**, **Moderate match**, or **Not Recommended**.
>
> *Look at the top choice: **Loan B** outranks **Loan A** even though Loan A advertises a lower headline rate. Why? Because Loan A charges a high upfront fee and a 4.5% foreclosure penalty on early payoff."*

---

### 3. Side-by-Side Comparison & Scenarios (1:45 - 2:30)
> *"When we click **Compare**, AlignFin generates a deep trade-off matrix. It models exact cash flows over the user's specific 36-month horizon.
>
> *For investment products, AlignFin models **Conservative**, **Base**, and **Optimistic** scenarios, while displaying real purchasing power alongside nominal growth using an explicit 6% inflation assumption."*

---

### 4. Document Intelligence (2:30 - 3:15)
> *"Now let me show you **Check a Financial Document**.
>
> *Users can drag and drop a PDF or TXT product brochure. AlignFin parses disclosed clauses and maps evidence for headline rates, processing fees, lock-ins, and prepayment penalties.
>
> *Crucially, our system operates on the principle that **`NOT_FOUND` is not zero**. If a document hides its processing fees, AlignFin surfaces a missing-evidence warning rather than assuming the fee is free."*

---

### 5. Conclusion & Architecture (3:15 - 3:30)
> *"AlignFin is built on a 100% deterministic FastAPI backend connected to PostgreSQL, completely eliminating AI numerical hallucination.
>
> *Thank you, and we're ready for your questions!"*
