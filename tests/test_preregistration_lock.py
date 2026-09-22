from fastapi.testclient import TestClient
from app.api.server import app
c=TestClient(app)
def run():
    r=c.post("/api/v1/preregistration-lock/draft",json={
      "protocol_id":"MISSING-P","protocol_version":"1.0"})
    assert r.status_code==404
    assert r.json()["detail"]=="protocol_not_found"
    print("PREREGISTRATION_LOCK_ROUTE_TEST_PASS")
    print("DRAFT_MISSING_PROTOCOL_STATUS",r.status_code)
if __name__=="__main__":run()
