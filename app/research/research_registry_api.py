from fastapi import APIRouter
from app.research.research_registry import ResearchRegistry

router=APIRouter(prefix="/api/v1/research-registry",tags=["research-registry"])
registry=ResearchRegistry()

@router.post("/register")
def register(payload:dict):
    return registry.register(payload["research_id"],payload["object_type"],
                             payload["name"],payload.get("status","DRAFT"),
                             payload.get("parent_id",""))

@router.post("/version")
def version(payload:dict):
    return registry.version(payload["research_id"],payload.get("name"),
                            payload.get("status"))

@router.get("/verify/{research_id}")
def verify(research_id:str):
    return registry.verify(research_id)

@router.get("/lineage/{research_id}")
def lineage(research_id:str):
    return {"research_id":research_id,"lineage":registry.lineage(research_id)}
