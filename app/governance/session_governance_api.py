from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Any, Dict, Optional
from app.services.runtime_service import RuntimeService
from app.governance.live_research_governance_adapter import LiveResearchGovernanceAdapter
from app.governance.unified_research_governance_runtime import UnifiedResearchGovernanceRuntime
from app.governance.scientific_decision_ledger import ScientificDecisionLedger
from app.governance.research_governance_runtime import ResearchGovernanceRuntime
from app.governance.model_revision_engine import ModelRevisionEngine

router=APIRouter(prefix="/api/v1/session-governance",tags=["session-governance"])
runtime_service=RuntimeService()
adapter=LiveResearchGovernanceAdapter()
governance=UnifiedResearchGovernanceRuntime(
    ResearchGovernanceRuntime(ScientificDecisionLedger()),
    ModelRevisionEngine()
)

class SessionGovernanceRequest(BaseModel):
    session_id:str
    measurement_id:str="C01-01"
    analysis_id:str
    claim_id:str
    preregistration:Optional[Dict[str,Any]]=None
    exclusion_governance:Optional[Dict[str,Any]]=None
    multiplicity:Optional[Dict[str,Any]]=None
    sensitivity_robustness:Optional[Dict[str,Any]]=None
    validation_gates:Optional[Dict[str,Any]]=None
    evidence_graph:Optional[Dict[str,Any]]=None
    claim_governance:Optional[Dict[str,Any]]=None

@router.post("/execute")
def execute(req:SessionGovernanceRequest):
    if req.session_id not in runtime_service.sessions:
        raise HTTPException(status_code=404, detail="Unknown session_id")
    trials=runtime_service.generate_demo_trials(req.session_id,req.measurement_id,20)
    prepared=adapter.prepare(
        trials,
        analysis_id=req.analysis_id,
        claim_id=req.claim_id,
        preregistration=req.preregistration,
        exclusion_governance=req.exclusion_governance,
        multiplicity=req.multiplicity,
        sensitivity_robustness=req.sensitivity_robustness,
        validation_gates=req.validation_gates,
        evidence_graph=req.evidence_graph,
        claim_governance=req.claim_governance,
    )
    # Governance execution deliberately receives only declared governance inputs.
    # Runtime-derived measures are returned alongside, not silently promoted to evidence.
    result=governance.execute({
        "study_id":runtime_service.sessions[req.session_id].study_id,
        "dataset_id":f"SESSION-{req.session_id}",
        "analysis_id":req.analysis_id,
        "claim_id":req.claim_id,
        "preregistration":req.preregistration,
        "exclusion_governance":req.exclusion_governance,
        "multiplicity":req.multiplicity,
        "effect_uncertainty":{"effect":None},
        "sensitivity_robustness":req.sensitivity_robustness,
        "validation_gates":req.validation_gates,
        "evidence_graph":req.evidence_graph,
        "claim_governance":req.claim_governance,
    })
    result["session_id"]=req.session_id
    result["measurement_results"]=prepared["measurement_results"]
    result["domain_profile"]=prepared["domain_profile"]
    result["scientific_boundary"]=prepared["scientific_boundary"]
    return result
