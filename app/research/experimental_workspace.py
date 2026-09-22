"""
DNEM Experimental Workspace v1.0

Boundary for externally supplied experimental trial records.
The workspace stores the exact trial payload plus an immutable dataset manifest.
It does not declare the data scientifically valid merely because ingestion
succeeds.
"""
from __future__ import annotations
from typing import Any, Dict, List, Optional
from app.research.dataset_ingestion import DatasetIngestion
from app.services.persistence import Persistence

class ExperimentalWorkspace:
    VERSION = "1.0"

    def __init__(self, db_path="data/dnem.sqlite3"):
        self.persistence=Persistence(db_path)
        self.ingestion=DatasetIngestion()

    def register_dataset(
        self,
        dataset_id: str,
        trials: List[Dict[str,Any]],
        source_type: str="EXTERNAL_EXPERIMENTAL",
        source_uri: Optional[str]=None,
        acquisition_metadata: Optional[Dict[str,Any]]=None,
        protocol_id: Optional[str]=None,
    ):
        if self.persistence.get_dataset_manifest(dataset_id):
            raise ValueError("dataset_id already exists; immutable datasets cannot be overwritten")
        manifest=self.ingestion.register(
            dataset_id=dataset_id,
            trials=trials,
            source_type=source_type,
            source_uri=source_uri,
            acquisition_metadata=acquisition_metadata,
            protocol_id=protocol_id,
        )
        # Preserve the exact supplied records under their existing session IDs.
        for trial in trials:
            self.persistence.save_trial(trial["session_id"], trial)
        self.persistence.save_dataset_manifest(manifest)
        return {
            "dataset_id":dataset_id,
            "manifest":manifest,
            "stored_trial_count":len(trials),
            "source":"EXPERIMENTAL_WORKSPACE",
            "scientific_boundary":manifest["scientific_boundary"],
        }

    def get_dataset(self,dataset_id):
        return self.persistence.get_dataset_manifest(dataset_id)

    def list_datasets(self):
        return self.persistence.list_dataset_manifests()
