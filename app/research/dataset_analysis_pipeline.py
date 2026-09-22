"""
DNEM Dataset Analysis Pipeline v1.0

External/synthetic dataset -> validated trials -> measurement results ->
domain profile, with explicit source separation and deterministic provenance.
Construct estimates remain gated by ValidationGateEngine.
"""
from __future__ import annotations
from hashlib import sha256
import json
from typing import Any, Dict, List, Optional

from app.services.persistence import Persistence
from app.research.dataset_ingestion import DatasetIngestion, canonical_hash
from app.services.results_pipeline import ResultsPipeline


class DatasetAnalysisPipeline:
    VERSION="1.0"

    def __init__(self, db_path="data/dnem.sqlite3"):
        self.persistence=Persistence(db_path)
        self.ingestion=DatasetIngestion()
        self.pipeline=ResultsPipeline()

    def _analysis_hash(self, analysis):
        return sha256(
            json.dumps(analysis,sort_keys=True,separators=(",",":"),ensure_ascii=False).encode()
        ).hexdigest()

    def analyze(
        self,
        dataset_id: str,
        analysis_id: str,
        measurement_id: Optional[str]=None,
        validation_by_domain: Optional[Dict[str,Any]]=None,
    ):
        manifest=self.persistence.get_dataset_manifest(dataset_id)
        if not manifest:
            raise ValueError("dataset_not_found")

        trials=[]
        for sid in manifest["session_ids"]:
            trials.extend(self.persistence.list_trials(sid,measurement_id))

        # Keep dataset membership explicit: only records belonging to this manifest's
        # declared measurement set are allowed into the analysis.
        allowed=set(manifest["measurement_ids"])
        trials=[t for t in trials if t.get("measurement_id") in allowed]
        if measurement_id:
            trials=[t for t in trials if t.get("measurement_id")==measurement_id]

        validation=self.ingestion.validate_dataset(trials)
        if not validation["valid"]:
            raise ValueError(json.dumps(validation,ensure_ascii=False))

        measurement_results=self.pipeline.aggregate_trials(trials)
        profile=self.pipeline.domain_engine.build_profile(
            measurement_results, {}, validation_by_domain or {}
        )

        analysis={
            "analysis_id":analysis_id,
            "dataset_id":dataset_id,
            "dataset_hash":manifest["dataset_hash"],
            "source_type":manifest["source_type"],
            "measurement_id":measurement_id,
            "trial_count":len(trials),
            "valid_trial_count":sum(1 for t in trials if t.get("valid")),
            "measurement_results":measurement_results,
            "domain_profile":profile,
            "pipeline_version":self.VERSION,
            "scientific_boundary":{
                "raw_data_preserved":True,
                "construct_estimates_authorized":False,
                "integrated_profile_score_authorized":False,
                "scientific_validity_established":False,
            },
        }
        analysis["analysis_hash"]=self._analysis_hash(analysis)
        return analysis
