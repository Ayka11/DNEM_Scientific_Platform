from dataclasses import dataclass, asdict
from datetime import datetime, timezone
import hashlib, json

@dataclass
class AuditRecord:
    audit_id:str
    experiment_id:str
    dataset_hash:str
    software_version:str
    analysis_hash:str
    evidence_hash:str
    claim_hash:str
    governance_status:str
    created_at:str
    manifest_hash:str=""

class ScientificAuditEngine:
    """
    Reproducibility/audit manifest layer.

    It records provenance; it does not independently establish scientific validity.
    """

    @staticmethod
    def canonical_hash(payload):
        raw=json.dumps(payload,sort_keys=True,separators=(",",":")).encode()
        return hashlib.sha256(raw).hexdigest()

    def build(self, payload):
        experiment_id=payload["experiment_id"]
        dataset_hash=payload.get("dataset_hash") or self.canonical_hash(
            payload.get("dataset",{}))
        analysis_hash=payload.get("analysis_hash") or self.canonical_hash(
            payload.get("analysis",{}))
        evidence_hash=payload.get("evidence_hash") or self.canonical_hash(
            payload.get("evidence",{}))
        claim_hash=payload.get("claim_hash") or self.canonical_hash(
            payload.get("claim",{}))

        core={
            "audit_id":payload.get("audit_id",f"audit_{experiment_id}"),
            "experiment_id":experiment_id,
            "dataset_hash":dataset_hash,
            "software_version":payload.get("software_version","unknown"),
            "analysis_hash":analysis_hash,
            "evidence_hash":evidence_hash,
            "claim_hash":claim_hash,
            "governance_status":payload.get("governance_status","UNRESOLVED"),
            "created_at":payload.get(
                "created_at",datetime.now(timezone.utc).isoformat()
            )
        }
        core["manifest_hash"]=self.canonical_hash(core)
        return core

    def verify(self, manifest):
        core={k:manifest[k] for k in (
            "audit_id","experiment_id","dataset_hash","software_version",
            "analysis_hash","evidence_hash","claim_hash",
            "governance_status","created_at"
        )}
        expected=self.canonical_hash(core)
        return {
            "valid":expected==manifest.get("manifest_hash"),
            "expected_hash":expected,
            "observed_hash":manifest.get("manifest_hash")
        }

    def chain_hash(self, manifests):
        normalized=sorted(
            [m["manifest_hash"] for m in manifests]
        )
        return self.canonical_hash({"manifest_hashes":normalized})
