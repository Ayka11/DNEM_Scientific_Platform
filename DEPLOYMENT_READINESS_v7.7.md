# DNEM v7.7 — Deployment Readiness

## Target
GitHub source repository and Hugging Face Spaces / Docker deployment.

## Runtime
- Python 3.11+
- FastAPI
- Uvicorn
- Pydantic
- Gradio where the inherited UI is enabled

## Entrypoint
`python app.py`

The server binds to `0.0.0.0` and uses `PORT` when provided; default is 7860.

## Scientific boundary
Deployment packaging does not alter scientific governance. The release never
automatically issues VALIDATED, clinical inference, or causal inference.

## Pre-push checklist
1. Build/compile source.
2. Run production integration test.
3. Verify Dockerfile and requirements.
4. Verify release manifest.
5. Run clean-process smoke test.
6. Commit and push only after the clean-process test passes.
