import os,tempfile
from app.research.experimental_workspace import ExperimentalWorkspace
from app.research.end_to_end_research_cycle import EndToEndResearchCycle
from app.governance.scientific_audit_snapshot import ScientificAuditSnapshot

db=os.path.join(tempfile.mkdtemp(),"dn.sqlite3"); ledger=os.path.join(tempfile.mkdtemp(),"ledger.sqlite")
trials=[{"trial_id":f"T{i}","session_id":"S","measurement_id":"C01-01","stimulus_onset":float(i),
"response":"A","valid":True,"response_time":500,"correct":1} for i in range(6)]
ExperimentalWorkspace(db).register_dataset("DS-AUD-001",trials,"EXTERNAL_EXPERIMENTAL",{"source":"external"})
EndToEndResearchCycle(db,ledger).execute({
 "dataset_id":"DS-AUD-001","analysis_id":"AN-AUD-000001","claim_id":"CL-AUD-000001",
 "evidence":[{"evidence_id":"EVID-AUD-000001","evidence":{"type":"replication","passed":True}}],
 "integrity":{"readiness":"BLOCKED"},"claim_governance":{"state":"CANDIDATE"}
})
s=ScientificAuditSnapshot(db,ledger).build("DS-AUD-001","AN-AUD-000001","CL-AUD-000001")
assert s["reproducibility_status"]=="INTEGRITY_VERIFIED"
assert s["lineage"]["analysis_hash"]
assert s["lineage"]["graph_hash"]
assert s["lineage"]["ledger_head_hash"]
assert s["scientific_boundary"]["validated_status_issued"] is False
print("SCIENTIFIC_AUDIT_SNAPSHOT_TEST_PASS",s["reproducibility_status"],s["snapshot_hash"][:12])
