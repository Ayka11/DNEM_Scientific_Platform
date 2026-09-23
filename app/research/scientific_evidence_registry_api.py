from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Any, Dict, Optional
from app.research.scientific_evidence_registry import ScientificEvidenceRegistry

router=APIRouter(prefix="/api/v1/evidence-registry",tags=["evidence-registry"])
_service=ScientificEvidenceRegistry()

class EvidenceRequest(BaseModel):
    evidence_id:str
    analysis_id:str
    evidence:Dict[str,Any]
    status:str="REGISTERED"

@router.post("/register")
def register(req:EvidenceRequest):
    try: return _service.register(**req.model_dump())
    except ValueError as e:
        msg=str(e)
        code=404 if msg=="analysis_not_found" else 409 if msg in {"evidence_id_exists","analysis_integrity_failed"} else 422
        raise HTTPException(status_code=code,detail=msg)

@router.get("/{evidence_id}")
def get(evidence_id:str):
    x=_service.get(evidence_id)
    if not x: raise HTTPException(status_code=404,detail="evidence_not_found")
    return x

@router.get("/{evidence_id}/verify")
def verify(evidence_id:str):
    try: return _service.verify(evidence_id)
    except ValueError: raise HTTPException(status_code=404,detail="evidence_not_found")

@router.get("")
def list_evidence(analysis_id:Optional[str]=None):
    return {"evidence":_service.list(analysis_id)}
