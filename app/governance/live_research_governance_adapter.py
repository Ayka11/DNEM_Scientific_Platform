"""
DNEM Live Research Governance Adapter v1.0
Converts actual Research Runtime outputs into governance-ready inputs.
No synthetic evidence is promoted to scientific validity.
"""
from __future__ import annotations
from typing import Any, Dict, List
from app.services.results_pipeline import ResultsPipeline

class LiveResearchGovernanceAdapter:
    VERSION="1.0"

    def __init__(self):
        self.pipeline=ResultsPipeline()

    def prepare(self, trials: List[Dict[str,Any]], *,
                analysis_id: str, claim_id: str,
                preregistration: Dict[str,Any]|None=None,
                exclusion_governance: Dict[str,Any]|None=None,
                multiplicity: Dict[str,Any]|None=None,
                sensitivity_robustness: Dict[str,Any]|None=None,
                validation_gates: Dict[str,Any]|None=None,
                evidence_graph: Dict[str,Any]|None=None,
                claim_governance: Dict[str,Any]|None=None) -> Dict[str,Any]:
        measurement_results=self.pipeline.aggregate_trials(trials)
        # Preserve session linkage explicitly at the governance boundary.
        session_ids=sorted({t.get("session_id") for t in trials if t.get("session_id")})
        for mr in measurement_results:
            if len(session_ids)==1:
                mr["session_id"]=session_ids[0]
        profile=self.pipeline.build_domain_profile(measurement_results)
        return {
            "analysis_id":analysis_id,
            "claim_id":claim_id,
            "measurement_results":measurement_results,
            "domain_profile":profile,
            "governance_inputs":{
                "preregistration":preregistration,
                "exclusion_governance":exclusion_governance,
                "multiplicity":multiplicity,
                "sensitivity_robustness":sensitivity_robustness,
                "validation_gates":validation_gates,
                "evidence_graph":evidence_graph,
                "claim_governance":claim_governance,
            },
            "scientific_boundary":{
                "construct_estimates_authorized":False,
                "clinical_inference_authorized":False,
                "synthetic_demo_results_are_not_validation":True,
            },
            "version":self.VERSION,
        }
