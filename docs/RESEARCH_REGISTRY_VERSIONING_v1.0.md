# DNEM v7.7 Scientific Research Registry & Experiment Versioning v1.0

Every major research object receives an immutable research ID.

Supported object types:
- EXPERIMENT
- PROTOCOL
- DATASET
- ANALYSIS
- EVIDENCE
- CLAIM

IDs use a deterministic human-readable form such as `EXP-000001`.

Historical records are not overwritten. Versioning creates a new record with:
- incremented version
- parent_id
- immutable SHA-256 hash
- timestamp
- status

The registry therefore provides an auditable lineage from an active object back
through its predecessors.

This registry provides provenance and version control; it does not establish
scientific validity by itself.
