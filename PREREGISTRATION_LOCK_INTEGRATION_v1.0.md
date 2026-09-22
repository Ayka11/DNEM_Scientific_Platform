# DNEM v7.7 — Pre-registration Lock Integration v1.0

Integrates protocol lineage with the immutable pre-registration lifecycle:

`DRAFT → LOCKED → AMENDMENT → LOCKED`

A LOCKED protocol version cannot be edited in place. An amendment creates a
new protocol-lineage version and a new pre-registration record referencing the
locked parent.

## APIs
- `POST /api/v1/preregistration-lock/draft`
- `POST /api/v1/preregistration-lock/{prereg_id}/lock`
- `POST /api/v1/preregistration-lock/{prereg_id}/amend`
- `GET /api/v1/preregistration-lock/{prereg_id}`

The module records governance state and provenance. It never issues
`VALIDATED` and never treats protocol locking as scientific validation.
