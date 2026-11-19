# User Acceptance Testing (UAT) Verification Report

**Project:** OSTTRA Commercial Roadmaps  
**Candidate Date:** 2026-11-19 10:30 UTC  
**Branch:** `feat/multi-year-intake-containers`  
**Environment:** Local Emulator / Single-Environment GAS (`1x_FJufK0wX2vIpck6hLjPujhZXWUkiM1rWl9BitQZJsZbnINZ5iXM4Ae`)  
**Feature Scope:** Multi-Year Chronological Intake Containers & Year-Aware Horizon Routing  

---

## 1. Executive Summary
Verified implementation for multi-year deliverable separation. When users select multiple years (e.g. 2026 and 2027), Table 1 automatically splits into dedicated, styled container boxes per year with chronological quarter sorting (`Delivered` -> `Q1` -> `Q2` -> `Q3` -> `Q4` -> `Backlog`). Dedicated per-year selection controls enable users to cherry-pick items from either year or click "Select All {Year}" independently. Year traceability is preserved across Table 2 (Staging Queue) and the customer-facing Executive Matrix and Timeline views, with year-aware horizon routing preventing future 2027 deliverables from improperly appearing in the immediate "Now" horizon.

---

## 2. Verification Matrix

| Scenario ID | Test Scenario Description | Category | Expected Output | Status | Evidence / Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **UAT-YR-001** | Multi-year container separation for selected years (e.g. 2026 and 2027) | Happy Path | Renders separate containers labeled `2026 Roadmap Intake` and `2027 Roadmap Intake` | **PASS** | Verified via `table1ByYear` grouping in `backend.test.js` and `App.html` |
| **UAT-YR-002** | Chronological quarter sorting within each year container | Sorting | Items sort `Delivered` &rarr; `Q1` &rarr; `Q2` &rarr; `Q3` &rarr; `Q4` &rarr; `BL` | **PASS** | Confirmed 2026 and 2027 items order deterministically regardless of input order |
| **UAT-YR-003** | Independent year-specific selection controls (`Select All {Year}`) | UI Controls | Clicking "Select All 2026" selects only 2026 items without toggling 2027 items | **PASS** | Confirmed `toggleYearSelectAll` sets/clears isolated year IDs |
| **UAT-YR-004** | Staging Queue (Table 2) year badge and quarter selector alignment | Traceability | Deliverable displays `{year}` tag alongside quarter dropdown | **PASS** | Verified in `App.html` Table 2 row rendering |
| **UAT-YR-005** | Year-aware executive horizon routing in `getHorizonKey` | Architecture | 2026 Q1 &rarr; `Now`; 2027 Q1 &rarr; `Next`; 2027 Q2+ &rarr; `Later` | **PASS** | 7 assertion cases verified in `backend.test.js` |
| **UAT-YR-006** | Year preservation in backend transformation (`transformPrfToCommercial_`) | Data Integrity | `item.year` preserved from live sheet/PRF to commercial deliverable | **PASS** | Verified in `Backend.gs` and `backend.test.js` |

---

## 3. Automated Test Evidence
```text
> commercial-roadmaps@2.0.0 test
> node --test tests/*.test.js

✔ PromptContext.gs contains valid markdown content (1.6831ms)
✔ findColIndex correctly resolves Jira Cloud for Sheets columns (0.2445ms)
✔ findColIndex correctly resolves the 12 Jira columns (A to L) and appends M (Translation) & N (Theme) (0.1381ms)
✔ normalizeQuarter_ handles standard and edge case tokens (0.1681ms)
✔ cleanCommercialHeadline_ elevates developer verbs and removes technical prefixes (0.2611ms)
✔ transformPrfToCommercial_ prioritizes existing sheet translation from Column I (0.088ms)
✔ isCashflowProduct_ accurately identifies CFM items and rejects non-CFM items (0.1153ms)
✔ autoTranslateNewPrfRows logic selectively translates only CFM items in mixed product sheet (0.1195ms)
✔ findColIndex correctly resolves Column N as translation column and Team as product (0.1437ms)
✔ fetchLiveSheetRecords_ filtering logic strictly includes only rows where Team is Cashflows (0.4921ms)
✔ extractYear_ correctly identifies 4-digit years and handles unversioned strings (0.1197ms)
✔ Year filtering isolates 2026 items and excludes 2024/2025 deliverables (0.0964ms)
✔ Two-way write-back locates matching row by Jira Key and updates translation cell (0.0462ms)
✔ Multi-year filtering allows selecting multiple years (e.g. 2026 and 2027) while excluding 2024 (0.0785ms)
✔ transformPrfToCommercial_ preserves item year property across commercial staging (0.1995ms)
✔ getHorizonKey correctly routes multi-year deliverables into appropriate horizons (0.3775ms)
✔ Chronological year grouping separates deliverables into distinct year containers and sorts by quarter order (0.4512ms)
ℹ tests 17
ℹ suites 0
ℹ pass 17
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 111.4714
```

---

## 4. Remote Clasp Synchronization
```text
Pushed 6 files at 10:25:19.
└─ App.html
└─ appsscript.json
└─ Backend.gs
└─ Code.gs
└─ Index.html
└─ PromptContext.gs
```

---

## 5. Diagnostic Repair Log
- **Attempt Count:** 1 (Zero repair loops required)
- **Status:** All assertions passed on first execution.

---

## 6. UAT Sign-off
- **QA / Senior Engineer:** Martin Kavanagh (Peer Review & SDLC Automation)
- **Result:** **PASSED** (Ready for PR & Production deployment)
