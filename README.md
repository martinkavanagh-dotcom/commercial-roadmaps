# OSTTRA Commercial Roadmaps Portal

Standalone, executive customer-facing roadmap application for OSTTRA services.

## Core Features
- **2D Horizon Matrix**: Now / Next / Later across 3 primary Enhancement Themes:
  - Platform Enhancements (Teal)
  - Functional & Usability (Rubine)
  - Connectivity & Coverage (Sapphire)
- **Official OSTTRA Brand Gradient**: Seamless Ochre 500 (`#FE953D`) $\to$ Rubine 600 (`#D60050`) $\to$ Violet 700 (`#9300A1`) header backbone.
- **Slide Presentation View**: Clean executive deck view with clutter-free empty states.
- **Markdown-Driven Gemini AI Commercial Translation**: Synthesizes technical PRF deliverables into client-facing headlines using agreed business context and rules defined in `context/*.md`.
- **Jira Cloud for Sheets Integration**: Ingests Product Refinement Forum (PRF) items directly from Google Sheets with an adjacent translation column (`Column I`).
- **Dynamic Staging & Publishing**: Intake queue for PRF Jira tickets before promoting to the client-facing roadmap timeline.

## Spreadsheet & Jira Cloud for Sheets Integration

The application is completely decoupled from the legacy database. It connects to a brand new Google Spreadsheet configured for Jira Cloud for Sheets:

### Sheet Columns Layout (`PRF Import` Tab)
| Column | Header | Description |
| :--- | :--- | :--- |
| **A** | `Issue Key` | Jira PRF ticket identifier (e.g. `CFM-101`, `PRF-1021`, `ETD-1021`) |
| **B** | `Summary` | Technical deliverable summary |
| **C** | `Description` | Rich business and technical context from Jira |
| **D** | `Product` | Product division / Project (e.g. `CFM`, `Cashflow Management`, `ETD`, `CFD`) |
| **E** | `Quarter / Fix Version` | Horizon / Quarter (e.g. `2026 Q1`, `Q2`, `Backlog`) |
| **F** | `Category` | Deliverable category (`Strategic`, `Tech Debt`, `Regulatory`, `Client Request`) |
| **G** | `Status` | Jira lifecycle status (`Refined`, `Approved`, `In Development`) |
| **H** | `Theme` | Enhancement theme classification |
| **I** | `Commercial Translation` | **Adjacent End Column** populated by Gemini using Markdown rules |

> **Selective Translation Policy:** The Google Sheet can ingest PRF tickets across all product lines (CFM, ETD, CFD, TRM, etc.). However, auto-translation is strictly applied to **Cash Flow Management (CFM)** records only, as CFM currently possesses the authoritative markdown domain context (`context/cfm/*.md`). Non-CFM rows are safely preserved with their translation cell left blank until domain markdown specifications are added for their respective asset classes.

### Initializing a Brand New Spreadsheet
To create a new formatted spreadsheet in Google Drive automatically:
1. Run `createNewCommercialSpreadsheet("OSTTRA Commercial Roadmaps - PRF Database")` in Google Apps Script.
2. The function sets the new sheet ID in Script Properties (`COMMERCIAL_ROADMAP_SPREADSHEET_ID`), styles headers, and establishes the single `PRF Import` intake queue with the adjacent `Commercial Translation` column.
3. In Google Sheets, install **Jira Cloud for Sheets**, connect your PRF filter, and target columns A through H.
4. Use the custom spreadsheet menu **OSTTRA Roadmaps > 🤖 Auto-Translate New PRF Rows** to trigger Gemini translation for newly imported CFM items.

## Markdown Context & Guardrails (External Files)

Product context and guardrails are maintained strictly in local Markdown files (never cluttering the Google Spreadsheet) organized by domain:

### 1. Guardrails (`context/guardrails/`)
- `house-style.md`: Strict UK English chase-out table, sentence-case headings, and executive voice.
- `editorial-standard.md`: Machine-actionable lint rules, prohibited clichés, and headline brevity.
- `brand.md`: Official OSTTRA brand writing guidelines, positioning, and solution families.
- `claims.md`: Product delivery stage gates (`[shipped]`, `[roadmap]`, `[vision]`), the "Flip" rule, and sensitive/prohibited copy rules.
- `visual-standards.md`: Official palette tokens (Rubine `#CA0F61`, Amethyst `#430059`, Teal `#2A818E`).

### 2. CFM Context (`context/cfm/`)
- `cfm-capabilities.md`: Cash Flow Management capabilities, bilateral matching engine, and settlement instruction dispatch.
- `cfm-narrative.md`: Value proposition, T+1 settlement driver, liquidity release, and product horizons.
- `osttra-acronyms.md`: OSTTRA master glossary and proprietary terminology definitions.

### Synchronizing Markdown into Apps Script
Whenever you modify files in `context/guardrails/` or `context/cfm/`, recompile them into `PromptContext.gs` with:
```bash
npm run sync-context
```

## Testing & Local Verification
Run the automated test suite locally:
```bash
npm test
```

## Deployment & Clasp
- **Apps Script Project ID**: `1x_FJufK0wX2vIpck6hLjPujhZXWUkiM1rWl9BitQZJsZbnINZ5iXM4Ae`
- Push updates: `npx @google/clasp push`
- Deploy new version: `npx @google/clasp deploy -d "<description>"`
