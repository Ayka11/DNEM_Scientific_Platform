from fastapi.testclient import TestClient
from app.api.server import app

client = TestClient(app)

def run():
    r = client.post("/api/v1/research-cycle-successor/register", json={
        "revision_id":"REV-MISSING",
        "new_protocol_id":"PROTO-V2",
        "protocol_version":"2.0",
        "new_dataset_id":"DATASET-NEW"
    })
    assert r.status_code == 404
    assert r.json()["detail"] == "revision_not_found"
    print("RESEARCH_CYCLE_SUCCESSOR_ROUTE_TEST_PASS")
    print("ROUTE_STATUS", r.status_code)

if __name__ == "__main__":
    run()
