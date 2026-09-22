from fastapi import APIRouter
from app.research.exclusion_governance import ExclusionGovernanceEngine

router=APIRouter(prefix="/api/v1/exclusion-governance",tags=["exclusion-governance"])
engine=ExclusionGovernanceEngine()

@router.post("/rule")
def register_rule(payload:dict):
    return engine.register_rule(payload["rule_id"],payload["description"],
                                payload.get("source","PREREGISTERED"),
                                payload.get("criteria",{}),payload.get("allowed",True))

@router.post("/decision")
def decide(payload:dict):
    return engine.decide(payload["decision_id"],payload["subject_id"],
                         payload["unit_type"],payload["rule_id"],
                         payload["reason"],payload.get("stage","PRE_ANALYSIS"),
                         payload.get("decision","EXCLUDE"),payload.get("amendment_id",""))

@router.post("/missingness")
def missingness(payload:dict):
    return engine.classify_missingness(payload.get("observations",[]))

@router.get("/summary")
def summary():
    return engine.audit_summary()
