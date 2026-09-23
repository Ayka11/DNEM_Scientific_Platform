"""
DNEM Analysis Integrity & Claim-Readiness Engine v1.0

Combines preregistration, exclusion governance, multiplicity, effect-size,
robustness, validation gates, and evidence-graph state into a conservative
readiness assessment. This is a governance layer, not a statistical validator.
"""
from __future__ import annotations
import json
from dataclasses import dataclass, asdict
from enum import Enum
from hashlib import sha256
from typing import Any, Dict, List, Optional


class Readiness(str, Enum):
    READY_FOR_EVIDENCE = "READY_FOR_EVIDENCE_CONSIDERATION"
    CONDITIONAL = "CONDITIONAL"
    EXPLORATORY = "EXPLORATORY"
    BLOCKED = "BLOCKED"


@dataclass
class IntegrityAssessment:
    analysis_id: str
    readiness: str
    integrity_score: float
    blockers: List[str]
    warnings: List[str]
    satisfied_controls: List[str]
    unsatisfied_controls: List[str]
    claim_state_allowed: List[str]
    provenance_hash: str
    version: str = "1.0"


class AnalysisIntegrityEngine:
    VERSION = "1.0"

    REQUIRED_CONTROLS = (
        "preregistration",
        "exclusion_governance",
        "multiplicity",
        "effect_uncertainty",
        "sensitivity_robustness",
        "validation_gates",
        "evidence_graph",
    )

    def assess(
        self,
        analysis_id: str,
        *,
        preregistration: Optional[Dict[str, Any]] = None,
        exclusion_governance: Optional[Dict[str, Any]] = None,
        multiplicity: Optional[Dict[str, Any]] = None,
        effect_uncertainty: Optional[Dict[str, Any]] = None,
        sensitivity_robustness: Optional[Dict[str, Any]] = None,
        validation_gates: Optional[Dict[str, Any]] = None,
        evidence_graph: Optional[Dict[str, Any]] = None,
        claim_type: str = "CANDIDATE",
    ) -> Dict[str, Any]:
        controls = {
            "preregistration": self._prereg(preregistration),
            "exclusion_governance": self._exclusion(exclusion_governance),
            "multiplicity": self._multiplicity(multiplicity),
            "effect_uncertainty": self._effect(effect_uncertainty),
            "sensitivity_robustness": self._sensitivity(sensitivity_robustness),
            "validation_gates": self._validation(validation_gates),
            "evidence_graph": self._graph(evidence_graph),
        }

        satisfied = [k for k,v in controls.items() if v["ok"]]
        unsatisfied = [k for k,v in controls.items() if not v["ok"]]
        blockers = []
        warnings = []

        for name, result in controls.items():
            blockers.extend(result.get("blockers", []))
            warnings.extend(result.get("warnings", []))

        # Conservative readiness logic:
        # all seven controls are needed for evidence consideration;
        # validation and graph support remain independent gates.
        if blockers:
            readiness = Readiness.BLOCKED.value
        elif len(satisfied) == len(self.REQUIRED_CONTROLS):
            readiness = Readiness.READY_FOR_EVIDENCE.value
        elif len(satisfied) >= 4:
            readiness = Readiness.CONDITIONAL.value
        else:
            readiness = Readiness.EXPLORATORY.value

        score = round(100.0 * len(satisfied) / len(self.REQUIRED_CONTROLS), 2)

        if readiness == Readiness.READY_FOR_EVIDENCE.value:
            allowed = ["CANDIDATE", "SUPPORTED", "CONDITIONAL"]
            # VALIDATED is never granted by this engine alone.
            warnings.append("VALIDATED requires the independent scientific validation/governance process.")
        elif readiness == Readiness.CONDITIONAL.value:
            allowed = ["CANDIDATE", "SUPPORTED", "CONDITIONAL"]
        elif readiness == Readiness.EXPLORATORY.value:
            allowed = ["CANDIDATE"]
        else:
            allowed = ["CANDIDATE"]

        payload = {
            "analysis_id": analysis_id,
            "readiness": readiness,
            "integrity_score": score,
            "blockers": blockers,
            "warnings": warnings,
            "satisfied_controls": satisfied,
            "unsatisfied_controls": unsatisfied,
            "claim_state_allowed": allowed,
            "claim_type": claim_type,
            "controls": controls,
            "version": self.VERSION,
        }
        payload["provenance_hash"] = sha256(
            json_bytes(payload)
        ).hexdigest()
        return payload

    def _present(self, obj):
        return isinstance(obj, dict) and bool(obj)

    def _prereg(self, x):
        if not self._present(x):
            return {"ok": False, "blockers": ["Missing preregistration evidence."]}
        status = str(x.get("status","")).upper()
        if status in {"LOCKED", "AMENDED_LOCKED", "REGISTERED"}:
            return {"ok": True, "blockers": [], "warnings": []}
        return {"ok": False, "blockers": ["Preregistration is not locked."]}

    def _exclusion(self, x):
        if not self._present(x):
            return {"ok": False, "blockers": ["Missing exclusion/missing-data governance record."]}
        if x.get("post_hoc_unregistered", False):
            return {"ok": False, "blockers": ["Unregistered post-hoc exclusion detected."]}
        return {"ok": True, "blockers": [], "warnings": []}

    def _multiplicity(self, x):
        if not self._present(x):
            return {"ok": False, "blockers": ["Missing multiplicity decision record."]}
        if x.get("unregistered_tests", 0):
            return {"ok": False, "blockers": ["Unregistered multiplicity detected."]}
        return {"ok": True, "blockers": [], "warnings": []}

    def _effect(self, x):
        if not self._present(x):
            return {"ok": False, "blockers": ["Missing effect-size/uncertainty evidence."]}
        if "ci" not in x and "confidence_interval" not in x:
            return {"ok": True, "blockers": [], "warnings": ["Effect size present without explicit CI field."]}
        return {"ok": True, "blockers": [], "warnings": []}

    def _sensitivity(self, x):
        if not self._present(x):
            return {"ok": False, "blockers": ["No registered sensitivity/robustness analysis."]}
        if x.get("status") == "DEVIATION":
            return {"ok": False, "blockers": ["Robustness analysis contains a declared deviation."]}
        return {"ok": True, "blockers": [], "warnings": []}

    def _validation(self, x):
        if not self._present(x):
            return {"ok": False, "blockers": ["Validation-gate assessment is absent."]}
        status = str(x.get("status","")).upper()
        if status == "BLOCKED":
            return {"ok": False, "blockers": ["Scientific validation gates are blocked."]}
        if status == "VALIDATED":
            return {"ok": True, "blockers": [], "warnings": []}
        return {"ok": True, "blockers": [], "warnings": ["Validation is conditional/partial; this does not authorize VALIDATED claims."]}

    def _graph(self, x):
        if not self._present(x):
            return {"ok": False, "blockers": ["Evidence graph state is absent."]}
        state = str(x.get("governance_state", x.get("state",""))).upper()
        if state == "BLOCKED":
            return {"ok": False, "blockers": ["Evidence graph blocks the claim."]}
        if state in {"SUPPORTED_BY_GRAPH", "SUPPORTED_EDGE_ONLY"}:
            return {"ok": True, "blockers": [], "warnings": []}
        return {"ok": False, "blockers": ["Evidence graph does not support the claim."]}


def json_bytes(obj):
    return json.dumps(obj, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
