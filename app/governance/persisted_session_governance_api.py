from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Any, Dict, Optional
from app.governance.persisted_session_governance import PersistedSessionGovernance

router = APIRouter(prefix="/api/v1/persisted-governance", tags=["persisted-governance"])
service = PersistedSessionGovernance()

class Request(BaseModel):
    session_id: str
    analysis_id: str
    claim_id: str
    measurement_id: Optional[str] = None
    study_id: Optional[str] = None
    dataset_id: Optional[str] = None
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

@router.post("/prepare")
def prepare(req: Request):
    try:
        return service.prepare(**req.model_dump())
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/execute")
def execute(req: Request):
    try:
        return service.execute(**req.model_dump())
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
