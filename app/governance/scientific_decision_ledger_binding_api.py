from fastapi import APIRouter,HTTPException
from pydantic import BaseModel
from typing import Any,Dict,Optional
from app.governance.scientific_decision_ledger_binding import ScientificDecisionLedgerBinding

router=APIRouter(prefix="/api/v1/decision-ledger-binding",tags=["decision-ledger-binding"])
_service=ScientificDecisionLedgerBinding()

class BindingRequest(BaseModel):
    analysis_id:str
    claim_id:str
    dataset_id:Optional[str]=None
    study_id:Optional[str]=None
    integrity:Dict[str,Any]
    evidence_graph:Optional[Dict[str,Any]]=None
    claim_governance:Dict[str,Any]
    ledger_context:Optional[Dict[str,Any]]=None

@router.post("/execute")
def execute(req:BindingRequest):
    try:return _service.execute(req.model_dump())
    except ValueError as e:
        msg=str(e); code=404 if msg=="analysis_not_found" else 409 if msg in {"analysis_integrity_failed","dataset_analysis_mismatch","evidence_graph_mismatch"} else 422
        raise HTTPException(status_code=code,detail=msg)
