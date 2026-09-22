from fastapi import APIRouter
from app.services.persistence import Persistence
from app.services.research_runtime import ResearchRuntime
from app.validation.gate_engine import ValidationGateEngine
from app.validation.psychometrics_engine import PsychometricValidationEngine
from app.validation.replication_engine import ReplicationGeneralizationEngine
from app.validation.invariance_engine import InvarianceEngine
from app.validation.scientific_orchestrator import ScientificValidationOrchestrator
from app.measurements.registry import REGISTRY
from app.measurements.specification_registry import list_specifications, validate_specification

router = APIRouter(prefix="/api/v1/research", tags=["research"])
db = Persistence()
runtime = ResearchRuntime()

@router.post("/compile-run")
def compile_run(payload: dict):
    mids = payload.get("measurement_ids") or list(REGISTRY.keys())[:3]
    trials = int(payload.get("trials_per_measurement", 10))
    output = runtime.compile_and_run(mids, trials)
    return {
        "protocol": output["protocol"],
        "trial_count": len(output["trials"]),
        "results": output["results"],
        "profile": output["profile"]
    }

@router.get("/results/{session_id}")
def results(session_id: str):
    return {"session_id": session_id, "results": db.list_results(session_id)}

@router.get("/specifications")
def specifications():
    return {"count": len(list_specifications()), "items": list_specifications()}

@router.get("/specifications/{measurement_id}/validate")
def specification_validate(measurement_id: str):
    ok, errors = validate_specification(measurement_id)
    return {"measurement_id": measurement_id, "valid": ok, "errors": errors}


@router.post("/profile")
def profile(payload: dict):
    mids = payload.get("measurement_ids") or list(REGISTRY.keys())[:5]
    trials = int(payload.get("trials_per_measurement", 10))
    output = runtime.compile_and_run(mids, trials)
    return output["profile"]

@router.post("/validation/gates")
def validation_gates(payload: dict):
    return ValidationGateEngine().evaluate(payload)

@router.post("/validation/psychometrics")
def psychometric_evidence(payload: dict):
    return PsychometricValidationEngine().build_evidence(payload)

@router.post("/validation/replication")
def replication_evidence(payload: dict):
    return ReplicationGeneralizationEngine().build_evidence(payload)

@router.post("/validation/invariance-screen")
def invariance_screen(payload: dict):
    return InvarianceEngine().build_evidence(payload)

@router.post("/validation/orchestrate")
def scientific_validation(payload: dict):
    dataset=payload.get("dataset",{})
    explicit=payload.get("explicit_evidence")
    return ScientificValidationOrchestrator().run(dataset, explicit)
