from fastapi import APIRouter
from app.governance.claim_governance import ClaimGovernanceEngine

router=APIRouter(prefix="/api/v1/governance",tags=["governance"])
engine=ClaimGovernanceEngine()

@router.post("/claim/create")
def create_claim(payload:dict):
    return engine.create(payload["claim_id"],payload["statement"],payload.get("evidence_refs"))

@router.post("/claim/transition")
def transition_claim(payload:dict):
    return engine.transition(payload["record"],payload["new_status"],
                             payload.get("rationale",""),payload.get("evidence_refs"),
                             payload.get("predecessor"))

@router.post("/claim/evaluate")
def evaluate_claim(payload:dict):
    return {"recommended_lifecycle":engine.evaluate(
        payload.get("validation_status"),
        payload.get("graph_state"),
        payload.get("evidence_refs",[])
    )}
