"""
DNEM Scientific Audit Console v1.0
Read-only aggregation of governance state for UI/API inspection.
"""
from __future__ import annotations
from typing import Any, Dict, List

class ScientificAuditConsole:
    VERSION="1.0"

    def build(self, *,
              integrity: Dict[str,Any],
              decision: Dict[str,Any],
              ledger: Dict[str,Any],
              evidence_graph: Dict[str,Any],
              claim: Dict[str,Any],
              model_revision: Dict[str,Any]|None=None) -> Dict[str,Any]:
        blockers=[]
        blockers.extend(integrity.get("blockers",[]))
        blockers.extend(decision.get("blockers",[]))
        if not ledger.get("valid",False):
            blockers.append("Scientific decision ledger integrity check failed.")
        graph_state=evidence_graph.get("governance_state",evidence_graph.get("state","UNKNOWN"))
        claim_state=claim.get("state","UNKNOWN")
        return {
            "console_version":self.VERSION,
            "status":"BLOCKED" if blockers else decision.get("decision","REVIEW_REQUIRED"),
            "analysis_integrity":{
                "readiness":integrity.get("readiness"),
                "score":integrity.get("integrity_score"),
                "satisfied":integrity.get("satisfied_controls",[]),
                "unsatisfied":integrity.get("unsatisfied_controls",[]),
            },
            "evidence":{
                "governance_state":graph_state
            },
            "claim":{
                "state":claim_state,
                "permitted_states":decision.get("permitted_claim_states",[])
            },
            "decision":{
                "type":decision.get("decision"),
                "warnings":decision.get("warnings",[]),
                "blockers":decision.get("blockers",[])
            },
            "ledger":{
                "valid":ledger.get("valid"),
                "records":ledger.get("records"),
                "head_hash":ledger.get("head_hash")
            },
            "model_revision":{
                "present":model_revision is not None,
                "revision_id":model_revision.get("revision_id") if model_revision else None,
                "relation":model_revision.get("relation") if model_revision else None,
            },
            "blocking_reasons":blockers
        }
