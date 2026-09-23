from fastapi import APIRouter
from pydantic import BaseModel
from typing import Any, Dict, Optional
from app.governance.research_governance_runtime import ResearchGovernanceRuntime

router=APIRouter(prefix="/api/v1/research-governance",tags=["research-governance"])
_runtime=ResearchGovernanceRuntime()

class RuntimeRequest(BaseModel):
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

@router.post("/execute")
def execute(req:RuntimeRequest):
    return _runtime.execute(req.model_dump())

@router.get("/health")
def health():
    return {"runtime":"DNEM Scientific Research Governance Runtime","version":"1.0","status":"READY"}
