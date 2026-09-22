from fastapi import APIRouter
from app.research.multiplicity_governance import MultiplicityGovernanceEngine

router=APIRouter(prefix="/api/v1/multiplicity",tags=["multiplicity"])
engine=MultiplicityGovernanceEngine()

@router.post("/family")
def family(payload:dict):
    return {"tests":engine.register_family(
        payload["family_id"],payload["tests"],payload.get("alpha",0.05),
        payload.get("correction","NONE"),payload.get("registered",True)
    )}

@router.get("/summary/{family_id}")
def summary(family_id:str):
    return engine.summary(family_id)
