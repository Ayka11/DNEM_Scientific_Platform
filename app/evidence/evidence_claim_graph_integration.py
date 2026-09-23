"""
DNEM Evidence -> Claim Graph Integration v1.0

Builds a provenance graph from persisted, hash-verified evidence linked to an
analysis. The graph is descriptive governance infrastructure; graph support
does not itself establish scientific validity.
"""
from __future__ import annotations
from typing import Any, Dict, List
from app.services.persistence import Persistence
from app.research.analysis_provenance import AnalysisProvenance
from app.research.scientific_evidence_registry import ScientificEvidenceRegistry
from app.evidence.claim_graph_v2 import ClaimEvidenceGraphV2

class EvidenceClaimGraphIntegration:
    VERSION="1.0"
    def __init__(self,db_path="data/dnem.sqlite3"):
        self.persistence=Persistence(db_path)
        self.provenance=AnalysisProvenance(db_path)
        self.evidence=ScientificEvidenceRegistry(db_path)

    def build(self, analysis_id:str, claim_id:str, study_id:str|None=None)->Dict[str,Any]:
        analysis=self.provenance.get(analysis_id)
        if not analysis: raise ValueError("analysis_not_found")
        if not self.provenance.verify(analysis_id)["valid"]:
            raise ValueError("analysis_integrity_failed")
        evidence_rows=self.evidence.list(analysis_id)
        verified=[]
        for e in evidence_rows:
            if self.evidence.verify(e["evidence_id"])["valid"]:
                verified.append(e)
            else:
                raise ValueError("evidence_integrity_failed")
        g=ClaimEvidenceGraphV2()
        g.add_node(study_id or "study_"+analysis_id,"Study")
        g.add_node(analysis_id,"Analysis",payload={
            "analysis_hash":analysis["analysis_hash"],
            "dataset_id":analysis["dataset_id"],
            "dataset_hash":analysis["dataset_hash"],
        })
        g.add_node(claim_id,"Claim")
        g.add_edge(study_id or "study_"+analysis_id,analysis_id,"TESTS")
        g.add_edge(analysis_id,claim_id,"TESTS")
        for e in verified:
            eid=e["evidence_id"]
            g.add_node(eid,"Evidence",payload={
                "analysis_id":e["analysis_id"],
                "analysis_hash":e["analysis_hash"],
                "dataset_hash":e["dataset_hash"],
                "evidence_hash":e["evidence_hash"],
                "status":e["status"],
            })
            g.add_edge(analysis_id,eid,"DERIVED_FROM",evidence_id=eid)
            relation="CONTRADICTS" if e["status"].upper() in {"CONTRADICTED","BLOCKED"} else "SUPPORTS"
            g.add_edge(eid,claim_id,relation,evidence_id=eid)
        exported=g.export()
        exported.update({
            "integration_version":self.VERSION,
            "analysis_id":analysis_id,
            "claim_id":claim_id,
            "verified_evidence_count":len(verified),
            "scientific_boundary":{
                "graph_is_descriptive":True,
                "graph_support_is_not_validation":True,
                "claim_validated_authorized":False,
            }
        })
        return exported
