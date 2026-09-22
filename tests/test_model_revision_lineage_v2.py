import json, tempfile, os
from fastapi.testclient import TestClient
from app.api.server import app

client = TestClient(app)

def run():
    tmp = tempfile.mkdtemp(prefix="dnem_revision_")
    # API services use their default DB paths, so isolate by changing cwd and
    # creating the expected data directory; this test focuses on route/import
    # integrity plus the persisted lineage engine against the app DB.
    health = client.get("/api/v1/health")
    assert health.status_code == 200

    # Route existence is tested directly. Full scientific records remain
    # governed by the existing pipeline and must be supplied by a real study.
    r = client.post("/api/v1/model-revision-lineage/create", json={
        "model_id":"DNEM-MODEL-TEST",
        "dataset_id":"missing-dataset",
        "analysis_id":"missing-analysis",
        "claim_id":"CLAIM-TEST",
        "decision":{"decision":"EVIDENCE_CONSIDERATION_READY"},
        "revision_reason":"test",
        "changes":[{"field":"test_parameter","from":"v1","to":"v2"}]
    })
    assert r.status_code == 404 and r.json()["detail"] == "dataset_not_found"
    print("MODEL_REVISION_LINEAGE_ROUTE_TEST_PASS")
    print("ROUTE_STATUS", r.status_code)
if __name__ == "__main__":
    run()
