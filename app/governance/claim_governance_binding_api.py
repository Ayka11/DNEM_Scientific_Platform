from fastapi import APIRouter,HTTPException
from pydantic import BaseModel
from typing import Optional
from app.governance.claim_governance_binding import ClaimGovernanceBinding

router=APIRouter(prefix="/api/v1/claim-binding",tags=["claim-binding"])
_service=ClaimGovernanceBinding()

class BindRequest(BaseModel):
    analysis_id:str
    claim_id:str
    statement:str
    current_status:str="CANDIDATE"
    study_id:Optional[str]=None

@router.post("/bind")
def bind(req:BindRequest):
    try:return _service.bind(**req.model_dump())
    except ValueError as e:
        msg=str(e); code=404 if msg=="analysis_not_found" else 409 if msg in {"analysis_integrity_failed","binding_cannot_authorize_validated"} else 422
        raise HTTPException(status_code=code,detail=msg)
