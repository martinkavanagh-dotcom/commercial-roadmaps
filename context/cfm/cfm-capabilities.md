---

## id: card-cfm-cap-001 title: "OSTTRA Cash Flow Management (CFM) Capabilities & Technical Perimeter" category: "capability\_card" portfolio\_status: "active\_core" claim\_status: "shipped" commercial\_lead: "Tom Woolfenden" distribution: "client\_facing" first\_defence\_approver: "John Kenchington" last\_reviewed: 2026-10-27 validation\_status: "unvalidated\_baseline" governance: chinese\_wall\_verified: true editorial\_lint: "passed" git\_commit: "c8ae608" body\_sha256: "cc0108ed9d273c68abbc35e9daf1b67de75531eddcfb6b92e6a375645a42e0ef"

# OSTTRA Cash Flow Management (CFM) — Product Capabilities & Perimeter

*Domain: 01\_Product\_Capabilities \| Knowledge Hub Reference \| Multi-Tenant Institutional Card* *Product: OSTTRA Cash Flow Management (CFM)* *Commercial Lead: Tom Woolfenden*

---

> \[\!WARNING\] **Validation Status: Unvalidated Baseline** This content represents an initial structural baseline compiled from historical documentation and unverified telemetry. It is pending formal QBR validation and sign-off by the Commercial Lead and PMM. Do not cite client commitments or roadmap dates externally until validated.

## 1\. Core Functional Essence (Block 1\)

### What the Product Does

OSTTRA Cash Flow Management (CFM) is a centralised multi-party workflow platform that enables market participants to compare, affirm, net, and settle periodic lifecycle cashflows across OTC derivatives, Equities, Fixed Income, FX, and Securities Lending.

- **Bilateral Matching Engine:** Ingests cashflow records and automatically compares them on a 1-to-1 or 1-to-many basis against counterparty submissions, evaluating payment dates, amounts, currencies, and direction.  
- **GUI Affirmation Workflow:** Provides a lightweight click-to-accept or click-to-reject web portal for counterparties without automated API connectivity, removing the need for bilateral bilateral spreadsheet exchanges.  
- **Lifecycle Status Tracking:** Tracks cashflow records through their complete lifecycle, dynamically updating items from "Projected" to "Fixed / Ready to Settle" as fixing dates pass.  
- **Configurable Bilateral Netting:** Automatically calculates agreed gross-to-net settlement positions per counterparty and currency bucket, preserving complete audit lineage back to individual gross records.  
- **Settlement Instruction Dispatch:** Generates verified ISO 20022 and SWIFT MT payment messages (MT202, MT103) directly to custodian banks and payment systems upon matching/affirmation.  
- **Independent Third-Party Calculation:** Ingests golden-source trade confirmations (from MarkitWire and EPS) to calculate expected cashflow amounts independently, isolating whether disputes originate from trade terms or payment calculations.

### Operational Scope & Integration Boundaries

- **Settlement Instruction Dispatch:** Normalises, matches, and nets cashflow payments, creating and dispatching verified settlement instructions (MT202/pacs.009) to client settlement banks and custodians who execute the actual fund movements.  
- **Post-Trade Lifecycle Focus:** Operates strictly on affirmed trades, resets, and payment obligations; trade capture and legal confirmation occur upstream in systems like MarkitWire or CCP Connect.  
- **Bilateral Netting Infrastructure:** Provides multilateral netting and bilateral pairing, calculating netted settlement obligations without assuming central counterparty credit risk.

---

## 2\. Coverage & Technical Connectivity (Block 2\)

### Supported Asset Classes & 70+ ISITC Payment Types

