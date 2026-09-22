# DNEM v7.7 Scientific Validation Orchestrator v1.0

The orchestrator is the coordination layer for the validation stack.

## Pipeline

Study results
→ statistical evidence engines
→ evidence objects
→ validation gates
→ scientific status

## Status semantics

### BLOCKED
No mandatory gate is passed, or required evidence is absent.

### CONDITIONAL
Some evidence/gates are present, but mandatory validation is incomplete.
No validated construct claim is permitted.

### VALIDATED
All configured mandatory gates explicitly pass based on supplied evidence.

This status means the configured evidence contract has been satisfied. It does not
mean universal truth, causality, clinical utility, or generalization beyond the
specified study population/design.

## Governance

Each validation result can be recorded in the Scientific Ledger using an evidence
hash, study ID, timestamp and promotion status.

The orchestrator never fabricates evidence and never turns a computed statistic
into a scientific claim without an explicit evidence/gate decision.
