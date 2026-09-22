"""
DNEM Dataset Ingestion & Provenance Boundary v1.0

Separates externally supplied experimental records from deterministic synthetic
runtime records. The ingestion layer validates the Universal Trial Contract,
records source/provenance metadata, and computes a deterministic dataset hash.
It does not infer validity, reliability, causality, or construct estimates.
"""
from __future__ import annotations
from datetime import datetime, timezone
from hashlib import sha256
import json
from typing import Any, Dict, List, Optional

REQUIRED_TRIAL_FIELDS = (
    "trial_id", "session_id", "measurement_id",
    "stimulus_onset", "response", "valid"
)

ALLOWED_SOURCE_TYPES = {
    "EXTERNAL_EXPERIMENTAL",
    "SYNTHETIC_RUNTIME",
    "SIMULATED",
    "IMPORTED_RESEARCH_RECORD",
}


def canonical_hash(value: Any) -> str:
    return sha256(
        json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode()
    ).hexdigest()


class DatasetIngestion:
    VERSION = "1.0"

    def validate_trial(self, trial: Dict[str, Any]) -> Dict[str, Any]:
        missing = [k for k in REQUIRED_TRIAL_FIELDS if k not in trial]
        errors = []
        if missing:
            errors.append("missing_required_fields:" + ",".join(missing))
        if not isinstance(trial.get("trial_id"), str) or not trial.get("trial_id"):
            errors.append("trial_id_invalid")
        if not isinstance(trial.get("session_id"), str) or not trial.get("session_id"):
            errors.append("session_id_invalid")
        if not isinstance(trial.get("measurement_id"), str) or not trial.get("measurement_id"):
            errors.append("measurement_id_invalid")
        # task_id is optional at ingestion because some runtime records encode
        # the task family through measurement_id only.
        if not isinstance(trial.get("valid"), bool):
            errors.append("valid_must_be_boolean")
        return {"valid": not errors, "errors": errors}

    def validate_dataset(self, trials: List[Dict[str, Any]]) -> Dict[str, Any]:
        errors = []
        seen = set()
        for i, trial in enumerate(trials):
            result = self.validate_trial(trial)
            if not result["valid"]:
                errors.append({"index": i, "trial_id": trial.get("trial_id"), "errors": result["errors"]})
            tid = trial.get("trial_id")
            if tid in seen:
                errors.append({"index": i, "trial_id": tid, "errors": ["duplicate_trial_id"]})
            seen.add(tid)
        return {
            "valid": not errors and bool(trials),
            "trial_count": len(trials),
            "errors": errors,
        }

    def register(
        self,
        dataset_id: str,
        trials: List[Dict[str, Any]],
        source_type: str,
        source_uri: Optional[str] = None,
        acquisition_metadata: Optional[Dict[str, Any]] = None,
        protocol_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        if source_type not in ALLOWED_SOURCE_TYPES:
            raise ValueError(f"Unsupported source_type: {source_type}")
        validation = self.validate_dataset(trials)
        if not validation["valid"]:
            raise ValueError(json.dumps(validation, ensure_ascii=False))
        session_ids = sorted({t["session_id"] for t in trials})
        measurement_ids = sorted({t["measurement_id"] for t in trials})
        manifest = {
            "dataset_id": dataset_id,
            "source_type": source_type,
            "source_uri": source_uri,
            "protocol_id": protocol_id,
            "trial_count": len(trials),
            "session_ids": session_ids,
            "measurement_ids": measurement_ids,
            "acquisition_metadata": acquisition_metadata or {},
            "ingestion_version": self.VERSION,
            "ingested_at": datetime.now(timezone.utc).isoformat(),
            "validation": validation,
        }
        manifest["dataset_hash"] = canonical_hash({
            "manifest": manifest,
            "trials": trials,
        })
        manifest["scientific_boundary"] = {
            "validity_established": False,
            "reliability_established": False,
            "causality_established": False,
            "construct_inference_authorized": False,
        }
        return manifest
