# DNEM v7.7 Domain Results Engine v1.0

## Purpose

This engine creates the first explicit aggregation layer between the 170
measurement families and the DNEM profile.

The hierarchy is:

RAW TRIAL DATA
→ RAW MEASURE
→ DERIVED MEASURE
→ TASK SCORE
→ DOMAIN TASK-LEVEL AGGREGATE
→ CONSTRUCT ESTIMATE (gated)
→ DOMAIN RESULT (gated)
→ PROFILE (gated)

## Scientific gates

The software refuses to silently infer a validated construct from task performance.

Default gates include:

- paradigm coverage
- construct validity
- normative reference
- replication

Only the first is satisfied by the executable demo when task results exist.
The other gates remain closed until empirical evidence is supplied.

## Important distinction

A domain may have a task-level aggregate while its construct estimate remains null.

Likewise, the integrated DNEM profile can exist as a data structure while its
integrated construct score remains null.

This prevents software architecture from being mistaken for scientific evidence.
