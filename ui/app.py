import gradio as gr
from ui.research_ui import research
from app.measurements.registry import list_measurements
from app.services.study_service import StudyService
from app.services.runtime_service import RuntimeService
from app.services.results_service import ResultsService
from app.measurements.registry import REGISTRY
from app.governance.scientific_audit_console import ScientificAuditConsole

studies = StudyService(REGISTRY)
runtime = RuntimeService()
results = ResultsService()

def measurement_table():
    return [[x["measurement_id"], x["level"], x["domain"], x["scientific_status"],
             x["implementation_maturity"]] for x in list_measurements()]

def create_demo(title):
    s = studies.create(title or "DNEM Demo Study")
    return {"study_id":s.study_id,"status":s.status,"measurement_ids":s.measurement_ids}

def execute_governance_demo():
    from app.governance.unified_research_governance_runtime import UnifiedResearchGovernanceRuntime
    from app.governance.scientific_decision_ledger import ScientificDecisionLedger
    from app.governance.research_governance_runtime import ResearchGovernanceRuntime
    from app.governance.model_revision_engine import ModelRevisionEngine
    import tempfile, os
    fd, path = tempfile.mkstemp(suffix=".sqlite")
    os.close(fd)
    runtime = UnifiedResearchGovernanceRuntime(
        ResearchGovernanceRuntime(ScientificDecisionLedger(path)),
        ModelRevisionEngine()
    )
    request = {
        "study_id":"UI-DEMO-STUDY",
        "dataset_id":"UI-DEMO-DATASET",
        "analysis_id":"UI-DEMO-ANALYSIS",
        "claim_id":"UI-DEMO-CLAIM",
        "preregistration":{"status":"LOCKED"},
        "exclusion_governance":{"post_hoc_unregistered":False},
        "multiplicity":{"unregistered_tests":0},
        "effect_uncertainty":{"effect":0.40,"ci":[0.10,0.70]},
        "sensitivity_robustness":{"status":"OK"},
        "validation_gates":{"status":"VALIDATED"},
        "evidence_graph":{"governance_state":"SUPPORTED_BY_GRAPH"},
        "claim_governance":{"state":"CANDIDATE"},
        "model_revision":{
            "model_id":"DNEM-UI-MODEL-001",
            "parent_model_id":"DNEM-UI-MODEL-000",
            "revision_reason":"Demonstration of explicit evidence-linked model revision.",
            "changes":[{"component":"demo_model_mapping","action":"UPDATE"}]
        }
    }
    result=runtime.execute(request)
    try:
        os.remove(path)
    except OSError:
        pass
    return result

def governance_snapshot_json():
    return execute_governance_demo()


def render_governance(snapshot):
    import json
    snapshot=snapshot or {}
    return (
        snapshot.get("status","UNKNOWN"),
        snapshot.get("analysis_integrity",{}).get("score",0),
        snapshot.get("analysis_integrity",{}).get("readiness",""),
        snapshot.get("evidence",{}).get("governance_state",""),
        snapshot.get("claim",{}).get("state",""),
        snapshot.get("decision",{}).get("type",""),
        "\n".join(snapshot.get("blocking_reasons",[])) or "None",
        f"valid={snapshot.get('ledger',{}).get('valid')}; records={snapshot.get('ledger',{}).get('records')}",
        snapshot.get("model_revision",{}).get("revision_id") or "None",
    )

def run_session_governance(study_json):
    import json
    from app.governance.session_governance_api import runtime_service
    from app.governance.session_governance_api import adapter, governance
    s=json.loads(study_json)
    session=runtime_service.start(s["study_id"],"demo_participant")
    runtime_service.run_demo(session.session_id)
    trials=runtime_service.generate_demo_trials(session.session_id,"C01-01",20)
    prepared=adapter.prepare(trials,analysis_id="UI-SESSION-ANALYSIS",claim_id="UI-SESSION-CLAIM")
    result=governance.execute({
        "study_id":s["study_id"],"dataset_id":f"SESSION-{session.session_id}",
        "analysis_id":"UI-SESSION-ANALYSIS","claim_id":"UI-SESSION-CLAIM",
        "preregistration":None,"exclusion_governance":None,"multiplicity":None,
        "effect_uncertainty":None,"sensitivity_robustness":None,
        "validation_gates":None,"evidence_graph":None,"claim_governance":None})
    result["session_id"]=session.session_id
    result["measurement_results"]=prepared["measurement_results"]
    result["domain_profile"]=prepared["domain_profile"]
    return json.dumps(result,indent=2,ensure_ascii=False)


