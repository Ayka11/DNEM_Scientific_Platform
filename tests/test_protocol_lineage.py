from fastapi.testclient import TestClient
from app.api.server import app
c=TestClient(app)
def run():
    r=c.post("/api/v1/protocol-lineage/register",json={
      "protocol_id":"TEST-P","version":"1.0",
      "definition":{"sample_size":30,"primary_outcome":"reaction_time"}})
    assert r.status_code in (200,409)
    if r.status_code==409:
        # shared default DB can contain a prior smoke record; still test amendment route safely
        pass
    r2=c.post("/api/v1/protocol-lineage/amend",json={
      "source_protocol_id":"MISSING-P","source_version":"1.0","new_version":"2.0",
      "amendments":[{"path":"sample_size","new_value":40,"reason":"power amendment"}]})
    assert r2.status_code==404
    print("PROTOCOL_LINEAGE_ROUTE_TEST_PASS")
    print("AMENDMENT_MISSING_SOURCE_STATUS",r2.status_code)
if __name__=="__main__":run()
