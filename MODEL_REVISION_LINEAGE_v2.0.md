# DNEM v7.7 — Model Revision Lineage v2.0

This layer connects the persisted scientific cycle to explicit model revision
and prepares a successor research cycle.

## Chain

`Dataset → Analysis → Evidence → Graph → Claim → Decision → Ledger → Audit Snapshot → Model Revision → Successor Research Cycle`

## Guarantees

- Prior dataset, analysis, evidence, graph, claim, decision and ledger records are not overwritten.
- The audit snapshot must be `INTEGRITY_VERIFIED`.
- The analysis hash and dataset hash are rechecked.
- A `BLOCKED` decision cannot create a model revision.
- Revision requires an explicit reason and at least one explicit model change.
- The successor research cycle is a descriptor only; no new experiment is executed automatically.
- `VALIDATED` is never synthesized by this layer.

## APIs

- `POST /api/v1/model-revision-lineage/create`
- `GET /api/v1/model-revision-lineage/{revision_id}`
- `GET /api/v1/model-revision-lineage/{revision_id}/verify`
- `GET /api/v1/model-revision-lineage/lineage/{model_id}`

## Persistent tables

- `model_revisions`
- `research_cycle_successors`

## Revision record

Each revision binds:

- model / parent model
- source dataset and dataset hash
- source analysis and analysis hash
- claim
- evidence graph hash
- audit snapshot hash
- decision state
- decision ledger head hash
- explicit reason and changes
- successor research-cycle ID

Scientific status remains governed by the independent validation/gate architecture.
