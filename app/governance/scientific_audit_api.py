from fastapi import APIRouter
from app.governance.scientific_audit import ScientificAuditEngine

router=APIRouter(prefix="/api/v1/audit",tags=["scientific-audit"])
engine=ScientificAuditEngine()

@router.post("/manifest")
def create_manifest(payload:dict):
    return engine.build(payload)

@router.post("/verify")
def verify_manifest(payload:dict):
    return engine.verify(payload)

@router.post("/chain")
def chain_manifests(payload:dict):
    return {
        "chain_hash":engine.chain_hash(payload.get("manifests",[])),
        "count":len(payload.get("manifests",[]))
    }
