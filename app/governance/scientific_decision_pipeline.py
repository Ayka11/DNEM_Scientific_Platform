"""
DNEM Scientific Decision & Claim Pipeline v1.0
Executable chain:
Analysis Integrity -> Evidence Graph -> Claim Governance -> Scientific Ledger
Conservative: never upgrades a claim to VALIDATED automatically.
"""
from __future__ import annotations
import json
from hashlib import sha256
from datetime import datetime, timezone
from typing import Any, Dict, List


class ScientificDecisionPipeline:
    VERSION = "1.0"

    def run(
        self,
        analysis_id: str,
        claim_id: str,
        *,
        integrity: Dict[str, Any],
        evidence_graph: Dict[str, Any],
        claim_governance: Dict[str, Any],
        ledger_context: Dict[str, Any] | None = None,
    ) -> Dict[str, Any]:
        blockers: List[str] = []
        warnings: List[str] = []
        transitions: List[str] = []

        readiness = integrity.get("readiness")
        graph_state = str(
            evidence_graph.get("governance_state",
            evidence_graph.get("state", ""))
        ).upper()
        claim_state = str(claim_governance.get("state", "CANDIDATE")).upper()

        if readiness == "BLOCKED":
            blockers.append("Analysis integrity is BLOCKED.")
        elif readiness == "EXPLORATORY":
            warnings.append("Analysis remains exploratory.")
        elif readiness == "CONDITIONAL":
            warnings.append("Analysis integrity is conditional.")

        if graph_state == "BLOCKED":
            blockers.append("Evidence graph blocks the claim.")
        elif graph_state not in {"SUPPORTED_BY_GRAPH", "SUPPORTED_EDGE_ONLY"}:
            blockers.append("Evidence graph does not provide support.")

        if claim_state == "BLOCKED":
            blockers.append("Claim governance state is BLOCKED.")
        if claim_state == "CONTRADICTED":
            blockers.append("Claim is marked CONTRADICTED.")
        if claim_state == "REVISED":
            warnings.append("Claim has been revised; predecessor lineage must be retained.")

        # VALIDATED is never issued by this pipeline.
        if blockers:
            decision = "BLOCKED"
            permitted = ["CANDIDATE"]
        elif readiness == "READY_FOR_EVIDENCE_CONSIDERATION" and graph_state in {
            "SUPPORTED_BY_GRAPH", "SUPPORTED_EDGE_ONLY"
        }:
            decision = "EVIDENCE_CONSIDERATION_READY"
            permitted = ["CANDIDATE", "SUPPORTED", "CONDITIONAL"]
            warnings.append("Final VALIDATED status requires independent validation and governance.")
        elif readiness in {"CONDITIONAL", "EXPLORATORY"}:
            decision = "CONDITIONAL_REVIEW"
            permitted = ["CANDIDATE", "SUPPORTED", "CONDITIONAL"]
        else:
            decision = "REVIEW_REQUIRED"
            permitted = ["CANDIDATE"]

        if claim_state != "CANDIDATE" and decision == "EVIDENCE_CONSIDERATION_READY":
            transitions.append(f"RETAIN_{claim_state}")
        else:
            transitions.append("RETAIN_CURRENT_GOVERNANCE_STATE")

        payload = {
            "pipeline_version": self.VERSION,
            "analysis_id": analysis_id,
            "claim_id": claim_id,
            "decision": decision,
            "permitted_claim_states": permitted,
            "blockers": blockers,
            "warnings": warnings,
            "transitions": transitions,
            "source_states": {
                "integrity_readiness": readiness,
                "evidence_graph": graph_state,
                "claim_governance": claim_state,
            },
            "ledger_context": ledger_context or {},
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
        payload["decision_hash"] = sha256(
            json.dumps(payload, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode()
        ).hexdigest()
        return payload
