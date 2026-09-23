from fastapi import APIRouter
from app.evidence.claim_graph_v2 import ClaimEvidenceGraphV2

router=APIRouter(prefix="/api/v1/evidence", tags=["evidence"])

@router.post("/graph")
def build_graph(payload: dict):
    return ClaimEvidenceGraphV2.from_validation_bundle(payload).export()

@router.post("/claim-state")
def claim_state(payload: dict):
    g=ClaimEvidenceGraphV2.from_validation_bundle(payload)
    claim_id=payload.get("claim_id","claim_unknown")
    return g.claim_state(claim_id)
