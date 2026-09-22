from fastapi import APIRouter
from pydantic import BaseModel
from typing import Any, Dict, Optional
from app.governance.scientific_audit_console import ScientificAuditConsole

router=APIRouter(prefix="/api/v1/audit-console",tags=["scientific-audit-console"])
_engine=ScientificAuditConsole()

class ConsoleRequest(BaseModel):
    integrity:Dict[str,Any]
    decision:Dict[str,Any]
    ledger:Dict[str,Any]
    evidence_graph:Dict[str,Any]
    claim:Dict[str,Any]
    model_revision:Optional[Dict[str,Any]]=None

@router.post("/snapshot")
def snapshot(req:ConsoleRequest):
    return _engine.build(**req.model_dump())
