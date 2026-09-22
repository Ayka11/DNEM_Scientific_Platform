# DNEM v7.7 Statistical Analysis Plan Executor v1.0

This component compares declared/pre-registered analysis parameters with actual
execution metadata.

Tracked fields:
- primary test
- secondary tests
- alpha
- effect measure
- missing-data method
- exclusion rule IDs

A mismatch is recorded as `PLAN_DEVIATION`.

Deviation classifications:
- PRE_APPROVED_AMENDMENT
- UNREGISTERED_DEVIATION

The engine does not judge whether a deviation is scientifically justified. It
makes the deviation visible and auditable.

Every execution receives a SHA-256 execution hash.
