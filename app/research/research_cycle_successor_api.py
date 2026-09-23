from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.research.research_cycle_successor_executor import ResearchCycleSuccessorExecutor

router = APIRouter(prefix="/api/v1/research-cycle-successor", tags=["research-cycle-successor"])
_service = ResearchCycleSuccessorExecutor()

class SuccessorCycleRequest(BaseModel):
    revision_id: str
    new_protocol_id: str
    protocol_version: str
    new_dataset_id: Optional[str] = None
    parent_cycle_id: Optional[str] = None
    cycle_nonce: Optional[str] = None

@router.post("/register")
def register(req: SuccessorCycleRequest):
    try:
        return _service.create(req.model_dump())
    except ValueError as e:
        msg = str(e)
        code = 404 if msg in {"revision_not_found"} else 409 if msg in {
            "revision_integrity_failed", "new_dataset_must_not_reuse_source_dataset"
        } else 422
        raise HTTPException(status_code=code, detail=msg)

@router.get("/{cycle_id}")
def get_cycle(cycle_id: str):
    try:
        value = _service.get(cycle_id)
        if value is None:
            raise HTTPException(status_code=404, detail="cycle_not_found")
        return value
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/{cycle_id}/verify")
def verify_cycle(cycle_id: str):
    try:
        return _service.verify(cycle_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
