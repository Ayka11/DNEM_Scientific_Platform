import os,tempfile
from app.research.experimental_workspace import ExperimentalWorkspace
from app.research.analysis_provenance import AnalysisProvenance
from app.research.scientific_evidence_registry import ScientificEvidenceRegistry
from app.evidence.evidence_claim_graph_integration import EvidenceClaimGraphIntegration

db=os.path.join(tempfile.mkdtemp(),"dn.sqlite3")
ws=ExperimentalWorkspace(db)
trials=[{"trial_id":f"T{i}","session_id":"S","measurement_id":"C01-01",
"stimulus_onset":float(i),"response":"A","valid":True,"response_time":500,"correct":1} for i in range(6)]
ws.register_dataset("DS-GRAPH-001",trials,"EXTERNAL_EXPERIMENTAL",{"source":"external"})
AnalysisProvenance(db).run("DS-GRAPH-001","AN-GRAPH-000001")
reg=ScientificEvidenceRegistry(db)
reg.register("EVID-G-000001","AN-GRAPH-000001",{"type":"independent_replication","passed":True})
out=EvidenceClaimGraphIntegration(db).build("AN-GRAPH-000001","CL-GRAPH-000001")
assert out["verified_evidence_count"]==1
assert out["scientific_boundary"]["claim_validated_authorized"] is False
assert out["graph_hash"]
print("EVIDENCE_CLAIM_GRAPH_INTEGRATION_TEST_PASS",
      out["verified_evidence_count"],out["graph_hash"][:12])
