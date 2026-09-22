import os, tempfile
from app.research.experimental_workspace import ExperimentalWorkspace
from app.research.analysis_provenance import AnalysisProvenance
from app.governance.analysis_governance_bridge import AnalysisGovernanceBridge

db=os.path.join(tempfile.mkdtemp(),"dn.sqlite3")
ws=ExperimentalWorkspace(db)
trials=[]
for i in range(8):
    trials.append({
        "trial_id":f"T-{i+1}","session_id":"S-EXT","measurement_id":"C01-01",
        "stimulus_onset":float(i),"response":"A","valid":True,
        "response_time":500+i*5,"correct":1
    })
ws.register_dataset("EXT-ANALYSIS-001",trials,"EXTERNAL_EXPERIMENTAL",
                    {"source":"test","operator":"researcher"})
prov=AnalysisProvenance(db)
analysis=prov.run("EXT-ANALYSIS-001","AN-000001")
assert prov.verify("AN-000001")["valid"]
bridge=AnalysisGovernanceBridge(db)
# No evidence is fabricated; missing explicit governance evidence must remain conservative.
result=bridge.execute({
    "analysis_id":"AN-000001","claim_id":"CL-000001",
    "preregistration":{},"exclusion_governance":{},"multiplicity":{},
    "effect_uncertainty":{},"sensitivity_robustness":{},"validation_gates":{},
    "evidence_graph":{},"claim_governance":{}
})
assert result["analysis_provenance"]["integrity_verified"] is True
assert result["scientific_boundary"]["validated_status_issued_by_bridge"] is False
print("ANALYSIS_GOVERNANCE_BRIDGE_TEST_PASS",
      result["governance"]["decision"])
