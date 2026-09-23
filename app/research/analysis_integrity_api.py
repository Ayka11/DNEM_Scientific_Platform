from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import Any, Dict, Optional
from app.research.analysis_integrity import AnalysisIntegrityEngine

router = APIRouter(prefix="/api/v1/analysis-integrity", tags=["analysis-integrity"])
_engine = AnalysisIntegrityEngine()

class IntegrityRequest(BaseModel):
    analysis_id: str
    preregistration: Optional[Dict[str, Any]] = None
    exclusion_governance: Optional[Dict[str, Any]] = None
    multiplicity: Optional[Dict[str, Any]] = None
    effect_uncertainty: Optional[Dict[str, Any]] = None
    sensitivity_robustness: Optional[Dict[str, Any]] = None
    validation_gates: Optional[Dict[str, Any]] = None
    evidence_graph: Optional[Dict[str, Any]] = None
    claim_type: str = "CANDIDATE"

@router.post("/assess")
def assess(req: IntegrityRequest):
    return _engine.assess(**req.model_dump())
