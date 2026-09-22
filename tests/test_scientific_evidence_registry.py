import os,tempfile
from app.research.experimental_workspace import ExperimentalWorkspace
from app.research.analysis_provenance import AnalysisProvenance
from app.research.scientific_evidence_registry import ScientificEvidenceRegistry

db=os.path.join(tempfile.mkdtemp(),"dn.sqlite3")
ws=ExperimentalWorkspace(db)
trials=[{"trial_id":f"T{i}","session_id":"S","measurement_id":"C01-01",
"stimulus_onset":float(i),"response":"A","valid":True,"response_time":500,"correct":1} for i in range(6)]
ws.register_dataset("DS-EV-001",trials,"EXTERNAL_EXPERIMENTAL",{"source":"external"})
AnalysisProvenance(db).run("DS-EV-001","AN-EV-000001")
reg=ScientificEvidenceRegistry(db)
r=reg.register("EVID-000001","AN-EV-000001",
               {"type":"independent_validation","source":"research_record","passed":True})
assert reg.verify("EVID-000001")["valid"]
assert r["dataset_id"]=="DS-EV-001"
assert r["analysis_hash"]
print("SCIENTIFIC_EVIDENCE_REGISTRY_TEST_PASS",r["evidence_id"],r["analysis_id"])
