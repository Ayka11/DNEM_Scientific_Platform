"""
DNEM Scientific Evidence Registration v1.0

Evidence is registered only from explicitly supplied research evidence.
Analysis results provide provenance, not automatic scientific support.
"""
from __future__ import annotations
import hashlib, json, time
from app.services.persistence import Persistence
from app.research.analysis_provenance import AnalysisProvenance

class ScientificEvidenceRegistry:
    VERSION="1.0"
    def __init__(self, db_path="data/dnem.sqlite3"):
        self.persistence=Persistence(db_path)
        self.provenance=AnalysisProvenance(db_path)

    @staticmethod
    def _hash(payload):
        return hashlib.sha256(json.dumps(payload,sort_keys=True,separators=(",",":"),ensure_ascii=False).encode()).hexdigest()

    def register(self, evidence_id, analysis_id, evidence, status="REGISTERED"):
        if self.persistence.get_evidence(evidence_id):
            raise ValueError("evidence_id_exists")
        analysis=self.provenance.get(analysis_id)
        if not analysis:
            raise ValueError("analysis_not_found")
        verification=self.provenance.verify(analysis_id)
        if not verification["valid"]:
            raise ValueError("analysis_integrity_failed")
        if not isinstance(evidence,dict) or not evidence:
            raise ValueError("evidence_payload_required")
        record={
            "evidence_id":evidence_id,
            "analysis_id":analysis_id,
            "dataset_id":analysis["dataset_id"],
            "dataset_hash":analysis["dataset_hash"],
            "analysis_hash":analysis["analysis_hash"],
            "evidence":evidence,
            "status":status,
            "registry_version":self.VERSION,
            "created_at":time.time(),
        }
        record["evidence_hash"]=self._hash(record)
        self.persistence.save_evidence(record)
        return record

    def get(self,evidence_id):
        return self.persistence.get_evidence(evidence_id)

    def list(self,analysis_id=None):
        return self.persistence.list_evidence(analysis_id)

    def verify(self,evidence_id):
        record=self.get(evidence_id)
        if not record: raise ValueError("evidence_not_found")
        stored=record["evidence_hash"]
        core=dict(record); core.pop("evidence_hash",None)
        return {"evidence_id":evidence_id,"valid":stored==self._hash(core),
                "stored_hash":stored,"computed_hash":self._hash(core),
                "analysis_id":record["analysis_id"],"analysis_hash":record["analysis_hash"]}
