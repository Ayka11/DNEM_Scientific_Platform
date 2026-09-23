from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Any, Dict, List, Optional

from app.research.dataset_ingestion import DatasetIngestion

router = APIRouter(prefix="/api/v1/dataset-ingestion", tags=["dataset-ingestion"])
service = DatasetIngestion()

class IngestionRequest(BaseModel):
    dataset_id: str
    trials: List[Dict[str, Any]] = Field(min_length=1)
    source_type: str
    source_uri: Optional[str] = None
    acquisition_metadata: Optional[Dict[str, Any]] = None
    protocol_id: Optional[str] = None

@router.post("/validate")
def validate(req: IngestionRequest):
    return service.validate_dataset(req.trials)

@router.post("/register")
def register(req: IngestionRequest):
    try:
        return service.register(**req.model_dump())
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