def run_persisted_full_governance(study_json):
    import json, tempfile, os
    from app.services.persistent_research_runtime import PersistentResearchRuntime
    from app.governance.persisted_session_governance import PersistedSessionGovernance
    from app.governance.scientific_decision_ledger import ScientificDecisionLedger
    from app.governance.research_governance_runtime import ResearchGovernanceRuntime
    from app.governance.model_revision_engine import ModelRevisionEngine
    from app.governance.unified_research_governance_runtime import UnifiedResearchGovernanceRuntime

    s = json.loads(study_json)
    session_id = f"UI-PERSISTED-{s['study_id']}"
    fd, path = tempfile.mkstemp(suffix=".sqlite")
    os.close(fd)
    try:
        persisted_runtime = PersistentResearchRuntime(path)
        persisted_runtime.run_session(session_id, ["C01-01"], trials_per_measurement=12)

        unified = UnifiedResearchGovernanceRuntime(
            ResearchGovernanceRuntime(ScientificDecisionLedger(path)),
            ModelRevisionEngine()
        )
        service = PersistedSessionGovernance(path, unified)
        result = service.execute(
            session_id=session_id,
            study_id=s["study_id"],
            dataset_id=f"DATASET-{session_id}",
            analysis_id="UI-PERSISTED-ANALYSIS",
            claim_id="UI-PERSISTED-CLAIM",
            measurement_id="C01-01",
            preregistration={"status":"LOCKED"},
            exclusion_governance={"post_hoc_unregistered":False},
            multiplicity={"unregistered_tests":0},
            effect_uncertainty={"effect":0.40,"ci":[0.10,0.70]},
            sensitivity_robustness={"status":"OK"},
            validation_gates={"status":"VALIDATED"},
            evidence_graph={"governance_state":"SUPPORTED_BY_GRAPH"},
            claim_governance={"state":"CANDIDATE"},
            model_revision={
                "model_id":"DNEM-UI-PERSISTED-MODEL-001",
                "parent_model_id":"DNEM-UI-PERSISTED-MODEL-000",
                "revision_reason":"Evidence-linked revision in persisted-session integration test.",
                "changes":[{"component":"persisted_runtime_mapping","action":"UPDATE"}]
            }
        )
        return json.dumps(result, indent=2, ensure_ascii=False)
    finally:
        try:
            os.remove(path)
        except OSError:
            pass

def run_demo(study_json):
    import json
    s = json.loads(study_json)
    sess = runtime.start(s["study_id"], "demo_participant")
    done = runtime.run_demo(sess.session_id)
    return json.dumps({"session_id":done.session_id,"state":done.runtime.state,
                       "events":done.bus.events}, indent=2)

with gr.Blocks(title="DNEM Scientific Platform v7.7") as demo:
    gr.Markdown("# DNEM Scientific Platform v7.7")
    gr.Markdown("**Executable implementation baseline — not scientifically validated.**")
    with gr.Tab("Study Builder"):
        title = gr.Textbox(label="Study title", value="DNEM Demo Study")
        create = gr.Button("Create demo study")
        study = gr.JSON(label="Study")
        create.click(create_demo, title, study)
        run = gr.Button("Run synthetic demo session")
        runtime_out = gr.Code(label="Runtime event log", language="json")
        run.click(lambda x: run_demo(__import__("json").dumps(x)), study, runtime_out)
    with gr.Tab("Measurement Registry"):
        gr.Dataframe(headers=["ID","Level","Domain","Status","Maturity"],
                     value=measurement_table(), interactive=False)
    with gr.Tab("Research Runtime"):
        gr.Markdown("Use the deterministic runtime to compile and execute selected measurement families.")
        gr.Markdown("Open the dedicated runtime interface below:")
        gr.Markdown("The same runtime is exposed through `/api/v1/research/compile-run`.")
        gov_session_btn = gr.Button("Run current session through Scientific Governance")
        gov_session_out = gr.Code(label="Session Governance Result", language="json")
        gov_session_btn.click(run_session_governance, study, gov_session_out)

        gr.Markdown("### Persisted Session → Full Scientific Governance")
        gr.Markdown(
            "Runs the deterministic research runtime, persists its trial records, "
            "then sends those persisted records through the full Unified Governance pipeline. "
            "Persisted synthetic records are not empirical validation data."
        )
        persisted_gov_btn = gr.Button("Run persisted session through Full Governance")
        persisted_gov_out = gr.Code(label="Persisted Full Governance Result", language="json")
        persisted_gov_btn.click(run_persisted_full_governance, study, persisted_gov_out)
    with gr.Tab("Scientific Governance"):
        gr.Markdown("## Scientific Governance / Audit")
        gr.Markdown("Read-only governance view. It does not infer VALIDATED status.")
        gov_refresh = gr.Button("Refresh governance snapshot")
        gov_status = gr.Textbox(label="Governance status", interactive=False)
        gov_score = gr.Number(label="Integrity score", interactive=False)
        gov_readiness = gr.Textbox(label="Analysis readiness", interactive=False)
        gov_evidence = gr.Textbox(label="Evidence Graph", interactive=False)
        gov_claim = gr.Textbox(label="Claim state", interactive=False)
        gov_decision = gr.Textbox(label="Scientific decision", interactive=False)
        gov_blockers = gr.Textbox(label="Blocking reasons", lines=4, interactive=False)
        gov_ledger = gr.Textbox(label="Ledger integrity", interactive=False)
        gov_revision = gr.Textbox(label="Model revision", interactive=False)

        gov_outputs=[gov_status,gov_score,gov_readiness,gov_evidence,gov_claim,
                     gov_decision,gov_blockers,gov_ledger,gov_revision]
        gov_refresh.click(lambda: render_governance(execute_governance_demo()),
                         outputs=gov_outputs)

    with gr.Tab("Scientific Boundary"):
        gr.Markdown(
            "The scaffold implements data contracts, runtime orchestration, registry, "
            "results/evidence interfaces and tests. It does **not** establish reliability, "
            "validity, causal inference, norms, or clinical/scientific conclusions."
        )

if __name__ == "__main__":
    demo.launch()
