from fastapi import APIRouter,HTTPException
from pydantic import BaseModel
from typing import Any,Dict,List,Optional
from app.research.end_to_end_research_cycle import EndToEndResearchCycle

router=APIRouter(prefix="/api/v1/research-cycle",tags=["end-to-end-research-cycle"])
_service=EndToEndResearchCycle()

class EvidenceItem(BaseModel):
    evidence_id:str
    evidence:Dict[str,Any]
    status:str="REGISTERED"

class CycleRequest(BaseModel):
    dataset_id:str
    analysis_id:str
    claim_id:str
    study_id:Optional[str]=None
    measurement_id:Optional[str]=None
    validation_by_domain:Optional[Dict[str,Any]]=None
    evidence:List[EvidenceItem]=[]
    integrity:Dict[str,Any]={}
    claim_governance:Dict[str,Any]={}
    ledger_context:Optional[Dict[str,Any]]=None

@router.post("/execute")
def execute(req:CycleRequest):
    try:return _service.execute(req.model_dump())
    except ValueError as e:
        msg=str(e); code=404 if msg=="dataset_not_found" else 409 if msg=="dataset_analysis_mismatch" else 422
        raise HTTPException(status_code=code,detail=msg)
