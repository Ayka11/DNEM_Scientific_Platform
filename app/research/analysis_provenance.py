import json, hashlib, time
from app.services.persistence import Persistence
from app.research.dataset_analysis_pipeline import DatasetAnalysisPipeline

class AnalysisProvenance:
    VERSION = "1.0"
    def __init__(self, db_path="data/dnem.sqlite3"):
        self.persistence = Persistence(db_path)
        self.pipeline = DatasetAnalysisPipeline(db_path)

    @staticmethod
    def _hash(payload):
        return hashlib.sha256(json.dumps(payload, sort_keys=True, ensure_ascii=False).encode()).hexdigest()

    def run(self, dataset_id, analysis_id, measurement_id=None, validation_by_domain=None):
        existing = self.persistence.get_analysis(analysis_id)
        if existing:
            raise ValueError("analysis_id_exists")
        result = self.pipeline.analyze(dataset_id, analysis_id, measurement_id, validation_by_domain)
        record = {
            "analysis_id": analysis_id,
            "dataset_id": dataset_id,
            "dataset_hash": result["dataset_hash"],
            "source_type": result["source_type"],
            "measurement_id": result.get("measurement_id"),
            "analysis_output": result,
            "pipeline_version": result.get("pipeline_version", self.VERSION),
            "created_at": time.time(),
        }
        record["analysis_hash"] = self._hash(record)
        self.persistence.save_analysis(record)
        result["analysis_hash"] = record["analysis_hash"]
        result["provenance_status"] = "PERSISTED_IMMUTABLE_RECORD"
        return result

    def get(self, analysis_id):
        return self.persistence.get_analysis(analysis_id)

    def list(self, dataset_id=None):
        return self.persistence.list_analyses(dataset_id)

    def verify(self, analysis_id):
        record = self.get(analysis_id)
        if not record:
            raise ValueError("analysis_not_found")
        stored = record.get("analysis_hash")
        copy = dict(record)
        copy.pop("analysis_hash", None)
        expected = self._hash(copy)
        return {"analysis_id": analysis_id, "valid": stored == expected,
                "stored_hash": stored, "computed_hash": expected}
