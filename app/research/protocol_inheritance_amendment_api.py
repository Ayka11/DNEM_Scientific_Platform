from fastapi import APIRouter,HTTPException
from pydantic import BaseModel
from typing import Any,Dict,List,Optional
from app.research.protocol_inheritance_amendment_engine import ProtocolInheritanceAmendmentEngine

router=APIRouter(prefix="/api/v1/protocol-lineage",tags=["protocol-lineage"])
svc=ProtocolInheritanceAmendmentEngine()

class BaseProtocol(BaseModel):
    protocol_id:str
    version:str
    definition:Dict[str,Any]
    cycle_id:Optional[str]=None

class Amendment(BaseModel):
    path:str
    new_value:Any
    reason:Optional[str]=None

class ProtocolAmendment(BaseModel):
    source_protocol_id:str
    source_version:str
    new_version:str
    new_protocol_id:Optional[str]=None
    amendments:List[Amendment]
    cycle_id:Optional[str]=None
    revision_id:Optional[str]=None

@router.post("/register")
def register(r:BaseProtocol):
    try:return svc.register_base(r.model_dump())
    except ValueError as e: raise HTTPException(status_code=409 if "exists" in str(e) else 422,detail=str(e))

@router.post("/amend")
def amend(r:ProtocolAmendment):
    try:return svc.amend(r.model_dump())
    except ValueError as e:
        code=404 if "not_found" in str(e) else 409 if "exists" in str(e) else 422
        raise HTTPException(status_code=code,detail=str(e))

@router.get("/{protocol_id}/{version}")
def get_protocol(protocol_id:str,version:str):
    p=svc.get(protocol_id,version)
    if not p: raise HTTPException(status_code=404,detail="protocol_not_found")
    return p

@router.get("/{protocol_id}/{version}/verify")
def verify(protocol_id:str,version:str):
    try:return svc.verify(protocol_id,version)
    except ValueError as e: raise HTTPException(status_code=404,detail=str(e))

@router.get("/{protocol_id}/lineage")
def lineage(protocol_id:str): return {"protocol_id":protocol_id,"versions":svc.lineage(protocol_id)}
