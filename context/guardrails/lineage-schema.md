# Data Lineage & Metadata Specification

*Machine-enforceable lineage schema for product cards (`products/`) and client-facing collateral (`out/`).*

---

## 1. Governance & Identity Schema

Every markdown file in `products/` and `out/` must begin with a standardised YAML frontmatter block. This block establishes data provenance, sign-off attribution, and dependency links.

```yaml
---
id: prod-etd-001
title: "Exchange Traded Derivatives (OSTTRA Connect for ETD)"
category: "gtm_knowledge_hub" # gtm_knowledge_hub | capability_card | narrative_card | sales_card
portfolio_status: "active_core" # active_core | baseline_reference
claim_status: "shipped" # shipped | roadmap | vision
commercial_lead: "Commercial Lead Name"
distribution: "internal_only" # internal_only | client_facing
last_reviewed: 2026-11-10
lineage:
  upstream_sources:
    - "sources/etd/2026-10-13-etd-newsletter.md"
    - "sources/ai/2026-10-26-ai-and-gtm-integration.md"
  couching_notes: "Intentionally couched as member-dependent workflow per Commercial Lead; preserve conditional phrasing."
  downstream_targets:
    - "out/etd-capabilities.md"
    - "out/etd-narrative.md"
    - "out/etd-sales-card.md"
governance:
  chinese_wall_verified: true
  editorial_lint: "passed"
---
```

---

## 2. Field Definitions

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | String | Yes | Unique immutable identifier (e.g. `prod-<slug>-001` or `card-<slug>-<type>-001`). |
| `title` | String | Yes | Canonical institutional name of the product or asset. |
| `category` | Enum | Yes | `gtm_knowledge_hub`, `capability_card`, `narrative_card`, `sales_card`, `glossary`. |
| `portfolio_status` | Enum | Yes | `active_core` (actively sold, QBR refreshed) or `baseline_reference` (mature/dormant or working group). |
| `claim_status` | Enum | Yes | Highest delivery gate represented in the file (`shipped`, `roadmap`, `vision`). |
| `commercial_lead` | String | Yes | Commercial Owner committing scope, dates, and commercial positioning (e.g. "Commercial Lead A", "Commercial Lead B"). |
| `distribution` | Enum | Yes | Distribution classification: `internal_only` (all sales cards and internal GTM Knowledge Hub product cards) or `client_facing` (capability and narrative cards). |
| `marketing_lead` | String | No | Marketing Lead for catalog-level assets or campaigns. |
| `sign_off_note` | String | No | Human sign-off verification note or approver reference. |
| `last_reviewed` | Date | Yes | ISO date of last human review/verification (YYYY-MM-DD). |
| `lineage.upstream_sources` | List[String] | Conditional | Relative paths to internal source artifacts (`sources/...`) grounding the claims. Mandatory for all AI-generated updates; optional for direct human leadership entries. |
| `lineage.couching_notes` | String | No | Records how the creator originally framed/hedged the claim (legal caveats, intentional ambiguity, conditional dependencies, grey areas) to prevent over-promising downstream. |
| `lineage.downstream_targets` | List[String] | No | Output cards or collateral derived from this GTM Knowledge Hub product card. |
| `governance.chinese_wall_verified` | Boolean | Yes | True if all raw internal gripe/developer language has been strictly stripped. |
| `governance.editorial_lint` | Enum | Yes | `passed`, `pending`, or `failed` against `standard/editorial-standard.md`. |

---

## 3. Dependency Graph Rules

1. **Source invalidation:** When an upstream source listed in `lineage.upstream_sources` is modified, downstream product cards and collateral are flagged for review.
2. **Workspace isolation verification:** No collateral file in `out/` may directly cite a raw developer PRF or gripe ticket without an intermediate approved entry in `products/`.
3. **AI grounding & couching preservation:** While human leads may add institutional truth directly without an upstream document, any claim or update introduced by the AI must trace to a verified source and faithfully preserve how that source was initially couched—including uncertainties, caveats, dependencies, and intentional grey areas. Never flatten or resolve strategic ambiguity into unconditional commitments.
