import os,tempfile
from app.research.experimental_workspace import ExperimentalWorkspace
from app.research.analysis_provenance import AnalysisProvenance
from app.research.scientific_evidence_registry import ScientificEvidenceRegistry
from app.governance.scientific_decision_ledger_binding import ScientificDecisionLedgerBinding

db=os.path.join(tempfile.mkdtemp(),"dn.sqlite3")
ledger=os.path.join(tempfile.mkdtemp(),"ledger.sqlite")
trials=[{"trial_id":f"T{i}","session_id":"S","measurement_id":"C01-01","stimulus_onset":float(i),
"response":"A","valid":True,"response_time":500,"correct":1} for i in range(6)]
ExperimentalWorkspace(db).register_dataset("DS-DL-001",trials,"EXTERNAL_EXPERIMENTAL",{"source":"external"})
AnalysisProvenance(db).run("DS-DL-001","AN-DL-000001")
ScientificEvidenceRegistry(db).register("EVID-DL-000001","AN-DL-000001",
{"type":"independent_replication","passed":True})
out=ScientificDecisionLedgerBinding(db,ledger).execute({
 "analysis_id":"AN-DL-000001","claim_id":"CL-DL-000001",
 "integrity":{"readiness":"BLOCKED"},
 "claim_governance":{"state":"CANDIDATE"}
})
assert out["decision"]=="BLOCKED"
assert out["ledger_record"]["decision_id"]=="DEC-000001"
assert out["scientific_boundary"]["validated_status_issued"] is False
print("SCIENTIFIC_DECISION_LEDGER_BINDING_TEST_PASS",out["decision"],out["ledger_record"]["decision_id"],out["binding_hash"][:12])
