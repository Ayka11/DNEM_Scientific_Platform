from dataclasses import dataclass, asdict
from enum import Enum
from typing import Optional
import hashlib, json

class ClaimLifecycle(str, Enum):
    CANDIDATE="CANDIDATE"
    SUPPORTED="SUPPORTED"
    CONDITIONAL="CONDITIONAL"
    VALIDATED="VALIDATED"
    CONTRADICTED="CONTRADICTED"
    REVISED="REVISED"
    BLOCKED="BLOCKED"

ALLOWED_TRANSITIONS={
    ClaimLifecycle.CANDIDATE:{ClaimLifecycle.SUPPORTED,ClaimLifecycle.CONDITIONAL,ClaimLifecycle.BLOCKED},
    ClaimLifecycle.SUPPORTED:{ClaimLifecycle.CONDITIONAL,ClaimLifecycle.VALIDATED,ClaimLifecycle.CONTRADICTED,ClaimLifecycle.REVISED,ClaimLifecycle.BLOCKED},
    ClaimLifecycle.CONDITIONAL:{ClaimLifecycle.SUPPORTED,ClaimLifecycle.VALIDATED,ClaimLifecycle.CONTRADICTED,ClaimLifecycle.REVISED,ClaimLifecycle.BLOCKED},
    ClaimLifecycle.VALIDATED:{ClaimLifecycle.CONTRADICTED,ClaimLifecycle.REVISED,ClaimLifecycle.BLOCKED},
    ClaimLifecycle.CONTRADICTED:{ClaimLifecycle.REVISED,ClaimLifecycle.BLOCKED},
    ClaimLifecycle.REVISED:{ClaimLifecycle.CANDIDATE,ClaimLifecycle.SUPPORTED,ClaimLifecycle.CONDITIONAL,ClaimLifecycle.BLOCKED},
    ClaimLifecycle.BLOCKED:{ClaimLifecycle.REVISED,ClaimLifecycle.CANDIDATE},
}

@dataclass
class ClaimRecord:
    claim_id:str
    statement:str
    status:str=ClaimLifecycle.CANDIDATE.value
    version:int=1
    predecessor:Optional[str]=None
    evidence_refs:list=None
    rationale:str=""
    provenance_hash:str=""

class ClaimGovernanceEngine:
    def _hash(self, record):
        d=asdict(record);d["provenance_hash"]=""
        return hashlib.sha256(json.dumps(d,sort_keys=True,separators=(",",":")).encode()).hexdigest()

    def create(self, claim_id, statement, evidence_refs=None):
        r=ClaimRecord(claim_id,statement,evidence_refs=evidence_refs or [])
        r.provenance_hash=self._hash(r)
        return asdict(r)

    def transition(self, record, new_status, rationale="", evidence_refs=None,
                   predecessor=None):
        old=ClaimLifecycle(record["status"])
        new=ClaimLifecycle(new_status)
        if new not in ALLOWED_TRANSITIONS[old]:
            raise ValueError(f"Invalid transition: {old.value} -> {new.value}")

        # Scientific governance rule: VALIDATED requires explicit evidence.
        refs=evidence_refs if evidence_refs is not None else record.get("evidence_refs",[])
        if new==ClaimLifecycle.VALIDATED and not refs:
            raise ValueError("VALIDATED requires explicit evidence_refs")

        out=dict(record)
        out["status"]=new.value
        out["version"]=int(record.get("version",1))+1
        out["rationale"]=rationale
        out["evidence_refs"]=refs
        out["predecessor"]=predecessor or record["claim_id"]
        out["provenance_hash"]=self._hash(ClaimRecord(**out))
        return out

    def evaluate(self, validation_status, graph_state, evidence_refs):
        if graph_state=="BLOCKED":
            return ClaimLifecycle.BLOCKED.value
        if validation_status=="VALIDATED" and graph_state=="SUPPORTED_BY_GRAPH" and evidence_refs:
            return ClaimLifecycle.VALIDATED.value
        if graph_state=="SUPPORTED_BY_GRAPH":
            return ClaimLifecycle.SUPPORTED.value
        if validation_status=="CONDITIONAL":
            return ClaimLifecycle.CONDITIONAL.value
        return ClaimLifecycle.CANDIDATE.value
