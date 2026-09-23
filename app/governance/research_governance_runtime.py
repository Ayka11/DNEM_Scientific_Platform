"""
DNEM Scientific Research Governance Runtime v1.0
Orchestrates the executable governance chain into one reproducible decision record.
"""
from __future__ import annotations
from datetime import datetime, timezone
from hashlib import sha256
import json
from typing import Any, Dict

from app.research.analysis_integrity import AnalysisIntegrityEngine
from app.governance.scientific_decision_pipeline import ScientificDecisionPipeline
from app.governance.scientific_decision_ledger import ScientificDecisionLedger


class ResearchGovernanceRuntime:
    VERSION="1.0"

    def __init__(self, ledger: ScientificDecisionLedger|None=None):
        self.integrity=AnalysisIntegrityEngine()
        self.pipeline=ScientificDecisionPipeline()
        self.ledger=ledger or ScientificDecisionLedger()

    def execute(self, request: Dict[str,Any]) -> Dict[str,Any]:
        analysis_id=request["analysis_id"]
        claim_id=request["claim_id"]

        integrity=self.integrity.assess(
            analysis_id,
            preregistration=request.get("preregistration"),
            exclusion_governance=request.get("exclusion_governance"),
            multiplicity=request.get("multiplicity"),
            effect_uncertainty=request.get("effect_uncertainty"),
            sensitivity_robustness=request.get("sensitivity_robustness"),
            validation_gates=request.get("validation_gates"),
            evidence_graph=request.get("evidence_graph"),
            claim_type=request.get("claim_type","CANDIDATE"),
        )

        decision=self.pipeline.run(
            analysis_id, claim_id,
            integrity=integrity,
            evidence_graph=request.get("evidence_graph") or {},
            claim_governance=request.get("claim_governance") or {},
            ledger_context=request.get("ledger_context"),
        )

        ledger_record=self.ledger.append(decision)
        result={
            "runtime_version":self.VERSION,
            "timestamp":datetime.now(timezone.utc).isoformat(),
            "analysis_id":analysis_id,
            "claim_id":claim_id,
            "integrity":integrity,
            "decision":decision,
            "ledger_record":ledger_record,
        }
        result["runtime_hash"]=sha256(
            json.dumps(result,sort_keys=True,separators=(",",":"),ensure_ascii=False).encode()
        ).hexdigest()
        return result
