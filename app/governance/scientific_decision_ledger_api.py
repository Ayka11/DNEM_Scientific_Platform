from fastapi import APIRouter
from pydantic import BaseModel
from typing import Any, Dict
from app.governance.scientific_decision_ledger import ScientificDecisionLedger

router=APIRouter(prefix="/api/v1/scientific-ledger",tags=["scientific-ledger"])
ledger=ScientificDecisionLedger()

class AppendRequest(BaseModel):
    pipeline_result: Dict[str,Any]

@router.post("/append")
def append(req:AppendRequest):
    return ledger.append(req.pipeline_result)

@router.get("/records")
def records():
    return {"records":ledger.list_records()}

@router.get("/verify")
def verify():
    return ledger.verify()
