# DNEM v7.7 — Protocol Inheritance & Amendment Engine v1.0

Adds immutable protocol lineage to the successor research-cycle architecture.

## Chain

`Model Revision → Successor Cycle → Protocol Version → Amendment → New Protocol Version`

A source protocol version is never overwritten. Amendments record:
- exact path changed
- old value
- new value
- reason
- parent protocol/version
- cycle and model-revision provenance

## APIs

- `POST /api/v1/protocol-lineage/register`
- `POST /api/v1/protocol-lineage/amend`
- `GET /api/v1/protocol-lineage/{protocol_id}/{version}`
- `GET /api/v1/protocol-lineage/{protocol_id}/{version}/verify`
- `GET /api/v1/protocol-lineage/{protocol_id}/lineage`

This layer records protocol governance; it does not validate scientific claims or
issue `VALIDATED`.
