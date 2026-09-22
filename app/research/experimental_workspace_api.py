from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Any, Dict, List, Optional
from app.research.experimental_workspace import ExperimentalWorkspace

router=APIRouter(prefix="/api/v1/experimental-workspace",tags=["experimental-workspace"])
service=ExperimentalWorkspace()

class DatasetRequest(BaseModel):
    dataset_id:str
    trials:List[Dict[str,Any]]=Field(min_length=1)
    source_type:str="EXTERNAL_EXPERIMENTAL"
    source_uri:Optional[str]=None
    acquisition_metadata:Optional[Dict[str,Any]]=None
    protocol_id:Optional[str]=None

@router.post("/datasets")
def register_dataset(req:DatasetRequest):
    try:
        return service.register_dataset(**req.model_dump())
    except ValueError as e:
        raise HTTPException(status_code=409 if "already exists" in str(e) else 422,
                            detail=str(e))

@router.get("/datasets/{dataset_id}")
def get_dataset(dataset_id:str):
    result=service.get_dataset(dataset_id)
    if not result:
        raise HTTPException(status_code=404,detail="dataset_not_found")
    return result

@router.get("/datasets")
def list_datasets():
    return {"count":len(service.list_datasets()),"items":service.list_datasets()}
