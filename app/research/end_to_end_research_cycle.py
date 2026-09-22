"""
DNEM End-to-End Scientific Research Cycle v1.0

Coordinates the already separated scientific layers without bypassing gates:
Dataset -> Analysis -> Evidence -> Graph -> Claim -> Decision -> Ledger.
External data must already be registered. Evidence is explicitly supplied and
never inferred from analysis output.
"""
from __future__ import annotations
from typing import Any, Dict, List
from app.services.persistence import Persistence
from app.research.analysis_provenance import AnalysisProvenance
from app.research.scientific_evidence_registry import ScientificEvidenceRegistry
from app.evidence.evidence_claim_graph_integration import EvidenceClaimGraphIntegration
from app.governance.scientific_decision_ledger_binding import ScientificDecisionLedgerBinding

class EndToEndResearchCycle:
    VERSION="1.0"
    def __init__(self,db_path="data/dnem.sqlite3",ledger_path="dnem_scientific_ledger.sqlite"):
        self.persistence=Persistence(db_path)
        self.analysis=AnalysisProvenance(db_path)
        self.evidence=ScientificEvidenceRegistry(db_path)
        self.graph=EvidenceClaimGraphIntegration(db_path)
        self.decision=ScientificDecisionLedgerBinding(db_path,ledger_path)

    def execute(self, request:Dict[str,Any])->Dict[str,Any]:
        dataset_id=request["dataset_id"]
        analysis_id=request["analysis_id"]
        claim_id=request["claim_id"]
        manifest=self.persistence.get_dataset_manifest(dataset_id)
        if not manifest: raise ValueError("dataset_not_found")
        # Analysis is persisted exactly once; existing immutable analysis may be reused.
        analysis=self.analysis.get(analysis_id)
        if analysis is None:
            self.analysis.run(dataset_id,analysis_id,request.get("measurement_id"),
                              request.get("validation_by_domain"))
            analysis=self.analysis.get(analysis_id)
        if analysis["dataset_id"]!=dataset_id:
            raise ValueError("dataset_analysis_mismatch")
        # Evidence must be explicit. Each item is bound to the verified analysis.
        registered=[]
        for item in request.get("evidence",[]):
            eid=item["evidence_id"]
            if self.evidence.get(eid):
                registered.append(self.evidence.get(eid))
            else:
                registered.append(self.evidence.register(
                    eid,analysis_id,item["evidence"],item.get("status","REGISTERED")))
        graph=self.graph.build(analysis_id,claim_id,request.get("study_id"))
        decision_request=dict(request)
        decision_request["analysis_id"]=analysis_id
        decision_request["claim_id"]=claim_id
        decision_request["dataset_id"]=dataset_id
        decision_request["evidence_graph"]={
            "governance_state":"SUPPORTED_BY_GRAPH" if registered else "UNSUPPORTED",
            "graph_hash":graph["graph_hash"],
            "evidence_refs":[x["evidence_id"] for x in registered],
        }
        decision=self.decision.execute(decision_request)
        result={
            "cycle_version":self.VERSION,
            "dataset":{"dataset_id":dataset_id,"dataset_hash":manifest["dataset_hash"],
                       "source_type":manifest["source_type"]},
            "analysis":{"analysis_id":analysis_id,"analysis_hash":analysis["analysis_hash"]},
            "evidence":{"count":len(registered),
                        "evidence_ids":[x["evidence_id"] for x in registered]},
            "graph":{"graph_hash":graph["graph_hash"],
                     "verified_evidence_count":graph["verified_evidence_count"]},
            "claim":{"claim_id":claim_id},
            "decision":decision,
            "scientific_boundary":{
                "external_dataset_preserved":True,
                "analysis_provenance_verified":True,
                "evidence_explicit_only":True,
                "validated_status_issued":False,
            },
        }
        import hashlib,json
        result["cycle_hash"]=hashlib.sha256(json.dumps(result,sort_keys=True,
            separators=(",",":"),ensure_ascii=False).encode()).hexdigest()
        return result
