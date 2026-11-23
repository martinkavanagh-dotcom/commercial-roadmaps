---
id: card-rates-cap-001
title: "OSTTRA Connect for Rates (MarkitWire) Capabilities & Technical Perimeter"
category: "capability_card"
portfolio_status: "active_core"
claim_status: "shipped"
commercial_lead: "Pete Altero"
distribution: "client_facing"
first_defence_approver: "John Kenchington"
last_reviewed: 2026-10-27
validation_status: "unvalidated_baseline"
governance:
  chinese_wall_verified: true
  editorial_lint: "passed"
  git_commit: "c8ae608"
  body_sha256: "fa9c1cf65f11ff2fdf90a3cdc6f9efc52ab42da5ae5f605c6a0a97134622aaee"
---

# OSTTRA Connect for Rates (MarkitWire) — Product Capabilities & Perimeter

*Domain: 01_Product_Capabilities | Knowledge Hub Reference | Multi-Tenant Institutional Card*
*Product: OSTTRA Connect for Rates (MarkitWire)*
*Commercial Lead: Pete Altero (+5 Rates)*

---

> [!WARNING]
> **Validation Status: Unvalidated Baseline**
> This content represents an initial structural baseline compiled from historical documentation and unverified telemetry. It is pending formal QBR validation and sign-off by the Commercial Lead and PMM. Do not cite client commitments or roadmap dates externally until validated.

## 1. Core Functional Essence (Block 1)

### What the Product Does

OSTTRA MarkitWire is the definitive global post-trade processing infrastructure for OTC Interest Rate Derivatives. With over 22 years of market leadership, it processes more than 90% of global interest rate derivative transactions across a network of 1,700+ connected financial institutions and 13 central clearing houses.

- **Electronic Legal Confirmation Engine:** Creates, validates, matches, and securely stores legally binding digital trade confirmations across pre-agreed standard ISDA terms and conditions. Transforms bilateral post-trade confirmation timelines from days or weeks into seconds, eliminating legal dispute exposure.  
- **Trade Affirmation & T0 Capture:** Consolidates trade capture across electronic trading venues (SEFs, MTFs), inter-dealer brokers (IDBs), and bilateral voice executions, enabling immediate T-zero economic validation.  
- **Allocation & Give-Up Processing:** Allows investment managers to electronically allocate block trades across multiple underlying fund accounts. Automates complex tri-party give-up messaging, novations, and credit acceptances between executing brokers, prime brokers, and end clients.  
- **Global Clearing House Connectivity:** Provides high-throughput, automated routing and status messaging to 13 global clearing houses (including LCH SwapClear, CME, Eurex, JSCC, and ASX). Handles block-level clearing, allocation-level clearing, and clearing novations.  
- **Comprehensive Lifecycle Event Processing:** Standardises and updates legally confirmed trade records across all lifecycle stages: novations, bilateral terminations, early unwinds, contract amendments, coupon resets, and portfolio compression synchronisation.  
- **Automated Regulatory Trade Reporting:** Enriches trade records and automatically dispatches regulatory messages to global trade repositories (DTCC, REGIS-TR, etc.), handling UTI (Unique Trade Identifier) generation, lifecycle event reporting, and multi-regime compliance (CFTC, EMIR, ASIC, MAS, JFSA).

### Operational Scope & Integration Boundaries

- **Post-Execution Capture:** Engages immediately post-trade fill across SEFs, MTFs, interdealer brokers, and voice desks, ingesting economics to generate legally binding ISDA confirmations.  
- **Clearinghouse Routing:** Functions as the authoritative golden-source connectivity pipe to global CCPs (e.g. LCH, CME, Eurex, JSCC), where trade novation and principal risk assumption take place.  
- **Downstream Settlement Handoff:** Confirmed trade records feed directly into downstream treasury payment systems or OSTTRA Cash Flow Management (CFM) for cash settlement.

---

## 2. Coverage & Technical Connectivity (Block 2)

### Supported Interest Rate Products

