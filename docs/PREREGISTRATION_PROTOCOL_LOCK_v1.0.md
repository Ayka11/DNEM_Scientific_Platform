# DNEM v7.7 Research Protocol Lock & Pre-registration Engine v1.0

## Purpose

Freeze the protocol before outcome interpretation and make post-lock changes
explicit through amendments.

A protocol can contain:
- hypotheses
- primary outcomes
- secondary outcomes
- exclusion rules
- analysis plan

Lifecycle:

DRAFT → LOCKED → AMENDMENT(DRAFT) → LOCKED

A locked protocol cannot be silently edited. An amendment creates a new version
with a parent reference and an explicit amendment reason.

The lock hash provides integrity checking. It does not prove that a protocol is
scientifically optimal or that its hypotheses are true.

## API

POST /api/v1/preregistration/register
POST /api/v1/preregistration/lock
POST /api/v1/preregistration/amend
GET /api/v1/preregistration/verify/{protocol_id}
