# DNEM v7.7 — Research Cycle Successor Executor v1.0

This layer turns an explicit Model Revision lineage record into a registered
successor research cycle.

## Principle

A model revision does **not** automatically become a new scientific result.
The successor executor creates a controlled research-cycle registration that
requires new protocol/data before execution.

### Chain

`Audit Snapshot → Model Revision → Successor Cycle Registration → New Protocol + New Dataset → New Trials → Independent Analysis → New Evidence`

## Safeguards

- The source revision must exist and pass hash verification.
- A protocol ID and protocol version are mandatory.
- The source dataset cannot be silently reused as the new dataset.
- No previous trial is copied as a new trial.
- No prior result is promoted to new evidence.
- No experiment is executed automatically.
- No VALIDATED status is issued.
- The registered cycle explicitly records the provenance of the revision that created it.

## APIs

- `POST /api/v1/research-cycle-successor/register`
- `GET /api/v1/research-cycle-successor/{cycle_id}`
- `GET /api/v1/research-cycle-successor/{cycle_id}/verify`

Status after registration:

`REGISTERED_AWAITING_NEW_DATA`

Execution state:

`NOT_EXECUTED`
