from fastapi import FastAPI
from app.measurements.registry import list_measurements, get_measurement
from app.services.study_service import StudyService
from app.services.runtime_service import RuntimeService
from app.services.results_service import ResultsService
from app.measurements.registry import REGISTRY

app = FastAPI(title="DNEM Scientific Platform", version="7.7")
study_service = StudyService(REGISTRY)
runtime_service = RuntimeService()
results_service = ResultsService()

@app.get("/api/v1/health")
def health():
    return {"status":"ok","version":"v7.7","scientific_status":"implementation_baseline"}

@app.get("/api/v1/measurements")
def measurements():
    return {"count": len(REGISTRY), "items": list_measurements()}

@app.get("/api/v1/measurements/{measurement_id}")
def measurement(measurement_id: str):
    item = get_measurement(measurement_id)
    if not item:
        return {"error":"not_found"}
    return item

@app.post("/api/v1/studies")
def create_study(payload: dict):
    return study_service.create(payload.get("title","DNEM Demo Study"),
                                 payload.get("measurement_ids"),
                                 payload.get("seed",20260922)).__dict__

@app.post("/api/v1/studies/{study_id}/freeze")
def freeze(study_id: str):
    return study_service.freeze(study_id).__dict__

@app.post("/api/v1/studies/{study_id}/sessions")
def session(study_id: str, payload: dict):
    s = runtime_service.start(study_id, payload.get("participant_id","demo"), payload.get("seed",20260922))
    return {"session_id":s.session_id,"state":s.runtime.state}

@app.post("/api/v1/sessions/{session_id}/demo-run")
def demo_run(session_id: str):
    s = runtime_service.run_demo(session_id)
    return {"session_id":s.session_id,"state":s.runtime.state,"events":s.bus.events}

@app.get("/api/v1/demo-result")
def demo_result():
    return results_service.demo_result("demo_session","FI-01")

from app.api.research_api import router as research_router
from app.evidence.claim_graph_api import router as evidence_router
from app.governance.claim_governance_api import router as governance_router
from app.governance.scientific_audit_api import router as audit_router
from app.research.research_registry_api import router as registry_router
from app.research.preregistration_api import router as prereg_router
from app.research.blinding_data_lock_api import router as data_governance_router
from app.research.exclusion_governance_api import router as exclusion_router
from app.research.statistical_plan_executor_api import router as analysis_plan_router
from app.research.multiplicity_governance_api import router as multiplicity_router
from app.research.effect_uncertainty_api import router as effect_router
from app.research.sensitivity_robustness_api import router as robustness_router
from app.research.analysis_integrity_api import router as analysis_integrity_router
from app.governance.scientific_decision_pipeline_api import router as scientific_decision_router
from app.governance.scientific_decision_ledger_api import router as scientific_ledger_router
from app.governance.research_governance_runtime_api import router as research_governance_router
from app.governance.model_revision_api import router as model_revision_router
from app.governance.unified_research_governance_api import router as unified_governance_router
from app.governance.scientific_audit_console_api import router as audit_console_router
from app.governance.scientific_audit_gradio_api import router as audit_gradio_router
from app.governance.live_research_governance_api import router as live_governance_router
from app.governance.session_governance_api import router as session_governance_router
from app.governance.persisted_session_governance_api import router as persisted_governance_router
from app.research.dataset_ingestion_api import router as dataset_ingestion_router
from app.research.experimental_workspace_api import router as experimental_workspace_router
from app.research.dataset_analysis_pipeline_api import router as dataset_analysis_router
from app.research.analysis_provenance_api import router as analysis_provenance_router
from app.research.scientific_evidence_registry_api import router as evidence_registry_router
from app.evidence.evidence_claim_graph_integration_api import router as evidence_graph_integration_router
from app.governance.claim_governance_binding_api import router as claim_binding_router
from app.governance.scientific_decision_ledger_binding_api import router as decision_ledger_binding_router
from app.research.end_to_end_research_cycle_api import router as research_cycle_router
from app.governance.scientific_audit_snapshot_api import router as audit_snapshot_router
from app.governance.model_revision_lineage_api import router as model_revision_lineage_router
from app.research.research_cycle_successor_api import router as research_cycle_successor_router
from app.research.protocol_inheritance_amendment_api import router as protocol_lineage_router
from app.governance.preregistration_lock_api import router as preregistration_lock_router
from app.governance.analysis_governance_bridge_api import router as analysis_governance_router
app.include_router(research_router)
app.include_router(evidence_router)
app.include_router(governance_router)
app.include_router(audit_router)
app.include_router(registry_router)
app.include_router(prereg_router)
app.include_router(data_governance_router)
app.include_router(exclusion_router)
app.include_router(analysis_plan_router)
app.include_router(multiplicity_router)
app.include_router(effect_router)
app.include_router(robustness_router)
app.include_router(analysis_integrity_router)
app.include_router(scientific_decision_router)
app.include_router(scientific_ledger_router)
app.include_router(research_governance_router)
app.include_router(model_revision_router)
app.include_router(unified_governance_router)
app.include_router(audit_console_router)
app.include_router(audit_gradio_router)
app.include_router(live_governance_router)
app.include_router(session_governance_router)
app.include_router(persisted_governance_router)

app.include_router(dataset_ingestion_router)

app.include_router(experimental_workspace_router)

app.include_router(dataset_analysis_router)
app.include_router(analysis_provenance_router)
app.include_router(evidence_registry_router)
app.include_router(evidence_graph_integration_router)
app.include_router(claim_binding_router)
app.include_router(decision_ledger_binding_router)
app.include_router(research_cycle_router)
app.include_router(audit_snapshot_router)
app.include_router(analysis_governance_router)

app.include_router(model_revision_lineage_router)

app.include_router(research_cycle_successor_router)

app.include_router(protocol_lineage_router)

app.include_router(preregistration_lock_router)
