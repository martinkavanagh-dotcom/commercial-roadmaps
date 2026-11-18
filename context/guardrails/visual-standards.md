# Visual standards & signifier governance

Machine-enforceable visual governance rules for OSTTRA presentations, diagrams, and automated presentation outputs.

---

## 1. The law of visual signifiers (series consistency & Gestalt governance)

When rendering a sequential series of stages, cards, or connectors (`01..N`), visual encoding must never change arbitrarily across a subset of items. Executive audiences infer semantic meaning from colour changes; arbitrary styling creates false cognitive hierarchy.

Across any ordered series of tokens (`STAGE_HEADER`, `CONNECTOR`, `MATRIX_NODE`, `CARD_ACCENT_TOP`, `CARD_WHITE`), colour and accent properties (`accent`, `is_active`, `color`, `accent_color`, `bg_color`) must strictly adhere to one of three valid structural patterns:

1. **Uniform neutral / brand:**
   - All items in the series share the exact same colour and state.
   - *Semantic meaning:* A single continuous, homogeneous sequence or unbroken pipeline.
   - *Example:* All 5 stage connectors set to neutral slate (`#6B7077`, `is_active: false`).

2. **Explicit phase partition:**
   - The series is divided into contiguous, explicitly labelled macro-phases.
   - *Semantic meaning:* A clear operational demarcation between sequential domains (e.g. internal ingestion versus external client governance).
   - *Anchor requirement:* Must be anchored by overarching phase or output banners above or below the series.
   - *Example:* Steps 01–03 set to Amethyst / Violet (`#430059` / `#8B2E8B`, `accent: false`) beneath "Output 1: Internal baseline"; Steps 04–06 set to Rubine (`#CA0F61`, `accent: true`) beneath "Output 2: External QBR roadmaps".

3. **100% distinct categorical index:**
   - Every single item in the series has a unique, distinct palette colour.
   - *Semantic meaning:* Visual disambiguation across independent functional categories or parallel tracks.
   - *Rule:* Cannot have partial overlap (e.g. 4 unique colours and 2 duplicates).

### Gestalt & Von Restorff signifier rule (no arbitrary single-item highlights)
- **Unjustified single-item highlighting:** Highlighting a single item in a homogeneous peer group (e.g., 1 of 4 layers in a stack, or 1 of 6 cards in a container split) without a true semantic exception violates visual hierarchy.
- **Mandatory `focal_reason`:** A single `CALLOUT_RUBINE` or single `accent: true` header inside a homogeneous peer group is strictly prohibited unless an explicit `"focal_reason"` string is declared on the shape metadata explaining the exception.

### Prohibited patterns
- **Arbitrary mixed patterns:** Toggling accents or colours without contiguous grouping (e.g. Steps 01 and 03 dark while Steps 02, 04, 05, and 06 are red) is strictly prohibited.
- **Lone deviant connector:** Setting 4 of 5 connectors to Rubine and 1 to grey without an explicit architectural branch or inactive state.
- **Solid black/charcoal shape backgrounds:** Using `#0B0B0B`, `#0C0C0C`, `#212222`, or `#212322` as solid box background fills is strictly forbidden.
- **Flat Ochre fills:** Ochre (`#F78B39` / `#FE953D`) is strictly reserved for gradients only and must never be applied as a solid flat fill.

---

## 2. Palette colour tokens & hierarchy (OSTTRA 2026 presentation template)

### Primary brand sequence (use first for headers, pillars, and primary groupings)
1. **Rubine (`#CA0F61`)**: Hero accent, rebalanced for light backgrounds (replaces legacy `#D60050`). External client deliverables, active commercial governance, critical path milestones.
2. **Amethyst (`#430059`)**: Primary structural dark tone, foundational architecture, technical engines, Stage 1 sequence anchors.
3. **Violet (`#8B2E8B`)**: Secondary lifecycle flow, processing spines, Stage 2/3 sequence anchors.
4. **Orchid (`#B53A92`)**: Diagrams and infographics only (not charts), Stage 3/4 sequence anchors.

### Secondary accent / differentiator sequence (use only when >3–4 distinct categories or secondary flows are needed)
5. **Teal (`#2A818E`)**: External verification gates, ecosystem interfaces, automated validation engines.
6. **Sapphire (`#04557D`)**: Governance checkpoints, sign-off gates, audit pipelines.
7. **Slate (`#696C7B`)**: Secondary workflows, legacy integration, passive input streams.
8. **Rubine Dark (`#861A54`)**: Deep emphasis, tertiary workflow branches.

### Neutral surface & text scale (60-30-10 rule)
- **`N10` (`#F7F7F9`)**: Primary container background fill (`CONTAINER_N10`).
- **`N20` (`#EFEFF2`)**: Secondary container / stage fill / inactive step fill.
- **`N30` (`#E4E4E6`)**: Table total fill and disabled card surfaces.
- **`N40` (`#D1D1D4`)**: Borders and internal gridlines.
- **`N70` (`#6B7077`)**: Eyebrow text, neutral connectors, inactive node text.
- **`N80` (`#4A5057`)**: Subheadings and secondary metrics.
- **`N90` (`#212222`)**: Body text ONLY — strictly forbidden as a solid shape background fill.
- **`N100` (`#0B0B0B`)**: Heading text ONLY — strictly forbidden as a solid shape background fill (purged legacy `#0C0C0C`).

### Gradient tokens (strictly gradients only — forbidden as flat fills)
- **Ochre (`#F78B39` / `#FE953D`)**: Reserved exclusively for top template accent gradient strips (Ochre $\to$ Rubine $\to$ Violet).

---

## 3. Directional flow conventions

- **Horizontal sequence:** Always flows left-to-right (`x1 < x2`).
- **Data inputs / sources:** When positioned beneath the main workflow, connectors must point **upwards** (`y1 > y2`), feeding data into the action cards.
- **Deliverables / outputs:** When positioned above the workflow, connectors must point **upwards** (`y1 > y2`), delivering results into overarching summary containers.
