# User Acceptance Testing (UAT) Verification Report

**Project:** OSTTRA Commercial Roadmaps  
**Candidate Date:** 2026-11-18 12:00 UTC  
**Branch:** `feat/new-spreadsheet-md-translation`  
**Environment:** Local Emulator / Single-Environment GAS  
**Feature Scope:** Single-Sheet PRF Intake Queue with CFM-Only Selective Commercial Translation  

---

## 1. Executive Summary
Verified requirements for single-sheet PRF intake populated via Jira Cloud for Sheets with adjacent translation column. All PRF items across all products can land in the Google Sheet, while Gemini AI automated commercial translation is strictly gated to Cash Flow Management (CFM) records where authoritative domain context (`context/cfm/*.md`) is present. Non-CFM rows are safely preserved with their translation cell left blank until domain markdown specifications are added for their respective asset classes.

---

## 2. Verification Matrix

| Scenario ID | Test Scenario Description | Category | Expected Output | Status | Evidence / Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **UAT-CFM-001** | Accurate identification of CFM product aliases (`CFM`, `Cash Flow Management`, `Cashflow`) | Happy Path | `isCashflowProduct_()` returns `true` | **PASS** | Evaluated against standard and custom naming variants in `backend.test.js` |
| **UAT-CFM-002** | Accurate identification of CFM ticket keys (e.g. `CFM-1021`, `CFM-55`) when Product column is empty | Edge Case | `isCashflowProduct_()` returns `true` | **PASS** | Verified key regex fallback (`backend.test.js`) |
| **UAT-CFM-003** | Rejection of non-CFM asset classes (`ETD`, `CFD`, `TRM`, `Equities`, `FX`, `Repo`) | Boundary / Negative | `isCashflowProduct_()` returns `false` | **PASS** | Verified non-CFM products are strictly excluded from CFM translation |
| **UAT-CFM-004** | Mixed single-sheet batch translation in `autoTranslateNewPrfRows()` | Integration | CFM rows translated; existing translations preserved; non-CFM rows remain blank | **PASS** | 4-row mixed sheet test confirmed `translatedCount = 1`, `skippedNonCfmCount = 2`, with zero modification to ETD/CFD rows |
| **UAT-CFM-005** | Flexible column resolution for Jira Cloud for Sheets headers (`Project`, `Components`, `Fix Version/s`) | Integration | Maps to internal product and quarter indices correctly | **PASS** | `findColIndex` resolves multi-field aliases without requiring manual column renaming |
| **UAT-CFM-006** | Preservation of existing commercial translations in Column I | Regression | Pre-existing translations are prioritized and never overwritten | **PASS** | Confirmed in `transformPrfToCommercial_` test suite |

---

## 3. Automated Test Evidence
```text
> commercial-roadmaps@2.0.0 test
> node --test tests/*.test.js

✔ PromptContext.gs contains valid markdown content (1.0745ms)
✔ findColIndex correctly resolves Jira Cloud for Sheets columns (0.2475ms)
✔ findColIndex correctly resolves the 12 Jira columns (A to L) and appends M (Translation) & N (Theme) (0.1427ms)
✔ normalizeQuarter_ handles standard and edge case tokens (0.6998ms)
✔ cleanCommercialHeadline_ elevates developer verbs and removes technical prefixes (0.2921ms)
✔ transformPrfToCommercial_ prioritizes existing sheet translation from Column I (0.0944ms)
✔ isCashflowProduct_ accurately identifies CFM items and rejects non-CFM items (0.0955ms)
✔ autoTranslateNewPrfRows logic selectively translates only CFM items in mixed product sheet (0.0923ms)
ℹ tests 8
ℹ suites 0
ℹ pass 8
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 104.9782
```

---

## 4. Diagnostic Repair Log
- **Attempt Count:** 1 (Zero repair loops required)
- **Status:** All assertions passed on first execution.

---

## 5. UAT Sign-off
**Result:** **ACCEPTED & APPROVED**  
All user acceptance criteria for single-sheet PRF intake and selective Cashflow Management translation are fully verified.
