"""
DNEM Analysis -> Scientific Governance Bridge v1.0

Consumes an immutable persisted analysis record and explicitly supplied
scientific-governance evidence. It never manufactures evidence from analysis
results and never authorizes VALIDATED status.
"""
from __future__ import annotations
from typing import Any, Dict, Optional
from app.services.persistence import Persistence
from app.research.analysis_provenance import AnalysisProvenance
from app.governance.unified_research_governance_runtime import UnifiedResearchGovernanceRuntime


class AnalysisGovernanceBridge:
    VERSION = "1.0"

    def __init__(self, db_path="data/dnem.sqlite3"):
        self.persistence = Persistence(db_path)
        self.provenance = AnalysisProvenance(db_path)
        self.runtime = UnifiedResearchGovernanceRuntime()

    def execute(self, request: Dict[str, Any]) -> Dict[str, Any]:
        analysis_id = request["analysis_id"]
        claim_id = request["claim_id"]
        record = self.provenance.get(analysis_id)
        if not record:
            raise ValueError("analysis_not_found")

        verification = self.provenance.verify(analysis_id)
        if not verification["valid"]:
            raise ValueError("analysis_integrity_failed")

        expected_dataset = record["dataset_id"]
        supplied_dataset = request.get("dataset_id")
        if supplied_dataset and supplied_dataset != expected_dataset:
            raise ValueError("dataset_analysis_mismatch")

        evidence_graph = request.get("evidence_graph") or {}
        # Analysis output is provenance, not evidence. Evidence must be supplied
        # explicitly by the research workflow.
        if evidence_graph.get("auto_from_analysis"):
            raise ValueError("analysis_cannot_auto_generate_evidence")

        runtime_request = dict(request)
        runtime_request["dataset_id"] = expected_dataset
        runtime_request["analysis_provenance"] = {
            "analysis_id": analysis_id,
            "dataset_id": record["dataset_id"],
            "dataset_hash": record["dataset_hash"],
            "analysis_hash": record["analysis_hash"],
            "source_type": record["source_type"],
            "pipeline_version": record["pipeline_version"],
            "integrity_verified": True,
        }
        result = self.runtime.execute(runtime_request)
        result["bridge_version"] = self.VERSION
        result["analysis_provenance"] = runtime_request["analysis_provenance"]
        result["scientific_boundary"] = {
            "analysis_integrity_verified": True,
            "evidence_must_be_explicit": True,
            "construct_inference_authorized": False,
            "integrated_profile_score_authorized": False,
            "validated_status_issued_by_bridge": False,
        }
        return result
