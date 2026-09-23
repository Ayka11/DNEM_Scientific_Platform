from fastapi import APIRouter,HTTPException
from pydantic import BaseModel
from typing import Optional
from app.evidence.evidence_claim_graph_integration import EvidenceClaimGraphIntegration

router=APIRouter(prefix="/api/v1/evidence-graph-integration",tags=["evidence-graph-integration"])
_service=EvidenceClaimGraphIntegration()

class GraphRequest(BaseModel):
    analysis_id:str
    claim_id:str
    study_id:Optional[str]=None

@router.post("/build")
def build(req:GraphRequest):
    try:return _service.build(**req.model_dump())
    except ValueError as e:
        msg=str(e)
        code=404 if msg=="analysis_not_found" else 409 if msg in {"analysis_integrity_failed","evidence_integrity_failed"} else 422
        raise HTTPException(status_code=code,detail=msg)
