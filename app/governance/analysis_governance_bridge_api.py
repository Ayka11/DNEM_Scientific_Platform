from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Any, Dict, Optional
from app.governance.analysis_governance_bridge import AnalysisGovernanceBridge

router = APIRouter(prefix="/api/v1/analysis-governance", tags=["analysis-governance"])
_service = AnalysisGovernanceBridge()

class AnalysisGovernanceRequest(BaseModel):
    analysis_id: str
    claim_id: str
    dataset_id: Optional[str] = None
    study_id: Optional[str] = None
    preregistration: Optional[Dict[str, Any]] = None
    exclusion_governance: Optional[Dict[str, Any]] = None
    multiplicity: Optional[Dict[str, Any]] = None
    effect_uncertainty: Optional[Dict[str, Any]] = None
    sensitivity_robustness: Optional[Dict[str, Any]] = None
    validation_gates: Optional[Dict[str, Any]] = None
    evidence_graph: Optional[Dict[str, Any]] = None
    claim_governance: Optional[Dict[str, Any]] = None
    claim_type: str = "CANDIDATE"
    ledger_context: Optional[Dict[str, Any]] = None
    model_revision: Optional[Dict[str, Any]] = None

@router.post("/execute")
def execute(req: AnalysisGovernanceRequest):
    try:
        return _service.execute(req.model_dump())
    except ValueError as e:
        msg = str(e)
        code = 404 if msg == "analysis_not_found" else 409 if msg in {
            "dataset_analysis_mismatch", "analysis_integrity_failed"
        } else 422
        raise HTTPException(status_code=code, detail=msg)
