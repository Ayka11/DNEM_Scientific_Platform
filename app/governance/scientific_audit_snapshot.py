"""
DNEM Scientific Audit Snapshot v2.0

Read-only, hash-verifying snapshot over the persisted end-to-end research
cycle. It checks Dataset, Analysis, Evidence, Graph, Decision Ledger and
returns a single reproducibility status. It does not infer scientific truth.
"""
from __future__ import annotations
from typing import Any,Dict,List
import hashlib,json
from app.services.persistence import Persistence
from app.research.analysis_provenance import AnalysisProvenance
from app.research.scientific_evidence_registry import ScientificEvidenceRegistry
from app.evidence.evidence_claim_graph_integration import EvidenceClaimGraphIntegration
from app.governance.scientific_decision_ledger import ScientificDecisionLedger

class ScientificAuditSnapshot:
    VERSION="2.0"
    def __init__(self,db_path="data/dnem.sqlite3",ledger_path="dnem_scientific_ledger.sqlite"):
        self.persistence=Persistence(db_path)
        self.analysis=AnalysisProvenance(db_path)
        self.evidence=ScientificEvidenceRegistry(db_path)
        self.graph=EvidenceClaimGraphIntegration(db_path)
        self.ledger=ScientificDecisionLedger(ledger_path)

    @staticmethod
    def _hash(x):
        return hashlib.sha256(json.dumps(x,sort_keys=True,separators=(",",":"),ensure_ascii=False).encode()).hexdigest()

    def build(self,dataset_id,analysis_id,claim_id):
        m=self.persistence.get_dataset_manifest(dataset_id)
        if not m: raise ValueError("dataset_not_found")
        a=self.analysis.get(analysis_id)
        if not a: raise ValueError("analysis_not_found")
        checks=[];errors=[]
        dataset_ok=bool(m.get("dataset_hash"))
        checks.append({"component":"dataset_manifest","valid":dataset_ok,"hash":m.get("dataset_hash")})
        av=self.analysis.verify(analysis_id)
        checks.append({"component":"analysis","valid":av["valid"],"hash":a.get("analysis_hash")})
        if not av["valid"]: errors.append("analysis_hash_invalid")
        ev=self.evidence.list(analysis_id)
        evidence_checks=[]
        for e in ev:
            v=self.evidence.verify(e["evidence_id"])
            evidence_checks.append(v)
            if not v["valid"]: errors.append("evidence_hash_invalid:"+e["evidence_id"])
        graph=self.graph.build(analysis_id,claim_id)
        ledger=self.ledger.verify()
        if not ledger["valid"]: errors.extend(ledger["errors"])
        lineage={
            "dataset_id":dataset_id,"dataset_hash":m.get("dataset_hash"),
            "analysis_id":analysis_id,"analysis_hash":a.get("analysis_hash"),
            "evidence_ids":[e["evidence_id"] for e in ev],
            "evidence_hashes":[e["evidence_hash"] for e in ev],
            "graph_hash":graph["graph_hash"],
            "ledger_head_hash":ledger["head_hash"],
        }
        reproducible=not errors and all(x["valid"] for x in evidence_checks)
        snapshot={
            "snapshot_version":self.VERSION,
            "reproducibility_status":"INTEGRITY_VERIFIED" if reproducible else "INTEGRITY_ERROR",
            "lineage":lineage,
            "checks":checks,
            "evidence_checks":evidence_checks,
            "graph":{"graph_hash":graph["graph_hash"],"verified_evidence_count":graph["verified_evidence_count"]},
            "ledger":{"valid":ledger["valid"],"records":ledger["records"],"head_hash":ledger["head_hash"]},
            "errors":errors,
            "scientific_boundary":{
                "read_only":True,
                "integrity_check_not_scientific_validation":True,
                "validated_status_issued":False,
            }
        }
        snapshot["snapshot_hash"]=self._hash(snapshot)
        return snapshot
