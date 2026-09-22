import os, sys, importlib
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from app.api.server import app

REQUIRED_ROUTES = [
    "/api/v1/model-revision-lineage/create",
    "/api/v1/research-cycle-successor/register",
    "/api/v1/protocol-lineage/register",
    "/api/v1/protocol-lineage/amend",
    "/api/v1/preregistration-lock/draft",
]

REQUIRED_MODULES = [
    "app.governance.model_revision_lineage_engine",
    "app.research.research_cycle_successor_executor",
    "app.research.protocol_inheritance_amendment_engine",
    "app.governance.preregistration_lock_integration",
    "app.governance.scientific_audit_snapshot",
]

def run():
    routes = {getattr(r, "path", None) for r in app.routes}
    missing = [x for x in REQUIRED_ROUTES if x not in routes]
    assert not missing, f"missing_routes:{missing}"

    for mod in REQUIRED_MODULES:
        importlib.import_module(mod)

    client = TestClient(app)
    # Safe negative-path checks prove that the integrated routes are live and
    # preserve governance boundaries when prerequisites are absent.
    checks = [
        ("/api/v1/research-cycle-successor/register",
         {"revision_id":"REV-MISSING","new_protocol_id":"P","protocol_version":"1.0"},
         "revision_not_found"),
        ("/api/v1/preregistration-lock/draft",
         {"protocol_id":"P-MISSING","protocol_version":"1.0"},
         "protocol_not_found"),
    ]
    for path, payload, expected in checks:
        r = client.post(path, json=payload)
        assert r.status_code == 404
        assert r.json()["detail"] == expected

    print("DNEM_PRODUCTION_INTEGRATION_TEST_PASS")
    print("REQUIRED_ROUTES", len(REQUIRED_ROUTES))
    print("REQUIRED_MODULES", len(REQUIRED_MODULES))
    print("SCIENTIFIC_VALIDATION_AUTOMATION", False)

if __name__ == "__main__":
    run()
