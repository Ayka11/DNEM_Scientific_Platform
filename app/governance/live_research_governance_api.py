from fastapi import APIRouter
from pydantic import BaseModel
from typing import Any, Dict, List, Optional
from app.governance.live_research_governance_adapter import LiveResearchGovernanceAdapter
from app.governance.unified_research_governance_runtime import UnifiedResearchGovernanceRuntime

router=APIRouter(prefix="/api/v1/live-governance",tags=["live-governance"])
adapter=LiveResearchGovernanceAdapter()
runtime=UnifiedResearchGovernanceRuntime()

class LiveRequest(BaseModel):
    trials:List[Dict[str,Any]]
    analysis_id:str
    claim_id:str
    preregistration:Optional[Dict[str,Any]]=None
    exclusion_governance:Optional[Dict[str,Any]]=None
    multiplicity:Optional[Dict[str,Any]]=None
    sensitivity_robustness:Optional[Dict[str,Any]]=None
    validation_gates:Optional[Dict[str,Any]]=None
    evidence_graph:Optional[Dict[str,Any]]=None
    claim_governance:Optional[Dict[str,Any]]=None

@router.post("/prepare")
def prepare(req:LiveRequest):
    return adapter.prepare(**req.model_dump())

@router.post("/execute")
def execute(req:LiveRequest):
    prepared=adapter.prepare(**req.model_dump())
    g=runtime.execute({
        **req.model_dump(exclude={"trials"}),
        "effect_uncertainty":{"effect":None},
    })
    g["live_measurement_results"]=prepared["measurement_results"]
    g["domain_profile"]=prepared["domain_profile"]
    g["scientific_boundary"]=prepared["scientific_boundary"]
    return g
