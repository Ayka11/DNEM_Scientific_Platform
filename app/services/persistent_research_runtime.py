"""
Persistent Research Runtime v1.0
Stores actual runtime trial records and results, enabling governance to consume
persisted experiment data instead of generating new demo trials.
"""
from __future__ import annotations
from app.services.persistence import Persistence
from app.services.research_runtime import ResearchRuntime
from app.research.dataset_ingestion import DatasetIngestion

class PersistentResearchRuntime:
    def __init__(self, db_path="data/dnem.sqlite3", seed=20260922):
        self.persistence=Persistence(db_path)
        self.runtime=ResearchRuntime(seed)
        self.ingestion=DatasetIngestion()

    def run_session(self, session_id, measurement_ids, trials_per_measurement=10,
                    validation_by_domain=None):
        result=self.runtime.compile_and_run(
            measurement_ids,trials_per_measurement,validation_by_domain)
        self.persistence.save_trials(session_id,result["trials"])
        provenance = self.ingestion.register(
            dataset_id=f"RUNTIME-{session_id}",
            trials=[dict(t, session_id=session_id) for t in result["trials"]],
            source_type="SYNTHETIC_RUNTIME",
            acquisition_metadata={"seed": self.runtime.seed, "runtime_generated": True},
        )
        result["dataset_provenance"] = provenance
        for item in result["results"]:
            item["session_id"]=session_id
            self.persistence.save_result(item)
        return result

    def load_trials(self, session_id, measurement_id=None):
        return self.persistence.list_trials(session_id,measurement_id)

    def load_results(self, session_id):
        return self.persistence.list_results(session_id)
