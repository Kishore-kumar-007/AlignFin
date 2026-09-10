# AlignFin — Judge Q&A Defense Guide (HACKNOVA’26)

### Q1: Are you providing financial advice?
**A:** "No. AlignFin is a **decision-support and financial-literacy intelligence prototype**. It evaluates how financial products align with or contradict a user's stated financial capacity, horizon, and constraints. It carries clear disclaimers, does not execute transactions, and does not replace certified financial planners."

### Q2: Why did Loan B win over Loan A when Loan A has a lower interest rate (8.5% vs 9.2%)?
**A:** "Because headline interest rate is only one component of borrowing cost. When we calculate the **Total Cost of Borrowing (TCOB)** over the user's intended 3-year repayment horizon:
- Loan A charges an upfront fee of ₹8,000 and a 4.5% prepayment foreclosure penalty on early exit.
- Loan B charges only ₹2,000 upfront and has 0% prepayment penalty.
Over 3 years, Loan B saves the borrower over ₹12,000 in net cash outflows despite the 0.7% nominal rate difference. AlignFin exposes this non-headline trade-off."

### Q3: Why should judges trust your system if LLMs can hallucinate?
**A:** "The core scoring engine is **100% deterministic and inspectable Python code**. Every score (0–100), financial ratio (DTI, Emergency Runway, TCOB), and penalty deduction is calculated mathematically with fixed formulas. The optional AI layer is used strictly for conversational synthesis of that structured reasoning trace, eliminating numerical hallucination."

### Q4: How do you handle Risk Tolerance vs Risk Capacity?
**A:** "We explicitly separate psychological tolerance from financial solvency. Even if an investor states 'High Risk Tolerance', our **Financial Buffer & Solvency Index (FBSI)** checks their emergency runway and monthly surplus. If their runway is under 3 months, the system overrides their optimism, flags a **CRITICAL RISK MISMATCH**, and penalizes high-volatility assets to protect them from forced liquidation during drawdowns."

### Q5: Where does your product data come from?
**A:** "For this 24-hour hackathon prototype, we use a curated catalog of 30 realistic, representative financial products stored in SQLite. The scoring and evaluation engine is decoupled via clean REST interfaces, allowing instant plug-in of live open-banking or aggregator feeds in production."
