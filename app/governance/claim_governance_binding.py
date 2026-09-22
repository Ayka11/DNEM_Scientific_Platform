"""
DNEM Claim Governance Binding v1.0

Binds a claim to a verified Analysis provenance record and a verified
Evidence->Claim graph. This layer does not invent evidence and does not
authorize VALIDATED; final validation remains an independent governance state.
"""
from __future__ import annotations
import hashlib,json,time
from app.research.analysis_provenance import AnalysisProvenance
from app.evidence.evidence_claim_graph_integration import EvidenceClaimGraphIntegration
from app.governance.claim_governance import ClaimGovernanceEngine

class ClaimGovernanceBinding:
    VERSION="1.0"
    def __init__(self,db_path="data/dnem.sqlite3"):
        self.provenance=AnalysisProvenance(db_path)
        self.graph=EvidenceClaimGraphIntegration(db_path)
        self.claims=ClaimGovernanceEngine()

    @staticmethod
    def _hash(x):
        return hashlib.sha256(json.dumps(x,sort_keys=True,separators=(",",":"),ensure_ascii=False).encode()).hexdigest()

    def bind(self, analysis_id, claim_id, statement, current_status="CANDIDATE", study_id=None):
        analysis=self.provenance.get(analysis_id)
        if not analysis: raise ValueError("analysis_not_found")
        if not self.provenance.verify(analysis_id)["valid"]:
            raise ValueError("analysis_integrity_failed")
        graph=self.graph.build(analysis_id,claim_id,study_id)
        state=self._claim_graph_state(graph,claim_id)
        evidence_refs=[n["node_id"] for n in graph["nodes"] if n["node_type"]=="Evidence"]
        if current_status=="VALIDATED":
            raise ValueError("binding_cannot_authorize_validated")
        record=self.claims.create(claim_id,statement,evidence_refs)
        record["status"]=current_status
        record["binding"]={
            "binding_version":self.VERSION,
            "analysis_id":analysis_id,
            "analysis_hash":analysis["analysis_hash"],
            "dataset_id":analysis["dataset_id"],
            "dataset_hash":analysis["dataset_hash"],
            "graph_hash":graph["graph_hash"],
            "graph_state":state["state"],
            "evidence_refs":evidence_refs,
            "bound_at":time.time(),
        }
        record["binding_hash"]=self._hash(record["binding"])
        return {"claim":record,"graph_state":state,"scientific_boundary":{
            "validated_status_authorized":False,
            "binding_is_provenance_not_validation":True,
        }}

    @staticmethod
    def _claim_graph_state(graph,claim_id):
        # Reconstruct graph object to use canonical governance logic.
        from app.evidence.claim_graph_v2 import ClaimEvidenceGraphV2,Node,Edge
        g=ClaimEvidenceGraphV2()
        for n in graph["nodes"]: g.add_node(n["node_id"],n["node_type"],n.get("status","active"),n.get("payload"))
        for e in graph["edges"]: g.add_edge(e["source"],e["target"],e["relation"],e.get("evidence_id"))
        return g.claim_state(claim_id)
