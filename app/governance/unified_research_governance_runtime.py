"""
DNEM Unified Research Governance Runtime v1.1
End-to-end orchestration:
Study -> Dataset -> Analysis -> Integrity -> Evidence -> Claim -> Decision
-> Ledger -> Model Revision -> New Research Cycle
"""
from __future__ import annotations
from datetime import datetime, timezone
from hashlib import sha256
import json
from typing import Any, Dict, List, Optional

from app.governance.research_governance_runtime import ResearchGovernanceRuntime
from app.governance.model_revision_engine import ModelRevisionEngine


class UnifiedResearchGovernanceRuntime:
    VERSION="1.1"

    def __init__(self, governance_runtime=None, revision_engine=None):
        self.governance=governance_runtime or ResearchGovernanceRuntime()
        self.revisions=revision_engine or ModelRevisionEngine()

    def execute(self, request: Dict[str,Any]) -> Dict[str,Any]:
        # Existing governance runtime remains the authority for evidence readiness.
        governance_result=self.governance.execute(request)
        decision=governance_result["decision"]

        revision=None
        revision_request=request.get("model_revision")
        if revision_request:
            revision=self.revisions.create_revision(
                revision_request["model_id"],
                decision=decision,
                evidence_graph=request.get("evidence_graph") or {},
                revision_reason=revision_request["revision_reason"],
                changes=revision_request["changes"],
                parent_model_id=revision_request.get("parent_model_id"),
            )

        result={
            "runtime_version":self.VERSION,
            "timestamp":datetime.now(timezone.utc).isoformat(),
            "study_id":request.get("study_id"),
            "dataset_id":request.get("dataset_id"),
            "analysis_id":request["analysis_id"],
            "claim_id":request["claim_id"],
            "governance":governance_result,
            "model_revision":revision,
            "cycle_relation":"NEW_RESEARCH_CYCLE" if revision else "NO_MODEL_REVISION",
        }
        result["cycle_hash"]=sha256(
            json.dumps(result,sort_keys=True,separators=(",",":"),ensure_ascii=False).encode()
        ).hexdigest()
        return result
