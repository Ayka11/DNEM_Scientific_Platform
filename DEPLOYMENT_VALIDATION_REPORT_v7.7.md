# DNEM v7.7 Release Candidate — Deployment Validation

## Result

**Status: RELEASE CANDIDATE — APPLICATION-LEVEL DEPLOYMENT VALIDATED**

Validated in a clean extracted workspace.

### Checks passed

- Python compilation: PASS
- Production integration test: PASS
- End-to-end research-cycle test: PASS
- Scientific audit snapshot integrity test: PASS
- Preregistration lock route test: PASS
- Protocol lineage route test: PASS
- Research-cycle successor route test: PASS
- Model-revision lineage route test: PASS
- Analysis provenance test: PASS
- Clean SQLite initialization: PASS
- Absolute Windows-path scan: PASS
- FastAPI health endpoint: HTTP 200
- FastAPI docs endpoint: HTTP 200
- Gradio UI endpoint: HTTP 307 redirect to `/ui/` (expected Gradio behavior)
- Combined FastAPI + Gradio launcher: PASS

## Important production correction

The previous deployment package contained a Gradio-only `app.py` launcher while the production API is implemented in FastAPI.

This release candidate corrects the entrypoint so **FastAPI and Gradio run in the same process**:

- FastAPI research API remains available under `/api/v1/*`
- FastAPI documentation remains at `/docs`
- Gradio research UI is mounted at `/ui`
- Default deployment port is `7860`
- `PORT` environment variable is honored

This removes the API/UI entrypoint mismatch before deployment.

## Docker

Docker was **not available in the current execution environment**, so a real `docker build` / container runtime test could not be performed here.

Therefore this package is **not labeled Docker-runtime-verified**. The Dockerfile itself was inspected and uses:

- `python:3.11-slim`
- `requirements.txt`
- port `7860`
- `python app.py`

## Scientific boundary

The application remains an implementation baseline. Deployment validation does **not** establish scientific validity, reliability, causal inference, clinical validity, or universal intelligence claims.

Synthetic/demo runtime data remain explicitly non-validation data.

## Recommended deployment target

The package is suitable as the release candidate for a Hugging Face Spaces Docker deployment after the platform performs its own container build/start check.

Generated during validation.
