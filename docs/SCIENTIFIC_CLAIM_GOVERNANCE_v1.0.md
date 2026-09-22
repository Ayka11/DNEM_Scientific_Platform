# DNEM v7.7 Scientific Claim Governance Engine v1.0

This layer governs the lifecycle of scientific claims. It does not decide whether
a claim is true from language or graph structure alone.

Lifecycle:
CANDIDATE → SUPPORTED → CONDITIONAL → VALIDATED
                    ↘ CONTRADICTED → REVISED
Any unresolved claim may become BLOCKED.

Rules:
1. VALIDATED requires explicit evidence references.
2. Invalid lifecycle transitions are rejected.
3. BLOCKED claims cannot be silently promoted.
4. REVISED claims receive a new version and predecessor reference.
5. Every record receives a deterministic provenance hash.
6. Graph support and validation status are separate inputs.
7. A VALIDATED lifecycle state means the configured DNEM evidence contract was
   satisfied; it is not a universal truth or causal inference.

API:
POST /api/v1/governance/claim/create
POST /api/v1/governance/claim/transition
POST /api/v1/governance/claim/evaluate
