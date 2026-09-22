# DNEM v7.7 Missing Data & Exclusion Governance Engine v1.0

This layer makes exclusions auditable and distinguishes:
- pre-registered exclusions
- amended exclusions
- post-hoc decisions

Each decision records subject/trial ID, unit type, rule, reason, stage,
timestamp and evidence hash.

Missingness is summarized without assuming a missing-data mechanism. The engine
does not automatically classify missingness as MCAR, MAR or MNAR because such
claims require an appropriate statistical design.

An amended rule requires an amendment ID, preventing silent post-hoc rule changes.

API:
POST /api/v1/exclusion-governance/rule
POST /api/v1/exclusion-governance/decision
POST /api/v1/exclusion-governance/missingness
GET  /api/v1/exclusion-governance/summary
