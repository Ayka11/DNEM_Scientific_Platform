from fastapi import APIRouter
from app.research.statistical_plan_executor import StatisticalPlanExecutor

router=APIRouter(prefix="/api/v1/analysis-plan",tags=["analysis-plan"])
engine=StatisticalPlanExecutor()

@router.post("/compare")
def compare(payload:dict):
    return engine.compare(payload.get("plan",{}),payload.get("execution",{}))

@router.post("/execute")
def execute(payload:dict):
    return engine.execute(payload["analysis_id"],payload.get("plan",{}),
                          payload.get("execution",{}))

@router.post("/classify-deviation")
def classify(payload:dict):
    return {"classification":engine.classify_deviation(
        payload.get("deviation",{}),payload.get("amendment_id","")
    )}

@router.get("/verify/{analysis_id}")
def verify(analysis_id:str):
    return engine.verify(analysis_id)
