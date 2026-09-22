from fastapi import APIRouter
from app.research.sensitivity_robustness import SensitivityRobustnessEngine

router=APIRouter(prefix="/api/v1/robustness",tags=["robustness"])
engine=SensitivityRobustnessEngine()

@router.post("/compare")
def compare(payload:dict):
    return engine.compare(payload["primary"],payload["sensitivity"])

@router.post("/register")
def register(payload:dict):
    return engine.register(payload["analysis_id"],payload["primary"],
                           payload.get("sensitivity_runs",[]))

@router.get("/summary/{analysis_id}")
def summary(analysis_id:str):
    return engine.summarize(analysis_id)

@router.get("/verify/{analysis_id}")
def verify(analysis_id:str):
    return {"valid":engine.verify(analysis_id)}
