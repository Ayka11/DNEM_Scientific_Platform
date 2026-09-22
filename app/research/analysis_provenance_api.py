from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Any, Dict, Optional
from app.research.analysis_provenance import AnalysisProvenance

router = APIRouter(prefix="/api/v1/analysis-provenance", tags=["analysis-provenance"])
service = AnalysisProvenance()

class AnalysisProvenanceRequest(BaseModel):
    dataset_id: str
    analysis_id: str
    measurement_id: Optional[str] = None
    validation_by_domain: Optional[Dict[str, Any]] = None

@router.post("/run")
def run(req: AnalysisProvenanceRequest):
    try:
        return service.run(**req.model_dump())
    except ValueError as e:
        msg = str(e)
        code = 404 if msg in {"dataset_not_found", "analysis_not_found"} else 409 if msg == "analysis_id_exists" else 422
        raise HTTPException(status_code=code, detail=msg)

@router.get("/{analysis_id}")
def get(analysis_id: str):
    result = service.get(analysis_id)
    if not result:
        raise HTTPException(status_code=404, detail="analysis_not_found")
    return result

@router.get("/{analysis_id}/verify")
def verify(analysis_id: str):
    try:
        return service.verify(analysis_id)
    except ValueError:
        raise HTTPException(status_code=404, detail="analysis_not_found")

@router.get("")
def list_analyses(dataset_id: Optional[str] = None):
    return {"analyses": service.list(dataset_id)}
