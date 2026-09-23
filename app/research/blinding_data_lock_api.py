from fastapi import APIRouter
from app.research.blinding_data_lock import BlindingDataLockEngine

router=APIRouter(prefix="/api/v1/data-governance",tags=["data-governance"])
engine=BlindingDataLockEngine()

@router.post("/register")
def register(payload:dict):
    return engine.register(payload["dataset_id"],payload.get("data",{}),
                            payload.get("metadata",{}),payload.get("blinded",True))

@router.post("/lock")
def lock(payload:dict):
    return engine.lock(payload["dataset_id"])

@router.post("/unlock")
def unlock(payload:dict):
    return engine.unlock(payload["dataset_id"],payload["reason"],
                         payload.get("authorized",True))

@router.post("/unblind")
def unblind(payload:dict):
    return engine.register_unblinding(payload["dataset_id"],payload["reason"])

@router.get("/verify/{dataset_id}")
def verify(dataset_id:str):
    return engine.verify(dataset_id)
