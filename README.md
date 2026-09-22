# DNEM Scientific Platform v7.7 — Executable Application Skeleton

**Status: IMPLEMENTATION BASELINE / EXECUTABLE SCAFFOLD**

This package is the first executable implementation layer derived from the DNEM v7.7
Platform Implementation Architecture.

## Included
- FastAPI application layer
- Gradio research UI / Hugging Face Spaces entrypoint
- 170-measurement registry (34 domains × 5 paradigm families)
- Study Builder baseline
- Deterministic synthetic runtime
- Explicit runtime state machine
- Replayable event bus with provenance hash
- Results interface
- Evidence Graph interface
- Validation boundary
- Governance manifest
- API contract
- Docker deployment
- Unit/API tests

## Run locally
```bash
python -m venv .venv
# activate the environment
pip install -r requirements.txt
python app.py
```

API:
```bash
uvicorn app.api.server:app --host 0.0.0.0 --port 8000
```

Tests:
```bash
pytest -q
```

## Scientific boundary
This package does not claim scientific validation. Synthetic demo data are for software
verification only. Candidate constructs remain candidates until reliability, validity,
stability, invariance, replication and generalization evidence supports their intended
interpretation.

## Hugging Face Spaces
Use the repository as a Gradio Space or build with the supplied Dockerfile. The root
`app.py` is the Space entrypoint.

## Architecture
`UI → API → Services → Runtime / Measurement Registry / Results / Analysis / Validation / Evidence / Governance → Data Contracts`

## Next implementation stage
Connect the complete operational measurement specifications, task runtime schemas,
Study Builder schema, Results Engine, Evidence/Claim Graph and persistent study storage.
