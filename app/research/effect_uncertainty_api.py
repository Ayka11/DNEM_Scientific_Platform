from fastapi import APIRouter
from app.research.effect_uncertainty_governance import EffectUncertaintyEngine

router=APIRouter(prefix="/api/v1/effect",tags=["effect-uncertainty"])
engine=EffectUncertaintyEngine()

@router.post("/mean-difference")
def mean_difference(payload:dict):
    return engine.mean_difference(payload["group_a"],payload["group_b"])

@router.post("/standardized")
def standardized(payload:dict):
    return engine.standardized_mean_difference(payload["group_a"],payload["group_b"])

@router.post("/record")
def record(payload:dict):
    return engine.record(payload["analysis_id"],payload["estimate"],
                         payload.get("interpretation_status","DESCRIPTIVE"))

@router.post("/verify")
def verify(payload:dict):
    return {"valid":engine.verify(payload)}
