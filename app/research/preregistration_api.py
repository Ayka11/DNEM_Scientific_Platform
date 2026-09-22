from fastapi import APIRouter
from app.research.preregistration import PreregistrationEngine

router=APIRouter(prefix="/api/v1/preregistration",tags=["preregistration"])
engine=PreregistrationEngine()

@router.post("/register")
def register(payload:dict):
    return engine.register(
        payload["protocol_id"],payload.get("hypotheses",[]),
        payload.get("primary_outcomes",[]),payload.get("secondary_outcomes",[]),
        payload.get("exclusion_rules",[]),payload.get("analysis_plan",{})
    )

@router.post("/lock")
def lock(payload:dict):
    return engine.lock(payload["protocol_id"])

@router.post("/amend")
def amend(payload:dict):
    return engine.amend(payload["protocol_id"],payload["amendment_reason"],
                         payload.get("changes",{}))

@router.get("/verify/{protocol_id}")
def verify(protocol_id:str):
    return engine.verify(protocol_id)
