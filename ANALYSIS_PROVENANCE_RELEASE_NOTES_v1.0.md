# DNEM v7.7 — Analysis Provenance v1.0

## Added
- Immutable persisted `analyses` registry in SQLite.
- Dataset-linked analysis records with `dataset_hash` lineage.
- Deterministic `analysis_hash` for tamper verification.
- `POST /api/v1/analysis-provenance/run`
- `GET /api/v1/analysis-provenance/{analysis_id}`
- `GET /api/v1/analysis-provenance/{analysis_id}/verify`
- `GET /api/v1/analysis-provenance?dataset_id=...`

## Scientific boundary
This layer records provenance and reproducibility only. It does **not** establish scientific validity, causality, construct inference, or a validated DNEM profile.

## Validation
- `ANALYSIS_PROVENANCE_TEST_PASS`
- `COMPILEALL` passed
- `SERVER_IMPORT_PASS 87`
