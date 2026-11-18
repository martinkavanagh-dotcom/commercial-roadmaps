# Claims

*What may be said to clients, and how. This file governs delivery gate alignment, technical-to-commercial translation, and sign-off governance across all collateral.*

---

## 1. Labels, Tied to OSTTRA's Product Stage Gates

Every product statement carries one label. The labels follow the four delivery gates Product already uses, ensuring marketing collateral and product engineering align precisely:

| Gate | Gate Name | Label | In Client Text |
|---|---|---|---|
| Gate 4 — General availability | "The signal" | `[shipped]` | State plainly in present or past tense. |
| Gate 3 — MVP / beta | "The hint" | `[roadmap]` | "In pilot", "next". Never present tense. No specific calendar dates unless explicitly cleared by the Commercial Lead. |
| Gate 2 — Concept | "The conversation" | `[vision]` | Only as strategic direction or thought leadership, and only with Commercial Lead agreement. |
| Gate 1 — Thesis validation | — | `[internal]` | Strictly forbidden in client collateral. |
| Not established | — | `[unknown]` | Strictly forbidden in client collateral. |

---

## 2. Product Facts vs Client-Facing Facts (The "Flip" Rule)

- **Internal product facts:** Engineering reality, technical specifications, Jira status, backend mechanics, and database schemas are tagged `[internal]`. They are reference notes for understanding the product, not client copy.
- **Client-facing product facts:** An internal fact only becomes client-facing when flipped into customer impact (what changes for their operational workflow, risk profile, or capital efficiency) and verified against a delivery gate (`[shipped]`, `[roadmap]`, `[vision]`).
- **The rule:** Never pull internal capabilities or engineering specifications directly into client collateral without executing the flip.

---

## 3. Never in Client-Facing Text

- Anything originating from a client feedback list, support escalation, or gripe sheet, or any phrase suggesting a client has complained.
- Named client institutions or counterparties, unless explicitly cleared in writing by OSTTRA Legal.
- Pricing, rate cards, fee schedules, or commercial discount terms.
- Internal team names, Jira ticket keys (`PRF-1234`), internal component names, or sprint numbers.
- Regulatory or capital claims (RWA, LCR, IM, VM, XVA, margin, settlement statistics) without a verified named source and date.
- Metrics or adoption percentages without a source and date. If absent, mark as `[unknown — need source]`.

---

## 4. Sensitive by Default

- **Client-specific feature requests:** Anything a specific client has asked for repeatedly. Do not present it as a generic release or as a special concession. Validate with the Commercial Lead how it has been positioned.
- **Account-led material:** Bespoke collateral for strategic tier-1 banks and investor accounts must remain account-led. Do not recycle account-specific features into mass-distribution collateral without clearance.
- **Commercial terms & pricing:** Pricing and commercial structures are confidential. Do not reference commercial revisions or rate card changes prior to official commercial release.

---

## 5. Sign-Off Governance

- **Dual-key sign-off:** Every client-facing product narrative or roadmap release requires dual-key sign-off:
  1. **Commercial Lead:** Validates commercial scope, contractual alignment, and delivery horizons (Now / Next / Later).
  2. **Product Marketing (PMM):** Approves commercial narrative, positioning, brand alignment, and customer-first framing.
- **Editorial review:** All generated text must be evaluated against `standard/editorial-standard.md` to prevent Jira token leaks, unhedged forward commitments, or branding errors.

---

## 6. Guidance on Modernisation & Narrative Framing

- **Platform modernisation & resilience:** Technical developments (cloud migrations, platform resilience, security hardening, SSO, and core API modernisation) are positive capabilities to share with clients. Reframe engineering advancements constructively around platform resilience and modernisation rather than routine developer maintenance.
- **Technological frontier framing:** Present a technologically forward, frontier model. Institutions do not need disruptive, rip-and-replace infrastructure overhauls to achieve modern capabilities; OSTTRA delivers advanced capabilities—machine-learning workflows, real-time awareness, and T+1 velocity—inherently through verified data quality and mutualised market scale.
- **Product nomenclature exception — Message Center:** The proprietary product name for FXPB messaging middleware is strictly **Message Center** with US spelling (e.g. *OSTTRA Connect for FXPB / Message Center*); do not convert it to UK *Message Centre*.
