# AlignFin — System Scope & Technical Limitations

This document provides a transparent overview of the technical boundaries, analytical scope, and current limitations of the **AlignFin** decision-support platform prototype.

---

## Recommendation Scope

AlignFin evaluates relative mathematical suitability based entirely on the user's supplied profile, goals, and available product information. It is designed as an educational decision-support intelligence platform.

It is explicitly **not** a guarantee of financial outcome, nor is it a licensed financial advisory service, broker, or loan originator.

### What AlignFin Does:
* Evaluates relative mathematical suitability based on user-provided profile constraints.
* Surfaces disclosed non-headline costs (processing fees, exit loads, lock-ins, prepayment penalties).
* Highlights mismatches between psychological risk tolerance and objective financial buffer.

### What AlignFin Does Not Do:
* Guarantee product approval, loan disbursement, or credit underwriting.
* Guarantee investment returns, yield outcomes, or portfolio performance.
* Provide personalized tax advisory or legal counsel.

---

## Product Data Freshness

Current product data is curated for the prototype rather than guaranteed to be a continuously refreshed live market feed. Users should always verify current rates, terms, and conditions directly with providers.

## Source Provenance

AlignFin utilizes metadata fields to display the source of product information. However, the current implementation cannot algorithmically guarantee the legal authenticity of uploaded product documents. Placeholder or default metadata should not be construed as institutionally "verified."

---

## Document Extraction Boundary

Production extraction is strictly limited to formats actually supported by the current text-parsing implementation:
- **PDF** (`.pdf`) containing native text
- **TXT** (`.txt`)

Scanned image PDFs, `.png`, `.jpg`, `.docx`, and `.doc` files are restricted to prevent inaccurate OCR processing. Image OCR and DOCX processing are not supported.

---

## Risk Capacity Limitation

Financial capacity (the Financial Buffer & Solvency Index) is estimated purely from observable, self-reported profile inputs such as income, expenses, savings, debt burden, and liquidity requirements. It is an objective mathematical ratio model. It is **not** a complete behavioral model, credit-risk model, or comprehensive credit-bureau check.

---

## Missing Evidence

AlignFin operates on a strict evidence rule: **NOT_FOUND != ZERO**.

Missing information in a brochure or catalog means the system does not have evidence to establish that condition. If a product fails to disclose its prepayment penalty, AlignFin will not assume the penalty is 0%. Missing disclosures trigger missing-evidence penalties rather than assuming a zero-cost fee structure.

---

## Scenario Assumptions

AlignFin calculates illustrative Conservative, Base, and Optimistic scenarios for investments. These scenarios are strictly illustrative mathematical projections based on historical asset class standard deviations. They are **not** predictions or guarantees of future returns.

## Inflation

Inflation-adjusted calculations use an illustrative assumption (e.g., 6%) to demonstrate purchasing power drag. This should not be interpreted as a macroeconomic forecast.

## Tax

Tax outcome estimates rely on simplified baselines (e.g., flat bracket assumptions for capital gains vs. ordinary income). They do not account for individual deductions, surcharge slabs, or municipal tax variations. They are not a personalized tax calculation.
