# OSTTRA Editorial Standard for Product Messaging & Pipeline Output

*Machine-actionable editorial specification for product messaging cards, client roadmaps, and GTM collateral.*

---

## 1. Scope & system authority

This specification governs all text produced for product messaging cards, customer roadmaps, and client-facing collateral.

Any automated agent, LLM evaluator, or human author must evaluate drafts against these deterministic rules.

**Context dependency:** Any agent or evaluator running this linter specification must co-load standard/brand.md and standard/house-style.md.

```
       [Raw Sources / Jira / Telemetry]
                      │
                      ▼
            ┌───────────────────┐
            │   GTM PIPELINE    │ (Ingestion & Translation Layer)
            └─────────┬─────────┘
                      │
                      ▼
       ┌─────────────────────────────┐
       │   EDITORIAL STANDARD LINT   │◄── [THIS SPECIFICATION]
       │   (Pass / Fail / Fixes)     │
       └──────────────┬──────────────┘
                      │
                      ▼
       ┌─────────────────────────────┐
       │     PRODUCT CARDS           │ (Verified Internal Store;
       │   (Approved Ground Truth)   │  Dual-key sign-off: Commercial + PMM)
       └──────────────┬──────────────┘
                      │
                      ▼
       ┌─────────────────────────────┐
       │   Downstream Collateral     │ (Roadmaps, Factsheets, Decks,
       │   & Sales AI Assistants     │  Sales Playbooks, QBR Materials)
       └─────────────────────────────┘
```

---

## 2. Deterministic writing rules (LLM prompt directives)

### Rule 1: Customer-first outcome framing
- **Directive:** Always lead with the change in the customer's world, followed by the platform capability that delivers it.
- **Formula:** `**[Commercial Feature Name]:** [Concrete Operational / Commercial Outcome] + [How it works without developer jargon].`
- **Negative constraint:** Never lead with what engineering built, internal project names, or database refactoring.
- **Good:** `**Proactive Trade Failure Blotter:** Consolidates middle-office orders, fills, and give-ups into an active exception blotter, isolating trade discrepancies in real time to resolve breaks before trades reach clearing.`
- **Bad:** `**UI Phase 2:** Updated the middle-office Angular screens to improve give-up performance and resolve Jira ticket backlog.`

### Rule 2: Institutional voice & tone
Enforces the audience, institutional tone, and editorial prohibitions in `house-style.md` (Sections 1 & 3).

### Rule 3: Strict delivery gate semantics
Every capability must carry exactly one delivery gate tag:
- **`[shipped]` (Gate 4 - General Availability):** Production-ready. Present or past tense allowed (`features`, `delivers`, `expanded`).
- **`[roadmap]` (Gate 3 - In Development / MVP / Beta):** Actively committed for near-term release. **MUST NOT** use present tense. Use forward-looking verbs (`introducing`, `expanding`, `scheduled for pilot`). **NO specific calendar release dates** unless formally cleared by the Commercial Lead.
- **`[vision]` (Gate 2 - Strategic Direction):** Directional concept. Must be framed as long-term market evolution (`exploring`, `strategic roadmap`).
- **`[internal]`:** Technical reference notes. **STRICTLY FORBIDDEN** in client-facing output.
- **`[unknown]`:** Unverified facts. **STRICTLY FORBIDDEN** in client-facing output.

### Rule 4: Zero internal plumbing & ticket jargon (banned vocabulary)
The following tokens must result in an immediate **LINT ERROR** if present in client text:
1. **Jira artifacts:** `Jira`, `ticket`, `sprint`, `backlog`, `epic`, `story point`, `bug fix`, `patch`, `BAU`, `hotfix`, ticket keys (regex: `[A-Z]{2,10}-[0-9]+`).
2. **Internal architecture / components:** `CRDS`, `UDO`, `Jigsaw`, `JRDS`, `ETD POS`, `API Gateway`, `Kafka topic`, `Angular`, `Microservice`.
3. **Marketing fluff & combat metaphors:** Enforces the banned superlatives and metaphor rules in `house-style.md` Section 3.
4. **Vague internal actions:** `uplift`, `modernisation` (when used without a business benefit), `tooling`.

