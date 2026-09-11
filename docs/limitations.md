# AlignFin — System Scope & Technical Limitations

This document provides a transparent overview of the technical boundaries, analytical scope, and current limitations of the **AlignFin** decision-support platform prototype.

---

## 1. Scope & Analytical Boundaries

AlignFin is designed as an **educational decision-support intelligence platform**. It is explicitly **not** a licensed financial advisory service, broker, or loan originator.

### What AlignFin Does:
* Evaluates relative mathematical suitability based on user-provided profile constraints.
* Surfaces disclosed non-headline costs (processing fees, exit loads, lock-ins, prepayment penalties).
* Highlights mismatches between psychological risk tolerance and objective financial buffer (FBSI).
* Calculates illustrative scenario projections (Conservative, Base, Optimistic) and inflation drag.

### What AlignFin Does Not Do:
* Guarantee product approval, loan disbursement, or credit underwriting.
* Guarantee investment returns, yield outcomes, or portfolio performance.
* Discover hidden or undisclosed charges that are omitted from provided documentation/catalogs.
* Provide personalized tax advisory or legal counsel.

---

## 2. Product Catalog Data Scope

* **Curated Database**: The current production system evaluates products stored within its curated catalog or uploaded via document extraction.
* **No Dynamic Web Scraping**: The system does not crawl unverified third-party rate sites in real-time, avoiding stale or corrupted scraped data.
* **Provider Verification**: Users are instructed to verify final terms with official issuing institutions prior to application.

---

## 3. Document Extraction Capabilities

* **Supported Formats**: Native text **PDF** (`.pdf`) and text files (`.txt`).
* **Unsupported Formats**: Scanned image PDFs, `.png`, `.jpg`, `.docx`, and `.doc` files are restricted in production to prevent inaccurate OCR processing.
* **Disclosed Text Boundary**: Extraction rules extract parameters explicitly stated in document text.
* **Evidence Rule (`NOT_FOUND` $\ne$ ZERO)**: Missing disclosures trigger missing-evidence penalties rather than assuming a zero-cost fee structure.

---

## 4. Simplified Tax & Inflation Models

* **Inflation Assumption**: Real purchasing power calculations utilize a uniform **6% illustrative annual inflation assumption**.
* **Tax Baselines**: Tax outcome estimates rely on simplified baselines (e.g. 30% slab rate for taxable income or 12.5% LTCG above ₹1L threshold). They do not account for individual deductions, surcharge slabs, or municipal tax variations.