- **OTC Derivatives:** Bilateral Interest Rate Swaps (IRS), Credit Default Swaps (CDS), Total Return Swaps (TRS) periodic coupons, resets, and upfront fees.  
- **Equity Derivatives:** Equity Portfolio Swaps (EPS), CFD resets, dividend adjustments, and financing legs.  
- **Fixed Income:** TBA pair-offs, coupon payments, reclaims, and bond interest.  
- **Foreign Exchange:** Non-CLS bilateral FX cash flows and fees.  
- **Securities Lending:** Manufactured dividends/income, borrow/loan fees, and collateral interest.  
- **Collateral & Margin:** Interest payments on cash and non-cash collateral.

### Currency Scope

- **20 Settlement Currencies Supported Natively:** Multi-currency netting buckets with custom operational cut-off times per currency.

### Ingest & Connectivity Protocols

- **API & Messaging:** Real-time REST API, FIX protocol, CSV batch file ingest, XML messaging.  
- **SWIFT Network:** ISO 20022 MX messages and ISO 15022 MT settlement messaging.  
- **OSTTRA Network Interconnections:** MarkitWire / EPS (trade economics golden source), triResolve (portfolio reconciliation and dispute drill-downs), triCalculate (independent valuation verification).

---

## 3\. Plain-English Operational Walkthrough

### How the Workflow Operates in Practice

1. **Periodic Cashflow Ingestion:**  
   - Ingests upcoming periodic lifecycle cashflows (coupons, resets, fees, manufactured dividends) via real-time REST API, FIX, or batch CSV.  
   - Normalises cashflow records across 70+ ISITC payment types into a standardised multi-asset data model.  
2. **Automated 1-to-1 and 1-to-Many Matching:**  
   - Evaluates incoming cashflow records against counterparty submissions, comparing payment dates, net amounts, currencies, and direction.  
   - Supports 1-to-many matching where a single counterparty payment corresponds to multiple underlying trade cashflow items.  
3. **Web GUI Affirmation Blotter:**  
   - Counterparties without dedicated API integrations access a lightweight, secure web portal to review, affirm, or dispute alleged cashflow amounts with a single click.  
   - Eliminates manual bilateral email trails and spreadsheet reconciliation.  
4. **Lifecycle Status Progression:**  
   - Dynamically tracks cashflow items from "Projected" to "Fixed / Ready to Settle" as floating rate fixings, corporate action announcements, or financing rates are locked in.  
5. **Configurable Bilateral Netting:**  
   - Aggregates agreed cashflows into multi-currency net settlement obligations per counterparty and value date.  
   - Preserves complete audit traceability back to each underlying gross trade ticket, reducing settlement transaction volume by up to 80%.  
6. **Settlement Instruction Dispatch:**  
   - Automatically generates and transmits verified ISO 20022 and SWIFT MT messages (MT202, MT103) directly to custodian banks and settlement agents.  
7. **Cross-Product Break Resolution:**  
   - Disputed cashflows link directly into OSTTRA Resolve (for portfolio valuation discrepancy drill-downs) and MarkitWire (for legal trade confirmation term verification).

---

## 4\. Supporting Information & Domain Concepts

- **70+ ISITC Cash Flow Codes:** Comprehensive industry-standard payment categorisation spanning swap resets, periodic coupons, upfront fees, CFD financing, TBA pair-offs, and securities lending borrow fees.  
- **1-to-Many Matching:** The ability to match a single aggregated payment claim from one counterparty against multiple discrete underlying cashflows on the other, resolving complex multi-account settlements without manual calculations.  
- **Gross-to-Net Netting Sets:** Configurable rules that consolidate dozens of bilateral payment obligations across currencies and accounts into single net payment amounts, dramatically lowering SWIFT messaging and bank settlement fees.  
- **Margin in Transit Gap:** The operational timing gap where agreed lifecycle cashflows settle 1 – 2 days after calculation, creating temporary uncollateralised exposures that inflate Variation Margin requirements; CFM aligns cashflow affirmation directly with margin processes.  
- **Fixing vs Projected Resets:** Projected cashflows represent estimated future obligations based on forward curves; Fixing cashflows become definitive once official benchmark rates (SOFR, SONIA, EURIBOR) or corporate dividends are fixed.