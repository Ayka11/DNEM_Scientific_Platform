import os,tempfile
from app.research.experimental_workspace import ExperimentalWorkspace
from app.research.analysis_provenance import AnalysisProvenance
from app.research.scientific_evidence_registry import ScientificEvidenceRegistry
from app.governance.claim_governance_binding import ClaimGovernanceBinding

db=os.path.join(tempfile.mkdtemp(),"dn.sqlite3")
trials=[{"trial_id":f"T{i}","session_id":"S","measurement_id":"C01-01","stimulus_onset":float(i),
"response":"A","valid":True,"response_time":500,"correct":1} for i in range(6)]
ExperimentalWorkspace(db).register_dataset("DS-CL-001",trials,"EXTERNAL_EXPERIMENTAL",{"source":"external"})
AnalysisProvenance(db).run("DS-CL-001","AN-CL-000001")
ScientificEvidenceRegistry(db).register("EVID-CL-000001","AN-CL-000001",
{"type":"independent_replication","passed":True})
out=ClaimGovernanceBinding(db).bind("AN-CL-000001","CL-000001","Test claim")
assert out["claim"]["binding"]["graph_hash"]
assert out["claim"]["status"]=="CANDIDATE"
assert out["scientific_boundary"]["validated_status_authorized"] is False
try:
    ClaimGovernanceBinding(db).bind("AN-CL-000001","CL-000002","Test","VALIDATED")
    raise AssertionError("VALIDATED binding unexpectedly accepted")
except ValueError as e:
    assert str(e)=="binding_cannot_authorize_validated"
print("CLAIM_GOVERNANCE_BINDING_TEST_PASS",out["graph_state"]["state"],out["claim"]["binding_hash"][:12])
