from fastapi import APIRouter,HTTPException
from pydantic import BaseModel
from app.governance.scientific_audit_snapshot import ScientificAuditSnapshot

router=APIRouter(prefix="/api/v1/audit-snapshot",tags=["scientific-audit-snapshot"])
_service=ScientificAuditSnapshot()

class SnapshotRequest(BaseModel):
    dataset_id:str
    analysis_id:str
    claim_id:str

@router.post("/build")
def build(req:SnapshotRequest):
    try:return _service.build(**req.model_dump())
    except ValueError as e:
        msg=str(e);code=404 if msg in {"dataset_not_found","analysis_not_found"} else 422
        raise HTTPException(status_code=code,detail=msg)
