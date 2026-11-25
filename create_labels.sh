#!/bin/bash
# ============================================================
# MEUX LAB - Creates the repository labels with GitHub CLI
# Run once, from inside the repo folder, after `gh auth login`.
# It is safe to run again: --force updates labels that already exist.
# ============================================================

set -e

label() {
  gh label create "$1" --color "$2" --description "$3" --force
}

echo "Creating epic labels..."
label "epic:1-core"         "1D76DB" "Epic 1 - Core and Security"
label "epic:2-projects"     "1D76DB" "Epic 2 - Project Management and Lifecycle"
label "epic:3-orchestrator" "1D76DB" "Epic 3 - Orchestrator and Module Contract (Factory)"
label "epic:4-participant"  "1D76DB" "Epic 4 - Participant Environment and Accessibility"
label "epic:5-telemetry"    "1D76DB" "Epic 5 - Telemetry Engine"
label "epic:6-modules"      "1D76DB" "Epic 6 - Specific Modules (frozen)"
label "epic:7-metrics"      "1D76DB" "Epic 7 - Metrics, Reports and Data Intelligence (frozen)"
label "epic:8-monetization" "1D76DB" "Epic 8 - Monetization and Subscriptions (frozen)"
label "epic:9-support"      "1D76DB" "Epic 9 - Support, Help and Onboarding"

echo "Creating MoSCoW labels..."
label "moscow:must-have"   "0E8A16" "Required for the MVP"
label "moscow:should-have" "5319E7" "Important, but the MVP works without it"
label "moscow:could-have"  "FBCA04" "Nice to have if time allows"
label "moscow:wont-have"   "6E7781" "Out of scope for the current phase"

echo "Creating work type labels..."
label "type:feature"       "A2EEEF" "New functionality (usually one RF)"
label "type:bug"           "D73A4A" "Something is not working as specified"
label "type:accessibility" "7057FF" "WCAG, keyboard or screen reader work"
label "type:refactor"      "C5DEF5" "Restructure code without changing behavior"
label "type:docs"          "0075CA" "Documentation only"
label "type:chore"         "EDEDED" "Configuration, dependencies, tooling"

echo "Creating actor labels..."
label "actor:researcher"       "F9A03F" "Primary actor: UX Researcher / Evaluator"
label "actor:participant"      "F9A03F" "Primary actor: Participant"
label "actor:portal"           "FAD8B0" "System actor: Portal (core)"
label "actor:telemetry-engine" "FAD8B0" "System actor: Telemetry Engine"
label "actor:usability-module" "FAD8B0" "System actor: Usability Module"

echo "Creating status label..."
label "status:frozen" "BFD4F2" "Epic on hold: documented but not in the active scope"

echo ""
echo "Done. 25 labels created or updated."
