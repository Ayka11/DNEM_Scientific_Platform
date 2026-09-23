from fastapi import APIRouter
from pydantic import BaseModel
from typing import Any, Dict, Optional
from app.governance.scientific_decision_pipeline import ScientificDecisionPipeline

router = APIRouter(prefix="/api/v1/scientific-decision", tags=["scientific-decision"])
_engine = ScientificDecisionPipeline()

class DecisionRequest(BaseModel):
    analysis_id: str
    claim_id: str
    integrity: Dict[str, Any]
    evidence_graph: Dict[str, Any]
    claim_governance: Dict[str, Any]
    ledger_context: Optional[Dict[str, Any]] = None

@router.post("/evaluate")
def evaluate(req: DecisionRequest):
    return _engine.run(**req.model_dump())
