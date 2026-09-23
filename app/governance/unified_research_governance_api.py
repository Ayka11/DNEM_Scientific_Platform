from fastapi import APIRouter
from pydantic import BaseModel
from typing import Any, Dict, Optional
from app.governance.unified_research_governance_runtime import UnifiedResearchGovernanceRuntime

router=APIRouter(prefix="/api/v1/unified-governance",tags=["unified-governance"])
_runtime=UnifiedResearchGovernanceRuntime()

class UnifiedRequest(BaseModel):
    study_id:Optional[str]=None
    dataset_id:Optional[str]=None
    analysis_id:str
    claim_id:str
    preregistration:Optional[Dict[str,Any]]=None
    exclusion_governance:Optional[Dict[str,Any]]=None
    multiplicity:Optional[Dict[str,Any]]=None
    effect_uncertainty:Optional[Dict[str,Any]]=None
    sensitivity_robustness:Optional[Dict[str,Any]]=None
    validation_gates:Optional[Dict[str,Any]]=None
    evidence_graph:Optional[Dict[str,Any]]=None
    claim_governance:Optional[Dict[str,Any]]=None
    claim_type:str="CANDIDATE"
    ledger_context:Optional[Dict[str,Any]]=None
    model_revision:Optional[Dict[str,Any]]=None

@router.post("/execute")
def execute(req:UnifiedRequest):
    return _runtime.execute(req.model_dump())
