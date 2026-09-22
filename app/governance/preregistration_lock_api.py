from fastapi import APIRouter,HTTPException
from pydantic import BaseModel
from typing import Any,Dict,List,Optional
from app.governance.preregistration_lock_integration import PreregistrationLockIntegration

router=APIRouter(prefix="/api/v1/preregistration-lock",tags=["preregistration-lock"])
svc=PreregistrationLockIntegration()

class Draft(BaseModel):
    protocol_id:str
    protocol_version:str
    nonce:Optional[str]=None

class Amendment(BaseModel):
    new_protocol_version:str
    amendments:List[Dict[str,Any]]
    new_protocol_id:Optional[str]=None
    cycle_id:Optional[str]=None
    revision_id:Optional[str]=None

@router.post("/draft")
def draft(r:Draft):
    try:return svc.create_draft(r.model_dump())
    except ValueError as e: raise HTTPException(status_code=404 if "not_found" in str(e) else 422,detail=str(e))

@router.post("/{prereg_id}/lock")
def lock(prereg_id:str):
    try:return svc.lock(prereg_id)
    except ValueError as e: raise HTTPException(status_code=404 if "not_found" in str(e) else 409,detail=str(e))

@router.post("/{prereg_id}/amend")
def amend(prereg_id:str,r:Amendment):
    try:return svc.amend(prereg_id,r.model_dump())
    except ValueError as e:
        code=404 if "not_found" in str(e) else 409 if "only_locked" in str(e) else 422
        raise HTTPException(status_code=code,detail=str(e))

@router.get("/{prereg_id}")
def get_prereg(prereg_id:str):
    p=svc.get(prereg_id)
    if not p: raise HTTPException(status_code=404,detail="preregistration_not_found")
    return p
