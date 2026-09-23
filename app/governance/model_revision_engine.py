"""
DNEM Model Revision & Lineage Engine v1.0
Registers explicit model revisions without mutating prior scientific records.
"""
from __future__ import annotations
import json
from datetime import datetime, timezone
from hashlib import sha256
from typing import Any, Dict, List


class ModelRevisionEngine:
    VERSION="1.0"

    def create_revision(
        self,
        model_id: str,
        *,
        decision: Dict[str,Any],
        evidence_graph: Dict[str,Any],
        revision_reason: str,
        changes: List[Dict[str,Any]],
        parent_model_id: str|None=None,
    ) -> Dict[str,Any]:
        # A decision does not itself authorize a revision. Explicit reason and changes are required.
        if not revision_reason.strip():
            raise ValueError("revision_reason is required")
        if not changes:
            raise ValueError("At least one explicit model change is required")

        decision_type=str(decision.get("decision",""))
        relation="REVISES"
        evidence_state=str(evidence_graph.get("governance_state",
                                              evidence_graph.get("state",""))).upper()

        record={
            "model_id":model_id,
            "parent_model_id":parent_model_id,
            "revision_reason":revision_reason,
            "changes":changes,
            "relation":relation,
            "decision":decision_type,
            "evidence_state":evidence_state,
            "source_analysis_id":decision.get("analysis_id"),
            "source_claim_id":decision.get("claim_id"),
            "created_at":datetime.now(timezone.utc).isoformat(),
            "version":self.VERSION,
        }
        record["revision_id"]=f"REV-{sha256(json.dumps(record,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode()).hexdigest()[:12].upper()}"
        record["revision_hash"]=sha256(json.dumps(record,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode()).hexdigest()
        return record
