from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Any, Dict, List, Optional
from app.governance.model_revision_lineage_engine import ModelRevisionLineageEngine

router = APIRouter(prefix="/api/v1/model-revision-lineage", tags=["model-revision-lineage"])
_service = ModelRevisionLineageEngine()

class RevisionLineageRequest(BaseModel):
    model_id: str
    dataset_id: str
    analysis_id: str
    claim_id: str
    decision: Dict[str, Any] = {}
    revision_reason: str
    changes: List[Dict[str, Any]]
    parent_model_id: Optional[str] = None
    parent_cycle_id: Optional[str] = None
    graph_hash: Optional[str] = None

@router.post("/create")
def create(req: RevisionLineageRequest):
    try:
        return _service.create(req.model_dump())
    except ValueError as e:
        msg = str(e)
        code = 404 if msg in {"dataset_not_found", "analysis_not_found"} else 409 if msg in {
            "dataset_analysis_mismatch", "analysis_integrity_failed",
            "audit_snapshot_integrity_failed", "evidence_graph_mismatch",
            "decision_ledger_integrity_failed", "blocked_decision_cannot_create_model_revision"
        } else 422
        raise HTTPException(status_code=code, detail=msg)

@router.get("/{revision_id}")
def get_revision(revision_id: str):
    try:
        result = _service.get(revision_id)
        if result is None:
            raise HTTPException(status_code=404, detail="revision_not_found")
        return result
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

@router.get("/{revision_id}/verify")
def verify_revision(revision_id: str):
    try:
        return _service.verify(revision_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/lineage/{model_id}")
def model_lineage(model_id: str):
    return {"model_id": model_id, "revisions": _service.lineage(model_id)}