### Rule 5: Zero leakage of internal gripe sheets & customer complaints
- Client-facing text must **never** reference customer complaints, CRM escalations, or historical pain lists.
- If a client has demanded a feature for years, it must be framed objectively as an industry-standard capability or network expansion, never as an apology or response to agitation.
- Never name specific client institutions (e.g. JP Morgan, Citi, BlackRock) unless explicitly cleared in writing by OSTTRA Legal.

### Rule 6: Defensible numbers & proof points
- Every metric, percentage, or volume claim must have an explicit source and date in brackets (e.g. `[source: Acuiti Survey, Q2 2026]`).
- Never invent metrics, ROI estimates, or adoption numbers. If unverified, write `[unknown — need source]`.

### Rule 7: Brand, taxonomy & editorial mechanics linter
Any draft intended for product messaging cards, client roadmaps, whitepapers, decks, or collateral must pass this deterministic four-part validation against `brand.md` and `house-style.md`:

| Rule ID | Linter Check | Canonical Source of Truth | Failure Severity |
|---|---|---|---|
| Rule 7.1 | Strict brand capitalisation | `brand.md` Section 5 | Critical |
| Rule 7.2 | UK English spelling enforcement | `house-style.md` Section 2 (Chase-out table) | High |
| Rule 7.3 | Unified solution family taxonomy | `brand.md` Section 6 (7 families & transition table) | High |
| Rule 7.4 | Sentence case in headings | `house-style.md` Section 2 (Sentence case rules) | High |

---

## 3. Machine-evaluation rubric (linting pipeline)

When evaluating drafts or reviewing a product entry, evaluate every sentence against this 6-point taxonomy:

| Category | Trigger Condition | Severity | Action |
|---|---|---|---|
| **1. BRAND / SPELLING** | Violates Rule 7.1, 7.2, 7.3, or 7.4 (see brand.md Sections 5–6 and house-style.md Section 2). | Critical / High | Immediate block/rewrite; enforce all-caps `OSTTRA`, British English, sentence-case headings, and unified solution family name. |
| **2. CLAIM** | Wrong delivery gate label, roadmap written in present tense, or unsourced numerical claim. | High | Reject item; re-label or demand verified source. |
| **3. LEAK** | Contains internal component names, client complaint references, pricing, or unapproved bank names. | Critical | Immediate block; purge internal reference. |
| **4. GENERIC** | Could describe any generic SaaS fintech vendor; lacks post-trade domain specificity; repeats prior quarter verbatim. | Medium | Rewrite to focus on post-trade workflow impact. |
| **5. JIRA** | Describes what engineering built or fixed rather than what changes for the client. | High | Flip from engineering task to customer operational outcome. |
| **6. FACT** | Contradicts an approved product file, brand pillar, or commercial ownership. | High | Align with approved product ground truth. |

### Evaluation output format (for automated logs)

```json
{
  "item_id": "ETD-01",
  "evaluated_text": "...",
  "status": "PASS | CONDITIONAL_PASS | FAIL",
  "issues": [
    {
      "category": "BRAND | JIRA | LEAK | CLAIM | GENERIC | FACT",
      "flagged_token": "Jira sprint backlog",
      "rule_violated": "Rule 4: Zero Internal Plumbing",
      "suggested_fix": "Replace with concrete operational benefit"
    }
  ],
  "corrected_text": "..."
}
```

---

## 4. Workspace isolation & source quarantine protocol

1. **Isolation of sessions:**
   - **Internal maintenance sessions:** Raw feeds (Jira tickets, PRF notes, Looker telemetry, transcripts, customer gripe sheets) are read **only** inside internal working sessions to verify factual substance and update product cards.
   - **Client-facing drafting sessions:** Client-facing roadmaps, collateral, whitepapers, and sales briefs pull **exclusively** from approved product cards (`products/*.md`).
2. **Prohibition:**
   - Raw sources (`sources/`, transcripts, Jira dumps) must **never** be loaded into client-facing drafting contexts.
