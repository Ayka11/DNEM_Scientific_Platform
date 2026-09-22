from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Any, Dict, Optional
from app.research.dataset_analysis_pipeline import DatasetAnalysisPipeline

router=APIRouter(prefix="/api/v1/dataset-analysis",tags=["dataset-analysis"])
service=DatasetAnalysisPipeline()

class AnalysisRequest(BaseModel):
    dataset_id:str
    analysis_id:str
    measurement_id:Optional[str]=None
    validation_by_domain:Optional[Dict[str,Any]]=None

@router.post("/run")
def run(req:AnalysisRequest):
    try:
        return service.analyze(**req.model_dump())
    except ValueError as e:
        msg=str(e)
        code=404 if msg=="dataset_not_found" else 422
        raise HTTPException(status_code=code,detail=msg)
