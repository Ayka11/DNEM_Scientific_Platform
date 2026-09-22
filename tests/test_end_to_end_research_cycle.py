import os,tempfile
from app.research.experimental_workspace import ExperimentalWorkspace
from app.research.end_to_end_research_cycle import EndToEndResearchCycle

db=os.path.join(tempfile.mkdtemp(),"dn.sqlite3")
ledger=os.path.join(tempfile.mkdtemp(),"ledger.sqlite")
trials=[{"trial_id":f"T{i}","session_id":"S","measurement_id":"C01-01","stimulus_onset":float(i),
"response":"A","valid":True,"response_time":500,"correct":1} for i in range(6)]
ExperimentalWorkspace(db).register_dataset("DS-E2E-001",trials,"EXTERNAL_EXPERIMENTAL",{"source":"external"})
out=EndToEndResearchCycle(db,ledger).execute({
 "dataset_id":"DS-E2E-001","analysis_id":"AN-E2E-000001","claim_id":"CL-E2E-000001",
 "evidence":[{"evidence_id":"EVID-E2E-000001",
              "evidence":{"type":"independent_replication","passed":True}}],
 "integrity":{"readiness":"BLOCKED"},
 "claim_governance":{"state":"CANDIDATE"}
})
assert out["analysis"]["analysis_hash"]
assert out["graph"]["verified_evidence_count"]==1
assert out["decision"]["ledger_record"]["decision_id"]=="DEC-000001"
assert out["scientific_boundary"]["validated_status_issued"] is False
assert out["cycle_hash"]
print("END_TO_END_RESEARCH_CYCLE_TEST_PASS",out["decision"]["decision"],out["graph"]["graph_hash"][:12],out["cycle_hash"][:12])
