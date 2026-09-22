# DNEM v7.7 Evidence & Claim Graph v2.0

## Purpose

Create a machine-readable provenance layer connecting scientific objects without
treating graph connectivity itself as proof.

Core chain:

Study → Measurement → Trial → Result → Analysis → Evidence → Claim → Model → Revision

## Governance states

- UNSUPPORTED: no supporting evidence edge.
- SUPPORTED_EDGE_ONLY: support exists but no explicit evidence reference.
- SUPPORTED_BY_GRAPH: support is traceable to evidence references.
- BLOCKED: contradiction or blocking decision is present.

A graph state is a governance/provenance status, not a substitute for statistical
or scientific validation.

## Contradictions

Evidence may explicitly enter through `CONTRADICTS`. A contradiction blocks the
claim in the current graph decision until resolved by a later evidence/revision
cycle.

## Reproducibility

The complete graph is canonically serialized and hashed with SHA-256.
Equivalent graph content therefore produces the same graph hash.
