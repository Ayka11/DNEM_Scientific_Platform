"""
DNEM Scientific Decision -> Ledger Binding v1.0

Binds a scientific decision to verified Analysis provenance, Evidence/Claim
Graph provenance and Claim Governance. Appends only the resulting decision to
the existing hash-linked ledger. VALIDATED is never synthesized here.
"""
from __future__ import annotations
from typing import Any, Dict
from hashlib import sha256
import json
from app.research.analysis_provenance import AnalysisProvenance
from app.evidence.evidence_claim_graph_integration import EvidenceClaimGraphIntegration
from app.governance.scientific_decision_pipeline import ScientificDecisionPipeline
from app.governance.scientific_decision_ledger import ScientificDecisionLedger

class ScientificDecisionLedgerBinding:
    VERSION="1.0"
    def __init__(self, db_path="data/dnem.sqlite3", ledger_path="dnem_scientific_ledger.sqlite"):
        self.provenance=AnalysisProvenance(db_path)
        self.graph=EvidenceClaimGraphIntegration(db_path)
        self.pipeline=ScientificDecisionPipeline()
        self.ledger=ScientificDecisionLedger(ledger_path)

    @staticmethod
    def _hash(x):
        return sha256(json.dumps(x,sort_keys=True,separators=(",",":"),ensure_ascii=False).encode()).hexdigest()

    def execute(self, request: Dict[str,Any])->Dict[str,Any]:
        analysis_id=request["analysis_id"]; claim_id=request["claim_id"]
        analysis=self.provenance.get(analysis_id)
        if not analysis: raise ValueError("analysis_not_found")
        if not self.provenance.verify(analysis_id)["valid"]:
            raise ValueError("analysis_integrity_failed")
        if request.get("dataset_id") and request["dataset_id"]!=analysis["dataset_id"]:
            raise ValueError("dataset_analysis_mismatch")
        graph=self.graph.build(analysis_id,claim_id,request.get("study_id"))
        supplied_graph=request.get("evidence_graph")
        if supplied_graph and supplied_graph.get("graph_hash") and supplied_graph["graph_hash"]!=graph["graph_hash"]:
            raise ValueError("evidence_graph_mismatch")
        evidence_graph=supplied_graph or {
            "governance_state": "SUPPORTED_BY_GRAPH" if graph.get("verified_evidence_count",0)>0 else "UNSUPPORTED",
            "graph_hash":graph["graph_hash"],
            "evidence_refs":[n["node_id"] for n in graph["nodes"] if n["node_type"]=="Evidence"],
        }
        result=self.pipeline.run(
            analysis_id,claim_id,
            integrity=request.get("integrity") or {},
            evidence_graph=evidence_graph,
            claim_governance=request.get("claim_governance") or {},
            ledger_context=request.get("ledger_context") or {},
        )
        result["binding"]={
            "binding_version":self.VERSION,
            "analysis_hash":analysis["analysis_hash"],
            "dataset_id":analysis["dataset_id"],
            "dataset_hash":analysis["dataset_hash"],
            "graph_hash":graph["graph_hash"],
        }
        result["binding_hash"]=self._hash(result["binding"])
        ledger_record=self.ledger.append(result)
        result["ledger_record"]=ledger_record
        result["scientific_boundary"]={
            "provenance_verified":True,
            "decision_recorded":True,
            "validated_status_issued":False,
            "ledger_is_audit_record_not_validation":True,
        }
        return result
