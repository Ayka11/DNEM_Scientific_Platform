from fastapi import APIRouter
from pydantic import BaseModel
from typing import Any, Dict, List, Optional
from app.governance.model_revision_engine import ModelRevisionEngine

router=APIRouter(prefix="/api/v1/model-revision",tags=["model-revision"])
_engine=ModelRevisionEngine()

class RevisionRequest(BaseModel):
    model_id:str
    decision:Dict[str,Any]
    evidence_graph:Dict[str,Any]
    revision_reason:str
    changes:List[Dict[str,Any]]
    parent_model_id:Optional[str]=None

@router.post("/create")
def create(req:RevisionRequest):
    return _engine.create_revision(**req.model_dump())
