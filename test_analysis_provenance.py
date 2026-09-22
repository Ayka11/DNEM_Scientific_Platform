import tempfile, os
from app.services.persistence import Persistence
from app.research.experimental_workspace import ExperimentalWorkspace
from app.research.analysis_provenance import AnalysisProvenance

with tempfile.TemporaryDirectory() as d:
    db=os.path.join(d,"dn.sqlite3")
    ws=ExperimentalWorkspace(db)
    trials=[]
    for i in range(12):
        trials.append({"trial_id":f"t{i}","session_id":"S1","measurement_id":"FI-01","stimulus_onset":i,"response":"A","response_time":500+i,"correct":1 if i<9 else 0,"valid":True})
    ws.register_dataset("REAL-DATASET-001", trials, "EXTERNAL_EXPERIMENTAL", {"source":"test"})
    ap=AnalysisProvenance(db)
    r=ap.run("REAL-DATASET-001","AN-000001","FI-01")
    assert r["provenance_status"]=="PERSISTED_IMMUTABLE_RECORD"
    assert r["dataset_hash"]
    assert ap.verify("AN-000001")["valid"]
    assert len(ap.list("REAL-DATASET-001"))==1
    try: ap.run("REAL-DATASET-001","AN-000001","FI-01")
    except ValueError as e: assert str(e)=="analysis_id_exists"
    else: raise AssertionError("duplicate analysis_id accepted")
print("ANALYSIS_PROVENANCE_TEST_PASS")
