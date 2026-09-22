# DNEM v7.7 Scientific Audit & Reproducibility Engine v1.0

## Provenance chain

Experiment
→ Dataset
→ Software Version
→ Analysis
→ Evidence
→ Claim
→ Governance Decision

Each component is represented by a canonical SHA-256 hash or explicit software
version. The resulting manifest has its own SHA-256 hash.

## Functions

- Create reproducibility manifest.
- Verify manifest integrity.
- Detect tampering.
- Produce deterministic multi-manifest chain hash.

## Scientific boundary

An intact manifest proves provenance/integrity of the recorded package. It does
not prove that the underlying experiment is scientifically valid, unbiased,
causal, or generalizable.

## API

POST /api/v1/audit/manifest
POST /api/v1/audit/verify
POST /api/v1/audit/chain