- Single Currency Interest Rate Swaps (IRS), Overnight Index Swaps (OIS), and Forward Rate Agreements (FRA)  
- Basis Swaps (Single Currency and Cross-Currency Basis Swaps)  
- Cross-Currency Interest Rate Swaps and Fixed/Fixed Swaps  
- Swaptions (European, Bermudan), Constant Maturity Swaps (CMS), and CMS Spread Options  
- Caps, Floors, Straddles, Collars, and Corridors  
- Inflation Swaps (Zero Coupon and Standard Coupon)  
- Amortising, Accreting, and Rollercoaster Swaps; Cancellable/Callable Swaps; Asset Swaps

### Clearing Connectivity

- 13 connected global CCPs including LCH SwapClear, CME Clearing, Eurex Clearing, JSCC, ASX, and HKEX.

### Ingest & Connectivity Protocols

- **Messaging Standards:** FpML (versions 4.x through 5.11), FIX protocol, SWIFT, and proprietary XML formats.  
- **Connectivity Rails:** High-reliability IBM MQ over leased lines, Web SSL, IPSec VPN, and REST API endpoints.  
- **User Interfaces:** MarkitWire GUI, OSTTRA Trade Manager (OTM), and automated bulk upload tools (CSV/XML).  
- **Network Interconnections:** Native linkage with OSTTRA triResolve (sharing common trade identifiers), OSTTRA LimitHub (pre/post-trade clearing limits), and triCalculate.

---

## 3. Plain-English Operational Walkthrough

### How the Workflow Operates in Practice

1. **Trade Capture & Affirmation:**  
   - Following trade execution (via electronic SEF/MTF, inter-dealer broker, or voice), economic details flow directly into MarkitWire via API, drop copy, or blotter entry.  
   - Both counterparties review and affirm the trade economics in real time at T+0, resolving discrepancies immediately.  
2. **Electronic Legal Confirmation:**  
   - Upon affirmation, the system generates a legally binding digital trade confirmation governed by standard ISDA Master Agreement definitions.  
   - Replaces manual paper/PDF exchanges and establishes an immutable, legally binding golden record.  
3. **Block Allocation Delivery:**  
   - For asset managers trading block orders, OTM and MarkitWire enable automated electronic allocation to individual client sub-funds.  
   - Validated splits are distributed to counterparties and routed forward for clearing.  
4. **Clearing House Routing & Novation:**  
   - Trades eligible for central clearing are routed automatically to 13+ global CCPs (including LCH SwapClear, CME, Eurex, JSCC).  
   - Real-time callbacks confirm CCP acceptance and novation.  
5. **Netting Sync & Risk Synchronisation:**  
   - Following CCP portfolio compression and netting cycles, MarkitWire Netting Sync transmits STP updates via API to member risk architectures.  
   - Ensures internal dealer risk systems remain perfectly synchronised with the clearinghouse representation.  
6. **Regulatory Reporting & Compliance Oversight:**  
   - Enriches trade data with Unique Trade Identifiers (UTIs) and Legal Entity Identifiers (LEIs) and delivers compliant reports to global trade repositories (DTCC GTR, etc.).  
   - Provides Clearing Compliance Timing Reports that measure lifecycle elapsed time against G15 dealer peer benchmarks.

---

## 4. Supporting Information & Domain Concepts

- **Netting Sync:** A real-time STP feed delivering clearinghouse compression and netting run results back into member internal risk engines, eliminating portfolio drift between bank books and CCP records.  
- **Clearing Compliance Timing Reports:** Analytical reporting that benchmarks a firm's trade lifecycle clearing velocity against G15 dealer peer standards to identify processing latency and regulatory risk.  
- **Affirmation vs Confirmation:** Affirmation represents bilateral economic validation between dealers/clients at T+0; Confirmation creates an immutable, legally binding electronic contract under ISDA definitions.  
- **Bunched Orders / Block Allocation:** An institutional workflow where an investment manager executes and clears a single aggregate block trade before distributing child sub-account allocations directly to the CCP.
