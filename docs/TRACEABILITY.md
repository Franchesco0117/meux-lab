# Traceability

This document explains how requirements are tracked in MEUX LAB. The data
lives in the spreadsheet [`traceability-matrix.xlsx`](./traceability-matrix.xlsx),
which is the **source of truth** for the classification of every requirement.

## What the matrix contains

| Sheet                      | Content                                                                                                                                      |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **Matriz de Trazabilidad** | One row per functional requirement (RF): epic, actors, source screen, related NFRs, status, priority, difficulty, phase, version and MoSCoW. |
| **Resumen por Épica**      | Live counts per epic and per MoSCoW category (calculated with formulas).                                                                     |
| **Cobertura RNF**          | For each non-functional requirement (RNF), which RFs reference it. Used to detect NFRs that no functional requirement covers.                |

## Epics

| Epic                                               | RFs | State  |
| -------------------------------------------------- | --: | ------ |
| 1 - Core and Security                              |  51 | Active |
| 2 - Project Management and Lifecycle               |  55 | Active |
| 3 - Orchestrator and Module Contract (Factory)     |   8 | Active |
| 4 - Participant Environment and Accessibility      |  25 | Active |
| 5 - Telemetry Engine                               |   6 | Active |
| 6 - Specific Modules (Card Sorting, Heuristics...) |   0 | Frozen |
| 7 - Metrics, Reports and Data Intelligence         |   0 | Frozen |
| 8 - Monetization and Subscriptions                 |  22 | Frozen |
| 9 - Support, Help and Onboarding                   |  32 | Active |
| **Total**                                          | 199 |        |

MoSCoW split: 123 Must have, 39 Should have, 15 Could have, 22 Won't have.

Frozen epics are documented but outside the active scope. Epics 3 and 5 are
architecture epics: their requirements describe system behavior and do not
come from a screen.

## How it connects to GitHub

- Every RF is a GitHub Issue titled `[RFxxxx] Short name`.
- Labels mirror the matrix: `epic:*`, `moscow:*`, `actor:*`, `type:*` and
  `status:frozen`.
- The Issue body repeats the classification. If the two ever disagree, the
  matrix wins and the Issue gets corrected.

## Maintenance rules

1. A change to a requirement (text, priority, epic, NFRs) is made in the
   matrix **and** in its Issue, in the same working session.
2. A new requirement takes the next free ID and gets a row in the matrix
   before its Issue is created.
3. IDs are never reused. If a requirement is dropped, mark it instead of
   deleting the row.

## Known notes

- **RF00119** (email change and verification) was originally numbered
  `RF0019` by mistake, duplicating another requirement. Its source table
  says 119 and it is the only number missing from the 1-185 sequence.
- **RNF0026** (maximum projects per user) has no RF yet: it depends on the
  subscription model (epic 8, frozen).
- **RNF0023** (recovery time objective) has no RF by design: it is an
  infrastructure requirement verified at deployment level.
